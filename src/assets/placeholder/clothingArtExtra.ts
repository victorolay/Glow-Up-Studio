import type { AssetParams } from './params';
import { shade, toUri } from './primitives';
import { castShadowColor, defsBlock, fittedPantsPath, ramp, type StyleCatalogEntry } from './shared';
import { bustContour, lacePattern, poseSleeves, skirtContour, torsoContour } from './clothingArt';

/* ============================================================================
 * EXTRA DRESSES & GOWNS (19 New Occasion-Tailored Styles)
 * ============================================================================ */

function crochetBeachDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#efe5d6');
  const sh = castShadowColor(p);
  const body =
    `M 274 234 L 326 234 L 352 332 C 378 362, 388 386, 384 410 ` +
    `L 358 490 C 378 552, 412 600, 412 624 L 404 756 C 340 772, 260 772, 196 756 ` +
    `L 188 624 C 188 600, 222 552, 242 490 L 216 410 C 212 386, 222 362, 248 332 Z`;
  const meshPat = `
    <pattern id="crochPat" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="${r.light}" stroke-width="1.4" />
      <circle cx="8" cy="8" r="1.8" fill="${r.specular}" opacity="0.7" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, meshPat)}
    <path d="${body}" fill="${sh}" opacity="0.24" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fSheer)" />
    <path d="${body}" fill="url(#crochPat)" />
    ${bustContour(r, 0.85)}
    <path d="M 274 230 L 300 264 L 326 230" stroke="${r.dark}" stroke-width="3" fill="none" />
    <path d="M 196 754 C 260 770, 340 770, 404 754" stroke="${r.specular}" stroke-width="2.5" stroke-dasharray="5 4" fill="none" />
  `);
}

function tieredBreezeSundress(p: AssetParams): string {
  const r = ramp(p.color ?? '#f4b5a6');
  const accent = p.color2 ?? '#e86f58';
  const sh = castShadowColor(p);
  const bodice = torsoContour({
    neckPath: `L 360 326 C 338 348, 262 348, 240 326`,
    leftShoulderX: 224,
    shoulderY: 328,
    hemY: 484,
    ease: 1.5,
  });
  const skirt = skirtContour({ topY: 476, hemY: 1125, silhouette: 'flare' });
  const tier1 = `M 178 690 C 244 714, 356 714, 422 690`;
  const tier2 = `M 154 910 C 236 936, 364 936, 446 910`;
  return toUri(`
    ${defsBlock(r)}
    <path d="M 248 256 L 244 330 M 352 256 L 356 330" stroke="${accent}" stroke-width="3.2" stroke-linecap="round" />
    <path d="${skirt}" fill="${sh}" opacity="0.24" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.88)}
    <path d="${tier1}" stroke="${r.deep}" stroke-width="2" opacity="0.45" fill="none" />
    <path d="${tier2}" stroke="${r.deep}" stroke-width="2" opacity="0.45" fill="none" />
    <path d="M 240 476 C 276 488, 324 488, 360 476" stroke="${accent}" stroke-width="3" fill="none" />
  `);
}

function floralTeaCocktailDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#e8c4cf');
  const bloom = p.color2 ?? '#b84b6e';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'cap', 2.8);
  const bodice = torsoContour({
    neckPath: `L 344 268 C 324 310, 276 310, 256 268`,
    hemY: 492,
    ease: 1.5,
  });
  const skirt = skirtContour({ topY: 484, hemY: 900, silhouette: 'flare' });
  const pat = `
    <pattern id="teaFloral" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="9" cy="10" r="3.6" fill="${bloom}" opacity="0.65" />
      <circle cx="13" cy="13" r="2.6" fill="${bloom}" opacity="0.55" />
      <circle cx="23" cy="22" r="3.2" fill="${r.specular}" opacity="0.7" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, pat)}
    <path d="${sl.left}" fill="url(#fSheer)" />
    <path d="${sl.right}" fill="url(#fSheer)" />
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${skirt}" fill="url(#teaFloral)" />
    <path d="${bodice}" fill="url(#fBody)" />
    <path d="${bodice}" fill="url(#teaFloral)" />
    ${bustContour(r, 0.92)}
    <path d="M 240 482 C 276 494, 324 494, 360 482 L 361 496 C 324 508, 276 508, 239 496 Z" fill="${bloom}" opacity="0.78" />
  `);
}

function cowlHalterMidiDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#dfc6a8');
  const sh = castShadowColor(p);
  const bodice =
    `M 272 232 L 328 232 L 364 328 C 384 360, 390 392, 382 424 L 358 492 ` +
    `C 324 504, 276 504, 242 492 L 218 424 C 210 392, 216 360, 236 328 Z`;
  const skirt = skirtContour({ topY: 484, hemY: 940, silhouette: 'aline' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.95)}
    <path d="M 248 318 C 282 356, 318 356, 352 318 M 252 336 C 284 368, 316 368, 348 336" stroke="${r.specular}" stroke-width="2" opacity="0.7" fill="none" />
    <path d="M 216 560 C 204 680, 198 810, 206 930 C 232 820, 236 690, 244 560 Z" fill="url(#fSheen)" opacity="0.65" filter="url(#cBlur8)" />
  `);
}

function oneShoulderDrapeGown(p: AssetParams): string {
  const r = ramp(p.color ?? '#7c1c30');
  const sh = castShadowColor(p);
  const bodice =
    `M 224 274 C 242 268, 258 278, 272 304 C 304 334, 344 338, 380 332 ` +
    `L 386 382 C 386 418, 370 456, 358 492 C 324 504, 276 504, 242 492 ` +
    `C 228 452, 214 416, 214 380 C 212 346, 216 308, 224 274 Z`;
  const skirt = skirtContour({ topY: 484, hemY: 1120, silhouette: 'pencil' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.32" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.96)}
    <path d="M 226 276 L 354 486" stroke="${r.specular}" stroke-width="2" opacity="0.48" fill="none" />
    <path d="M 346 690 L 372 1124" stroke="${sh}" stroke-width="3.6" opacity="0.72" />
  `);
}

function capeChiffonMidi(p: AssetParams): string {
  const r = ramp(p.color ?? '#94a7c9');
  const sh = castShadowColor(p);
  const cape =
    `M 232 254 C 202 276, 178 334, 174 446 C 194 466, 218 462, 232 436 L 246 310 Z ` +
    `M 368 254 C 398 276, 422 334, 426 446 C 406 466, 382 462, 368 436 L 354 310 Z`;
  const bodice = torsoContour({
    neckPath: `L 342 258 C 320 286, 280 286, 258 258`,
    hemY: 492,
    ease: 1.5,
  });
  const skirt = skirtContour({ topY: 484, hemY: 960, silhouette: 'flare' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.92)}
    <path d="${cape}" fill="url(#fSheer)" />
    <path d="M 240 482 C 276 494, 324 494, 360 482" stroke="${r.specular}" stroke-width="2.2" fill="none" />
  `);
}

function pleatedHalterCocktail(p: AssetParams): string {
  const r = ramp(p.color ?? '#c97b84');
  const sh = castShadowColor(p);
  const bodice =
    `M 274 234 L 326 234 L 366 340 L 358 492 C 324 504, 276 504, 242 492 L 234 340 Z`;
  const skirt = skirtContour({ topY: 484, hemY: 920, silhouette: 'flare' });
  const pleats = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
    .map((i) => `<line x1="${300 + i * 13}" y1="490" x2="${300 + i * 26}" y2="928" stroke="${r.deep}" stroke-width="1.8" opacity="0.35" />`)
    .join('');
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    ${pleats}
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.94)}
    <path d="M 240 480 C 276 492, 324 492, 360 480 L 362 496 C 324 508, 276 508, 238 496 Z" fill="${r.dark}" />
  `);
}

function denimPinaforeDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#3b5d91');
  const tee = p.color2 ?? '#f7f3ec';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'short', 2.0);
  const underTee = torsoContour({
    neckPath: `L 338 258 C 320 278, 280 278, 262 258`,
    hemY: 488,
    ease: 1.0,
  });
  const apron =
    `M 244 316 L 356 316 L 358 492 L 408 623 L 404 748 C 340 764, 260 764, 196 748 L 192 623 L 242 492 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="${tee}" stroke="#d8d0c6" stroke-width="1" />
    <path d="${sl.right}" fill="${tee}" stroke="#d8d0c6" stroke-width="1" />
    <path d="${underTee}" fill="${tee}" />
    <path d="${apron}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="M 248 256 L 248 320 M 352 256 L 352 320" stroke="${r.dark}" stroke-width="12" />
    <path d="${apron}" fill="url(#fVert)" />
    ${bustContour(r, 0.8)}
    <path d="M 240 482 C 276 494, 324 494, 360 482 L 361 498 C 324 510, 276 510, 239 498 Z" fill="${r.deep}" />
    <line x1="300" y1="316" x2="300" y2="758" stroke="#d49b4b" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.75" />
  `);
}

function ribbedSweaterDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#8c7462');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 3.5);
  const bodice = torsoContour({
    neckPath: `L 328 242 C 314 252, 286 252, 272 242`,
    hemY: 492,
    ease: 3.5,
  });
  const skirt = skirtContour({ topY: 484, hemY: 930, silhouette: 'pencil' });
  const ribs = [-3, -2, -1, 0, 1, 2, 3]
    .map((i) => `<line x1="${300 + i * 16}" y1="264" x2="${300 + i * 20}" y2="935" stroke="${r.deep}" stroke-width="1.3" opacity="0.22" />`)
    .join('');
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${ribs}
    ${bustContour(r, 0.88)}
    <path d="M 274 218 C 288 226, 312 226, 326 218 L 330 250 C 312 260, 288 260, 270 250 Z" fill="url(#fBody)" />
  `);
}

function gothVelvetCorsetDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#281826');
  const trim = p.color2 ?? '#8f1d38';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'threeQuarter', 2.0);
  const bodice = torsoContour({
    neckPath: `L 346 276 C 324 316, 308 334, 300 342 C 292 334, 276 316, 254 276`,
    hemY: 492,
    ease: 1.0,
  });
  const skirt = skirtContour({ topY: 484, hemY: 880, silhouette: 'flare' });
  return toUri(`
    ${defsBlock(r, lacePattern('gothLace', trim))}
    <path d="${sl.left}" fill="url(#fSheer)" />
    <path d="${sl.left}" fill="url(#gothLace)" />
    <path d="${sl.right}" fill="url(#fSheer)" />
    <path d="${sl.right}" fill="url(#gothLace)" />
    <path d="${skirt}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 1.0)}
    <path d="M 282 346 L 318 346 M 284 368 L 316 368 M 286 390 L 314 390 M 288 412 L 312 412" stroke="${trim}" stroke-width="2" opacity="0.85" />
    <path d="M 164 872 C 240 896, 360 896, 436 872" stroke="${trim}" stroke-width="4" fill="none" />
  `);
}

function studdedMeshPartyMini(p: AssetParams): string {
  const r = ramp(p.color ?? '#25212c');
  const stud = p.color2 ?? '#d4dce3';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 1.2);
  const body =
    `M 248 256 C 276 280, 324 280, 352 256 L 382 330 C 390 364, 390 398, 376 436 ` +
    `L 360 492 L 414 623 L 402 742 C 340 758, 260 758, 198 742 L 186 623 L 240 492 ` +
    `L 224 436 C 210 398, 210 364, 218 330 Z`;
  const studPat = `
    <pattern id="studPat" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="6" r="1.7" fill="${stud}" opacity="0.72" />
      <circle cx="16" cy="15" r="1.5" fill="${stud}" opacity="0.62" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, studPat)}
    <path d="${sl.left}" fill="url(#fSheer)" />
    <path d="${sl.left}" fill="url(#studPat)" />
    <path d="${sl.right}" fill="url(#fSheer)" />
    <path d="${sl.right}" fill="url(#studPat)" />
    <path d="${body}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${body}" fill="url(#fBody)" />
    <path d="${body}" fill="url(#studPat)" />
    ${bustContour(r, 0.96)}
  `);
}

function holidayVelvetWrap(p: AssetParams): string {
  const r = ramp(p.color ?? '#164d3d');
  const trim = p.color2 ?? '#e6c35c';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 2.4);
  const bodice = torsoContour({
    neckPath: `L 340 256 L 300 374 L 260 256`,
    hemY: 492,
    ease: 2.0,
  });
  const skirt = skirtContour({ topY: 484, hemY: 915, silhouette: 'aline' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${skirt}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.96)}
    <path d="M 260 256 L 332 490" stroke="${trim}" stroke-width="2" opacity="0.75" fill="none" />
    <path d="M 240 480 C 276 492, 324 492, 360 480 L 362 496 C 324 508, 276 508, 238 496 Z" fill="${trim}" />
  `);
}

function boucleSheathDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#d6ccc2');
  const trim = p.color2 ?? '#25222a';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'short', 2.2);
  const bodice = torsoContour({
    neckPath: `L 338 256 C 318 268, 282 268, 262 256`,
    hemY: 492,
    ease: 1.5,
  });
  const skirt = skirtContour({ topY: 484, hemY: 880, silhouette: 'pencil' });
  const tweedPat = `
    <pattern id="tweedPat" width="12" height="12" patternUnits="userSpaceOnUse">
      <line x1="0" y1="4" x2="12" y2="4" stroke="${trim}" stroke-width="1" opacity="0.22" />
      <line x1="6" y1="0" x2="6" y2="12" stroke="${r.specular}" stroke-width="1" opacity="0.35" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, tweedPat)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${skirt}" fill="url(#tweedPat)" />
    <path d="${bodice}" fill="url(#fBody)" />
    <path d="${bodice}" fill="url(#tweedPat)" />
    ${bustContour(r, 0.9)}
    <path d="M 240 482 C 276 492, 324 492, 360 482" stroke="${trim}" stroke-width="3.5" fill="none" />
    <circle cx="300" cy="360" r="3" fill="${trim}" />
    <circle cx="300" cy="405" r="3" fill="${trim}" />
    <circle cx="300" cy="450" r="3" fill="${trim}" />
  `);
}

function mirrorballClubHalter(p: AssetParams): string {
  const r = ramp(p.color ?? '#c8d2dc');
  const sh = castShadowColor(p);
  const body =
    `M 272 230 L 328 230 L 368 352 C 384 388, 384 422, 362 490 ` +
    `L 414 623 L 404 736 C 340 752, 260 752, 196 736 L 186 623 L 238 490 ` +
    `C 216 422, 216 388, 232 352 Z`;
  const grid = `
    <pattern id="mirrorPat" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect x="1" y="1" width="9" height="9" fill="${r.specular}" opacity="0.35" stroke="#ffffff" stroke-width="0.6" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, grid)}
    <path d="${body}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${body}" fill="url(#fBody)" />
    <path d="${body}" fill="url(#mirrorPat)" />
    ${bustContour(r, 0.96)}
    <path d="M 264 366 L 267 374 L 275 377 L 267 380 L 264 388 L 261 380 L 253 377 L 261 374 Z" fill="#ffffff" opacity="0.92" />
  `);
}

