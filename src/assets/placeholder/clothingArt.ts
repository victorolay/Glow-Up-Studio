import type { AssetParams } from './params';
import { shade, toUri } from './primitives';
import type { PoseId } from '@/game/types';
import { type StyleCatalogEntry } from './shared';
import {
  castShadowColor,
  defsBlock,
  fittedPantsPath,
  ramp,
  type FabricRamp,
} from './shared';
import { EXTRA_CLOTHING_CATALOG, EXTRA_CLOTHING_GENERATORS } from './clothingArtExtra';

/*
 * Anatomically tailored wardrobe generators authored exclusively for the
 * 600×1280 curvy hourglass figure in `figure.ts`. Accessories live in
 * `accessoriesArt.ts`; shared fabric/metal helpers in `shared.ts`.
 *
 * Every path aligns to the exact landmarks of `figure.ts`:
 *  - Head & Face: oval x254–346, y84–208; eyes (280.8, 135.5) & (319.2, 135.5);
 *    nose bridge (300, 133); earlobes (250, 162) & (350, 162)
 *  - Neck & Collarbone: neck x277–323 (y192–253), collarbones x224–376 (y270)
 *  - Shoulders & Armpits: shoulders x196–404 (y282), armpits x219–381 (y330)
 *  - Bust: apexes (255, 382) & (345, 382), outer span x211–389 (y376–398)
 *  - Waist & Navel: narrowest waist x243–357 (y480–490), navel (300, 521)
 *  - Hips & Pelvis: fullest hip x186–414 (y623), crotch (300, 677)
 *  - Arms & Wrists: right wrist (relaxed in all poses) x407–429 (y536–556);
 *    left wrist x171–193 (relaxed), x212–224 (handOnHip), x186–218 (twirl)
 *  - Legs & Feet: separate leg paths from crotch y669 to ankles y1165
 *    (left x236–267, right x336–365), feet x220–280 & x323–383 (y1213–1237)
 */



/* ---------- Exact Anatomical Body-Contour Path Helpers ---------- */

/**
 * Generates an exact torso garment outline from a neckline path down to a chosen hem Y.
 * `hemY` can be 430 (cropped), 485 (natural waist), 535 (high hip), 585 (mid hip), or 625 (full hip).
 */
export function torsoContour(opts: {
  neckPath: string;
  leftShoulderX?: number;
  shoulderY?: number;
  hemY: number;
  ease?: number;
  hemCurve?: number;
}): string {
  const e = opts.ease ?? 1.5;
  const sxL = (opts.leftShoulderX ?? 196) - e;
  const sxR = 600 - sxL;
  const sy = opts.shoulderY ?? 282;
  const hem = opts.hemY;
  const dip = opts.hemCurve ?? 12;

  const hemHalfW =
    hem <= 440
      ? 68 - ((hem - 398) / 42) * 8
      : hem <= 488
        ? 59 - ((hem - 440) / 48) * 2
        : hem <= 545
          ? 57 + ((hem - 488) / 57) * 26
          : hem <= 625
            ? 83 + ((hem - 545) / 80) * 31
            : 114;

  const hxL = 300 - hemHalfW - e;
  const hxR = 300 + hemHalfW + e;

  const leftSide =
    hem <= 445
      ? `L ${sxL} ${sy} L ${219 - e} 330 C ${216 - e} 358, ${209 - e} 378, ${213 - e} 398 C ${217 - e} 418, ${hxL} ${hem - 10}, ${hxL} ${hem}`
      : hem <= 515
        ? `L ${sxL} ${sy} L ${219 - e} 330 C ${216 - e} 358, ${209 - e} 378, ${213 - e} 398 C ${217 - e} 418, ${234 - e} 438, ${241 - e} 464 C ${245 - e} 480, ${hxL} ${hem - 8}, ${hxL} ${hem}`
        : `L ${sxL} ${sy} L ${219 - e} 330 C ${216 - e} 358, ${209 - e} 378, ${213 - e} 398 C ${217 - e} 418, ${234 - e} 438, ${241 - e} 464 C ${246 - e} 482, ${245 - e} 498, ${238 - e} 514 C ${224 - e} 544, ${hxL} ${hem - 24}, ${hxL} ${hem}`;

  const rightSide =
    hem <= 445
      ? `C ${hxR} ${hem - 10}, ${383 + e} 418, ${387 + e} 398 C ${391 + e} 378, ${384 + e} 358, ${381 + e} 330 L ${sxR} ${sy}`
      : hem <= 515
        ? `C ${hxR} ${hem - 8}, ${355 + e} 480, ${359 + e} 464 C ${366 + e} 438, ${383 + e} 418, ${387 + e} 398 C ${391 + e} 378, ${384 + e} 358, ${381 + e} 330 L ${sxR} ${sy}`
        : `C ${hxR} ${hem - 24}, ${376 + e} 544, ${362 + e} 514 C ${355 + e} 498, ${354 + e} 482, ${359 + e} 464 C ${366 + e} 438, ${383 + e} 418, ${387 + e} 398 C ${391 + e} 378, ${384 + e} 358, ${381 + e} 330 L ${sxR} ${sy}`;

  return `M ${sxL} ${sy} ${leftSide} C ${hxL + 40} ${hem + dip}, ${hxR - 40} ${hem + dip}, ${hxR} ${hem} ${rightSide} ${opts.neckPath} Z`;
}

/** Exact bust sculpting & cleavage contouring matching figure.ts (apexes 255,382 & 345,382). */
export function bustContour(r: FabricRamp, opacity = 0.92): string {
  return `
    <g opacity="${opacity}">
      <ellipse cx="255" cy="382" rx="39" ry="41" fill="url(#fBustL)" />
      <ellipse cx="345" cy="382" rx="39" ry="41" fill="url(#fBustR)" />
      <path d="M 297 348 C 301 372, 301 398, 299 415 C 303 398, 304 372, 297 348 Z" fill="${r.deep}" opacity="0.46" filter="url(#cBlur2)" />
      <path d="M 222 414 C 246 432, 277 430, 296 416 C 280 424, 249 425, 222 414 Z" fill="${r.deep}" opacity="0.40" filter="url(#cBlur4)" />
      <path d="M 378 414 C 354 432, 323 430, 304 416 C 320 424, 351 425, 378 414 Z" fill="${r.deep}" opacity="0.44" filter="url(#cBlur4)" />
    </g>
  `;
}

/** Pose-aware left & right sleeves matching figure.ts arm paths. */
export function poseSleeves(pose: PoseId | undefined, length: 'cap' | 'short' | 'threeQuarter' | 'long', ease = 2.5): { left: string; right: string } {
  const e = ease;
  const rCap = `M 376 268 C 396 272, 416 290, 424 322 C 414 330, 400 334, 378 334 L 376 282 Z`;
  const rShort = `M 376 268 C 402 274, 422 304, 431 352 C 418 358, 404 358, 392 352 L 378 334 L 376 282 Z`;
  const r34 = `M 376 268 C 406 274, 426 306, 434 352 C 440 392, 444 430, 441 462 C 428 468, 410 468, 397 462 C 397 424, 397 380, 378 334 L 376 282 Z`;
  const rLong = `M 375 268 C ${406 + e} 274, ${425 + e} 306, ${432 + e} 348 C ${439 + e} 390, ${444 + e} 426, ${441 + e} 458 C ${438 + e} 490, ${434 + e} 524, ${431 + e} 548 C 422 554, 410 552, 405 544 C 402 510, 397 474, 398 440 C 399 406, 391 366, 378 334 L 376 282 Z`;

  const right = length === 'cap' ? rCap : length === 'short' ? rShort : length === 'threeQuarter' ? r34 : rLong;

  if (pose === 'twirl') {
    const lCap = `M 228 268 C 212 246, 202 222, 198 202 C 210 198, 224 202, 234 214 L 246 264 Z`;
    const lShort = `M 228 268 C 214 244, 202 214, 194 182 C 206 178, 220 182, 228 194 L 246 264 Z`;
    const l34 = `M 228 268 C 214 244, 202 214, 194 182 C 188 158, 185 138, 186 124 C 198 122, 212 126, 220 134 C 222 160, 228 192, 246 264 Z`;
    const lLong = `M 228 268 C 214 244, 202 214, 194 182 C 187 156, 183 132, 185 114 C 196 112, 212 114, 220 122 C 221 148, 226 180, 234 208 L 248 264 Z`;
    return { left: length === 'cap' ? lCap : length === 'short' ? lShort : length === 'threeQuarter' ? l34 : lLong, right };
  }

  if (pose === 'handOnHip' || pose === 'vogue') {
    const lCap = `M 226 268 C 202 276, 184 302, 174 328 C 184 336, 198 336, 218 334 L 224 282 Z`;
    const lShort = `M 226 268 C 200 276, 178 308, 166 352 C 178 358, 194 356, 202 346 L 222 334 L 224 282 Z`;
    const l34 = `M 226 268 C 198 276, 176 308, 162 354 C 154 388, 152 418, 164 446 C 178 446, 190 438, 194 426 C 186 406, 188 384, 202 348 L 224 332 L 224 282 Z`;
    const lLong = `M 226 268 C 198 276, 176 308, 162 354 C 152 388, 152 412, 158 434 C 166 458, 184 494, 206 544 C 216 546, 225 540, 225 530 C 214 502, 202 472, 190 444 C 184 426, 184 406, 198 370 L 224 332 L 224 282 Z`;
    return { left: length === 'cap' ? lCap : length === 'short' ? lShort : length === 'threeQuarter' ? l34 : lLong, right };
  }

  const lCap = `M 224 268 C 204 272, 184 290, 176 322 C 186 330, 200 334, 222 334 L 224 282 Z`;
  const lShort = `M 224 268 C 198 274, 178 304, 169 352 C 182 358, 196 358, 208 352 L 222 334 L 224 282 Z`;
  const l34 = `M 224 268 C 194 274, 174 306, 166 352 C 160 392, 156 430, 159 462 C 172 468, 190 468, 203 462 C 203 424, 203 380, 222 334 L 224 282 Z`;
  const lLong = `M 225 268 C ${194 - e} 274, ${175 - e} 306, ${168 - e} 348 C ${161 - e} 390, ${156 - e} 426, ${159 - e} 458 C ${162 - e} 490, ${166 - e} 524, ${169 - e} 548 C 178 554, 190 552, 195 544 C 198 510, 203 474, 202 440 C 201 406, 209 366, 222 334 L 224 282 Z`;
  return { left: length === 'cap' ? lCap : length === 'short' ? lShort : length === 'threeQuarter' ? l34 : lLong, right };
}

/** Exact two-leg trouser contour generator matching figure.ts leg separation at (300, 669) and calf curvature. */

/** Exact skirt contour generator matching waist (y480) -> hips (y623, x186..414) -> flare. */
export function skirtContour(opts: {
  topY: number;
  hemY: number;
  silhouette: 'pencil' | 'aline' | 'flare';
}): string {
  const { topY, hemY, silhouette } = opts;
  const topHalfW = topY <= 495 ? 58 : topY <= 545 ? 82 : 108;
  const topL = 300 - topHalfW;
  const topR = 300 + topHalfW;

  const extraFlare =
    silhouette === 'pencil'
      ? Math.max(-18, -((hemY - 623) * 0.1))
      : silhouette === 'aline'
        ? (hemY - 600) * 0.14
        : (hemY - 580) * 0.25;

  const hemL = Math.min(208, 184 - extraFlare);
  const hemR = 600 - hemL;
  const dip = silhouette === 'flare' ? 22 : 14;

  const leftHip =
    topY <= 540
      ? `M ${topL} ${topY} C ${topL - 10} 546, 184 584, 183 623`
      : `M ${topL} ${topY} C 188 584, 184 604, 183 623`;
  const rightHip =
    topY <= 540
      ? `C 416 584, ${topR + 10} 546, ${topR} ${topY}`
      : `C 416 604, 412 584, ${topR} ${topY}`;

  return (
    `${leftHip} ` +
    `C 182 ${(623 + hemY) / 2}, ${hemL} ${hemY - 30}, ${hemL} ${hemY} ` +
    `C ${hemL + 60} ${hemY + dip}, ${hemR - 60} ${hemY + dip}, ${hemR} ${hemY} ` +
    `C ${hemR} ${hemY - 30}, 418 ${(623 + hemY) / 2}, 417 623 ` +
    `${rightHip} C ${topR - 30} ${topY + 8}, ${topL + 30} ${topY + 8}, ${topL} ${topY} Z`
  );
}

/* ---------- Procedural Patterns ---------- */

export function lacePattern(id: string, color: string): string {
  const c = shade(color, 0.2);
  return (
    `<pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse">` +
    `<circle cx="9" cy="9" r="6" fill="none" stroke="${c}" stroke-width="0.9" opacity="0.6" />` +
    `<circle cx="9" cy="9" r="2.2" fill="${c}" opacity="0.45" />` +
    `<circle cx="0" cy="0" r="2.5" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.5" />` +
    `<circle cx="18" cy="18" r="2.5" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.5" />` +
    `</pattern>`
  );
}

function houndstoothPattern(id: string, darkCol: string, lightCol: string): string {
  return (
    `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse">` +
    `<rect width="16" height="16" fill="${lightCol}" />` +
    `<path d="M 0 0 L 8 0 L 8 4 L 12 0 L 16 0 L 8 8 L 16 8 L 16 12 L 12 16 L 8 16 L 8 8 L 0 16 L 0 12 L 4 8 L 0 8 Z" fill="${darkCol}" opacity="0.82" />` +
    `</pattern>`
  );
}

function stripePattern(id: string, stripeCol: string): string {
  return (
    `<pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse">` +
    `<line x1="0" y1="0" x2="0" y2="12" stroke="${stripeCol}" stroke-width="2" opacity="0.45" />` +
    `</pattern>`
  );
}

