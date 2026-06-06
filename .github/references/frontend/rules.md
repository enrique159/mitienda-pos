# Frontend Rules

Required rules for `src/`.

## Do

- Use `<script setup lang="ts">` for Vue SFCs.
- Use `src/api/electron/` wrappers for local backend access.
- Keep API/entity interfaces synchronized with backend payloads.
- Keep feature routes under `src/views/[feature]/routes.ts` and register them in `src/router/routes.ts`.
- Use Pinia Composition API stores with `ref` state and explicit actions/setters.
- Use composables for reusable feature logic, computed state, and store coordination.
- Use `storeToRefs` when destructuring reactive store state.
- Keep feature-specific components inside the feature folder.
- Reuse existing components/styles before creating new ones.
- Preserve snake_case fields in interfaces when they map directly to backend data.

## Do Not

- Do not import or use `ipcRenderer` in Vue/renderer files.
- Do not bypass `src/api/electron/` from stores/views unless matching an existing local pattern.
- Do not add a separate frontend HTTP path for local backend actions that belong to Electron IPC.
- Do not add another state management library.
- Do not move feature-only components to `src/components/`.
- Do not add new global components in `src/main.ts` unless they are truly app-wide.
- Do not add a new styling system, icon library, or component library without explicit direction.
- Do not assume generic Vue conventions when existing route/store/API patterns differ.

## New Frontend Feature Checklist

1. If local backend data is needed, add/update backend IPC first.
2. Add/update interfaces in `src/api/interfaces/`.
3. Add/update wrapper in `src/api/electron/` and export it from `index.ts` when reused.
4. Add/update Pinia store if shared state is needed.
5. Add/update composable if reusable logic or derived state is needed.
6. Add feature module/routes/views/components under `src/views/[feature]/`.
7. Register feature routes in `src/router/routes.ts`.
8. Reuse existing shared components, brand tokens, and DaisyUI/Tailwind patterns.
9. Run the smallest relevant validation; if none exists, explain the manual/code-level check performed.