function featherHemClubDress(p: AssetParams): string {
  const r = ramp(p.color ?? '#d42e74');
  const feather = p.color2 ?? '#ff9ec8';
  const sh = castShadowColor(p);
  const bodice = torsoContour({
    neckPath: `L 360 330 C 334 316, 266 316, 240 330`,
    leftShoulderX: 222,
    shoulderY: 332,
    hemY: 490,
    ease: 1.0,
  });
  const skirt = skirtContour({ topY: 484, hemY: 738, silhouette: 'pencil' });
  const plumes = [208, 232, 256, 280, 304, 328, 352, 376]
    .map((x) => `<ellipse cx="${x}" cy="744" rx="16" ry="12" fill="${feather}" opacity="0.88" />`)
    .join('');
  return toUri(`
    ${defsBlock(r)}
    <path d="M 248 258 L 244 334 M 352 258 L 356 334" stroke="${r.specular}" stroke-width="3" stroke-linecap="round" />
    <path d="${skirt}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.98)}
    ${plumes}
  `);
}

function asoOkeCorsetGown(p: AssetParams): string {
  const r = ramp(p.color ?? '#6a1b4d');
  const gold = p.color2 ?? '#e6c15a';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'cap', 3.0);
  const bodice = torsoContour({
    neckPath: `L 354 314 C 330 336, 308 352, 300 356 C 292 352, 270 336, 246 314`,
    hemY: 492,
    ease: 1.0,
  });
  const gown = skirtContour({ topY: 484, hemY: 1188, silhouette: 'flare' });
  const weave = `
    <pattern id="asoOkePat" width="24" height="14" patternUnits="userSpaceOnUse">
      <line x1="0" y1="4" x2="24" y2="4" stroke="${gold}" stroke-width="2" opacity="0.72" />
      <line x1="0" y1="10" x2="24" y2="10" stroke="${r.specular}" stroke-width="1.2" opacity="0.45" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, weave)}
    <path d="${sl.left}" fill="url(#fSheer)" />
    <path d="${sl.right}" fill="url(#fSheer)" />
    <path d="${gown}" fill="${sh}" opacity="0.34" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${gown}" fill="url(#fVert)" />
    <path d="${gown}" fill="url(#asoOkePat)" />
    <path d="${bodice}" fill="url(#fBody)" />
    <path d="${bodice}" fill="url(#asoOkePat)" />
    ${bustContour(r, 0.96)}
    <path d="M 240 482 C 276 496, 324 496, 360 482 L 362 500 C 324 514, 276 514, 238 500 Z" fill="${gold}" />
  `);
}

function georgeWrapperGown(p: AssetParams): string {
  const r = ramp(p.color ?? '#7c1a2e');
  const gold = p.color2 ?? '#f0ca68';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'threeQuarter', 2.4);
  const bodice = torsoContour({
    neckPath: `L 340 256 C 320 278, 280 278, 260 256`,
    hemY: 496,
    ease: 1.5,
  });
  const wrapper = skirtContour({ topY: 486, hemY: 1160, silhouette: 'aline' });
  const georgePat = `
    <pattern id="georgePat" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="13" cy="13" r="8" fill="none" stroke="${gold}" stroke-width="1.4" opacity="0.7" />
      <circle cx="13" cy="13" r="3" fill="${gold}" opacity="0.82" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, georgePat)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${wrapper}" fill="${sh}" opacity="0.34" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${wrapper}" fill="url(#fVert)" />
    <path d="${wrapper}" fill="url(#georgePat)" />
    <path d="${bodice}" fill="url(#fBody)" />
    ${bustContour(r, 0.92)}
    <path d="M 242 492 C 276 680, 314 910, 344 1164" stroke="${gold}" stroke-width="2.6" opacity="0.85" fill="none" />
  `);
}

function ankaraOffShoulderMaxi(p: AssetParams): string {
  const r = ramp(p.color ?? '#1a6856');
  const accent = p.color2 ?? '#f2a93b';
  const sh = castShadowColor(p);
  const bodice =
    `M 184 316 C 242 336, 358 336, 416 316 L 398 358 C 388 392, 374 432, 358 492 ` +
    `C 324 504, 276 504, 242 492 C 226 432, 212 392, 202 358 Z`;
  const gown = skirtContour({ topY: 484, hemY: 1175, silhouette: 'flare' });
  const waxPat = `
    <pattern id="waxMaxi" width="26" height="26" patternUnits="userSpaceOnUse">
      <rect width="26" height="26" fill="${r.mid}" />
      <circle cx="13" cy="13" r="9" fill="none" stroke="${accent}" stroke-width="2.4" />
      <path d="M 0 13 L 26 13 M 13 0 L 13 26" stroke="#ffffff" stroke-width="1" opacity="0.45" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, waxPat)}
    <path d="${gown}" fill="${sh}" opacity="0.32" filter="url(#cBlur8)" transform="translate(0, 6)" />
    <path d="${gown}" fill="url(#waxMaxi)" />
    <path d="${gown}" fill="url(#fVert)" opacity="0.24" />
    <path d="${bodice}" fill="url(#waxMaxi)" />
    ${bustContour(r, 0.78)}
    <path d="M 182 314 C 240 338, 360 338, 418 314 L 414 344 C 358 366, 242 366, 186 344 Z" fill="url(#waxMaxi)" stroke="${accent}" stroke-width="2" />
  `);
}

function igboIsiAguMini(p: AssetParams): string {
  const r = ramp(p.color ?? '#1c1820');
  const gold = p.color2 ?? '#e6c15a';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'threeQuarter', 2.4);
  const bodice = torsoContour({
    neckPath: `L 338 256 C 320 272, 280 272, 262 256`,
    hemY: 490,
    ease: 1.5,
  });
  const skirt = skirtContour({ topY: 482, hemY: 775, silhouette: 'pencil' });
  const crestPat = `
    <pattern id="isiAguPat" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="16" cy="16" r="6" fill="none" stroke="${gold}" stroke-width="1.6" />
      <circle cx="16" cy="16" r="2.6" fill="${gold}" opacity="0.88" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, crestPat)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.left}" fill="url(#isiAguPat)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#isiAguPat)" />
    <path d="${skirt}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${skirt}" fill="url(#isiAguPat)" />
    <path d="${bodice}" fill="url(#fBody)" />
    <path d="${bodice}" fill="url(#isiAguPat)" />
    ${bustContour(r, 0.94)}
    <path d="M 240 480 C 276 492, 324 492, 360 480" stroke="${gold}" stroke-width="3" fill="none" />
  `);
}

/* ============================================================================
 * EXTRA TOPS (14 New Occasion-Tailored Tops)
 * ============================================================================ */