function leopardPattern(id: string, baseCol: string): string {
  const spotDark = shade(baseCol, -0.58);
  const spotMid = shade(baseCol, -0.28);
  return (
    `<pattern id="${id}" width="32" height="32" patternUnits="userSpaceOnUse">` +
    `<ellipse cx="9" cy="10" rx="4.5" ry="3.5" fill="${spotMid}" />` +
    `<path d="M 5 8 C 7 5, 12 6, 13 9 M 6 13 C 9 14, 13 13, 13 10" stroke="${spotDark}" stroke-width="2.1" fill="none" stroke-linecap="round" />` +
    `<ellipse cx="24" cy="23" rx="4" ry="3.2" fill="${spotMid}" />` +
    `<path d="M 20 21 C 23 18, 27 19, 28 22 M 21 26 C 24 27, 27 26, 27 23" stroke="${spotDark}" stroke-width="2" fill="none" stroke-linecap="round" />` +
    `</pattern>`
  );
}

/* ============================================================================
 * 1. TOPS (9 Anatomically Tailored Styles)
 * ============================================================================ */

function silkCamisole(p: AssetParams): string {
  const r = ramp(p.color ?? '#f2e8df');
  const sh = castShadowColor(p);
  const body =
    `M 234 316 C 254 334, 278 348, 300 356 C 322 348, 346 334, 366 316 ` +
    `L 382 332 C 386 358, 390 378, 387 398 C 383 418, 366 438, 359 464 ` +
    `C 356 482, 357 498, 363 514 C 370 532, 377 542, 381 552 ` +
    `C 334 562, 266 562, 219 552 C 223 542, 230 532, 237 514 ` +
    `C 243 498, 244 482, 241 464 C 234 438, 217 418, 213 398 ` +
    `C 210 378, 214 358, 218 332 Z`;
  return toUri(`
    ${defsBlock(r, lacePattern('camiLace', r.specular))}
    <g opacity="0.28" filter="url(#cBlur4)">
      <path d="${body}" fill="${sh}" transform="translate(0, 4)" />
    </g>
    <path d="M 248 260 L 244 324" stroke="${r.mid2}" stroke-width="3.6" stroke-linecap="round" />
    <path d="M 352 260 L 356 324" stroke="${r.mid2}" stroke-width="3.6" stroke-linecap="round" />
    <path d="${body}" fill="url(#fBody)" />
    <path d="M 234 316 C 254 334, 278 348, 300 356 C 322 348, 346 334, 366 316 L 369 332 C 346 350, 322 362, 300 370 C 278 362, 254 350, 231 332 Z" fill="url(#camiLace)" opacity="0.85" />
    ${bustContour(r, 0.95)}
    <path d="M 244 468 C 282 478, 328 476, 356 468" stroke="${r.deep}" stroke-width="2.2" opacity="0.32" filter="url(#cBlur2)" fill="none" />
    <path d="M 220 549 C 266 559, 334 559, 380 549" stroke="${r.specular}" stroke-width="1.6" opacity="0.55" fill="none" />
  `);
}

function sweetheartCorset(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e1b22');
  const sh = castShadowColor(p);
  const body =
    `M 224 340 C 242 324, 278 326, 300 354 C 322 326, 358 324, 376 340 ` +
    `L 382 356 C 388 378, 389 398, 384 416 C 374 440, 360 460, 358 486 ` +
    `C 340 502, 316 512, 300 518 C 284 512, 260 502, 242 486 ` +
    `C 240 460, 226 440, 216 416 C 211 398, 212 378, 218 356 Z`;
  const boning = [248, 274, 300, 326, 352]
    .map((x) => {
      const topY = x === 300 ? 356 : 340;
      const botY = x === 300 ? 515 : 494;
      const curveX = x < 300 ? x + 8 : x > 300 ? x - 8 : 300;
      return (
        `<path d="M ${x} ${topY} Q ${curveX} 430, ${curveX} ${botY}" stroke="${r.deep}" stroke-width="2.2" opacity="0.6" fill="none" />` +
        `<path d="M ${x + 2} ${topY} Q ${curveX + 2} 430, ${curveX + 2} ${botY}" stroke="${r.specular}" stroke-width="1.1" opacity="0.45" fill="none" />`
      );
    })
    .join('');

  return toUri(`
    ${defsBlock(r)}
    <path d="${body}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 1.0)}
    ${boning}
    <path d="M 224 340 C 242 324, 278 326, 300 354 C 322 326, 358 324, 376 340" stroke="${r.specular}" stroke-width="2" opacity="0.62" fill="none" />
  `);
}

function offShoulderTop(p: AssetParams): string {
  const r = ramp(p.color ?? '#b83344');
  const sh = castShadowColor(p);
  const body =
    `M 192 314 C 244 334, 356 334, 408 314 ` +
    `L 388 398 C 382 420, 366 442, 359 464 C 356 482, 357 498, 362 512 ` +
    `C 332 522, 268 522, 238 512 C 243 498, 244 482, 241 464 ` +
    `C 234 442, 218 420, 212 398 Z`;
  const sl = poseSleeves(p.pose, 'long', 2.0);
  return toUri(`
    ${defsBlock(r)}
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="url(#fBody)" />
    <!-- Folded Bardot off-shoulder band spanning outer arms across chest -->
    <path d="M 180 310 C 236 332, 364 332, 420 310 L 424 346 C 366 368, 234 368, 176 346 Z" fill="url(#fVert)" />
    <path d="M 178 326 C 236 348, 364 348, 422 326" stroke="${r.deep}" stroke-width="2" opacity="0.4" fill="none" />
    ${bustContour(r, 0.94)}
    <path d="M 244 468 C 282 478, 322 478, 356 468" stroke="${r.deep}" stroke-width="2" opacity="0.35" fill="none" />
  `);
}

function wrapSilkBlouse(p: AssetParams): string {
  const r = ramp(p.color ?? '#d9c5b2');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 3.5);
  const leftSide =
    `M 258 256 L 195 282 L 218 330 C 213 360, 209 380, 213 398 ` +
    `C 217 418, 234 438, 241 464 C 244 480, 244 494, 240 508 ` +
    `L 354 508 L 284 352 Z`;
  const rightSide =
    `M 342 256 L 405 282 L 382 330 C 387 360, 391 380, 387 398 ` +
    `C 383 418, 366 438, 359 464 C 356 480, 356 494, 360 508 ` +
    `L 246 508 L 316 352 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${leftSide}" fill="${sh}" opacity="0.24" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${leftSide}" fill="url(#fBody)" />
    <path d="${rightSide}" fill="url(#fVert)" />
    ${bustContour(r, 0.92)}
    <path d="M 258 256 L 300 398 L 342 256" stroke="${r.deep}" stroke-width="2" fill="none" opacity="0.45" />
    <!-- Waist sash tie -->
    <path d="M 239 482 C 275 494, 325 494, 361 482 L 359 502 C 325 514, 275 514, 241 502 Z" fill="${r.dark}" />
    <path d="M 332 498 C 336 530, 342 560, 344 584 M 340 498 C 350 526, 358 552, 362 574" stroke="${r.mid2}" stroke-width="6" stroke-linecap="round" fill="none" />
  `);
}

function croppedCardigan(p: AssetParams): string {
  const r = ramp(p.color ?? '#c9939e');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 3.0);
  const body = torsoContour({
    neckPath: `L 340 256 C 324 294, 308 326, 300 344 C 292 326, 276 294, 260 256`,
    hemY: 472,
    ease: 2.5,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.26" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 0.88)}
    <!-- Center button placket & pearl buttons -->
    <rect x="295" y="344" width="10" height="136" fill="${r.mid2}" opacity="0.7" />
    <circle cx="300" cy="364" r="4" fill="url(#pearlGrad)" stroke="${r.deep}" stroke-width="0.7" />
    <circle cx="300" cy="396" r="4" fill="url(#pearlGrad)" stroke="${r.deep}" stroke-width="0.7" />
    <circle cx="300" cy="428" r="4" fill="url(#pearlGrad)" stroke="${r.deep}" stroke-width="0.7" />
    <circle cx="300" cy="460" r="4" fill="url(#pearlGrad)" stroke="${r.deep}" stroke-width="0.7" />
    <path d="M 240 462 C 276 474, 324 474, 360 462 L 358 476 C 324 488, 276 488, 242 476 Z" fill="${r.dark}" />
  `);
}

function halterCropTop(p: AssetParams): string {
  const r = ramp(p.color ?? '#223344');
  const sh = castShadowColor(p);
  const body =
    `M 276 236 L 324 236 L 348 330 C 370 356, 386 380, 386 402 ` +
    `C 380 422, 364 438, 358 456 C 326 468, 274 468, 242 456 ` +
    `C 236 438, 220 422, 214 402 C 214 380, 230 356, 252 330 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    <!-- Neckband collar -->
    <path d="M 275 224 C 288 232, 312 232, 325 224 L 327 244 C 312 252, 288 252, 273 244 Z" fill="${r.dark}" />
    ${bustContour(r, 0.96)}
    <path d="M 244 452 C 276 464, 324 464, 356 452" stroke="${r.specular}" stroke-width="1.6" opacity="0.5" fill="none" />
  `);
}

function ribbedBodysuit(p: AssetParams): string {
  const r = ramp(p.color ?? '#f3efe9');
  const sh = castShadowColor(p);
  const body = torsoContour({
    neckPath: `L 336 254 C 322 296, 278 296, 264 254`,
    leftShoulderX: 224,
    shoulderY: 274,
    hemY: 576,
    ease: 0.5,
    hemCurve: 88,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${body}" fill="${sh}" opacity="0.25" filter="url(#cBlur4)" transform="translate(0, 3)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 0.94)}
    <path d="M 264 254 C 278 296, 322 296, 336 254" stroke="${r.dark}" stroke-width="3" fill="none" opacity="0.5" />
    <path d="M 252 332 C 248 410, 252 480, 268 585" stroke="${r.deep}" stroke-width="1.2" opacity="0.24" fill="none" />
    <path d="M 348 332 C 352 410, 348 480, 332 585" stroke="${r.deep}" stroke-width="1.2" opacity="0.24" fill="none" />
  `);
}

function poplinButtonDown(p: AssetParams): string {
  const r = ramp(p.color ?? '#eef3f8');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 3.5);
  const body = torsoContour({
    neckPath: `L 338 254 L 300 292 L 262 254`,
    hemY: 545,
    ease: 3,
    hemCurve: 16,
  });
  return toUri(`
    ${defsBlock(r, stripePattern('poplinStr', shade(r.mid, -0.25)))}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.25" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    ${p.pattern === 'stripe' ? `<path d="${body}" fill="url(#poplinStr)" />` : ''}
    ${bustContour(r, 0.88)}
    <!-- Crisp collar & center placket -->
    <path d="M 272 248 L 300 292 L 284 306 L 260 270 Z" fill="${r.light}" stroke="${r.dark}" stroke-width="1.1" />
    <path d="M 328 248 L 300 292 L 316 306 L 340 270 Z" fill="${r.mid2}" stroke="${r.dark}" stroke-width="1.1" />
    <rect x="295" y="292" width="10" height="266" fill="${r.mid2}" opacity="0.55" />
    <g fill="url(#pearlGrad)">
      <circle cx="300" cy="322" r="2.6" /><circle cx="300" cy="364" r="2.6" />
      <circle cx="300" cy="406" r="2.6" /><circle cx="300" cy="448" r="2.6" />
      <circle cx="300" cy="490" r="2.6" /><circle cx="300" cy="532" r="2.6" />
    </g>
  `);
}

function laceBraletteTop(p: AssetParams): string {
  const r = ramp(p.color ?? '#241f29');
  const sh = castShadowColor(p);
  const body =
    `M 232 324 C 254 342, 278 362, 300 382 C 322 362, 346 342, 368 324 ` +
    `L 382 336 C 388 364, 389 392, 384 414 C 378 426, 372 438, 366 446 ` +
    `C 332 456, 268 456, 234 446 C 228 438, 222 426, 216 414 ` +
    `C 211 392, 212 364, 218 336 Z`;
  return toUri(`
    ${defsBlock(r, lacePattern('braLace', r.specular))}
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 3)" />
    <path d="M 248 258 L 240 328 M 352 258 L 360 328" stroke="${r.mid}" stroke-width="3.2" stroke-linecap="round" />
    <path d="${body}" fill="url(#fBody)" />
    <path d="${body}" fill="url(#braLace)" />
    ${bustContour(r, 0.98)}
    <path d="M 234 446 C 268 456, 332 456, 366 446" stroke="${r.deep}" stroke-width="2.5" stroke-dasharray="4 3" fill="none" />
  `);
}

/* ============================================================================
 * 2. DRESSES & GOWNS (9 Anatomically Fitted Styles)
 * ============================================================================ */

function satinSlipDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#c88c7a');
  const sh = castShadowColor(p);
  const bodice = torsoContour({
    neckPath: `L 360 318 C 338 338, 316 350, 300 344 C 284 350, 262 338, 240 318`,
    leftShoulderX: 224,
    shoulderY: 320,
    hemY: 500,
    ease: 1.5,
  });
  const skirt = skirtContour({ topY: 492, hemY: 960, silhouette: 'aline' });
  return toUri(`
    ${defsBlock(r)}
    <g opacity="0.28" filter="url(#cBlur4)">
      <path d="${skirt}" fill="${sh}" transform="translate(0, 5)" />
      <path d="${bodice}" fill="${sh}" transform="translate(0, 4)" />
    </g>
    <path d="M 246 260 L 242 320 M 354 260 L 358 320" stroke="${r.mid}" stroke-width="3" stroke-linecap="round" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.95)}
    <!-- Bias-cut liquid satin highlights & side slit -->
    <path d="M 232 510 C 216 650, 206 800, 208 954 C 232 820, 240 660, 246 510 Z" fill="url(#fSheen)" opacity="0.72" filter="url(#cBlur8)" />
    <path d="M 350 676 L 368 964" stroke="${sh}" stroke-width="3.5" opacity="0.7" />
    <path d="M 240 318 C 262 338, 284 350, 300 344 C 316 350, 338 338, 360 318" stroke="${r.specular}" stroke-width="1.8" opacity="0.65" fill="none" />
  `);
}

function tailoredBlazerDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#28252d');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 3.5);
  const body = torsoContour({
    neckPath: `L 340 254 L 300 364 L 260 254`,
    hemY: 540,
    ease: 3.5,
  });
  const skirt = skirtContour({ topY: 500, hemY: 755, silhouette: 'pencil' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${body}" fill="url(#fBody)" />
    <!-- Sharp notched lapels & double-breasted gold buttons -->
    <path d="M 260 254 L 300 364 L 264 334 L 252 316 L 264 306 L 246 276 Z" fill="${r.dark}" stroke="${r.deep}" stroke-width="1.1" />
    <path d="M 340 254 L 300 364 L 336 334 L 348 316 L 336 306 L 354 276 Z" fill="${r.deep}" stroke="${r.deep}" stroke-width="1.1" />
    <path d="M 300 364 L 296 764" stroke="${r.deep}" stroke-width="2.2" opacity="0.7" />
    <g fill="url(#metalGold)">
      <circle cx="278" cy="408" r="5" /><circle cx="322" cy="408" r="5" />
      <circle cx="278" cy="458" r="5" /><circle cx="322" cy="458" r="5" />
      <circle cx="278" cy="508" r="5" /><circle cx="322" cy="508" r="5" />
    </g>
    <!-- Cinched waist belt -->
    <path d="M 240 476 C 276 490, 324 490, 360 476 L 362 496 C 324 510, 276 510, 238 496 Z" fill="${r.deep}" />
    <rect x="288" y="479" width="24" height="19" rx="3" fill="none" stroke="url(#metalGold)" stroke-width="2.6" />
  `);
}

function alineSundress(p: AssetParams): string {
  const r = ramp(p.color ?? '#e88b72');
  const sh = castShadowColor(p);
  const pat = p.color2 ?? shade(r.mid, -0.35);
  const bodice = torsoContour({
    neckPath: `L 352 308 C 330 330, 270 330, 248 308`,
    leftShoulderX: 222,
    shoulderY: 310,
    hemY: 494,
    ease: 1.5,
  });
  const skirt = skirtContour({ topY: 486, hemY: 880, silhouette: 'flare' });
  return toUri(`
    ${defsBlock(r, `<pattern id="sunDot" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="2.2" fill="${pat}" opacity="0.65" /><circle cx="20" cy="20" r="1.8" fill="${r.specular}" opacity="0.65" /></pattern>`)}
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="M 248 258 L 248 312 M 352 258 L 352 312" stroke="${r.mid}" stroke-width="6.5" stroke-linecap="round" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    <path d="${skirt}" fill="url(#sunDot)" />
    <path d="${bodice}" fill="url(#sunDot)" />
    ${bustContour(r, 0.9)}
    <!-- Gathered waist seam & vertical skirt pleats -->
    <path d="M 242 486 C 276 498, 324 498, 358 486" stroke="${r.deep}" stroke-width="2.8" fill="none" />
    <path d="M 262 496 C 248 620, 224 760, 204 892 M 300 498 C 300 625, 300 765, 300 902 M 338 496 C 352 620, 376 760, 396 892" stroke="${r.deep}" stroke-width="2.5" opacity="0.28" filter="url(#cBlur2)" fill="none" />
  `);
}

function wrapCocktailDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#1a5e4d');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'threeQuarter', 2.5);
  const bodice = torsoContour({
    neckPath: `L 340 256 L 300 376 L 260 256`,
    hemY: 496,
    ease: 1.5,
  });
  const skirt = skirtContour({ topY: 486, hemY: 820, silhouette: 'aline' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.95)}
    <!-- Diagonal tulip wrap front -->
    <path d="M 260 256 L 328 492 L 240 492" stroke="${r.deep}" stroke-width="2" opacity="0.45" fill="none" />
    <path d="M 242 488 C 280 570, 326 690, 356 830" stroke="${r.deep}" stroke-width="3" opacity="0.5" fill="none" />
    <path d="M 245 488 C 283 570, 329 690, 359 830" stroke="${r.specular}" stroke-width="1.6" opacity="0.5" fill="none" />
    <path d="M 240 478 C 276 490, 324 490, 360 478 L 362 496 C 324 508, 276 508, 238 496 Z" fill="${r.dark}" />
  `);
}

function bodyconMidiDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#5a2135');
  const sh = castShadowColor(p);
  const bodice = torsoContour({
    neckPath: `L 346 292 C 320 314, 280 314, 254 292`,
    leftShoulderX: 218,
    shoulderY: 294,
    hemY: 500,
    ease: 0.5,
  });
  const skirt = skirtContour({ topY: 492, hemY: 940, silhouette: 'pencil' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="M 248 256 L 244 296 M 352 256 L 356 296" stroke="${r.mid}" stroke-width="7" stroke-linecap="round" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 1.0)}
    <!-- Ruched side-gathering across waist & hip -->
    <g stroke="${r.deep}" stroke-width="1.8" opacity="0.35" fill="none">
      <path d="M 236 456 C 270 468, 325 462, 360 452" />
      <path d="M 240 486 C 278 498, 328 492, 360 482" />
      <path d="M 224 536 C 266 550, 336 544, 376 530" />
      <path d="M 196 588 C 248 604, 352 598, 404 584" />
    </g>
  `);
}

function mermaidEveningGown(p: AssetParams): string {
  const r = ramp(p.color ?? '#132440');
  const sh = castShadowColor(p);
  const bodice = torsoContour({
    neckPath: `L 368 332 C 344 316, 318 326, 300 350 C 282 326, 256 316, 232 332`,
    leftShoulderX: 222,
    shoulderY: 334,
    hemY: 500,
    ease: 1,
  });
  const fittedColumn =
    `M 240 492 C 224 548, 184 586, 183 623 C 184 680, 200 770, 212 850 ` +
    `C 192 940, 152 1065, 132 1192 C 210 1218, 390 1218, 468 1192 ` +
    `C 448 1065, 408 940, 388 850 C 400 770, 416 680, 417 623 ` +
    `C 416 586, 376 548, 360 492 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${fittedColumn}" fill="${sh}" opacity="0.34" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${fittedColumn}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 1.0)}
    <!-- Flared mermaid godet folds from knees to floor -->
    <path d="M 222 864 C 202 960, 174 1070, 158 1198" stroke="${r.deep}" stroke-width="5" opacity="0.38" filter="url(#cBlur4)" fill="none" />
    <path d="M 264 872 C 254 970, 240 1080, 234 1206" stroke="${r.deep}" stroke-width="5" opacity="0.35" filter="url(#cBlur4)" fill="none" />
    <path d="M 336 872 C 346 970, 360 1080, 366 1206" stroke="${r.deep}" stroke-width="5" opacity="0.35" filter="url(#cBlur4)" fill="none" />
    <path d="M 378 864 C 398 960, 426 1070, 442 1198" stroke="${r.deep}" stroke-width="5" opacity="0.38" filter="url(#cBlur4)" fill="none" />
    <path d="M 134 1190 C 210 1216, 390 1216, 466 1190" stroke="${r.specular}" stroke-width="2.2" opacity="0.55" fill="none" />
  `);
}

function tulleBallGown(p: AssetParams): string {
  const r = ramp(p.color ?? '#c92a42');
  const sh = castShadowColor(p);
  const bodice = torsoContour({
    neckPath: `L 368 326 C 344 314, 318 324, 300 348 C 282 324, 256 314, 232 326`,
    leftShoulderX: 222,
    shoulderY: 328,
    hemY: 492,
    ease: 1,
  });
  const ballSkirt =
    `M 241 482 C 165 540, 114 760, 96 1185 ` +
    `C 190 1222, 410 1222, 504 1185 ` +
    `C 486 760, 435 540, 359 482 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${ballSkirt}" fill="${sh}" opacity="0.34" filter="url(#cBlur8)" transform="translate(0, 7)" />
    <!-- Layered translucent organza overskirts -->
    <path d="${ballSkirt}" fill="url(#fVert)" />
    <path d="M 241 482 C 185 560, 134 780, 118 1120 C 210 1152, 390 1152, 482 1120 C 466 780, 415 560, 359 482 Z" fill="url(#fSheer)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 1.0)}
    <path d="M 262 492 C 218 680, 178 930, 152 1196 M 300 494 C 300 700, 300 940, 300 1208 M 338 492 C 382 680, 422 930, 448 1196" stroke="${r.deep}" stroke-width="5.5" opacity="0.32" filter="url(#cBlur4)" fill="none" />
    <path d="M 266 496 C 224 680, 186 930, 162 1192 M 342 496 C 384 680, 422 930, 446 1192" stroke="${r.specular}" stroke-width="2.5" opacity="0.4" filter="url(#cBlur2)" fill="none" />
  `);
}

function pleatedShirtDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#5e7a68');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'short', 3.0);
  const bodice = torsoContour({
    neckPath: `L 336 254 L 300 318 L 264 254`,
    hemY: 496,
    ease: 2.5,
  });
  const skirt = skirtContour({ topY: 486, hemY: 900, silhouette: 'flare' });
  const pleats = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    .map((i) => `<line x1="${300 + i * 14}" y1="494" x2="${300 + i * 26}" y2="914" stroke="${r.deep}" stroke-width="2.2" opacity="0.38" />`)
    .join('');
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${skirt}" fill="${sh}" opacity="0.26" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    ${pleats}
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.9)}
    <path d="M 272 248 L 300 302 L 284 316 L 262 272 Z" fill="${r.light}" stroke="${r.dark}" stroke-width="1" />
    <path d="M 328 248 L 300 302 L 316 316 L 338 272 Z" fill="${r.mid2}" stroke="${r.dark}" stroke-width="1" />
    <path d="M 240 478 C 276 490, 324 490, 360 478 L 362 496 C 324 508, 276 508, 238 496 Z" fill="${r.dark}" />
  `);
}

function offShoulderGown(p: AssetParams): string {
  const r = ramp(p.color ?? '#8b1e2d');
  const sh = castShadowColor(p);
  const bodice =
    `M 184 314 C 242 334, 358 334, 416 314 L 402 356 ` +
    `C 392 386, 386 410, 370 438 C 362 456, 358 474, 360 494 ` +
    `C 326 506, 274 506, 240 494 C 242 474, 238 456, 230 438 ` +
    `C 214 410, 208 386, 198 356 Z`;
  const skirt = skirtContour({ topY: 486, hemY: 1185, silhouette: 'flare' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.32" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.98)}
    <!-- Sculpted off-shoulder draped cuff -->
    <path d="M 176 310 C 238 336, 362 336, 424 310 L 420 348 C 360 374, 240 374, 180 348 Z" fill="url(#fVert)" />
    <path d="M 178 312 C 238 338, 362 338, 422 312" stroke="${r.specular}" stroke-width="2.2" opacity="0.6" fill="none" />
    <path d="M 264 494 C 234 690, 198 940, 174 1198 M 336 494 C 366 690, 402 940, 426 1198" stroke="${r.deep}" stroke-width="5" opacity="0.34" filter="url(#cBlur4)" fill="none" />
  `);
}

function wrapLinenMidiDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#c2654c');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'short', 2.8);
  const bodice = torsoContour({
    neckPath: `L 340 256 L 300 368 L 260 256`,
    hemY: 496,
    ease: 2.0,
  });
  const skirt = skirtContour({ topY: 486, hemY: 920, silhouette: 'aline' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.9)}
    <path d="M 260 256 L 332 492" stroke="${r.deep}" stroke-width="1.9" opacity="0.48" fill="none" />
    <path d="M 244 490 C 282 590, 326 730, 354 926" stroke="${r.deep}" stroke-width="2.4" opacity="0.45" fill="none" />
    <path d="M 240 478 C 276 490, 324 490, 360 478 L 362 498 C 324 510, 276 510, 238 498 Z" fill="${r.dark}" />
    <path d="M 254 496 C 248 532, 240 562, 234 584 M 262 496 C 266 528, 268 556, 266 576" stroke="${r.mid2}" stroke-width="6" stroke-linecap="round" fill="none" />
  `);
}

function botanicalChiffonMaxi(p: AssetParams): string {
  const r = ramp(p.color ?? '#d9788e');
  const bloom = p.color2 ?? '#f5dde3';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'cap', 3.2);
  const bodice = torsoContour({
    neckPath: `L 348 286 C 328 318, 308 334, 300 342 C 292 334, 272 318, 252 286`,
    leftShoulderX: 214,
    shoulderY: 288,
    hemY: 468,
    ease: 2.0,
  });
  const skirt = skirtContour({ topY: 458, hemY: 1135, silhouette: 'flare' });
  const floralPat = `
    <pattern id="botanPat" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="3.4" fill="${bloom}" opacity="0.72" />
      <circle cx="14" cy="13" r="2.6" fill="${bloom}" opacity="0.62" />
      <circle cx="7" cy="13" r="2.6" fill="${bloom}" opacity="0.62" />
      <circle cx="10" cy="11" r="1.4" fill="#f2d27a" opacity="0.88" />
      <circle cx="26" cy="24" r="3.0" fill="${bloom}" opacity="0.68" />
      <circle cx="29" cy="27" r="2.2" fill="${r.specular}" opacity="0.58" />
      <path d="M 12 15 Q 17 19 20 15" stroke="#4f7c58" stroke-width="1.3" fill="none" opacity="0.55" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, floralPat)}
    <path d="${sl.left}" fill="url(#fSheer)" />
    <path d="${sl.right}" fill="url(#fSheer)" />
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 6)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    <path d="${skirt}" fill="url(#botanPat)" />
    <path d="${bodice}" fill="url(#botanPat)" />
    ${bustContour(r, 0.92)}
    <path d="M 240 448 C 276 460, 324 460, 360 448 L 361 464 C 324 476, 276 476, 239 464 Z" fill="${r.dark}" opacity="0.85" />
    <path d="M 262 466 C 242 680, 210 920, 184 1142 M 300 468 C 300 690, 300 930, 300 1152 M 338 466 C 358 680, 390 920, 416 1142" stroke="${r.deep}" stroke-width="3.5" opacity="0.24" filter="url(#cBlur2)" fill="none" />
  `);
}

