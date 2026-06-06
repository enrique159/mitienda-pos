# Backend Rules

Required rules for `packages/`.

## Do

- Keep backend source code in `.ts`; `.js` files are generated runtime output under `electron-build/`.
- Treat `npm run packages:build` as the TypeScript compiler gate for checked backend files.
- Preserve Electron IPC as the backend transport; add listeners/applications instead of HTTP controllers.
- Keep listener and application channel names identical.
- Prefer TypeScript `import`/`export` in typed backend files.
- Do not use `require(...)` in `packages/**/*.ts`.
- Do not add `// @ts-nocheck`; fix TypeScript errors at the source or type the module boundary explicitly.
- Expose new renderer-facing backend functions through `packages/preload.ts`.
- Register new application files in `packages/main.ts`.
- Register new schemas in `packages/app/database/index.ts`.
- Add or update schema-derived interfaces in `packages/app/domain/interfaces/` when persistence changes.
- Keep runtime references targeting emitted `.js` files.
- Run `npm run packages:build` after editing `packages/` unless `npm run electron:dev` is already running.
- Run `npm run packages:clean` to remove `electron-build/`.
- Use UUID primary keys with `knex.fn.uuid()`.
- Store money as integer cents.
- Treat schemas as the source of truth for backend domain interfaces.
- Use `created_at`, `updated_at`, and `synced_at` on syncable tables.
- Set `synced_at: null` when local updates make data pending sync.
- Return `response(success, message, data)` from repositories/services.
- Use transactions for multi-table writes or stock/payment/order workflows.
- Pass `trx` into repository methods that participate in a transaction.
- Normalize SQLite booleans and JSON before returning data.
- Prefer the closest existing module as the template for new code.

## Do Not

- Do not add Express, Nest, REST controllers, or a separate local backend server for local features.
- Do not edit generated `.js` files in `electron-build/` directly.
- Do not add new CommonJS-style modules when creating typed backend code.
- Do not add new `require(...)` calls in TypeScript source files.
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
3. Add or update schema-derived domain interfaces in `packages/app/domain/interfaces/`.
4. Add seeds in `packages/app/database/seeds/` only when required.
5. Add/update repository methods.
6. Add service only if a remote API is involved.
7. Add/update application IPC handlers.
8. Add/update listener methods.
9. Register listener in `packages/preload.ts`.
10. Register application in `packages/main.ts`.
11. Add/update frontend wrapper in `src/api/electron/` when renderer access is needed.
12. Run the smallest relevant validation; if none exists, explain the manual/code-level check performed.
