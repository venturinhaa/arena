(()=>{let P=Symbol.for("croptix.crunchyroll-page-patches");if(window[P])return;let h=window.fetch,r={ids:[],seen:new Set,catalogs:new Map,page:1,done:!1,expires:0,retryAt:0,loading:null},A=`query ($firstPage: Int!, $secondPage: Int!) {
        first: Page(page: $firstPage, perPage: 50) {
            media(type: ANIME, sort: TRENDING_DESC, isAdult: false) { externalLinks { url } }
        }
        second: Page(page: $secondPage, perPage: 50) {
            media(type: ANIME, sort: TRENDING_DESC, isAdult: false) { externalLinks { url } }
        }
    }`,R=()=>{r.ids.length=0,r.seen.clear(),r.catalogs.clear(),Object.assign(r,{page:1,done:!1,expires:0,retryAt:0})},x=()=>{let t=Date.now();if(r.loading)return r.loading;if(r.expires&&r.expires<=t)R();if(r.done)return Promise.resolve();if(t<r.retryAt)return Promise.reject(Error("AniList retry is temporarily delayed"));if(typeof h!=="function")return Promise.reject(Error("Fetch is unavailable"));let n=[r.page,Math.min(r.page+1,10)];return r.loading=h.call(window,"https://graphql.anilist.co",{method:"POST",credentials:"omit",referrerPolicy:"no-referrer",headers:{"content-type":"application/json"},body:JSON.stringify({query:A,variables:{firstPage:n[0],secondPage:n[1]}})}).then(async(e)=>{if(!e.ok)throw Error(`AniList returned HTTP ${e.status}`);let a=await e.json();if(a.errors?.length)throw Error(a.errors.map(({message:o})=>o).join(", "));let s=[...a.data?.first?.media??[],...a.data?.second?.media??[]];for(let o of s)for(let c of o.externalLinks??[]){let l=c.url?.match(/crunchyroll\.com\/(?:[a-z]{2}\/)?series\/([a-z0-9]+)/i)?.[1]?.toUpperCase();if(!l||r.seen.has(l))continue;r.seen.add(l),r.ids.push(l)}r.page=n[1]+1,r.done=r.page>10,r.expires=Date.now()+900000,r.retryAt=0}).catch((e)=>{throw r.retryAt=Date.now()+60000,console.warn("[CrOptix] Failed to load AniList trending anime.",e),e}).finally(()=>{r.loading=null}),r.loading},b=(t)=>{let n=Number.parseInt(t.searchParams.get("start")??"0",10),e=Number.parseInt(t.searchParams.get("n")??"36",10);return[n>0?n:0,e>0?e:36]},j=(t,n=!0)=>{let e=t.searchParams.get("locale")||"en-US",a=t.searchParams.get("preferred_audio_language")||e,s=`${e}|${a}`;if(!r.catalogs.has(s)&&n)r.catalogs.set(s,{locale:e,audio:a,ratings:t.searchParams.get("ratings")||"true",items:[],seen:new Set,cursor:0,wanted:0,done:!1,loading:null});return r.catalogs.get(s)},T=async(t,n)=>{if(!r.ids.length||r.expires<=Date.now())await x();let e=j(t),[a,s]=b(t),o=a+s;if(e.wanted=Math.max(e.wanted,o),!e.loading)e.loading=(async()=>{while(e.items.length<e.wanted&&!e.done){if(e.cursor>=r.ids.length){if(r.done){e.done=!0;break}await x();continue}let c=r.ids.slice(e.cursor,e.cursor+50),l=new URL(`/content/v2/cms/objects/${c.join(",")}`,t.origin);l.searchParams.set("ratings",e.ratings),l.searchParams.set("preferred_audio_language",e.audio),l.searchParams.set("locale",e.locale);let d=new Headers(n);d.set("accept","application/json"),d.delete("content-length"),d.delete("host");let f=await h.call(window,l.href,{credentials:"same-origin",headers:d});if(!f.ok)throw Error(`Crunchyroll objects returned HTTP ${f.status}`);let p=(await f.json())?.data;if(!Array.isArray(p))throw Error("Crunchyroll objects returned invalid JSON");let g=new Map(p.map((i)=>[String(i.id??"").toUpperCase(),i]));e.cursor+=c.length;for(let i of c){let u=g.get(i);if(!u||e.seen.has(i))continue;e.seen.add(i),e.items.push(u)}e.done=r.done&&e.cursor>=r.ids.length}})().finally(()=>{e.loading=null});if(await e.loading,e.items.length<o&&!e.done)await T(t,n)},E=[{hint:"/f/v1/home",matches:(t)=>t.pathname==="/f/v1/home",transform:(t)=>{let n=t?.children;if(!Array.isArray(n))return t;let e=n.findIndex((o)=>o?.type==="HistoryCollection");if(e<0)return t;let a=n.splice(e,1)[0],s=n.findIndex((o)=>!["HeroMediaCard","HeroCollection"].includes(o?.type));return n.splice(s<0?n.length:s,0,a),t}},{hint:"/content/v2/discover/browse",matches:(t)=>t.pathname==="/content/v2/discover/browse"&&t.searchParams.get("sort_by")==="popularity",prepare:T,transform:(t,n)=>{let e=j(n,!1);if(!e||!e.items.length&&t?.data?.length)return t;let[a,s]=b(n);return t.data=e.items.slice(a,a+s),t.total=e.done?e.items.length:500,t}}],O=(t,n=new Headers)=>{let e=String(t),a=E.filter(({hint:o})=>e.includes(o));if(!a.length)return[];let s=new URL(e,window.location.href);return a.filter((o)=>o.matches(s)).map((o)=>({...o,url:s,headers:n}))},m=(t,n)=>n.reduce((e,a)=>a.failed?e:a.transform(e,a.url),t),S=(t)=>Promise.all(t.map((n)=>n.prepare?.(n.url,n.headers))).catch((n)=>{for(let e of t)e.failed=!0;throw n}),D=async(t,n,e)=>{let a=await t.clone().json();await e;let s=new Headers(t.headers);s.delete("content-encoding"),s.delete("content-length");let o=new Response(JSON.stringify(m(a,n)),{status:t.status,statusText:t.statusText,headers:s});for(let c of["url","redirected","type"])try{Object.defineProperty(o,c,{value:t[c]})}catch{}return o};

// Auth & Watchlist manager
let savedAuthHeader = null;
let savedAccountId = null;

function notifyWatchlistItems(items){
  try {
    if (!Array.isArray(items) || items.length === 0) return;
    const extracted = [];
    for (const it of items) {
      const panel = it.panel || it;
      const title = panel.title || panel.series_title || (panel.series_metadata && panel.series_metadata.series_title);
      const id = panel.id || panel.series_id || it.id;
      const slug = panel.slug_title || (panel.series_metadata && panel.series_metadata.slug_title);
      const images = panel.images || (panel.series_metadata && panel.series_metadata.images);
      const posterUrl = images?.poster_tall?.[0]?.source || images?.poster_wide?.[0]?.source || "";
      const lastWatched = it.last_public_head_played_episode_id || it.playhead || null;
      if (title || id) {
        extracted.push({
          id: String(id || "").toUpperCase(),
          title: String(title || ""),
          slug: String(slug || ""),
          image: posterUrl,
          lastWatched
        });
      }
    }
    if (extracted.length > 0) {
      window.dispatchEvent(new CustomEvent("croptix:watchlist-sync", { detail: extracted }));
    }
  } catch (_) {}
}

async function fetchWatchlistFromApi() {
  try {
    let auth = savedAuthHeader || window.__CROPTIX_AUTH_HEADER__;
    if (!auth) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const val = localStorage.getItem(key);
        if (val && typeof val === "string" && val.includes("Bearer ")) {
          const match = val.match(/Bearer\s+([a-zA-Z0-9_\-\.]+)/);
          if (match) { auth = "Bearer " + match[1]; break; }
        }
      }
    }
    const headers = { "accept": "application/json" };
    if (auth) headers["authorization"] = auth;

    const endpoints = [
      `/content/v2/discover/${savedAccountId ? savedAccountId + '/' : ''}watchlist?locale=pt-PT&n=100`,
      `/content/v2/discover/watchlist?locale=pt-PT&n=100`,
      `/content/v2/discover/watchlist?n=100`
    ];

    for (const ep of endpoints) {
      try {
        const res = await h.call(window, ep, { headers, credentials: "same-origin" });
        if (res.ok) {
          const json = await res.json();
          const items = json.data || json.items || [];
          if (items.length > 0) {
            notifyWatchlistItems(items);
            return items;
          }
        }
      } catch (_) {}
    }
  } catch (_) {}
}