function sequinPartyMini(p: AssetParams): string {
  const r = ramp(p.color ?? '#e0b878');
  const glint = p.color2 ?? '#fff8dc';
  const sh = castShadowColor(p);
  const bodice =
    `M 274 236 L 326 236 L 352 330 C 374 358, 386 382, 384 404 ` +
    `C 374 432, 360 458, 358 492 C 324 504, 276 504, 242 492 ` +
    `C 240 458, 226 432, 216 404 C 214 382, 226 358, 248 330 Z`;
  const skirt = skirtContour({ topY: 484, hemY: 752, silhouette: 'flare' });
  const seqPat = `
    <pattern id="seqParty" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="2.2" fill="${glint}" opacity="0.45" />
      <circle cx="11" cy="10" r="2.2" fill="${r.specular}" opacity="0.52" />
      <circle cx="4" cy="11" r="1.4" fill="#ffffff" opacity="0.62" />
      <circle cx="10" cy="4" r="1.5" fill="${r.light}" opacity="0.48" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, seqPat)}
    <path d="${skirt}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    <path d="${skirt}" fill="url(#seqParty)" />
    <path d="${bodice}" fill="url(#seqParty)" />
    <path d="M 273 226 C 288 234, 312 234, 327 226 L 328 242 C 312 250, 288 250, 272 242 Z" fill="${r.dark}" />
    ${bustContour(r, 0.96)}
    <path d="M 242 484 C 276 496, 324 496, 358 484" stroke="${glint}" stroke-width="2.4" opacity="0.7" fill="none" />
    <g fill="#ffffff" opacity="0.88">
      <path d="M 262 374 L 264 380 L 270 382 L 264 384 L 262 390 L 260 384 L 254 382 L 260 380 Z" />
      <path d="M 334 576 L 336 582 L 342 584 L 336 586 L 334 592 L 332 586 L 326 584 L 332 582 Z" />
      <path d="M 232 672 L 234 677 L 239 679 L 234 681 L 232 686 L 230 681 L 225 679 L 230 677 Z" />
    </g>
  `);
}

function tieredCocktailMini(p: AssetParams): string {
  const r = ramp(p.color ?? '#b82942');
  const sh = castShadowColor(p);
  const bodice = torsoContour({
    neckPath: `L 366 328 C 344 314, 318 326, 300 350 C 282 326, 256 314, 234 328`,
    leftShoulderX: 222,
    shoulderY: 330,
    hemY: 492,
    ease: 1.0,
  });
  const tier1 = skirtContour({ topY: 484, hemY: 598, silhouette: 'flare' });
  const tier2 = skirtContour({ topY: 562, hemY: 686, silhouette: 'flare' });
  const tier3 = skirtContour({ topY: 652, hemY: 774, silhouette: 'flare' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${tier3}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 6)" />
    <path d="${tier3}" fill="url(#fVert)" />
    <path d="${tier2}" fill="${sh}" opacity="0.24" filter="url(#cBlur2)" transform="translate(0, 4)" />
    <path d="${tier2}" fill="url(#fBody)" />
    <path d="${tier1}" fill="${sh}" opacity="0.24" filter="url(#cBlur2)" transform="translate(0, 4)" />
    <path d="${tier1}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.98)}
    <path d="M 240 482 C 276 494, 324 494, 360 482 L 361 496 C 324 508, 276 508, 239 496 Z" fill="${r.dark}" />
    <path d="M 178 594 C 242 622, 358 622, 422 594 M 158 682 C 232 710, 368 710, 442 682 M 136 770 C 220 798, 380 798, 464 770" stroke="${r.specular}" stroke-width="2" opacity="0.58" fill="none" />
  `);
}

function satinBowPartyDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#d48682');
  const sh = castShadowColor(p);
  const bodice =
    `M 224 274 C 242 268, 256 276, 268 302 C 296 330, 336 336, 378 332 ` +
    `C 386 358, 389 382, 385 402 C 378 428, 362 456, 358 490 ` +
    `C 324 502, 276 502, 242 490 C 238 456, 222 428, 215 402 ` +
    `C 210 374, 214 334, 224 274 Z`;
  const skirt = skirtContour({ topY: 482, hemY: 745, silhouette: 'pencil' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.96)}
    <path d="M 220 530 C 204 600, 200 668, 206 736 C 230 676, 236 606, 242 530 Z" fill="url(#fSheen)" opacity="0.72" filter="url(#cBlur8)" />
    <path d="M 244 488 C 282 560, 316 648, 338 746" stroke="${r.deep}" stroke-width="2.6" opacity="0.44" fill="none" />
    <!-- Sculptural shoulder bow -->
    <path d="M 232 276 C 206 244, 186 254, 198 282 C 206 294, 222 288, 232 276 Z" fill="url(#fVert)" stroke="${r.deep}" stroke-width="1" />
    <path d="M 232 276 C 254 246, 276 256, 264 282 C 254 294, 242 288, 232 276 Z" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1" />
    <circle cx="232" cy="276" r="6.5" fill="${r.dark}" />
  `);
}

function clubCutoutMini(p: AssetParams): string {
  const r = ramp(p.color ?? '#1c1820');
  const sh = castShadowColor(p);
  const dress =
    `M 224 274 C 242 270, 256 278, 268 302 C 296 326, 338 334, 378 328 ` +
    `C 386 356, 389 380, 384 402 C 378 422, 366 436, 356 446 ` +
    `C 326 440, 294 438, 268 448 C 252 454, 244 468, 246 482 ` +
    `C 278 486, 326 484, 360 472 C 384 532, 414 576, 414 623 ` +
    `C 414 662, 408 700, 402 736 C 340 752, 260 752, 198 736 ` +
    `C 192 700, 186 662, 186 623 C 186 576, 218 538, 236 490 ` +
    `C 240 468, 228 438, 216 402 C 210 374, 214 334, 224 274 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${dress}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${dress}" fill="url(#fBody)" />
    ${bustContour(r, 1.0)}
    <path d="M 210 568 C 198 618, 198 670, 206 728 C 228 674, 230 620, 238 568 Z" fill="url(#fSheen)" opacity="0.65" filter="url(#cBlur4)" />
    <circle cx="352" cy="458" r="7.5" fill="none" stroke="url(#metalGold)" stroke-width="3.2" />
    <path d="M 250 478 C 284 486, 322 482, 354 468" stroke="${r.specular}" stroke-width="1.6" opacity="0.45" fill="none" />
  `);
}

function clubVelvetCorsetMini(p: AssetParams): string {
  const r = ramp(p.color ?? '#1f1b24');
  const sh = castShadowColor(p);
  const bodice =
    `M 224 336 C 244 320, 278 324, 300 352 C 322 324, 356 320, 376 336 ` +
    `L 385 376 C 388 398, 384 418, 370 444 L 358 492 ` +
    `C 324 504, 276 504, 242 492 L 230 444 C 216 418, 212 398, 215 376 Z`;
  const skirt = skirtContour({ topY: 484, hemY: 745, silhouette: 'pencil' });
  const boning = [256, 300, 344]
    .map((x) => `<path d="M ${x} ${x === 300 ? 354 : 334} L ${x === 300 ? 300 : x < 300 ? x + 8 : x - 8} 492" stroke="${r.deep}" stroke-width="2" opacity="0.65" fill="none" />`)
    .join('');
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="M 248 258 L 244 332 M 352 258 L 356 332" stroke="${r.mid}" stroke-width="4" stroke-linecap="round" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 1.0)}
    ${boning}
    <!-- Velvet lush highlight & side slit -->
    <path d="M 206 566 C 192 618, 192 674, 200 732 C 220 676, 224 620, 232 566 Z" fill="url(#fSheen)" opacity="0.58" filter="url(#cBlur4)" />
    <path d="M 352 632 L 368 746" stroke="${sh}" stroke-width="3.2" opacity="0.72" />
  `);
}

function clubMetallicDrapeMini(p: AssetParams): string {
  const r = ramp(p.color ?? '#c8d2dc');
  const sh = castShadowColor(p);
  const bodice =
    `M 234 316 C 258 342, 282 354, 300 354 C 318 354, 342 342, 366 316 ` +
    `L 384 352 C 388 378, 388 398, 382 418 L 358 492 ` +
    `C 324 504, 276 504, 242 492 L 218 418 C 212 398, 212 378, 216 352 Z`;
  const skirt = skirtContour({ topY: 484, hemY: 735, silhouette: 'pencil' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="M 246 258 L 242 320 M 354 258 L 358 320" stroke="${r.specular}" stroke-width="3.2" stroke-linecap="round" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.98)}
    <!-- Liquid metallic speculars & cowl folds -->
    <path d="M 244 334 C 276 364, 324 364, 356 334 M 252 352 C 280 376, 320 376, 348 352" stroke="${r.specular}" stroke-width="1.8" opacity="0.72" fill="none" />
    <path d="M 216 534 C 266 552, 334 544, 384 528 M 200 584 C 256 602, 346 594, 400 578 M 204 636 C 260 652, 340 646, 396 632" stroke="${r.deep}" stroke-width="1.8" opacity="0.38" fill="none" />
    <path d="M 218 538 C 202 602, 200 668, 206 728 C 228 670, 232 606, 240 538 Z" fill="#ffffff" opacity="0.28" filter="url(#cBlur4)" />
  `);
}

function ankaraPeplumDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#d95829');
  const accent = p.color2 ?? '#1d3c78';
  const gold = '#f0c44d';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'cap', 4.8);
  const bodice = torsoContour({
    neckPath: `L 346 266 C 324 306, 276 306, 254 266`,
    hemY: 492,
    ease: 1.5,
  });
  const peplum =
    `M 240 482 C 276 494, 324 494, 360 482 ` +
    `C 386 510, 408 542, 418 572 C 362 596, 238 596, 182 572 ` +
    `C 192 542, 214 510, 240 482 Z`;
  const skirt = skirtContour({ topY: 500, hemY: 945, silhouette: 'pencil' });
  const ankaraPat = `
    <pattern id="ankaraPat" width="28" height="28" patternUnits="userSpaceOnUse">
      <rect width="28" height="28" fill="${r.mid}" />
      <path d="M 14 0 L 28 14 L 14 28 L 0 14 Z" fill="${accent}" opacity="0.88" />
      <circle cx="14" cy="14" r="6" fill="${gold}" opacity="0.92" />
      <circle cx="14" cy="14" r="2.6" fill="${r.deep}" />
      <circle cx="0" cy="0" r="3.5" fill="${gold}" opacity="0.82" />
      <circle cx="28" cy="0" r="3.5" fill="${gold}" opacity="0.82" />
      <circle cx="0" cy="28" r="3.5" fill="${gold}" opacity="0.82" />
      <circle cx="28" cy="28" r="3.5" fill="${gold}" opacity="0.82" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, ankaraPat)}
    <path d="${sl.left}" fill="url(#ankaraPat)" stroke="${r.deep}" stroke-width="0.9" />
    <path d="${sl.right}" fill="url(#ankaraPat)" stroke="${r.deep}" stroke-width="0.9" />
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#ankaraPat)" />
    <path d="${skirt}" fill="url(#fVert)" opacity="0.28" />
    <path d="${peplum}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${peplum}" fill="url(#ankaraPat)" />
    <path d="${peplum}" fill="url(#fBody)" opacity="0.24" />
    <path d="${bodice}" fill="url(#ankaraPat)" />
    <path d="${bodice}" fill="url(#fBody)" opacity="0.24" />
    ${bustContour(r, 0.72)}
    <path d="M 240 478 C 276 490, 324 490, 360 478 L 362 496 C 324 508, 276 508, 238 496 Z" fill="${accent}" />
    <path d="M 184 570 C 238 594, 362 594, 416 570" stroke="${gold}" stroke-width="2.2" fill="none" />
  `);
}

