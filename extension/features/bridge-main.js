// ============================================================================
// CrOptix — features/bridge-main.js  (runs in the page MAIN world)
// Crunchyroll's own API calls send an "Authorization: Bearer …" header; plain
// cookie requests to /content/v2/… and /accounts/v1/me answer 401. This small
// bridge runs next to the site code and:
//   1. captures the Bearer token from the site's own fetch/XHR calls,
//   2. mints a token via /auth/v1/token (grant_type=etp_rt_cookie) if needed,
//   3. serves authenticated API requests to the extension's isolated-world
//      content scripts through window.postMessage.
// All message payloads are JSON strings to stay Xray-safe in Firefox.
// ============================================================================
(() => {
  const KEY = "__croptixBridge";
  if (window[KEY]) return;
  try { Object.defineProperty(window, KEY, { value: true }); } catch { return; }

  const REQ_SOURCE = "croptix-cs-request";
  const RES_SOURCE = "croptix-page-response";

  let bearer = null;
  let minting = null;

  // ---- 1. Capture the Authorization header from the site's own requests ----
  function captureAuth(headers) {
    try {
      let value = null;
      if (!headers) return;
      if (typeof headers.get === "function") value = headers.get("authorization");
      else if (Array.isArray(headers)) {
        for (let i = 0; i < headers.length; i += 2) {
          if (String(headers[i]).toLowerCase() === "authorization") value = headers[i + 1];
        }
      } else value = headers.authorization ?? headers.Authorization;
      if (typeof value === "string" && /^bearer\s+.+/i.test(value)) bearer = value.trim();
    } catch { /* ignore */ }
  }

  const originalFetch = window.fetch;
  if (typeof originalFetch === "function") {
    window.fetch = function (input, init) {
      try {
        if (init?.headers) captureAuth(init.headers);
        else if (typeof Request !== "undefined" && input instanceof Request) captureAuth(input.headers);
      } catch { /* ignore */ }
      return originalFetch.apply(this, arguments);
    };
  }

  const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    try {
      if (String(name).toLowerCase() === "authorization") captureAuth({ [name]: value });
    } catch { /* ignore */ }
    return origSetHeader.call(this, name, value);
  };

  // ---- 2. Mint a token ourselves when nothing was captured yet -------------
  function scanPageConfig() {
    const found = {};
    try {
      const re = /"(accountAuthClientId|anonClientId|apiDomain)"\s*:\s*"([^"]+)"/g;
      for (const script of document.querySelectorAll("script")) {
        const text = script.textContent;
        if (!text || text.length > 2_000_000) continue;
        let m;
        while ((m = re.exec(text))) found[m[1]] = m[2];
      }
    } catch { /* ignore */ }
    try {
      for (const key of ["staticConfig", "__APP_CONFIG__", "__NEXT_DATA__"]) {
        const cfg = window[key]?.cxApiParams;
        if (cfg) {
          if (cfg.accountAuthClientId) found.accountAuthClientId = cfg.accountAuthClientId;
          if (cfg.anonClientId) found.anonClientId = cfg.anonClientId;
          if (cfg.apiDomain) found.apiDomain = cfg.apiDomain;
        }
      }
    } catch { /* ignore */ }
    return found;
  }

  async function mintToken() {
    if (minting) return minting;
    minting = (async () => {
      const cfg = scanPageConfig();
      const domain = String(cfg.apiDomain || location.origin).replace(/\/+$/, "");
      const clientIds = [...new Set([cfg.accountAuthClientId, "tigeriaf", cfg.anonClientId].filter(Boolean))];
      for (const id of clientIds) {
        try {
          const res = await originalFetch(`${domain}/auth/v1/token`, {
            method: "POST",
            credentials: "include",
            headers: {
              "content-type": "application/x-www-form-urlencoded",
              authorization: `Basic ${btoa(`${id}:`)}`,
            },
            body: "grant_type=etp_rt_cookie",
          });
          if (!res.ok) continue;
          const data = await res.json().catch(() => null);
          if (data?.access_token) {
            bearer = `${data.token_type ?? "Bearer"} ${data.access_token}`;
            return bearer;
          }
        } catch { /* try next id */ }
      }
      return null;
    })();
    try { return await minting; } finally { minting = null; }
  }

  // ---- 3. Serve authenticated API requests ---------------------------------
  async function handleRequest(payload) {
    const path = String(payload.path ?? "");
    if (path === "__ping__") return { ok: true, status: 200, body: { pong: true } };

    let url;
    try { url = new URL(path, location.origin); } catch { return { ok: false, status: 0, body: null }; }
    for (const [k, v] of Object.entries(payload.params ?? {})) {
      if (v != null) { try { url.searchParams.set(k, String(v)); } catch { /* ignore */ } }
    }

    try {
      let token = bearer ?? (await mintToken());
      if (!token) return { ok: false, status: 401, body: null, error: "no-token" };
      let res = await originalFetch(url.href, {
        credentials: "include",
        headers: { accept: "application/json", authorization: token },
      });
      if (res.status === 401) {
        bearer = null;
        token = await mintToken();
        if (token) res = await originalFetch(url.href, {
          credentials: "include",
          headers: { accept: "application/json", authorization: token },
        });
      }
      return { ok: res.ok, status: res.status, body: res.ok ? await res.json().catch(() => null) : null };
    } catch (e) {
      return { ok: false, status: 0, body: null, error: String(e) };
    }
  }

  window.addEventListener("message", async (event) => {
    // Same-window messages carry source === window; jsdom may leave it null.
    if (event.source != null && event.source !== window) return;
    const data = event.data;
    if (!data || typeof data !== "object" || data.source !== REQ_SOURCE) return;
    const response = await handleRequest(data);
    try {
      window.postMessage({
        source: RES_SOURCE,
        reqId: data.reqId,
        ok: !!response.ok,
        status: response.status ?? 0,
        body: response.body ?? null,
        error: response.error ?? null,
      }, location.origin);
    } catch { /* page going away */ }
  });
})();