window.addEventListener("croptix:request-watchlist-fetch", fetchWatchlistFromApi);

if(typeof h==="function")window.fetch=function(...t){let n;try{let s=t[0],o=typeof Request<"u"&&s instanceof Request,c=new Headers(o?s.headers:void 0);if(t[1]?.headers)new Headers(t[1].headers).forEach((l,d)=>c.set(d,l));
const auth = c.get("authorization");
if (auth && auth.startsWith("Bearer ")) {
  savedAuthHeader = auth;
  window.__CROPTIX_AUTH_HEADER__ = auth;
}
const urlStr = String(o ? s.url : (typeof s === 'string' ? s : ''));
const accMatch = urlStr.match(/\/discover\/([a-zA-Z0-9_\-]+)\/watchlist/);
if (accMatch && accMatch[1]) {
  savedAccountId = accMatch[1];
  window.__CROPTIX_ACCOUNT_ID__ = accMatch[1];
}
n=O(o?s.url:s,c)}catch(s){return console.warn("[CrOptix] Failed to inspect a Crunchyroll fetch request.",s),h.apply(this,t)}let e=h.apply(this,t);

// Intercept genuine Watchlist API responses
try {
  const urlStr = String(typeof t[0] === 'string' ? t[0] : (t[0]?.url || ''));
  const isWatchlist = (urlStr.includes('/watchlist') || urlStr.includes('/crunchylists/')) &&
                      !urlStr.includes('/browse') &&
                      !urlStr.includes('/categories') &&
                      !urlStr.includes('/similar_to') &&
                      !urlStr.includes('/prev_next');
  if (isWatchlist) {
    e.then(async (resp) => {
      try {
        const cloned = resp.clone();
        const json = await cloned.json();
        if (json?.data) notifyWatchlistItems(json.data);
        if (json?.items) notifyWatchlistItems(json.items);
      } catch (_) {}
    }).catch(()=>{});
  }
} catch (_) {}

if(!n.length)return e;let a=S(n);return e.then(async(s)=>{try{return await D(s,n,a)}catch(o){return console.warn("[CrOptix] Failed to patch a Crunchyroll fetch response.",o),s}})};let v=window.XMLHttpRequest;if(typeof v==="function"){let t=v.prototype,n=t.open,e=Object.getOwnPropertyDescriptor(t,"responseText"),a=Object.getOwnPropertyDescriptor(t,"response");if(typeof n==="function")t.open=function(s,o,...c){let l=n.call(this,s,o,...c);try{let d=new Headers,f=O(o,d);if(!f.length)return l;if(c[0]!==!1&&f.some(({prepare:i})=>i)&&typeof this.send==="function"){let i=this.send,u=this.setRequestHeader,C=!1;if(typeof u==="function")Object.defineProperty(this,"setRequestHeader",{configurable:!0,value:(y,w)=>{u.call(this,y,w),d.append(String(y),String(w))}});let H=(...y)=>{if(C)throw new DOMException("The request has already been sent.","InvalidStateError");C=!0,S(f).catch((w)=>console.warn("[CrOptix] Failed to prepare a Crunchyroll XHR request.",w)).then(()=>{if(this.readyState===1&&this.send===H)i.apply(this,y)})};Object.defineProperty(this,"send",{configurable:!0,value:H})}let p={},g=()=>{let i=e.get.call(this);if(this.readyState!==4)return i;if("text"in p)return p.text;try{p.text=JSON.stringify(m(JSON.parse(i),f))}catch{p.text=i}return p.text};if(typeof e?.get==="function")Object.defineProperty(this,"responseText",{configurable:!0,enumerable:e.enumerable,get:g});if(typeof a?.get==="function")Object.defineProperty(this,"response",{configurable:!0,enumerable:a.enumerable,get:()=>{let i=a.get.call(this);if(this.readyState!==4)return i;if(this.responseType==="json"){if(!("json"in p))p.json=m(i,f);return p.json}return this.responseType===""||this.responseType==="text"?g():i}})}catch(d){console.warn("[CrOptix] Failed to patch a Crunchyroll XHR response.",d)}return l}}window[P]=!0})();
