// Smoke test: loads the CrOptix feature modules inside jsdom with mocked
// Crunchyroll + Jikan APIs and asserts the three features behave correctly.
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const EXT = "/home/user/arena/extension";
const read = (p) => fs.readFileSync(path.join(EXT, p), "utf8");

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const EPS = [
  { id: "GREP1", ep: 1, filler: false, watched: "full", avail: now - 30 * DAY },
  { id: "GREP2", ep: 2, filler: false, watched: "partial", avail: now - 23 * DAY },
  { id: "GREP3", ep: 3, filler: false, watched: null, avail: now - 16 * DAY },
  { id: "GREP4", ep: 4, filler: true, watched: null, avail: now - 9 * DAY },
  { id: "GREP5", ep: 5, filler: false, watched: null, avail: now + 3 * DAY }, // upcoming
];

const SERIES = { id: "GYTEST1", title: "Test Anime", seasonId: "G1S1", seasonTitle: "Test Anime" };

function episodeObject(e) {
  return {
    id: e.id,
    type: "episode",
    title: `Episode ${e.ep}`,
    episode_metadata: {
      series_id: SERIES.id,
      series_title: SERIES.title,
      season_id: SERIES.seasonId,
      season_title: SERIES.seasonTitle,
      season_number: 1,
      episode_number: e.ep,
      availability_starts: new Date(e.avail).toISOString(),
    },
    images: { thumbnail: [{ width: 400, height: 225, source: `http://img/${e.ep}.jpg` }] },
  };
}

const storage = new Map();
const chromeStub = {
  storage: {
    local: {
      get: async (keys) => {
        const out = {};
        if (Array.isArray(keys)) for (const k of keys) out[k] = storage.get(k);
        else if (keys && typeof keys === "object") for (const k of Object.keys(keys)) out[k] = storage.has(k) ? storage.get(k) : keys[k];
        else out[keys] = storage.get(keys);
        return out;
      },
      set: async (obj) => { for (const [k, v] of Object.entries(obj)) storage.set(k, v); },
    },
    onChanged: { addListener: () => {} },
  },
  runtime: {
    sendMessage: async (msg) => {
      if (msg?.type !== "croptix-jikan") return null;
      const p = msg.path;
      if (p.startsWith("/anime?q=")) {
        return { ok: true, status: 200, body: { data: [{ mal_id: 99, title: "Test Anime", title_english: "Test Anime", type: "TV" }] } };
      }
      if (p.startsWith("/anime/99/episodes")) {
        return {
          ok: true, status: 200,
          body: {
            data: EPS.filter((e) => e.avail < now).map((e) => ({ mal_id: e.ep, filler: e.filler, recap: false })),
            pagination: { has_next_page: false },
          },
        };
      }
      return { ok: false, status: 404, body: null };
    },
  },
};

// Calendar releases (separate from the card episodes on purpose).
// Deterministic regardless of today's date: one released 6h ago (current
// month), two upcoming early next month.
const NOW = new Date();
const NEXT_M = new Date(NOW.getFullYear(), NOW.getMonth() + 1, 2, 12, 0, 0);
const NEXT_M2 = new Date(NOW.getFullYear(), NOW.getMonth() + 1, 9, 18, 30, 0);
const CAL_EPS = [
  { id: "GREP4", ep: 4, avail: now - 6 * 60 * 60 * 1000 },
  { id: "GREP5", ep: 5, avail: NEXT_M.getTime() },
  { id: "GREP6", ep: 6, avail: NEXT_M2.getTime() },
];

async function mockFetch(input) {
  const href = String(input);
  const u = new URL(href);
  const j = (body) => ({ ok: true, status: 200, json: async () => body, headers: new Headers() });
  if (u.pathname === "/accounts/v1/me") return j({ account_id: "ACC1" });
  if (u.pathname.startsWith("/content/v2/cms/objects/")) {
    const ids = u.pathname.split("/").pop().split(",");
    const data = [];
    for (const id of ids) {
      const ep = EPS.find((e) => e.id === id.toUpperCase());
      if (ep) data.push(episodeObject(ep));
      else if (id.toUpperCase() === SERIES.id) data.push({ id: SERIES.id, type: "series", title: SERIES.title });
    }
    return j({ total: data.length, data });
  }
  if (u.pathname.startsWith("/content/v2/cms/playheads/")) {
    const data = EPS.filter((e) => e.watched).map((e) => ({
      content_id: e.id,
      playhead: e.watched === "full" ? 900 : 100,
      fully_watched: e.watched === "full",
    }));
    return j({ total: data.length, data });
  }
  if (u.pathname === `/content/v2/discover/ACC1/watchlist`) {
    return j({ total: 1, data: [{ list_item_id: "li1", panel: { id: SERIES.id, type: "series", title: SERIES.title } }] });
  }
  if (u.pathname === `/content/v2/cms/series/${SERIES.id}/seasons`) {
    return j({ data: [{ id: SERIES.seasonId, title: SERIES.seasonTitle, season_number: 1 }] });
  }
  if (u.pathname === `/content/v2/cms/seasons/${SERIES.seasonId}/episodes`) {
    return j({
      data: CAL_EPS.map((e) => ({
        id: e.id,
        series_id: SERIES.id,
        series_title: SERIES.title,
        season_title: SERIES.seasonTitle,
        episode_number: e.ep,
        title: `Episode ${e.ep}`,
        availability_starts: new Date(e.avail).toISOString(),
        images: { thumbnail: [{ width: 400, height: 225, source: `http://img/${e.ep}.jpg` }] },
      })),
    });
  }
  return { ok: false, status: 404, json: async () => ({}), headers: new Headers() };
}

