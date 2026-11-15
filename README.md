# Glow Up Studio

A polished, glamorous dress-up game for teens and adults — style a character from
skincare to shoes, take a themed photo, and get graded on how well the look fits
the challenge. Photorealistic art direction (placeholder art for now), body-positive,
inclusive, tasteful. See [AGENT.md](./AGENT.md) for the full project spec.

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:5173)
npm run build      # production build
npm run preview    # preview production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit (app + node configs)
npm test           # Vitest unit tests
npm run test:e2e   # Playwright smoke tests (npx playwright install chromium first)
```

## Current state: Milestone 2 — core content

The full core loop (`Challenge Select → Skincare → Makeup → Hair → Outfit →
Accessories → Photo Shoot → Grading & Results`) with **11 graded challenges**
across Dates, Formal, Casual, Seasonal/Holiday, Vacation, and Work, plus Free
Play. The Cultural/Ritual category is intentionally absent until content can be
researched and reviewed (AGENT.md §5.1, §10).

- **Catalog**: 34 garments (dresses, tops, bottoms, swim, outerwear, shoes),
  14 accessories (incl. watches, scarves, beanies), 8 hairstyles with natural +
  fantasy colors + custom picker, 20 makeup products with finishes and 5 preset
  looks, 12 tagged backdrops. All with color/pattern variants and coin/star
  unlock progression.
- **Scoring**: deterministic and explainable — weights, palette-harmony matrix,
  style-group clash rules, hint costs, star thresholds and coin rewards all in
  `src/data/config/scoring.ts`; every point maps to a reason shown on results.
- **Skincare**: 7 sequential ASMR-style steps feeding a skin-health meter;
  effects are clean and non-graphic.
- **Photo studio**: tagged backdrops, poses, filters, multi-shot capture,
  favorite selection, PNG export via canvas compositing.
- **Progression**: coins/stars unlock items and challenges; lookbook persisted
  in IndexedDB (photos never leave the device).
- **Offline**: production service worker caches the hashed app bundle
  (`public/sw.js`); all art is inlined, so the game runs fully offline after
  first load.
- **Budgets**: per-stage asset budgets documented in
  `src/data/config/assets.ts` and enforced by a unit test ceiling per asset.

## Architecture notes

- **Data-driven rules** — challenges, items, hints, scoring weights, and judge
  comments live in `src/data/`. Adding content requires no code changes;
  a data-schema test (`tests/unit/data.test.ts`) guards the invariants.
- **Layer compositing** — the character is stacked DOM layers on a shared
  600×1280 canvas (`src/game/engine/layers.ts` + `components/character/`),
  with blend modes for makeup. Canvas/WebGL can replace this if perf demands.
  The base figure is a stylized-vector illustration (originally a standalone
  SVG) split into body/skin/face layers, with skin tone applied by deriving
  the gradient ramps so shading survives the inclusive tone range.
- **Placeholder art** — every visual is a procedurally generated SVG data URI
  (`src/assets/placeholder/`, ids prefixed `placeholder_`), registered with
  source/license in `src/assets/manifest.ts`. The photoreal asset drop replaces
  generators 1:1 without touching the compositing pipeline.
- **Engines are pure** — `scoring.ts`, `hints.ts`, `layers.ts` are side-effect
  free and unit-tested; stores (`src/game/store/`) hold the only stateful glue.
- **Per-stage asset budgets** — documented in `src/data/config/assets.ts`;
  audio is wired but silent until licensed SFX land (`src/utils/sound.ts`).

## Visual QA workflow

Start the dev server, then run `node scripts/capture.mjs` (beach-challenge
regression), `node scripts/capture-m2.mjs` (office + winter looks), or
`node scripts/canvas-shots.mjs` (element-level screenshots of the character
canvas — best for checking layer alignment). All walk the real UI in headless
Chromium, screenshot to `/tmp/glow-shots/`, and report console errors/warnings.

## Safety & content

Tone and content rules in AGENT.md §10 are binding: adult model, tasteful
presentation, no real-person likeness, no unlicensed assets, judge feedback
never comments on the body. Cultural/ritual challenges are deliberately absent
until researched and reviewed.
