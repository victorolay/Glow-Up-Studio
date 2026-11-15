# AGENT.md: Glow Up Studio

Guidance for AI coding agents working on this repository. Read this fully before making changes.

## 1. Project Overview

**Glow Up Studio** (working title) is a polished, glamorous dress-up game for teens and adults. "Mature" means sophisticated, stylish, and luxurious in tone. It does **not** mean explicit content. The aesthetic is sleek, modern, high-fashion, with a soft palette and smooth animation.

It runs in the browser on desktop and mobile with tap/click interactions.

**Art direction: photorealistic.** The game uses photorealistic visuals (realistic skin, hair, fabrics, makeup, and backgrounds), not cartoon or flat illustration. The default playable character is an **adult curvy model**, presented in a confident, glamorous, body-positive way. Every garment, swimsuit, and accessory must be designed and fitted for this body type so clothes drape and fit realistically.

**Core game loop:**

`Challenge Select → Skincare → Makeup → Hair → Outfit → Accessories → Photo Shoot → Grading & Results`

Players pick an occasion challenge (e.g. Brunch Date, Black Tie Gala, Hawaii Vacation, Halloween), style a character from skin to shoes, take a themed photo, and get graded on how well the look fits the challenge.

## 2. Tech Stack (defaults; confirm before changing)

| Area | Choice |
|---|---|
| Language | TypeScript (strict mode) |
| Framework | React 18 + Vite |
| State | Zustand |
| Rendering | Layered photorealistic assets (transparent WebP/AVIF) composited in a `<canvas>` or stacked DOM layers; WebGL/PixiJS if blending or masking performance requires it |
| Animation | Framer Motion (UI), GSAP or CSS (character and skincare effects) |
| Audio | Howler.js |
| Styling | Tailwind CSS + CSS variables for theming |
| Persistence | `localStorage` / IndexedDB (saved looks, unlocks, progress) |
| Testing | Vitest + React Testing Library; Playwright for core flow smoke test |
| Lint/format | ESLint + Prettier |

If the repo already uses different tooling, follow the existing tooling instead.

## 3. Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview production build
npm run lint       # lint
npm run typecheck  # tsc --noEmit
npm test           # unit tests
npm run test:e2e   # Playwright smoke tests
```

Run `lint`, `typecheck`, and `test` before finishing any task.

## 4. Suggested Project Structure

```
src/
  app/                 # app shell, routing, global providers
  game/
    stages/            # one folder per stage
      challengeSelect/
      skincare/
      makeup/
      hair/
      outfit/
      accessories/
      photoShoot/
      results/
    engine/
      scoring.ts       # grading logic
      hints.ts         # hint tier logic
      layers.ts        # character layer compositing
    store/             # Zustand stores (character, progress, inventory)
  data/
    challenges/        # challenge definitions (JSON/TS)
    items/             # clothing, makeup, hair, accessory catalogs
    backgrounds/       # photo backgrounds + occasion tags
  components/          # shared UI (buttons, tabs, modals, meters)
  assets/
    character/         # face, body, eyes, lips, skin states
    clothing/ hair/ makeup/ accessories/ backgrounds/ audio/
  styles/
  utils/
