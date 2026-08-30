# Crunchyroll Enhancer – CrOptix

Browser extension that improves Crunchyroll. This fork adds three new features on top of the original design/subtitle enhancements (v2.0.3).

## New in 2.1.0

### 🕑 Blur for unwatched episodes
Thumbnails of episodes you haven't started (or finished) watching are blurred everywhere on the site, so you don't get spoiled while browsing.
* Hover (or focus) a blurred thumbnail to reveal it.
* Watch progress is read directly from Crunchyroll's playhead API — partially watched episodes are **not** blurred.
* Toggle: popup → **Blur Unwatched Episodes**.

### 🏷️ Filler tags & filters
Episodes are matched against MyAnimeList (via the public [Jikan](https://jikan.moe) API) to detect filler and recap episodes.
* **Filler / Recap** badge on episode thumbnails.
* **Episode filter toolbar** on series pages: `All · Canon · Fillers · Recaps`.
* A **"Filler episode" flag** on the watch page.
* Results are cached locally for a week; title matching is fuzzy (handles "Season 2" / "2nd Season" / roman numerals), but very unusual titles may not match.

### 📅 Release calendar
A floating calendar button (bottom-right corner, hidden on watch pages) opens a month view built from **your own Crunchyroll list**:
* For every series in your watchlist, the latest seasons are fetched and episodes with a scheduled release date are placed on the calendar (up to 60 days ahead; today's new episodes stay visible for 36h).
* Month navigation, day markers, and a list with time, episode number, thumbnail and a link to each series/episode.
* Data is cached for 10 minutes (use the ⟳ button to force a refresh). Requires being logged in to Crunchyroll.
* Toggle: popup → **Release Calendar Button**.

## Install (Firefox)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Pick `manifest.json` from this folder (or install the zipped build: `crunchyroll_enhancer_croptix-2.1.0.zip` via `about:addons` → gear → *Install Add-on From File* for permanent install after signing).

## Install (Chrome / Chromium)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `extension/` folder.

## Structure

```
extension/
├── manifest.json            # MV3 manifest (v2.1.0)
├── background.js            # NEW: proxy for the Jikan (MAL) API
├── content.js               # original design toggle logic
├── crunchyroll.js           # original MAIN-world fetch/XHR patches
├── katamari.js              # original subtitle/katamari module
├── config_init.js / mobile-fix.js
├── features/                # NEW — added in 2.1.0
│   ├── utils.js             # settings, caches, Crunchyroll & Jikan API, DOM scanning
│   ├── blur.js              # unwatched-episode blur
│   ├── fillers.js           # filler/recap badges, filters, watch-page flag
│   └── calendar.js          # release calendar panel
├── css/
│   ├── croptix.css          # original design styles
│   ├── croptix-player.css / croptix-katamari.css
│   └── croptix-features.css # NEW: styles for the three new features
├── popup/                   # extension popup (4 toggles now)
├── icons/
├── fonts/                   # fonts for subtitle rendering
└── subtitle-octopus/        # ASS subtitle renderer
```

## Privacy

Everything runs locally in your browser. The only external requests are to
`api.jikan.moe` (MyAnimeList filler data, series titles only — no account data)
and to AniList/Crunchyroll APIs as in the original extension.

## Tests

`tests/smoke-test.js` runs the feature modules inside jsdom with mocked
Crunchyroll/Jikan APIs (blur rules, filler chips & filters, calendar rendering,
watch-page flag):

```bash
npm install jsdom
NODE_PATH=<node_modules dir> node tests/smoke-test.js
```

