# Frontend Architecture

Use this for structure and data-flow decisions under `src/`.

## Flow

Data/action flow:

`View/component -> composable or store -> src/api/electron wrapper -> window.electron -> preload -> packages backend IPC`

Feature routing flow:

`src/views/[feature]/routes.ts -> exported [Feature]Routes -> spread into src/router/routes.ts`

## Directory Roles

- `src/main.ts`: app setup, Pinia, router, Toastify, DatePicker, global components.
- `src/router/index.ts`: `createWebHashHistory` router setup.
- `src/router/routes.ts`: root route list and feature route spreads.
- `src/api/electron/*.ts`: small renderer wrappers around `window.electron.*`.
- `src/api/electron/index.ts`: exports public renderer backend wrappers.
- `src/api/interfaces/*.ts`: API/entity payload types; fields often stay snake_case to match backend data.
- `src/stores/*Store.ts`: Pinia state/actions by feature/entity.
- `src/composables/use*.ts`: reusable feature logic, computed state, store coordination.
- `src/views/[feature]/[Feature]Module.vue`: feature route shell.
- `src/views/[feature]/views/*.vue`: page-level feature screens.
- `src/views/[feature]/components/*.vue`: feature-only reusable UI.
- `src/components/`: shared cross-feature UI.
- `src/constants/`, `src/utils/`, `src/types/`: shared values, helpers, and non-API types.

## Naming

- Components/views: PascalCase (`ProductsView.vue`, `BaseButton.vue`).
- Feature route exports: PascalCase plural (`ProductsRoutes`, `SettingsRoutes`).
- Stores: `use[Entity]Store` from `[entity]Store.ts`.
- Composables: `use[Thing].ts` exporting `useThing`.
- API wrappers: follow existing feature file names, often snake_case (`purchase_orders.ts`, `cash_register.ts`).
- Interfaces/types: PascalCase; export shared interfaces from `src/api/interfaces/index.ts`.

## Patterns

### Electron API Wrapper

- Add/update `src/api/electron/[feature].ts`.
- Export small functions that call `window.electron.[method](...)`.
- Use types from `src/api/interfaces/` for payloads.
- Export the wrapper from `src/api/electron/index.ts` when reused.

### Interface

- Add entity/API types in `src/api/interfaces/[feature].ts`.
- Keep backend-aligned field names; snake_case is acceptable because backend payloads are snake_case.
- Monetary fields are `number` values in cents unless existing code says otherwise.
- Export shared types from `src/api/interfaces/index.ts`.

### Store

- Use Pinia Composition API: `defineStore('name', () => { ... })`.
- Use `ref` for state and explicit setter/action functions.
- Return all state/actions used by consumers.
- Keep complex derived state in composables when it combines stores or significant calculations.

### Composable

- Add `src/composables/use[Thing].ts`.
- Use `storeToRefs` when destructuring store state reactively.
- Prefer `computed` for derived state.
- Keep data access in wrappers/composables/stores, not generic UI components.

### Feature Module

- Typical shape: `src/views/[feature]/[Feature]Module.vue`, `routes.ts`, `views/`, `components/`.
- Add child routes in feature `routes.ts`, then spread the exported routes into `src/router/routes.ts`.
- Page layout belongs in `views/`; repeated feature UI belongs in `components/`.