function linenTieCrop(p: AssetParams): string {
  const r = ramp(p.color ?? '#f2ebe0');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'cap', 2.6);
  const body = torsoContour({
    neckPath: `L 344 264 L 300 356 L 256 264`,
    hemY: 438,
    ease: 2.0,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.24" filter="url(#cBlur2)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 0.88)}
    <circle cx="300" cy="436" r="9" fill="${r.dark}" />
    <path d="M 294 442 L 278 468 M 306 442 L 322 468" stroke="${r.mid2}" stroke-width="6" stroke-linecap="round" />
  `);
}

function silkPeplumBlouse(p: AssetParams): string {
  const r = ramp(p.color ?? '#d998a6');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'cap', 2.4);
  const body = torsoContour({
    neckPath: `L 340 256 C 320 296, 280 296, 260 256`,
    hemY: 492,
    ease: 1.2,
  });
  const peplum = `M 240 484 C 276 496, 324 496, 360 484 C 384 514, 404 544, 412 568 C 356 588, 244 588, 188 568 C 196 544, 216 514, 240 484 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${peplum}" fill="${sh}" opacity="0.26" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${peplum}" fill="url(#fVert)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 0.94)}
    <path d="M 240 482 C 276 494, 324 494, 360 482" stroke="${r.deep}" stroke-width="2" fill="none" />
  `);
}

function oversizedGraphicTee(p: AssetParams): string {
  const r = ramp(p.color ?? '#e8e0d5');
  const graphic = p.color2 ?? '#b83244';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'short', 5.5);
  const body = torsoContour({
    neckPath: `L 334 252 C 318 270, 282 270, 266 252`,
    hemY: 575,
    ease: 7.0,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.24" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 0.65)}
    <circle cx="300" cy="390" r="24" fill="${graphic}" opacity="0.82" />
    <path d="M 284 390 L 316 390 M 288 398 L 312 398" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
  `);
}

function croppedHoodieTop(p: AssetParams): string {
  const r = ramp(p.color ?? '#2e323d');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 6.0);
  const body = torsoContour({
    neckPath: `L 342 256 L 300 302 L 258 256`,
    hemY: 446,
    ease: 6.0,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 0.65)}
    <line x1="300" y1="302" x2="300" y2="450" stroke="#c8d2dc" stroke-width="2.4" />
    <path d="M 224 440 C 266 452, 334 452, 376 440 L 378 456 C 334 468, 266 468, 222 456 Z" fill="${r.dark}" />
  `);
}

function cableTurtleneck(p: AssetParams): string {
  const r = ramp(p.color ?? '#ebe0d0');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 5.0);
  const body = torsoContour({
    neckPath: `L 328 242 C 314 252, 286 252, 272 242`,
    hemY: 530,
    ease: 4.5,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    <path d="M 274 218 C 288 226, 312 226, 326 218 L 330 252 C 312 260, 288 260, 270 252 Z" fill="url(#fBody)" />
    ${bustContour(r, 0.72)}
    <path d="M 272 266 Q 262 340 272 420 Q 262 475 272 528 M 328 266 Q 338 340 328 420 Q 338 475 328 528" stroke="${r.deep}" stroke-width="2.4" opacity="0.32" fill="none" />
  `);
}

function flannelShacket(p: AssetParams): string {
  const r = ramp(p.color ?? '#8c2d2d');
  const stripe = p.color2 ?? '#223344';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 6.5);
  const body = torsoContour({
    neckPath: `L 336 254 L 300 328 L 264 254`,
    hemY: 585,
    ease: 6.5,
  });
  const plaid = `
    <pattern id="plaidPat" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="${r.mid}" />
      <rect x="0" y="8" width="24" height="5" fill="${stripe}" opacity="0.48" />
      <rect x="8" y="0" width="5" height="24" fill="${stripe}" opacity="0.48" />
      <line x1="0" y1="2" x2="24" y2="2" stroke="#f2e8df" stroke-width="1" opacity="0.5" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, plaid)}
    <path d="${sl.left}" fill="url(#plaidPat)" />
    <path d="${sl.right}" fill="url(#plaidPat)" />
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#plaidPat)" />
    <path d="${body}" fill="url(#fBody)" opacity="0.25" />
    ${bustContour(r, 0.68)}
    <line x1="300" y1="328" x2="300" y2="594" stroke="${stripe}" stroke-width="2.4" />
  `);
}

function meshStarlightTop(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e1b26');
  const glint = p.color2 ?? '#e6c35c';
  const sl = poseSleeves(p.pose, 'long', 1.0);
  const body = torsoContour({
    neckPath: `L 328 242 C 314 252, 286 252, 272 242`,
    hemY: 486,
    ease: 1.0,
  });
  const starPat = `
    <pattern id="starMesh" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="11" cy="11" r="1.4" fill="${glint}" opacity="0.88" />
      <circle cx="3" cy="4" r="1" fill="#ffffff" opacity="0.6" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, starPat)}
    <path d="${sl.left}" fill="url(#fSheer)" />
    <path d="${sl.left}" fill="url(#starMesh)" />
    <path d="${sl.right}" fill="url(#fSheer)" />
    <path d="${sl.right}" fill="url(#starMesh)" />
    <path d="${body}" fill="url(#fSheer)" />
    <path d="${body}" fill="url(#starMesh)" />
    ${bustContour(r, 0.9)}
  `);
}

function cashmereWrapKnit(p: AssetParams): string {
  const r = ramp(p.color ?? '#d9c2b8');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 4.0);
  const body =
    `M 184 316 C 242 336, 358 336, 416 316 L 398 358 C 388 392, 374 432, 358 492 ` +
    `C 324 504, 276 504, 242 492 C 226 432, 212 392, 202 358 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 0.9)}
    <path d="M 184 314 C 242 336, 358 336, 416 314 L 410 342 C 356 364, 244 364, 190 342 Z" fill="${r.light}" />
  `);
}

