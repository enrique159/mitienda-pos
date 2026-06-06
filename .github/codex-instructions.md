# Mitienda POS Agent Instructions

Purpose: keep this file short. Use it as a routing and pattern reference, then inspect the specific files you will edit.

## Stack

- App: Electron + Vue 3 POS.
- Backend/local runtime: Electron main/preload, `.ts` source with CommonJS `require`/`exports` emitted to `electron-build/**/*.cjs`, SQLite, Knex.
- Frontend/renderer: Vue 3 SPA, TypeScript, Composition API, Pinia, Tailwind CSS 3, DaisyUI 4.
- Backend architecture: feature-based layered modular monolith embedded in Electron.

If `AGENTS.md` points to `.github/references/*.md` and those files are missing, continue with this file plus nearby source code.

## Directory Map

- `packages/main.ts`: Electron source entrypoint; emits `electron-build/main.cjs` runtime.
- `packages/preload.ts`: preload source; emits `electron-build/preload.cjs` runtime.
- `packages/env.json`: Electron/backend runtime values.
- `packages/app/database/index.ts`: creates the local SQLite DB and registers schemas/seeds.
- `packages/app/database/knexfile.ts`: SQLite/Knex config.
- `packages/app/database/schemas/*.ts`: table definitions.
- `packages/app/database/seeds/*.ts`: initial/required seed data.
- `packages/app/modules/[feature]/*Application.ts`: `ipcMain` handlers and orchestration.
- `packages/app/modules/[feature]/*Listeners.ts`: `ipcRenderer` bridge methods consumed by preload.
- `packages/app/modules/[feature]/*Repository.ts`: Knex persistence and module-level business rules.
- `packages/app/modules/[feature]/*Service.ts`: optional remote API/service integration.
- `packages/app/helpers/`: response shape, logging, dates, currency, files, QR, DB cleanup.
- `packages/app/network/Http.ts`: remote HTTP client wrapper.
- `packages/app/shared/`: backend routes, enums, errors, constants.
- `packages/app/utils/`: backend utilities such as printer, tickets, image download, DB actions.
- `src/api/electron/`: typed renderer wrappers around `window.electron`.
- `src/api/interfaces/`: frontend entity interfaces.
- `src/stores/`: Pinia stores.
- `src/views/`: feature-based Vue modules, routes, pages, components.
- `resources/`: Electron-packaged runtime assets.
- `public/`: Vite public assets.
- `scripts/`: build/preparation scripts.

## Backend Flow

Renderer flow:

`Vue view/store -> src/api/electron/* -> window.electron -> packages/preload.ts -> *Listeners.ts -> ipcMain channel -> *Application.ts -> *Repository.ts or *Service.ts -> SQLite or remote API`

Naming:

- Module folders: usually snake_case, e.g. `purchase_orders`, `cash_registers`.
- Module files: follow existing module prefix style, e.g. `purchaseOrdersRepository.ts`, `cashRegistersApplication.ts`, `InventoriesRepository.ts`.
- IPC channels: snake_case action names, e.g. `get_products`, `create_sale`.
- DB tables/columns: snake_case.

## Core Conventions

- Do not introduce an Express/Nest/local HTTP server for backend features; backend APIs are Electron IPC channels.
- Keep backend source files as `.ts`; generated `electron-build/**/*.cjs` files are runtime output and should not be edited.
- Keep `require(...)` paths inside `packages` pointing to emitted `.cjs` files.
- Keep CommonJS `require`/`exports` in Electron/backend files for now; do not convert isolated files to ESM imports to satisfy editor suggestions.
- Keep `// @ts-nocheck` in migrated backend files until the file is intentionally typed.
- Use `npm run electron:dev` for Vite + Electron with Electron restart on `packages/**/*.ts` changes.
- `npm run packages:build` is transpile-only for now; full backend type-checking requires typing existing dynamic payloads/classes first.
- Use `npm run packages:clean` to remove the generated `electron-build/` runtime folder.
- Schema primary keys use `table.uuid('id').defaultTo(knex.fn.uuid()).primary()`.
- Foreign keys are explicit UUID columns named `id_[entity]`, e.g. `id_company`, `id_branch`.
- Store money as integer cents, not floats.
- Use `created_at`, `updated_at`, and `synced_at` on syncable tables; set `synced_at: null` after local updates.
- Boolean and JSON values read from SQLite must be normalized in repositories with helpers such as `parseBoolean`, `parseArrayJson`, and `parseObjectJson`.
- Repositories return the shared `response(success, message, data)` shape; do not return raw Knex results directly to IPC.
- IPC listener/application channel names must match exactly, and preload must expose the listener function through `window.electron`.
- Frontend API wrappers in `src/api/electron/` should call `window.electron.*`; stores/views should prefer those wrappers over direct IPC access.
- Pinia stores use the Composition API style (`defineStore(..., () => { ... })`) with `ref` state and explicit setters/actions.
- Preserve existing route/module style: feature routes live under `src/views/[feature]/routes.ts` and are spread into `src/router/routes.ts`.

