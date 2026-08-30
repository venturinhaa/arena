// ============================================================================
// CrOptix — features/utils.js
// Shared utilities for the new feature modules (blur, fillers, calendar).
// Runs as an isolated-world content script on www.crunchyroll.com.
// Exposes everything on window.CROPTIX.
// ============================================================================
(() => {
  const ext = typeof browser !== "undefined" ? browser : chrome;
  const CROPTIX = (window.CROPTIX = window.CROPTIX || {});

  const WARNED = new Set();
  function warnOnce(key, ...args) {
    if (WARNED.has(key)) return;
    WARNED.add(key);
    console.warn(`[CrOptix] ${key}`, ...args);
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }
  function withResolvers() {
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  }
  async function mapLimit(items, limit, worker) {
    const queue = items.slice();
    const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
      while (queue.length) await worker(queue.shift());
    });
    await Promise.all(runners);
  }

  // --------------------------------------------------------------------------
  // Settings (shared with the popup)
  // --------------------------------------------------------------------------
  const DEFAULTS = {
    designEnabled: true,
    blurUnwatchedEnabled: true,
    fillerTagsEnabled: true,
    calendarEnabled: true,
  };
  const settings = { ...DEFAULTS };

  async function loadSettings() {
    try { Object.assign(settings, await ext.storage.local.get(DEFAULTS)); }
    catch (e) { warnOnce("settings", e); }
    return settings;
  }
  const getSetting = (key) => settings[key];

  function onSettingsChange(handler) {
    ext.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") return;
      let relevant = false;
      for (const [key, { newValue }] of Object.entries(changes)) {
        if (key in settings) { settings[key] = newValue; relevant = true; }
      }
      if (relevant) handler(settings);
    });
  }

  // --------------------------------------------------------------------------
  // Persistent cache (chrome.storage.local, single object, TTL per key)
  // --------------------------------------------------------------------------
  const CACHE_KEY = "croptixCache";
  const CACHE_MAX_ENTRIES = 400;
  let cacheObj = null;
  let cacheWriteTimer = null;

  async function cacheReady() {
    if (cacheObj) return cacheObj;
    try {
      cacheObj = (await ext.storage.local.get(CACHE_KEY))[CACHE_KEY] || {};
    } catch { cacheObj = {}; }
    return cacheObj;
  }

  async function cacheGet(key, maxAgeMs) {
    const store = await cacheReady();
    const entry = store[key];
    if (!entry) return null;
    if (maxAgeMs && Date.now() - entry.t > maxAgeMs) return null;
    return entry.v ?? null;
  }

  async function cacheSet(key, value) {
    const store = await cacheReady();
    store[key] = { t: Date.now(), v: value };
    // Prune oldest entries when the cache grows too big.
    const keys = Object.keys(store);
    if (keys.length > CACHE_MAX_ENTRIES) {
      keys.sort((a, b) => (store[a]?.t ?? 0) - (store[b]?.t ?? 0));
      for (const k of keys.slice(0, keys.length - CACHE_MAX_ENTRIES)) delete store[k];
    }
    clearTimeout(cacheWriteTimer);
    cacheWriteTimer = setTimeout(() => {
      try { ext.storage.local.set({ [CACHE_KEY]: store }); } catch { /* quota */ }
    }, 400);
  }

  // --------------------------------------------------------------------------
  // Crunchyroll API (same-origin, cookie auth)
  // --------------------------------------------------------------------------
  // Crunchyroll's API requires an "Authorization: Bearer" header; cookies
  // alone get 401. features/bridge-main.js (MAIN world) captures/mints the
  // token and answers requests sent via window.postMessage. If the bridge is
  // not present (other browsers/environments), we fall back to direct fetch.
  const BRIDGE_REQ = "croptix-cs-request";
  const BRIDGE_RES = "croptix-page-response";
  let bridgeState = "unknown"; // "unknown" | "ok" | "dead"
  let bridgeSeq = 0;

  function bridgeRequest(payload, timeoutMs = 15000) {
    return new Promise((resolve) => {
      const reqId = `r${++bridgeSeq}`;
      const onMessage = (event) => {
        // Same-window messages carry source === window; jsdom may leave it null.
        if (event.source != null && event.source !== window) return;
        const data = event.data;
        if (!data || typeof data !== "object" || data.source !== BRIDGE_RES || data.reqId !== reqId) return;
        cleanup();
        resolve(data);
      };
      const timer = setTimeout(() => { cleanup(); resolve(null); }, timeoutMs);
      function cleanup() {
        clearTimeout(timer);
        window.removeEventListener("message", onMessage);
      }
      window.addEventListener("message", onMessage);
      try { window.postMessage({ source: BRIDGE_REQ, reqId, ...payload }, location.origin); }
      catch { cleanup(); resolve(null); }
    });
  }

  async function crApi(path, params = {}) {
    if (bridgeState === "unknown") {
      const pong = await bridgeRequest({ path: "__ping__" }, 600);
      bridgeState = pong ? "ok" : "dead";
      if (bridgeState === "ok") warnOnce("bridge active");
    }
    if (bridgeState === "ok") {
      const res = await bridgeRequest({ path, params });
      if (res) {
        if (res.ok) return res.body;
        throw new Error(`CrOptix: Crunchyroll API ${path} → HTTP ${res.status}`);
      }
      bridgeState = "dead";
    }
    const url = new URL(path, location.origin);
    for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, v);
    const res = await fetch(url.href, {
      credentials: "same-origin",
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`CrOptix: Crunchyroll API ${url.pathname} → HTTP ${res.status}`);
    return res.json();
  }

  let accountIdPromise = null;
  function getAccountId() {
    if (!accountIdPromise) {
      accountIdPromise = crApi("/accounts/v1/me")
        .then((d) => {
          const id = d?.account_id;
          if (!id) throw new Error("CrOptix: no account_id (not logged in?)");
          return id;
        })
        .catch((e) => { accountIdPromise = null; throw e; });
    }
    return accountIdPromise;
  }

  // --------------------------------------------------------------------------
  // Object metadata (/content/v2/cms/objects) — micro-batched + memoized
  // --------------------------------------------------------------------------
  function pickThumb(images) {
    const list = images?.thumbnail;
    if (!Array.isArray(list) || !list.length) return null;
    const sorted = list.slice().sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
    // Prefer something small but not tiny.
    return (sorted.find((i) => (i.width ?? 0) >= 200) ?? sorted[0])?.source ?? null;
  }
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  function normalizeMeta(o) {
    if (!o) return null;
    const m = o.episode_metadata ?? o;
    return {
      type: o.type ?? null,
      title: o.title ?? m.title ?? null,
      seriesId: m.series_id ?? null,
      seriesTitle: m.series_title ?? null,
      seasonId: m.season_id ?? null,
      seasonTitle: m.season_title ?? null,
      seasonNumber: toNum(m.season_number),
      episodeNumber: toNum(m.episode_number ?? m.episode),
      availabilityStarts: m.availability_starts ?? o.availability_starts ?? null,
      thumb: pickThumb(o.images ?? m.images),
    };
  }

  const metaMemo = new Map();        // id -> meta|null
  const metaWaiters = new Map();     // id -> {promise, resolve}
  let metaFlushTimer = null;

  function getMeta(id) {
    id = String(id).toUpperCase();
    if (metaMemo.has(id)) return Promise.resolve(metaMemo.get(id));
    let w = metaWaiters.get(id);
    if (!w) {
      w = withResolvers();
      metaWaiters.set(id, w);
      if (metaFlushTimer == null) metaFlushTimer = setTimeout(flushMeta, 25);
    }
    return w.promise;
  }
  async function getMetas(ids) {
    await Promise.all(ids.map(getMeta));
    const out = new Map();
    for (const id of ids) out.set(String(id).toUpperCase(), metaMemo.get(String(id).toUpperCase()) ?? null);
    return out;
  }
  async function flushMeta() {
    metaFlushTimer = null;
    const ids = [...metaWaiters.keys()];
    await Promise.all(chunk(ids, 50).map(async (batch) => {
      try {
        const d = await crApi(`/content/v2/cms/objects/${batch.join(",")}`, { locale: "en-US", ratings: "false" });
        const found = new Map((d?.data ?? []).map((o) => [String(o.id).toUpperCase(), o]));
        for (const id of batch) {
          const meta = normalizeMeta(found.get(id) ?? null);
          metaMemo.set(id, meta);
          metaWaiters.get(id)?.resolve(meta);
        }
      } catch (e) {
        warnOnce("objects", e);
        for (const id of batch) {
          metaMemo.set(id, null);
          metaWaiters.get(id)?.resolve(null);
        }
      } finally {
        for (const id of batch) metaWaiters.delete(id);
      }
    }));
  }

  // --------------------------------------------------------------------------
  // Playheads (watch progress) — id -> "watched" | "unwatched"
  // --------------------------------------------------------------------------
  const PLAYHEAD_TTL = 5 * 60 * 1000;
  let playheadMemo = new Map();
  let playheadFetchAt = 0;
  const playheadWaiters = new Map();
  let playheadFlushTimer = null;
  let playheadBroken = false; // set when the endpoint fails (e.g. logged out)

  function getPlayhead(id) {
    id = String(id).toUpperCase();
    if (playheadMemo.has(id)) return Promise.resolve(playheadMemo.get(id));
    if (playheadBroken) return Promise.resolve(null);
    let w = playheadWaiters.get(id);
    if (!w) {
      w = withResolvers();
      playheadWaiters.set(id, w);
      if (playheadFlushTimer == null) playheadFlushTimer = setTimeout(flushPlayheads, 25);
    }
    return w.promise;
  }
  async function flushPlayheads() {
    playheadFlushTimer = null;
    const ids = [...playheadWaiters.keys()];
    try {
      if (Date.now() - playheadFetchAt > PLAYHEAD_TTL) {
        playheadMemo.clear();
        playheadFetchAt = Date.now();
      }
      const account = await getAccountId();
      await Promise.all(chunk(ids, 60).map(async (batch) => {
        const d = await crApi(`/content/v2/cms/playheads/${account}`, {
          content_ids: batch.join(","),
          locale: "en-US",
        });
        const byId = new Map((d?.data ?? []).map((p) => [String(p.content_id).toUpperCase(), p]));
        for (const id of batch) {
          const p = byId.get(id);
          const watched = !!(p && (p.fully_watched || Number(p.playhead) > 0));
          const value = watched ? "watched" : "unwatched";
          playheadMemo.set(id, value);
          playheadWaiters.get(id)?.resolve(value);
        }
      }));
      playheadBroken = false;
    } catch (e) {
      // Fail open: if we can't know the progress, don't blur anything.
      playheadBroken = true;
      warnOnce("playheads unavailable (not logged in?)", e);
      for (const id of ids) playheadWaiters.get(id)?.resolve(null);
    } finally {
      for (const id of ids) playheadWaiters.delete(id);
    }
  }

  // --------------------------------------------------------------------------
  // Jikan (MyAnimeList) — routed through the background worker when possible
  // --------------------------------------------------------------------------
  const JIKAN_BASE = "https://api.jikan.moe/v4";
  const jikanQueue = [];
  let jikanPumping = false;
  let jikanLastCall = 0;

  function jikan(path) {
    return new Promise((resolve) => {
      jikanQueue.push({ path, resolve });
      pumpJikan();
    });
  }
  async function pumpJikan() {
    if (jikanPumping) return;
    jikanPumping = true;
    while (jikanQueue.length) {
      const job = jikanQueue.shift();
      const wait = Math.max(0, 700 - (Date.now() - jikanLastCall));
      if (wait) await sleep(wait);
      jikanLastCall = Date.now();
      job.resolve(jikanCall(job.path, 0));
    }
    jikanPumping = false;
  }
  async function jikanCall(path, attempt) {
    let res = null;
    try { res = await ext.runtime.sendMessage({ type: "croptix-jikan", path }); }
    catch { /* no background worker — fall through to direct fetch */ }
    if (!res) {
      try {
        const r = await fetch(JIKAN_BASE + path, { headers: { accept: "application/json" } });
        res = { ok: r.ok, status: r.status, body: await r.json().catch(() => null) };
      } catch (e) {
        res = { ok: false, status: 0, body: null, error: String(e) };
      }
    }
    if (res.status === 429 && attempt < 3) {
      await sleep(1500 * (attempt + 1));
      return jikanCall(path, attempt + 1);
    }
    return res;
  }

  // ---- Fuzzy title matching (Crunchyroll title <-> MyAnimeList title) -------
  function normalizeTitle(s) {
    return String(s ?? "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  const ROMAN = { i: "1", ii: "2", iii: "3", iv: "4", v: "5", vi: "6", vii: "7", viii: "8", ix: "9", x: "10" };
  function canonicalTitle(s) {
    let t = normalizeTitle(s);
    t = t.replace(/\b(\d+)(?:st|nd|rd|th) season\b/g, "$1");
    t = t.replace(/\bseason (\d+)\b/g, "$1");
    t = t.replace(/\bpart (\d+)\b/g, "$1");
    t = t.replace(/\b(ii|iii|iv|v|vi|vii|viii|ix|x)\b/g, (m) => ROMAN[m]);
    t = t.replace(/\b(tv|anime|the|a|an)\b/g, " ");
    return t.replace(/\s+/g, " ").trim();
  }
  function titleScore(a, b) {
    const x = canonicalTitle(a);
    const y = canonicalTitle(b);
    if (!x || !y) return 0;
    if (x === y) return 1;
    if (x.startsWith(y) || y.startsWith(x)) return 0.9 - Math.abs(x.length - y.length) / 200;
    const xs = new Set(x.split(" "));
    const ys = new Set(y.split(" "));
    let inter = 0;
    for (const tok of xs) if (ys.has(tok)) inter++;
    return inter / (xs.size + ys.size - inter);
  }

  /**
   * Look up filler/recap flags for a season.
   * Returns { status: "ok"|"none", fillers: {episodeNumber: "filler"|"recap"}, matched? }
   */
  async function lookupFillers({ seriesTitle, seasonTitle, seasonNumber }) {
    const empty = { status: "none", fillers: {} };
    const queries = [];
    if (seasonTitle) queries.push(seasonTitle);
    if (seriesTitle && seriesTitle !== seasonTitle) queries.push(seriesTitle);

    for (const q of queries) {
      const res = await jikan(`/anime?q=${encodeURIComponent(q)}&limit=8&sfw=true`);
      if (!res?.ok) continue;
      const candidates = res.body?.data ?? [];
      let best = null;
      let bestScore = 0;
      for (const c of candidates) {
        const type = String(c.type ?? "").toUpperCase();
        if (type !== "TV" && type !== "ONA") continue;
        const s = Math.max(
          titleScore(c.title, q),
          titleScore(c.title_english, q),
          titleScore(c.title, seasonTitle || seriesTitle || ""),
          titleScore(c.title_english, seasonTitle || seriesTitle || ""),
        );
        // Prefer candidates that agree with the season number.
        const bonus = seasonNumber > 1 && s >= 0.8 ? 0.02 : 0;
        if (s + bonus > bestScore) { bestScore = s + bonus; best = c; }
      }
      if (!best || bestScore < 0.55) continue;

      const fillers = {};
      for (let page = 1; page <= 4; page++) {
        const eps = await jikan(`/anime/${best.mal_id}/episodes?page=${page}`);
        if (!eps?.ok) break;
        for (const e of eps.body?.data ?? []) {
          const n = Number(e.mal_id);
          if (!Number.isFinite(n)) continue;
          if (e.filler) fillers[n] = "filler";
          else if (e.recap) fillers[n] = "recap";
        }
        if (!eps.body?.pagination?.has_next_page) break;
      }
      return {
        status: Object.keys(fillers).length ? "ok" : "none",
        fillers,
        matched: best.title,
        score: Math.round(bestScore * 100) / 100,
      };
    }
    return empty;
  }

  // --------------------------------------------------------------------------
  // DOM: episode card scanning & decoration
  // --------------------------------------------------------------------------
  const WATCH_ID_RE = /\/watch\/([a-z0-9]+)/i;

  function scanEpisodeAnchors() {
    const map = new Map(); // episodeId -> Set<anchor>
    for (const a of document.querySelectorAll('a[href*="/watch/"]')) {
      const m = WATCH_ID_RE.exec(a.getAttribute("href") || "");
      if (!m) continue;
      const id = m[1].toUpperCase();
      a.dataset.croptixId = id;
      if (!map.has(id)) map.set(id, new Set());
      map.get(id).add(a);
    }
    return map;
  }

  // The smallest ancestor that contains only this episode's anchors = the card.
  function cardContainer(anchor) {
    let el = anchor;
    let best = anchor;
    while (el && el !== document.body) {
      const ids = new Set(
        [...el.querySelectorAll("a[data-croptix-id]")].map((a) => a.dataset.croptixId),
      );
      if (ids.size > 1) break;
      best = el;
      el = el.parentElement;
    }
    return best;
  }

  function thumbAnchor(anchors) {
    for (const a of anchors) if (a.querySelector("img")) return a;
    return null;
  }

  // --------------------------------------------------------------------------
  // Page change notifications (SPA-friendly MutationObserver)
  // --------------------------------------------------------------------------
  const pageListeners = new Set();
  let scanTimer = null;

  function onPage(fn) {
    pageListeners.add(fn);
    // Give new listeners their current state immediately.
    Promise.resolve().then(() => runScan());
  }

  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(runScan, 300);
  }

  async function runScan() {
    const anchors = scanEpisodeAnchors();
    for (const fn of pageListeners) {
      try { fn(anchors); } catch (e) { warnOnce("feature error", e); }
    }
  }

  function startObserver() {
    new MutationObserver(scheduleScan).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", scheduleScan);
    } else {
      scheduleScan();
    }
  }

  // --------------------------------------------------------------------------
  // Export
  // --------------------------------------------------------------------------
  Object.assign(CROPTIX, {
    ext,
    VERSION: "2.1.1",
    // settings
    loadSettings,
    getSetting,
    onSettingsChange,
    // cache
    cacheGet,
    cacheSet,
    // crunchyroll api
    crApi,
    getAccountId,
    getMetas,
    getPlayhead,
    // anilist-style helpers
    jikan,
    lookupFillers,
    // dom
    onPage,
    scanEpisodeAnchors,
    cardContainer,
    thumbAnchor,
    // misc
    sleep,
    mapLimit,
    warnOnce,
  });

  loadSettings().then(() => {
    startObserver();
    onSettingsChange(() => scheduleScan());
    console.info(`[CrOptix] features v${CROPTIX.VERSION} ready`);
  });
})();
