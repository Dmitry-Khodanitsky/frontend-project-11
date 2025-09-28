### 🧪 Hexlet tests and linter status:

[![Actions Status](https://github.com/Dmitry-Khodanitsky/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Dmitry-Khodanitsky/frontend-project-11/actions)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Dmitry-Khodanitsky_frontend-project-11&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Dmitry-Khodanitsky_frontend-project-11)

---

## 📰 RSS Aggregator

A lightweight web application for subscribing to RSS feeds and reading new posts in one place. The app validates URLs, prevents duplicates, parses RSS through a proxy, and regularly polls sources for new publications. Interface built with Bootstrap 5, localization with `i18next` (Russian by default).

### 🚀 Demo

- Application available at: https://frontend-project-11-delta-green.vercel.app/

## ✨ Features

- **RSS addition by URL** with validation (empty string, valid URL)
- **Duplicate protection**: repeated subscription to the same URL is not allowed
- **RSS parsing** and display:
  - list of feeds (title and description)
  - list of posts with unread/read markers
- **Post viewing** in modal window + "Read full article" link
- **Auto-update (polling)**: periodic polling of feeds for new entries
- **Status messages** (success, network error, invalid RSS, etc.)

## 🛠️ Technologies

- Vite (dev/build/preview)
- Bootstrap 5 (styles and modal windows)
- Axios (network requests)
- i18next (localization)
- Yup (validation)
- on-change (reactive re-rendering)

## 📥 Installation

```bash
git clone https://github.com/Dmitry-Khodanitsky/frontend-project-11
cd frontend-project-11
npm ci
```

## ⚡️ Quick Start 

Requires Node.js 18+.

```bash
# Install dependencies
npm ci

# Development mode (http://localhost:5173)
npm run dev

# Build
npm run build

# Local preview of built version
npm run preview
```

## 🧱 Project Architecture

- `index.html` — page markup and `src/index.js` import
- `src/index.js` — entry point, application initialization
- `src/app.js` — form handlers: URL input, submit, validation, RSS loading, state updates
- `src/view.js` — UI state and re-rendering via `on-change`; form and content rendering; polling start/stop
- `src/ui-components.js` — DOM element generation (cards, lists, list items, modal)
- `src/rss-service.js` — RSS loading and parsing, post updates, polling timers
- `src/utils.js` — `i18next` configuration, `yup` schemas, validation and duplicate checking
- `src/state.js` — factories for base application state and feed/post data
- `styles/style.css` — Bootstrap import

## 🔄 Workflow

1. User enters URL and clicks "Add".
2. Validation occurs via `yup` and duplicate checking.
3. On success — RSS loading through proxy `https://allorigins.hexlet.app/get?...` (CORS bypass).
4. XML is parsed (`DOMParser`), `feed` and `posts` are formed with unique `id`s.
5. Data enters reactive state, `view` re-renders "Feeds" and "Posts" sections.
6. For each feed, polling is enabled: regular polling and adding new posts without page reload.

## ⚠️ Error Handling and Statuses

- `Empty string / invalid URL` — validation messages
- `duplicate` — feed already added
- `invalidRSS` — resource doesn't contain valid RSS
- `networkError` — network errors during loading
- `success` — RSS successfully loaded

Messages are localized in `utils.js` via `i18next`.

## 📝 Implementation Notes

- For RSS, simplified post freshness checking is used — comparison by titles.
- Identifiers are generated via `crypto.randomUUID()` with truncation.
- UI state is stored separately from feed/post data; both wrapped in `on-change` for transparent rendering.

## 📜 Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build
- `npm run preview` — local preview after build

## 💻 Local Development

- Modify code in `src/*`, styles in `styles/style.css`
- Open DevTools console: useful logs are provided in code for parsing/updates

## 📄 License

MIT (unless otherwise specified).