// ---------------------------------------------------------------------------
// DOM: fake Crunchyroll series page
// ---------------------------------------------------------------------------
function buildSeriesPage(css) {
  const cards = EPS.map((e) => `
    <article class="episode-card" id="card-${e.id}">
      <a class="thumb" href="/watch/${e.id}"><img src="thumb.jpg"/></a>
      <div class="meta"><a href="/watch/${e.id}">EP ${e.ep}</a></div>
    </article>`).join("");
  return `<!doctype html><html><head><title>Test Anime</title><style>${css}</style></head>
    <body><main><h1>Test Anime</h1><div id="list">${cards}</div></main></body></html>`;
}

function buildWatchPage(id) {
  return `<!doctype html><html><head><title>Watch</title></head>
    <body><main><h1 id="title">Episode</h1><div class="player"></div></main></body></html>`;
}

async function runScripts(dom) {
  const w = dom.window;
  w.chrome = chromeStub;
  w.fetch = mockFetch;
  w.eval(read("features/utils.js"));
  w.eval(read("features/blur.js"));
  w.eval(read("features/fillers.js"));
  w.eval(read("features/calendar.js"));
  await new Promise((r) => setTimeout(r, 900)); // let initial scan + async work settle
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
function check(name, cond) {
  console.log(`${cond ? "✅" : "❌"} ${name}`);
  if (!cond) failures++;
}

// ---------------------------------------------------------------------------
// Test 1: series page (blur + fillers + toolbar)
// ---------------------------------------------------------------------------
(async () => {
  {
    const css = read("css/croptix-features.css");
    const dom = new JSDOM(buildSeriesPage(css), { url: "https://www.crunchyroll.com/series/GYTEST1", runScripts: "outside-only", pretendToBeVisual: true });
    await runScripts(dom);
    const d = dom.window.document;
    await sleep(600); // extra wait for debounced scans / jikan queue

    const thumb = (id) => d.querySelector(`#card-${id} a.thumb`);
    check("blur: unwatched EP3 blurred", thumb("GREP3").classList.contains("croptix-blur-ep"));
    check("blur: unwatched filler EP4 blurred", thumb("GREP4").classList.contains("croptix-blur-ep"));
    check("blur: fully watched EP1 NOT blurred", !thumb("GREP1").classList.contains("croptix-blur-ep"));
    check("blur: partially watched EP2 NOT blurred", !thumb("GREP2").classList.contains("croptix-blur-ep"));
    check("blur: upcoming EP5 NOT blurred", !thumb("GREP5").classList.contains("croptix-blur-ep"));

    const chip = thumb("GREP4").querySelector(".croptix-fill-chip");
    check("filler: EP4 has Filler chip", !!chip && chip.dataset.fill === "filler" && chip.textContent === "Filler");
    check("filler: EP1 has no chip", !thumb("GREP1").querySelector(".croptix-fill-chip"));

    const toolbar = d.querySelector("#list").previousElementSibling;
    check("filler: toolbar inserted before list", !!toolbar && toolbar.classList.contains("croptix-fill-toolbar"));
    check("filler: toolbar has 4 buttons", !!toolbar && toolbar.querySelectorAll("button").length === 4);
    if (toolbar) {
      toolbar.querySelector('[data-mode="filler"]').click();
      check("filler: filter mode applied to list parent", d.querySelector("#list").dataset.croptixFilter === "filler");
      check("filler: filter hides non-filler cards", d.defaultView.getComputedStyle(d.querySelector("#card-GREP1")).display === "none");
      toolbar.querySelector('[data-mode="all"]').click();
      check("filler: filter all shows cards again", d.defaultView.getComputedStyle(d.querySelector("#card-GREP1")).display !== "none");
    }

    const fab = d.querySelector("#croptix-cal-fab");
    check("calendar: FAB exists", !!fab);
    fab.click();
    await sleep(1200);
    const panel = d.querySelector("#croptix-cal-panel");
    check("calendar: panel opens", !!panel && !panel.classList.contains("croptix-hidden"));
    const rows = panel.querySelectorAll(".croptix-cal-row");
    check("calendar: 1 release row this month (released 6h ago)", rows.length === 1);
    check("calendar: released row links to watch page", rows[0]?.getAttribute("href") === "/watch/GREP4");
    check("calendar: grid has day marker this month", panel.querySelectorAll(".croptix-cal-day.croptix-has-ep").length === 1);

    // Navigate to next month → the two upcoming releases
    panel.querySelector('[data-nav="next"]').click();
    await sleep(300);
    const rows2 = panel.querySelectorAll(".croptix-cal-row");
    check("calendar: 2 upcoming rows next month", rows2.length === 2);
    check("calendar: upcoming rows are marked", panel.querySelectorAll(".croptix-cal-row.croptix-cal-upcoming").length === 2);
    check("calendar: upcoming row links to series page", panel.querySelector(".croptix-cal-upcoming")?.getAttribute("href") === "/series/GYTEST1");
    check("calendar: grid markers next month", panel.querySelectorAll(".croptix-cal-day.croptix-has-ep").length === 2);
    dom.window.close();
  }

  // ---------------------------------------------------------------------------
  // Test 2: watch page filler flag
  // ---------------------------------------------------------------------------
  {
    const dom = new JSDOM(buildWatchPage(), { url: "https://www.crunchyroll.com/watch/GREP4", runScripts: "outside-only", pretendToBeVisual: true });
    await runScripts(dom);
    const d = dom.window.document;
    await sleep(800);
    const flag = d.querySelector("#croptix-watch-fill-flag");
    check("watch: filler flag shown for filler episode", !!flag && /Filler/.test(flag.textContent));
    dom.window.close();
  }

  console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL TESTS PASSED");
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
