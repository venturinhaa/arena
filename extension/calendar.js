/**
 * Crunchyroll Enhancer - CrOptix
 * Anime Release Calendar & Watchlist Schedule Engine
 */

(() => {
  const ext = typeof browser !== "undefined" ? browser : chrome;

  const ICONS = {
    calendar: `<svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm-7-9h5v5h-5z"/></svg>`,
    starFilled: `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    starOutline: `<svg viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>`,
    close: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
    play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`
  };

  const DAY_NAMES = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const DAY_NAMES_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  // Helper to normalize strings for robust fuzzy matching
  function normalizeTitle(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]/g, "") // keep only alphanumeric
      .trim();
  }

  // State
  let state = {
    isOpen: false,
    currentWeekOffset: 0,
    selectedDayIndex: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
    activeTab: "watchlist", // default to user's watchlist view!
    searchQuery: "",
    watchlistIds: new Set(), // Set of IDs
    watchlistTitles: new Set(), // Set of normalized titles
    scheduleData: {},
    isLoading: false,
    error: null
  };

  // Toast Notification
  function showToast(message, isStarred = true) {
    let toast = document.getElementById("croptix-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "croptix-toast";
      toast.className = "croptix-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `${isStarred ? ICONS.starFilled : ICONS.starOutline} <span>${message}</span>`;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // Load saved watchlist from storage
  async function loadWatchlist() {
    try {
      const res = await ext.storage.local.get(["croptix_calendar_watchlist_ids", "croptix_calendar_watchlist_titles"]);
      if (res && Array.isArray(res.croptix_calendar_watchlist_ids)) {
        state.watchlistIds = new Set(res.croptix_calendar_watchlist_ids);
      }
      if (res && Array.isArray(res.croptix_calendar_watchlist_titles)) {
        state.watchlistTitles = new Set(res.croptix_calendar_watchlist_titles);
      }
    } catch (e) {
      const localIds = localStorage.getItem("croptix_calendar_watchlist_ids");
      const localTitles = localStorage.getItem("croptix_calendar_watchlist_titles");
      if (localIds) {
        try { state.watchlistIds = new Set(JSON.parse(localIds)); } catch (_) {}
      }
      if (localTitles) {
        try { state.watchlistTitles = new Set(JSON.parse(localTitles)); } catch (_) {}
      }
    }
  }

  // Save watchlist
  async function saveWatchlist() {
    const idsArr = Array.from(state.watchlistIds);
    const titlesArr = Array.from(state.watchlistTitles);
    try {
      await ext.storage.local.set({
        croptix_calendar_watchlist_ids: idsArr,
        croptix_calendar_watchlist_titles: titlesArr
      });
    } catch (e) {
      localStorage.setItem("croptix_calendar_watchlist_ids", JSON.stringify(idsArr));
      localStorage.setItem("croptix_calendar_watchlist_titles", JSON.stringify(titlesArr));
    }
  }

  // Check if anime is in watchlist
  function isAnimeInWatchlist(media) {
    if (!media) return false;
    const id = String(media.id || "");
    if (id && state.watchlistIds.has(id)) return true;

    // Check external crunchyroll id
    if (media.externalLinks && Array.isArray(media.externalLinks)) {
      for (const link of media.externalLinks) {
        const match = link.url?.match(/series\/([a-z0-9]+)/i);
        if (match && match[1] && state.watchlistIds.has(match[1].toUpperCase())) return true;
      }
    }

    // Check normalized titles
    const titles = [
      normalizeTitle(media.title?.userPreferred),
      normalizeTitle(media.title?.english),
      normalizeTitle(media.title?.romaji)
    ].filter(Boolean);

    for (const t of titles) {
      if (state.watchlistTitles.has(t)) return true;
      // Partial sub-string matching for long titles
      for (const saved of state.watchlistTitles) {
        if (saved.length >= 5 && (t.includes(saved) || saved.includes(t))) return true;
      }
    }

    return false;
  }

  // Toggle anime on watchlist
  function toggleWatchlistAnime(mediaOrId, title = "") {
    let id = "";
    let normTitle = "";

    if (typeof mediaOrId === "object" && mediaOrId !== null) {
      id = String(mediaOrId.id || "");
      title = mediaOrId.title?.userPreferred || mediaOrId.title?.english || mediaOrId.title?.romaji || title;
      normTitle = normalizeTitle(title);
    } else {
      id = String(mediaOrId || "");
      normTitle = normalizeTitle(title);
    }

    const currentlyIn = (id && state.watchlistIds.has(id)) || (normTitle && state.watchlistTitles.has(normTitle));

    if (currentlyIn) {
      if (id) state.watchlistIds.delete(id);
      if (normTitle) state.watchlistTitles.delete(normTitle);
      showToast(`${title || "Anime"} removido do Calendário`, false);
    } else {
      if (id) state.watchlistIds.add(id);
      if (normTitle) state.watchlistTitles.add(normTitle);
      showToast(`⭐ ${title || "Anime"} adicionado ao Calendário!`, true);
    }

    saveWatchlist();
    renderDayContent();
    updateSeriesStarButtons();
  }

  // Register an anime from Crunchyroll into the watchlist
  function addCrunchyrollWatchlistItem(id, title) {
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
      if (norm && !state.watchlistTitles.has(norm)) {
        state.watchlistTitles.add(norm);
        changed = true;
      }
    }
    if (changed) {
      saveWatchlist();
    }
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
              coverImage {
                extraLarge
                large
                medium
              }
              bannerImage
              format
              genres
              status
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
      while (hasNextPage && page <= 3) {
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

  // Helper: Format Airing Time and Relative Countdown
  function formatAiringTime(airingTimestamp) {
    const now = Math.floor(Date.now() / 1000);
    const diff = airingTimestamp - now;
    const date = new Date(airingTimestamp * 1000);
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (diff < 0) {
      return { timeStr, label: `✅ Disponível (${timeStr})`, isAired: true };
    }

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (hours === 0 && minutes < 60) {
      return { timeStr, label: `⏱️ Em ${minutes}m (${timeStr})`, isTodaySoon: true };
    } else if (hours < 24) {
      return { timeStr, label: `⏱️ Em ${hours}h ${minutes}m (${timeStr})`, isTodaySoon: true };
    } else {
      return { timeStr, label: `📅 Às ${timeStr}`, isAired: false };
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
                <p>Datas e horários de episódios da tua lista e temporada</p>
              </div>
            </div>

            <div class="croptix-filter-tabs">
              <button class="croptix-filter-btn ${state.activeTab === 'watchlist' ? 'active' : ''}" data-tab="watchlist">
                ${ICONS.starFilled}
                <span>Minha Lista de Visionamento</span>
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

    // Event Listeners for Modal
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeCalendar();
    });

    document.getElementById("croptix-cal-close").addEventListener("click", closeCalendar);

    // Filter Tabs
    const filterBtns = backdrop.querySelectorAll(".croptix-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.activeTab = btn.dataset.tab;
        renderDayContent();
      });
    });

    // Search input
    const searchInput = backdrop.querySelector("#croptix-cal-search");
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderDayContent();
    });

    // Week Nav
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

    // Keyboard ESC to close
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

  // Update Week and trigger fetch
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

  // Render Day Tabs (Monday - Sunday)
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

  // Render the anime list for the selected day
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

    const schedules = getSchedulesForDay(state.selectedDayIndex, state.currentWeekOffset);

    if (schedules.length === 0) {
      if (state.activeTab === "watchlist") {
        body.innerHTML = `
          <div class="croptix-empty-state">
            <div class="croptix-empty-icon">${ICONS.starFilled}</div>
            <h3 class="croptix-empty-title">Nenhum anime da sua lista programado para hoje</h3>
            <p class="croptix-empty-desc">
              Não há novos episódios dos animes da tua lista de visionamento programados para este dia.<br>
              Podes alternar para <strong>"Todos os Lançamentos"</strong> para descobrir novos lançamentos ou adicionar animes com a estrela (⭐) diretamente nas páginas da Crunchyroll!
            </p>
            <button class="croptix-empty-btn" id="croptix-switch-all-btn">Ver Todos os Lançamentos</button>
          </div>
        `;
        const switchBtn = body.querySelector("#croptix-switch-all-btn");
        if (switchBtn) {
          switchBtn.addEventListener("click", () => {
            state.activeTab = "all";
            const filterBtns = document.querySelectorAll(".croptix-filter-btn");
            filterBtns.forEach(b => {
              b.classList.toggle("active", b.dataset.tab === "all");
            });
            renderDayContent();
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
      const isStarred = isAnimeInWatchlist(media);
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
            <button class="croptix-card-star-btn ${isStarred ? 'is-starred' : ''}" data-id="${id}" data-title="${encodeURIComponent(title)}" title="${isStarred ? 'Remover do Calendário' : 'Adicionar ao Calendário'}">
              ${isStarred ? ICONS.starFilled : ICONS.starOutline}
            </button>
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

    // Attach star button listeners
    body.querySelectorAll(".croptix-card-star-btn").forEach(starBtn => {
      starBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const animeId = starBtn.dataset.id;
        const animeTitle = decodeURIComponent(starBtn.dataset.title || "");
        toggleWatchlistAnime(animeId, animeTitle);
      });
    });
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
    syncAllWatchlistSources();
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

  // Inject Header Button into Crunchyroll Navigation
  function injectHeaderNavButton() {
    if (document.querySelector(".croptix-calendar-nav-btn")) return;

    const headerNav = document.querySelector(
      ".header-content .erc-header-tile, .app-layout__header--ywueY nav, .erc-sticky-header nav, .header-actions, .erc-authenticated-user-menu-old, .user-menu--ZzPZG, .browse-menu--71A2V, header nav, .erc-header-section"
    );

    const targetContainer = document.querySelector(
      ".container--cq5XE.header-content, .erc-sticky-header, .app-layout__header--ywueY, header"
    );

    const navBtn = document.createElement("button");
    navBtn.className = "croptix-calendar-nav-btn";
    navBtn.title = "Calendário de Lançamentos de Anime (Alt+C)";
    navBtn.innerHTML = `
      ${ICONS.calendar}
      <span>Calendário</span>
    `;

    navBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleCalendar();
    });

    if (headerNav && headerNav.parentElement) {
      headerNav.parentElement.insertBefore(navBtn, headerNav.nextSibling);
    } else if (targetContainer) {
      targetContainer.appendChild(navBtn);
    }

    if (!document.querySelector(".croptix-calendar-floating-btn")) {
      const floatBtn = document.createElement("button");
      floatBtn.className = "croptix-calendar-floating-btn";
      floatBtn.title = "Calendário de Lançamentos (Alt+C)";
      floatBtn.innerHTML = `
        ${ICONS.calendar}
        <span>Calendário</span>
      `;
      floatBtn.addEventListener("click", toggleCalendar);
      document.body.appendChild(floatBtn);
    }
  }

  // Inject Star Button next to "Add to Watchlist" on Series / Episode Pages
  function injectSeriesStarButton() {
    if (document.querySelector(".croptix-series-star-btn")) return;

    // Find the watchlist button or action button group in series header
    const watchlistBtn = document.querySelector(
      '[data-t="watchlist-btn"], [data-t="add-to-watchlist-btn"], [data-t="remove-from-watchlist-btn"], .watchlist-button--Z2oB5, .hero-heading-line__action-buttons, .erc-hero-actions, .series-hero__buttons, .erc-episode-action-buttons'
    );

    if (!watchlistBtn) return;

    // Detect current series title and ID
    const titleElem = document.querySelector("h1, .hero-heading-line__title, .heading--is-xs--bC8hW, .title");
    const currentTitle = titleElem ? titleElem.textContent.trim() : "";
    const seriesIdMatch = window.location.pathname.match(/series\/([a-z0-9]+)/i);
    const seriesId = seriesIdMatch ? seriesIdMatch[1].toUpperCase() : "";

    const isStarred = (seriesId && state.watchlistIds.has(seriesId)) || (currentTitle && state.watchlistTitles.has(normalizeTitle(currentTitle)));

    const starBtn = document.createElement("button");
    starBtn.className = `croptix-series-star-btn ${isStarred ? "is-starred" : ""}`;
    starBtn.title = isStarred ? "No Calendário (Clique para remover)" : "Adicionar ao Calendário de Lançamentos";
    starBtn.innerHTML = `
      ${isStarred ? ICONS.starFilled : ICONS.starOutline}
      <span>${isStarred ? "No Calendário" : "No Calendário"}</span>
    `;

    starBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWatchlistAnime(seriesId, currentTitle);
      updateSeriesStarButtons();
    });

    if (watchlistBtn.parentElement) {
      watchlistBtn.parentElement.insertBefore(starBtn, watchlistBtn.nextSibling);
    }
  }

  // Update Series Star button state
  function updateSeriesStarButtons() {
    const titleElem = document.querySelector("h1, .hero-heading-line__title, .heading--is-xs--bC8hW, .title");
    const currentTitle = titleElem ? titleElem.textContent.trim() : "";
    const seriesIdMatch = window.location.pathname.match(/series\/([a-z0-9]+)/i);
    const seriesId = seriesIdMatch ? seriesIdMatch[1].toUpperCase() : "";

    const isStarred = (seriesId && state.watchlistIds.has(seriesId)) || (currentTitle && state.watchlistTitles.has(normalizeTitle(currentTitle)));

    document.querySelectorAll(".croptix-series-star-btn").forEach(btn => {
      btn.className = `croptix-series-star-btn ${isStarred ? "is-starred" : ""}`;
      btn.innerHTML = `
        ${isStarred ? ICONS.starFilled : ICONS.starOutline}
        <span>No Calendário</span>
      `;
      btn.title = isStarred ? "No Calendário (Clique para remover)" : "Adicionar ao Calendário de Lançamentos";
    });

    // Also update inline list star buttons
    document.querySelectorAll(".croptix-card-inline-star-btn").forEach(btn => {
      const animeTitle = decodeURIComponent(btn.dataset.title || "");
      const animeId = btn.dataset.id || "";
      const starred = (animeId && state.watchlistIds.has(animeId)) || (animeTitle && state.watchlistTitles.has(normalizeTitle(animeTitle)));
      btn.classList.toggle("is-starred", starred);
      btn.innerHTML = starred ? ICONS.starFilled : ICONS.starOutline;
    });
  }

  // Inject Star Buttons into Watchlist Page & Crunchylist cards
  function injectWatchlistCardStarButtons() {
    const cards = document.querySelectorAll(
      ".watchlist-card, .erc-watchlist-item, [data-t='watchlist-card'], .playable-card--GnRbX, .browse-card--esJdT, .erc-browse-cards-collection .card"
    );

    cards.forEach(card => {
      if (card.querySelector(".croptix-card-inline-star-btn")) return;

      const titleElem = card.querySelector("h4, h3, .text--is-m--pqi45, .title, .playable-card__title, .browse-card__title");
      const title = titleElem ? titleElem.textContent.trim() : "";
      if (!title) return;

      const linkElem = card.querySelector("a[href*='/series/']");
      const seriesIdMatch = linkElem ? linkElem.href.match(/series\/([a-z0-9]+)/i) : null;
      const seriesId = seriesIdMatch ? seriesIdMatch[1].toUpperCase() : "";

      // Also automatically add to watchlist recognition!
      addCrunchyrollWatchlistItem(seriesId, title);

      const isStarred = (seriesId && state.watchlistIds.has(seriesId)) || (title && state.watchlistTitles.has(normalizeTitle(title)));

      const starBtn = document.createElement("button");
      starBtn.className = `croptix-card-inline-star-btn ${isStarred ? "is-starred" : ""}`;
      starBtn.dataset.id = seriesId;
      starBtn.dataset.title = encodeURIComponent(title);
      starBtn.title = isStarred ? "Remover do Calendário" : "Adicionar ao Calendário";
      starBtn.innerHTML = isStarred ? ICONS.starFilled : ICONS.starOutline;

      starBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlistAnime(seriesId, title);
      });

      const optionsBtn = card.querySelector(".playable-card-more-options--uBSQV, .dropdown-trigger, [data-t='favorite-btn'], [data-t='watchlist-card-actions']");
      if (optionsBtn && optionsBtn.parentElement) {
        optionsBtn.parentElement.insertBefore(starBtn, optionsBtn);
      } else {
        card.appendChild(starBtn);
      }
    });
  }

  // Sync all possible Watchlist sources on Crunchyroll
  function syncAllWatchlistSources() {
    // 1. Scrape any cards in watchlist / crunchylist page
    const cards = document.querySelectorAll(".watchlist-card, .erc-watchlist-item, [data-t='watchlist-card'], .playable-card--GnRbX");
    cards.forEach(card => {
      const title = card.querySelector("h4, h3, .text--is-m--pqi45, .title")?.textContent?.trim();
      const link = card.querySelector("a[href*='/series/']")?.href;
      const idMatch = link ? link.match(/series\/([a-z0-9]+)/i) : null;
      const id = idMatch ? idMatch[1].toUpperCase() : "";
      if (title || id) {
        addCrunchyrollWatchlistItem(id, title);
      }
    });

    // 2. Read series page if currently on a series
    const seriesTitle = document.querySelector("h1, .hero-heading-line__title")?.textContent?.trim();
    const seriesIdMatch = window.location.pathname.match(/series\/([a-z0-9]+)/i);
    if (seriesTitle || seriesIdMatch) {
      addCrunchyrollWatchlistItem(seriesIdMatch ? seriesIdMatch[1].toUpperCase() : "", seriesTitle);
    }
  }

  // Initialize Calendar
  function init() {
    loadWatchlist();
    injectHeaderNavButton();
    injectSeriesStarButton();
    injectWatchlistCardStarButtons();

    // Listen for custom watchlist events dispatched by crunchyroll.js fetch interceptor
    window.addEventListener("croptix:watchlist-sync", (e) => {
      if (Array.isArray(e.detail)) {
        for (const it of e.detail) {
          addCrunchyrollWatchlistItem(it.id, it.title);
        }
      }
    });

    // Listen for DOM changes in Crunchyroll's single-page app
    const observer = new MutationObserver(() => {
      if (!document.querySelector(".croptix-calendar-nav-btn")) {
        injectHeaderNavButton();
      }
      injectSeriesStarButton();
      injectWatchlistCardStarButtons();
      syncAllWatchlistSources();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Listen for extension messages (e.g. from popup)
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
