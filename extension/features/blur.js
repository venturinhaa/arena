// ============================================================================
// CrOptix — features/blur.js
// Blurs the thumbnails of episodes that haven't been watched yet.
// Hovering a blurred thumbnail temporarily reveals it.
// ============================================================================
(() => {
  const C = window.CROPTIX;
  if (!C) return;

  const BLUR_CLASS = "croptix-blur-ep";

  function clearAll() {
    for (const el of document.querySelectorAll(`.${BLUR_CLASS}`)) el.classList.remove(BLUR_CLASS);
  }

  async function update(anchorMap) {
    if (!C.getSetting("blurUnwatchedEnabled")) return clearAll();
    const ids = [...anchorMap.keys()];
    if (!ids.length) return;

    const metas = await C.getMetas(ids);

    // Collect episode ids that are worth checking (aired episodes only).
    const now = Date.now();
    const candidates = [];
    for (const [id, meta] of metas) {
      if (!meta || meta.type !== "episode") continue;
      const starts = meta.availabilityStarts ? Date.parse(meta.availabilityStarts) : 0;
      if (starts && starts > now) continue; // not released yet — nothing to spoil
      candidates.push(id);
    }
    if (!candidates.length) return;

    // Resolve watch progress. getPlayhead() fails open (null) when the
    // endpoint is unavailable (e.g. logged out) — in that case, no blur.
    const states = await Promise.all(candidates.map((id) => C.getPlayhead(id)));

    candidates.forEach((id, i) => {
      const state = states[i];
      const anchors = anchorMap.get(id) ?? [];
      const thumb = C.thumbAnchor(anchors);
      if (!thumb) return;
      // Skip hero/billboard banners — blurring those looks broken.
      if (thumb.closest('[class*="hero"], [class*="billboard"]')) return;
      thumb.classList.toggle(BLUR_CLASS, state === "unwatched");
    });
  }

  C.onPage(update);
})();
