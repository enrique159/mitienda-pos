# Packages Reference - Mitienda POS

Read this file before creating, changing, or reviewing code under `packages/`.

## Scope

`packages/` contains the Electron main process, preload bridge, and local backend. It is not an HTTP server. Backend features are exposed to the Vue renderer through Electron IPC.

## Stack

| Area | Detail |
| --- | --- |
| Runtime | Electron main/preload |
| Module format | CommonJS `.cjs` |
| Architecture | Feature-based layered modular monolith embedded in Electron |
| Transport | Electron IPC (`ipcRenderer` -> `ipcMain`) |
| Persistence | SQLite via Knex |
| Remote API | `packages/app/network/Http.cjs` |
| Local files/assets | `resources/` and app-specific local paths |
| Tests | No established automated backend test suite yet |

## Map

- `packages/main.cjs`: Electron entrypoint; initializes DB/window and requires `*Application.cjs`.
- `packages/preload.cjs`: exposes `window.electron` by spreading `*Listeners.cjs`.
- `packages/env.json`: runtime configuration for Electron/backend code.
- `packages/app/database/index.cjs`: creates DB, tables, and seeds.
- `packages/app/database/knexfile.cjs`: SQLite/Knex configuration.
- `packages/app/database/schemas/*.cjs`: schema definitions.
- `packages/app/database/seeds/*.cjs`: seed datasets and bootstrap data.
- `packages/app/modules/[feature]/*Application.cjs`: `ipcMain` handlers.
- `packages/app/modules/[feature]/*Listeners.cjs`: `ipcRenderer` bridge methods.
- `packages/app/modules/[feature]/*Repository.cjs`: Knex persistence and module business rules.
- `packages/app/modules/[feature]/*Service.cjs`: optional remote service/API calls.
- `packages/app/helpers/`: shared response/logging/date/currency/file/DB helpers.
- `packages/app/shared/`: routes, enums, errors, constants.
- `packages/app/utils/`: printer, tickets, image download, database utilities.

## Read Next

- For implementation patterns, read [`backend/patterns.md`](backend/patterns.md).
- For required rules and anti-patterns, read [`backend/rules.md`](backend/rules.md).

## Default Workflow

1. Identify whether the change touches Electron shell (`main.cjs`, `preload.cjs`), local backend (`packages/app/**`), or both.
2. Read the closest existing module with the same shape before editing.
3. Preserve the IPC path: `preload listener -> ipcMain application -> repository/service -> SQLite or remote API`.
4. Keep changes scoped to the feature/module unless a shared helper or schema registration is required.