tests/
```

Keep stage logic separate from presentation. Game rules (scoring, hints, unlocks) live in `engine/` as pure, testable functions.

## 5. Game Design Rules

### 5.1 Challenge selection
- Challenges are grouped into categories: **Dates, Formal, Casual, Seasonal/Holiday, Vacation, Cultural/Ritual, Work**.
- Each challenge has: `id`, `title`, `category`, `description`, `difficulty (1-3)`, `occasionTags`, `idealBackgrounds`, `hints`, `scoringProfile`.
- Include a **Free Play** mode with no grading.
- Cultural/ritual challenges must use an **inspired-by, respectful** approach. No caricature, no sacred-item trivialization. If unsure, flag it for human review rather than shipping it.

### 5.2 Skincare stage
Sequential, satisfying, ASMR-style interactions:
1. **Skin scan** with an on-screen iPad/tablet UI highlighting concerns (blemishes, dryness, dark circles, oiliness)
2. **Cleanse** (foam, rinse, towel pat)
3. **Blemish treatment** (pimple-popping mechanic)
4. **Exfoliate / mask** (choose mask, timer, peel off)
5. **Serum** (select from shelf, dropper application)
6. **Moisturizer + eye cream** (drag-and-drop)
7. **Sunscreen**

Requirements:
- Skin visibly improves after each step, ending in a "glowing skin" reveal.
- A **skin health meter** feeds into the final grade (Beauty Prep category).
- Pimple popping stays **clean and non-graphic even in photorealistic rendering**: the blemish visibly shrinks and clears with a soft, satisfying animation, with no blood, no realistic pus or fluids, and no gore. Follow with a soothing patch or spot treatment animation.
- Skin states (congested, dry, oily, dull, glowing) are photoreal texture and lighting variants of the same face, blended progressively as steps are completed.
- Pair every interaction with a satisfying sound and haptic-style visual feedback.

### 5.3 Makeup and face
- **Face:** face shape variants, wide **inclusive skin tone** range, freckles, beauty marks, blush.
- **Eyes:** color (picker + natural and fantasy presets), shape (almond, round, hooded, upturned, downturned), size slider, brows.
- **Lips:** size slider, shape presets, finishes (matte, gloss, satin, stain, liner), color palettes.
- **Products:** foundation, concealer, contour, highlighter, eyeshadow, eyeliner styles, mascara/lashes, blush, lip color.
- **Preset looks:** Natural, Soft Glam, Smokey Eye, Bold Lip, Editorial. Players can fine-tune after applying one.

### 5.4 Hair
- Styles: long, short, bobs, curls, waves, braids, buns, ponytails, updos, textured/afro, protective styles, bangs.
- Colors: natural shades, balayage, ombré, highlights, fantasy colors, custom picker, gradients.
- Texture and shine toggles, parting options.

### 5.5 Wardrobe
Categories: **dresses** (gala, evening, cocktail, casual, maxi, office), **tops** (casual, corporate, girly, bodysuits, crop, knitwear), **bottoms** (skirts, trousers, jeans, shorts), **outerwear**, **swimwear/resort**, **shoes** (including barefoot).
- Every item supports color/pattern variants.
- Items carry **fabric and style tags** used by scoring (e.g. `formal`, `casual`, `beach`, `corporate`, `girly`, `evening`, `silk`, `sequin`).
- Items must layer correctly (see section 6).

### 5.6 Accessories
Jewelry (necklaces, earrings, bracelets, rings, anklets, watches), glasses/sunglasses, hair accessories (clips, headbands, scarves, flowers, tiaras, hats), bags, belts, gloves, and themed extras (masks, wings, leis).

### 5.7 Hint system
Three tiers per challenge, each costing progressively more score points:
1. **Vibe** (general direction)
2. **Category** (item types)
3. **Spoiler** (near-complete answer)

Example for Hawaii Vacation: *vibe* "Light, breezy, sun-ready." → *category* "Sundress or bikini, skip heavy fabrics." → *spoiler* "Barefoot, flower in hair, lei, sun-kissed makeup."

Hints are defined in challenge data, never hard-coded in components.

### 5.8 Photo session
- Backgrounds are tagged with occasions (beach, rooftop, ballroom, red carpet, pumpkin patch, café terrace, etc.). Better matches raise the score.
- Poses, camera angles, filters, props, frames.
- Multiple shots, pick a favorite, save to gallery.
- Export as PNG, and share through the Web Share API where available.

### 5.9 Grading

| Category | Weight |
|---|---|
| Challenge fit | 40% |
| Cohesion and color harmony | 20% |
| Beauty prep (skincare + makeup) | 15% |
| Styling details (hair, accessories, shoes) | 15% |
| Photo and background match | 10% |

- Output: 0-100 score, 1-5 star rating, per-category breakdown, and a friendly judge comment (e.g. "Gorgeous dress, but sandals clash with the gala vibe").
- Hint usage subtracts points per tier used.
- Scoring must be **deterministic and explainable**: every point gained or lost maps to a reason shown to the player.
- Keep weights and tag-matching rules in data/config, not scattered through code.

### 5.10 Progression
Coins and stars unlock items and challenges. Daily challenge, weekly themes, saved lookbook. Leaderboard/community gallery is optional and should be built behind a feature flag.

## 6. Character Rendering

- The character is composited from **ordered layers**: body → skin state → makeup → face features → hair (back) → bottoms → tops/dresses → outerwear → shoes → accessories → hair (front).
- Each asset declares its `layer`, `zIndex`, `anchor` points, and `occludes` rules (e.g. a dress hides tops and bottoms).
- Use one shared anchor system so every item fits every face shape, skin tone, and body variation.
- Color/pattern variants should use tinting or masks where possible instead of duplicating assets.
- Target 60fps on mid-range phones. Lazy-load stage assets and use sprite atlases.

### Photorealistic pipeline
- **Base model:** a single adult curvy model with a consistent pose, camera, and lighting setup. All layers are rendered or shot against the same base so they align exactly.
- **Garment fit:** every clothing item is created for the curvy body (bust, waist, hips, thighs) so fabric stretches, folds, and falls naturally. Do not reuse patterns made for a different body shape and scale them.
- **Lighting and shadows:** use a shared lighting rig. Each layer ships with baked shadow and highlight passes (or separate shadow layers) so combined outfits look cohesive and not pasted on.
- **Fabric realism:** silk, satin, sequins, lace, velvet, denim, and linen should show correct sheen, transparency, and texture. Mark sheer fabrics so layers beneath render correctly.
- **Skin tones:** use color-managed tinting or separate renders so skin tone changes look natural (preserve shading, freckles, and undertones) rather than flat recolors.
- **Hair:** photoreal strand detail and shine with separate back/front layers; color changes use masked, luminance-preserving tinting.
- **Makeup:** blend modes (multiply, soft light, overlay) on top of the skin layer so products sit on the skin realistically, with separate shine/gloss highlights for lips and eyes.
- **Asset sources:** photographed or 3D-rendered or AI-generated assets are all acceptable only if licensing is clear (see section 10). Keep a manifest recording each asset's source and license.
- **Formats:** deliver WebP or AVIF with alpha, in 1x and 2x sizes. Generate a low-res blur placeholder for every asset.
- **Fallback:** provide a lower-resolution asset tier for slow devices and connections.

## 7. Data Conventions

Define catalog items with typed schemas, for example:

```ts
type Item = {
  id: string;
  name: string;
  category: 'dress' | 'top' | 'bottom' | 'outerwear' | 'swim' | 'shoes' | 'accessory' | 'hair' | 'makeup';
  layer: LayerId;
  tags: StyleTag[];          // e.g. ['formal','evening','silk']
  variants: Variant[];       // colors/patterns
  unlock: { type: 'free' | 'coins' | 'stars'; cost?: number };
  asset: string;
};

