# Backend Rules

Required rules for `packages/`.

## Do

- Keep backend code in CommonJS `.cjs`.
- Preserve Electron IPC as the backend transport; add listeners/applications instead of HTTP controllers.
- Keep listener and application channel names identical.
- Expose new renderer-facing backend functions through `packages/preload.cjs`.
- Register new application files in `packages/main.cjs`.
- Register new schemas in `packages/app/database/index.cjs`.
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
- Do not bypass `preload.cjs` from the renderer.
- Do not return raw Knex results directly to IPC consumers.
- Do not store currency as floats.
- Do not use ad hoc response shapes.
- Do not create services for local SQLite-only operations.
- Do not add broad shared abstractions unless several modules already need the same behavior.
- Do not change unrelated schemas, seeds, or modules while implementing a feature.
- Do not assume default Electron conventions if they conflict with this repository's IPC bridge.

## New Backend Feature Checklist

1. Add or update schema in `packages/app/database/schemas/` if persistence changes.
2. Register schema in `packages/app/database/index.cjs`.
3. Add seeds in `packages/app/database/seeds/` only when required.
4. Add/update repository methods.
5. Add service only if a remote API is involved.
6. Add/update application IPC handlers.
7. Add/update listener methods.
8. Register listener in `packages/preload.cjs`.
9. Register application in `packages/main.cjs`.
10. Add/update frontend wrapper in `src/api/electron/` when renderer access is needed.
11. Run the smallest relevant validation; if none exists, explain the manual/code-level check performed.
