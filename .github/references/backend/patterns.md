# Backend Patterns

Use these patterns for code under `packages/app/**`. Prefer nearby existing files over inventing new shapes.

## Module Flow

`src/api/electron/* -> window.electron -> packages/preload.ts -> *Listeners.ts -> ipcMain channel -> *Application.ts -> *Repository.ts or *Service.ts -> SQLite or remote API`

## Naming

- Feature folders: usually snake_case (`purchase_orders`, `cash_registers`).
- Files: preserve module style (`productsRepository.ts`, `cashRegistersApplication.ts`, `InventoriesRepository.ts`).
- IPC channels: snake_case action names (`get_products`, `create_sale`).
- DB tables/columns: snake_case.

## Schema

- File: `packages/app/database/schemas/[table_name].ts`.
- Export: `exports.createTable = async function(knex) { ... }`.
- Primary key: `table.uuid('id').defaultTo(knex.fn.uuid()).primary()`.
- Foreign keys: explicit UUID columns named `id_[entity]`.
- Common sync fields: `created_at`, `updated_at`, `synced_at`.
- Monetary values: integer cents.
- Use enums for constrained statuses.
- Import `logger` from `../../helpers/index.cjs` and log DB errors.
- Register the schema in `packages/app/database/index.ts` and add it to `Promise.all` in FK-safe order.
- Keep CommonJS `require(...)` paths pointing to emitted `.cjs` files, even from `.ts` sources.
- Keep `// @ts-nocheck` in migrated backend files until the dynamic payload/class typing pass is completed.

## Seeds

- Reusable datasets: `packages/app/database/seeds/[entity]_seed.ts` exporting `exports.[entities] = [...]`.
- Bootstrap insertions live in `packages/app/database/seeds/init_seed.ts`.
- `exports.seed`: development data controlled by `env.SEED`.
- `exports.requiredSeed`: data required for every new DB.
- Delete before replacing complete seed datasets: `await knex('[table]').del()`.
- Serialize JSON fields with `JSON.stringify` when repositories expect SQLite JSON text.

## Listener

- File: `packages/app/modules/[module]/[module]Listeners.ts`.
- Import `{ ipcRenderer }` from `electron`.
- Async pattern: `removeAllListeners(channel)`, `ipcRenderer.on(channel, (_, response) => callback(response))`, then `ipcRenderer.send(channel, payload)`.
- Use `ipcRenderer.sendSync(channel)` only for existing or strictly necessary synchronous reads.
- Register in `packages/preload.ts`: require the emitted `.cjs` listener and spread it into `api`.

## Application

- File: `packages/app/modules/[module]/[module]Application.ts`.
- Import `{ ipcMain }` from `electron` and the module repository.
- Register `ipcMain.on(channel, async (event, payload) => { ... })`.
- Delegate to repositories/services and reply with `event.reply(channel, response)`.
- Existing synchronous handlers use `event.returnValue = response`.
- Transactional workflows create `const trx = await knex.transaction()`, pass `trx`, then `commit` or `rollback`.
- Register in `packages/main.ts` with `require('./app/modules/[module]/[module]Application.cjs')`.

## Repository

- File: `packages/app/modules/[module]/[module]Repository.ts`.
- Initialize Knex with `require('knex')(require('../../database/knexfile.cjs'))`.
- Import helpers from `../../helpers/index.cjs`: commonly `response`, `logger`, `parseBoolean`, `parseArrayJson`, `parseObjectJson`.
- Export async functions with `exports.functionName = async function (...) { ... }`.
- Always return `response(success, message, data)`.
- Log failures with `logger.error({ type, message: \`${err}\`, data: err })`.
- On local updates that affect sync state, set `updated_at: knex.fn.now()` and `synced_at: null`.
- Optional transactions: `const queryBuilder = trx ? knex('[table]').transacting(trx) : knex('[table]')`.
- Normalize SQLite booleans/JSON on reads before returning data to IPC.

## Service

- File: `packages/app/modules/[module]/[module]Service.ts`; create only for external API/service calls.
- Import `Http` from `../../network/Http.cjs`.
- Import route helpers from `../../shared/routes.cjs`; add missing helpers there.
- Use `const http = new Http()` and URLs based on `Http.baseUrl`.
- If auth is required, get headers via `configurationRepository.getToken()`.
- Return the shared `response(...)` shape and log errors.
- Repositories consume services when remote data must be combined with local persistence.