type Challenge = {
  id: string;
  title: string;
  category: ChallengeCategory;
  description: string;
  difficulty: 1 | 2 | 3;
  requiredTags: StyleTag[];
  bonusTags: StyleTag[];
  penaltyTags: StyleTag[];
  idealBackgrounds: string[];
  hints: [string, string, string];
};
```

Adding a new challenge or item should require **only a data change**, not code changes.

## 8. Code Style and Conventions

- TypeScript strict; no `any` without a justification comment.
- Functional components and hooks. Keep components small and single-purpose.
- Pure functions for game logic; side effects only in stores and effects.
- Name files by what they contain (`SkincareStage.tsx`, `scoring.ts`).
- No magic numbers for scoring, timing, or pricing. Put them in config.
- Write unit tests for scoring, hints, unlock logic, and layer occlusion.
- Prefer small, focused commits with clear messages.

## 9. UX, Accessibility, and Performance

- Mobile-first layout, large touch targets (≥44px), works in portrait and landscape.
- Keyboard and screen-reader support for menus and selection UI. Provide alt text/labels for items.
- Respect `prefers-reduced-motion`. Provide mute and volume controls, and never autoplay loud audio.
- Don't rely on color alone to convey state.
- Keep the initial bundle lean; code-split by stage.
- Photorealistic assets are heavy: lazy-load per stage, preload only the next stage, cache with a service worker, and set an asset budget per stage (document it in config).
- Show blur-up placeholders while images load so the character never pops in layer by layer.

## 10. Content and Safety Guidelines

- Tone: elegant, positive, empowering. Judge feedback is encouraging, never body-shaming or insulting.
- No explicit or sexualized content. "Hot date" and swimwear looks stay tasteful and stylish.
- Offer **inclusive** options: broad skin tones, hair textures, face shapes, eye shapes, and body variety where the art budget allows.
- Pimple popping and skincare visuals are clean and non-graphic, even in photorealistic rendering.
- **The model is an adult (18+) and must clearly read as one** in face, styling, and context. Never depict or imply a minor.
- **Body-positive presentation of the curvy model:** confident, glamorous, and respectful. Judge feedback never criticizes the body itself, only style choices (fit to occasion, color, cohesion).
- Swimwear, lingerie-adjacent, and "hot date" looks stay tasteful and fashion-editorial. No nudity, no sexually explicit poses, and no suggestive camera framing in the photo studio.
- **Photoreal likeness rules:** the model must not resemble a real, identifiable person without a signed release. If assets are AI-generated, do not prompt for a real person's likeness, and keep a record of the generation method. If assets are photographed, keep a signed model release on file.
- Photoreal faces must be consistent across every layer (no uncanny artifacts or mismatched features). Flag any asset that looks distorted for human review.
- Cultural and ritual looks must be researched, respectful, and clearly labeled as inspired-by. Flag uncertain items for human review.
- No copyrighted characters, brand logos, or trademarked designs in assets. Use original or properly licensed art and audio only.
- Do not collect personal data. Photos stay on-device unless the player explicitly shares them.

## 11. Milestones

1. **Prototype (vertical slice):** one challenge (Sunny Beach Day) through the full flow, from skincare to grading, with placeholder art.
2. **Core content:** full makeup, hair, wardrobe, and accessory catalogs plus 10+ challenges across categories.
3. **Polish:** animations, sound, photo studio, hint tiers, results screen.
4. **Progression:** unlocks, lookbook, daily challenge.
5. **Optional:** community gallery, leaderboard, seasonal events.

## 12. Definition of Done

A task is done when:
- [ ] It works on desktop and mobile viewport sizes
- [ ] `lint`, `typecheck`, and `test` all pass
- [ ] New logic has unit tests; new data matches the schemas
- [ ] No console errors or warnings
- [ ] Accessibility basics checked (focus order, labels, reduced motion)
- [ ] Content follows section 10
- [ ] Docs or this file updated if conventions changed

## 13. Agent Working Rules

**Do:**
- Read existing code and data before adding new patterns.
- Make the smallest change that solves the task.
- Keep game rules data-driven and testable.
- Ask for clarification when requirements conflict or are ambiguous.
- Leave placeholder assets clearly marked (`placeholder_` prefix) so art can be swapped later.

**Don't:**
- Hard-code challenge logic, scoring weights, or hints in UI components.
- Add heavy dependencies without justification.
- Commit large binary assets without optimizing them.
- Introduce unlicensed assets or fonts.
- Refactor unrelated code or change tooling without being asked.
- Remove or weaken the content and safety rules in section 10.