function asoEbiLaceGown(p: AssetParams): string {
  const r = ramp(p.color ?? '#155c44');
  const gold = p.color2 ?? '#e6c15a';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'threeQuarter', 2.0);
  const bodice = torsoContour({
    neckPath: `L 342 256 C 322 282, 278 282, 258 256`,
    hemY: 496,
    ease: 1.0,
  });
  const gown =
    `M 240 490 C 224 548, 184 586, 183 623 C 184 680, 200 770, 212 850 ` +
    `C 192 940, 152 1065, 132 1192 C 210 1218, 390 1218, 468 1192 ` +
    `C 448 1065, 408 940, 388 850 C 400 770, 416 680, 417 623 ` +
    `C 416 586, 376 548, 360 490 Z`;
  const cordLace = `
    <pattern id="asoLace" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="11" cy="11" r="7.5" fill="none" stroke="${gold}" stroke-width="1.1" opacity="0.62" />
      <circle cx="11" cy="11" r="3.2" fill="${r.specular}" opacity="0.45" />
      <circle cx="11" cy="11" r="1.4" fill="${gold}" opacity="0.88" />
      <circle cx="0" cy="11" r="2.2" fill="${gold}" opacity="0.48" />
      <circle cx="22" cy="11" r="2.2" fill="${gold}" opacity="0.48" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, cordLace)}
    <path d="${sl.left}" fill="url(#fSheer)" />
    <path d="${sl.left}" fill="url(#asoLace)" />
    <path d="${sl.right}" fill="url(#fSheer)" />
    <path d="${sl.right}" fill="url(#asoLace)" />
    <path d="${gown}" fill="${sh}" opacity="0.34" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${gown}" fill="url(#fVert)" />
    <path d="${gown}" fill="url(#asoLace)" />
    <path d="${bodice}" fill="url(#fBody)" />
    <path d="${bodice}" fill="url(#asoLace)" />
    ${bustContour(r, 0.92)}
    <path d="M 240 484 C 276 496, 324 496, 360 484" stroke="${gold}" stroke-width="3.2" fill="none" />
    <path d="M 224 338 C 254 320, 282 328, 300 352 C 318 328, 346 320, 376 338" stroke="${gold}" stroke-width="2.2" fill="none" />
    <path d="M 222 864 C 202 960, 174 1070, 158 1198 M 378 864 C 398 960, 426 1070, 442 1198" stroke="${r.deep}" stroke-width="4.5" opacity="0.35" filter="url(#cBlur4)" fill="none" />
  `);
}

function iroAndBubaEnsemble(p: AssetParams): string {
  const r = ramp(p.color ?? '#1d4488');
  const gold = p.color2 ?? '#e6c35c';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'threeQuarter', 7.5);
  const buba =
    `M 248 262 C 276 280, 324 280, 352 262 L 406 286 L 392 342 ` +
    `C 394 388, 384 434, 374 496 C 334 514, 266 514, 226 496 ` +
    `C 216 434, 206 388, 208 342 L 194 286 Z`;
  const iro = skirtContour({ topY: 488, hemY: 1125, silhouette: 'aline' });
  const damask = `
    <pattern id="brocadePat" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 12 2 Q 19 12 12 22 Q 5 12 12 2 Z" fill="none" stroke="${r.specular}" stroke-width="1.0" opacity="0.28" />
      <circle cx="12" cy="12" r="2.2" fill="${gold}" opacity="0.32" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, damask)}
    <path d="${iro}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${iro}" fill="url(#fVert)" />
    <path d="${iro}" fill="url(#brocadePat)" />
    <!-- Diagonal traditional Iro wrapper fold & woven Aso-Oke hem -->
    <path d="M 244 494 C 272 680, 302 890, 326 1134" stroke="${r.deep}" stroke-width="3.2" opacity="0.58" fill="none" />
    <path d="M 248 494 C 276 680, 306 890, 330 1134" stroke="${gold}" stroke-width="1.8" opacity="0.72" fill="none" />
    <path d="M 164 1084 C 240 1106, 360 1106, 436 1084 L 440 1124 C 360 1146, 240 1146, 160 1124 Z" fill="${gold}" opacity="0.86" />
    <path d="M 162 1098 C 240 1120, 360 1120, 438 1098" stroke="${r.deep}" stroke-width="2.4" opacity="0.65" fill="none" />
    <!-- Wide flowing Buba sleeves & blouse -->
    <path d="${sl.left}" fill="url(#fBody)" />
    <path d="${sl.right}" fill="url(#fBody)" />
    <path d="${buba}" fill="${sh}" opacity="0.26" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${buba}" fill="url(#fBody)" />
    <path d="${buba}" fill="url(#brocadePat)" />
    ${bustContour(r, 0.85)}
    <path d="M 248 262 C 276 282, 324 282, 352 262" stroke="${gold}" stroke-width="3.2" fill="none" />
  `);
}

function adireIndigoKaftan(p: AssetParams): string {
  const r = ramp(p.color ?? '#1b3568');
  const gold = p.color2 ?? '#e6c15a';
  const sh = castShadowColor(p);
  const boubou =
    `M 256 254 L 182 284 L 146 530 L 188 538 L 196 476 ` +
    `C 178 680, 158 910, 148 1148 C 230 1176, 370 1176, 452 1148 ` +
    `C 442 910, 422 680, 404 476 L 412 538 L 454 530 ` +
    `L 418 284 L 344 254 L 300 338 Z`;
  const adirePat = `
    <pattern id="adirePat" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="16" cy="16" r="11" fill="none" stroke="${r.specular}" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.48" />
      <circle cx="16" cy="16" r="6" fill="none" stroke="#ffffff" stroke-width="1.0" opacity="0.36" />
      <circle cx="16" cy="16" r="2" fill="${gold}" opacity="0.48" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, adirePat)}
    <path d="${boubou}" fill="${sh}" opacity="0.32" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${boubou}" fill="url(#fVert)" />
    <path d="${boubou}" fill="url(#adirePat)" />
    <!-- Agbada-inspired Yoruba neckline & placket gold embroidery -->
    <path d="M 256 254 L 300 338 L 344 254" stroke="${gold}" stroke-width="5.5" fill="none" stroke-linejoin="round" />
    <path d="M 294 338 L 294 524 L 306 524 L 306 338 Z" fill="${gold}" opacity="0.88" />
    <path d="M 278 320 L 300 356 L 322 320" stroke="${gold}" stroke-width="2.2" fill="none" />
    <path d="M 218 470 C 204 680, 192 910, 186 1158 M 382 470 C 396 680, 408 910, 414 1158" stroke="${r.deep}" stroke-width="3.5" opacity="0.32" filter="url(#cBlur4)" fill="none" />
  `);
}



/* ============================================================================
 * 3. BOTTOMS (9 Anatomically Fitted Styles with Real Waist & Leg Separation)
 * ============================================================================ */

