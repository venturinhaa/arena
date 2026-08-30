// ============================================================================
// CrOptix — background.js
// Tiny proxy for the public Jikan (MyAnimeList) API. Fetching from the
// extension background avoids any page CORS/CSP constraints. If the worker
// is unavailable, the content scripts fall back to fetching directly
// (Jikan allows cross-origin requests).
// ============================================================================
(() => {
  const JIKAN_BASE = "https://api.jikan.moe/v4";
  const api = typeof browser !== "undefined" ? browser : chrome;

  api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type !== "croptix-jikan" || typeof msg.path !== "string") return false;
    fetch(JIKAN_BASE + msg.path, { headers: { accept: "application/json" } })
      .then(async (res) => {
        sendResponse({
          ok: res.ok,
          status: res.status,
          body: await res.json().catch(() => null),
        });
      })
      .catch((e) => sendResponse({ ok: false, status: 0, body: null, error: String(e) }));
    return true; // keep the message channel open for the async response
  });
})();
