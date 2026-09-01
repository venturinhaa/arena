var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/utils/katamari.js
(() => {
  function patch_webpack_chunk(chunk_data) {
    try {
      const modules = chunk_data[1];
      if (!modules)
        return;
      for (const module_id in modules) {
        const fn = modules[module_id];
        if (typeof fn !== "function")
          continue;
        const fn_str = fn.toString();
        const ex = (regex) => {
          const match = fn_str.match(regex);
          return match ? [match[1], match[2]] : [];
        };
        const engineImportRegex = (name) => {
          const ident = String.raw`[A-Za-z_$][\w$]*`;
          const match = fn_str.match(new RegExp(String.raw`await\s*(` + ident + String.raw`)\s*\.\s*e\s*\(\s*(\d+)\s*\)\s*\.\s*then\s*\(\s*\1\s*\.\s*bind\s*\(\s*\1\s*,\s*(\d+)\s*\)\s*\)\s*\.\s*then\s*\(\s*\(\s*\{\s*` + name));
          return match ? [match[2], match[3]] : null;
        };
        if (fn_str.includes("@crunchyroll/katamari-desktop-player")) {
          const importIds = [...fn_str.matchAll(/[a-zA-Z0-9_$]+\s*=\s*[a-zA-Z0-9_$]+\s*\(\s*(\d+)\s*\)/g)].slice(0, 5).map((match) => Number(match[1]));
          const [shakaE, shakaB] = engineImportRegex("ShakaMediaEngine") || ex(/\?\s*await\s*[a-zA-Z0-9_$]+\.e\((\d+)\)\.then\([a-zA-Z0-9_$]+\.bind\([a-zA-Z0-9_$]+,\s*(\d+)\)\)\.then\(\(\{\s*ShakaMediaEngine/);
          const [bitE, bitB] = engineImportRegex("BitmovinMediaEngine") || ex(/:\s*await\s*[a-zA-Z0-9_$]+\.e\((\d+)\)\.then\([a-zA-Z0-9_$]+\.bind\([a-zA-Z0-9_$]+,\s*(\d+)\)\)\.then\(\(\{\s*BitmovinMediaEngine/);
          if (!shakaE || !shakaB || !bitE || !bitB) {
            console.warn("[CrOptix] Katamari Patch skipped: media engine chunk ids not found");
            continue;
          }
          if (importIds.length !== 5) {
            console.warn("[CrOptix] Katamari Patch skipped: static import ids not found");
            continue;
          }
          modules[module_id] = function(SHAKA_E, SHAKA_B, BIT_E, BIT_B, IMPORT_IDS) {
            return function(t, i, a) {
              let r;
              a.d(i, {
                n: function() {
                  return C;
                },
                ps: function() {
                  return le;
                },
                t: function() {
                  return _;
                }
              });
              var s, n, o, l = a(IMPORT_IDS[0]), d = a(IMPORT_IDS[1]), u = a(IMPORT_IDS[2]), c = a(IMPORT_IDS[3]), h = a(IMPORT_IDS[4]), p = Object.create, f = Object.defineProperty, g = Object.getOwnPropertyDescriptor, v = Object.getOwnPropertyNames, m = Object.getPrototypeOf, y = Object.prototype.hasOwnProperty, _ = (t10, i10) => () => (i10 || (t10((i10 = { exports: {} }).exports, i10), t10 = null), i10.exports), b = (t10, i10) => {
                let a10 = {};
                for (var r10 in t10)
                  f(a10, r10, { get: t10[r10], enumerable: true });
                return i10 || f(a10, Symbol.toStringTag, { value: "Module" }), a10;
              }, k = (t10, i10, a10, r10) => {
                if (i10 && typeof i10 == "object" || typeof i10 == "function")
                  for (var s10, n10 = v(i10), o10 = 0, l2 = n10.length;o10 < l2; o10++)
                    s10 = n10[o10], y.call(t10, s10) || s10 === a10 || f(t10, s10, { get: ((t11) => i10[t11]).bind(null, s10), enumerable: !(r10 = g(i10, s10)) || r10.enumerable });
                return t10;
              }, C = (t10, i10, a10) => (a10 = t10 == null ? {} : p(m(t10)), k(!i10 && t10 && t10.__esModule ? a10 : f(a10, "default", { value: t10, enumerable: true }), t10)), w = (r = function(t10) {
                if ("u" > "function")
                  return __require.apply(this, arguments);
                throw Error('Calling `require` for "' + t10 + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
              }, "u" > "function" ? __require : "u" > typeof Proxy ? new Proxy(r, { get: (t10, i10) => ("u" > "function" ? __require : t10)[i10] }) : r), x = Array.isArray, E = Array.isArray, S = Object.getPrototypeOf, T = Object.prototype, P = Object.keys;
              try {
                l.Ft && (l.Ft.info = () => {}, l.Ft.debug = () => {});
              } catch {}
              function A() {
                var t10, i10 = [...arguments], a10 = (0, l.xt)(i10), r10 = (0, l.bt)(i10), s10 = function(t11) {
                  if (t11.length === 1) {
                    var i11 = t11[0];
                    if (E(i11))
                      return { args: i11, keys: null };
                    if (i11 && typeof i11 == "object" && S(i11) === T) {
                      var a11 = P(i11);
                      return {
                        args: a11.map(function(t12) {
                          return i11[t12];
                        }),
                        keys: a11
                      };
                    }
                  }
                  return { args: t11, keys: null };
                }(i10), n10 = s10.args, o10 = s10.keys;
                if (n10.length === 0)
                  return (0, l.gt)([], a10);
                var d2 = new l.Ot(((t10 = o10 ? function(t11) {
                  return o10.reduce(function(i11, a11, r11) {
                    return i11[a11] = t11[r11], i11;
                  }, {});
                } : l.kt) === undefined && (t10 = l.kt), function(i11) {
                  L(a10, function() {
                    for (var r11 = n10.length, s11 = Array(r11), o11 = r11, d3 = r11, u2 = function(r12) {
                      L(a10, function() {
                        var u3 = (0, l.gt)(n10[r12], a10), c3 = false;
                        u3.subscribe((0, l.Et)(i11, function(a11) {
                          s11[r12] = a11, c3 || (c3 = true, d3--), d3 || i11.next(t10(s11.slice()));
                        }, function() {
                          --o11 || i11.complete();
                        }));
                      }, i11);
                    }, c2 = 0;c2 < r11; c2++)
                      u2(c2);
                  }, i11);
                }));
                return r10 ? d2.pipe((0, l.ht)(function(t11) {
                  return x(t11) ? r10.apply(undefined, (0, l.Nt)([], (0, l.Mt)(t11))) : r10(t11);
                })) : d2;
              }
              function L(t10, i10, a10) {
                t10 ? (0, l._t)(a10, t10, i10) : i10();
              }
              function I() {
                var t10 = [...arguments], i10 = (0, l.xt)(t10), a10 = (0, l.yt)(t10, 1 / 0);
                return t10.length ? t10.length === 1 ? (0, l.vt)(t10[0]) : (0, l.mt)(a10)((0, l.gt)(t10, i10)) : l.St;
              }
              function R(t10, i10) {
                var a10;
                return (0, l.Dt)((a10 = arguments.length >= 2, function(r10, s10) {
                  var n10 = a10, o10 = i10, d2 = 0;
                  r10.subscribe((0, l.Et)(s10, function(i11) {
                    var a11 = d2++;
                    o10 = n10 ? t10(o10, i11, a11) : (n10 = true, i11), s10.next(o10);
                  }, undefined));
                }));
              }
              function D(t10, i10) {
                var a10 = [...arguments].slice(2);
                if (i10 === true) {
                  t10();
                  return;
                }
                if (i10 !== false) {
                  var r10 = new l.At({
                    next: function() {
                      r10.unsubscribe(), t10();
                    }
                  });
                  return (0, l.vt)(i10.apply(undefined, (0, l.Nt)([], (0, l.Mt)(a10)))).subscribe(r10);
                }
              }
              function M(t10, i10, a10) {
                var r10, s10, n10, o10, d2, u2, c2, h2, p2, f2, g2, v2, m2, y2 = false;
                return t10 && typeof t10 == "object" ? (m2 = (f2 = t10.bufferSize) === undefined ? 1 / 0 : f2, i10 = (g2 = t10.windowTime) === undefined ? 1 / 0 : g2, y2 = (v2 = t10.refCount) !== undefined && v2, a10 = t10.scheduler) : m2 = t10 ?? 1 / 0, n10 = (s10 = (r10 = {
                  connector: function() {
                    return new l.Ct(m2, i10, a10);
                  },
                  resetOnError: true,
                  resetOnComplete: false,
                  resetOnRefCountZero: y2
                }).connector) === undefined ? function() {
                  return new l.Tt;
                } : s10, d2 = (o10 = r10.resetOnError) === undefined || o10, c2 = (u2 = r10.resetOnComplete) === undefined || u2, p2 = (h2 = r10.resetOnRefCountZero) === undefined || h2, function(t11) {
                  var i11, a11, r11, s11 = 0, o11 = false, u3 = false, h3 = function() {
                    a11?.unsubscribe(), a11 = undefined;
                  }, f3 = function() {
                    h3(), i11 = r11 = undefined, o11 = u3 = false;
                  }, g3 = function() {
                    var t12 = i11;
                    f3(), t12?.unsubscribe();
                  };
                  return (0, l.Dt)(function(t12, v3) {
                    s11++, u3 || o11 || h3();
                    var m3 = r11 ??= n10();
                    v3.add(function() {
                      --s11 != 0 || u3 || o11 || (a11 = D(g3, p2));
                    }), m3.subscribe(v3), !i11 && s11 > 0 && (i11 = new l.At({
                      next: function(t13) {
                        return m3.next(t13);
                      },
                      error: function(t13) {
                        u3 = true, h3(), a11 = D(f3, d2, t13), m3.error(t13);
                      },
                      complete: function() {
                        o11 = true, h3(), a11 = D(f3, c2), m3.complete();
                      }
                    }), (0, l.vt)(t12).subscribe(i11));
                  })(t11);
                };
              }
              function N() {
                var t10 = [...arguments], i10 = (0, l.bt)(t10);
                return (0, l.Dt)(function(a10, r10) {
                  for (var s10 = t10.length, n10 = Array(s10), o10 = t10.map(function() {
                    return false;
                  }), d2 = false, u2 = function(i11) {
                    (0, l.vt)(t10[i11]).subscribe((0, l.Et)(r10, function(t11) {
                      n10[i11] = t11, !d2 && !o10[i11] && (o10[i11] = true, (d2 = o10.every(l.kt)) && (o10 = null));
                    }, l.jt));
                  }, c2 = 0;c2 < s10; c2++)
                    u2(c2);
                  a10.subscribe((0, l.Et)(r10, function(t11) {
                    if (d2) {
                      var a11 = (0, l.Nt)([t11], (0, l.Mt)(n10));
                      r10.next(i10 ? i10.apply(undefined, (0, l.Nt)([], (0, l.Mt)(a11))) : a11);
                    }
                  }));
                });
              }
              function j(t10, i10, a10) {
                let r10 = a10?.path ? Object.entries(a10.path).reduce((t11, [i11, a11]) => t11.replace(`{${i11}}`, encodeURIComponent(a11)), i10) : i10, s10 = `${t10.replace(/\/+$/, "")}/${r10.replace(/^\/+/, "")}`, n10 = new Set;
                a10?.query && Object.entries(a10.query).forEach(([t11, i11]) => {
                  if (i11 === undefined)
                    return;
                  let a11 = i11 === null ? "" : String(i11), r11 = `{${t11}}`, o11 = RegExp(`([?&])${t11}=[^&]*`);
                  s10.includes(r11) ? (s10 = s10.replace(r11, encodeURIComponent(a11)), n10.add(t11)) : o11.test(s10) && (s10 = s10.replace(o11, `$1${t11}=${encodeURIComponent(a11)}`), n10.add(t11));
                });
                let o10 = a10?.query ? Object.entries(a10.query).filter(([t11, i11]) => !n10.has(t11) && i11 !== undefined) : [];
                if (o10.length > 0) {
                  let t11 = o10.map(([t12, i11]) => `${encodeURIComponent(t12)}=${encodeURIComponent(i11 === null ? "" : String(i11))}`).join("&");
                  s10 += s10.includes("?") ? `&${t11}` : `?${t11}`;
                }
                return s10 = (s10 = s10.replace(/{[^}]+}/g, "")).replace(/([^:]\/)\/+/g, "$1"), (t10.endsWith("/") || i10.endsWith("/")) && !s10.endsWith("/") && (s10 += "/"), s10;
              }
              var O = {
                "en-US": "English",
                "de-DE": "Deutsch",
                "es-419": "Español (América Latina)",
                "es-ES": "Español (España)",
                "fr-FR": "Français",
                "it-IT": "Italiano",
                "pt-BR": "Português (Brasil)",
                "pt-PT": "Português (Portugal)",
                "ru-RU": "Русский",
                "ar-SA": "العربية",
                "hi-IN": "हिंदी",
                "id-ID": "Bahasa Indonesia",
                "th-TH": "ไทย",
                "ko-KR": "한국어",
                "pl-PL": "Polski",
                "zh-TW": "中文 (國語)"
              }, V = "player-accessibility-announcer", H = class {
                constructor(t10) {
                  this.announcerElement = null, this.parentElement = t10 ?? document.body;
                }
                initialize() {
                  let t10 = this.parentElement.querySelector(`#${V}`);
                  if (t10) {
                    this.announcerElement = t10;
                    return;
                  }
                  let i10 = document.createElement("div");
                  i10.id = V, i10.setAttribute("aria-live", "polite"), i10.setAttribute("aria-atomic", "true"), i10.setAttribute("role", "status"), i10.style.position = "absolute", i10.style.width = "0", i10.style.height = "0", i10.style.opacity = "0", i10.style.overflow = "hidden", i10.style.whiteSpace = "nowrap", this.parentElement.appendChild(i10), this.announcerElement = i10;
                }
                announce(t10, i10 = "polite") {
                  let a10 = this.parentElement.querySelector(`#${V}`);
                  if (a10 ? this.announcerElement = a10 : this.initialize(), !this.announcerElement)
                    return;
                  let r10 = this.announcerElement.getAttribute("aria-live") !== i10;
                  this.announcerElement.setAttribute("aria-live", i10);
                  let s10 = this.announcerElement.textContent, n10 = s10 ? s10.replace(RegExp("​", "g"), "") : "", o10 = () => {
                    if (this.announcerElement) {
                      if (n10 === t10 && t10 !== "") {
                        let i11 = s10 !== null && s10.endsWith("​");
                        this.announcerElement.textContent = i11 ? t10 : t10 + "​";
                      } else
                        this.announcerElement.textContent = t10;
                    }
                  };
                  r10 ? setTimeout(o10, 0) : o10();
                }
                dispose() {
                  if (!this.announcerElement) {
                    let t10 = this.parentElement.querySelector(`#${V}`);
                    t10 && this.parentElement.removeChild(t10), this.announcerElement = null;
                    return;
                  }
                  this.announcerElement.parentNode && this.announcerElement.parentNode.removeChild(this.announcerElement), this.announcerElement = null;
                }
              }, U = {
                play: "Play",
                pause: "Pause",
                settings: "Settings",
                playerSettings: "Player Settings",
                fullscreen: "Fullscreen",
                "fullscreen.enter.ariaLabel": "Enter Fullscreen",
                "fullscreen.exit.ariaLabel": "Exit Fullscreen",
                playbackSpeed: "Playback Speed",
                "playbackSpeed.ariaLabel": "Playback Speed Menu",
                "trackSelection.ariaLabel": "Audio and subtitle language options",
                audioTrackSelection: "Audio track selection",
                audio: "Audio",
                subtitleAndCcSelection: "Subtitle and closed caption selection",
                subtitlesCc: "Subtitles/CC",
                "ja-JP": "Japanese",
                none: "None",
                elapsed: "{{timestamp}} elapsed",
                remaining: "{{timestamp}} remaining",
                total: "{{timestamp}} total",
                volume: "Volume",
                muted: "Muted",
                "timeline.ariaLabel": "Video timeline",
                "timeline.ariaValueText": "{{elapsed}} of {{duration}}",
                "error.title.generic": "Not Available",
                "error.message.generic": "We're having trouble loading this video. Please be patient as we work to restore peace.",
                "error.title.streamLimits": "We love all of your streams, but there's a limit",
                "error.message.streamLimits": "Continue watching on this device by stopping an existing stream or upgrading your subscription.",
                "error.action.retry": "Try Again",
                "skip.intro": "Skip Intro",
                "skip.recap": "Skip Recap",
                "skip.credits": "Skip Credits",
                "skip.preview": "Skip Preview",
                "skip.promo": "Skip Promo",
                "skip.bumper": "Skip Bumper",
                "chapter.intro": "Opening",
                "chapter.recap": "Recap",
                "chapter.credits": "Ending / Credits",
                "chapter.preview": "Preview",
                "chapter.promo": "Promo",
                "chapter.bumper": "Bumper",
                "ratings.announcement.ratedFor": "Rated {{rating}} for {{descriptors}}",
                "ratings.announcement.ratedOnly": "Rated {{rating}}",
                "ratings.announcement.noRating": "No rating information available",
                autoplayNext: "Autoplay Next",
                playbackOptions: "Playback",
                enabled: "On",
                disabled: "Off",
                skipEvents: "Skip Events",
                autoSkipIntroOutro: "Auto Skip Intro/Outro",
                "trackSelectionMenu.audioTrack.audioDescription": "{{trackName}} [AD]",
                "trackSelectionMenu.textTrack.closedCaption": "{{trackName}} [CC]",
                quality: "Quality",
                "quality.highestAvailable": "Highest Available",
                "quality.highestAvailable.description": "Streams up to the highest quality available.",
                "quality.moderate": "Moderate",
                "quality.moderate.description": "Use less data by streaming at a standard quality.",
                "quality.dataSaver": "Data Saver",
                "quality.dataSaver.description": "Uses the least amount of data. Good for slower connections and data limits.",
                "jump.forward.ariaLabel": "Jump forward 10 seconds",
                "jump.backward.ariaLabel": "Jump backward 10 seconds",
                "buffering.ariaLabel": "Loading",
                "nextEpisode.ariaLabel": "Next Episode",
                "controls.announcement.autohide": "Player controls will auto-hide after a few seconds of inactivity. Press any key or move your mouse to show them again.",
                "assetMetadata.fullTitle.titleOnly": "{{title}}",
                "assetMetadata.fullTitle.episodeOnly": "E{{episode}} - {{title}}",
                "assetMetadata.fullTitle.specialEpisodeOnly": "E-{{episode}} - {{title}}",
                "assetMetadata.fullTitle.seasonOnly": "S{{season}} - {{title}}",
                "assetMetadata.fullTitle.specialSeasonOnly": "{{season}} - {{title}}",
                "assetMetadata.fullTitle.seasonAndEpisode": "S{{season}} E{{episode}} - {{title}}",
                "assetMetadata.fullTitle.seasonAndSpecialEpisode": "S{{season}} E-{{episode}} - {{title}}",
                "assetMetadata.fullTitle.specialSeasonAndEpisode": "{{season}} E{{episode}} - {{title}}",
                "assetMetadata.fullTitle.specialSeasonAndSpecialEpisode": "{{season}} E-{{episode}} - {{title}}"
              }, F = "en-US", $ = Object.keys(O).reduce((t10, i10) => (t10[i10] = i10.replace("-", "_"), t10), {});
              async function B(t10) {
                if (t10)
                  try {
                    let i10 = `${t10}/${$[F]}.json`, a10 = await fetch(i10);
                    if (a10.ok) {
                      let t11 = await a10.json();
                      return { ...U, ...t11 };
                    }
                  } catch (t11) {
                    l.Ft.warn("Failed to fetch latest English fallbacks, using local defaults:", t11);
                  }
                return U;
              }
              var q = (t10) => typeof t10 == "string", K = () => {
                let t10, i10, a10 = new Promise((a11, r10) => {
                  t10 = a11, i10 = r10;
                });
                return a10.resolve = t10, a10.reject = i10, a10;
              }, Z = (t10) => t10 == null ? "" : "" + t10, z = (t10, i10, a10) => {
                t10.forEach((t11) => {
                  i10[t11] && (a10[t11] = i10[t11]);
                });
              }, G = /###/g, W = (t10) => t10 && t10.indexOf("###") > -1 ? t10.replace(G, ".") : t10, J = (t10) => !t10 || q(t10), Y = (t10, i10, a10) => {
                let r10 = q(i10) ? i10.split(".") : i10, s10 = 0;
                for (;s10 < r10.length - 1; ) {
                  if (J(t10))
                    return {};
                  let i11 = W(r10[s10]);
                  !t10[i11] && a10 && (t10[i11] = new a10), t10 = Object.prototype.hasOwnProperty.call(t10, i11) ? t10[i11] : {}, ++s10;
                }
                return J(t10) ? {} : { obj: t10, k: W(r10[s10]) };
              }, Q = (t10, i10, a10) => {
                let { obj: r10, k: s10 } = Y(t10, i10, Object);
                if (r10 !== undefined || i10.length === 1) {
                  r10[s10] = a10;
                  return;
                }
                let n10 = i10[i10.length - 1], o10 = i10.slice(0, i10.length - 1), l2 = Y(t10, o10, Object);
                for (;l2.obj === undefined && o10.length; )
                  n10 = `${o10[o10.length - 1]}.${n10}`, (l2 = Y(t10, o10 = o10.slice(0, o10.length - 1), Object)) && l2.obj && l2.obj[`${l2.k}.${n10}`] !== undefined && (l2.obj = undefined);
                l2.obj[`${l2.k}.${n10}`] = a10;
              }, X = (t10, i10, a10, r10) => {
                let { obj: s10, k: n10 } = Y(t10, i10, Object);
                s10[n10] = s10[n10] || [], s10[n10].push(a10);
              }, ee = (t10, i10) => {
                let { obj: a10, k: r10 } = Y(t10, i10);
                if (a10)
                  return a10[r10];
              }, et = (t10, i10, a10) => {
                let r10 = ee(t10, a10);
                return r10 === undefined ? ee(i10, a10) : r10;
              }, ei = (t10, i10, a10) => {
                for (let r10 in i10)
                  r10 !== "__proto__" && r10 !== "constructor" && (r10 in t10 ? q(t10[r10]) || t10[r10] instanceof String || q(i10[r10]) || i10[r10] instanceof String ? a10 && (t10[r10] = i10[r10]) : ei(t10[r10], i10[r10], a10) : t10[r10] = i10[r10]);
                return t10;
              }, ea = (t10) => t10.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), er = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;" }, es = (t10) => q(t10) ? t10.replace(/[&<>"'\/]/g, (t11) => er[t11]) : t10, en = class {
                constructor(t10) {
                  this.capacity = t10, this.regExpMap = new Map, this.regExpQueue = [];
                }
                getRegExp(t10) {
                  let i10 = this.regExpMap.get(t10);
                  if (i10 !== undefined)
                    return i10;
                  let a10 = new RegExp(t10);
                  return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(t10, a10), this.regExpQueue.push(t10), a10;
                }
              }, eo = [" ", ",", "?", "!", ";"], el = new en(20), ed = (t10, i10, a10) => {
                i10 ||= "", a10 ||= "";
                let r10 = eo.filter((t11) => 0 > i10.indexOf(t11) && 0 > a10.indexOf(t11));
                if (r10.length === 0)
                  return true;
                let s10 = el.getRegExp(`(${r10.map((t11) => t11 === "?" ? "\\?" : t11).join("|")})`), n10 = !s10.test(t10);
                if (!n10) {
                  let i11 = t10.indexOf(a10);
                  i11 > 0 && !s10.test(t10.substring(0, i11)) && (n10 = true);
                }
                return n10;
              }, eu = function(t10, i10) {
                let a10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".";
                if (!t10)
                  return;
                if (t10[i10])
                  return t10[i10];
                let r10 = i10.split(a10), s10 = t10;
                for (let t11 = 0;t11 < r10.length; ) {
                  if (!s10 || typeof s10 != "object")
                    return;
                  let i11, n10 = "";
                  for (let o10 = t11;o10 < r10.length; ++o10)
                    if (o10 !== t11 && (n10 += a10), n10 += r10[o10], (i11 = s10[n10]) !== undefined) {
                      if (["string", "number", "boolean"].indexOf(typeof i11) > -1 && o10 < r10.length - 1)
                        continue;
                      t11 += o10 - t11 + 1;
                      break;
                    }
                  s10 = i11;
                }
                return s10;
              }, ec = (t10) => t10 && t10.replace("_", "-"), eh = {
                type: "logger",
                log(t10) {
                  this.output("log", t10);
                },
                warn(t10) {
                  this.output("warn", t10);
                },
                error(t10) {
                  this.output("error", t10);
                },
                output(t10, i10) {
                  console && console[t10] && console[t10].apply(console, i10);
                }
              }, ep = new class t10 {
                constructor(t11) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                  this.init(t11, i10);
                }
                init(t11) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                  this.prefix = i10.prefix || "i18next:", this.logger = t11 || eh, this.options = i10, this.debug = i10.debug;
                }
                log() {
                  var t11 = [...arguments];
                  return this.forward(t11, "log", "", true);
                }
                warn() {
                  var t11 = [...arguments];
                  return this.forward(t11, "warn", "", true);
                }
                error() {
                  var t11 = [...arguments];
                  return this.forward(t11, "error", "");
                }
                deprecate() {
                  var t11 = [...arguments];
                  return this.forward(t11, "warn", "WARNING DEPRECATED: ", true);
                }
                forward(t11, i10, a10, r10) {
                  return r10 && !this.debug ? null : (q(t11[0]) && (t11[0] = `${a10}${this.prefix} ${t11[0]}`), this.logger[i10](t11));
                }
                create(i10) {
                  return new t10(this.logger, { prefix: `${this.prefix}:${i10}:`, ...this.options });
                }
                clone(i10) {
                  return (i10 ||= this.options).prefix = i10.prefix || this.prefix, new t10(this.logger, i10);
                }
              }, ef = class {
                constructor() {
                  this.observers = {};
                }
                on(t10, i10) {
                  return t10.split(" ").forEach((t11) => {
                    this.observers[t11] || (this.observers[t11] = new Map);
                    let a10 = this.observers[t11].get(i10) || 0;
                    this.observers[t11].set(i10, a10 + 1);
                  }), this;
                }
                off(t10, i10) {
                  if (this.observers[t10]) {
                    if (!i10) {
                      delete this.observers[t10];
                      return;
                    }
                    this.observers[t10].delete(i10);
                  }
                }
                emit(t10) {
                  var i10 = [...arguments].slice(1);
                  this.observers[t10] && Array.from(this.observers[t10].entries()).forEach((t11) => {
                    let [a10, r10] = t11;
                    for (let t12 = 0;t12 < r10; t12++)
                      a10(...i10);
                  }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach((a10) => {
                    let [r10, s10] = a10;
                    for (let a11 = 0;a11 < s10; a11++)
                      r10.apply(r10, [t10, ...i10]);
                  });
                }
              }, eg = class extends ef {
                constructor(t10) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { ns: ["translation"], defaultNS: "translation" };
                  super(), this.data = t10 || {}, this.options = i10, this.options.keySeparator === undefined && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === undefined && (this.options.ignoreJSONStructure = true);
                }
                addNamespaces(t10) {
                  0 > this.options.ns.indexOf(t10) && this.options.ns.push(t10);
                }
                removeNamespaces(t10) {
                  let i10 = this.options.ns.indexOf(t10);
                  i10 > -1 && this.options.ns.splice(i10, 1);
                }
                getResource(t10, i10, a10) {
                  let r10 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {}, s10 = r10.keySeparator === undefined ? this.options.keySeparator : r10.keySeparator, n10 = r10.ignoreJSONStructure === undefined ? this.options.ignoreJSONStructure : r10.ignoreJSONStructure, o10;
                  t10.indexOf(".") > -1 ? o10 = t10.split(".") : (o10 = [t10, i10], a10 && (Array.isArray(a10) ? o10.push(...a10) : q(a10) && s10 ? o10.push(...a10.split(s10)) : o10.push(a10)));
                  let l2 = ee(this.data, o10);
                  return !l2 && !i10 && !a10 && t10.indexOf(".") > -1 && (t10 = o10[0], i10 = o10[1], a10 = o10.slice(2).join(".")), !l2 && n10 && q(a10) ? eu(this.data && this.data[t10] && this.data[t10][i10], a10, s10) : l2;
                }
                addResource(t10, i10, a10, r10) {
                  let s10 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { silent: false }, n10 = s10.keySeparator === undefined ? this.options.keySeparator : s10.keySeparator, o10 = [t10, i10];
                  a10 && (o10 = o10.concat(n10 ? a10.split(n10) : a10)), t10.indexOf(".") > -1 && (o10 = t10.split("."), r10 = i10, i10 = o10[1]), this.addNamespaces(i10), Q(this.data, o10, r10), s10.silent || this.emit("added", t10, i10, a10, r10);
                }
                addResources(t10, i10, a10) {
                  let r10 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { silent: false };
                  for (let r11 in a10)
                    (q(a10[r11]) || Array.isArray(a10[r11])) && this.addResource(t10, i10, r11, a10[r11], { silent: true });
                  r10.silent || this.emit("added", t10, i10, a10);
                }
                addResourceBundle(t10, i10, a10, r10, s10) {
                  let n10 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : { silent: false, skipCopy: false }, o10 = [t10, i10];
                  t10.indexOf(".") > -1 && (o10 = t10.split("."), r10 = a10, a10 = i10, i10 = o10[1]), this.addNamespaces(i10);
                  let l2 = ee(this.data, o10) || {};
                  n10.skipCopy || (a10 = JSON.parse(JSON.stringify(a10))), r10 ? ei(l2, a10, s10) : l2 = { ...l2, ...a10 }, Q(this.data, o10, l2), n10.silent || this.emit("added", t10, i10, a10);
                }
                removeResourceBundle(t10, i10) {
                  this.hasResourceBundle(t10, i10) && delete this.data[t10][i10], this.removeNamespaces(i10), this.emit("removed", t10, i10);
                }
                hasResourceBundle(t10, i10) {
                  return this.getResource(t10, i10) !== undefined;
                }
                getResourceBundle(t10, i10) {
                  return i10 ||= this.options.defaultNS, this.options.compatibilityAPI === "v1" ? { ...this.getResource(t10, i10) } : this.getResource(t10, i10);
                }
                getDataByLanguage(t10) {
                  return this.data[t10];
                }
                hasLanguageSomeTranslations(t10) {
                  let i10 = this.getDataByLanguage(t10);
                  return !!(i10 && Object.keys(i10) || []).find((t11) => i10[t11] && Object.keys(i10[t11]).length > 0);
                }
                toJSON() {
                  return this.data;
                }
              }, ev = {
                processors: {},
                addPostProcessor(t10) {
                  this.processors[t10.name] = t10;
                },
                handle(t10, i10, a10, r10, s10) {
                  return t10.forEach((t11) => {
                    this.processors[t11] && (i10 = this.processors[t11].process(i10, a10, r10, s10));
                  }), i10;
                }
              }, em = {}, ey = class t10 extends ef {
                constructor(t11) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                  super(), z(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], t11, this), this.options = i10, this.options.keySeparator === undefined && (this.options.keySeparator = "."), this.logger = ep.create("translator");
                }
                changeLanguage(t11) {
                  t11 && (this.language = t11);
                }
                exists(t11) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { interpolation: {} };
                  if (t11 == null)
                    return false;
                  let a10 = this.resolve(t11, i10);
                  return a10 && a10.res !== undefined;
                }
                extractFromKey(t11, i10) {
                  let a10 = i10.nsSeparator === undefined ? this.options.nsSeparator : i10.nsSeparator;
                  a10 === undefined && (a10 = ":");
                  let r10 = i10.keySeparator === undefined ? this.options.keySeparator : i10.keySeparator, s10 = i10.ns || this.options.defaultNS || [], n10 = a10 && t11.indexOf(a10) > -1, o10 = !this.options.userDefinedKeySeparator && !i10.keySeparator && !this.options.userDefinedNsSeparator && !i10.nsSeparator && !ed(t11, a10, r10);
                  if (n10 && !o10) {
                    let i11 = t11.match(this.interpolator.nestingRegexp);
                    if (i11 && i11.length > 0)
                      return { key: t11, namespaces: q(s10) ? [s10] : s10 };
                    let n11 = t11.split(a10);
                    (a10 !== r10 || a10 === r10 && this.options.ns.indexOf(n11[0]) > -1) && (s10 = n11.shift()), t11 = n11.join(r10);
                  }
                  return { key: t11, namespaces: q(s10) ? [s10] : s10 };
                }
                translate(i10, a10, r10) {
                  if (typeof a10 != "object" && this.options.overloadTranslationOptionHandler && (a10 = this.options.overloadTranslationOptionHandler(arguments)), typeof a10 == "object" && (a10 = { ...a10 }), a10 ||= {}, i10 == null)
                    return "";
                  Array.isArray(i10) || (i10 = [String(i10)]);
                  let s10 = a10.returnDetails === undefined ? this.options.returnDetails : a10.returnDetails, n10 = a10.keySeparator === undefined ? this.options.keySeparator : a10.keySeparator, { key: o10, namespaces: l2 } = this.extractFromKey(i10[i10.length - 1], a10), d2 = l2[l2.length - 1], u2 = a10.lng || this.language, c2 = a10.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
                  if (u2 && u2.toLowerCase() === "cimode") {
                    if (c2) {
                      let t11 = a10.nsSeparator || this.options.nsSeparator;
                      return s10 ? { res: `${d2}${t11}${o10}`, usedKey: o10, exactUsedKey: o10, usedLng: u2, usedNS: d2, usedParams: this.getUsedParamsDetails(a10) } : `${d2}${t11}${o10}`;
                    }
                    return s10 ? { res: o10, usedKey: o10, exactUsedKey: o10, usedLng: u2, usedNS: d2, usedParams: this.getUsedParamsDetails(a10) } : o10;
                  }
                  let h2 = this.resolve(i10, a10), p2 = h2 && h2.res, f2 = h2 && h2.usedKey || o10, g2 = h2 && h2.exactUsedKey || o10, v2 = Object.prototype.toString.apply(p2), m2 = a10.joinArrays === undefined ? this.options.joinArrays : a10.joinArrays, y2 = !this.i18nFormat || this.i18nFormat.handleAsObject, _2 = !q(p2) && typeof p2 != "boolean" && typeof p2 != "number";
                  if (y2 && p2 && _2 && 0 > ["[object Number]", "[object Function]", "[object RegExp]"].indexOf(v2) && !(q(m2) && Array.isArray(p2))) {
                    if (!a10.returnObjects && !this.options.returnObjects) {
                      this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
                      let t11 = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(f2, p2, { ...a10, ns: l2 }) : `key '${o10} (${this.language})' returned an object instead of string.`;
                      return s10 ? (h2.res = t11, h2.usedParams = this.getUsedParamsDetails(a10), h2) : t11;
                    }
                    if (n10) {
                      let t11 = Array.isArray(p2), i11 = t11 ? [] : {}, r11 = t11 ? g2 : f2;
                      for (let t12 in p2)
                        if (Object.prototype.hasOwnProperty.call(p2, t12)) {
                          let s11 = `${r11}${n10}${t12}`;
                          i11[t12] = this.translate(s11, { ...a10, joinArrays: false, ns: l2 }), i11[t12] === s11 && (i11[t12] = p2[t12]);
                        }
                      p2 = i11;
                    }
                  } else if (y2 && q(m2) && Array.isArray(p2))
                    p2 = p2.join(m2), p2 &&= this.extendTranslation(p2, i10, a10, r10);
                  else {
                    let s11 = false, l3 = false, c3 = a10.count !== undefined && !q(a10.count), f3 = t10.hasDefaultValue(a10), g3 = c3 ? this.pluralResolver.getSuffix(u2, a10.count, a10) : "", v3 = a10.ordinal && c3 ? this.pluralResolver.getSuffix(u2, a10.count, { ordinal: false }) : "", m3 = c3 && !a10.ordinal && a10.count === 0 && this.pluralResolver.shouldUseIntlApi(), y3 = m3 && a10[`defaultValue${this.options.pluralSeparator}zero`] || a10[`defaultValue${g3}`] || a10[`defaultValue${v3}`] || a10.defaultValue;
                    !this.isValidLookup(p2) && f3 && (s11 = true, p2 = y3), this.isValidLookup(p2) || (l3 = true, p2 = o10);
                    let _3 = (a10.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && l3 ? undefined : p2, b2 = f3 && y3 !== p2 && this.options.updateMissing;
                    if (l3 || s11 || b2) {
                      if (this.logger.log(b2 ? "updateKey" : "missingKey", u2, d2, o10, b2 ? y3 : p2), n10) {
                        let t12 = this.resolve(o10, { ...a10, keySeparator: false });
                        t12 && t12.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
                      }
                      let t11 = [], i11 = this.languageUtils.getFallbackCodes(this.options.fallbackLng, a10.lng || this.language);
                      if (this.options.saveMissingTo === "fallback" && i11 && i11[0])
                        for (let a11 = 0;a11 < i11.length; a11++)
                          t11.push(i11[a11]);
                      else
                        this.options.saveMissingTo === "all" ? t11 = this.languageUtils.toResolveHierarchy(a10.lng || this.language) : t11.push(a10.lng || this.language);
                      let r11 = (t12, i12, r12) => {
                        let s12 = f3 && r12 !== p2 ? r12 : _3;
                        this.options.missingKeyHandler ? this.options.missingKeyHandler(t12, d2, i12, s12, b2, a10) : this.backendConnector && this.backendConnector.saveMissing && this.backendConnector.saveMissing(t12, d2, i12, s12, b2, a10), this.emit("missingKey", t12, d2, i12, p2);
                      };
                      this.options.saveMissing && (this.options.saveMissingPlurals && c3 ? t11.forEach((t12) => {
                        let i12 = this.pluralResolver.getSuffixes(t12, a10);
                        m3 && a10[`defaultValue${this.options.pluralSeparator}zero`] && 0 > i12.indexOf(`${this.options.pluralSeparator}zero`) && i12.push(`${this.options.pluralSeparator}zero`), i12.forEach((i13) => {
                          r11([t12], o10 + i13, a10[`defaultValue${i13}`] || y3);
                        });
                      }) : r11(t11, o10, y3));
                    }
                    p2 = this.extendTranslation(p2, i10, a10, h2, r10), l3 && p2 === o10 && this.options.appendNamespaceToMissingKey && (p2 = `${d2}:${o10}`), (l3 || s11) && this.options.parseMissingKeyHandler && (p2 = this.options.compatibilityAPI === "v1" ? this.options.parseMissingKeyHandler(p2) : this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${d2}:${o10}` : o10, s11 ? p2 : undefined));
                  }
                  return s10 ? (h2.res = p2, h2.usedParams = this.getUsedParamsDetails(a10), h2) : p2;
                }
                extendTranslation(t11, i10, a10, r10, s10) {
                  var n10 = this;
                  if (this.i18nFormat && this.i18nFormat.parse)
                    t11 = this.i18nFormat.parse(t11, { ...this.options.interpolation.defaultVariables, ...a10 }, a10.lng || this.language || r10.usedLng, r10.usedNS, r10.usedKey, {
                      resolved: r10
                    });
                  else if (!a10.skipInterpolation) {
                    a10.interpolation && this.interpolator.init({ ...a10, interpolation: { ...this.options.interpolation, ...a10.interpolation } });
                    let o11 = q(t11) && (a10 && a10.interpolation && a10.interpolation.skipOnVariables !== undefined ? a10.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables), l3;
                    if (o11) {
                      let i11 = t11.match(this.interpolator.nestingRegexp);
                      l3 = i11 && i11.length;
                    }
                    let d2 = a10.replace && !q(a10.replace) ? a10.replace : a10;
                    if (this.options.interpolation.defaultVariables && (d2 = { ...this.options.interpolation.defaultVariables, ...d2 }), t11 = this.interpolator.interpolate(t11, d2, a10.lng || this.language || r10.usedLng, a10), o11) {
                      let i11 = t11.match(this.interpolator.nestingRegexp);
                      l3 < (i11 && i11.length) && (a10.nest = false);
                    }
                    !a10.lng && this.options.compatibilityAPI !== "v1" && r10 && r10.res && (a10.lng = this.language || r10.usedLng), a10.nest !== false && (t11 = this.interpolator.nest(t11, function() {
                      var t12 = [...arguments];
                      return s10 && s10[0] === t12[0] && !a10.context ? (n10.logger.warn(`It seems you are nesting recursively key: ${t12[0]} in key: ${i10[0]}`), null) : n10.translate(...t12, i10);
                    }, a10)), a10.interpolation && this.interpolator.reset();
                  }
                  let o10 = a10.postProcess || this.options.postProcess, l2 = q(o10) ? [o10] : o10;
                  return t11 != null && l2 && l2.length && a10.applyPostProcessor !== false && (t11 = ev.handle(l2, t11, i10, this.options && this.options.postProcessPassResolved ? { i18nResolved: { ...r10, usedParams: this.getUsedParamsDetails(a10) }, ...a10 } : a10, this)), t11;
                }
                resolve(t11) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, a10, r10, s10, n10, o10;
                  return q(t11) && (t11 = [t11]), t11.forEach((t12) => {
                    if (this.isValidLookup(a10))
                      return;
                    let l2 = this.extractFromKey(t12, i10), d2 = l2.key;
                    r10 = d2;
                    let u2 = l2.namespaces;
                    this.options.fallbackNS && (u2 = u2.concat(this.options.fallbackNS));
                    let c2 = i10.count !== undefined && !q(i10.count), h2 = c2 && !i10.ordinal && i10.count === 0 && this.pluralResolver.shouldUseIntlApi(), p2 = i10.context !== undefined && (q(i10.context) || typeof i10.context == "number") && i10.context !== "", f2 = i10.lngs ? i10.lngs : this.languageUtils.toResolveHierarchy(i10.lng || this.language, i10.fallbackLng);
                    u2.forEach((t13) => {
                      this.isValidLookup(a10) || (o10 = t13, !em[`${f2[0]}-${t13}`] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(o10) && (em[`${f2[0]}-${t13}`] = true, this.logger.warn(`key "${r10}" for languages "${f2.join(", ")}" won't get resolved as namespace "${o10}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), f2.forEach((r11) => {
                        let o11;
                        if (this.isValidLookup(a10))
                          return;
                        n10 = r11;
                        let l3 = [d2];
                        if (this.i18nFormat && this.i18nFormat.addLookupKeys)
                          this.i18nFormat.addLookupKeys(l3, d2, r11, t13, i10);
                        else {
                          let t14;
                          c2 && (t14 = this.pluralResolver.getSuffix(r11, i10.count, i10));
                          let a11 = `${this.options.pluralSeparator}zero`, s11 = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
                          if (c2 && (l3.push(d2 + t14), i10.ordinal && t14.indexOf(s11) === 0 && l3.push(d2 + t14.replace(s11, this.options.pluralSeparator)), h2 && l3.push(d2 + a11)), p2) {
                            let r12 = `${d2}${this.options.contextSeparator}${i10.context}`;
                            l3.push(r12), c2 && (l3.push(r12 + t14), i10.ordinal && t14.indexOf(s11) === 0 && l3.push(r12 + t14.replace(s11, this.options.pluralSeparator)), h2 && l3.push(r12 + a11));
                          }
                        }
                        for (;o11 = l3.pop(); )
                          this.isValidLookup(a10) || (s10 = o11, a10 = this.getResource(r11, t13, o11, i10));
                      }));
                    });
                  }), { res: a10, usedKey: r10, exactUsedKey: s10, usedLng: n10, usedNS: o10 };
                }
                isValidLookup(t11) {
                  return t11 !== undefined && !(!this.options.returnNull && t11 === null) && !(!this.options.returnEmptyString && t11 === "");
                }
                getResource(t11, i10, a10) {
                  let r10 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                  return this.i18nFormat && this.i18nFormat.getResource ? this.i18nFormat.getResource(t11, i10, a10, r10) : this.resourceStore.getResource(t11, i10, a10, r10);
                }
                getUsedParamsDetails() {
                  let t11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, i10 = t11.replace && !q(t11.replace), a10 = i10 ? t11.replace : t11;
                  if (i10 && t11.count !== undefined && (a10.count = t11.count), this.options.interpolation.defaultVariables && (a10 = { ...this.options.interpolation.defaultVariables, ...a10 }), !i10)
                    for (let t12 of (a10 = { ...a10 }, [
                      "defaultValue",
                      "ordinal",
                      "context",
                      "replace",
                      "lng",
                      "lngs",
                      "fallbackLng",
                      "ns",
                      "keySeparator",
                      "nsSeparator",
                      "returnObjects",
                      "returnDetails",
                      "joinArrays",
                      "postProcess",
                      "interpolation"
                    ]))
                      delete a10[t12];
                  return a10;
                }
                static hasDefaultValue(t11) {
                  for (let i10 in t11)
                    if (Object.prototype.hasOwnProperty.call(t11, i10) && i10.substring(0, 12) === "defaultValue" && t11[i10] !== undefined)
                      return true;
                  return false;
                }
              }, e_ = (t10) => t10.charAt(0).toUpperCase() + t10.slice(1), eb = class {
                constructor(t10) {
                  this.options = t10, this.supportedLngs = this.options.supportedLngs || false, this.logger = ep.create("languageUtils");
                }
                getScriptPartFromCode(t10) {
                  if (!(t10 = ec(t10)) || 0 > t10.indexOf("-"))
                    return null;
                  let i10 = t10.split("-");
                  return i10.length === 2 || (i10.pop(), i10[i10.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(i10.join("-"));
                }
                getLanguagePartFromCode(t10) {
                  if (!(t10 = ec(t10)) || 0 > t10.indexOf("-"))
                    return t10;
                  let i10 = t10.split("-");
                  return this.formatLanguageCode(i10[0]);
                }
                formatLanguageCode(t10) {
                  if (q(t10) && t10.indexOf("-") > -1) {
                    if ("u" > typeof Intl && Intl.getCanonicalLocales !== undefined)
                      try {
                        let i11 = Intl.getCanonicalLocales(t10)[0];
                        if (i11 && this.options.lowerCaseLng && (i11 = i11.toLowerCase()), i11)
                          return i11;
                      } catch {}
                    let i10 = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"], a10 = t10.split("-");
                    return this.options.lowerCaseLng ? a10 = a10.map((t11) => t11.toLowerCase()) : a10.length === 2 ? (a10[0] = a10[0].toLowerCase(), a10[1] = a10[1].toUpperCase(), i10.indexOf(a10[1].toLowerCase()) > -1 && (a10[1] = e_(a10[1].toLowerCase()))) : a10.length === 3 && (a10[0] = a10[0].toLowerCase(), a10[1].length === 2 && (a10[1] = a10[1].toUpperCase()), a10[0] !== "sgn" && a10[2].length === 2 && (a10[2] = a10[2].toUpperCase()), i10.indexOf(a10[1].toLowerCase()) > -1 && (a10[1] = e_(a10[1].toLowerCase())), i10.indexOf(a10[2].toLowerCase()) > -1 && (a10[2] = e_(a10[2].toLowerCase()))), a10.join("-");
                  }
                  return this.options.cleanCode || this.options.lowerCaseLng ? t10.toLowerCase() : t10;
                }
                isSupportedCode(t10) {
                  return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (t10 = this.getLanguagePartFromCode(t10)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(t10) > -1;
                }
                getBestMatchFromCodes(t10) {
                  let i10;
                  return t10 ? (t10.forEach((t11) => {
                    if (i10)
                      return;
                    let a10 = this.formatLanguageCode(t11);
                    (!this.options.supportedLngs || this.isSupportedCode(a10)) && (i10 = a10);
                  }), !i10 && this.options.supportedLngs && t10.forEach((t11) => {
                    if (i10)
                      return;
                    let a10 = this.getLanguagePartFromCode(t11);
                    if (this.isSupportedCode(a10))
                      return i10 = a10;
                    i10 = this.options.supportedLngs.find((t12) => {
                      if (t12 === a10 || !(0 > t12.indexOf("-") && 0 > a10.indexOf("-")) && (t12.indexOf("-") > 0 && 0 > a10.indexOf("-") && t12.substring(0, t12.indexOf("-")) === a10 || t12.indexOf(a10) === 0 && a10.length > 1))
                        return t12;
                    });
                  }), i10 ||= this.getFallbackCodes(this.options.fallbackLng)[0]) : null;
                }
                getFallbackCodes(t10, i10) {
                  if (!t10)
                    return [];
                  if (typeof t10 == "function" && (t10 = t10(i10)), q(t10) && (t10 = [t10]), Array.isArray(t10))
                    return t10;
                  if (!i10)
                    return t10.default || [];
                  let a10 = t10[i10];
                  return a10 ||= t10[this.getScriptPartFromCode(i10)], a10 ||= t10[this.formatLanguageCode(i10)], a10 ||= t10[this.getLanguagePartFromCode(i10)], (a10 ||= t10.default) || [];
                }
                toResolveHierarchy(t10, i10) {
                  let a10 = this.getFallbackCodes(i10 || this.options.fallbackLng || [], t10), r10 = [], s10 = (t11) => {
                    t11 && (this.isSupportedCode(t11) ? r10.push(t11) : this.logger.warn(`rejecting language code not found in supportedLngs: ${t11}`));
                  };
                  return q(t10) && (t10.indexOf("-") > -1 || t10.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && s10(this.formatLanguageCode(t10)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && s10(this.getScriptPartFromCode(t10)), this.options.load !== "currentOnly" && s10(this.getLanguagePartFromCode(t10))) : q(t10) && s10(this.formatLanguageCode(t10)), a10.forEach((t11) => {
                    0 > r10.indexOf(t11) && s10(this.formatLanguageCode(t11));
                  }), r10;
                }
              }, ek = [
                {
                  lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
                  nr: [1, 2],
                  fc: 1
                },
                {
                  lngs: "af.an.ast.az.bg.bn.ca.da.de.dev.el.en.eo.es.et.eu.fi.fo.fur.fy.gl.gu.ha.hi.hu.hy.ia.it.kk.kn.ku.lb.mai.ml.mn.mr.nah.nap.nb.ne.nl.nn.no.nso.pa.pap.pms.ps.pt-PT.rm.sco.se.si.so.son.sq.sv.sw.ta.te.tk.ur.yo".split("."),
                  nr: [1, 2],
                  fc: 2
                },
                {
                  lngs: [
                    "ay",
                    "bo",
                    "cgg",
                    "fa",
                    "ht",
                    "id",
                    "ja",
                    "jbo",
                    "ka",
                    "km",
                    "ko",
                    "ky",
                    "lo",
                    "ms",
                    "sah",
                    "su",
                    "th",
                    "tt",
                    "ug",
                    "vi",
                    "wo",
                    "zh"
                  ],
                  nr: [1],
                  fc: 3
                },
                { lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"], nr: [1, 2, 5], fc: 4 },
                { lngs: ["ar"], nr: [0, 1, 2, 3, 11, 100], fc: 5 },
                { lngs: ["cs", "sk"], nr: [1, 2, 5], fc: 6 },
                { lngs: ["csb", "pl"], nr: [1, 2, 5], fc: 7 },
                { lngs: ["cy"], nr: [1, 2, 3, 8], fc: 8 },
                { lngs: ["fr"], nr: [1, 2], fc: 9 },
                { lngs: ["ga"], nr: [1, 2, 3, 7, 11], fc: 10 },
                { lngs: ["gd"], nr: [1, 2, 3, 20], fc: 11 },
                { lngs: ["is"], nr: [1, 2], fc: 12 },
                { lngs: ["jv"], nr: [0, 1], fc: 13 },
                { lngs: ["kw"], nr: [1, 2, 3, 4], fc: 14 },
                { lngs: ["lt"], nr: [1, 2, 10], fc: 15 },
                { lngs: ["lv"], nr: [1, 2, 0], fc: 16 },
                { lngs: ["mk"], nr: [1, 2], fc: 17 },
                { lngs: ["mnk"], nr: [0, 1, 2], fc: 18 },
                { lngs: ["mt"], nr: [1, 2, 11, 20], fc: 19 },
                { lngs: ["or"], nr: [2, 1], fc: 2 },
                { lngs: ["ro"], nr: [1, 2, 20], fc: 20 },
                { lngs: ["sl"], nr: [5, 1, 2, 3], fc: 21 },
                { lngs: ["he", "iw"], nr: [1, 2, 20, 21], fc: 22 }
              ], eC = {
                1: (t10) => Number(t10 > 1),
                2: (t10) => Number(t10 != 1),
                3: (t10) => 0,
                4: (t10) => Number(t10 % 10 == 1 && t10 % 100 != 11 ? 0 : t10 % 10 >= 2 && t10 % 10 <= 4 && (t10 % 100 < 10 || t10 % 100 >= 20) ? 1 : 2),
                5: (t10) => Number(t10 == 0 ? 0 : t10 == 1 ? 1 : t10 == 2 ? 2 : t10 % 100 >= 3 && t10 % 100 <= 10 ? 3 : t10 % 100 >= 11 ? 4 : 5),
                6: (t10) => Number(t10 == 1 ? 0 : t10 >= 2 && t10 <= 4 ? 1 : 2),
                7: (t10) => Number(t10 == 1 ? 0 : t10 % 10 >= 2 && t10 % 10 <= 4 && (t10 % 100 < 10 || t10 % 100 >= 20) ? 1 : 2),
                8: (t10) => Number(t10 == 1 ? 0 : t10 == 2 ? 1 : t10 != 8 && t10 != 11 ? 2 : 3),
                9: (t10) => Number(t10 >= 2),
                10: (t10) => Number(t10 == 1 ? 0 : t10 == 2 ? 1 : t10 < 7 ? 2 : t10 < 11 ? 3 : 4),
                11: (t10) => Number(t10 == 1 || t10 == 11 ? 0 : t10 == 2 || t10 == 12 ? 1 : t10 > 2 && t10 < 20 ? 2 : 3),
                12: (t10) => Number(t10 % 10 != 1 || t10 % 100 == 11),
                13: (t10) => Number(t10 !== 0),
                14: (t10) => Number(t10 == 1 ? 0 : t10 == 2 ? 1 : t10 == 3 ? 2 : 3),
                15: (t10) => Number(t10 % 10 == 1 && t10 % 100 != 11 ? 0 : t10 % 10 >= 2 && (t10 % 100 < 10 || t10 % 100 >= 20) ? 1 : 2),
                16: (t10) => Number(t10 % 10 == 1 && t10 % 100 != 11 ? 0 : t10 === 0 ? 2 : 1),
                17: (t10) => Number(t10 == 1 || t10 % 10 == 1 && t10 % 100 != 11 ? 0 : 1),
                18: (t10) => Number(t10 == 0 ? 0 : t10 == 1 ? 1 : 2),
                19: (t10) => Number(t10 == 1 ? 0 : t10 == 0 || t10 % 100 > 1 && t10 % 100 < 11 ? 1 : t10 % 100 > 10 && t10 % 100 < 20 ? 2 : 3),
                20: (t10) => Number(t10 == 1 ? 0 : t10 == 0 || t10 % 100 > 0 && t10 % 100 < 20 ? 1 : 2),
                21: (t10) => Number(t10 % 100 == 1 ? 1 : t10 % 100 == 2 ? 2 : t10 % 100 == 3 || t10 % 100 == 4 ? 3 : 0),
                22: (t10) => Number(t10 == 1 ? 0 : t10 == 2 ? 1 : (t10 < 0 || t10 > 10) && t10 % 10 == 0 ? 2 : 3)
              }, ew = ["v1", "v2", "v3"], ex2 = ["v4"], eE = { zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5 }, eS = () => {
                let t10 = {};
                return ek.forEach((i10) => {
                  i10.lngs.forEach((a10) => {
                    t10[a10] = { numbers: i10.nr, plurals: eC[i10.fc] };
                  });
                }), t10;
              }, eT = class {
                constructor(t10) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                  this.languageUtils = t10, this.options = i10, this.logger = ep.create("pluralResolver"), (!this.options.compatibilityJSON || ex2.includes(this.options.compatibilityJSON)) && (typeof Intl > "u" || !Intl.PluralRules) && (this.options.compatibilityJSON = "v3", this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.")), this.rules = eS(), this.pluralRulesCache = {};
                }
                addRule(t10, i10) {
                  this.rules[t10] = i10;
                }
                clearCache() {
                  this.pluralRulesCache = {};
                }
                getRule(t10) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                  if (this.shouldUseIntlApi()) {
                    let a10, r10 = ec(t10 === "dev" ? "en" : t10), s10 = i10.ordinal ? "ordinal" : "cardinal", n10 = JSON.stringify({ cleanedCode: r10, type: s10 });
                    if (n10 in this.pluralRulesCache)
                      return this.pluralRulesCache[n10];
                    try {
                      a10 = new Intl.PluralRules(r10, { type: s10 });
                    } catch {
                      if (!t10.match(/-|_/))
                        return;
                      let r11 = this.languageUtils.getLanguagePartFromCode(t10);
                      a10 = this.getRule(r11, i10);
                    }
                    return this.pluralRulesCache[n10] = a10, a10;
                  }
                  return this.rules[t10] || this.rules[this.languageUtils.getLanguagePartFromCode(t10)];
                }
                needsPlural(t10) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, a10 = this.getRule(t10, i10);
                  return this.shouldUseIntlApi() ? a10 && a10.resolvedOptions().pluralCategories.length > 1 : a10 && a10.numbers.length > 1;
                }
                getPluralFormsOfKey(t10, i10) {
                  let a10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                  return this.getSuffixes(t10, a10).map((t11) => `${i10}${t11}`);
                }
                getSuffixes(t10) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, a10 = this.getRule(t10, i10);
                  return a10 ? this.shouldUseIntlApi() ? a10.resolvedOptions().pluralCategories.sort((t11, i11) => eE[t11] - eE[i11]).map((t11) => `${this.options.prepend}${i10.ordinal ? `ordinal${this.options.prepend}` : ""}${t11}`) : a10.numbers.map((a11) => this.getSuffix(t10, a11, i10)) : [];
                }
                getSuffix(t10, i10) {
                  let a10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, r10 = this.getRule(t10, a10);
                  return r10 ? this.shouldUseIntlApi() ? `${this.options.prepend}${a10.ordinal ? `ordinal${this.options.prepend}` : ""}${r10.select(i10)}` : this.getSuffixRetroCompatible(r10, i10) : (this.logger.warn(`no plural rule found for: ${t10}`), "");
                }
                getSuffixRetroCompatible(t10, i10) {
                  let a10 = t10.noAbs ? t10.plurals(i10) : t10.plurals(Math.abs(i10)), r10 = t10.numbers[a10];
                  this.options.simplifyPluralSuffix && t10.numbers.length === 2 && t10.numbers[0] === 1 && (r10 === 2 ? r10 = "plural" : r10 === 1 && (r10 = ""));
                  let s10 = () => this.options.prepend && r10.toString() ? this.options.prepend + r10.toString() : r10.toString();
                  return this.options.compatibilityJSON === "v1" ? r10 === 1 ? "" : typeof r10 == "number" ? `_plural_${r10.toString()}` : s10() : this.options.compatibilityJSON === "v2" || this.options.simplifyPluralSuffix && t10.numbers.length === 2 && t10.numbers[0] === 1 ? s10() : this.options.prepend && a10.toString() ? this.options.prepend + a10.toString() : a10.toString();
                }
                shouldUseIntlApi() {
                  return !ew.includes(this.options.compatibilityJSON);
                }
              }, eP = function(t10, i10, a10) {
                let r10 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ".", s10 = !(arguments.length > 4) || arguments[4] === undefined || arguments[4], n10 = et(t10, i10, a10);
                return !n10 && s10 && q(a10) && (n10 = eu(t10, a10, r10)) === undefined && (n10 = eu(i10, a10, r10)), n10;
              }, eA = (t10) => t10.replace(/\$/g, "$$$$"), eL = class {
                constructor() {
                  let t10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                  this.logger = ep.create("interpolator"), this.options = t10, this.format = t10.interpolation && t10.interpolation.format || ((t11) => t11), this.init(t10);
                }
                init() {
                  let t10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                  t10.interpolation ||= { escapeValue: true };
                  let {
                    escape: i10,
                    escapeValue: a10,
                    useRawValueToEscape: r10,
                    prefix: s10,
                    prefixEscaped: n10,
                    suffix: o10,
                    suffixEscaped: l2,
                    formatSeparator: d2,
                    unescapeSuffix: u2,
                    unescapePrefix: c2,
                    nestingPrefix: h2,
                    nestingPrefixEscaped: p2,
                    nestingSuffix: f2,
                    nestingSuffixEscaped: g2,
                    nestingOptionsSeparator: v2,
                    maxReplaces: m2,
                    alwaysFormat: y2
                  } = t10.interpolation;
                  this.escape = i10 === undefined ? es : i10, this.escapeValue = a10 === undefined || a10, this.useRawValueToEscape = r10 !== undefined && r10, this.prefix = s10 ? ea(s10) : n10 || "{{", this.suffix = o10 ? ea(o10) : l2 || "}}", this.formatSeparator = d2 || ",", this.unescapePrefix = u2 ? "" : c2 || "-", this.unescapeSuffix = this.unescapePrefix ? "" : u2 || "", this.nestingPrefix = h2 ? ea(h2) : p2 || ea("$t("), this.nestingSuffix = f2 ? ea(f2) : g2 || ea(")"), this.nestingOptionsSeparator = v2 || ",", this.maxReplaces = m2 || 1000, this.alwaysFormat = y2 !== undefined && y2, this.resetRegExp();
                }
                reset() {
                  this.options && this.init(this.options);
                }
                resetRegExp() {
                  let t10 = (t11, i10) => t11 && t11.source === i10 ? (t11.lastIndex = 0, t11) : RegExp(i10, "g");
                  this.regexp = t10(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = t10(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = t10(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
                }
                interpolate(t10, i10, a10, r10) {
                  let s10, n10, o10, l2 = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, d2 = (t11) => {
                    if (0 > t11.indexOf(this.formatSeparator)) {
                      let s12 = eP(i10, l2, t11, this.options.keySeparator, this.options.ignoreJSONStructure);
                      return this.alwaysFormat ? this.format(s12, undefined, a10, { ...r10, ...i10, interpolationkey: t11 }) : s12;
                    }
                    let s11 = t11.split(this.formatSeparator), n11 = s11.shift().trim(), o11 = s11.join(this.formatSeparator).trim();
                    return this.format(eP(i10, l2, n11, this.options.keySeparator, this.options.ignoreJSONStructure), o11, a10, {
                      ...r10,
                      ...i10,
                      interpolationkey: n11
                    });
                  };
                  this.resetRegExp();
                  let u2 = r10 && r10.missingInterpolationHandler || this.options.missingInterpolationHandler, c2 = r10 && r10.interpolation && r10.interpolation.skipOnVariables !== undefined ? r10.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
                  return [
                    { regex: this.regexpUnescape, safeValue: (t11) => eA(t11) },
                    { regex: this.regexp, safeValue: (t11) => this.escapeValue ? eA(this.escape(t11)) : eA(t11) }
                  ].forEach((i11) => {
                    for (o10 = 0;s10 = i11.regex.exec(t10); ) {
                      let a11 = s10[1].trim();
                      if ((n10 = d2(a11)) === undefined) {
                        if (typeof u2 == "function") {
                          let i12 = u2(t10, s10, r10);
                          n10 = q(i12) ? i12 : "";
                        } else if (r10 && Object.prototype.hasOwnProperty.call(r10, a11))
                          n10 = "";
                        else if (c2) {
                          n10 = s10[0];
                          continue;
                        } else
                          this.logger.warn(`missed to pass in variable ${a11} for interpolating ${t10}`), n10 = "";
                      } else
                        q(n10) || this.useRawValueToEscape || (n10 = Z(n10));
                      let l3 = i11.safeValue(n10);
                      if (t10 = t10.replace(s10[0], l3), c2 ? (i11.regex.lastIndex += n10.length, i11.regex.lastIndex -= s10[0].length) : i11.regex.lastIndex = 0, ++o10 >= this.maxReplaces)
                        break;
                    }
                  }), t10;
                }
                nest(t10, i10) {
                  let a10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, r10, s10, n10, o10 = (t11, i11) => {
                    let a11 = this.nestingOptionsSeparator;
                    if (0 > t11.indexOf(a11))
                      return t11;
                    let r11 = t11.split(RegExp(`${a11}[ ]*{`)), s11 = `{${r11[1]}`;
                    t11 = r11[0];
                    let o11 = (s11 = this.interpolate(s11, n10)).match(/'/g), l2 = s11.match(/"/g);
                    (o11 && o11.length % 2 == 0 && !l2 || l2.length % 2 != 0) && (s11 = s11.replace(/'/g, '"'));
                    try {
                      n10 = JSON.parse(s11), i11 && (n10 = { ...i11, ...n10 });
                    } catch (i12) {
                      return this.logger.warn(`failed parsing options string in nesting for key ${t11}`, i12), `${t11}${a11}${s11}`;
                    }
                    return n10.defaultValue && n10.defaultValue.indexOf(this.prefix) > -1 && delete n10.defaultValue, t11;
                  };
                  for (;r10 = this.nestingRegexp.exec(t10); ) {
                    let l2 = [];
                    (n10 = (n10 = { ...a10 }).replace && !q(n10.replace) ? n10.replace : n10).applyPostProcessor = false, delete n10.defaultValue;
                    let d2 = false;
                    if (r10[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(r10[1])) {
                      let t11 = r10[1].split(this.formatSeparator).map((t12) => t12.trim());
                      r10[1] = t11.shift(), l2 = t11, d2 = true;
                    }
                    if ((s10 = i10(o10.call(this, r10[1].trim(), n10), n10)) && r10[0] === t10 && !q(s10))
                      return s10;
                    q(s10) || (s10 = Z(s10)), s10 ||= (this.logger.warn(`missed to resolve ${r10[1]} for nesting ${t10}`), ""), d2 && (s10 = l2.reduce((t11, i11) => this.format(t11, i11, a10.lng, { ...a10, interpolationkey: r10[1].trim() }), s10.trim())), t10 = t10.replace(r10[0], s10), this.regexp.lastIndex = 0;
                  }
                  return t10;
                }
              }, eI = (t10) => {
                let i10 = t10.toLowerCase().trim(), a10 = {};
                if (t10.indexOf("(") > -1) {
                  let r10 = t10.split("(");
                  i10 = r10[0].toLowerCase().trim();
                  let s10 = r10[1].substring(0, r10[1].length - 1);
                  i10 === "currency" && 0 > s10.indexOf(":") ? a10.currency ||= s10.trim() : i10 === "relativetime" && 0 > s10.indexOf(":") ? a10.range ||= s10.trim() : s10.split(";").forEach((t11) => {
                    if (t11) {
                      let [i11, ...r11] = t11.split(":"), s11 = r11.join(":").trim().replace(/^'+|'+$/g, ""), n10 = i11.trim();
                      a10[n10] || (a10[n10] = s11), s11 === "false" && (a10[n10] = false), s11 === "true" && (a10[n10] = true), isNaN(s11) || (a10[n10] = parseInt(s11, 10));
                    }
                  });
                }
                return { formatName: i10, formatOptions: a10 };
              }, eR = (t10) => {
                let i10 = {};
                return (a10, r10, s10) => {
                  let n10 = s10;
                  s10 && s10.interpolationkey && s10.formatParams && s10.formatParams[s10.interpolationkey] && s10[s10.interpolationkey] && (n10 = { ...n10, [s10.interpolationkey]: undefined });
                  let o10 = r10 + JSON.stringify(n10), l2 = i10[o10];
                  return l2 || (l2 = t10(ec(r10), s10), i10[o10] = l2), l2(a10);
                };
              }, eD = class {
                constructor() {
                  let t10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                  this.logger = ep.create("formatter"), this.options = t10, this.formats = {
                    number: eR((t11, i10) => {
                      let a10 = new Intl.NumberFormat(t11, { ...i10 });
                      return (t12) => a10.format(t12);
                    }),
                    currency: eR((t11, i10) => {
                      let a10 = new Intl.NumberFormat(t11, { ...i10, style: "currency" });
                      return (t12) => a10.format(t12);
                    }),
                    datetime: eR((t11, i10) => {
                      let a10 = new Intl.DateTimeFormat(t11, { ...i10 });
                      return (t12) => a10.format(t12);
                    }),
                    relativetime: eR((t11, i10) => {
                      let a10 = new Intl.RelativeTimeFormat(t11, { ...i10 });
                      return (t12) => a10.format(t12, i10.range || "day");
                    }),
                    list: eR((t11, i10) => {
                      let a10 = new Intl.ListFormat(t11, { ...i10 });
                      return (t12) => a10.format(t12);
                    })
                  }, this.init(t10);
                }
                init(t10) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { interpolation: {} };
                  this.formatSeparator = i10.interpolation.formatSeparator || ",";
                }
                add(t10, i10) {
                  this.formats[t10.toLowerCase().trim()] = i10;
                }
                addCached(t10, i10) {
                  this.formats[t10.toLowerCase().trim()] = eR(i10);
                }
                format(t10, i10, a10) {
                  let r10 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {}, s10 = i10.split(this.formatSeparator);
                  if (s10.length > 1 && s10[0].indexOf("(") > 1 && 0 > s10[0].indexOf(")") && s10.find((t11) => t11.indexOf(")") > -1)) {
                    let t11 = s10.findIndex((t12) => t12.indexOf(")") > -1);
                    s10[0] = [s10[0], ...s10.splice(1, t11)].join(this.formatSeparator);
                  }
                  return s10.reduce((t11, i11) => {
                    let { formatName: s11, formatOptions: n10 } = eI(i11);
                    if (this.formats[s11]) {
                      let i12 = t11;
                      try {
                        let o10 = r10 && r10.formatParams && r10.formatParams[r10.interpolationkey] || {}, l2 = o10.locale || o10.lng || r10.locale || r10.lng || a10;
                        i12 = this.formats[s11](t11, l2, { ...n10, ...r10, ...o10 });
                      } catch (t12) {
                        this.logger.warn(t12);
                      }
                      return i12;
                    }
                    return this.logger.warn(`there was no format function for ${s11}`), t11;
                  }, t10);
                }
              }, eM = (t10, i10) => {
                t10.pending[i10] !== undefined && (delete t10.pending[i10], t10.pendingCount--);
              }, eN = class extends ef {
                constructor(t10, i10, a10) {
                  let r10 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                  super(), this.backend = t10, this.store = i10, this.services = a10, this.languageUtils = a10.languageUtils, this.options = r10, this.logger = ep.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = r10.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = r10.maxRetries >= 0 ? r10.maxRetries : 5, this.retryTimeout = r10.retryTimeout >= 1 ? r10.retryTimeout : 350, this.state = {}, this.queue = [], this.backend && this.backend.init && this.backend.init(a10, r10.backend, r10);
                }
                queueLoad(t10, i10, a10, r10) {
                  let s10 = {}, n10 = {}, o10 = {}, l2 = {};
                  return t10.forEach((t11) => {
                    let r11 = true;
                    i10.forEach((i11) => {
                      let o11 = `${t11}|${i11}`;
                      !a10.reload && this.store.hasResourceBundle(t11, i11) ? this.state[o11] = 2 : this.state[o11] < 0 || (this.state[o11] === 1 ? n10[o11] === undefined && (n10[o11] = true) : (this.state[o11] = 1, r11 = false, n10[o11] === undefined && (n10[o11] = true), s10[o11] === undefined && (s10[o11] = true), l2[i11] === undefined && (l2[i11] = true)));
                    }), r11 || (o10[t11] = true);
                  }), (Object.keys(s10).length || Object.keys(n10).length) && this.queue.push({ pending: n10, pendingCount: Object.keys(n10).length, loaded: {}, errors: [], callback: r10 }), { toLoad: Object.keys(s10), pending: Object.keys(n10), toLoadLanguages: Object.keys(o10), toLoadNamespaces: Object.keys(l2) };
                }
                loaded(t10, i10, a10) {
                  let r10 = t10.split("|"), s10 = r10[0], n10 = r10[1];
                  i10 && this.emit("failedLoading", s10, n10, i10), !i10 && a10 && this.store.addResourceBundle(s10, n10, a10, undefined, undefined, { skipCopy: true }), this.state[t10] = i10 ? -1 : 2, i10 && a10 && (this.state[t10] = 0);
                  let o10 = {};
                  this.queue.forEach((a11) => {
                    X(a11.loaded, [s10], n10), eM(a11, t10), i10 && a11.errors.push(i10), a11.pendingCount !== 0 || a11.done || (Object.keys(a11.loaded).forEach((t11) => {
                      o10[t11] || (o10[t11] = {});
                      let i11 = a11.loaded[t11];
                      i11.length && i11.forEach((i12) => {
                        o10[t11][i12] === undefined && (o10[t11][i12] = true);
                      });
                    }), a11.done = true, a11.errors.length ? a11.callback(a11.errors) : a11.callback());
                  }), this.emit("loaded", o10), this.queue = this.queue.filter((t11) => !t11.done);
                }
                read(t10, i10, a10) {
                  let r10 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0, s10 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.retryTimeout, n10 = arguments.length > 5 ? arguments[5] : undefined;
                  if (!t10.length)
                    return n10(null, {});
                  if (this.readingCalls >= this.maxParallelReads) {
                    this.waitingReads.push({ lng: t10, ns: i10, fcName: a10, tried: r10, wait: s10, callback: n10 });
                    return;
                  }
                  this.readingCalls++;
                  let o10 = (o11, l3) => {
                    if (this.readingCalls--, this.waitingReads.length > 0) {
                      let t11 = this.waitingReads.shift();
                      this.read(t11.lng, t11.ns, t11.fcName, t11.tried, t11.wait, t11.callback);
                    }
                    if (o11 && l3 && r10 < this.maxRetries) {
                      setTimeout(() => {
                        this.read.call(this, t10, i10, a10, r10 + 1, 2 * s10, n10);
                      }, s10);
                      return;
                    }
                    n10(o11, l3);
                  }, l2 = this.backend[a10].bind(this.backend);
                  if (l2.length === 2) {
                    try {
                      let a11 = l2(t10, i10);
                      a11 && typeof a11.then == "function" ? a11.then((t11) => o10(null, t11)).catch(o10) : o10(null, a11);
                    } catch (t11) {
                      o10(t11);
                    }
                    return;
                  }
                  return l2(t10, i10, o10);
                }
                prepareLoading(t10, i10) {
                  let a10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, r10 = arguments.length > 3 ? arguments[3] : undefined;
                  if (!this.backend)
                    return this.logger.warn("No backend was added via i18next.use. Will not load resources."), r10 && r10();
                  q(t10) && (t10 = this.languageUtils.toResolveHierarchy(t10)), q(i10) && (i10 = [i10]);
                  let s10 = this.queueLoad(t10, i10, a10, r10);
                  if (!s10.toLoad.length)
                    return s10.pending.length || r10(), null;
                  s10.toLoad.forEach((t11) => {
                    this.loadOne(t11);
                  });
                }
                load(t10, i10, a10) {
                  this.prepareLoading(t10, i10, {}, a10);
                }
                reload(t10, i10, a10) {
                  this.prepareLoading(t10, i10, { reload: true }, a10);
                }
                loadOne(t10) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "", a10 = t10.split("|"), r10 = a10[0], s10 = a10[1];
                  this.read(r10, s10, "read", undefined, undefined, (a11, n10) => {
                    a11 && this.logger.warn(`${i10}loading namespace ${s10} for language ${r10} failed`, a11), !a11 && n10 && this.logger.log(`${i10}loaded namespace ${s10} for language ${r10}`, n10), this.loaded(t10, a11, n10);
                  });
                }
                saveMissing(t10, i10, a10, r10, s10) {
                  let n10 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {}, o10 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : () => {};
                  if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(i10)) {
                    this.logger.warn(`did not save key "${a10}" as the namespace "${i10}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
                    return;
                  }
                  if (!(a10 == null || a10 === "")) {
                    if (this.backend && this.backend.create) {
                      let l2 = { ...n10, isUpdate: s10 }, d2 = this.backend.create.bind(this.backend);
                      if (d2.length < 6)
                        try {
                          let s11;
                          (s11 = d2.length === 5 ? d2(t10, i10, a10, r10, l2) : d2(t10, i10, a10, r10)) && typeof s11.then == "function" ? s11.then((t11) => o10(null, t11)).catch(o10) : o10(null, s11);
                        } catch (t11) {
                          o10(t11);
                        }
                      else
                        d2(t10, i10, a10, r10, o10, l2);
                    }
                    t10 && t10[0] && this.store.addResource(t10[0], i10, a10, r10);
                  }
                }
              }, ej = () => ({
                debug: false,
                initImmediate: true,
                ns: ["translation"],
                defaultNS: ["translation"],
                fallbackLng: ["dev"],
                fallbackNS: false,
                supportedLngs: false,
                nonExplicitSupportedLngs: false,
                load: "all",
                preload: false,
                simplifyPluralSuffix: true,
                keySeparator: ".",
                nsSeparator: ":",
                pluralSeparator: "_",
                contextSeparator: "_",
                partialBundledLanguages: false,
                saveMissing: false,
                updateMissing: false,
                saveMissingTo: "fallback",
                saveMissingPlurals: true,
                missingKeyHandler: false,
                missingInterpolationHandler: false,
                postProcess: false,
                postProcessPassResolved: false,
                returnNull: false,
                returnEmptyString: true,
                returnObjects: false,
                joinArrays: false,
                returnedObjectHandler: false,
                parseMissingKeyHandler: false,
                appendNamespaceToMissingKey: false,
                appendNamespaceToCIMode: false,
                overloadTranslationOptionHandler: (t10) => {
                  let i10 = {};
                  if (typeof t10[1] == "object" && (i10 = t10[1]), q(t10[1]) && (i10.defaultValue = t10[1]), q(t10[2]) && (i10.tDescription = t10[2]), typeof t10[2] == "object" || typeof t10[3] == "object") {
                    let a10 = t10[3] || t10[2];
                    Object.keys(a10).forEach((t11) => {
                      i10[t11] = a10[t11];
                    });
                  }
                  return i10;
                },
                interpolation: {
                  escapeValue: true,
                  format: (t10) => t10,
                  prefix: "{{",
                  suffix: "}}",
                  formatSeparator: ",",
                  unescapePrefix: "-",
                  nestingPrefix: "$t(",
                  nestingSuffix: ")",
                  nestingOptionsSeparator: ",",
                  maxReplaces: 1000,
                  skipOnVariables: true
                }
              }), eO = (t10) => (q(t10.ns) && (t10.ns = [t10.ns]), q(t10.fallbackLng) && (t10.fallbackLng = [t10.fallbackLng]), q(t10.fallbackNS) && (t10.fallbackNS = [t10.fallbackNS]), t10.supportedLngs && 0 > t10.supportedLngs.indexOf("cimode") && (t10.supportedLngs = t10.supportedLngs.concat(["cimode"])), t10), eV = () => {}, eH = (t10) => {
                Object.getOwnPropertyNames(Object.getPrototypeOf(t10)).forEach((i10) => {
                  typeof t10[i10] == "function" && (t10[i10] = t10[i10].bind(t10));
                });
              }, eU = class t10 extends ef {
                constructor() {
                  let t11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, i10 = arguments.length > 1 ? arguments[1] : undefined;
                  if (super(), this.options = eO(t11), this.services = {}, this.logger = ep, this.modules = { external: [] }, eH(this), i10 && !this.isInitialized && !t11.isClone) {
                    if (!this.options.initImmediate)
                      return this.init(t11, i10), this;
                    setTimeout(() => {
                      this.init(t11, i10);
                    }, 0);
                  }
                }
                init() {
                  var t11 = this;
                  let i10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, a10 = arguments.length > 1 ? arguments[1] : undefined;
                  this.isInitializing = true, typeof i10 == "function" && (a10 = i10, i10 = {}), !i10.defaultNS && i10.defaultNS !== false && i10.ns && (q(i10.ns) ? i10.defaultNS = i10.ns : 0 > i10.ns.indexOf("translation") && (i10.defaultNS = i10.ns[0]));
                  let r10 = ej();
                  this.options = { ...r10, ...this.options, ...eO(i10) }, this.options.compatibilityAPI !== "v1" && (this.options.interpolation = { ...r10.interpolation, ...this.options.interpolation }), i10.keySeparator !== undefined && (this.options.userDefinedKeySeparator = i10.keySeparator), i10.nsSeparator !== undefined && (this.options.userDefinedNsSeparator = i10.nsSeparator);
                  let s10 = (t12) => t12 ? typeof t12 == "function" ? new t12 : t12 : null;
                  if (!this.options.isClone) {
                    let i11;
                    this.modules.logger ? ep.init(s10(this.modules.logger), this.options) : ep.init(null, this.options), this.modules.formatter ? i11 = this.modules.formatter : "u" > typeof Intl && (i11 = eD);
                    let a11 = new eb(this.options);
                    this.store = new eg(this.options.resources, this.options);
                    let n11 = this.services;
                    n11.logger = ep, n11.resourceStore = this.store, n11.languageUtils = a11, n11.pluralResolver = new eT(a11, {
                      prepend: this.options.pluralSeparator,
                      compatibilityJSON: this.options.compatibilityJSON,
                      simplifyPluralSuffix: this.options.simplifyPluralSuffix
                    }), i11 && (!this.options.interpolation.format || this.options.interpolation.format === r10.interpolation.format) && (n11.formatter = s10(i11), n11.formatter.init(n11, this.options), this.options.interpolation.format = n11.formatter.format.bind(n11.formatter)), n11.interpolator = new eL(this.options), n11.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) }, n11.backendConnector = new eN(s10(this.modules.backend), n11.resourceStore, n11, this.options), n11.backendConnector.on("*", function(i12) {
                      var a12 = [...arguments].slice(1);
                      t11.emit(i12, ...a12);
                    }), this.modules.languageDetector && (n11.languageDetector = s10(this.modules.languageDetector), n11.languageDetector.init && n11.languageDetector.init(n11, this.options.detection, this.options)), this.modules.i18nFormat && (n11.i18nFormat = s10(this.modules.i18nFormat), n11.i18nFormat.init && n11.i18nFormat.init(this)), this.translator = new ey(this.services, this.options), this.translator.on("*", function(i12) {
                      var a12 = [...arguments].slice(1);
                      t11.emit(i12, ...a12);
                    }), this.modules.external.forEach((t12) => {
                      t12.init && t12.init(this);
                    });
                  }
                  if (this.format = this.options.interpolation.format, a10 ||= eV, this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
                    let t12 = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
                    t12.length > 0 && t12[0] !== "dev" && (this.options.lng = t12[0]);
                  }
                  this.services.languageDetector || this.options.lng || this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((i11) => {
                    this[i11] = function() {
                      return t11.store[i11](...arguments);
                    };
                  }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((i11) => {
                    this[i11] = function() {
                      return t11.store[i11](...arguments), t11;
                    };
                  });
                  let n10 = K(), o10 = () => {
                    let t12 = (t13, i11) => {
                      this.isInitializing = false, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = true, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), n10.resolve(i11), a10(t13, i11);
                    };
                    if (this.languages && this.options.compatibilityAPI !== "v1" && !this.isInitialized)
                      return t12(null, this.t.bind(this));
                    this.changeLanguage(this.options.lng, t12);
                  };
                  return this.options.resources || !this.options.initImmediate ? o10() : setTimeout(o10, 0), n10;
                }
                loadResources(t11) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : eV, a10 = q(t11) ? t11 : this.language;
                  if (typeof t11 == "function" && (i10 = t11), !this.options.resources || this.options.partialBundledLanguages) {
                    if (a10 && a10.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0))
                      return i10();
                    let t12 = [], r10 = (i11) => {
                      i11 && i11 !== "cimode" && this.services.languageUtils.toResolveHierarchy(i11).forEach((i12) => {
                        i12 !== "cimode" && 0 > t12.indexOf(i12) && t12.push(i12);
                      });
                    };
                    a10 ? r10(a10) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((t13) => r10(t13)), this.options.preload && this.options.preload.forEach((t13) => r10(t13)), this.services.backendConnector.load(t12, this.options.ns, (t13) => {
                      t13 || this.resolvedLanguage || !this.language || this.setResolvedLanguage(this.language), i10(t13);
                    });
                  } else
                    i10(null);
                }
                reloadResources(t11, i10, a10) {
                  let r10 = K();
                  return typeof t11 == "function" && (a10 = t11, t11 = undefined), typeof i10 == "function" && (a10 = i10, i10 = undefined), t11 ||= this.languages, i10 ||= this.options.ns, a10 ||= eV, this.services.backendConnector.reload(t11, i10, (t12) => {
                    r10.resolve(), a10(t12);
                  }), r10;
                }
                use(t11) {
                  if (!t11)
                    throw Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
                  if (!t11.type)
                    throw Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
                  return t11.type === "backend" && (this.modules.backend = t11), (t11.type === "logger" || t11.log && t11.warn && t11.error) && (this.modules.logger = t11), t11.type === "languageDetector" && (this.modules.languageDetector = t11), t11.type === "i18nFormat" && (this.modules.i18nFormat = t11), t11.type === "postProcessor" && ev.addPostProcessor(t11), t11.type === "formatter" && (this.modules.formatter = t11), t11.type === "3rdParty" && this.modules.external.push(t11), this;
                }
                setResolvedLanguage(t11) {
                  if (!(!t11 || !this.languages) && !(["cimode", "dev"].indexOf(t11) > -1))
                    for (let t12 = 0;t12 < this.languages.length; t12++) {
                      let i10 = this.languages[t12];
                      if (!(["cimode", "dev"].indexOf(i10) > -1) && this.store.hasLanguageSomeTranslations(i10)) {
                        this.resolvedLanguage = i10;
                        break;
                      }
                    }
                }
                changeLanguage(t11, i10) {
                  var a10 = this;
                  this.isLanguageChangingTo = t11;
                  let r10 = K();
                  this.emit("languageChanging", t11);
                  let s10 = (t12) => {
                    this.language = t12, this.languages = this.services.languageUtils.toResolveHierarchy(t12), this.resolvedLanguage = undefined, this.setResolvedLanguage(t12);
                  }, n10 = (t12, n11) => {
                    n11 ? (s10(n11), this.translator.changeLanguage(n11), this.isLanguageChangingTo = undefined, this.emit("languageChanged", n11), this.logger.log("languageChanged", n11)) : this.isLanguageChangingTo = undefined, r10.resolve(function() {
                      return a10.t(...arguments);
                    }), i10 && i10(t12, function() {
                      return a10.t(...arguments);
                    });
                  }, o10 = (i11) => {
                    t11 || i11 || !this.services.languageDetector || (i11 = []);
                    let a11 = q(i11) ? i11 : this.services.languageUtils.getBestMatchFromCodes(i11);
                    a11 && (this.language || s10(a11), this.translator.language || this.translator.changeLanguage(a11), this.services.languageDetector && this.services.languageDetector.cacheUserLanguage && this.services.languageDetector.cacheUserLanguage(a11)), this.loadResources(a11, (t12) => {
                      n10(t12, a11);
                    });
                  };
                  return t11 || !this.services.languageDetector || this.services.languageDetector.async ? !t11 && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(o10) : this.services.languageDetector.detect(o10) : o10(t11) : o10(this.services.languageDetector.detect()), r10;
                }
                getFixedT(t11, i10, a10) {
                  var r10 = this;
                  let s10 = function(t12, i11) {
                    let n10;
                    if (typeof i11 != "object") {
                      var o10 = [...arguments].slice(2);
                      n10 = r10.options.overloadTranslationOptionHandler([t12, i11].concat(o10));
                    } else
                      n10 = { ...i11 };
                    n10.lng = n10.lng || s10.lng, n10.lngs = n10.lngs || s10.lngs, n10.ns = n10.ns || s10.ns, n10.keyPrefix !== "" && (n10.keyPrefix = n10.keyPrefix || a10 || s10.keyPrefix);
                    let l2 = r10.options.keySeparator || ".", d2;
                    return d2 = n10.keyPrefix && Array.isArray(t12) ? t12.map((t13) => `${n10.keyPrefix}${l2}${t13}`) : n10.keyPrefix ? `${n10.keyPrefix}${l2}${t12}` : t12, r10.t(d2, n10);
                  };
                  return q(t11) ? s10.lng = t11 : s10.lngs = t11, s10.ns = i10, s10.keyPrefix = a10, s10;
                }
                t() {
                  return this.translator && this.translator.translate(...arguments);
                }
                exists() {
                  return this.translator && this.translator.exists(...arguments);
                }
                setDefaultNamespace(t11) {
                  this.options.defaultNS = t11;
                }
                hasLoadedNamespace(t11) {
                  let i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                  if (!this.isInitialized)
                    return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), false;
                  if (!this.languages || !this.languages.length)
                    return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), false;
                  let a10 = i10.lng || this.resolvedLanguage || this.languages[0], r10 = !!this.options && this.options.fallbackLng, s10 = this.languages[this.languages.length - 1];
                  if (a10.toLowerCase() === "cimode")
                    return true;
                  let n10 = (t12, i11) => {
                    let a11 = this.services.backendConnector.state[`${t12}|${i11}`];
                    return a11 === -1 || a11 === 0 || a11 === 2;
                  };
                  if (i10.precheck) {
                    let t12 = i10.precheck(this, n10);
                    if (t12 !== undefined)
                      return t12;
                  }
                  return !!(this.hasResourceBundle(a10, t11) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || n10(a10, t11) && (!r10 || n10(s10, t11)));
                }
                loadNamespaces(t11, i10) {
                  let a10 = K();
                  return this.options.ns ? (q(t11) && (t11 = [t11]), t11.forEach((t12) => {
                    0 > this.options.ns.indexOf(t12) && this.options.ns.push(t12);
                  }), this.loadResources((t12) => {
                    a10.resolve(), i10 && i10(t12);
                  }), a10) : (i10 && i10(), Promise.resolve());
                }
                loadLanguages(t11, i10) {
                  let a10 = K();
                  q(t11) && (t11 = [t11]);
                  let r10 = this.options.preload || [], s10 = t11.filter((t12) => 0 > r10.indexOf(t12) && this.services.languageUtils.isSupportedCode(t12));
                  return s10.length ? (this.options.preload = r10.concat(s10), this.loadResources((t12) => {
                    a10.resolve(), i10 && i10(t12);
                  }), a10) : (i10 && i10(), Promise.resolve());
                }
                dir(t11) {
                  if (!(t11 ||= this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language)))
                    return "rtl";
                  let i10 = this.services && this.services.languageUtils || new eb(ej());
                  return "ar.shu.sqr.ssh.xaa.yhd.yud.aao.abh.abv.acm.acq.acw.acx.acy.adf.ads.aeb.aec.afb.ajp.apc.apd.arb.arq.ars.ary.arz.auz.avl.ayh.ayl.ayn.ayp.bbz.pga.he.iw.ps.pbt.pbu.pst.prp.prd.ug.ur.ydd.yds.yih.ji.yi.hbo.men.xmn.fa.jpr.peo.pes.prs.dv.sam.ckb".split(".").indexOf(i10.getLanguagePartFromCode(t11)) > -1 || t11.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
                }
                static createInstance() {
                  return new t10(arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, arguments.length > 1 ? arguments[1] : undefined);
                }
                cloneInstance() {
                  let i10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, a10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : eV, r10 = i10.forkResourceStore;
                  r10 && delete i10.forkResourceStore;
                  let s10 = { ...this.options, ...i10, isClone: true }, n10 = new t10(s10);
                  return (i10.debug !== undefined || i10.prefix !== undefined) && (n10.logger = n10.logger.clone(i10)), ["store", "services", "language"].forEach((t11) => {
                    n10[t11] = this[t11];
                  }), n10.services = { ...this.services }, n10.services.utils = { hasLoadedNamespace: n10.hasLoadedNamespace.bind(n10) }, r10 && (n10.store = new eg(this.store.data, s10), n10.services.resourceStore = n10.store), n10.translator = new ey(n10.services, s10), n10.translator.on("*", function(t11) {
                    var i11 = [...arguments].slice(1);
                    n10.emit(t11, ...i11);
                  }), n10.init(s10, a10), n10.translator.options = s10, n10.translator.backendConnector.services.utils = { hasLoadedNamespace: n10.hasLoadedNamespace.bind(n10) }, n10;
                }
                toJSON() {
                  return {
                    options: this.options,
                    store: this.store,
                    language: this.language,
                    languages: this.languages,
                    resolvedLanguage: this.resolvedLanguage
                  };
                }
              }, eF = eU.createInstance();
              function e$(t10) {
                return (e$ = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t11) {
                  return typeof t11;
                } : function(t11) {
                  return t11 && typeof Symbol == "function" && t11.constructor === Symbol && t11 !== Symbol.prototype ? "symbol" : typeof t11;
                })(t10);
              }
              function eB() {
                return typeof XMLHttpRequest == "function" || (typeof XMLHttpRequest > "u" ? "undefined" : e$(XMLHttpRequest)) === "object";
              }
              eF.createInstance = eU.createInstance, eF.createInstance, eF.dir, eF.init, eF.loadResources, eF.reloadResources, eF.use, eF.changeLanguage, eF.getFixedT, eF.t, eF.exists, eF.setDefaultNamespace, eF.hasLoadedNamespace, eF.loadNamespaces, eF.loadLanguages;
              var eq = _((t10, i10) => {
                var a10 = "u" > typeof globalThis && globalThis || "u" > typeof self && self || "u" > typeof global && global, r10 = function() {
                  function t11() {
                    this.fetch = false, this.DOMException = a10.DOMException;
                  }
                  return t11.prototype = a10, new t11;
                }();
                (function(t11) {
                  (function(i11) {
                    var a11 = t11 !== undefined && t11 || "u" > typeof self && self || a11 !== undefined && a11, r11 = {
                      searchParams: "URLSearchParams" in a11,
                      iterable: "Symbol" in a11 && "iterator" in Symbol,
                      blob: "FileReader" in a11 && "Blob" in a11 && function() {
                        try {
                          return new Blob, true;
                        } catch {
                          return false;
                        }
                      }(),
                      formData: "FormData" in a11,
                      arrayBuffer: "ArrayBuffer" in a11
                    };
                    if (r11.arrayBuffer)
                      var s11 = [
                        "[object Int8Array]",
                        "[object Uint8Array]",
                        "[object Uint8ClampedArray]",
                        "[object Int16Array]",
                        "[object Uint16Array]",
                        "[object Int32Array]",
                        "[object Uint32Array]",
                        "[object Float32Array]",
                        "[object Float64Array]"
                      ], n10 = ArrayBuffer.isView || function(t12) {
                        return t12 && s11.indexOf(Object.prototype.toString.call(t12)) > -1;
                      };
                    function o10(t12) {
                      if (typeof t12 != "string" && (t12 = String(t12)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(t12) || t12 === "")
                        throw TypeError('Invalid character in header field name: "' + t12 + '"');
                      return t12.toLowerCase();
                    }
                    function l2(t12) {
                      return typeof t12 != "string" && (t12 = String(t12)), t12;
                    }
                    function d2(t12) {
                      var i12 = {
                        next: function() {
                          var i13 = t12.shift();
                          return { done: i13 === undefined, value: i13 };
                        }
                      };
                      return r11.iterable && (i12[Symbol.iterator] = function() {
                        return i12;
                      }), i12;
                    }
                    function u2(t12) {
                      this.map = {}, t12 instanceof u2 ? t12.forEach(function(t13, i12) {
                        this.append(i12, t13);
                      }, this) : Array.isArray(t12) ? t12.forEach(function(t13) {
                        this.append(t13[0], t13[1]);
                      }, this) : t12 && Object.getOwnPropertyNames(t12).forEach(function(i12) {
                        this.append(i12, t12[i12]);
                      }, this);
                    }
                    function c2(t12) {
                      if (t12.bodyUsed)
                        return Promise.reject(TypeError("Already read"));
                      t12.bodyUsed = true;
                    }
                    function h2(t12) {
                      return new Promise(function(i12, a12) {
                        t12.onload = function() {
                          i12(t12.result);
                        }, t12.onerror = function() {
                          a12(t12.error);
                        };
                      });
                    }
                    function p2(t12) {
                      var i12 = new FileReader, a12 = h2(i12);
                      return i12.readAsArrayBuffer(t12), a12;
                    }
                    function f2(t12) {
                      if (t12.slice)
                        return t12.slice(0);
                      var i12 = new Uint8Array(t12.byteLength);
                      return i12.set(new Uint8Array(t12)), i12.buffer;
                    }
                    function g2() {
                      return this.bodyUsed = false, this._initBody = function(t12) {
                        var i12;
                        this.bodyUsed = this.bodyUsed, this._bodyInit = t12, t12 ? typeof t12 == "string" ? this._bodyText = t12 : r11.blob && Blob.prototype.isPrototypeOf(t12) ? this._bodyBlob = t12 : r11.formData && FormData.prototype.isPrototypeOf(t12) ? this._bodyFormData = t12 : r11.searchParams && URLSearchParams.prototype.isPrototypeOf(t12) ? this._bodyText = t12.toString() : r11.arrayBuffer && r11.blob && (i12 = t12) && DataView.prototype.isPrototypeOf(i12) ? (this._bodyArrayBuffer = f2(t12.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r11.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(t12) || n10(t12)) ? this._bodyArrayBuffer = f2(t12) : this._bodyText = t12 = Object.prototype.toString.call(t12) : this._bodyText = "", this.headers.get("content-type") || (typeof t12 == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r11.searchParams && URLSearchParams.prototype.isPrototypeOf(t12) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
                      }, r11.blob && (this.blob = function() {
                        var t12 = c2(this);
                        if (t12)
                          return t12;
                        if (this._bodyBlob)
                          return Promise.resolve(this._bodyBlob);
                        if (this._bodyArrayBuffer)
                          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                        if (this._bodyFormData)
                          throw Error("could not read FormData body as blob");
                        return Promise.resolve(new Blob([this._bodyText]));
                      }, this.arrayBuffer = function() {
                        return this._bodyArrayBuffer ? c2(this) || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset, this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength)) : Promise.resolve(this._bodyArrayBuffer)) : this.blob().then(p2);
                      }), this.text = function() {
                        var t12, i12, a12, r12 = c2(this);
                        if (r12)
                          return r12;
                        if (this._bodyBlob)
                          return t12 = this._bodyBlob, a12 = h2(i12 = new FileReader), i12.readAsText(t12), a12;
                        if (this._bodyArrayBuffer)
                          return Promise.resolve(function(t13) {
                            for (var i13 = new Uint8Array(t13), a13 = Array(i13.length), r13 = 0;r13 < i13.length; r13++)
                              a13[r13] = String.fromCharCode(i13[r13]);
                            return a13.join("");
                          }(this._bodyArrayBuffer));
                        if (this._bodyFormData)
                          throw Error("could not read FormData body as text");
                        return Promise.resolve(this._bodyText);
                      }, r11.formData && (this.formData = function() {
                        return this.text().then(y2);
                      }), this.json = function() {
                        return this.text().then(JSON.parse);
                      }, this;
                    }
                    u2.prototype.append = function(t12, i12) {
                      t12 = o10(t12), i12 = l2(i12);
                      var a12 = this.map[t12];
                      this.map[t12] = a12 ? a12 + ", " + i12 : i12;
                    }, u2.prototype.delete = function(t12) {
                      delete this.map[o10(t12)];
                    }, u2.prototype.get = function(t12) {
                      return t12 = o10(t12), this.has(t12) ? this.map[t12] : null;
                    }, u2.prototype.has = function(t12) {
                      return this.map.hasOwnProperty(o10(t12));
                    }, u2.prototype.set = function(t12, i12) {
                      this.map[o10(t12)] = l2(i12);
                    }, u2.prototype.forEach = function(t12, i12) {
                      for (var a12 in this.map)
                        this.map.hasOwnProperty(a12) && t12.call(i12, this.map[a12], a12, this);
                    }, u2.prototype.keys = function() {
                      var t12 = [];
                      return this.forEach(function(i12, a12) {
                        t12.push(a12);
                      }), d2(t12);
                    }, u2.prototype.values = function() {
                      var t12 = [];
                      return this.forEach(function(i12) {
                        t12.push(i12);
                      }), d2(t12);
                    }, u2.prototype.entries = function() {
                      var t12 = [];
                      return this.forEach(function(i12, a12) {
                        t12.push([a12, i12]);
                      }), d2(t12);
                    }, r11.iterable && (u2.prototype[Symbol.iterator] = u2.prototype.entries);
                    var v2 = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
                    function m2(t12, i12) {
                      if (!(this instanceof m2))
                        throw TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
                      var a12, r12, s12 = (i12 ||= {}).body;
                      if (t12 instanceof m2) {
                        if (t12.bodyUsed)
                          throw TypeError("Already read");
                        this.url = t12.url, this.credentials = t12.credentials, i12.headers || (this.headers = new u2(t12.headers)), this.method = t12.method, this.mode = t12.mode, this.signal = t12.signal, s12 || t12._bodyInit == null || (s12 = t12._bodyInit, t12.bodyUsed = true);
                      } else
                        this.url = String(t12);
                      if (this.credentials = i12.credentials || this.credentials || "same-origin", (i12.headers || !this.headers) && (this.headers = new u2(i12.headers)), this.method = (r12 = (a12 = i12.method || this.method || "GET").toUpperCase(), v2.indexOf(r12) > -1 ? r12 : a12), this.mode = i12.mode || this.mode || null, this.signal = i12.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && s12)
                        throw TypeError("Body not allowed for GET or HEAD requests");
                      if (this._initBody(s12), (this.method === "GET" || this.method === "HEAD") && (i12.cache === "no-store" || i12.cache === "no-cache")) {
                        var n11 = /([?&])_=[^&]*/;
                        n11.test(this.url) ? this.url = this.url.replace(n11, "$1_=" + new Date().getTime()) : this.url += (/\?/.test(this.url) ? "&" : "?") + "_=" + new Date().getTime();
                      }
                    }
                    function y2(t12) {
                      var i12 = new FormData;
                      return t12.trim().split("&").forEach(function(t13) {
                        if (t13) {
                          var a12 = t13.split("="), r12 = a12.shift().replace(/\+/g, " "), s12 = a12.join("=").replace(/\+/g, " ");
                          i12.append(decodeURIComponent(r12), decodeURIComponent(s12));
                        }
                      }), i12;
                    }
                    function _2(t12, i12) {
                      if (!(this instanceof _2))
                        throw TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
                      i12 ||= {}, this.type = "default", this.status = i12.status === undefined ? 200 : i12.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = i12.statusText === undefined ? "" : "" + i12.statusText, this.headers = new u2(i12.headers), this.url = i12.url || "", this._initBody(t12);
                    }
                    m2.prototype.clone = function() {
                      return new m2(this, { body: this._bodyInit });
                    }, g2.call(m2.prototype), g2.call(_2.prototype), _2.prototype.clone = function() {
                      return new _2(this._bodyInit, { status: this.status, statusText: this.statusText, headers: new u2(this.headers), url: this.url });
                    }, _2.error = function() {
                      var t12 = new _2(null, { status: 0, statusText: "" });
                      return t12.type = "error", t12;
                    };
                    var b2 = [301, 302, 303, 307, 308];
                    _2.redirect = function(t12, i12) {
                      if (b2.indexOf(i12) === -1)
                        throw RangeError("Invalid status code");
                      return new _2(null, { status: i12, headers: { location: t12 } });
                    }, i11.DOMException = a11.DOMException;
                    try {
                      new i11.DOMException;
                    } catch {
                      i11.DOMException = function(t12, i12) {
                        this.message = t12, this.name = i12;
                        var a12 = Error(t12);
                        this.stack = a12.stack;
                      }, i11.DOMException.prototype = Object.create(Error.prototype), i11.DOMException.prototype.constructor = i11.DOMException;
                    }
                    function k2(t12, s12) {
                      return new Promise(function(n11, o11) {
                        var d3 = new m2(t12, s12);
                        if (d3.signal && d3.signal.aborted)
                          return o11(new i11.DOMException("Aborted", "AbortError"));
                        var c3 = new XMLHttpRequest;
                        function h3() {
                          c3.abort();
                        }
                        c3.onload = function() {
                          var t13, i12, a12 = {
                            status: c3.status,
                            statusText: c3.statusText,
                            headers: (t13 = c3.getAllResponseHeaders() || "", i12 = new u2, t13.replace(/\r?\n[\t ]+/g, " ").split("\r").map(function(t14) {
                              return t14.indexOf(`
`) === 0 ? t14.substr(1, t14.length) : t14;
                            }).forEach(function(t14) {
                              var a13 = t14.split(":"), r13 = a13.shift().trim();
                              if (r13) {
                                var s13 = a13.join(":").trim();
                                i12.append(r13, s13);
                              }
                            }), i12)
                          };
                          a12.url = "responseURL" in c3 ? c3.responseURL : a12.headers.get("X-Request-URL");
                          var r12 = "response" in c3 ? c3.response : c3.responseText;
                          setTimeout(function() {
                            n11(new _2(r12, a12));
                          }, 0);
                        }, c3.onerror = function() {
                          setTimeout(function() {
                            o11(TypeError("Network request failed"));
                          }, 0);
                        }, c3.ontimeout = function() {
                          setTimeout(function() {
                            o11(TypeError("Network request failed"));
                          }, 0);
                        }, c3.onabort = function() {
                          setTimeout(function() {
                            o11(new i11.DOMException("Aborted", "AbortError"));
                          }, 0);
                        }, c3.open(d3.method, function(t13) {
                          try {
                            return t13 === "" && a11.location.href ? a11.location.href : t13;
                          } catch {
                            return t13;
                          }
                        }(d3.url), true), d3.credentials === "include" ? c3.withCredentials = true : d3.credentials === "omit" && (c3.withCredentials = false), "responseType" in c3 && (r11.blob ? c3.responseType = "blob" : r11.arrayBuffer && d3.headers.get("Content-Type") && d3.headers.get("Content-Type").indexOf("application/octet-stream") !== -1 && (c3.responseType = "arraybuffer")), !s12 || typeof s12.headers != "object" || s12.headers instanceof u2 ? d3.headers.forEach(function(t13, i12) {
                          c3.setRequestHeader(i12, t13);
                        }) : Object.getOwnPropertyNames(s12.headers).forEach(function(t13) {
                          c3.setRequestHeader(t13, l2(s12.headers[t13]));
                        }), d3.signal && (d3.signal.addEventListener("abort", h3), c3.onreadystatechange = function() {
                          c3.readyState === 4 && d3.signal.removeEventListener("abort", h3);
                        }), c3.send(d3._bodyInit === undefined ? null : d3._bodyInit);
                      });
                    }
                    k2.polyfill = true, a11.fetch || (a11.fetch = k2, a11.Headers = u2, a11.Request = m2, a11.Response = _2), i11.Headers = u2, i11.Request = m2, i11.Response = _2, i11.fetch = k2;
                  })({});
                })(r10), r10.fetch.ponyfill = true, delete r10.fetch.polyfill;
                var s10 = a10.fetch ? a10 : r10;
                (t10 = s10.fetch).default = s10.fetch, t10.fetch = s10.fetch, t10.Headers = s10.Headers, t10.Request = s10.Request, t10.Response = s10.Response, i10.exports = t10;
              }), eK = C(_((t10, i10) => {
                var a10 = typeof fetch == "function" ? fetch : undefined;
                if ("u" > typeof global && global.fetch ? a10 = global.fetch : "u" > typeof window && window.fetch && (a10 = window.fetch), w !== undefined && typeof window > "u") {
                  var r10 = a10 || eq();
                  r10.default && (r10 = r10.default), t10.default = r10, i10.exports = t10.default;
                }
              })(), 1);
              function eZ(t10, i10) {
                var a10 = Object.keys(t10);
                if (Object.getOwnPropertySymbols) {
                  var r10 = Object.getOwnPropertySymbols(t10);
                  i10 && (r10 = r10.filter(function(i11) {
                    return Object.getOwnPropertyDescriptor(t10, i11).enumerable;
                  })), a10.push.apply(a10, r10);
                }
                return a10;
              }
              function ez(t10) {
                for (var i10 = 1;i10 < arguments.length; i10++) {
                  var a10 = arguments[i10] == null ? {} : arguments[i10];
                  i10 % 2 ? eZ(Object(a10), true).forEach(function(i11) {
                    var r10, s10;
                    r10 = i11, s10 = a10[i11], (r10 = function(t11) {
                      var i12 = function(t12, i13) {
                        if (eG(t12) != "object" || !t12)
                          return t12;
                        var a11 = t12[Symbol.toPrimitive];
                        if (a11 !== undefined) {
                          var r11 = a11.call(t12, i13 || "default");
                          if (eG(r11) != "object")
                            return r11;
                          throw TypeError("@@toPrimitive must return a primitive value.");
                        }
                        return (i13 === "string" ? String : Number)(t12);
                      }(t11, "string");
                      return eG(i12) == "symbol" ? i12 : i12 + "";
                    }(r10)) in t10 ? Object.defineProperty(t10, r10, { value: s10, enumerable: true, configurable: true, writable: true }) : t10[r10] = s10;
                  }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t10, Object.getOwnPropertyDescriptors(a10)) : eZ(Object(a10)).forEach(function(i11) {
                    Object.defineProperty(t10, i11, Object.getOwnPropertyDescriptor(a10, i11));
                  });
                }
                return t10;
              }
              function eG(t10) {
                return (eG = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t11) {
                  return typeof t11;
                } : function(t11) {
                  return t11 && typeof Symbol == "function" && t11.constructor === Symbol && t11 !== Symbol.prototype ? "symbol" : typeof t11;
                })(t10);
              }
              var eW = typeof fetch == "function" ? fetch : undefined;
              "u" > typeof global && global.fetch ? eW = global.fetch : "u" > typeof window && window.fetch && (eW = window.fetch), eB() && ("u" > typeof global && global.XMLHttpRequest ? te = global.XMLHttpRequest : "u" > typeof window && window.XMLHttpRequest && (te = window.XMLHttpRequest)), typeof ActiveXObject == "function" && ("u" > typeof global && global.ActiveXObject ? tt = global.ActiveXObject : "u" > typeof window && window.ActiveXObject && (tt = window.ActiveXObject)), eW || !eK || te || tt || (eW = eK.default || eK), typeof eW != "function" && (eW = undefined);
              var eJ = function(t10, i10) {
                if (i10 && eG(i10) === "object") {
                  var a10 = "";
                  for (var r10 in i10)
                    a10 += "&" + encodeURIComponent(r10) + "=" + encodeURIComponent(i10[r10]);
                  if (!a10)
                    return t10;
                  t10 = t10 + (t10.indexOf("?") === -1 ? "?" : "&") + a10.slice(1);
                }
                return t10;
              }, eY = function(t10, i10, a10, r10) {
                var s10 = function(t11) {
                  if (!t11.ok)
                    return a10(t11.statusText || "Error", { status: t11.status });
                  t11.text().then(function(i11) {
                    a10(null, { status: t11.status, data: i11 });
                  }).catch(a10);
                };
                if (r10) {
                  var n10 = r10(t10, i10);
                  if (n10 instanceof Promise) {
                    n10.then(s10).catch(a10);
                    return;
                  }
                }
                typeof fetch == "function" ? fetch(t10, i10).then(s10).catch(a10) : eW(t10, i10).then(s10).catch(a10);
              }, eQ = false, eX = function(t10, i10, a10, r10) {
                t10.queryStringParams && (i10 = eJ(i10, t10.queryStringParams));
                var s10 = ez({}, typeof t10.customHeaders == "function" ? t10.customHeaders() : t10.customHeaders);
                typeof window > "u" && "u" > typeof global && global.process !== undefined && global.process.versions && global.process.versions.node && (s10["User-Agent"] = `i18next-http-backend (node/${global.process.version}; ${global.process.platform} ${global.process.arch})`), a10 && (s10["Content-Type"] = "application/json");
                var n10 = typeof t10.requestOptions == "function" ? t10.requestOptions(a10) : t10.requestOptions, o10 = ez({ method: a10 ? "POST" : "GET", body: a10 ? t10.stringify(a10) : undefined, headers: s10 }, eQ ? {} : n10), l2 = typeof t10.alternateFetch == "function" && t10.alternateFetch.length >= 1 ? t10.alternateFetch : undefined;
                try {
                  eY(i10, o10, r10, l2);
                } catch (t11) {
                  if (!n10 || Object.keys(n10).length === 0 || !t11.message || 0 > t11.message.indexOf("not implemented"))
                    return r10(t11);
                  try {
                    Object.keys(n10).forEach(function(t12) {
                      delete o10[t12];
                    }), eY(i10, o10, r10, l2), eQ = true;
                  } catch (t12) {
                    r10(t12);
                  }
                }
              }, e0 = function(t10, i10, a10, r10) {
                a10 && eG(a10) === "object" && (a10 = eJ("", a10).slice(1)), t10.queryStringParams && (i10 = eJ(i10, t10.queryStringParams));
                try {
                  var s10 = te ? new te : new tt("MSXML2.XMLHTTP.3.0");
                  s10.open(a10 ? "POST" : "GET", i10, 1), t10.crossDomain || s10.setRequestHeader("X-Requested-With", "XMLHttpRequest"), s10.withCredentials = !!t10.withCredentials, a10 && s10.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), s10.overrideMimeType && s10.overrideMimeType("application/json");
                  var n10 = t10.customHeaders;
                  if (n10 = typeof n10 == "function" ? n10() : n10)
                    for (var o10 in n10)
                      s10.setRequestHeader(o10, n10[o10]);
                  s10.onreadystatechange = function() {
                    s10.readyState > 3 && r10(s10.status >= 400 ? s10.statusText : null, { status: s10.status, data: s10.responseText });
                  }, s10.send(a10);
                } catch (t11) {
                  console && console.warn(t11);
                }
              }, e1 = function(t10, i10, a10, r10) {
                return (typeof a10 == "function" && (r10 = a10, a10 = undefined), r10 ||= function() {}, eW && i10.indexOf("file:") !== 0) ? eX(t10, i10, a10, r10) : eB() || typeof ActiveXObject == "function" ? e0(t10, i10, a10, r10) : void r10(Error("No fetch and no xhr implementation found!"));
              };
              function e4(t10) {
                return (e4 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t11) {
                  return typeof t11;
                } : function(t11) {
                  return t11 && typeof Symbol == "function" && t11.constructor === Symbol && t11 !== Symbol.prototype ? "symbol" : typeof t11;
                })(t10);
              }
              function e2(t10, i10) {
                var a10 = Object.keys(t10);
                if (Object.getOwnPropertySymbols) {
                  var r10 = Object.getOwnPropertySymbols(t10);
                  i10 && (r10 = r10.filter(function(i11) {
                    return Object.getOwnPropertyDescriptor(t10, i11).enumerable;
                  })), a10.push.apply(a10, r10);
                }
                return a10;
              }
              function e3(t10) {
                for (var i10 = 1;i10 < arguments.length; i10++) {
                  var a10 = arguments[i10] == null ? {} : arguments[i10];
                  i10 % 2 ? e2(Object(a10), true).forEach(function(i11) {
                    e5(t10, i11, a10[i11]);
                  }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t10, Object.getOwnPropertyDescriptors(a10)) : e2(Object(a10)).forEach(function(i11) {
                    Object.defineProperty(t10, i11, Object.getOwnPropertyDescriptor(a10, i11));
                  });
                }
                return t10;
              }
              function e5(t10, i10, a10) {
                return (i10 = e6(i10)) in t10 ? Object.defineProperty(t10, i10, { value: a10, enumerable: true, configurable: true, writable: true }) : t10[i10] = a10, t10;
              }
              function e6(t10) {
                var i10 = function(t11, i11) {
                  if (e4(t11) != "object" || !t11)
                    return t11;
                  var a10 = t11[Symbol.toPrimitive];
                  if (a10 !== undefined) {
                    var r10 = a10.call(t11, i11 || "default");
                    if (e4(r10) != "object")
                      return r10;
                    throw TypeError("@@toPrimitive must return a primitive value.");
                  }
                  return (i11 === "string" ? String : Number)(t11);
                }(t10, "string");
                return e4(i10) == "symbol" ? i10 : i10 + "";
              }
              var e7 = (e8 = function t10(i10) {
                var a10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, r10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                (function(t11, i11) {
                  if (!(t11 instanceof i11))
                    throw TypeError("Cannot call a class as a function");
                })(this, t10), this.services = i10, this.options = a10, this.allOptions = r10, this.type = "backend", this.init(i10, a10, r10);
              }, e9 = [
                {
                  key: "init",
                  value: function(t10) {
                    var i10 = this, a10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, r10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                    if (this.services = t10, this.options = e3(e3(e3({}, {
                      loadPath: "/locales/{{lng}}/{{ns}}.json",
                      addPath: "/locales/add/{{lng}}/{{ns}}",
                      parse: function(t11) {
                        return JSON.parse(t11);
                      },
                      stringify: JSON.stringify,
                      parsePayload: function(t11, i11, a11) {
                        return e5({}, i11, a11 || "");
                      },
                      parseLoadPayload: function(t11, i11) {},
                      request: e1,
                      reloadInterval: !("u" > typeof window) && 3600000,
                      customHeaders: {},
                      queryStringParams: {},
                      crossDomain: false,
                      withCredentials: false,
                      overrideMimeType: false,
                      requestOptions: { mode: "cors", credentials: "same-origin", cache: "default" }
                    }), this.options || {}), a10), this.allOptions = r10, this.services && this.options.reloadInterval) {
                      var s10 = setInterval(function() {
                        return i10.reload();
                      }, this.options.reloadInterval);
                      e4(s10) === "object" && typeof s10.unref == "function" && s10.unref();
                    }
                  }
                },
                {
                  key: "readMulti",
                  value: function(t10, i10, a10) {
                    this._readAny(t10, t10, i10, i10, a10);
                  }
                },
                {
                  key: "read",
                  value: function(t10, i10, a10) {
                    this._readAny([t10], t10, [i10], i10, a10);
                  }
                },
                {
                  key: "_readAny",
                  value: function(t10, i10, a10, r10, s10) {
                    var n10, o10, l2 = this, d2 = this.options.loadPath;
                    typeof this.options.loadPath == "function" && (d2 = this.options.loadPath(t10, a10)), (d2 = (o10 = n10 = d2) && typeof o10.then == "function" ? n10 : Promise.resolve(n10)).then(function(n11) {
                      if (!n11)
                        return s10(null, {});
                      var o11 = l2.services.interpolator.interpolate(n11, { lng: t10.join("+"), ns: a10.join("+") });
                      l2.loadUrl(o11, s10, i10, r10);
                    });
                  }
                },
                {
                  key: "loadUrl",
                  value: function(t10, i10, a10, r10) {
                    var s10 = this, n10 = this.options.parseLoadPayload(typeof a10 == "string" ? [a10] : a10, typeof r10 == "string" ? [r10] : r10);
                    this.options.request(this.options, t10, n10, function(n11, o10) {
                      if (o10 && (o10.status >= 500 && o10.status < 600 || !o10.status))
                        return i10("failed loading " + t10 + "; status code: " + o10.status, true);
                      if (o10 && o10.status >= 400 && o10.status < 500)
                        return i10("failed loading " + t10 + "; status code: " + o10.status, false);
                      if (!o10 && n11 && n11.message) {
                        var l2, d2, u2 = n11.message.toLowerCase();
                        if (["failed", "fetch", "network", "load"].find(function(t11) {
                          return u2.indexOf(t11) > -1;
                        }))
                          return i10("failed loading " + t10 + ": " + n11.message, true);
                      }
                      if (n11)
                        return i10(n11, false);
                      try {
                        l2 = typeof o10.data == "string" ? s10.options.parse(o10.data, a10, r10) : o10.data;
                      } catch {
                        d2 = "failed parsing " + t10 + " to json";
                      }
                      if (d2)
                        return i10(d2, false);
                      i10(null, l2);
                    });
                  }
                },
                {
                  key: "create",
                  value: function(t10, i10, a10, r10, s10) {
                    var n10 = this;
                    if (this.options.addPath) {
                      typeof t10 == "string" && (t10 = [t10]);
                      var o10 = this.options.parsePayload(i10, a10, r10), l2 = 0, d2 = [], u2 = [];
                      t10.forEach(function(a11) {
                        var r11 = n10.options.addPath;
                        typeof n10.options.addPath == "function" && (r11 = n10.options.addPath(a11, i10));
                        var c2 = n10.services.interpolator.interpolate(r11, { lng: a11, ns: i10 });
                        n10.options.request(n10.options, c2, o10, function(i11, a12) {
                          l2 += 1, d2.push(i11), u2.push(a12), l2 === t10.length && typeof s10 == "function" && s10(d2, u2);
                        });
                      });
                    }
                  }
                },
                {
                  key: "reload",
                  value: function() {
                    var t10 = this, i10 = this.services, a10 = i10.backendConnector, r10 = i10.languageUtils, s10 = i10.logger, n10 = a10.language;
                    if (!(n10 && n10.toLowerCase() === "cimode")) {
                      var o10 = [], l2 = function(t11) {
                        r10.toResolveHierarchy(t11).forEach(function(t12) {
                          0 > o10.indexOf(t12) && o10.push(t12);
                        });
                      };
                      l2(n10), this.allOptions.preload && this.allOptions.preload.forEach(function(t11) {
                        return l2(t11);
                      }), o10.forEach(function(i11) {
                        t10.allOptions.ns.forEach(function(t11) {
                          a10.read(i11, t11, "read", null, null, function(r11, n11) {
                            r11 && s10.warn(`loading namespace ${t11} for language ${i11} failed`, r11), !r11 && n11 && s10.log(`loaded namespace ${t11} for language ${i11}`, n11), a10.loaded(`${i11}|${t11}`, r11, n11);
                          });
                        });
                      });
                    }
                  }
                }
              ], function(t10, i10) {
                for (var a10 = 0;a10 < i10.length; a10++) {
                  var r10 = i10[a10];
                  r10.enumerable = r10.enumerable || false, r10.configurable = true, "value" in r10 && (r10.writable = true), Object.defineProperty(t10, e6(r10.key), r10);
                }
              }(e8.prototype, e9), Object.defineProperty(e8, "prototype", { writable: false }), e8);
              e7.type = "backend";
              var e8, e9, te, tt, ti, ta = class {
                constructor(t10 = {}) {
                  this._isInitialized = false, this.t = (t11, i10) => {
                    if (!this._isInitialized)
                      return l.Ft.warn("LocalizationManager not initialized. Call initialize() first. Returning key as fallback."), t11;
                    try {
                      let a10 = this._i18next.t(t11, i10), r10 = a10.match(/\{\{[^}]+\}\}/g);
                      return r10 && l.Ft.warn(`Translation interpolation mismatch for key "${t11}": unfilled placeholders ${r10.join(", ")}. Provided: ${JSON.stringify(i10 ?? {})}`), a10;
                    } catch (i11) {
                      return l.Ft.warn(`Translation failed for key: ${t11}`, i11), t11;
                    }
                  }, this._config = { endpoint: t10.endpoint ?? "", defaultLanguage: t10.defaultLanguage ?? "en-US" }, this._currentLanguage = this._config.defaultLanguage, this._i18next = eF.createInstance(), this._i18next.use(e7);
                }
                async initialize(t10) {
                  O[t10] ? this._currentLanguage = t10 : (l.Ft.warn(`Unsupported language code: ${t10}. Supported languages: ${Object.keys(O).join(", ")}. Using default.`), this._currentLanguage = this._config.defaultLanguage);
                  let i10 = $[this._currentLanguage], a10 = $[this._config.defaultLanguage], r10 = $[F];
                  try {
                    await this._i18next.init({
                      lng: i10,
                      partialBundledLanguages: true,
                      fallbackLng: [a10, r10],
                      load: "currentOnly",
                      keySeparator: false,
                      interpolation: { escapeValue: false },
                      returnEmptyString: false,
                      returnNull: false,
                      resources: { [r10]: { translation: U } },
                      backend: {
                        loadPath: `${this._config.endpoint}/{{lng}}.json`,
                        crossDomain: true,
                        allowMultiLoading: false,
                        requestOptions: { mode: "cors" }
                      },
                      debug: false
                    });
                  } catch (t11) {
                    l.Ft.error("Failed to initialize i18next. Translation functionality may be limited.", t11);
                  }
                  this._config.endpoint && B(this._config.endpoint).then((t11) => {
                    this._i18next.addResourceBundle(r10, "translation", t11, true, true);
                  }).catch((t11) => {
                    l.Ft.warn("Failed to update English translations from remote endpoint. Using bundled translations.", t11);
                  }), this._isInitialized = true;
                }
              }, tr = class {
                constructor(t10) {
                  this.isLoading$ = t10.playerStateChangedEvent$.pipe((0, l.ht)((t11) => {
                    switch (t11.event) {
                      case l.Rt.STARTUP:
                      case l.Rt.INITIALIZED:
                      case l.Rt.MEDIA_RESOLVING:
                      case l.Rt.MEDIA_LOADING:
                      case l.Rt.MEDIA_LOADED:
                        return true;
                      case l.Rt.PLAYING:
                      case l.Rt.PAUSED:
                      case l.Rt.ERROR:
                      case l.Rt.REBUFFERING:
                      case l.Rt.DISPOSED:
                      case l.Rt.STOPPED:
                      default:
                        return false;
                    }
                  }), (0, l.pt)(), M({ bufferSize: 1, refCount: true })), this.isRebuffering$ = t10.playerStateChangedEvent$.pipe((0, l.ht)((t11) => t11.event === l.Rt.REBUFFERING), (0, l.pt)(), M({ bufferSize: 1, refCount: true }));
                }
              }, ts = (t10) => t10.playerStateChangedEvent$.pipe(R((t11, i10) => {
                let { event: a10, payload: r10 } = i10;
                switch (a10) {
                  case l.Rt.MEDIA_LOADING:
                    return { errorDetails: null, capturedVideoModel: r10.videoModel };
                  case l.Rt.ERROR: {
                    let i11 = r10.error.partialVideoModel ?? t11.capturedVideoModel;
                    return { ...t11, errorDetails: { error: r10.error, videoModel: i11 } };
                  }
                  case l.Rt.STOPPED:
                    return t11;
                  default:
                    return { ...t11, errorDetails: null };
                }
              }, { errorDetails: null, capturedVideoModel: null }), (0, l.ht)((t11) => t11.errorDetails), (0, l.ft)(null), (0, l.pt)(), M({ bufferSize: 1, refCount: true })), tn = (t10, i10) => t10.playerStateChangedEvent$.pipe(N(i10.pipe((0, l.ft)(null))), (0, l.ht)(([t11, i11]) => {
                switch (t11.event) {
                  case l.Rt.MEDIA_LOADING:
                    return false;
                  case l.Rt.ERROR:
                    return true;
                  case l.Rt.STOPPED:
                    return i11 !== null;
                  default:
                    return false;
                }
              }), (0, l.ft)(false), (0, l.pt)(), M({ bufferSize: 1, refCount: true })), to = (t10) => t10.pipe((0, l.ht)((t11) => !!t11?.videoModel?.id), (0, l.pt)(), M({ bufferSize: 1, refCount: true }));
              (tq = ti ||= {}).General = "general", tq.StreamLimits = "streamLimits";
              var tl = (t10) => t10?.error?.code === l.et.STREAM_LIMIT_REACHED ? ti.StreamLimits : ti.General, td = (t10) => t10.pipe((0, l.ht)(tl), (0, l.pt)(), M({ bufferSize: 1, refCount: true })), tu = class {
                constructor(t10, i10) {
                  this._currentErrorDetails = null, this._player = i10, this.errorDetails$ = ts(t10), this.isVisible$ = tn(t10, this.errorDetails$), this.isRetryable$ = to(this.errorDetails$), this.overlayType$ = td(this.errorDetails$), this._errorDetailsSubscription = this.errorDetails$.subscribe((t11) => {
                    this._currentErrorDetails = t11;
                  });
                }
                retry() {
                  if (!this._currentErrorDetails?.videoModel?.id)
                    return;
                  let t10 = this._currentErrorDetails.videoModel.id, i10 = this._currentErrorDetails.videoModel.watchHistory?.resumePosition;
                  this._player.load(t10, i10);
                }
                dispose() {
                  this._errorDetailsSubscription.unsubscribe();
                }
              }, tc = (t10) => (i10) => {
                t10.setFullScreen(i10);
              }, th = class {
                constructor(t10, i10) {
                  this._isFullScreen = new l.Ct(1), this._setFullScreen = tc(i10), this._subscription = t10.fullScreenStateChanged$.pipe((0, l.ht)((t11) => t11.active)).subscribe(this._isFullScreen), this.isFullScreen$ = this._isFullScreen.asObservable();
                }
                enterFullScreen() {
                  this._setFullScreen(true);
                }
                exitFullScreen() {
                  this._setFullScreen(false);
                }
                dispose() {
                  this._subscription.unsubscribe(), this._isFullScreen.complete();
                }
              }, tp = (t10) => {
                let i10 = [0.5, 0.75, 1, 1.25, 1.5, 2], a10 = new Set, r10 = [];
                return i10.forEach((t11) => {
                  a10.has(t11) || (a10.add(t11), r10.push(t11));
                }), r10;
              }, tGetNativePlaybackRateState = () => {
                let t10 = window.__croptixPlaybackRateState;
                return t10 || (t10 = window.__croptixPlaybackRateState = { rate: 1, video: null, cleanup: null, observer: null, retryHandles: [] }), t10;
              }, tFindNativePlaybackVideo = () => document.querySelector("video"), tApplyNativePlaybackRate = (t10, i10) => {
                let a10 = i10 || tFindNativePlaybackVideo();
                if (!a10)
                  return false;
                try {
                  return Math.abs((a10.defaultPlaybackRate || 1) - t10) > 0.01 && (a10.defaultPlaybackRate = t10), Math.abs((a10.playbackRate || 1) - t10) > 0.01 && (a10.playbackRate = t10), true;
                } catch (t11) {
                  return console.warn("[CrOptix][PlaybackSpeed] Failed to apply native playback rate.", t11), false;
                }
              }, tBindNativePlaybackRate = (t10) => {
                let i10 = Number.isFinite(t10) && t10 > 0 ? t10 : 1, a10 = tGetNativePlaybackRateState();
                a10.rate = i10, a10.retryHandles.forEach((t11) => clearTimeout(t11)), a10.retryHandles = [];
                let r10 = () => {
                  let t11 = tFindNativePlaybackVideo();
                  if (!t11)
                    return false;
                  if (a10.video !== t11) {
                    a10.cleanup?.();
                    let r11 = () => tApplyNativePlaybackRate(a10.rate, t11), s11 = () => {
                      Math.abs((t11.playbackRate || 1) - a10.rate) > 0.01 && setTimeout(r11, 0);
                    }, n10 = ["loadedmetadata", "loadeddata", "canplay", "play", "playing", "ratechange"];
                    n10.forEach((i11) => t11.addEventListener(i11, i11 === "ratechange" ? s11 : r11)), a10.video = t11, a10.cleanup = () => {
                      n10.forEach((i11) => t11.removeEventListener(i11, i11 === "ratechange" ? s11 : r11));
                    };
                  }
                  return tApplyNativePlaybackRate(a10.rate, t11);
                }, s10 = document.body || document.documentElement;
                s10 && !a10.observer && (a10.observer = new MutationObserver(() => {
                  tFindNativePlaybackVideo() !== a10.video && r10();
                }), a10.observer.observe(s10, { childList: true, subtree: true })), [0, 50, 250, 1000, 2500].forEach((t11) => {
                  a10.retryHandles.push(setTimeout(r10, t11));
                });
              }, tf = (t10, i10) => (a10) => {
                i10.has(a10) && (tBindNativePlaybackRate(a10), (() => {
                  try {
                    t10.setPlaybackRate(a10);
                  } catch (t11) {
                    console.warn("[CrOptix][PlaybackSpeed] Failed to set player playback rate.", t11);
                  }
                })());
              }, tg = class {
                constructor(t10, i10, a10 = {}) {
                  this._selectedRateInput$ = new l.Tt;
                  let r10 = tp(a10.availableRates);
                  this._availableRates = r10.length > 0 ? r10 : [l.D.NORMAL_SPEED], this._availableRatesSet = new Set(this._availableRates), this._selectPlaybackSpeed = tf(i10, this._availableRatesSet);
                  let s10 = t10.playbackRateChanged$.pipe((0, l.ht)((t11) => window.__croptixPlaybackRateState?.rate ?? t11.rate));
                  this.selectedRate$ = I(s10, this._selectedRateInput$).pipe((0, l.pt)(), M({ bufferSize: 1, refCount: true })), this.availableRates$ = this.selectedRate$.pipe((0, l.ht)(() => this._availableRates), M({ bufferSize: 1, refCount: true }));
                }
                selectPlaybackSpeed(t10) {
                  this._availableRatesSet.has(t10) && (this._selectedRateInput$.next(t10), this._selectPlaybackSpeed(t10));
                }
                dispose() {}
              }, tv = class t10 {
                constructor(t11) {
                  this.ratingDisplayName = t11?.ratingDisplayName, this.ratingSystem = t11?.ratingSystem, this.advisoryComponents = t11?.advisoryComponents ?? [], this.advisoryComponentImages = t11?.advisoryComponentImages ?? [], this.primaryHeading = t11?.primaryHeading, this.secondaryHeading = t11?.secondaryHeading;
                }
                static extractFromVideoModel(i10) {
                  let a10 = i10.assetMetadata?.rating, r10 = i10.assetMetadata?.advisories;
                  return new t10({
                    ratingDisplayName: a10?.displayName,
                    ratingSystem: a10?.system,
                    advisoryComponents: r10?.advisoryComponents ?? [],
                    advisoryComponentImages: r10?.advisoryComponentImages ?? [],
                    primaryHeading: r10?.primaryHeading,
                    secondaryHeading: r10?.secondaryHeading
                  });
                }
                static areEqual(t11, i10) {
                  return !!(t11.ratingDisplayName === i10.ratingDisplayName && t11.ratingSystem === i10.ratingSystem && t11.primaryHeading === i10.primaryHeading && t11.secondaryHeading === i10.secondaryHeading && t11.advisoryComponents.length === i10.advisoryComponents.length && t11.advisoryComponents.every((t12, a10) => t12 === i10.advisoryComponents[a10])) && t11.advisoryComponentImages.length === i10.advisoryComponentImages.length && t11.advisoryComponentImages.every((t12, a10) => {
                    let r10 = i10.advisoryComponentImages[a10];
                    return t12.url.href === r10.url.href && t12.altText === r10.altText && t12.width === r10.width && t12.height === r10.height;
                  });
                }
              }, tm = class extends tv {
                constructor(t10) {
                  super(t10), this.isReady = t10?.isReady ?? false;
                }
                static areEqual(t10, i10) {
                  return super.areEqual(t10, i10) && t10.isReady === i10.isReady;
                }
              }, ty = new tm, t_ = (t10) => t10.ratingDisplayName !== undefined && t10.ratingSystem !== undefined, tb = (t10) => t10.playerStateChangedEvent$.pipe(R((t11, i10) => {
                if (i10.event === l.Rt.MEDIA_LOADING) {
                  let t12 = tv.extractFromVideoModel(i10.payload.videoModel);
                  return new tm(t_(t12) ? t12 : new tv);
                }
                return i10.event === l.Rt.MEDIA_RESOLVING ? ty : i10.event === l.Rt.PLAYING ? new tm({ ...t11, isReady: t_(t11) }) : t11;
              }, ty), (0, l.ft)(ty), (0, l.pt)((t11, i10) => tm.areEqual(t11, i10)), M({ bufferSize: 1, refCount: true })), tk = class {
                constructor(t10) {
                  this.ratingsAdvisories$ = tb(t10);
                }
              }, tActualVideo = () => {
                try {
                  return document.querySelector("video");
                } catch (t10) {
                  return null;
                }
              }, tVideoIsPlaying = () => {
                let t10 = tActualVideo();
                return !!(t10 && !t10.paused && !t10.ended);
              }, tVideoIsPaused = () => {
                let t10 = tActualVideo();
                return !!(t10 && (t10.paused || t10.ended));
              }, tC = (t10, i10) => {
                let a10, r10;
                return t10.playerStateChangedEvent$.subscribe((t11) => {
                  (a10 === l.r.PLAYING || a10 === l.r.PAUSED) && (r10 = a10), a10 = t11.event;
                }), () => {
                  let t11 = tActualVideo();
                  if (t11) {
                    if (t11.paused || t11.ended) {
                      if (a10 !== l.r.PLAYING) {
                        i10.play();
                        return;
                      }
                      try {
                        let a11 = t11.play();
                        a11?.catch?.((t12) => {
                          console.warn("[CrOptix] Native video.play() failed while recovering stale playing state; retrying through player.", t12), i10.pause(), setTimeout(() => i10.play(), 0);
                        });
                      } catch (t12) {
                        console.warn("[CrOptix] Native video.play() threw while recovering stale playing state; retrying through player.", t12), i10.pause(), setTimeout(() => i10.play(), 0);
                      }
                      return;
                    }
                    i10.pause();
                    return;
                  }
                  a10 === l.r.PLAYING ? i10.pause() : a10 === l.r.PAUSED || a10 === l.r.MEDIA_LOADED ? i10.play() : a10 === l.r.REBUFFERING && (r10 === l.r.PLAYING ? i10.pause() : r10 === l.r.PAUSED && i10.play());
                };
              }, tw = (t10, i10) => {
                let a10 = 0, r10 = null, s10 = null, o10 = t10.playheadUpdate$.subscribe((t11) => {
                  a10 = t11.playheadData.timelineTime;
                });
                return {
                  seek: (t11) => {
                    r10 = Math.max(0, (r10 === null ? a10 : r10) + t11), s10 && clearTimeout(s10), i10.seek(r10), s10 = setTimeout(() => {
                      r10 = null, s10 = null;
                    }, 1000);
                  },
                  dispose: () => {
                    s10 &&= (clearTimeout(s10), null), o10.unsubscribe();
                  }
                };
              }, tx = (t10) => t10.playerStateChangedEvent$.pipe(R((t11, i10) => {
                switch (i10.event) {
                  case l.Rt.PLAYING:
                    return true;
                  case l.Rt.PAUSED:
                  case l.Rt.MEDIA_LOADED:
                    return false;
                  case l.Rt.REBUFFERING:
                    return t11;
                  default:
                    return false;
                }
              }, false), (0, l.pt)(), M({ bufferSize: 1, refCount: true })), tE = class {
                constructor(t10, i10) {
                  this._isPlaying$ = new l.wt(false), this.isPlaying$ = this._isPlaying$.asObservable(), this._subscriptions = [], this._togglePlayPause = tC(t10, i10);
                  let a10 = () => {
                    this._isPlaying$.next(tVideoIsPlaying());
                  };
                  this._subscriptions.push(tx(t10).subscribe((t11) => {
                    this._isPlaying$.next(t11 && tVideoIsPlaying());
                  }));
                  ["play", "playing", "pause", "ended", "emptied", "loadstart", "stalled"].forEach((t11) => document.addEventListener(t11, a10, true));
                  this._removeVideoListeners = () => {
                    ["play", "playing", "pause", "ended", "emptied", "loadstart", "stalled"].forEach((t11) => document.removeEventListener(t11, a10, true));
                  }, setTimeout(a10, 0);
                }
                togglePlayPause() {
                  this._togglePlayPause();
                }
                dispose() {
                  this._subscriptions.forEach((t10) => t10.unsubscribe()), this._removeVideoListeners?.(), this._isPlaying$.complete?.();
                }
              }, tS = class {
                constructor(t10, i10) {
                  this.currentPosition$ = t10.playheadUpdate$.pipe((0, l.ht)((t11) => t11.playheadData.timelineTime), (0, l.pt)(), M({ bufferSize: 1, refCount: true }));
                  let { seek: a10, dispose: r10 } = tw(t10, i10);
                  this._relativeSeek = a10, this._disposeRelativeSeek = r10;
                }
                jumpForward() {
                  this._relativeSeek(5);
                }
                jumpBackward() {
                  this._relativeSeek(-5);
                }
                jumpForward10() {
                  this._relativeSeek(10);
                }
                jumpBackward10() {
                  this._relativeSeek(-10);
                }
                frameForward() {
                  this._relativeSeek(1 / 24);
                }
                frameBackward() {
                  this._relativeSeek(-1 / 24);
                }
                dispose() {
                  this._disposeRelativeSeek();
                }
              }, tT = class {
                constructor(t10, i10, a10) {
                  this._player = i10, this._profileProvider = a10, this._textTrackStorageKey = "croptix.textTrack.v1", this._availableTextTracks = [], this._activeTextTrack = undefined, this._subscriptions = [], this._selectedTextTrackInput$ = new l.wt(undefined), this.availableAudioTracks$ = t10.availableAudioTracksChanged$.pipe((0, l.ht)((t11) => t11.availableAudioTracks), (0, l.ft)([]), M({ bufferSize: 1, refCount: true })), this.activeAudioTrack$ = t10.activeAudioTrackChange$.pipe((0, l.ht)((t11) => t11.activeAudioTrack), (0, l.ft)(undefined), M({ bufferSize: 1, refCount: true })), this.availableTextTracks$ = t10.availableTextTracksChanged$.pipe((0, l.ht)((t11) => t11.availableTextTracks), (0, l.ft)([]), M({ bufferSize: 1, refCount: true })), this.activeTextTrack$ = I(t10.activeTextTrackChange$.pipe((0, l.ht)((t11) => t11.activeTextTrack)), this._selectedTextTrackInput$).pipe((0, l.ft)(undefined), M({ bufferSize: 1, refCount: true }));
                  this._subscriptions.push(t10.availableTextTracksChanged$.subscribe(({ availableTextTracks: t11 }) => {
                    this._availableTextTracks = t11 || [], this._activeTextTrack = undefined, this._selectedTextTrackInput$.next(undefined), setTimeout(() => this._applySavedTextTrack(), 0);
                  }));
                  this._subscriptions.push(t10.activeTextTrackChange$.subscribe(({ activeTextTrack: t11 }) => {
                    this._activeTextTrack = t11;
                  }));
                }
                _isClosedCaptionTrack(t10) {
                  let i10 = String(t10?.role || "").toLowerCase();
                  return t10?.role === l.x.CLOSED_CAPTION || i10 === "caption" || i10 === "closed_caption" || i10.includes("caption");
                }
                _trackRoleKey(t10) {
                  return t10 ? this._isClosedCaptionTrack(t10) ? "cc" : "subtitle" : "";
                }
                _trackKey(t10) {
                  return t10 ? `${t10.language || ""}|${this._trackRoleKey(t10)}|${t10.format || ""}` : "";
                }
                _readSavedTextTrackKey() {
                  try {
                    return localStorage.getItem(this._textTrackStorageKey) || "";
                  } catch (t10) {
                    return "";
                  }
                }
                _writeSavedTextTrack(t10) {
                  try {
                    localStorage.setItem(this._textTrackStorageKey, this._trackKey(t10));
                  } catch (t11) {}
                }
                _syncTextTrackProfile(t10) {
                  try {
                    this._profileProvider?.updateUserProfile?.({
                      prefersCaptions: t10.role === l.x.CLOSED_CAPTION,
                      preferredTextLanguage: t10.language
                    })?.catch((t11) => {
                      console.error("[CrOptix][Subtitles] Failed to sync subtitle preference to profile.", t11);
                    });
                  } catch (t11) {
                    console.error("[CrOptix][Subtitles] Failed to start subtitle profile sync.", t11);
                  }
                }
                _findSavedTextTrack() {
                  let t10 = this._readSavedTextTrackKey();
                  if (!t10 || !this._availableTextTracks.length)
                    return;
                  let [i10, a10, r10] = t10.split("|"), s10 = String(a10 || "").toLowerCase(), n10 = s10 === "cc" || s10 === "caption" || s10 === "closed_caption" || s10 === String(l.x.CLOSED_CAPTION) || s10.includes("caption"), o10 = this._availableTextTracks.filter((t11) => t11.language === i10), d2 = (t11) => n10 ? this._isClosedCaptionTrack(t11) : !this._isClosedCaptionTrack(t11);
                  if (!o10.length)
                    return;
                  return o10.find((t11) => d2(t11) && t11.format === r10) || o10.find(d2) || (n10 ? this._availableTextTracks.find((t11) => this._isClosedCaptionTrack(t11) && t11.language?.split("-")?.[0] === i10?.split("-")?.[0]) : undefined) || o10[0];
                }
                _applySavedTextTrack() {
                  let t10 = this._findSavedTextTrack();
                  t10 && this._trackKey(t10) !== this._trackKey(this._activeTextTrack) && (this._selectedTextTrackInput$.next(t10), this._activeTextTrack = t10, this._player.setTextTrack(t10));
                }
                setAudioTrack(t10) {
                  this._player.setAudioTrack(t10);
                }
                setTextTrack(t10) {
                  this._writeSavedTextTrack(t10), this._syncTextTrackProfile(t10), this._selectedTextTrackInput$.next(t10), this._activeTextTrack = t10, this._player.setTextTrack(t10);
                }
                dispose() {
                  this._subscriptions.forEach((t10) => t10.unsubscribe());
                }
              }, tP = (t10) => t10.volumeChanged$.pipe((0, l.ht)((t11) => Math.round(100 * t11.volume)), (0, l.pt)(), M({ bufferSize: 1, refCount: true })), tA = (t10) => t10.volumeChanged$.pipe((0, l.ht)((t11) => t11.muted), (0, l.pt)(), M({ bufferSize: 1, refCount: true }));
              function tL(t10) {
                if (!Number.isFinite(t10))
                  return "0:00";
                let i10 = Math.max(0, Math.floor(t10)), a10 = Math.floor(i10 / 3600), r10 = Math.floor(i10 % 3600 / 60), s10 = String(i10 % 60).padStart(2, "0");
                return a10 >= 1 ? `${a10}:${String(r10).padStart(2, "0")}:${s10}` : `${r10}:${s10}`;
              }
              var tI = (t10) => t10.videoModelUpdated$.pipe((0, l.ht)((t11) => {
                let i10 = t11.videoModel?.assetMetadata?.contentDuration;
                return Number.isFinite(i10) && i10 > 0 ? i10 : 0;
              }), M({ bufferSize: 1, refCount: true })), tR = (t10) => t10.playheadUpdate$.pipe((0, l.ht)((t11) => {
                let i10 = t11.playheadData.timelineTime;
                return Number.isFinite(i10) ? Math.floor(i10) : 0;
              }), (0, l.pt)(), (0, l.ht)((t11) => tL(t11)), M({ bufferSize: 1, refCount: true })), tD = (t10) => tI(t10).pipe((0, l.ht)((t11) => Number.isFinite(t11) ? Math.floor(t11) : 0), (0, l.pt)(), (0, l.ht)((t11) => tL(t11)), M({ bufferSize: 1, refCount: true })), tM = (t10) => {
                let i10 = tI(t10);
                return A([t10.playheadUpdate$, i10]).pipe((0, l.ht)(([t11, i11]) => {
                  let a10 = t11.playheadData.timelineTime;
                  return Math.max(0, i11 - (Number.isFinite(a10) ? Math.floor(a10) : 0));
                }), (0, l.pt)(), (0, l.ht)((t11) => tL(t11)), M({ bufferSize: 1, refCount: true }));
              }, tN = class {
                constructor(t10) {
                  this.elapsedTime$ = tR(t10), this.totalTime$ = tD(t10), this.remainingTime$ = tM(t10);
                }
              }, tj = class {
                constructor(t10, i10) {
                  this._currentVolume = 100, this._currentMuted = false, this._player = i10, this._volumeInput$ = new l.Tt, this._audioBoost = null, this.volumePercent$ = I(tP(t10).pipe((0, l.ht)((t11) => this._currentVolume > 100 ? this._currentVolume : t11)), this._volumeInput$).pipe((0, l.pt)(), M({ bufferSize: 1, refCount: true })), this.isMuted$ = tA(t10), this._volumeSubscription = this.volumePercent$.subscribe((t11) => {
                    this._currentVolume = t11;
                  }), this._mutedSubscription = this.isMuted$.subscribe((t11) => {
                    this._currentMuted = t11;
                  });
                }
                _ensureAudioBoost() {
                  if (this._audioBoost?.video === document.querySelector("video"))
                    return this._audioBoost;
                  try {
                    let t10 = document.querySelector("video");
                    if (!t10)
                      return null;
                    if (t10._croptixAudioBoost)
                      return this._audioBoost = t10._croptixAudioBoost;
                    let i10 = new (window.AudioContext || window.webkitAudioContext), a10 = i10.createMediaElementSource(t10), r10 = i10.createGain();
                    a10.connect(r10), r10.connect(i10.destination), t10._croptixAudioBoost = { context: i10, source: a10, gain: r10, video: t10 }, this._audioBoost = t10._croptixAudioBoost;
                    return this._audioBoost;
                  } catch (t10) {
                    return console.warn("[CrOptix][Volume] Failed to initialize audio boost.", t10), null;
                  }
                }
                _setAudioBoost(t10) {
                  let i10 = t10 > 100 ? t10 / 100 : 1, a10 = this._ensureAudioBoost();
                  if (!a10)
                    return;
                  try {
                    a10.context.state === "suspended" && a10.context.resume?.();
                    a10.gain.gain.value = i10;
                  } catch (t11) {
                    console.warn("[CrOptix][Volume] Failed to apply audio boost.", t11);
                  }
                }
                setVolumePercent(t10, i10 = false) {
                  let a10 = Math.max(0, Math.min(i10 ? 200 : 100, t10)), r10 = Math.min(100, a10);
                  this._currentMuted && this._player.setMute(false), this._player.setVolume(r10), this._setAudioBoost(a10), this._volumeInput$.next(a10);
                }
                incrementVolume() {
                  if (this._currentMuted) {
                    this._player.setMute(false);
                    return;
                  }
                  let t10 = Math.min(100, this._currentVolume + 5);
                  this.setVolumePercent(t10, false);
                }
                incrementBoostVolume() {
                  if (this._currentMuted) {
                    this._player.setMute(false);
                    return;
                  }
                  let t10 = Math.min(200, Math.max(100, this._currentVolume) + 5);
                  this.setVolumePercent(t10, true);
                }
                decrementVolume() {
                  if (this._currentMuted) {
                    this._player.setMute(false);
                    return;
                  }
                  let t10 = Math.max(0, this._currentVolume - 5);
                  this.setVolumePercent(t10, this._currentVolume > 100);
                }
                toggleMute() {
                  this._player.setMute(!this._currentMuted);
                }
                dispose() {
                  this._volumeSubscription.unsubscribe(), this._mutedSubscription.unsubscribe();
                }
              }, tO = class {
                constructor(t10, i10) {
                  this._activeSkipEvent$ = new l.wt(undefined), this._isAutoHideTimerExpired$ = new l.wt(false), this._subscriptions = [], this._annotations = [], this._stitchedElements = [], this._lastStreamTime = 0, this._autoSkipStorageKey = "croptix.autoSkipIntroOutro", this._autoSkippedEventIds = new Set, this._autoSkipEnabled = this._readAutoSkipEnabled(), this._autoSkipSettingsListener = () => {
                    this._autoSkipEnabled = this._readAutoSkipEnabled();
                    this._autoSkipEnabled && this._maybeAutoSkip(this._currentActiveAnnotation);
                  }, this._player = i10, this.activeSkipEvent$ = this._activeSkipEvent$.asObservable().pipe((0, l.pt)((t11, i11) => t11?.id === i11?.id)), this.isAutoHideTimerExpired$ = this._isAutoHideTimerExpired$.asObservable();
                  window.addEventListener("croptix_auto_skip_intro_outro_changed", this._autoSkipSettingsListener);
                  let a10 = t10.videoModelUpdated$.subscribe((t11) => {
                    this._handleVideoModelUpdate(t11.videoModel);
                  });
                  this._subscriptions.push(a10);
                  let r10 = t10.playheadUpdate$.subscribe((t11) => {
                    this._handlePlayheadUpdate(t11.playheadData.streamTime);
                  });
                  this._subscriptions.push(r10);
                }
                skip() {
                  if (!this._currentActiveAnnotation)
                    return;
                  let t10 = (0, l.c)(this._currentActiveAnnotation.end, this._stitchedElements);
                  this._player.seek(t10);
                }
                dispose() {
                  this._clearAutoHideTimer(), window.removeEventListener("croptix_auto_skip_intro_outro_changed", this._autoSkipSettingsListener), this._subscriptions.forEach((t10) => t10.unsubscribe()), this._activeSkipEvent$.complete(), this._isAutoHideTimerExpired$.complete();
                }
                _handleVideoModelUpdate(t10) {
                  this._autoSkippedEventIds.clear();
                  if (!t10.manifest?.annotations) {
                    this._annotations = [], this._stitchedElements = [], this._updateActiveSkipEvent(undefined);
                    return;
                  }
                  this._stitchedElements = t10.manifest.stitchedElements || [], this._annotations = t10.manifest.annotations.filter((t11) => t11.canSkip), this._handlePlayheadUpdate(this._lastStreamTime);
                }
                _handlePlayheadUpdate(t10) {
                  this._lastStreamTime = t10;
                  let i10 = this._annotations.find((i11) => t10 >= i11.start && t10 < i11.end);
                  i10?.id !== this._currentActiveAnnotation?.id && (this._currentActiveAnnotation = i10, this._updateActiveSkipEvent(i10));
                }
                _updateActiveSkipEvent(t10) {
                  t10?.id !== this._activeSkipEvent$.value?.id && (t10 ? (this._activeSkipEvent$.next({ id: t10.id, type: t10.type }), this._startAutoHideTimer(), this._maybeAutoSkip(t10)) : (this._activeSkipEvent$.next(undefined), this._clearAutoHideTimer(), this._isAutoHideTimerExpired$.next(false)));
                }
                _readAutoSkipEnabled() {
                  try {
                    return localStorage.getItem(this._autoSkipStorageKey) === "true";
                  } catch (t10) {
                    return false;
                  }
                }
                _isAutoSkippableEvent(t10) {
                  let i10 = String(t10?.type || "").toLowerCase();
                  return i10 === "intro" || i10 === "credits" || i10 === "outro";
                }
                _maybeAutoSkip(t10) {
                  if (!this._autoSkipEnabled || !t10 || !this._isAutoSkippableEvent(t10))
                    return;
                  let i10 = `${t10.id ?? t10.type}:${t10.start}:${t10.end}`;
                  if (this._autoSkippedEventIds.has(i10))
                    return;
                  this._autoSkippedEventIds.add(i10);
                  try {
                    let i11 = (0, l.c)(t10.end, this._stitchedElements);
                    Number.isFinite(i11) && this._player.seek(i11);
                  } catch (t11) {
                    console.warn("[CrOptix][AutoSkip] Failed to skip intro/outro event.", t11);
                  }
                }
                _startAutoHideTimer() {
                  this._clearAutoHideTimer(), this._isAutoHideTimerExpired$.next(false), this._autoHideTimer = setTimeout(() => {
                    this._isAutoHideTimerExpired$.next(true);
                  }, 5000);
                }
                _clearAutoHideTimer() {
                  this._autoHideTimer !== undefined && (clearTimeout(this._autoHideTimer), this._autoHideTimer = undefined);
                }
              }, tV = class {
                constructor(t10, i10) {
                  this._player = i10, this._resolutionStorageKey = "croptix.videoQuality.height.v1", this._selectedBucket$ = new l.Ct(1), this._qualitySubscription = t10.videoQualityChanged$.pipe((0, l.ht)((t11) => t11.newBucket), (0, l.pt)()).subscribe((t11) => {
                    let i11 = this._readResolutionBucket();
                    if (i11 === "auto" || /^height:\d+$/.test(String(i11))) {
                      i11 !== this._lastBucket && (this._lastBucket = i11, this._selectedBucket$.next(i11));
                      return;
                    }
                    t11 !== this._lastBucket && (this._lastBucket = t11, this._selectedBucket$.next(t11));
                  }), this.selectedQualityBucket$ = this._selectedBucket$.asObservable(), this.isAutoplayNextEnabled$ = t10.autoplayNextChanged$.pipe((0, l.ht)((t11) => t11.enabled), (0, l.pt)(), M({ bufferSize: 1, refCount: true })), this._autoplayNextSubscription = this.isAutoplayNextEnabled$.subscribe((t11) => {
                    this._currentAutoplayNextEnabled = t11;
                  }), this._videoModelSubscription = t10.videoModelUpdated$.subscribe(() => {
                    this._lastRequestedResolutionBucket = undefined, this._lastAppliedResolutionBucket = undefined, this._savedResolutionAppliedForMedia = false;
                    this._queueSavedResolutionApply();
                  });
                  this._lastBucket = this._readResolutionBucket(), this._selectedBucket$.next(this._lastBucket);
                  this._queueSavedResolutionApply();
                }
                _findShakaPlayer(t10 = this._player, i10 = new Set, a10 = 0) {
                  if (!t10 || i10.has(t10) || a10 > 7)
                    return null;
                  i10.add(t10);
                  if (typeof t10.getVariantTracks == "function" && typeof t10.selectVariantTrack == "function")
                    return t10;
                  for (let r10 of ["_player", "player", "mediaEngine", "_mediaEngine", "playerOrchestrator", "playerActionsOrchestrator"]) {
                    let s10 = t10?.[r10], n10 = this._findShakaPlayer(s10, i10, a10 + 1);
                    if (n10)
                      return n10;
                  }
                  if (a10 < 3 && typeof t10 == "object")
                    for (let r10 of Object.keys(t10).slice(0, 80)) {
                      let s10 = t10[r10];
                      if (s10 && typeof s10 == "object") {
                        let t11 = this._findShakaPlayer(s10, i10, a10 + 1);
                        if (t11)
                          return t11;
                      }
                    }
                  return null;
                }
                _getShakaPlayer() {
                  let t10 = this._findShakaPlayer();
                  return t10 && this._bindShakaQualityEvents(t10), t10;
                }
                _bindShakaQualityEvents(t10) {
                  if (!t10 || this._boundShakaPlayer === t10)
                    return;
                  this._unbindShakaQualityEvents?.();
                  this._boundShakaPlayer = t10;
                  try {
                    t10.configure({ streaming: { bufferingGoal: 30 } });
                  } catch (t11) {
                    this._errorQuality("Failed to set Shaka buffering goal.", t11);
                  }
                  let i10 = this._readResolutionBucket(), a10 = /^height:\d+$/.test(String(i10)), r10 = (i11) => {
                    let t11 = this._readResolutionBucket();
                    if (/^height:\d+$/.test(String(t11))) {
                      this._logQuality("Shaka quality event fired; applying fixed saved quality.", {
                        eventType: i11?.type,
                        savedBucket: t11,
                        renderedHeight: this._getRenderedHeight()
                      });
                      this._lastRequestedResolutionBucket = undefined, this.setResolutionBucket(t11, true, true);
                    }
                  }, s10 = ["streaming", "trackschanged", "loaded", "variantchanged", "adaptation"];
                  a10 && (() => {
                    try {
                      t10.configure({ abr: { enabled: false } });
                      this._logQuality("Disabled Shaka ABR immediately after player discovery.", { savedBucket: i10 });
                    } catch (t11) {
                      this._errorQuality("Failed to disable Shaka ABR immediately after player discovery.", t11);
                    }
                  })();
                  if (typeof t10.addEventListener == "function") {
                    s10.forEach((i11) => t10.addEventListener(i11, r10));
                    this._unbindShakaQualityEvents = () => {
                      s10.forEach((i11) => t10.removeEventListener?.(i11, r10));
                    };
                    this._logQuality("Bound Shaka quality events.", { events: s10, savedBucket: i10 });
                  } else
                    this._warnQuality("Shaka player does not expose addEventListener; falling back to manual apply calls only.", { savedBucket: i10 });
                  r10({ type: "initial-bind" });
                }
                _readResolutionBucket() {
                  try {
                    return localStorage.getItem(this._resolutionStorageKey) || "auto";
                  } catch (t10) {
                    return "auto";
                  }
                }
                _writeResolutionBucket(t10) {
                  try {
                    localStorage.setItem(this._resolutionStorageKey, t10);
                  } catch (t11) {}
                }
                _logQuality(t10, i10) {
                  return;
                }
                _warnQuality(t10, i10) {
                  try {
                    console.warn(`[CrOptix][Quality] ${t10}`, i10 ?? "");
                  } catch (t11) {}
                }
                _errorQuality(t10, i10) {
                  try {
                    console.error(`[CrOptix][Quality] ${t10}`, i10 ?? "");
                  } catch (t11) {}
                }
                _heightFromResolutionBucket(t10) {
                  let i10 = /^height:(\d+)$/.exec(String(t10 || ""));
                  return i10 ? Number(i10[1]) : null;
                }
                _getAllowedVariantTracks(t10) {
                  try {
                    return t10.getVariantTracks().filter((t11) => t11 && t11.height && t11.width && t11.allowed !== false);
                  } catch (t11) {
                    this._errorQuality("Failed to read Shaka variant tracks.", t11);
                    return [];
                  }
                }
                _selectVariantForHeight(t10, i10) {
                  let a10 = this._getAllowedVariantTracks(t10);
                  if (!a10.length) {
                    this._warnQuality("No allowed Shaka variant tracks available yet.", { targetHeight: i10 });
                    return null;
                  }
                  let r10 = [...new Set(a10.map((t11) => t11.height).filter(Boolean))].sort((t11, i11) => t11 - i11), s10 = r10.includes(i10) ? i10 : r10.find((t11) => t11 > i10) ?? r10[r10.length - 1], n10 = a10.filter((t11) => t11.height === s10).sort((t11, i11) => (i11.bandwidth || 0) - (t11.bandwidth || 0))[0];
                  this._logQuality("Resolved target height to Shaka track.", {
                    requestedHeight: i10,
                    availableHeights: r10,
                    selectedHeight: s10,
                    fallbackUsed: s10 !== i10,
                    selectedTrack: n10 ? { id: n10.id, height: n10.height, width: n10.width, bandwidth: n10.bandwidth, active: n10.active, allowed: n10.allowed } : null
                  });
                  return n10 ? { track: n10, bucket: `height:${s10}` } : null;
                }
                _formatBitrate(t10) {
                  return typeof t10 == "number" && t10 > 0 ? ` • ${Math.round(t10 / 1000)} kbps` : "";
                }
                _getRenderedHeight() {
                  try {
                    let t10 = document.querySelector("video");
                    return t10 && t10.videoHeight ? t10.videoHeight : null;
                  } catch (t10) {
                    return null;
                  }
                }
                _isRenderedBelowAppliedBucket() {
                  let t10 = this._heightFromResolutionBucket(this._lastAppliedResolutionBucket), i10 = this._getRenderedHeight();
                  return !!(t10 && i10 && i10 < t10);
                }
                _queueSavedResolutionApply() {
                  if (this._resolutionApplyTimer)
                    clearInterval(this._resolutionApplyTimer);
                  let t10 = 0;
                  this._logQuality("Starting Shaka quality discovery loop.", { savedBucket: this._readResolutionBucket() });
                  this._resolutionApplyTimer = setInterval(() => {
                    t10++, this._getShakaPlayer(), this._boundShakaPlayer && this.applySavedResolution(t10), (this._boundShakaPlayer || t10 >= 60) && (this._logQuality("Stopping Shaka quality discovery loop.", {
                      attempts: t10,
                      bound: !!this._boundShakaPlayer,
                      applied: this._savedResolutionAppliedForMedia,
                      requestedBucket: this._lastRequestedResolutionBucket,
                      appliedBucket: this._lastAppliedResolutionBucket,
                      renderedHeight: this._getRenderedHeight()
                    }), clearInterval(this._resolutionApplyTimer), this._resolutionApplyTimer = undefined);
                  }, 250);
                }
                getResolutionQualities() {
                  let t10 = this._getShakaPlayer(), i10 = this._readResolutionBucket();
                  if (!t10)
                    return [{ label: "Auto", bucket: "auto", selected: i10 === "auto" }];
                  let a10 = this._getAllowedVariantTracks(t10);
                  let r10 = new Map;
                  for (let t11 of a10) {
                    let i11 = r10.get(t11.height);
                    (!i11 || (t11.bandwidth || 0) > (i11.bandwidth || 0)) && r10.set(t11.height, t11);
                  }
                  let s10 = [...r10.values()].sort((t11, i11) => (i11.height || 0) - (t11.height || 0)), o10 = this._getRenderedHeight(), n10 = [
                    {
                      label: `Auto${i10 === "auto" && o10 ? ` (${o10}p)` : ""}`,
                      bucket: "auto",
                      selected: i10 === "auto"
                    }
                  ];
                  return s10.forEach((t11) => {
                    let a11 = `height:${t11.height}`;
                    n10.push({
                      label: `${t11.height}p${this._formatBitrate(t11.bandwidth)}`,
                      bucket: a11,
                      height: t11.height,
                      width: t11.width,
                      bandwidth: t11.bandwidth,
                      selected: i10 === a11
                    });
                  }), n10;
                }
                applySavedResolution(t10 = 0) {
                  if (this._savedResolutionAppliedForMedia) {
                    let i11 = this._readResolutionBucket();
                    if (i11 !== "auto" && this._isRenderedBelowAppliedBucket()) {
                      this._warnQuality("Rendered video height is below fixed quality; re-applying selected Shaka track.", {
                        attempt: t10,
                        savedBucket: i11,
                        appliedBucket: this._lastAppliedResolutionBucket,
                        renderedHeight: this._getRenderedHeight()
                      });
                      this._savedResolutionAppliedForMedia = false, this._lastRequestedResolutionBucket = undefined;
                      this.setResolutionBucket(i11, true, true);
                      return;
                    }
                    this._logQuality("Skipping saved quality apply; already applied for current media.", {
                      attempt: t10,
                      requestedBucket: this._lastRequestedResolutionBucket,
                      appliedBucket: this._lastAppliedResolutionBucket,
                      renderedHeight: this._getRenderedHeight()
                    });
                    return;
                  }
                  let i10 = this._readResolutionBucket();
                  this._logQuality("Applying saved quality bucket.", { attempt: t10, savedBucket: i10, renderedHeight: this._getRenderedHeight() });
                  if (!i10 || i10 === "auto") {
                    i10 !== this._lastBucket && (this._lastBucket = "auto", this._selectedBucket$.next("auto"));
                    this._savedResolutionAppliedForMedia = true;
                    return;
                  }
                  this.setResolutionBucket(i10, true);
                  if (this._lastRequestedResolutionBucket === i10)
                    this._isRenderedBelowAppliedBucket() ? this._warnQuality("Fixed quality was selected but rendered height is still lower; keeping apply loop alive.", {
                      savedBucket: i10,
                      appliedBucket: this._lastAppliedResolutionBucket,
                      renderedHeight: this._getRenderedHeight()
                    }) : (this._savedResolutionAppliedForMedia = true, this._logQuality("Saved fixed quality is considered applied.", {
                      savedBucket: i10,
                      appliedBucket: this._lastAppliedResolutionBucket,
                      renderedHeight: this._getRenderedHeight()
                    }));
                }
                setResolutionBucket(t10, i10 = false, a10 = false) {
                  let r10 = this._getShakaPlayer();
                  if (this._writeResolutionBucket(t10), t10 !== this._lastBucket && (this._lastBucket = t10, this._selectedBucket$.next(t10)), !r10)
                    return void this._warnQuality("Cannot set quality; Shaka player was not found yet.", { bucket: t10, silent: i10 });
                  if (!a10 && this._lastRequestedResolutionBucket === t10) {
                    this._logQuality("Skipping quality set; requested bucket already applied/requested.", {
                      bucket: t10,
                      appliedBucket: this._lastAppliedResolutionBucket,
                      renderedHeight: this._getRenderedHeight()
                    });
                    return;
                  }
                  if (t10 === "auto") {
                    try {
                      r10.configure({ abr: { enabled: true } });
                      this._logQuality("Enabled Shaka ABR auto quality.", { bucket: t10 });
                    } catch (t11) {}
                    this._lastRequestedResolutionBucket = t10, this._lastAppliedResolutionBucket = t10;
                    return;
                  }
                  let s10 = this._heightFromResolutionBucket(t10);
                  if (!s10)
                    return void this._warnQuality("Invalid fixed quality bucket; expected height:<number>.", { bucket: t10 });
                  let n10 = this._selectVariantForHeight(r10, s10);
                  if (!n10)
                    return;
                  try {
                    r10.configure({ abr: { enabled: false } });
                    this._logQuality("Disabled Shaka ABR for fixed quality.", { bucket: t10, forced: a10 });
                  } catch (t11) {
                    this._errorQuality("Failed to disable Shaka ABR before selecting fixed quality.", t11);
                  }
                  try {
                    r10.selectVariantTrack(n10.track, true, 0);
                    n10.bucket !== this._lastBucket && (this._lastBucket = n10.bucket, this._selectedBucket$.next(n10.bucket));
                    this._lastRequestedResolutionBucket = t10, this._lastAppliedResolutionBucket = n10.bucket;
                    this._logQuality("Selected fixed Shaka variant track.", {
                      requestedBucket: t10,
                      appliedBucket: n10.bucket,
                      forced: a10,
                      track: {
                        id: n10.track.id,
                        height: n10.track.height,
                        width: n10.track.width,
                        bandwidth: n10.track.bandwidth,
                        active: n10.track.active,
                        allowed: n10.track.allowed
                      },
                      renderedHeight: this._getRenderedHeight()
                    });
                  } catch (t11) {
                    this._errorQuality("Failed to select fixed Shaka variant track.", { silent: i10, error: t11 });
                  }
                }
                setPlaybackQualityBucket(t10) {
                  if (t10 === "auto" || /^height:\d+$/.test(String(t10))) {
                    this.setResolutionBucket(t10);
                    return;
                  }
                  t10 !== this._lastBucket && (this._lastBucket = t10, this._selectedBucket$.next(t10)), this._player.setPlaybackQualityBucket(t10);
                }
                toggleAutoplayNext() {
                  this._currentAutoplayNextEnabled !== undefined && this._player.setAutoplayNext(!this._currentAutoplayNextEnabled);
                }
                dispose() {
                  this._qualitySubscription.unsubscribe(), this._autoplayNextSubscription.unsubscribe(), this._videoModelSubscription.unsubscribe(), this._resolutionApplyTimer && clearInterval(this._resolutionApplyTimer), this._unbindShakaQualityEvents?.(), this._selectedBucket$.complete();
                }
              }, tH = class {
                constructor(t10, i10) {
                  this._isVisible$ = new l.wt(false), this._subscriptions = [], this._player = i10, this.isVisible$ = this._isVisible$.asObservable().pipe((0, l.pt)());
                  let a10 = t10.nextEpisodeGuidUpdated$.subscribe(({ nextEpisodeGuid: t11 }) => {
                    this._nextEpisodeGuid = t11;
                    let i11 = this._nextEpisodeGuid !== undefined;
                    this._isVisible$.next(i11);
                  });
                  this._subscriptions.push(a10);
                }
                loadNextEpisode() {
                  if (this._nextEpisodeGuid === undefined) {
                    l.Ft.info("NextEpisodeVM: loadNextEpisode() called but no next episode GUID is available — ignoring");
                    return;
                  }
                  try {
                    document.getElementById("player-ne-placeholder")?.remove();
                  } catch (t10) {}
                  l.Ft.info("NextEpisodeVM: requesting asset queue update (jump=1) for next episode"), this._player.requestAssetQueueUpdate({ jump: 1 });
                }
                dispose() {
                  this._subscriptions.forEach((t10) => t10.unsubscribe()), this._isVisible$.complete();
                }
              }, tU = class {
                constructor(t10, i10, a10) {
                  this._currentDuration = 0, this._stitchedElements = [], this._rootView = a10, this.setPosition = (t11) => {
                    t11 >= 0 && t11 <= this._currentDuration && this._playerHandle.seek(t11);
                  }, this.getThumbnailUri = (t11) => this._playerHandle.getThumbnailUrl(t11), this.getBufferedEnd = () => {
                    try {
                      let t11 = this._rootView?.querySelector("video");
                      if (!t11 || !Number.isFinite(t11.currentTime))
                        return 0;
                      let i11 = t11.currentTime;
                      for (let a11 = 0;a11 < t11.buffered.length; a11++)
                        if (t11.currentTime >= t11.buffered.start(a11) - 0.1 && t11.currentTime <= t11.buffered.end(a11)) {
                          i11 = t11.buffered.end(a11);
                          break;
                        }
                      return Math.max(0, (0, l.c)(i11, this._stitchedElements));
                    } catch (t11) {
                      return 0;
                    }
                  }, this._playerHandle = i10, this.currentPlayhead$ = t10.playheadUpdate$.pipe((0, l.ht)((t11) => t11.playheadData.timelineTime), (0, l.ft)(0)), this.duration$ = t10.videoModelUpdated$.pipe((0, l.ht)((t11) => {
                    this._stitchedElements = t11.videoModel.manifest.stitchedElements || [];
                    let i11 = this._stitchedElements.filter((t12) => t12.timeline).reduce((t12, i12) => t12 + (i12.end - i12.start), 0);
                    return isNaN(i11) || !isFinite(i11) || i11 <= 0 ? t11.videoModel.assetMetadata.contentDuration : i11;
                  }), (0, l.ft)(0), (0, l.dt)((t11) => {
                    this._currentDuration = t11;
                  })), this.chapterSegments$ = t10.videoModelUpdated$.pipe((0, l.ht)((t11) => {
                    let i11 = t11.videoModel.manifest, a11 = i11.stitchedElements || [];
                    return (i11.annotations || []).map((t12) => {
                      let i12 = (0, l.c)(t12.start, a11), r10 = (0, l.c)(t12.end, a11), s10 = String(t12.type || "main").toLowerCase();
                      return Number.isFinite(i12) && Number.isFinite(r10) && r10 > i12 ? {
                        id: t12.id || `${s10}-${i12}-${r10}`,
                        type: s10,
                        localizedLabel: t12.localizedLabel,
                        start: Math.max(0, i12),
                        end: Math.max(0, r10)
                      } : undefined;
                    }).filter(Boolean).sort((t12, i12) => t12.start - i12.start);
                  }), (0, l.ft)([]));
                }
              }, tF = class {
                constructor(t10, i10, a10, r10) {
                  this.playPauseButtonVM = new tE(i10, t10), this.jumpButtonsVM = new tS(i10, t10), this.volumeVM = new tj(i10, t10), this.trackSelectionVM = new tT(i10, t10, a10), this.timestampDisplayVM = new tN(i10), this.playbackSpeedMenuVM = new tg(i10, t10), this.timelineScrubberVM = new tU(i10, t10, r10), this.skipEventVM = new tO(i10, t10), this.ratingsAdvisoriesVM = new tk(i10), this.errorOverlayVM = new tu(i10, t10), this.fullScreenVM = new th(i10, t10), this.settingsVM = new tV(i10, t10), this.bufferingVM = new tr(i10), this.nextEpisodeVM = new tH(i10, t10);
                }
                dispose() {
                  this.jumpButtonsVM.dispose(), this.playPauseButtonVM.dispose(), this.volumeVM.dispose(), this.trackSelectionVM.dispose(), this.playbackSpeedMenuVM.dispose(), this.skipEventVM.dispose(), this.errorOverlayVM.dispose(), this.fullScreenVM.dispose(), this.settingsVM.dispose(), this.nextEpisodeVM.dispose();
                }
              }, t$ = {
                titleOnly: "assetMetadata.fullTitle.titleOnly",
                episodeOnly: "assetMetadata.fullTitle.episodeOnly",
                specialEpisodeOnly: "assetMetadata.fullTitle.specialEpisodeOnly",
                seasonOnly: "assetMetadata.fullTitle.seasonOnly",
                specialSeasonOnly: "assetMetadata.fullTitle.specialSeasonOnly",
                seasonAndEpisode: "assetMetadata.fullTitle.seasonAndEpisode",
                seasonAndSpecialEpisode: "assetMetadata.fullTitle.seasonAndSpecialEpisode",
                specialSeasonAndEpisode: "assetMetadata.fullTitle.specialSeasonAndEpisode",
                specialSeasonAndSpecialEpisode: "assetMetadata.fullTitle.specialSeasonAndSpecialEpisode"
              }, tB = class t10 {
                constructor(t11) {
                  this._subscriptions = [], this._timelineTime = undefined, this._currentDuration = 0, this._currentPlaybackRate = l.D.NORMAL_SPEED, this._posterResolver = t11;
                }
                setLocalizationManager(t11) {
                  this._localizationManager = t11;
                }
                initialize(i10, a10) {
                  if (this._playerControls = i10, !this._isMediaSessionSupported()) {
                    l.Ft.warn("BrowserMediaSessionHandler: Media Session API is not supported in this browser", t10.HANDLER_ID);
                    return;
                  }
                  l.Ft.info("BrowserMediaSessionHandler: Initialized", t10.HANDLER_ID), this._setupActionHandlers(), this._setupEventListeners(a10);
                }
                _isMediaSessionSupported() {
                  return "u" > typeof navigator && "mediaSession" in navigator;
                }
                _setupActionHandlers() {
                  let i10 = this._playerControls;
                  if (i10) {
                    for (let [a10, r10] of [
                      [
                        "play",
                        () => {
                          l.Ft.info("BrowserMediaSessionHandler: Action handler triggered - play", t10.HANDLER_ID), i10.play();
                        }
                      ],
                      [
                        "pause",
                        () => {
                          l.Ft.info("BrowserMediaSessionHandler: Action handler triggered - pause", t10.HANDLER_ID), i10.pause();
                        }
                      ],
                      [
                        "stop",
                        () => {
                          l.Ft.info("BrowserMediaSessionHandler: Action handler triggered - stop", t10.HANDLER_ID), i10.seek(0), i10.pause();
                        }
                      ],
                      [
                        "seekbackward",
                        ({ seekOffset: a11 }) => {
                          if (this._timelineTime === undefined) {
                            l.Ft.warn("BrowserMediaSessionHandler: Cannot handle seekbackward action - current timeline time is unknown", t10.HANDLER_ID);
                            return;
                          }
                          let r11 = a11 ?? t10.SEEK_OFFSET, s10 = Math.max(0, this._timelineTime - r11);
                          l.Ft.info(`BrowserMediaSessionHandler: Action handler triggered - seekbackward by ${r11}s to ${s10}s`, t10.HANDLER_ID), i10.seek(this._timelineTime - r11);
                        }
                      ],
                      [
                        "seekforward",
                        ({ seekOffset: a11 }) => {
                          if (this._timelineTime === undefined) {
                            l.Ft.warn("BrowserMediaSessionHandler: Cannot handle seekforward action - current timeline time is unknown", t10.HANDLER_ID);
                            return;
                          }
                          let r11 = a11 ?? t10.SEEK_OFFSET, s10 = Math.min(this._currentDuration, this._timelineTime + r11);
                          l.Ft.info(`BrowserMediaSessionHandler: Action handler triggered - seekforward by ${r11}s to ${s10}s`, t10.HANDLER_ID), i10.seek(this._timelineTime + r11);
                        }
                      ],
                      [
                        "seekto",
                        ({ seekTime: a11 }) => {
                          a11 !== undefined && (l.Ft.info(`BrowserMediaSessionHandler: Action handler triggered - seekto ${a11}s`, t10.HANDLER_ID), i10.seek(a11));
                        }
                      ]
                    ])
                      try {
                        navigator.mediaSession.setActionHandler(a10, r10);
                      } catch (i11) {
                        l.Ft.warn(`BrowserMediaSessionHandler: The media session action "${a10}" is not supported in this browser.`, i11, t10.HANDLER_ID);
                      }
                    l.Ft.info("BrowserMediaSessionHandler: Action handlers registered", t10.HANDLER_ID);
                  }
                }
                _setupEventListeners(i10) {
                  this._subscriptions.push(i10.videoModelUpdated$.subscribe((t11) => {
                    t11.videoModel && (this._updateMetadata(t11.videoModel), this._currentDuration = t11.videoModel.assetMetadata.contentDuration);
                  })), this._subscriptions.push(i10.playheadUpdate$.subscribe(({ playheadData: t11 }) => {
                    this._timelineTime = t11.timelineTime, this._updatePositionState(this._timelineTime);
                  })), this._subscriptions.push(i10.playerStateChangedEvent$.subscribe(({ event: t11 }) => {
                    this._updatePlaybackState(t11);
                  })), this._subscriptions.push(i10.playbackRateChanged$.subscribe(({ rate: t11 }) => {
                    this._currentPlaybackRate = t11, this._updatePositionState(this._timelineTime);
                  })), l.Ft.info("BrowserMediaSessionHandler: Event listeners registered", t10.HANDLER_ID);
                }
                _updateMetadata(i10) {
                  try {
                    let { assetMetadata: a10 } = i10, { key: r10, values: s10 } = function(t11) {
                      let { title: i11, titleFormat: a11, seasonDisplayString: r11, episodeDisplayString: s11 } = t11, n11 = t$[a11], o11 = { title: i11 };
                      return r11 !== undefined && (o11.season = r11), s11 !== undefined && (o11.episode = s11), { key: n11, values: o11 };
                    }(a10), n10 = this._localizationManager?.t(r10, s10) || a10.title, o10 = a10.seriesTitle ?? "";
                    if (n10 === this._currentMetadataTitle && o10 === this._currentMetadataArtist)
                      return;
                    let d2 = { title: n10, artist: o10 }, u2 = this._resolveArtwork(i10.id);
                    u2.length > 0 && (d2.artwork = u2), navigator.mediaSession.metadata = new MediaMetadata(d2), this._currentMetadataTitle = n10, this._currentMetadataArtist = o10, l.Ft.info(`BrowserMediaSessionHandler: Metadata updated - title: "${d2.title}", artist: "${d2.artist}"`, t10.HANDLER_ID);
                  } catch (i11) {
                    l.Ft.error(`BrowserMediaSessionHandler: Failed to update metadata - ${String(i11)}`, t10.HANDLER_ID);
                  }
                }
                _resolveArtwork(i10) {
                  if (!this._posterResolver)
                    return [];
                  let { width: a10, height: r10 } = t10.ARTWORK_SIZE, s10 = this._posterResolver.resolve(i10, { width: a10, height: r10 });
                  return s10 ? [{ src: s10, sizes: `${a10}x${r10}`, type: "image/jpeg" }] : [];
                }
                _updatePlaybackState(i10) {
                  let a10;
                  switch (i10) {
                    case l.r.PLAYING:
                      a10 = "playing";
                      break;
                    case l.r.PAUSED:
                      a10 = "paused";
                      break;
                    case l.r.MEDIA_RESOLVING:
                    case l.r.MEDIA_LOADED:
                    case l.r.STOPPED:
                    case l.r.ERROR:
                    case l.r.DISPOSED:
                      a10 = "none";
                      break;
                    default:
                      return;
                  }
                  try {
                    navigator.mediaSession.playbackState = a10, l.Ft.info(`BrowserMediaSessionHandler: Playback state updated to "${a10}" (player state: "${i10}")`, t10.HANDLER_ID);
                  } catch (i11) {
                    l.Ft.warn(`BrowserMediaSessionHandler: Failed to update playback state - ${String(i11)}`, t10.HANDLER_ID);
                  }
                }
                _updatePositionState(i10) {
                  if (!(this._currentDuration <= 0 || i10 === undefined || this._timelineTime === undefined))
                    try {
                      navigator.mediaSession.setPositionState({
                        duration: this._currentDuration,
                        playbackRate: this._currentPlaybackRate,
                        position: Math.min(i10, this._currentDuration)
                      });
                    } catch (i11) {
                      l.Ft.warn(`BrowserMediaSessionHandler: Failed to set position state - ${String(i11)}`, t10.HANDLER_ID);
                    }
                }
                _clearMediaSession() {
                  this._isMediaSessionSupported() && (navigator.mediaSession.metadata = null, navigator.mediaSession.playbackState = "none", l.Ft.info("BrowserMediaSessionHandler: Media session cleared", t10.HANDLER_ID));
                }
                _clearActionHandlers() {
                  if (this._isMediaSessionSupported()) {
                    for (let t11 of ["play", "pause", "stop", "seekbackward", "seekforward", "seekto"])
                      try {
                        navigator.mediaSession.setActionHandler(t11, null);
                      } catch {}
                    l.Ft.info("BrowserMediaSessionHandler: Action handlers cleared", t10.HANDLER_ID);
                  }
                }
                dispose() {
                  l.Ft.info("BrowserMediaSessionHandler: Disposing resources", t10.HANDLER_ID), this._subscriptions.forEach((t11) => t11.unsubscribe()), this._subscriptions = [], this._clearActionHandlers(), this._clearMediaSession(), this._playerControls = undefined, this._timelineTime = undefined, this._currentDuration = 0, this._currentPlaybackRate = l.D.NORMAL_SPEED;
                }
              };
              tB.SEEK_OFFSET = 10, tB.HANDLER_ID = "BrowserMediaSessionHandler", tB.ARTWORK_SIZE = { width: 960, height: 540 };
              var tq, tK, tZ = _((t10, i10) => {
                (function() {
                  var t11 = {}.hasOwnProperty;
                  function a10() {
                    for (var i11 = "", s10 = 0;s10 < arguments.length; s10++) {
                      var n10 = arguments[s10];
                      n10 && (i11 = r10(i11, function(i12) {
                        if (typeof i12 == "string" || typeof i12 == "number")
                          return i12;
                        if (typeof i12 != "object")
                          return "";
                        if (Array.isArray(i12))
                          return a10.apply(null, i12);
                        if (i12.toString !== Object.prototype.toString && !i12.toString.toString().includes("[native code]"))
                          return i12.toString();
                        var s11 = "";
                        for (var n11 in i12)
                          t11.call(i12, n11) && i12[n11] && (s11 = r10(s11, n11));
                        return s11;
                      }(n10)));
                    }
                    return i11;
                  }
                  function r10(t12, i11) {
                    return i11 ? t12 ? t12 + " " + i11 : t12 + i11 : t12;
                  }
                  i10 !== undefined && i10.exports ? (a10.default = a10, i10.exports = a10) : typeof define == "function" && typeof define.amd == "object" && define.amd ? define("classnames", [], function() {
                    return a10;
                  }) : window.classNames = a10;
                })();
              }), tz = Object.freeze([
                "kat:flex kat:items-center kat:justify-center",
                "kat:h-44 kat:w-44 kat:@lg:h-64 kat:@lg:w-64",
                "kat:font-bold kat:leading-24 kat:tracking-[-0.36px] kat:@lg:tracking-[-0.52px]",
                "kat:border-4 kat:p-6 kat:fill-white kat:text-white kat:bg-transparent kat:hover:bg-neutral-700",
                "kat:transition-opacity kat:duration-200 kat:ease-linear kat:hover:opacity-100 kat:focus-visible:opacity-100",
                "kat:active:fill-white kat:active:text-white",
                "kat:focus-visible:border-neutral-50 kat:focus-visible:border-solid kat:select-none kat:cursor-pointer"
              ]), tG = C(tZ(), 1), tW = { top: "kat:rounded-tl-none kat:rounded-tr-none", bottom: "kat:rounded-bl-none kat:rounded-br-none" }, tJ = ({ Icon: t10, label: i10, onClick: a10, isActive: r10 = false, connectedSide: s10, ...n10 }) => {
                let o10 = typeof t10 == "string" && t10.length > 4;
                return (0, d.jsx)("button", {
                  onClick: (t11) => {
                    t11.preventDefault(), a10();
                  },
                  "aria-label": i10,
                  type: "button",
                  className: (0, h.useMemo)(() => (0, tG.default)(...tz, o10 ? "kat:text-[14px] kat:@lg:text-[20px]" : "kat:text-[18px] kat:@lg:text-[24px]", r10 ? "kat:rounded-lg kat:bg-transparent kat:border-transparent kat:opacity-100 kat:hover:bg-neutral-700" : "kat:rounded-full kat:border-transparent kat:opacity-100", r10 && s10 && tW[s10]), [o10, r10, s10]),
                  ...n10,
                  children: t10
                });
              }, tY = (t10) => (0, d.jsx)(tJ, { ...t10, connectedSide: "top" }), tQ = (t10) => (0, d.jsxs)("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 158 158",
                ...t10,
                children: [
                  (0, d.jsx)("path", {
                    fill: "#ff5e00",
                    d: "M20.021,88.314c.038-37.792,30.705-68.398,68.499-68.36,36.179.036,65.768,28.149,68.191,63.705.089-1.516.137-3.045.139-4.582.043-42.995-34.776-77.886-77.772-77.929C36.082,1.104,1.193,35.925,1.149,78.92c-.043,42.998,34.776,77.889,77.772,77.933,1.778.002,3.544-.061,5.29-.174-35.848-2.195-64.227-31.972-64.191-68.365Z"
                  }),
                  (0, d.jsx)("path", {
                    fill: "#ff5e00",
                    d: "M125.664,89.323c-14.69-.015-26.586-11.937-26.572-26.627.012-11.523,7.349-21.325,17.597-25.01-8.114-4.284-17.355-6.714-27.166-6.723-32.273-.033-58.459,26.103-58.492,58.372-.033,32.273,26.101,58.461,58.374,58.493,32.271.033,58.459-26.102,58.492-58.376.004-3.657-.333-7.235-.974-10.709-4.86,6.431-12.574,10.588-21.259,10.58Z"
                  })
                ]
              }), tX = ({ size: t10 = 80, ...i10 }) => (0, d.jsx)(tQ, { width: t10, height: t10, "aria-hidden": "true", ...i10 }), t0 = (t10) => (0, d.jsxs)("svg", {
                width: 67,
                height: 67,
                viewBox: "0 0 67 67",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: [
                  (0, d.jsx)("path", {
                    d: "M34.892 17.713L29.6387 1.54508L34.3939 0L39.6472 16.168C40.0739 17.4811 41.4843 18.1997 42.7974 17.7731L58.9654 12.5198L60.5105 17.2751L44.3425 22.5283C40.4031 23.8083 36.1719 21.6525 34.892 17.713Z",
                    fill: "currentColor"
                  }),
                  (0, d.jsx)("path", {
                    d: "M43.5446 44.3439L48.7978 60.5119L53.5531 58.9668L48.2998 42.7988C47.8732 41.4857 48.5918 40.0753 49.9049 39.6487L66.0729 34.3954L64.5278 29.6401L48.3599 34.8934C44.4204 36.1734 42.2646 40.4045 43.5446 44.3439Z",
                    fill: "currentColor"
                  }),
                  (0, d.jsx)("path", {
                    d: "M31.1807 48.3613L36.434 64.5293L31.6787 66.0744L26.4254 49.9064C25.9988 48.5933 24.5884 47.8747 23.2752 48.3013L7.10727 53.5546L5.56219 48.7993L21.7301 43.546C25.6696 42.2661 29.9007 44.4219 31.1807 48.3613Z",
                    fill: "currentColor"
                  }),
                  (0, d.jsx)("path", {
                    d: "M22.5283 21.7305L17.2751 5.5625L12.5198 7.10758L17.7731 23.2755C18.1997 24.5887 17.4811 25.9991 16.168 26.4257L0 31.679L1.54508 36.4343L17.713 31.181C21.6525 29.901 23.8083 25.6699 22.5283 21.7305Z",
                    fill: "currentColor"
                  })
                ]
              }), t1 = ({ className: t10, ...i10 }) => (0, d.jsx)(t0, { className: t10, ...i10 }), t4 = (t10) => (0, d.jsxs)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: [
                  (0, d.jsx)("path", { d: "M12.2929 10.2929L18.5858 4H13V2H22V11H20V5.41421L13.7071 11.7071L12.2929 10.2929Z", fill: "currentColor" }),
                  (0, d.jsx)("path", { d: "M11.7071 13.7071L5.41421 20H11V22H2V13H4V18.5858L10.2929 12.2929L11.7071 13.7071Z", fill: "currentColor" })
                ]
              }), t2 = (t10) => (0, d.jsxs)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: [
                  (0, d.jsx)("path", {
                    d: "M22.2072 3.20718L16.4143 9.00008H22.0001V11.0001H13.0001V2.00008H15.0001V7.58586L20.793 1.79297L22.2072 3.20718Z",
                    fill: "currentColor"
                  }),
                  (0, d.jsx)("path", {
                    d: "M3.20718 22.2072L9.00011 16.4143V22.0001H11.0001V13.0001H2.00011V15.0001H7.58586L1.79297 20.793L3.20718 22.2072Z",
                    fill: "currentColor"
                  })
                ]
              }), t3 = ({ isFullscreen: t10, size: i10 = 44, className: a10 = "", ...r10 }) => (0, d.jsx)(t10 ? t2 : t4, {
                width: i10,
                height: i10,
                "aria-hidden": "true",
                className: a10,
                "data-testid": t10 ? "exit-fullscreen-icon" : "enter-fullscreen-icon",
                ...r10
              }), t5 = (t10) => (0, d.jsx)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: (0, d.jsx)("path", {
                  d: "M11.7 0.0654297V2.40479C9.65282 2.46507 7.66859 3.1403 6.00757 4.34629C4.26546 5.61117 2.9681 7.39482 2.30151 9.44189C1.63494 11.489 1.63317 13.6949 2.29653 15.7431C2.9599 17.7912 4.25429 19.5769 5.99438 20.8445C7.73451 22.1121 9.83125 22.7967 11.9841 22.8001C14.137 22.8035 16.2359 22.1254 17.98 20.8633C19.7242 19.6011 21.0242 17.8193 21.694 15.7732C22.3638 13.7272 22.3691 11.5216 21.7089 9.47236L18.8534 10.3923C19.3194 11.8388 19.3156 13.3958 18.8428 14.8401C18.37 16.2844 17.4525 17.5422 16.2213 18.4331C14.9902 19.324 13.5085 19.8025 11.9888 19.8001C10.4692 19.7977 8.98929 19.3144 7.76099 18.4196C6.53264 17.5248 5.61889 16.2642 5.15063 14.8185C4.68241 13.3727 4.68364 11.8159 5.15415 10.3709C5.62467 8.92587 6.54032 7.66671 7.77007 6.77383C8.91866 5.93989 10.2862 5.46525 11.7 5.40625V7.73535L17.9753 3.90039L11.7 0.0654297Z",
                  fill: "currentColor"
                })
              }), t6 = (t10) => (0, d.jsx)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: (0, d.jsx)("path", {
                  d: "M12.3001 0.0654297V2.40479C14.3472 2.46507 16.3314 3.1403 17.9924 4.34629C19.7345 5.61117 21.0319 7.39482 21.6985 9.44189C22.3651 11.489 22.3668 13.6949 21.7035 15.7431C21.0401 17.7912 19.7457 19.5769 18.0056 20.8445C16.2655 22.1121 14.1688 22.7967 12.0159 22.8001C9.86297 22.8035 7.76411 22.1254 6.01998 20.8633C4.27585 19.6011 2.97581 17.8193 2.30602 15.7732C1.63626 13.7272 1.63093 11.5216 2.29108 9.47236L5.14664 10.3923C4.68065 11.8388 4.6844 13.3958 5.15719 14.8401C5.62999 16.2844 6.54756 17.5422 7.77868 18.4331C9.00982 19.324 10.4915 19.8025 12.0112 19.8001C13.5308 19.7977 15.0107 19.3144 16.239 18.4196C17.4674 17.5248 18.3811 16.2642 18.8494 14.8185C19.3176 13.3727 19.3164 11.8159 18.8459 10.3709C18.3753 8.92587 17.4597 7.66671 16.2299 6.77383C15.0814 5.93989 13.7138 5.46525 12.3001 5.40625V7.73535L6.02467 3.90039L12.3001 0.0654297Z",
                  fill: "currentColor"
                })
              }), t7 = ({ isForward: t10, size: i10 = 44, className: a10 = "", ...r10 }) => (0, d.jsx)(t10 ? t5 : t6, {
                width: i10,
                height: i10,
                "aria-hidden": "true",
                className: a10,
                "data-testid": t10 ? "jump-forward-icon" : "jump-backward-icon",
                ...r10
              }), t8 = (t10) => (0, d.jsxs)("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 100 100",
                ...t10,
                children: [
                  (0, d.jsxs)("g", {
                    opacity: 0.2,
                    fill: "none",
                    stroke: "#ff5e00",
                    strokeWidth: 8,
                    children: [(0, d.jsx)("circle", { cx: 50, cy: 50, r: 45 }), (0, d.jsx)("circle", { cx: 50, cy: 50, r: 45, strokeLinecap: "round" })]
                  }),
                  (0, d.jsx)("g", {
                    fill: "none",
                    stroke: "#ff5e00",
                    strokeWidth: 8,
                    strokeLinecap: "round",
                    children: (0, d.jsx)("path", { d: "M82.45,18.823c7.772,8.088,12.55,19.074,12.55,31.177,0,11.711-4.474,22.377-11.805,30.383" })
                  })
                ]
              }), t9 = ({ size: t10 = 80, ...i10 }) => (0, d.jsx)(t8, { width: t10, height: t10, "aria-hidden": "true", ...i10 }), ie = (t10) => (0, d.jsx)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: (0, d.jsx)("path", { d: "M5 3L18 11.3571V3H20V21H18V12.6429L5 21V3Z", fill: "currentColor" })
              }), it = ({ size: t10 = 44, className: i10 = "", ...a10 }) => (0, d.jsx)(ie, { width: t10, height: t10, "aria-hidden": "true", className: i10, "data-testid": "next-episode-icon", ...a10 }), ii = (t10) => (0, d.jsxs)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: [
                  (0, d.jsx)("path", { d: "M4 2H10V22H4V2Z", fill: "currentColor" }),
                  (0, d.jsx)("path", { d: "M14 2H20V22H14V2Z", fill: "currentColor" })
                ]
              }), ia = ({ size: t10 = 44, className: i10 = "", ...a10 }) => (0, d.jsx)(ii, { width: t10, height: t10, "aria-hidden": "true", className: i10, "data-testid": "pause-icon", ...a10 }), ir = (t10) => (0, d.jsx)("svg", {
                width: 16,
                height: 13,
                viewBox: "0 0 16 13",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: (0, d.jsx)("path", {
                  d: "M2.23212 12.6001L2.23212 2.7901L0.000119622 3.3841L0.000119622 1.4401L3.27612 9.6797e-05L4.75212 9.67968e-05L4.75212 12.6001L2.23212 12.6001ZM5.80076 12.6001L9.05876 8.0641L5.80076 3.5281L8.42876 3.5281L10.6068 6.6421L12.7848 3.5281L15.3948 3.5281L12.1368 8.0641L15.3948 12.6001L12.7848 12.6001L10.6068 9.4681L8.42876 12.6001L5.80076 12.6001Z",
                  fill: "currentColor"
                })
              }), is = ({ width: t10 = 16, height: i10 = 13, className: a10 = "", ...r10 }) => (0, d.jsx)(ir, { width: t10, height: i10, "aria-hidden": "true", className: a10, "data-testid": "playback-speed-icon", ...r10 }), io = (t10) => (0, d.jsx)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: (0, d.jsx)("path", { d: "M22 12L6 2V22L22 12Z", fill: "currentColor" })
              }), il = ({ size: t10 = 44, className: i10 = "", ...a10 }) => (0, d.jsx)(io, { width: t10, height: t10, "aria-hidden": "true", className: i10, "data-testid": "play-icon", ...a10 }), id = (t10) => (0, d.jsx)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: (0, d.jsx)("path", {
                  d: "M2 18.9998L11 13.2725V18.9998L20 13.2725V18.9998H22V4.99976H20V10.727L11 4.99976V10.727L2 4.99976V18.9998Z",
                  fill: "currentColor"
                })
              }), iu = ({ size: t10 = 24, className: i10 = "", ...a10 }) => (0, d.jsx)(id, { width: t10, height: t10, "aria-hidden": "true", className: i10, "data-testid": "skip-intro-icon", ...a10 }), ic = (t10) => (0, d.jsxs)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: [
                  (0, d.jsx)("path", {
                    className: "volume-mute",
                    d: "M22.2861 8.9082L19.1943 11.999L22.2861 15.0908L20.3799 16.9971L17.2881 13.9053L14.1963 16.998L12.29 15.0918L15.3818 11.999L12.29 8.90723L14.1963 7.00195L17.2881 10.0928L20.3799 7.00195L22.2861 8.9082Z",
                    fill: "none"
                  }),
                  (0, d.jsx)("path", {
                    className: "volume-t3",
                    d: "M17.3796 5.6346L19.0107 4C19.0107 4 22.3001 7.24613 22.3 12C22.3 16.7539 18.9172 20 18.9172 20L17.3 18.3345C17.3 18.3345 20.018 15.4753 20.018 12C20.018 8.52473 17.3796 5.6346 17.3796 5.6346Z",
                    fill: "currentColor"
                  }),
                  (0, d.jsx)("path", {
                    className: "volume-t2",
                    d: "M14.626 8.79968L16.1973 7.12695C16.1973 7.12695 18.285 9.09785 18.3 12C18.3149 14.9021 16.1973 16.9409 16.1973 16.9409L14.626 15.2936C14.626 15.2936 16.0039 14.0603 16.0039 12C16.0039 9.93965 14.626 8.79968 14.626 8.79968Z",
                    fill: "currentColor"
                  }),
                  (0, d.jsx)("path", {
                    className: "volume-t1",
                    d: "M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10V14Z",
                    fill: "currentColor"
                  }),
                  (0, d.jsx)("path", {
                    className: "volume-base",
                    d: "M10.8 4.19922L4.8 7.79922H1.5V16.1992H4.8L10.8 19.7992V4.19922Z",
                    fill: "currentColor"
                  })
                ]
              }), ih = ({ isMuted: t10 = false, className: i10, volumeTier: a10 = "high", ...r10 }) => (0, d.jsx)(ic, {
                ...r10,
                "data-muted": t10 || a10 === "off",
                "data-volume-tier": a10,
                className: (0, tG.default)(i10, {
                  "kat:[&_.volume-mute]:fill-current kat:[&_.volume-t1]:fill-transparent kat:[&_.volume-t2]:fill-transparent kat:[&_.volume-t3]:fill-transparent": t10 || a10 === "off",
                  "kat:[&_.volume-mute]:fill-transparent": !t10 && a10 !== "off",
                  "kat:[&_.volume-t2]:fill-transparent kat:[&_.volume-t3]:fill-transparent": !t10 && a10 === "low",
                  "kat:[&_.volume-t3]:fill-transparent": !t10 && a10 === "medium"
                })
              }), ip = (0, h.createContext)(undefined), ig = () => (0, h.useContext)(ip), iv = (0, h.createContext)(undefined), im = () => {
                let t10 = (0, h.useContext)(iv);
                if (!t10)
                  throw Error("usePlayerControls must be used within a PlayerControlsContext.Provider");
                return t10;
              }, iy = () => {
                let t10 = (0, h.useContext)(iv);
                if (!t10)
                  throw Error("useLocalizationManager must be used within a PlayerControlsContext.Provider");
                return (0, h.useMemo)(() => ({ t: t10.localizationManager.t }), [t10.localizationManager]);
              }, i_ = ({ onToggle: t10, isOpen: i10, speed: a10 }) => {
                let { t: r10 } = iy();
                return (0, d.jsx)(tY, {
                  Icon: a10 ?? (0, d.jsx)(is, {}),
                  label: r10("playbackSpeed.ariaLabel"),
                  onClick: () => t10(!i10),
                  isActive: i10,
                  "aria-expanded": i10,
                  "aria-haspopup": "menu",
                  "data-testid": "playback-speed-button"
                });
              }, ib = ({ children: t10, ariaLabel: i10 }) => (0, d.jsx)("div", { role: "menu", "aria-label": i10, className: "kat:flex kat:flex-col kat:min-h-0 kat:flex-1", children: t10 }), ik = ({ label: t10 }) => (0, d.jsx)("div", {
                role: "separator",
                className: "kat:ps-20 kat:pe-20 kat:pt-20 kat:pb-12 kat:text-start kat:sticky kat:top-0 kat:z-10 kat:bg-neutral-700",
                children: (0, d.jsx)("span", {
                  className: "kat:text-[18px] kat:font-bold kat:leading-24 kat:tracking-[-0.54px] kat:text-white kat:select-none",
                  children: t10
                })
              }), iC = (t10) => (0, d.jsx)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: (0, d.jsx)("path", {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.7929 8.29289L17.2071 9.70711L10.5 16.4142L6.79289 12.7071L8.20711 11.2929L10.5 13.5858L15.7929 8.29289Z",
                  fill: "currentColor"
                })
              }), iw = (t10) => (0, d.jsx)(iC, { ...t10 }), ix = ({ label: t10, description: i10, selected: a10 = false, disabled: r10 = false, onSelect: s10 }) => (0, d.jsxs)("div", {
                role: "menuitemradio",
                "aria-label": t10,
                "aria-description": i10,
                "aria-checked": a10,
                "aria-disabled": r10,
                onClick: () => {
                  !r10 && s10 && s10();
                },
                onKeyDown: (t11) => {
                  !r10 && (t11.key === "Enter" || t11.key === " ") && (t11.preventDefault(), s10 && s10());
                },
                tabIndex: 0,
                className: `kat:flex kat:items-center kat:gap-4 kat:cursor-pointer kat:transition-colors kat:select-none kat:ps-20 kat:pe-20 kat:pt-13 kat:pb-13 ${a10 ? "kat:bg-white/6" : ""} ${r10 ? "kat:opacity-50" : "kat:hover:bg-neutral-600 kat:focus-visible:outline-4 kat:focus-visible:-outline-offset-4 kat:focus-visible:outline-orange-500 kat:focus-visible:bg-neutral-600 kat:active:bg-neutral-500"}`,
                children: [
                  (0, d.jsxs)("div", {
                    className: "kat:flex kat:flex-col kat:flex-1 kat:min-w-0 kat:gap-2 kat:text-start",
                    children: [
                      (0, d.jsx)("span", {
                        className: `kat:text-sm kat:leading-20 ${r10 ? "kat:text-neutral-400" : "kat:text-neutral-50"}`,
                        children: t10
                      }),
                      i10 && (0, d.jsx)("span", { className: `kat:text-xs ${r10 ? "kat:text-neutral-400" : "kat:text-neutral-300"}`, children: i10 })
                    ]
                  }),
                  (0, d.jsx)("div", {
                    className: "kat:w-24 kat:h-24 kat:shrink-0",
                    children: a10 && (0, d.jsx)(iw, { className: `${r10 ? "kat:text-neutral-500" : "kat:text-white"}` })
                  })
                ]
              }), iE = ({ options: t10, onSelect: i10 }) => {
                let { t: a10 } = iy();
                return (0, d.jsx)("div", {
                  className: "kat:w-200 kat:flex kat:flex-col kat:overflow-hidden",
                  "data-testid": "playback-speed-menu",
                  children: (0, d.jsxs)(ib, {
                    ariaLabel: a10("playbackSpeed"),
                    children: [
                      (0, d.jsx)(ik, { label: a10("playbackSpeed") }),
                      (0, d.jsx)("div", {
                        className: "kat:overflow-y-auto kat:max-h-468",
                        children: t10.map((t11) => (0, d.jsx)(ix, { label: t11.displayName, selected: t11.selected, onSelect: () => i10(t11.value) }, t11.value))
                      })
                    ]
                  })
                });
              }, iS = (0, h.createContext)(undefined), iT = ({ viewModels: t10, children: i10 }) => (0, d.jsx)(iS.Provider, { value: t10, children: i10 }), iP = (0, h.createContext)({ isAnyMenuOpen: false, activeMenuId: null, setActiveMenuId: () => {
                return;
              }, closeAllMenus: () => {
                return;
              } }), iA = ({ children: t10 }) => {
                let [i10, a10] = (0, h.useState)(null), r10 = (0, h.useCallback)(() => {
                  a10(null);
                }, []), s10 = (0, h.useMemo)(() => ({ isAnyMenuOpen: i10 !== null, activeMenuId: i10, setActiveMenuId: a10, closeAllMenus: r10 }), [i10, a10, r10]);
                return (0, d.jsx)(iP.Provider, { value: s10, children: t10 });
              }, iL = () => (0, h.useContext)(iP), iI = () => {
                let t10 = (0, h.useId)(), { activeMenuId: i10, setActiveMenuId: a10 } = iL(), r10 = i10 === t10, s10 = (0, h.useCallback)(() => {
                  a10(t10);
                }, [t10, a10]), n10 = (0, h.useCallback)(() => {
                  a10((i11) => i11 === t10 ? null : i11);
                }, [t10, a10]), o10 = (0, h.useCallback)(() => {
                  a10((i11) => i11 === t10 ? null : t10);
                }, [t10, a10]);
                return (0, h.useEffect)(() => () => {
                  a10((i11) => i11 === t10 ? null : i11);
                }, [t10, a10]), { isActive: r10, toggle: o10, setActive: s10, close: n10 };
              }, iR = (0, h.createContext)({ current: null }), iD = () => (0, h.useContext)(iR), iM = (t10) => {
                let i10 = (0, h.useRef)(null);
                (0, h.useEffect)(() => {
                  i10.current = document.querySelector(".katamariDesktop");
                }, []);
                let a10 = (0, h.useCallback)((a11) => {
                  let r10 = a11.target;
                  i10.current && !i10.current.contains(r10) && a11.defaultPrevented === false && t10();
                }, [t10]);
                (0, h.useEffect)(() => (document.addEventListener("click", a10), () => {
                  document.removeEventListener("click", a10);
                }), [a10]);
              }, iN = "Escape", ij = ({ children: t10, isVisible: i10, toggleVisibility: a10, expandDirection: r10 = "down", anchorAlignment: s10 = "end", dismissKey: n10 = iN }) => {
                let o10 = (0, h.useRef)(null), l2 = (0, h.useRef)(null), u2 = (0, h.useRef)(true), [c2, p2] = (0, h.useState)({}), f2 = iD();
                (0, h.useEffect)(() => {
                  i10 === false && u2.current === true && l2.current && document.activeElement !== l2.current && (l2.current.focus(), u2.current = false, l2.current = null);
                }, [i10]);
                let g2 = (0, h.useCallback)(() => {
                  i10 && a10();
                }, [i10, a10]);
                if (iM(g2), (0, h.useLayoutEffect)(() => {
                  if (!i10) {
                    p2({});
                    return;
                  }
                  let t11 = f2.current;
                  if (!t11)
                    return;
                  let a11 = () => {
                    if (!o10.current)
                      return;
                    let i11 = o10.current.parentElement;
                    if (!i11)
                      return;
                    let a12 = t11.getBoundingClientRect(), s12 = i11.getBoundingClientRect(), n11 = a12.width - 16, l3 = r10 === "up" ? s12.top - a12.top - 8 : a12.bottom - s12.bottom - 8;
                    p2({ maxHeight: `${Math.max(0, l3)}px`, maxWidth: `${Math.max(0, n11)}px` });
                  };
                  a11();
                  let s11 = new ResizeObserver(() => {
                    a11();
                  });
                  return s11.observe(t11), () => {
                    s11.disconnect();
                  };
                }, [i10, r10, f2]), (0, h.useEffect)(() => {
                  if (!i10) {
                    l2.current = null;
                    return;
                  }
                  u2.current = true, l2.current ||= document.activeElement;
                  let t11 = (t12) => {
                    t12.key === n10 && (t12.preventDefault(), g2());
                  };
                  return document.addEventListener("keydown", t11), () => {
                    document.removeEventListener("keydown", t11);
                  };
                }, [i10, g2, n10]), !i10)
                  return null;
                let v2 = {
                  down: { end: "kat:rounded-tr-none", start: "kat:rounded-tl-none" },
                  up: { end: "kat:rounded-br-none", start: "kat:rounded-bl-none" }
                }[r10][s10], m2 = [r10 === "up" ? "kat:bottom-full" : "kat:top-full", s10 === "start" ? "kat:left-0" : "kat:right-0"].join(" "), y2 = "u" > typeof document && document.documentElement.dir === "rtl" ? "rtl" : undefined;
                return (0, d.jsx)("div", {
                  ref: o10,
                  className: `kat:inline-flex kat:flex-col kat:absolute kat:z-[1001] kat:bg-neutral-700 kat:rounded-lg kat:shadow-lg kat:outline-none kat:w-max kat:overflow-hidden focus-visible:kat:outline-2 focus-visible:kat:outline-offset-2 focus-visible:kat:outline-white/50 ${v2} ${m2}`,
                  style: c2,
                  role: "menu",
                  tabIndex: -1,
                  dir: y2,
                  onClick: (t11) => {
                    t11.preventDefault();
                  },
                  children: t10
                });
              }, iO = () => {
                let {
                  viewModelContainer: { playbackSpeedMenuVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)([]), [r10, s10] = (0, h.useState)(undefined);
                return (0, h.useEffect)(() => {
                  let i11 = t10.selectedRate$.subscribe((t11) => {
                    s10(t11);
                  }), r11 = t10.availableRates$.subscribe((t11) => {
                    a10(t11);
                  });
                  return () => {
                    i11.unsubscribe(), r11.unsubscribe();
                  };
                }, [t10]), {
                  availableRates: i10,
                  selectedRate: r10,
                  selectPlaybackSpeed: (0, h.useCallback)((i11) => {
                    t10.selectPlaybackSpeed(i11);
                  }, [t10])
                };
              }, iV = (t10) => Number.isInteger(t10) ? `${t10.toFixed(0)}x` : `${t10}x`, iH = (t10, i10) => ({ value: t10, displayName: iV(t10), selected: t10 === i10 }), iU = () => {
                let { isActive: t10, toggle: i10, close: a10 } = iI(), { availableRates: r10, selectedRate: s10, selectPlaybackSpeed: n10 } = iO(), o10 = (0, h.useCallback)((t11) => {
                  n10(t11), a10();
                }, [a10, n10]), l2 = (0, h.useMemo)(() => s10 ? r10.map((t11) => iH(t11, s10)) : [], [r10, s10]), u2 = (0, h.useMemo)(() => s10 ? iV(s10) : undefined, [s10]);
                return (0, d.jsxs)("div", {
                  className: "kat:relative",
                  children: [
                    (0, d.jsx)("div", {
                      className: (0, tG.default)("kat:relative", t10 && "kat:z-[1002]"),
                      children: (0, d.jsx)(i_, { onToggle: i10, isOpen: t10, speed: u2 })
                    }),
                    (0, d.jsx)(ij, { isVisible: t10, toggleVisibility: a10, expandDirection: "up", children: (0, d.jsx)(iE, { options: l2, onSelect: o10 }) })
                  ]
                });
              }, iF = (t10) => (0, d.jsx)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: (0, d.jsx)("path", {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 13.4141L9.10713 16.307L7.69292 14.8928L10.5858 11.9999L7.69292 9.10701L9.10713 7.6928L12 10.5857L14.8929 7.6928L16.3071 9.10701L13.4142 11.9999L16.3071 14.8928L14.8929 16.307L12 13.4141Z",
                  fill: "currentColor"
                })
              }), i$ = ({ checked: t10, disabled: i10 = false, ariaLabel: a10, tabIndex: r10, onChange: s10 }) => (0, d.jsx)("button", {
                type: "button",
                role: "switch",
                "aria-checked": t10,
                "aria-label": a10,
                disabled: i10,
                tabIndex: r10,
                onClick: () => {
                  i10 || s10(!t10);
                },
                className: (0, tG.default)("kat:group kat:relative kat:inline-flex kat:items-center", "kat:w-40 kat:h-24 kat:rounded-full", "kat:border-2 kat:transition-colors kat:duration-200", "kat:bg-transparent kat:outline-none", {
                  "kat:border-orange-500": t10 && !i10,
                  "kat:border-neutral-400": !t10 && !i10,
                  "kat:hover:border-orange-600 kat:focus-visible:border-orange-600": t10 && !i10,
                  "kat:hover:border-white kat:focus-visible:border-white": !t10 && !i10,
                  "kat:border-neutral-500 kat:cursor-not-allowed": i10,
                  "kat:cursor-pointer": !i10
                }),
                children: (0, d.jsx)("span", {
                  className: (0, tG.default)("kat:absolute kat:left-0 kat:inset-y-0 kat:my-auto", "kat:rounded-full kat:flex kat:items-center kat:justify-center", "kat:transition-transform kat:duration-200 kat:pointer-events-none", "kat:w-20 kat:h-20", { "kat:translate-x-16": t10, "kat:translate-x-0": !t10 }),
                  children: t10 ? (0, d.jsx)(iw, {
                    className: (0, tG.default)("kat:w-20 kat:h-20", {
                      "kat:text-orange-500 kat:group-hover:text-orange-600": !i10,
                      "kat:text-neutral-500": i10
                    })
                  }) : (0, d.jsx)(iF, { className: (0, tG.default)("kat:w-20 kat:h-20", { "kat:text-neutral-50": !i10, "kat:text-neutral-500": i10 }) })
                })
              }), iB = ({ label: t10, checked: i10, disabled: a10 = false, ariaLabel: r10, onChange: s10, autoFocus: n10 = false }) => (0, d.jsxs)("div", {
                role: "menuitemcheckbox",
                "aria-checked": i10,
                "aria-disabled": a10,
                "aria-label": r10 ?? t10,
                autoFocus: n10,
                onClick: (t11) => {
                  a10 || t11.target.closest('[role="switch"]') || s10(!i10);
                },
                onKeyDown: (t11) => {
                  t11.key !== "Enter" && t11.key !== " " || a10 || (t11.preventDefault(), s10(!i10));
                },
                tabIndex: a10 ? -1 : 0,
                className: `kat:flex kat:items-center kat:justify-between kat:gap-8 kat:cursor-pointer kat:transition-colors kat:select-none kat:ps-20 kat:pe-20 kat:pt-13 kat:pb-13 ${a10 ? "kat:opacity-50" : "kat:hover:bg-neutral-600 kat:focus-visible:outline-4 kat:focus-visible:-outline-offset-4 kat:focus-visible:outline-orange-500 kat:focus-visible:bg-neutral-600 kat:active:bg-neutral-500"}`,
                children: [
                  (0, d.jsx)("span", { className: `kat:text-sm ${a10 ? "kat:text-neutral-400" : "kat:text-white"}`, children: t10 }),
                  (0, d.jsx)(i$, { tabIndex: -1, checked: i10, disabled: a10, ariaLabel: r10 ?? t10, onChange: s10 })
                ]
              }), iq = ({ label: t10, checked: i10, onChange: a10, autoFocus: r10 = false }) => (0, d.jsx)(iB, { label: t10, checked: i10, onChange: a10, autoFocus: r10 }), iK = ({ options: t10, selectedBucket: i10, onSelect: a10 }) => (0, d.jsx)(d.Fragment, {
                children: (0, h.useMemo)(() => t10.map((t11) => (0, d.jsx)(ix, { label: t11.label, description: t11.description, selected: i10 === t11.bucket, onSelect: () => a10(t11.bucket) }, t11.bucket)), [t10, i10, a10])
              }), iZ = (t10) => (0, d.jsx)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: (0, d.jsx)("path", {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M13.9035 4.22784L13.5 1L10.5 1L10.0965 4.22784C9.29386 4.42374 8.53866 4.74074 7.85138 5.15839L5.28305 3.16104L3.16173 5.28236L5.15914 7.85014C4.74112 8.53775 4.42386 9.29338 4.22784 10.0965L1 10.5L1 13.5L4.22784 13.9035C4.42384 14.7066 4.74107 15.4621 5.15904 16.1497L3.16184 18.7175L5.28312 20.8389L7.85118 18.8415C8.53851 19.2592 9.29378 19.5762 10.0965 19.7722L10.5 23L13.5 23L13.9035 19.7722C14.7064 19.5762 15.4618 19.2591 16.1492 18.8412L18.7181 20.8389L20.8394 18.7176L18.8413 16.1491C19.2591 15.4617 19.5762 14.7063 19.7722 13.9035L23 13.5L23 10.5L19.7722 10.0965C19.5763 9.29387 19.2593 8.53867 18.8416 7.8514L20.8394 5.28286L18.7181 3.16154L16.1498 5.15909C15.4622 4.7411 14.7066 4.42385 13.9035 4.22784ZM12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z",
                  fill: "currentColor"
                })
              }), iz = ({ label: t10, isOpen: i10, onToggle: a10, menuId: r10 }) => (0, d.jsx)(tY, {
                Icon: (0, d.jsx)(iZ, { className: "kat:w-24 kat:h-24 kat:@lg:w-40 kat:@lg:h-40 kat:shrink-0" }),
                label: t10,
                onClick: a10,
                isActive: i10,
                "aria-expanded": i10,
                "aria-haspopup": "menu",
                "aria-controls": r10,
                "data-testid": "player-settings-menu-button"
              }), iG = ({ isVisible: t10, toggleVisibility: i10, children: a10 }) => (0, d.jsx)(ij, {
                isVisible: t10,
                toggleVisibility: i10,
                expandDirection: "up",
                children: (0, d.jsx)("div", {
                  className: "kat:w-240 kat:min-w-200 kat:max-w-400 kat:max-h-230 kat:@md:max-h-460 kat:overflow-y-auto",
                  children: a10
                })
              }), iW = () => {
                let {
                  viewModelContainer: { settingsVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(undefined), [r10, s10] = (0, h.useState)(undefined), [n10, o10] = (0, h.useState)([{ label: "Auto", bucket: "auto" }]);
                return (0, h.useEffect)(() => {
                  let i11 = t10.selectedQualityBucket$.subscribe((t11) => {
                    a10(t11);
                  });
                  return () => {
                    i11.unsubscribe();
                  };
                }, [t10]), (0, h.useEffect)(() => {
                  let i11 = t10.isAutoplayNextEnabled$.subscribe((t11) => {
                    s10(t11);
                  });
                  return () => {
                    i11.unsubscribe();
                  };
                }, [t10]), (0, h.useEffect)(() => {
                  let i11 = () => {
                    try {
                      o10(t10.getResolutionQualities());
                    } catch (t11) {}
                  };
                  i11();
                  let a11 = setInterval(i11, 1500);
                  return () => clearInterval(a11);
                }, [t10]), {
                  selectedQualityBucket: i10,
                  isAutoplayNextEnabled: r10,
                  resolutionQualities: n10,
                  setPlaybackQualityBucket: (0, h.useCallback)((i11) => {
                    a10(i11), t10.setPlaybackQualityBucket(i11);
                    try {
                      o10(t10.getResolutionQualities());
                    } catch (t11) {}
                  }, [t10]),
                  toggleAutoplayNext: (0, h.useCallback)(() => {
                    t10.toggleAutoplayNext();
                  }, [t10])
                };
              }, iJ = () => {
                let { isActive: t10, toggle: i10, close: a10 } = iI(), { t: r10 } = iy(), { isAutoplayNextEnabled: s10, toggleAutoplayNext: n10, selectedQualityBucket: o10, resolutionQualities: q2, setPlaybackQualityBucket: u2 } = iW(), { availableRates: c2, selectedRate: p2, selectPlaybackSpeed: f2 } = iO(), {
                  viewModelContainer: { trackSelectionVM: g2 }
                } = im(), [v2, m2] = (0, h.useState)("main"), [y2, _2] = (0, h.useState)(localStorage.getItem("skip_events") !== "false"), [N2, j2] = (0, h.useState)(localStorage.getItem("croptix.autoSkipIntroOutro") === "true"), [b2, k2] = (0, h.useState)([]), [C2, w2] = (0, h.useState)(undefined), [x2, E2] = (0, h.useState)([]), [S2, T2] = (0, h.useState)(undefined);
                (0, h.useEffect)(() => {
                  let t11 = g2.availableAudioTracks$.subscribe(k2), i11 = g2.activeAudioTrack$.subscribe(w2), a11 = g2.availableTextTracks$.subscribe(E2), r11 = g2.activeTextTrack$.subscribe(T2);
                  return () => {
                    t11.unsubscribe(), i11.unsubscribe(), a11.unsubscribe(), r11.unsubscribe();
                  };
                }, [g2]);
                let P2 = (0, h.useCallback)(() => {
                  a10();
                  m2("main");
                }, [a10]), A2 = (0, h.useCallback)(() => {
                  i10();
                  m2("main");
                }, [i10]), L2 = (0, h.useCallback)(() => {
                  let t11 = !y2;
                  _2(t11), localStorage.setItem("skip_events", t11.toString()), window.dispatchEvent(new Event("skip_events_listener"));
                }, [y2]), O2 = (0, h.useCallback)(() => {
                  let t11 = !N2;
                  j2(t11), localStorage.setItem("croptix.autoSkipIntroOutro", t11.toString()), window.dispatchEvent(new Event("croptix_auto_skip_intro_outro_changed"));
                }, [N2]), I2 = (t11) => {
                  if (!t11)
                    return r10("none");
                  let i11 = t11.displayName !== t11.language ? t11.displayName : r10(t11.language) || t11.language;
                  return t11.role === l.lt.AUDIO_DESCRIPTION ? `${i11} [AD]` : t11.role === l.x.CLOSED_CAPTION ? `${i11} [CC]` : i11;
                }, R2 = (t11) => q2.find((i11) => i11.bucket === t11 || i11.selected)?.label || "Auto", D2 = ({ label: t11, value: i11, onClick: a11 }) => (0, d.jsxs)("div", {
                  className: "kat:flex kat:items-center kat:justify-between kat:gap-8 kat:cursor-pointer kat:ps-20 kat:pe-20 kat:pt-13 kat:pb-13 kat:hover:bg-neutral-600",
                  onClick: a11,
                  children: [
                    (0, d.jsx)("span", { className: "kat:text-sm kat:text-white", children: t11 }),
                    (0, d.jsxs)("div", {
                      className: "kat:flex kat:items-center kat:gap-4 kat:min-w-0",
                      children: [
                        (0, d.jsx)("span", { className: "kat:text-sm kat:text-neutral-300 kat:truncate kat:max-w-160", children: i11 }),
                        (0, d.jsx)("span", {
                          className: "kat:text-neutral-300 kat:font-bold",
                          style: { fontSize: "16px", marginLeft: "4px" },
                          children: ">"
                        })
                      ]
                    })
                  ]
                }), M2 = (0, d.jsx)("div", {
                  className: "kat:flex kat:items-center kat:gap-4 kat:cursor-pointer kat:ps-20 kat:pe-20 kat:pt-13 kat:pb-13 kat:hover:bg-neutral-600 kat:border-b kat:border-neutral-600",
                  onClick: () => {
                    m2("main");
                  },
                  children: (0, d.jsx)("span", { className: "kat:text-sm kat:font-bold kat:text-white", children: "< " + r10("settings") })
                }), F2 = q2, B2 = () => {
                  switch (v2) {
                    case "audio":
                      return (0, d.jsxs)("div", {
                        className: "kat:flex kat:flex-col",
                        style: { width: "320px" },
                        children: [
                          M2,
                          (0, d.jsx)("div", {
                            className: "kat:overflow-y-auto",
                            style: { maxHeight: "300px" },
                            children: b2.map((t11) => (0, d.jsx)(ix, {
                              label: I2(t11),
                              selected: C2?.language === t11.language && C2?.role === t11.role && C2?.format === t11.format,
                              disabled: !t11.canUse || b2.length <= 1,
                              onSelect: () => {
                                g2.setAudioTrack(t11), m2("main");
                              }
                            }, `${t11.language}-${t11.role}-${t11.format}`))
                          })
                        ]
                      });
                    case "subtitles":
                      return (0, d.jsxs)("div", {
                        className: "kat:flex kat:flex-col",
                        style: { width: "320px" },
                        children: [
                          M2,
                          (0, d.jsx)("div", {
                            className: "kat:overflow-y-auto",
                            style: { maxHeight: "300px" },
                            children: x2.map((t11) => (0, d.jsx)(ix, {
                              label: I2(t11),
                              selected: S2?.language === t11.language && S2?.role === t11.role && S2?.format === t11.format,
                              onSelect: () => {
                                g2.setTextTrack(t11), m2("main");
                              }
                            }, `${t11.language}-${t11.role}-${t11.format}`))
                          })
                        ]
                      });
                    case "quality":
                      return (0, d.jsxs)("div", {
                        className: "kat:flex kat:flex-col",
                        style: { width: "320px" },
                        children: [
                          M2,
                          (0, d.jsx)("div", {
                            className: "kat:py-5",
                            children: F2.map((t11) => (0, d.jsx)(ix, {
                              label: t11.label,
                              description: t11.description,
                              selected: t11.selected || o10 === t11.bucket,
                              onSelect: () => {
                                u2(t11.bucket), m2("main");
                              }
                            }, t11.bucket))
                          })
                        ]
                      });
                    case "speed":
                      return (0, d.jsxs)("div", {
                        className: "kat:flex kat:flex-col",
                        style: { width: "320px" },
                        children: [
                          M2,
                          (0, d.jsx)("div", {
                            className: "kat:overflow-y-auto",
                            style: { maxHeight: "300px" },
                            children: c2.map((t11) => (0, d.jsx)(ix, {
                              label: iV(t11),
                              selected: p2 === t11,
                              onSelect: () => {
                                f2(t11), m2("main");
                              }
                            }, t11))
                          })
                        ]
                      });
                    case "playback":
                      return (0, d.jsxs)("div", {
                        className: "kat:flex kat:flex-col kat:py-5",
                        style: { width: "320px" },
                        children: [
                          M2,
                          (0, d.jsx)(iq, { label: r10("autoplayNext"), checked: s10 ?? false, onChange: n10 }),
                          (0, d.jsx)(iq, { label: r10("skipEvents"), checked: y2, onChange: L2 }),
                          (0, d.jsx)(iq, { label: r10("autoSkipIntroOutro"), checked: N2, onChange: O2 })
                        ]
                      });
                    default:
                      return (0, d.jsxs)("div", {
                        className: "kat:flex kat:flex-col kat:py-10",
                        style: { width: "320px" },
                        children: [
                          (0, d.jsx)(D2, { label: r10("audio"), value: I2(C2), onClick: () => m2("audio") }),
                          (0, d.jsx)(D2, { label: r10("subtitlesCc"), value: I2(S2), onClick: () => m2("subtitles") }),
                          (0, d.jsx)(D2, { label: r10("quality"), value: R2(o10), onClick: () => m2("quality") }),
                          (0, d.jsx)(D2, { label: r10("playbackSpeed"), value: p2 ? iV(p2) : "1x", onClick: () => m2("speed") }),
                          (0, d.jsx)(D2, { label: r10("playbackOptions"), value: "", onClick: () => m2("playback") })
                        ]
                      });
                  }
                };
                return (0, d.jsxs)("div", {
                  className: "kat:relative",
                  children: [
                    (0, d.jsx)("div", {
                      className: (0, tG.default)("kat:relative", t10 && "kat:z-[1002]"),
                      children: (0, d.jsx)(tY, {
                        Icon: (0, d.jsx)("img", {
                          src: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cdefs%3E%3Cstyle%3E.white%7Bfill%3A%23fff%3Bfill-rule%3Aevenodd%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cpath%20class%3D%22white%22%20d%3D%22M17.969%2C9.5A.539.539%2C0%2C0%2C0%2C17.8%2C9.11a.679.679%2C0%2C0%2C0-.359-.2L16.344%2C8.75a.734.734%2C0%2C0%2C1-.656-.532l-.407-1a.777.777%2C0%2C0%2C1%2C.063-.843l.687-.874A.59.59%2C0%2C0%2C0%2C16%2C4.719L15.25%2C4a.549.549%2C0%2C0%2C0-.751-.031l-.874.656a.744.744%2C0%2C0%2C1-.843.094l-1-.407a.808.808%2C0%2C0%2C1-.36-.265.607.607%2C0%2C0%2C1-.172-.391l-.156-1.094a.679.679%2C0%2C0%2C0-.2-.359.539.539%2C0%2C0%2C0-.391-.172A2.808%2C2.808%2C0%2C0%2C0%2C10%2C2l-.5.031A.539.539%2C0%2C0%2C0%2C9.11%2C2.2a.666.666%2C0%2C0%2C0-.2.359L8.75%2C3.656a.735.735%2C0%2C0%2C1-.531.656l-1%2C.407a.745.745%2C0%2C0%2C1-.844-.094L5.5%2C3.969A.59.59%2C0%2C0%2C0%2C4.719%2C4L4%2C4.719a.59.59%2C0%2C0%2C0-.031.782l.656.874a.747.747%2C0%2C0%2C1%2C.094.844l-.407%2C1a.818.818%2C0%2C0%2C1-.265.359.609.609%2C0%2C0%2C1-.391.172l-1.094.156a.679.679%2C0%2C0%2C0-.359.2.535.535%2C0%2C0%2C0-.172.391A2.808%2C2.808%2C0%2C0%2C0%2C2%2C10l.031.5a.535.535%2C0%2C0%2C0%2C.172.391.666.666%2C0%2C0%2C0%2C.359.2l1.094.156a.614.614%2C0%2C0%2C1%2C.391.172.821.821%2C0%2C0%2C1%2C.265.36l.407%2C1a.745.745%2C0%2C0%2C1-.094.843l-.656.876c-.187.27-.209.489-.063.656a.744.744%2C0%2C0%2C1%2C.078.093c.032.041.067.088.11.141a1.758%2C1.758%2C0%2C0%2C0%2C.124.14l.126.125.125.126a.44.44%2C0%2C0%2C0%2C.125.092.822.822%2C0%2C0%2C0%2C.422.189.739.739%2C0%2C0%2C0%2C.485-.032l.874-.656a.745.745%2C0%2C0%2C1%2C.843-.094l1%2C.407a.815.815%2C0%2C0%2C1%2C.36.265.614.614%2C0%2C0%2C1%2C.172.391l.156%2C1.094a.666.666%2C0%2C0%2C0%2C.2.359.537.537%2C0%2C0%2C0%2C.389.171A2.711%2C2.711%2C0%2C0%2C0%2C10%2C18l.5-.031a.539.539%2C0%2C0%2C0%2C.391-.172.679.679%2C0%2C0%2C0%2C.2-.359l.156-1.094a.614.614%2C0%2C0%2C1%2C.172-.391.815.815%2C0%2C0%2C1%2C.36-.265l1-.407a.745.745%2C0%2C0%2C1%2C.843.094l.876.656a.588.588%2C0%2C0%2C0%2C.78-.031L16%2C15.281a.591.591%2C0%2C0%2C0%2C.032-.782l-.688-.874a.779.779%2C0%2C0%2C1-.063-.843l.407-1a.734.734%2C0%2C0%2C1%2C.656-.532l1.094-.156a.666.666%2C0%2C0%2C0%2C.359-.2.539.539%2C0%2C0%2C0%2C.172-.391A2.786%2C2.786%2C0%2C0%2C0%2C18%2C10ZM10%2C13.2A3.2%2C3.2%2C0%2C1%2C1%2C13.2%2C10%2C3.2%2C3.2%2C0%2C0%2C1%2C10%2C13.2Z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E",
                          className: "kat:w-20 kat:h-20 kat:shrink-0"
                        }),
                        label: r10("playerSettings"),
                        onClick: A2,
                        isActive: t10,
                        "aria-expanded": t10,
                        "aria-haspopup": "menu",
                        "data-testid": "player-settings-menu-button"
                      })
                    }),
                    (0, d.jsx)(ij, { isVisible: t10, toggleVisibility: P2, expandDirection: "up", children: B2() })
                  ]
                });
              }, iY = ({ Icon: t10, label: i10, onClick: a10, ...r10 }) => {
                let s10 = typeof t10 == "string" && t10.length > 4;
                return (0, d.jsx)("button", {
                  onClick: (t11) => {
                    t11.preventDefault(), a10();
                  },
                  "aria-label": i10,
                  type: "button",
                  className: (0, h.useMemo)(() => (0, tG.default)(...tz, s10 ? "kat:text-[14px] kat:@lg:text-[20px]" : "kat:text-[18px] kat:@lg:text-[24px]", "kat:rounded-full kat:border-transparent kat:opacity-100"), [s10]),
                  ...r10,
                  children: t10
                });
              }, iQ = ({ icon: t10, ariaLabel: i10, onToggle: a10 }) => (0, d.jsx)(iY, { Icon: t10, label: i10, onClick: a10, "data-testid": "fullscreen-button" }), iX = () => {
                let {
                  viewModelContainer: { fullScreenVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(false);
                return (0, h.useEffect)(() => {
                  let i11 = t10.isFullScreen$.subscribe((t11) => {
                    a10(t11);
                  });
                  return () => {
                    i11.unsubscribe();
                  };
                }, [t10]), {
                  isFullScreen: i10,
                  enterFullScreen: (0, h.useCallback)(() => {
                    t10.enterFullScreen();
                  }, [t10]),
                  exitFullScreen: (0, h.useCallback)(() => {
                    t10.exitFullScreen();
                  }, [t10])
                };
              };
              (nn = tK ||= {}).PlayPause = "PlayPause", nn.VolUp = "VolUp", nn.VolDown = "VolDown", nn.JumpForward = "JumpForward", nn.JumpBackward = "JumpBackward", nn.JumpForward10 = "JumpForward10", nn.JumpBackward10 = "JumpBackward10", nn.Mute = "Mute", nn.Fullscreen = "Fullscreen", nn.SkipEvent = "SkipEvent", nn.NextEpisode = "NextEpisode", nn.RestartEpisode = "RestartEpisode", nn.ToggleSubs = "ToggleSubs", nn.SeekPercent1 = "SeekPercent1", nn.SeekPercent2 = "SeekPercent2", nn.SeekPercent3 = "SeekPercent3", nn.SeekPercent4 = "SeekPercent4", nn.SeekPercent5 = "SeekPercent5", nn.SeekPercent6 = "SeekPercent6", nn.SeekPercent7 = "SeekPercent7", nn.SeekPercent8 = "SeekPercent8", nn.SeekPercent9 = "SeekPercent9", nn.FrameForward = "FrameForward", nn.FrameBackward = "FrameBackward";
              var i0 = {
                [tK.PlayPause]: [" ", "k", "K"],
                [tK.VolUp]: ["ArrowUp"],
                [tK.VolDown]: ["ArrowDown"],
                [tK.JumpForward]: ["ArrowRight"],
                [tK.JumpBackward]: ["ArrowLeft"],
                [tK.JumpForward10]: ["l", "L"],
                [tK.JumpBackward10]: ["j", "J"],
                [tK.Mute]: ["m", "M"],
                [tK.Fullscreen]: ["f", "F"],
                [tK.SkipEvent]: ["s", "S"],
                [tK.NextEpisode]: ["N"],
                [tK.RestartEpisode]: ["Home", "0"],
                [tK.ToggleSubs]: ["c", "C"],
                [tK.SeekPercent1]: ["1"],
                [tK.SeekPercent2]: ["2"],
                [tK.SeekPercent3]: ["3"],
                [tK.SeekPercent4]: ["4"],
                [tK.SeekPercent5]: ["5"],
                [tK.SeekPercent6]: ["6"],
                [tK.SeekPercent7]: ["7"],
                [tK.SeekPercent8]: ["8"],
                [tK.SeekPercent9]: ["9"],
                [tK.FrameForward]: [">", "."],
                [tK.FrameBackward]: ["<", ","]
              }, iHeldArrowSeekIntervalMs = 250, i1 = ({ shortcut: t10, handleShortcut: i10, target: a10 = "both" }) => {
                let { keyboardShortcutTarget: r10 } = im(), s10 = ig(), n10 = i0[t10], isArrowSeekShortcut = t10 === tK.JumpForward || t10 === tK.JumpBackward, lastArrowSeekAt = (0, h.useRef)(0), o10 = (0, h.useCallback)((t11) => {
                  if (t11.defaultPrevented === true || t11.metaKey === true || t11.ctrlKey === true || t11.altKey === true || !n10.includes(t11.key))
                    return;
                  let a11 = performance.now();
                  (!isArrowSeekShortcut || !t11.repeat || a11 - lastArrowSeekAt.current >= iHeldArrowSeekIntervalMs) && (lastArrowSeekAt.current = a11, i10(t11));
                  t11.preventDefault(), t11.stopPropagation(), t11.stopImmediatePropagation?.();
                }, [n10, i10, isArrowSeekShortcut]);
                (0, h.useEffect)(() => {
                  if (a10 === "containerOnly")
                    return s10 === undefined && l.Ft.warn("useKeyboardShortcut: No container element available for keyboard shortcut handling"), s10?.addEventListener("keydown", o10), () => {
                      s10?.removeEventListener("keydown", o10);
                    };
                }, [s10, o10, a10]), (0, h.useEffect)(() => {
                  if (a10 !== "both")
                    return;
                  r10 === undefined && l.Ft.warn("useKeyboardShortcut: No element available for keyboard shortcut handling"), r10?.addEventListener("keydown", o10);
                  let t11 = s10 !== undefined && s10 !== r10 ? s10 : undefined;
                  return t11?.addEventListener("keydown", o10), () => {
                    r10?.removeEventListener("keydown", o10), t11?.removeEventListener("keydown", o10);
                  };
                }, [r10, s10, o10, a10]);
              }, i4 = () => {
                let { isFullScreen: t10, enterFullScreen: i10, exitFullScreen: a10 } = iX(), { t: r10 } = iy(), s10 = t10 ? a10 : i10;
                i1({ shortcut: tK.Fullscreen, handleShortcut: s10 });
                let n10 = r10(t10 ? "fullscreen.exit.ariaLabel" : "fullscreen.enter.ariaLabel");
                return (0, d.jsx)("div", {
                  className: "kat:relative",
                  children: (0, d.jsx)(iQ, { icon: (0, d.jsx)(t3, { isFullscreen: t10, size: 20 }), onToggle: s10, ariaLabel: n10 })
                });
              }, i2 = {
                brand: {
                  primary: (0, tG.default)("kat:bg-orange-500 kat:border-transparent kat:text-neutral-900", "kat:hover:bg-orange-400", "kat:active:bg-orange-600", "kat:focus-visible:ring-4 kat:focus-visible:ring-neutral-50", "kat:disabled:bg-neutral-600 kat:disabled:text-neutral-400"),
                  secondary: (0, tG.default)("kat:bg-transparent kat:border-orange-500 kat:text-orange-500", "kat:hover:bg-orange-900 kat:hover:border-orange-900", "kat:active:bg-orange-900 kat:active:border-orange-500", "kat:focus-visible:ring-4 kat:focus-visible:ring-neutral-50", "kat:disabled:bg-transparent kat:disabled:border-neutral-500 kat:disabled:text-neutral-500"),
                  tertiary: (0, tG.default)("kat:bg-transparent kat:border-transparent kat:text-orange-500", "kat:hover:bg-orange-900", "kat:active:bg-orange-900", "kat:focus-visible:ring-4 kat:focus-visible:ring-neutral-50", "kat:disabled:bg-transparent kat:disabled:text-neutral-500")
                },
                standard: {
                  primary: (0, tG.default)("kat:bg-neutral-50 kat:border-transparent kat:text-neutral-900", "kat:hover:bg-neutral-200", "kat:active:bg-neutral-300", "kat:focus-visible:ring-4 kat:focus-visible:ring-taupe-600", "kat:disabled:bg-neutral-600 kat:disabled:text-neutral-400"),
                  secondary: (0, tG.default)("kat:bg-transparent kat:border-neutral-50 kat:text-neutral-50", "kat:hover:bg-neutral-700 kat:hover:border-neutral-700", "kat:active:bg-neutral-700 kat:active:border-neutral-50", "kat:focus-visible:ring-4 kat:focus-visible:ring-neutral-50", "kat:disabled:bg-transparent kat:disabled:border-neutral-500 kat:disabled:text-neutral-500"),
                  tertiary: (0, tG.default)("kat:bg-transparent kat:border-transparent kat:text-neutral-50", "kat:hover:bg-neutral-700", "kat:active:bg-neutral-700", "kat:focus-visible:ring-4 kat:focus-visible:ring-neutral-50", "kat:disabled:bg-transparent kat:disabled:text-neutral-500")
                }
              }, i3 = {
                brand: { primary: "kat:bg-orange-600", secondary: "kat:bg-orange-900 kat:border-orange-500", tertiary: "kat:bg-orange-900" },
                standard: { primary: "kat:bg-neutral-300", secondary: "kat:bg-neutral-700 kat:border-neutral-50", tertiary: "kat:bg-neutral-700" }
              }, i5 = ({
                variant: t10 = "primary",
                isBrand: i10 = false,
                disabled: a10 = false,
                children: r10,
                className: s10,
                onKeyDown: n10,
                onKeyUp: o10,
                onBlur: l2,
                onClick: u2,
                ...c2
              }) => {
                let [p2, f2] = (0, h.useState)(false), g2 = i10 ? "brand" : "standard", v2 = (0, h.useCallback)((t11) => {
                  (t11.key === "Enter" || t11.key === " ") && f2(true), n10?.(t11);
                }, [n10]), m2 = (0, h.useCallback)((t11) => {
                  (t11.key === "Enter" || t11.key === " ") && f2(false), o10?.(t11);
                }, [o10]), y2 = (0, h.useCallback)((t11) => {
                  f2(false), l2?.(t11);
                }, [l2]), _2 = (0, h.useCallback)((t11) => {
                  u2 && (u2(t11), t11.preventDefault());
                }, [u2]);
                return (0, d.jsx)("button", {
                  type: "button",
                  disabled: a10,
                  "data-variant": t10,
                  "data-brand": i10,
                  className: (0, tG.default)("kat:inline-flex kat:items-center kat:justify-center", "kat:rounded-full kat:border kat:border-solid", "kat:ps-24 kat:pe-24 kat:pt-12 kat:pb-12", "kat:text-sm kat:font-semibold kat:leading-none", "kat:transition-colors kat:duration-200", "kat:outline-none", "kat:cursor-pointer kat:disabled:cursor-not-allowed", i2[g2][t10], !a10 && p2 && i3[g2][t10], s10),
                  onKeyDown: v2,
                  onKeyUp: m2,
                  onBlur: y2,
                  onClick: _2,
                  ...c2,
                  children: r10
                });
              }, i6 = ({ label: t10, icon: i10, onClick: a10, isVisible: r10, className: s10 }) => (0, d.jsxs)(i5, {
                variant: "primary",
                onClick: () => {
                  r10 && a10();
                },
                "aria-label": t10,
                "aria-hidden": !r10,
                tabIndex: r10 ? 0 : -1,
                className: (0, tG.default)("kat:z-1001 kat:gap-4 kat:min-w-161 kat:h-44 kat:shadow-lg", "kat:flex kat:items-center kat:justify-center", "kat:transition-opacity kat:duration-200 kat:ease-in-out", r10 ? "kat:opacity-100 kat:pointer-events-auto" : "kat:opacity-0 kat:pointer-events-none", s10),
                children: [
                  (0, d.jsx)("span", { className: "kat:text-base kat:font-bold kat:leading-18 kat:tracking-[-0.48px]", children: t10 }),
                  (0, d.jsx)("span", { className: "kat:flex kat:items-center kat:shrink-0", children: i10 })
                ]
              }), i7 = ({ label: t10, icon: i10, isVisible: a10, onSkip: r10, className: s10 }) => (0, d.jsx)(i6, { label: t10, icon: i10, isVisible: a10, onClick: r10, className: s10 }), i8 = () => {
                let {
                  viewModelContainer: { skipEventVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(undefined), [r10, s10] = (0, h.useState)(false);
                return (0, h.useEffect)(() => {
                  let i11 = t10.activeSkipEvent$.subscribe((t11) => {
                    a10(t11);
                  });
                  return () => {
                    i11.unsubscribe();
                  };
                }, [t10]), (0, h.useEffect)(() => {
                  let i11 = t10.isAutoHideTimerExpired$.subscribe((t11) => {
                    s10(t11);
                  });
                  return () => {
                    i11.unsubscribe();
                  };
                }, [t10]), {
                  activeSkipEvent: i10,
                  isAutoHideTimerExpired: r10,
                  skip: (0, h.useCallback)(() => {
                    t10.skip();
                  }, [t10])
                };
              }, i9 = (0, h.createContext)(undefined), ae = 2000, at = 0.1, ai = ({ children: t10, eventTarget: i10, enabled: a10 = true, idleTimeoutMs: r10 = ae, mouseIdlePercentage: s10 = at }) => {
                let [n10, o10] = (0, h.useState)(true), [u2, c2] = (0, h.useState)(true), p2 = (0, h.useRef)(undefined), f2 = (0, h.useRef)(false), g2 = a10 && !!i10, v2 = (0, h.useCallback)(() => {
                  p2.current !== undefined && (window.clearTimeout(p2.current), p2.current = undefined);
                }, []), m2 = u2 ? r10 : r10 * s10, y2 = (0, h.useCallback)((t11) => {
                  if (v2(), !g2) {
                    o10(true);
                    return;
                  }
                  p2.current = window.setTimeout(() => {
                    o10(false);
                  }, t11 ?? m2);
                }, [v2, g2, m2]), _2 = (0, h.useCallback)((t11) => {
                  o10(true), y2(t11);
                }, [y2]), b2 = (0, h.useCallback)(() => {
                  _2(r10);
                }, [_2, r10]);
                (0, h.useEffect)(() => {
                  if (!a10)
                    return o10(true), v2(), v2;
                  if (!i10)
                    return f2.current ||= (l.Ft.warn("AutohiderProvider: No event target provided for autohider interaction handling"), true), o10(true), v2(), v2;
                  let t11 = ["mousemove", "mousedown", "keydown", "focusin"], s11 = (t12) => {
                    t12.type === "focusin" || t12.type === "keydown" ? _2(r10) : _2();
                  };
                  for (let a11 of (_2(), t11))
                    i10.addEventListener(a11, s11);
                  return () => {
                    for (let a11 of t11)
                      i10.removeEventListener(a11, s11);
                    v2();
                  };
                }, [i10, _2, v2, a10, r10]), (0, h.useEffect)(() => {
                  let t11 = () => c2(true), r11 = () => c2(false);
                  return a10 && i10 && (i10.addEventListener("mouseenter", t11), i10.addEventListener("mouseleave", r11)), () => {
                    a10 && i10 && (i10.removeEventListener("mouseenter", t11), i10.removeEventListener("mouseleave", r11));
                  };
                }, [a10, i10]);
                let k2 = (0, h.useMemo)(() => ({ isVisible: n10, bump: b2, enabled: a10, idleTimeoutMs: r10 }), [n10, b2, a10, r10]);
                return (0, d.jsx)(i9.Provider, { value: k2, children: t10 });
              };
              function aa() {
                let t10 = (0, h.useContext)(i9);
                if (!t10)
                  throw Error("useAutohider must be used within an AutohiderProvider");
                return t10;
              }
              var ar = ({ activeSkipEvent: t10, isAutoHideTimerExpired: i10 }) => {
                let { isVisible: a10 } = aa(), [r10, s10] = (0, h.useState)(false), n10 = (0, h.useRef)(a10);
                return (0, h.useLayoutEffect)(() => {
                  s10(false);
                }, [t10]), (0, h.useEffect)(() => {
                  n10.current && !a10 && s10(true), n10.current = a10;
                }, [a10]), !!t10 && (!i10 && !r10 || a10);
              }, as = () => {
                let { activeSkipEvent: t10, isAutoHideTimerExpired: i10, skip: a10 } = i8(), r10 = ar({ activeSkipEvent: t10, isAutoHideTimerExpired: i10 }), { t: s10 } = iy(), n10 = (0, h.useRef)(""), o10 = (0, h.useCallback)(() => {
                  t10 && a10();
                }, [t10, a10]);
                i1({ shortcut: tK.SkipEvent, handleShortcut: o10 });
                let l2 = (0, h.useMemo)(() => t10?.type ? s10(`skip.${t10.type}`) : "", [t10?.type, s10]);
                return (0, h.useEffect)(() => {
                  l2 && (n10.current = l2);
                }, [l2]), (0, d.jsx)(i7, {
                  label: l2 || n10.current,
                  icon: (0, d.jsx)(iu, {}),
                  isVisible: r10,
                  onSkip: a10,
                  className: "kat:self-end kat:mr-40 kat:pointer-events-auto"
                });
              }, an = (t10, i10 = 5) => {
                if (isNaN(t10) || isNaN(i10))
                  return 0;
                let a10 = Math.max(t10 - i10, 0);
                return t10 <= 0 || a10 <= 0 ? 0 : a10 / t10 * 100;
              }, ao = ({ anchorElementRef: t10, duration: i10, getThumbnailUri: a10, chapters: tA2 = [] }) => {
                let r10 = (0, h.useRef)(null), s10 = (0, h.useRef)(null), n10 = (0, h.useRef)(0), o10 = (0, h.useRef)(0), [l2, u2] = (0, h.useState)(false), [c2, p2] = (0, h.useState)("--:--"), [f2, g2] = (0, h.useState)(false), [chapterLabel, setChapterLabel] = (0, h.useState)(""), [chapterLabelVisible, setChapterLabelVisible] = (0, h.useState)(false), v2 = (0, h.useCallback)(() => {
                  u2(false);
                }, []), m2 = (0, h.useCallback)(() => {
                  u2(true);
                }, []), y2 = (0, h.useCallback)(() => {
                  if (g2(true), t10.current !== null) {
                    let i11 = getComputedStyle(t10.current);
                    o10.current = 1.33 * parseFloat(i11.getPropertyValue("--slider-thumb-base-size")) || 0, n10.current = t10.current.getBoundingClientRect().width;
                  }
                }, []), _2 = (0, h.useCallback)(() => {
                  g2(false), setChapterLabelVisible(false), t10.current !== null && t10.current.style.setProperty("--timeline-hover-percentage", "initial");
                }, []), b2 = (0, h.useCallback)((l3) => {
                  if (r10.current === null || t10.current === null || l3.currentTarget !== t10.current)
                    return;
                  let d2 = r10.current.clientWidth / 2, u3 = n10.current - d2, c3 = Math.min(Math.max(d2, l3.offsetX), u3) - d2;
                  r10.current.style.left = `${c3}px`;
                  let h2 = Math.round(n10.current - o10.current), f3 = Math.min(Math.max(l3.offsetX - o10.current / 2, 0), h2) / h2;
                  t10.current.style.setProperty("--timeline-hover-percentage", `${100 * f3}%`);
                  let g3 = i10 * f3;
                  p2(tL(g3));
                  let m3 = tA2.find((t11) => g3 >= t11.start && g3 < t11.end);
                  let chapter = m3?.label || "";
                  chapter && setChapterLabel(chapter), setChapterLabelVisible(!!chapter);
                  let v3 = a10 ? a10(g3) : undefined;
                  v3 && s10.current && (s10.current.src = v3);
                }, [a10, i10, t10, tA2]);
                return (0, h.useEffect)(() => {
                  let i11 = t10.current;
                  return i11 && (i11.addEventListener("mousemove", b2), i11.addEventListener("mouseenter", y2), i11.addEventListener("mouseleave", _2)), () => {
                    i11 && (i11.removeEventListener("mousemove", b2), i11.removeEventListener("mouseenter", y2), i11.removeEventListener("mouseleave", _2));
                  };
                }, [t10.current, b2, y2, _2]), (0, d.jsxs)("div", {
                  ref: r10,
                  className: (0, tG.default)("kat:flex kat:shrink-0 kat:pointer-events-none kat:select-none trickplay", f2 ? "kat:opacity-100" : "kat:opacity-0"),
                  "aria-hidden": true,
                  "data-testid": "trickplay-container",
                  children: [
                    (0, d.jsx)("img", {
                      className: (0, tG.default)("kat:aspect-video kat:shrink-0 kat:object-contain", l2 ? "kat:block" : "kat:hidden"),
                      style: { width: "260px", minWidth: "260px" },
                      ref: s10,
                      onLoad: m2,
                      onError: v2,
                      "data-testid": "trickplay-image"
                    }),
                    (0, d.jsx)("span", {
                      style: {
                        position: l2 ? "absolute" : "relative",
                        top: l2 ? "8px" : undefined,
                        left: l2 ? "50%" : undefined,
                        maxWidth: "244px",
                        padding: "5px 9px",
                        overflow: "hidden",
                        borderRadius: "6px",
                        background: "rgba(8, 8, 10, 0.86)",
                        color: "rgb(249, 249, 250)",
                        fontSize: "13px",
                        fontWeight: 700,
                        lineHeight: "18px",
                        opacity: chapterLabelVisible ? 1 : 0,
                        textOverflow: "ellipsis",
                        transform: l2 ? `translate(-50%, ${chapterLabelVisible ? "0" : "5px"})` : `translateY(${chapterLabelVisible ? "0" : "5px"})`,
                        transition: "opacity 160ms ease, transform 260ms cubic-bezier(0.16, 1.35, 0.32, 1)",
                        whiteSpace: "nowrap"
                      },
                      children: chapterLabel || " "
                    }),
                    (0, d.jsx)("span", {
                      className: (0, tG.default)("kat:text-neutral-50 kat:not-italic kat:font-bold kat:tracking-[-0.42px] kat:pl-8 kat:pr-8 kat:pb-4 kat:pt-4", l2 ? "kat:absolute kat:bottom-0 kat:left-1/2 kat:-translate-x-1/2" : "kat:relative kat:object-bottom"),
                      style: { fontSize: "16px", lineHeight: "22px" },
                      "data-testid": "trickplay-timestamp",
                      children: c2
                    })
                  ]
                });
              }, al = { gradientStartPercent: 5, keyboardDebounceTimeoutMs: 250 }, ad = (0, h.forwardRef)(({
                ariaLabel: t10,
                duration: i10,
                elapsedTime: aT2 = tL(0),
                totalTime: iT2 = tL(0),
                getAriaValueText: a10,
                getThumbnailUri: r10,
                getBufferedEnd: aA2,
                seekTo: s10,
                chapters: tA2 = [],
                config: n10 = al
              }, o10) => {
                let l2 = (0, h.useRef)(null), u2 = (0, h.useRef)(false), c2 = (0, h.useRef)(false), p2 = (0, h.useRef)(undefined), f2 = (0, h.useRef)(undefined), keyboardSeekStepAt = (0, h.useRef)(0), [timelineHovered, setTimelineHovered] = (0, h.useState)(false);
                let chapterBoundaries = Array.from(new Set(tA2.flatMap((t11) => [t11.start, t11.end]).filter((t11) => Number.isFinite(t11) && t11 > 0 && t11 < i10).map((t11) => Number(t11.toFixed(3))))).sort((t11, i11) => t11 - i11), createChapterMask = (t11, i11) => {
                  if (!Number.isFinite(i11) || i11 <= 0)
                    return;
                  let a11 = t11.filter((t12) => Number.isFinite(t12) && t12 > 0 && t12 < i11);
                  if (a11.length === 0)
                    return;
                  let r11 = ["#000 0%"];
                  return a11.forEach((t12) => {
                    let a12 = t12 / i11 * 100;
                    r11.push(`#000 calc(${a12}% - var(--chapter-gap))`, `transparent calc(${a12}% - var(--chapter-gap))`, `transparent calc(${a12}% + var(--chapter-gap))`, `#000 calc(${a12}% + var(--chapter-gap))`);
                  }), r11.push("#000 100%"), `linear-gradient(to right, ${r11.join(", ")})`;
                }, chapterMask = createChapterMask(chapterBoundaries, i10), updateProgressChapterMask = (0, h.useCallback)((t11) => {
                  if (l2.current === null)
                    return;
                  let i11 = createChapterMask(chapterBoundaries.filter((i12) => i12 < t11), t11);
                  l2.current.style.setProperty("--chapter-progress-mask", i11 || "linear-gradient(to right, #000 0%, #000 100%)");
                }, [chapterBoundaries]), updateTimelinePaint = (0, h.useCallback)((t11) => {
                  if (l2.current === null)
                    return;
                  let a11 = Number.isFinite(t11) ? t11 : l2.current.valueAsNumber, r11 = i10 === 0 ? 0 : Math.min(100, Math.max(0, a11 / i10 * 100)), s11 = Number(aA2?.()) || 0, o11 = i10 === 0 ? 0 : Math.min(100, Math.max(0, s11 / i10 * 100)), u3 = Math.max(r11, o11);
                  l2.current.style.setProperty("--timeline-progress-percent", `${r11}%`), l2.current.style.setProperty("--timeline-buffer-percent", `${u3}%`), l2.current.style.setProperty("--moz-progress-gradient-percent", `${an(r11, n10.gradientStartPercent)}%`);
                }, [i10, aA2, n10.gradientStartPercent]);
                (0, h.useEffect)(() => {
                  let t11 = () => updateTimelinePaint(l2.current?.valueAsNumber);
                  t11();
                  let r11 = setInterval(t11, 500);
                  return () => clearInterval(r11);
                }, [updateTimelinePaint]), (0, h.useImperativeHandle)(o10, () => ({
                  updatePosition: (t11) => {
                    if (l2.current !== null && u2.current === false && c2.current === false) {
                      l2.current.valueAsNumber = t11;
                      updateTimelinePaint(t11);
                      updateProgressChapterMask(t11);
                      let o11 = Math.floor(t11);
                      l2.current.ariaValueNow = o11.toFixed(0), l2.current.ariaValueText = a10(o11);
                    }
                  }
                }), [a10, updateProgressChapterMask, updateTimelinePaint]), (0, h.useEffect)(() => {
                  l2.current !== null && n10.gradientStartPercent >= 0 && n10.gradientStartPercent <= 100 && l2.current.style.setProperty("--gradient-start-percent", `${n10.gradientStartPercent.toFixed(2)}%`);
                }, [n10]), (0, h.useEffect)(() => {
                  l2.current !== null && updateProgressChapterMask(l2.current.valueAsNumber);
                }, [chapterMask, updateProgressChapterMask]);
                let g2 = (0, h.useCallback)((t11) => {
                  if (t11.target !== l2.current || t11.target === null)
                    return;
                  u2.current !== true && c2.current !== true || (f2.current = t11.target.valueAsNumber), updateTimelinePaint(t11.target.valueAsNumber), updateProgressChapterMask(t11.target.valueAsNumber);
                }, [updateProgressChapterMask, updateTimelinePaint]);
                return (0, d.jsxs)("div", {
                  className: "timeline-container kat:flex kat:items-center kat:w-full kat:pt-20 kat:pb-20 kat:gap-10",
                  children: [
                    (0, d.jsx)("span", {
                      className: "kat:text-start kat:text-[rgb(249,249,250)] kat:text-[14px] kat:font-bold kat:min-w-100 kat:tabular-nums",
                      children: aT2
                    }),
                    (0, d.jsxs)("div", {
                      className: "kat:relative kat:flex-1 kat:flex kat:items-center kat:w-full",
                      children: [
                        (0, d.jsx)("style", {
                          children: `@property --chapter-gap { syntax: "<length>"; inherits: true; initial-value: 1.5px; }
` + `.timeline-slider[data-segmented="true"] { transition: --chapter-gap 360ms cubic-bezier(0.16, 1.55, 0.32, 1); }
` + `.timeline-slider[data-segmented="true"]::-webkit-slider-runnable-track { -webkit-mask-image: var(--chapter-mask); mask-image: var(--chapter-mask); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-size: 100% 100%; mask-size: 100% 100%; }
` + `.timeline-slider[data-segmented="true"]::-moz-range-track { mask-image: var(--chapter-mask); mask-repeat: no-repeat; mask-size: 100% 100%; }
` + `.timeline-slider[data-segmented="true"]::-moz-range-progress { mask-image: var(--chapter-progress-mask, linear-gradient(to right, #000 0%, #000 100%)); mask-repeat: no-repeat; mask-size: 100% 100%; }
` + `.timeline-slider[data-scrubber="true"]::-webkit-slider-runnable-track { background: linear-gradient(to right, rgb(255,100,10) 0%, rgb(255,100,10) var(--timeline-progress-percent, 0%), rgb(154,155,160) var(--timeline-progress-percent, 0%), rgb(154,155,160) var(--timeline-buffer-percent, 0%), rgb(74,75,79) var(--timeline-buffer-percent, 0%), rgb(74,75,79) 100%) !important; }
` + `.timeline-slider[data-scrubber="true"]::-moz-range-track { background: linear-gradient(to right, rgb(154,155,160) 0%, rgb(154,155,160) var(--timeline-buffer-percent, 0%), rgb(74,75,79) var(--timeline-buffer-percent, 0%), rgb(74,75,79) 100%) !important; }
` + `.timeline-slider[data-scrubber="true"]::-moz-range-progress { background: rgb(255,100,10) !important; }
` + `.timeline-slider[data-scrubber="true"]::-webkit-slider-thumb { -webkit-appearance: none !important; appearance: none !important; width: 14px !important; height: 14px !important; border: 0 !important; border-radius: 50% !important; background: rgb(255, 100, 10) !important; box-shadow: 0 0 0 2px rgba(0,0,0,0.22), 0 2px 7px rgba(0,0,0,0.38) !important; opacity: 1 !important; cursor: pointer; transform: scale(1); transform-origin: center; transition: transform 220ms cubic-bezier(0.2, 1.45, 0.35, 1), box-shadow 180ms ease !important; }
` + `.timeline-slider[data-scrubber="true"]::-moz-range-thumb { width: 14px !important; height: 14px !important; border: 0 !important; border-radius: 50% !important; background: rgb(255, 100, 10) !important; box-shadow: 0 0 0 2px rgba(0,0,0,0.22), 0 2px 7px rgba(0,0,0,0.38) !important; opacity: 1 !important; cursor: pointer; transform: scale(1); transform-origin: center; transition: transform 220ms cubic-bezier(0.2, 1.45, 0.35, 1), box-shadow 180ms ease !important; }
` + `.timeline-slider[data-scrubber="true"]:hover::-webkit-slider-thumb { transform: scale(1.22); box-shadow: 0 0 0 3px rgba(255,100,10,0.18), 0 3px 10px rgba(0,0,0,0.45) !important; }
` + `.timeline-slider[data-scrubber="true"]:hover::-moz-range-thumb { transform: scale(1.22); box-shadow: 0 0 0 3px rgba(255,100,10,0.18), 0 3px 10px rgba(0,0,0,0.45) !important; }
` + `.timeline-slider[data-scrubber="true"]:active::-webkit-slider-thumb { transform: scale(1.42); box-shadow: 0 0 0 4px rgba(255,100,10,0.2), 0 4px 13px rgba(0,0,0,0.5) !important; }
` + `.timeline-slider[data-scrubber="true"]:active::-moz-range-thumb { transform: scale(1.42); box-shadow: 0 0 0 4px rgba(255,100,10,0.2), 0 4px 13px rgba(0,0,0,0.5) !important; }
` + `.timeline-slider[data-scrubber="true"]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 3px rgb(8,8,10), 0 0 0 5px rgb(249,249,250) !important; }
` + `.timeline-slider[data-scrubber="true"]:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 3px rgb(8,8,10), 0 0 0 5px rgb(249,249,250) !important; }
` + '@media (prefers-reduced-motion: reduce) { .timeline-slider[data-segmented="true"] { transition: none !important; } .timeline-slider[data-scrubber="true"]::-webkit-slider-thumb { transition: none !important; } .timeline-slider[data-scrubber="true"]::-moz-range-thumb { transition: none !important; } }'
                        }),
                        (0, d.jsx)(ao, {
                          anchorElementRef: l2,
                          duration: i10,
                          getThumbnailUri: r10,
                          chapters: tA2
                        }),
                        (0, d.jsx)("input", {
                          ref: l2,
                          className: "timeline-slider kat:flex kat:w-full kat:appearance-none kat:pt-20 kat:pb-20",
                          "data-segmented": chapterMask ? "true" : undefined,
                          "data-scrubber": "true",
                          style: {
                            "--slider-thumb-base-size": "14px",
                            ...chapterMask ? {
                              "--chapter-mask": chapterMask,
                              "--chapter-gap": timelineHovered ? "3px" : "1.5px"
                            } : {}
                          },
                          type: "range",
                          "aria-label": t10,
                          min: "0",
                          "aria-valuemin": 0,
                          max: i10,
                          "aria-valuemax": i10,
                          step: 0.25,
                          onChange: g2,
                          onMouseEnter: () => {
                            setTimelineHovered(true);
                          },
                          onMouseLeave: () => {
                            setTimelineHovered(false);
                          },
                          onMouseDown: () => {
                            u2.current = true;
                          },
                          onMouseUp: (t11) => {
                            u2.current !== true || t11.currentTarget !== l2.current || isNaN(t11.currentTarget.valueAsNumber) || (f2.current = t11.currentTarget.valueAsNumber), u2.current = false, s10 && f2.current !== undefined && (s10(f2.current), f2.current = undefined);
                          },
                          onClick: (t11) => {
                            t11.preventDefault();
                          },
                          onKeyDown: (t11) => {
                            if (l2.current === null)
                              return;
                            c2.current = true, p2.current !== undefined && clearTimeout(p2.current), p2.current = setTimeout(() => {
                              c2.current = false, s10 && f2.current !== undefined && (s10(f2.current), f2.current = undefined);
                            }, n10.keyboardDebounceTimeoutMs);
                            let i11 = false, a11 = performance.now(), r11 = !t11.repeat || a11 - keyboardSeekStepAt.current >= iHeldArrowSeekIntervalMs;
                            switch (t11.key) {
                              case "ArrowLeft":
                              case "ArrowDown":
                                ;
                                i11 = true, r11 && (keyboardSeekStepAt.current = a11, l2.current.valueAsNumber = Math.max(0, l2.current.valueAsNumber - 5), f2.current = l2.current.valueAsNumber);
                                break;
                              case "ArrowRight":
                              case "ArrowUp":
                                ;
                                i11 = true, r11 && (keyboardSeekStepAt.current = a11, l2.current.valueAsNumber = Math.min(Number(l2.current.max), l2.current.valueAsNumber + 5), f2.current = l2.current.valueAsNumber);
                            }
                            i11 && (t11.preventDefault(), r11 && (updateTimelinePaint(l2.current.valueAsNumber), updateProgressChapterMask(l2.current.valueAsNumber), s10 && f2.current !== undefined && (s10(f2.current), f2.current = undefined)));
                          }
                        })
                      ]
                    }),
                    (0, d.jsx)("span", {
                      className: "kat:text-end kat:flex kat:justify-end kat:text-[rgb(249,249,250)] kat:text-[14px] kat:font-bold kat:min-w-100 kat:tabular-nums",
                      children: iT2
                    })
                  ]
                });
              }), au = () => {
                let {
                  viewModelContainer: { timelineScrubberVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(0), [v2, m2] = (0, h.useState)(tL(0)), [r10, s10] = (0, h.useState)(tL(0)), [chapterSegments, setChapterSegments] = (0, h.useState)([]), { t: n10 } = iy(), o10 = (0, h.useRef)(null), l2 = (0, h.useCallback)((i11) => {
                  t10.setPosition(i11);
                }, [t10]);
                (0, h.useEffect)(() => {
                  let i11 = [];
                  return i11.push(t10.currentPlayhead$.subscribe((t11) => {
                    m2(tL(t11));
                    o10.current?.updatePosition(t11);
                  })), i11.push(t10.duration$.subscribe((t11) => {
                    a10(t11), s10(tL(t11));
                  })), i11.push(t10.chapterSegments$.subscribe(setChapterSegments)), () => {
                    i11.forEach((t11) => t11.unsubscribe());
                  };
                }, [t10]);
                let u2 = (0, h.useCallback)((t11) => n10("timeline.ariaValueText", { elapsed: tL(t11), duration: r10 }), [r10, n10]), chapters = (0, h.useMemo)(() => chapterSegments.map((t11) => ({
                  ...t11,
                  label: t11.localizedLabel || n10(`chapter.${t11.type}`)
                })), [chapterSegments, n10]);
                return (0, d.jsx)(ad, {
                  ref: o10,
                  duration: i10,
                  elapsedTime: v2,
                  totalTime: r10,
                  seekTo: l2,
                  getThumbnailUri: t10.getThumbnailUri,
                  getBufferedEnd: t10.getBufferedEnd,
                  getAriaValueText: u2,
                  chapters,
                  ariaLabel: n10("timeline.ariaLabel")
                });
              }, ac = ({ time: t10, totalTime: i10, ariaLabel: a10 }) => (0, d.jsxs)("span", {
                "data-testid": "timestamp",
                className: "kat:select-none kat:text-[18px] kat:font-bold kat:leading-24 kat:tracking-[-0.36px] kat:p-8 kat:h-44 kat:@lg:h-64 kat:flex kat:items-center kat:whitespace-pre",
                "aria-label": a10,
                children: [
                  (0, d.jsx)("span", { className: "kat:text-neutral-300", children: t10 }),
                  (0, d.jsx)("span", { className: "kat:text-neutral-500", children: " / " }),
                  (0, d.jsx)("span", { className: "kat:text-neutral-300", children: i10 })
                ]
              }), ah = () => {
                let {
                  viewModelContainer: { timestampDisplayVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)("0:00"), [r10, s10] = (0, h.useState)("0:00");
                return (0, h.useEffect)(() => {
                  let i11 = t10.elapsedTime$.subscribe((t11) => {
                    a10(t11);
                  }), r11 = t10.totalTime$.subscribe((t11) => {
                    s10(t11);
                  });
                  return () => {
                    i11.unsubscribe(), r11.unsubscribe();
                  };
                }, [t10]), { elapsedTime: i10, totalTime: r10 };
              }, ap = () => {
                let { elapsedTime: t10, totalTime: i10 } = ah(), { t: a10 } = iy();
                return (0, d.jsx)(ac, { time: t10, totalTime: i10, ariaLabel: `${a10("elapsed", { timestamp: t10 })} ${a10("total", { timestamp: i10 })}` });
              }, af = (t10) => (0, d.jsxs)("svg", {
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                ...t10,
                children: [
                  (0, d.jsx)("path", { d: "M14 16.0003H5.9999V14.0002L14 14.0002V16.0003Z", fill: "currentColor" }),
                  (0, d.jsx)("path", { d: "M17.9999 16.0003H16.0001V14.0002H17.9999V16.0003Z", fill: "currentColor" }),
                  (0, d.jsx)("path", { d: "M8 12.0001L5.9999 12.0001L5.9999 10H8V12.0001Z", fill: "currentColor" }),
                  (0, d.jsx)("path", { d: "M17.9999 12.0001H10.0001V10L17.9999 10V12.0001Z", fill: "currentColor" }),
                  (0, d.jsx)("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M22.0001 19.9999L2 19.9999L2 4L22.0001 4L22.0001 19.9999ZM4.0001 18.0001L20 18.0001L20 6.0001L4.0001 6.0001L4.0001 18.0001Z",
                    fill: "currentColor"
                  })
                ]
              }), ag = ({ className: t10, ...i10 }) => (0, d.jsx)(af, { className: t10, ...i10 }), av = ({ onToggle: t10, isOpen: i10 }) => {
                let { t: a10 } = iy();
                return (0, d.jsx)(tY, {
                  Icon: (0, d.jsx)(ag, { className: "kat:w-24 kat:h-24 kat:@lg:w-40 kat:@lg:h-40 kat:shrink-0" }),
                  label: a10("trackSelection.ariaLabel"),
                  onClick: t10,
                  isActive: i10,
                  "aria-expanded": i10,
                  "aria-haspopup": "menu",
                  "data-testid": "track-selection-button"
                });
              }, am = ({ audioTracks: t10, textTracks: i10, selectedAudioTrack: a10, selectedTextTrack: r10, onAudioTrackSelect: s10, onTextTrackSelect: n10 }) => {
                let { t: o10 } = iy(), u2 = (t11) => {
                  let i11 = t11.displayName === t11.language ? o10(t11.language) || t11.language : t11.displayName;
                  return t11.role === l.lt.AUDIO_DESCRIPTION ? o10("trackSelectionMenu.audioTrack.audioDescription", { trackName: i11 }) : i11;
                }, c2 = (t11) => {
                  let i11 = t11.displayName === t11.language ? o10(t11.language) || t11.language : t11.displayName;
                  return t11.role === l.x.CLOSED_CAPTION ? o10("trackSelectionMenu.textTrack.closedCaption", { trackName: i11 }) : i11;
                };
                return (0, d.jsx)("div", {
                  className: "kat:flex kat:w-400 kat:min-h-100 kat:max-h-394 kat:flex-1 kat:flex-col",
                  "data-testid": "audio-text-track-menu",
                  children: (0, d.jsxs)("div", {
                    className: "kat:flex kat:flex-row kat:w-full kat:min-h-0 kat:flex-1",
                    children: [
                      (0, d.jsx)("div", {
                        className: "kat:relative kat:flex-1 kat:flex kat:flex-col kat:min-h-0",
                        children: (0, d.jsxs)(ib, {
                          ariaLabel: o10("audioTrackSelection"),
                          children: [
                            (0, d.jsx)(ik, { label: o10("audio") }),
                            (0, d.jsx)("div", {
                              className: "kat:flex-1 kat:overflow-y-auto kat:min-h-0 kat:h-full kat:scroll-shadows",
                              children: t10.map((i11) => {
                                let r11 = a10?.language === i11.language && a10?.role === i11.role && a10?.format === i11.format;
                                return (0, d.jsx)(ix, { label: u2(i11), selected: r11 || t10.length === 1, onSelect: () => s10(i11), disabled: !i11.canUse || t10.length <= 1 }, `${i11.language}-${i11.role}`);
                              })
                            })
                          ]
                        })
                      }),
                      (0, d.jsx)("div", {
                        className: "kat:flex kat:items-center kat:justify-center kat:self-stretch kat:rounded-0",
                        role: "separator",
                        "aria-orientation": "vertical",
                        children: (0, d.jsx)("div", { className: "kat:w-1 kat:h-full kat:bg-neutral-600" })
                      }),
                      (0, d.jsx)("div", {
                        className: "kat:relative kat:flex-1 kat:flex kat:flex-col kat:min-h-0",
                        children: (0, d.jsxs)(ib, {
                          ariaLabel: o10("subtitleAndCcSelection"),
                          children: [
                            (0, d.jsx)(ik, { label: o10("subtitlesCc") }),
                            (0, d.jsx)("div", {
                              className: "kat:flex-1 kat:overflow-y-auto kat:min-h-0 kat:h-full kat:scroll-shadows",
                              children: i10.map((t11) => {
                                let i11 = r10?.language === t11.language && r10?.role === t11.role && r10?.format === t11.format;
                                return (0, d.jsx)(ix, { label: c2(t11), selected: i11, onSelect: () => n10(t11) }, `${t11.language}-${t11.role}`);
                              })
                            })
                          ]
                        })
                      })
                    ]
                  })
                });
              }, ay = () => {
                let {
                  viewModelContainer: { trackSelectionVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)([]), [r10, s10] = (0, h.useState)(undefined), [n10, o10] = (0, h.useState)([]), [l2, u2] = (0, h.useState)(undefined);
                return (0, h.useEffect)(() => {
                  let i11 = t10.availableAudioTracks$.subscribe((t11) => {
                    a10(t11);
                  }), r11 = t10.activeAudioTrack$.subscribe((t11) => {
                    s10(t11);
                  }), n11 = t10.availableTextTracks$.subscribe((t11) => {
                    o10(t11);
                  }), l3 = t10.activeTextTrack$.subscribe((t11) => {
                    u2(t11);
                  });
                  return () => {
                    i11.unsubscribe(), r11.unsubscribe(), n11.unsubscribe(), l3.unsubscribe();
                  };
                }, [t10]), (0, d.jsx)(am, {
                  audioTracks: i10,
                  textTracks: n10,
                  selectedAudioTrack: r10,
                  selectedTextTrack: l2,
                  onAudioTrackSelect: (0, h.useCallback)((i11) => {
                    t10.setAudioTrack(i11);
                  }, [t10]),
                  onTextTrackSelect: (0, h.useCallback)((i11) => {
                    t10.setTextTrack(i11);
                  }, [t10])
                });
              }, a_ = () => {
                let { isActive: t10, toggle: i10, close: a10 } = iI();
                return (0, d.jsxs)("div", {
                  className: "kat:relative",
                  children: [
                    (0, d.jsx)("div", {
                      className: (0, tG.default)("kat:relative", t10 && "kat:z-[1002]"),
                      children: (0, d.jsx)(av, { onToggle: i10, isOpen: t10 })
                    }),
                    (0, d.jsx)(ij, { isVisible: t10, toggleVisibility: a10, expandDirection: "up", children: (0, d.jsx)(ay, {}) })
                  ]
                });
              }, ab = ({ className: t10, size: i10 = 80, ariaLabel: a10 }) => (0, d.jsx)("div", {
                "data-testid": "buffering-indicator-medium",
                className: (0, tG.default)("kat-buffering-medium-arc", t10),
                role: "progressbar",
                "aria-label": a10,
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                children: (0, d.jsx)(t9, { size: i10 })
              }), ak = ({ className: t10, size: i10 = 80, ariaLabel: a10 }) => (0, d.jsx)("div", {
                "data-testid": "buffering-indicator-low",
                className: (0, tG.default)("kat-buffering-low-icon", t10),
                role: "progressbar",
                "aria-label": a10,
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                children: (0, d.jsx)(tX, { size: i10 })
              }), aC = ({ isVisible: t10, size: i10 = 80, className: a10, ariaLabel: r10 }) => t10 ? (0, d.jsxs)("div", {
                "data-testid": "buffering-indicator",
                className: (0, tG.default)("kat:absolute kat:inset-0 kat:flex kat:items-center kat:justify-center kat:pointer-events-none", a10),
                children: [
                  (0, d.jsx)("div", { className: "kat-buffering-medium-wrapper", children: (0, d.jsx)(ab, { size: i10, ariaLabel: r10 }) }),
                  (0, d.jsx)("div", { className: "kat-buffering-low-wrapper", children: (0, d.jsx)(ak, { size: i10, ariaLabel: r10 }) })
                ]
              }) : null, aw = () => {
                let {
                  viewModelContainer: { bufferingVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(false);
                return (0, h.useEffect)(() => {
                  let i11 = A([t10.isLoading$, t10.isRebuffering$]).subscribe(([t11, i12]) => {
                    a10(t11 || i12);
                  });
                  return () => {
                    i11.unsubscribe();
                  };
                }, [t10]), { isBuffering: i10 };
              }, ax = () => {
                let { isBuffering: t10 } = aw(), { t: i10 } = iy();
                return (0, d.jsx)(aC, { isVisible: t10, ariaLabel: i10("buffering.ariaLabel") });
              }, aE = ({ icon: t10, onToggle: i10, ariaLabel: a10 }) => (0, d.jsx)(iY, { Icon: t10, label: a10, onClick: i10, "data-testid": "play-pause-button" }), aS = ({ icon: t10, ariaLabel: i10, onJump: a10, testId: r10 }) => (0, d.jsx)(iY, { Icon: t10, label: i10, onClick: a10, "data-testid": r10 }), aT = () => {
                let {
                  viewModelContainer: { playPauseButtonVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(undefined);
                return (0, h.useEffect)(() => {
                  let i11 = t10.isPlaying$.subscribe((t11) => {
                    a10(t11);
                  });
                  return () => {
                    i11.unsubscribe();
                  };
                }, [t10]), {
                  isPlaying: i10,
                  togglePlayPause: (0, h.useCallback)(() => {
                    t10.togglePlayPause();
                  }, [t10])
                };
              }, aP = () => {
                let {
                  viewModelContainer: { jumpButtonsVM: t10 }
                } = im(), i10 = (0, h.useRef)(undefined);
                return (0, h.useEffect)(() => {
                  let a10 = t10.currentPosition$.subscribe((t11) => {
                    i10.current = t11;
                  });
                  return () => {
                    a10.unsubscribe();
                  };
                }, [t10]), {
                  currentPosition: i10,
                  jumpForward: (0, h.useCallback)(() => {
                    t10.jumpForward();
                  }, [t10]),
                  jumpBackward: (0, h.useCallback)(() => {
                    t10.jumpBackward();
                  }, [t10])
                };
              }, aA = () => {
                let { isPlaying: t10, togglePlayPause: i10 } = aT(), { t: a10 } = iy();
                i1({ shortcut: tK.PlayPause, handleShortcut: i10 });
                let r10 = a10(t10 ? "pause" : "play");
                return (0, d.jsx)(aE, { icon: (0, d.jsx)(t10 ? ia : il, { size: 20 }), onToggle: i10, ariaLabel: r10 });
              }, aL = ({ isForward: t10 }) => {
                let { jumpForward: i10, jumpBackward: a10 } = aP(), { bump: showControls } = aa(), { t: r10 } = iy(), s10 = (0, h.useCallback)(() => {
                  t10 ? i10() : a10(), showControls();
                }, [t10, a10, i10, showControls]), n10 = r10(t10 ? "jump.forward.ariaLabel" : "jump.backward.ariaLabel");
                i1(t10 ? { shortcut: tK.JumpForward, handleShortcut: s10 } : { shortcut: tK.JumpBackward, handleShortcut: s10 });
                return (0, d.jsx)(aS, {
                  icon: (0, d.jsx)(t7, { isForward: t10 }),
                  ariaLabel: n10,
                  onJump: s10,
                  testId: t10 ? "jump-forward-button" : "jump-backward-button"
                });
              }, aI = () => (0, d.jsx)(aL, { isForward: true }), aR = () => (0, d.jsx)(aL, { isForward: false }), aD = () => {
                let {
                  viewModelContainer: { volumeVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(undefined), [r10, s10] = (0, h.useState)(undefined);
                return (0, h.useEffect)(() => {
                  let i11 = t10.volumePercent$.subscribe((t11) => {
                    a10(t11);
                  }), r11 = t10.isMuted$.subscribe((t11) => {
                    s10(t11);
                  });
                  return () => {
                    i11.unsubscribe(), r11.unsubscribe();
                  };
                }, [t10]), {
                  volumePercent: i10,
                  isMuted: r10,
                  toggleMute: (0, h.useCallback)(() => {
                    t10.toggleMute();
                  }, [t10]),
                  setVolumePercent: (0, h.useCallback)((i11, a11 = false) => {
                    t10.setVolumePercent(i11, a11);
                  }, [t10]),
                  incrementVolume: (0, h.useCallback)(() => {
                    t10.incrementVolume();
                  }, [t10]),
                  incrementBoostVolume: (0, h.useCallback)(() => {
                    t10.incrementBoostVolume();
                  }, [t10]),
                  decrementVolume: (0, h.useCallback)(() => {
                    t10.decrementVolume();
                  }, [t10])
                };
              }, aM = ({ value: t10, max: i10 = 100, onChange: a10, className: r10, style: s10, ...n10 }) => (0, d.jsx)("input", {
                type: "range",
                min: 0,
                max: i10,
                step: 1,
                value: t10,
                onChange: (0, h.useCallback)((t11) => {
                  a10(Number(t11.target.value), t11.nativeEvent?.shiftKey || Number(t11.target.value) > 100);
                }, [a10]),
                "data-testid": "volume-slider",
                className: (0, tG.default)("volume-slider", "kat:m-0", "kat:cursor-pointer", "kat:appearance-none", "kat:bg-transparent", "kat:p-0", r10),
                style: { "--volume-percent": `${Math.min(100, t10)}%`, ...s10 },
                ...n10
              }), aN = { low: 33, medium: 66 }, aj = (t10, i10 = aN) => t10 === undefined || t10 === 0 ? "off" : t10 <= i10.low ? "low" : t10 <= i10.medium ? "medium" : "high", aO = ["Enter", " "], aV = (0, h.forwardRef)(({
                volumePercent: t10,
                isMuted: i10,
                label: a10,
                onIconClick: r10,
                onVolumeChange: s10,
                onBoostIncrement: n10,
                onVolumeDecrement: o10,
                className: l2,
                ...u2
              }, c2) => {
                let [p2, f2] = (0, h.useState)(false), g2 = Math.max(0, Math.min(p2 || t10 > 100 ? 200 : 100, t10)), v2 = aj(Math.min(100, g2)), m2 = g2 > 100, y2 = (0, tG.default)("volume-container", "kat:flex kat:flex-col kat:items-center kat:cursor-pointer kat:hover:pt-8 kat:hover:bg-neutral-700 kat:hover:rounded-xl kat:focus-visible:pt-8 kat:focus-visible:bg-neutral-700 kat:focus-visible:rounded-xl", l2), _2 = (0, h.useCallback)((t11) => {
                  aO.includes(t11.key) && (t11.preventDefault(), r10());
                }, [r10]), b2 = (0, h.useCallback)((t11) => {
                  if (!t11.shiftKey)
                    return;
                  t11.preventDefault(), f2(true), t11.deltaY < 0 ? n10?.() : o10?.();
                }, [n10, o10]), w2 = (0, h.useCallback)((t11, i11) => {
                  i11 && f2(true), s10(t11, i11);
                }, [s10]);
                return (0, d.jsxs)("div", {
                  ref: c2,
                  className: y2,
                  "data-testid": "volume-slider-container",
                  role: "slider",
                  tabIndex: 0,
                  "aria-label": a10,
                  onWheel: b2,
                  onPointerDown: (t11) => {
                    t11.shiftKey && f2(true);
                  },
                  onMouseLeave: () => {
                    g2 <= 100 && f2(false);
                  },
                  onClick: (0, h.useCallback)((t11) => {
                    t11.target.closest("svg") && r10(), t11.preventDefault();
                  }, [r10]),
                  onKeyDown: _2,
                  ...u2,
                  children: [
                    (0, d.jsxs)("div", {
                      "aria-hidden": "true",
                      className: "volume-slider-content",
                      children: [
                        (0, d.jsx)(aM, {
                          value: g2,
                          max: p2 || m2 ? 200 : 100,
                          onChange: w2,
                          "aria-hidden": "true",
                          tabIndex: -1,
                          className: "kat:h-100"
                        }),
                        (0, d.jsx)("span", {
                          className: "kat:text-white kat:text-sm kat:font-medium kat:select-none kat:mt-5 kat:w-full kat:tabular-nums kat:text-center",
                          "data-testid": "volume-slider-percentage",
                          children: m2 ? `${Math.round(g2)} BOOST` : Math.round(g2)
                        })
                      ]
                    }),
                    (0, d.jsx)(ih, {
                      className: (0, tG.default)("volume-icon", "kat:h-44 kat:w-44 kat:@lg:h-64 kat:@lg:w-64 kat:flex kat:items-center kat:justify-center kat:rounded-full kat:border-transparent kat:border-4 kat:p-6 kat:hover:bg-neutral-700 kat:transition-opacity kat:duration-200 kat:ease-linear kat:hover:opacity-100 kat:focus:opacity-100 kat:active:fill-white kat:active:text-white kat:focus:border-neutral-50 kat:focus:border-solid kat:cursor-pointer kat:text-white kat:fill-white kat:opacity-100 kat:hover:text-white kat:focus-visible:text-white"),
                      isMuted: i10,
                      volumeTier: v2
                    })
                  ]
                });
              });
              aV.displayName = "VolumeSliderContainer";
              var aH = () => {
                let {
                  toggleMute: t10,
                  isMuted: i10,
                  volumePercent: a10,
                  incrementVolume: r10,
                  incrementBoostVolume: s10,
                  decrementVolume: n10,
                  setVolumePercent: o10
                } = aD(), { t: l2 } = iy();
                i1({ shortcut: tK.Mute, handleShortcut: t10 }), i1({ shortcut: tK.VolUp, handleShortcut: r10, target: "containerOnly" }), i1({ shortcut: tK.VolDown, handleShortcut: n10, target: "containerOnly" });
                let u2 = a10 ?? 0, c2 = i10 ? l2("muted") : `${u2}%`;
                return (0, d.jsx)(aV, {
                  className: "kat:relative",
                  volumePercent: u2,
                  isMuted: i10,
                  onIconClick: t10,
                  label: l2("volume"),
                  onVolumeChange: o10,
                  onBoostIncrement: s10,
                  onVolumeDecrement: n10,
                  "aria-valuemin": 0,
                  "aria-valuemax": u2 > 100 ? 200 : 100,
                  "aria-valuenow": u2,
                  "aria-valuetext": c2
                });
              }, aU = ({ isVisible: t10, children: i10, className: a10 = "", "data-testid": r10 }) => {
                let s10 = "kat:transition-opacity";
                return (0, d.jsx)("div", {
                  className: a10 ? `${s10} ${a10}` : s10,
                  style: { opacity: +!!t10, transitionDuration: "200ms", transitionTimingFunction: "ease", pointerEvents: t10 ? "auto" : "none" },
                  "data-overlay-visible": t10,
                  "data-testid": r10,
                  children: i10
                });
              }, aF = (t10) => (0, d.jsx)(aU, { "data-testid": "top-controls-autohide", ...t10 }), a$ = (t10) => (0, d.jsx)(aU, { "data-testid": "bottom-controls-autohide", ...t10 }), aB = ({ children: t10, ...i10 }) => {
                let {
                  viewModelContainer: { playPauseButtonVM: a10 }
                } = im(), r10 = (0, h.useRef)(null);
                return (0, d.jsx)("div", {
                  ref: r10,
                  onClick: (0, h.useCallback)((t11) => {
                    r10.current !== null && r10.current.contains(t11.target) && t11.defaultPrevented === false && a10.togglePlayPause();
                  }, [a10]),
                  ...i10,
                  children: (0, d.jsx)(iR.Provider, { value: r10, children: t10 })
                });
              }, aq = () => {
                let {
                  viewModelContainer: { ratingsAdvisoriesVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(undefined), [r10, s10] = (0, h.useState)(false), n10 = (0, h.useRef)(0), o10 = (0, h.useRef)(undefined);
                (0, h.useEffect)(() => {
                  let i11 = t10.ratingsAdvisories$.subscribe((t11) => {
                    a10(t11);
                  });
                  return () => i11.unsubscribe();
                }, [t10]), (0, h.useEffect)(() => {
                  i10 && !i10.isReady && (n10.current = 0, s10(false));
                }, [i10?.isReady]);
                let l2 = (0, h.useCallback)(() => {
                  o10.current !== undefined && (clearInterval(o10.current), o10.current = undefined);
                }, []);
                (0, h.useEffect)(() => (i10?.isReady !== true || r10 ? l2() : o10.current = setInterval(() => {
                  n10.current += 100, n10.current >= 5000 && (l2(), s10(true));
                }, 100), l2), [i10?.isReady, r10, l2]);
                let d2 = i10?.ratingDisplayName !== undefined && i10?.ratingSystem !== undefined;
                return {
                  ratingDisplayName: i10?.ratingDisplayName,
                  ratingSystem: i10?.ratingSystem,
                  advisoryComponents: i10?.advisoryComponents ?? [],
                  advisoryComponentImages: i10?.advisoryComponentImages ?? [],
                  primaryHeading: i10?.primaryHeading,
                  secondaryHeading: i10?.secondaryHeading,
                  isActive: d2 && i10?.isReady === true && !r10,
                  isReady: i10?.isReady === true
                };
              }, aK = {
                L: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=False, Rating=L",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#00A651" }),
                          (0, d.jsx)("path", {
                            id: "L",
                            fillRule: "evenodd",
                            clipRule: "evenodd",
                            d: "M23.6706 19.3121C26.5534 19.2721 29.4559 19.3121 32.3386 19.2921C32.4187 27.7394 32.3586 36.2066 32.3586 44.6538C37.0028 44.6738 41.6472 44.6139 46.3114 44.6738C46.3715 46.6756 46.3314 48.6974 46.3314 50.6991C38.7845 50.7191 31.2375 50.6991 23.6706 50.6991C23.6506 40.2701 23.6506 29.8011 23.6706 19.3121Z",
                            fill: "white"
                          })
                        ]
                      })
                    ]
                  })
                }),
                10: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=False, Rating=10",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#0095DA" }),
                          (0, d.jsxs)("g", {
                            id: 10,
                            children: [
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M45.1693 44.6082C45.1693 46.3298 45.0291 47.4908 44.769 48.0912C44.4887 48.6917 44.0283 48.992 43.3877 48.992C42.7071 48.992 42.2466 48.7317 41.9864 48.1913C41.7261 47.6508 41.606 46.4498 41.606 44.6082V25.3516C41.606 23.6702 41.7462 22.5092 42.0063 21.8887C42.2866 21.2681 42.747 20.9479 43.4076 20.9479C44.0682 20.9479 44.5287 21.2281 44.789 21.8086C45.0493 22.3692 45.1693 23.5501 45.1693 25.3316V44.6082ZM50.394 19.0462C49.093 17.4249 46.7508 16.6041 43.3877 16.6041C40.0245 16.6041 37.6825 17.4249 36.3613 19.0462C35.0601 20.6676 34.3995 23.6503 34.3995 27.994V41.9459C34.3995 46.2896 35.0401 49.2922 36.3613 50.9336C37.6623 52.5751 40.0045 53.3959 43.3877 53.3959C46.7308 53.3959 49.0728 52.5751 50.394 50.9137C51.7153 49.2523 52.3759 46.2697 52.3759 41.9461V27.994C52.3759 23.6503 51.7354 20.6676 50.394 19.0462Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M20.7469 20.2273C19.9061 21.1482 18.8452 21.9488 17.624 22.6494V29.0349C18.4648 28.7347 19.2255 28.3543 19.9261 27.9138C20.6268 27.4534 21.2674 26.933 21.8679 26.3126V52.7552H28.7542V17.1646H22.7087C22.2483 18.2856 21.6076 19.3066 20.7469 20.2273Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                12: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=False, Rating=12",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#FBC115" }),
                          (0, d.jsxs)("g", {
                            id: 12,
                            children: [
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M52.0256 26.5628V27.0832C52.0256 28.7246 51.7853 30.2659 51.3049 31.6872C50.8245 33.1083 50.0038 34.6297 48.8626 36.2711L40.8353 47.6608H52.6261V53.0655H33.5486V46.4399L41.8562 34.3295C42.8171 32.9483 43.5578 31.6471 44.0584 30.4062C44.5588 29.1651 44.8191 28.064 44.8191 27.1033V25.6621C44.8191 23.8804 44.6988 22.6994 44.4387 22.1389C44.1784 21.5584 43.718 21.2783 43.0374 21.2783C42.3968 21.2783 41.9563 21.5786 41.696 22.1791C41.4359 22.7795 41.3157 23.9405 41.3157 25.6621V27.1033H34.1091V26.5828C34.1091 22.9397 34.7697 20.4176 36.071 19.0362C37.3922 17.6351 39.7344 16.9346 43.0973 16.9346C46.4605 16.9346 48.7827 17.6152 50.0837 18.9963C51.385 20.3575 52.0256 22.8796 52.0256 26.5628Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M22.4784 17.495H28.504V53.0656H21.6177V26.6028C21.0172 27.2233 20.3766 27.7439 19.6758 28.2041C18.9753 28.6446 18.2146 29.0249 17.3738 29.3252V22.9396C18.5949 22.2391 19.6558 21.4384 20.4966 20.5175C21.3774 19.6168 22.018 18.5959 22.4784 17.495Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                14: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=False, Rating=14",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#F58220" }),
                          (0, d.jsxs)("g", {
                            id: 14,
                            children: [
                              (0, d.jsx)("path", {
                                d: "M27.8334 17.2448H21.8079C21.3674 18.3456 20.7068 19.3666 19.866 20.2873C19.0052 21.2082 17.9643 22.0088 16.7432 22.7094V29.0749C17.564 28.7747 18.3247 28.3943 19.0252 27.9539C19.726 27.4936 20.3666 26.9731 20.9671 26.3526V52.7553H27.8334V17.2448Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M48.9726 17.2449H39.2435L32.5975 38.9034V44.9687H42.2263V52.7554H48.9726V44.9687H53.2564V39.6641H48.9726V17.2449ZM37.8424 39.6641L42.4065 22.4093H42.847L42.4464 39.6641H37.8424Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                16: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=False, Rating=16",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#EC1D25" }),
                          (0, d.jsxs)("g", {
                            id: 16,
                            children: [
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M52.256 25.742V25.3617C52.256 22.0387 51.6154 19.7568 50.3343 18.5157C49.073 17.2746 46.771 16.6542 43.428 16.6542C40.1048 16.6542 37.8028 17.4748 36.5015 19.0962C35.2003 20.7177 34.5397 23.7003 34.5397 28.0239V41.936C34.5397 46.2796 35.2003 49.2622 36.5015 50.9036C37.8028 52.525 40.1048 53.3457 43.428 53.3457C46.731 53.3457 49.0331 52.525 50.3343 50.8836C51.6355 49.2422 52.2961 46.2596 52.2961 41.936V38.0926C52.2961 35.3101 51.8357 33.2684 50.9148 32.0073C49.9939 30.7462 48.5327 30.1058 46.5509 30.1058C45.5299 30.1058 44.609 30.306 43.8283 30.7063C43.0477 31.1066 42.3269 31.7271 41.7063 32.5479V25.3617C41.7063 23.7003 41.8465 22.5393 42.0866 21.9186C42.3469 21.2982 42.7874 20.9778 43.4078 20.9778C44.0285 20.9778 44.469 21.258 44.7091 21.7986C44.9494 22.3591 45.0694 23.5401 45.0694 25.3617V25.742H52.256ZM44.7091 36.0908C44.9494 36.6513 45.0694 37.8323 45.0694 39.6539V44.5782C45.0694 46.2997 44.9294 47.4605 44.6891 48.0612C44.4288 48.6617 44.0085 48.9619 43.3879 48.9619C42.7472 48.9619 42.307 48.6816 42.0666 48.1411C41.8265 47.5808 41.7063 46.3998 41.7063 44.5782V39.6539C41.7063 37.9725 41.8465 36.8315 42.0866 36.2108C42.3469 35.5904 42.7874 35.2702 43.4078 35.2702C44.0285 35.2702 44.469 35.5504 44.7091 36.0908Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                d: "M28.7946 17.2347H22.7691C22.3086 18.3355 21.668 19.3565 20.8272 20.2772C19.9664 21.1981 18.9255 21.9987 17.7043 22.6993V29.0648C18.5252 28.7646 19.2858 28.3843 19.9864 27.9438C20.6872 27.4835 21.3278 26.963 21.9283 26.3425V52.7452H28.7946V17.2347Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                18: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=False, Rating=18",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "black" }),
                          (0, d.jsxs)("g", {
                            id: 18,
                            children: [
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M35.8207 31.6572C36.6615 32.8182 37.8225 33.6188 39.304 34.0391C37.7025 34.4996 36.4813 35.3404 35.6607 36.5613C34.8399 37.7824 34.4194 39.3438 34.4194 41.2453V44.5081C34.4194 47.5709 35.1002 49.7726 36.4813 51.1138C37.8627 52.455 40.1248 53.1356 43.2476 53.1356C46.3705 53.1356 48.6325 52.455 50.0339 51.0938C51.4552 49.7327 52.1557 47.5507 52.1557 44.5081V41.2453C52.1557 39.3637 51.7354 37.8024 50.8946 36.5813C50.0538 35.3404 48.8327 34.4996 47.2512 34.0391C48.7326 33.6188 49.8936 32.8382 50.7144 31.6772C51.5353 30.5162 51.9556 29.1149 51.9556 27.4936V25.4718C51.9556 22.4291 51.2949 20.2273 49.9338 18.8861C48.5926 17.545 46.3705 16.8644 43.3077 16.8644C40.2248 16.8644 37.9827 17.525 36.6216 18.8861C35.2402 20.2473 34.5597 22.4291 34.5597 25.4718V27.4936C34.5597 29.1149 34.98 30.4962 35.8207 31.6572ZM41.3659 44.4681V41.1052C41.3659 39.4238 41.5059 38.2828 41.8064 37.7023C42.0866 37.1218 42.587 36.8215 43.3077 36.8215C44.0283 36.8215 44.5087 37.1018 44.789 37.6421C45.0493 38.1827 45.1895 39.3437 45.1895 41.1052V44.4681C45.1895 46.1295 45.0493 47.2504 44.769 47.871C44.4887 48.4915 43.9883 48.7917 43.2876 48.7917C42.567 48.7917 42.0664 48.5115 41.7862 47.9711C41.5059 47.4306 41.3659 46.2496 41.3659 44.4681ZM41.5261 27.2533V25.4918C41.5261 23.7905 41.6461 22.6294 41.8865 22.0288C42.1465 21.4483 42.587 21.148 43.2276 21.148C43.8882 21.148 44.3285 21.4283 44.5888 21.9888C44.8491 22.5493 44.9691 23.7103 44.9691 25.4718V27.2333C44.9691 28.9548 44.8491 30.1158 44.6088 30.6963C44.3687 31.2769 43.9282 31.5771 43.2876 31.5771C42.627 31.5771 42.1665 31.3168 41.9064 30.7765C41.6461 30.2559 41.5261 29.0749 41.5261 27.2533Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                d: "M28.814 17.4449H22.8686C22.4281 18.5458 21.7877 19.5467 20.9267 20.4475C20.0859 21.3482 19.0651 22.1488 17.844 22.8296V29.135C18.6646 28.8548 19.4253 28.4744 20.1061 28.0339C20.8066 27.5937 21.4473 27.0531 22.0278 26.4526V52.5351H28.814V17.4449Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                AL: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=True, Rating=L",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#00A651" }),
                          (0, d.jsxs)("g", {
                            id: "AL",
                            children: [
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M36.1244 20.0371C38.8669 19.9971 40.3883 20.0371 43.1308 20.0171C43.2109 28.064 43.151 34.8499 43.151 42.8968C47.5749 42.9168 52.9398 42.8567 57.3639 42.9168C57.424 44.8385 57.3839 48.0412 57.3839 49.9629C50.1973 49.9829 43.311 49.9629 36.1244 49.9629C36.1244 40.0143 36.1045 30.0257 36.1244 20.0371Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M21.2507 39.2336L22.6321 26.923L24.0134 39.2336H21.2507ZM28.5376 20.0171H16.7265L12.6029 49.9829H20.8704L21.3308 44.4981H23.9333L24.3937 49.9829H32.6612L28.5376 20.0171Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                A10: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=True, Rating=10",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#0095DA" }),
                          (0, d.jsxs)("g", {
                            id: "A10",
                            children: [
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M63.7164 28.2441V41.6958C63.7164 45.8594 63.0757 48.7417 61.7947 50.3432C60.5134 51.9444 58.2713 52.7453 55.0484 52.7453C51.7853 52.7453 49.5232 51.9444 48.2621 50.3631C47.0011 48.7819 46.3604 45.8993 46.3604 41.6958V28.2441C46.3604 24.0606 47.0011 21.178 48.2621 19.6167C49.5232 18.0354 51.7853 17.2548 55.0484 17.2548C58.2913 17.2548 60.5334 18.0354 61.8146 19.6167C63.0757 21.198 63.7164 24.0606 63.7164 28.2441ZM56.7699 25.682C56.7699 23.9605 56.6499 22.8394 56.3896 22.2791C56.1495 21.7186 55.689 21.4583 55.0484 21.4583C54.4077 21.4583 53.9675 21.7585 53.7072 22.359C53.4469 22.9597 53.3268 24.0806 53.3268 25.682V44.2579C53.3268 46.0394 53.4469 47.1804 53.7072 47.701C53.9473 48.2213 54.4077 48.4816 55.0684 48.4816C55.689 48.4816 56.1293 48.1814 56.3896 47.6009C56.6499 47.0204 56.7699 45.8993 56.7699 44.2379V25.682Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M34.6697 17.595H40.6151V52.6652H33.8289V26.6028C33.2484 27.2033 32.6077 27.7236 31.9072 28.1841C31.2064 28.6445 30.4657 29.0049 29.6451 29.285V22.9997C30.8662 22.3191 31.887 21.5183 32.7278 20.6176C33.5686 19.6969 34.2292 18.6959 34.6697 17.595Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M16.3529 40.1344L17.9743 25.802L19.5958 40.1344H16.3529ZM24.8407 17.7551H11.088L6.28357 52.6651H15.9124L16.4529 46.2796H19.4957L20.0362 52.6651H29.6451L24.8407 17.7551Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                A12: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=True, Rating=12",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#FBC115" }),
                          (0, d.jsxs)("g", {
                            id: "A12",
                            children: [
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M63.6863 26.5726V27.093C63.6863 28.7344 63.446 30.2758 62.9656 31.6971C62.4852 33.1182 61.6646 34.6395 60.5233 36.281L52.496 47.6707H64.2868V53.0754H45.2094V46.4497L53.517 34.3393C54.4778 32.9582 55.2185 31.6569 55.7189 30.416C56.2195 29.1749 56.4798 28.0738 56.4798 27.1132V25.6719C56.4798 23.8903 56.3596 22.7093 56.0993 22.1488C55.8392 21.5683 55.3787 21.288 54.6982 21.288C54.0575 21.288 53.6171 21.5884 53.3568 22.1889C53.0967 22.7894 52.9764 23.9504 52.9764 25.6719V27.1132H45.7699V26.5726C45.7699 22.9294 46.4305 20.4072 47.7317 19.0261C49.0529 17.625 51.3951 16.9244 54.7581 16.9244C58.1212 16.9244 60.4434 17.605 61.7445 18.9862C63.0257 20.3873 63.6863 22.9094 63.6863 26.5726Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M34.3194 17.5048H40.3449V53.0755H33.4586V26.6327C32.8581 27.2533 32.2175 27.7737 31.5167 28.2341C30.8162 28.6744 30.0555 29.0547 29.2147 29.355V22.9695C30.4358 22.2689 31.4968 21.4683 32.3376 20.5474C33.2183 19.6267 33.8789 18.6259 34.3194 17.5048Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M10.6976 16.9443L5.71301 53.0755H15.6822L16.2428 46.4696H19.4056L19.9663 53.0755H29.9353L24.9307 16.9443H10.6976ZM17.8243 25.2715L19.5058 40.1243H16.1427L17.8243 25.2715Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                A14: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=True, Rating=14",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#F58220" }),
                          (0, d.jsxs)("g", {
                            id: "A14",
                            children: [
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M54.0773 22.2991L49.5132 39.534H54.1173L54.5178 22.2791H54.0773V22.2991ZM50.9143 17.1147H60.6434V39.534H64.9273V44.8384H60.6434V52.6252H53.8971V44.8384H44.2683V38.7733L50.9143 17.1147Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M33.6786 17.1146H39.7041V52.6251H32.8378V26.2225C32.2373 26.8429 31.5967 27.3635 30.8961 27.8237C30.1954 28.2642 29.4347 28.6446 28.6139 28.9448V22.5593C29.835 21.8587 30.8759 21.0581 31.7367 20.1372C32.5775 19.2365 33.2181 18.2357 33.6786 17.1146Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M9.9568 17.4749L5.07227 52.8853H14.8411L15.3817 46.4199H18.4646L19.0051 52.8853H28.774L23.9096 17.4749H9.9568ZM16.9232 25.6421L18.5646 40.1744H15.2816L16.9232 25.6421Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                A16: (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "A=True, Rating=16",
                    children: [
                      (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                      (0, d.jsxs)("g", {
                        id: "Content",
                        children: [
                          (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "#EC1D25" }),
                          (0, d.jsxs)("g", {
                            id: "A16",
                            children: [
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M57.4206 39.6539C57.4206 37.8323 57.3006 36.6513 57.0602 36.0908C56.8201 35.5504 56.3797 35.2702 55.759 35.2702C55.1386 35.2702 54.6981 35.5904 54.4378 36.2108C54.1977 36.8315 54.0575 37.9725 54.0575 39.6539V44.5782C54.0575 46.3998 54.1777 47.5808 54.4178 48.1411C54.6581 48.6817 55.0984 48.9619 55.739 48.9619C56.3597 48.9619 56.78 48.6617 57.0403 48.0612C57.2806 47.4605 57.4206 46.2997 57.4206 44.5782V39.6539ZM64.6272 25.3817V25.762H57.4406V25.3817C57.4406 23.5601 57.3205 22.3791 57.0802 21.8186C56.8401 21.2782 56.3997 20.998 55.7792 20.998C55.1585 20.998 54.7181 21.3182 54.458 21.9386C54.2177 22.5593 54.0776 23.7203 54.0776 25.3817V32.5678C54.6981 31.747 55.4188 31.1266 56.1995 30.7263C56.9802 30.3259 57.901 30.1258 58.922 30.1258C60.9038 30.1258 62.3651 30.7662 63.286 32.0273C64.2069 33.2884 64.6673 35.3301 64.6673 38.1126V41.936C64.6673 46.2596 64.0067 49.2422 62.7055 50.8836C61.4042 52.525 59.1022 53.3457 55.7992 53.3457C52.4762 53.3457 50.1739 52.525 48.8727 50.9036C47.5717 49.2622 46.9111 46.2796 46.9111 41.936V28.0239C46.9111 23.7003 47.5717 20.7177 48.8727 19.0962C50.1739 17.4748 52.4762 16.6542 55.7992 16.6542C59.1422 16.6542 61.4444 17.2746 62.7055 18.5157C63.9867 19.7568 64.6272 22.0387 64.6272 25.3817Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M35.1201 17.2347H41.1457V52.7452H34.2794V26.3425C33.6789 26.963 33.0382 27.4835 32.3375 27.9438C31.6369 28.3843 30.8762 28.7646 30.0554 29.0648V22.6993C31.2766 21.9987 32.3175 21.1981 33.1783 20.2772C34.0191 19.3565 34.6797 18.3557 35.1201 17.2347Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M10.2173 17.595L5.33276 53.0053H15.0816L15.6222 46.5398H18.7051L19.2456 53.0053H29.0145L24.1501 17.595H10.2173ZM17.1837 25.782L18.8251 40.3145H15.5421L17.1837 25.782Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                A18: (t10) => (0, d.jsxs)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" }),
                    (0, d.jsx)("rect", { x: 3, y: 3, width: 64, height: 64, rx: 3.31034, fill: "black" }),
                    (0, d.jsx)("path", {
                      fillRule: "evenodd",
                      clipRule: "evenodd",
                      d: "M51.0949 34.0391C49.6135 33.6188 48.4525 32.8182 47.6117 31.6572C46.7709 30.4962 46.3506 29.1149 46.3506 27.4936V25.4718C46.3506 22.4291 47.0312 20.2473 48.4123 18.8861C49.7737 17.525 52.0158 16.8644 55.0985 16.8644C58.1614 16.8644 60.3833 17.545 61.7247 18.8861C63.0859 20.2273 63.7465 22.4291 63.7465 25.4718V27.4936C63.7465 29.1149 63.3262 30.5162 62.5054 31.6772C61.6846 32.8382 60.5236 33.6188 59.0421 34.0391C60.6236 34.4996 61.8448 35.3404 62.6856 36.5813C63.5264 37.8024 63.9466 39.3637 63.9466 41.2453V44.5081C63.9466 47.5507 63.2461 49.7327 61.8248 51.0938C60.4235 52.455 58.1614 53.1356 55.0386 53.1356C51.9157 53.1356 49.6536 52.455 48.2723 51.1138C46.8909 49.7726 46.2104 47.5709 46.2104 44.5081V41.2453C46.2104 39.3438 46.6309 37.7824 47.4515 36.5613C48.2723 35.3404 49.4934 34.4996 51.0949 34.0391ZM53.1768 41.1052V44.4681C53.1768 46.2496 53.317 47.4306 53.5971 47.9711C53.8773 48.5115 54.3779 48.7917 55.0985 48.7917C55.7992 48.7917 56.2996 48.4915 56.5799 47.871C56.8602 47.2504 57.0004 46.1295 57.0004 44.4681V41.1052C57.0004 39.3437 56.8602 38.1827 56.5999 37.6421C56.3196 37.1018 55.8392 36.8215 55.1187 36.8215C54.3979 36.8215 53.8975 37.1218 53.6173 37.7023C53.3168 38.2828 53.1768 39.4238 53.1768 41.1052ZM53.3168 25.4918V27.2533C53.3168 29.0749 53.4371 30.2559 53.6972 30.7765C53.9574 31.3168 54.4179 31.5771 55.0785 31.5771C55.7191 31.5771 56.1596 31.2769 56.3997 30.6963C56.64 30.1158 56.7601 28.9548 56.7601 27.2333V25.4718C56.7601 23.7103 56.64 22.5493 56.3797 21.9888C56.1194 21.4283 55.6792 21.148 55.0186 21.148C54.3779 21.148 53.9375 21.4483 53.6772 22.0288C53.4371 22.6294 53.3168 23.7905 53.3168 25.4918Z",
                      fill: "white"
                    }),
                    (0, d.jsx)("path", {
                      d: "M34.8798 17.4449H40.8252V52.5351H34.039V26.4526C33.4585 27.0531 32.8178 27.5937 32.1173 28.0339C31.4365 28.4744 30.6758 28.8548 29.8552 29.135V22.8296C31.0763 22.1488 32.0971 21.3482 32.9379 20.4475C33.7989 19.5467 34.4393 18.5458 34.8798 17.4449Z",
                      fill: "white"
                    }),
                    (0, d.jsx)("path", {
                      fillRule: "evenodd",
                      clipRule: "evenodd",
                      d: "M24.8708 17.3449L29.7554 52.7353H19.9863L19.4458 46.2697H16.3631L15.8225 52.7353H6.05347L10.938 17.3449H24.8708ZM16.263 40.0444H19.5459L17.9044 25.5119L16.263 40.0444Z",
                      fill: "white"
                    })
                  ]
                })
              }, aZ = {
                G: (t10) => (0, d.jsxs)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsxs)("g", {
                      clipPath: "url(#clip0_2542_572)",
                      children: [
                        (0, d.jsx)("path", {
                          d: "M70 35C70 15.67 54.33 0 35 0C15.67 0 0 15.67 0 35C0 54.33 15.67 70 35 70C54.33 70 70 54.33 70 35Z",
                          fill: "#42C758"
                        }),
                        (0, d.jsx)("path", {
                          d: "M44.6699 47.5967L45.4224 51.4063H50.1256V33.2522H36.0162V38.7549H43.4471C43.2284 41.1064 42.4442 42.9089 41.0956 44.1635C39.7787 45.3863 37.8974 45.9977 35.4518 45.9977C33.7893 45.9977 32.3784 45.6838 31.219 45.0571C30.0895 44.4267 29.1231 43.5409 28.3971 42.4703C27.6645 41.3786 27.1237 40.1698 26.7981 38.896C26.4836 37.5389 26.3258 36.1502 26.3278 34.7572C26.3278 33.2839 26.4842 31.8566 26.7981 30.4774C27.1426 29.0982 27.6763 27.8742 28.3971 26.8089C29.1055 25.7233 30.076 24.8337 31.219 24.2222C32.3784 23.5638 33.7893 23.2346 35.4518 23.2346C37.239 23.2346 38.7593 23.7049 40.0138 24.6455C41.2684 25.5861 42.1138 26.9971 42.5535 28.8783H49.6082C49.4201 26.9653 48.9028 25.2722 48.0562 23.7989C47.2354 22.3548 46.1316 21.0911 44.811 20.0835C43.5039 19.069 42.0213 18.3037 40.4371 17.826C38.8295 17.2916 37.1459 17.0216 35.4518 17.0264C32.8815 17.0264 30.5606 17.4814 28.4912 18.3903C26.4535 19.2992 24.7287 20.5538 23.3178 22.1528C21.9068 23.7519 20.8251 25.6332 20.0726 27.7966C19.3201 29.9294 18.9438 32.2481 18.9438 34.7572C18.9438 37.2028 19.3201 39.4921 20.0726 41.6238C20.8251 43.7238 21.9068 45.5591 23.3178 47.1264C24.7287 48.6938 26.4535 49.933 28.4912 50.8419C30.5606 51.7202 32.8804 52.1588 35.4518 52.1588C37.0815 52.1588 38.697 51.8296 40.296 51.1711C41.8951 50.4821 43.3531 49.2899 44.6699 47.5967Z",
                          fill: "black"
                        })
                      ]
                    }),
                    (0, d.jsx)("defs", {
                      children: (0, d.jsx)("clipPath", {
                        id: "clip0_2542_572",
                        children: (0, d.jsx)("rect", { width: 70, height: 70, fill: "white" })
                      })
                    })
                  ]
                }),
                PG: (t10) => (0, d.jsxs)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsxs)("g", {
                      clipPath: "url(#clip0_2542_565)",
                      children: [
                        (0, d.jsx)("path", {
                          d: "M70 35C70 15.67 54.33 0 35 0C15.67 0 0 15.67 0 35C0 54.33 15.67 70 35 70C54.33 70 70 54.33 70 35Z",
                          fill: "#FFEF00"
                        }),
                        (0, d.jsx)("path", {
                          d: "M17.813 34.0682V26.11H22.3499C23.0193 26.11 23.6635 26.1592 24.2837 26.2588C24.9027 26.3572 25.4485 26.5563 25.9199 26.8538C26.3902 27.1272 26.7621 27.5232 27.0355 28.0438C27.333 28.5644 27.4818 29.2469 27.4818 30.0891C27.4818 30.9313 27.333 31.6138 27.0355 32.1344C26.7621 32.655 26.3902 33.0641 25.9199 33.3616C25.4496 33.635 24.9027 33.821 24.2837 33.9194C23.6635 34.0178 23.0193 34.0682 22.3499 34.0682H17.813ZM11.9746 21.5732V48.125H17.813V38.605H23.949C25.6093 38.605 27.0224 38.3699 28.1884 37.8985C29.3532 37.403 30.2949 36.7577 31.0146 35.9647C31.746 35.1924 32.2928 34.2642 32.6137 33.25C32.9571 32.2315 33.1329 31.164 33.1343 30.0891C33.1369 29.0139 32.961 27.9457 32.6137 26.9282C32.2928 25.914 31.746 24.9858 31.0146 24.2135C30.2949 23.4205 29.3532 22.7883 28.1884 22.3169C27.0224 21.8214 25.6093 21.5732 23.949 21.5732H11.9746ZM55.2226 45.1128L55.8176 48.125H59.5363V33.7707H48.3801V38.1216H54.2568C54.0818 39.981 53.4627 41.4061 52.3974 42.3982C51.3551 43.365 49.8676 43.8485 47.9349 43.8485C46.6202 43.8485 45.5046 43.6002 44.588 43.1047C43.6949 42.6063 42.9308 41.9059 42.3568 41.0594C41.7771 40.1963 41.3491 39.2404 41.0913 38.2332C40.8426 37.1601 40.7178 36.0621 40.7195 34.9607C40.7195 33.7958 40.8441 32.6671 41.0913 31.5766C41.3648 30.4861 41.7859 29.5192 42.3557 28.676C42.9158 27.8175 43.6831 27.1141 44.587 26.6307C45.5057 26.11 46.6213 25.8497 47.9338 25.8497C49.347 25.8497 50.5501 26.2216 51.541 26.9653C52.5331 27.7091 53.2035 28.8247 53.5502 30.3122H59.1284C58.9785 28.7996 58.5705 27.4608 57.9001 26.296C57.2514 25.1542 56.379 24.155 55.3352 23.3582C54.3013 22.5559 53.1286 21.9509 51.8757 21.5732C50.6046 21.1506 49.2733 20.9371 47.9338 20.941C45.9016 20.941 44.0663 21.3008 42.4301 22.0194C40.819 22.738 39.4551 23.73 38.3395 24.9944C37.2238 26.2588 36.3696 27.7463 35.7746 29.4569C35.1796 31.1424 34.8821 32.9777 34.8821 34.9607C34.8821 36.8944 35.1785 38.7046 35.7746 40.39C36.3696 42.0514 37.2238 43.5017 38.3405 44.741C39.4562 45.9802 40.819 46.9602 42.4312 47.6788C44.0663 48.3733 45.9016 48.72 47.9349 48.72C49.2507 48.7147 50.5524 48.4493 51.7652 47.9391C53.0285 47.3933 54.1824 46.4516 55.2226 45.1128Z",
                          fill: "black"
                        })
                      ]
                    }),
                    (0, d.jsx)("defs", {
                      children: (0, d.jsx)("clipPath", {
                        id: "clip0_2542_565",
                        children: (0, d.jsx)("rect", { width: 70, height: 70, fill: "white" })
                      })
                    })
                  ]
                }),
                M: (t10) => (0, d.jsxs)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsxs)("g", {
                      clipPath: "url(#clip0_2542_569)",
                      children: [
                        (0, d.jsx)("path", {
                          d: "M70 35C70 15.67 54.33 0 35 0C15.67 0 0 15.67 0 35C0 54.33 15.67 70 35 70C54.33 70 70 54.33 70 35Z",
                          fill: "#FFEF00"
                        }),
                        (0, d.jsx)("path", {
                          d: "M18.2983 19.3878V51.4063H24.8915V28.9395H24.9812L32.8288 51.4063H38.2538L46.1026 28.7153H46.1922V51.4063H52.7843V19.3878H42.8738L35.7874 41.4061H35.6977L28.2088 19.3878H18.2983Z",
                          fill: "black"
                        })
                      ]
                    }),
                    (0, d.jsx)("defs", {
                      children: (0, d.jsx)("clipPath", {
                        id: "clip0_2542_569",
                        children: (0, d.jsx)("rect", { width: 70, height: 70, fill: "white" })
                      })
                    })
                  ]
                }),
                13: (t10) => (0, d.jsxs)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsxs)("g", {
                      clipPath: "url(#clip0_2542_577)",
                      children: [
                        (0, d.jsx)("path", { d: "M70 70V0H3.76089e-05C3.76089e-05 22.6042 0.000868018 47.3958 0 70H70Z", fill: "#F03936" }),
                        (0, d.jsx)("path", {
                          d: "M27.649 51.4063V17.7188H22.2108C22.0183 19.0018 21.6169 20.0769 21.0077 20.9432C20.4094 21.7988 19.639 22.52 18.7458 23.0607C17.8796 23.5747 16.8843 23.9433 15.7621 24.1675C14.6705 24.36 13.5319 24.441 12.3452 24.4082V29.5575H20.8152V51.4063H27.649ZM42.1663 31.3382V36.1507C43.0008 36.1507 43.8671 36.1835 44.7651 36.2469C45.6947 36.2797 46.5457 36.4547 47.3157 36.7763C48.0735 37.0557 48.7281 37.5593 49.1926 38.22C49.7066 38.8938 49.9626 39.8716 49.9626 41.1557C49.9626 42.7919 49.4332 44.0913 48.3744 45.0538C47.3157 45.9835 46.0163 46.4494 44.4763 46.4494C43.481 46.4494 42.6158 46.2733 41.8776 45.92C41.1932 45.584 40.5867 45.1086 40.0969 44.5244C39.6032 43.8911 39.2282 43.1738 38.9901 42.4069C38.7318 41.5635 38.5862 40.6897 38.5569 39.8082H32.0601C32.0272 41.766 32.3007 43.4974 32.8782 45.0057C33.4874 46.5139 34.3383 47.7969 35.4288 48.8557C36.5193 49.8827 37.8351 50.668 39.3751 51.2138C40.9468 51.7596 42.6793 52.0319 44.5726 52.0319C46.2088 52.0319 47.7805 51.7913 49.2888 51.31C50.7971 50.8288 52.1282 50.1233 53.2832 49.1925C54.4434 48.2555 55.3805 47.0719 56.0263 45.7275C56.7318 44.3483 57.0851 42.7755 57.0851 41.0113C57.0851 39.0863 56.5557 37.4347 55.4969 36.0544C54.4382 34.6752 52.978 33.7761 51.1176 33.3594V33.2632C52.6893 32.8147 53.8607 31.9638 54.6307 30.7125C55.4324 29.4613 55.8338 28.0175 55.8338 26.3813C55.8338 24.873 55.4969 23.5419 54.8232 22.3869C54.1532 21.236 53.2519 20.2365 52.1763 19.4513C51.0947 18.6379 49.8706 18.034 48.5669 17.6707C47.2586 17.2597 45.8958 17.0487 44.5244 17.045C42.7919 17.045 41.2202 17.3338 39.8082 17.9113C38.4365 18.4309 37.1901 19.2345 36.1507 20.2694C35.1554 21.2965 34.3701 22.5313 33.7926 23.975C33.2468 25.386 32.9427 26.9588 32.8782 28.6913H39.3751C39.3422 26.9588 39.7601 25.5304 40.6263 24.4082C41.5243 23.2532 42.8401 22.6757 44.5726 22.6757C45.8238 22.6757 46.9307 23.0607 47.8932 23.8307C48.8557 24.6007 49.3369 25.7075 49.3369 27.1513C49.3369 28.1138 49.0963 28.8838 48.6151 29.4613C48.1666 30.0388 47.5727 30.4883 46.8344 30.8088C46.0968 31.1049 45.3174 31.2835 44.5244 31.3382C43.6899 31.4027 42.9046 31.4027 42.1663 31.3382Z",
                          fill: "black"
                        })
                      ]
                    }),
                    (0, d.jsx)("defs", {
                      children: (0, d.jsx)("clipPath", {
                        id: "clip0_2542_577",
                        children: (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" })
                      })
                    })
                  ]
                }),
                16: (t10) => (0, d.jsxs)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsxs)("g", {
                      clipPath: "url(#clip0_2542_548)",
                      children: [
                        (0, d.jsx)("path", { d: "M70 70V0H3.76089e-05C3.76089e-05 22.6042 0.000868018 47.3958 0 70H70Z", fill: "#F03936" }),
                        (0, d.jsx)("path", {
                          d: "M27.649 51.4063V17.7188H22.2108C22.0183 19.0018 21.6169 20.0769 21.0077 20.9432C20.4094 21.7988 19.639 22.52 18.7458 23.0607C17.8796 23.5747 16.8843 23.9433 15.7621 24.1675C14.6705 24.36 13.5319 24.441 12.3452 24.4082V29.5575H20.8152V51.4063H27.649ZM44.9576 33.9369C45.8238 33.9369 46.5774 34.1294 47.2194 34.5144C47.8762 34.8524 48.4386 35.3486 48.8557 35.9582C49.2724 36.5357 49.5776 37.2094 49.7701 37.9794C49.9943 38.7177 50.1069 39.4877 50.1069 40.2894C50.1069 41.0594 49.9943 41.813 49.7701 42.5513C49.5576 43.2656 49.215 43.9346 48.7594 44.5244C48.311 45.1019 47.7641 45.5668 47.1232 45.92C46.514 46.2733 45.7921 46.4494 44.9576 46.4494C44.0913 46.4494 43.3213 46.2733 42.6476 45.92C41.9831 45.5746 41.3941 45.1001 40.9151 44.5244C40.4622 43.9079 40.1053 43.2265 39.8563 42.5032C39.6346 41.7531 39.5212 40.9753 39.5194 40.1932C39.5194 39.3586 39.6321 38.5733 39.8563 37.835C40.0805 37.065 40.4174 36.3913 40.8669 35.8138C41.3141 35.2379 41.8913 34.7761 42.5513 34.4663C43.2568 34.113 44.0596 33.9369 44.9576 33.9369ZM49.8663 26.3813H56.3632C56.1707 24.873 55.7693 23.5419 55.1601 22.3869C54.5827 21.2713 53.7797 20.288 52.8019 19.4994C51.8199 18.6865 50.6933 18.0661 49.4813 17.6707C48.2301 17.254 46.8826 17.045 45.4388 17.045C43.0326 17.045 40.9949 17.5744 39.3269 18.6332C37.6665 19.6839 36.2676 21.0994 35.2363 22.7719C34.1776 24.4399 33.4076 26.3168 32.9263 28.4025C32.449 30.4538 32.2068 32.5527 32.2044 34.6588C32.2044 36.808 32.3969 38.9255 32.7819 41.0113C33.1669 43.0643 33.8571 44.9094 34.8513 46.5457C35.8426 48.1786 37.2127 49.5488 38.8457 50.54C40.5137 51.5354 42.6158 52.0319 45.1501 52.0319C46.9143 52.0319 48.5188 51.7268 49.9626 51.1175C51.4063 50.4755 52.6423 49.6093 53.6682 48.5188C54.7266 47.3963 55.5454 46.07 56.0744 44.6207C56.6519 43.1124 56.9407 41.4925 56.9407 39.76C56.9407 38.4125 56.7329 37.0804 56.3151 35.7657C55.9091 34.47 55.237 33.2735 54.3419 32.2525C53.3794 31.1938 52.2091 30.3604 50.8288 29.75C49.4496 29.108 48.0376 28.7875 46.5938 28.7875C44.9576 28.7875 43.5138 29.0763 42.2626 29.6538C41.0113 30.2313 39.9208 31.1938 38.9901 32.5413L38.8938 32.445C38.9266 31.5154 39.0546 30.4555 39.2788 29.2688C39.4906 28.1218 39.8463 27.0061 40.3376 25.9482C40.8188 24.8894 41.4608 24.0068 42.2626 23.3013C43.0971 22.563 44.123 22.1944 45.3426 22.1944C46.5293 22.1944 47.5246 22.6111 48.3263 23.4457C49.1145 24.2534 49.6497 25.2737 49.8663 26.3813Z",
                          fill: "black"
                        })
                      ]
                    }),
                    (0, d.jsx)("defs", {
                      children: (0, d.jsx)("clipPath", {
                        id: "clip0_2542_548",
                        children: (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" })
                      })
                    })
                  ]
                }),
                18: (t10) => (0, d.jsxs)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsxs)("g", {
                      clipPath: "url(#clip0_2575_691)",
                      children: [
                        (0, d.jsx)("path", { d: "M70 70V0H3.76089e-05C3.76089e-05 22.6042 0.000868018 47.3958 0 70H70Z", fill: "#F03936" }),
                        (0, d.jsx)("path", {
                          d: "M27.649 51.4063V17.7188H22.2108C22.0183 19.0018 21.6169 20.0769 21.0077 20.9432C20.4094 21.7988 19.639 22.52 18.7458 23.0607C17.8796 23.5747 16.8843 23.9433 15.7621 24.1675C14.6705 24.36 13.5319 24.441 12.3452 24.4082V29.5575H20.8152V51.4063H27.649ZM39.4713 26.8625C39.4713 26.0925 39.5993 25.4188 39.8563 24.8413C40.131 24.2813 40.5253 23.7885 41.0113 23.3975C41.4926 23.0125 42.0383 22.7238 42.6476 22.5313C43.2814 22.3081 43.9486 22.1941 44.6207 22.1944C45.6794 22.1944 46.5293 22.3552 47.1713 22.6757C47.8451 22.9961 48.358 23.3975 48.7113 23.8788C49.0963 24.36 49.3533 24.8741 49.4813 25.4188C49.6093 25.9329 49.6738 26.4141 49.6738 26.8625C49.6738 28.3063 49.1926 29.4132 48.2301 30.1832C47.2676 30.9215 46.0644 31.29 44.6207 31.29C43.2415 31.29 42.0383 30.9215 41.0113 30.1832C39.9843 29.4132 39.4713 28.3063 39.4713 26.8625ZM33.2632 26.2369C33.2632 27.9049 33.6799 29.365 34.5144 30.6163C35.349 31.8675 36.5838 32.7174 38.2201 33.1669V33.2632C36.1988 33.7444 34.6271 34.7069 33.5038 36.1507C32.4133 37.5944 31.8676 39.3915 31.8676 41.5407C31.8676 43.3694 32.2208 44.9422 32.9263 46.2569C33.6397 47.5445 34.625 48.6613 35.8138 49.5294C37.0492 50.4032 38.4364 51.0396 39.9044 51.4063C41.4578 51.8251 43.06 52.0355 44.6688 52.0319C46.2405 52.0319 47.7805 51.8241 49.2888 51.4063C50.7971 50.9579 52.1435 50.2994 53.3313 49.4332C54.514 48.5721 55.485 47.4529 56.1707 46.1607C56.909 44.8449 57.2776 43.2896 57.2776 41.4925C57.2776 39.375 56.7318 37.5944 55.6413 36.1507C54.5508 34.6741 52.9944 33.7116 50.9732 33.2632V33.1669C52.6094 32.6211 53.8279 31.7232 54.6307 30.4719C55.4652 29.2207 55.8819 27.7605 55.8819 26.0925C55.8819 25.258 55.6894 24.3283 55.3044 23.3013C54.9194 22.2425 54.2774 21.2636 53.3794 20.3657C52.5132 19.436 51.3582 18.6485 49.9144 18.0075C48.4707 17.3655 46.7065 17.045 44.6207 17.045C43.2415 17.045 41.8776 17.2375 40.5301 17.6225C39.2217 17.989 37.9849 18.5748 36.8726 19.355C35.8138 20.1251 34.9284 21.1088 34.2738 22.2425C33.6001 23.3975 33.2632 24.7286 33.2632 26.2369ZM38.7013 41.2038C38.7013 39.4713 39.2788 38.1555 40.4338 37.2575C41.5888 36.3279 43.0008 35.8619 44.6688 35.8619C45.4241 35.8536 46.1744 35.9841 46.8826 36.2469C47.5613 36.4872 48.1837 36.8639 48.7113 37.3538C49.2571 37.835 49.6738 38.4125 49.9626 39.0863C50.283 39.7283 50.4438 40.4502 50.4438 41.2519C50.4438 42.0865 50.2994 42.8564 50.0107 43.5619C49.7308 44.2548 49.3039 44.8788 48.7594 45.3907C48.2454 45.8719 47.6362 46.2569 46.9307 46.5457C46.2569 46.8027 45.5033 46.9307 44.6688 46.9307C43.8826 46.9333 43.1016 46.8032 42.3588 46.5457C41.6542 46.277 41.0025 45.886 40.4338 45.3907C39.9097 44.8617 39.4858 44.2421 39.1826 43.5619C38.8621 42.8564 38.7013 42.07 38.7013 41.2038Z",
                          fill: "black"
                        })
                      ]
                    }),
                    (0, d.jsx)("defs", {
                      children: (0, d.jsx)("clipPath", {
                        id: "clip0_2575_691",
                        children: (0, d.jsx)("rect", { width: 70, height: 70, rx: 4, fill: "white" })
                      })
                    })
                  ]
                })
              }, az = {
                ALL: (t10) => (0, d.jsxs)("svg", {
                  width: 90,
                  height: 70,
                  viewBox: "0 0 90 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M9.5822 7.5068C9.82329 6.06024 11.0749 5 12.5414 5L86.4586 5C88.3124 5 89.7226 6.6646 89.4178 8.4932L80.4178 62.4932C80.1767 63.9398 78.9251 65 77.4586 65H3.54138C1.68757 65 0.277434 63.3354 0.5822 61.5068L9.5822 7.5068Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M19.9349 46H15.5756L27.2556 23.4545H32.2975L36.5028 46H32.1434L29.116 28.0781H28.9399L19.9349 46ZM21.5422 37.1601H33.4314L32.881 40.4407H20.9918L21.5422 37.1601Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", { d: "M39.4723 46L43.2152 23.4545H47.2994L44.1289 42.5763H54.0586L53.4862 46H39.4723Z", fill: "#DADADA" }),
                    (0, d.jsx)("path", { d: "M57.0309 46L60.7738 23.4545H64.858L61.6875 42.5763H71.6172L71.0448 46H57.0309Z", fill: "#DADADA" })
                  ]
                }),
                PG: (t10) => (0, d.jsxs)("svg", {
                  width: 90,
                  height: 70,
                  viewBox: "0 0 90 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M9.5822 7.5068C9.82329 6.06024 11.0749 5 12.5414 5L86.4586 5C88.3124 5 89.7226 6.6646 89.4178 8.4932L80.4178 62.4932C80.1767 63.9398 78.9251 65 77.4586 65H3.54138C1.68757 65 0.277434 63.3354 0.5822 61.5068L9.5822 7.5068Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M24.1539 46L27.8968 23.4545H36.3514C38.0834 23.4545 39.4851 23.7775 40.5566 24.4233C41.6281 25.0618 42.373 25.9461 42.7914 27.0763C43.2097 28.1992 43.2978 29.4799 43.0556 30.9183C42.8207 32.3641 42.3033 33.6484 41.5034 34.7713C40.7107 35.8942 39.6649 36.7785 38.3659 37.4244C37.0669 38.0628 35.5478 38.3821 33.8084 38.3821H28.2051L28.7665 35.0245H33.8194C34.8322 35.0245 35.6909 34.8484 36.3954 34.4961C37.1073 34.1438 37.6687 33.6594 38.0797 33.043C38.4907 32.4265 38.7622 31.7183 38.8943 30.9183C39.0191 30.1184 38.9787 29.4138 38.7732 28.8047C38.5678 28.1955 38.1678 27.7222 37.5733 27.3846C36.9862 27.0396 36.1826 26.8672 35.1625 26.8672H31.4196L28.2381 46H24.1539Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M61.7095 30.6541C61.6288 30.0597 61.482 29.5276 61.2692 29.0579C61.0563 28.5808 60.7701 28.1772 60.4105 27.8469C60.0509 27.5093 59.6142 27.2525 59.1005 27.0763C58.5868 26.9002 57.9886 26.8121 57.3061 26.8121C56.0952 26.8121 54.9466 27.1167 53.8604 27.7258C52.7743 28.335 51.8459 29.2303 51.0753 30.4119C50.3047 31.5862 49.7799 33.0173 49.5011 34.7053C49.2222 36.4079 49.2368 37.85 49.5451 39.0316C49.8533 40.2132 50.4184 41.1122 51.2404 41.7287C52.0697 42.3378 53.1119 42.6424 54.3668 42.6424C55.519 42.6424 56.5649 42.4222 57.5042 41.9819C58.4436 41.5415 59.2216 40.9177 59.8381 40.1104C60.4619 39.2958 60.8582 38.3417 61.027 37.2482L61.9297 37.3913H55.7979L56.3484 34.1989H65.4964L65.0341 36.907C64.7185 38.8445 64.0323 40.5177 62.9755 41.9268C61.926 43.3286 60.616 44.4111 59.0454 45.1744C57.4822 45.9303 55.7686 46.3082 53.9045 46.3082C51.8349 46.3082 50.0918 45.8422 48.6754 44.9102C47.2663 43.9708 46.2682 42.6387 45.6811 40.9141C45.094 39.1821 44.9986 37.1271 45.3949 34.7493C45.6884 32.9292 46.2095 31.3036 46.9581 29.8725C47.714 28.4414 48.6387 27.2268 49.7322 26.2287C50.8331 25.2232 52.055 24.46 53.3981 23.9389C54.7411 23.4105 56.1502 23.1463 57.6253 23.1463C58.8656 23.1463 59.9958 23.3298 61.016 23.6967C62.0361 24.0563 62.9094 24.5701 63.636 25.2379C64.3699 25.9058 64.9313 26.6984 65.3203 27.6158C65.7093 28.5331 65.8927 29.5459 65.8707 30.6541H61.7095Z",
                      fill: "#DADADA"
                    })
                  ]
                }),
                12: (t10) => (0, d.jsxs)("svg", {
                  width: 90,
                  height: 70,
                  viewBox: "0 0 90 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M9.5822 7.5068C9.82329 6.06024 11.0749 5 12.5414 5L86.4586 5C88.3124 5 89.7226 6.6646 89.4178 8.4932L80.4178 62.4932C80.1767 63.9398 78.9251 65 77.4586 65H3.54138C1.68757 65 0.277434 63.3354 0.5822 61.5068L9.5822 7.5068Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M31.004 23.4545L27.2611 46H23.177L26.2593 27.4286H26.1272L20.2927 30.7972L20.9092 27.0543L27.118 23.4545H31.004Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M32.9856 46L33.4809 43.0497L42.574 35.3768C43.4473 34.6209 44.1812 33.9493 44.7757 33.3622C45.3775 32.7678 45.8508 32.199 46.1958 31.6559C46.5407 31.1055 46.7646 30.5183 46.8673 29.8945C46.9847 29.1826 46.926 28.5698 46.6912 28.0561C46.4563 27.5424 46.082 27.1497 45.5683 26.8782C45.0619 26.5993 44.4491 26.4599 43.7299 26.4599C42.9886 26.4599 42.3098 26.614 41.6933 26.9222C41.0768 27.2231 40.5631 27.6561 40.1521 28.2212C39.7485 28.779 39.4842 29.4395 39.3595 30.2028H35.4735C35.7083 28.7717 36.2441 27.5277 37.0807 26.4709C37.9174 25.4141 38.9632 24.5958 40.2182 24.016C41.4731 23.4362 42.8455 23.1463 44.3353 23.1463C45.8472 23.1463 47.1242 23.4289 48.1663 23.994C49.2158 24.5591 49.9717 25.3333 50.4341 26.3168C50.9038 27.3002 51.0322 28.4231 50.8194 29.6854C50.6726 30.5294 50.368 31.3587 49.9057 32.1733C49.4506 32.9806 48.7351 33.8833 47.759 34.8814C46.7829 35.8722 45.4472 37.0721 43.7519 38.4812L39.2274 42.4332L39.1944 42.5874H49.003L48.4415 46H32.9856Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M59.5491 42.3672L62.0591 27.1314H65.5267L63.0058 42.3672H59.5491ZM54.6173 36.4776L55.2007 33.032H70.4365L69.8531 36.4776H54.6173Z",
                      fill: "#DADADA"
                    })
                  ]
                }),
                14: (t10) => (0, d.jsxs)("svg", {
                  width: 90,
                  height: 70,
                  viewBox: "0 0 90 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M9.5822 7.5068C9.82329 6.06024 11.0749 5 12.5414 5L86.4586 5C88.3124 5 89.7226 6.6646 89.4178 8.4932L80.4178 62.4932C80.1767 63.9398 78.9251 65 77.4586 65H3.54138C1.68757 65 0.277434 63.3354 0.5822 61.5068L9.5822 7.5068Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M30.8077 23.4545L27.0648 46H22.9807L26.0631 27.4286H25.931L20.0964 30.7972L20.7129 27.0543L26.9217 23.4545H30.8077Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M33.0865 41.8168L33.6149 38.5692L45.6913 23.4545H48.3993L47.6288 28.0781H45.9885L37.8422 38.283L37.8202 38.4592H51.1845L50.6231 41.8168H33.0865ZM43.1373 46L43.9959 40.815L44.2932 39.3729L46.9242 23.4545H50.7772L47.0343 46H43.1373Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M60.7454 42.3672L63.2553 27.1314H66.723L64.2021 42.3672H60.7454ZM55.8136 36.4776L56.397 33.032H71.6328L71.0494 36.4776H55.8136Z",
                      fill: "#DADADA"
                    })
                  ]
                }),
                16: (t10) => (0, d.jsxs)("svg", {
                  width: 90,
                  height: 70,
                  viewBox: "0 0 90 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M9.5822 7.5068C9.82329 6.06024 11.0749 5 12.5414 5L86.4586 5C88.3124 5 89.7226 6.6646 89.4178 8.4932L80.4178 62.4932C80.1767 63.9398 78.9251 65 77.4586 65H3.54138C1.68757 65 0.277434 63.3354 0.5822 61.5068L9.5822 7.5068Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M30.5802 23.4545L26.8373 46H22.7531L25.8355 27.4286H25.7034L19.8689 30.7972L20.4854 27.0543L26.6942 23.4545H30.5802Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M40.9832 46.3082C39.8751 46.3009 38.8256 46.1064 37.8348 45.7248C36.8514 45.3432 36.0111 44.723 35.3139 43.8643C34.6166 42.9983 34.1359 41.8498 33.8717 40.4187C33.6149 38.9876 33.6626 37.2262 34.0148 35.1346C34.3378 33.2264 34.8221 31.5348 35.468 30.0597C36.1138 28.5772 36.8991 27.3222 37.8238 26.2947C38.7485 25.2599 39.787 24.4783 40.9392 23.9499C42.0914 23.4142 43.3354 23.1463 44.6711 23.1463C46.0875 23.1463 47.3095 23.4252 48.3369 23.983C49.3644 24.5334 50.146 25.2893 50.6818 26.2507C51.2248 27.2048 51.478 28.291 51.4413 29.5092H47.5003C47.4783 28.6359 47.2067 27.946 46.6857 27.4396C46.1646 26.9332 45.4197 26.68 44.4509 26.68C42.873 26.68 41.5227 27.3626 40.3998 28.7276C39.2769 30.0853 38.499 31.9898 38.066 34.441L38.2421 34.2099C38.7118 33.564 39.2622 33.0173 39.8934 32.5696C40.5246 32.1219 41.2071 31.7807 41.941 31.5458C42.6822 31.311 43.4455 31.1935 44.2308 31.1935C45.5885 31.1935 46.7554 31.5238 47.7315 32.1843C48.7076 32.8375 49.4158 33.7328 49.8561 34.8704C50.3038 36.0079 50.4029 37.3069 50.1533 38.7674C49.9112 40.2132 49.3644 41.5085 48.5131 42.6534C47.6691 43.791 46.6013 44.6863 45.3096 45.3395C44.0179 45.9927 42.5758 46.3156 40.9832 46.3082ZM41.1264 43.0057C41.9483 43.0057 42.7226 42.8039 43.4492 42.4002C44.1831 41.9892 44.7995 41.4351 45.2986 40.7379C45.805 40.0407 46.1242 39.2628 46.2563 38.4041C46.3737 37.6335 46.315 36.94 46.0802 36.3235C45.8453 35.6997 45.4637 35.208 44.9353 34.8484C44.4069 34.4888 43.7574 34.3089 42.9868 34.3089C42.3703 34.3089 41.7722 34.43 41.1924 34.6722C40.6126 34.9144 40.0842 35.2483 39.6072 35.674C39.1375 36.0923 38.7448 36.5767 38.4293 37.1271C38.1137 37.6776 37.9045 38.2647 37.8018 38.8885C37.6844 39.6444 37.7431 40.3343 37.9779 40.9581C38.2201 41.5746 38.6091 42.07 39.1448 42.4442C39.6879 42.8185 40.3484 43.0057 41.1264 43.0057Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M59.9729 42.3672L62.4829 27.1314H65.9506L63.4296 42.3672H59.9729ZM55.0411 36.4776L55.6246 33.032H70.8604L70.2769 36.4776H55.0411Z",
                      fill: "#DADADA"
                    })
                  ]
                }),
                18: (t10) => (0, d.jsxs)("svg", {
                  width: 90,
                  height: 70,
                  viewBox: "0 0 90 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M9.15151 7.5068C9.39553 6.06024 10.6623 5 12.1467 5L86.9628 5C88.8391 5 90.2664 6.6646 89.9579 8.4932L80.8485 62.4932C80.6045 63.9398 79.3377 65 77.8533 65H3.03723C1.16087 65 -0.266406 63.3354 0.042066 61.5068L9.15151 7.5068Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M31.6256 23.4545L27.8827 46H23.7985L26.8809 27.4286H26.7488L20.9143 30.7972L21.5308 27.0543L27.7396 23.4545H31.6256Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M41.6654 46.3082C40.0141 46.3082 38.594 46.0257 37.4051 45.4606C36.2162 44.8955 35.3355 44.1249 34.763 43.1488C34.1979 42.1727 34.0181 41.0755 34.2236 39.8572C34.3851 38.9325 34.7373 38.0812 35.2804 37.3033C35.8235 36.518 36.4877 35.8648 37.273 35.3437C38.0656 34.8227 38.9132 34.4887 39.8159 34.342V34.2209C38.7078 33.9567 37.8821 33.3439 37.339 32.3825C36.7959 31.421 36.6345 30.3202 36.8546 29.0799C37.0601 27.9277 37.5555 26.9075 38.3408 26.0195C39.1334 25.1242 40.1278 24.4233 41.3241 23.9169C42.5204 23.4032 43.8377 23.1463 45.2762 23.1463C46.744 23.1463 48.01 23.4142 49.0741 23.9499C50.1383 24.4857 50.9272 25.2159 51.4409 26.1406C51.9547 27.0653 52.1161 28.1148 51.9253 29.2891C51.7125 30.5514 51.1584 31.6265 50.263 32.5146C49.375 33.4026 48.3402 33.9713 47.1586 34.2209V34.342C48.01 34.4961 48.7512 34.8447 49.3823 35.3878C50.0208 35.9309 50.4869 36.6061 50.7804 37.4133C51.074 38.2206 51.1364 39.105 50.9676 40.0664C50.7694 41.27 50.2373 42.3415 49.3713 43.2809C48.5053 44.2203 47.4045 44.9615 46.0688 45.5046C44.7404 46.0404 43.2726 46.3082 41.6654 46.3082ZM41.9956 43.1598C42.869 43.1598 43.6469 43.0093 44.3294 42.7084C45.0193 42.4002 45.5844 41.9782 46.0247 41.4425C46.4651 40.8994 46.744 40.2719 46.8614 39.56C46.9715 38.8481 46.8944 38.2243 46.6302 37.6886C46.366 37.1455 45.9477 36.7271 45.3752 36.4336C44.8101 36.1327 44.135 35.9822 43.3497 35.9822C42.5277 35.9822 41.7681 36.1437 41.0709 36.4666C40.3737 36.7895 39.7939 37.2372 39.3316 37.8097C38.8692 38.3821 38.5793 39.0353 38.4619 39.7692C38.3518 40.4517 38.4215 41.0498 38.6711 41.5636C38.9279 42.07 39.3389 42.4626 39.904 42.7415C40.4765 43.0204 41.1737 43.1598 41.9956 43.1598ZM43.6909 32.8888C44.4102 32.8888 45.067 32.7421 45.6615 32.4485C46.2559 32.1549 46.7513 31.7513 47.1476 31.2376C47.5439 30.7165 47.8008 30.1257 47.9182 29.4652C48.0283 28.8194 47.9769 28.2616 47.7641 27.7919C47.5586 27.3222 47.2137 26.9626 46.7293 26.7131C46.2523 26.4635 45.6651 26.3388 44.9679 26.3388C44.234 26.3388 43.5662 26.4782 42.9644 26.7571C42.3699 27.036 41.8745 27.4286 41.4782 27.935C41.0893 28.4341 40.8397 29.0175 40.7296 29.6854C40.6196 30.3312 40.6746 30.8963 40.8948 31.3807C41.1223 31.8577 41.4746 32.2283 41.9516 32.4925C42.436 32.7567 43.0158 32.8888 43.6909 32.8888Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M60.9275 42.3672L63.4375 27.1314H66.9052L64.3842 42.3672H60.9275ZM55.9957 36.4776L56.5792 33.032H71.815L71.2315 36.4776H55.9957Z",
                      fill: "#DADADA"
                    })
                  ]
                })
              }, aG = {
                U: (t10) => (0, d.jsxs)("svg", {
                  width: 75,
                  height: 70,
                  viewBox: "0 0 75 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M71.4586 5C73.3124 5 74.7223 6.66457 74.4175 8.49316L65.4175 62.4932C65.1764 63.9397 63.9251 65 62.4586 65H3.54157C1.68775 65 0.277815 63.3354 0.582581 61.5068L9.58258 7.50684C9.82369 6.06029 11.0751 5 12.5416 5H71.4586Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M44.9023 23.4545H48.9865L46.5426 38.1839C46.2784 39.7985 45.6619 41.2186 44.6932 42.4442C43.7318 43.6699 42.5062 44.6276 41.0163 45.3175C39.5265 46 37.8679 46.3413 36.0405 46.3413C34.1984 46.3413 32.6499 46 31.3949 45.3175C30.1399 44.6276 29.2335 43.6699 28.6758 42.4442C28.1254 41.2186 27.9822 39.7985 28.2464 38.1839L30.6903 23.4545H34.7745L32.3857 37.8427C32.2315 38.7821 32.3013 39.6187 32.5948 40.3526C32.8957 41.0792 33.3874 41.6516 34.07 42.07C34.7598 42.4883 35.6222 42.6974 36.657 42.6974C37.6918 42.6974 38.6238 42.4883 39.4531 42.07C40.2824 41.6516 40.9613 41.0792 41.4897 40.3526C42.0181 39.6187 42.3594 38.7821 42.5135 37.8427L44.9023 23.4545Z",
                      fill: "#DADADA"
                    })
                  ]
                }),
                "U/A 7+": (t10) => (0, d.jsxs)("svg", {
                  width: 134,
                  height: 70,
                  viewBox: "0 0 134 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M130.459 5C132.312 5 133.722 6.66457 133.418 8.49316L124.418 62.4932C124.176 63.9397 122.925 65 121.459 65H3.54157C1.68775 65 0.277815 63.3354 0.582581 61.5068L9.58258 7.50684C9.82369 6.06029 11.0751 5 12.5416 5H130.459Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M34.8606 22.5605H38.9448L36.5009 37.2899C36.2367 38.9045 35.6202 40.3246 34.6514 41.5502C33.69 42.7758 32.4644 43.7335 30.9746 44.4234C29.4848 45.1059 27.8262 45.4472 25.9987 45.4472C24.1566 45.4472 22.6081 45.1059 21.3531 44.4234C20.0982 43.7335 19.1918 42.7758 18.634 41.5502C18.0836 40.3246 17.9405 38.9045 18.2047 37.2899L20.6486 22.5605H24.7328L22.3439 36.9486C22.1898 37.888 22.2595 38.7247 22.5531 39.4586C22.854 40.1851 23.3457 40.7576 24.0282 41.1759C24.7181 41.5942 25.5804 41.8034 26.6152 41.8034C27.65 41.8034 28.5821 41.5942 29.4114 41.1759C30.2407 40.7576 30.9195 40.1851 31.448 39.4586C31.9764 38.7247 32.3176 37.888 32.4718 36.9486L34.8606 22.5605Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", { d: "M52.8312 21.5037L41.1181 48.4966H37.6284L49.3415 21.5037H52.8312Z", fill: "#DADADA" }),
                    (0, d.jsx)("path", {
                      d: "M52.5265 45.1059H48.1671L59.8472 22.5605H64.8891L69.0944 45.1059H64.735L61.7076 27.1841H61.5315L52.5265 45.1059ZM54.1338 36.2661H66.023L65.4725 39.5466H53.5833L54.1338 36.2661Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M80.3588 45.1059L93.0957 26.1272L93.1397 25.9731H81.9991L82.5605 22.5605H97.9174L97.334 26.0502L84.5971 45.1059H80.3588Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M105.037 41.4731L107.547 26.2373H111.015L108.494 41.4731H105.037ZM100.105 35.5836L100.689 32.1379H115.925L115.341 35.5836H100.105Z",
                      fill: "#DADADA"
                    })
                  ]
                }),
                "U/A 13+": (t10) => (0, d.jsxs)("svg", {
                  width: 151,
                  height: 70,
                  viewBox: "0 0 151 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M147.459 5C149.312 5 150.722 6.66457 150.418 8.49316L141.418 62.4932C141.176 63.9397 139.925 65 138.459 65H3.54157C1.68775 65 0.277815 63.3354 0.582581 61.5068L9.58258 7.50684C9.82369 6.06029 11.0751 5 12.5416 5H147.459Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M34.9143 22.5605H38.9985L36.5546 37.2899C36.2904 38.9045 35.6739 40.3246 34.7051 41.5502C33.7437 42.7758 32.5181 43.7335 31.0283 44.4234C29.5385 45.1059 27.8799 45.4472 26.0524 45.4472C24.2104 45.4472 22.6618 45.1059 21.4069 44.4234C20.1519 43.7335 19.2455 42.7758 18.6877 41.5502C18.1373 40.3246 17.9942 38.9045 18.2584 37.2899L20.7023 22.5605H24.7865L22.3976 36.9486C22.2435 37.888 22.3132 38.7247 22.6068 39.4586C22.9077 40.1851 23.3994 40.7576 24.0819 41.1759C24.7718 41.5942 25.6341 41.8034 26.6689 41.8034C27.7037 41.8034 28.6358 41.5942 29.4651 41.1759C30.2944 40.7576 30.9733 40.1851 31.5017 39.4586C32.0301 38.7247 32.3713 37.888 32.5255 36.9486L34.9143 22.5605Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", { d: "M52.8849 21.5037L41.1719 48.4966H37.6822L49.3952 21.5037H52.8849Z", fill: "#DADADA" }),
                    (0, d.jsx)("path", {
                      d: "M52.5802 45.1059H48.2209L59.9009 22.5605H64.9428L69.1481 45.1059H64.7887L61.7613 27.1841H61.5852L52.5802 45.1059ZM54.1875 36.2661H66.0767L65.5263 39.5466H53.6371L54.1875 36.2661Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M92.4999 22.5605L88.757 45.1059H84.6728L87.7552 26.5346H87.6231L81.7886 29.9032L82.4051 26.1603L88.6139 22.5605H92.4999Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M102.727 45.4142C101.112 45.4142 99.7178 45.1426 98.5436 44.5995C97.3767 44.0565 96.5107 43.3042 95.9456 42.3428C95.3805 41.374 95.1933 40.2512 95.3841 38.9742H99.4573C99.3839 39.5833 99.4793 40.1154 99.7435 40.5704C100.015 41.0181 100.422 41.3667 100.965 41.6162C101.509 41.8658 102.151 41.9905 102.892 41.9905C103.714 41.9905 104.477 41.8401 105.182 41.5392C105.886 41.2383 106.473 40.8163 106.943 40.2732C107.413 39.7301 107.703 39.1063 107.813 38.4017C107.915 37.7412 107.831 37.1688 107.56 36.6844C107.288 36.2 106.844 35.8258 106.228 35.5615C105.618 35.2973 104.844 35.1652 103.905 35.1652H101.824L102.342 32.0168H104.235C105.02 32.0168 105.739 31.87 106.393 31.5765C107.053 31.2829 107.604 30.8719 108.044 30.3435C108.484 29.8151 108.759 29.2023 108.87 28.5051C108.972 27.9106 108.928 27.3969 108.737 26.9639C108.554 26.5236 108.235 26.1823 107.78 25.9401C107.332 25.6906 106.756 25.5658 106.051 25.5658C105.347 25.5658 104.661 25.6906 103.993 25.9401C103.332 26.1896 102.771 26.5456 102.308 27.0079C101.846 27.4629 101.56 28.006 101.45 28.6372H97.5418C97.7693 27.3822 98.3014 26.2777 99.138 25.3236C99.982 24.3622 101.02 23.61 102.253 23.0669C103.494 22.5238 104.826 22.2522 106.25 22.2522C107.791 22.2522 109.075 22.5531 110.103 23.1549C111.137 23.7567 111.886 24.5494 112.348 25.5328C112.818 26.5162 112.957 27.5804 112.767 28.7253C112.561 30.0022 112.014 31.037 111.126 31.8297C110.246 32.6149 109.159 33.1397 107.868 33.4039V33.547C109.336 33.7672 110.433 34.3873 111.159 35.4074C111.886 36.4202 112.132 37.6422 111.897 39.0733C111.691 40.3356 111.167 41.4438 110.323 42.3978C109.479 43.3446 108.4 44.0858 107.086 44.6216C105.78 45.15 104.327 45.4142 102.727 45.4142Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M121.983 41.4731L124.493 26.2373H127.961L125.44 41.4731H121.983ZM117.052 35.5836L117.635 32.1379H132.871L132.287 35.5836H117.052Z",
                      fill: "#DADADA"
                    })
                  ]
                }),
                "U/A 16+": (t10) => (0, d.jsxs)("svg", {
                  width: 151,
                  height: 70,
                  viewBox: "0 0 151 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M147.459 5C149.312 5 150.722 6.66457 150.418 8.49316L141.418 62.4932C141.176 63.9397 139.925 65 138.459 65H3.54157C1.68775 65 0.277815 63.3354 0.582581 61.5068L9.58258 7.50684C9.82369 6.06029 11.0751 5 12.5416 5H147.459Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M34.9597 22.5605H39.0439L36.6 37.2899C36.3358 38.9045 35.7193 40.3246 34.7506 41.5502C33.7891 42.7758 32.5635 43.7335 31.0737 44.4234C29.5839 45.1059 27.9253 45.4472 26.0979 45.4472C24.2558 45.4472 22.7072 45.1059 21.4523 44.4234C20.1973 43.7335 19.2909 42.7758 18.7332 41.5502C18.1827 40.3246 18.0396 38.9045 18.3038 37.2899L20.7477 22.5605H24.8319L22.443 36.9486C22.2889 37.888 22.3586 38.7247 22.6522 39.4586C22.9531 40.1851 23.4448 40.7576 24.1273 41.1759C24.8172 41.5942 25.6795 41.8034 26.7143 41.8034C27.7491 41.8034 28.6812 41.5942 29.5105 41.1759C30.3398 40.7576 31.0187 40.1851 31.5471 39.4586C32.0755 38.7247 32.4167 37.888 32.5709 36.9486L34.9597 22.5605Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", { d: "M52.9303 21.5037L41.2173 48.4966H37.7276L49.4406 21.5037H52.9303Z", fill: "#DADADA" }),
                    (0, d.jsx)("path", {
                      d: "M52.6256 45.1059H48.2663L59.9463 22.5605H64.9882L69.1935 45.1059H64.8341L61.8068 27.1841H61.6306L52.6256 45.1059ZM54.2329 36.2661H66.1221L65.5717 39.5466H53.6825L54.2329 36.2661Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M92.5453 22.5605L88.8024 45.1059H84.7182L87.8006 26.5346H87.6685L81.834 29.9032L82.4505 26.1603L88.6593 22.5605H92.5453Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M102.948 45.4142C101.84 45.4068 100.791 45.2124 99.7999 44.8307C98.8165 44.4491 97.9762 43.8289 97.279 42.9703C96.5818 42.1043 96.1011 40.9557 95.8369 39.5246C95.58 38.0935 95.6277 36.3321 95.98 34.2405C96.3029 32.3324 96.7872 30.6407 97.4331 29.1656C98.0789 27.6831 98.8642 26.4281 99.7889 25.4007C100.714 24.3659 101.752 23.5843 102.904 23.0559C104.057 22.5201 105.301 22.2522 106.636 22.2522C108.053 22.2522 109.275 22.5311 110.302 23.0889C111.33 23.6393 112.111 24.3952 112.647 25.3566C113.19 26.3107 113.443 27.3969 113.406 28.6152H109.465C109.443 27.7418 109.172 27.052 108.651 26.5456C108.13 26.0392 107.385 25.786 106.416 25.786C104.838 25.786 103.488 26.4685 102.365 27.8336C101.242 29.1913 100.464 31.0958 100.031 33.547L100.207 33.3158C100.677 32.67 101.227 32.1232 101.859 31.6755C102.49 31.2279 103.172 30.8866 103.906 30.6517C104.647 30.4169 105.411 30.2995 106.196 30.2995C107.554 30.2995 108.72 30.6297 109.697 31.2902C110.673 31.9434 111.381 32.8388 111.821 33.9763C112.269 35.1139 112.368 36.4129 112.118 37.8733C111.876 39.3191 111.33 40.6145 110.478 41.7593C109.634 42.8969 108.566 43.7923 107.275 44.4454C105.983 45.0986 104.541 45.4215 102.948 45.4142ZM103.091 42.1116C103.913 42.1116 104.688 41.9098 105.414 41.5061C106.148 41.0952 106.765 40.5411 107.264 39.8439C107.77 39.1467 108.089 38.3687 108.221 37.5101C108.339 36.7395 108.28 36.0459 108.045 35.4294C107.81 34.8056 107.429 34.3139 106.9 33.9543C106.372 33.5947 105.723 33.4149 104.952 33.4149C104.335 33.4149 103.737 33.536 103.158 33.7782C102.578 34.0204 102.049 34.3543 101.572 34.7799C101.103 35.1983 100.71 35.6826 100.394 36.2331C100.079 36.7835 99.8696 37.3706 99.7669 37.9944C99.6495 38.7504 99.7082 39.4402 99.943 40.064C100.185 40.6805 100.574 41.1759 101.11 41.5502C101.653 41.9245 102.314 42.1116 103.091 42.1116Z",
                      fill: "#DADADA"
                    }),
                    (0, d.jsx)("path", {
                      d: "M121.938 41.4731L124.448 26.2373H127.916L125.395 41.4731H121.938ZM117.006 35.5836L117.59 32.1379H132.825L132.242 35.5836H117.006Z",
                      fill: "#DADADA"
                    })
                  ]
                }),
                A: (t10) => (0, d.jsxs)("svg", {
                  width: 75,
                  height: 70,
                  viewBox: "0 0 75 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "M71.4586 5C73.3124 5 74.7223 6.66457 74.4175 8.49316L65.4175 62.4932C65.1764 63.9397 63.9251 65 62.4586 65H3.54157C1.68775 65 0.277815 63.3354 0.582581 61.5068L9.58258 7.50684C9.82369 6.06029 11.0751 5 12.5416 5H71.4586Z",
                      fill: "#4A4E58",
                      fillOpacity: 0.7
                    }),
                    (0, d.jsx)("path", {
                      d: "M29.9941 46H25.6347L37.3147 23.4545H42.3566L46.5619 46H42.2025L39.1752 28.0781H38.999L29.9941 46ZM31.6013 37.1602H43.4905L42.9401 40.4407H31.0509L31.6013 37.1602Z",
                      fill: "#DADADA"
                    })
                  ]
                })
              }, aW = {
                G: (t10) => (0, d.jsxs)("svg", {
                  fill: "none",
                  height: 70,
                  viewBox: "0 0 71 70",
                  width: 71,
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: [
                    (0, d.jsx)("path", {
                      d: "m70.0249 64.1595c0 3.2104-2.6306 5.8405-5.8292 5.8405h-58.34158c-3.21101 0-5.8292177-2.6301-5.8292177-5.8405v-58.33131c0-3.21044 2.6182077-5.82819 5.8292177-5.82819h58.34158c3.211 0 5.8292 2.61775 5.8292 5.82819z",
                      fill: "#fff"
                    }),
                    (0, d.jsx)("path", {
                      d: "m66.837 61.508c0 2.9185-2.3909 5.3095-5.2983 5.3095h-53.02754c-2.91854 0-5.29827-2.391-5.29827-5.3095v-53.0276c0-2.91854 2.37973-5.29827 5.29827-5.29827h53.02754c2.9186 0 5.2983 2.37973 5.2983 5.29827z",
                      fill: "#0db14b"
                    }),
                    (0, d.jsxs)("g", {
                      fill: "#fff",
                      children: [
                        (0, d.jsx)("path", {
                          d: "m40.6487 46.3316c-1.6277 1.6838-3.5584 2.3012-5.7248 2.3012-2.1665 0-4.0411-.797-5.4667-2.2226-2.0542-2.0542-1.9981-4.5911-1.9981-8.0933 0-3.5023-.0561-6.0391 1.9981-8.0821 1.4256-1.4256 3.1767-2.2226 5.4667-2.2226 4.7033 0 7.0942 3.0757 7.6331 6.4994h-3.985c-.4602-1.9083-1.6276-2.9635-3.6481-2.9635-1.0777 0-1.9644.4266-2.5369 1.0889-.7633.8531-.9654 1.796-.9654 5.6911s.2021 4.8717.9654 5.7248c.5725.6511 1.4592 1.0552 2.5369 1.0552 1.1898 0 2.1552-.4266 2.8175-1.1337.651-.7409.9092-1.6501.9092-2.7053v-.7633h-3.7267v-3.3002h7.6555v2.9634c0 2.9298-.5164 4.6921-1.9419 6.1739z"
                        }),
                        (0, d.jsx)("path", {
                          d: "m34.4525 15.4512-21.4513 36.3021h44.0475l-22.0237-37.2562-.5613.9541zm.5725 1.6164c1.0439 1.7624 18.6449 31.5539 19.7225 33.3724h-39.4451c1.0776-1.8185 18.6786-31.61 19.7226-33.3724z"
                        })
                      ]
                    })
                  ]
                }),
                PG: (t10) => (0, d.jsx)("svg", {
                  width: 71,
                  height: 70,
                  viewBox: "0 0 71 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "Australia Rating",
                    children: [
                      (0, d.jsx)("path", {
                        id: "Outline",
                        d: "M70.0249 64.1595C70.0249 67.3699 67.3943 70 64.1957 70H5.85412C2.64311 70 0.0249023 67.3699 0.0249023 64.1595V5.82819C0.0249023 2.61775 2.64311 0 5.85412 0H64.1957C67.4067 0 70.0249 2.61775 70.0249 5.82819V64.1595Z",
                        fill: "white"
                      }),
                      (0, d.jsx)("path", {
                        id: "Background",
                        d: "M66.837 61.508C66.837 64.4265 64.4461 66.8175 61.5387 66.8175H8.51116C5.59262 66.8175 3.21289 64.4265 3.21289 61.508V8.4804C3.21289 5.56186 5.59262 3.18213 8.51116 3.18213H61.5387C64.4573 3.18213 66.837 5.56186 66.837 8.4804V61.508Z",
                        fill: "#FFF200"
                      }),
                      (0, d.jsxs)("g", {
                        id: "PG",
                        children: [
                          (0, d.jsx)("path", {
                            id: "Vector",
                            d: "M26.0445 38.0868H21.5208V46.9434H16.9185V23.4043H26.0445C30.905 23.4043 33.8123 26.7494 33.8123 30.7455C33.8123 34.7417 30.905 38.0868 26.0445 38.0868ZM25.82 27.5015H21.5208V33.9559H25.82C27.9079 33.9559 29.2324 32.665 29.2324 30.7455C29.2324 28.826 27.9079 27.5015 25.82 27.5015Z",
                            fill: "#231F20"
                          }),
                          (0, d.jsx)("path", {
                            id: "Vector_2",
                            d: "M50.8745 44.4738C48.9887 46.427 46.7437 47.1454 44.2292 47.1454C41.7148 47.1454 39.5371 46.2249 37.8758 44.5636C35.4961 42.1839 35.5634 39.2429 35.5634 35.1794C35.5634 31.1159 35.4961 28.1749 37.8758 25.7952C39.5259 24.1451 41.5801 23.2134 44.2292 23.2134C49.6847 23.2134 52.4573 26.783 53.0859 30.7567H48.4611C47.9335 28.5453 46.5753 27.3218 44.2292 27.3218C42.972 27.3218 41.9393 27.8157 41.2882 28.579C40.3902 29.5668 40.1545 30.6669 40.1545 35.1906C40.1545 39.7143 40.3902 40.8481 41.2882 41.8359C41.9393 42.5992 42.972 43.0594 44.2292 43.0594C45.6212 43.0594 46.7324 42.5655 47.507 41.7349C48.2591 40.8818 48.5621 39.8154 48.5621 38.6031V37.7163H44.2292V33.8773H53.1196V37.3122C53.1196 40.7246 52.5246 42.7676 50.8745 44.4963V44.4738Z",
                            fill: "#231F20"
                          }),
                          (0, d.jsx)("path", {
                            id: "Vector_3",
                            d: "M58.4628 17.208H10.8232V52.758H59.2148V17.208H58.4515H58.4628ZM57.6882 18.7346V51.2314H12.3611C12.3611 49.8058 12.3611 20.1602 12.3611 18.7346H57.6994H57.6882Z",
                            fill: "#231F20"
                          })
                        ]
                      })
                    ]
                  })
                }),
                M: (t10) => (0, d.jsx)("svg", {
                  width: 71,
                  height: 70,
                  viewBox: "0 0 71 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "Australia Rating",
                    children: [
                      (0, d.jsx)("path", {
                        id: "Outline",
                        d: "M70.0249 64.1595C70.0249 67.3699 67.3943 70 64.1957 70H5.85412C2.64311 70 0.0249023 67.3699 0.0249023 64.1595V5.82819C0.0249023 2.61775 2.64311 0 5.85412 0H64.1957C67.4067 0 70.0249 2.61775 70.0249 5.82819V64.1595Z",
                        fill: "white"
                      }),
                      (0, d.jsx)("path", {
                        id: "Background",
                        d: "M66.837 61.508C66.837 64.4265 64.4461 66.8175 61.5387 66.8175H8.51116C5.59262 66.8175 3.21289 64.4265 3.21289 61.508V8.4804C3.21289 5.56186 5.59262 3.18213 8.51116 3.18213H61.5387C64.4573 3.18213 66.837 5.56186 66.837 8.4804V61.508Z",
                        fill: "#00AEEF"
                      }),
                      (0, d.jsxs)("g", {
                        id: "M",
                        children: [
                          (0, d.jsx)("path", {
                            id: "Vector",
                            d: "M40.7723 46.3376V33.3388L36.5067 41.7914H33.5657L29.2665 33.3388V46.3376H24.9111V24.0332H29.1991L35.025 36.089L40.8172 24.0332H45.1164V46.3376H40.761H40.7723Z",
                            fill: "white"
                          }),
                          (0, d.jsx)("path", {
                            id: "Vector_2",
                            d: "M16.5933 35C16.5933 45.17 24.855 53.4317 35.0249 53.4317C45.1949 53.4317 53.4566 45.17 53.4566 35C53.4566 24.8301 45.1837 16.5796 35.0249 16.5796C24.8662 16.5796 16.5933 24.8413 16.5933 35ZM18.0413 35C18.0413 25.6383 25.6632 18.0164 35.0249 18.0164C44.3867 18.0164 52.0086 25.6383 52.0086 35C52.0086 44.3618 44.3867 51.9837 35.0249 51.9837C25.6632 51.9837 18.0413 44.3618 18.0413 35Z",
                            fill: "white"
                          })
                        ]
                      })
                    ]
                  })
                }),
                "MA 15+": (t10) => (0, d.jsx)("svg", {
                  width: 70,
                  height: 70,
                  viewBox: "0 0 70 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "Australia Rating",
                    children: [
                      (0, d.jsx)("path", {
                        id: "Outline",
                        d: "M70 64.1595C70 67.3699 67.3694 70 64.1708 70H5.82922C2.61821 70 0 67.3699 0 64.1595V5.82819C0 2.61775 2.61821 0 5.82922 0H64.1708C67.3818 0 70 2.61775 70 5.82819V64.1595Z",
                        fill: "white"
                      }),
                      (0, d.jsx)("path", {
                        id: "Background",
                        d: "M66.8121 61.508C66.8121 64.4265 64.4212 66.8175 61.5138 66.8175H8.48626C5.56772 66.8175 3.18799 64.4265 3.18799 61.508V8.4804C3.18799 5.56186 5.56772 3.18213 8.48626 3.18213H61.5138C64.4324 3.18213 66.8121 5.56186 66.8121 8.4804V61.508Z",
                        fill: "#ED1C24"
                      }),
                      (0, d.jsxs)("g", {
                        id: "MA",
                        children: [
                          (0, d.jsxs)("g", {
                            id: "Group",
                            children: [
                              (0, d.jsx)("path", {
                                id: "Vector",
                                d: "M47.6752 40.1287V30.8059L45.7092 32.5356V31.3225L47.6752 29.6265H48.7425V40.1287H47.6752Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                id: "Vector_2",
                                d: "M55.4718 39.4548C54.9888 39.9378 54.3035 40.2298 53.3823 40.2298C52.4611 40.2298 51.7309 39.9378 51.2703 39.4772C50.8097 39.0055 50.5962 38.3989 50.5288 37.6464H51.5961C51.7309 38.691 52.2701 39.2863 53.3823 39.2863C53.8991 39.2863 54.3709 39.1066 54.6854 38.8033C55.2359 38.2641 55.2584 37.4217 55.2584 36.6691C55.2584 35.3887 55.0112 34.1194 53.4834 34.1194C52.5734 34.1194 51.9555 34.535 51.7421 35.1528H50.7872V29.6377H56.1009V30.5812H51.7533V33.9172C52.169 33.4567 52.8206 33.1984 53.6407 33.1984C54.4608 33.1984 55.0449 33.4455 55.4606 33.8611C56.2245 34.6249 56.3256 35.6919 56.3256 36.6804C56.3256 37.725 56.2358 38.7134 55.4831 39.466L55.4718 39.4548Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                id: "Vector_3",
                                d: "M61.2573 36.6809V39.2759H60.2687V36.6809H57.6736V35.6922H60.2687V33.1309H61.2573V35.6922H63.8411V36.6809H61.2573Z",
                                fill: "white"
                              })
                            ]
                          }),
                          (0, d.jsxs)("g", {
                            id: "Group_2",
                            children: [
                              (0, d.jsx)("path", {
                                id: "Vector_4",
                                d: "M22.7017 42.3412V34.2764L20.0617 39.5219H18.2418L15.5793 34.2764V42.3412H12.8718V28.5029H15.5343L19.1517 35.9837L22.7466 28.5029H25.4091V42.3412H22.7017Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                id: "Vector_5",
                                d: "M35.5983 42.3412L34.7782 39.8925H29.8576L29.0263 42.3412H26.2065L31.2394 28.5029H33.3515L38.4068 42.3412H35.5871H35.5983ZM32.3741 32.5803L30.6328 37.6124H34.0704L32.3741 32.5803Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                id: "Vector_6",
                                d: "M35.1828 21H15.2197L6.2998 35.2988L15.2197 49.6088H35.43L44.3499 35.2988L35.43 21H35.1828ZM34.9357 21.8986C35.1828 22.303 43.013 34.8607 43.2939 35.31C43.013 35.7593 35.1828 48.3171 34.9357 48.7214H15.714C15.4669 48.3171 7.63667 35.7593 7.35582 35.31C7.63667 34.8607 15.4669 22.303 15.714 21.8986H34.9357Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),
                "R 18+": (t10) => (0, d.jsx)("svg", {
                  width: 71,
                  height: 70,
                  viewBox: "0 0 71 70",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  ...t10,
                  children: (0, d.jsxs)("g", {
                    id: "Australia Rating",
                    children: [
                      (0, d.jsx)("path", {
                        id: "Outline",
                        d: "M70.0249 64.1595C70.0249 67.3699 67.3943 70 64.1957 70H5.85412C2.64311 70 0.0249023 67.3699 0.0249023 64.1595V5.82819C0.0249023 2.61775 2.64311 0 5.85412 0H64.1957C67.4067 0 70.0249 2.61775 70.0249 5.82819V64.1595Z",
                        fill: "white"
                      }),
                      (0, d.jsx)("path", {
                        id: "Background",
                        d: "M66.837 61.508C66.837 64.4265 64.4461 66.8175 61.5387 66.8175H8.51116C5.59262 66.8175 3.21289 64.4265 3.21289 61.508V8.4804C3.21289 5.56186 5.59262 3.18213 8.51116 3.18213H61.5387C64.4573 3.18213 66.837 5.56186 66.837 8.4804V61.508Z",
                        fill: "#231F20"
                      }),
                      (0, d.jsxs)("g", {
                        id: "R",
                        children: [
                          (0, d.jsxs)("g", {
                            id: "Group",
                            children: [
                              (0, d.jsx)("path", {
                                id: "Vector",
                                d: "M44.4091 40.978V29.9437L42.0854 31.9866V30.5498L44.4091 28.5405H45.6663V40.978H44.4091Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                id: "Vector_2",
                                d: "M51.133 41.079C49.0676 41.079 47.4624 39.6421 47.4624 37.5543C47.4624 36.1062 48.2818 35.1296 49.337 34.5347C48.3604 33.9734 47.7094 33.0754 47.7094 31.7733C47.7094 29.8314 49.1574 28.4395 51.133 28.4395C53.1087 28.4395 54.5567 29.8426 54.5567 31.7733C54.5567 33.0642 53.9281 33.9734 52.9515 34.5347C53.9954 35.1296 54.8036 36.1062 54.8036 37.5543C54.8036 39.6534 53.1985 41.079 51.133 41.079ZM51.133 35.1072C49.7748 35.1072 48.7196 36.1511 48.7196 37.5318C48.7196 38.9125 49.7636 39.9565 51.133 39.9565C52.5025 39.9565 53.5464 38.9125 53.5464 37.5318C53.5464 36.1511 52.5025 35.1072 51.133 35.1072ZM51.133 29.5507C49.8534 29.5507 48.9666 30.4937 48.9666 31.7845C48.9666 33.0754 49.8534 34.0071 51.133 34.0071C52.4127 34.0071 53.2995 33.0979 53.2995 31.7845C53.2995 30.4712 52.4127 29.5507 51.133 29.5507Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                id: "Vector_3",
                                d: "M60.8427 36.892V39.9677H59.6753V36.892H56.5996V35.7246H59.6753V32.6826H60.8427V35.7246H63.896V36.892H60.8427Z",
                                fill: "white"
                              })
                            ]
                          }),
                          (0, d.jsxs)("g", {
                            id: "Group_2",
                            children: [
                              (0, d.jsx)("path", {
                                id: "Vector_4",
                                d: "M26.4826 44.076L23.1824 37.3409H20.8139V44.076H17.5137V27.1821H24.1365C27.5826 27.1821 29.6144 29.5282 29.6144 32.3569C29.6144 34.7367 28.1663 36.2071 26.5275 36.8021L30.2991 44.0872H26.4826V44.076ZM23.912 30.1231H20.8026V34.5795H23.912C25.36 34.5795 26.3142 33.659 26.3142 32.3569C26.3142 31.0548 25.36 30.1231 23.912 30.1231Z",
                                fill: "white"
                              }),
                              (0, d.jsx)("path", {
                                id: "Vector_5",
                                d: "M23.2048 18.3817L6.09766 35.4888L23.5977 52.9776L41.0864 35.4888L23.5864 18L23.2048 18.3817ZM23.5977 19.5378C24.3161 20.2563 38.8302 34.7704 39.5486 35.4888C38.8302 36.2072 24.3161 50.7101 23.5977 51.4285C22.8792 50.7101 8.36514 36.196 7.64673 35.4888C8.36514 34.7704 22.8792 20.2563 23.5977 19.5378Z",
                                fill: "white"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                })
              }, aJ = {
                [l.w.BR_TV]: aK,
                [l.w.BR_MOVIE]: aK,
                [l.w.NZ_TV]: aZ,
                [l.w.NZ_MOVIE]: aZ,
                [l.w.AU_TV]: aW,
                [l.w.AU_MOVIE]: aW,
                [l.w.IN_TV]: aG,
                [l.w.IN_MOVIE]: aG,
                [l.w.UNIVERSAL_TV]: az,
                [l.w.UNIVERSAL_MOVIE]: az,
                [l.w.KR_KMRB]: {
                  ALL: (t10) => (0, d.jsxs)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 80,
                    viewBox: "0 0 80 80",
                    width: 80,
                    ...t10,
                    children: [
                      (0, d.jsx)("g", {
                        clipPath: "url(#clip0_11_429)",
                        children: (0, d.jsxs)("g", {
                          clipPath: "url(#clip1_11_429)",
                          children: [
                            (0, d.jsx)("path", {
                              d: "M70.983 80H9.01956C4.04078 80 0 75.9631 0 70.9825V9.01875C0 4.03827 4.04078 0 9.01956 0H70.983C75.9649 0 80 4.03827 80 9.01875V70.9825C80 75.9631 75.9649 80 70.983 80Z",
                              fill: "#00974C"
                            }),
                            (0, d.jsx)("path", {
                              d: "M22.96 60.3093L21.999 54.2384L14.9713 54.2421L14.0127 60.3069L4.95581 60.3093V60.201L13.5309 19.6184L23.4361 19.6196L32.0113 60.2034L32.0138 60.3092L22.96 60.3093ZM18.4835 32.7178L16.2465 46.5678H20.7205L18.4835 32.7178Z",
                              fill: "white"
                            }),
                            (0, d.jsx)("path", { d: "M33.6071 60.3093V19.6172H42.6639V52.1608H53.3142V60.3093H33.6071Z", fill: "white" }),
                            (0, d.jsx)("path", {
                              d: "M55.2333 60.3069V19.6172L64.2876 19.6185L64.2845 52.1608H74.9404V60.3106L55.2333 60.3069Z",
                              fill: "white"
                            })
                          ]
                        })
                      }),
                      (0, d.jsxs)("defs", {
                        children: [
                          (0, d.jsx)("clipPath", {
                            id: "clip0_11_429",
                            children: (0, d.jsx)("path", {
                              d: "M0 8C0 3.58172 3.58172 0 8 0H72C76.4183 0 80 3.58172 80 8V72C80 76.4183 76.4183 80 72 80H8C3.58172 80 0 76.4183 0 72V8Z",
                              fill: "white"
                            })
                          }),
                          (0, d.jsx)("clipPath", { id: "clip1_11_429", children: (0, d.jsx)("rect", { fill: "white", height: 80, width: 80 }) })
                        ]
                      })
                    ]
                  }),
                  12: (t10) => (0, d.jsxs)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 80,
                    viewBox: "0 0 80 80",
                    width: 80,
                    ...t10,
                    children: [
                      (0, d.jsxs)("g", {
                        clipPath: "url(#clip0_11_430)",
                        children: [
                          (0, d.jsx)("path", {
                            d: "M70.9789 80H9.01922C4.03811 80 0 75.9631 0 70.9825V9.01877C0 4.03827 4.03811 0 9.01922 0H70.9789C75.9593 0 80 4.03827 80 9.01877V70.9825C80 75.9631 75.9593 80 70.9789 80Z",
                            fill: "#EBBD00"
                          }),
                          (0, d.jsx)("path", { d: "M17.3084 67.563V27.802H12.9067L18.6067 12.4346H29.6488V67.563H17.3084Z", fill: "white" }),
                          (0, d.jsx)("path", {
                            d: "M65.2153 12.4346H59.956H56.7572H43.5211H40.3275H35.0625C34.3823 12.4346 33.8307 12.986 33.8307 13.6657V18.7832V22.1256V30.329H45.8836V22.8239H54.4V29.4613L33.3982 59.4093V67.4958H66.3058V56.7393H48.7001L64.0664 35.1653C64.5481 34.4893 64.9315 33.9018 65.2229 33.3952C65.5116 32.891 65.752 32.4006 65.9449 31.9151C66.1354 31.4371 66.2685 30.9068 66.3408 30.3292C66.413 29.7503 66.4479 29.0545 66.4479 28.2366V22.1258V18.7834V13.6657C66.4476 12.986 65.8963 12.4346 65.2153 12.4346Z",
                            fill: "white"
                          })
                        ]
                      }),
                      (0, d.jsx)("defs", {
                        children: (0, d.jsx)("clipPath", {
                          id: "clip0_11_430",
                          children: (0, d.jsx)("path", {
                            d: "M0 8C0 3.58172 3.58172 0 8 0H72C76.4183 0 80 3.58172 80 8V72C80 76.4183 76.4183 80 72 80H8C3.58172 80 0 76.4183 0 72V8Z",
                            fill: "white"
                          })
                        })
                      })
                    ]
                  }),
                  15: (t10) => (0, d.jsxs)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 80,
                    viewBox: "0 0 80 80",
                    width: 80,
                    ...t10,
                    children: [
                      (0, d.jsxs)("g", {
                        clipPath: "url(#clip0_11_431)",
                        children: [
                          (0, d.jsx)("path", {
                            d: "M70.9813 80H9.01611C4.03944 80 0 75.9619 0 70.9813V9.01867C0 4.03822 4.03944 0 9.01611 0H70.9813C75.9619 0 80 4.03822 80 9.01867V70.9814C80 75.9619 75.9619 80 70.9813 80Z",
                            fill: "#DD7218"
                          }),
                          (0, d.jsx)("path", { d: "M17.273 67.5644V27.8052H12.8688L18.5688 12.4332H29.614V67.5644H17.273Z", fill: "white" }),
                          (0, d.jsx)("path", {
                            d: "M65.2515 31.2671H60.2051H56.7931H45.9146V23.1859H66.1216V12.4332H33.7952V41.8019H54.5063V57.1703H45.7739V49.953H33.7952V57.8712V61.1426V66.331C33.7952 67.0107 34.3466 67.5621 35.0263 67.5621H40.0017H43.4846H56.7928H60.2048H65.2513C65.9309 67.5621 66.4824 67.0107 66.4824 66.331V61.1426V57.8711V40.9579V37.6866V32.4982C66.4826 31.8186 65.9312 31.2671 65.2515 31.2671Z",
                            fill: "white"
                          })
                        ]
                      }),
                      (0, d.jsx)("defs", {
                        children: (0, d.jsx)("clipPath", {
                          id: "clip0_11_431",
                          children: (0, d.jsx)("path", {
                            d: "M0 8C0 3.58172 3.58172 0 8 0H72C76.4183 0 80 3.58172 80 8V72C80 76.4183 76.4183 80 72 80H8C3.58172 80 0 76.4183 0 72V8Z",
                            fill: "white"
                          })
                        })
                      })
                    ]
                  }),
                  19: (t10) => (0, d.jsxs)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 80,
                    viewBox: "0 0 80 80",
                    width: 80,
                    ...t10,
                    children: [
                      (0, d.jsxs)("g", {
                        clipPath: "url(#clip0_11_432)",
                        children: [
                          (0, d.jsx)("path", {
                            d: "M70.9821 80H9.01667C4.03467 80 0 75.9654 0 70.9836V9.01891C0 4.03825 4.03467 0 9.01667 0H70.982C75.9628 0 79.9999 4.03825 79.9999 9.01891V70.9836C79.9999 75.9654 75.9628 80 70.9821 80Z",
                            fill: "#D71E28"
                          }),
                          (0, d.jsx)("path", {
                            d: "M16.9479 67.5627V27.8024H12.5435L18.2488 12.4335H29.2859V67.5627H16.9479ZM65.4703 12.4347H34.8126C34.1329 12.4347 33.5801 12.9862 33.5801 13.666V41.4284C33.5801 42.7911 34.6799 43.8958 36.0365 43.8958H54.7245V57.1733H45.9916V49.9557H34.012V66.3341C34.012 67.0138 34.5636 67.5653 35.2432 67.5653H65.4702C66.1499 67.5653 66.7013 67.0138 66.7013 66.3341V13.666C66.7013 12.9862 66.1498 12.4347 65.4701 12.4347H65.4703ZM45.7788 23.8064C45.7788 23.1267 46.3316 22.5753 47.0112 22.5753H53.3477C54.0273 22.5753 54.5801 23.1267 54.5801 23.8064V33.4539C54.5801 34.1336 54.0273 34.6851 53.3477 34.6851H47.0112C46.3316 34.6851 45.7788 34.1336 45.7788 33.4539V23.8064Z",
                            fill: "white"
                          })
                        ]
                      }),
                      (0, d.jsx)("defs", {
                        children: (0, d.jsx)("clipPath", {
                          id: "clip0_11_432",
                          children: (0, d.jsx)("path", {
                            d: "M0 8C0 3.58172 3.58172 0 8 0H72C76.4183 0 80 3.58172 80 8V72C80 76.4183 76.4183 80 72 80H8C3.58172 80 0 76.4183 0 72V8Z",
                            fill: "white"
                          })
                        })
                      })
                    ]
                  })
                },
                [l.w.KR_BROADCAST]: {
                  ALL: (t10) => (0, d.jsxs)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 72,
                    viewBox: "0 0 72 72",
                    width: 72,
                    ...t10,
                    children: [
                      (0, d.jsx)("path", {
                        d: "M35.5 1.5C44.7047 1.5 52.2869 4.51516 58.8594 10.7764C66.0054 17.5841 69.4999 25.7012 69.5 35.4658C69.5 45.2306 66.0056 53.3484 58.8594 60.1562C54.0495 64.7383 48.6727 67.5441 42.0859 68.9033C39.3819 69.4612 34.1313 69.6762 31.4492 69.3408C23.5185 68.3491 16.6397 64.8642 10.9102 58.9121C4.5329 52.2872 1.5 44.7366 1.5 35.4658C1.50008 25.7012 4.9946 17.5841 12.1406 10.7764C18.7131 4.51516 26.2953 1.5 35.5 1.5Z",
                        fill: "#FFCB00",
                        stroke: "white",
                        strokeWidth: 3
                      }),
                      (0, d.jsx)("path", {
                        d: "M24.3628 49.0381H29.7446L21.8004 24.0555C21.4875 23.0538 21.025 22.4671 20.4129 22.2955C19.8007 22.1239 19.466 22.0381 19.4086 22.0381H15.8217C15.793 22.0381 15.4369 22.1239 14.7535 22.2955C14.0701 22.4671 13.572 23.0682 13.2592 24.0987L5.18726 49.0381H10.5677L12.4472 42.8144H22.4846L24.3628 49.0381ZM13.8144 38.35L17.0599 27.447H17.8719L21.1604 38.35H13.8144ZM36.1416 44.1021V22.0381H30.9307V45.9911C30.9307 46.9063 31.187 47.643 31.6997 48.201C32.2123 48.7591 32.8957 49.0381 33.7499 49.0381H47.4173V44.1021H36.1416ZM55.9116 44.1021V22.0381H50.7006V45.9911C50.7006 46.9063 50.9569 47.643 51.4696 48.201C51.9823 48.7591 52.6657 49.0381 53.5198 49.0381H67.1873V44.1021H55.9116Z",
                        fill: "black"
                      })
                    ]
                  }),
                  7: (t10) => (0, d.jsxs)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 72,
                    viewBox: "0 0 72 72",
                    width: 72,
                    ...t10,
                    children: [
                      (0, d.jsx)("path", {
                        d: "M35.04 1.5C44.1201 1.5 51.5992 4.47658 58.083 10.6592C65.133 17.3817 68.58 25.3971 68.5801 35.04C68.5801 44.683 65.1329 52.6983 58.083 59.4209C53.3381 63.9454 48.0347 66.7155 41.5371 68.0576C38.8703 68.6085 33.689 68.8203 31.0439 68.4893C23.221 67.51 16.4356 64.0699 10.7832 58.1924C4.49191 51.6505 1.5 44.1953 1.5 35.04C1.50003 25.397 4.94797 17.3818 11.998 10.6592C18.4818 4.47674 25.9601 1.50002 35.04 1.5Z",
                        fill: "#FFCB00",
                        stroke: "white",
                        strokeWidth: 3
                      }),
                      (0, d.jsx)("path", {
                        d: "M24.5044 18.9653V24.7483H41.4515L27.2526 55.8348H35.5549L49.179 25.0907V18.9653H24.5044Z",
                        fill: "black"
                      })
                    ]
                  }),
                  12: (t10) => (0, d.jsxs)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 72,
                    viewBox: "0 0 72 72",
                    width: 72,
                    ...t10,
                    children: [
                      (0, d.jsxs)("g", {
                        clipPath: "url(#clip0_666_54865)",
                        children: [
                          (0, d.jsx)("path", {
                            d: "M35.5918 1.5C44.8209 1.5 52.4233 4.52631 59.0137 10.8105C66.1793 17.6434 69.6845 25.7905 69.6846 35.5918C69.6846 45.3933 66.1795 53.5411 59.0137 60.374C54.1907 64.9729 48.8005 67.7892 42.1963 69.1533C39.485 69.7133 34.2197 69.9284 31.5303 69.5918C23.5785 68.5965 16.6807 65.0999 10.9355 59.126C4.54087 52.4766 1.5 44.8974 1.5 35.5918C1.50008 25.7904 5.00519 17.6434 12.1709 10.8105C18.7612 4.5264 26.3629 1.50007 35.5918 1.5Z",
                            fill: "#FFCB00",
                            stroke: "white",
                            strokeWidth: 3
                          }),
                          (0, d.jsx)("path", {
                            d: "M21.3917 18.6973L10.0535 27.4782L13.9488 32.3638L20.5203 27.1872V56.1476H28.1956V18.6973H21.3917Z",
                            fill: "black"
                          }),
                          (0, d.jsx)("path", {
                            d: "M34.1328 56.1472H59.9521V50.2732H44.0761C45.6662 48.7612 47.3237 47.1717 49.0487 45.5047C50.7736 43.8377 52.3531 42.1128 53.787 40.3299C55.2221 38.5458 56.4049 36.704 57.3354 34.8045C58.2659 32.9051 58.7311 30.9668 58.7311 28.9899C58.7311 27.1289 58.4498 25.5104 57.8873 24.1345C57.3247 22.7585 56.5205 21.605 55.4747 20.6739C54.3886 19.7831 53.0895 19.1146 51.5776 18.6685C50.0655 18.2226 48.379 17.9995 46.5181 17.9995C44.5411 17.9995 42.5641 18.232 40.5872 18.6969C38.6102 19.1619 36.7492 19.8404 35.0042 20.7325L35.6448 26.9544C36.9237 26.1404 38.3192 25.4329 39.8312 24.8319C41.3432 24.2309 42.9327 23.9304 44.5997 23.9304C46.1897 23.9304 47.6438 24.3471 48.9617 25.1806C50.2797 26.0141 50.9387 27.2839 50.9387 28.9899C50.9387 30.6959 50.2312 32.5859 48.8162 34.6599C47.4012 36.7338 45.7632 38.7593 43.9022 40.7362C42.0022 42.7132 40.1216 44.5159 38.2606 46.1445C36.3996 47.773 35.0237 49.0138 34.1328 49.8668V56.1472Z",
                            fill: "black"
                          })
                        ]
                      }),
                      (0, d.jsx)("defs", {
                        children: (0, d.jsx)("clipPath", {
                          id: "clip0_666_54865",
                          children: (0, d.jsx)("rect", { fill: "white", height: 72, width: 72 })
                        })
                      })
                    ]
                  }),
                  15: (t10) => (0, d.jsxs)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 72,
                    viewBox: "0 0 72 72",
                    width: 72,
                    ...t10,
                    children: [
                      (0, d.jsx)("path", {
                        d: "M35.4658 1.5C44.6607 1.5 52.2348 4.51461 58.8008 10.7754C65.9401 17.5831 69.4325 25.7006 69.4326 35.4658C69.4326 45.2312 65.9402 53.3485 58.8008 60.1562C53.9957 64.7381 48.6257 67.5442 42.0459 68.9033C39.3449 69.4612 34.0993 69.6761 31.4199 69.3408C23.4976 68.3492 16.6253 64.8649 10.9014 58.9131C4.53028 52.2882 1.5 44.7371 1.5 35.4658C1.50008 25.7006 4.99156 17.5831 12.1309 10.7754C18.6968 4.51446 26.2709 1.50007 35.4658 1.5Z",
                        fill: "#FFCB00",
                        stroke: "white",
                        strokeWidth: 3
                      }),
                      (0, d.jsx)("path", {
                        d: "M21.4366 18.9414L10.1873 27.8512L14.0521 32.8085L20.5721 27.5559V56.9414H28.1873V18.9414H21.4366Z",
                        fill: "black"
                      }),
                      (0, d.jsx)("path", {
                        d: "M59.1832 44.2364C59.1455 42.2251 58.8271 40.5136 58.228 39.102C57.629 37.6903 56.8271 36.5206 55.8224 35.5929C54.8566 34.7029 53.7458 34.0257 52.49 33.5612C51.2341 33.0968 49.9876 32.8457 48.7506 32.8079C47.437 32.73 46.2778 32.8167 45.2731 33.0681C44.2684 33.3196 43.4954 33.5804 42.9542 33.8507L43.0126 24.8017H57.9079V18.9414H35.6525L35.4773 40.2333H41.5055C41.6989 39.8462 42.4333 39.382 43.7086 38.8408C44.9839 38.2996 46.4134 38.3961 47.9971 39.1303C48.5384 39.3628 49.0118 39.6434 49.4175 39.9722C49.8231 40.3009 50.1804 40.6777 50.4894 41.1026C50.7983 41.5677 51.0301 42.0805 51.1846 42.6412C51.339 43.2018 51.4163 43.8109 51.4163 44.4683C51.4552 45.6675 51.2815 46.6732 50.8954 47.4852C50.5091 48.2973 49.9682 48.9742 49.2725 49.516C48.5378 50.0577 47.6681 50.4543 46.6634 50.7057C45.6587 50.9572 44.519 51.0829 43.2443 51.0829C41.5438 51.0829 40.0271 50.8604 38.694 50.4154C37.3608 49.9704 36.2114 49.5543 35.2456 49.1672L35.1873 55.8968C36.4632 56.1683 37.9222 56.4103 39.5642 56.6227C41.2063 56.8352 42.7808 56.9414 44.2879 56.9414C47.0319 56.9414 49.3603 56.6029 51.273 55.926C53.1857 55.2491 54.7405 54.3305 55.9374 53.1703C57.0966 52.049 57.937 50.7146 58.4589 49.1672C58.9807 47.6198 59.2221 45.9762 59.1832 44.2364Z",
                        fill: "black"
                      })
                    ]
                  }),
                  19: (t10) => (0, d.jsxs)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 72,
                    viewBox: "0 0 72 72",
                    width: 72,
                    ...t10,
                    children: [
                      (0, d.jsx)("path", {
                        d: "M35.5459 1.5C44.7696 1.5 52.3651 4.47874 58.9453 10.6582C66.0992 17.3765 69.5928 25.3819 69.5928 35.0078C69.5928 44.6338 66.0992 52.6391 58.9453 59.3574C54.1299 63.8795 48.745 66.6507 42.1455 67.9932C39.4356 68.5443 34.1754 68.7562 31.4873 68.4248C23.5404 67.4452 16.6507 64.0036 10.915 58.1299C4.5316 51.5928 1.5 44.1471 1.5 35.0078C1.5 25.3819 4.99355 17.3765 12.1475 10.6582C18.7275 4.47885 26.3224 1.5001 35.5459 1.5Z",
                        fill: "#FFCB00",
                        stroke: "white",
                        strokeWidth: 3
                      }),
                      (0, d.jsx)("path", {
                        d: "M20.8952 18.9434L9.57153 27.5801L13.4619 32.3855L20.0249 27.2939V55.7788H27.6904V18.9434H20.8952Z",
                        fill: "black"
                      }),
                      (0, d.jsx)("path", {
                        d: "M51.572 29.8033C51.572 30.718 51.4851 31.5948 51.3115 32.4338C51.1377 33.2728 50.8376 34.0164 50.4111 34.6646C49.9857 35.3127 49.4342 35.8277 48.7566 36.2093C48.0789 36.591 47.2563 36.7819 46.2886 36.7819C45.3587 36.7819 44.5646 36.5814 43.9065 36.1805C43.2484 35.7797 42.7066 35.2743 42.2813 34.6646C41.8547 34.0164 41.5351 33.2728 41.3224 32.4338C41.1097 31.5948 41.0034 30.7372 41.0034 29.8609C41.0034 29.0219 41.1097 28.2114 41.3224 27.4294C41.5351 26.6475 41.8352 25.9516 42.2228 25.3418C42.6481 24.6936 43.1899 24.1883 43.848 23.8258C44.5062 23.4634 45.2807 23.2821 46.1716 23.2821C47.1393 23.2821 47.962 23.4538 48.6396 23.797C49.3172 24.1403 49.8693 24.6168 50.2959 25.2266C50.7212 25.8375 51.0403 26.5337 51.253 27.3151C51.4656 28.0965 51.572 28.9259 51.572 29.8033ZM36.1826 48.6216L35.1954 54.5686C36.5506 55.0271 37.8961 55.361 39.2319 55.5705C40.5677 55.78 41.9516 55.8847 43.3837 55.8847C46.5196 55.8847 49.1235 55.2554 51.1954 53.9969C53.2672 52.7384 54.9028 51.1183 56.1021 49.1366C57.3026 47.1153 58.1448 44.8653 58.6287 42.3867C59.1125 39.9081 59.3544 37.4294 59.3544 34.9508C59.3544 32.7771 59.1804 30.6607 58.8325 28.6015C58.4845 26.5424 57.826 24.6931 56.8572 23.0534C55.8894 21.4522 54.5442 20.1655 52.8215 19.1932C51.0987 18.221 48.8821 17.7349 46.1716 17.7349C43.9644 17.7349 42.0479 18.0494 40.4221 18.6783C38.7962 19.3073 37.4604 20.1937 36.4147 21.3376C35.3301 22.5199 34.5266 23.9213 34.0043 25.5417C33.4821 27.1621 33.2209 28.9829 33.2209 31.0042C33.2209 32.6823 33.4726 34.2171 33.976 35.6089C34.4793 37.0006 35.2149 38.1922 36.1826 39.1837C37.1503 40.1367 38.3407 40.8896 39.7539 41.4424C41.167 41.9951 42.7834 42.2715 44.6031 42.2715C46.2301 42.2715 47.6533 41.9762 48.8727 41.3856C50.092 40.7951 51.1661 39.851 52.0948 38.5535L52.2118 38.6687C52.1728 40.0419 51.979 41.4051 51.6305 42.7585C51.2819 44.1118 50.759 45.3413 50.0619 46.4467C49.327 47.515 48.3885 48.3924 47.2465 49.079C46.1045 49.7655 44.6816 50.1088 42.9778 50.1088C41.6615 50.1088 40.4613 49.9657 39.3772 49.6794C38.2931 49.3932 37.2283 49.0406 36.1826 48.6216Z",
                        fill: "black"
                      })
                    ]
                  })
                }
              }, aY = "kat:absolute kat:top-8 kat:@lg:top-20 kat:left-8 kat:@md:left-20 kat:@lg:left-40", aQ = "kat:pt-12 kat:pb-12 kat:@md:pt-9 kat:@md:pb-9 kat:@lg:pt-10 kat:@lg:pb-10", aX = "kat:max-w-[400px] kat:@md:max-w-[600px] kat:@lg:max-w-[800px]", a0 = "kat:transition-opacity kat:duration-250", a1 = (0, tG.default)("kat:flex", "kat:max-w-880", "kat:flex-col", "kat:items-start", "kat:gap-4", "kat:self-stretch"), a4 = (0, tG.default)("kat:self-stretch", "kat:text-neutral-50", "kat:text-left", "kat:text-[10px] kat:@md:text-[16px]", "kat:not-italic", "kat:font-medium kat:@md:font-normal", "kat:leading-16 kat:@md:leading-22", "kat:select-none"), a2 = ({
                RatingIcon: t10,
                advisoryDescriptors: i10,
                advisoryComponentImages: a10 = [],
                primaryHeading: r10,
                secondaryHeading: s10,
                isVisible: n10,
                ariaLabel: o10
              }) => {
                if (!t10)
                  return null;
                let l2 = i10.join(", "), u2 = a10.length > 0;
                return u2 || r10 || s10 ? (0, d.jsxs)("div", {
                  "data-testid": "ratings-advisories-overlay",
                  className: (0, tG.default)(aY, "kat:flex kat:flex-col kat:items-start kat:gap-0 kat:@md:gap-8 kat:flex-[1_0_0]", aQ, aX, a0, n10 ? "kat:opacity-100" : "kat:opacity-0 kat:pointer-events-none"),
                  "aria-label": o10,
                  "aria-hidden": !n10,
                  children: [
                    (0, d.jsxs)("div", {
                      "data-testid": "ratings-advisories-primary-row",
                      className: "kat:flex kat:items-start kat:gap-0 kat:@md:gap-8 kat:self-stretch kat:pt-2 kat:pb-2",
                      children: [
                        (0, d.jsx)("div", {
                          "data-testid": "rating-badge",
                          className: "kat:h-48 kat:shrink-0",
                          children: (0, d.jsx)(t10, { height: "100%", width: "auto" })
                        }),
                        u2 ? (0, d.jsx)("div", {
                          "data-testid": "image-advisory-descriptors",
                          "aria-hidden": true,
                          className: "kat:flex kat:items-start kat:gap-12",
                          children: a10.map((t11) => {
                            let i11 = t11.url.toString();
                            return (0, d.jsx)("div", {
                              "data-testid": "image-advisory-descriptor",
                              className: "kat:flex kat:flex-col kat:items-center kat:gap-4",
                              children: (0, d.jsx)("img", {
                                "data-testid": "image-advisory-descriptor-icon",
                                src: i11,
                                alt: t11.altText,
                                className: "kat:block kat:h-48 kat:w-auto kat:shrink-0"
                              })
                            }, i11);
                          })
                        }) : null
                      ]
                    }),
                    (l2 || r10 || s10) && (0, d.jsxs)("div", {
                      "data-testid": "ratings-advisories-setting-block",
                      className: a1,
                      children: [
                        l2 && (0, d.jsx)("span", {
                          "data-testid": "advisory-descriptors",
                          "aria-hidden": true,
                          className: (0, tG.default)("kat:text-neutral-50", "kat:text-left", "kat:text-[14px]", "kat:not-italic", "kat:font-bold", "kat:leading-20", "kat:tracking-[-0.42px]", "kat:@md:text-[16px] kat:@md:leading-30 kat:@md:tracking-[-0.72px]", "kat:[font-feature-settings:'liga'_off,'clig'_off]", "kat:self-stretch kat:line-clamp-2", "kat:select-none"),
                          children: l2
                        }),
                        r10 && (0, d.jsx)("p", {
                          "data-testid": "supplementary-primary-heading",
                          "aria-hidden": true,
                          className: a4,
                          children: r10
                        }),
                        s10 && (0, d.jsx)("p", {
                          "data-testid": "supplementary-secondary-heading",
                          "aria-hidden": true,
                          className: a4,
                          children: s10
                        })
                      ]
                    })
                  ]
                }) : (0, d.jsxs)("div", {
                  "data-testid": "ratings-advisories-overlay",
                  className: (0, tG.default)(aY, "kat:flex kat:items-center", "kat:gap-0 kat:@md:gap-8", aQ, aX, a0, n10 ? "kat:opacity-100" : "kat:opacity-0 kat:pointer-events-none"),
                  "aria-label": o10,
                  "aria-hidden": !n10,
                  children: [
                    (0, d.jsx)("div", {
                      "data-testid": "rating-badge",
                      className: "kat:h-48 kat:shrink-0",
                      children: (0, d.jsx)(t10, { height: "100%", width: "auto" })
                    }),
                    l2 && (0, d.jsx)("span", {
                      "data-testid": "advisory-descriptors",
                      "aria-hidden": true,
                      className: (0, tG.default)("kat:text-neutral-50", "kat:flex-1", "kat:text-left", "kat:text-[14px]", "kat:font-bold", "kat:leading-20", "kat:tracking-[-0.42px]", "kat:@md:text-[16px] kat:@lg:text-[24px]", "kat:@md:leading-22 kat:@lg:leading-30", "kat:@md:tracking-[-0.48px] kat:@lg:tracking-[-0.72px]", "kat:line-clamp-2", "kat:select-none"),
                      children: l2
                    })
                  ]
                });
              }, a3 = ({ isVisible: t10 }) => {
                let {
                  ratingDisplayName: i10,
                  advisoryComponents: a10,
                  advisoryComponentImages: r10,
                  primaryHeading: s10,
                  secondaryHeading: n10,
                  ratingSystem: o10,
                  isReady: l2
                } = aq(), { t: u2 } = iy(), { accessibilityAnnouncer: c2 } = im(), p2 = (0, h.useRef)(false), f2 = (0, h.useMemo)(() => [...r10.map((t11) => t11.altText), ...a10].join(", "), [r10, a10]), g2 = (0, h.useMemo)(() => i10 ? f2.length > 0 ? u2("ratings.announcement.ratedFor", { rating: i10, descriptors: f2 }) : u2("ratings.announcement.ratedOnly", { rating: i10 }) : u2("ratings.announcement.noRating"), [i10, f2, u2]);
                return (0, h.useEffect)(() => {
                  t10 && l2 && i10 && !p2.current && (c2.announce(g2, "polite"), p2.current = true);
                }, [t10, l2, i10, g2, c2]), (0, h.useEffect)(() => {
                  l2 || (p2.current = false);
                }, [l2]), (0, d.jsx)(a2, {
                  RatingIcon: o10 !== undefined && i10 ? function(t11, i11) {
                    let a11 = aJ[t11];
                    if (a11)
                      return a11[i11];
                  }(o10, i10) : undefined,
                  advisoryDescriptors: a10,
                  advisoryComponentImages: r10,
                  primaryHeading: s10,
                  secondaryHeading: n10,
                  isVisible: t10,
                  ariaLabel: g2
                });
              }, a5 = ({ isRnaActive: t10 }) => {
                let { isVisible: i10 } = aa(), { isAnyMenuOpen: a10 } = iL(), r10 = i10 || a10;
                return { topVisible: r10, bottomVisible: r10, rnaVisible: t10, topGradientVisible: r10 || t10 };
              }, a6 = ({ icon: t10, ariaLabel: i10, onClick: a10, testId: r10 = "next-episode-button" }) => (0, d.jsx)(iY, { Icon: t10, label: i10, onClick: a10, "data-testid": r10 }), a7 = () => {
                let {
                  viewModelContainer: { nextEpisodeVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(false);
                return (0, h.useEffect)(() => {
                  let i11 = t10.isVisible$.subscribe((t11) => {
                    a10(t11);
                  });
                  return () => {
                    i11.unsubscribe();
                  };
                }, [t10]), {
                  isVisible: i10,
                  loadNextEpisode: (0, h.useCallback)(() => {
                    t10.loadNextEpisode();
                  }, [t10])
                };
              }, a8 = () => {
                let { isVisible: t10, loadNextEpisode: i10 } = a7(), { t: a10 } = iy(), r10 = (0, h.useCallback)(() => {
                  t10 && i10();
                }, [t10, i10]);
                return i1({ shortcut: tK.NextEpisode, handleShortcut: r10 }), t10 ? (0, d.jsx)("div", {
                  className: "kat:relative",
                  children: (0, d.jsx)(a6, { icon: (0, d.jsx)(it, {}), ariaLabel: a10("nextEpisode.ariaLabel"), onClick: i10 })
                }) : null;
              }, aPiP = () => {
                let [t10, i10] = (0, h.useState)(false), a10 = "u" > typeof document && document.pictureInPictureEnabled;
                (0, h.useEffect)(() => {
                  if (!a10)
                    return;
                  let t11 = document.querySelector("video");
                  if (!t11)
                    return;
                  t11.hasAttribute("disablePictureInPicture") && t11.removeAttribute("disablePictureInPicture");
                  let r11 = () => {
                    i10(true);
                  }, s11 = () => {
                    i10(false);
                  };
                  return t11.addEventListener("enterpictureinpicture", r11), t11.addEventListener("leavepictureinpicture", s11), () => {
                    t11.removeEventListener("enterpictureinpicture", r11), t11.removeEventListener("leavepictureinpicture", s11);
                  };
                }, [a10]);
                let r10 = (0, h.useCallback)(() => {
                  let t11 = document.querySelector("video");
                  t11 && (t11.hasAttribute("disablePictureInPicture") && t11.removeAttribute("disablePictureInPicture"), document.pictureInPictureElement ? document.exitPictureInPicture().catch((t12) => {
                    console.warn(t12);
                  }) : t11.requestPictureInPicture().catch((t12) => {
                    console.warn(t12);
                  }));
                }, []);
                if (!a10)
                  return null;
                let s10 = (0, d.jsxs)("svg", {
                  width: 20,
                  height: 20,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    (0, d.jsx)("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
                    (0, d.jsx)("rect", { x: "12", y: "14", width: "7", height: "5", rx: "1", ry: "1" })
                  ]
                });
                return (0, d.jsx)(iY, { Icon: s10, label: t10 ? "Exit Picture-in-Picture" : "Enter Picture-in-Picture", onClick: r10, "data-testid": "pip-button" });
              }, aOctopusFonts = {
                "Adobe Arabic": "AdobeArabic-Bold.woff2",
                "Andale Mono": "andalemo.woff2",
                Arial: "arial.woff2",
                "Arial Bold": "arialbd.woff2",
                "Arial Bold Italic": "arialbi.woff2",
                "Arial Italic": "ariali.woff2",
                "Arial Unicode MS": "arialuni.woff2",
                "Arial Black": "ariblk.woff2",
                "Comic Sans MS": "comic.woff2",
                "Comic Sans MS Bold": "comicbd.woff2",
                Consolas: "Consolas.woff2",
                "Courier New": "cour.woff2",
                "Courier New Bold": "courbd.woff2",
                "Courier New Bold Italic": "courbi.woff2",
                "Courier New Italic": "couri.woff2",
                "DejaVu Sans": "DejaVuSans.woff2",
                "DejaVu Sans Bold": "DejaVuSans-Bold.woff2",
                "DejaVu Sans Oblique": "DejaVuSans-Oblique.woff2",
                "DejaVu Sans Mono": "DejaVuSansMono.woff2",
                "DejaVu Sans Mono Bold": "DejaVuSansMono-Bold.woff2",
                Gautami: "gautami.woff2",
                Georgia: "georgia.woff2",
                "Georgia Bold": "georgiab.woff2",
                "Georgia Italic": "georgiai.woff2",
                Impact: "impact.woff2",
                Mangal: "MANGAL.woff2",
                "Meera Inimai": "MeeraInimai-Regular.woff2",
                "Noto Sans Tamil": "NotoSansTamilVariable.woff2",
                "Noto Sans Telugu": "NotoSansTeluguVariable.woff2",
                "Noto Sans Thai": "NotoSansThai.woff2",
                Rubik: "Rubik-Regular.woff2",
                "Rubik Bold": "Rubik-Bold.woff2",
                "Rubik Italic": "Rubik-Italic.woff2",
                "Rubik Medium": "Rubik-Medium.woff2",
                Tahoma: "tahoma.woff2",
                "Times New Roman": "times.woff2",
                "Times New Roman Bold": "timesbd.woff2",
                "Times New Roman Italic": "timesi.woff2",
                "Trebuchet MS": "trebuc.woff2",
                "Trebuchet MS Bold": "trebucbd.woff2",
                Verdana: "verdana.woff2",
                "Verdana Bold": "verdanab.woff2",
                Vrinda: "vrinda.woff2",
                "Vrinda Bold": "vrindab.woff2",
                Webdings: "webdings.woff2"
              }, aOctopusBase = () => window.CROPTIX_BASE_URL || "", aOctopusFontUrls = () => {
                let t10 = {};
                return Object.keys(aOctopusFonts).forEach((i10) => {
                  t10[i10.toLowerCase()] = aOctopusBase() + "fonts/" + aOctopusFonts[i10];
                }), t10;
              }, aFixSubs = async (t10) => {
                let r10 = await fetch(t10), s10 = await r10.text();
                return s10.includes("DilleniaUPC") && (s10 = s10.replace(/Style:\s*Font1,DilleniaUPC,85,[^\n]*/g, "Style: Default,Noto Sans Thai,30,&H00FFFFFF,&H0000FFFF,&H00000000,&H7F404040,-1,0,0,0,100,100,0,0,1,2,1,2,0020,0020,0022,0").replace(/PlayResX:\s*1920/g, "PlayResX: 640").replace(/PlayResY:\s*1080/g, "PlayResY: 360")), s10;
              }, aTextLang = (t10) => String(t10 || "").toLowerCase(), aTextMatches = (t10, i10) => {
                let a10 = aTextLang(i10?.language);
                if (!a10 || a10 === "none")
                  return false;
                let r10 = [t10?.language, t10?.srclang, t10?.label].map(aTextLang).filter(Boolean);
                return r10.some((t11) => t11 === a10 || t11.split("-")[0] === a10.split("-")[0]);
              }, aApplyNativeTextTracks = (t10, i10 = "native") => {
                try {
                  let a10 = document.querySelector("video"), r10 = 0, s10 = 0, n10 = [];
                  if (a10?.textTracks)
                    for (let o10 = 0;o10 < a10.textTracks.length; o10++) {
                      let d2 = a10.textTracks[o10], l2 = !!t10 && aTextMatches(d2, t10);
                      d2.mode = l2 ? "showing" : "disabled", l2 && r10++, d2.mode === "showing" && s10++;
                      n10.push({ language: d2.language, label: d2.label, kind: d2.kind, mode: d2.mode });
                    }
                } catch (t11) {
                  console.warn("[CrOptix][Subtitles] Failed to update native textTracks.", t11);
                }
              }, aNativeTextVisible = (t10) => {
                try {
                  let i10 = document.querySelector("video");
                  if (!i10?.textTracks)
                    return false;
                  for (let a10 = 0;a10 < i10.textTracks.length; a10++) {
                    let r10 = i10.textTracks[a10];
                    if (r10.mode !== "disabled" && (!t10 || aTextMatches(r10, t10)))
                      return true;
                  }
                } catch (t11) {}
                return false;
              }, aClearManualVttTrack = (t10) => {
                let i10 = t10?.current;
                if (!i10)
                  return;
                try {
                  i10.element?.parentNode && i10.element.parentNode.removeChild(i10.element);
                } catch (t11) {}
                try {
                  i10.url && i10.revoke && URL.revokeObjectURL(i10.url);
                } catch (t11) {}
                t10.current = null;
              }, aClearCueOverlay = (t10) => {
                let i10 = t10?.current;
                if (!i10)
                  return;
                try {
                  i10.cleanup?.();
                } catch (t11) {}
                try {
                  i10.element?.parentNode && i10.element.parentNode.removeChild(i10.element);
                } catch (t11) {}
                t10.current = null;
              }, aDisposeOctopus = (t10, i10 = "cleanup") => {
                if (!t10)
                  return;
                try {
                  if (typeof t10.dispose == "function")
                    return void t10.dispose();
                } catch (t11) {
                  console.warn("[CrOptix] Failed to dispose SubtitleOctopus during " + i10 + ".", t11);
                }
                try {
                  t10.worker && typeof t10.worker.terminate == "function" && t10.worker.terminate();
                } catch (t11) {}
                try {
                  t10.canvasParent?.parentNode && t10.canvasParent.parentNode.removeChild(t10.canvasParent);
                } catch (t11) {}
              }, aRevokeObjectUrlSoon = (t10) => {
                t10 && setTimeout(() => {
                  try {
                    URL.revokeObjectURL(t10);
                  } catch (t11) {}
                }, 30000);
              }, aEnsureCueOverlay = (t10, i10) => {
                let a10 = document.querySelector("video");
                if (!a10 || !t10)
                  return false;
                i10.current?.trackKey !== `${t10.language || ""}|${t10.displayName || ""}` && aClearCueOverlay(i10);
                if (!i10.current) {
                  let r11 = document.createElement("div");
                  r11.className = "croptix-vtt-cue-overlay", Object.assign(r11.style, {
                    position: "absolute",
                    left: "5%",
                    right: "5%",
                    bottom: "8%",
                    zIndex: "2147483647",
                    pointerEvents: "none",
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "min(4.6vw, 34px)",
                    lineHeight: "1.25",
                    fontWeight: "700",
                    textShadow: "rgb(0, 0, 0) 2px 2px 3px, rgb(0, 0, 0) -2px -2px 3px, rgb(0, 0, 0) 2px -2px 3px, rgb(0, 0, 0) -2px 2px 3px",
                    whiteSpace: "pre-wrap"
                  });
                  let s11 = a10.parentElement || a10;
                  getComputedStyle(s11).position === "static" && (s11.style.position = "relative");
                  s11.appendChild(r11);
                  i10.current = { element: r11, trackKey: `${t10.language || ""}|${t10.displayName || ""}`, listeners: [], cleanup: null };
                }
                let r10 = i10.current, s10 = () => {
                  let i11 = [];
                  try {
                    if (a10.textTracks)
                      for (let r11 = 0;r11 < a10.textTracks.length; r11++) {
                        let s11 = a10.textTracks[r11];
                        if (!aTextMatches(s11, t10))
                          continue;
                        s11.mode = "hidden";
                        if (s11.activeCues)
                          for (let t11 = 0;t11 < s11.activeCues.length; t11++) {
                            let a11 = s11.activeCues[t11];
                            i11.push(String(a11.text || "").replace(/<[^>]+>/g, "").trim());
                          }
                      }
                  } catch (t11) {
                    console.warn("[CrOptix][Subtitles] Failed to read active VTT cues.", t11);
                  }
                  r10.element.textContent = i11.filter(Boolean).join(`
`);
                }, n10 = () => {
                  r10.listeners.forEach(({ track: t11, handler: i11 }) => {
                    try {
                      t11.removeEventListener("cuechange", i11);
                    } catch (t12) {}
                  });
                  r10.listeners = [];
                  try {
                    if (a10.textTracks)
                      for (let i11 = 0;i11 < a10.textTracks.length; i11++) {
                        let o11 = a10.textTracks[i11];
                        if (aTextMatches(o11, t10)) {
                          o11.mode = "hidden";
                          o11.addEventListener("cuechange", s10);
                          r10.listeners.push({ track: o11, handler: s10 });
                        }
                      }
                  } catch (t11) {
                    console.warn("[CrOptix][Subtitles] Failed to attach VTT cue listeners.", t11);
                  }
                  s10();
                }, o10 = [0, 250, 750, 1500].map((t11) => setTimeout(n10, t11));
                return r10.cleanup = () => {
                  o10.forEach(clearTimeout);
                  r10.listeners.forEach(({ track: t11, handler: i11 }) => {
                    try {
                      t11.removeEventListener("cuechange", i11);
                    } catch (t12) {}
                  });
                  r10.listeners = [];
                }, true;
              }, aEnsureManualVttTrack = async (t10, i10) => {
                let a10 = document.querySelector("video"), r10 = t10?.externalTextUrl?.toString?.();
                if (!a10 || !r10)
                  return false;
                if (i10.current?.sourceUrl === r10)
                  return aApplyNativeTextTracks(t10, "manual-vtt-existing"), true;
                if (i10.current?.failedSourceUrl === r10)
                  return false;
                aClearManualVttTrack(i10);
                let s10 = r10, n10 = false;
                try {
                  let t11 = await fetch(r10, { credentials: "omit" });
                  if (!t11.ok)
                    throw new Error(`HTTP ${t11.status}`);
                  s10 = URL.createObjectURL(new Blob([await t11.text()], { type: "text/vtt" }));
                  n10 = true;
                } catch (t11) {
                  i10.current = { failedSourceUrl: r10 };
                  return console.warn("[CrOptix][Subtitles] Failed to fetch VTT for manual native track; skipping DOM track to avoid CORS/security errors.", t11), false;
                }
                let o10 = document.createElement("track");
                return o10.kind = "captions", o10.srclang = t10.language || "", o10.label = t10.displayName || t10.language || "CC", o10.default = true, o10.setAttribute("data-croptix-vtt", "true"), o10.src = s10, a10.appendChild(o10), i10.current = { element: o10, url: s10, revoke: n10, sourceUrl: r10 }, o10.addEventListener("load", () => aApplyNativeTextTracks(t10, "manual-vtt-load"), { once: true }), setTimeout(() => aApplyNativeTextTracks(t10, "manual-vtt-create"), 0), setTimeout(() => aApplyNativeTextTracks(t10, "manual-vtt-settle"), 250), true;
              }, aFindShakaTextTrack = (t10, i10) => {
                let a10 = t10?.getTextTracks?.() || [];
                return a10.find((t11) => aTextMatches(t11, i10) && t11.active) || a10.find((t11) => aTextMatches(t11, i10) && (t11.kind === "caption" || Array.isArray(t11.roles) && t11.roles.includes("caption"))) || a10.find((t11) => aTextMatches(t11, i10) && Array.isArray(t11.roles) && t11.roles.length > 0) || a10.find((t11) => aTextMatches(t11, i10));
              }, aActivateShakaTextTrack = (t10, i10, a10 = "initial") => {
                if (!t10 || !i10)
                  return;
                let r10 = aFindShakaTextTrack(t10, i10);
                try {
                  r10 && typeof t10.selectTextTrack == "function" && t10.selectTextTrack(r10);
                  !r10 && typeof t10.selectTextLanguage == "function" && t10.selectTextLanguage(i10.language, i10.role === l.x.CLOSED_CAPTION ? "caption" : undefined);
                  typeof t10.setTextTrackVisibility == "function" && t10.setTextTrackVisibility(true);
                } catch (t11) {
                  console.warn("[CrOptix][Subtitles] Failed to activate Shaka CC/VTT track.", t11);
                }
              }, aSetNativeTextTracks = (t10, i10) => {
                try {
                  let a10 = i10?._findShakaPlayer?.();
                  if (a10 && typeof a10.getTextTracks == "function") {
                    if (t10) {
                      aActivateShakaTextTrack(a10, t10);
                      setTimeout(() => {
                        let i11 = aFindShakaTextTrack(a10, t10), r10 = a10.getTextTracks?.().some((t11) => t11.active);
                        (!r10 || i11 && !i11.active) && aActivateShakaTextTrack(a10, t10, "retry");
                        aApplyNativeTextTracks(t10, "shaka-retry");
                      }, 250);
                    } else
                      typeof a10.setTextTrackVisibility == "function" && a10.setTextTrackVisibility(false);
                  }
                } catch (t11) {
                  console.warn("[CrOptix][Subtitles] Failed to activate Shaka CC/VTT track.", t11);
                }
                aApplyNativeTextTracks(t10, "native");
              }, aOctopusRenderer = () => {
                let {
                  viewModelContainer: { trackSelectionVM: t10, settingsVM: q2 }
                } = im(), [i10, a10] = (0, h.useState)(undefined), r10 = (0, h.useRef)(null), s10 = (0, h.useRef)(null), u2 = (0, h.useRef)(null), c2 = (0, h.useRef)(null), pToken = (0, h.useRef)(0), n10 = (0, h.useCallback)((t11 = "cleanup") => {
                  pToken.current += 1;
                  let i11 = r10.current;
                  r10.current = null;
                  aDisposeOctopus(i11, t11);
                  aRevokeObjectUrlSoon(s10.current);
                  s10.current = null;
                  aClearManualVttTrack(u2);
                  aClearCueOverlay(c2);
                }, []);
                return (0, h.useEffect)(() => {
                  let i11 = t10.activeTextTrack$.subscribe(a10);
                  t10._activeTextTrack && a10(t10._activeTextTrack);
                  return () => {
                    i11.unsubscribe();
                  };
                }, [t10]), (0, h.useEffect)(() => {
                  let t11 = () => {
                    r10.current && typeof r10.current.resize == "function" && r10.current.resize();
                  };
                  window.addEventListener("resize", t11);
                  let i11 = document.querySelector("video"), a11 = null;
                  return i11?.parentElement && "u" > typeof ResizeObserver && (a11 = new ResizeObserver(t11), a11.observe(i11.parentElement)), () => {
                    window.removeEventListener("resize", t11), a11 && a11.disconnect();
                  };
                }, []), (0, h.useEffect)(() => {
                  let t11 = (t12) => {
                    let i12 = String(t12?.message || t12?.error?.message || ""), a11 = t12?.target?.constructor?.name === "Worker";
                    (i12.includes("Worker error: [object ErrorEvent]") || i12.includes("FS error") || a11 && i12.includes("Script error")) && (console.warn("[CrOptix] Suppressed SubtitleOctopus worker crash event.", t12.error || t12.message), t12.preventDefault?.(), t12.stopImmediatePropagation?.());
                  }, i11 = (t12) => {
                    let i12 = String(t12?.reason?.message || t12?.reason || "");
                    (i12.includes("Worker error: [object ErrorEvent]") || i12.includes("FS error")) && (console.warn("[CrOptix] Suppressed SubtitleOctopus worker rejection.", t12.reason), t12.preventDefault?.(), t12.stopImmediatePropagation?.());
                  };
                  return window.addEventListener("error", t11, true), window.addEventListener("unhandledrejection", i11, true), () => {
                    window.removeEventListener("error", t11, true);
                    window.removeEventListener("unhandledrejection", i11, true);
                  };
                }, []), (0, h.useEffect)(() => {
                  if (!i10 || !i10.externalTextUrl || i10.role === l.x.CLOSED_CAPTION) {
                    n10("track cleared");
                    if (i10?.role === l.x.CLOSED_CAPTION) {
                      aSetNativeTextTracks(i10, q2);
                      aClearManualVttTrack(u2);
                      aClearCueOverlay(c2);
                      return () => {
                        aClearManualVttTrack(u2);
                        aClearCueOverlay(c2);
                      };
                    }
                    aSetNativeTextTracks(null, q2);
                    return;
                  }
                  r10.current && n10("track switch");
                  let a11 = false, o10 = i10.externalTextUrl.toString(), p2 = ++pToken.current;
                  return (async () => {
                    try {
                      let d2 = t10._player?.playerOrchestrator?.tracksOrchestrator?._currentVideoModel, u3 = await aFixSubs(o10, d2, i10);
                      if (a11 || p2 !== pToken.current)
                        return;
                      let c3 = document.querySelector("video");
                      if (!c3 || p2 !== pToken.current)
                        return;
                      aSetNativeTextTracks(null, q2);
                      if (c3.textTracks)
                        for (let t11 = 0;t11 < c3.textTracks.length; t11++)
                          c3.textTracks[t11].mode = "hidden";
                      if (typeof SubtitlesOctopus === "undefined") {
                        console.warn("[CrOptix] SubtitlesOctopus is not available; subtitle track cannot be rendered.");
                        return;
                      }
                      let baseUrl = aOctopusBase() + "subtitle-octopus/", f2 = baseUrl + "subtitles-octopus-worker.js", g2 = aOctopusFontUrls(), v2 = `
var base = "` + baseUrl + `";
self.onerror = function(message) {
    if (String(message || "").indexOf("FS error") > -1) return true;
    return false;
};
self.onunhandledrejection = function(event) {
    var reason = String(event && event.reason && event.reason.message || event && event.reason || "");
    if (reason.indexOf("FS error") > -1) {
        event.preventDefault && event.preventDefault();
        return true;
    }
    return false;
};
var origFetch = self.fetch;
self.fetch = function(input, init) {
    var url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
    if (url.indexOf(".wasm") > -1 || url.indexOf(".data") > -1) {
        var fileName = url.split("/").pop();
        return origFetch(base + fileName, init);
    }
    return origFetch(input, init);
};
var Module = {
    locateFile: function(path, prefix) {
        if (path.indexOf(".wasm") > -1 || path.indexOf(".data") > -1) return base + path;
        return prefix + path;
    }
};
importScripts("` + f2 + `");
`, m2 = 0, y2 = () => {
                        if (a11 || p2 !== pToken.current)
                          return;
                        aRevokeObjectUrlSoon(s10.current);
                        s10.current = URL.createObjectURL(new Blob([v2], { type: "application/javascript" }));
                        r10.current = new SubtitlesOctopus({
                          video: c3,
                          subContent: u3,
                          workerUrl: s10.current,
                          wasmUrl: aOctopusBase() + "subtitle-octopus/subtitles-octopus-worker.wasm",
                          dataUrl: aOctopusBase() + "subtitle-octopus/subtitles-octopus-worker.data",
                          fonts: Object.values(g2),
                          availableFonts: g2,
                          fallbackFont: aOctopusBase() + "fonts/default.woff2",
                          debug: false,
                          onError: (t11) => {
                            console.error("[CrOptix] SubtitleOctopus error:", t11);
                            let i11 = r10.current;
                            r10.current = null;
                            try {
                              i11?.worker && typeof i11.worker.terminate == "function" && i11.worker.terminate();
                            } catch (t12) {
                              console.warn("[CrOptix] Failed to terminate broken SubtitleOctopus worker.", t12);
                            }
                            !a11 && p2 === pToken.current && m2++ < 1 && setTimeout(y2, 250);
                          }
                        });
                      };
                      y2();
                    } catch (t11) {
                      console.error("[CrOptix] Failed to load SubtitleOctopus subtitles:", t11);
                    }
                  })(), () => {
                    a11 = true;
                  };
                }, [i10, t10, q2, n10]), (0, h.useEffect)(() => () => {
                  n10("unmount");
                }, [n10]), null;
              }, aCustomShortcuts = () => {
                let {
                  viewModelContainer: { timelineScrubberVM: t10, jumpButtonsVM: i10, playPauseButtonVM: a10, trackSelectionVM: r10 }
                } = im(), { bump: showControls } = aa(), [s10, n10] = (0, h.useState)(0), [o10, l2] = (0, h.useState)(false), [u2, c2] = (0, h.useState)([]), [p2, f2] = (0, h.useState)(null);
                (0, h.useEffect)(() => {
                  let i11 = t10.duration$.subscribe(n10), s11 = a10.isPlaying$.subscribe((t11) => l2(!t11)), o11 = r10.availableTextTracks$.subscribe(c2), d2 = r10.activeTextTrack$.subscribe(f2);
                  return () => {
                    i11.unsubscribe(), s11.unsubscribe(), o11.unsubscribe(), d2.unsubscribe();
                  };
                }, [t10, a10, r10]);
                i1({ shortcut: tK.JumpBackward, handleShortcut: () => (i10.jumpBackward(), showControls()) }), i1({ shortcut: tK.JumpForward, handleShortcut: () => (i10.jumpForward(), showControls()) }), i1({ shortcut: tK.JumpBackward10, handleShortcut: () => (i10.jumpBackward10(), showControls()) }), i1({ shortcut: tK.JumpForward10, handleShortcut: () => (i10.jumpForward10(), showControls()) }), i1({
                  shortcut: tK.FrameBackward,
                  handleShortcut: () => {
                    o10 && i10.frameBackward(), showControls();
                  }
                }), i1({
                  shortcut: tK.FrameForward,
                  handleShortcut: () => {
                    o10 && i10.frameForward(), showControls();
                  }
                }), i1({ shortcut: tK.RestartEpisode, handleShortcut: () => (t10.setPosition(0), showControls()) }), i1({ shortcut: tK.SeekPercent1, handleShortcut: () => (t10.setPosition(s10 * 0.1), showControls()) }), i1({ shortcut: tK.SeekPercent2, handleShortcut: () => (t10.setPosition(s10 * 0.2), showControls()) }), i1({ shortcut: tK.SeekPercent3, handleShortcut: () => (t10.setPosition(s10 * 0.3), showControls()) }), i1({ shortcut: tK.SeekPercent4, handleShortcut: () => (t10.setPosition(s10 * 0.4), showControls()) }), i1({ shortcut: tK.SeekPercent5, handleShortcut: () => (t10.setPosition(s10 * 0.5), showControls()) }), i1({ shortcut: tK.SeekPercent6, handleShortcut: () => (t10.setPosition(s10 * 0.6), showControls()) }), i1({ shortcut: tK.SeekPercent7, handleShortcut: () => (t10.setPosition(s10 * 0.7), showControls()) }), i1({ shortcut: tK.SeekPercent8, handleShortcut: () => (t10.setPosition(s10 * 0.8), showControls()) }), i1({ shortcut: tK.SeekPercent9, handleShortcut: () => (t10.setPosition(s10 * 0.9), showControls()) }), i1({
                  shortcut: tK.ToggleSubs,
                  handleShortcut: () => {
                    if (p2 && p2.language !== "none") {
                      let t11 = u2.find((t12) => t12.language === "none");
                      t11 && r10.setTextTrack(t11);
                    } else {
                      let t11 = u2.find((t12) => t12.language !== "none");
                      t11 && r10.setTextTrack(t11);
                    }
                  }
                });
              }, aStatsFormatTime = (t10) => {
                if (!Number.isFinite(t10))
                  return "—";
                let i10 = Math.max(0, Math.floor(t10)), a10 = Math.floor(i10 / 3600), r10 = Math.floor(i10 % 3600 / 60), s10 = String(i10 % 60).padStart(2, "0");
                return a10 ? `${a10}:${String(r10).padStart(2, "0")}:${s10}` : `${r10}:${s10}`;
              }, aStatsFormatBitrate = (t10) => {
                let i10 = Number(t10);
                return Number.isFinite(i10) && i10 > 0 ? i10 >= 1e6 ? `${(i10 / 1e6).toFixed(2)} Mbps` : `${Math.round(i10 / 1000)} Kbps` : "—";
              }, aStatsText = (t10, i10, aActualPlaybackRate, aActualVolume, aActualMuted) => {
                let a10 = t10?._rootView?.querySelector("video");
                if (!a10)
                  return `Stats for Nerds

Waiting for video…`;
                let r10 = {}, s10;
                try {
                  let t11 = i10?._getShakaPlayer?.();
                  r10 = t11?.getStats?.() || {}, s10 = t11?.getVariantTracks?.()?.find((t12) => t12.active);
                } catch (t11) {}
                let o10 = {};
                try {
                  o10 = a10.getVideoPlaybackQuality?.() || {};
                } catch (t11) {}
                let l2 = 0;
                try {
                  for (let t11 = 0;t11 < a10.buffered.length; t11++)
                    if (a10.currentTime >= a10.buffered.start(t11) - 0.1 && a10.currentTime <= a10.buffered.end(t11)) {
                      l2 = Math.max(0, a10.buffered.end(t11) - a10.currentTime);
                      break;
                    }
                } catch (t11) {}
                let u2 = t10?._rootView?.getBoundingClientRect?.() || { width: 0, height: 0 }, c2 = window.devicePixelRatio || 1, h2 = Number(r10.decodedFrames ?? o10.totalVideoFrames ?? a10.webkitDecodedFrameCount ?? 0), p2 = Number(r10.droppedFrames ?? o10.droppedVideoFrames ?? a10.webkitDroppedFrameCount ?? 0), f2 = h2 > 0 ? ` (${(p2 / h2 * 100).toFixed(2)}%)` : "", g2 = String(s10?.codecs || "").split(","), v2 = s10?.videoCodec || g2[0], m2 = s10?.audioCodec || g2[1], y2 = Number(s10?.frameRate || r10.frameRate), _2 = a10.ended ? "Ended" : a10.paused ? "Paused" : a10.readyState < 3 ? "Buffering" : "Playing", playbackRate = Number.isFinite(aActualPlaybackRate) ? aActualPlaybackRate : a10.playbackRate, volumePercent = Number.isFinite(aActualVolume) ? aActualVolume : 100 * a10.volume, isMuted = typeof aActualMuted == "boolean" ? aActualMuted : a10.muted, b2 = [
                  ["Viewport", `${Math.round(u2.width)}x${Math.round(u2.height)} @ ${c2.toFixed(2)}x`],
                  ["Resolution", `${a10.videoWidth || "—"}x${a10.videoHeight || "—"}${Number.isFinite(y2) && y2 > 0 ? ` @ ${y2.toFixed(2)} fps` : ""}`],
                  ["Codecs", [v2, m2].filter(Boolean).join(" / ") || "—"],
                  ["Bitrate", aStatsFormatBitrate(s10?.bandwidth || r10.streamBandwidth)],
                  ["Bandwidth", aStatsFormatBitrate(r10.estimatedBandwidth)],
                  ["Buffer health", `${l2.toFixed(2)} s`],
                  ["Frames", `${p2} dropped of ${h2}${f2}`],
                  ["Playback", `${aStatsFormatTime(a10.currentTime)} / ${aStatsFormatTime(a10.duration)} · ${playbackRate}x · ${_2}`],
                  ["Volume", isMuted ? "Muted" : `${Math.round(volumePercent)}%`]
                ];
                return ["Stats for Nerds", "", ...b2.map(([t11, i11]) => `${t11.padEnd(15)} ${i11}`)].join(`
`);
              }, aStatsForNerds = ({ isVisible: t10, menuLocation: i10, onToggle: a10, onClose: r10 }) => {
                let {
                  viewModelContainer: { timelineScrubberVM: s10, settingsVM: n10, playbackSpeedMenuVM: playbackSpeedVM, volumeVM }
                } = im(), [o10, l2] = (0, h.useState)("Stats for Nerds");
                (0, h.useEffect)(() => {
                  if (!t10)
                    return;
                  let i11, a11, r11, updateStats = () => l2(aStatsText(s10, n10, i11, a11, r11)), subscriptions = [
                    playbackSpeedVM.selectedRate$.subscribe((t11) => {
                      i11 = t11, updateStats();
                    }),
                    volumeVM.volumePercent$.subscribe((t11) => {
                      a11 = t11, updateStats();
                    }),
                    volumeVM.isMuted$.subscribe((t11) => {
                      r11 = t11, updateStats();
                    })
                  ], timer = setInterval(updateStats, 750);
                  return updateStats(), () => {
                    clearInterval(timer), subscriptions.forEach((t11) => t11.unsubscribe());
                  };
                }, [t10, s10, n10, playbackSpeedVM, volumeVM]);
                if (!t10 && !i10)
                  return null;
                return (0, d.jsxs)(d.Fragment, {
                  children: [
                    t10 && (0, d.jsx)("div", {
                      "data-testid": "stats-for-nerds-overlay",
                      "aria-live": "off",
                      style: {
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        zIndex: 40,
                        maxWidth: "calc(100% - 24px)",
                        boxSizing: "border-box",
                        padding: "10px 12px",
                        background: "rgba(0,0,0,.82)",
                        color: "#fff",
                        font: '12px/1.45 Consolas,"Courier New",monospace',
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        pointerEvents: "none",
                        textShadow: "0 1px 1px #000"
                      },
                      children: o10
                    }),
                    i10 && (0, d.jsxs)(d.Fragment, {
                      children: [
                        (0, d.jsx)("div", {
                          className: "kat:absolute kat:inset-0",
                          style: { zIndex: 1000 },
                          onClick: (t11) => {
                            t11.preventDefault(), t11.stopPropagation(), r10();
                          }
                        }),
                        (0, d.jsx)("div", {
                          role: "menu",
                          "data-testid": "stats-for-nerds-menu",
                          className: "kat:inline-flex kat:flex-col kat:absolute kat:z-[1001] kat:bg-neutral-700 kat:rounded-lg kat:shadow-lg kat:outline-none kat:w-max kat:overflow-hidden focus-visible:kat:outline-2 focus-visible:kat:outline-offset-2 focus-visible:kat:outline-white/50",
                          style: {
                            left: `${i10.x}px`,
                            top: `${i10.y}px`,
                            width: "320px",
                            maxWidth: "calc(100% - 16px)",
                            boxSizing: "border-box"
                          },
                          onClick: (t11) => {
                            t11.preventDefault(), t11.stopPropagation();
                          },
                          onKeyDown: (t11) => {
                            t11.key === "Escape" && (t11.preventDefault(), r10());
                          },
                          children: (0, d.jsx)("div", {
                            className: "kat:flex kat:flex-col kat:py-5",
                            children: (0, d.jsx)(iq, {
                              label: "Stats for Nerds",
                              checked: t10,
                              autoFocus: true,
                              onChange: a10
                            })
                          })
                        })
                      ]
                    })
                  ]
                });
              }, a9 = () => {
                aCustomShortcuts();
                let { accessibilityAnnouncer: t10 } = im(), { t: i10 } = iy(), { isVisible: a10, bump: r10 } = aa(), { isAnyMenuOpen: s10, closeAllMenus: n10 } = iL(), { isActive: o10 } = aq(), { topVisible: l2, bottomVisible: u2, rnaVisible: c2, topGradientVisible: p2 } = a5({ isRnaActive: o10 }), f2 = (0, h.useRef)(false), g2 = (0, h.useRef)(false), [statsVisible, setStatsVisible] = (0, h.useState)(false), [statsMenu, setStatsMenu] = (0, h.useState)(null), showStatsMenu = (0, h.useCallback)((t11) => {
                  t11.preventDefault(), t11.stopPropagation(), n10(), r10();
                  let i11 = t11.currentTarget.getBoundingClientRect(), a11 = Math.max(8, Math.min(t11.clientX - i11.left, i11.width - 328)), s11 = Math.max(8, Math.min(t11.clientY - i11.top, i11.height - 66));
                  setStatsMenu({ x: a11, y: s11 });
                }, [n10, r10]);
                return (0, h.useEffect)(() => {
                  (s10 || statsMenu) && r10();
                }, [s10, statsMenu, r10]), (0, h.useEffect)(() => {
                  a10 || (g2.current = true), a10 && g2.current && !f2.current && (f2.current = true, t10.announce(i10("controls.announcement.autohide")));
                }, [a10, t10, i10]), (0, d.jsxs)(aB, {
                  "data-testid": "player-controls-root",
                  className: `kat:relative kat:flex kat:flex-col kat:h-full kat:w-full kat:@container ${a10 || s10 || statsMenu ? "" : "kat:cursor-none"}`,
                  onContextMenuCapture: showStatsMenu,
                  children: [
                    (0, d.jsx)(aOctopusRenderer, {}),
                    (0, d.jsx)(ax, {}),
                    (0, d.jsx)(aStatsForNerds, {
                      isVisible: statsVisible,
                      menuLocation: statsMenu,
                      onClose: () => setStatsMenu(null),
                      onToggle: () => {
                        setStatsVisible((t11) => !t11), setStatsMenu(null);
                      }
                    }),
                    (0, d.jsx)(a3, { isVisible: c2 }),
                    s10 && (0, d.jsx)("div", {
                      "data-testid": "menu-background",
                      className: "kat:absolute kat:inset-0",
                      onClick: (t11) => {
                        n10(), t11.preventDefault();
                      }
                    }),
                    (0, d.jsx)(aF, {
                      isVisible: l2,
                      children: (0, d.jsx)("div", {
                        className: "kat:flex kat:shrink-0 kat:justify-end kat:items-start kat:gap-8 kat:@md:gap-20 kat:@lg:gap-40 kat:pl-8 kat:pr-8 kat:pt-8 kat:pb-20 kat:@md:pl-20 kat:@md:pr-20 kat:@md:pt-20 kat:@md:pb-20 kat:@lg:pl-40 kat:@lg:pr-40 kat:@lg:pt-20 kat:h-72 kat:@md:h-84 kat:@lg:h-100",
                        children: (0, d.jsx)("div", {
                          "data-testid": "top-left-container",
                          className: "kat:flex kat:items-start kat:flex-1 kat:gap-12 "
                        })
                      })
                    }),
                    (0, d.jsx)("div", { className: "kat:grow" }),
                    " ",
                    (0, d.jsx)(as, {}),
                    (0, d.jsx)(a$, {
                      isVisible: u2,
                      children: (0, d.jsxs)("div", {
                        className: "kat:flex kat:flex-col kat:items-start kat:self-stretch kat:pl-8 kat:pr-8 kat:pt-20 kat:pb-8 kat:@md:pl-20 kat:@md:pr-20 kat:@md:pt-20 kat:@md:pb-8 kat:@lg:pl-40 kat:@lg:pr-40 kat:@lg:pt-20 kat:@lg:pb-20 kat:bg-gradient-90001000",
                        children: [
                          (0, d.jsxs)("div", {
                            className: "kat:flex kat:self-stretch kat:h-44 kat:@lg:h-64",
                            children: [
                              (0, d.jsxs)("div", {
                                "data-testid": "bottom-left-controls-stack",
                                className: "kat:flex kat:items-end",
                                children: [(0, d.jsx)(aA, {}), (0, d.jsx)(a8, {}), (0, d.jsx)(aH, {})]
                              }),
                              (0, d.jsx)("div", { className: "kat:flex kat:items-center kat:self-stretch kat:grow kat:pl-20 kat:gap-4" }),
                              (0, d.jsxs)("div", {
                                "data-testid": "bottom-right-controls-stack",
                                className: "kat:flex kat:items-end kat:justify-end",
                                children: [(0, d.jsx)(aPiP, {}), (0, d.jsx)(iJ, {}), (0, d.jsx)(i4, {})]
                              })
                            ]
                          }),
                          (0, d.jsx)("div", {
                            "data-testid": "timeline-controls-container",
                            className: "kat:flex kat:self-stretch kat:h-44 kat:@lg:h-48 kat:gap-10 kat:cursor",
                            children: (0, d.jsx)(au, {})
                          })
                        ]
                      })
                    })
                  ]
                });
              }, re = ({
                icon: t10 = (0, d.jsx)(t1, { width: 100, height: 100 }),
                title: i10,
                message: a10,
                errorCode: r10,
                retryButtonText: s10,
                retryButtonVariant: n10 = "primary",
                onRetry: o10,
                thumbnailUrl: l2,
                className: u2,
                children: c2
              }) => {
                let h2 = !!l2;
                return (0, d.jsxs)("div", {
                  role: "dialog",
                  "aria-labelledby": "kat-error-overlay-title",
                  "aria-describedby": "kat-error-overlay-message",
                  "aria-modal": "true",
                  className: (0, tG.default)("kat:absolute kat:inset-0 kat:flex kat:bg-neutral-900 kat:text-white", h2 ? "kat:flex-row" : "kat:flex-col kat:items-center kat:justify-center error-overlay-bg", u2),
                  "data-testid": "error-overlay",
                  children: [
                    h2 && (0, d.jsxs)("div", {
                      className: "kat:absolute kat:inset-0",
                      "data-testid": "error-overlay-thumbnail",
                      children: [
                        (0, d.jsx)("img", { src: l2, alt: "", className: "kat:w-full kat:h-full kat:object-cover kat:lg:object-contain" }),
                        (0, d.jsx)("div", { className: "kat:absolute kat:inset-0 kat:bg-black/70" })
                      ]
                    }),
                    (0, d.jsxs)("div", {
                      className: (0, tG.default)("kat:flex kat:flex-col kat:justify-center kat:select-none", h2 ? "kat:z-10 kat:ml-auto kat:w-full kat:@md:w-432 kat:shrink-0 kat:items-center kat:ps-32 kat:pe-32 error-overlay-bg" : "kat:items-center"),
                      children: [
                        !h2 && t10 && (0, d.jsx)("div", { className: "kat:hidden kat:@lg:block kat:mb-32", "data-testid": "error-overlay-icon", children: t10 }),
                        (0, d.jsx)("h2", {
                          className: "kat:text-[22px] kat:@md:text-[24px] kat:@lg:text-[28px] kat:leading-28 kat:@md:leading-32 kat:@lg:leading-36 kat:font-bold kat:mb-12 kat:text-center",
                          id: "kat-error-overlay-title",
                          "data-testid": "error-overlay-title",
                          children: i10
                        }),
                        (0, d.jsx)("p", {
                          id: "kat-error-overlay-message",
                          className: "kat:hidden kat:@md:block kat:text-base kat:font-bold kat:text-neutral-300 kat:text-center kat:max-w-lg kat:ps-4 kat:pe-4 kat:mb-12",
                          "data-testid": "error-overlay-message",
                          children: a10
                        }),
                        r10 && (0, d.jsx)("span", {
                          id: "kat-error-overlay-error-code",
                          className: "kat:text-xs kat:text-neutral-500 kat:font-bold kat:uppercase kat:tracking-wider kat:mb-20",
                          "data-testid": "error-overlay-error-code",
                          children: r10
                        }),
                        o10 && s10 && (0, d.jsx)(i5, {
                          variant: n10,
                          onClick: o10,
                          className: "kat:mt-4 kat:w-2xs kat:min-h-44",
                          "data-testid": "error-overlay-retry-button",
                          children: s10
                        }),
                        c2
                      ]
                    })
                  ]
                });
              }, rt = (t10) => `https://imgsrv.crunchyroll.com/cdn-cgi/image/width=1280,height=720,format=jpeg,fit=cover,quality=70,blur=0,gravity=center/content/l/${t10}`, ri = ({ errorDetails: t10, onRetry: i10 }) => {
                let { t: a10 } = iy(), r10 = t10.videoModel?.id ? rt(t10.videoModel.id) : undefined;
                return (0, d.jsx)(re, {
                  className: "kat:z-50",
                  title: a10("error.title.streamLimits"),
                  message: a10("error.message.streamLimits"),
                  thumbnailUrl: r10,
                  retryButtonText: a10("error.action.retry"),
                  retryButtonVariant: "secondary",
                  onRetry: i10
                });
              }, ra = () => {
                let {
                  viewModelContainer: { errorOverlayVM: t10 }
                } = im(), [i10, a10] = (0, h.useState)(false), [r10, s10] = (0, h.useState)(null), [n10, o10] = (0, h.useState)(null), [l2, d2] = (0, h.useState)(false);
                return (0, h.useEffect)(() => {
                  let i11 = t10.isVisible$.subscribe((t11) => {
                    a10(t11);
                  }), r11 = t10.errorDetails$.subscribe((t11) => {
                    s10(t11);
                  }), n11 = t10.overlayType$.subscribe((t11) => {
                    o10(t11);
                  }), l3 = t10.isRetryable$.subscribe((t11) => {
                    d2(t11);
                  });
                  return () => {
                    i11.unsubscribe(), r11.unsubscribe(), n11.unsubscribe(), l3.unsubscribe();
                  };
                }, [t10]), {
                  isVisible: i10,
                  errorDetails: r10,
                  overlayType: n10,
                  isRetryable: l2,
                  retry: (0, h.useCallback)(() => {
                    t10.retry();
                  }, [t10])
                };
              }, rr = () => {
                let { isVisible: t10, errorDetails: i10, overlayType: a10, isRetryable: r10, retry: s10 } = ra(), { t: n10 } = iy();
                if (!t10 || !i10)
                  return null;
                let o10 = r10 ? s10 : undefined;
                return a10 === ti.StreamLimits ? (0, d.jsx)(ri, { errorDetails: i10, onRetry: o10 }) : (0, d.jsx)(re, {
                  className: "kat:z-50",
                  title: n10("error.title.generic"),
                  message: n10("error.message.generic"),
                  errorCode: `KAT-${i10.error.code.toString()}`,
                  retryButtonText: n10("error.action.retry"),
                  onRetry: o10
                });
              }, rs = ({ accessibilityAnnouncer: t10, localizationManager: i10, viewModelContainer: a10, keyboardShortcutTarget: r10, autohiderEventTarget: s10 }) => {
                let [n10, o10] = (0, h.useState)(undefined), l2 = (0, h.useCallback)((t11) => {
                  o10(t11 ?? undefined);
                }, []), u2 = (0, h.useMemo)(() => ({
                  accessibilityAnnouncer: t10,
                  localizationManager: i10,
                  viewModelContainer: a10,
                  keyboardShortcutTarget: r10,
                  autohiderEventTarget: s10
                }), [t10, i10, a10, r10, s10]);
                return (0, d.jsx)(iv.Provider, {
                  value: u2,
                  children: (0, d.jsx)(iT, {
                    viewModels: a10,
                    children: (0, d.jsx)(iA, {
                      children: (0, d.jsx)("div", {
                        ref: l2,
                        tabIndex: -1,
                        dir: "ltr",
                        className: "katamariDesktop kat:h-full kat:w-full kat:min-h-281 kat:@container",
                        children: (0, d.jsxs)(ip.Provider, {
                          value: n10,
                          children: [(0, d.jsx)(rr, {}), (0, d.jsx)(ai, { eventTarget: s10, children: (0, d.jsx)(a9, {}) })]
                        })
                      })
                    })
                  })
                });
              }, rn = class {
                constructor(t10) {
                  this.dispose = () => {
                    this._reactRoot &&= void this._reactRoot.unmount(), this._accessibilityAnnouncer.dispose(), this._viewModels.dispose();
                  }, this.createRootPortal = () => {
                    if (!this._parentElement) {
                      l.Ft.error("DesktopUIBuilder: No parent element provided for portal creation.");
                      return;
                    }
                    return (0, u.createPortal)(this.jsxRoot, this._parentElement);
                  }, this.useReactRoot = () => {
                    if (!this._parentElement) {
                      l.Ft.error("DesktopUIBuilder: No parent element provided for react root creation.");
                      return;
                    }
                    this._reactRoot = (0, c.createRoot)(this._parentElement), this._reactRoot.render(this.jsxRoot);
                  };
                  let { viewModels: i10, containerElement: a10, localizationConfig: r10, keyboardShortcutBackstop: s10, autohiderEventTarget: n10 } = t10;
                  this._viewModels = i10, this._parentElement = a10, this._keyboardEventBackstop = s10, this._autohiderEventTarget = n10;
                  let o10 = this._autohiderEventTarget || this._parentElement;
                  o10 && !o10.hasAttribute("tabindex") && (o10.tabIndex = -1);
                  let d2 = a10?.parentElement ?? document.body;
                  this._accessibilityAnnouncer = new H(d2), this._accessibilityAnnouncer.initialize(), this._localizationManager = new ta(r10);
                }
                get t() {
                  return this._localizationManager.t;
                }
                get localizationManager() {
                  return this._localizationManager;
                }
                async initializeLocalization(t10) {
                  await this._localizationManager.initialize(t10), this._reactRoot && this._reactRoot.render(this.jsxRoot);
                }
                get jsxRoot() {
                  return (0, d.jsx)(rs, {
                    accessibilityAnnouncer: this._accessibilityAnnouncer,
                    localizationManager: this._localizationManager,
                    viewModelContainer: this._viewModels,
                    keyboardShortcutTarget: this._keyboardEventBackstop || this._parentElement,
                    autohiderEventTarget: this._autohiderEventTarget || this._parentElement
                  });
                }
              }, ro = b({
                author: () => "",
                default: () => rk,
                description: () => ru,
                devDependencies: () => ry,
                keywords: () => rv,
                license: () => "ISC",
                main: () => rc,
                name: () => rl,
                peerDependencies: () => r_,
                repository: () => rm,
                scripts: () => rg,
                sideEffects: () => rb,
                style: () => rp,
                type: () => rf,
                types: () => rh,
                version: () => rd
              }), rl = "@crunchyroll/katamari-desktop-player", rd = "0.22.0", ru = "This is the one-stop-shop package for building a Katamari player with React-based UX", rc = "dist/katamari-desktop-player.js", rh = "dist/index.d.ts", rp = "dist/katamari-desktop-player.css", rf = "module", rg = {
                build: "tsc --project tsconfig.build.json && vite build",
                lint: "eslint ./src/ --cache --cache-strategy content",
                test: "vitest run --coverage.enabled --coverage.reportsDirectory .coverage"
              }, rv = [], rm = { type: "git", url: "https://github.com/crunchyroll/cr-lib-katamari-ts.git" }, ry = {
                "@cr-lib-katamari-ts/eslint-config": "workspace:*",
                "@cr-lib-katamari-ts/logger": "workspace:*",
                "@cr-lib-katamari-ts/media-engine-bitmovin": "workspace:*",
                "@cr-lib-katamari-ts/media-engine-shaka": "workspace:*",
                "@cr-lib-katamari-ts/media-resolver": "workspace:*",
                "@cr-lib-katamari-ts/player-core": "workspace:*",
                "@cr-lib-katamari-ts/track-selection-resolver": "workspace:*",
                "@crunchyroll/katamari-api-services": "workspace:*",
                "@crunchyroll/katamari-bif-resolver": "workspace:*",
                "@crunchyroll/katamari-config-resolver": "workspace:*",
                "@crunchyroll/katamari-eec-plugins": "workspace:*",
                "@crunchyroll/katamari-keep-alive-plugin": "workspace:*",
                "@crunchyroll/katamari-mux-plugin": "workspace:*",
                "@crunchyroll/katamari-playhead-plugin": "workspace:*",
                "@crunchyroll/katamari-poster-resolver": "workspace:*",
                "@crunchyroll/katamari-remote-config-resolver": "workspace:*",
                "@crunchyroll/katamari-ux-core": "workspace:*",
                "@crunchyroll/katamari-ux-react-desktop": "workspace:*",
                "@tailwindcss/vite": "4.3.0",
                "@types/react": "^18.0.0",
                "@types/react-dom": "^18.0.0",
                "@vitest/coverage-v8": "^3.2.4",
                eslint: "^10.4.1",
                react: "^18.0.0",
                "react-dom": "^18.0.0",
                "rollup-plugin-visualizer": "5.14.0",
                rxjs: "7.8.2",
                tailwindcss: "4.3.0",
                typescript: "^5.6.3",
                vite: "^8.0.14",
                "vite-plugin-dts": "4.5.3",
                "vite-plugin-svgr": "4.5.0",
                vitest: "^3.2.4"
              }, r_ = { react: "^18.0.0", "react-dom": "^18.0.0" }, rb = ["**/*.css"], rk = {
                name: rl,
                version: rd,
                description: ru,
                main: rc,
                types: rh,
                style: rp,
                type: rf,
                scripts: rg,
                keywords: rv,
                author: "",
                license: "ISC",
                repository: rm,
                devDependencies: ry,
                peerDependencies: r_,
                sideEffects: rb
              }, rC = Object.create, rw = Object.defineProperty, rx = Object.getOwnPropertyDescriptor, rE = Object.getOwnPropertyNames, rS = Object.getPrototypeOf, rT = Object.prototype.hasOwnProperty, rP = function(t10, i10) {
                return function() {
                  return t10 && (i10 = t10(t10 = 0)), i10;
                };
              }, rA = function(t10, i10) {
                return function() {
                  return i10 || t10((i10 = { exports: {} }).exports, i10), i10.exports;
                };
              }, rL = function(t10, i10, a10, r10) {
                if (i10 && typeof i10 == "object" || typeof i10 == "function")
                  for (var s10, n10 = rE(i10), o10 = 0, l2 = n10.length;o10 < l2; o10++)
                    s10 = n10[o10], rT.call(t10, s10) || s10 === a10 || rw(t10, s10, {
                      get: function(t11) {
                        return i10[t11];
                      }.bind(null, s10),
                      enumerable: !(r10 = rx(i10, s10)) || r10.enumerable
                    });
                return t10;
              }, rI = function(t10, i10, a10) {
                return a10 = t10 == null ? {} : rC(rS(t10)), rL(!i10 && t10 && t10.__esModule ? a10 : rw(a10, "default", { value: t10, enumerable: true }), t10);
              }, rR = rA(function(t10, i10) {
                i10.exports = "u" > typeof window ? window : "u" > typeof global ? global : "u" > typeof self ? self : {};
              });
              function rD(t10, i10) {
                return i10 != null && "u" > typeof Symbol && i10[Symbol.hasInstance] ? !!i10[Symbol.hasInstance](t10) : rD(t10, i10);
              }
              var rM = rP(function() {
                rM();
              });
              function rN(t10) {
                return t10 && "u" > typeof Symbol && t10.constructor === Symbol ? "symbol" : typeof t10;
              }
              var rj = rP(function() {}), rO = rA(function(t10, i10) {
                var a10 = Array.prototype.slice;
                i10.exports = function(t11, i11) {
                  for (("length" in t11) || (t11 = [t11]), t11 = a10.call(t11);t11.length; ) {
                    var r10 = t11.shift(), s10 = i11(r10);
                    if (s10)
                      return s10;
                    r10.childNodes && r10.childNodes.length && (t11 = a10.call(r10.childNodes).concat(t11));
                  }
                };
              }), rV = rA(function(t10, i10) {
                function a10(t11, i11) {
                  if (!rD(this, a10))
                    return new a10(t11, i11);
                  this.data = t11, this.nodeValue = t11, this.length = t11.length, this.ownerDocument = i11 || null;
                }
                rM(), i10.exports = a10, a10.prototype.nodeType = 8, a10.prototype.nodeName = "#comment", a10.prototype.toString = function() {
                  return "[object Comment]";
                };
              }), rH = rA(function(t10, i10) {
                function a10(t11, i11) {
                  if (!rD(this, a10))
                    return new a10(t11);
                  this.data = t11 || "", this.length = this.data.length, this.ownerDocument = i11 || null;
                }
                rM(), i10.exports = a10, a10.prototype.type = "DOMTextNode", a10.prototype.nodeType = 3, a10.prototype.nodeName = "#text", a10.prototype.toString = function() {
                  return this.data;
                }, a10.prototype.replaceData = function(t11, i11, a11) {
                  var r10 = this.data, s10 = r10.substring(0, t11), n10 = r10.substring(t11 + i11, r10.length);
                  this.data = s10 + a11 + n10, this.length = this.data.length;
                };
              }), rU = rA(function(t10, i10) {
                i10.exports = function(t11) {
                  var i11 = this, a10 = t11.type;
                  t11.target ||= i11, i11.listeners ||= {};
                  var r10 = i11.listeners[a10];
                  if (r10)
                    return r10.forEach(function(a11) {
                      t11.currentTarget = i11, typeof a11 == "function" ? a11(t11) : a11.handleEvent(t11);
                    });
                  i11.parentNode && i11.parentNode.dispatchEvent(t11);
                };
              }), rF = rA(function(t10, i10) {
                i10.exports = function(t11, i11) {
                  this.listeners ||= {}, this.listeners[t11] || (this.listeners[t11] = []), this.listeners[t11].indexOf(i11) === -1 && this.listeners[t11].push(i11);
                };
              }), r$ = rA(function(t10, i10) {
                i10.exports = function(t11, i11) {
                  if (this.listeners && this.listeners[t11]) {
                    var a10 = this.listeners[t11], r10 = a10.indexOf(i11);
                    r10 !== -1 && a10.splice(r10, 1);
                  }
                };
              }), rB = rA(function(t10, i10) {
                rj(), i10.exports = function t11(i11) {
                  switch (i11.nodeType) {
                    case 3:
                      return s10(i11.data);
                    case 8:
                      return "<!--" + i11.data + "-->";
                    default:
                      var n10, o10;
                      return n10 = [], o10 = i11.tagName, i11.namespaceURI === "http://www.w3.org/1999/xhtml" && (o10 = o10.toLowerCase()), n10.push("<" + o10 + function(t12) {
                        var i12 = [];
                        for (var a11 in t12)
                          (function(t13, i13) {
                            var a12 = rN(t13[i13]);
                            return i13 === "style" && Object.keys(t13.style).length > 0 || t13.hasOwnProperty(i13) && (a12 === "string" || a12 === "boolean" || a12 === "number") && i13 !== "nodeName" && i13 !== "className" && i13 !== "tagName" && i13 !== "textContent" && i13 !== "innerText" && i13 !== "namespaceURI" && i13 !== "innerHTML";
                          })(t12, a11) && i12.push({ name: a11, value: t12[a11] });
                        for (var s11 in t12._attributes)
                          for (var n11 in t12._attributes[s11]) {
                            var o11 = t12._attributes[s11][n11], l2 = (o11.prefix ? o11.prefix + ":" : "") + n11;
                            i12.push({ name: l2, value: o11.value });
                          }
                        return t12.className && i12.push({ name: "class", value: t12.className }), i12.length ? r10(i12) : "";
                      }(i11) + function(t12) {
                        var i12 = t12.dataset, a11 = [];
                        for (var s11 in i12)
                          a11.push({ name: "data-" + s11, value: i12[s11] });
                        return a11.length ? r10(a11) : "";
                      }(i11)), a10.indexOf(o10) > -1 ? n10.push(" />") : (n10.push(">"), i11.childNodes.length ? n10.push.apply(n10, i11.childNodes.map(t11)) : i11.textContent || i11.innerText ? n10.push(s10(i11.textContent || i11.innerText)) : i11.innerHTML && n10.push(i11.innerHTML), n10.push("</" + o10 + ">")), n10.join("");
                  }
                };
                var a10 = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"];
                function r10(t11) {
                  var i11 = [];
                  return t11.forEach(function(t12) {
                    var { name: a11, value: r11 } = t12;
                    a11 === "style" && (r11 = function(t13) {
                      if (typeof t13 == "string")
                        return t13;
                      var i12 = "";
                      return Object.keys(t13).forEach(function(a12) {
                        var r12 = t13[a12];
                        a12 = a12.replace(/[A-Z]/g, function(t14) {
                          return "-" + t14.toLowerCase();
                        }), i12 += a12 + ":" + r12 + ";";
                      }), i12;
                    }(r11)), i11.push(a11 + '="' + s10(r11).replace(/"/g, "&quot;") + '"');
                  }), i11.length ? " " + i11.join(" ") : "";
                }
                function s10(t11) {
                  var i11 = "";
                  return typeof t11 == "string" ? i11 = t11 : t11 && (i11 = t11.toString()), i11.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }
              }), rq = rA(function(t10, i10) {
                rM();
                var a10 = rO(), r10 = rU(), s10 = rF(), n10 = r$(), o10 = rB(), l2 = "http://www.w3.org/1999/xhtml";
                function d2(t11, i11, a11) {
                  if (!rD(this, d2))
                    return new d2(t11);
                  var r11 = a11 === undefined ? l2 : a11 || null;
                  this.tagName = r11 === l2 ? String(t11).toUpperCase() : t11, this.nodeName = this.tagName, this.className = "", this.dataset = {}, this.childNodes = [], this.parentNode = null, this.style = {}, this.ownerDocument = i11 || null, this.namespaceURI = r11, this._attributes = {}, this.tagName === "INPUT" && (this.type = "text");
                }
                i10.exports = d2, d2.prototype.type = "DOMElement", d2.prototype.nodeType = 1, d2.prototype.appendChild = function(t11) {
                  return t11.parentNode && t11.parentNode.removeChild(t11), this.childNodes.push(t11), t11.parentNode = this, t11;
                }, d2.prototype.replaceChild = function(t11, i11) {
                  t11.parentNode && t11.parentNode.removeChild(t11);
                  var a11 = this.childNodes.indexOf(i11);
                  return i11.parentNode = null, this.childNodes[a11] = t11, t11.parentNode = this, i11;
                }, d2.prototype.removeChild = function(t11) {
                  var i11 = this.childNodes.indexOf(t11);
                  return this.childNodes.splice(i11, 1), t11.parentNode = null, t11;
                }, d2.prototype.insertBefore = function(t11, i11) {
                  t11.parentNode && t11.parentNode.removeChild(t11);
                  var a11 = i11 == null ? -1 : this.childNodes.indexOf(i11);
                  return a11 > -1 ? this.childNodes.splice(a11, 0, t11) : this.childNodes.push(t11), t11.parentNode = this, t11;
                }, d2.prototype.setAttributeNS = function(t11, i11, a11) {
                  var r11 = null, s11 = i11, n11 = i11.indexOf(":");
                  (n11 > -1 && (r11 = i11.substr(0, n11), s11 = i11.substr(n11 + 1)), this.tagName === "INPUT" && i11 === "type") ? this.type = a11 : (this._attributes[t11] || (this._attributes[t11] = {}))[s11] = { value: a11, prefix: r11 };
                }, d2.prototype.getAttributeNS = function(t11, i11) {
                  var a11 = this._attributes[t11], r11 = a11 && a11[i11] && a11[i11].value;
                  return this.tagName === "INPUT" && i11 === "type" ? this.type : typeof r11 == "string" ? r11 : null;
                }, d2.prototype.removeAttributeNS = function(t11, i11) {
                  var a11 = this._attributes[t11];
                  a11 && delete a11[i11];
                }, d2.prototype.hasAttributeNS = function(t11, i11) {
                  var a11 = this._attributes[t11];
                  return !!a11 && i11 in a11;
                }, d2.prototype.setAttribute = function(t11, i11) {
                  return this.setAttributeNS(null, t11, i11);
                }, d2.prototype.getAttribute = function(t11) {
                  return this.getAttributeNS(null, t11);
                }, d2.prototype.removeAttribute = function(t11) {
                  return this.removeAttributeNS(null, t11);
                }, d2.prototype.hasAttribute = function(t11) {
                  return this.hasAttributeNS(null, t11);
                }, d2.prototype.removeEventListener = n10, d2.prototype.addEventListener = s10, d2.prototype.dispatchEvent = r10, d2.prototype.focus = function() {}, d2.prototype.toString = function() {
                  return o10(this);
                }, d2.prototype.getElementsByClassName = function(t11) {
                  var i11 = t11.split(" "), r11 = [];
                  return a10(this, function(t12) {
                    if (t12.nodeType === 1) {
                      var a11 = (t12.className || "").split(" ");
                      i11.every(function(t13) {
                        return a11.indexOf(t13) !== -1;
                      }) && r11.push(t12);
                    }
                  }), r11;
                }, d2.prototype.getElementsByTagName = function(t11) {
                  t11 = t11.toLowerCase();
                  var i11 = [];
                  return a10(this.childNodes, function(a11) {
                    a11.nodeType === 1 && (t11 === "*" || a11.tagName.toLowerCase() === t11) && i11.push(a11);
                  }), i11;
                }, d2.prototype.contains = function(t11) {
                  return a10(this, function(i11) {
                    return t11 === i11;
                  }) || false;
                };
              }), rK = rA(function(t10, i10) {
                rM();
                var a10 = rq();
                function r10(t11) {
                  if (!rD(this, r10))
                    return new r10;
                  this.childNodes = [], this.parentNode = null, this.ownerDocument = t11 || null;
                }
                i10.exports = r10, r10.prototype.type = "DocumentFragment", r10.prototype.nodeType = 11, r10.prototype.nodeName = "#document-fragment", r10.prototype.appendChild = a10.prototype.appendChild, r10.prototype.replaceChild = a10.prototype.replaceChild, r10.prototype.removeChild = a10.prototype.removeChild, r10.prototype.toString = function() {
                  return this.childNodes.map(function(t11) {
                    return String(t11);
                  }).join("");
                };
              }), rZ = rA(function(t10, i10) {
                function a10(t11) {}
                i10.exports = a10, a10.prototype.initEvent = function(t11, i11, a11) {
                  this.type = t11, this.bubbles = i11, this.cancelable = a11;
                }, a10.prototype.preventDefault = function() {};
              }), rz = rA(function(t10, i10) {
                rM();
                var a10 = rO(), r10 = rV(), s10 = rH(), n10 = rq(), o10 = rK(), l2 = rZ(), d2 = rU(), u2 = rF(), c2 = r$();
                function h2() {
                  if (!rD(this, h2))
                    return new h2;
                  this.head = this.createElement("head"), this.body = this.createElement("body"), this.documentElement = this.createElement("html"), this.documentElement.appendChild(this.head), this.documentElement.appendChild(this.body), this.childNodes = [this.documentElement], this.nodeType = 9;
                }
                i10.exports = h2;
                var p2 = h2.prototype;
                p2.createTextNode = function(t11) {
                  return new s10(t11, this);
                }, p2.createElementNS = function(t11, i11) {
                  return new n10(i11, this, t11 === null ? null : String(t11));
                }, p2.createElement = function(t11) {
                  return new n10(t11, this);
                }, p2.createDocumentFragment = function() {
                  return new o10(this);
                }, p2.createEvent = function(t11) {
                  return new l2(t11);
                }, p2.createComment = function(t11) {
                  return new r10(t11, this);
                }, p2.getElementById = function(t11) {
                  return t11 = String(t11), a10(this.childNodes, function(i11) {
                    if (String(i11.id) === t11)
                      return i11;
                  }) || null;
                }, p2.getElementsByClassName = n10.prototype.getElementsByClassName, p2.getElementsByTagName = n10.prototype.getElementsByTagName, p2.contains = n10.prototype.contains, p2.removeEventListener = c2, p2.addEventListener = u2, p2.dispatchEvent = d2;
              }), rG = rA(function(t10, i10) {
                i10.exports = new (rz());
              }), rW = rA(function(t10, i10) {
                var a10, r10 = "u" > typeof global ? global : "u" > typeof window ? window : {}, s10 = rG();
                "u" > typeof document ? a10 = document : (a10 = r10["__GLOBAL_DOCUMENT_CACHE@4"], a10 ||= r10["__GLOBAL_DOCUMENT_CACHE@4"] = s10), i10.exports = a10;
              });
              function rJ(t10, i10) {
                (i10 == null || i10 > t10.length) && (i10 = t10.length);
                for (var a10 = 0, r10 = Array(i10);a10 < i10; a10++)
                  r10[a10] = t10[a10];
                return r10;
              }
              function rY(t10, i10) {
                if (t10) {
                  if (typeof t10 == "string")
                    return rJ(t10, i10);
                  var a10 = Object.prototype.toString.call(t10).slice(8, -1);
                  if (a10 === "Object" && t10.constructor && (a10 = t10.constructor.name), a10 === "Map" || a10 === "Set")
                    return Array.from(a10);
                  if (a10 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a10))
                    return rJ(t10, i10);
                }
              }
              function rQ(t10, i10) {
                return function(t11) {
                  if (Array.isArray(t11))
                    return t11;
                }(t10) || function(t11, i11) {
                  var a10 = t11 == null ? null : "u" > typeof Symbol && t11[Symbol.iterator] || t11["@@iterator"];
                  if (a10 != null) {
                    var r10, s10, n10 = [], o10 = true, l2 = false;
                    try {
                      for (a10 = a10.call(t11);!(o10 = (r10 = a10.next()).done) && (n10.push(r10.value), !(i11 && n10.length === i11)); o10 = true)
                        ;
                    } catch (t12) {
                      l2 = true, s10 = t12;
                    } finally {
                      try {
                        o10 || a10.return == null || a10.return();
                      } finally {
                        if (l2)
                          throw s10;
                      }
                    }
                    return n10;
                  }
                }(t10, i10) || rY(t10, i10) || function() {
                  throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
                }();
              }
              var rX = rI(rR()), r0 = rI(rR()), r1 = rI(rR()), r4 = {
                now: function() {
                  var t10 = r1.default.performance, i10 = t10 && t10.timing, a10 = i10 && i10.navigationStart;
                  return Math.round(typeof a10 == "number" && typeof t10.now == "function" ? a10 + t10.now() : Date.now());
                }
              }, r2 = function() {
                if (typeof r0.default.crypto?.getRandomValues == "function") {
                  i10 = new Uint8Array(32), r0.default.crypto.getRandomValues(i10);
                  for (var t10, i10, a10 = 0;a10 < 32; a10++)
                    i10[a10] = i10[a10] % 16;
                } else {
                  i10 = [];
                  for (var r10 = 0;r10 < 32; r10++)
                    i10[r10] = 16 * Math.random() | 0;
                }
                var s10 = 0;
                t10 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t11) {
                  var a11 = t11 === "x" ? i10[s10] : 3 & i10[s10] | 8;
                  return s10++, a11.toString(16);
                });
                var n10 = r4.now()?.toString(16).substring(3);
                return n10 ? t10.substring(0, 28) + n10 : t10;
              }, r3 = function() {
                return ("000000" + (2176782336 * Math.random() << 0).toString(36)).slice(-6);
              }, r5 = function(t10) {
                var i10;
                if (t10 && t10.nodeName !== undefined)
                  return t10.muxId ||= r3(), t10.muxId;
                try {
                  i10 = document.querySelector(t10);
                } catch {}
                return i10 && !i10.muxId && (i10.muxId = t10), i10?.muxId || t10;
              }, r6 = function(t10) {
                t10 && t10.nodeName !== undefined ? t10 = r5(i10 = t10) : i10 = document.querySelector(t10);
                var i10, a10 = i10 && i10.nodeName ? i10.nodeName.toLowerCase() : "";
                return [i10, t10, a10];
              };
              function r7(t10) {
                return function(t11) {
                  if (Array.isArray(t11))
                    return rJ(t11);
                }(t10) || function(t11) {
                  if ("u" > typeof Symbol && t11[Symbol.iterator] != null || t11["@@iterator"] != null)
                    return Array.from(t11);
                }(t10) || rY(t10) || function() {
                  throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
                }();
              }
              var r8 = { TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4 }, r9 = function(t10) {
                var i10, a10, r10, s10, n10, o10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3, l2 = t10 ? [console, t10] : [console], d2 = function() {}, u2 = function() {}, c2 = function() {}, h2 = (s10 = console.warn).bind.apply(s10, r7(l2)), p2 = (n10 = console.error).bind.apply(n10, r7(l2)), f2 = o10;
                return {
                  trace: function() {
                    var t11 = [...arguments];
                    if (!(f2 > r8.TRACE))
                      return d2.apply(undefined, r7(t11));
                  },
                  debug: function() {
                    var t11 = [...arguments];
                    if (!(f2 > r8.DEBUG))
                      return c2.apply(undefined, r7(t11));
                  },
                  info: function() {
                    var t11 = [...arguments];
                    if (!(f2 > r8.INFO))
                      return u2.apply(undefined, r7(t11));
                  },
                  warn: function() {
                    var t11 = [...arguments];
                    if (!(f2 > r8.WARN))
                      return h2.apply(undefined, r7(t11));
                  },
                  error: function() {
                    var t11 = [...arguments];
                    if (!(f2 > r8.ERROR))
                      return p2.apply(undefined, r7(t11));
                  },
                  get level() {
                    return f2;
                  },
                  set level(e) {
                    e !== this.level && (f2 = e ?? o10);
                  }
                };
              }("[mux]"), se = rI(rR());
              function st() {
                return (se.default.doNotTrack || se.default.navigator && se.default.navigator.doNotTrack) === "1";
              }
              function si(t10) {
                if (t10 === undefined)
                  throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t10;
              }
              function sa(t10, i10) {
                if (!rD(t10, i10))
                  throw TypeError("Cannot call a class as a function");
              }
              function sr(t10, i10) {
                for (var a10 = 0;a10 < i10.length; a10++) {
                  var r10 = i10[a10];
                  r10.enumerable = r10.enumerable || false, r10.configurable = true, "value" in r10 && (r10.writable = true), Object.defineProperty(t10, r10.key, r10);
                }
              }
              function ss(t10, i10, a10) {
                return i10 && sr(t10.prototype, i10), a10 && sr(t10, a10), t10;
              }
              function sn(t10, i10, a10) {
                return i10 in t10 ? Object.defineProperty(t10, i10, { value: a10, enumerable: true, configurable: true, writable: true }) : t10[i10] = a10, t10;
              }
              function so(t10) {
                return (so = Object.setPrototypeOf ? Object.getPrototypeOf : function(t11) {
                  return t11.__proto__ || Object.getPrototypeOf(t11);
                })(t10);
              }
              function sl(t10, i10, a10) {
                return (sl = "u" > typeof Reflect && Reflect.get ? Reflect.get : function(t11, i11, a11) {
                  var r10 = function(t12, i12) {
                    for (;!Object.prototype.hasOwnProperty.call(t12, i12) && (t12 = so(t12)) !== null; )
                      ;
                    return t12;
                  }(t11, i11);
                  if (r10) {
                    var s10 = Object.getOwnPropertyDescriptor(r10, i11);
                    return s10.get ? s10.get.call(a11 || t11) : s10.value;
                  }
                })(t10, i10, a10 || t10);
              }
              function sd(t10, i10) {
                return (sd = Object.setPrototypeOf || function(t11, i11) {
                  return t11.__proto__ = i11, t11;
                })(t10, i10);
              }
              rM(), rj();
              var su = function(t10) {
                return sc(t10)[0];
              }, sc = function(t10) {
                if (typeof t10 != "string" || t10 === "")
                  return ["localhost"];
                var i10, a10 = (t10.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/) || [])[4];
                return a10 && (i10 = (a10.match(/[^\.]+\.[^\.]+$/) || [])[0]), [a10, i10];
              }, sh = rI(rR()), sp = {
                exists: function() {
                  var t10 = sh.default.performance;
                  return (t10 && t10.timing) !== undefined;
                },
                domContentLoadedEventEnd: function() {
                  var t10 = sh.default.performance, i10 = t10 && t10.timing;
                  return i10 && i10.domContentLoadedEventEnd;
                },
                navigationStart: function() {
                  var t10 = sh.default.performance, i10 = t10 && t10.timing;
                  return i10 && i10.navigationStart;
                }
              };
              function sf(t10, i10, a10) {
                a10 = a10 === undefined ? 1 : a10, t10[i10] = t10[i10] || 0, t10[i10] += a10;
              }
              function sg(t10) {
                for (var i10 = 1;i10 < arguments.length; i10++) {
                  var a10 = arguments[i10] == null ? {} : arguments[i10], r10 = Object.keys(a10);
                  typeof Object.getOwnPropertySymbols == "function" && (r10 = r10.concat(Object.getOwnPropertySymbols(a10).filter(function(t11) {
                    return Object.getOwnPropertyDescriptor(a10, t11).enumerable;
                  }))), r10.forEach(function(i11) {
                    sn(t10, i11, a10[i11]);
                  });
                }
                return t10;
              }
              function sv(t10, i10) {
                return i10 ??= {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(t10, Object.getOwnPropertyDescriptors(i10)) : function(t11, i11) {
                  var a10 = Object.keys(t11);
                  if (Object.getOwnPropertySymbols) {
                    var r10 = Object.getOwnPropertySymbols(t11);
                    a10.push.apply(a10, r10);
                  }
                  return a10;
                }(Object(i10)).forEach(function(a10) {
                  Object.defineProperty(t10, a10, Object.getOwnPropertyDescriptor(i10, a10));
                }), t10;
              }
              var sm = ["x-request-id", "cf-ray", "x-amz-cf-id", "x-akamai-request-id"], sy = ["x-cdn", "content-type"].concat(sm);
              function s_(t10) {
                var i10 = {};
                return (t10 ||= "").trim().split(/[\r\n]+/).forEach(function(t11) {
                  if (t11) {
                    var a10 = t11.split(": "), r10 = a10.shift();
                    r10 && (sy.indexOf(r10.toLowerCase()) >= 0 || r10.toLowerCase().indexOf("x-litix-") === 0) && (i10[r10] = a10.join(": "));
                  }
                }), i10;
              }
              function sb(t10) {
                if (t10) {
                  var i10 = sm.find(function(i11) {
                    return t10[i11] !== undefined;
                  });
                  return i10 ? t10[i10] : undefined;
                }
              }
              var sk = function(t10) {
                var i10 = {};
                for (var a10 in t10) {
                  var r10 = t10[a10];
                  r10["DATA-ID"].search("io.litix.data.") !== -1 && (i10[r10["DATA-ID"].replace("io.litix.data.", "")] = r10.VALUE);
                }
                return i10;
              }, sC = function(t10) {
                if (!t10)
                  return {};
                var i10 = sp.navigationStart(), a10 = t10.loading, r10 = a10 ? a10.start : t10.trequest, s10 = a10 ? a10.first : t10.tfirst, n10 = a10 ? a10.end : t10.tload;
                return { bytesLoaded: t10.total, requestStart: Math.round(i10 + r10), responseStart: Math.round(i10 + s10), responseEnd: Math.round(i10 + n10) };
              }, sw = function(t10) {
                if (!(!t10 || typeof t10.getAllResponseHeaders != "function"))
                  return s_(t10.getAllResponseHeaders());
              }, sx = function(t10, i10, a10) {
                arguments.length > 3 && arguments[3] !== undefined && arguments[3];
                var r10 = arguments.length > 4 ? arguments[4] : undefined, s10 = t10.log, n10 = t10.utils.secondsToMs, o10 = function(t11) {
                  var i11, a11 = parseInt(r10.version);
                  return a11 === 1 && t11.programDateTime !== null && (i11 = t11.programDateTime), a11 === 0 && t11.pdt !== null && (i11 = t11.pdt), i11;
                };
                if (!sp.exists()) {
                  s10.warn("performance timing not supported. Not tracking HLS.js.");
                  return;
                }
                var l2 = function(a11, r11) {
                  return t10.emit(i10, a11, r11);
                }, d2 = function(t11, i11) {
                  var { levels: a11, audioTracks: r11, url: s11, stats: n11, networkDetails: o11, sessionData: d3 } = i11, u3 = {}, c3 = {};
                  a11.forEach(function(t12, i12) {
                    u3[i12] = { width: t12.width, height: t12.height, bitrate: t12.bitrate, attrs: t12.attrs };
                  }), r11.forEach(function(t12, i12) {
                    c3[i12] = { name: t12.name, language: t12.lang, bitrate: t12.bitrate };
                  });
                  var h3 = sC(n11), p3 = h3.bytesLoaded, f3 = h3.requestStart, g3 = h3.responseStart, v3 = h3.responseEnd;
                  l2("requestcompleted", sv(sg({}, sk(d3)), {
                    request_event_type: t11,
                    request_bytes_loaded: p3,
                    request_start: f3,
                    request_response_start: g3,
                    request_response_end: v3,
                    request_type: "manifest",
                    request_hostname: su(s11),
                    request_response_headers: sw(o11),
                    request_rendition_lists: { media: u3, audio: c3, video: {} }
                  }));
                };
                a10.on(r10.Events.MANIFEST_LOADED, d2);
                var u2 = function(t11, i11) {
                  var { details: a11, level: r11, networkDetails: s11 } = i11, d3 = sC(i11.stats), u3 = d3.bytesLoaded, c3 = d3.requestStart, h3 = d3.responseStart, p3 = d3.responseEnd, f3 = a11.fragments[a11.fragments.length - 1], g3 = o10(f3) + n10(f3.duration);
                  l2("requestcompleted", {
                    request_event_type: t11,
                    request_bytes_loaded: u3,
                    request_start: c3,
                    request_response_start: h3,
                    request_response_end: p3,
                    request_current_level: r11,
                    request_type: "manifest",
                    request_hostname: su(a11.url),
                    request_response_headers: sw(s11),
                    video_holdback: a11.holdBack && n10(a11.holdBack),
                    video_part_holdback: a11.partHoldBack && n10(a11.partHoldBack),
                    video_part_target_duration: a11.partTarget && n10(a11.partTarget),
                    video_target_duration: a11.targetduration && n10(a11.targetduration),
                    video_source_is_live: a11.live,
                    player_manifest_newest_program_time: isNaN(g3) ? undefined : g3
                  });
                };
                a10.on(r10.Events.LEVEL_LOADED, u2);
                var c2 = function(t11, i11) {
                  var { details: a11, networkDetails: r11 } = i11, s11 = sC(i11.stats);
                  l2("requestcompleted", {
                    request_event_type: t11,
                    request_bytes_loaded: s11.bytesLoaded,
                    request_start: s11.requestStart,
                    request_response_start: s11.responseStart,
                    request_response_end: s11.responseEnd,
                    request_type: "manifest",
                    request_hostname: su(a11.url),
                    request_response_headers: sw(r11)
                  });
                };
                a10.on(r10.Events.AUDIO_TRACK_LOADED, c2);
                var h2 = function(t11, i11) {
                  var { stats: r11, networkDetails: s11, frag: n11 } = i11, o11 = sC(r11 ||= n11.stats), d3 = o11.bytesLoaded, u3 = o11.requestStart, c3 = o11.responseStart, h3 = o11.responseEnd, p3 = s11 ? sw(s11) : undefined, f3 = {
                    request_event_type: t11,
                    request_bytes_loaded: d3,
                    request_start: u3,
                    request_response_start: c3,
                    request_response_end: h3,
                    request_hostname: s11 ? su(s11.responseURL) : undefined,
                    request_id: p3 ? sb(p3) : undefined,
                    request_response_headers: p3,
                    request_media_duration: n11.duration,
                    request_url: s11?.responseURL
                  };
                  n11.type === "main" ? (f3.request_type = "media", f3.request_current_level = n11.level, f3.request_video_width = (a10.levels[n11.level] || {}).width, f3.request_video_height = (a10.levels[n11.level] || {}).height, f3.request_labeled_bitrate = (a10.levels[n11.level] || {}).bitrate) : f3.request_type = n11.type, l2("requestcompleted", f3);
                };
                a10.on(r10.Events.FRAG_LOADED, h2);
                var p2 = function(t11, i11) {
                  var a11 = i11.frag, r11 = a11.start;
                  l2("fragmentchange", { currentFragmentPDT: o10(a11), currentFragmentStart: n10(r11) });
                };
                a10.on(r10.Events.FRAG_CHANGED, p2);
                var f2 = function(t11, i11) {
                  var { type: a11, details: s11, response: n11, fatal: o11, frag: d3, networkDetails: u3 } = i11, c3 = d3?.url || i11.url || "", h3 = u3 ? sw(u3) : undefined;
                  (s11 === r10.ErrorDetails.MANIFEST_LOAD_ERROR || s11 === r10.ErrorDetails.MANIFEST_LOAD_TIMEOUT || s11 === r10.ErrorDetails.FRAG_LOAD_ERROR || s11 === r10.ErrorDetails.FRAG_LOAD_TIMEOUT || s11 === r10.ErrorDetails.LEVEL_LOAD_ERROR || s11 === r10.ErrorDetails.LEVEL_LOAD_TIMEOUT || s11 === r10.ErrorDetails.AUDIO_TRACK_LOAD_ERROR || s11 === r10.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT || s11 === r10.ErrorDetails.SUBTITLE_LOAD_ERROR || s11 === r10.ErrorDetails.SUBTITLE_LOAD_TIMEOUT || s11 === r10.ErrorDetails.KEY_LOAD_ERROR || s11 === r10.ErrorDetails.KEY_LOAD_TIMEOUT) && l2("requestfailed", {
                    request_error: s11,
                    request_url: c3,
                    request_hostname: su(c3),
                    request_id: h3 ? sb(h3) : undefined,
                    request_type: s11 === r10.ErrorDetails.FRAG_LOAD_ERROR || s11 === r10.ErrorDetails.FRAG_LOAD_TIMEOUT ? "media" : s11 === r10.ErrorDetails.AUDIO_TRACK_LOAD_ERROR || s11 === r10.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT ? "audio" : s11 === r10.ErrorDetails.SUBTITLE_LOAD_ERROR || s11 === r10.ErrorDetails.SUBTITLE_LOAD_TIMEOUT ? "subtitle" : s11 === r10.ErrorDetails.KEY_LOAD_ERROR || s11 === r10.ErrorDetails.KEY_LOAD_TIMEOUT ? "encryption" : "manifest",
                    request_error_code: n11?.code,
                    request_error_text: n11?.text
                  }), o11 && l2("error", {
                    player_error_code: a11,
                    player_error_message: s11,
                    player_error_context: `${c3 ? `url: ${c3}
` : ""}${n11 && (n11.code || n11.text) ? `response: ${n11.code}, ${n11.text}
` : ""}${i11.reason ? `failure reason: ${i11.reason}
` : ""}${i11.level ? `level: ${i11.level}
` : ""}${i11.parent ? `parent stream controller: ${i11.parent}
` : ""}${i11.buffer ? `buffer length: ${i11.buffer}
` : ""}${i11.error ? `error: ${i11.error}
` : ""}${i11.event ? `event: ${i11.event}
` : ""}${i11.err ? `error message: ${i11.err?.message}
` : ""}`
                  });
                };
                a10.on(r10.Events.ERROR, f2);
                var g2 = function(t11, i11) {
                  var a11 = i11.frag, r11 = a11 && a11._url || "";
                  l2("requestcanceled", { request_event_type: t11, request_url: r11, request_type: "media", request_hostname: su(r11) });
                };
                a10.on(r10.Events.FRAG_LOAD_EMERGENCY_ABORTED, g2);
                var v2 = function(t11, i11) {
                  var r11 = i11.level, n11 = a10.levels[r11];
                  if (n11 && n11.attrs && n11.attrs.BANDWIDTH) {
                    var o11, d3 = n11.attrs.BANDWIDTH, u3 = parseFloat(n11.attrs["FRAME-RATE"]);
                    isNaN(u3) || (o11 = u3), d3 ? l2("renditionchange", {
                      video_source_fps: o11,
                      video_source_bitrate: d3,
                      video_source_width: n11.width,
                      video_source_height: n11.height,
                      video_source_rendition_name: n11.name,
                      video_source_codec: n11?.videoCodec
                    }) : s10.warn("missing BANDWIDTH from HLS manifest parsed by HLS.js");
                  }
                };
                a10.on(r10.Events.LEVEL_SWITCHED, v2), a10._stopMuxMonitor = function() {
                  a10.off(r10.Events.MANIFEST_LOADED, d2), a10.off(r10.Events.LEVEL_LOADED, u2), a10.off(r10.Events.AUDIO_TRACK_LOADED, c2), a10.off(r10.Events.FRAG_LOADED, h2), a10.off(r10.Events.FRAG_CHANGED, p2), a10.off(r10.Events.ERROR, f2), a10.off(r10.Events.FRAG_LOAD_EMERGENCY_ABORTED, g2), a10.off(r10.Events.LEVEL_SWITCHED, v2), a10.off(r10.Events.DESTROYING, a10._stopMuxMonitor), delete a10._stopMuxMonitor;
                }, a10.on(r10.Events.DESTROYING, a10._stopMuxMonitor);
              }, sE = function(t10) {
                t10 && typeof t10._stopMuxMonitor == "function" && t10._stopMuxMonitor();
              }, sS = function(t10, i10) {
                if (!t10 || !t10.requestEndDate)
                  return {};
                var a10, r10 = su(t10.url), s10 = t10.url, n10 = t10.bytesLoaded, o10 = new Date(t10.requestStartDate).getTime(), l2 = new Date(t10.firstByteDate).getTime(), d2 = new Date(t10.requestEndDate).getTime(), u2 = isNaN(t10.duration) ? 0 : t10.duration, c2 = typeof i10.getMetricsFor == "function" ? i10.getMetricsFor(t10.mediaType).HttpList : i10.getDashMetrics().getHttpRequests(t10.mediaType);
                c2.length > 0 && (a10 = s_(c2[c2.length - 1]._responseHeaders || ""));
                var h2 = a10 ? sb(a10) : undefined;
                return {
                  requestStart: o10,
                  requestResponseStart: l2,
                  requestResponseEnd: d2,
                  requestBytesLoaded: n10,
                  requestResponseHeaders: a10,
                  requestMediaDuration: u2,
                  requestHostname: r10,
                  requestUrl: s10,
                  requestId: h2
                };
              }, sT = function(t10, i10) {
                var a10 = i10.getQualityFor(t10), r10 = i10.getCurrentTrackFor(t10).bitrateList;
                return r10 ? { currentLevel: a10, renditionWidth: r10[a10].width || null, renditionHeight: r10[a10].height || null, renditionBitrate: r10[a10].bandwidth } : {};
              }, sP = function(t10) {
                try {
                  var i10, a10;
                  return (a10 = t10.getVersion) == null || (i10 = a10.call(t10)) == null ? undefined : i10.split(".").map(function(t11) {
                    return parseInt(t11);
                  })[0];
                } catch {
                  return false;
                }
              }, sA = function(t10, i10, a10) {
                arguments.length > 3 && arguments[3] !== undefined && arguments[3];
                var r10 = t10.log;
                if (!a10 || !a10.on) {
                  r10.warn("Invalid dash.js player reference. Monitoring blocked.");
                  return;
                }
                var s10 = sP(a10), n10 = function(a11, r11) {
                  return t10.emit(i10, a11, r11);
                }, o10 = function(t11) {
                  var i11 = t11.type, a11 = (t11.data || {}).url;
                  n10("requestcompleted", {
                    request_event_type: i11,
                    request_start: 0,
                    request_response_start: 0,
                    request_response_end: 0,
                    request_bytes_loaded: -1,
                    request_type: "manifest",
                    request_hostname: su(a11),
                    request_url: a11
                  });
                };
                a10.on("manifestLoaded", o10);
                var l2 = {}, d2 = function(t11) {
                  if (typeof t11.getRequests != "function")
                    return null;
                  var i11 = t11.getRequests({ state: "executed" });
                  return i11.length === 0 ? null : i11[i11.length - 1];
                }, u2 = function(t11) {
                  var { type: i11, chunk: r11, request: s11 } = t11, o11 = (r11 || {}).mediaInfo || {}, d3 = o11.type, u3 = o11.bitrateList, c3 = {};
                  (u3 ||= []).forEach(function(t12, i12) {
                    c3[i12] = {}, c3[i12].width = t12.width, c3[i12].height = t12.height, c3[i12].bitrate = t12.bandwidth, c3[i12].attrs = {};
                  }), d3 === "video" ? l2.video = c3 : d3 === "audio" ? l2.audio = c3 : l2.media = c3;
                  var h3 = sS(s11, a10), p3 = h3.requestStart, f3 = h3.requestResponseStart, g3 = h3.requestResponseEnd, v3 = h3.requestResponseHeaders, m2 = h3.requestMediaDuration, y2 = h3.requestHostname, _2 = h3.requestUrl;
                  n10("requestcompleted", {
                    request_event_type: i11,
                    request_start: p3,
                    request_response_start: f3,
                    request_response_end: g3,
                    request_bytes_loaded: -1,
                    request_type: d3 + "_init",
                    request_response_headers: v3,
                    request_hostname: y2,
                    request_id: h3.requestId,
                    request_url: _2,
                    request_media_duration: m2,
                    request_rendition_lists: l2
                  });
                };
                s10 >= 4 ? a10.on("initFragmentLoaded", u2) : a10.on("initFragmentLoaded", function(t11) {
                  var { type: i11, fragmentModel: a11, chunk: r11 } = t11;
                  u2({ type: i11, request: d2(a11), chunk: r11 });
                });
                var c2 = function(t11) {
                  var { type: i11, chunk: r11, request: s11 } = t11, o11 = r11 || {}, l3 = o11.mediaInfo, d3 = o11.start, u3 = (l3 || {}).type, c3 = sS(s11, a10), h3 = c3.requestStart, p3 = c3.requestResponseStart, f3 = c3.requestResponseEnd, g3 = c3.requestBytesLoaded, v3 = c3.requestResponseHeaders, m2 = c3.requestMediaDuration, y2 = c3.requestHostname, _2 = c3.requestUrl, b2 = c3.requestId, k2 = sT(u3, a10), C2 = k2.currentLevel, w2 = k2.renditionWidth, x2 = k2.renditionHeight;
                  n10("requestcompleted", {
                    request_event_type: i11,
                    request_start: h3,
                    request_response_start: p3,
                    request_response_end: f3,
                    request_bytes_loaded: g3,
                    request_type: u3,
                    request_response_headers: v3,
                    request_hostname: y2,
                    request_id: b2,
                    request_url: _2,
                    request_media_start_time: d3,
                    request_media_duration: m2,
                    request_current_level: C2,
                    request_labeled_bitrate: k2.renditionBitrate,
                    request_video_width: w2,
                    request_video_height: x2
                  });
                };
                s10 >= 4 ? a10.on("mediaFragmentLoaded", c2) : a10.on("mediaFragmentLoaded", function(t11) {
                  var { type: i11, fragmentModel: a11, chunk: r11 } = t11;
                  c2({ type: i11, request: d2(a11), chunk: r11 });
                });
                var h2 = { video: undefined, audio: undefined, totalBitrate: undefined }, p2 = function() {
                  if (h2.video && typeof h2.video.bitrate == "number") {
                    if (!(h2.video.width && h2.video.height)) {
                      r10.warn("have bitrate info for video but missing width/height");
                      return;
                    }
                    var t11, i11 = h2.video.bitrate;
                    if (h2.audio && typeof h2.audio.bitrate == "number" && (i11 += h2.audio.bitrate), i11 !== h2.totalBitrate)
                      return h2.totalBitrate = i11, {
                        video_source_bitrate: i11,
                        video_source_height: h2.video.height,
                        video_source_width: h2.video.width,
                        video_source_codec: (t11 = h2.video.codec, t11.match(/.*codecs\*?="(.*)"/)?.[1])
                      };
                  }
                }, f2 = function(t11, i11, s11) {
                  if (typeof t11.newQuality != "number") {
                    r10.warn("missing evt.newQuality in qualityChangeRendered event", t11);
                    return;
                  }
                  var o11 = t11.mediaType;
                  if (o11 === "audio" || o11 === "video") {
                    var l3 = a10.getBitrateInfoListFor(o11).find(function(i12) {
                      return i12.qualityIndex === t11.newQuality;
                    });
                    if (!(l3 && typeof l3.bitrate == "number")) {
                      r10.warn(`missing bitrate info for ${o11}`);
                      return;
                    }
                    h2[o11] = sv(sg({}, l3), { codec: a10.getCurrentTrackFor(o11).codec });
                    var d3 = p2();
                    d3 && n10("renditionchange", d3);
                  }
                };
                a10.on("qualityChangeRendered", f2);
                var g2 = function(t11) {
                  var { request: i11, mediaType: a11 } = t11;
                  n10("requestcanceled", {
                    request_event_type: (i11 ||= {}).type + "_" + i11.action,
                    request_url: i11.url,
                    request_type: a11,
                    request_hostname: su(i11.url)
                  });
                };
                a10.on("fragmentLoadingAbandoned", g2);
                var v2 = function(t11) {
                  var i11, a11, r11 = t11.error, s11 = (r11 == null || (i11 = r11.data) == null ? undefined : i11.request) || {}, o11 = (r11 == null || (a11 = r11.data) == null ? undefined : a11.response) || {};
                  r11?.code === 27 && n10("requestfailed", {
                    request_error: s11.type + "_" + s11.action,
                    request_url: s11.url,
                    request_hostname: su(s11.url),
                    request_type: s11.mediaType,
                    request_error_code: o11.status,
                    request_error_text: o11.statusText
                  });
                  var l3 = `${s11 != null && s11.url ? `url: ${s11.url}
` : ""}${o11 != null && o11.status || o11 != null && o11.statusText ? `response: ${o11?.status}, ${o11?.statusText}
` : ""}`;
                  n10("error", { player_error_code: r11?.code, player_error_message: r11?.message, player_error_context: l3 });
                };
                a10.on("error", v2), a10._stopMuxMonitor = function() {
                  a10.off("manifestLoaded", o10), a10.off("initFragmentLoaded", u2), a10.off("mediaFragmentLoaded", c2), a10.off("qualityChangeRendered", f2), a10.off("error", v2), a10.off("fragmentLoadingAbandoned", g2), delete a10._stopMuxMonitor;
                };
              }, sL = function(t10) {
                t10 && typeof t10._stopMuxMonitor == "function" && t10._stopMuxMonitor();
              }, sI = 0, sR = function() {
                function t10() {
                  sa(this, t10), sn(this, "_listeners", undefined);
                }
                return ss(t10, [
                  {
                    key: "on",
                    value: function(t11, i10, a10) {
                      return i10._eventEmitterGuid = i10._eventEmitterGuid || ++sI, this._listeners = this._listeners || {}, this._listeners[t11] = this._listeners[t11] || [], a10 && (i10 = i10.bind(a10)), this._listeners[t11].push(i10), i10;
                    }
                  },
                  {
                    key: "off",
                    value: function(t11, i10) {
                      var a10 = this._listeners && this._listeners[t11];
                      a10 && a10.forEach(function(t12, r10) {
                        t12._eventEmitterGuid === i10._eventEmitterGuid && a10.splice(r10, 1);
                      });
                    }
                  },
                  {
                    key: "one",
                    value: function(t11, i10, a10) {
                      var r10 = this;
                      i10._eventEmitterGuid = i10._eventEmitterGuid || ++sI;
                      var s10 = function() {
                        r10.off(t11, s10), i10.apply(a10 || this, arguments);
                      };
                      s10._eventEmitterGuid = i10._eventEmitterGuid, this.on(t11, s10);
                    }
                  },
                  {
                    key: "emit",
                    value: function(t11, i10) {
                      var a10 = this;
                      if (this._listeners) {
                        i10 ||= {};
                        var r10 = this._listeners["before*"] || [], s10 = this._listeners[t11] || [], n10 = this._listeners["after" + t11] || [], o10 = function(i11, r11) {
                          (i11 = i11.slice()).forEach(function(i12) {
                            i12.call(a10, { type: t11 }, r11);
                          });
                        };
                        o10(r10, i10), o10(s10, i10), o10(n10, i10);
                      }
                    }
                  }
                ]), t10;
              }(), sD = rI(rR()), sM = function() {
                function t10(i10) {
                  var a10 = this;
                  sa(this, t10), sn(this, "_playbackHeartbeatInterval", undefined), sn(this, "_playheadShouldBeProgressing", undefined), sn(this, "pm", undefined), this.pm = i10, this._playbackHeartbeatInterval = null, this._playheadShouldBeProgressing = false, i10.on("playing", function() {
                    a10._playheadShouldBeProgressing = true;
                  }), i10.on("play", this._startPlaybackHeartbeatInterval.bind(this)), i10.on("playing", this._startPlaybackHeartbeatInterval.bind(this)), i10.on("adbreakstart", this._startPlaybackHeartbeatInterval.bind(this)), i10.on("adplay", this._startPlaybackHeartbeatInterval.bind(this)), i10.on("adplaying", this._startPlaybackHeartbeatInterval.bind(this)), i10.on("devicewake", this._startPlaybackHeartbeatInterval.bind(this)), i10.on("viewstart", this._startPlaybackHeartbeatInterval.bind(this)), i10.on("rebufferstart", this._startPlaybackHeartbeatInterval.bind(this)), i10.on("pause", this._stopPlaybackHeartbeatInterval.bind(this)), i10.on("ended", this._stopPlaybackHeartbeatInterval.bind(this)), i10.on("viewend", this._stopPlaybackHeartbeatInterval.bind(this)), i10.on("error", this._stopPlaybackHeartbeatInterval.bind(this)), i10.on("aderror", this._stopPlaybackHeartbeatInterval.bind(this)), i10.on("adpause", this._stopPlaybackHeartbeatInterval.bind(this)), i10.on("adended", this._stopPlaybackHeartbeatInterval.bind(this)), i10.on("adbreakend", this._stopPlaybackHeartbeatInterval.bind(this)), i10.on("seeked", function() {
                    i10.data.player_is_paused ? a10._stopPlaybackHeartbeatInterval() : a10._startPlaybackHeartbeatInterval();
                  }), i10.on("timeupdate", function() {
                    a10._playbackHeartbeatInterval !== null && i10.emit("playbackheartbeat");
                  }), i10.on("devicesleep", function(t11, r10) {
                    a10._playbackHeartbeatInterval !== null && (sD.default.clearInterval(a10._playbackHeartbeatInterval), i10.emit("playbackheartbeatend", { viewer_time: r10.viewer_time }), a10._playbackHeartbeatInterval = null);
                  });
                }
                return ss(t10, [
                  {
                    key: "_startPlaybackHeartbeatInterval",
                    value: function() {
                      var t11 = this;
                      this._playbackHeartbeatInterval === null && (this.pm.emit("playbackheartbeat"), this._playbackHeartbeatInterval = sD.default.setInterval(function() {
                        t11.pm.emit("playbackheartbeat");
                      }, this.pm.playbackHeartbeatTime));
                    }
                  },
                  {
                    key: "_stopPlaybackHeartbeatInterval",
                    value: function() {
                      this._playheadShouldBeProgressing = false, this._playbackHeartbeatInterval !== null && (sD.default.clearInterval(this._playbackHeartbeatInterval), this.pm.emit("playbackheartbeatend"), this._playbackHeartbeatInterval = null);
                    }
                  }
                ]), t10;
              }(), sN = function t10(i10) {
                var a10 = this;
                sa(this, t10), sn(this, "viewErrored", undefined), i10.on("viewinit", function() {
                  a10.viewErrored = false;
                }), i10.on("error", function(t11, r10) {
                  try {
                    var s10 = i10.errorTranslator({
                      player_error_code: r10.player_error_code,
                      player_error_message: r10.player_error_message,
                      player_error_context: r10.player_error_context,
                      player_error_severity: r10.player_error_severity,
                      player_error_business_exception: r10.player_error_business_exception
                    });
                    s10 && (i10.data.player_error_code = s10.player_error_code || r10.player_error_code, i10.data.player_error_message = s10.player_error_message || r10.player_error_message, i10.data.player_error_context = s10.player_error_context || r10.player_error_context, i10.data.player_error_severity = s10.player_error_severity || r10.player_error_severity, i10.data.player_error_business_exception = s10.player_error_business_exception || r10.player_error_business_exception, a10.viewErrored = true);
                  } catch (t12) {
                    i10.mux.log.warn("Exception in error translator callback.", t12), a10.viewErrored = true;
                  }
                }), i10.on("aftererror", function() {
                  var t11, a11, r10, s10, n10;
                  (t11 = i10.data) == null || delete t11.player_error_code, (a11 = i10.data) == null || delete a11.player_error_message, (r10 = i10.data) == null || delete r10.player_error_context, (s10 = i10.data) == null || delete s10.player_error_severity, (n10 = i10.data) == null || delete n10.player_error_business_exception;
                });
              }, sj = function() {
                function t10(i10) {
                  sa(this, t10), sn(this, "_watchTimeTrackerLastCheckedTime", undefined), sn(this, "pm", undefined), this.pm = i10, this._watchTimeTrackerLastCheckedTime = null, i10.on("playbackheartbeat", this._updateWatchTime.bind(this)), i10.on("playbackheartbeatend", this._clearWatchTimeState.bind(this));
                }
                return ss(t10, [
                  {
                    key: "_updateWatchTime",
                    value: function(t11, i10) {
                      var a10 = i10.viewer_time;
                      this._watchTimeTrackerLastCheckedTime === null && (this._watchTimeTrackerLastCheckedTime = a10), sf(this.pm.data, "view_watch_time", a10 - this._watchTimeTrackerLastCheckedTime), this._watchTimeTrackerLastCheckedTime = a10;
                    }
                  },
                  {
                    key: "_clearWatchTimeState",
                    value: function(t11, i10) {
                      this._updateWatchTime(t11, i10), this._watchTimeTrackerLastCheckedTime = null;
                    }
                  }
                ]), t10;
              }(), sO = function() {
                function t10(i10) {
                  var a10 = this;
                  sa(this, t10), sn(this, "_playbackTimeTrackerLastPlayheadPosition", undefined), sn(this, "_lastTime", undefined), sn(this, "_isAdPlaying", undefined), sn(this, "_callbackUpdatePlaybackTime", undefined), sn(this, "pm", undefined), this.pm = i10, this._playbackTimeTrackerLastPlayheadPosition = -1, this._lastTime = r4.now(), this._isAdPlaying = false, this._callbackUpdatePlaybackTime = null;
                  var r10 = this._startPlaybackTimeTracking.bind(this);
                  i10.on("playing", r10), i10.on("adplaying", r10), i10.on("seeked", r10);
                  var s10 = this._stopPlaybackTimeTracking.bind(this);
                  i10.on("playbackheartbeatend", s10), i10.on("seeking", s10), i10.on("adplaying", function() {
                    a10._isAdPlaying = true;
                  }), i10.on("adended", function() {
                    a10._isAdPlaying = false;
                  }), i10.on("adpause", function() {
                    a10._isAdPlaying = false;
                  }), i10.on("adbreakstart", function() {
                    a10._isAdPlaying = false;
                  }), i10.on("adbreakend", function() {
                    a10._isAdPlaying = false;
                  }), i10.on("adplay", function() {
                    a10._isAdPlaying = false;
                  }), i10.on("viewinit", function() {
                    a10._playbackTimeTrackerLastPlayheadPosition = -1, a10._lastTime = r4.now(), a10._isAdPlaying = false, a10._callbackUpdatePlaybackTime = null;
                  });
                }
                return ss(t10, [
                  {
                    key: "_startPlaybackTimeTracking",
                    value: function() {
                      this._callbackUpdatePlaybackTime === null && (this._callbackUpdatePlaybackTime = this._updatePlaybackTime.bind(this), this._playbackTimeTrackerLastPlayheadPosition = this.pm.data.player_playhead_time, this.pm.on("playbackheartbeat", this._callbackUpdatePlaybackTime));
                    }
                  },
                  {
                    key: "_stopPlaybackTimeTracking",
                    value: function() {
                      this._callbackUpdatePlaybackTime && (this._updatePlaybackTime(), this.pm.off("playbackheartbeat", this._callbackUpdatePlaybackTime), this._callbackUpdatePlaybackTime = null, this._playbackTimeTrackerLastPlayheadPosition = -1);
                    }
                  },
                  {
                    key: "_updatePlaybackTime",
                    value: function() {
                      var t11 = this.pm.data.player_playhead_time, i10 = r4.now(), a10 = -1;
                      this._playbackTimeTrackerLastPlayheadPosition >= 0 && t11 > this._playbackTimeTrackerLastPlayheadPosition ? a10 = t11 - this._playbackTimeTrackerLastPlayheadPosition : this._isAdPlaying && (a10 = i10 - this._lastTime), a10 > 0 && a10 <= 1000 && sf(this.pm.data, "view_content_playback_time", a10), this._playbackTimeTrackerLastPlayheadPosition = t11, this._lastTime = i10;
                    }
                  }
                ]), t10;
              }(), sV = function() {
                function t10(i10) {
                  sa(this, t10), sn(this, "pm", undefined), this.pm = i10;
                  var a10 = this._updatePlayheadTime.bind(this);
                  i10.on("playbackheartbeat", a10), i10.on("playbackheartbeatend", a10), i10.on("timeupdate", a10), i10.on("destroy", function() {
                    i10.off("timeupdate", a10);
                  });
                }
                return ss(t10, [
                  {
                    key: "_updateMaxPlayheadPosition",
                    value: function() {
                      this.pm.data.view_max_playhead_position = this.pm.data.view_max_playhead_position === undefined ? this.pm.data.player_playhead_time : Math.max(this.pm.data.view_max_playhead_position, this.pm.data.player_playhead_time);
                    }
                  },
                  {
                    key: "_updatePlayheadTime",
                    value: function(t11, i10) {
                      var a10 = this, r10 = function() {
                        a10.pm.currentFragmentPDT && a10.pm.currentFragmentStart && (a10.pm.data.player_program_time = a10.pm.currentFragmentPDT + a10.pm.data.player_playhead_time - a10.pm.currentFragmentStart);
                      };
                      if (i10 && i10.player_playhead_time)
                        this.pm.data.player_playhead_time = i10.player_playhead_time, r10(), this._updateMaxPlayheadPosition();
                      else if (this.pm.getPlayheadTime) {
                        var s10 = this.pm.getPlayheadTime();
                        s10 !== undefined && (this.pm.data.player_playhead_time = s10, r10(), this._updateMaxPlayheadPosition());
                      }
                    }
                  }
                ]), t10;
              }(), sH = function t10(i10) {
                if (sa(this, t10), !i10.disableRebufferTracking) {
                  var a10, r10 = function(t11, i11) {
                    s10(i11), a10 = undefined;
                  }, s10 = function(t11) {
                    if (a10) {
                      var r11 = t11.viewer_time - a10;
                      sf(i10.data, "view_rebuffer_duration", r11), a10 = t11.viewer_time, i10.data.view_rebuffer_duration > 300000 && (i10.emit("viewend"), i10.send("viewend"), i10.mux.log.warn("Ending view after rebuffering for longer than 300000ms, future events will be ignored unless a programchange or videochange occurs."));
                    }
                    i10.data.view_watch_time >= 0 && i10.data.view_rebuffer_count > 0 && (i10.data.view_rebuffer_frequency = i10.data.view_rebuffer_count / i10.data.view_watch_time, i10.data.view_rebuffer_percentage = i10.data.view_rebuffer_duration / i10.data.view_watch_time);
                  };
                  i10.on("playbackheartbeat", function(t11, i11) {
                    return s10(i11);
                  }), i10.on("rebufferstart", function(t11, s11) {
                    a10 || (sf(i10.data, "view_rebuffer_count", 1), a10 = s11.viewer_time, i10.one("rebufferend", r10));
                  }), i10.on("viewinit", function() {
                    a10 = undefined, i10.off("rebufferend", r10);
                  });
                }
              }, sU = function() {
                function t10(i10) {
                  var a10 = this;
                  sa(this, t10), sn(this, "_lastCheckedTime", undefined), sn(this, "_lastPlayheadTime", undefined), sn(this, "_lastPlayheadTimeUpdatedTime", undefined), sn(this, "_rebuffering", undefined), sn(this, "pm", undefined), this.pm = i10, i10.disableRebufferTracking || i10.disablePlayheadRebufferTracking || (this._lastCheckedTime = null, this._lastPlayheadTime = null, this._lastPlayheadTimeUpdatedTime = null, i10.on("playbackheartbeat", this._checkIfRebuffering.bind(this)), i10.on("playbackheartbeatend", this._cleanupRebufferTracker.bind(this)), i10.on("seeking", function() {
                    a10._cleanupRebufferTracker(null, { viewer_time: r4.now() });
                  }));
                }
                return ss(t10, [
                  {
                    key: "_checkIfRebuffering",
                    value: function(t11, i10) {
                      if (this.pm.seekingTracker.isSeeking || this.pm.adTracker.isAdBreak || !this.pm.playbackHeartbeat._playheadShouldBeProgressing) {
                        this._cleanupRebufferTracker(t11, i10);
                        return;
                      }
                      if (this._lastCheckedTime === null) {
                        this._prepareRebufferTrackerState(i10.viewer_time);
                        return;
                      }
                      if (this._lastPlayheadTime !== this.pm.data.player_playhead_time) {
                        this._cleanupRebufferTracker(t11, i10, true);
                        return;
                      }
                      var a10 = i10.viewer_time - this._lastPlayheadTimeUpdatedTime;
                      typeof this.pm.sustainedRebufferThreshold == "number" && a10 >= this.pm.sustainedRebufferThreshold && (this._rebuffering || (this._rebuffering = true, this.pm.emit("rebufferstart", { viewer_time: this._lastPlayheadTimeUpdatedTime }))), this._lastCheckedTime = i10.viewer_time;
                    }
                  },
                  {
                    key: "_clearRebufferTrackerState",
                    value: function() {
                      this._lastCheckedTime = null, this._lastPlayheadTime = null, this._lastPlayheadTimeUpdatedTime = null;
                    }
                  },
                  {
                    key: "_prepareRebufferTrackerState",
                    value: function(t11) {
                      this._lastCheckedTime = t11, this._lastPlayheadTime = this.pm.data.player_playhead_time, this._lastPlayheadTimeUpdatedTime = t11;
                    }
                  },
                  {
                    key: "_cleanupRebufferTracker",
                    value: function(t11, i10) {
                      var a10 = arguments.length > 2 && arguments[2] !== undefined && arguments[2];
                      if (this._rebuffering)
                        this._rebuffering = false, this.pm.emit("rebufferend", { viewer_time: i10.viewer_time });
                      else {
                        if (this._lastCheckedTime === null)
                          return;
                        var r10 = this.pm.data.player_playhead_time - this._lastPlayheadTime, s10 = i10.viewer_time - this._lastPlayheadTimeUpdatedTime;
                        typeof this.pm.minimumRebufferDuration == "number" && r10 > 0 && s10 - r10 > this.pm.minimumRebufferDuration && (this._lastCheckedTime = null, this.pm.emit("rebufferstart", { viewer_time: this._lastPlayheadTimeUpdatedTime }), this.pm.emit("rebufferend", { viewer_time: this._lastPlayheadTimeUpdatedTime + s10 - r10 }));
                      }
                      a10 ? this._prepareRebufferTrackerState(i10.viewer_time) : this._clearRebufferTrackerState();
                    }
                  }
                ]), t10;
              }(), sF = function() {
                function t10(i10) {
                  var a10 = this;
                  sa(this, t10), sn(this, "NAVIGATION_START", undefined), sn(this, "pm", undefined), this.pm = i10, i10.on("viewinit", function() {
                    var t11 = i10.data, r10 = t11.view_id;
                    if (!t11.view_program_changed) {
                      var s10 = function(t12, s11) {
                        var n10 = s11.viewer_time;
                        (t12.type === "playing" && i10.data.view_time_to_first_frame === undefined || t12.type === "adplaying" && (i10.data.view_time_to_first_frame === undefined || a10._inPrerollPosition())) && a10.calculateTimeToFirstFrame(n10 || r4.now(), r10);
                      };
                      i10.one("playing", s10), i10.one("adplaying", s10), i10.one("viewend", function() {
                        i10.off("playing", s10), i10.off("adplaying", s10);
                      });
                    }
                  });
                }
                return ss(t10, [
                  {
                    key: "_inPrerollPosition",
                    value: function() {
                      return this.pm.data.view_content_playback_time === undefined || this.pm.data.view_content_playback_time <= 1000;
                    }
                  },
                  {
                    key: "calculateTimeToFirstFrame",
                    value: function(t11, i10) {
                      i10 === this.pm.data.view_id && (this.pm.watchTimeTracker._updateWatchTime(null, { viewer_time: t11 }), this.pm.data.view_time_to_first_frame = this.pm.data.view_watch_time, (this.pm.data.player_autoplay_on || this.pm.data.video_is_autoplay) && this.NAVIGATION_START && (this.pm.data.view_aggregate_startup_time = this.pm.data.view_start + this.pm.data.view_watch_time - this.NAVIGATION_START));
                    }
                  }
                ]), t10;
              }(), s$ = function t10(i10) {
                var a10 = this;
                sa(this, t10), sn(this, "_lastPlayerHeight", undefined), sn(this, "_lastPlayerWidth", undefined), sn(this, "_lastPlayheadPosition", undefined), sn(this, "_lastSourceHeight", undefined), sn(this, "_lastSourceWidth", undefined), i10.on("viewinit", function() {
                  a10._lastPlayheadPosition = -1;
                }), ["pause", "rebufferstart", "seeking", "error", "adbreakstart", "hb", "renditionchange", "orientationchange", "viewend"].forEach(function(t11) {
                  i10.on(t11, function() {
                    if (a10._lastPlayheadPosition >= 0 && i10.data.player_playhead_time >= 0 && a10._lastPlayerWidth >= 0 && a10._lastSourceWidth > 0 && a10._lastPlayerHeight >= 0 && a10._lastSourceHeight > 0) {
                      var t12 = i10.data.player_playhead_time - a10._lastPlayheadPosition;
                      if (t12 < 0) {
                        a10._lastPlayheadPosition = -1;
                        return;
                      }
                      var r10 = Math.min(a10._lastPlayerWidth / a10._lastSourceWidth, a10._lastPlayerHeight / a10._lastSourceHeight), s10 = Math.max(0, r10 - 1), n10 = Math.max(0, 1 - r10);
                      i10.data.view_max_upscale_percentage = Math.max(i10.data.view_max_upscale_percentage || 0, s10), i10.data.view_max_downscale_percentage = Math.max(i10.data.view_max_downscale_percentage || 0, n10), sf(i10.data, "view_total_content_playback_time", t12), sf(i10.data, "view_total_upscaling", s10 * t12), sf(i10.data, "view_total_downscaling", n10 * t12);
                    }
                    a10._lastPlayheadPosition = -1;
                  });
                }), ["playing", "hb", "renditionchange", "orientationchange"].forEach(function(t11) {
                  i10.on(t11, function() {
                    a10._lastPlayheadPosition = i10.data.player_playhead_time, a10._lastPlayerWidth = i10.data.player_width, a10._lastPlayerHeight = i10.data.player_height, a10._lastSourceWidth = i10.data.video_source_width, a10._lastSourceHeight = i10.data.video_source_height;
                  });
                });
              }, sB = function t10(i10) {
                var a10 = this;
                sa(this, t10), sn(this, "isSeeking", undefined), this.isSeeking = false;
                var r10 = -1, s10 = function() {
                  var t11 = r4.now(), s11 = (i10.data.viewer_time || t11) - (r10 || t11);
                  sf(i10.data, "view_seek_duration", s11), i10.data.view_max_seek_time = Math.max(i10.data.view_max_seek_time || 0, s11), a10.isSeeking = false, r10 = -1;
                };
                i10.on("seeking", function(t11, n10) {
                  if (Object.assign(i10.data, n10), a10.isSeeking && n10.viewer_time - r10 <= 2000) {
                    r10 = n10.viewer_time;
                    return;
                  }
                  a10.isSeeking && s10(), a10.isSeeking = true, r10 = n10.viewer_time, sf(i10.data, "view_seek_count", 1), i10.send("seeking");
                }), i10.on("seeked", function() {
                  s10();
                }), i10.on("viewend", function() {
                  a10.isSeeking && (s10(), i10.send("seeked")), a10.isSeeking = false, r10 = -1;
                });
              }, sq = function(t10, i10) {
                t10.push(i10), t10.sort(function(t11, i11) {
                  return t11.viewer_time - i11.viewer_time;
                });
              }, sK = ["adbreakstart", "adrequest", "adresponse", "adplay", "adplaying", "adpause", "adended", "adbreakend", "aderror", "adclicked", "adskipped"], sZ = function() {
                function t10(i10) {
                  var a10 = this;
                  sa(this, t10), sn(this, "_adHasPlayed", undefined), sn(this, "_adRequests", undefined), sn(this, "_adResponses", undefined), sn(this, "_currentAdRequestNumber", undefined), sn(this, "_currentAdResponseNumber", undefined), sn(this, "_prerollPlayTime", undefined), sn(this, "_wouldBeNewAdPlay", undefined), sn(this, "isAdBreak", undefined), sn(this, "pm", undefined), this.pm = i10, i10.on("viewinit", function() {
                    a10.isAdBreak = false, a10._currentAdRequestNumber = 0, a10._currentAdResponseNumber = 0, a10._adRequests = [], a10._adResponses = [], a10._adHasPlayed = false, a10._wouldBeNewAdPlay = true, a10._prerollPlayTime = undefined;
                  }), sK.forEach(function(t11) {
                    return i10.on(t11, a10._updateAdData.bind(a10));
                  });
                  var r10 = function() {
                    a10.isAdBreak = false;
                  };
                  i10.on("adbreakstart", function() {
                    a10.isAdBreak = true;
                  }), i10.on("play", r10), i10.on("playing", r10), i10.on("viewend", r10), i10.on("adrequest", function(t11, r11) {
                    r11 = Object.assign({ ad_request_id: "generatedAdRequestId" + a10._currentAdRequestNumber++ }, r11), sq(a10._adRequests, r11), sf(i10.data, "view_ad_request_count"), a10.inPrerollPosition() && (i10.data.view_preroll_requested = true, a10._adHasPlayed || sf(i10.data, "view_preroll_request_count"));
                  }), i10.on("adresponse", function(t11, r11) {
                    r11 = Object.assign({ ad_request_id: "generatedAdRequestId" + a10._currentAdResponseNumber++ }, r11), sq(a10._adResponses, r11);
                    var s10 = a10.findAdRequest(r11.ad_request_id);
                    s10 && sf(i10.data, "view_ad_request_time", Math.max(0, r11.viewer_time - s10.viewer_time));
                  }), i10.on("adplay", function(t11, r11) {
                    a10._adHasPlayed = true, a10._wouldBeNewAdPlay && (a10._wouldBeNewAdPlay = false, sf(i10.data, "view_ad_played_count")), a10.inPrerollPosition() && !i10.data.view_preroll_played && (i10.data.view_preroll_played = true, a10._adRequests.length > 0 && (i10.data.view_preroll_request_time = Math.max(0, r11.viewer_time - a10._adRequests[0].viewer_time)), i10.data.view_start && (i10.data.view_startup_preroll_request_time = Math.max(0, r11.viewer_time - i10.data.view_start)), a10._prerollPlayTime = r11.viewer_time);
                  }), i10.on("adplaying", function(t11, r11) {
                    a10.inPrerollPosition() && i10.data.view_preroll_load_time === undefined && a10._prerollPlayTime !== undefined && (i10.data.view_preroll_load_time = r11.viewer_time - a10._prerollPlayTime, i10.data.view_startup_preroll_load_time = r11.viewer_time - a10._prerollPlayTime);
                  }), i10.on("adclicked", function(t11, r11) {
                    a10._wouldBeNewAdPlay || sf(i10.data, "view_ad_clicked_count");
                  }), i10.on("adskipped", function(t11, r11) {
                    a10._wouldBeNewAdPlay || sf(i10.data, "view_ad_skipped_count");
                  }), i10.on("adended", function() {
                    a10._wouldBeNewAdPlay = true;
                  }), i10.on("aderror", function() {
                    a10._wouldBeNewAdPlay = true;
                  });
                }
                return ss(t10, [
                  {
                    key: "inPrerollPosition",
                    value: function() {
                      return this.pm.data.view_content_playback_time === undefined || this.pm.data.view_content_playback_time <= 1000;
                    }
                  },
                  {
                    key: "findAdRequest",
                    value: function(t11) {
                      for (var i10 = 0;i10 < this._adRequests.length; i10++)
                        if (this._adRequests[i10].ad_request_id === t11)
                          return this._adRequests[i10];
                    }
                  },
                  {
                    key: "_updateAdData",
                    value: function(t11, i10) {
                      if (this.inPrerollPosition()) {
                        if (!this.pm.data.view_preroll_ad_tag_hostname && i10.ad_tag_url) {
                          var a10 = rQ(sc(i10.ad_tag_url), 2), r10 = a10[0], s10 = a10[1];
                          this.pm.data.view_preroll_ad_tag_domain = s10, this.pm.data.view_preroll_ad_tag_hostname = r10;
                        }
                        if (!this.pm.data.view_preroll_ad_asset_hostname && i10.ad_asset_url) {
                          var n10 = rQ(sc(i10.ad_asset_url), 2), o10 = n10[0], l2 = n10[1];
                          this.pm.data.view_preroll_ad_asset_domain = l2, this.pm.data.view_preroll_ad_asset_hostname = o10;
                        }
                      }
                      this.pm.data.ad_asset_url = i10?.ad_asset_url, this.pm.data.ad_tag_url = i10?.ad_tag_url, this.pm.data.ad_creative_id = i10?.ad_creative_id, this.pm.data.ad_id = i10?.ad_id, this.pm.data.ad_universal_id = i10?.ad_universal_id;
                    }
                  }
                ]), t10;
              }(), sz = rI(rR()), sG = function t10(i10) {
                sa(this, t10);
                var a10, r10, s10 = function() {
                  i10.disableRebufferTracking || (sf(i10.data, "view_waiting_rebuffer_count", 1), a10 = r4.now(), r10 = sz.default.setInterval(function() {
                    if (a10) {
                      var t11 = r4.now();
                      sf(i10.data, "view_waiting_rebuffer_duration", t11 - a10), a10 = t11;
                    }
                  }, 250));
                }, n10 = function() {
                  i10.disableRebufferTracking || a10 && (sf(i10.data, "view_waiting_rebuffer_duration", r4.now() - a10), a10 = false, sz.default.clearInterval(r10));
                }, o10 = false, l2 = function() {
                  o10 = true;
                }, d2 = function() {
                  o10 = false, n10();
                };
                i10.on("waiting", function() {
                  o10 && s10();
                }), i10.on("playing", function() {
                  n10(), l2();
                }), i10.on("pause", d2), i10.on("seeking", d2);
              }, sW = function t10(i10) {
                var a10 = this;
                sa(this, t10), sn(this, "lastWallClockTime", undefined);
                var r10 = function() {
                  a10.lastWallClockTime = r4.now(), i10.on("before*", s10);
                }, s10 = function(t11) {
                  var r11 = r4.now(), s11 = a10.lastWallClockTime;
                  a10.lastWallClockTime = r11, r11 - s11 > 30000 && (i10.emit("devicesleep", { viewer_time: s11 }), Object.assign(i10.data, { viewer_time: s11 }), i10.send("devicesleep"), i10.emit("devicewake", { viewer_time: r11 }), Object.assign(i10.data, { viewer_time: r11 }), i10.send("devicewake"));
                };
                i10.one("playbackheartbeat", r10), i10.on("playbackheartbeatend", function() {
                  i10.off("before*", s10), i10.one("playbackheartbeat", r10);
                });
              }, sJ = rI(rR()), sY = (ns = function() {
                for (var t10 = 0, i10 = {};t10 < arguments.length; t10++) {
                  var a10 = arguments[t10];
                  for (var r10 in a10)
                    i10[r10] = a10[r10];
                }
                return i10;
              }, function t10(i10) {
                function a10(t11, r10, s10) {
                  var n10;
                  if ("u" > typeof document) {
                    if (arguments.length > 1) {
                      if (typeof (s10 = ns({ path: "/" }, a10.defaults, s10)).expires == "number") {
                        var o10 = new Date;
                        o10.setMilliseconds(o10.getMilliseconds() + 86400000 * s10.expires), s10.expires = o10;
                      }
                      try {
                        n10 = JSON.stringify(r10), /^[\{\[]/.test(n10) && (r10 = n10);
                      } catch {}
                      return r10 = i10.write ? i10.write(r10, t11) : encodeURIComponent(String(r10)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), t11 = (t11 = (t11 = encodeURIComponent(String(t11))).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)).replace(/[\(\)]/g, escape), document.cookie = [
                        t11,
                        "=",
                        r10,
                        s10.expires ? "; expires=" + s10.expires.toUTCString() : "",
                        s10.path ? "; path=" + s10.path : "",
                        s10.domain ? "; domain=" + s10.domain : "",
                        s10.secure ? "; secure" : ""
                      ].join("");
                    }
                    t11 || (n10 = {});
                    for (var l2 = document.cookie ? document.cookie.split("; ") : [], d2 = /(%[0-9A-Z]{2})+/g, u2 = 0;u2 < l2.length; u2++) {
                      var c2 = l2[u2].split("="), h2 = c2.slice(1).join("=");
                      h2.charAt(0) === '"' && (h2 = h2.slice(1, -1));
                      try {
                        var p2 = c2[0].replace(d2, decodeURIComponent);
                        if (h2 = i10.read ? i10.read(h2, p2) : i10(h2, p2) || h2.replace(d2, decodeURIComponent), this.json)
                          try {
                            h2 = JSON.parse(h2);
                          } catch {}
                        if (t11 === p2) {
                          n10 = h2;
                          break;
                        }
                        t11 || (n10[p2] = h2);
                      } catch {}
                    }
                    return n10;
                  }
                }
                return a10.set = a10, a10.get = function(t11) {
                  return a10.call(a10, t11);
                }, a10.getJSON = function() {
                  return a10.apply({ json: true }, [].slice.call(arguments));
                }, a10.defaults = {}, a10.remove = function(t11, i11) {
                  a10(t11, "", ns(i11, { expires: -1 }));
                }, a10.withConverter = t10, a10;
              }(function() {})), sQ = "muxData", sX = function() {
                var t10;
                try {
                  t10 = (sY.get(sQ) || "").split("&").reduce(function(t11, i10) {
                    var a10 = rQ(i10.split("="), 2), r10 = a10[0], s10 = a10[1], n10 = +s10;
                    return t11[r10] = s10 && n10 == s10 ? n10 : s10, t11;
                  }, {});
                } catch {
                  t10 = {};
                }
                return t10;
              }, s0 = function(t10) {
                try {
                  sY.set(sQ, Object.entries(t10).map(function(t11) {
                    var i10 = rQ(t11, 2);
                    return `${i10[0]}=${i10[1]}`;
                  }).join("&"), { expires: 365 });
                } catch {}
              }, s1 = function() {
                var t10 = sX();
                return t10.mux_viewer_id = t10.mux_viewer_id || r2(), t10.msn = t10.msn || Math.random(), s0(t10), { mux_viewer_id: t10.mux_viewer_id, mux_sample_number: t10.msn };
              }, s4 = function() {
                var t10 = sX(), i10 = r4.now();
                return t10.session_start && (t10.sst = t10.session_start, delete t10.session_start), t10.session_id && (t10.sid = t10.session_id, delete t10.session_id), t10.session_expires && (t10.sex = t10.session_expires, delete t10.session_expires), (!t10.sex || t10.sex < i10) && (t10.sid = r2(), t10.sst = i10), t10.sex = i10 + 1500000, s0(t10), { session_id: t10.sid, session_start: t10.sst, session_expires: t10.sex };
              }, s2 = rI(rR()), s3 = function() {
                var t10;
                switch (s5()) {
                  case "cellular":
                    t10 = "cellular";
                    break;
                  case "ethernet":
                    t10 = "wired";
                    break;
                  case "wifi":
                    t10 = "wifi";
                    break;
                  case undefined:
                    break;
                  default:
                    t10 = "other";
                }
                return t10;
              }, s5 = function() {
                var t10 = s2.default.navigator, i10 = t10 && (t10.connection || t10.mozConnection || t10.webkitConnection);
                return i10 && i10.type;
              };
              s3.getConnectionFromAPI = s5;
              var s6 = s8({
                a: "env",
                b: "beacon",
                c: "custom",
                d: "ad",
                e: "event",
                f: "experiment",
                i: "internal",
                m: "mux",
                n: "response",
                p: "player",
                q: "request",
                r: "retry",
                s: "session",
                t: "timestamp",
                u: "viewer",
                v: "video",
                w: "page",
                x: "view",
                y: "sub"
              }), s7 = s8({
                ad: "ad",
                af: "affiliate",
                ag: "aggregate",
                ap: "api",
                al: "application",
                ao: "audio",
                ar: "architecture",
                as: "asset",
                au: "autoplay",
                av: "average",
                bi: "bitrate",
                bn: "brand",
                br: "break",
                bw: "browser",
                by: "bytes",
                bz: "business",
                ca: "cached",
                cb: "cancel",
                cc: "codec",
                cd: "code",
                cg: "category",
                ch: "changed",
                ci: "client",
                ck: "clicked",
                cl: "canceled",
                cn: "config",
                co: "count",
                ce: "counter",
                cp: "complete",
                cq: "creator",
                cr: "creative",
                cs: "captions",
                ct: "content",
                cu: "current",
                cx: "connection",
                cz: "context",
                dg: "downscaling",
                dm: "domain",
                dn: "cdn",
                do: "downscale",
                dr: "drm",
                dp: "dropped",
                du: "duration",
                dv: "device",
                dy: "dynamic",
                eb: "enabled",
                ec: "encoding",
                ed: "edge",
                en: "end",
                eg: "engine",
                em: "embed",
                er: "error",
                ep: "experiments",
                es: "errorcode",
                et: "errortext",
                ee: "event",
                ev: "events",
                ex: "expires",
                ez: "exception",
                fa: "failed",
                fi: "first",
                fm: "family",
                ft: "format",
                fp: "fps",
                fq: "frequency",
                fr: "frame",
                fs: "fullscreen",
                ha: "has",
                hb: "holdback",
                he: "headers",
                ho: "host",
                hn: "hostname",
                ht: "height",
                id: "id",
                ii: "init",
                in: "instance",
                ip: "ip",
                is: "is",
                ke: "key",
                la: "language",
                lb: "labeled",
                le: "level",
                li: "live",
                ld: "loaded",
                lo: "load",
                ls: "lists",
                lt: "latency",
                ma: "max",
                md: "media",
                me: "message",
                mf: "manifest",
                mi: "mime",
                ml: "midroll",
                mm: "min",
                mn: "manufacturer",
                mo: "model",
                mx: "mux",
                ne: "newest",
                nm: "name",
                no: "number",
                on: "on",
                or: "origin",
                os: "os",
                pa: "paused",
                pb: "playback",
                pd: "producer",
                pe: "percentage",
                pf: "played",
                pg: "program",
                ph: "playhead",
                pi: "plugin",
                pl: "preroll",
                pn: "playing",
                po: "poster",
                pp: "pip",
                pr: "preload",
                ps: "position",
                pt: "part",
                py: "property",
                px: "pop",
                pz: "plan",
                ra: "rate",
                rd: "requested",
                re: "rebuffer",
                rf: "rendition",
                rg: "range",
                rm: "remote",
                ro: "ratio",
                rp: "response",
                rq: "request",
                rs: "requests",
                sa: "sample",
                sd: "skipped",
                se: "session",
                sh: "shift",
                sk: "seek",
                sm: "stream",
                so: "source",
                sq: "sequence",
                sr: "series",
                ss: "status",
                st: "start",
                su: "startup",
                sv: "server",
                sw: "software",
                sy: "severity",
                ta: "tag",
                tc: "tech",
                te: "text",
                tg: "target",
                th: "throughput",
                ti: "time",
                tl: "total",
                to: "to",
                tt: "title",
                ty: "type",
                ug: "upscaling",
                un: "universal",
                up: "upscale",
                ur: "url",
                us: "user",
                va: "variant",
                vd: "viewed",
                vi: "video",
                ve: "version",
                vw: "view",
                vr: "viewer",
                wd: "width",
                wa: "watch",
                wt: "waiting"
              });
              function s8(t10) {
                var i10 = {};
                for (var a10 in t10)
                  t10.hasOwnProperty(a10) && (i10[t10[a10]] = a10);
                return i10;
              }
              function s9(t10) {
                var i10 = {}, a10 = {};
                return Object.keys(t10).forEach(function(r10) {
                  var s10 = false;
                  if (t10.hasOwnProperty(r10) && t10[r10] !== undefined) {
                    var n10 = r10.split("_"), o10 = n10[0], l2 = s6[o10];
                    l2 ||= (r9.info("Data key word `" + n10[0] + "` not expected in " + r10), o10 + "_"), n10.splice(1).forEach(function(t11) {
                      t11 === "url" && (s10 = true), s7[t11] ? l2 += s7[t11] : Number.isInteger(Number(t11)) ? l2 += t11 : (r9.info("Data key word `" + t11 + "` not expected in " + r10), l2 += "_" + t11 + "_");
                    }), s10 ? a10[l2] = t10[r10] : i10[l2] = t10[r10];
                  }
                }), Object.assign(i10, a10);
              }
              var ne = rI(rR()), nt = rI(rW()), ni = { maxBeaconSize: 300, maxQueueLength: 3600, baseTimeBetweenBeacons: 1e4, maxPayloadKBSize: 500 }, na = ["hb", "requestcompleted", "requestfailed", "requestcanceled"], nr = function(t10) {
                var i10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                this._beaconUrl = t10 || "https://img.litix.io", this._eventQueue = [], this._postInFlight = false, this._resendAfterPost = false, this._failureCount = 0, this._sendTimeout = false, this._options = Object.assign({}, ni, i10);
              };
              nr.prototype.queueEvent = function(t10, i10) {
                var a10 = Object.assign({}, i10);
                return (this._eventQueue.length <= this._options.maxQueueLength || t10 === "eventrateexceeded") && (this._eventQueue.push(a10), this._sendTimeout || this._startBeaconSending(), this._eventQueue.length <= this._options.maxQueueLength);
              }, nr.prototype.flushEvents = function() {
                if (arguments.length > 0 && arguments[0] !== undefined && arguments[0] && this._eventQueue.length === 1) {
                  this._eventQueue.pop();
                  return;
                }
                this._eventQueue.length && this._sendBeaconQueue(), this._startBeaconSending();
              }, nr.prototype.destroy = function() {
                var t10 = arguments.length > 0 && arguments[0] !== undefined && arguments[0];
                this.destroyed = true, t10 ? this._clearBeaconQueue() : this.flushEvents(), ne.default.clearTimeout(this._sendTimeout);
              }, nr.prototype._clearBeaconQueue = function() {
                var t10 = this._eventQueue.length > this._options.maxBeaconSize ? this._eventQueue.length - this._options.maxBeaconSize : 0, i10 = this._eventQueue.slice(t10);
                t10 > 0 && Object.assign(i10[i10.length - 1], s9({ mux_view_message: "event queue truncated" }));
                var a10 = this._createPayload(i10);
                nd(this._beaconUrl, a10, true, function() {});
              }, nr.prototype._sendBeaconQueue = function() {
                var t10 = this;
                if (this._postInFlight) {
                  this._resendAfterPost = true;
                  return;
                }
                var i10 = this._eventQueue.slice(0, this._options.maxBeaconSize);
                this._eventQueue = this._eventQueue.slice(this._options.maxBeaconSize), this._postInFlight = true;
                var a10 = this._createPayload(i10), r10 = r4.now();
                nd(this._beaconUrl, a10, false, function(a11, s10) {
                  s10 ? (t10._eventQueue = i10.concat(t10._eventQueue), t10._failureCount += 1, r9.info("Error sending beacon: " + s10)) : t10._failureCount = 0, t10._roundTripTime = r4.now() - r10, t10._postInFlight = false, t10._resendAfterPost && (t10._resendAfterPost = false, t10._eventQueue.length > 0 && t10._sendBeaconQueue());
                });
              }, nr.prototype._getNextBeaconTime = function() {
                if (!this._failureCount)
                  return this._options.baseTimeBetweenBeacons;
                var t10 = 2 ** (this._failureCount - 1);
                return (1 + (t10 *= Math.random())) * this._options.baseTimeBetweenBeacons;
              }, nr.prototype._startBeaconSending = function() {
                var t10 = this;
                ne.default.clearTimeout(this._sendTimeout), this.destroyed || (this._sendTimeout = ne.default.setTimeout(function() {
                  t10._eventQueue.length && t10._sendBeaconQueue(), t10._startBeaconSending();
                }, this._getNextBeaconTime()));
              }, nr.prototype._createPayload = function(t10) {
                var i10 = this, a10 = { transmission_timestamp: Math.round(r4.now()) };
                this._roundTripTime && (a10.rtt_ms = Math.round(this._roundTripTime));
                var r10, s10, n10, o10 = function() {
                  n10 = (r10 = JSON.stringify({ metadata: a10, events: s10 || t10 })).length / 1024;
                }, l2 = function() {
                  return n10 <= i10._options.maxPayloadKBSize;
                };
                return o10(), l2() || (r9.info("Payload size is too big (" + n10 + " kb). Removing unnecessary events."), s10 = t10.filter(function(t11) {
                  return na.indexOf(t11.e) === -1;
                }), o10()), l2() || (r9.info("Payload size still too big (" + n10 + " kb). Cropping fields.."), s10.forEach(function(t11) {
                  for (var i11 in t11) {
                    var a11 = t11[i11];
                    typeof a11 == "string" && a11.length > 51200 && (t11[i11] = a11.substring(0, 51200));
                  }
                }), o10()), r10;
              };
              var ns, nn, no, nl = typeof nt.default.exitPictureInPicture == "function" ? function(t10) {
                return t10.length <= 57344;
              } : function(t10) {
                return false;
              }, nd = function(t10, i10, a10, r10) {
                if (a10 && navigator && navigator.sendBeacon && navigator.sendBeacon(t10, i10)) {
                  r10();
                  return;
                }
                if (ne.default.fetch) {
                  ne.default.fetch(t10, { method: "POST", body: i10, headers: { "Content-Type": "text/plain" }, keepalive: nl(i10) }).then(function(t11) {
                    return r10(null, t11.ok ? null : "Error");
                  }).catch(function(t11) {
                    return r10(null, t11);
                  });
                  return;
                }
                if (ne.default.XMLHttpRequest) {
                  var s10 = new ne.default.XMLHttpRequest;
                  s10.onreadystatechange = function() {
                    if (s10.readyState === 4)
                      return r10(null, s10.status === 200 ? undefined : "error");
                  }, s10.open("POST", t10), s10.setRequestHeader("Content-Type", "text/plain"), s10.send(i10);
                  return;
                }
                r10();
              }, nu = [
                "env_key",
                "view_id",
                "view_sequence_number",
                "player_sequence_number",
                "beacon_domain",
                "player_playhead_time",
                "viewer_time",
                "mux_api_version",
                "event",
                "video_id",
                "player_instance_id",
                "player_error_code",
                "player_error_message",
                "player_error_context",
                "player_error_severity",
                "player_error_business_exception"
              ], nc = ["adplay", "adplaying", "adpause", "adfirstquartile", "admidpoint", "adthirdquartile", "adended", "adresponse", "adrequest"], nh = ["ad_id", "ad_creative_id", "ad_universal_id"], np = ["viewstart", "error", "ended", "viewend"], nf = function() {
                function t10(i10, a10) {
                  var r10, s10, n10, o10, l2, d2, u2, c2, h2, p2, f2, g2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                  sa(this, t10), sn(this, "mux", undefined), sn(this, "envKey", undefined), sn(this, "options", undefined), sn(this, "eventQueue", undefined), sn(this, "sampleRate", undefined), sn(this, "disableCookies", undefined), sn(this, "respectDoNotTrack", undefined), sn(this, "previousBeaconData", undefined), sn(this, "lastEventTime", undefined), sn(this, "rateLimited", undefined), sn(this, "pageLevelData", undefined), sn(this, "viewerData", undefined), this.mux = i10, this.envKey = a10, this.options = g2, this.previousBeaconData = null, this.lastEventTime = 0, this.rateLimited = false, this.eventQueue = new nr((r10 = this.envKey, n10 = (s10 = this.options).beaconCollectionDomain, o10 = s10.beaconDomain, n10 ? "https://" + n10 : (r10 ||= "inferred").match(/^[a-z0-9]+$/) ? "https://" + r10 + "." + (o10 || "litix.io") : "https://img.litix.io/a.gif")), this.sampleRate = this.options.sampleRate ?? 1, this.disableCookies = this.options.disableCookies ?? false, this.respectDoNotTrack = this.options.respectDoNotTrack ?? false, this.previousBeaconData = null, this.lastEventTime = 0, this.rateLimited = false, this.pageLevelData = {
                    mux_api_version: this.mux.API_VERSION,
                    mux_embed: this.mux.NAME,
                    mux_embed_version: this.mux.VERSION,
                    viewer_application_name: this.options.platform?.name,
                    viewer_application_version: this.options.platform?.version,
                    viewer_application_engine: this.options.platform?.layout,
                    viewer_device_name: this.options.platform?.product,
                    viewer_device_category: "",
                    viewer_device_manufacturer: this.options.platform?.manufacturer,
                    viewer_os_family: (d2 = this.options.platform) == null || (l2 = d2.os) == null ? undefined : l2.family,
                    viewer_os_architecture: (c2 = this.options.platform) == null || (u2 = c2.os) == null ? undefined : u2.architecture,
                    viewer_os_version: (p2 = this.options.platform) == null || (h2 = p2.os) == null ? undefined : h2.version,
                    viewer_connection_type: s3(),
                    page_url: sJ.default === null || sJ.default === undefined || (f2 = sJ.default.location) == null ? undefined : f2.href
                  }, this.viewerData = this.disableCookies ? {} : s1();
                }
                return ss(t10, [
                  {
                    key: "send",
                    value: function(t11, i10) {
                      if (!(!t11 || !(i10 != null && i10.view_id))) {
                        if (this.respectDoNotTrack && st())
                          return r9.info("Not sending `" + t11 + "` because Do Not Track is enabled");
                        if (!i10 || typeof i10 != "object")
                          return r9.error("A data object was expected in send() but was not provided");
                        var a10 = this.disableCookies ? {} : s4(), r10 = sv(sg({}, this.pageLevelData, i10, a10, this.viewerData), { event: t11, env_key: this.envKey });
                        r10.user_id && (r10.viewer_user_id = r10.user_id, delete r10.user_id);
                        var s10 = (r10.mux_sample_number ?? 0) >= this.sampleRate, n10 = s9(this._deduplicateBeaconData(t11, r10));
                        if (this.lastEventTime = this.mux.utils.now(), s10)
                          return r9.info("Not sending event due to sample rate restriction", t11, r10, n10);
                        if (this.envKey || r9.info("Missing environment key (envKey) - beacons will be dropped if the video source is not a valid mux video URL", t11, r10, n10), !this.rateLimited) {
                          if (r9.info("Sending event", t11, r10, n10), this.rateLimited = !this.eventQueue.queueEvent(t11, n10), this.mux.WINDOW_UNLOADING && t11 === "viewend")
                            this.eventQueue.destroy(true);
                          else if (this.mux.WINDOW_HIDDEN && t11 === "hb" ? this.eventQueue.flushEvents(true) : np.indexOf(t11) >= 0 && this.eventQueue.flushEvents(), this.rateLimited)
                            return r10.event = "eventrateexceeded", n10 = s9(r10), this.eventQueue.queueEvent(r10.event, n10), r9.error("Beaconing disabled due to rate limit.");
                        }
                      }
                    }
                  },
                  {
                    key: "destroy",
                    value: function() {
                      this.eventQueue.destroy(false);
                    }
                  },
                  {
                    key: "_deduplicateBeaconData",
                    value: function(t11, i10) {
                      var a10 = this, r10 = {}, s10 = i10.view_id;
                      if (s10 === "-1" || t11 === "viewstart" || t11 === "viewend" || !this.previousBeaconData || this.mux.utils.now() - this.lastEventTime >= 600000)
                        r10 = sg({}, i10), s10 && (this.previousBeaconData = r10), s10 && t11 === "viewend" && (this.previousBeaconData = null);
                      else {
                        var n10 = t11.indexOf("request") === 0;
                        Object.entries(i10).forEach(function(i11) {
                          var s11 = rQ(i11, 2), o10 = s11[0], l2 = s11[1];
                          a10.previousBeaconData && (l2 !== a10.previousBeaconData[o10] || nu.indexOf(o10) > -1 || a10.objectHasChanged(n10, o10, l2, a10.previousBeaconData[o10]) || a10.eventRequiresKey(t11, o10)) && (r10[o10] = l2, a10.previousBeaconData[o10] = l2);
                        });
                      }
                      return r10;
                    }
                  },
                  {
                    key: "objectHasChanged",
                    value: function(t11, i10, a10, r10) {
                      return !!t11 && i10.indexOf("request_") === 0 && (i10 === "request_response_headers" || typeof a10 != "object" || typeof r10 != "object" || Object.keys(a10 || {}).length !== Object.keys(r10 || {}).length);
                    }
                  },
                  {
                    key: "eventRequiresKey",
                    value: function(t11, i10) {
                      return !!(t11 === "renditionchange" && i10.indexOf("video_source_") === 0 || nh.includes(i10) && nc.includes(t11));
                    }
                  }
                ]), t10;
              }(), ng = function t10(i10) {
                sa(this, t10);
                var a10 = 0, r10 = 0, s10 = 0, n10 = 0, o10 = 0, l2 = 0, d2 = 0;
                i10.on("requestcompleted", function(t11, l3) {
                  var d3, u2, c2 = l3.request_start, h2 = l3.request_response_start, p2 = l3.request_response_end, f2 = l3.request_bytes_loaded;
                  if (n10++, h2 ? (d3 = h2 - (c2 ?? 0), u2 = (p2 ?? 0) - h2) : u2 = (p2 ?? 0) - (c2 ?? 0), u2 > 0 && f2 && f2 > 0) {
                    var g2 = f2 / u2 * 8000;
                    o10++, r10 += f2, s10 += u2, i10.data.view_min_request_throughput = Math.min(i10.data.view_min_request_throughput || 1 / 0, g2), i10.data.view_average_request_throughput = r10 / s10 * 8000, i10.data.view_request_count = n10, d3 > 0 && (a10 += d3, i10.data.view_max_request_latency = Math.max(i10.data.view_max_request_latency || 0, d3), i10.data.view_average_request_latency = a10 / o10);
                  }
                }), i10.on("requestfailed", function(t11, a11) {
                  n10++, l2++, i10.data.view_request_count = n10, i10.data.view_request_failed_count = l2;
                }), i10.on("requestcanceled", function(t11, a11) {
                  n10++, d2++, i10.data.view_request_count = n10, i10.data.view_request_canceled_count = d2;
                });
              }, nv = function t10(i10) {
                var a10 = this;
                sa(this, t10), sn(this, "_lastEventTime", undefined), i10.on("before*", function(t11, r10) {
                  var s10 = r10.viewer_time, n10 = r4.now(), o10 = a10._lastEventTime;
                  if (a10._lastEventTime = n10, o10 && n10 - o10 > 3600000) {
                    var l2 = Object.keys(i10.data).reduce(function(t12, a11) {
                      return a11.indexOf("video_") === 0 ? Object.assign(t12, sn({}, a11, i10.data[a11])) : t12;
                    }, {});
                    i10.mux.log.info("Received event after at least an hour inactivity, creating a new view");
                    var d2 = i10.playbackHeartbeat._playheadShouldBeProgressing;
                    i10._resetView(Object.assign({ viewer_time: s10 }, l2)), i10.playbackHeartbeat._playheadShouldBeProgressing = d2, i10.playbackHeartbeat._playheadShouldBeProgressing && t11.type !== "play" && t11.type !== "adbreakstart" && (i10.emit("play", { viewer_time: s10 }), t11.type !== "playing" && i10.emit("playing", { viewer_time: s10 }));
                  }
                });
              }, nm = "viewstart.ended.loadstart.pause.play.playing.ratechange.waiting.adplay.adpause.adended.aderror.adplaying.adrequest.adresponse.adbreakstart.adbreakend.adfirstquartile.admidpoint.adthirdquartile.rebufferstart.rebufferend.seeked.error.hb.requestcompleted.requestfailed.requestcanceled.renditionchange".split("."), ny = new Set(["requestcompleted", "requestfailed", "requestcanceled"]), n_ = function(t10) {
                (function(t11, i11) {
                  if (typeof i11 != "function" && i11 !== null)
                    throw TypeError("Super expression must either be null or a function");
                  t11.prototype = Object.create(i11 && i11.prototype, { constructor: { value: t11, writable: true, configurable: true } }), i11 && sd(t11, i11);
                })(r10, t10);
                var i10, a10 = (i10 = function() {
                  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham)
                    return false;
                  if (typeof Proxy == "function")
                    return true;
                  try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), true;
                  } catch {
                    return false;
                  }
                }(), function() {
                  var t11, a11 = so(r10);
                  return t11 = i10 ? Reflect.construct(a11, arguments, so(this).constructor) : a11.apply(this, arguments), t11 && (rN(t11) === "object" || typeof t11 == "function") ? t11 : si(this);
                });
                function r10(t11, i11, s10) {
                  sa(this, r10);
                  var n10 = a10.call(this);
                  sn(si(n10), "DOM_CONTENT_LOADED_EVENT_END", undefined), sn(si(n10), "NAVIGATION_START", undefined), sn(si(n10), "_destroyed", undefined), sn(si(n10), "_heartBeatTimeout", undefined), sn(si(n10), "adTracker", undefined), sn(si(n10), "dashjs", undefined), sn(si(n10), "data", undefined), sn(si(n10), "disablePlayheadRebufferTracking", undefined), sn(si(n10), "disableRebufferTracking", undefined), sn(si(n10), "errorTracker", undefined), sn(si(n10), "errorTranslator", undefined), sn(si(n10), "emitTranslator", undefined), sn(si(n10), "getAdData", undefined), sn(si(n10), "getPlayheadTime", undefined), sn(si(n10), "getStateData", undefined), sn(si(n10), "stateDataTranslator", undefined), sn(si(n10), "hlsjs", undefined), sn(si(n10), "id", undefined), sn(si(n10), "longResumeTracker", undefined), sn(si(n10), "minimumRebufferDuration", undefined), sn(si(n10), "mux", undefined), sn(si(n10), "playbackEventDispatcher", undefined), sn(si(n10), "playbackHeartbeat", undefined), sn(si(n10), "playbackHeartbeatTime", undefined), sn(si(n10), "playheadTime", undefined), sn(si(n10), "seekingTracker", undefined), sn(si(n10), "sustainedRebufferThreshold", undefined), sn(si(n10), "watchTimeTracker", undefined), sn(si(n10), "currentFragmentPDT", undefined), sn(si(n10), "currentFragmentStart", undefined), n10.DOM_CONTENT_LOADED_EVENT_END = sp.domContentLoadedEventEnd(), n10.NAVIGATION_START = sp.navigationStart(), n10.mux = t11, n10.id = i11, s10 != null && s10.beaconDomain && n10.mux.log.warn("The `beaconDomain` setting has been deprecated in favor of `beaconCollectionDomain`. Please change your integration to use `beaconCollectionDomain` instead of `beaconDomain`."), (s10 = Object.assign({
                    debug: false,
                    minimumRebufferDuration: 250,
                    sustainedRebufferThreshold: 1000,
                    playbackHeartbeatTime: 25,
                    beaconDomain: "litix.io",
                    sampleRate: 1,
                    disableCookies: false,
                    respectDoNotTrack: false,
                    disableRebufferTracking: false,
                    disablePlayheadRebufferTracking: false,
                    errorTranslator: function(t12) {
                      return t12;
                    },
                    emitTranslator: function() {
                      return [...arguments];
                    },
                    stateDataTranslator: function(t12) {
                      return t12;
                    }
                  }, s10)).data = s10.data || {}, s10.data.property_key && (s10.data.env_key = s10.data.property_key, delete s10.data.property_key), r9.level = s10.debug ? r8.DEBUG : r8.WARN, n10.getPlayheadTime = s10.getPlayheadTime, n10.getStateData = s10.getStateData || function() {
                    return {};
                  }, n10.getAdData = s10.getAdData || function() {}, n10.minimumRebufferDuration = s10.minimumRebufferDuration, n10.sustainedRebufferThreshold = s10.sustainedRebufferThreshold, n10.playbackHeartbeatTime = s10.playbackHeartbeatTime, n10.disableRebufferTracking = s10.disableRebufferTracking, n10.disableRebufferTracking && n10.mux.log.warn("Disabling rebuffer tracking. This should only be used in specific circumstances as a last resort when your player is known to unreliably track rebuffering."), n10.disablePlayheadRebufferTracking = s10.disablePlayheadRebufferTracking, n10.errorTranslator = s10.errorTranslator, n10.emitTranslator = s10.emitTranslator, n10.stateDataTranslator = s10.stateDataTranslator, n10.playbackEventDispatcher = new nf(t11, s10.data.env_key, s10), n10.data = { player_instance_id: r2(), mux_sample_rate: s10.sampleRate, beacon_domain: s10.beaconCollectionDomain || s10.beaconDomain }, n10.data.view_sequence_number = 1, n10.data.player_sequence_number = 1;
                  var o10 = function() {
                    this.data.view_start === undefined && (this.data.view_start = this.mux.utils.now(), this.emit("viewstart"));
                  }.bind(si(n10));
                  if (n10.on("viewinit", function(t12, i12) {
                    this._resetVideoData(), this._resetViewData(), this._resetErrorData(), this._updateStateData(), Object.assign(this.data, i12), this._initializeViewData(), this.one("play", o10), this.one("adbreakstart", o10);
                  }), n10.on("videochange", function(t12, i12) {
                    this._resetView(i12);
                  }), n10.on("programchange", function(t12, i12) {
                    this.data.player_is_paused && this.mux.log.warn("The `programchange` event is intended to be used when the content changes mid playback without the video source changing, however the video is not currently playing. If the video source is changing please use the videochange event otherwise you will lose startup time information."), this._resetView(Object.assign(i12, { view_program_changed: true })), o10(), this.emit("play"), this.emit("playing");
                  }), n10.on("fragmentchange", function(t12, i12) {
                    this.currentFragmentPDT = i12.currentFragmentPDT, this.currentFragmentStart = i12.currentFragmentStart;
                  }), n10.on("destroy", n10.destroy), "u" > typeof window && typeof window.addEventListener == "function" && typeof window.removeEventListener == "function") {
                    var l2 = function() {
                      var t12 = n10.data.view_start !== undefined;
                      n10.mux.WINDOW_HIDDEN = document.visibilityState === "hidden", t12 && n10.mux.WINDOW_HIDDEN && (n10.data.player_is_paused || n10.emit("hb"));
                    };
                    window.addEventListener("visibilitychange", l2, false);
                    var d2 = function(t12) {
                      t12.persisted || n10.destroy();
                    };
                    window.addEventListener("pagehide", d2, false), n10.on("destroy", function() {
                      window.removeEventListener("visibilitychange", l2), window.removeEventListener("pagehide", d2);
                    });
                  }
                  return n10.on("playerready", function(t12, i12) {
                    Object.assign(this.data, i12);
                  }), nm.forEach(function(t12) {
                    n10.on(t12, function(i12, a11) {
                      t12.indexOf("ad") !== 0 && this._updateStateData(), Object.assign(this.data, a11), this._sanitizeData();
                    }), n10.on("after" + t12, function() {
                      (t12 !== "error" || this.errorTracker.viewErrored) && this.send(t12);
                    });
                  }), n10.on("viewend", function(t12, i12) {
                    Object.assign(n10.data, i12);
                  }), n10.one("playerready", function(t12) {
                    var i12 = this.mux.utils.now();
                    this.data.player_init_time && (this.data.player_startup_time = i12 - this.data.player_init_time), !this.mux.PLAYER_TRACKED && this.NAVIGATION_START && (this.mux.PLAYER_TRACKED = true, (this.data.player_init_time || this.DOM_CONTENT_LOADED_EVENT_END) && (this.data.page_load_time = Math.min(this.data.player_init_time || 1 / 0, this.DOM_CONTENT_LOADED_EVENT_END || 1 / 0) - this.NAVIGATION_START)), this.send("playerready"), delete this.data.player_startup_time, delete this.data.page_load_time;
                  }), n10.longResumeTracker = new nv(si(n10)), n10.errorTracker = new sN(si(n10)), new sW(si(n10)), n10.seekingTracker = new sB(si(n10)), n10.playheadTime = new sV(si(n10)), n10.playbackHeartbeat = new sM(si(n10)), new s$(si(n10)), n10.watchTimeTracker = new sj(si(n10)), new sO(si(n10)), n10.adTracker = new sZ(si(n10)), new sU(si(n10)), new sH(si(n10)), new sF(si(n10)), new sG(si(n10)), new ng(si(n10)), s10.hlsjs && n10.addHLSJS(s10), s10.dashjs && n10.addDashJS(s10), n10.emit("viewinit", s10.data), n10;
                }
                return ss(r10, [
                  {
                    key: "emit",
                    value: function(t11, i11) {
                      var a11, s10 = Object.assign({ viewer_time: this.mux.utils.now() }, i11), n10 = [t11, s10];
                      if (this.emitTranslator)
                        try {
                          n10 = this.emitTranslator(t11, s10);
                        } catch (t12) {
                          this.mux.log.warn("Exception in emit translator callback.", t12);
                        }
                      n10 != null && n10.length && (a11 = sl(so(r10.prototype), "emit", this)).call.apply(a11, [this].concat(r7(n10)));
                    }
                  },
                  {
                    key: "destroy",
                    value: function() {
                      this._destroyed || (this._destroyed = true, this.data.view_start !== undefined && (this.emit("viewend"), this.send("viewend")), this.playbackEventDispatcher.destroy(), this.removeHLSJS(), this.removeDashJS(), window.clearTimeout(this._heartBeatTimeout));
                    }
                  },
                  {
                    key: "send",
                    value: function(t11) {
                      if (this.data.view_id) {
                        var i11 = Object.assign({}, this.data);
                        if (i11.video_source_is_live === undefined && (i11.player_source_duration === 1 / 0 || i11.video_source_duration === 1 / 0 ? i11.video_source_is_live = true : (i11.player_source_duration > 0 || i11.video_source_duration > 0) && (i11.video_source_is_live = false)), i11.video_source_is_live || [
                          "player_program_time",
                          "player_manifest_newest_program_time",
                          "player_live_edge_program_time",
                          "player_program_time",
                          "video_holdback",
                          "video_part_holdback",
                          "video_target_duration",
                          "video_part_target_duration"
                        ].forEach(function(t12) {
                          i11[t12] = undefined;
                        }), i11.video_source_url = i11.video_source_url || i11.player_source_url, i11.video_source_url) {
                          var a11 = rQ(sc(i11.video_source_url), 2), r11 = a11[0];
                          i11.video_source_domain = a11[1], i11.video_source_hostname = r11;
                        }
                        delete i11.ad_request_id, this.playbackEventDispatcher.send(t11, i11), this.data.view_sequence_number++, this.data.player_sequence_number++, ny.has(t11) || this._restartHeartBeat(), t11 === "viewend" && delete this.data.view_id;
                      }
                    }
                  },
                  {
                    key: "_resetView",
                    value: function(t11) {
                      this.emit("viewend"), this.send("viewend"), this.emit("viewinit", t11);
                    }
                  },
                  {
                    key: "_updateStateData",
                    value: function() {
                      var t11 = this.getStateData();
                      if (typeof this.stateDataTranslator == "function")
                        try {
                          t11 = this.stateDataTranslator(t11);
                        } catch (t12) {
                          this.mux.log.warn("Exception in stateDataTranslator translator callback.", t12);
                        }
                      Object.assign(this.data, t11), this.playheadTime._updatePlayheadTime(), this._sanitizeData();
                    }
                  },
                  {
                    key: "_sanitizeData",
                    value: function() {
                      var t11 = this;
                      [
                        "player_width",
                        "player_height",
                        "video_source_width",
                        "video_source_height",
                        "player_playhead_time",
                        "video_source_bitrate"
                      ].forEach(function(i11) {
                        var a11 = parseInt(t11.data[i11], 10);
                        t11.data[i11] = isNaN(a11) ? undefined : a11;
                      }), ["player_source_url", "video_source_url"].forEach(function(i11) {
                        if (t11.data[i11]) {
                          var a11 = t11.data[i11].toLowerCase();
                          (a11.indexOf("data:") === 0 || a11.indexOf("blob:") === 0) && (t11.data[i11] = "MSE style URL");
                        }
                      });
                    }
                  },
                  {
                    key: "_resetVideoData",
                    value: function() {
                      var t11 = this;
                      Object.keys(this.data).forEach(function(i11) {
                        i11.indexOf("video_") === 0 && delete t11.data[i11];
                      });
                    }
                  },
                  {
                    key: "_resetViewData",
                    value: function() {
                      var t11 = this;
                      Object.keys(this.data).forEach(function(i11) {
                        i11.indexOf("view_") === 0 && delete t11.data[i11];
                      }), this.data.view_sequence_number = 1;
                    }
                  },
                  {
                    key: "_resetErrorData",
                    value: function() {
                      delete this.data.player_error_code, delete this.data.player_error_message, delete this.data.player_error_context, delete this.data.player_error_severity, delete this.data.player_error_business_exception;
                    }
                  },
                  {
                    key: "_initializeViewData",
                    value: function() {
                      var t11 = this, i11 = this.data.view_id = r2(), a11 = function() {
                        i11 === t11.data.view_id && sf(t11.data, "player_view_count", 1);
                      };
                      this.data.player_is_paused ? this.one("play", a11) : a11();
                    }
                  },
                  {
                    key: "_restartHeartBeat",
                    value: function() {
                      var t11 = this;
                      window.clearTimeout(this._heartBeatTimeout), this._heartBeatTimeout = window.setTimeout(function() {
                        t11.data.player_is_paused || t11.emit("hb");
                      }, 1e4);
                    }
                  },
                  {
                    key: "addHLSJS",
                    value: function(t11) {
                      if (!t11.hlsjs) {
                        this.mux.log.warn("You must pass a valid hlsjs instance in order to track it.");
                        return;
                      }
                      if (this.hlsjs) {
                        this.mux.log.warn("An instance of HLS.js is already being monitored for this player.");
                        return;
                      }
                      this.hlsjs = t11.hlsjs, sx(this.mux, this.id, t11.hlsjs, {}, t11.Hls || window.Hls);
                    }
                  },
                  {
                    key: "removeHLSJS",
                    value: function() {
                      this.hlsjs &&= void sE(this.hlsjs);
                    }
                  },
                  {
                    key: "addDashJS",
                    value: function(t11) {
                      if (!t11.dashjs) {
                        this.mux.log.warn("You must pass a valid dashjs instance in order to track it.");
                        return;
                      }
                      if (this.dashjs) {
                        this.mux.log.warn("An instance of Dash.js is already being monitored for this player.");
                        return;
                      }
                      this.dashjs = t11.dashjs, sA(this.mux, this.id, t11.dashjs);
                    }
                  },
                  {
                    key: "removeDashJS",
                    value: function() {
                      this.dashjs &&= void sL(this.dashjs);
                    }
                  }
                ]), r10;
              }(sR), nb = rI(rW()), nk = ["loadstart", "pause", "play", "playing", "seeking", "seeked", "timeupdate", "ratechange", "stalled", "waiting", "error", "ended"], nC = { 1: "MEDIA_ERR_ABORTED", 2: "MEDIA_ERR_NETWORK", 3: "MEDIA_ERR_DECODE", 4: "MEDIA_ERR_SRC_NOT_SUPPORTED" }, nw = rI(rR());
              nw.default && nw.default.WeakMap && (no = new WeakMap);
              var nx = {
                TARGET_DURATION: "#EXT-X-TARGETDURATION",
                PART_INF: "#EXT-X-PART-INF",
                SERVER_CONTROL: "#EXT-X-SERVER-CONTROL",
                INF: "#EXTINF",
                PROGRAM_DATE_TIME: "#EXT-X-PROGRAM-DATE-TIME",
                VERSION: "#EXT-X-VERSION",
                SESSION_DATA: "#EXT-X-SESSION-DATA"
              }, nE = function(t10) {
                return this.buffer = "", this.manifest = { segments: [], serverControl: {}, sessionData: {} }, this.currentUri = {}, this.process(t10), this.manifest;
              };
              nE.prototype.process = function(t10) {
                var i10;
                for (this.buffer += t10, i10 = this.buffer.indexOf(`
`);i10 > -1; i10 = this.buffer.indexOf(`
`))
                  this.processLine(this.buffer.substring(0, i10)), this.buffer = this.buffer.substring(i10 + 1);
              }, nE.prototype.processLine = function(t10) {
                var i10 = nR(t10, t10.indexOf(":")), a10 = i10[0], r10 = i10.length === 2 ? nP(i10[1]) : undefined;
                if (a10[0] !== "#")
                  this.currentUri.uri = a10, this.manifest.segments.push(this.currentUri), !this.manifest.targetDuration || "duration" in this.currentUri || (this.currentUri.duration = this.manifest.targetDuration), this.currentUri = {};
                else
                  switch (a10) {
                    case nx.TARGET_DURATION:
                      if (!isFinite(r10) || r10 < 0)
                        return;
                      this.manifest.targetDuration = r10, this.setHoldBack();
                      break;
                    case nx.PART_INF:
                      ;
                      nS(this.manifest, i10), this.manifest.partInf.partTarget && (this.manifest.partTargetDuration = this.manifest.partInf.partTarget), this.setHoldBack();
                      break;
                    case nx.SERVER_CONTROL:
                      ;
                      nS(this.manifest, i10), this.setHoldBack();
                      break;
                    case nx.INF:
                      r10 === 0 ? this.currentUri.duration = 0.01 : r10 > 0 && (this.currentUri.duration = r10);
                      break;
                    case nx.PROGRAM_DATE_TIME:
                      var s10 = new Date(r10);
                      this.manifest.dateTimeString || (this.manifest.dateTimeString = r10, this.manifest.dateTimeObject = s10), this.currentUri.dateTimeString = r10, this.currentUri.dateTimeObject = s10;
                      break;
                    case nx.VERSION:
                      nS(this.manifest, i10);
                      break;
                    case nx.SESSION_DATA:
                      var n10 = sk(nD(i10[1]));
                      Object.assign(this.manifest.sessionData, n10);
                  }
              }, nE.prototype.setHoldBack = function() {
                var t10 = this.manifest, i10 = t10.serverControl, a10 = t10.targetDuration, r10 = t10.partTargetDuration;
                if (i10) {
                  var s10 = "holdBack", n10 = "partHoldBack", o10 = a10 && 3 * a10, l2 = r10 && 2 * r10;
                  a10 && !i10.hasOwnProperty(s10) && (i10[s10] = o10), o10 && i10[s10] < o10 && (i10[s10] = o10), r10 && !i10.hasOwnProperty(n10) && (i10[n10] = 3 * r10), r10 && i10[n10] < l2 && (i10[n10] = l2);
                }
              };
              var nS = function(t10, i10) {
                var a10, r10 = nT(i10[0].replace("#EXT-X-", ""));
                nI(i10[1]) ? (a10 = {}, a10 = Object.assign(nL(i10[1]), a10)) : a10 = nP(i10[1]), t10[r10] = a10;
              }, nT = function(t10) {
                return t10.toLowerCase().replace(/-(\w)/g, function(t11) {
                  return t11[1].toUpperCase();
                });
              }, nP = function(t10) {
                if (t10.toLowerCase() === "yes" || t10.toLowerCase() === "no")
                  return t10.toLowerCase() === "yes";
                var i10 = t10.indexOf(":") === -1 ? parseFloat(t10) : t10;
                return isNaN(i10) ? t10 : i10;
              }, nA = function(t10) {
                var i10 = {}, a10 = t10.split("=");
                return a10.length > 1 && (i10[nT(a10[0])] = nP(a10[1])), i10;
              }, nL = function(t10) {
                for (var i10 = t10.split(","), a10 = {}, r10 = 0;i10.length > r10; r10++)
                  a10 = Object.assign(nA(i10[r10]), a10);
                return a10;
              }, nI = function(t10) {
                return t10.indexOf("=") > -1;
              }, nR = function(t10, i10) {
                return i10 === -1 ? [t10] : [t10.substring(0, i10), t10.substring(i10 + 1)];
              }, nD = function(t10) {
                var i10 = {};
                if (t10) {
                  var a10 = t10.search(",");
                  return [t10.slice(0, a10), t10.slice(a10 + 1)].forEach(function(t11, a11) {
                    for (var r10 = t11.replace(/['"]+/g, "").split("="), s10 = 0;s10 < r10.length; s10++)
                      r10[s10] === "DATA-ID" && (i10["DATA-ID"] = r10[1 - s10]), r10[s10] === "VALUE" && (i10.VALUE = r10[1 - s10]);
                  }), { data: i10 };
                }
              }, nM = {
                safeCall: function(t10, i10, a10, r10) {
                  var s10 = r10;
                  if (t10 && typeof t10[i10] == "function")
                    try {
                      s10 = t10[i10].apply(t10, a10);
                    } catch (t11) {
                      r9.info("safeCall error", t11);
                    }
                  return s10;
                },
                safeIncrement: sf,
                getComputedStyle: function(t10, i10) {
                  var a10;
                  return t10 && i10 && nw.default && typeof nw.default.getComputedStyle == "function" ? (no && no.has(t10) && (a10 = no.get(t10)), a10 || (a10 = nw.default.getComputedStyle(t10, null), no && no.set(t10, a10)), a10.getPropertyValue(i10)) : "";
                },
                secondsToMs: function(t10) {
                  return Math.floor(1000 * t10);
                },
                assign: Object.assign,
                headersStringToObject: s_,
                cdnHeadersToRequestId: sb,
                extractHostnameAndDomain: sc,
                extractHostname: su,
                manifestParser: nE,
                generateShortID: r3,
                generateUUID: r2,
                now: r4.now,
                findMediaElement: r6
              }, nN = {}, nj = function(t10) {
                var i10 = arguments;
                typeof t10 == "string" ? nj.hasOwnProperty(t10) ? rX.default.setTimeout(function() {
                  i10 = Array.prototype.splice.call(i10, 1), nj[t10].apply(null, i10);
                }, 0) : r9.warn("`" + t10 + "` is an unknown task") : typeof t10 == "function" ? rX.default.setTimeout(function() {
                  t10(nj);
                }, 0) : r9.warn("`" + t10 + "` is invalid.");
              }, nO = {
                loaded: r4.now(),
                NAME: "mux-embed",
                VERSION: "5.9.0",
                API_VERSION: "2.1",
                PLAYER_TRACKED: false,
                monitor: function(t10, i10) {
                  return function(t11, i11, a10) {
                    var r10 = rQ(r6(i11), 3), s10 = r10[0], n10 = r10[1], o10 = r10[2], l2 = t11.log, d2 = t11.utils.getComputedStyle, u2 = t11.utils.secondsToMs;
                    if (!s10)
                      return l2.error("No element was found with the `" + n10 + "` query selector.");
                    if (o10 !== "video" && o10 !== "audio")
                      return l2.error("The element of `" + n10 + "` was not a media element.");
                    s10.mux && (s10.mux.destroy(), delete s10.mux, l2.warn("Already monitoring this video element, replacing existing event listeners")), (a10 = Object.assign({ automaticErrorTracking: true }, a10, {
                      getPlayheadTime: function() {
                        return u2(s10.currentTime);
                      },
                      getStateData: function() {
                        var t12, i12 = this.getPlayheadTime?.call(this) || u2(s10.currentTime), a11 = this.hlsjs && this.hlsjs.url, r11 = this.dashjs && typeof this.dashjs.getSource == "function" && this.dashjs.getSource(), n11 = {
                          player_is_paused: s10.paused,
                          player_width: parseInt(d2(s10, "width")),
                          player_height: parseInt(d2(s10, "height")),
                          player_autoplay_on: s10.autoplay,
                          player_preload_on: s10.preload,
                          player_language_code: s10.lang,
                          player_is_fullscreen: nb.default && !!(nb.default.fullscreenElement || nb.default.webkitFullscreenElement || nb.default.mozFullScreenElement || nb.default.msFullscreenElement),
                          video_poster_url: s10.poster,
                          video_source_url: a11 || r11 || s10.currentSrc,
                          video_source_duration: u2(s10.duration),
                          video_source_height: s10.videoHeight,
                          video_source_width: s10.videoWidth,
                          view_dropped_frame_count: s10 == null || (t12 = s10.getVideoPlaybackQuality) == null ? undefined : t12.call(s10).droppedVideoFrames
                        };
                        if (s10.getStartDate && i12 > 0) {
                          var o11 = s10.getStartDate();
                          if (o11 && typeof o11.getTime == "function" && o11.getTime()) {
                            var l3 = o11.getTime();
                            n11.player_program_time = l3 + i12, s10.seekable.length > 0 && (n11.player_live_edge_program_time = l3 + s10.seekable.end(s10.seekable.length - 1));
                          }
                        }
                        return n11;
                      }
                    })).data = Object.assign({ player_software: "HTML5 Video Element", player_mux_plugin_name: "VideoElementMonitor", player_mux_plugin_version: t11.VERSION }, a10.data), s10.mux = s10.mux || {}, s10.mux.deleted = false, s10.mux.emit = function(i12, a11) {
                      t11.emit(n10, i12, a11);
                    }, s10.mux.updateData = function(t12) {
                      s10.mux.emit("hb", t12);
                    };
                    var c2 = function() {
                      l2.error("The monitor for this video element has already been destroyed.");
                    };
                    s10.mux.destroy = function() {
                      Object.keys(s10.mux.listeners).forEach(function(t12) {
                        s10.removeEventListener(t12, s10.mux.listeners[t12], false);
                      }), delete s10.mux.listeners, s10.mux.destroy = c2, s10.mux.swapElement = c2, s10.mux.emit = c2, s10.mux.addHLSJS = c2, s10.mux.addDashJS = c2, s10.mux.removeHLSJS = c2, s10.mux.removeDashJS = c2, s10.mux.updateData = c2, s10.mux.setEmitTranslator = c2, s10.mux.setStateDataTranslator = c2, s10.mux.setGetPlayheadTime = c2, s10.mux.deleted = true, t11.emit(n10, "destroy");
                    }, s10.mux.swapElement = function(i12) {
                      var a11 = rQ(r6(i12), 3), r11 = a11[0], n11 = a11[1], o11 = a11[2];
                      return r11 ? o11 !== "video" && o11 !== "audio" ? t11.log.error("The element of `" + n11 + "` was not a media element.") : void (r11.muxId = s10.muxId, delete s10.muxId, r11.mux = r11.mux || {}, r11.mux.listeners = Object.assign({}, s10.mux.listeners), delete s10.mux.listeners, Object.keys(r11.mux.listeners).forEach(function(t12) {
                        s10.removeEventListener(t12, r11.mux.listeners[t12], false), r11.addEventListener(t12, r11.mux.listeners[t12], false);
                      }), r11.mux.swapElement = s10.mux.swapElement, r11.mux.destroy = s10.mux.destroy, delete s10.mux, s10 = r11) : t11.log.error("No element was found with the `" + n11 + "` query selector.");
                    }, s10.mux.addHLSJS = function(i12) {
                      t11.addHLSJS(n10, i12);
                    }, s10.mux.addDashJS = function(i12) {
                      t11.addDashJS(n10, i12);
                    }, s10.mux.removeHLSJS = function() {
                      t11.removeHLSJS(n10);
                    }, s10.mux.removeDashJS = function() {
                      t11.removeDashJS(n10);
                    }, s10.mux.setEmitTranslator = function(i12) {
                      t11.setEmitTranslator(n10, i12);
                    }, s10.mux.setStateDataTranslator = function(i12) {
                      t11.setStateDataTranslator(n10, i12);
                    }, s10.mux.setGetPlayheadTime = function(i12) {
                      i12 ||= a10.getPlayheadTime, t11.setGetPlayheadTime(n10, i12);
                    }, t11.init(n10, a10), t11.emit(n10, "playerready"), s10.paused || (t11.emit(n10, "play"), s10.readyState > 2 && t11.emit(n10, "playing")), s10.mux.listeners = {}, nk.forEach(function(i12) {
                      (i12 !== "error" || a10.automaticErrorTracking) && (s10.mux.listeners[i12] = function() {
                        var a11 = {};
                        if (i12 === "error") {
                          if (!s10.error || s10.error.code === 1)
                            return;
                          a11.player_error_code = s10.error.code, a11.player_error_message = nC[s10.error.code] || s10.error.message;
                        }
                        t11.emit(n10, i12, a11);
                      }, s10.addEventListener(i12, s10.mux.listeners[i12], false));
                    });
                  }(nj, t10, i10);
                },
                destroyMonitor: function(t10) {
                  var i10 = rQ(r6(t10), 1)[0];
                  i10 && i10.mux && typeof i10.mux.destroy == "function" ? i10.mux.destroy() : r9.error("A video element monitor for `" + t10 + "` has not been initialized via `mux.monitor`.");
                },
                addHLSJS: function(t10, i10) {
                  var a10 = r5(t10);
                  nN[a10] ? nN[a10].addHLSJS(i10) : r9.error("A monitor for `" + a10 + "` has not been initialized.");
                },
                addDashJS: function(t10, i10) {
                  var a10 = r5(t10);
                  nN[a10] ? nN[a10].addDashJS(i10) : r9.error("A monitor for `" + a10 + "` has not been initialized.");
                },
                removeHLSJS: function(t10) {
                  var i10 = r5(t10);
                  nN[i10] ? nN[i10].removeHLSJS() : r9.error("A monitor for `" + i10 + "` has not been initialized.");
                },
                removeDashJS: function(t10) {
                  var i10 = r5(t10);
                  nN[i10] ? nN[i10].removeDashJS() : r9.error("A monitor for `" + i10 + "` has not been initialized.");
                },
                init: function(t10, i10) {
                  st() && i10 && i10.respectDoNotTrack && r9.info("The browser's Do Not Track flag is enabled - Mux beaconing is disabled.");
                  var a10 = r5(t10);
                  nN[a10] = new n_(nj, a10, i10);
                },
                emit: function(t10, i10, a10) {
                  var r10 = r5(t10);
                  nN[r10] ? (nN[r10].emit(i10, a10), i10 === "destroy" && delete nN[r10]) : r9.error("A monitor for `" + r10 + "` has not been initialized.");
                },
                updateData: function(t10, i10) {
                  var a10 = r5(t10);
                  nN[a10] ? nN[a10].emit("hb", i10) : r9.error("A monitor for `" + a10 + "` has not been initialized.");
                },
                setEmitTranslator: function(t10, i10) {
                  var a10 = r5(t10);
                  nN[a10] ? nN[a10].emitTranslator = i10 : r9.error("A monitor for `" + a10 + "` has not been initialized.");
                },
                setStateDataTranslator: function(t10, i10) {
                  var a10 = r5(t10);
                  nN[a10] ? nN[a10].stateDataTranslator = i10 : r9.error("A monitor for `" + a10 + "` has not been initialized.");
                },
                setGetPlayheadTime: function(t10, i10) {
                  var a10 = r5(t10);
                  nN[a10] ? nN[a10].getPlayheadTime = i10 : r9.error("A monitor for `" + a10 + "` has not been initialized.");
                },
                checkDoNotTrack: st,
                log: r9,
                utils: nM,
                events: {
                  PLAYER_READY: "playerready",
                  VIEW_INIT: "viewinit",
                  VIDEO_CHANGE: "videochange",
                  PLAY: "play",
                  PAUSE: "pause",
                  PLAYING: "playing",
                  TIME_UPDATE: "timeupdate",
                  SEEKING: "seeking",
                  SEEKED: "seeked",
                  REBUFFER_START: "rebufferstart",
                  REBUFFER_END: "rebufferend",
                  ERROR: "error",
                  ENDED: "ended",
                  RENDITION_CHANGE: "renditionchange",
                  ORIENTATION_CHANGE: "orientationchange",
                  AD_REQUEST: "adrequest",
                  AD_RESPONSE: "adresponse",
                  AD_BREAK_START: "adbreakstart",
                  AD_PLAY: "adplay",
                  AD_PLAYING: "adplaying",
                  AD_PAUSE: "adpause",
                  AD_FIRST_QUARTILE: "adfirstquartile",
                  AD_MID_POINT: "admidpoint",
                  AD_THIRD_QUARTILE: "adthirdquartile",
                  AD_ENDED: "adended",
                  AD_BREAK_END: "adbreakend",
                  AD_ERROR: "aderror",
                  REQUEST_COMPLETED: "requestcompleted",
                  REQUEST_FAILED: "requestfailed",
                  REQUEST_CANCELLED: "requestcanceled",
                  HEARTBEAT: "hb",
                  DESTROY: "destroy"
                },
                WINDOW_HIDDEN: false,
                WINDOW_UNLOADING: false
              };
              Object.assign(nj, nO), rX.default !== undefined && typeof rX.default.addEventListener == "function" && rX.default.addEventListener("pagehide", function(t10) {
                t10.persisted || (nj.WINDOW_UNLOADING = true);
              }, false);
              var nV = (t10) => !!(t10.ads?.adBreaks && t10.ads.adBreaks.length > 0), nH = (t10) => nV(t10) ? "AVOD" : "SVOD", nU = (t10) => {
                if (t10.drms !== undefined)
                  switch (t10.drms[0]?.type) {
                    case l.rt.FAIRPLAY:
                      return "FairPlay";
                    case l.rt.WIDEVINE:
                      return "Widevine";
                    case l.rt.PLAYREADY:
                      return "PlayReady";
                    case l.rt.OMA:
                    default:
                      return;
                  }
              }, nF = (t10) => {
                if (t10.drms !== undefined && t10.drms[0]?.type !== l.rt.OMA)
                  return t10.drms[0]?.level?.toUpperCase();
              }, n$ = (t10) => t10.manifest.audioRole === undefined ? { variantName: undefined, variantId: undefined } : { variantName: t10.manifest.audioRole, variantId: `${t10.id}-${t10.manifest.audioRole}` }, nB = (t10) => {
                let i10;
                switch (t10) {
                  case l.f.DATA_SAVER:
                    i10 = "data saver";
                    break;
                  case l.f.MODERATE:
                    i10 = "moderate";
                    break;
                  case l.f.HIGHEST:
                  default:
                    i10 = "highest";
                }
                return { field: "custom_8", level: i10 };
              }, nq = class {
                constructor(t10, i10, a10, r10, s10, n10, o10, l2) {
                  if (this.playerId = "MuxPlugin", this.isFirstPlay = true, this._appMetadata = {}, this.rebufferingState = [], this._isPaused = false, this._getStateData = () => ({ player_is_paused: this._isPaused }), this.name = "MuxPlugin", this.version = "0.0.0", this.events = t10, this.callbacks = i10, this.config = a10, this.profileProvider = n10, this._deviceInfoProvider = o10, this.subscriptions = [], this.appInfoProvider = l2, this.appInfoProvider) {
                    let t11 = this.appInfoProvider.getAppInfo();
                    t11 && (this._appMetadata.view_client_application_name = t11.name, this._appMetadata.view_client_application_version = t11.version);
                  }
                  nj.init(this.playerId, {
                    respectDoNotTrack: true,
                    disablePlayheadRebufferTracking: true,
                    data: {
                      env_key: this.config.environmentKey,
                      player_name: s10.name,
                      player_version: s10.version,
                      player_software_name: r10.name,
                      player_software_version: r10.version,
                      ...this._appMetadata
                    },
                    getStateData: this._getStateData
                  }), this._setUpSubscriptions();
                }
                dispose() {
                  this.subscriptions.forEach((t10) => t10.unsubscribe()), this.subscriptions = [], nj.emit(this.playerId, "destroy");
                }
                _handlePlaybackStateChange(t10) {
                  if (t10.event !== l.Rt.REBUFFERING && this.rebufferingState.length > 0)
                    switch (this.rebufferingState.pop()) {
                      case l.It.CONNECTION:
                        nj.emit(this.playerId, "rebufferend");
                        break;
                      case l.It.SEEK:
                        nj.emit(this.playerId, "seeked");
                    }
                  switch (t10.event) {
                    case l.Rt.INITIALIZED:
                      ;
                      this._getProfileData(), this._getDeviceInfo(), nj.emit(this.playerId, "playerready");
                      break;
                    case l.Rt.MEDIA_RESOLVING:
                      ;
                      nj.emit(this.playerId, this.isFirstPlay ? "viewinit" : "videochange", this._appMetadata), nj.emit(this.playerId, "viewstart"), this._handleMediaResolving(t10.payload), this.isFirstPlay = false, this._reset();
                      break;
                    case l.Rt.MEDIA_LOADED:
                      ;
                      this._setState({ isPaused: false }), nj.emit(this.playerId, "play");
                      break;
                    case l.Rt.PLAYING:
                      ;
                      this._setState({ isPaused: false }), nj.emit(this.playerId, "playing");
                      break;
                    case l.Rt.PAUSED:
                      ;
                      this._setState({ isPaused: true }), nj.emit(this.playerId, "pause");
                      break;
                    case l.Rt.REBUFFERING:
                      this._handleRebuffering(t10.payload);
                      break;
                    case l.Rt.STOPPED:
                      ;
                      this._setState({ isPaused: true }), nj.emit(this.playerId, "viewend");
                      break;
                    case l.Rt.DISPOSED:
                      nj.emit(this.playerId, "destroy");
                      break;
                    case l.Rt.ERROR:
                      ;
                      this._setState({ isPaused: true }), this._handleError(t10.payload);
                  }
                }
                _getPlayerErrorCode(t10) {
                  return t10 instanceof l.$ ? t10.errorCodeWithExtensionNumber : l.et.UNKNOWN_ERROR;
                }
                _handleError(t10) {
                  let { error: i10 } = t10;
                  i10 instanceof l.$ && i10.partialVideoModel && this._handlePartialVideoModelUpdated(t10.sessionId, i10.partialVideoModel), nj.emit(this.playerId, "error", {
                    player_error_code: this._getPlayerErrorCode(i10),
                    player_error_message: typeof i10?.message == "string" ? i10.message : "Undefined player error",
                    player_error_context: typeof i10?.context == "string" ? i10.context : undefined
                  });
                }
                _handleRebuffering(t10) {
                  switch (t10.reason) {
                    case l.It.CONNECTION:
                      nj.emit(this.playerId, "rebufferstart");
                      break;
                    case l.It.SEEK:
                      nj.emit(this.playerId, "seeking");
                  }
                  this.rebufferingState.length !== 0 && l.Ft.warn("[MuxPlugin] Rebuffering queue is not empty, may encounter out of order events", this.rebufferingState), this.rebufferingState.push(t10.reason);
                }
                _handleRenditionUpdate(t10) {
                  t10.type === "audio" && (this._lastSeenAudioRendition = t10.event.audioRendition), t10.type === "video" && (this._lastSeenVideoRendition = t10.event.videoRendition), this._lastSeenAudioRendition !== undefined && this._lastSeenVideoRendition !== undefined && (l.Ft.info("[MuxPlugin] Rendition changed emitted"), nj.emit(this.playerId, "renditionchange", {
                    video_source_bitrate: this._lastSeenVideoRendition.bitrate + this._lastSeenAudioRendition.bitrate,
                    video_source_codec: this._lastSeenVideoRendition.codec,
                    video_source_height: this._lastSeenVideoRendition.height,
                    video_source_width: this._lastSeenVideoRendition.width
                  }));
                }
                _handlePlayheadUpdate(t10) {
                  this._lastSeenPlayheadPosition = t10.playheadData.streamTime, nj.emit(this.playerId, "timeupdate", { player_playhead_time: 1000 * this._lastSeenPlayheadPosition });
                }
                _handlePartialVideoModelUpdated(t10, i10 = {}) {
                  let a10, r10, s10, n10, o10, d2;
                  if ((0, l.l)(i10)) {
                    a10 = nV(i10), r10 = nH(i10), s10 = nU(i10), n10 = nF(i10);
                    let t11 = n$(i10);
                    o10 = t11.variantName, d2 = t11.variantId;
                  }
                  nj.updateData(this.playerId, {
                    view_session_id: t10,
                    video_id: i10.id,
                    video_title: i10.assetMetadata?.title,
                    video_series: i10.assetMetadata?.seriesTitle,
                    video_content_type: i10.assetMetadata?.contentType,
                    video_cdn: i10.manifest?.cdn,
                    video_source_url: i10.manifest?.url?.toString(),
                    view_has_ad: a10,
                    video_stream_type: r10,
                    view_drm_type: s10,
                    view_drm_level: n10,
                    video_variant_id: d2,
                    video_variant_name: o10
                  });
                }
                _handleMediaResolving(t10) {
                  nj.updateData(this.playerId, { video_id: t10.guid });
                }
                _handleVideoModelChanged(t10) {
                  let { videoModel: i10 } = t10;
                  this._handlePartialVideoModelUpdated(t10.sessionId, i10);
                }
                _handleCdnChanged(t10) {
                  this._lastSeenCdnName !== t10.cdnName && (this._lastSeenCdnName = t10.cdnName, nj.updateData(this.playerId, { video_cdn: t10.cdnName }));
                }
                _handleVideoQualityChanged(t10) {
                  let { field: i10, level: a10 } = nB(t10.newBucket);
                  nj.updateData(this.playerId, { [i10]: a10 });
                }
                _getProfileData() {
                  this.profileProvider.getUserProfile().then((t10) => {
                    nj.updateData(this.playerId, { viewer_user_id: t10.userId });
                  }).catch((t10) => {
                    l.Ft.error("[MuxPlugin] Failed to get user profile data", t10);
                  });
                }
                _getDeviceInfo() {
                  this._deviceInfoProvider.getDeviceInfo().then((t10) => {
                    nj.updateData(this.playerId, { mux_viewer_device_model: t10.model, mux_viewer_device_manufacturer: t10.make });
                  }).catch((t10) => {
                    l.Ft.error("[MuxPlugin] Failed to get device info", t10);
                  });
                }
                _reset() {
                  this._lastSeenAudioRendition = undefined, this._lastSeenVideoRendition = undefined, this._lastSeenPlayheadPosition = undefined, this._lastSeenCdnName = undefined, this.rebufferingState = [], this._isPaused = false;
                }
                _setState(t10) {
                  this._isPaused = t10.isPaused;
                }
                _setUpSubscriptions() {
                  this.subscriptions.push(this.events.playerStateChangedEvent$.subscribe((t10) => this._handlePlaybackStateChange(t10))), this.subscriptions.push(this.events.playheadUpdate$.subscribe((t10) => this._handlePlayheadUpdate(t10))), this.subscriptions.push(this.events.videoModelUpdated$.subscribe((t10) => this._handleVideoModelChanged(t10))), this.subscriptions.push(this.events.audioRenditionChanged$.subscribe((t10) => this._handleRenditionUpdate({ type: "audio", event: t10 }))), this.subscriptions.push(this.events.videoRenditionChanged$.subscribe((t10) => this._handleRenditionUpdate({ type: "video", event: t10 }))), this.subscriptions.push(this.events.cdnChanged$.subscribe((t10) => {
                    this._handleCdnChanged({ cdnName: t10.cdnName });
                  })), this.subscriptions.push(this.events.videoQualityChanged$.subscribe((t10) => {
                    this._handleVideoQualityChanged(t10);
                  }));
                }
              }, nK = Object.freeze({ environmentKey: "ov7ehjnei7tknvijcnh4g4h5s" }), nZ = class {
                get name() {
                  return "MuxPluginCreator";
                }
                get version() {
                  return "0.0.0";
                }
                constructor(t10) {
                  let { configuration: i10, mediaEngineInfo: a10, playerInfo: r10, profileProvider: s10, appInfoProvider: n10, deviceInfoProvider: o10 } = t10;
                  this._configuration = i10 ?? nK, this._mediaEngineInfo = a10, this._playerInfo = r10, this._profileProvider = s10, this._appInfoProvider = n10, this._deviceInfoProvider = o10;
                }
                create(t10, i10) {
                  return new nq(t10, i10, this._configuration, this._mediaEngineInfo, this._playerInfo, this._profileProvider, this._deviceInfoProvider, this._appInfoProvider);
                }
              }, nz = class t10 {
                constructor(t11, i10, a10, r10, s10) {
                  this.playerId = "PlayheadPlugin", this.currentPlayheadPosition = undefined, this.subscriptions = [], this.contentId = undefined, this.isDisposed = false, this.userId = undefined, this.isAnonymousUser = true, this.userProfilePromise = undefined, this.name = "PlayheadPlugin", this.version = "0.0.0", this.events = t11, this.callbacks = i10, this.config = s10, this.profileProvider = a10, this.apiServicesContainer = r10, this.playheadService = this.apiServicesContainer.getPlayheadsService(), l.Ft.info(`PlayheadPlugin initialized with config: ${JSON.stringify(this.config)}`, this.playerId), this.setupEventListeners();
                }
                setupEventListeners() {
                  this.subscriptions.push(this.events.currentPlayerState$.subscribe((t11) => {
                    switch (t11) {
                      case "playing":
                        this.startPeriodicReporting();
                        break;
                      case "paused":
                        ;
                        this.report("pause"), this.stopPeriodicReporting();
                        break;
                      case "error":
                        ;
                        this.report("error"), this.stopPeriodicReporting();
                        break;
                      case "stopped":
                        ;
                        this.report("stopped"), this.stopPeriodicReporting();
                        break;
                      case "disposed":
                        this.dispose();
                    }
                  })), this.subscriptions.push(this.events.playheadUpdate$.subscribe((t11) => {
                    this.currentPlayheadPosition = Math.ceil(t11.playheadData.contentTime);
                  })), this.subscriptions.push(this.events.onContentEnd(() => {
                    this.report("contentEnd");
                  })), this.subscriptions.push(this.events.onVideoModelUpdated((t11) => {
                    t11.videoModel?.id ? (l.Ft.info(`PlayheadPlugin: Video model updated with contentId: ${t11.videoModel.id}`, this.playerId), this.contentId = t11.videoModel.id, this.currentPlayheadPosition = t11.videoModel.watchHistory.resumePosition) : (l.Ft.error("PlayheadPlugin: Video model updated without contentId", this.playerId), this.currentPlayheadPosition = undefined);
                  }));
                }
                startPeriodicReporting() {
                  this.stopPeriodicReporting(), this.periodicReportIntervalId = setInterval(() => {
                    this.report("periodic");
                  }, 1000 * t10.REPORTING_INTERVAL_TIME);
                }
                stopPeriodicReporting() {
                  this.periodicReportIntervalId !== undefined && (clearInterval(this.periodicReportIntervalId), this.periodicReportIntervalId = undefined);
                }
                async getUserProfile() {
                  try {
                    let t11 = await this.profileProvider.getUserProfile(), i10 = t11.userId, a10 = t11.subscriptionStatus === l.S.ANONYMOUS;
                    return l.Ft.info(`PlayheadPlugin: Retrieved profile - userId: ${i10}, isAnonymous: ${a10}`, this.playerId), { userId: i10, isAnonymous: a10 };
                  } catch (t11) {
                    return l.Ft.error(`PlayheadPlugin: Failed to retrieve user profile - ${String(t11)}`, this.playerId), { userId: undefined, isAnonymous: false };
                  }
                }
                getUserProfileCached() {
                  return this.userProfilePromise !== undefined && this.userId !== undefined ? Promise.resolve({ userId: this.userId, isAnonymous: this.isAnonymousUser }) : (this.userProfilePromise === undefined && (this.userProfilePromise = this.getUserProfile().then((t11) => (this.userId = t11.userId, this.isAnonymousUser = t11.isAnonymous, t11))), this.userProfilePromise);
                }
                async reportAsync(t11, i10, a10) {
                  try {
                    let r10 = await this.getUserProfileCached();
                    if (r10.isAnonymous || r10.userId === undefined) {
                      l.Ft.info(`PlayheadPlugin: Skipping report for event type: ${t11}. User is anonymous or userId is undefined`, this.playerId), this.stopPeriodicReporting();
                      return;
                    }
                    if (this.isDisposed) {
                      l.Ft.info(`PlayheadPlugin: Skipping report for event type: ${t11}. Plugin was disposed while fetching user profile`, this.playerId);
                      return;
                    }
                    await this.playheadService.postPlayhead({ userId: r10.userId, contentId: i10, playhead: a10 }), l.Ft.info(`PlayheadPlugin: Successfully reported playhead for contentId: ${i10} at position: ${a10} for event type: ${t11}`, this.playerId);
                  } catch (t12) {
                    l.Ft.error(`PlayheadPlugin: Failed to report playhead for contentId: ${i10} - ${String(t12)}`, this.playerId);
                  }
                }
                report(t11) {
                  let i10 = this.currentPlayheadPosition, a10 = this.contentId;
                  if (i10 === undefined || a10 === undefined) {
                    l.Ft.warn(`PlayheadPlugin: Skipping report for event type: ${t11}. Missing data - contentId: ${a10}, playhead: ${i10}`, this.playerId);
                    return;
                  }
                  l.Ft.info(`PlayheadPlugin: Report Initiated - Event type: ${t11}. Position: ${i10}`, this.playerId), this.reportAsync(t11, a10, i10).catch((i11) => {
                    l.Ft.error(`PlayheadPlugin: Error during reportAsync for event type: ${t11} - ${String(i11)}`, this.playerId);
                  });
                }
                cleanup() {
                  this.stopPeriodicReporting(), this.subscriptions.forEach((t11) => {
                    t11.unsubscribe();
                  }), this.subscriptions = [], this.currentPlayheadPosition = undefined, this.contentId = undefined, this.userId = undefined, this.isAnonymousUser = true, this.userProfilePromise = undefined;
                }
                dispose() {
                  l.Ft.info("Disposing PlayheadPlugin resources", this.playerId), this.isDisposed = true, this.cleanup();
                }
              };
              nz.REPORTING_INTERVAL_TIME = 30;
              var nG = Object.freeze({ someProperty: "" }), nW = class {
                get name() {
                  return "PlayheadPluginCreator";
                }
                get version() {
                  return "0.0.0";
                }
                constructor(t10, i10, a10 = nG) {
                  this._configuration = a10, this._profileProvider = t10, this._apiServicesContainer = i10;
                }
                create(t10, i10) {
                  return new nz(t10, i10, this._profileProvider, this._apiServicesContainer, this._configuration);
                }
              }, nJ = class {
                constructor(t10, i10, a10, r10) {
                  this._playerId = "KeepAlivePlugin", this._subscriptions = [], this._contentId = undefined, this._sessionToken = undefined, this._sessionConfig = undefined, this._sessionTokenDeleted = false, this._sessionDeletionInProgress = false, this._currentPlayheadPosition = undefined, this._keepAliveInterval = undefined, this._retryCount = 0, this._isRetrying = false, this._lastSuccessfulKeepAlive = undefined, this._retryTimeoutId = undefined, this._pauseTimeoutId = undefined, this.name = "KeepAlivePlugin", this.version = "0.0.0", this.events = t10, this.callbacks = i10, this._config = r10, this._apiServicesContainer = a10, this._playbackService = this._apiServicesContainer.getPlaybackService(), l.Ft.info(`KeepAlivePlugin: Initialized with config: ${JSON.stringify(this._config)}`, this._playerId), this._setupEventListeners();
                }
                _setupEventListeners() {
                  this._subscriptions.push(this.events.playerStateChangedEvent$.subscribe(({ event: t10, payload: i10 }) => {
                    switch (t10 !== l.Rt.PAUSED && this._cancelPauseTimeout(), t10) {
                      case l.Rt.PAUSED:
                        this._startPauseTimeout();
                        break;
                      case l.Rt.ERROR:
                        ;
                        this._cancelKeepAliveInterval(), this._handleErrorPayload(i10.error), this._deleteSession("player_error");
                        break;
                      case l.Rt.STOPPED:
                        ;
                        this._cancelKeepAliveInterval(), this._deleteSession("player_stopped");
                        break;
                      case l.Rt.DISPOSED:
                        ;
                        this._cancelKeepAliveInterval(), this._deleteSession("player_disposed");
                    }
                  })), this._subscriptions.push(this.events.playheadUpdate$.subscribe((t10) => {
                    this._currentPlayheadPosition = t10.playheadData.contentTime;
                  })), this._subscriptions.push(this.events.onVideoModelUpdated((t10) => {
                    t10.videoModel?.id && t10.videoModel?.manifest?.playbackSessionToken ? (this._contentId && this._contentId !== t10.videoModel.id && this._deleteSession("video_switch"), l.Ft.info(`KeepAlivePlugin: Video model updated with contentId: ${t10.videoModel.id}`, this._playerId), this._contentId = t10.videoModel.id, this._sessionConfig = t10.videoModel.sessionConfig, this._sessionToken = t10.videoModel.manifest.playbackSessionToken, this._sessionTokenDeleted = false, this._sessionDeletionInProgress = false, this._lastSuccessfulKeepAlive = undefined, this._resetRetryState(), this._startKeepAliveInterval(), this._currentPlayheadPosition = t10.videoModel.watchHistory.resumePosition, l.Ft.info(`KeepAlivePlugin: Stored session data - contentId: ${this._contentId}, sessionToken: ${this._sessionToken ? "present" : "missing"}`, this._playerId)) : (l.Ft.error("KeepAlivePlugin: Video model updated without required data (contentId or sessionToken)", this._playerId), this._contentId = undefined, this._sessionConfig = undefined, this._sessionToken = undefined, this._sessionTokenDeleted = false, this._sessionDeletionInProgress = false, this._currentPlayheadPosition = undefined, this._lastSuccessfulKeepAlive = undefined, this._resetRetryState());
                  }));
                }
                _deleteSession(t10) {
                  this._deleteSessionAsync(t10).catch((t11) => {
                    l.Ft.error(`KeepAlivePlugin: Error during session deletion - ${String(t11)}`, this._playerId);
                  });
                }
                async _deleteSessionAsync(t10) {
                  let i10 = this._contentId, a10 = this._sessionToken;
                  if (!this._sessionTokenDeleted && !this._sessionDeletionInProgress && a10 && i10) {
                    this._sessionDeletionInProgress = true;
                    try {
                      l.Ft.info(`KeepAlivePlugin: Deleting session for contentId: ${i10}, reason: ${t10}`, this._playerId), await this._playbackService.deletePlaybackSession({ contentId: i10, playbackSessionId: a10 }), l.Ft.info(`KeepAlivePlugin: Successfully deleted session for contentId: ${i10} due to: ${t10}`, this._playerId), i10 === this._contentId && a10 === this._sessionToken && (this._sessionTokenDeleted = true);
                    } catch (t11) {
                      l.Ft.error(`KeepAlivePlugin: Failed to delete session for contentId: ${i10} - ${String(t11)}`, this._playerId);
                    } finally {
                      i10 === this._contentId && a10 === this._sessionToken && (this._sessionDeletionInProgress = false);
                    }
                  } else
                    this._sessionTokenDeleted ? l.Ft.info(`KeepAlivePlugin: Session already deleted for contentId: ${i10}, reason: ${t10}`, this._playerId) : this._sessionDeletionInProgress ? l.Ft.info(`KeepAlivePlugin: Session deletion already in progress for contentId: ${i10}, reason: ${t10}`, this._playerId) : l.Ft.info(`KeepAlivePlugin: No session to delete, reason: ${t10}`, this._playerId);
                }
                _startKeepAliveInterval() {
                  if (this._cancelKeepAliveInterval(), this._sessionConfig?.renewSeconds) {
                    let t10 = 1000 * this._sessionConfig.renewSeconds;
                    this._lastSuccessfulKeepAlive = Date.now(), l.Ft.info(`KeepAlivePlugin: Starting keep-alive interval (${this._sessionConfig.renewSeconds}s)`, this._playerId), this._keepAliveInterval = setInterval(() => {
                      this._sendKeepAlive();
                    }, t10);
                  }
                }
                _cancelKeepAliveInterval() {
                  this._keepAliveInterval &&= void clearInterval(this._keepAliveInterval), this._resetRetryState();
                }
                _sendKeepAlive(t10 = false) {
                  if (this._isRetrying && !t10) {
                    l.Ft.info(`KeepAlivePlugin: Skipping keep-alive from interval during retry window at playhead = ${this._currentPlayheadPosition}`, this._playerId);
                    return;
                  }
                  let i10 = this._contentId, a10 = this._sessionToken, r10 = this._currentPlayheadPosition;
                  !this._sessionTokenDeleted && a10 && i10 && r10 !== undefined ? (l.Ft.info(`KeepAlivePlugin: ${t10 ? "[Retry] " : ""}Sending keep-alive for contentId: ${i10} with playhead: ${r10}`, this._playerId), this._playbackService.keepAlivePlaybackSession({ contentId: i10, playbackSessionId: a10, playhead: r10 }).then(() => {
                    i10 === this._contentId && a10 === this._sessionToken ? (l.Ft.info(`KeepAlivePlugin: Successfully sent keep-alive for contentId: ${i10} with playhead: ${r10}`, this._playerId), this._lastSuccessfulKeepAlive = Date.now(), this._resetRetryState()) : l.Ft.info(`KeepAlivePlugin: Keep-alive succeeded for previous video ${i10}, ignoring (current: ${this._contentId})`, this._playerId);
                  }).catch((t11) => {
                    i10 === this._contentId && a10 === this._sessionToken ? this._handleKeepAliveError(i10, t11) : l.Ft.info(`KeepAlivePlugin: Keep-alive failed for previous video ${i10}, ignoring (current: ${this._contentId})`, this._playerId);
                  })) : l.Ft.warn("KeepAlivePlugin: Skipping keep-alive - no valid session data or playhead position", this._playerId);
                }
                _handleKeepAliveError(t10, i10) {
                  if (l.Ft.error(`KeepAlivePlugin: Keep-alive failed for contentId: ${t10} - ${String(i10)}`, this._playerId), this._isServerError(i10)) {
                    this._handleFatalError(new l.X(`Server error during keep-alive: ${String(i10)}`, l.et.NETWORK_ERROR, { originalError: i10, contentId: t10 }));
                    return;
                  }
                  this._isRetrying || (this._isRetrying = true, this._retryCount = 0);
                  let a10 = this._sessionConfig?.noNetworkRetryCount ?? 3, r10 = this._sessionConfig?.noNetworkRetryIntervalSeconds ?? 30, s10 = this._sessionConfig?.noNetworkTimeoutSeconds;
                  if (s10 && this._lastSuccessfulKeepAlive !== undefined) {
                    let i11 = (Date.now() - this._lastSuccessfulKeepAlive) / 1000, a11 = s10 - i11;
                    if (i11 >= s10 || a11 <= r10) {
                      let r11 = i11 >= s10 ? `Network timeout (${s10}s) exceeded since last successful keep-alive` : `Next retry would exceed timeout (${a11.toFixed(1)}s remaining since last successful keep-alive)`;
                      l.Ft.error(`KeepAlivePlugin: ${r11} for contentId: ${t10}`, this._playerId), this._handleFatalError(new l.X(`Network retry timeout after ${s10}s since last successful keep-alive`, l.et.NETWORK_TIMEOUT, {
                        timeoutSeconds: s10,
                        contentId: t10,
                        elapsedSinceLastSuccess: i11,
                        timeUntilTimeout: a11
                      }));
                      return;
                    }
                  }
                  this._retryCount < a10 ? (this._retryCount += 1, l.Ft.info(`KeepAlivePlugin: Retrying keep-alive in ${r10}s (attempt ${this._retryCount}/${a10})`, this._playerId), this._retryTimeoutId = setTimeout(() => {
                    if (this._lastSuccessfulKeepAlive !== undefined) {
                      let t11 = (Date.now() - this._lastSuccessfulKeepAlive) / 1000;
                      l.Ft.info(`KeepAlivePlugin: Elapsed time since last successful keep-alive at retry #${this._retryCount} = ${t11}s`);
                    }
                    this._isRetrying && !this._sessionTokenDeleted && this._sendKeepAlive(true);
                  }, 1000 * r10)) : (l.Ft.error(`KeepAlivePlugin: Max retries (${a10}) exceeded for contentId: ${t10}`, this._playerId), this._handleFatalError(new l.X(`Max retries (${a10}) exceeded`, l.et.MAX_RETRIES_EXCEEDED, { maxRetries: a10, contentId: t10, retryCount: this._retryCount })));
                }
                _isServerError(t10) {
                  if (t10 instanceof l.Z)
                    return t10.httpErrorCode >= 400 && t10.httpErrorCode < 600;
                  if (t10 && typeof t10 == "object" && "status" in t10) {
                    let i10 = t10.status;
                    return i10 >= 400 && i10 < 600;
                  }
                  return false;
                }
                _resetRetryState() {
                  this._isRetrying = false, this._retryCount = 0, this._retryTimeoutId &&= void clearTimeout(this._retryTimeoutId);
                }
                _startPauseTimeout() {
                  if (this._cancelPauseTimeout(), this._sessionConfig !== undefined && this._sessionConfig.maximumPauseSeconds > 0) {
                    let t10 = 1000 * this._sessionConfig.maximumPauseSeconds;
                    l.Ft.info(`KeepAlivePlugin: Starting pause timeout (${this._sessionConfig.maximumPauseSeconds}s)`, this._playerId), this._pauseTimeoutId = setTimeout(() => {
                      this._handlePauseTimeout();
                    }, t10);
                  } else
                    l.Ft.info("KeepAlivePlugin: No maximum pause duration configured, skipping pause timeout", this._playerId);
                }
                _cancelPauseTimeout() {
                  this._pauseTimeoutId && (clearTimeout(this._pauseTimeoutId), this._pauseTimeoutId = undefined, l.Ft.info("KeepAlivePlugin: Cancelled pause timeout", this._playerId));
                }
                _handlePauseTimeout() {
                  l.Ft.warn(`KeepAlivePlugin: Maximum pause duration (${this._sessionConfig?.maximumPauseSeconds}s) exceeded for contentId: ${this._contentId}`, this._playerId), this.callbacks.unloadPlayer(l.Lt.SYSTEM, l.zt.PAUSE_TIMEOUT);
                }
                _handleFatalError(t10) {
                  l.Ft.error(`KeepAlivePlugin: Fatal error encountered - ${String(t10)}`, this._playerId), this._resetRetryState(), this._cancelKeepAliveInterval();
                  let i10 = "network_timeout";
                  t10 instanceof l.X && (t10.code === l.et.MAX_RETRIES_EXCEEDED ? i10 = "max_retries_exceeded" : t10.code === l.et.NETWORK_TIMEOUT ? i10 = "network_timeout" : t10.code === l.et.KEEP_ALIVE_MAXIMUM_PAUSE_DURATION_EXCEEDED && (i10 = "maximum_pause_duration_exceeded")), this._deleteSession(i10);
                  let a10 = t10 instanceof l.X ? t10 : new l.X(`Unknown keep-alive error: ${String(t10)}`, l.et.NETWORK_ERROR, { originalError: t10, contentId: this._contentId });
                  this.callbacks.reportError(a10);
                }
                _handleErrorPayload(t10) {
                  if (t10.partialVideoModel) {
                    let i10 = t10.partialVideoModel.manifest?.playbackSessionToken, a10 = t10.partialVideoModel.id;
                    this._sessionTokenDeleted && i10 !== this._sessionToken && (this._sessionTokenDeleted = false), this._contentId = a10, this._sessionToken = i10, l.Ft.info(`KeepAlivePlugin: Loaded partial video information, got contentId=${this._contentId}, sessionToken=${this._sessionToken}`, this._playerId);
                  }
                }
                _cleanup() {
                  this._cancelKeepAliveInterval(), this._cancelPauseTimeout(), this._subscriptions.forEach((t10) => {
                    t10.unsubscribe();
                  }), this._subscriptions = [], this._contentId = undefined, this._sessionConfig = undefined, this._sessionToken = undefined, this._sessionTokenDeleted = false, this._sessionDeletionInProgress = false, this._currentPlayheadPosition = undefined, this._lastSuccessfulKeepAlive = undefined, this._resetRetryState();
                }
                dispose() {
                  l.Ft.info("KeepAlivePlugin: Disposing resources", this._playerId), this._deleteSessionAsync("plugin_disposed").then(() => {
                    this._cleanup();
                  }).catch((t10) => {
                    l.Ft.error(`KeepAlivePlugin: Error during session deletion on dispose - ${String(t10)}`, this._playerId), this._cleanup();
                  });
                }
              }, nY = Object.freeze({ someProperty: "" }), nQ = class {
                get name() {
                  return "KeepAlivePluginCreator";
                }
                get version() {
                  return "0.0.0";
                }
                constructor(t10, i10 = nY) {
                  this._configuration = i10, this._apiServicesContainer = t10;
                }
                create(t10, i10) {
                  return new nJ(t10, i10, this._apiServicesContainer, this._configuration);
                }
              }, nX = Object.freeze({ someProperty: "" });
              function n0({ baseUrl: t10, basePathname: i10 } = {}) {
                return `${t10 ?? ""}${i10 ?? ""}`;
              }
              var n1 = class {
                constructor({ httpEngine: t10 }) {
                  this._httpEngine = t10;
                }
                setApiConfig(t10) {
                  this._apiConfig = t10;
                }
                get baseApiUrl() {
                  return n0(this._apiConfig);
                }
                get resiliencyConfig() {
                  return this._apiConfig?.resiliencyConfig;
                }
              };
              (n4 = n2 ||= {}).PLAYBACK_SERVICE_PLAY = "11", n4.PLAYBACK_SERVICE_MANIFEST = "12", n4.PLAYBACK_SERVICE_KEEP_ALIVE = "13", n4.PLAYBACK_SERVICE_DELETE_SESSION = "14", n4.PLAYBACK_SERVICE_ACTIVATE_SESSION = "15", n4.PLAYBACK_SERVICE_INACTIVATE_SESSION = "16", n4.PLAYBACK_SERVICE_LIST_SESSIONS = "17", n4.LICENSE_PROXY_DRM = "20", n4.CONTENT_SERVICE_CMS_METADATA = "31", n4.SKIP_EVENTS = "01", n4.PLAYHEADS = "02", n4.EEC = "03", n4.AUTHENTICATION_SERVICE = "04", n4.ACCOUNTS_SERVICE = "05", n4.SUBSCRIPTIONS_SERVICE = "06";
              var n4, n2, n3, n5 = class extends n1 {
                createPlaybackSession({ apiVersion: t10 = "v3", audioRole: i10, contentId: a10, device: r10, subDevice: s10, tabId: n10, ttl: o10 = "" }) {
                  let d2 = (0, l.u)(a10), u2 = d2 === l.ot.MUSIC_VIDEO || d2 === l.ot.MUSIC_CONCERT ? `/${t10}/music/{contentId}/{device}/{subDevice}/play{ttl}` : `/${t10}/{contentId}/{device}/{subDevice}/play{ttl}`, c2 = j(this.baseApiUrl, u2, { path: { contentId: a10, device: r10, subDevice: s10, ttl: o10 }, query: { audioRole: i10 } });
                  return this._httpEngine.request(c2, {
                    headers: { ...n10 ? { "x-cr-tab-id": n10 } : {} },
                    includeAuth: true,
                    errorCodePrefixForExtensionNumber: n2.PLAYBACK_SERVICE_PLAY
                  });
                }
                deletePlaybackSession(t10) {
                  let i10 = j(this.baseApiUrl, "/v1/token/{contentId}/{playbackSessionId}", { path: t10 });
                  return this._httpEngine.request(i10, {
                    method: "DELETE",
                    includeAuth: true,
                    keepalive: true,
                    errorCodePrefixForExtensionNumber: n2.PLAYBACK_SERVICE_DELETE_SESSION
                  });
                }
                keepAlivePlaybackSession(t10) {
                  let i10 = j(this.baseApiUrl, "/v1/token/{contentId}/{playbackSessionId}/keepAlive?playhead={playhead}", {
                    path: { ...t10, playhead: t10.playhead.toString() }
                  });
                  return this._httpEngine.request(i10, { method: "PATCH", includeAuth: true, errorCodePrefixForExtensionNumber: n2.PLAYBACK_SERVICE_KEEP_ALIVE });
                }
                inactivatePlaybackSession(t10) {
                  let i10 = j(this.baseApiUrl, "/v1/token/{contentId}/{videoToken}/inactive", { path: t10 });
                  return this._httpEngine.request(i10, {
                    method: "PATCH",
                    includeAuth: true,
                    errorCodePrefixForExtensionNumber: n2.PLAYBACK_SERVICE_INACTIVATE_SESSION
                  });
                }
                activatePlaybackSession(t10) {
                  let i10 = j(this.baseApiUrl, "/v1/token/{contentId}/{videoToken}/active", { path: t10 });
                  return this._httpEngine.request(i10, {
                    method: "PATCH",
                    includeAuth: true,
                    errorCodePrefixForExtensionNumber: n2.PLAYBACK_SERVICE_ACTIVATE_SESSION
                  });
                }
                getActivePlaybackSessions() {
                  let t10 = j(this.baseApiUrl, "/v1/sessions/streaming");
                  return this._httpEngine.request(t10, {
                    method: "PATCH",
                    includeAuth: true,
                    errorCodePrefixForExtensionNumber: n2.PLAYBACK_SERVICE_LIST_SESSIONS
                  });
                }
                setLicenseApiConfig(t10) {
                  this._licenseApiConfig = t10;
                }
                setDrmMediaEngineConfig(t10) {
                  this._drmMediaEngineConfig = t10;
                }
                getLicenseUrl(t10) {
                  return function({ licenseApiConfig: t11, params: i10 }) {
                    return new URL(j(n0(t11), "/v1/license/{drmType}", { path: { drmType: i10.drmType.toString() } }));
                  }({ licenseApiConfig: this._licenseApiConfig, params: t10 });
                }
                async getDrms() {
                  let t10 = this._drmMediaEngineConfig?.drms;
                  return t10 && t10.length ? Promise.resolve(t10.map((t11) => ({ url: this.getLicenseUrl({ drmType: t11.type }), ...t11 }))) : Promise.resolve([]);
                }
              }, n6 = class extends n1 {
                getContentMetadata({ contentId: t10, locale: i10 }) {
                  let a10;
                  switch ((0, l.u)(t10)) {
                    case l.ot.MUSIC_CONCERT:
                      a10 = "/content/v2/music/concerts/{contentId}";
                      break;
                    case l.ot.MUSIC_VIDEO:
                      a10 = "/content/v2/music/music_videos/{contentId}";
                      break;
                    default:
                      a10 = "/content/v2/cms/objects/{contentId}";
                  }
                  let r10 = j(this.baseApiUrl, a10, { path: { contentId: t10 }, query: { locale: i10 } });
                  return this._httpEngine.request(r10, {
                    includeAuth: true,
                    errorCodePrefixForExtensionNumber: n2.CONTENT_SERVICE_CMS_METADATA,
                    ...this.resiliencyConfig ? { resiliencyConfig: this.resiliencyConfig } : undefined
                  });
                }
              }, n7 = class extends n1 {
                getPlayhead({ userId: t10, contentId: i10 }) {
                  let a10 = j(this.baseApiUrl, "/content/v2/{userId}/playheads?content_ids={contentId}", { path: { userId: t10, contentId: i10 } });
                  return this._httpEngine.request(a10, { includeAuth: true, ...this.resiliencyConfig ? { resiliencyConfig: this.resiliencyConfig } : undefined });
                }
                postPlayhead({ userId: t10, contentId: i10, playhead: a10 }) {
                  let r10 = j(this.baseApiUrl, "/content/v2/{userId}/playheads", { path: { userId: t10 } });
                  return this._httpEngine.request(r10, {
                    method: "POST",
                    body: JSON.stringify({ content_id: i10, playhead: a10 }),
                    includeAuth: true,
                    headers: { "Content-Type": "application/json" }
                  });
                }
              }, n8 = class extends n1 {
                getSkipEvents({ contentId: t10 }) {
                  let i10 = j(this.baseApiUrl, "/{contentId}.json", { path: { contentId: t10 } });
                  return this._httpEngine.request(i10);
                }
              }, n9 = class extends n1 {
                async track(t10) {
                  return;
                }
              };
              (s = n3 ||= {}).VIDEO_HEARTBEAT = "Video Heartbeat", s.VIDEO_PLAY_REQUESTED = "Video Play Requested";
              var oe = class {
                constructor({ httpEngine: t10 }) {
                  this._httpEngine = t10, this._playbackService = new n5({ httpEngine: t10 }), this._contentMetadataService = new n6({ httpEngine: t10 }), this._playheadService = new n7({ httpEngine: t10 }), this._skipEventsService = new n8({ httpEngine: t10 }), this._eecService = new n9({ httpEngine: t10 });
                }
                provideApiConfig(t10) {
                  let i10 = t10.apiConfig, a10 = t10.mediaEngineConfig?.drm, r10 = { ...i10.default, resiliencyConfig: t10.resiliencyConfig };
                  this._playbackService.setApiConfig({ ...r10, ...i10.playback }), this._playbackService.setLicenseApiConfig({ ...r10, ...i10.license }), a10 && this._playbackService.setDrmMediaEngineConfig(a10), this._contentMetadataService.setApiConfig({ ...r10, ...i10.content }), this._playheadService.setApiConfig({ ...r10, ...i10.content }), this._skipEventsService.setApiConfig({ ...r10, ...i10.skipEvents }), this._eecService.setApiConfig({ ...r10, ...i10.eec });
                }
                getHttpEngine() {
                  return this._httpEngine;
                }
                getPlaybackService() {
                  return this._playbackService;
                }
                getContentMetadataService() {
                  return this._contentMetadataService;
                }
                getPlayheadsService() {
                  return this._playheadService;
                }
                getSkipEventsService() {
                  return this._skipEventsService;
                }
                getEecService() {
                  return this._eecService;
                }
              }, ot = b({
                author: () => "",
                default: () => oh,
                dependencies: () => ou,
                description: () => or,
                devDependencies: () => oc,
                keywords: () => od,
                license: () => "ISC",
                main: () => os,
                name: () => oi,
                scripts: () => ol,
                type: () => oo,
                types: () => on,
                version: () => oa
              }), oi = "@crunchyroll/katamari-eec-plugins", oa = "0.0.0", or = "EEC plugins for video heartbeat telemetry and viewership analytics", os = "dist/index.js", on = "dist/index.d.ts", oo = "module", ol = {
                build: "tsc --project tsconfig.build.json",
                lint: "eslint ./src/ --cache --cache-strategy content",
                test: "vitest run --coverage.enabled --coverage.reportsDirectory .coverage",
                "test:html": "pnpm run test --coverage --coverage.reporter=html"
              }, od = [], ou = {
                "@cr-lib-katamari-ts/logger": "workspace:*",
                "@cr-lib-katamari-ts/player-core": "workspace:*",
                "@crunchyroll/katamari-api-services": "workspace:*",
                rxjs: "7.8.2"
              }, oc = {
                "@cr-lib-katamari-ts/eslint-config": "workspace:*",
                "@vitest/coverage-v8": "^3.2.4",
                eslint: "^10.4.1",
                typescript: "^5.6.3",
                vitest: "^3.2.4"
              }, oh = {
                name: oi,
                version: oa,
                description: or,
                main: os,
                types: on,
                type: oo,
                scripts: ol,
                keywords: od,
                author: "",
                license: "ISC",
                dependencies: ou,
                devDependencies: oc
              }, op = class {
                static getLibraryInfo() {
                  let t10 = "0.0.0";
                  return ot?.version && (t10 = ot.version || "0.0.0"), { name: "katamari-eec", version: t10 };
                }
                static getLocale() {
                  return "u" > typeof navigator && navigator?.language || "en-US";
                }
                static getTimezone() {
                  try {
                    return Intl.DateTimeFormat().resolvedOptions().timeZone;
                  } catch (t10) {
                    return l.Ft.warn("Could not determine timezone, falling back to UTC.", t10), "UTC";
                  }
                }
              };
              function of(t10, i10) {
                return {
                  app: t10,
                  device: {
                    id: i10.deviceId,
                    manufacturer: i10.make,
                    model: i10.model,
                    name: i10.model,
                    os: { name: i10.operatingSystem, version: i10.operatingSystemVersion },
                    type: i10.deviceType
                  },
                  direct: true,
                  library: op.getLibraryInfo(),
                  locale: op.getLocale(),
                  screen: i10.displayResolution,
                  timezone: op.getTimezone(),
                  userAgent: i10.userAgent
                };
              }
              function og(t10) {
                let i10 = t10.activeText?.role === l.x.CLOSED_CAPTION, a10 = false;
                return t10.videoModel.ads !== undefined && (a10 = !!t10.videoModel.ads), {
                  mediaId: t10.videoModel.id,
                  mediaAudioLanguage: t10.activeAudioLanguage || "",
                  mediaAdSupported: a10,
                  mediaSubtitleLanguage: i10 ? "" : t10.activeText?.language || "",
                  mediaClosedCaptionLanguage: i10 && t10.activeText?.language || ""
                };
              }
              (n = o ||= {}).PLAYBACK_START = "playback_start", n.PLAYBACK_PAUSE = "playback_pause", n.PLAYBACK_STOPPED = "playback_stopped", n.BUFFER_START = "buffer_start", n.BUFFER_END = "buffer_end", n.SESSION_END = "session_end", n.MEDIA_RESOLUTION_START = "media_resolution_start", n.SEEK_EVENT = "seek_event", n.REPORT_INTERVAL = "report_interval", n.PLAYER_ERROR = "player_error", n.PLAYBACK_RATE_CHANGE = "playback_rate_change", n.UNKNOWN = "unknown";
              var ov = l.D.NORMAL_SPEED, om = class {
                constructor(t10, i10, a10, r10, s10, n10) {
                  this._playerId = "HeartbeatPlugin", this._cachedContext = null, this._contextPromise = null, this._contentId = undefined, this._playbackType = undefined, this._subscriptionStatus = l.S.ANONYMOUS, this._userProfile = undefined, this._activeAudioTrack = undefined, this._activeTextTrack = undefined, this._playbackSpeed = undefined, this._currentPlayheadTime = undefined, this._secondsViewed = 0, this._realtimeSecondsViewed = 0, this._isPlaying = false, this._lastHeartbeatTimestamp = undefined, this._hasEverSentHeartbeat = false, this._heartbeatTimer = undefined, this._subscriptions = [], this._isDisposed = false, this.name = "HeartbeatPlugin", this.version = "0.0.0", this._events = t10, this._config = a10, this._apiServicesContainer = r10, this._appInfoProvider = s10, this._deviceInfoProvider = n10, l.Ft.info(`HeartbeatPlugin: Initialized with config: ${JSON.stringify(this._config)}`, this._playerId), this._setupEventListeners();
                }
                dispose() {
                  this._isDisposed || (l.Ft.info("HeartbeatPlugin: Disposing resources", this._playerId), this._isDisposed = true, this._cleanup());
                }
                _setupEventListeners() {
                  this._subscriptions.push(this._events.playerStateChangedEvent$.subscribe((t10) => {
                    switch (t10.event) {
                      case l.Rt.DISPOSED:
                        this.dispose();
                        break;
                      case l.Rt.STOPPED:
                        this._handleStateChange(l.Rt.STOPPED);
                        break;
                      case l.Rt.ERROR:
                        this._handleStateChange(l.Rt.ERROR);
                        break;
                      case l.Rt.PLAYING:
                        this._handleStateChange(l.Rt.PLAYING);
                        break;
                      case l.Rt.PAUSED:
                        this._handleStateChange(l.Rt.PAUSED);
                    }
                  })), this._subscriptions.push(this._events.playheadUpdate$.subscribe((t10) => {
                    this._handlePlayheadUpdate(t10);
                  })), this._subscriptions.push(this._events.onVideoModelUpdated((t10) => {
                    this._handleVideoModelUpdate(t10);
                  })), this._subscriptions.push(this._events.mediaResolutionStart$.subscribe(() => {
                    this._handleMediaResolution();
                  })), this._subscriptions.push(this._events.bufferStart$.subscribe((t10) => {
                    this._handleBufferStart(t10);
                  })), this._subscriptions.push(this._events.sessionEnded$.subscribe(() => {
                    this._handleSessionEnd();
                  })), this._subscriptions.push(this._events.activeAudioTrackChange$.subscribe((t10) => {
                    this._handleActiveAudioTrackChange(t10);
                  })), this._subscriptions.push(this._events.activeTextTrackChange$.subscribe((t10) => {
                    this._handleActiveTextTrackChange(t10);
                  })), this._subscriptions.push(this._events.playbackRateChanged$.subscribe((t10) => {
                    this._handlePlaybackRateChange(t10);
                  }));
                }
                _handleStateChange(t10) {
                  switch (t10) {
                    case l.Rt.PLAYING:
                      ;
                      this._sendImmediateHeartbeat(o.PLAYBACK_START), this._onStartPlayback();
                      break;
                    case l.Rt.PAUSED:
                      ;
                      this._sendImmediateHeartbeat(o.PLAYBACK_PAUSE), this._onPausePlayback();
                      break;
                    case l.Rt.ERROR:
                      ;
                      this._sendImmediateHeartbeat(o.PLAYER_ERROR), this._resetTimeTracking();
                      break;
                    case l.Rt.STOPPED:
                      ;
                      this._sendImmediateHeartbeat(o.PLAYBACK_STOPPED), this._resetTimeTracking();
                  }
                }
                _handlePlayheadUpdate(t10) {
                  let i10 = t10.playheadData.contentTime;
                  this._currentPlayheadTime = i10;
                }
                _handleVideoModelUpdate(t10) {
                  t10.videoModel?.id ? (this._contentId && this._contentId !== t10.videoModel.id && l.Ft.info(`HeartbeatPlugin: Content switched from ${this._contentId} to ${t10.videoModel.id}, resetting time tracking`, this._playerId), this._resetTimeTracking(), this._contentId = t10.videoModel.id, this._playbackType = t10.videoModel.manifest.playbackType, t10.videoModel.initialProfile ? (this._subscriptionStatus = t10.videoModel.initialProfile.subscriptionStatus, this._userProfile = t10.videoModel.initialProfile) : (l.Ft.warn("HeartbeatPlugin: No initialProfile found in video model, using defaults", this._playerId), this._subscriptionStatus = l.S.ANONYMOUS, this._userProfile = undefined), t10.videoModel.watchHistory?.resumePosition !== undefined && (this._currentPlayheadTime = t10.videoModel.watchHistory.resumePosition, l.Ft.info(`HeartbeatPlugin: Video model updated with contentId: ${t10.videoModel.id}, initial position: ${t10.videoModel.watchHistory.resumePosition}s`, this._playerId))) : (l.Ft.warn("HeartbeatPlugin: Video model updated without contentId", this._playerId), this._resetTimeTracking());
                }
                _handleBufferStart(t10) {
                  t10.reason === l.It.SEEK ? l.Ft.info(`HeartbeatPlugin: Player buffering started at time ${t10.playheadPosition}`, this._playerId) : l.Ft.info("HeartbeatPlugin: Buffer started", this._playerId), this._sendImmediateHeartbeat(o.BUFFER_START), this._onPausePlayback();
                }
                _handleMediaResolution() {
                  this._sendImmediateHeartbeat(o.MEDIA_RESOLUTION_START);
                }
                _handleSessionEnd() {
                  this._sendImmediateHeartbeat(o.SESSION_END), this._resetTimeTracking();
                }
                _handleActiveAudioTrackChange(t10) {
                  this._activeAudioTrack = t10.activeAudioTrack, l.Ft.info(`HeartbeatPlugin: Audio track updated to: ${this._activeAudioTrack?.language || "none"}`, this._playerId);
                }
                _handleActiveTextTrackChange(t10) {
                  this._activeTextTrack = t10.activeTextTrack, l.Ft.info(`HeartbeatPlugin: Subtitle track updated to: ${this._activeTextTrack?.language || "none"}`, this._playerId);
                }
                _handlePlaybackRateChange(t10) {
                  this._sendImmediateHeartbeat(o.PLAYBACK_RATE_CHANGE), this._playbackSpeed = t10.rate;
                }
                _sendImmediateHeartbeat(t10 = o.UNKNOWN) {
                  this._sendHeartbeat(t10).catch((t11) => {
                    l.Ft.warn("HeartbeatPlugin: Failed to send immediate heartbeat", t11, this._playerId);
                  });
                }
                async _sendHeartbeat(t10 = o.UNKNOWN) {
                  if (!this._canSendHeartbeat(t10))
                    return;
                  let i10 = this._processHeartbeatTiming(t10);
                  if (!i10)
                    return;
                  let a10 = this._createHeartbeatData(i10.elapsedDelta, i10.realtimeElapsedDelta, i10.realtimeSecondsViewed), r10 = og({
                    videoModel: { id: this._contentId, ads: undefined },
                    activeAudioLanguage: this._activeAudioTrack?.language,
                    activeText: this._activeTextTrack ? { language: this._activeTextTrack.language, role: this._activeTextTrack.role } : undefined
                  }), s10 = this._appInfoProvider.getViewershipAttribution(), n10 = await this._getContext(), d2 = { ...a10, ...r10, ...s10 };
                  l.Ft.info(`HeartbeatPlugin: Sending heartbeat on ${t10} event with properties: ${JSON.stringify(d2)}`, this._playerId);
                  try {
                    await this._apiServicesContainer.getEecService().track({ context: n10, userProfile: this._userProfile, properties: d2, event: n3.VIDEO_HEARTBEAT });
                  } catch (t11) {
                    l.Ft.warn("HeartbeatPlugin: Failed to send heartbeat to EEC service", t11, this._playerId);
                  }
                  return a10;
                }
                async _getDeviceInfo() {
                  try {
                    return await this._fetchDeviceInfoWithTimeout();
                  } catch (t10) {
                    return l.Ft.warn("HeartbeatPlugin: Failed to get device info, using default fallback", t10, this._playerId), this._getDefaultDeviceInfo();
                  }
                }
                async _fetchDeviceInfoWithTimeout() {
                  return new Promise((t10, i10) => {
                    let a10 = setTimeout(() => {
                      i10(Error("Device info request timed out"));
                    }, 5000);
                    this._deviceInfoProvider.getDeviceInfo().then((i11) => (clearTimeout(a10), t10(i11), i11)).catch((t11) => {
                      clearTimeout(a10), i10(t11);
                    });
                  });
                }
                async _getContext() {
                  if (this._isDisposed)
                    throw Error("Cannot create context - plugin is disposed");
                  if (this._cachedContext)
                    return this._cachedContext;
                  if (this._contextPromise)
                    return await this._contextPromise;
                  this._contextPromise = this._createContextInternal();
                  let t10 = await this._contextPromise;
                  return this._cachedContext = t10, this._contextPromise = null, l.Ft.info("HeartbeatPlugin: Context cached successfully", t10, this._playerId), t10;
                }
                async _createContextInternal() {
                  let t10 = await this._getDeviceInfo();
                  return of(this._appInfoProvider.getAppInfo(), t10);
                }
                _getDefaultDeviceInfo() {
                  return {
                    browser: "",
                    browserVersion: "",
                    make: "",
                    model: "",
                    displayResolution: { width: 0, height: 0 },
                    operatingSystem: "",
                    operatingSystemVersion: "",
                    deviceId: "katamari-player",
                    deviceType: l.at.WEB,
                    deviceSubType: l.it.FALLBACK,
                    userAgent: ""
                  };
                }
                _canSendHeartbeat(t10) {
                  return this._isDisposed ? (l.Ft.warn("HeartbeatPlugin: Cannot send heartbeat - plugin is disposed", this._playerId), false) : this._contentId ? this._currentPlayheadTime === undefined ? (l.Ft.warn(`HeartbeatPlugin: Cannot send heartbeat for event ${t10} - current playhead time is undefined`, this._playerId), false) : !!this._userProfile || (l.Ft.warn(`HeartbeatPlugin: Cannot send heartbeat for event ${t10} - user profile is undefined`, this._playerId), false) : (l.Ft.warn(`HeartbeatPlugin: Cannot send heartbeat for event ${t10} - contentId is undefined`, this._playerId), false);
                }
                _processHeartbeatTiming(t10) {
                  let i10 = Date.now(), a10 = 0, r10 = 0;
                  if (this._lastHeartbeatTimestamp !== undefined && this._isPlaying) {
                    let t11 = (i10 - this._lastHeartbeatTimestamp) / 1000;
                    r10 = t11, a10 = t11 * (this._playbackSpeed && this._playbackSpeed !== 0 ? this._playbackSpeed : ov);
                  }
                  if (r10 < 0.1 && this._hasEverSentHeartbeat) {
                    l.Ft.info(`HeartbeatPlugin: Skipping heartbeat for event ${t10} - elapsedDelta is too small (${a10}s)`, this._playerId);
                    return;
                  }
                  this._realtimeSecondsViewed += r10;
                  let s10 = this._realtimeSecondsViewed;
                  return this._secondsViewed += a10, this._lastHeartbeatTimestamp = i10, this._hasEverSentHeartbeat = true, { elapsedDelta: a10, realtimeElapsedDelta: r10, realtimeSecondsViewed: s10 };
                }
                _createHeartbeatData(t10, i10, a10) {
                  let r10 = {
                    elapsedDelta: t10,
                    playbackSource: l.E.NETWORK,
                    playbackType: this._playbackType,
                    playheadTime: this._currentPlayheadTime,
                    secondsViewed: this._secondsViewed,
                    subStatus: this._subscriptionStatus,
                    realtimeElapsedDelta: i10,
                    realtimeSecondsViewed: a10
                  };
                  return this._playbackSpeed !== undefined && (r10.playbackSpeed = this._playbackSpeed), r10;
                }
                _onStartPlayback() {
                  let t10 = Date.now();
                  this._isPlaying || (this._isPlaying = true, this._lastHeartbeatTimestamp = t10, this._startHeartbeatTimer());
                }
                _onPausePlayback() {
                  this._isPlaying && (this._isPlaying = false, this._lastHeartbeatTimestamp = undefined, this._stopHeartbeatTimer());
                }
                _startHeartbeatTimer() {
                  this._stopHeartbeatTimer(), this._heartbeatTimer = setInterval(() => {
                    this._isPlaying && this._sendHeartbeat(o.REPORT_INTERVAL).catch((t10) => {
                      l.Ft.warn("HeartbeatPlugin: Failed to send scheduled heartbeat", t10, this._playerId);
                    });
                  }, 30000);
                }
                _stopHeartbeatTimer() {
                  this._heartbeatTimer &&= void clearInterval(this._heartbeatTimer);
                }
                _resetTimeTracking() {
                  this._currentPlayheadTime = undefined, this._secondsViewed = 0, this._realtimeSecondsViewed = 0, this._lastHeartbeatTimestamp = undefined, this._isPlaying = false, this._hasEverSentHeartbeat = false, this._stopHeartbeatTimer(), l.Ft.info("HeartbeatPlugin: Time tracking values reset", this._playerId);
                }
                _cleanup() {
                  this._subscriptions.forEach((t10) => {
                    t10.unsubscribe();
                  }), this._subscriptions = [], this._resetTimeTracking(), this._contentId = undefined, this._subscriptionStatus = l.S.ANONYMOUS, this._userProfile = undefined, this._activeAudioTrack = undefined, this._activeTextTrack = undefined, this._cachedContext = null, this._contextPromise = null;
                }
              }, oy = class {
                get name() {
                  return "HeartbeatPluginCreator";
                }
                get version() {
                  return "0.0.0";
                }
                constructor(t10, i10, a10, r10 = nX) {
                  this._apiServicesContainer = t10, this._appInfoProvider = i10, this._deviceInfoProvider = a10, this._configuration = r10;
                }
                create(t10, i10) {
                  return new om(t10, i10, this._configuration, this._apiServicesContainer, this._appInfoProvider, this._deviceInfoProvider);
                }
              }, o_ = class {
                constructor(t10, i10, a10, r10, s10, n10) {
                  this.name = "ViewershipAnalyticsPlugin", this.version = "0.0.0", this._playerId = "ViewershipAnalyticsPlugin", this._subscriptions = [], this._isDisposed = false, this._currentContentId = undefined, this._previousContentId = undefined, this._currentVideoModel = undefined, this._currentUserProfile = undefined, this._activeAudioTrack = undefined, this._activeTextTrack = undefined, this._requestedPlayheadTime = 0, this._hasSentVideoPlayRequested = false, this._events = t10, this._eecService = r10.getEecService(), this._appInfoProvider = s10, this._deviceInfoProvider = n10, l.Ft.info(`ViewershipAnalyticsPlugin: Initialized with config: ${JSON.stringify(a10)}`, this._playerId), this._setup();
                }
                dispose() {
                  this._isDisposed || (l.Ft.info("ViewershipAnalyticsPlugin: Disposing resources", this._playerId), this._isDisposed = true, this._subscriptions.forEach((t10) => t10.unsubscribe()), this._subscriptions = []);
                }
                _setup() {
                  this._subscriptions.push(this._events.onVideoModelUpdated((t10) => {
                    this._handleVideoModelUpdate(t10);
                  })), this._subscriptions.push(this._events.playerStateChangedEvent$.subscribe((t10) => {
                    t10.event === l.Rt.MEDIA_LOADED && this._handlePlaybackStart().catch((t11) => {
                      l.Ft.error("ViewershipAnalyticsPlugin: Error in playback start handler", t11, this._playerId);
                    });
                  })), this._subscriptions.push(this._events.activeAudioTrackChange$.subscribe((t10) => {
                    this._activeAudioTrack = t10.activeAudioTrack;
                  })), this._subscriptions.push(this._events.activeTextTrackChange$.subscribe((t10) => {
                    this._activeTextTrack = t10.activeTextTrack;
                  }));
                }
                _handleVideoModelUpdate(t10) {
                  var i10;
                  let a10 = {
                    contentId: (i10 = t10.videoModel ?? {}).id,
                    playbackType: i10.manifest?.playbackType,
                    subscriptionStatus: i10.initialProfile?.subscriptionStatus ?? l.S.ANONYMOUS,
                    userProfile: i10.initialProfile,
                    initialPlayhead: i10.watchHistory?.resumePosition
                  };
                  a10.contentId && a10.contentId !== this._currentContentId ? (this._currentContentId = a10.contentId, this._currentVideoModel = t10.videoModel, this._currentUserProfile = a10.userProfile, this._requestedPlayheadTime = a10.initialPlayhead ?? 0, this._hasSentVideoPlayRequested = false, l.Ft.info(`ViewershipAnalyticsPlugin: Video model updated with contentId: ${this._currentContentId}, initial position: ${this._requestedPlayheadTime}s`, this._playerId)) : a10.contentId || l.Ft.warn("ViewershipAnalyticsPlugin: Video model updated without contentId", this._playerId);
                }
                async _handlePlaybackStart() {
                  if (this._hasSentVideoPlayRequested) {
                    l.Ft.info("ViewershipAnalyticsPlugin: VIDEO_PLAY_REQUESTED already sent for this content session", this._playerId);
                    return;
                  }
                  if (!this._currentContentId) {
                    l.Ft.warn("ViewershipAnalyticsPlugin: Playback start without contentId", this._playerId);
                    return;
                  }
                  if (!this._currentUserProfile) {
                    l.Ft.warn("ViewershipAnalyticsPlugin: Playback start without user profile", this._playerId);
                    return;
                  }
                  if (!this._currentVideoModel) {
                    l.Ft.warn("ViewershipAnalyticsPlugin: Playback start without video model", this._playerId);
                    return;
                  }
                  try {
                    var t10;
                    let i10 = await this._deviceInfoProvider.getDeviceInfo(), a10 = of(this._appInfoProvider.getAppInfo(), i10), r10 = og({
                      videoModel: this._currentVideoModel,
                      activeAudioLanguage: this._activeAudioTrack?.language,
                      activeText: this._activeTextTrack ? { language: this._activeTextTrack.language, role: this._activeTextTrack.role } : undefined
                    }), s10 = this._previousContentId === undefined, n10 = s10 ? "play" : "autoplay", o10 = {
                      ...(t10 = {
                        videoMediaInfo: r10,
                        previousMediaId: s10 ? undefined : this._previousContentId,
                        playType: n10,
                        playbackSource: "network",
                        playheadTime: this._requestedPlayheadTime
                      }).videoMediaInfo,
                      previousMediaId: t10.previousMediaId,
                      playType: t10.playType,
                      playbackSource: t10.playbackSource,
                      playheadTime: t10.playheadTime
                    }, d2 = this._appInfoProvider.getViewershipAttribution();
                    await this._eecService.track({
                      event: n3.VIDEO_PLAY_REQUESTED,
                      properties: { ...o10, ...d2 },
                      context: a10,
                      userProfile: this._currentUserProfile
                    }), l.Ft.info(`ViewershipAnalyticsPlugin: Sent VIDEO_PLAY_REQUESTED for contentId: ${this._currentContentId}, playType: ${n10}`, this._playerId), this._hasSentVideoPlayRequested = true, this._previousContentId = this._currentContentId;
                  } catch (t11) {
                    l.Ft.error("ViewershipAnalyticsPlugin: Failed to send VIDEO_PLAY_REQUESTED", t11, this._playerId);
                  }
                }
              }, ob = Object.freeze({ enabled: true }), ok = class {
                constructor() {
                  this.name = "NoopPlugin(ViewershipAnalytics)", this.version = "0.0.0";
                }
                dispose() {}
              }, oC = class {
                get name() {
                  return "ViewershipAnalyticsPluginCreator";
                }
                get version() {
                  return "0.0.0";
                }
                constructor(t10, i10, a10, r10, s10 = ob) {
                  this._apiServicesContainer = t10, this._appInfoProvider = i10, this._deviceInfoProvider = a10, this._configuration = s10;
                }
                create(t10, i10) {
                  let a10 = this._configuration ?? ob;
                  return a10.enabled ? new o_(t10, i10, a10, this._apiServicesContainer, this._appInfoProvider, this._deviceInfoProvider) : new ok;
                }
              }, ow = class {
                constructor(t10) {
                  var i10, a10;
                  let {
                    rootView: r10,
                    uiRootView: s10,
                    mediaEngine: n10,
                    profileProvider: o10,
                    apiServicesContainer: d2,
                    appInfoProvider: u2,
                    deviceInfoProvider: c2,
                    localStorageProvider: h2,
                    playerConfig: p2
                  } = t10, f2 = "0.0.0";
                  ro?.version && (f2 = ro.version);
                  let g2 = [new nW(o10, d2), new nQ(d2)];
                  let v2 = { ...p2.apiConfig?.default, ...p2.apiConfig?.i18n }, m2 = { endpoint: `${v2.baseUrl ?? ""}${v2.basePathname ?? ""}` }, y2 = new tB(t10.posterResolver);
                  this._katamariPlayer = new l.n({
                    mediaEngine: n10,
                    mediaResolver: t10.mediaResolver,
                    bifResolver: t10.bifResolver,
                    trackSelectionResolver: t10.trackSelectionResolver,
                    plugins: g2,
                    textTrackRenderers: t10.textTrackRenderers || [],
                    mediaSessionHandler: y2,
                    localStorageProvider: h2,
                    profileProvider: o10,
                    rootView: r10,
                    nextEpisodeProvider: t10.nextEpisodeProvider
                  }), this._viewModels = new tF(this._katamariPlayer, this._katamariPlayer.eventSubscriptions(), o10, r10), this._desktopUIBuilder = new rn({
                    viewModels: this._viewModels,
                    containerElement: s10,
                    keyboardShortcutBackstop: t10.keyboardShortcutBackstop,
                    localizationConfig: m2
                  }), this._desktopUIBuilder.useReactRoot(), y2.setLocalizationManager(this._desktopUIBuilder.localizationManager), this._eventBus = {
                    currentMediaGuid$: (a10 = this._katamariPlayer.eventSubscriptions()).mediaResolving$.pipe((0, l.ht)((t11) => t11.guid)),
                    nextEpisodeGuidUpdated$: a10.nextEpisodeGuidUpdated$.pipe((0, l.ht)((t11) => t11.nextEpisodeGuid)),
                    endedPlayback$: I(a10.playerTimedOut$.pipe((0, l.ht)(() => l.Bt.TIMED_OUT)), a10.assetQueueUpdateRequested$.pipe((0, l.ht)(() => l.Bt.LOAD_NEXT_VIDEO)), a10.streamEnd$.pipe(N(a10.nextEpisodeGuidUpdated$), (0, l.ht)(([, { nextEpisodeGuid: t11 }]) => {
                      let i11 = h2.read(l.Ht.autoplayNext, true);
                      return t11 && i11 ? l.Bt.LOAD_NEXT_VIDEO : l.Bt.DONE_WATCHING;
                    })))
                  }, o10.getUserProfile().then((t11) => this._desktopUIBuilder.initializeLocalization(t11.uiLanguage)).catch((t11) => {
                    l.Ft.error("Failed to initialize localization:", t11);
                  });
                }
                load(t10, i10 = -1) {
                  this._katamariPlayer.load(t10, i10);
                }
                events() {
                  return this._eventBus;
                }
                setPlaybackRate(t10) {
                  this._katamariPlayer.setPlaybackRate(t10);
                }
                async dispose() {
                  this._desktopUIBuilder.dispose(), this._viewModels.dispose(), await this._katamariPlayer.dispose();
                }
              };
              function ox(t10) {
                return { episode: l.ot.EPISODE, movie: l.ot.MOVIE, musicConcert: l.ot.MUSIC_CONCERT, musicVideo: l.ot.MUSIC_VIDEO }[t10];
              }
              function oE(t10) {
                return { promo: l.C.PROMO, logo: l.C.LOGO, recap: l.C.RECAP, preview: l.C.PREVIEW, ad: l.C.AD, main: l.C.MAIN }[t10];
              }
              function oS(t10) {
                return { intro: l.ut.INTRO, recap: l.ut.RECAP, credits: l.ut.CREDITS, preview: l.ut.PREVIEW, promo: l.ut.PROMO, bumper: l.ut.BUMPER }[t10];
              }
              function oT(t10) {
                return { main: l.lt.MAIN, dub: l.lt.DUB, description: l.lt.AUDIO_DESCRIPTION }[t10];
              }
              function oP(t10) {
                return { embedded: l.ct.EMBEDDED, external: l.ct.SEPARATE_MASTER }[t10];
              }
              function oA(t10) {
                return { caption: l.x.CLOSED_CAPTION, subtitle: l.x.SUBTITLE, sdh: l.x.SDH }[t10];
              }
              function oL(t10) {
                return { embedded: l.b.EMBEDDED, external: l.b.EXTERNAL, "burned-in": l.b.BURNED_IN }[t10];
              }
              function oI(t10) {
                return /^\d+$/.test(t10);
              }
              function oR(t10, i10) {
                return t10 && (0, l.V)(t10, i10) && (0, l.K)(t10[i10]) ? t10[i10] : undefined;
              }
              function oD(t10) {
                return (0, l.V)(t10, "extended_maturity_rating") && (0, l.W)(t10.extended_maturity_rating) ? t10.extended_maturity_rating : undefined;
              }
              function oM(t10) {
                let i10, a10 = l.st.AVAILABLE;
                if ((0, l.V)(t10, "availability") && (0, l.W)(t10.availability) && (0, l.V)(t10.availability, "startDate") && (0, l.K)(t10.availability.startDate) && (0, l.V)(t10.availability, "endDate") && (0, l.K)(t10.availability.endDate)) {
                  let i11 = Date.now(), r10 = new Date(t10.availability.startDate).getTime(), s10 = new Date(t10.availability.endDate).getTime();
                  a10 = i11 < r10 ? l.st.COMING_SOON : i11 > s10 ? l.st.UNAVAILABLE : l.st.AVAILABLE;
                }
                if ((0, l.V)(t10, "availability_status") && (0, l.K)(t10.availability_status))
                  switch (t10.availability_status) {
                    case "available":
                    default:
                      a10 = l.st.AVAILABLE;
                      break;
                    case "premium_only":
                      a10 = l.st.PREMIUM_ONLY;
                      break;
                    case "coming_soon":
                      a10 = l.st.COMING_SOON;
                      break;
                    case "unavailable":
                      a10 = l.st.UNAVAILABLE;
                  }
                return a10 === l.st.COMING_SOON && (0, l.V)(t10, "availability_starts") && (0, l.K)(t10.availability_starts) && (i10 = t10.availability_starts), { contentAvailability: a10, ...i10 && { availabilityDate: i10 } };
              }
              var oN = (t10, i10, a10) => ({ id: `${t10}_${i10.start}_${i10.end}`, start: i10.start, end: i10.end, canSkip: true, type: a10 }), oj = class {
                constructor(t10, i10, a10, r10, s10) {
                  this.featureFlags = {}, this.profileProvider = t10, this.deviceInfoProvider = i10, this.apiServicesContainer = a10, this.trackSelectionResolver = r10, this.appInfoProvider = s10;
                }
                setFeatureFlags(t10) {
                  this.featureFlags = { ...t10 };
                }
                async getAssetMetadata(t10, i10) {
                  return function(t11, i11 = {}) {
                    let a10;
                    if (!t11)
                      throw new l.J("Empty CMS data", l.et.METADATA_LOAD);
                    if (!(0, l.W)(t11))
                      throw new l.J("Invalid CMS data", l.et.METADATA_LOAD);
                    if ((0, l.V)(t11, "items") && (0, l.G)(t11.items))
                      a10 = t11.items[0];
                    else if ((0, l.V)(t11, "data") && (0, l.G)(t11.data))
                      a10 = t11.data[0];
                    else
                      throw new l.J("Invalid CMS data", l.et.METADATA_LOAD);
                    if ((0, l.V)(a10, "type") && (0, l.K)(a10.type) && ox(a10.type) !== undefined) {
                      let t12 = (0, l.V)(a10, "title") && (0, l.K)(a10.title) ? a10.title : "", r10 = ox(a10.type), s10;
                      switch (r10) {
                        case l.ot.MUSIC_CONCERT:
                          s10 = function(t13) {
                            if ((0, l.V)(t13, "durationMs") && (0, l.U)(t13.durationMs)) {
                              let i12 = (0, l.V)(t13, "description") && (0, l.K)(t13.description) ? t13.description : undefined, { contentAvailability: a11, availabilityDate: r11 } = oM(t13);
                              return {
                                contentDuration: t13.durationMs / 1000,
                                contentAvailability: a11,
                                titleFormat: "titleOnly",
                                ...r11 && { availabilityDate: r11 },
                                ...i12 && { synopsis: i12 }
                              };
                            }
                            throw new l.J("Invalid CMS data", l.et.METADATA_LOAD);
                          }(a10);
                          break;
                        case l.ot.MUSIC_VIDEO:
                          s10 = function(t13) {
                            if ((0, l.V)(t13, "durationMs") && (0, l.U)(t13.durationMs)) {
                              let i12 = (0, l.V)(t13, "description") && (0, l.K)(t13.description) ? t13.description : undefined, { contentAvailability: a11, availabilityDate: r11 } = oM(t13);
                              return {
                                contentDuration: t13.durationMs / 1000,
                                contentAvailability: a11,
                                titleFormat: "titleOnly",
                                ...r11 && { availabilityDate: r11 },
                                ...i12 && { synopsis: i12 }
                              };
                            }
                            throw new l.J("Invalid CMS data", l.et.METADATA_LOAD);
                          }(a10);
                          break;
                        default:
                          s10 = function(t13, i12 = {}) {
                            var a11;
                            let r11, s11, n10 = {}, o10 = false, d2 = false;
                            if ((0, l.V)(t13, "episode_metadata") && (0, l.W)(t13.episode_metadata) ? (o10 = true, n10 = t13.episode_metadata) : (0, l.V)(t13, "movie_metadata") && (0, l.W)(t13.movie_metadata) ? (d2 = true, n10 = t13.movie_metadata) : (0, l.V)(t13, "movie_listing_metadata") && (0, l.W)(t13.movie_listing_metadata) && (d2 = true, n10 = t13.movie_listing_metadata), !o10 && !d2)
                              throw new l.J("Missing episode_metadata/movie_metadata/movie_listing_metadata", l.et.METADATA_LOAD);
                            if (!(0, l.V)(n10, "duration_ms") || !(0, l.U)(n10.duration_ms))
                              throw new l.J("Missing duration_ms", l.et.METADATA_LOAD);
                            let u2 = n10.duration_ms / 1000, c2 = (0, l.V)(t13, "description") && (0, l.K)(t13.description) ? t13.description : undefined, h2 = (0, l.V)(n10, "series_title") && (0, l.K)(n10.series_title) ? n10.series_title : undefined, p2 = (0, l.V)(n10, "subtitle_locales") && (0, l.q)(n10.subtitle_locales) ? n10.subtitle_locales : undefined, f2 = function(t14) {
                              let i13 = [], a12 = (0, l.V)(t14, "versions") && (0, l.G)(t14.versions) ? t14.versions : [];
                              if (a12.length === 0) {
                                let a13 = (0, l.V)(t14, "audio_locale") && (0, l.K)(t14.audio_locale) ? t14.audio_locale : undefined;
                                return a13 && (i13 = [a13]), i13;
                              }
                              return a12.forEach((t15) => {
                                let a13 = (0, l.V)(t15, "audio_locale") && (0, l.K)(t15.audio_locale) ? t15.audio_locale : undefined;
                                a13 && i13?.push(a13);
                              }), i13;
                            }(n10), g2 = (a11 = n10, r11 = !!((0, l.V)(a11, "is_subbed") && (0, l.H)(a11.is_subbed)) && a11.is_subbed, s11 = !!((0, l.V)(a11, "is_dubbed") && (0, l.H)(a11.is_dubbed)) && a11.is_dubbed, r11 && s11 ? "sub|dub" : s11 ? "dub" : r11 ? "sub" : undefined), v2 = function(t14) {
                              let i13 = oD(t14);
                              if (i13 && (0, l.V)(i13, "rating") && (0, l.K)(i13.rating) && (0, l.V)(i13, "system") && (0, l.K)(i13.system)) {
                                var a12;
                                let t15 = (a12 = i13.system, {
                                  "cr-br-tv": l.w.BR_TV,
                                  "cr-br-movies": l.w.BR_MOVIE,
                                  "cr-nz-tv": l.w.NZ_TV,
                                  "cr-nz-movies": l.w.NZ_MOVIE,
                                  "cr-au-tv": l.w.AU_TV,
                                  "cr-au-movies": l.w.AU_MOVIE,
                                  "cr-in-tv": l.w.IN_TV,
                                  "cr-in-movies": l.w.IN_MOVIE,
                                  "cr-tv": l.w.UNIVERSAL_TV,
                                  "cr-movies": l.w.UNIVERSAL_MOVIE,
                                  "cr-kr-kmrb": l.w.KR_KMRB,
                                  "cr-kr-broadcast": l.w.KR_BROADCAST
                                }[a12]);
                                if (t15 === undefined)
                                  throw new l.J("Invalid rating system", l.et.METADATA_LOAD);
                                if (function(t16, i14) {
                                  var a13, r12, s12, n11, o11, d3;
                                  switch (i14) {
                                    case l.w.BR_MOVIE:
                                    case l.w.BR_TV:
                                      return a13 = (a13 = t16).toUpperCase(), {
                                        L: l.j.ALL,
                                        10: l.j.TEN,
                                        12: l.j.TWELVE,
                                        14: l.j.FOURTEEN,
                                        16: l.j.SIXTEEN,
                                        18: l.j.EIGHTEEN,
                                        AL: l.j.ALL,
                                        A10: l.j.TEN,
                                        A12: l.j.TWELVE,
                                        A14: l.j.FOURTEEN,
                                        A16: l.j.SIXTEEN,
                                        A18: l.j.EIGHTEEN
                                      }[a13];
                                    case l.w.NZ_MOVIE:
                                    case l.w.NZ_TV:
                                      return r12 = (r12 = t16).toUpperCase(), { G: l.N.G, PG: l.N.PG, 13: l.N.THIRTEEN, 16: l.N.SIXTEEN, 18: l.N.EIGHTEEN, M: l.N.M }[r12];
                                    case l.w.AU_MOVIE:
                                    case l.w.AU_TV:
                                      return s12 = (s12 = t16).toUpperCase(), { G: l.A.G, PG: l.A.PG, M: l.A.M, "MA 15+": l.A.MA_15_PLUS, "R 18+": l.A.R_18_PLUS }[s12];
                                    case l.w.IN_MOVIE:
                                    case l.w.IN_TV:
                                      return n11 = (n11 = t16).toUpperCase(), {
                                        U: l.M.U,
                                        "U/A 7+": l.M.UA_7_PLUS,
                                        "U/A 13+": l.M.UA_13_PLUS,
                                        "U/A 16+": l.M.UA_16_PLUS,
                                        A: l.M.A
                                      }[n11];
                                    case l.w.KR_KMRB:
                                    case l.w.KR_BROADCAST:
                                      return o11 = (o11 = t16).toUpperCase(), { ALL: l.P.ALL, 7: l.P.SEVEN, 12: l.P.TWELVE, 15: l.P.FIFTEEN, 19: l.P.NINETEEN }[o11];
                                    case l.w.UNIVERSAL_MOVIE:
                                    case l.w.UNIVERSAL_TV:
                                      return d3 = (d3 = t16).toUpperCase(), {
                                        ALL: l.F.ALL,
                                        PG: l.F.PG,
                                        12: l.F.TWELVE_PLUS,
                                        14: l.F.FOURTEEN_PLUS,
                                        16: l.F.SIXTEEN_PLUS,
                                        18: l.F.EIGHTEEN_PLUS,
                                        "TV-Y": l.F.ALL,
                                        "TV-Y7": l.F.ALL,
                                        "TV-G": l.F.ALL,
                                        "TV-PG": l.F.PG,
                                        "TV-14": l.F.FOURTEEN_PLUS,
                                        "TV-MA": l.F.EIGHTEEN_PLUS
                                      }[d3];
                                    default:
                                      return null;
                                  }
                                }(i13.rating, t15) === undefined)
                                  throw new l.J("Invalid rating", l.et.METADATA_LOAD);
                                return { displayName: i13.rating, system: t15 };
                              }
                            }(n10), m2 = function(t14, i13 = {}) {
                              let a12 = [], r12 = [], s12 = [];
                              return i13.useContentDescriptorsWithSymbol === true && (0, l.V)(t14, "content_descriptors_with_symbol") && (0, l.G)(t14.content_descriptors_with_symbol) ? t14.content_descriptors_with_symbol.forEach((t15) => {
                                if (!(!(0, l.V)(t15, "label") || !(0, l.K)(t15.label))) {
                                  if (s12.push(t15.label), (0, l.V)(t15, "symbol") && (0, l.K)(t15.symbol)) {
                                    let i14 = function(t16, i15) {
                                      try {
                                        return { url: new URL(i15), altText: t16, width: 64, height: 64 };
                                      } catch (a13) {
                                        l.Ft.warn("MediaResolver: Invalid advisory component image URL:", {
                                          label: t16,
                                          symbol: i15,
                                          error: a13
                                        });
                                        return;
                                      }
                                    }(t15.label, t15.symbol);
                                    i14 ? a12.push(i14) : r12.push(t15.label);
                                  } else
                                    r12.push(t15.label);
                                }
                              }) : s12 = (r12 = (0, l.V)(t14, "content_descriptors") && (0, l.q)(t14.content_descriptors) ? t14.content_descriptors : []).slice(), function({ labels: t15, advisoryComponents: i14, advisoryComponentImages: a13 = [], headingsMetadata: r13 }) {
                                let s13 = oR(r13, "entity_name"), n11 = oR(r13, "rating_classification_number");
                                if (t15.length > 0 || i14.length > 0 || a13.length > 0 || s13 || n11)
                                  return {
                                    displayString: t15.toString(),
                                    advisoryComponents: i14,
                                    ...a13.length > 0 && { advisoryComponentImages: a13 },
                                    ...s13 && { primaryHeading: s13 },
                                    ...n11 && { secondaryHeading: n11 }
                                  };
                              }({ labels: s12, advisoryComponents: r12, advisoryComponentImages: a12, headingsMetadata: oD(t14) });
                            }(n10, i12), { contentAvailability: y2, availabilityDate: _2 } = oM(n10), b2 = function(t14) {
                              if ((0, l.V)(t14, "season_display_number") && (0, l.K)(t14.season_display_number) && t14.season_display_number !== "")
                                return t14.season_display_number;
                            }(n10), k2 = function(t14) {
                              if ((0, l.V)(t14, "episode") && (0, l.K)(t14.episode) && t14.episode !== "")
                                return t14.episode;
                            }(n10), C2 = function(t14, i13) {
                              let a12 = t14 !== undefined, r12 = i13 !== undefined;
                              if (!a12 && !r12)
                                return "titleOnly";
                              if (a12 && r12) {
                                let a13 = /^\d/.test(t14), r13 = oI(i13);
                                return a13 && r13 ? "seasonAndEpisode" : a13 && !r13 ? "seasonAndSpecialEpisode" : !a13 && r13 ? "specialSeasonAndEpisode" : "specialSeasonAndSpecialEpisode";
                              }
                              return a12 ? /^\d/.test(t14) ? "seasonOnly" : "specialSeasonOnly" : oI(i13) ? "episodeOnly" : "specialEpisodeOnly";
                            }(b2, k2), w2 = false;
                            return (0, l.V)(n10, "mature_blocked") && (0, l.H)(n10.mature_blocked) && n10.mature_blocked && (w2 = n10.mature_blocked), {
                              contentDuration: u2,
                              contentAvailability: y2,
                              matureBlocked: w2,
                              titleFormat: C2,
                              ...h2 && { seriesTitle: h2 },
                              ...c2 && { synopsis: c2 },
                              ...v2 && { rating: v2 },
                              ...m2 && { advisories: m2 },
                              ...g2 && { translationType: g2 },
                              ...p2 && { textLanguages: p2 },
                              ...f2 && { audioLanguages: f2 },
                              ..._2 && { availabilityDate: _2 },
                              ...b2 && { seasonDisplayString: b2 },
                              ...k2 && { episodeDisplayString: k2 }
                            };
                          }(a10, i11);
                      }
                      return { title: t12, contentType: r10, ...s10 };
                    }
                    throw new l.J("Invalid CMS data", l.et.METADATA_LOAD);
                  }(await this.apiServicesContainer.getContentMetadataService().getContentMetadata({ contentId: t10, locale: i10 }).catch((t11) => {
                    if (t11 instanceof l.Z) {
                      let i11 = this.mapHttpErrorToAvailability(t11);
                      if (i11)
                        throw i11;
                    }
                    if ((0, l.L)(t11)) {
                      let i11 = (0, l.R)(t11);
                      if (i11)
                        throw i11;
                    }
                    throw t11;
                  }), { useContentDescriptorsWithSymbol: this.featureFlags.useContentDescriptorsWithSymbol === true });
                }
                async getPlaybackSessionAndExtractData(t10, i10) {
                  let a10 = await this.deviceInfoProvider.getDeviceInfo(), r10 = this.apiServicesContainer.getPlaybackService(), s10 = this.appInfoProvider?.getPageInfo()?.tabId;
                  try {
                    let n10 = await r10.createPlaybackSession({
                      audioRole: i10?.prefersAudioDescription ? l.lt.AUDIO_DESCRIPTION : undefined,
                      contentId: t10,
                      device: a10.deviceType,
                      subDevice: a10.deviceSubType,
                      tabId: s10
                    });
                    return {
                      manifest: function(t11, i11, a11) {
                        if (!t11)
                          throw new l.J("Empty play data", l.et.MANIFEST_PARSE);
                        if ((0, l.W)(t11)) {
                          let r11, s11;
                          if ((0, l.V)(t11, "url") && (0, l.K)(t11.url)) {
                            let n11;
                            try {
                              r11 = new URL(t11.url);
                            } catch {
                              throw new l.J("Invalid manifest url", l.et.MANIFEST_LOAD);
                            }
                            let o10 = (0, l.V)(t11, "cdn") && (0, l.K)(t11.cdn) ? t11.cdn : "";
                            if ((0, l.V)(t11, "bifs") && (0, l.K)(t11.bifs))
                              try {
                                s11 = new URL(t11.bifs);
                              } catch (i12) {
                                l.Ft.warn(`convertPlayDataToManifest: Unable to convert data.bifs due to an error, got ${t11.bifs}. Assuming there are no bifs for this manifest since it does not impact playback. Error:`, i12);
                              }
                            let d2 = (n11 = [], (0, l.V)(t11, "annotations") && (0, l.G)(t11.annotations) && t11.annotations.forEach((t12) => {
                              let i12 = function(t13) {
                                if ((0, l.W)(t13) && (0, l.V)(t13, "id") && (0, l.K)(t13.id) && (0, l.V)(t13, "start") && (0, l.U)(t13.start) && (0, l.V)(t13, "end") && (0, l.U)(t13.end) && (0, l.V)(t13, "canSkip") && (0, l.H)(t13.canSkip) && (0, l.V)(t13, "type") && (0, l.K)(t13.type) && oS(t13.type) !== undefined)
                                  return {
                                    id: t13.id,
                                    start: t13.start,
                                    end: t13.end,
                                    canSkip: t13.canSkip,
                                    type: oS(t13.type),
                                    ...(0, l.V)(t13, "localizedLabel") && (0, l.K)(t13.localizedLabel) ? { localizedLabel: t13.localizedLabel } : {}
                                  };
                              }(t12);
                              i12 && n11.push(i12);
                            }), n11), u2 = function(t12, i12, a12) {
                              let r12 = [];
                              if ((0, l.V)(t12, "stitchedElements") && (0, l.G)(t12.stitchedElements) && t12.stitchedElements.length > 0 && t12.stitchedElements.forEach((t13) => {
                                let s13 = function(t14, i13, a13) {
                                  if ((0, l.W)(t14) && (0, l.V)(t14, "id") && (0, l.K)(t14.id) && (0, l.V)(t14, "type") && (0, l.K)(t14.type) && oE(t14.type) !== undefined && (0, l.V)(t14, "start") && (0, l.U)(t14.start) && (0, l.V)(t14, "end") && (0, l.U)(t14.end) && (0, l.V)(t14, "track") && (0, l.H)(t14.track) && (0, l.V)(t14, "timeline") && (0, l.H)(t14.timeline) && (0, l.V)(t14, "canSeek") && (0, l.H)(t14.canSeek) && (0, l.V)(t14, "textTracks") && (0, l.G)(t14.textTracks) && (0, l.V)(t14, "audioTracks") && (0, l.G)(t14.audioTracks)) {
                                    let r13 = [], s14 = [];
                                    return t14.textTracks.forEach((t15) => {
                                      let a14 = function(t16, i14) {
                                        if ((0, l.W)(t16) && (0, l.V)(t16, "role") && (0, l.K)(t16.role) && oA(t16.role) !== undefined && (0, l.V)(t16, "format") && (0, l.K)(t16.format) && oL(t16.format) !== undefined && (0, l.V)(t16, "language") && (0, l.K)(t16.language) && (0, l.V)(t16, "displayName") && (0, l.K)(t16.displayName))
                                          return {
                                            role: oA(t16.role),
                                            format: oL(t16.format),
                                            language: t16.language,
                                            displayName: i14.getTextTrackDisplayName(t16.language),
                                            ...(0, l.V)(t16, "videoUrl") && (0, l.K)(t16.videoUrl) ? { videoUrl: new URL(t16.videoUrl) } : {},
                                            ...(0, l.V)(t16, "externalTextUrl") && (0, l.K)(t16.externalTextUrl) ? { externalTextUrl: new URL(t16.externalTextUrl) } : {}
                                          };
                                      }(t15, i13);
                                      a14 && r13.push(a14);
                                    }), t14.audioTracks.forEach((t15) => {
                                      let r14 = function(t16, i14, a14) {
                                        if ((0, l.W)(t16) && (0, l.V)(t16, "role") && (0, l.K)(t16.role) && oT(t16.role) !== undefined && (0, l.V)(t16, "format") && (0, l.K)(t16.format) && oP(t16.format) !== undefined && (0, l.V)(t16, "codec") && (0, l.K)(t16.codec) && (0, l.V)(t16, "channelCount") && (0, l.U)(t16.channelCount) && (0, l.V)(t16, "language") && (0, l.K)(t16.language) && (0, l.V)(t16, "displayName") && (0, l.K)(t16.displayName)) {
                                          let r15 = !!((0, l.V)(t16, "premiumOnly") && (0, l.H)(t16.premiumOnly)) && t16.premiumOnly, s15 = a14?.subscriptionStatus === l.S.PREMIUM || !r15, n12 = oT(t16.role);
                                          return {
                                            role: n12,
                                            format: oP(t16.format),
                                            codec: t16.codec,
                                            channelCount: t16.channelCount,
                                            language: t16.language,
                                            displayName: i14.getAudioTrackDisplayName(t16.language, n12),
                                            ...(0, l.V)(t16, "url") && (0, l.K)(t16.url) ? { url: new URL(t16.url) } : {},
                                            ...(0, l.V)(t16, "original") && (0, l.H)(t16.original) ? { original: t16.original } : {},
                                            ...(0, l.V)(t16, "variant") && (0, l.K)(t16.variant) ? { variant: t16.variant } : {},
                                            canUse: s15
                                          };
                                        }
                                      }(t15, i13, a13);
                                      r14 && s14.push(r14);
                                    }), {
                                      id: t14.id,
                                      type: oE(t14.type),
                                      start: t14.start,
                                      end: t14.end,
                                      track: t14.track,
                                      timeline: t14.timeline,
                                      canSeek: t14.canSeek,
                                      textTracks: r13,
                                      audioTracks: s14,
                                      defaultTextTrack: i13.getDefaultTextTrack(r13, a13.prefersCaptions, a13.preferredTextLanguage),
                                      defaultAudioTrack: i13.getDefaultAudioTrack(s14, a13.prefersAudioDescription, a13.preferredAudioLanguage)
                                    };
                                  }
                                }(t13, i12, a12);
                                s13 && r12.push(s13);
                              }), r12.length === 0) {
                                var s12;
                                let n12, o11 = function(t13, i13) {
                                  let a13 = [];
                                  if ((0, l.W)(t13)) {
                                    let r13 = (0, l.V)(t13, "url") && (0, l.K)(t13.url) ? new URL(t13.url) : undefined;
                                    if (!r13)
                                      throw new l.J("Manifest is missing clean version url", l.et.MANIFEST_PARSE);
                                    if ((0, l.V)(t13, "captions") && (0, l.W)(t13.captions)) {
                                      let s13 = t13.captions;
                                      for (let t14 of Object.keys(s13)) {
                                        let n13 = (0, l.V)(s13[t14], "url") && (0, l.K)(s13[t14].url) ? new URL(s13[t14].url) : undefined, o12 = {
                                          role: l.x.CLOSED_CAPTION,
                                          format: l.b.EXTERNAL,
                                          language: t14,
                                          displayName: i13.getTextTrackDisplayName(t14),
                                          videoUrl: r13,
                                          ...n13 ? { externalTextUrl: n13 } : {}
                                        };
                                        a13.push(o12);
                                      }
                                    }
                                    if ((0, l.V)(t13, "subtitles") && (0, l.W)(t13.subtitles)) {
                                      let s13 = t13.subtitles;
                                      for (let t14 of Object.keys(s13)) {
                                        let n13 = {
                                          role: l.x.SUBTITLE,
                                          format: l.b.EXTERNAL,
                                          language: t14,
                                          displayName: i13.getTextTrackDisplayName(t14),
                                          videoUrl: r13,
                                          ...(0, l.V)(s13[t14], "url") && (0, l.K)(s13[t14].url) ? { externalTextUrl: new URL(s13[t14].url) } : {}
                                        };
                                        a13.push(n13);
                                      }
                                    }
                                    if (!a13.some((t14) => t14.language === "none"))
                                      a13.unshift({
                                        role: l.x.SUBTITLE,
                                        format: l.b.EXTERNAL,
                                        language: "none",
                                        displayName: i13.getTextTrackDisplayName("none"),
                                        videoUrl: r13
                                      });
                                  }
                                  return a13;
                                }(t12, i12), d3 = function(t13, i13, a13) {
                                  let r13 = [];
                                  if ((0, l.W)(t13) && (0, l.V)(t13, "versions") && (0, l.G)(t13.versions)) {
                                    let s13 = a13?.subscriptionStatus === l.S.PREMIUM;
                                    if (t13.versions.forEach((t14) => {
                                      ((0, l.V)(t14, "roles") && Array.isArray(t14.roles) ? t14.roles.map((t15) => oT(t15)).filter((t15) => t15 !== undefined) : [l.lt.MAIN]).forEach((a14) => {
                                        if ((0, l.V)(t14, "audio_locale") && (0, l.K)(t14.audio_locale) && (0, l.V)(t14, "guid") && (0, l.K)(t14.guid) && (0, l.V)(t14, "is_premium_only") && (0, l.H)(t14.is_premium_only) && (0, l.V)(t14, "original") && (0, l.H)(t14.original) && (0, l.V)(t14, "variant") && (0, l.K)(t14.variant)) {
                                          let n13 = oT(a14), o12 = {
                                            role: n13,
                                            format: l.ct.SEPARATE_MASTER,
                                            codec: "",
                                            channelCount: 2,
                                            language: t14.audio_locale,
                                            displayName: i13.getAudioTrackDisplayName(t14.audio_locale, n13),
                                            original: n13 === l.lt.MAIN,
                                            variant: t14.variant,
                                            canUse: s13 || !t14.is_premium_only,
                                            guid: t14.guid
                                          };
                                          r13.push(o12);
                                        }
                                      });
                                    }), r13.length === 0) {
                                      let a14 = (0, l.V)(t13, "audioLocale") && (0, l.K)(t13.audioLocale) ? t13.audioLocale : "ja-JP", s14 = {
                                        role: l.lt.MAIN,
                                        format: l.ct.EMBEDDED,
                                        codec: "",
                                        channelCount: 0,
                                        language: a14,
                                        displayName: i13.getAudioTrackDisplayName(a14, l.lt.MAIN),
                                        canUse: false
                                      };
                                      r13.push(s14);
                                    }
                                  }
                                  return r13;
                                }(t12, i12, a12), u3;
                                u3 = (0, l.V)(t12, "audioLocale") && (0, l.K)(t12.audioLocale) && t12.audioLocale !== "" ? (s12 = t12.audioLocale, n12 = !!((0, l.V)(t12, "audioRole") && (0, l.K)(t12.audioRole)) && oT(t12.audioRole) === l.lt.AUDIO_DESCRIPTION, d3.find((t13) => {
                                  let i13 = t13.role === l.lt.AUDIO_DESCRIPTION;
                                  return t13.language === s12 && n12 === i13;
                                })) : i12.getDefaultAudioTrack(d3, a12?.prefersAudioDescription || false, a12?.preferredAudioLanguage);
                                let c3 = {
                                  id: "0",
                                  type: l.C.MAIN,
                                  start: 0,
                                  end: 1 / 0,
                                  track: true,
                                  timeline: true,
                                  canSeek: true,
                                  textTracks: o11,
                                  audioTracks: d3,
                                  defaultTextTrack: i12.getDefaultTextTrack(o11, a12?.prefersCaptions || false, a12?.preferredTextLanguage),
                                  defaultAudioTrack: u3
                                };
                                r12.push(c3);
                              }
                              return r12;
                            }(t11, i11, a11), c2 = (0, l.V)(t11, "token") && (0, l.K)(t11.token) ? t11.token : "", h2 = (0, l.V)(t11, "audioRole") && (0, l.K)(t11.audioRole) ? oT(t11.audioRole) : undefined, p2 = function(t12) {
                              if (!t12)
                                throw new l.J("Empty play data", l.et.MANIFEST_PARSE);
                              if ((0, l.W)(t12)) {
                                if ((0, l.V)(t12, "playbackType") && (0, l.K)(t12.playbackType)) {
                                  var i12;
                                  let a12 = (i12 = t12.playbackType, { live: l.T.LIVE, on_demand: l.T.ON_DEMAND }[i12]);
                                  if (a12)
                                    return a12;
                                  throw new l.J("Invalid playback type", l.et.MANIFEST_PARSE);
                                }
                                throw new l.J("Missing playback type", l.et.MANIFEST_LOAD);
                              }
                              throw new l.J("Invalid play data", l.et.MANIFEST_LOAD);
                            }(t11);
                            return {
                              url: r11,
                              bifsUrl: s11,
                              playbackSessionToken: c2,
                              type: function(t12) {
                                let i12 = t12.toString();
                                if (i12.includes(".mpd"))
                                  return l.I.DASH;
                                if (i12.includes(".m3u8"))
                                  return l.I.HLS;
                                throw new l.J("[MediaResolver] [getManifestTypeFromUrl] Unknown manifest type. URL: " + i12, l.et.MANIFEST_PARSE);
                              }(new URL(t11.url)),
                              cdn: o10,
                              annotations: d2,
                              stitchedElements: u2,
                              audioRole: h2,
                              playbackType: p2
                            };
                          }
                          throw new l.J("Missing manifest url", l.et.MANIFEST_LOAD);
                        }
                        throw new l.J("Invalid manifest data", l.et.MANIFEST_LOAD);
                      }(n10, this.trackSelectionResolver, i10),
                      sessionConfig: function(t11) {
                        if (!t11)
                          throw new l.J("Empty play data", l.et.MANIFEST_PARSE);
                        if ((0, l.W)(t11)) {
                          if ((0, l.V)(t11, "session") && (0, l.W)(t11.session)) {
                            let i11 = function(t12) {
                              if ((0, l.V)(t12, "renewSeconds") && (0, l.U)(t12.renewSeconds) && (0, l.V)(t12, "noNetworkRetryIntervalSeconds") && (0, l.U)(t12.noNetworkRetryIntervalSeconds) && (0, l.V)(t12, "noNetworkTimeoutSeconds") && (0, l.U)(t12.noNetworkTimeoutSeconds) && (0, l.V)(t12, "maximumPauseSeconds") && (0, l.U)(t12.maximumPauseSeconds) && (0, l.V)(t12, "endOfVideoUnloadSeconds") && (0, l.U)(t12.endOfVideoUnloadSeconds) && (0, l.V)(t12, "sessionExpirationSeconds") && (0, l.U)(t12.sessionExpirationSeconds) && (0, l.V)(t12, "usesStreamLimits") && (0, l.H)(t12.usesStreamLimits) && (0, l.V)(t12, "noNetworkRetryCount") && (0, l.U)(t12.noNetworkRetryCount))
                                return {
                                  renewSeconds: t12.renewSeconds,
                                  noNetworkRetryIntervalSeconds: t12.noNetworkRetryIntervalSeconds,
                                  noNetworkTimeoutSeconds: t12.noNetworkTimeoutSeconds,
                                  maximumPauseSeconds: t12.maximumPauseSeconds,
                                  endOfVideoUnloadSeconds: t12.endOfVideoUnloadSeconds,
                                  sessionExpirationSeconds: t12.sessionExpirationSeconds,
                                  usesStreamLimits: t12.usesStreamLimits,
                                  noNetworkRetryCount: t12.noNetworkRetryCount
                                };
                            }(t11.session);
                            if (i11)
                              return i11;
                          }
                          throw new l.J("Invalid session data", l.et.MANIFEST_LOAD);
                        }
                        throw new l.J("Invalid play data", l.et.MANIFEST_LOAD);
                      }(n10)
                    };
                  } catch (i11) {
                    if (i11 instanceof l.Z) {
                      let t11 = this.mapHttpErrorToAvailability(i11);
                      if (t11)
                        throw t11;
                    }
                    if ((0, l.L)(i11)) {
                      let t11 = (0, l.R)(i11);
                      if (t11)
                        throw t11;
                    }
                    throw i11 instanceof l.Z || i11 instanceof l.J ? i11 : new l.J("Unknown manifest load error", l.et.MANIFEST_LOAD, { guid: t10, originalError: i11 });
                  }
                }
                async getSkipEvents(t10) {
                  try {
                    let i10 = await this.apiServicesContainer.getSkipEventsService().getSkipEvents({ contentId: t10 });
                    return Object.entries(i10).map(([t11, i11]) => {
                      if (!i11 || i11.start === null || i11.start === undefined || i11.end === null || i11.end === undefined)
                        return null;
                      let a10 = oS(t11);
                      return a10 === undefined ? null : oN(t11, { start: i11.start, end: i11.end }, a10);
                    }).filter((t11) => t11 !== null).sort((t11, i11) => t11.start - i11.start);
                  } catch (t11) {
                    return l.Ft.warn("Failed to fetch skip events:", t11), [];
                  }
                }
                async getDrms() {
                  return await this.apiServicesContainer.getPlaybackService().getDrms();
                }
                async getWatchHistory(t10, i10) {
                  let a10 = { resumePosition: 0 };
                  if (!i10 || i10.subscriptionStatus === l.S.ANONYMOUS)
                    return a10;
                  try {
                    let r10 = await this.apiServicesContainer.getPlayheadsService().getPlayhead({ contentId: t10, userId: i10.userId }), s10;
                    if ((0, l.V)(r10, "data") && (0, l.G)(r10.data)) {
                      let t11 = r10.data[0];
                      t11 && t11.fully_watched === false && (0, l.U)(t11.playhead) && !isNaN(t11.playhead) && (s10 = t11.playhead);
                    }
                    return { ...a10, resumePosition: s10 ?? 0 };
                  } catch (t11) {
                    return l.Ft.warn("Failed to fetch watch history:", t11), a10;
                  }
                }
                mapHttpErrorToAvailability(t10) {
                  let i10 = (0, l.R)({
                    status: t10.httpErrorCode,
                    message: t10.message,
                    ...t10.errorCode === undefined ? {} : { code: t10.errorCode },
                    ...typeof t10.requestId == "string" ? { requestId: t10.requestId } : {}
                  });
                  if (i10)
                    return i10;
                  let a10 = typeof t10.errorCode == "string" ? t10.errorCode.toUpperCase() : "";
                  return t10.httpErrorCode === 451 || a10.startsWith("GEO") ? new l.Q("This content is currently unavailable.", l.et.CONTENT_UNAVAILABLE, {
                    httpStatus: t10.httpErrorCode,
                    requestId: t10.requestId,
                    serviceCode: t10.errorCode
                  }) : null;
                }
                _getConsolidatedVideoModelError(t10, i10) {
                  let a10 = !t10.assetMetadata, r10 = !t10.manifest, s10, n10 = [];
                  for (let t11 of i10)
                    if (t11.status === "rejected") {
                      let i11;
                      i11 = t11.reason instanceof Error ? t11.reason : typeof t11.reason == "string" ? Error(t11.reason) : Error(String(t11.reason)), n10.push(i11), !s10 && i11 instanceof l.Q && (s10 = i11);
                    }
                  if (s10)
                    return new l.Q(s10.message, s10.code, { ...s10.errorDetails, partialVideoModel: t10 });
                  if (a10 && r10)
                    return new l.J("Video model is not playable, assetMetadata and manifest resolution failed.", l.et.MANIFEST_AND_METADATA_FAIL, {
                      partialVideoModel: t10,
                      errors: n10
                    });
                  let o10 = n10[0];
                  return o10 instanceof l.$ ? new l.J(o10.message, o10.code, { originalError: o10, partialVideoModel: t10 }) : new l.J(o10.message, l.et.UNKNOWN_RESOLUTION_ERROR, { originalError: o10, partialVideoModel: t10 });
                }
                async resolve(t10) {
                  if (!t10 || t10 === "")
                    throw new l.J("Loading empty guid", l.et.METADATA_LOAD);
                  try {
                    let i10 = await this.profileProvider.getUserProfile(), a10 = await Promise.allSettled([
                      this.getAssetMetadata(t10, i10?.uiLanguage),
                      this.getPlaybackSessionAndExtractData(t10, i10),
                      this.getDrms(),
                      this.getWatchHistory(t10, i10),
                      this.getSkipEvents(t10)
                    ]), [r10, s10, n10, o10, d2] = a10, u2 = r10.status === "fulfilled" ? r10.value : undefined, c2 = s10.status === "fulfilled" ? s10.value : undefined, h2 = n10.status === "fulfilled" ? n10.value : undefined, p2 = o10.status === "fulfilled" ? o10.value : undefined, f2 = d2.status === "fulfilled" ? d2.value : [], g2 = {
                      id: t10,
                      assetMetadata: u2,
                      manifest: c2 ? { ...c2.manifest, annotations: [...c2?.manifest?.annotations || [], ...f2] } : undefined,
                      drms: h2,
                      playerConfig: {},
                      watchHistory: p2,
                      sessionConfig: c2?.sessionConfig,
                      initialProfile: i10
                    };
                    if (g2.assetMetadata) {
                      let t11 = function(t12, i11) {
                        let a11 = t12.contentAvailability, r11 = i11?.subscriptionStatus === l.S.PREMIUM;
                        if (a11 !== undefined) {
                          if (t12.matureBlocked)
                            return new l.Q("This content is blocked due to the maturity content preference in the user profile.", l.et.MATURITY_RESTRICTION);
                          switch (a11) {
                            case l.st.COMING_SOON: {
                              let i12 = t12.availabilityDate;
                              return new l.Q(i12 ? `This content is coming soon. Available on ${i12}.` : "This content is coming soon.", l.et.CONTENT_COMING_SOON);
                            }
                            case l.st.PREMIUM_ONLY:
                              if (!r11)
                                return new l.Q("This content is only available for premium subscribers.", l.et.PREMIUM_RESTRICTION);
                              break;
                            case l.st.UNAVAILABLE:
                              return new l.Q("This content is currently unavailable.", l.et.CONTENT_UNAVAILABLE);
                            case l.st.AVAILABLE:
                          }
                        }
                      }(g2.assetMetadata, i10);
                      if (t11)
                        throw new l.Q(t11.message, t11.code, { ...t11.errorDetails, partialVideoModel: g2 });
                    }
                    if (!(0, l.l)(g2))
                      throw this._getConsolidatedVideoModelError(g2, a10);
                    return g2;
                  } catch (i10) {
                    if (l.Ft.error("Failed to resolve:", i10), i10 instanceof l.Z) {
                      let t11 = this.mapHttpErrorToAvailability(i10);
                      if (t11)
                        throw t11;
                    }
                    if ((0, l.L)(i10)) {
                      let t11 = (0, l.R)(i10);
                      if (t11)
                        throw t11;
                    }
                    throw i10 instanceof l.J || i10 instanceof l.Q || i10 instanceof l.Z ? i10 : i10 instanceof l.$ ? new l.J(i10.message, i10.code, i10.errorDetails) : new l.J("Failed to resolve media.", l.et.UNKNOWN_RESOLUTION_ERROR, { originalError: i10, partialVideoModel: { id: t10 } });
                  }
                }
              }, oO = {
                "en-US": "English",
                "id-ID": "Bahasa Indonesia",
                "ms-MY": "Bahasa Melayu",
                "ca-ES": "Català",
                "de-DE": "Deutsch",
                "es-419": "Español (América Latina)",
                "es-ES": "Español (España)",
                "fr-FR": "Français",
                "it-IT": "Italiano",
                "ko-KR": "한국어",
                "pl-PL": "Polski",
                "pt-BR": "Português (Brasil)",
                "pt-PT": "Português (Portugal)",
                "vi-VN": "Tiếng Việt",
                "tr-TR": "Türkçe",
                "ru-RU": "Русский",
                "ar-SA": "العربية",
                "hi-IN": "हिंदी",
                "ta-IN": "தமிழ்",
                "te-IN": "తెలుగు",
                "zh-CN": "中文 (简体)",
                "zh-HK": "中文 (繁體)",
                "th-TH": "ไทย"
              }, oV = {
                "en-US": "English",
                "en-IN": "English (India)",
                "id-ID": "Bahasa Indonesia",
                "ms-MY": "Bahasa Melayu",
                "ca-ES": "Català",
                "de-DE": "Deutsch",
                "es-419": "Español (América Latina)",
                "es-ES": "Español (España)",
                "fr-FR": "Français",
                "it-IT": "Italiano",
                "pl-PL": "Polski",
                "pt-BR": "Português (Brasil)",
                "pt-PT": "Português (Portugal)",
                "vi-VN": "Tiếng Việt",
                "tr-TR": "Türkçe",
                "ru-RU": "Русский",
                "ar-SA": "العربية",
                "hi-IN": "हिंदी",
                "ta-IN": "தமிழ்",
                "te-IN": "తెలుగు",
                "zh-CN": "中文 (普通话)",
                "zh-HK": "中文 (粵語)",
                "zh-TW": "中文 (國語)",
                "ko-KR": "한국어",
                "th-TH": "ไทย"
              }, oH = {
                default: ["en-US"],
                "ar-ME": ["ar-SA"],
                "ar-SA": ["ar-ME"],
                "ca-ES": ["es-ES", "es-419"],
                "es-419": ["es-LA", "es-ES"],
                "es-ES": ["es-419", "es-LA"],
                "es-LA": ["es-419", "es-ES"]
              };
              function oU(t10) {
                if (t10 == null)
                  return "";
                let i10 = t10.toLowerCase().replace(/[^a-z0-9]/, "-").split("");
                i10[2] !== "-" && i10.splice(2, 0, "-");
                let a10 = i10.reduce((t11, i11, a11) => t11 + (a11 > 2 ? i11.toUpperCase() : i11), "");
                return a10.match(/[a-z]{2}-[A-Z0-9]{2,}/) ? a10 : (l.Ft.warn(`bad locale passed: ${t10}`), "");
              }
              var oF = class t10 {
                static registerAvailableLanguages(i10) {
                  t10.availableLanguages = i10.map(oU);
                }
                static getContentLanguage(i10, a10) {
                  if (a10 && t10.registerAvailableLanguages(a10), !t10.availableLanguages)
                    throw Error("No available languages registered");
                  return t10.getContentLanguageForTarget(i10);
                }
                static getSanitizedFallbacksFor(t11) {
                  let i10;
                  return ((i10 = oH[String(t11)]) ? [...i10, ...oH.default] : oH.default).map(oU);
                }
                static getContentLanguageForTarget(i10) {
                  if (i10 === "")
                    return "";
                  let a10 = oU(i10), r10 = t10.getSanitizedFallbacksFor(a10);
                  for (let i11 of (r10.unshift(a10), r10))
                    if (t10.availableLanguages.includes(i11))
                      return i11;
                  return "";
                }
              }, o$ = class {
                constructor() {
                  this._timedTextLanguages = oO, this._audioLanguages = oV, this._timedTextPriorityMap = {}, this._audioPriorityMap = {}, this._initTimedTextPriorityMap(), this._initAudioPriorityMap();
                }
                _initTimedTextPriorityMap() {
                  this._timedTextPriorityMap = Object.keys(this._timedTextLanguages).reduce((t10, i10, a10) => (t10[i10] = a10, t10), {});
                }
                _initAudioPriorityMap() {
                  this._audioPriorityMap = Object.keys(this._audioLanguages).reduce((t10, i10, a10) => (t10[i10] = a10, t10), {});
                }
                updateSortingRulesFor(t10) {
                  let i10 = t10 === l.tt.PRODUCTION;
                  fetch(i10 ? "https://static.crunchyroll.com/config/i18n/v3/audio_languages.json" : "https://static.etp-staging.com/config/i18n/v3/audio_languages.json").then(async (t11) => (t11.ok && (this._audioLanguages = await t11.json(), this._initAudioPriorityMap()), this._audioLanguages)).catch((t11) => {
                    l.Ft.warn("Failed to fetch audio_languages.json", t11);
                  }), fetch(i10 ? "https://static.crunchyroll.com/config/i18n/v3/timed_text_languages.json" : "https://static.etp-staging.com/config/i18n/v3/timed_text_languages.json").then(async (t11) => {
                    if (t11.ok)
                      try {
                        this._timedTextLanguages = await t11.json(), this._initTimedTextPriorityMap();
                      } catch (t12) {
                        l.Ft.warn("Failed to parse timed_text_languages.json", t12);
                      }
                    return this._timedTextLanguages;
                  }).catch((t11) => {
                    l.Ft.warn("Failed to fetch timed_text_languages.json", t11);
                  });
                }
                getAvailableTextTracks(t10) {
                  let i10 = t10.manifest.stitchedElements.find((t11) => t11.type === l.C.MAIN);
                  if (!i10)
                    return [];
                  let a10 = i10.textTracks.filter((t11) => t11 && (t11.format === l.b.EXTERNAL || t11.role === l.x.CLOSED_CAPTION));
                  return a10.sort((t11, i11) => {
                    let a11 = t11.language === "none" ? 0 : t11.role === l.x.SUBTITLE ? 1 : t11.role === l.x.CLOSED_CAPTION ? 2 : 3, r10 = i11.language === "none" ? 0 : i11.role === l.x.SUBTITLE ? 1 : i11.role === l.x.CLOSED_CAPTION ? 2 : 3;
                    return a11 - r10;
                  });
                }
                getAvailableAudioTracks(t10) {
                  let i10 = t10.manifest.stitchedElements.find((t11) => t11.type === l.C.MAIN);
                  if (!i10)
                    return [];
                  let a10 = i10.audioTracks.filter((t11) => t11.format === l.ct.SEPARATE_MASTER);
                  return a10.length > 0 ? a10 : i10.defaultAudioTrack ? [i10.defaultAudioTrack] : [];
                }
                getTextTrackDisplayName(t10) {
                  let i10 = oU(t10);
                  return this._timedTextLanguages[i10] || t10;
                }
                getAudioTrackDisplayName(t10) {
                  let i10 = oU(t10);
                  return this._audioLanguages[i10] || t10;
                }
                getSortedTextTracks(t10) {
                  if (!t10 || t10.length === 0)
                    return [];
                  let i10 = t10.filter((t11) => this._timedTextPriorityMap[t11.language] !== undefined).map((t11) => {
                    let i11 = this._timedTextPriorityMap[t11.language];
                    return t11.role === l.x.CLOSED_CAPTION ? i11 += 0.5 : i11 += 0.9, { track: t11, priority: i11 };
                  });
                  return i10.sort((t11, i11) => t11.priority - i11.priority), i10.map(({ track: t11 }) => t11);
                }
                getSortedAudioTracks(t10) {
                  if (!t10 || t10.length === 0)
                    return [];
                  let i10 = t10.filter((t11) => this._audioPriorityMap[t11.language] !== undefined).map((t11) => {
                    let i11 = this._audioPriorityMap[t11.language];
                    return t11.role === l.lt.AUDIO_DESCRIPTION ? i11 += 0.5 : i11 += 0.9, { track: t11, priority: i11 };
                  });
                  return i10.sort((t11, i11) => t11.priority - i11.priority), i10.map(({ track: t11 }) => t11);
                }
                getDefaultTextTrack(t10, i10, a10) {
                  let r10 = t10.filter((t11) => this._timedTextPriorityMap[t11.language] !== undefined), s10 = [], n10 = [];
                  r10.forEach((t11) => {
                    t11.role === l.x.SUBTITLE ? s10.push(t11.language) : t11.role === l.x.CLOSED_CAPTION && n10.push(t11.language);
                  });
                  let o10 = oU(a10);
                  if (i10 && o10 && n10.indexOf(o10) > -1)
                    return r10.find((t11) => t11.language === o10 && t11.role === l.x.CLOSED_CAPTION);
                  if (s10.indexOf(o10) > -1)
                    return r10.find((t11) => t11.language === o10 && t11.role === l.x.SUBTITLE);
                  oF.registerAvailableLanguages(s10);
                  let d2 = "";
                  do
                    if ((d2 = oF.getContentLanguage(o10, s10)) && s10.indexOf(d2) > -1)
                      return r10.find((t11) => t11.language === d2 && t11.role === l.x.SUBTITLE);
                  while (d2 && d2 !== "");
                  if (!t10.some((t11) => t11.language === "none") && r10.length > 0)
                    return r10.find((t11) => t11.role === l.x.SUBTITLE) || r10[0];
                }
                getDefaultAudioTrack(t10, i10, a10) {
                  let r10 = t10.filter((t11) => this._audioPriorityMap[t11.language] !== undefined);
                  if (r10.length === 0)
                    return;
                  if (r10.length === 1)
                    return r10[0];
                  let s10 = oU(a10), n10 = r10.filter((t11) => t11.language === s10);
                  if (n10.length > 0) {
                    if (i10) {
                      let t12 = n10.findIndex((t13) => t13.role === l.lt.AUDIO_DESCRIPTION);
                      if (t12 > -1)
                        return n10[t12];
                    }
                    let t11 = n10.findIndex((t12) => t12.role === l.lt.MAIN || t12.role === l.lt.DUB);
                    if (t11 > -1)
                      return n10[t11];
                  }
                  oF.registerAvailableLanguages(r10.map((t11) => t11.language));
                  let o10 = "";
                  do
                    if (o10 = oF.getContentLanguage(s10, r10.map((t11) => t11.language))) {
                      if (i10) {
                        let t12 = r10.findIndex((t13) => t13.language === o10 && t13.role === l.lt.AUDIO_DESCRIPTION);
                        if (t12 > -1)
                          return r10[t12];
                      }
                      let t11 = r10.findIndex((t12) => t12.language === o10 && (t12.role === l.lt.DUB || t12.role === l.lt.MAIN));
                      if (t11 > -1)
                        return r10[t11];
                    }
                  while (o10 && o10 !== "");
                  return r10.length > 0 ? r10[0] : undefined;
                }
              }, oB = {
                staging: () => Promise.resolve().then(() => o4).then((t10) => t10.default),
                production: () => Promise.resolve().then(() => o3).then((t10) => t10.default),
                development: () => Promise.resolve().then(() => o0).then((t10) => t10.default)
              }, oq = class {
                constructor({
                  katamariPlayerName: t10,
                  katamariPlayerVersion: i10,
                  tokenProvider: a10,
                  profileProvider: r10,
                  deviceInfoProvider: s10,
                  appInfoProvider: n10
                }) {
                  this.appInfoProvider = n10, this.tokenProvider = a10, this.profileProvider = r10, this.deviceInfoProvider = s10, this.katamariPlayerName = t10, this.katamariPlayerVersion = i10;
                }
                async fetchTargetingParameters() {
                  let t10 = this.tokenProvider.getEnvironment(), [i10, a10] = await Promise.allSettled([this.deviceInfoProvider.getDeviceInfo(), this.profileProvider.getUserProfile()]);
                  return i10.status === "rejected" && l.Ft.error("ConfigResolver", "fetchTargetingParameters", `Failed to fetch device info: ${i10.reason}, falling back to default`), a10.status === "rejected" && l.Ft.error("ConfigResolver", "fetchTargetingParameters", `Failed to fetch user profile: ${a10.reason}, falling back to default`), {
                    katamariPlayerName: this.katamariPlayerName,
                    katamariPlayerVersion: this.katamariPlayerVersion,
                    environment: t10,
                    userProfile: a10.status === "fulfilled" ? a10.value : undefined,
                    deviceInfo: i10.status === "fulfilled" ? i10.value : undefined,
                    appInfo: this.appInfoProvider?.getAppInfo(),
                    pageInfo: this.appInfoProvider?.getPageInfo(),
                    viewershipAttribution: this.appInfoProvider?.getViewershipAttribution()
                  };
                }
                async resolve() {
                  let t10 = await this.fetchTargetingParameters(), i10 = t10.environment;
                  ["staging", "production", "development"].includes(i10) || (l.Ft.warn("ConfigResolver", "resolve", `Invalid environment "${i10}" provided. Defaulting to "production" as a fallback.`), i10 = "production");
                  let a10 = await oB[i10]();
                  if (t10.deviceInfo?.deviceType === l.at.CONSOLE || t10.deviceInfo?.deviceType === l.at.WEB && t10.deviceInfo?.deviceSubType === l.it.EDGE) {
                    let t11 = { mediaEngineConfig: { drm: { drms: [{ type: l.rt.PLAYREADY }, { type: l.rt.WIDEVINE, level: l.nt.L3 }] } } };
                    a10 = (0, l.B)(a10, t11);
                  } else if (t10.deviceInfo?.deviceType === l.at.WEB && t10.deviceInfo?.deviceSubType === l.it.SAFARI) {
                    let t11 = { mediaEngineConfig: { drm: { drms: [{ type: l.rt.FAIRPLAY }] } } };
                    a10 = (0, l.B)(a10, t11);
                  }
                  return a10.resiliencyConfig && (a10 = (0, l.B)(a10, { apiConfig: { default: { resiliencyConfig: a10.resiliencyConfig } } })), a10;
                }
              }, oK = {
                apiConfig: {
                  default: { baseUrl: "https://www.crunchyroll.com", resiliencyConfig: { maxRetries: 3, retryBackoffInterval: 1000 } },
                  auth: { errorCodePrefix: "AU" },
                  accounts: { errorCodePrefix: "AC" },
                  content: { errorCodePrefix: "CO" },
                  eec: { baseUrl: "https://qq.crunchyroll.com", errorCodePrefix: "EEC" },
                  license: { basePathname: "/license", errorCodePrefix: "PBSL" },
                  playback: { basePathname: "/playback", errorCodePrefix: "PBSP" },
                  skipEvents: { baseUrl: "https://static.crunchyroll.com", basePathname: "/skip-events/production", errorCodePrefix: "SKIP" },
                  i18n: { baseUrl: "https://static.crunchyroll.com", basePathname: "/i18n/cr-web-video-player", errorCodePrefix: "I18N" },
                  subscriptions: { errorCodePrefix: "SUBS" },
                  remoteConfig: { baseUrl: "https://www.crunchyroll.com/device-capabilities/config" },
                  imgSrv: { baseUrl: "https://imgsrv.crunchyroll.com" }
                },
                mediaEngineConfig: { mediaEngineType: "bitmovin", drm: { drms: [{ type: "widevine", level: "l3" }] } },
                featureFlags: { remoteConfigResolver: false, useContentDescriptorsWithSymbol: true },
                experiments: { activeExperiments: {} },
                resiliencyConfig: { methods: ["GET"], maxRetries: 3, retryBackoffInterval: 1000 },
                plugins: {}
              }, oZ = {
                default: {},
                chrome: {},
                safari: { mediaEngineConfig: { drm: { drms: [{ type: "fairPlay" }] } } },
                firefox: {},
                edge: { mediaEngineConfig: { drm: { drms: [{ type: "playReady" }, { type: "widevine", level: "l3" }] } } }
              }, oz = { default: { mediaEngineConfig: { drm: { drms: [{ type: "playReady" }, { type: "widevine", level: "l3" }] } } } }, oG = { default: {}, sony: {} }, oW = {}, oJ = {}, oY = class {
                constructor(t10, i10) {
                  this.initTargetingParameters = async () => {
                    let t11 = this._tokenProvider.getEnvironment(), i11 = await this._deviceInfoProvider.getDeviceInfo();
                    this.configTargetingParameters = {
                      environment: t11,
                      deviceType: i11.deviceType,
                      deviceSubType: i11.deviceSubType,
                      brand: i11.make,
                      os: i11.operatingSystem
                    };
                  }, this._deviceInfoProvider = t10, this._tokenProvider = i10, this.configTargetingParameters = { brand: "", deviceSubType: "", deviceType: "", environment: "", os: "" };
                }
                async resolve() {
                  await this.initTargetingParameters();
                  let t10 = [];
                  return t10.push(await this.getEnvironmentConfig()), t10.push(this.getDeviceTypeConfig()), t10.push(this.getDeviceSubTypeConfig()), t10.push(this.getOsConfig()), (0, l.z)(t10);
                }
                async getEnvironmentConfig() {
                  let t10 = this.configTargetingParameters.environment;
                  if (t10 === l.tt.DEVELOPMENT)
                    try {
                      return (await a.e(535).then(a.bind(a, 40535))).default;
                    } catch (t11) {
                      l.Ft.warn("Failed to load development config, falling back to production config:", t11);
                    }
                  else if (t10 === l.tt.STAGING)
                    try {
                      return (await a.e(7596).then(a.bind(a, 57596))).default;
                    } catch (t11) {
                      l.Ft.warn("Failed to load staging config, falling back to production config:", t11);
                    }
                  return oK;
                }
                getDeviceSubTypeConfig() {
                  let t10 = this.configTargetingParameters.deviceType, i10 = this.configTargetingParameters.deviceSubType, a10 = this.configTargetingParameters.brand.toLocaleLowerCase();
                  switch (t10) {
                    case l.at.WEB:
                      return i10 in oZ ? oZ[i10] : {};
                    case l.at.CONSOLE:
                      return i10 in oz ? oz[i10] : {};
                    case l.at.TV:
                      return a10 in oG ? oG[a10] : {};
                    default:
                      return {};
                  }
                }
                getDeviceTypeConfig() {
                  switch (this.configTargetingParameters.deviceType) {
                    case l.at.WEB:
                      return "default" in oZ ? oZ.default : {};
                    case l.at.CONSOLE:
                      return "default" in oz ? oz.default : {};
                    case l.at.TV:
                      return "default" in oG ? oG.default : {};
                    default:
                      return {};
                  }
                }
                getOsConfig() {
                  let t10 = this.configTargetingParameters.os.toLocaleLowerCase();
                  return t10.includes("windows") ? oW : t10.includes("macos") ? oJ : {};
                }
              }, oQ = class {
                constructor(t10, i10, a10, r10, s10) {
                  this._remoteConfigUrl = "", this._katamariPlayerName = t10, this._katamariPlayerVersion = i10, this._profileProvider = a10, this._deviceInfoProvider = r10, this._authHttpEngine = s10;
                }
                setUrls(t10) {
                  this._remoteConfigUrl = t10.baseUrl ?? "";
                }
                async resolve() {
                  try {
                    if (!this._remoteConfigUrl)
                      throw Error("RemoteConfigResolver: Remote config URL is not set.");
                    let t10 = await this._profileProvider.getUserProfile(), i10 = await this._deviceInfoProvider.getDeviceInfo(), a10 = {
                      playerName: this._katamariPlayerName,
                      playerVersion: this._katamariPlayerVersion,
                      browser: i10.browser,
                      browserVersion: i10.browserVersion,
                      deviceType: i10.deviceType,
                      deviceSubType: i10.deviceSubType,
                      deviceId: i10.deviceId,
                      deviceBrand: i10.make,
                      deviceModel: i10.model,
                      os: i10.operatingSystem,
                      osVersion: i10.operatingSystemVersion,
                      country: t10.country,
                      userId: t10.userId,
                      profileId: t10.profileId
                    };
                    return await this._authHttpEngine.request(this._remoteConfigUrl, {
                      headers: new Headers({ "Content-Type": "application/json" }),
                      method: "POST",
                      includeAuth: true,
                      body: JSON.stringify(a10)
                    });
                  } catch (t10) {
                    return l.Ft.error("Fetching remote config failed:", t10), {};
                  }
                }
              }, oX = class {
                constructor(t10, i10, a10, r10, s10, n10) {
                  this._isDeveloperConfigEnabled = false, this._remoteConfigResolver = new oQ(t10, i10, a10, r10, n10), this._defaultConfigResolver = new oY(r10, s10), this._isDeveloperConfigEnabled = s10.getEnvironment() !== l.tt.PRODUCTION;
                }
                async resolve() {
                  let t10 = await this._defaultConfigResolver.resolve(), i10 = {};
                  t10.featureFlags.remoteConfigResolver === true && t10.apiConfig.remoteConfig && (this._remoteConfigResolver.setUrls(t10.apiConfig.remoteConfig), i10 = await this._remoteConfigResolver.resolve());
                  let r10 = (0, l.B)(t10, i10);
                  if (this._isDeveloperConfigEnabled)
                    try {
                      let t11 = await a.e(2364).then(a.bind(a, 12364));
                      r10 = (0, l.B)(r10, t11.default);
                    } catch (t11) {
                      l.Ft.warn("Failed to load developer config:", t11);
                    }
                  return r10;
                }
              }, o0 = b({ config: () => o1, default: () => o1 }), o1 = {
                apiConfig: {
                  default: { baseUrl: "https://dev.crunchyroll.com", resiliencyConfig: { maxRetries: 3, retryBackoffInterval: 1000 } },
                  auth: { errorCodePrefix: "AU" },
                  accounts: { errorCodePrefix: "AC" },
                  content: { errorCodePrefix: "CO" },
                  eec: { baseUrl: "https://cr-eec.etp-proto0.com", errorCodePrefix: "EEC" },
                  license: { basePathname: "/license", errorCodePrefix: "PBSL" },
                  playback: { basePathname: "/playback", errorCodePrefix: "PBSP" },
                  skipEvents: { baseUrl: "https://stage-static.crunchyroll.com", basePathname: "/skip-events/staging", errorCodePrefix: "SKIP" },
                  i18n: { baseUrl: "https://stage-static.crunchyroll.com", basePathname: "/i18n/cr-web-video-player", errorCodePrefix: "I18N" },
                  subscriptions: { errorCodePrefix: "SUBS" },
                  remoteConfig: { baseUrl: "https://dev.crunchyroll.com/device-capabilities/config" },
                  imgSrv: { baseUrl: "https://imgsrv.stage.crunchyroll.com" }
                },
                mediaEngineConfig: { mediaEngineType: l.k.BITMOVIN, drm: { drms: [{ type: l.rt.WIDEVINE, level: l.nt.L3 }] } },
                experiments: { activeExperiments: {} },
                featureFlags: { remoteConfigResolver: true, useContentDescriptorsWithSymbol: true },
                resiliencyConfig: { methods: ["GET"], maxRetries: 3, retryBackoffInterval: 1000 }
              }, o4 = b({ config: () => o2, default: () => o2 }), o2 = {
                apiConfig: {
                  default: { baseUrl: "https://stage.crunchyroll.com", resiliencyConfig: { maxRetries: 3, retryBackoffInterval: 1000 } },
                  auth: { errorCodePrefix: "AU" },
                  accounts: { errorCodePrefix: "AC" },
                  content: { errorCodePrefix: "CO" },
                  eec: { baseUrl: "https://qq.stage.crunchyroll.com", errorCodePrefix: "EEC" },
                  license: { basePathname: "/license", errorCodePrefix: "PBSL" },
                  playback: { basePathname: "/playback", errorCodePrefix: "PBSP" },
                  skipEvents: { baseUrl: "https://static.etp-staging.com", basePathname: "/crunchyroll/skip-events/staging", errorCodePrefix: "SKIP" },
                  i18n: { baseUrl: "https://static.etp-staging.com", basePathname: "/i18n/cr-web-video-player", errorCodePrefix: "I18N" },
                  subscriptions: { errorCodePrefix: "SUBS" },
                  remoteConfig: { baseUrl: "https://stage.crunchyroll.com/device-capabilities/config" },
                  imgSrv: { baseUrl: "https://imgsrv.stage.crunchyroll.com" }
                },
                mediaEngineConfig: { mediaEngineType: l.k.BITMOVIN, drm: { drms: [{ type: l.rt.WIDEVINE, level: l.nt.L3 }] } },
                featureFlags: { remoteConfigResolver: true, useContentDescriptorsWithSymbol: true },
                experiments: { activeExperiments: {} },
                resiliencyConfig: { methods: ["GET"], maxRetries: 3, retryBackoffInterval: 1000 }
              }, o3 = b({ config: () => o5, default: () => o5 }), o5 = {
                apiConfig: {
                  default: { baseUrl: "https://www.crunchyroll.com", resiliencyConfig: { maxRetries: 3, retryBackoffInterval: 1000 } },
                  auth: { errorCodePrefix: "AU" },
                  accounts: { errorCodePrefix: "AC" },
                  content: { errorCodePrefix: "CO" },
                  eec: { baseUrl: "https://qq.crunchyroll.com", errorCodePrefix: "EEC" },
                  license: { basePathname: "/license", errorCodePrefix: "PBSL" },
                  playback: { basePathname: "/playback", errorCodePrefix: "PBSP" },
                  skipEvents: { baseUrl: "https://static.crunchyroll.com", basePathname: "/skip-events/production", errorCodePrefix: "SKIP" },
                  i18n: { baseUrl: "https://static.crunchyroll.com", basePathname: "/i18n/cr-web-video-player", errorCodePrefix: "I18N" },
                  subscriptions: { errorCodePrefix: "SUBS" },
                  remoteConfig: { baseUrl: "https://www.crunchyroll.com/device-capabilities/config" },
                  imgSrv: { baseUrl: "https://imgsrv.crunchyroll.com" }
                },
                mediaEngineConfig: { mediaEngineType: l.k.BITMOVIN, drm: { drms: [{ type: l.rt.WIDEVINE, level: l.nt.L3 }] } },
                featureFlags: { remoteConfigResolver: false, useContentDescriptorsWithSymbol: true },
                experiments: { activeExperiments: {} },
                resiliencyConfig: { methods: ["GET"], maxRetries: 3, retryBackoffInterval: 1000 },
                plugins: {}
              };
              l.k.SHAKA;
              var o6 = (t10) => {
                let i10 = new Uint8Array(t10), a10 = "";
                for (let t11 = 0;t11 < i10.byteLength; t11 += 1)
                  a10 += String.fromCharCode(i10[t11]);
                return `data:image/jpeg;base64,${btoa(a10)}`;
              }, o7 = (t10, i10, a10) => {
                let r10 = 0;
                for (let s10 = a10 - 1;s10 >= i10; --s10) {
                  let i11 = t10[s10];
                  i11 !== undefined && (r10 = 256 * r10 + i11);
                }
                return r10;
              }, o8 = class {
                static async resolve(t10) {
                  let i10 = [], a10 = [];
                  try {
                    i10 = function(t11) {
                      let i11 = new Uint8Array(t11), a11 = [137, 66, 73, 70, 13, 10, 26, 10];
                      for (let t12 = 0;t12 < a11.length; t12 += 1)
                        if (i11[t12] !== a11[t12])
                          return [];
                      if (o7(i11, 8, 12) !== 0)
                        return [];
                      let r10 = o7(i11, 16, 20);
                      r10 === 0 && (r10 = 1000);
                      let s10 = [], n10;
                      for (let t12 = 64;; t12 += 8) {
                        let a12 = o7(i11, t12, t12 + 4), r11 = o7(i11, t12 + 4, t12 + 8);
                        if (a12 === 0 && r11 === 0)
                          break;
                        if (a12 === 4294967295) {
                          n10 && (n10.end = r11);
                          break;
                        }
                        let o11 = { timestamp: a12, start: r11 };
                        n10 && (n10.end = r11), s10.push(o11), n10 = o11;
                      }
                      let o10 = [];
                      for (let i12 = 0;i12 < s10.length; i12 += 1) {
                        let a12 = s10[i12], n11 = a12.timestamp ?? 0, l2 = t11.slice(a12.start ?? 0, a12.end);
                        o10.push({ seconds: n11 * r10 / 1000, data: o6(l2) });
                      }
                      return o10;
                    }(await fetch(t10).then((i11) => {
                      if (!i11.ok)
                        throw new l.Z(`Failed to fetch BIF file: ${i11.status} ${i11.statusText}`, l.et.NETWORK_ERROR, {
                          url: t10,
                          status: i11.status,
                          statusText: i11.statusText
                        });
                      return i11.arrayBuffer();
                    }));
                  } catch (i11) {
                    l.Ft.warn(`BifResolver: Error fetching BIF images from URL: ${t10}. Assuming no BIFs found.`, i11), a10.push(i11 instanceof Error ? i11 : Error(String(i11)));
                  }
                  return { images: i10, errors: a10 };
                }
              }, o9 = class t10 {
                setApiConfig(t11) {
                  this._baseUrl = t11.baseUrl;
                }
                resolve(i10, a10) {
                  if (!this._baseUrl) {
                    l.Ft.warn("PosterResolver: imgSrv base URL is not configured. Call setApiConfig first.");
                    return;
                  }
                  return t10.buildCdnUrl(this._baseUrl, i10, a10);
                }
                static buildCdnUrl(t11, i10, a10) {
                  let { width: r10, height: s10, ...n10 } = a10;
                  return `${t11}/cdn-cgi/image/${Object.entries({ width: r10, height: s10, format: "jpeg", fit: "cover", quality: 85, ...n10 }).filter(([, t12]) => t12 !== undefined).map(([t12, i11]) => `${t12}=${i11}`).join(",")}/content/l/${i10}`;
                }
              }, le = class {
                constructor(t10, i10) {
                  this._katamariPlayerName = "desktop", this._katamariPlayerVersion = "0.22.0", this.currentLogLevel = l.Pt.NONE, this._tokenProvider = t10.tokenProvider, this._profileProvider = t10.profileProvider, this._deviceInfoProvider = t10.deviceInfoProvider, this._appInfoProvider = t10.appInfoProvider, this._localStorageProvider = t10.localStorageProvider, this._nextEpisodeProvider = t10.nextEpisodeProvider;
                  let a10 = new l.t(this._tokenProvider);
                  this._apiServicesContainer = new oe({ httpEngine: a10 }), this._trackSelectionResolver = new o$, this._mediaResolver = new oj(this._profileProvider, this._deviceInfoProvider, this._apiServicesContainer, this._trackSelectionResolver, this._appInfoProvider), this._bifResolver = o8, this._posterResolver = new o9, i10?.useConfigResolverV2 === true ? this._configResolver = new oX(this._katamariPlayerName, this._katamariPlayerVersion, this._profileProvider, this._deviceInfoProvider, this._tokenProvider, a10) : this._configResolver = new oq({
                    katamariPlayerName: this._katamariPlayerName,
                    katamariPlayerVersion: this._katamariPlayerVersion,
                    tokenProvider: this._tokenProvider,
                    profileProvider: this._profileProvider,
                    deviceInfoProvider: this._deviceInfoProvider,
                    appInfoProvider: this._appInfoProvider
                  });
                }
                setLogLevel(t10) {
                  l.Ft.setLogLevel(t10), this.currentLogLevel = t10;
                }
                async build(t10, i10) {
                  l.Ft.setLogLevel(this.currentLogLevel);
                  let r10 = await this._configResolver.resolve();
                  r10.mediaEngineConfig = { ...r10.mediaEngineConfig || {}, mediaEngineType: l.k.SHAKA };
                  let s10 = r10.mediaEngineConfig.mediaEngineType;
                  this._mediaResolver.setFeatureFlags(r10.featureFlags), this._apiServicesContainer.provideApiConfig(r10), this._posterResolver.setApiConfig(r10.apiConfig.imgSrv);
                  let n10 = [], o10 = (await this._profileProvider.getUserProfile()).captionStyling, { mediaEngineLayer: d2, controlsLayer: u2 } = this._createPlayerLayers(t10), c2 = s10 === l.k.SHAKA ? await a.e(SHAKA_E).then(a.bind(a, SHAKA_B)).then(({ ShakaMediaEngine: t11 }) => new t11(d2, this._tokenProvider)) : await a.e(BIT_E).then(a.bind(a, BIT_B)).then(({ BitmovinMediaEngine: t11 }) => {
                    let i11 = new t11(d2, this._tokenProvider);
                    return n10.push(i11.textTrackRenderer), i11;
                  });
                  return o10 !== undefined && n10.forEach((t11) => t11.setCustomStyling(o10)), Promise.resolve(new ow({
                    rootView: t10,
                    uiRootView: u2,
                    mediaEngine: c2,
                    mediaResolver: this._mediaResolver,
                    bifResolver: this._bifResolver,
                    trackSelectionResolver: this._trackSelectionResolver,
                    profileProvider: this._profileProvider,
                    localStorageProvider: this._localStorageProvider,
                    apiServicesContainer: this._apiServicesContainer,
                    appInfoProvider: this._appInfoProvider,
                    deviceInfoProvider: this._deviceInfoProvider,
                    textTrackRenderers: n10,
                    posterResolver: this._posterResolver,
                    playerConfig: r10,
                    nextEpisodeProvider: this._nextEpisodeProvider,
                    keyboardShortcutBackstop: i10?.keyboardShortcutBackstop
                  }));
                }
                _createPlayerLayers(t10) {
                  let i10 = (t11) => {
                    let i11 = document.createElement("div");
                    return i11.style = "width: 100%; height: 100%; position: absolute; top: 0; left: 0;", t11.appendChild(i11), i11;
                  };
                  return { mediaEngineLayer: i10(t10), controlsLayer: i10(t10) };
                }
              };
            };
          }(shakaE, shakaB, bitE, bitB, importIds);
        }
      }
    } catch (err) {
      console.error("[CrOptix] Katamari Patch failed:", err);
    }
  }
  let chunk_array = window.webpackChunk_N_E;
  if (!chunk_array) {
    chunk_array = window.webpackChunk_N_E = [];
  }
  if (Array.isArray(chunk_array)) {
    chunk_array.forEach((chunk) => {
      if (Array.isArray(chunk) && chunk.length >= 2) {
        patch_webpack_chunk(chunk);
      }
    });
  }
  let is_patching = false;
  let current_push = Array.prototype.push;
  Object.defineProperty(chunk_array, "push", {
    configurable: true,
    get() {
      return function(...args) {
        if (is_patching) {
          return Array.prototype.push.apply(this, args);
        }
        is_patching = true;
        try {
          for (const chunk_data of args) {
            patch_webpack_chunk(chunk_data);
          }
          return current_push.apply(this, args);
        } finally {
          is_patching = false;
        }
      };
    },
    set(new_push) {
      current_push = new_push;
    }
  });
})();
