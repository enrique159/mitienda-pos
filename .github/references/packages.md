# Packages Reference - Mitienda POS

Read this file before creating, changing, or reviewing code under `packages/`.

## Scope

`packages/` contains the Electron main process, preload bridge, and local backend. It is not an HTTP server. Backend features are exposed to the Vue renderer through Electron IPC.

## Stack

| Area | Detail |
| --- | --- |
| Runtime | Electron main/preload |
| Source format | TypeScript `.ts` with CommonJS `require`/`exports` |
| Runtime output | Generated CommonJS `electron-build/**/*.cjs` |
| Architecture | Feature-based layered modular monolith embedded in Electron |
| Transport | Electron IPC (`ipcRenderer` -> `ipcMain`) |
| Persistence | SQLite via Knex |
| Remote API | `packages/app/network/Http.ts` source, emitted to `.cjs` |
| Local files/assets | `resources/` and app-specific local paths |
| Tests | No established automated backend test suite yet |

`npm run packages:build` transpiles `.ts` sources to runtime `.cjs` files under `electron-build/` and copies required runtime JSON files. `npm run packages:clean` removes `electron-build/`. The build is intentionally transpile-only for now; full backend type-checking should be introduced after dynamic payloads/classes are typed.

## Map

- `packages/main.ts`: Electron source entrypoint; emits `electron-build/main.cjs` for runtime.
- `packages/preload.ts`: preload source; emits `electron-build/preload.cjs` for runtime.
- `packages/env.json`: runtime configuration for Electron/backend code.
- `packages/app/database/index.ts`: creates DB, tables, and seeds.
- `packages/app/database/knexfile.ts`: SQLite/Knex configuration.
- `packages/app/database/schemas/*.ts`: schema definitions.
- `packages/app/database/seeds/*.ts`: seed datasets and bootstrap data.
- `packages/app/modules/[feature]/*Application.ts`: `ipcMain` handlers.
- `packages/app/modules/[feature]/*Listeners.ts`: `ipcRenderer` bridge methods.
- `packages/app/modules/[feature]/*Repository.ts`: Knex persistence and module business rules.
- `packages/app/modules/[feature]/*Service.ts`: optional remote service/API calls.
- `packages/app/helpers/`: shared response/logging/date/currency/file/DB helpers.
- `packages/app/shared/`: routes, enums, errors, constants.
- `packages/app/utils/`: printer, tickets, image download, database utilities.

## Read Next

- For implementation patterns, read [`backend/patterns.md`](backend/patterns.md).
- For required rules and anti-patterns, read [`backend/rules.md`](backend/rules.md).

## Default Workflow

1. Identify whether the change touches Electron shell (`main.ts`, `preload.ts`), local backend (`packages/app/**`), or both.
2. Read the closest existing module with the same shape before editing.
3. Preserve the IPC path: `preload listener -> ipcMain application -> repository/service -> SQLite or remote API`.
4. Keep changes scoped to the feature/module unless a shared helper or schema registration is required.
5. Run `npm run packages:build` after source changes when not using `npm run electron:dev`.
6. Use `npm run electron:dev` for Vite + Electron development; Electron restarts when `packages/**/*.ts` or `packages/**/*.json` changes.
7. Run `npm run packages:clean` when `electron-build/` needs to be removed.