## Backend Patterns

### Schema

When adding a table:

- Create `packages/app/database/schemas/[table_name].ts`.
- Export `exports.createTable = async function(knex) { ... }`.
- Use `knex.schema.createTable('[table_name]', (table) => { ... })`.
- Import `logger` from `../../helpers/index.cjs` and log DB errors with `{ type: 'DB', message, error }`.
- Common fields: UUID primary key with `knex.fn.uuid()`, foreign keys, `status` enum where needed, `created_at`, `updated_at`, `synced_at`.
- Register the schema in `packages/app/database/index.ts` and add `schema.createTable(knex)` to the `Promise.all` in FK-safe order.

### Seeds

When adding seed data:

- Reusable datasets go in `packages/app/database/seeds/[entity]_seed.ts` as `exports.[entities] = [...]`.
- Import datasets in `packages/app/database/seeds/init_seed.ts`.
- Use `exports.seed` for development seed data controlled by `env.SEED`.
- Use `exports.requiredSeed` for data required whenever a new DB is initialized.
- Use `await knex('[table]').del()` before replacing a full dataset.
- Serialize JSON fields with `JSON.stringify` when existing repositories expect SQLite JSON text.

### Listener

When adding renderer-to-main IPC API:

- Create `packages/app/modules/[module]/[module]Listeners.ts`.
- Import `{ ipcRenderer }` from `electron`.
- Export methods used by preload.
- Async pattern: `removeAllListeners(channel)`, `ipcRenderer.on(channel, (_, response) => callback(response))`, then `ipcRenderer.send(channel, payload)`.
- Use `ipcRenderer.sendSync(channel)` only for existing/strictly necessary sync reads.
- Register the listener in `packages/preload.ts`: require the emitted `.cjs` listener and spread it into `api`.

### Application

When adding main-process handlers:

- Create `packages/app/modules/[module]/[module]Application.ts`.
- Import `{ ipcMain }` from `electron` and the module repository.
- Register `ipcMain.on(channel, async (event, payload) => { ... })`.
- Delegate to repositories/services and respond with `event.reply(channel, response)`.
- Existing sync handlers use `event.returnValue = response`.
- Transactional workflows create `const trx = await knex.transaction()`, pass `trx` to repositories, then `commit` or `rollback`.
- Register the application in `packages/main.ts` with `require('./app/modules/[module]/[module]Application.cjs')`.

### Repository

When adding persistence/business methods:

- Create `packages/app/modules/[module]/[module]Repository.ts`.
- Initialize Knex with `require('knex')(require('../../database/knexfile.cjs'))`.
- Import helpers from `../../helpers/index.cjs`: commonly `response`, `logger`, `parseBoolean`, `parseArrayJson`, `parseObjectJson`.
- Export async functions as `exports.functionName = async function (...) { ... }`.
- Always return `response(success, message, data)`.
- Log failures with `logger.error({ type, message: \`${err}\`, data: err })`.
- On updates that affect sync state, set `updated_at: knex.fn.now()` and `synced_at: null`.
- For optional transactions: `const queryBuilder = trx ? knex('[table]').transacting(trx) : knex('[table]')`.
- Normalize SQLite booleans/JSON on reads when needed.

### Service

When adding remote integration:

- Add `packages/app/modules/[module]/[module]Service.ts` only for external API/service calls.
- Import `Http` from `../../network/Http.cjs`.
- Import route helpers from `../../shared/routes.cjs`; add a helper there if missing.
- Import `response` and `logger` from `../../helpers/index.cjs`.
- Use `const http = new Http()` and build URLs with `Http.baseUrl`.
- If auth is required, get headers via `configurationRepository.getToken()`.
- Catch errors and return `response(false, message, err.errors || err.message || err)`.
- Repositories consume services when remote data is combined with local persistence.

## Agent Execution Protocol

For every feature, fix, test, refactor, or codebase question:

1. Identify scope: `packages/` backend/Electron, `src/` renderer/frontend, or both.
2. Read this file plus the nearby files that match the change path. If `.github/references/*.md` files are missing, do not block; use this file and source code as the reference.
3. Follow existing project patterns before introducing new abstractions, libraries, folders, or naming styles.
4. For backend changes, preserve the IPC flow: `preload` listener -> `ipcMain` application -> repository/service -> SQLite or remote API.
5. For frontend changes, preserve the feature layout under `src/views/`, wrappers under `src/api/electron/`, interfaces under `src/api/interfaces/`, and Pinia stores under `src/stores/`.
6. Do not assume default Electron or Vue conventions when they conflict with this file or nearby code.
7. Implement, then run the smallest relevant validation available for the changed area; if validation cannot run, report why.
8. Do not run any build or test commands unless it has been requested or is necessary for validation; prefer lightweight validations such as manual UI checks, console logs, or direct function calls in a temporary script.
