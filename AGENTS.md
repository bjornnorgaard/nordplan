# NordPlan – Agent Guide

Festival artist rating and schedule planning app. SvelteKit + Svelte 5 (runes mode), Firebase Auth/Firestore, Tailwind CSS v4, Skeleton UI v4, deployed on Vercel.

## Developer Commands

```bash
npm run dev          # local dev server
npm run build        # production build (adapter-vercel)
npm run check        # svelte-check type validation (run after edits)
npm run check:watch  # type-check in watch mode
```

No test framework is configured. Use `npm run check` to validate changes.

## Architecture Overview

```
src/lib/data/artists.ts     # Static festival lineup (hardcoded Artist[])
src/lib/firebase.ts         # Firebase init + all Firestore read/write functions
src/lib/stores.svelte.ts    # Single global authStore (Svelte 5 runes)
src/routes/+layout.svelte   # Auth redirect guard + nav shell
src/routes/artists/         # Browse & rate artists
src/routes/schedule/        # User's personal schedule
src/routes/stats/           # Group aggregate ratings (reads all users)
src/routes/login/           # Google sign-in
```

**Data flow:** `onAuthStateChanged` in `authStore` loads per-user ratings and schedule from Firestore on login. All mutations go through `authStore.setRating()` / `authStore.toggleSchedule()` which apply optimistic updates with rollback on error.

## Key Patterns

**Svelte 5 runes are enforced project-wide** (see `svelte.config.js`). Use `$state`, `$derived`, `$effect`, `$props` everywhere — not legacy `writable`/`readable` stores. Store files use the `.svelte.ts` extension to enable runes outside components.

**Artist key** — the canonical identifier used as both a Firestore field key and a schedule entry:
```ts
artistKey(artist) // => `${artist.name}__${artist.day}__${artist.startTime}`
```
Always derive keys via this function; never construct them manually.

**Firestore schema:**
- `ratings/{userId}` → `{ [artistKey]: 1 | 2 | 3 | 4 | 5 }` (rating 0 deletes the field)
- `schedules/{userId}` → `{ artists: string[] }` (array of artist keys)

**Browser guard** — wrap any Firebase/DOM call that runs at module level with `if (browser)` from `$app/environment`. `authStore` and `firebase.ts` already do this.

**Environment variables** — all Firebase config uses `PUBLIC_FIREBASE_*` from `$env/static/public`. Add new public vars with the `PUBLIC_` prefix; never use server-only env vars here (app is fully client-rendered).

## UI Conventions

**Always prefer Skeleton UI v4 components, design tokens, and utility classes** before reaching for plain HTML or custom CSS. Skeleton covers buttons, cards, inputs, modals, chips, badges, and more — use them consistently.

Skeleton UI v4 component classes:
- Buttons: `btn btn-sm preset-filled-primary-500` / `preset-tonal-surface`
- Cards: `card preset-filled-surface-100-900 p-4`
- Inputs: `input`
- Colour tokens: `text-surface-400`, `text-warning-500`, `text-error-500`, `bg-surface-50-950`

Layout is **mobile-first**, max width `max-w-2xl mx-auto`. All pages use `<Seo ... noindex={true} />` since the app is private/group-use.

## Adding Artists

Edit `src/lib/data/artists.ts` — add entries to the `artists` array. Stages are `Nova | Astra | Luna | SideShow`; days are `Thursday | Friday | Saturday`. The `days` and `stages` exports are used for filters/rendering — update them if new values are introduced.


