// ============================================================================
// CrOptix — features/calendar.js
// Floating button + panel with a release calendar built from the user's
// Crunchyroll watchlist ("My List"): seasons of each listed series are fetched
// and episodes with a future availability date are placed on a month calendar.
// ============================================================================
(() => {
  const C = window.CROPTIX;
  if (!C) return;

  const CALENDAR_TTL = 10 * 60 * 1000; // 10 minutes
  const RECENT_WINDOW = 36 * 60 * 60 * 1000; // keep releases from the last 36h
  const AHEAD_WINDOW = 60 * 24 * 60 * 60 * 1000; // look up to 60 days ahead

  // --------------------------------------------------------------------------
  // State & DOM
  // --------------------------------------------------------------------------
  let fab = null;
  let panel = null;
  let items = null;      // entry[] | null
  let loadError = null;
  let loading = false;
  let view = { y: 0, m: 0 };

  const pad = (n) => String(n).padStart(2, "0");
  const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const FAB_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"/></svg>`;

  function ensureUi() {
    if (fab) return;
    fab = document.createElement("button");
    fab.id = "croptix-cal-fab";
    fab.className = "croptix-hidden";
    fab.title = "CrOptix — Release Calendar";
    fab.setAttribute("aria-label", "Release Calendar");
    fab.innerHTML = FAB_SVG;
    fab.addEventListener("click", () => togglePanel());
    document.body.appendChild(fab);

    panel = document.createElement("div");
    panel.id = "croptix-cal-panel";
    panel.className = "croptix-hidden";
    panel.innerHTML = `
      <div class="croptix-cal-head">
        <div class="croptix-cal-title">Release Calendar</div>
        <div class="croptix-cal-nav">
          <button type="button" data-nav="prev" aria-label="Previous month">‹</button>
          <span class="croptix-cal-month"></span>
          <button type="button" data-nav="next" aria-label="Next month">›</button>
        </div>
        <div class="croptix-cal-actions">
          <button type="button" data-act="refresh" aria-label="Refresh">⟳</button>
          <button type="button" data-act="close" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="croptix-cal-body">
        <div class="croptix-cal-grid"></div>
        <div class="croptix-cal-list"></div>
      </div>`;
    document.body.appendChild(panel);

    panel.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-nav]");
      if (nav) {
        const d = new Date(view.y, view.m + (nav.dataset.nav === "next" ? 1 : -1), 1);
        view = { y: d.getFullYear(), m: d.getMonth() };
        render();
        return;
      }
      if (e.target.closest('[data-act="close"]')) return closePanel();
      if (e.target.closest('[data-act="refresh"]')) return refresh();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePanel();
    });
  }

  function togglePanel() {
    ensureUi();
    if (panel.classList.contains("croptix-hidden")) openPanel();
    else closePanel();
  }
  function openPanel() {
    const now = new Date();
    view = { y: now.getFullYear(), m: now.getMonth() };
    panel.classList.remove("croptix-hidden");
    fab.classList.add("croptix-fab-active");
    if (!items && !loadError && !loading) refresh();
    else render();
  }
  function closePanel() {
    panel.classList.add("croptix-hidden");
    fab.classList.remove("croptix-fab-active");
  }

  async function refresh() {
    loading = true;
    loadError = null;
    renderLoading();
    try {
      const data = await C.cacheGet("calendar", CALENDAR_TTL);
      if (data) items = data;
      else {
        items = await fetchCalendar();
        C.cacheSet("calendar", items);
      }
    } catch (e) {
      loadError = e;
    } finally {
      loading = false;
      render();
    }
  }

  // --------------------------------------------------------------------------
  // Data loading
  // --------------------------------------------------------------------------
  async function fetchCalendar() {
    const account = (await C.crApi("/accounts/v1/me")).account_id;

    // 1. Watchlist (paginate defensively; stop when a page adds nothing new).
    const panels = [];
    const seen = new Set();
    for (let page = 0; page < 10; page++) {
      const params = { locale: "en-US" };
      if (page > 0) params.page = page;
      const d = await C.crApi(`/content/v2/discover/${account}/watchlist`, params);
      const data = d?.data ?? [];
      let added = 0;
      for (const item of data) {
        const key = item?.list_item_id ?? item?.panel?.id;
        if (!key || seen.has(key)) continue;
        seen.add(key);
        if (item?.panel?.type === "series" || item?.panel?.type === "season") {
          panels.push(item.panel);
          added++;
        }
      }
      if (!data.length || !added) break;
      if (d?.total != null && seen.size >= d.total) break;
    }

    // 2. Episodes of the latest seasons of each listed show.
    const now = Date.now();
    const lo = now - RECENT_WINDOW;
    const hi = now + AHEAD_WINDOW;
    const entries = [];
    const seenEp = new Set();

    await C.mapLimit(panels, 5, async (panel) => {
      try {
        let seasons = [];
        if (panel.type === "season") {
          seasons = [{ id: panel.id }];
        } else {
          const s = await C.crApi(`/content/v2/cms/series/${panel.id}/seasons`, { locale: "en-US" });
          seasons = (s?.data ?? [])
            .slice()
            .sort((a, b) => (b.season_number ?? 0) - (a.season_number ?? 0))
            .slice(0, 3);
        }
        for (const season of seasons) {
          const eps = await C.crApi(`/content/v2/cms/seasons/${season.id}/episodes`, { locale: "en-US" });
          for (const ep of eps?.data ?? []) {
            const startsAt = ep.availability_starts ? Date.parse(ep.availability_starts) : NaN;
            if (!Number.isFinite(startsAt) || startsAt < lo || startsAt > hi) continue;
            const id = String(ep.id ?? "").toUpperCase();
            if (!id || seenEp.has(id)) continue;
            seenEp.add(id);
            const seriesId = ep.series_id ?? (panel.type === "series" ? panel.id : null);
            entries.push({
              epId: id,
              seriesId,
              seriesTitle: ep.series_title ?? panel.title ?? "Unknown series",
              seasonTitle: ep.season_title ?? season.title ?? "",
              epNum: Number(ep.episode_number ?? ep.episode) || null,
              title: ep.title ?? "",
              startsAt,
              thumb: pickThumb(ep.images),
              released: startsAt <= now,
            });
          }
        }
      } catch (e) {
        C.warnOnce(`calendar: failed to load "${panel.title ?? panel.id}"`, e);
      }
    });

    entries.sort((a, b) => a.startsAt - b.startsAt);
    return entries;
  }

  function pickThumb(images) {
    const list = images?.thumbnail;
    if (!Array.isArray(list) || !list.length) return null;
    const sorted = list.slice().sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
    return (sorted.find((i) => (i.width ?? 0) >= 200) ?? sorted[0])?.source ?? null;
  }

  // --------------------------------------------------------------------------
  // Rendering
  // --------------------------------------------------------------------------
  const gridEl = () => panel.querySelector(".croptix-cal-grid");
  const listEl = () => panel.querySelector(".croptix-cal-list");
  const monthEl = () => panel.querySelector(".croptix-cal-month");

  function renderLoading() {
    monthEl().textContent = "…";
    gridEl().innerHTML = "";
    listEl().innerHTML = `<div class="croptix-cal-empty">Loading your list…</div>`;
  }

  function render() {
    if (!panel) return;
    const now = new Date();
    const viewDate = new Date(view.y, view.m, 1);
    monthEl().textContent = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    renderGrid(now);
    renderList(now);
  }

  function renderGrid(now) {
    const grid = gridEl();
    grid.innerHTML = "";
    const byDay = new Map();
    for (const item of items ?? []) {
      const d = new Date(item.startsAt);
      if (d.getFullYear() === view.y && d.getMonth() === view.m) {
        if (!byDay.has(d.getDate())) byDay.set(d.getDate(), 0);
        byDay.set(d.getDate(), byDay.get(d.getDate()) + 1);
      }
    }
    for (const label of ["M", "T", "W", "T", "F", "S", "S"]) {
      const wd = document.createElement("span");
      wd.className = "croptix-cal-wd";
      wd.textContent = label;
      grid.appendChild(wd);
    }
    const startWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Monday first
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    for (let i = 0; i < startWeekday; i++) grid.appendChild(document.createElement("span"));
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("span");
      cell.className = "croptix-cal-day";
      const isToday =
        day === now.getDate() && view.m === now.getMonth() && view.y === now.getFullYear();
      if (isToday) cell.classList.add("croptix-today");
      cell.textContent = day;
      const count = byDay.get(day) ?? 0;
      if (count) {
        cell.classList.add("croptix-has-ep");
        cell.title = `${count} release${count > 1 ? "s" : ""}`;
        const dots = document.createElement("i");
        dots.className = "croptix-cal-dots";
        grid.appendChild(cell);
        cell.appendChild(dots);
        continue;
      }
      grid.appendChild(cell);
    }
  }

  function renderList(now) {
    const list = listEl();
    list.innerHTML = "";
    if (loadError) {
      const box = document.createElement("div");
      box.className = "croptix-cal-empty";
      const loggedOut = String(loadError?.message || "").includes("401");
      box.textContent = loggedOut
        ? "Couldn't load your list — make sure you're logged in to Crunchyroll."
        : "Couldn't load your list. Try again in a moment.";
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "croptix-cal-retry";
      retry.textContent = "Retry";
      retry.addEventListener("click", refresh);
      box.appendChild(retry);
      list.appendChild(box);
      return;
    }
    if (!items) return;
    const monthItems = items.filter((it) => {
      const d = new Date(it.startsAt);
      return d.getFullYear() === view.y && d.getMonth() === view.m;
    });
    if (!monthItems.length) {
      const empty = document.createElement("div");
      empty.className = "croptix-cal-empty";
      empty.textContent = items.length
        ? "No releases in this month for the shows on your list."
        : "No upcoming releases found for the shows on your list (next 60 days).";
      list.appendChild(empty);
      return;
    }
    const groups = new Map();
    for (const it of monthItems) {
      const key = dayKey(new Date(it.startsAt));
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(it);
    }
    for (const [key, group] of groups) {
      const date = new Date(group[0].startsAt);
      const header = document.createElement("div");
      header.className = "croptix-cal-day-header";
      if (dayKey(date) === dayKey(now)) header.classList.add("croptix-today");
      header.textContent = date.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "short",
      });
      list.appendChild(header);
      for (const item of group) list.appendChild(renderRow(item, now));
    }
  }

  function renderRow(item, now) {
    const row = document.createElement("a");
    row.className = "croptix-cal-row";
    if (!item.released) row.classList.add("croptix-cal-upcoming");
    row.href = item.released && item.epId
      ? `/watch/${item.epId}`
      : item.seriesId ? `/series/${item.seriesId}` : "#";

    if (item.thumb) {
      const img = document.createElement("img");
      img.className = "croptix-cal-thumb";
      img.loading = "lazy";
      img.src = item.thumb;
      img.alt = "";
      row.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "croptix-cal-thumb croptix-cal-thumb-ph";
      row.appendChild(ph);
    }

    const info = document.createElement("div");
    info.className = "croptix-cal-info";

    const top = document.createElement("div");
    top.className = "croptix-cal-row-top";
    const time = document.createElement("span");
    time.className = "croptix-cal-time";
    time.textContent = new Date(item.startsAt).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    top.appendChild(time);
    if (item.epNum != null) {
      const ep = document.createElement("span");
      ep.className = "croptix-cal-ep";
      ep.textContent = `EP ${item.epNum}`;
      top.appendChild(ep);
    }
    const status = document.createElement("span");
    status.className = "croptix-cal-status";
    status.textContent = item.released ? "Available" : "Upcoming";
    top.appendChild(status);
    info.appendChild(top);

    const series = document.createElement("div");
    series.className = "croptix-cal-series";
    series.textContent = item.seriesTitle;
    info.appendChild(series);

    if (item.title) {
      const title = document.createElement("div");
      title.className = "croptix-cal-ep-title";
      title.textContent = item.title;
      info.appendChild(title);
    }

    row.appendChild(info);
    return row;
  }

  // --------------------------------------------------------------------------
  // Visibility
  // --------------------------------------------------------------------------
  function updateVisibility() {
    ensureUi();
    const enabled = C.getSetting("calendarEnabled");
    const onWatchPage = /^\/(?:[a-z-]+\/)?watch\//.test(location.pathname);
    fab.classList.toggle("croptix-hidden", !enabled || onWatchPage);
    if (!enabled || onWatchPage) closePanel();
  }

  C.onPage(() => updateVisibility());
  C.loadSettings().then(updateVisibility);
})();