function satinPussybowBlouse(p: AssetParams): string {
  const r = ramp(p.color ?? '#f3ede6');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 3.4);
  const body = torsoContour({
    neckPath: `L 334 252 L 300 288 L 266 252`,
    hemY: 515,
    ease: 2.2,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.24" filter="url(#cBlur2)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 0.9)}
    <path d="M 300 264 C 276 248, 266 266, 286 278 L 300 264 L 314 278 C 334 266, 324 248, 300 264 Z" fill="${r.light}" stroke="${r.deep}" stroke-width="1" />
    <path d="M 294 272 L 284 334 M 306 272 L 316 334" stroke="${r.mid2}" stroke-width="7" stroke-linecap="round" />
  `);
}

function fleeceHalfZip(p: AssetParams): string {
  const r = ramp(p.color ?? '#c92e46');
  const panel = p.color2 ?? '#f2eee7';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 5.5);
  const body = torsoContour({
    neckPath: `L 332 246 C 316 254, 284 254, 268 246`,
    hemY: 520,
    ease: 5.5,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="${panel}" stroke="${r.deep}" stroke-width="1" />
    <path d="${sl.right}" fill="${panel}" stroke="${r.deep}" stroke-width="1" />
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    <path d="M 238 282 L 362 282 L 382 346 L 218 346 Z" fill="${panel}" opacity="0.92" />
    <line x1="300" y1="246" x2="300" y2="340" stroke="#26242c" stroke-width="3" />
    ${bustContour(r, 0.68)}
  `);
}

function thermalApresKnit(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e355c');
  const trim = p.color2 ?? '#f4efe8';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 5.0);
  const body = torsoContour({
    neckPath: `L 334 250 C 316 260, 284 260, 266 250`,
    hemY: 525,
    ease: 5.0,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    <path d="M 224 316 L 376 316 L 382 350 L 218 350 Z" fill="${trim}" opacity="0.9" />
    <path d="M 232 332 L 246 318 L 260 332 L 274 318 L 288 332 L 302 318 L 316 332 L 330 318 L 344 332 L 358 318 L 372 332" stroke="${r.mid}" stroke-width="2.5" fill="none" />
    ${bustContour(r, 0.7)}
  `);
}

function crystalChainBustier(p: AssetParams): string {
  const r = ramp(p.color ?? '#d4dce3');
  const sh = castShadowColor(p);
  const body =
    `M 222 336 C 244 318, 278 322, 300 350 C 322 322, 356 318, 378 336 ` +
    `L 385 382 C 384 406, 372 426, 360 444 L 240 444 C 228 426, 216 406, 215 382 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="M 250 258 L 246 332 M 350 258 L 354 332" stroke="url(#metalSilver)" stroke-width="3.6" />
    <path d="${body}" fill="${sh}" opacity="0.3" filter="url(#cBlur2)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    ${bustContour(r, 0.98)}
    <path d="M 244 442 Q 256 468 270 442 Q 284 472 300 442 Q 316 472 330 442 Q 344 468 356 442" stroke="#ffffff" stroke-width="2.4" stroke-dasharray="3 3" fill="none" />
  `);
}

function laceBubaBlouse(p: AssetParams): string {
  const r = ramp(p.color ?? '#1a5c46');
  const gold = p.color2 ?? '#e6c15a';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'threeQuarter', 7.2);
  const buba =
    `M 248 262 C 276 280, 324 280, 352 262 L 406 286 L 392 342 ` +
    `C 394 388, 384 434, 374 504 C 334 522, 266 522, 226 504 ` +
    `C 216 434, 206 388, 208 342 L 194 286 Z`;
  return toUri(`
    ${defsBlock(r, lacePattern('bubaLace', gold))}
    <path d="${sl.left}" fill="url(#fBody)" />
    <path d="${sl.left}" fill="url(#bubaLace)" />
    <path d="${sl.right}" fill="url(#fBody)" />
    <path d="${sl.right}" fill="url(#bubaLace)" />
    <path d="${buba}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${buba}" fill="url(#fBody)" />
    <path d="${buba}" fill="url(#bubaLace)" />
    ${bustContour(r, 0.85)}
    <path d="M 248 262 C 276 282, 324 282, 352 262" stroke="${gold}" stroke-width="3.2" fill="none" />
  `);
}

function ankaraPeplumTop(p: AssetParams): string {
  const r = ramp(p.color ?? '#c84b26');
  const accent = p.color2 ?? '#1d3c78';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'cap', 4.5);
  const bodice = torsoContour({
    neckPath: `L 344 266 C 322 302, 278 302, 256 266`,
    hemY: 492,
    ease: 1.5,
  });
  const peplum = `M 240 482 C 276 494, 324 494, 360 482 C 386 510, 408 542, 418 572 C 362 596, 238 596, 182 572 C 192 542, 214 510, 240 482 Z`;
  const pat = `
    <pattern id="ankTopPat" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="${r.mid}" />
      <path d="M 12 0 L 24 12 L 12 24 L 0 12 Z" fill="${accent}" opacity="0.88" />
      <circle cx="12" cy="12" r="4.5" fill="#f0c44d" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, pat)}
    <path d="${sl.left}" fill="url(#ankTopPat)" />
    <path d="${sl.right}" fill="url(#ankTopPat)" />
    <path d="${peplum}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${peplum}" fill="url(#ankTopPat)" />
    <path d="${bodice}" fill="url(#ankTopPat)" />
    ${bustContour(r, 0.72)}
    <path d="M 240 478 C 276 490, 324 490, 360 478 L 362 496 C 324 508, 276 508, 238 496 Z" fill="${accent}" />
  `);
}

/* ============================================================================
 * EXTRA BOTTOMS (12 New Occasion-Tailored Skirts & Trousers)
 * ============================================================================ */

function pareoSarongSkirt(p: AssetParams): string {
  const r = ramp(p.color ?? '#58a4b0');
  const accent = p.color2 ?? '#f2e8dc';
  const sh = castShadowColor(p);
  const skirt = skirtContour({ topY: 500, hemY: 960, silhouette: 'aline' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.24" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${skirt}" fill="url(#fSheer)" />
    <path d="M 218 504 C 260 590, 310 740, 344 966" stroke="${accent}" stroke-width="2.4" fill="none" />
    <circle cx="232" cy="512" r="10" fill="${r.dark}" />
  `);
}

