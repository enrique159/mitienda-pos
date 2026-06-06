# Backend Rules

Required rules for `packages/`.

## Do

- Keep backend source code in `.ts`; `.cjs` files are generated runtime output under `electron-build/`.
- Treat `npm run packages:build` as transpile-only until backend payloads/classes are fully typed.
- Preserve Electron IPC as the backend transport; add listeners/applications instead of HTTP controllers.
- Keep listener and application channel names identical.
- Keep CommonJS `require`/`exports` in Electron/backend files unless a full module-style migration is planned.
- Keep `// @ts-nocheck` in migrated backend files until a file is fully typed.
- Expose new renderer-facing backend functions through `packages/preload.ts`.
- Register new application files in `packages/main.ts`.
- Register new schemas in `packages/app/database/index.ts`.
- Keep internal `require(...)` paths targeting emitted `.cjs` files.
- Run `npm run packages:build` after editing `packages/` unless `npm run electron:dev` is already running.
- Run `npm run packages:clean` to remove `electron-build/`.
- Use UUID primary keys with `knex.fn.uuid()`.
- Store money as integer cents.
- Use `created_at`, `updated_at`, and `synced_at` on syncable tables.
- Set `synced_at: null` when local updates make data pending sync.
- Return `response(success, message, data)` from repositories/services.
- Use transactions for multi-table writes or stock/payment/order workflows.
- Pass `trx` into repository methods that participate in a transaction.
- Normalize SQLite booleans and JSON before returning data.
- Prefer the closest existing module as the template for new code.

## Do Not

- Do not add Express, Nest, REST controllers, or a separate local backend server for local features.
- Do not edit generated `.cjs` files directly.
- Do not convert isolated files from CommonJS to ESM imports just to satisfy editor suggestions.
- Do not bypass `preload.ts` from the renderer.
- Do not return raw Knex results directly to IPC consumers.
- Do not store currency as floats.
- Do not use ad hoc response shapes.
- Do not create services for local SQLite-only operations.
- Do not add broad shared abstractions unless several modules already need the same behavior.
- Do not change unrelated schemas, seeds, or modules while implementing a feature.
- Do not assume default Electron conventions if they conflict with this repository's IPC bridge.

## New Backend Feature Checklist

1. Add or update schema in `packages/app/database/schemas/` if persistence changes.
2. Register schema in `packages/app/database/index.ts`.
3. Add seeds in `packages/app/database/seeds/` only when required.
4. Add/update repository methods.
5. Add service only if a remote API is involved.
6. Add/update application IPC handlers.
7. Add/update listener methods.
8. Register listener in `packages/preload.ts`.
9. Register application in `packages/main.ts`.
10. Add/update frontend wrapper in `src/api/electron/` when renderer access is needed.
11. Run the smallest relevant validation; if none exists, explain the manual/code-level check performed.
