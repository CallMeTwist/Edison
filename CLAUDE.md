# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server on port 5173
npm run build        # Production build → dist/
npm run build:dev    # Dev-mode build
npm run preview      # Preview production build

# Quality
npm run lint         # ESLint

# Tests
npm run test         # Vitest (single run)
npm run test:watch   # Vitest in watch mode
npx playwright test  # E2E tests (Playwright)
```

Run a single Vitest test file:
```bash
npx vitest run src/path/to/file.test.ts
```

Path alias `@/` maps to `src/`.

## Architecture

This is a single-page creative portfolio (for "Edison") built as a **world-switching SPA** — there is no router. Navigation between sections uses an animated veil transition managed entirely by `WorldContext`.

### World system

`WorldId` (`src/services/types.ts`) is the core discriminant: `'hub' | 'physio' | 'dev' | 'fitness' | 'art' | 'contact'`. Every world has a visual config (accent color, particle color, veil color, edge glow) declared in `src/config/constants.ts` → `WORLD_CONFIG`.

`src/context/WorldContext.tsx` holds the active world in state and drives transitions: `navigateTo(id)` triggers a 360 ms veil-in, swaps the world, then fades the veil out. World pages are conditionally rendered in `App.tsx`, **keyed** so they fully remount on each navigation.

### Page / feature structure

```
src/
  pages/          # Top-level page components (one per WorldId)
  features/       # Per-world feature logic
    physio/       # 3-D body model + physio data
    developer/
    fitness/
    art/
    contact/
  components/
    ParticleBackground.tsx   # Persistent Three.js galaxy (color shifts per world)
    ui/                      # Shared UI primitives (shadcn/ui + custom)
  layouts/
    TransitionVeil.tsx       # Full-screen color fade between worlds
  context/
    WorldContext.tsx
  config/
    constants.ts   # WORLD_CONFIG, NAV_WORLDS, BP breakpoints, OWNER_NAME
    api.ts         # API base URL / endpoint map (reads VITE_API_URL)
  services/
    types.ts       # All shared TypeScript types
    api.ts         # Axios instance (Laravel Sanctum) + API functions
  hooks/           # useCursor, useMouse, useWindowSize, useSwipeNav, etc.
  styles/
    globals.css    # Fonts (Syne, Space Mono, Caveat, Bebas Neue), reset, keyframes
```

Each `features/<world>/` folder contains a `data.ts` (static content, ready to be replaced with API calls) and a `components/` sub-directory.

### 3-D rendering

`ParticleBackground` and `BodyModel3D` (physio) use **Three.js directly** (not `@react-three/fiber`) via `useEffect` + imperative canvas refs. The fiber/drei packages are installed but unused.

### Backend integration

The app is **fully client-side today**. `src/services/api.ts` has an Axios instance configured for Laravel Sanctum (cookie auth + CSRF) with mock implementations. To connect a real backend: set `VITE_API_URL` in `.env` and uncomment the actual `http.post/get` calls. Vite's dev proxy already forwards `/api` to `VITE_API_URL` (default `http://localhost:8000`).

### Styling approach

All styles are **inline style objects** — Tailwind and shadcn/ui components exist in the project but the portfolio pages themselves use zero Tailwind classes. Shared keyframes (`worldIn`, `fadeUp`, `breathe`, `scan`, `float`, `ripple`, `pulse`, `fadeIn`) live in `src/styles/globals.css`. The custom cursor (`#pf-dot` / `#pf-ring`) is injected by the `useCursor` hook and hidden via `cursor: none` on `body`.