function tulipCocktailSkirt(p: AssetParams): string {
  const r = ramp(p.color ?? '#c94c68');
  const sh = castShadowColor(p);
  const skirt = skirtContour({ topY: 484, hemY: 790, silhouette: 'pencil' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="M 242 486 C 282 580, 318 680, 336 784" stroke="${r.deep}" stroke-width="2.6" opacity="0.55" fill="none" />
    <path d="M 240 480 C 276 492, 324 492, 360 480 L 362 496 C 324 508, 276 508, 238 496 Z" fill="${r.dark}" />
  `);
}

function wideCargoJeans(p: AssetParams): string {
  const r = ramp(p.color ?? '#4b6c9e');
  const sh = castShadowColor(p);
  const pants = fittedPantsPath({ topY: 492, hemY: 1170, fit: 'wide' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${pants}" fill="url(#fVert)" />
    <rect x="194" y="750" width="38" height="48" rx="4" fill="${r.mid2}" stroke="${r.deep}" stroke-width="1.2" />
    <rect x="368" y="750" width="38" height="48" rx="4" fill="${r.mid2}" stroke="${r.deep}" stroke-width="1.2" />
  `);
}

function denimMidiSkirt(p: AssetParams): string {
  const r = ramp(p.color ?? '#3f5f8c');
  const sh = castShadowColor(p);
  const skirt = skirtContour({ topY: 484, hemY: 940, silhouette: 'pencil' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.30" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <line x1="300" y1="490" x2="300" y2="760" stroke="#d49b4b" stroke-width="1.6" stroke-dasharray="5 3" />
    <path d="M 298 760 L 302 946" stroke="${sh}" stroke-width="3.6" opacity="0.72" />
  `);
}

function vinylFlarePants(p: AssetParams): string {
  const r = ramp(p.color ?? '#18141c');
  const sh = castShadowColor(p);
  const pants = fittedPantsPath({ topY: 486, hemY: 1175, fit: 'wide' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${pants}" fill="url(#fVert)" />
    <path d="M 224 580 C 206 720, 212 920, 212 1140 M 376 580 C 394 720, 388 920, 388 1140" stroke="#ffffff" stroke-width="5" opacity="0.36" filter="url(#cBlur4)" fill="none" />
  `);
}

function velvetWideTrousers(p: AssetParams): string {
  const r = ramp(p.color ?? '#4b1838');
  const sh = castShadowColor(p);
  const pants = fittedPantsPath({ topY: 486, hemY: 1170, fit: 'wide' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${pants}" fill="url(#fVert)" />
    <path d="M 218 590 C 204 750, 206 940, 206 1150" stroke="url(#fSheen)" stroke-width="10" opacity="0.55" filter="url(#cBlur4)" fill="none" />
  `);
}

function knitMidiSkirt(p: AssetParams): string {
  const r = ramp(p.color ?? '#8c2834');
  const trim = p.color2 ?? '#f2e8dc';
  const sh = castShadowColor(p);
  const skirt = skirtContour({ topY: 484, hemY: 920, silhouette: 'aline' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${skirt}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="M 188 866 C 248 886, 352 886, 412 866 L 414 892 C 352 912, 248 912, 186 892 Z" fill="${trim}" opacity="0.88" />
  `);
}

function pleatedCulottes(p: AssetParams): string {
  const r = ramp(p.color ?? '#b89f82');
  const sh = castShadowColor(p);
  const pants = fittedPantsPath({ topY: 486, hemY: 940, fit: 'wide' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${pants}" fill="url(#fVert)" />
    <path d="M 240 478 C 276 490, 324 490, 360 478 L 362 496 C 324 508, 276 508, 238 496 Z" fill="${r.deep}" />
  `);
}

function quiltedSkiPants(p: AssetParams): string {
  const r = ramp(p.color ?? '#20222a');
  const stripe = p.color2 ?? '#f2ede6';
  const sh = castShadowColor(p);
  const pants = fittedPantsPath({ topY: 488, hemY: 1165, fit: 'skinny' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${pants}" fill="url(#fVert)" />
    <path d="M 192 590 C 204 750, 224 940, 234 1150 M 408 590 C 396 750, 376 940, 366 1150" stroke="${stripe}" stroke-width="4" opacity="0.85" fill="none" />
  `);
}

function fleeceJoggers(p: AssetParams): string {
  const r = ramp(p.color ?? '#546478');
  const sh = castShadowColor(p);
  const pants = fittedPantsPath({ topY: 492, hemY: 1140, fit: 'straight' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${pants}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${pants}" fill="url(#fVert)" />
    <path d="M 230 1126 L 274 1126 L 274 1148 L 230 1148 Z M 326 1126 L 370 1126 L 370 1148 L 326 1148 Z" fill="${r.deep}" />
  `);
}

function sequinClubSkirt(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e1b26');
  const glint = p.color2 ?? '#e8c468';
  const sh = castShadowColor(p);
  const skirt = skirtContour({ topY: 484, hemY: 736, silhouette: 'pencil' });
  const seqPat = `
    <pattern id="seqSkirtPat" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="2.2" fill="${glint}" opacity="0.6" />
      <circle cx="11" cy="10" r="2.2" fill="#ffffff" opacity="0.65" />
    </pattern>`;
  return toUri(`
    ${defsBlock(r, seqPat)}
    <path d="${skirt}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${skirt}" fill="url(#fVert)" />
    <path d="${skirt}" fill="url(#seqSkirtPat)" />
  `);
}

function iroAsoOkeWrapper(p: AssetParams): string {
  const r = ramp(p.color ?? '#1d4488');
  const gold = p.color2 ?? '#e6c35c';
  const sh = castShadowColor(p);
  const iro = skirtContour({ topY: 486, hemY: 1128, silhouette: 'aline' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${iro}" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${iro}" fill="url(#fVert)" />
    <path d="M 244 494 C 272 680, 302 890, 326 1134" stroke="${gold}" stroke-width="2.6" opacity="0.82" fill="none" />
    <path d="M 164 1084 C 240 1106, 360 1106, 436 1084 L 440 1124 C 360 1146, 240 1146, 160 1124 Z" fill="${gold}" opacity="0.86" />
  `);
}

/* ============================================================================
 * EXTRA OUTERWEAR & SWIMWEAR (8 New Occasion-Tailored Styles)
 * ============================================================================ */

function shearlingAviatorJacket(p: AssetParams): string {
  const r = ramp(p.color ?? '#5a3826');
  const fleece = p.color2 ?? '#f2e8da';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 5.8);
  const left = `M 250 258 L 194 282 L 216 340 L 214 406 L 236 470 L 278 470 L 280 286 Z`;
  const right = `M 350 258 L 406 282 L 384 340 L 386 406 L 364 470 L 322 470 L 320 286 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${left}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${right}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${left}" fill="url(#fBody)" />
    <path d="${right}" fill="url(#fBody)" />
    <path d="M 246 256 L 284 316 L 266 328 L 238 274 Z M 354 256 L 316 316 L 334 328 L 362 274 Z" fill="${fleece}" />
    <path d="M 234 466 L 280 466 M 320 466 L 366 466" stroke="${fleece}" stroke-width="8" stroke-linecap="round" />
  `);
}

function plushFauxFurCoat(p: AssetParams): string {
  const r = ramp(p.color ?? '#ebe0d2');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 8.5);
  const coatL = `M 248 256 L 190 282 L 208 430 L 180 680 L 184 890 L 278 890 L 284 286 Z`;
  const coatR = `M 352 256 L 410 282 L 392 430 L 420 680 L 416 890 L 322 890 L 316 286 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${coatL}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${coatR}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${coatL}" fill="url(#fBody)" />
    <path d="${coatR}" fill="url(#fBody)" />
    <path d="M 248 256 C 266 284, 276 320, 282 362 M 352 256 C 334 284, 324 320, 318 362" stroke="${r.deep}" stroke-width="2" opacity="0.4" fill="none" />
  `);
}

function velvetOperaCape(p: AssetParams): string {
  const r = ramp(p.color ?? '#5c182c');
  const trim = p.color2 ?? '#e6c35c';
  const sh = castShadowColor(p);
  const cape =
    `M 254 256 C 216 270, 174 340, 152 540 C 176 620, 212 670, 250 700 L 274 282 Z ` +
    `M 346 256 C 384 270, 426 340, 448 540 C 424 620, 388 670, 350 700 L 326 282 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${cape}" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${cape}" fill="url(#fVert)" />
    <path d="M 256 266 Q 300 282 344 266" stroke="${trim}" stroke-width="3.6" fill="none" />
  `);
}

function quiltedDownParka(p: AssetParams): string {
  const r = ramp(p.color ?? '#b8293d');
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 7.5);
  const left = `M 250 256 L 192 282 L 210 380 L 214 540 L 192 730 L 284 730 L 286 286 Z`;
  const right = `M 350 256 L 408 282 L 390 380 L 386 540 L 408 730 L 316 730 L 314 286 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${left}" fill="${sh}" opacity="0.3" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${right}" fill="${sh}" opacity="0.3" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${left}" fill="url(#fBody)" />
    <path d="${right}" fill="url(#fBody)" />
    <path d="M 210 374 L 284 374 M 214 454 L 284 454 M 204 584 L 284 584 M 316 374 L 390 374 M 316 454 L 386 454 M 316 584 L 396 584" stroke="${r.deep}" stroke-width="2" opacity="0.45" />
    <path d="M 226 482 L 284 482 M 316 482 L 374 482" stroke="#221e24" stroke-width="8" />
  `);
}

function colorblockMountainAnorak(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e4a8a');
  const accent = p.color2 ?? '#f2a83b';
  const sh = castShadowColor(p);
  const sl = poseSleeves(p.pose, 'long', 6.5);
  const body = torsoContour({
    neckPath: `L 334 250 L 300 286 L 266 250`,
    hemY: 540,
    ease: 6.5,
  });
  return toUri(`
    ${defsBlock(r)}
    <path d="${sl.left}" fill="url(#fVert)" />
    <path d="${sl.right}" fill="url(#fVert)" />
    <path d="${body}" fill="${sh}" opacity="0.28" filter="url(#cBlur4)" transform="translate(0, 4)" />
    <path d="${body}" fill="url(#fBody)" />
    <path d="M 226 350 L 374 350 L 364 430 L 236 430 Z" fill="${accent}" opacity="0.92" />
    <line x1="300" y1="286" x2="300" y2="540" stroke="#ffffff" stroke-width="2.5" />
  `);
}

function owambeIpeleSash(p: AssetParams): string {
  const r = ramp(p.color ?? '#6a1b4d');
  const gold = p.color2 ?? '#e6c15a';
  const sh = castShadowColor(p);
  const sash = `M 204 268 L 254 262 C 258 430, 272 640, 294 870 L 214 878 C 194 640, 188 430, 204 268 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${sash}" fill="${sh}" opacity="0.3" filter="url(#cBlur4)" transform="translate(0, 5)" />
    <path d="${sash}" fill="url(#fVert)" />
    <path d="M 208 268 L 248 262" stroke="${gold}" stroke-width="3" />
    <path d="M 214 854 L 294 846 L 294 870 L 214 878 Z" fill="${gold}" opacity="0.9" />
  `);
}

