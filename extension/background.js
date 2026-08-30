// ============================================================================
// CrOptix — background.js
// Tiny proxy for the public Jikan (MyAnimeList) API. Fetching from the
// extension background avoids page CSP restrictions on Crunchyroll. If the
// worker is unavailable, the content scripts fall back to fetching directly
// (Jikan allows cross-origin requests).
//
// Firefox note: with the `browser` API an onMessage listener must RETURN the
// response promise; `sendResponse` + `return true` only applies to Chrome's
// callback-style API.
// ============================================================================
(() => {
  const JIKAN_BASE = "https://api.jikan.moe/v4";
  const api = typeof browser !== "undefined" ? browser : chrome;

  api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type !== "croptix-jikan" || typeof msg.path !== "string") return false;

    const work = (async () => {
      try {
        const res = await fetch(JIKAN_BASE + msg.path, { headers: { accept: "application/json" } });
        return {
          ok: res.ok,
          status: res.status,
          body: await res.json().catch(() => null),
        };
      } catch (e) {
        return { ok: false, status: 0, body: null, error: String(e) };
      }
    })();

    if (typeof browser !== "undefined") return work; // Firefox (promise-style)
    work.then(sendResponse);
    return true; // Chrome (callback-style, keep the channel open)
  });
})();
