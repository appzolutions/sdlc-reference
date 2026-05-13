# SDLC Vocabulary Reference

An interactive Software Development Life Cycle (SDLC) vocabulary reference built with React, TypeScript, and Vite.

## Overview

A single-page app featuring a clickable wheel diagram where each segment represents an SDLC phase. Selecting a phase displays its terms and definitions in a side panel. Includes full-text search across all terms.

## Features

- Interactive SVG donut-chart wheel with phase segments
- Per-phase term browser, grouped by category
- Full-text search across term names, abbreviations, definitions, examples, and tags
- Dark/light theme toggle (persisted to `localStorage`)
- Search-term highlighting in results

## Getting Started

```bash
npm install
npm run dev       # Start dev server at localhost:5173
npm run build     # Type-check + bundle → dist/
npm run preview   # Serve the dist/ build locally
```

## Project Structure

```
src/
├── data/
│   └── sdlcData.ts          # Single source of truth for all phases and terms
├── components/
│   ├── Wheel/               # SVG donut chart
│   ├── PhaseLegend/         # Clickable phase list below the wheel
│   ├── ContentPanel/        # Phase detail / search results panel
│   ├── TermCard/            # Individual term display with highlight support
│   └── Header/              # Search bar and theme toggle
├── App.tsx                  # Root state: activePhase, searchQuery, isDark
└── index.css                # Global CSS variables and theming
```

## Adding Content

Edit `src/data/sdlcData.ts`. Each `Term` requires:

| Field | Required | Description |
|-------|----------|-------------|
| `term` | Yes | Term name |
| `definition` | Yes | Definition text |
| `tags` | Yes | Array of tag strings |
| `category` | Yes | Groups terms within a phase view |
| `abbreviation` | No | Short form (e.g. "CI") |
| `example` | No | Usage example |

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (bundler + dev server)
- CSS Modules for component-scoped styles
- Google Fonts: Bebas Neue, DM Mono, Instrument Sans