function ruffledPlungeOnePiece(p: AssetParams): string {
  const r = ramp(p.color ?? '#e27488');
  const sh = castShadowColor(p);
  const suit =
    `M 244 268 L 258 268 L 300 416 L 342 268 L 356 268 ` +
    `L 372 340 C 378 390, 370 436, 358 486 C 376 536, 404 580, 406 610 ` +
    `C 374 636, 336 664, 300 676 C 264 664, 226 636, 194 610 ` +
    `C 196 580, 224 536, 242 486 C 230 436, 222 390, 228 340 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${suit}" fill="${sh}" opacity="0.26" filter="url(#cBlur2)" transform="translate(0, 4)" />
    <path d="${suit}" fill="url(#fBody)" />
    ${bustContour(r, 0.94)}
    <path d="M 242 272 C 254 316, 276 368, 298 416 M 358 272 C 346 316, 324 368, 302 416" stroke="${r.specular}" stroke-width="5" stroke-dasharray="4 3" fill="none" />
  `);
}

function sunkissedHighLegBikini(p: AssetParams): string {
  const r = ramp(p.color ?? '#f2b8c6');
  const sh = castShadowColor(p);
  const top =
    `M 244 268 L 246 340 C 268 332, 286 350, 298 378 C 300 382, 300 382, 302 378 ` +
    `C 314 350, 332 332, 354 340 L 356 268 L 348 268 L 344 334 C 372 346, 384 374, 378 408 ` +
    `C 348 418, 320 416, 300 404 C 280 416, 252 418, 222 408 C 216 374, 228 346, 256 334 L 252 268 Z`;
  const bottom =
    `M 206 544 C 264 562, 336 562, 394 544 L 398 566 C 362 598, 326 654, 300 676 ` +
    `C 274 654, 238 598, 202 566 Z`;
  return toUri(`
    ${defsBlock(r)}
    <path d="${top}" fill="${sh}" opacity="0.24" filter="url(#cBlur2)" transform="translate(0, 3)" />
    <path d="${bottom}" fill="${sh}" opacity="0.24" filter="url(#cBlur2)" transform="translate(0, 3)" />
    <path d="${top}" fill="url(#fBody)" />
    <path d="${bottom}" fill="url(#fVert)" />
    ${bustContour(r, 0.9)}
  `);
}

export const EXTRA_CLOTHING_CATALOG: StyleCatalogEntry[] = [
  { id: 'dress_crochet_beach_cover', name: 'Crochet Halter Beach Dress', category: 'dresses', defaultColor: '#efe5d6' },
  { id: 'dress_ruffle_sundress', name: 'Tiered Breeze Maxi Sundress', category: 'dresses', defaultColor: '#f4b5a6', defaultColor2: '#e86f58' },
  { id: 'dress_midi_tea_floral', name: 'Silk Floral Tea Dress', category: 'dresses', defaultColor: '#e8c4cf', defaultColor2: '#b84b6e' },
  { id: 'dress_cowl_halter_midi', name: 'Champagne Cowl Halter Midi', category: 'dresses', defaultColor: '#dfc6a8' },
  { id: 'dress_one_shoulder_drape', name: 'Asymmetric Draped Cocktail Gown', category: 'dresses', defaultColor: '#7c1c30' },
  { id: 'dress_cape_chiffon_midi', name: 'Flutter-Cape Chiffon Midi', category: 'dresses', defaultColor: '#94a7c9' },
  { id: 'dress_pleated_halter_cocktail', name: 'Plissé Halter Cocktail Midi', category: 'dresses', defaultColor: '#c97b84' },
  { id: 'dress_denim_pinafore', name: 'Belted Denim Mini Dress', category: 'dresses', defaultColor: '#3b5d91', defaultColor2: '#f7f3ec' },
  { id: 'dress_ribbed_sweater_midi', name: 'Ribbed Knit Sweater Dress', category: 'dresses', defaultColor: '#8c7462' },
  { id: 'dress_goth_velvet_corset', name: 'Velvet Corset Lace Dress', category: 'dresses', defaultColor: '#281826', defaultColor2: '#8f1d38' },
  { id: 'dress_metallic_mesh_mini', name: 'Studded Mesh Party Mini', category: 'dresses', defaultColor: '#25212c', defaultColor2: '#d4dce3' },
  { id: 'dress_velvet_wrap_winter', name: 'Holiday Velvet Wrap Dress', category: 'dresses', defaultColor: '#164d3d', defaultColor2: '#e6c35c' },
  { id: 'dress_tweed_sheath', name: 'Tailored Bouclé Sheath Dress', category: 'dresses', defaultColor: '#d6ccc2', defaultColor2: '#25222a' },
  { id: 'dress_club_halter_sequin', name: 'Mirrorball Halter Club Dress', category: 'dresses', defaultColor: '#c8d2dc' },
  { id: 'dress_club_feather_trim', name: 'Feather-Hem Club Dress', category: 'dresses', defaultColor: '#d42e74', defaultColor2: '#ff9ec8' },
  { id: 'dress_aso_oke_corset_gown', name: 'Aso-Oke Corset Reception Gown', category: 'dresses', defaultColor: '#6a1b4d', defaultColor2: '#e6c15a' },
  { id: 'dress_george_wrapper_blouse', name: 'Velvet George & Lace Gown', category: 'dresses', defaultColor: '#7c1a2e', defaultColor2: '#f0ca68' },
  { id: 'dress_ankara_offshoulder_maxi', name: 'Ankara Off-Shoulder Mermaid Dress', category: 'dresses', defaultColor: '#1a6856', defaultColor2: '#f2a93b' },
  { id: 'dress_igbo_isiagu_mini', name: 'Velvet Isi-Agu Couture Mini', category: 'dresses', defaultColor: '#1c1820', defaultColor2: '#e6c15a' },

  { id: 'top_linen_tie_crop', name: 'Knotted Linen Resort Top', category: 'tops', defaultColor: '#f2ebe0' },
  { id: 'top_silk_peplum_blouse', name: 'Sculpted Silk Peplum Top', category: 'tops', defaultColor: '#d998a6' },
  { id: 'top_oversized_graphic_tee', name: 'Oversized Vintage Tee', category: 'tops', defaultColor: '#e8e0d5', defaultColor2: '#b83244' },
  { id: 'top_cropped_hoodie', name: 'Zip-Up Cropped Hoodie', category: 'tops', defaultColor: '#2e323d' },
  { id: 'top_cable_turtleneck', name: 'Cable-Knit Turtleneck Sweater', category: 'tops', defaultColor: '#ebe0d0' },
  { id: 'top_flannel_shacket', name: 'Brushed Plaid Overshirt', category: 'tops', defaultColor: '#8c2d2d', defaultColor2: '#223344' },
  { id: 'top_mesh_turtleneck', name: 'Sheer Starlight Mesh Top', category: 'tops', defaultColor: '#1e1b26', defaultColor2: '#e6c35c' },
  { id: 'top_cashmere_wrap_knit', name: 'Off-Shoulder Cashmere Knit', category: 'tops', defaultColor: '#d9c2b8' },
  { id: 'top_bow_pussybow_blouse', name: 'Satin Tie-Neck Blouse', category: 'tops', defaultColor: '#f3ede6' },
  { id: 'top_fleece_halfzip', name: 'Alpine Colorblock Half-Zip', category: 'tops', defaultColor: '#c92e46', defaultColor2: '#f2eee7' },
  { id: 'top_thermal_apres_knit', name: 'Après-Ski Jacquard Sweater', category: 'tops', defaultColor: '#1e355c', defaultColor2: '#f4efe8' },
  { id: 'top_crystal_chain_crop', name: 'Crystal Mesh Club Bustier', category: 'tops', defaultColor: '#d4dce3' },
  { id: 'top_lace_buba_blouse', name: 'Gold-Embroidered Lace Buba Top', category: 'tops', defaultColor: '#1a5c46', defaultColor2: '#e6c15a' },
  { id: 'top_ankara_peplum_top', name: 'Sculpted Ankara Peplum Blouse', category: 'tops', defaultColor: '#c84b26', defaultColor2: '#1d3c78' },

  { id: 'bot_pareo_sarong_skirt', name: 'Draped Beach Pareo Skirt', category: 'bottoms', defaultColor: '#58a4b0', defaultColor2: '#f2e8dc' },
  { id: 'bot_tulip_cocktail_skirt', name: 'Satin Tulip Cocktail Skirt', category: 'bottoms', defaultColor: '#c94c68' },
  { id: 'bot_wide_cargo_jeans', name: 'Baggy Utility Denim Jeans', category: 'bottoms', defaultColor: '#4b6c9e' },
  { id: 'bot_denim_midi_skirt', name: 'Split-Front Denim Midi Skirt', category: 'bottoms', defaultColor: '#3f5f8c' },
  { id: 'bot_vinyl_flare_pants', name: 'High-Gloss Flared Trousers', category: 'bottoms', defaultColor: '#18141c' },
  { id: 'bot_velvet_wide_trousers', name: 'Velvet Palazzo Evening Pants', category: 'bottoms', defaultColor: '#4b1838' },
  { id: 'bot_knit_midi_skirt', name: 'Fair-Isle Knit Midi Skirt', category: 'bottoms', defaultColor: '#8c2834', defaultColor2: '#f2e8dc' },
  { id: 'bot_pleated_culottes', name: 'Belted Tailored Culottes', category: 'bottoms', defaultColor: '#b89f82' },
  { id: 'bot_quilted_ski_pants', name: 'Insulated Stirrup Ski Pants', category: 'bottoms', defaultColor: '#20222a', defaultColor2: '#f2ede6' },
  { id: 'bot_fleece_joggers', name: 'Thermal Atelier Joggers', category: 'bottoms', defaultColor: '#546478' },
  { id: 'bot_sequin_club_skirt', name: 'Micro-Sequin Party Mini Skirt', category: 'bottoms', defaultColor: '#1e1b26', defaultColor2: '#e8c468' },
  { id: 'bot_iro_aso_oke_wrapper', name: 'Draped Aso-Oke Iro Wrapper', category: 'bottoms', defaultColor: '#1d4488', defaultColor2: '#e6c35c' },

  { id: 'out_shearling_aviator', name: 'Faux-Shearling Trim Jacket', category: 'outerwear', defaultColor: '#5a3826', defaultColor2: '#f2e8da' },
  { id: 'out_faux_fur_coat', name: 'Plush Faux-Fur Winter Coat', category: 'outerwear', defaultColor: '#ebe0d2' },
  { id: 'out_velvet_cape_coat', name: 'Velvet Opera Trim Cape', category: 'outerwear', defaultColor: '#5c182c', defaultColor2: '#e6c35c' },
  { id: 'out_quilted_parka', name: 'Belted Alpine Down Parka', category: 'outerwear', defaultColor: '#b8293d' },
  { id: 'out_colorblock_anorak', name: 'Retro Mountain Shell Jacket', category: 'outerwear', defaultColor: '#1e4a8a', defaultColor2: '#f2a83b' },
  { id: 'out_agbada_cape_shawl', name: 'Embroidered Owambe Ipele Sash', category: 'outerwear', defaultColor: '#6a1b4d', defaultColor2: '#e6c15a' },

  { id: 'swim_ruffle_onepiece', name: 'Ruffled Plunge One-Piece', category: 'swimwear', defaultColor: '#e27488' },
  { id: 'swim_cutaway_highleg', name: 'Sun-Kissed High-Leg Bikini', category: 'swimwear', defaultColor: '#f2b8c6' },
];

