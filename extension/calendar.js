/**
 * Crunchyroll Enhancer - CrOptix
 * Anime Release Calendar & Watchlist Schedule Engine
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
    globe: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`
  };

  const DAY_NAMES = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const DAY_NAMES_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  // Default initial watchlist items from the user's Crunchyroll watchlist
  const INITIAL_WATCHLIST_TITLES = [
    "Jujutsu Kaisen",
    "Kaiju No. 8",
    "That Time I Got Reincarnated as a Slime",
    "Smoking Behind the Supermarket with You",
    "Re:ZERO -Starting Life in Another World-",
    "Mushoku Tensei: Jobless Reincarnation",
    "100 Namoradas Que Te Amam Muuuuito",
    "The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You",
    "You and I Are Polar Opposites",
    "Attack on Titan",
    "My Hero Academia",
    "BLUE LOCK",
    "More than a Married Couple, but Not Lovers.",
    "Dr. STONE",
    "Classroom of the Elite",
    "Black Clover",
    "OSHI NO KO"
  ];

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
    currentWeekOffset: 0,
    selectedDayIndex: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
    activeTab: "watchlist", // "watchlist" | "all"
    subView: "days", // "days" | "all_shows"
    searchQuery: "",
    watchlistIds: new Set(),
    watchlistTitles: new Set(),
    watchlistSlugs: new Set(),
    scheduleData: {},
    allWatchlistMedia: [],
    isLoading: false,
    error: null
  };

  // Pre-seed watchlist titles
  INITIAL_WATCHLIST_TITLES.forEach(t => {
    state.watchlistTitles.add(normalizeTitle(t));
    const base = normalizeTitle(getBaseTitle(t));
    if (base && base.length >= 4) state.watchlistTitles.add(base);
  });

  // Load saved watchlist from storage
  async function loadWatchlist() {
    try {
      const res = await ext.storage.local.get([
        "croptix_watchlist_ids",
        "croptix_watchlist_titles",
        "croptix_watchlist_slugs"
      ]);
      if (res && Array.isArray(res.croptix_watchlist_ids)) {
        res.croptix_watchlist_ids.forEach(id => state.watchlistIds.add(id));
      }
      if (res && Array.isArray(res.croptix_watchlist_titles)) {
        res.croptix_watchlist_titles.forEach(t => state.watchlistTitles.add(t));
      }
      if (res && Array.isArray(res.croptix_watchlist_slugs)) {
        res.croptix_watchlist_slugs.forEach(s => state.watchlistSlugs.add(s));
      }
    } catch (e) {
      const localIds = localStorage.getItem("croptix_watchlist_ids");
      const localTitles = localStorage.getItem("croptix_watchlist_titles");
      if (localIds) {
        try { JSON.parse(localIds).forEach(id => state.watchlistIds.add(id)); } catch (_) {}
      }
      if (localTitles) {
        try { JSON.parse(localTitles).forEach(t => state.watchlistTitles.add(t)); } catch (_) {}
      }
    }
  }

  // Save watchlist
  async function saveWatchlist() {
    const idsArr = Array.from(state.watchlistIds);
    const titlesArr = Array.from(state.watchlistTitles);
    const slugsArr = Array.from(state.watchlistSlugs);
    try {
      await ext.storage.local.set({
        croptix_watchlist_ids: idsArr,
        croptix_watchlist_titles: titlesArr,
        croptix_watchlist_slugs: slugsArr
      });
    } catch (e) {
      localStorage.setItem("croptix_watchlist_ids", JSON.stringify(idsArr));
      localStorage.setItem("croptix_watchlist_titles", JSON.stringify(titlesArr));
      localStorage.setItem("croptix_watchlist_slugs", JSON.stringify(slugsArr));
    }
  }

  // Check if an anime matches the user's Watchlist
  function isAnimeInWatchlist(media) {
    if (!media) return false;

    // 1. Direct Crunchyroll series ID in external links
    if (media.externalLinks && Array.isArray(media.externalLinks)) {
      for (const link of media.externalLinks) {
        const match = link.url?.match(/series\/([a-z0-9]+)/i);
        if (match && match[1] && state.watchlistIds.has(match[1].toUpperCase())) return true;
        const slugMatch = link.url?.match(/series\/[a-z0-9]+\/([a-z0-9\-]+)/i);
        if (slugMatch && slugMatch[1] && state.watchlistSlugs.has(slugMatch[1].toLowerCase())) return true;
      }
    }

    // 2. Exact Title Matches
    const titlesToCheck = [
      media.title?.userPreferred,
      media.title?.english,
      media.title?.romaji,
      media.title?.native
    ].filter(Boolean);

    for (const raw of titlesToCheck) {
      const norm = normalizeTitle(raw);
      if (norm && state.watchlistTitles.has(norm)) return true;

      const baseNorm = normalizeTitle(getBaseTitle(raw));
      if (baseNorm && baseNorm.length >= 4 && state.watchlistTitles.has(baseNorm)) return true;
    }

    // 3. Synonyms Matches
    if (Array.isArray(media.synonyms)) {
      for (const s of media.synonyms) {
        const norm = normalizeTitle(s);
        if (norm && state.watchlistTitles.has(norm)) return true;
        const baseNorm = normalizeTitle(getBaseTitle(s));
        if (baseNorm && baseNorm.length >= 4 && state.watchlistTitles.has(baseNorm)) return true;
      }
    }

    return false;
  }

  // Add verified watchlist anime
  function addWatchlistAnime(id, title, slug = "") {
    let changed = false;
    if (id) {
      const upId = String(id).toUpperCase();
      if (!state.watchlistIds.has(upId)) {
        state.watchlistIds.add(upId);
        changed = true;
      }
    }
    if (title) {
      const norm = normalizeTitle(title);
      const normBase = normalizeTitle(getBaseTitle(title));
      if (norm && !state.watchlistTitles.has(norm)) {
        state.watchlistTitles.add(norm);
        changed = true;
      }
      if (normBase && normBase.length >= 4 && !state.watchlistTitles.has(normBase)) {
        state.watchlistTitles.add(normBase);
        changed = true;
      }
    }
    if (slug) {
      const s = String(slug).toLowerCase().trim();
      if (s && !state.watchlistSlugs.has(s)) {
        state.watchlistSlugs.add(s);
        changed = true;
      }
    }
    if (changed) {
      saveWatchlist();
    }
  }

  // Background fetch of /watchlist page HTML
  async function backgroundSyncWatchlist() {
    try {
      const resp = await fetch("/watchlist", { credentials: "same-origin" });
      if (resp.ok) {
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const cards = doc.querySelectorAll(
          ".playable-card--GnRbX, .browse-card--esJdT, .watchlist-card, .erc-watchlist-item, [data-t='watchlist-card'], .card"
        );
        cards.forEach(c => {
          const title = c.querySelector("h4, h3, h2, .playable-card__title, .browse-card__title, .title, .text--is-m--pqi45")?.textContent?.trim();
          const link = c.querySelector("a[href*='/series/'], a[href*='/watch/']")?.href || "";
          const idMatch = link.match(/series\/([a-z0-9]+)/i);
          const slugMatch = link.match(/series\/[a-z0-9]+\/([a-z0-9\-]+)/i);
          if (title || idMatch) {
            addWatchlistAnime(idMatch ? idMatch[1] : "", title, slugMatch ? slugMatch[1] : "");
          }
        });
      }
    } catch (_) {}
  }

  // Scan current page if on /watchlist
  function scanWatchlistDOM() {
    if (!window.location.pathname.includes("/watchlist")) return;
    const cards = document.querySelectorAll(
      ".playable-card--GnRbX, .browse-card--esJdT, .watchlist-card, .erc-watchlist-item, [data-t='watchlist-card'], .card"
    );
    cards.forEach(c => {
      const title = c.querySelector("h4, h3, h2, .playable-card__title, .browse-card__title, .title, .text--is-m--pqi45")?.textContent?.trim();
      const link = c.querySelector("a[href*='/series/'], a[href*='/watch/']")?.href || "";
      const idMatch = link.match(/series\/([a-z0-9]+)/i);
      const slugMatch = link.match(/series\/[a-z0-9]+\/([a-z0-9\-]+)/i);
      if (title || idMatch) {
        addWatchlistAnime(idMatch ? idMatch[1] : "", title, slugMatch ? slugMatch[1] : "");
      }
    });
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

  // Get all schedules across the entire week matching the current tab
  function getSchedulesForEntireWeek(offsetWeeks = 0) {
    const weekKey = getWeekKey(offsetWeeks);
    const all = state.scheduleData[weekKey] || [];

    return all.filter(item => {
      if (!item || !item.airingAt) return false;
      if (state.activeTab === "watchlist") {
        if (!isAnimeInWatchlist(item.media)) return false;
      }
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

  // Helper: Format Airing Time and Relative Countdown
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
                <p>Datas e horários de episódios da tua lista de visionamento</p>
              </div>
            </div>

            <div class="croptix-filter-tabs">
              <button class="croptix-filter-btn ${state.activeTab === 'watchlist' ? 'active' : ''}" data-tab="watchlist">
                ${ICONS.starFilled}
                <span>Lista de Visionamento</span>
              </button>
              <button class="croptix-filter-btn ${state.activeTab === 'all' ? 'active' : ''}" data-tab="all">
                ${ICONS.globe}
                <span>Todos os Lançamentos</span>
              </button>
            </div>
          </div>

          <div class="croptix-calendar-header-right">
            <div class="croptix-search-wrapper">
              <span class="croptix-search-icon">${ICONS.search}</span>
              <input type="text" class="croptix-search-input" id="croptix-cal-search" placeholder="Buscar anime..." value="${state.searchQuery}">
            </div>
            <button class="croptix-close-btn" id="croptix-cal-close" title="Fechar (Esc)">
              ${ICONS.close}
            </button>
          </div>
        </div>

        <!-- Week Navigator -->
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

          <div class="croptix-mode-tabs">
            <button class="croptix-subview-btn ${state.subView === 'days' ? 'active' : ''}" id="croptix-subview-days">Por Dia</button>
            <button class="croptix-subview-btn ${state.subView === 'all_shows' ? 'active' : ''}" id="croptix-subview-all">Semana Toda</button>
          </div>

          <div class="croptix-timezone-badge">
            <span>Horário Local (${Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
          </div>
        </div>

        <!-- Day Strip -->
        <div class="croptix-day-strip" id="croptix-day-strip"></div>

        <!-- Body / Content -->
        <div class="croptix-calendar-body" id="croptix-calendar-body"></div>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeCalendar();
    });

    document.getElementById("croptix-cal-close").addEventListener("click", closeCalendar);

    const filterBtns = backdrop.querySelectorAll(".croptix-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.activeTab = btn.dataset.tab;
        renderCalendarUI();
      });
    });

    // Sub-view toggle
    backdrop.querySelector("#croptix-subview-days").addEventListener("click", () => {
      state.subView = "days";
      backdrop.querySelector("#croptix-subview-days").classList.add("active");
      backdrop.querySelector("#croptix-subview-all").classList.remove("active");
      document.getElementById("croptix-day-strip").style.display = "grid";
      renderCalendarUI();
    });

    backdrop.querySelector("#croptix-subview-all").addEventListener("click", () => {
      state.subView = "all_shows";
      backdrop.querySelector("#croptix-subview-all").classList.add("active");
      backdrop.querySelector("#croptix-subview-days").classList.remove("active");
      document.getElementById("croptix-day-strip").style.display = "none";
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
        closeCalendar();
      }
      if (e.altKey && (e.key === "c" || e.key === "C")) {
        toggleCalendar();
      }
    });

    return backdrop;
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

  // Render Day Content
  function renderDayContent() {
    const body = document.getElementById("croptix-calendar-body");
    if (!body) return;

    if (state.isLoading) {
      body.innerHTML = `
        <div class="croptix-skeleton-grid">
          ${Array(6).fill('<div class="croptix-skeleton-card"></div>').join("")}
        </div>
      `;
      return;
    }

    const schedules = state.subView === "all_shows"
      ? getSchedulesForEntireWeek(state.currentWeekOffset)
      : getSchedulesForDay(state.selectedDayIndex, state.currentWeekOffset);

    if (schedules.length === 0) {
      if (state.activeTab === "watchlist") {
        body.innerHTML = `
          <div class="croptix-empty-state">
            <div class="croptix-empty-icon">${ICONS.starFilled}</div>
            <h3 class="croptix-empty-title">Nenhum episódio da tua lista programado para este dia</h3>
            <p class="croptix-empty-desc">
              Não há novos episódios dos animes da tua lista de visionamento programados para este dia.<br>
              Clica em <strong>"Semana Toda"</strong> para ver todos os episódios da tua lista durante esta semana, ou muda para <strong>"Todos os Lançamentos"</strong>!
            </p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button class="croptix-empty-btn" id="croptix-switch-week-btn">Ver Semana Toda</button>
              <button class="croptix-empty-btn" style="background:#333;" id="croptix-switch-all-btn">Ver Todos os Lançamentos</button>
            </div>
          </div>
        `;
        const weekBtn = body.querySelector("#croptix-switch-week-btn");
        if (weekBtn) {
          weekBtn.addEventListener("click", () => {
            state.subView = "all_shows";
            document.getElementById("croptix-subview-all").classList.add("active");
            document.getElementById("croptix-subview-days").classList.remove("active");
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
    scanWatchlistDOM();
    backgroundSyncWatchlist();
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
    document.body.style.overflow = "";
  }

  // Toggle Calendar
  function toggleCalendar() {
    if (state.isOpen) closeCalendar();
    else openCalendar();
  }

  // Inject Header Button with exact Crunchyroll native nav styling
  function injectHeaderNavButton() {
    if (document.querySelector(".croptix-calendar-nav-btn")) return;

    const navContainer = document.querySelector(
      ".container--cq5XE.header-content, .erc-sticky-header, .app-layout__header--ywueY, header"
    );
    const browseLink = document.querySelector(".erc-header-tile, .browse-menu-item__link--JmxT8");

    const navBtn = document.createElement("button");
    navBtn.className = "croptix-calendar-nav-btn erc-header-tile";
    navBtn.title = "Calendário de Lançamentos de Anime (Alt+C)";
    navBtn.innerHTML = `
      ${ICONS.calendar}
      <span>Calendário</span>
    `;

    navBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleCalendar();
    });

    if (browseLink && browseLink.parentElement) {
      browseLink.parentElement.insertBefore(navBtn, browseLink.nextSibling);
    } else if (navContainer) {
      navContainer.appendChild(navBtn);
    }
  }

  // Initialize Calendar
  function init() {
    loadWatchlist();
    injectHeaderNavButton();
    scanWatchlistDOM();
    backgroundSyncWatchlist();

    // Listen for custom watchlist events
    window.addEventListener("croptix:watchlist-sync", (e) => {
      if (Array.isArray(e.detail)) {
        for (const it of e.detail) {
          addWatchlistAnime(it.id, it.title, it.slug);
        }
      }
    });

    // DOM Observer
    const observer = new MutationObserver(() => {
      if (!document.querySelector(".croptix-calendar-nav-btn")) {
        injectHeaderNavButton();
      }
      if (window.location.pathname.includes("/watchlist")) {
        scanWatchlistDOM();
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
    state
  };
})();
