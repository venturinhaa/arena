// ============================================================================
// CrOptix — features/fillers.js
// Marks filler/recap episodes on Crunchyroll:
//   • badge on episode card thumbnails
//   • a filter toolbar (All / Canon / Fillers / Recaps) on series pages
//   • a "filler episode" flag on the watch page
// Data comes from MyAnimeList through the Jikan API (cached for a week).
// ============================================================================
(() => {
  const C = window.CROPTIX;
  if (!C) return;

  const FILLER_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week
  const fillerMemo = new Map();     // key -> promise<result>
  const seriesTitleMemo = new Map();

  async function getSeriesTitle(seriesId) {
    if (!seriesId) return null;
    if (seriesTitleMemo.has(seriesId)) return seriesTitleMemo.get(seriesId);
    let title = null;
    try {
      const metas = await C.getMetas([seriesId]);
      title = metas.get(seriesId)?.title ?? null;
    } catch { /* keep null */ }
    seriesTitleMemo.set(seriesId, title);
    return title;
  }

  function getFillerInfo(meta) {
    const key = meta.seasonId || `${meta.seriesId ?? "?"}#${meta.seasonNumber ?? 0}`;
    if (!fillerMemo.has(key)) {
      fillerMemo.set(key, (async () => {
        try {
          const cached = await C.cacheGet(`filler:${key}`, FILLER_TTL);
          if (cached) return cached;
          const seriesTitle = meta.seriesTitle ?? (await getSeriesTitle(meta.seriesId));
          const result = await C.lookupFillers({
            seriesTitle,
            seasonTitle: meta.seasonTitle,
            seasonNumber: meta.seasonNumber ?? 0,
          });
          C.cacheSet(`filler:${key}`, result);
          return result;
        } catch (e) {
          C.warnOnce("filler lookup failed", e);
          return { status: "none", fillers: {} };
        }
      })());
    }
    return fillerMemo.get(key);
  }

  // --------------------------------------------------------------------------
  // Decoration
  // --------------------------------------------------------------------------
  function statusFor(info, meta) {
    if (!info || info.status !== "ok") return "unknown";
    const n = meta.episodeNumber;
    if (n == null) return "unknown";
    return info.fillers[n] ?? "canon";
  }

  function applyChip(thumb, status) {
    const existing = thumb.querySelector(".croptix-fill-chip");
    if (status !== "filler" && status !== "recap") {
      existing?.remove();
      return;
    }
    const chip = existing ?? document.createElement("span");
    chip.className = "croptix-fill-chip";
    chip.dataset.fill = status;
    chip.textContent = status === "filler" ? "Filler" : "Recap";
    if (!existing) thumb.appendChild(chip);
  }

  function decorate(anchors, status) {
    const thumb = C.thumbAnchor(anchors);
    if (thumb) applyChip(thumb, status);
    for (const a of anchors) a.dataset.croptixFill = status;
    const container = C.cardContainer(thumb ?? [...anchors][0]);
    if (container) container.dataset.croptixFill = status;
  }

  // --------------------------------------------------------------------------
  // Filter toolbar (series / season pages)
  // --------------------------------------------------------------------------
  const toolbarByParent = new WeakMap();

  function buildToolbars(anchorMap) {
    if (!/\/series\//.test(location.pathname)) return;

    // Group decorated card containers by their parent.
    const byParent = new Map();
    for (const anchors of anchorMap.values()) {
      const first = [...anchors][0];
      if (!first) continue;
      const container = C.cardContainer(C.thumbAnchor(anchors) ?? first);
      if (!container || !container.dataset.croptixFill) continue;
      const parent = container.parentElement;
      if (!parent || parent === document.body) continue;
      if (!byParent.has(parent)) byParent.set(parent, new Set());
      byParent.get(parent).add(container);
    }

    for (const [parent, containers] of byParent) {
      if (containers.size < 4) continue;
      const existing = toolbarByParent.get(parent);
      if (existing?.isConnected) continue;
      const toolbar = document.createElement("div");
      toolbar.className = "croptix-fill-toolbar";
      toolbar.innerHTML = `
          <span class="croptix-fill-toolbar-label">Episode filter</span>
          <button type="button" data-mode="all" class="croptix-active">All</button>
          <button type="button" data-mode="canon">Canon</button>
          <button type="button" data-mode="filler">Fillers</button>
          <button type="button" data-mode="recap">Recaps</button>`;
      parent.insertAdjacentElement("beforebegin", toolbar);
      toolbarByParent.set(parent, toolbar);
      toolbar.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-mode]");
        if (!btn) return;
        parent.dataset.croptixFilter = btn.dataset.mode;
        for (const b of toolbar.querySelectorAll("button")) {
          b.classList.toggle("croptix-active", b === btn);
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // Watch page flag
  // --------------------------------------------------------------------------
  async function updateWatchFlag() {
    const existing = document.getElementById("croptix-watch-fill-flag");
    const m = /^(?:\/[a-z-]+)?\/watch\/([a-z0-9]+)/i.exec(location.pathname);
    if (!m || !C.getSetting("fillerTagsEnabled")) {
      existing?.remove();
      return;
    }
    const episodeId = m[1].toUpperCase();
    if (existing && existing.dataset.epId === episodeId) return;
    existing?.remove();

    const metas = await C.getMetas([episodeId]);
    const meta = metas.get(episodeId);
    if (!meta || meta.type !== "episode") return;
    const info = await getFillerInfo(meta);
    const status = statusFor(info, meta);
    if (status !== "filler" && status !== "recap") return;

    const h1 = document.querySelector("h1");
    if (!h1) return;
    const flag = document.createElement("div");
    flag.id = "croptix-watch-fill-flag";
    flag.dataset.epId = episodeId;
    flag.dataset.fill = status;
    flag.textContent = status === "filler"
      ? "⚠ Filler episode — skippable in most cases"
      : "⚠ Recap episode";
    h1.insertAdjacentElement("beforebegin", flag);
  }

  // --------------------------------------------------------------------------
  // Main
  // --------------------------------------------------------------------------
  function clearAll() {
    for (const chip of document.querySelectorAll(".croptix-fill-chip")) chip.remove();
    for (const tb of document.querySelectorAll(".croptix-fill-toolbar")) tb.remove();
    document.getElementById("croptix-watch-fill-flag")?.remove();
    for (const el of document.querySelectorAll("[data-croptix-fill]")) delete el.dataset.croptixFill;
    for (const el of document.querySelectorAll("[data-croptix-filter]")) delete el.dataset.croptixFilter;
  }

  async function update(anchorMap) {
    if (!C.getSetting("fillerTagsEnabled")) return clearAll();
    const ids = [...anchorMap.keys()];
    if (ids.length) {
      const metas = await C.getMetas(ids);
      await Promise.all([...metas].map(async ([id, meta]) => {
        if (!meta || meta.type !== "episode") return;
        const info = await getFillerInfo(meta);
        decorate(anchorMap.get(id) ?? [], statusFor(info, meta));
      }));
      buildToolbars(anchorMap);
    }
    await updateWatchFlag();
  }

  C.onPage(update);
})();