export const EXTRA_CLOTHING_GENERATORS: Record<string, (p: AssetParams) => string> = {
  dress_crochet_beach_cover: crochetBeachDress,
  dress_ruffle_sundress: tieredBreezeSundress,
  dress_midi_tea_floral: floralTeaCocktailDress,
  dress_cowl_halter_midi: cowlHalterMidiDress,
  dress_one_shoulder_drape: oneShoulderDrapeGown,
  dress_cape_chiffon_midi: capeChiffonMidi,
  dress_pleated_halter_cocktail: pleatedHalterCocktail,
  dress_denim_pinafore: denimPinaforeDress,
  dress_ribbed_sweater_midi: ribbedSweaterDress,
  dress_goth_velvet_corset: gothVelvetCorsetDress,
  dress_metallic_mesh_mini: studdedMeshPartyMini,
  dress_velvet_wrap_winter: holidayVelvetWrap,
  dress_tweed_sheath: boucleSheathDress,
  dress_club_halter_sequin: mirrorballClubHalter,
  dress_club_feather_trim: featherHemClubDress,
  dress_aso_oke_corset_gown: asoOkeCorsetGown,
  dress_george_wrapper_blouse: georgeWrapperGown,
  dress_ankara_offshoulder_maxi: ankaraOffShoulderMaxi,
  dress_igbo_isiagu_mini: igboIsiAguMini,

  top_linen_tie_crop: linenTieCrop,
  top_silk_peplum_blouse: silkPeplumBlouse,
  top_oversized_graphic_tee: oversizedGraphicTee,
  top_cropped_hoodie: croppedHoodieTop,
  top_cable_turtleneck: cableTurtleneck,
  top_flannel_shacket: flannelShacket,
  top_mesh_turtleneck: meshStarlightTop,
  top_cashmere_wrap_knit: cashmereWrapKnit,
  top_bow_pussybow_blouse: satinPussybowBlouse,
  top_fleece_halfzip: fleeceHalfZip,
  top_thermal_apres_knit: thermalApresKnit,
  top_crystal_chain_crop: crystalChainBustier,
  top_lace_buba_blouse: laceBubaBlouse,
  top_ankara_peplum_top: ankaraPeplumTop,

  bot_pareo_sarong_skirt: pareoSarongSkirt,
  bot_tulip_cocktail_skirt: tulipCocktailSkirt,
  bot_wide_cargo_jeans: wideCargoJeans,
  bot_denim_midi_skirt: denimMidiSkirt,
  bot_vinyl_flare_pants: vinylFlarePants,
  bot_velvet_wide_trousers: velvetWideTrousers,
  bot_knit_midi_skirt: knitMidiSkirt,
  bot_pleated_culottes: pleatedCulottes,
  bot_quilted_ski_pants: quiltedSkiPants,
  bot_fleece_joggers: fleeceJoggers,
  bot_sequin_club_skirt: sequinClubSkirt,
  bot_iro_aso_oke_wrapper: iroAsoOkeWrapper,

  out_shearling_aviator: shearlingAviatorJacket,
  out_faux_fur_coat: plushFauxFurCoat,
  out_velvet_cape_coat: velvetOperaCape,
  out_quilted_parka: quiltedDownParka,
  out_colorblock_anorak: colorblockMountainAnorak,
  out_agbada_cape_shawl: owambeIpeleSash,

  swim_ruffle_onepiece: ruffledPlungeOnePiece,
  swim_cutaway_highleg: sunkissedHighLegBikini,
};
