/**
 * Crunchyroll Enhancer - CrOptix
 * Anime Release Calendar & Dynamic Watchlist Association Engine
 */

(() => {
  if (window.top !== window) return;

  const ext = typeof browser !== "undefined" ? browser : chrome;

  const ICONS = {
    calendar: `<svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm-7-9h5v5h-5z"/></svg>`,
    starFilled: `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    close: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
    play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
    edit: `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
    trash: `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`
  };

  const DAY_NAMES = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const DAY_NAMES_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  // Helper: Normalize string for comparison
  function normalizeTitle(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  // Extract base title
  function getBaseTitle(str) {
    if (!str) return "";
    return str.split(/[-–—:]/)[0].trim();
  }

  // State
  let state = {
    isOpen: false,
    isManagerOpen: false,
    currentWeekOffset: 0,
    selectedDayIndex: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
    activeTab: "watchlist",
    subView: "all_shows", // "all_shows" | "days"
    searchQuery: "",
    watchlistIds: new Set(),
    watchlistTitles: new Set(),
    watchlistSlugs: new Set(),
    watchlistItems: [],
    scheduleData: {},
    isLoading: false,
    isSyncingWatchlist: false,
    error: null
  };

  // Clean old/corrupted storage keys from previous versions
  async function cleanupLegacyStorage() {
    try {
      if (ext && ext.storage && ext.storage.local) {
        await ext.storage.local.remove([
          "croptix_v4_watchlist_ids",
          "croptix_v4_watchlist_titles",
          "croptix_v4_watchlist_slugs",
          "croptix_v4_watchlist_items",
          "croptix_watchlist_ids",
          "croptix_watchlist_titles",
          "croptix_watchlist_items"
        ]);
      }
    } catch (_) {}
  }

  // Load saved watchlist from storage
  async function loadWatchlist() {
    try {
      const res = await ext.storage.local.get([
        "croptix_v5_watchlist_ids",
        "croptix_v5_watchlist_titles",
        "croptix_v5_watchlist_slugs",
        "croptix_v5_watchlist_items"
      ]);
      if (res && Array.isArray(res.croptix_v5_watchlist_items)) {
        state.watchlistItems = res.croptix_v5_watchlist_items;
        state.watchlistIds = new Set(res.croptix_v5_watchlist_ids || []);
        state.watchlistTitles = new Set(res.croptix_v5_watchlist_titles || []);
        state.watchlistSlugs = new Set(res.croptix_v5_watchlist_slugs || []);
      }
    } catch (e) {
      const local = localStorage.getItem("croptix_v5_watchlist_items");
      if (local) {
        try { state.watchlistItems = JSON.parse(local); } catch (_) {}
      }
    }
    rebuildSets();
  }

  // Save watchlist
  async function saveWatchlist() {
    rebuildSets();
    const idsArr = Array.from(state.watchlistIds);
    const titlesArr = Array.from(state.watchlistTitles);
    const slugsArr = Array.from(state.watchlistSlugs);
    try {
      await ext.storage.local.set({
        croptix_v5_watchlist_ids: idsArr,
        croptix_v5_watchlist_titles: titlesArr,
        croptix_v5_watchlist_slugs: slugsArr,
        croptix_v5_watchlist_items: state.watchlistItems
      });
    } catch (e) {
      localStorage.setItem("croptix_v5_watchlist_ids", JSON.stringify(idsArr));
      localStorage.setItem("croptix_v5_watchlist_titles", JSON.stringify(titlesArr));
      localStorage.setItem("croptix_v5_watchlist_slugs", JSON.stringify(slugsArr));
      localStorage.setItem("croptix_v5_watchlist_items", JSON.stringify(state.watchlistItems));
    }
  }

  function rebuildSets() {
    state.watchlistIds = new Set();
    state.watchlistTitles = new Set();
    state.watchlistSlugs = new Set();

    for (const item of state.watchlistItems) {
      if (item.id) state.watchlistIds.add(String(item.id).toUpperCase());
      if (item.slug) state.watchlistSlugs.add(String(item.slug).toLowerCase());
      if (item.title) {
        const norm = normalizeTitle(item.title);
        if (norm) state.watchlistTitles.add(norm);
        const base = normalizeTitle(getBaseTitle(item.title));
        if (base && base.length >= 4) state.watchlistTitles.add(base);
      }
    }
  }

  // Set items from API or DOM
  function setWatchlistItems(items, replace = false) {
    if (!Array.isArray(items) || items.length === 0) return;

    if (replace) {
      state.watchlistItems = items;
    } else {
      for (const entry of items) {
        const id = String(entry.id || "").toUpperCase();
        const title = String(entry.title || "").trim();
        const existingIdx = state.watchlistItems.findIndex(
          it => (id && it.id === id) || (title && it.title === title)
        );
        if (existingIdx >= 0) {
          state.watchlistItems[existingIdx] = { ...state.watchlistItems[existingIdx], ...entry };
        } else {
          state.watchlistItems.push(entry);
        }
      }
    }

    saveWatchlist();
    if (state.isOpen) {
      renderCalendarUI();
    }
  }

  // Trigger dynamic watchlist fetch from Crunchyroll API
  function syncWatchlistFromCrunchyroll() {
    state.isSyncingWatchlist = true;
    window.postMessage({ type: "CROPTIX_REQUEST_WATCHLIST" }, "*");

    if (window.location.pathname.includes("/watchlist") || window.location.pathname.includes("/crunchylists")) {
      scanCurrentWatchlistDOM();
    }

    setTimeout(() => {
      state.isSyncingWatchlist = false;
      renderCalendarUI();
    }, 1500);
  }

  // Scan current active DOM ONLY if on /watchlist or /crunchylists
  function scanCurrentWatchlistDOM() {
    if (!window.location.pathname.includes("/watchlist") && !window.location.pathname.includes("/crunchylists")) {
      return;
    }

    const cards = document.querySelectorAll(
      ".watchlist-card, .erc-watchlist-item, [data-t='watchlist-card'], .playable-card--GnRbX, .browse-card--esJdT"
    );

    const scraped = [];
    cards.forEach(card => {
      const titleElem = card.querySelector(
        "h4, h3, h2, .playable-card__title, .browse-card__title, .title, [data-t='watchlist-card-title']"
      );
      const title = titleElem ? titleElem.textContent.trim() : "";
      const linkElem = card.querySelector("a[href*='/series/'], a[href*='/watch/']");
      const link = linkElem ? linkElem.href : "";
      const imgElem = card.querySelector("img");
      const image = imgElem ? (imgElem.src || imgElem.dataset.src || "") : "";

      const idMatch = link.match(/series\/([a-z0-9]+)/i);
      const slugMatch = link.match(/series\/[a-z0-9]+\/([a-z0-9\-]+)/i);

      const id = idMatch ? idMatch[1] : "";
      const slug = slugMatch ? slugMatch[1] : "";

      const progressElem = card.querySelector(".playable-card__sub-title, .playable-card__playback-progress");
      const lastWatched = progressElem ? progressElem.textContent.trim() : "Na Watchlist";

      if (title || id) {
        scraped.push({
          id: String(id || "").toUpperCase(),
          title: String(title || "").trim(),
          slug: String(slug || "").toLowerCase().trim(),
          image,
          lastWatched,
          url: id ? `https://www.crunchyroll.com/series/${id}/${slug}` : `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`
        });
      }
    });

    if (scraped.length > 0) {
      setWatchlistItems(scraped, true);
    }
  }

  // Check if an anime matches the user's Watchlist
  function isAnimeInWatchlist(media) {
    if (!media) return false;

    // 1. Match series ID in external links
    if (media.externalLinks && Array.isArray(media.externalLinks)) {
      for (const link of media.externalLinks) {
        const idMatch = link.url?.match(/series\/([a-z0-9]+)/i);
        if (idMatch && idMatch[1] && state.watchlistIds.has(idMatch[1].toUpperCase())) return true;
        const slugMatch = link.url?.match(/series\/[a-z0-9]+\/([a-z0-9\-]+)/i);
        if (slugMatch && slugMatch[1] && state.watchlistSlugs.has(slugMatch[1].toLowerCase())) return true;
      }
    }

    // 2. Exact Title Matches
    const titlesToCheck = [
      media.title?.userPreferred,
      media.title?.english,
      media.title?.romaji,
      media.title?.native,
      ...(Array.isArray(media.synonyms) ? media.synonyms : [])
    ].filter(Boolean);

    for (const raw of titlesToCheck) {
      const norm = normalizeTitle(raw);
      if (norm && state.watchlistTitles.has(norm)) return true;

      for (const w of state.watchlistTitles) {
        if (w.length >= 5 && (norm.startsWith(w) || norm.includes(w))) return true;
        if (norm.length >= 5 && (w.startsWith(norm) || w.includes(norm))) return true;
      }
    }

    return false;
  }

  // Helper: Get Monday of a week with offset
  function getMonday(offsetWeeks = 0) {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + offsetWeeks * 7;
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  // Helper: Get week start and end timestamps
  function getWeekBounds(offsetWeeks = 0) {
    const monday = getMonday(offsetWeeks);
    const startSec = Math.floor(monday.getTime() / 1000);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 7);
    sunday.setHours(23, 59, 59, 999);
    const endSec = Math.floor(sunday.getTime() / 1000);
    return { monday, startSec, endSec };
  }

  // Helper: Get Week Key
  function getWeekKey(offsetWeeks = 0) {
    const { monday } = getWeekBounds(offsetWeeks);
    return `${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`;
  }

  // Fetch airing schedule from AniList GraphQL
  async function fetchWeekSchedule(offsetWeeks = 0) {
    const weekKey = getWeekKey(offsetWeeks);
    if (state.scheduleData[weekKey] && state.scheduleData[weekKey].length > 0) {
      return state.scheduleData[weekKey];
    }

    state.isLoading = true;
    renderCalendarUI();

    const { startSec, endSec } = getWeekBounds(offsetWeeks);

    const query = `
      query ($airingAt_greater: Int, $airingAt_lesser: Int, $page: Int) {
        Page(page: $page, perPage: 50) {
          pageInfo {
            hasNextPage
          }
          airingSchedules(
            airingAt_greater: $airingAt_greater,
            airingAt_lesser: $airingAt_lesser,
            sort: TIME
          ) {
            id
            airingAt
            timeUntilAiring
            episode
            media {
              id
              title {
                romaji
                english
                native
                userPreferred
              }
              synonyms
              coverImage {
                extraLarge
                large
                medium
              }
              bannerImage
              format
              genres
              status
              nextAiringEpisode {
                airingAt
                timeUntilAiring
                episode
              }
              siteUrl
              externalLinks {
                site
                url
              }
            }
          }
        }
      }
    `;

    let allSchedules = [];
    let page = 1;
    let hasNextPage = true;

    try {
      while (hasNextPage && page <= 4) {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            query,
            variables: {
              airingAt_greater: startSec,
              airingAt_lesser: endSec,
              page
            }
          })
        });

        if (!response.ok) break;

        const result = await response.json();
        const schedules = result?.data?.Page?.airingSchedules || [];
        allSchedules = allSchedules.concat(schedules);
        hasNextPage = result?.data?.Page?.pageInfo?.hasNextPage ?? false;
        page++;
      }

      state.scheduleData[weekKey] = allSchedules;
      state.isLoading = false;
      state.error = null;
    } catch (err) {
      console.warn("[CrOptix Calendar] AniList schedule fetch error:", err);
      state.isLoading = false;
      if (!state.scheduleData[weekKey]) {
        state.scheduleData[weekKey] = [];
      }
    }

    renderCalendarUI();
    return state.scheduleData[weekKey] || [];
  }

  // Get days list for current selected week
  function getWeekDays(offsetWeeks = 0) {
    const monday = getMonday(offsetWeeks);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const isToday = d.getTime() === today.getTime();
      days.push({
        dayIndex: i,
        name: DAY_NAMES[i],
        shortName: DAY_NAMES_SHORT[i],
        dateNum: d.getDate(),
        month: d.getMonth() + 1,
        fullDate: d,
        isToday
      });
    }
    return days;
  }

  // Filter schedules for a specific day
  function getSchedulesForDay(dayIndex, offsetWeeks = 0) {
    const weekKey = getWeekKey(offsetWeeks);
    const all = state.scheduleData[weekKey] || [];
    const monday = getMonday(offsetWeeks);

    const targetDay = new Date(monday);
    targetDay.setDate(targetDay.getDate() + dayIndex);
    const targetDateStr = targetDay.toDateString();

    return all.filter(item => {
      if (!item || !item.airingAt) return false;
      const itemDate = new Date(item.airingAt * 1000);
      if (itemDate.toDateString() !== targetDateStr) return false;

      // Filter by Watchlist tab
      if (state.activeTab === "watchlist") {
        if (!isAnimeInWatchlist(item.media)) return false;
      }

      // Filter by search
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase().trim();
        const romaji = item.media?.title?.romaji?.toLowerCase() || "";
        const english = item.media?.title?.english?.toLowerCase() || "";
        const userPref = item.media?.title?.userPreferred?.toLowerCase() || "";
        if (!romaji.includes(q) && !english.includes(q) && !userPref.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }

  // Helper: Format Airing Time
  function formatAiringTime(airingTimestamp) {
    const now = Math.floor(Date.now() / 1000);
    const diff = airingTimestamp - now;
    const date = new Date(airingTimestamp * 1000);
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dayName = DAY_NAMES_SHORT[date.getDay() === 0 ? 6 : date.getDay() - 1];

    if (diff < 0) {
      return { timeStr, label: `✅ Disponível (${dayName} ${timeStr})`, isAired: true };
    }

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (hours === 0 && minutes < 60) {
      return { timeStr, label: `⏱️ Em ${minutes}m (${timeStr})`, isTodaySoon: true };
    } else if (hours < 24) {
      return { timeStr, label: `⏱️ Em ${hours}h (${timeStr})`, isTodaySoon: true };
    } else {
      return { timeStr, label: `📅 ${dayName} às ${timeStr}`, isAired: false };
    }
  }

  // Helper: Get best Crunchyroll link
  function getCrunchyrollUrl(media) {
    if (!media) return "https://www.crunchyroll.com";
    if (media.externalLinks && Array.isArray(media.externalLinks)) {
      const crLink = media.externalLinks.find(
        l => (l.site && l.site.toLowerCase().includes("crunchyroll")) || (l.url && l.url.includes("crunchyroll.com"))
      );
      if (crLink && crLink.url) return crLink.url;
    }
    const title = media.title?.userPreferred || media.title?.english || media.title?.romaji || "";
    return `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`;
  }

  // Build the entire Calendar DOM Modal
  function createCalendarModal() {
    let backdrop = document.getElementById("croptix-calendar-backdrop");
    if (backdrop) return backdrop;

    backdrop = document.createElement("div");
    backdrop.id = "croptix-calendar-backdrop";
    backdrop.className = "croptix-calendar-backdrop";

    backdrop.innerHTML = `
      <div class="croptix-calendar-modal" role="dialog" aria-modal="true" aria-label="Calendário de Animes">
        <!-- Header -->
        <div class="croptix-calendar-header">
          <div class="croptix-calendar-header-left">
            <div class="croptix-calendar-title-group">
              <div class="croptix-calendar-title-icon">
                ${ICONS.calendar}
              </div>
              <div class="croptix-calendar-title-text">
                <h2>Calendário de Lançamentos</h2>
                <p>Datas e horários dos teus animes na Crunchyroll</p>
              </div>
            </div>

            <div class="croptix-filter-tabs">
              <button class="croptix-filter-btn ${state.activeTab === 'watchlist' ? 'active' : ''}" data-tab="watchlist">
                ${ICONS.starFilled}
                <span id="croptix-tab-watchlist-text">Lista de Visionamento (${state.watchlistItems.length})</span>
              </button>
              <button class="croptix-filter-btn ${state.activeTab === 'all' ? 'active' : ''}" data-tab="all">
                ${ICONS.globe}
                <span>Todos os Lançamentos</span>
              </button>
            </div>
          </div>

          <div class="croptix-calendar-header-right">
            <button class="croptix-header-btn" id="croptix-manage-btn" title="Gerir ou adicionar animes manualmente">
              ${ICONS.edit}
              <span>Gerir Animes</span>
            </button>
            <button class="croptix-header-btn" id="croptix-sync-btn" title="Sincronizar com a conta Crunchyroll">
              ${ICONS.refresh}
              <span>Sincronizar</span>
            </button>
            <div class="croptix-search-wrapper">
              <span class="croptix-search-icon">${ICONS.search}</span>
              <input type="text" class="croptix-search-input" id="croptix-cal-search" placeholder="Buscar anime..." value="${state.searchQuery}">
            </div>
            <button class="croptix-close-btn" id="croptix-cal-close" title="Fechar (Esc)">
              ${ICONS.close}
            </button>
          </div>
        </div>

        <!-- Mode / Sub-view Bar -->
        <div class="croptix-week-bar">
          <div class="croptix-week-nav">
            <button class="croptix-week-btn" id="croptix-week-prev">
              ${ICONS.chevronLeft} Anterior
            </button>
            <span class="croptix-week-label" id="croptix-week-label">Semana Atual</span>
            <button class="croptix-week-btn" id="croptix-week-next">
              Próxima ${ICONS.chevronRight}
            </button>
            <button class="croptix-week-today-btn" id="croptix-week-today">Hoje</button>
          </div>

          <div class="croptix-mode-tabs" id="croptix-subview-container">
            <button class="croptix-subview-btn ${state.subView === 'all_shows' ? 'active' : ''}" id="croptix-subview-all">Todos os Meus Animes</button>
            <button class="croptix-subview-btn ${state.subView === 'days' ? 'active' : ''}" id="croptix-subview-days">Por Dia da Semana</button>
          </div>

          <div class="croptix-timezone-badge">
            <span>Horário Local (${Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
          </div>
        </div>

        <!-- Day Strip -->
        <div class="croptix-day-strip" id="croptix-day-strip" style="${state.subView === 'all_shows' && state.activeTab === 'watchlist' ? 'display:none;' : ''}"></div>

        <!-- Body / Content -->
        <div class="croptix-calendar-body" id="croptix-calendar-body"></div>

        <!-- Manager Drawer -->
        <div class="croptix-manager-drawer" id="croptix-manager-drawer">
          <div class="croptix-manager-header">
            <h3>Gerir Lista de Visionamento</h3>
            <button class="croptix-close-btn" id="croptix-manager-close">${ICONS.close}</button>
          </div>
          <div class="croptix-manager-content">
            <div class="croptix-manager-add-box">
              <label style="font-size:11px;font-weight:700;color:#dadada;">Adicionar Anime por Nome:</label>
              <div style="display:flex;gap:6px;">
                <input type="text" id="croptix-add-title-input" class="croptix-manager-input" placeholder="Ex: Jujutsu Kaisen" style="flex:1;">
                <button class="croptix-empty-btn" id="croptix-add-title-btn" style="padding:6px 12px;font-size:11px;">+ Adicionar</button>
              </div>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
              <span style="font-size:11px;font-weight:700;color:#aaa;">Animes na Lista (<span id="croptix-manager-count">${state.watchlistItems.length}</span>):</span>
              <button id="croptix-clear-all-btn" style="background:none;border:none;color:#ff5555;font-size:10px;cursor:pointer;text-decoration:underline;">Limpar Tudo</button>
            </div>

            <div class="croptix-manager-list" id="croptix-manager-list"></div>

            <div style="margin-top:auto;display:flex;flex-direction:column;gap:8px;">
              <button class="croptix-empty-btn" id="croptix-open-watchlist-btn" style="background:#2a2b30;justify-content:center;">
                📑 Abrir Watchlist na Crunchyroll
              </button>
              <button class="croptix-empty-btn" id="croptix-manager-sync-btn" style="justify-content:center;">
                🔄 Sincronizar da Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeCalendar();
    });

    document.getElementById("croptix-cal-close").addEventListener("click", closeCalendar);

    // Sync button
    backdrop.querySelector("#croptix-sync-btn").addEventListener("click", () => {
      syncWatchlistFromCrunchyroll();
    });

    // Manager toggle
    const managerDrawer = backdrop.querySelector("#croptix-manager-drawer");
    backdrop.querySelector("#croptix-manage-btn").addEventListener("click", () => {
      state.isManagerOpen = !state.isManagerOpen;
      managerDrawer.classList.toggle("open", state.isManagerOpen);
      renderManagerList();
    });
    backdrop.querySelector("#croptix-manager-close").addEventListener("click", () => {
      state.isManagerOpen = false;
      managerDrawer.classList.remove("open");
    });
    backdrop.querySelector("#croptix-manager-sync-btn").addEventListener("click", () => {
      syncWatchlistFromCrunchyroll();
      renderManagerList();
    });
    backdrop.querySelector("#croptix-open-watchlist-btn").addEventListener("click", () => {
      window.open("https://www.crunchyroll.com/pt-pt/watchlist", "_blank");
    });

    // Add title button
    backdrop.querySelector("#croptix-add-title-btn").addEventListener("click", () => {
      const input = backdrop.querySelector("#croptix-add-title-input");
      const val = input.value.trim();
      if (val) {
        setWatchlistItems([{
          id: "",
          title: val,
          slug: "",
          image: "",
          lastWatched: "Adicionado",
          url: `https://www.crunchyroll.com/search?q=${encodeURIComponent(val)}`
        }], false);
        input.value = "";
        renderManagerList();
        renderCalendarUI();
      }
    });

    // Clear all button
    backdrop.querySelector("#croptix-clear-all-btn").addEventListener("click", () => {
      if (confirm("Tens a certeza que queres limpar a lista de animes guardada na extensão?")) {
        state.watchlistItems = [];
        state.watchlistIds.clear();
        state.watchlistTitles.clear();
        state.watchlistSlugs.clear();
        saveWatchlist();
        renderManagerList();
        renderCalendarUI();
      }
    });

    const filterBtns = backdrop.querySelectorAll(".croptix-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.activeTab = btn.dataset.tab;
        const strip = document.getElementById("croptix-day-strip");
        const subviewCont = document.getElementById("croptix-subview-container");
        if (state.activeTab === "all") {
          strip.style.display = "grid";
          subviewCont.style.display = "none";
        } else {
          subviewCont.style.display = "flex";
          strip.style.display = state.subView === "all_shows" ? "none" : "grid";
        }
        renderCalendarUI();
      });
    });

    // Sub-view toggle
    backdrop.querySelector("#croptix-subview-all").addEventListener("click", () => {
      state.subView = "all_shows";
      backdrop.querySelector("#croptix-subview-all").classList.add("active");
      backdrop.querySelector("#croptix-subview-days").classList.remove("active");
      document.getElementById("croptix-day-strip").style.display = "none";
      renderCalendarUI();
    });

    backdrop.querySelector("#croptix-subview-days").addEventListener("click", () => {
      state.subView = "days";
      backdrop.querySelector("#croptix-subview-days").classList.add("active");
      backdrop.querySelector("#croptix-subview-all").classList.remove("active");
      document.getElementById("croptix-day-strip").style.display = "grid";
      renderCalendarUI();
    });

    const searchInput = backdrop.querySelector("#croptix-cal-search");
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderDayContent();
    });

    backdrop.querySelector("#croptix-week-prev").addEventListener("click", () => {
      state.currentWeekOffset--;
      updateWeekView();
    });

    backdrop.querySelector("#croptix-week-next").addEventListener("click", () => {
      state.currentWeekOffset++;
      updateWeekView();
    });

    backdrop.querySelector("#croptix-week-today").addEventListener("click", () => {
      state.currentWeekOffset = 0;
      const todayDay = new Date().getDay();
      state.selectedDayIndex = todayDay === 0 ? 6 : todayDay - 1;
      updateWeekView();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.isOpen) {
        if (state.isManagerOpen) {
          state.isManagerOpen = false;
          managerDrawer.classList.remove("open");
        } else {
          closeCalendar();
        }
      }
      if (e.altKey && (e.key === "c" || e.key === "C")) {
        toggleCalendar();
      }
    });

    return backdrop;
  }

  // Render Manager List
  function renderManagerList() {
    const list = document.getElementById("croptix-manager-list");
    const count = document.getElementById("croptix-manager-count");
    if (!list) return;

    if (count) count.textContent = state.watchlistItems.length;

    if (state.watchlistItems.length === 0) {
      list.innerHTML = `<div style="font-size:11px;color:#888;text-align:center;padding:12px;">Nenhum anime na lista.<br>Clica em "Sincronizar da Conta" ou adiciona acima.</div>`;
      return;
    }

    list.innerHTML = state.watchlistItems.map((it, idx) => `
      <div class="croptix-manager-item">
        <span class="croptix-manager-item-name" title="${it.title}">${it.title}</span>
        <button class="croptix-manager-item-del" data-idx="${idx}" title="Remover da lista">✕</button>
      </div>
    `).join("");

    list.querySelectorAll(".croptix-manager-item-del").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (!isNaN(idx) && idx >= 0 && idx < state.watchlistItems.length) {
          state.watchlistItems.splice(idx, 1);
          saveWatchlist();
          renderManagerList();
          renderCalendarUI();
        }
      });
    });
  }

  // Update Week
  function updateWeekView() {
    const monday = getMonday(state.currentWeekOffset);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    const label = document.getElementById("croptix-week-label");
    if (label) {
      if (state.currentWeekOffset === 0) {
        label.textContent = `Esta Semana (${monday.getDate()}/${monday.getMonth() + 1} - ${sunday.getDate()}/${sunday.getMonth() + 1})`;
      } else {
        label.textContent = `${monday.getDate()}/${monday.getMonth() + 1} - ${sunday.getDate()}/${sunday.getMonth() + 1}`;
      }
    }

    renderDayTabs();
    fetchWeekSchedule(state.currentWeekOffset);
  }

  // Render Day Tabs
  function renderDayTabs() {
    const strip = document.getElementById("croptix-day-strip");
    if (!strip) return;

    const days = getWeekDays(state.currentWeekOffset);
    strip.innerHTML = "";

    days.forEach(d => {
      const schedules = getSchedulesForDay(d.dayIndex, state.currentWeekOffset);
      const btn = document.createElement("button");
      btn.className = `croptix-day-tab ${d.dayIndex === state.selectedDayIndex ? "active" : ""} ${d.isToday ? "is-today" : ""}`;
      btn.dataset.day = d.dayIndex;

      btn.innerHTML = `
        <span class="croptix-day-name">${d.shortName}</span>
        <span class="croptix-day-date">${d.dateNum}</span>
        <span class="croptix-day-badge">${schedules.length}</span>
      `;

      btn.addEventListener("click", () => {
        document.querySelectorAll(".croptix-day-tab").forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        state.selectedDayIndex = d.dayIndex;
        renderDayContent();
      });

      strip.appendChild(btn);
    });
  }

  // Render Day Content / All Shows Content
  function renderDayContent() {
    const body = document.getElementById("croptix-calendar-body");
    const tabText = document.getElementById("croptix-tab-watchlist-text");
    if (tabText) {
      tabText.textContent = `Lista de Visionamento (${state.watchlistItems.length})`;
    }
    if (!body) return;

    if (state.isLoading) {
      body.innerHTML = `
        <div class="croptix-skeleton-grid">
          ${Array(6).fill('<div class="croptix-skeleton-card"></div>').join("")}
        </div>
      `;
      return;
    }

    // View: All Watchlist Shows
    if (state.activeTab === "watchlist" && state.subView === "all_shows") {
      let items = state.watchlistItems;

      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase().trim();
        items = items.filter(it => it.title && it.title.toLowerCase().includes(q));
      }

      if (items.length === 0) {
        body.innerHTML = `
          <div class="croptix-empty-state">
            <div class="croptix-empty-icon">${ICONS.starFilled}</div>
            <h3 class="croptix-empty-title">Nenhum anime na tua Lista de Visionamento</h3>
            <p class="croptix-empty-desc">
              A extensão pode sincronizar diretamente com a tua conta Crunchyroll ou podes adicionar animes manualmente.
            </p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button class="croptix-empty-btn" id="croptix-force-sync-btn">🔄 Sincronizar da Crunchyroll</button>
              <button class="croptix-empty-btn" style="background:#2d3038;" id="croptix-empty-manage-btn">✏️ Adicionar / Gerir Animes</button>
            </div>
          </div>
        `;
        const syncBtn = body.querySelector("#croptix-force-sync-btn");
        if (syncBtn) syncBtn.addEventListener("click", () => syncWatchlistFromCrunchyroll());
        const manageBtn = body.querySelector("#croptix-empty-manage-btn");
        if (manageBtn) {
          manageBtn.addEventListener("click", () => {
            state.isManagerOpen = true;
            document.getElementById("croptix-manager-drawer")?.classList.add("open");
            renderManagerList();
          });
        }
        return;
      }

      const weekKey = getWeekKey(state.currentWeekOffset);
      const allSchedules = state.scheduleData[weekKey] || [];

      let gridHtml = `<div class="croptix-anime-grid">`;

      items.forEach(it => {
        const title = it.title || "Anime";
        const image = it.image || "";
        const crUrl = it.url || `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`;
        const lastWatched = it.lastWatched || "Na Watchlist";

        // Check if there is an airing episode in the current week
        const matchSchedule = allSchedules.find(s => isAnimeInWatchlist(s.media) && (
          normalizeTitle(s.media?.title?.userPreferred) === normalizeTitle(title) ||
          normalizeTitle(s.media?.title?.english) === normalizeTitle(title) ||
          normalizeTitle(s.media?.title?.romaji) === normalizeTitle(title)
        ));

        let badgeText = lastWatched;
        let timeLabel = "Disponível na Crunchyroll";
        let timeClass = "";

        if (matchSchedule) {
          const timing = formatAiringTime(matchSchedule.airingAt);
          badgeText = matchSchedule.episode ? `EP ${matchSchedule.episode}` : "Novo Ep";
          timeLabel = timing.label;
          if (timing.isAired) timeClass = "is-aired";
          else if (timing.isTodaySoon) timeClass = "is-today-soon";
        }

        const displayImg = image || matchSchedule?.media?.bannerImage || matchSchedule?.media?.coverImage?.large || "";

        gridHtml += `
          <div class="croptix-anime-card">
            <div class="croptix-card-poster-wrapper">
              <img class="croptix-card-poster" src="${displayImg}" alt="${title}" loading="lazy" />
              <span class="croptix-card-ep-badge">${badgeText}</span>
              <span class="croptix-card-time-badge ${timeClass}">${timeLabel}</span>
            </div>
            <div class="croptix-card-details">
              <div class="croptix-card-info">
                <a href="${crUrl}" class="croptix-card-title" title="${title}">${title}</a>
              </div>
              <a href="${crUrl}" class="croptix-card-btn">
                ${ICONS.play} Assistir no Crunchyroll
              </a>
            </div>
          </div>
        `;
      });

      gridHtml += `</div>`;
      body.innerHTML = gridHtml;
      return;
    }

    // View: Day by day
    const schedules = getSchedulesForDay(state.selectedDayIndex, state.currentWeekOffset);

    if (schedules.length === 0) {
      if (state.activeTab === "watchlist") {
        body.innerHTML = `
          <div class="croptix-empty-state">
            <div class="croptix-empty-icon">${ICONS.starFilled}</div>
            <h3 class="croptix-empty-title">Nenhum episódio da tua lista programado para este dia</h3>
            <p class="croptix-empty-desc">
              Não há transmissões agendadas para os teus animes nesta data.<br>
              Clica em <strong>"Todos os Meus Animes"</strong> para consultar toda a tua lista de visionamento, ou alterna para <strong>"Todos os Lançamentos"</strong>!
            </p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button class="croptix-empty-btn" id="croptix-switch-all-shows-btn">Ver Todos os Meus Animes</button>
              <button class="croptix-empty-btn" style="background:#333;" id="croptix-switch-all-btn">Ver Todos os Lançamentos</button>
            </div>
          </div>
        `;
        const allShowsBtn = body.querySelector("#croptix-switch-all-shows-btn");
        if (allShowsBtn) {
          allShowsBtn.addEventListener("click", () => {
            state.subView = "all_shows";
            document.getElementById("croptix-subview-all")?.classList.add("active");
            document.getElementById("croptix-subview-days")?.classList.remove("active");
            document.getElementById("croptix-day-strip").style.display = "none";
            renderCalendarUI();
          });
        }
        const switchBtn = body.querySelector("#croptix-switch-all-btn");
        if (switchBtn) {
          switchBtn.addEventListener("click", () => {
            state.activeTab = "all";
            const filterBtns = document.querySelectorAll(".croptix-filter-btn");
            filterBtns.forEach(b => {
              b.classList.toggle("active", b.dataset.tab === "all");
            });
            document.getElementById("croptix-day-strip").style.display = "grid";
            document.getElementById("croptix-subview-container").style.display = "none";
            renderCalendarUI();
          });
        }
      } else {
        body.innerHTML = `
          <div class="croptix-empty-state">
            <div class="croptix-empty-icon">${ICONS.calendar}</div>
            <h3 class="croptix-empty-title">Nenhum lançamento encontrado</h3>
            <p class="croptix-empty-desc">
              ${state.searchQuery ? `Nenhum anime corresponde à busca "${state.searchQuery}".` : "Não há transmissões programadas para este dia."}
            </p>
          </div>
        `;
      }
      return;
    }

    let gridHtml = `<div class="croptix-anime-grid">`;

    schedules.forEach(item => {
      const media = item.media || {};
      const id = String(media.id);
      const title = media.title?.userPreferred || media.title?.english || media.title?.romaji || "Anime";
      const image = media.bannerImage || media.coverImage?.extraLarge || media.coverImage?.large || media.coverImage?.medium || "";
      const crUrl = getCrunchyrollUrl(media);
      const epNum = item.episode ? `Episódio ${item.episode}` : "Novo Ep";
      const timing = formatAiringTime(item.airingAt);
      const genres = Array.isArray(media.genres) ? media.genres.slice(0, 3) : [];

      let timeClass = "";
      if (timing.isAired) timeClass = "is-aired";
      else if (timing.isTodaySoon) timeClass = "is-today-soon";

      gridHtml += `
        <div class="croptix-anime-card" data-anime-id="${id}">
          <div class="croptix-card-poster-wrapper">
            <img class="croptix-card-poster" src="${image}" alt="${title}" loading="lazy" />
            <span class="croptix-card-ep-badge">${epNum}</span>
            <span class="croptix-card-time-badge ${timeClass}">${timing.label}</span>
          </div>
          <div class="croptix-card-details">
            <div class="croptix-card-info">
              <a href="${crUrl}" class="croptix-card-title" title="${title}">${title}</a>
              <div class="croptix-card-genres">
                ${genres.map(g => `<span class="croptix-genre-pill">${g}</span>`).join("")}
              </div>
            </div>
            <a href="${crUrl}" class="croptix-card-btn">
              ${ICONS.play} Assistir no Crunchyroll
            </a>
          </div>
        </div>
      `;
    });

    gridHtml += `</div>`;
    body.innerHTML = gridHtml;
  }

  // Re-render UI
  function renderCalendarUI() {
    renderDayTabs();
    renderDayContent();
  }

  // Open Calendar
  function openCalendar() {
    const backdrop = createCalendarModal();
    loadWatchlist();
    syncWatchlistFromCrunchyroll();
    state.isOpen = true;
    backdrop.classList.add("croptix-open");
    document.body.style.overflow = "hidden";
    updateWeekView();
  }

  // Close Calendar
  function closeCalendar() {
    const backdrop = document.getElementById("croptix-calendar-backdrop");
    if (backdrop) {
      backdrop.classList.remove("croptix-open");
    }
    state.isOpen = false;
    state.isManagerOpen = false;
    document.getElementById("croptix-manager-drawer")?.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Toggle Calendar
  function toggleCalendar() {
    if (state.isOpen) closeCalendar();
    else openCalendar();
  }

  // Inject Header Nav Button - Clones the exact structure and font of sibling links (Novidade, Popular, etc.)
  function injectHeaderNavButton() {
    if (document.getElementById("croptix-header-calendar-link")) return;

    // Find any existing sibling navigation link in Crunchyroll header
    const siblingLink = document.querySelector(".browse-menu-item__link--JmxT8, .erc-header-tile, header nav a, .header-content a, .browse-menu__list a");

    let navBtn;
    if (siblingLink) {
      navBtn = siblingLink.cloneNode(true);
      navBtn.id = "croptix-header-calendar-link";
      navBtn.classList.add("croptix-calendar-nav-btn");
      navBtn.removeAttribute("href");

      // Replace inner text with "Calendário"
      const textSpan = navBtn.querySelector("span, div, p");
      if (textSpan) {
        textSpan.textContent = "Calendário";
      } else {
        navBtn.textContent = "Calendário";
      }
      // Remove any cloned icons
      navBtn.querySelectorAll("svg, img, i").forEach(el => el.remove());

      navBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCalendar();
      });

      if (siblingLink.parentElement) {
        siblingLink.parentElement.insertBefore(navBtn, siblingLink.nextSibling);
      }
    } else {
      const headerNav = document.querySelector(".header-content, .erc-sticky-header, .app-layout__header--ywueY, header nav");
      if (headerNav) {
        navBtn = document.createElement("a");
        navBtn.id = "croptix-header-calendar-link";
        navBtn.className = "browse-menu-item__link--JmxT8 erc-header-tile croptix-calendar-nav-btn";
        navBtn.innerHTML = `<span>Calendário</span>`;
        navBtn.addEventListener("click", (e) => {
          e.preventDefault();
          toggleCalendar();
        });
        headerNav.appendChild(navBtn);
      }
    }
  }

  // Initialize Calendar
  async function init() {
    await cleanupLegacyStorage();
    await loadWatchlist();
    injectHeaderNavButton();
    syncWatchlistFromCrunchyroll();

    // Listen for custom postMessage events from crunchyroll.js
    window.addEventListener("message", (event) => {
      if (event.source !== window || !event.data) return;
      if (event.data.type === "CROPTIX_WATCHLIST_DATA" && Array.isArray(event.data.items)) {
        setWatchlistItems(event.data.items, event.data.replace ?? false);
      }
    });

    // Listen for custom DOM events
    document.addEventListener("croptix:watchlist-sync", (e) => {
      try {
        const data = typeof e.detail === "string" ? JSON.parse(e.detail) : e.detail;
        if (Array.isArray(data)) {
          setWatchlistItems(data, true);
        }
      } catch (_) {}
    });

    // DOM Observer for SPA changes
    const observer = new MutationObserver(() => {
      if (!document.getElementById("croptix-header-calendar-link")) {
        injectHeaderNavButton();
      }
      if (window.location.pathname.includes("/watchlist") || window.location.pathname.includes("/crunchylists")) {
        scanCurrentWatchlistDOM();
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Handle extension messages
    if (ext && ext.runtime && ext.runtime.onMessage) {
      ext.runtime.onMessage.addListener((request) => {
        if (request.action === "open_calendar") {
          openCalendar();
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.__croptix_calendar = {
    open: openCalendar,
    close: closeCalendar,
    toggle: toggleCalendar,
    syncWatchlist: syncWatchlistFromCrunchyroll,
    state
  };
})();
