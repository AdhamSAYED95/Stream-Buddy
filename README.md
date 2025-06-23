# Stream Buddy

## Overview

**Stream Buddy** is a cross-platform desktop application built with Electron, Vue 3, Vuetify, and Pinia.  
It provides a modern, themeable UI for managing teams, players, and matches, with persistent state, image previews, and robust error handling.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Main Features](#main-features)
3. [State Management](#state-management)
4. [Routing](#routing)
5. [UI Components](#ui-components)
6. [Persistence & Storage](#persistence--storage)
7. [Image Handling](#image-handling)
8. [Error Handling & Logging](#error-handling--logging)
9. [Settings & Presets](#settings--presets)
10. [Development & Build](#development--build)
11. [Customization](#customization)
12. [Extending the App](#extending-the-app)
13. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
electron-app/
├── src/
│   ├── main/           # Electron main process (window, IPC, logging, updates)
│   ├── preload/        # Preload scripts (contextBridge, API exposure)
│   ├── renderer/
│   │   ├── src/
│   │   │   ├── components/   # Vue components (views, rows, panels)
│   │   │   ├── composables/  # Vue composables (notifications, image preview)
│   │   │   ├── constants/    # App-wide constants (views, initial state)
│   │   │   ├── store/        # Pinia store (app state, actions)
│   │   │   ├── router/       # Vue Router config
│   │   │   ├── App.vue       # Root Vue component
│   │   │   ├── main.js       # Vue app entry point
│   │   │   └── ...           # Other files
│   └── ...
├── resources/          # App icons and static assets
├── package.json        # Project metadata and scripts
└── ...
```

---

## Main Features

- **Navigation Drawer** with icons and active state
- **Toolbar** with dynamic view titles and management tools
- **Teams, Players, Matches** management with image/file support
- **Persistent State** using Pinia and Electron Store
- **Theme Switching** (Light/Dark)
- **View Presets** for navigation visibility
- **Settings** for app preferences and data clearing
- **Robust Error Logging** (renderer & main process)
- **Auto-update support** (via electron-updater)
- **Responsive, accessible UI** with Vuetify

---

## State Management

- **Pinia** is used for global state (`appState.js`).
- State includes: teams, players, matches, theme, navigation, presets, app version, update status, etc.
- State is persisted using Electron Store via IPC handlers.
- Actions are provided for updating, clearing, and persisting state.

**Example:**

```js
const store = useAppStateStore()
store.updatePlayers({ playerName: 'John' })
store.clearData('teams')
```

---

## Routing

- **Vue Router** is used with hash mode for Electron compatibility.
- Routes are defined in `src/renderer/src/router/index.js`.
- Each route maps to a view component and has a meta title.

**Example:**

```js
const routes = [
  { path: '/', component: HomeView },
  { path: '/TeamsView', component: BracetsView, meta: { title: 'Brackets View' } },
  ...
]
```

---

## UI Components

- **NavigationPanel.vue**: Main layout with navigation drawer and main content.
- **Toolbar**: Displays current view title and management tools.
- **BracetsView.vue, PlayerView.vue, TodayMatchesView.vue**: Main views for managing data.
- **TeamRow.vue, PlayerRow.vue, TodayPanels.vue**: Subcomponents for editing entities.
- **SettingsView.vue**: App settings, theme, navigation, presets, data clearing, update checks.

---

## Persistence & Storage

- **Electron Store** is used for persistent storage (via IPC).
- All major state (teams, players, matches, settings, presets) is persisted and restored on app start.
- JSON files for export/import are saved to a user-configurable directory.

---

## Image Handling

- **Image selection** uses Electron’s file dialog.
- **Image previews** are loaded as base64 via IPC (`readImage` handler).
- **Reusable composable** (`useImagePreview`) manages preview logic.

---

## Error Handling & Logging

- **Renderer process**:
  - Global error and unhandled promise rejection handlers send logs to main via IPC.
  - Vue’s `app.config.errorHandler` is set for component errors.
- **Main process**:
  - Logs all errors and rejections using `electron-log`.
  - Logs are saved to `userData/logs/main.log`.

---

## Settings & Presets

- **Theme switching** (light/dark) via Vuetify.
- **Navigation drawer** can be mini or full.
- **View visibility** can be toggled per view.
- **Presets**: Save/load combinations of visible views.
- **Clear all data**: Button in Settings clears all input data across views.
- **Reset settings**: Restores all settings to defaults.
- **Update checks**: Manual and automatic update support.

---

## Development & Build

**Install dependencies:**

```sh
npm install
```

**Run in development:**

```sh
npm run dev
```

**Build for production:**

```sh
npm run build
```

**Build for specific platforms:**

```sh
npm run build:win
npm run build:mac
npm run build:linux
```

---
