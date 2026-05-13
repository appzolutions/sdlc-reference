# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, localhost:5173)
npm run build     # Type-check with tsc then bundle with Vite → dist/
npm run preview   # Serve the dist/ build locally
```

There are no tests or linters configured.

## Architecture

Single-page React + TypeScript app built with Vite. It renders an SDLC (Software Development Life Cycle) vocabulary reference — an interactive wheel diagram where each segment is a phase, and clicking a phase shows its terms in a side panel.

**Data flow:**
- `src/data/sdlcData.ts` is the single source of truth — exports `SDLC_DATA: Phase[]`, where each `Phase` has a `terms: Term[]` array. All content lives here.
- `App.tsx` owns all state: `activePhase` (selected wheel segment index), `searchQuery`, and `isDark` (theme toggle persisted to `localStorage`).
- Search is a `useMemo` over all phases/terms, filtering against term text, abbreviation, definition, example, and tags. When `searchResults !== null`, the wheel dims and the content panel switches to search mode.

**Component responsibilities:**
- `Wheel` — SVG donut chart; computes arc paths with `useMemo`; emits `onSelectPhase`
- `PhaseLegend` — clickable phase list below the wheel; mirrors wheel selection
- `ContentPanel` — three render modes: welcome screen, phase detail (terms grouped by `term.category`), or search results
- `TermCard` — renders a single term with optional search-highlight of the query string and an optional phase badge (shown in search results)
- `Header` — search bar + theme toggle

**Styling:**
- CSS Modules per component (e.g., `Wheel.module.css`)
- Global CSS variables in `src/index.css` for theming; dark is default, light theme via `[data-theme="light"]` on `<html>`
- Fonts: Bebas Neue (display), DM Mono (code), Instrument Sans (body) — loaded from Google Fonts in `index.html`

**TypeScript config:** strict mode with `noUnusedLocals` and `noUnusedParameters` — the build will fail if you leave unused variables.

## Extending the data

To add a new SDLC phase or terms, edit `src/data/sdlcData.ts`. Each `Term` requires `term`, `definition`, `tags[]`, and `category`; `abbreviation` and `example` are optional. The `category` field controls how terms are grouped within a phase's detail view.