function highWaistTrousers(p: AssetParams): string {
  const r = ramp(p.color ?? '#36333b');
  const sh = castShadowColor(p);
  const pants = fittedPantsPath({ topY: 486, hemY: 1178, fit: 'straight' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${pants}" fill="url(#fBody)" />
    <!-- Structured high-waistband -->
    <path d="M 241 484 C 276 496, 324 496, 359 484 L 362 508 C 324 520, 276 520, 238 508 Z" fill="${r.dark}" />
    <!-- Pressed front creases & trouser darts -->
    <path d="M 262 518 L 250 1178 M 338 518 L 350 1178" stroke="${r.deep}" stroke-width="1.8" opacity="0.45" fill="none" />
    <path d="M 260 518 L 248 1178 M 336 518 L 348 1178" stroke="${r.specular}" stroke-width="1.6" opacity="0.35" fill="none" />
    <!-- Side slash pockets & belt loops -->
    <path d="M 234 520 C 232 544, 220 568, 206 588 M 366 520 C 368 544, 380 568, 394 588" stroke="${r.deep}" stroke-width="2" opacity="0.55" fill="none" />
    <rect x="264" y="487" width="5" height="22" rx="1.5" fill="${r.deep}" />
    <rect x="331" y="487" width="5" height="22" rx="1.5" fill="${r.deep}" />
  `);
}

function wideLegPalazzo(p: AssetParams): string {
  const r = ramp(p.color ?? '#d8c7af');
  const sh = castShadowColor(p);
  const pants = fittedPantsPath({ topY: 486, hemY: 1188, fit: 'wide' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.26" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${pants}" fill="url(#fVert)" />
    <path d="M 241 484 C 276 496, 324 496, 359 484 L 362 508 C 324 520, 276 520, 238 508 Z" fill="${r.mid2}" />
    <path d="M 266 514 C 254 720, 236 960, 224 1186 M 334 514 C 346 720, 364 960, 376 1186" stroke="${r.deep}" stroke-width="3.2" opacity="0.32" filter="url(#cBlur2)" fill="none" />
    <path d="M 270 514 C 258 720, 240 960, 228 1186" stroke="${r.specular}" stroke-width="2" opacity="0.35" fill="none" />
  `);
}

function skinnyDenimJeans(p: AssetParams): string {
  const r = ramp(p.color ?? '#3b5785');
  const sh = castShadowColor(p);
  const stitch = '#dfad64';
  const pants = fittedPantsPath({ topY: 516, hemY: 1166, fit: 'skinny' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 3)" />
    <path d="${pants}" fill="url(#fBody)" />
    <!-- Thigh denim wash highlights -->
    <path d="M 218 634 C 216 720, 224 810, 242 886 C 258 815, 256 720, 246 634 Z" fill="url(#fSheen)" opacity="0.65" filter="url(#cBlur8)" />
    <path d="M 382 634 C 384 720, 376 810, 358 886 C 342 815, 344 720, 354 634 Z" fill="url(#fSheen)" opacity="0.48" filter="url(#cBlur8)" />
    <!-- Waistband, fly, pockets & topstitching -->
    <path d="M 237 514 C 274 528, 326 528, 363 514 L 368 538 C 326 552, 274 552, 232 538 Z" fill="${r.dark}" />
    <g stroke="${stitch}" stroke-width="1.4" stroke-dasharray="3 2" fill="none" opacity="0.85">
      <path d="M 236 518 C 274 532, 326 532, 364 518" />
      <path d="M 233 535 C 274 548, 326 548, 367 535" />
      <path d="M 300 544 L 300 606 C 300 618, 306 626, 314 628" />
      <path d="M 232 544 C 236 574, 218 594, 198 604" />
      <path d="M 368 544 C 364 574, 382 594, 402 604" />
    </g>
    <circle cx="300" cy="532" r="4" fill="url(#metalGold)" />
  `);
}

function tailoredDenimShorts(p: AssetParams): string {
  const r = ramp(p.color ?? '#5478a8');
  const sh = castShadowColor(p);
  const stitch = '#e2b670';
  const shorts = fittedPantsPath({ topY: 516, hemY: 734, fit: 'straight' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${shorts}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${shorts}" fill="url(#fBody)" />
    <path d="M 237 514 C 274 528, 326 528, 363 514 L 368 538 C 326 552, 274 552, 232 538 Z" fill="${r.dark}" />
    <g stroke="${stitch}" stroke-width="1.4" stroke-dasharray="3 2" fill="none" opacity="0.85">
      <path d="M 236 518 C 274 532, 326 532, 364 518" />
      <path d="M 300 544 L 300 602 C 300 614, 306 620, 314 622" />
      <path d="M 232 544 C 236 572, 218 590, 198 600" />
      <path d="M 368 544 C 364 572, 382 590, 402 600" />
    </g>
    <circle cx="300" cy="532" r="4" fill="url(#metalGold)" />
    <!-- Rolled cuff hems -->
    <path d="M 192 722 C 228 730, 266 730, 294 722 L 294 738 C 266 746, 228 746, 192 738 Z" fill="${r.light}" />
    <path d="M 306 722 C 334 730, 372 730, 408 722 L 408 738 C 372 746, 334 746, 306 738 Z" fill="${r.light}" />
  `);
}

function cargoUtilityPants(p: AssetParams): string {
  const r = ramp(p.color ?? '#58664e');
  const sh = castShadowColor(p);
  const pants = fittedPantsPath({ topY: 504, hemY: 1172, fit: 'straight' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${pants}" fill="url(#fBody)" />
    <path d="M 239 502 C 274 514, 326 514, 361 502 L 364 526 C 326 538, 274 538, 236 526 Z" fill="${r.dark}" />
    <!-- Flap thigh cargo pockets -->
    <path d="M 190 718 L 222 724 L 228 790 L 194 784 Z" fill="${r.mid2}" stroke="${r.deep}" stroke-width="1.2" />
    <path d="M 190 718 L 222 724 L 223 738 L 191 732 Z" fill="${r.dark}" />
    <path d="M 410 718 L 378 724 L 372 790 L 406 784 Z" fill="${r.mid2}" stroke="${r.deep}" stroke-width="1.2" />
    <path d="M 410 718 L 378 724 L 377 738 L 409 732 Z" fill="${r.dark}" />
    <!-- Cuffed ankle bands -->
    <rect x="220" y="1158" width="60" height="16" rx="4" fill="${r.dark}" />
    <rect x="320" y="1158" width="60" height="16" rx="4" fill="${r.dark}" />
  `);
}

function pleatedMiniSkirt(p: AssetParams): string {
  const r = ramp(p.color ?? '#e0a6b6');
  const sh = castShadowColor(p);
  const skirt = skirtContour({ topY: 488, hemY: 718, silhouette: 'flare' });
  const pleats = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
    .map((i) => {
      const x0 = 300 + i * 11;
      const x1 = 300 + i * 24;
      return (
        `<path d="M ${x0} 508 L ${x1} 728" stroke="${r.deep}" stroke-width="2.6" opacity="0.44" fill="none" />` +
        `<path d="M ${x0 + 3} 508 L ${x1 + 3} 728" stroke="${r.specular}" stroke-width="1.6" opacity="0.42" fill="none" />`
      );
    })
    .join('');
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    ${pleats}
    <path d="M 241 486 C 276 498, 324 498, 359 486 L 362 508 C 324 520, 276 520, 238 508 Z" fill="${r.dark}" />
  `);
}

function satinBiasMidiSkirt(p: AssetParams): string {
  const r = ramp(p.color ?? '#c8a882');
  const sh = castShadowColor(p);
  const skirt = skirtContour({ topY: 488, hemY: 985, silhouette: 'aline' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="M 241 486 C 276 498, 324 498, 359 486 L 362 504 C 324 516, 276 516, 238 504 Z" fill="${r.dark}" />
    <path d="M 224 550 C 204 700, 194 840, 198 978 C 228 850, 236 700, 242 550 Z" fill="url(#fSheen)" opacity="0.72" filter="url(#cBlur8)" />
    <path d="M 278 520 C 270 680, 260 840, 254 996 M 332 520 C 340 680, 350 840, 356 996" stroke="${r.deep}" stroke-width="3" opacity="0.26" filter="url(#cBlur2)" fill="none" />
  `);
}

function tailoredPencilSkirt(p: AssetParams): string {
  const r = ramp(p.color ?? '#2c2930');
  const sh = castShadowColor(p);
  const skirt = skirtContour({ topY: 484, hemY: 880, silhouette: 'pencil' });
  return toUri(`
    ${defsBlock(r, houndstoothPattern('pencilHound', r.deep, r.light))}
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${skirt}" fill="url(#fBody)" />
    ${p.pattern === 'houndstooth' ? `<path d="${skirt}" fill="url(#pencilHound)" opacity="0.7" />` : ''}
    <path d="M 241 482 C 276 494, 324 494, 359 482 L 362 504 C 324 516, 276 516, 238 504 Z" fill="${r.dark}" />
    <path d="M 262 508 C 254 620, 250 750, 254 888 M 338 508 C 346 620, 350 750, 346 888" stroke="${r.deep}" stroke-width="1.6" opacity="0.5" fill="none" />
  `);
}

function leatherMiniSkirt(p: AssetParams): string {
  const r = ramp(p.color ?? '#201c22');
  const sh = castShadowColor(p);
  const skirt = skirtContour({ topY: 504, hemY: 738, silhouette: 'pencil' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${skirt}" fill="url(#fBody)" />
    <!-- Glossy leather sheen -->
    <path d="M 206 584 C 194 630, 194 680, 202 728 C 222 680, 224 630, 232 584 Z" fill="url(#fSheen)" opacity="0.72" filter="url(#cBlur4)" />
    <!-- Asymmetrical wrap zipper & snap belt -->
    <path d="M 239 502 C 276 514, 324 514, 361 502 L 364 524 C 324 536, 276 536, 236 524 Z" fill="${r.deep}" />
    <line x1="322" y1="530" x2="344" y2="740" stroke="url(#metalSilver)" stroke-width="3" stroke-dasharray="3 2" />
    <rect x="288" y="505" width="24" height="17" rx="3" fill="none" stroke="url(#metalSilver)" stroke-width="2.4" />
  `);
}

/* ============================================================================
 * 4. OUTERWEAR (6 Anatomically Tailored Styles)
 * ============================================================================ */

function croppedMotoJacket(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e1b20');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 3.8);
  const body = torsoContour({
    neckPath: `L 342 254 L 300 338 L 258 254`,
    hemY: 492,
    ease: 4.5,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${body}" fill="url(#fBody)" />
    <!-- Leather highlight & wide moto lapels -->
    <path d="M 258 254 L 300 338 L 250 326 L 236 286 Z" fill="${r.dark}" stroke="${r.deep}" stroke-width="1.2" />
    <path d="M 342 254 L 300 338 L 350 326 L 364 286 Z" fill="${r.deep}" stroke="${r.deep}" stroke-width="1.2" />
    <line x1="308" y1="328" x2="292" y2="496" stroke="url(#metalSilver)" stroke-width="3.2" stroke-dasharray="3 1.5" />
    <g fill="url(#metalSilver)">
      <circle cx="250" cy="272" r="2.6" /><circle cx="350" cy="272" r="2.6" />
      <circle cx="254" cy="316" r="2.6" /><circle cx="346" cy="316" r="2.6" />
    </g>
    <path d="M 239 476 C 276 488, 324 488, 361 476 L 363 496 C 324 508, 276 508, 237 496 Z" fill="${r.deep}" />
    <rect x="288" y="479" width="24" height="18" rx="3" fill="none" stroke="url(#metalSilver)" stroke-width="2.4" />
  `);
}

function beltedTrenchCoat(p: AssetParams): string {
  const r = ramp(p.color ?? '#c9b088');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 5.0);
  const coat =
    `M 256 254 L 190 282 L 210 336 C 204 374, 200 412, 210 444 ` +
    `C 226 468, 232 486, 224 514 C 198 630, 174 820, 162 1038 ` +
    `C 230 1058, 370 1058, 438 1038 ` +
    `C 426 820, 402 630, 376 514 C 368 486, 374 468, 390 444 ` +
    `C 400 412, 396 374, 390 336 L 410 282 L 344 254 L 300 356 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${coat}" fill="${sh}" opacity="0.30" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${coat}" fill="url(#fVert)" />
    <!-- Wide trench collar, lapels & double-breasted buttons -->
    <path d="M 256 254 L 300 356 L 246 332 L 236 286 Z" fill="${r.dark}" />
    <path d="M 344 254 L 300 356 L 354 332 L 364 286 Z" fill="${r.deep}" />
    <line x1="300" y1="356" x2="300" y2="1050" stroke="${r.deep}" stroke-width="2" opacity="0.6" />
    <g fill="${r.deep}">
      <circle cx="276" cy="396" r="4.2" /><circle cx="324" cy="396" r="4.2" />
      <circle cx="276" cy="442" r="4.2" /><circle cx="324" cy="442" r="4.2" />
      <circle cx="276" cy="532" r="4.2" /><circle cx="324" cy="532" r="4.2" />
    </g>
    <path d="M 232 478 C 272 494, 328 494, 368 478 L 372 502 C 328 518, 272 518, 228 502 Z" fill="${r.dark}" />
    <rect x="286" y="480" width="28" height="22" rx="4" fill="none" stroke="url(#metalGold)" stroke-width="3" />
  `);
}

function structuredBlazer(p: AssetParams): string {
  const r = ramp(p.color ?? '#36323c');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 3.8);
  const left =
    `M 258 254 L 192 280 L 214 330 C 209 362, 206 388, 212 414 ` +
    `C 226 440, 236 462, 236 486 C 224 534, 184 576, 178 634 ` +
    `C 218 644, 260 644, 294 636 L 298 486 L 278 364 Z`;
  const right =
    `M 342 254 L 408 280 L 386 330 C 391 362, 394 388, 388 414 ` +
    `C 374 440, 364 462, 364 486 C 376 534, 416 576, 422 634 ` +
    `C 382 644, 340 644, 306 636 L 302 486 L 322 364 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${left}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${right}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${left}" fill="url(#fBody)" />
    <path d="${right}" fill="url(#fVert)" />
    <path d="M 258 254 L 298 486 L 266 394 L 252 346 L 264 334 L 244 294 Z" fill="${r.dark}" />
    <path d="M 342 254 L 302 486 L 334 394 L 348 346 L 336 334 L 356 294 Z" fill="${r.deep}" />
    <circle cx="300" cy="486" r="5" fill="url(#metalGold)" />
    <line x1="226" y1="548" x2="270" y2="556" stroke="${r.deep}" stroke-width="3.5" stroke-linecap="round" />
    <line x1="374" y1="548" x2="330" y2="556" stroke="${r.deep}" stroke-width="3.5" stroke-linecap="round" />
  `);
}

function croppedDenimJacket(p: AssetParams): string {
  const r = ramp(p.color ?? '#4b6c9e');
  const sh = castShadowColor(p);
  const stitch = '#dfad64';
  const sl = poseSleeves(p.pose, 'long', 3.5);
  const body = torsoContour({
    neckPath: `L 340 254 L 300 296 L 260 254`,
    hemY: 486,
    ease: 3.5,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    <!-- Denim collar, chest flap pockets & copper rivets -->
    <path d="M 260 254 L 300 296 L 278 308 L 246 274 Z" fill="${r.dark}" />
    <path d="M 340 254 L 300 296 L 322 308 L 354 274 Z" fill="${r.deep}" />
    <rect x="242" y="346" width="38" height="44" rx="2" fill="${r.mid2}" stroke="${stitch}" stroke-width="1.2" stroke-dasharray="3 2" />
    <rect x="320" y="346" width="38" height="44" rx="2" fill="${r.mid2}" stroke="${stitch}" stroke-width="1.2" stroke-dasharray="3 2" />
    <path d="M 240 472 C 276 482, 324 482, 360 472 L 362 492 C 324 502, 276 502, 238 492 Z" fill="${r.dark}" />
    <g fill="url(#metalGold)">
      <circle cx="300" cy="316" r="3.6" /><circle cx="300" cy="364" r="3.6" />
      <circle cx="300" cy="412" r="3.6" /><circle cx="300" cy="460" r="3.6" />
    </g>
  `);
}

function croppedPufferJacket(p: AssetParams): string {
  const r = ramp(p.color ?? '#eae7e1');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 6.5);
  const body = torsoContour({
    neckPath: `L 342 246 C 324 258, 276 258, 258 246`,
    shoulderY: 274,
    hemY: 505,
    ease: 8,
  });
  const baffles = [322, 374, 426, 474]
    .map(
      (y) =>
        `<path d="M 212 ${y} C 266 ${y + 12}, 334 ${y + 12}, 388 ${y}" stroke="${r.deep}" stroke-width="3" opacity="0.45" fill="none" />` +
        `<path d="M 212 ${y + 4} C 266 ${y + 16}, 334 ${y + 16}, 388 ${y + 4}" stroke="${r.specular}" stroke-width="2" opacity="0.55" fill="none" />`,
    )
    .join('');
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${body}" fill="url(#fBody)" />
    <!-- Plush high funnel collar -->
    <path d="M 254 252 C 276 266, 324 266, 346 252 C 340 226, 322 218, 300 218 C 278 218, 260 226, 254 252 Z" fill="url(#fVert)" />
    ${baffles}
    <line x1="300" y1="262" x2="300" y2="514" stroke="${r.deep}" stroke-width="2.4" opacity="0.65" />
  `);
}

function cashmereOvercoat(p: AssetParams): string {
  const r = ramp(p.color ?? '#9d7656');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 5.5);
  const coat =
    `M 256 252 L 188 282 L 208 338 C 202 380, 198 424, 206 468 ` +
    `C 188 640, 168 860, 158 1118 C 230 1138, 370 1138, 442 1118 ` +
    `C 432 860, 412 640, 394 468 C 402 424, 398 380, 392 338 ` +
    `L 412 282 L 344 252 L 300 374 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${coat}" fill="${sh}" opacity="0.32" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${coat}" fill="url(#fVert)" />
    <path d="M 256 252 L 300 374 L 244 338 L 234 288 Z" fill="${r.dark}" />
    <path d="M 344 252 L 300 374 L 356 338 L 366 288 Z" fill="${r.deep}" />
    <line x1="300" y1="374" x2="300" y2="1128" stroke="${r.deep}" stroke-width="2" opacity="0.55" />
    <path d="M 238 482 C 276 496, 324 496, 362 482 L 364 504 C 324 518, 276 518, 236 504 Z" fill="${r.dark}" />
  `);
}

/* ============================================================================
 * 5. SWIMWEAR & RESORT (4 Anatomically Fitted Styles)
 * ============================================================================ */

function wrapHalterBikini(p: AssetParams): string {
  const r = ramp(p.color ?? '#c92e46');
  const sh = castShadowColor(p);
  const cupL = `M 216 408 C 242 424, 276 423, 294 409 C 296 378, 274 344, 253 330 C 230 350, 212 382, 216 408 Z`;
  const cupR = `M 384 408 C 358 424, 324 423, 306 409 C 304 378, 326 344, 347 330 C 370 350, 388 382, 384 408 Z`;
  const bottom =
    `M 196 558 C 232 588, 270 600, 300 600 C 330 600, 368 588, 404 558 ` +
    `C 406 574, 400 590, 392 602 C 354 616, 326 648, 313 678 ` +
    `C 305 680, 295 680, 287 678 C 274 648, 246 616, 208 602 C 200 590, 194 574, 196 558 Z`;
  return toUri(`
    ${defsBlock(r)}
    <g opacity="0.32" filter="url(#cBlur4)">
      <path d="${cupL}" fill="${sh}" transform="translate(0, 4)" />
      <path d="${cupR}" fill="${sh}" transform="translate(0, 4)" />
      <path d="${bottom}" fill="${sh}" transform="translate(0, 4)" />
    </g>
    <path d="M 274 242 C 270 278, 260 310, 252 332 M 326 242 C 330 278, 340 310, 348 332" stroke="${r.mid}" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <!-- Criss-cross wrap underbust ties -->
    <path d="M 222 412 L 244 452 L 356 452 L 378 412" stroke="${r.dark}" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="${cupL}" fill="url(#fBody)" />
    <path d="${cupR}" fill="url(#fVert)" />
    <path d="${bottom}" fill="url(#fBody)" />
  `);
}

function cutoutMonokini(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e2c44');
  const sh = castShadowColor(p);
  const suit =
    `M 232 332 C 254 318, 282 328, 300 364 C 318 328, 346 318, 368 332 ` +
    `L 386 382 C 388 402, 378 418, 360 426 C 334 432, 316 446, 314 484 ` +
    `C 316 520, 340 546, 404 558 C 406 574, 400 590, 392 602 ` +
    `C 354 616, 326 648, 313 678 C 305 680, 295 680, 287 678 ` +
    `C 274 648, 246 616, 208 602 C 200 590, 194 574, 196 558 ` +
    `C 260 546, 284 520, 286 484 C 284 446, 266 432, 240 426 ` +
    `C 222 418, 212 402, 214 382 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${suit}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="M 254 258 L 248 332 M 346 258 L 352 332" stroke="${r.mid}" stroke-width="5.5" stroke-linecap="round" />
    <path d="${suit}" fill="url(#fBody)" />
    ${bustContour(r, 0.96)}
    <circle cx="300" cy="408" r="7.5" fill="none" stroke="url(#metalGold)" stroke-width="3.2" />
  `);
}

function bandeauBikini(p: AssetParams): string {
  const r = ramp(p.color ?? '#e89d3e');
  const sh = castShadowColor(p);
  const band =
    `M 216 346 C 254 358, 346 358, 384 346 C 388 372, 388 394, 383 414 ` +
    `C 346 426, 254 426, 217 414 C 212 394, 212 372, 216 346 Z`;
  const bottom =
    `M 200 554 C 236 582, 272 592, 300 592 C 328 592, 364 582, 400 554 ` +
    `C 402 572, 396 590, 388 604 C 352 618, 326 648, 313 678 ` +
    `C 305 680, 295 680, 287 678 C 274 648, 248 618, 212 604 C 204 590, 198 572, 200 554 Z`;
  return toUri(`
    ${defsBlock(r)}
    <g opacity="0.30" filter="url(#cBlur4)">
      <path d="${band}" fill="${sh}" transform="translate(0, 4)" />
      <path d="${bottom}" fill="${sh}" transform="translate(0, 4)" />
    </g>
    <path d="${band}" fill="url(#fBody)" />
    <path d="${bottom}" fill="url(#fBody)" />
    ${bustContour(r, 0.96)}
    <rect x="293" y="352" width="14" height="66" rx="5" fill="${r.dark}" />
  `);
}

function sheerResortKaftan(p: AssetParams): string {
  const r = ramp(p.color ?? '#f5efe6');
  const accent = p.color2 ?? '#2d828c';
  const body =
    `M 258 254 L 182 288 L 152 544 L 188 552 L 194 490 L 172 980 ` +
    `C 235 1004, 365 1004, 428 980 L 406 490 L 412 552 L 448 544 ` +
    `L 418 288 L 342 254 L 300 356 Z`;
  return toUri(`
    ${defsBlock(r, leopardPattern('kaftanPat', accent))}
    <path d="${body}" fill="url(#fSheer)" />
    <path d="${body}" fill="url(#kaftanPat)" opacity="0.38" />
    <path d="M 258 254 L 300 356 L 342 254" stroke="${accent}" stroke-width="5" fill="none" />
    <path d="M 240 486 C 276 496, 324 496, 360 486" stroke="${accent}" stroke-width="4.5" stroke-linecap="round" fill="none" />
  `);
}


/* ============================================================================
 * 6. SHOES (9 Anatomically Fitted Styles for Left x220-280 & Right x323-383)
 * ============================================================================ */

function stilettoPumps(p: AssetParams): string {
  const r = ramp(p.color ?? '#9e192d');
  const sh = castShadowColor(p);
  const pair = (cx: number, dir: 1 | -1) => `
    <ellipse cx="${cx}" cy="1238" rx="34" ry="8" fill="${sh}" opacity="0.38" filter="url(#cBlur2)" />
    <rect x="${cx - dir * 16}" y="1216" width="4.2" height="24" rx="1.4" fill="${r.deep}" />
    <path d="M ${cx - 30} 1212 C ${cx - 30} 1232, ${cx - 12} 1240, ${cx} 1240 C ${cx + 12} 1240, ${cx + 30} 1232, ${cx + 30} 1212 C ${cx + 28} 1206, ${cx + 16} 1210, ${cx} 1218 C ${cx - 16} 1210, ${cx - 28} 1206, ${cx - 30} 1212 Z" fill="url(#fBody)" />
    <path d="M ${cx - 20} 1228 C ${cx} 1238, ${cx + 20} 1238, ${cx + 28} 1228" stroke="#7d1c2b" stroke-width="2" fill="none" />
    <path d="M ${cx - 12} 1223 C ${cx} 1228, ${cx + 12} 1228, ${cx + 18} 1221" stroke="${r.specular}" stroke-width="1.5" opacity="0.7" fill="none" />
  `;
  return toUri(defsBlock(r) + pair(250, 1) + pair(352, -1));
}

function strappyHeels(p: AssetParams): string {
  const r = ramp(p.color ?? '#d4af37');
  const sh = castShadowColor(p);
  const pair = (cx: number, dir: 1 | -1) => `
    <ellipse cx="${cx}" cy="1236" rx="33" ry="8" fill="${sh}" opacity="0.36" filter="url(#cBlur2)" />
    <rect x="${cx - dir * 16}" y="1216" width="4" height="22" rx="1.2" fill="${r.deep}" />
    <ellipse cx="${cx}" cy="1232" rx="31" ry="8.5" fill="${r.dark}" />
    <!-- Ankle strap & delicate toe straps -->
    <path d="M ${cx - 18} 1168 C ${cx - 6} 1174, ${cx + 6} 1174, ${cx + 18} 1168" stroke="url(#fBody)" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <circle cx="${cx - dir * 17}" cy="1169" r="3" fill="url(#metalGold)" />
    <path d="M ${cx - 28} 1218 C ${cx - 10} 1225, ${cx + 10} 1225, ${cx + 28} 1218" stroke="url(#fBody)" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <path d="M ${cx - 14} 1172 L ${cx + 14} 1220 M ${cx + 14} 1172 L ${cx - 14} 1220" stroke="${r.light}" stroke-width="2.6" fill="none" />
  `;
  return toUri(defsBlock(r) + pair(250, 1) + pair(352, -1));
}

function platformSandals(p: AssetParams): string {
  const r = ramp(p.color ?? '#f4ede4');
  const sh = castShadowColor(p);
  const pair = (cx: number) => `
    <ellipse cx="${cx}" cy="1240" rx="35" ry="8.5" fill="${sh}" opacity="0.38" filter="url(#cBlur2)" />
    <!-- Chunky platform sole -->
    <rect x="${cx - 32}" y="1220" width="64" height="19" rx="7" fill="${r.dark}" stroke="${r.deep}" stroke-width="1.2" />
    <rect x="${cx - 30}" y="1222" width="60" height="4" rx="2" fill="${r.specular}" opacity="0.5" />
    <!-- Wide sculpted upper & ankle strap -->
    <path d="M ${cx - 29} 1218 C ${cx - 12} 1204, ${cx + 12} 1204, ${cx + 29} 1218 Z" fill="url(#fBody)" />
    <path d="M ${cx - 19} 1166 C ${cx - 6} 1172, ${cx + 6} 1172, ${cx + 19} 1166" stroke="url(#fBody)" stroke-width="5.5" fill="none" stroke-linecap="round" />
    <rect x="${cx + 14}" y="1162" width="6" height="8" rx="1.5" fill="url(#metalGold)" />
  `;
  return toUri(defsBlock(r) + pair(250) + pair(352));
}

function slingbackMules(p: AssetParams): string {
  const r = ramp(p.color ?? '#221e26');
  const sh = castShadowColor(p);
  const pair = (cx: number) => `
    <ellipse cx="${cx}" cy="1237" rx="33" ry="8.5" fill="${sh}" opacity="0.36" filter="url(#cBlur2)" />
    <ellipse cx="${cx}" cy="1233" rx="32" ry="9" fill="${r.deep}" />
    <path d="M ${cx - 31} 1226 C ${cx - 29} 1205, ${cx + 29} 1205, ${cx + 31} 1226 C ${cx + 18} 1238, ${cx - 18} 1238, ${cx - 31} 1226 Z" fill="url(#fBody)" />
    <path d="M ${cx - 19} 1208 C ${cx - 6} 1196, ${cx + 6} 1196, ${cx + 19} 1208" stroke="${r.mid2}" stroke-width="3.2" fill="none" />
    <rect x="${cx - 8}" y="1214" width="16" height="6" rx="2" fill="url(#metalGold)" />
  `;
  return toUri(defsBlock(r) + pair(250) + pair(352));
}

function balletFlats(p: AssetParams): string {
  const r = ramp(p.color ?? '#e2b9b2');
  const sh = castShadowColor(p);
  const pair = (cx: number) => `
    <ellipse cx="${cx}" cy="1236" rx="34" ry="9" fill="${sh}" opacity="0.32" filter="url(#cBlur2)" />
    <ellipse cx="${cx}" cy="1233" rx="33" ry="9" fill="${r.dark}" />
    <path d="M ${cx - 32} 1228 C ${cx - 30} 1208, ${cx - 16} 1208, ${cx} 1216 C ${cx + 16} 1208, ${cx + 30} 1208, ${cx + 32} 1228 C ${cx + 18} 1238, ${cx - 18} 1238, ${cx - 32} 1228 Z" fill="url(#fBody)" />
    <!-- Delicate satin toe bow -->
    <path d="M ${cx} 1221 C ${cx - 8} 1215, ${cx - 12} 1221, ${cx - 4} 1224 Z M ${cx} 1221 C ${cx + 8} 1215, ${cx + 12} 1221, ${cx + 4} 1224 Z" fill="${r.deep}" />
    <circle cx="${cx}" cy="1221" r="2.2" fill="${r.dark}" />
  `;
  return toUri(defsBlock(r) + pair(250) + pair(352));
}

function classicLoafers(p: AssetParams): string {
  const r = ramp(p.color ?? '#5a3622');
  const sh = castShadowColor(p);
  const pair = (cx: number) => `
    <ellipse cx="${cx}" cy="1236" rx="35" ry="9.5" fill="${sh}" opacity="0.36" filter="url(#cBlur2)" />
    <ellipse cx="${cx}" cy="1233" rx="34" ry="10" fill="${r.deep}" />
    <path d="M ${cx - 32} 1226 C ${cx - 31} 1200, ${cx + 31} 1200, ${cx + 32} 1226 C ${cx + 18} 1236, ${cx - 18} 1236, ${cx - 32} 1226 Z" fill="url(#fBody)" />
    <path d="M ${cx - 21} 1208 C ${cx - 6} 1214, ${cx + 6} 1214, ${cx + 21} 1208" stroke="${r.dark}" stroke-width="5" fill="none" stroke-linecap="round" />
    <rect x="${cx - 10}" y="1207" width="20" height="5" rx="2.5" fill="none" stroke="url(#metalGold)" stroke-width="2" />
  `;
  return toUri(defsBlock(r) + pair(250) + pair(352));
}

function courtSneakers(p: AssetParams): string {
  const r = ramp(p.color ?? '#f5f2ec');
  const accent = p.color2 ?? '#2f4e3d';
  const sh = castShadowColor(p);
  const pair = (cx: number) => `
    <ellipse cx="${cx}" cy="1237" rx="36" ry="9.5" fill="${sh}" opacity="0.34" filter="url(#cBlur2)" />
    <rect x="${cx - 34}" y="1222" width="68" height="14" rx="7" fill="#faf8f5" stroke="#d5cfc6" stroke-width="1.2" />
    <path d="M ${cx - 30} 1223 C ${cx - 30} 1196, ${cx - 14} 1188, ${cx} 1188 C ${cx + 14} 1188, ${cx + 30} 1196, ${cx + 30} 1223 Z" fill="url(#fBody)" />
    <path d="M ${cx - 26} 1214 L ${cx + 26} 1214" stroke="${accent}" stroke-width="3.5" stroke-linecap="round" />
    <g stroke="#ffffff" stroke-width="2.2" stroke-linecap="round">
      <line x1="${cx - 9}" y1="1196" x2="${cx + 9}" y2="1196" />
      <line x1="${cx - 10}" y1="1202" x2="${cx + 10}" y2="1202" />
      <line x1="${cx - 11}" y1="1208" x2="${cx + 11}" y2="1208" />
    </g>
  `;
  return toUri(defsBlock(r) + pair(250) + pair(352));
}

function chelseaBoots(p: AssetParams): string {
  const r = ramp(p.color ?? '#272228');
  const sh = castShadowColor(p);
  const boot = (cx: number, outDir: 1 | -1) => `
    <ellipse cx="${cx}" cy="1236" rx="34" ry="9" fill="${sh}" opacity="0.38" filter="url(#cBlur2)" />
    <path d="M ${cx - 19} 1126 L ${cx + 19} 1126 L ${cx + 20} 1166 C ${cx + 28} 1186, ${cx + 31} 1210, ${cx + 30} 1226 C ${cx + 14} 1235, ${cx - 14} 1235, ${cx - 30} 1226 C ${cx - 31} 1210, ${cx - 28} 1186, ${cx - 20} 1166 Z" fill="url(#fBody)" />
    <!-- Lugged sole -->
    <path d="M ${cx - 31} 1223 C ${cx - 14} 1232, ${cx + 14} 1232, ${cx + 31} 1223 L ${cx + 31} 1233 C ${cx + 14} 1241, ${cx - 14} 1241, ${cx - 31} 1233 Z" fill="${r.deep}" />
    <!-- Elastic gore panel -->
    <rect x="${cx + outDir * 6}" y="1132" width="10" height="36" rx="4" fill="${r.deep}" />
    <path d="M ${cx - outDir * 6} 1140 C ${cx - outDir * 8} 1172, ${cx - outDir * 12} 1200, ${cx - outDir * 16} 1218" stroke="${r.specular}" stroke-width="2.8" opacity="0.45" filter="url(#cBlur2)" fill="none" stroke-linecap="round" />
  `;
  return toUri(defsBlock(r) + boot(250, -1) + boot(352, 1));
}

function overKneeBoots(p: AssetParams): string {
  const r = ramp(p.color ?? '#201c24');
  const sh = castShadowColor(p);
  const bootL =
    `M 218 852 C 238 860, 266 860, 285 852 ` +
    `L 277 906 C 282 956, 286 1005, 278 1089 L 269 1166 ` +
    `C 278 1190, 282 1214, 280 1228 C 264 1237, 236 1237, 220 1228 ` +
    `C 218 1212, 226 1188, 235 1166 L 226 1099 ` +
    `C 214 1052, 212 1005, 217 963 L 222 906 Z`;
  const bootR =
    `M 315 852 C 334 860, 362 860, 382 852 ` +
    `L 378 906 C 384 963, 388 1005, 374 1099 L 365 1166 ` +
    `C 374 1188, 382 1212, 380 1228 C 364 1237, 336 1237, 320 1228 ` +
    `C 318 1214, 322 1190, 331 1166 L 322 1089 ` +
    `C 314 1005, 318 956, 323 906 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${bootL}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${bootR}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${bootL}" fill="url(#fBody)" />
    <path d="${bootR}" fill="url(#fVert)" />
    <path d="M 234 868 C 232 950, 234 1050, 240 1160" stroke="${r.specular}" stroke-width="4" opacity="0.38" filter="url(#cBlur4)" fill="none" stroke-linecap="round" />
    <path d="M 366 868 C 368 950, 366 1050, 360 1160" stroke="${r.specular}" stroke-width="3" opacity="0.28" filter="url(#cBlur4)" fill="none" stroke-linecap="round" />
    <path d="M 236 1152 C 246 1158, 258 1158, 268 1152 M 332 1152 C 342 1158, 354 1158, 364 1152" stroke="${r.deep}" stroke-width="2" opacity="0.6" fill="none" />
  `);
}


/** Barefoot: the base figure's sculpted feet render naturally — no overlay. */
function barefoot(_p: AssetParams): string {
  return toUri('');
}

/* ============================================================================
 * CATALOG & GENERATOR REGISTRY
 * ============================================================================ */

export const CLOTHING_CATALOG: StyleCatalogEntry[] = [
  // Tops
  { id: 'top_silk_camisole', name: 'Silk Lace Camisole', category: 'tops', defaultColor: '#f2e8df' },
  { id: 'top_sweetheart_corset', name: 'Sweetheart Boned Corset', category: 'tops', defaultColor: '#1e1b22' },
  { id: 'top_off_shoulder', name: 'Bardot Off-Shoulder Top', category: 'tops', defaultColor: '#b83344' },
  { id: 'top_wrap_blouse', name: 'Wrap Satin Blouse', category: 'tops', defaultColor: '#d9c5b2' },
  { id: 'top_cropped_cardigan', name: 'Pearl-Button Cardigan', category: 'tops', defaultColor: '#c9939e' },
  { id: 'top_halter_crop', name: 'Tailored Halter Crop', category: 'tops', defaultColor: '#223344' },
  { id: 'top_ribbed_bodysuit', name: 'Scoop Ribbed Bodysuit', category: 'tops', defaultColor: '#f3efe9' },
  { id: 'top_poplin_shirt', name: 'Crisp Poplin Button-Down', category: 'tops', defaultColor: '#eef3f8' },
  { id: 'top_lace_bralette', name: 'Chantilly Lace Bralette', category: 'tops', defaultColor: '#241f29' },

  // Dresses & Gowns
  { id: 'dress_satin_slip', name: 'Bias-Cut Satin Slip', category: 'dresses', defaultColor: '#c88c7a' },
  { id: 'dress_blazer_mini', name: 'Double-Breasted Blazer Dress', category: 'dresses', defaultColor: '#28252d' },
  { id: 'dress_aline_sundress', name: 'A-Line Riviera Sundress', category: 'dresses', defaultColor: '#e88b72', defaultColor2: '#8a2b20' },
  { id: 'dress_wrap_cocktail', name: 'Emerald Wrap Cocktail Dress', category: 'dresses', defaultColor: '#1a5e4d' },
  { id: 'dress_bodycon_midi', name: 'Ruched Bodycon Midi', category: 'dresses', defaultColor: '#5a2135' },
  { id: 'dress_mermaid_gown', name: 'Midnight Mermaid Gown', category: 'dresses', defaultColor: '#132440' },
  { id: 'dress_tulle_ballgown', name: 'Couture Tulle Ballgown', category: 'dresses', defaultColor: '#c92a42' },
  { id: 'dress_pleated_shirt', name: 'Belted Pleated Shirtdress', category: 'dresses', defaultColor: '#5e7a68' },
  { id: 'dress_offshoulder_gown', name: 'Velvet Off-Shoulder Gown', category: 'dresses', defaultColor: '#8b1e2d' },
  { id: 'dress_wrap_linen_midi', name: 'Linen Wrap Midi Dress', category: 'dresses', defaultColor: '#c2654c' },
  { id: 'dress_floral_maxi', name: 'Botanical Chiffon Maxi', category: 'dresses', defaultColor: '#d9788e', defaultColor2: '#f5dde3' },
  { id: 'dress_sequin_party_mini', name: 'Champagne Sequin Party Mini', category: 'dresses', defaultColor: '#e0b878', defaultColor2: '#fff8dc' },
  { id: 'dress_tiered_cocktail', name: 'Tiered Ruffle Cocktail Mini', category: 'dresses', defaultColor: '#b82942' },
  { id: 'dress_feather_satin_party', name: 'Satin Bow Party Mini', category: 'dresses', defaultColor: '#d48682' },
  { id: 'dress_club_cutout_mini', name: 'Asymmetric Cutout Club Mini', category: 'dresses', defaultColor: '#1c1820' },
  { id: 'dress_club_corset_velvet', name: 'Velvet Corset Club Mini', category: 'dresses', defaultColor: '#1f1b24' },
  { id: 'dress_club_metallic_drape', name: 'Liquid Metal Draped Mini', category: 'dresses', defaultColor: '#c8d2dc' },
  { id: 'dress_ankara_peplum', name: 'Ankara Peplum Midi Dress', category: 'dresses', defaultColor: '#d95829', defaultColor2: '#1d3c78' },
  { id: 'dress_aso_ebi_lace', name: 'Aso-Ebi Beaded Lace Gown', category: 'dresses', defaultColor: '#155c44', defaultColor2: '#e6c15a' },
  { id: 'dress_iro_buba', name: 'Iro & Buba Brocade Ensemble', category: 'dresses', defaultColor: '#1d4488', defaultColor2: '#e6c35c' },
  { id: 'dress_adire_kaftan', name: 'Adire Indigo Boubou Kaftan', category: 'dresses', defaultColor: '#1b3568', defaultColor2: '#e6c15a' },

  // Bottoms
  { id: 'bot_highwaist_trousers', name: 'High-Waist Tailored Trousers', category: 'bottoms', defaultColor: '#36333b' },
  { id: 'bot_wide_palazzo', name: 'Draped Wide-Leg Palazzo', category: 'bottoms', defaultColor: '#d8c7af' },
  { id: 'bot_skinny_jeans', name: 'High-Rise Skinny Jeans', category: 'bottoms', defaultColor: '#3b5785' },
  { id: 'bot_denim_shorts', name: 'Cuffed Denim Shorts', category: 'bottoms', defaultColor: '#5478a8' },
  { id: 'bot_cargo_pants', name: 'Utility Cargo Trousers', category: 'bottoms', defaultColor: '#58664e' },
  { id: 'bot_pleated_mini', name: 'Pleated Tennis Mini Skirt', category: 'bottoms', defaultColor: '#e0a6b6' },
  { id: 'bot_satin_midi', name: 'Bias-Cut Satin Midi Skirt', category: 'bottoms', defaultColor: '#c8a882' },
  { id: 'bot_pencil_skirt', name: 'Tailored Pencil Skirt', category: 'bottoms', defaultColor: '#2c2930' },
  { id: 'bot_leather_mini', name: 'Moto Leather Mini Skirt', category: 'bottoms', defaultColor: '#201c22' },

  // Outerwear
  { id: 'out_moto_jacket', name: 'Cropped Leather Moto Jacket', category: 'outerwear', defaultColor: '#1e1b20' },
  { id: 'out_belted_trench', name: 'Classic Belted Trench Coat', category: 'outerwear', defaultColor: '#c9b088' },
  { id: 'out_structured_blazer', name: 'Tailored Wool Blazer', category: 'outerwear', defaultColor: '#36323c' },
  { id: 'out_denim_jacket', name: 'Cropped Indigo Denim Jacket', category: 'outerwear', defaultColor: '#4b6c9e' },
  { id: 'out_puffer_jacket', name: 'Funnel-Neck Puffer Jacket', category: 'outerwear', defaultColor: '#eae7e1' },
  { id: 'out_cashmere_coat', name: 'Longline Cashmere Overcoat', category: 'outerwear', defaultColor: '#9d7656' },

  // Swimwear & Resort
  { id: 'swim_wrap_bikini', name: 'Wrap Halter Bikini', category: 'swimwear', defaultColor: '#c92e46' },
  { id: 'swim_cutout_monokini', name: 'Gold-Ring Cutout Monokini', category: 'swimwear', defaultColor: '#1e2c44' },
  { id: 'swim_bandeau_bikini', name: 'Sculpted Bandeau Bikini', category: 'swimwear', defaultColor: '#e89d3e' },
  { id: 'swim_resort_kaftan', name: 'Sheer Resort Kaftan', category: 'swimwear', defaultColor: '#f5efe6', defaultColor2: '#2d828c' },

  // Shoes
  { id: 'shoe_stiletto_pumps', name: 'Pointed Stiletto Pumps', category: 'shoes', defaultColor: '#9e192d' },
  { id: 'shoe_strappy_heels', name: 'Metallic Strappy Sandals', category: 'shoes', defaultColor: '#d4af37' },
  { id: 'shoe_platform_sandals', name: 'Chunky Platform Sandals', category: 'shoes', defaultColor: '#f4ede4' },
  { id: 'shoe_slingback_mules', name: 'Buckled Slingback Mules', category: 'shoes', defaultColor: '#221e26' },
  { id: 'shoe_ballet_flats', name: 'Satin Bow Ballet Flats', category: 'shoes', defaultColor: '#e2b9b2' },
  { id: 'shoe_classic_loafers', name: 'Gold-Bit Penny Loafers', category: 'shoes', defaultColor: '#5a3622' },
  { id: 'shoe_court_sneakers', name: 'Minimalist Court Sneakers', category: 'shoes', defaultColor: '#f5f2ec', defaultColor2: '#2f4e3d' },
  { id: 'shoe_chelsea_boots', name: 'Lug-Sole Chelsea Boots', category: 'shoes', defaultColor: '#272228' },
  { id: 'shoe_overknee_boots', name: 'Over-the-Knee Boots', category: 'shoes', defaultColor: '#201c24' },
  ...EXTRA_CLOTHING_CATALOG,
];

export const CLOTHING_GENERATORS: Record<string, (p: AssetParams) => string> = {
  // Tops
  top_silk_camisole: silkCamisole,
  top_sweetheart_corset: sweetheartCorset,
  top_off_shoulder: offShoulderTop,
  top_wrap_blouse: wrapSilkBlouse,
  top_cropped_cardigan: croppedCardigan,
  top_halter_crop: halterCropTop,
  top_ribbed_bodysuit: ribbedBodysuit,
  top_poplin_shirt: poplinButtonDown,
  top_lace_bralette: laceBraletteTop,

  // Dresses
  dress_satin_slip: satinSlipDress,
  dress_blazer_mini: tailoredBlazerDress,
  dress_aline_sundress: alineSundress,
  dress_wrap_cocktail: wrapCocktailDress,
  dress_bodycon_midi: bodyconMidiDress,
  dress_mermaid_gown: mermaidEveningGown,
  dress_tulle_ballgown: tulleBallGown,
  dress_pleated_shirt: pleatedShirtDress,
  dress_offshoulder_gown: offShoulderGown,
  dress_wrap_linen_midi: wrapLinenMidiDress,
  dress_floral_maxi: botanicalChiffonMaxi,
  dress_sequin_party_mini: sequinPartyMini,
  dress_tiered_cocktail: tieredCocktailMini,
  dress_feather_satin_party: satinBowPartyDress,
  dress_club_cutout_mini: clubCutoutMini,
  dress_club_corset_velvet: clubVelvetCorsetMini,
  dress_club_metallic_drape: clubMetallicDrapeMini,
  dress_ankara_peplum: ankaraPeplumDress,
  dress_aso_ebi_lace: asoEbiLaceGown,
  dress_iro_buba: iroAndBubaEnsemble,
  dress_adire_kaftan: adireIndigoKaftan,

  // Bottoms
  bot_highwaist_trousers: highWaistTrousers,
  bot_wide_palazzo: wideLegPalazzo,
  bot_skinny_jeans: skinnyDenimJeans,
  bot_denim_shorts: tailoredDenimShorts,
  bot_cargo_pants: cargoUtilityPants,
  bot_pleated_mini: pleatedMiniSkirt,
  bot_satin_midi: satinBiasMidiSkirt,
  bot_pencil_skirt: tailoredPencilSkirt,
  bot_leather_mini: leatherMiniSkirt,

  // Outerwear
  out_moto_jacket: croppedMotoJacket,
  out_belted_trench: beltedTrenchCoat,
  out_structured_blazer: structuredBlazer,
  out_denim_jacket: croppedDenimJacket,
  out_puffer_jacket: croppedPufferJacket,
  out_cashmere_coat: cashmereOvercoat,

  // Swimwear
  swim_wrap_bikini: wrapHalterBikini,
  swim_cutout_monokini: cutoutMonokini,
  swim_bandeau_bikini: bandeauBikini,
  swim_resort_kaftan: sheerResortKaftan,

  // Shoes
  shoe_stiletto_pumps: stilettoPumps,
  shoe_strappy_heels: strappyHeels,
  shoe_platform_sandals: platformSandals,
  shoe_slingback_mules: slingbackMules,
  shoe_ballet_flats: balletFlats,
  shoe_classic_loafers: classicLoafers,
  shoe_court_sneakers: courtSneakers,
  shoe_chelsea_boots: chelseaBoots,
  shoe_overknee_boots: overKneeBoots,
  shoe_barefoot: barefoot,
  ...EXTRA_CLOTHING_GENERATORS,
};

export function clothingAsset(assetId: string, p: AssetParams): string {
  const fn = CLOTHING_GENERATORS[assetId];
  return fn ? fn(p) : toUri('');
}
