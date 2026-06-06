# Src Reference - Mitienda POS

Read this file before creating, changing, or reviewing code under `src/`.

## Scope

`src/` is the Vue 3 renderer app. It communicates with the local Electron backend through `window.electron`, normally via wrappers in `src/api/electron/`.

## Stack

| Area | Detail |
| --- | --- |
| Framework | Vue 3 SPA |
| Language | TypeScript + Vue SFC |
| Router | Vue Router with hash history |
| State | Pinia stores, mostly Composition API style |
| UI | Tailwind CSS 3 + DaisyUI 4 + shared local components |
| Icons | `@tabler/icons-vue` |
| Backend bridge | `window.electron` exposed by `electron-build/preload.js` emitted from `packages/preload.ts` |
| Tests | No established automated frontend test suite yet |

## Map

- `src/main.ts`: app bootstrap, Pinia, router, plugins, global components.
- `src/router/`: router setup and root route composition.
- `src/api/electron/`: wrappers around `window.electron`.
- `src/api/interfaces/`: API/entity TypeScript interfaces.
- `src/stores/`: Pinia stores.
- `src/composables/`: reusable feature logic and computed state.
- `src/views/[feature]/`: feature modules, routes, views, local components.
- `src/components/`: shared UI components.
- `src/styles/`: global CSS and fonts.

## Read Next

- For structure and data flow, read [`frontend/architecture.md`](frontend/architecture.md).
- For UI conventions and styling, read [`frontend/ui.md`](frontend/ui.md).
- For required rules and checklists, read [`frontend/rules.md`](frontend/rules.md).

## Default Workflow

1. Identify whether the change touches views, routes, stores, composables, API wrappers, interfaces, or shared UI.
2. Read the nearest existing feature with the same shape before editing.
3. Use `src/api/electron/` wrappers for local backend access; do not call Electron IPC directly from Vue files.
4. Keep feature-specific code under `src/views/[feature]/`; move code to shared folders only when it is truly reused.
