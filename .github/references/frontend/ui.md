# Frontend UI

Use this for UI, styling, and component decisions under `src/`.

## Stack

- Tailwind CSS 3 with DaisyUI 4 (`light` theme).
- Global CSS: `src/styles/style.css`.
- Fonts: `src/styles/fonts.css` and `src/assets/fonts/`.
- Icons: `@tabler/icons-vue`.
- Shared components: `src/components/`.

## Design Tokens

Prefer existing Tailwind theme colors from `tailwind.config.js`:

- Brand: `brand-orange`, `brand-pink`, `brand-blue`, `brand-black`, `brand-white`.
- Feedback: `success`, `warning`, `info`.
- Surfaces/text: `white-1`, `white-2`, `white-3`, `black-1`, `black-2`, `black-3`, `table-row`.

CSS variables in `src/styles/style.css` mirror these tokens. Do not introduce a separate color system for feature work.

## Component Use

- Reuse global/shared components when they fit: `BaseButton`, `DeleteButton`, `ActionButton`, `PinInput`, `CurrencyInput`, `InputErrors`, `ProgressBar`, `SnackBar`.
- Register only truly global components in `src/main.ts`; otherwise import locally.
- Keep cross-feature reusable UI in `src/components/`.
- Keep feature-specific UI in `src/views/[feature]/components/`.
- Use Tabler icons inside actions/buttons when an icon exists.

## Layout Conventions

- Main feature screens usually use a fixed-height header around `h-[65px]`, content below, and utility classes such as `h-table` where existing tables use them.
- Prefer existing DaisyUI classes (`btn`, `input`, `table`, etc.) combined with brand Tailwind classes.
- Use compact controls for POS workflows; avoid marketing/landing-page layouts inside operational screens.
- Keep text readable on the minimum app window size defined by Electron.
- Use integer-cent money values from data and format them for display with existing currency helpers/composables.

## Styling Rules

- Prefer Tailwind/DaisyUI classes over new scoped CSS.
- Use scoped CSS only for local behavior that cannot be expressed cleanly with existing utilities.
- Preserve existing border radius style (`rounded-md`, small/medium radii) unless matching an existing component.
- Do not add broad global CSS unless it benefits multiple screens.
- Do not introduce new UI libraries unless explicitly requested.
- Do not create new shared components until at least two features need the same UI behavior.
