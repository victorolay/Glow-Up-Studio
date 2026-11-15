import type { AssetParams } from './params';
import { mirrored, toUri } from './primitives';
import { type StyleCatalogEntry } from './shared';
import {
  castShadowColor,
  defsBlock,
  fittedPantsPath,
  metalUrl,
  ramp,
} from './shared';

/*
 * Complete accessory library for the 600×1280 figure: bags, sunglasses,
 * earrings, necklaces, wristwatches, hats, scarves, belts, hosiery and gloves —
 * plus the legacy tropical hair flower and beaded anklet generators retained
 * for the original catalog items. Shared fabric/metal helpers in `shared.ts`.
 */

/* ============================================================================
 * 7. BAGS & HANDBAGS (8 Anatomically Scaled Styles)
 * ============================================================================ */

function structuredLeatherTote(p: AssetParams): string {
  const r = ramp(p.color ?? '#7d492d');
  const sh = castShadowColor(p);
  // Slung cleanly from right shoulder (x384, y274) tucked beside right hip/hand (x408..496, y546..670)
  return toUri(`
    ${defsBlock(r)}
    <path d="M 382 272 C 406 340, 426 440, 440 552" stroke="${r.dark}" stroke-width="6.5" fill="none" stroke-linecap="round" />
    <path d="M 392 272 C 422 340, 444 440, 464 552" stroke="${r.mid}" stroke-width="6.5" fill="none" stroke-linecap="round" />
    <path d="M 410 552 L 500 552 L 492 674 C 490 682, 484 686, 476 686 L 434 686 C 426 686, 420 682, 418 674 Z" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(3, 5)" />
    <path d="M 410 552 L 500 552 L 492 674 C 490 682, 484 686, 476 686 L 434 686 C 426 686, 420 682, 418 674 Z" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1.4" />
    <path d="M 412 566 L 498 566" stroke="${r.deep}" stroke-width="2" opacity="0.55" />
    <rect x="448" y="560" width="14" height="11" rx="2" fill="url(#metalGold)" />
    <path d="M 424 576 L 428 666" stroke="${r.specular}" stroke-width="2.5" opacity="0.45" fill="none" stroke-linecap="round" />
  `);
}

function quiltedCrossbodyBag(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e1b22');
  const sh = castShadowColor(p);
  const quilt = `
    <g stroke="${r.deep}" stroke-width="1.2" opacity="0.55">
      <line x1="382" y1="566" x2="424" y2="628" /><line x1="406" y1="566" x2="448" y2="628" />
      <line x1="430" y1="566" x2="460" y2="612" /><line x1="458" y1="566" x2="416" y2="628" />
      <line x1="434" y1="566" x2="392" y2="628" /><line x1="410" y1="566" x2="380" y2="612" />
    </g>
  `;
  return toUri(`
    ${defsBlock(r)}
    <!-- Diagonal chain strap from left collarbone (246, 266) to right hip (416, 566) -->
    <path d="M 248 266 C 296 368, 358 474, 416 566" stroke="url(#metalGold)" stroke-width="4.2" stroke-dasharray="5 2.5" fill="none" />
    <rect x="378" y="566" width="84" height="62" rx="9" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(2, 4)" />
    <rect x="378" y="566" width="84" height="62" rx="9" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1.4" />
    ${quilt}
    <!-- Envelope flap & gold turnlock -->
    <path d="M 378 568 L 420 604 L 462 568 Z" fill="${r.dark}" stroke="${r.deep}" stroke-width="1.2" />
    <rect x="414" y="596" width="12" height="10" rx="2.5" fill="url(#metalGold)" />
  `);
}

function miniTopHandleSatchel(p: AssetParams): string {
  const r = ramp(p.color ?? '#a83344');
  const sh = castShadowColor(p);
  // Held directly by right hand at (416, 608)
  return toUri(`
    ${defsBlock(r)}
    <path d="M 402 612 C 402 588, 434 588, 434 612" stroke="${r.dark}" stroke-width="5.5" fill="none" stroke-linecap="round" />
    <path d="M 384 616 L 452 616 L 460 676 C 460 682, 455 686, 448 686 L 388 686 C 381 686, 376 682, 376 676 Z" fill="${sh}" opacity="0.36" filter="url(#cBlur4)" transform="translate(2, 4)" />
    <path d="M 384 616 L 452 616 L 460 676 C 460 682, 455 686, 448 686 L 388 686 C 381 686, 376 682, 376 676 Z" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1.3" />
    <path d="M 382 628 L 454 628 L 456 648 L 380 648 Z" fill="${r.dark}" opacity="0.65" />
    <circle cx="418" cy="648" r="4.5" fill="url(#metalGold)" />
  `);
}

function beadedEveningClutch(p: AssetParams): string {
  const r = ramp(p.color ?? '#e6d8be');
  const sh = castShadowColor(p);
  // Tucked elegantly in right hand at (408..444, 594..648)
  return toUri(`
    ${defsBlock(r)}
    <rect x="394" y="596" width="52" height="74" rx="10" fill="${sh}" opacity="0.36" filter="url(#cBlur4)" transform="translate(2, 4)" />
    <rect x="394" y="596" width="52" height="74" rx="10" fill="url(#fBody)" stroke="url(#metalGold)" stroke-width="2.2" />
    <path d="M 398 614 L 442 614 M 398 632 L 442 632 M 398 650 L 442 650" stroke="url(#metalGold)" stroke-width="1.4" stroke-dasharray="2 3" opacity="0.75" />
    <circle cx="420" cy="596" r="4.5" fill="url(#pearlGrad)" stroke="url(#metalGold)" stroke-width="1.2" />
  `);
}

function metallicBaguetteBag(p: AssetParams): string {
  const r = ramp(p.color ?? '#c8cfd6');
  const sh = castShadowColor(p);
  // Tucked tightly under right arm (x384..456, y388..434) with shoulder strap from (382, 272)
  return toUri(`
    ${defsBlock(r)}
    <path d="M 382 272 C 406 308, 422 348, 428 388" stroke="${r.dark}" stroke-width="6" fill="none" stroke-linecap="round" />
    <rect x="386" y="388" width="76" height="40" rx="14" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(2, 4)" />
    <rect x="386" y="388" width="76" height="40" rx="14" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1.2" />
    <path d="M 388 400 C 412 414, 436 414, 460 400" stroke="${r.deep}" stroke-width="1.8" fill="none" />
    <rect x="418" y="405" width="12" height="8" rx="2" fill="url(#metalSilver)" />
  `);
}

function slouchyHoboBag(p: AssetParams): string {
  const r = ramp(p.color ?? '#8c6244');
  const sh = castShadowColor(p);
  return toUri(`
    ${defsBlock(r)}
    <path d="M 384 272 C 408 330, 428 400, 438 468" stroke="${r.dark}" stroke-width="8" fill="none" stroke-linecap="round" />
    <path d="M 396 468 C 416 488, 444 488, 468 464 C 488 510, 488 564, 460 584 C 430 600, 396 588, 386 554 C 378 524, 384 490, 396 468 Z" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(2, 4)" />
    <path d="M 396 468 C 416 488, 444 488, 468 464 C 488 510, 488 564, 460 584 C 430 600, 396 588, 386 554 C 378 524, 384 490, 396 468 Z" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1.3" />
    <path d="M 404 510 C 424 532, 446 534, 466 516" stroke="${r.deep}" stroke-width="2" opacity="0.42" fill="none" />
  `);
}

function wovenStrawBeachTote(p: AssetParams): string {
  const r = ramp(p.color ?? '#d8be8e');
  const accent = p.color2 ?? '#2f5a78';
  const sh = castShadowColor(p);
  return toUri(`
    ${defsBlock(r)}
    <path d="M 382 272 C 406 340, 426 430, 438 536 M 394 272 C 424 340, 448 430, 468 536" stroke="${r.dark}" stroke-width="6" fill="none" stroke-linecap="round" />
    <path d="M 400 536 L 510 536 L 494 678 L 416 678 Z" fill="${sh}" opacity="0.32" filter="url(#cBlur4)" transform="translate(3, 5)" />
    <path d="M 400 536 L 510 536 L 494 678 L 416 678 Z" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1.4" />
    <path d="M 404 568 L 506 568 M 408 602 L 502 602 M 412 636 L 498 636" stroke="${r.deep}" stroke-width="1.6" stroke-dasharray="6 3" opacity="0.55" />
    <path d="M 412 648 L 498 648 L 495 668 L 415 668 Z" fill="${accent}" opacity="0.85" />
  `);
}

function drawstringBucketBag(p: AssetParams): string {
  const r = ramp(p.color ?? '#3e4e44');
  const sh = castShadowColor(p);
  return toUri(`
    ${defsBlock(r)}
    <path d="M 248 266 C 296 368, 358 474, 412 564" stroke="${r.dark}" stroke-width="4.5" fill="none" />
    <path d="M 388 564 L 444 564 C 452 590, 452 634, 442 652 C 424 662, 408 662, 390 652 C 380 634, 380 590, 388 564 Z" fill="${sh}" opacity="0.34" filter="url(#cBlur4)" transform="translate(2, 4)" />
    <path d="M 388 564 L 444 564 C 452 590, 452 634, 442 652 C 424 662, 408 662, 390 652 C 380 634, 380 590, 388 564 Z" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1.3" />
    <path d="M 386 582 C 406 588, 426 588, 446 582" stroke="url(#metalGold)" stroke-width="2.5" fill="none" />
    <path d="M 416 586 L 408 614 M 416 586 L 424 614" stroke="${r.dark}" stroke-width="2.4" stroke-linecap="round" />
  `);
}


/* ============================================================================
 * 8. SUNGLASSES (7 Styles Fitted to Eyes 280.8/319.2, y135.5, Temples 254-346)
 * ============================================================================ */

function catEyeSunglasses(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e191e');
  const lens = p.color2 ?? '#261e28';
  return toUri(`
    ${defsBlock(r)}
    <g>
      <path d="M 254 127 C 266 125, 286 125, 296 131 L 304 131 C 314 125, 334 125, 346 127 C 344 138, 338 147, 326 147 C 314 147, 306 141, 304 134 L 296 134 C 294 141, 286 147, 274 147 C 262 147, 256 138, 254 127 Z" fill="${r.mid}" stroke="${r.deep}" stroke-width="1.2" />
      <path d="M 258 129 C 268 128, 284 128, 293 133 C 291 140, 284 144, 274 144 C 264 144, 260 137, 258 129 Z" fill="${lens}" opacity="0.88" />
      <path d="M 342 129 C 332 128, 316 128, 307 133 C 309 140, 316 144, 326 144 C 336 144, 340 137, 342 129 Z" fill="${lens}" opacity="0.88" />
      <path d="M 263 131 L 274 142 M 314 132 L 325 143" stroke="#ffffff" stroke-width="1.6" opacity="0.38" stroke-linecap="round" />
    </g>
  `);
}

function aviatorSunglasses(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const lens = p.color2 ?? '#3b4a3f';
  return toUri(`
    ${defsBlock(ramp('#c8a96e'))}
    <g>
      <path d="M 257 128 C 268 126, 288 127, 296 132 L 304 132 C 312 127, 332 126, 343 128" stroke="${metal}" stroke-width="1.8" fill="none" />
      <path d="M 294 134 C 298 132, 302 132, 306 134" stroke="${metal}" stroke-width="1.5" fill="none" />
      <path d="M 258 129 C 272 128, 290 130, 294 135 C 295 144, 287 151, 275 150 C 263 149, 257 140, 258 129 Z" fill="${lens}" opacity="0.78" stroke="${metal}" stroke-width="1.5" />
      <path d="M 342 129 C 328 128, 310 130, 306 135 C 305 144, 313 151, 325 150 C 337 149, 343 140, 342 129 Z" fill="${lens}" opacity="0.78" stroke="${metal}" stroke-width="1.5" />
      <path d="M 264 132 L 276 146 M 312 133 L 324 147" stroke="#ffffff" stroke-width="1.4" opacity="0.35" stroke-linecap="round" />
    </g>
  `);
}

function oversizedSquareShades(p: AssetParams): string {
  const r = ramp(p.color ?? '#5a3520');
  const lens = p.color2 ?? '#3d2518';
  return toUri(`
    ${defsBlock(r)}
    <g>
      <rect x="255" y="124" width="40" height="26" rx="6" fill="${lens}" opacity="0.86" stroke="${r.mid}" stroke-width="3" />
      <rect x="305" y="124" width="40" height="26" rx="6" fill="${lens}" opacity="0.86" stroke="${r.mid}" stroke-width="3" />
      <path d="M 295 131 L 305 131" stroke="${r.mid}" stroke-width="3.2" />
      <circle cx="258" cy="128" r="1.4" fill="url(#metalGold)" />
      <circle cx="342" cy="128" r="1.4" fill="url(#metalGold)" />
      <path d="M 262 128 L 276 144 M 312 128 L 326 144" stroke="#ffffff" stroke-width="1.8" opacity="0.32" stroke-linecap="round" />
    </g>
  `);
}

function retroOvalShades(p: AssetParams): string {
  const r = ramp(p.color ?? '#f4efe6');
  const lens = p.color2 ?? '#222026';
  return toUri(`
    ${defsBlock(r)}
    <g>
      <ellipse cx="276" cy="136" rx="19" ry="10.5" fill="${lens}" opacity="0.90" stroke="${r.mid}" stroke-width="2.6" />
      <ellipse cx="324" cy="136" rx="19" ry="10.5" fill="${lens}" opacity="0.90" stroke="${r.mid}" stroke-width="2.6" />
      <path d="M 295 134 C 298 132, 302 132, 305 134" stroke="${r.mid}" stroke-width="2.6" fill="none" />
      <path d="M 264 132 L 274 142 M 312 132 L 322 142" stroke="#ffffff" stroke-width="1.3" opacity="0.35" stroke-linecap="round" />
    </g>
  `);
}

function roundTortoiseShades(p: AssetParams): string {
  const r = ramp(p.color ?? '#6e3d1e');
  const lens = p.color2 ?? '#382a1e';
  return toUri(`
    ${defsBlock(r)}
    <g>
      <circle cx="276" cy="136" r="16.5" fill="${lens}" opacity="0.82" stroke="${r.mid}" stroke-width="2.8" />
      <circle cx="324" cy="136" r="16.5" fill="${lens}" opacity="0.82" stroke="${r.mid}" stroke-width="2.8" />
      <path d="M 293 133 C 298 130, 302 130, 307 133" stroke="${r.mid}" stroke-width="2.4" fill="none" />
      <path d="M 266 129 L 278 143 M 314 129 L 326 143" stroke="#ffffff" stroke-width="1.5" opacity="0.32" stroke-linecap="round" />
    </g>
  `);
}

function geometricHexShades(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const lens = p.color2 ?? '#7a4854';
  const hexL = `M 259 131 L 270 125 L 288 125 L 295 133 L 290 144 L 266 144 Z`;
  const hexR = `M 341 131 L 330 125 L 312 125 L 305 133 L 310 144 L 334 144 Z`;
  return toUri(`
    ${defsBlock(ramp('#c8a96e'))}
    <g>
      <path d="${hexL}" fill="${lens}" opacity="0.72" stroke="${metal}" stroke-width="2" />
      <path d="${hexR}" fill="${lens}" opacity="0.72" stroke="${metal}" stroke-width="2" />
      <path d="M 295 133 L 305 133" stroke="${metal}" stroke-width="1.8" />
    </g>
  `);
}

function rimlessTintedShields(p: AssetParams): string {
  const r = ramp(p.color ?? '#d97a96');
  return toUri(`
    ${defsBlock(r)}
    <g>
      <path d="M 255 127 C 272 125, 328 125, 345 127 C 344 139, 336 147, 323 147 C 312 147, 305 141, 300 137 C 295 141, 288 147, 277 147 C 264 147, 256 139, 255 127 Z" fill="${r.mid}" opacity="0.62" stroke="${r.specular}" stroke-width="1.2" />
      <path d="M 264 130 L 280 143 M 316 130 L 332 143" stroke="#ffffff" stroke-width="1.8" opacity="0.45" stroke-linecap="round" />
    </g>
  `);
}

/* ============================================================================
 * 9. EARRINGS (7 Styles Anchored to Earlobes (250, 162) & (350, 162))
 * ============================================================================ */

function classicGoldHoops(p: AssetParams): string {
  const metal = metalUrl(p.color);
  return toUri(`
    ${defsBlock(ramp('#e6c35c'))}
    <ellipse cx="249" cy="172" rx="5.5" ry="12" fill="none" stroke="${metal}" stroke-width="2.6" />
    <ellipse cx="351" cy="172" rx="5.5" ry="12" fill="none" stroke="${metal}" stroke-width="2.6" />
  `);
}

function pearlDropEarrings(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const pair = (x: number) => `
    <circle cx="${x}" cy="162" r="2.5" fill="${metal}" />
    <line x1="${x}" y1="164" x2="${x}" y2="173" stroke="${metal}" stroke-width="1.4" />
    <circle cx="${x}" cy="177" r="5" fill="url(#pearlGrad)" stroke="#c7bcb0" stroke-width="0.6" />
  `;
  return toUri(defsBlock(ramp('#e6c35c')) + pair(250) + pair(350));
}

function crystalChandelierDrops(p: AssetParams): string {
  const gem = p.color ?? '#d8f0ff';
  const metal = metalUrl(p.color2 ?? 'silver');
  const drop = (x: number) => `
    <circle cx="${x}" cy="162" r="2.2" fill="${metal}" />
    <path d="M ${x} 164 L ${x - 4} 174 L ${x} 186 L ${x + 4} 174 Z" fill="${gem}" stroke="${metal}" stroke-width="0.9" />
    <path d="M ${x} 166 L ${x - 2} 174 L ${x} 182 Z" fill="url(#gemFacet)" />
  `;
  return toUri(defsBlock(ramp('#d8f0ff')) + drop(250) + drop(350));
}

function sculpturalTeardropStuds(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const drop = (x: number) => `
    <path d="M ${x} 159 C ${x - 5} 165, ${x - 6} 174, ${x} 176 C ${x + 6} 174, ${x + 5} 165, ${x} 159 Z" fill="${metal}" />
  `;
  return toUri(defsBlock(ramp('#e6c35c')) + drop(250) + drop(350));
}

function emeraldHuggies(p: AssetParams): string {
  const gem = p.color ?? '#1e7a52';
  const metal = metalUrl(p.color2);
  const huggie = (x: number) => `
    <ellipse cx="${x}" cy="166" rx="3.2" ry="6.5" fill="none" stroke="${metal}" stroke-width="2.4" />
    <rect x="${x - 2.6}" y="170" width="5.2" height="7" rx="1.2" fill="${gem}" stroke="${metal}" stroke-width="0.8" />
  `;
  return toUri(defsBlock(ramp(gem)) + huggie(250) + huggie(350));
}

function doubleLinkChainEarrings(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const chain = (x: number) => `
    <ellipse cx="${x}" cy="164" rx="2.4" ry="4.2" fill="none" stroke="${metal}" stroke-width="1.6" />
    <ellipse cx="${x}" cy="171" rx="2.8" ry="5" fill="none" stroke="${metal}" stroke-width="1.7" />
    <ellipse cx="${x}" cy="179" rx="3.2" ry="5.6" fill="none" stroke="${metal}" stroke-width="1.8" />
  `;
  return toUri(defsBlock(ramp('#e6c35c')) + chain(250) + chain(350));
}

function celestialStarDrops(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const star = (x: number) => `
    <circle cx="${x}" cy="162" r="2.2" fill="${metal}" />
    <line x1="${x}" y1="164" x2="${x}" y2="176" stroke="${metal}" stroke-width="1.2" />
    <path d="M ${x} 174 L ${x + 2} 179 L ${x + 7} 179 L ${x + 3} 182 L ${x + 4.5} 187 L ${x} 184 L ${x - 4.5} 187 L ${x - 3} 182 L ${x - 7} 179 L ${x - 2} 179 Z" fill="${metal}" />
  `;
  return toUri(defsBlock(ramp('#e6c35c')) + star(250) + star(350));
}

/* ============================================================================
 * 10. NECKLACES (7 Styles Fitted to Neck x264-336, Collarbones y250-385)
 * ============================================================================ */

function pearlStrandNecklace(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const pearls: string[] = [];
  const count = 17;
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const x = 270 + t * 60;
    const y = 248 + Math.sin(t * Math.PI) * 26;
    pearls.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="url(#pearlGrad)" stroke="#c2b7aa" stroke-width="0.6" />`);
  }
  return toUri(`
    ${defsBlock(ramp('#f5f0ea'))}
    <path d="M 270 248 Q 300 296, 330 248" stroke="${metal}" stroke-width="1.2" fill="none" />
    ${pearls.join('')}
  `);
}

function layeredGoldChains(p: AssetParams): string {
  const metal = metalUrl(p.color);
  return toUri(`
    ${defsBlock(ramp('#e6c35c'))}
    <path d="M 273 242 Q 300 264, 327 242" stroke="${metal}" stroke-width="1.7" fill="none" />
    <path d="M 268 248 Q 300 292, 332 248" stroke="${metal}" stroke-width="1.8" fill="none" />
    <path d="M 264 252 Q 300 330, 336 252" stroke="${metal}" stroke-width="1.8" fill="none" />
    <circle cx="300" cy="291" r="5" fill="${metal}" />
    <circle cx="300" cy="291" r="3" fill="url(#gemFacet)" />
  `);
}

function diamondSolitairePendant(p: AssetParams): string {
  const metal = metalUrl(p.color ?? 'silver');
  return toUri(`
    ${defsBlock(ramp('#d8f0ff'))}
    <path d="M 268 248 Q 300 294, 332 248" stroke="${metal}" stroke-width="1.4" fill="none" />
    <path d="M 300 278 L 295 284 L 300 292 L 305 284 Z" fill="#e8f6ff" stroke="${metal}" stroke-width="1.2" />
    <circle cx="300" cy="284" r="2.5" fill="url(#gemFacet)" />
  `);
}

function velvetCrystalChoker(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e1922');
  return toUri(`
    ${defsBlock(r)}
    <path d="M 275 230 C 290 238, 310 238, 325 230 L 326 242 C 310 250, 290 250, 274 242 Z" fill="url(#fBody)" />
    <path d="M 300 245 L 295 253 L 300 262 L 305 253 Z" fill="#e6f5ff" stroke="url(#metalSilver)" stroke-width="1" />
  `);
}

function chunkyCubanCollar(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const links: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const x = 270 + t * 60;
    const y = 248 + Math.sin(t * Math.PI) * 20;
    links.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="4.2" ry="2.6" fill="none" stroke="${metal}" stroke-width="2.2" transform="rotate(${((t - 0.5) * 48).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" />`);
  }
  return toUri(defsBlock(ramp('#e6c35c')) + links.join(''));
}

function lariatYDropNecklace(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const gem = p.color2 ?? '#1e7a52';
  return toUri(`
    ${defsBlock(ramp(gem))}
    <path d="M 268 248 Q 300 294, 332 248" stroke="${metal}" stroke-width="1.6" fill="none" />
    <line x1="300" y1="271" x2="300" y2="338" stroke="${metal}" stroke-width="1.6" />
    <circle cx="300" cy="272" r="3" fill="${metal}" />
    <path d="M 300 336 L 296 346 L 300 356 L 304 346 Z" fill="${gem}" stroke="${metal}" stroke-width="1" />
  `);
}

function heartLocketPendant(p: AssetParams): string {
  const metal = metalUrl(p.color ?? 'rose');
  return toUri(`
    ${defsBlock(ramp('#e2a496'))}
    <path d="M 268 248 Q 300 300, 332 248" stroke="${metal}" stroke-width="1.6" fill="none" />
    <path d="M 300 288 C 296 282, 289 282, 289 288 C 289 294, 300 301, 300 301 C 300 301, 311 294, 311 288 C 311 282, 304 282, 300 288 Z" fill="${metal}" />
  `);
}

function edoCoralBeadsNecklace(p: AssetParams): string {
  const coral = p.color ?? '#c83424';
  const r = ramp(coral);
  const rows = [
    { count: 14, yBase: 238, dip: 18, radius: 3.4 },
    { count: 16, yBase: 245, dip: 28, radius: 3.8 },
    { count: 18, yBase: 252, dip: 40, radius: 4.2 },
  ];
  const beads: string[] = [];
  for (const row of rows) {
    for (let i = 0; i <= row.count; i++) {
      const t = i / row.count;
      const x = 270 + t * 60;
      const y = row.yBase + Math.sin(t * Math.PI) * row.dip;
      const rad = row.radius * (0.85 + 0.25 * Math.sin(t * Math.PI));
      const isGoldSpacer = i === 4 || i === row.count - 4;
      beads.push(
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}" fill="${isGoldSpacer ? 'url(#metalGold)' : r.mid}" stroke="${r.deep}" stroke-width="0.6" />`,
      );
    }
  }
  return toUri(defsBlock(r) + beads.join(''));
}

/* ============================================================================
 * 11. WRISTWATCHES (6 Styles Fitted to Right Wrist x407-429, y536-556)
 * ============================================================================ */

function dressWatchBase(opts: {
  strapFill: string;
  caseMetal: string;
  dialFill: string;
  bezelAccent?: string;
  shape: 'round' | 'tank' | 'chrono';
}): string {
  const cx = 418;
  const cy = 545;
  const strap = `<path d="M 405 538 C 414 541, 424 541, 431 538 L 430 552 C 423 555, 413 555, 406 552 Z" fill="${opts.strapFill}" stroke="#2b2420" stroke-width="0.7" />`;
  const watchCase =
    opts.shape === 'tank'
      ? `<rect x="${cx - 6}" y="${cy - 8}" width="12" height="16" rx="2" fill="${opts.caseMetal}" stroke="#3a3022" stroke-width="0.7" />` +
      `<rect x="${cx - 4.2}" y="${cy - 5.8}" width="8.4" height="11.6" rx="1" fill="${opts.dialFill}" />`
      : `<circle cx="${cx}" cy="${cy}" r="8.2" fill="${opts.caseMetal}" stroke="#3a3022" stroke-width="0.7" />` +
      `<circle cx="${cx}" cy="${cy}" r="6.2" fill="${opts.dialFill}" />`;

  const chrono =
    opts.shape === 'chrono'
      ? `<circle cx="${cx - 2.3}" cy="${cy + 1.2}" r="1.4" fill="none" stroke="${opts.bezelAccent ?? '#444'}" stroke-width="0.6" />` +
      `<circle cx="${cx + 2.3}" cy="${cy + 1.2}" r="1.4" fill="none" stroke="${opts.bezelAccent ?? '#444'}" stroke-width="0.6" />`
      : '';

  const hands = `
    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 3.8}" stroke="#1c1917" stroke-width="1" stroke-linecap="round" />
    <line x1="${cx}" y1="${cy}" x2="${cx + 3}" y2="${cy + 1}" stroke="#1c1917" stroke-width="0.9" stroke-linecap="round" />
    <rect x="${cx + 7.5}" y="${cy - 1.5}" width="2" height="3" rx="0.6" fill="${opts.caseMetal}" />
  `;
  return strap + watchCase + chrono + hands;
}

function goldClassicWatch(p: AssetParams): string {
  return toUri(
    defsBlock(ramp('#e6c35c')) +
    dressWatchBase({ strapFill: 'url(#metalGold)', caseMetal: 'url(#metalGold)', dialFill: p.color ?? '#f7f1e3', shape: 'round' }),
  );
}

function silverChronoWatch(p: AssetParams): string {
  return toUri(
    defsBlock(ramp('#d4DCE3')) +
    dressWatchBase({ strapFill: 'url(#metalSilver)', caseMetal: 'url(#metalSilver)', dialFill: p.color ?? '#1e2c44', bezelAccent: '#ffffff', shape: 'chrono' }),
  );
}

function roseGoldMeshWatch(p: AssetParams): string {
  return toUri(
    defsBlock(ramp('#e2a496')) +
    dressWatchBase({ strapFill: 'url(#metalRose)', caseMetal: 'url(#metalRose)', dialFill: p.color ?? '#fff5f3', shape: 'round' }),
  );
}

function leatherTankWatch(p: AssetParams): string {
  const strap = p.color ?? '#3b2416';
  return toUri(
    defsBlock(ramp(strap)) +
    dressWatchBase({ strapFill: strap, caseMetal: 'url(#metalGold)', dialFill: '#f9f5eb', shape: 'tank' }),
  );
}

function diamondBezelWatch(p: AssetParams): string {
  const cx = 418;
  const cy = 545;
  const stones = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return `<circle cx="${(cx + Math.cos(rad) * 7.2).toFixed(1)}" cy="${(cy + Math.sin(rad) * 7.2).toFixed(1)}" r="1" fill="#ffffff" />`;
    })
    .join('');
  return toUri(
    defsBlock(ramp('#d4DCE3')) +
    dressWatchBase({ strapFill: 'url(#metalSilver)', caseMetal: 'url(#metalSilver)', dialFill: p.color ?? '#eef6fc', shape: 'round' }) +
    stones,
  );
}

function ceramicSportWatch(p: AssetParams): string {
  const c = p.color ?? '#f2efe9';
  return toUri(
    defsBlock(ramp(c)) +
    dressWatchBase({ strapFill: c, caseMetal: 'url(#metalRose)', dialFill: '#ffffff', shape: 'chrono' }),
  );
}


/* ============================================================================
 * 12. COMPLETING ESSENTIALS (Hats, Belts, Scarves, Hosiery & Opera Gloves)
 * ============================================================================ */

function wideBrimSunHat(p: AssetParams): string {
  const r = ramp(p.color ?? '#dfd0ad');
  const ribbon = p.color2 ?? '#1e1b20';
  return toUri(`
    ${defsBlock(r)}
    <!-- Wide brim centered on head x300, y84-106 -->
    <ellipse cx="300" cy="100" rx="116" ry="22" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1.3" />
    <path d="M 244 96 C 248 64, 266 50, 300 50 C 334 50, 352 64, 356 96 C 324 104, 276 104, 244 96 Z" fill="url(#fVert)" stroke="${r.deep}" stroke-width="1.2" />
    <path d="M 246 86 C 276 94, 324 94, 354 86 L 356 96 C 324 104, 276 104, 244 96 Z" fill="${ribbon}" />
  `);
}

function frenchWoolBeret(p: AssetParams): string {
  const r = ramp(p.color ?? '#9e192d');
  return toUri(`
    ${defsBlock(r)}
    <path d="M 246 108 C 238 82, 268 58, 314 62 C 354 66, 366 90, 348 106 C 320 112, 274 114, 246 108 Z" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1.2" />
    <path d="M 250 106 C 278 112, 318 111, 345 104" stroke="${r.deep}" stroke-width="4" fill="none" stroke-linecap="round" />
    <line x1="306" y1="62" x2="310" y2="54" stroke="${r.deep}" stroke-width="2.5" stroke-linecap="round" />
  `);
}

function satinPaddedHeadband(p: AssetParams): string {
  const r = ramp(p.color ?? '#2e4e44');
  return toUri(`
    ${defsBlock(r)}
    <path d="M 252 122 C 254 88, 274 74, 300 74 C 326 74, 346 88, 348 122 C 344 100, 324 88, 300 88 C 276 88, 256 100, 252 122 Z" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1" />
    <path d="M 262 96 C 280 80, 320 80, 338 96" stroke="${r.specular}" stroke-width="2" opacity="0.55" fill="none" />
  `);
}

function nigerianGeleHeadtie(p: AssetParams): string {
  const r = ramp(p.color ?? '#8b1e2d');
  const gold = p.color2 ?? '#e6c35c';
  return toUri(`
    ${defsBlock(r)}
    <!-- Dramatic fanned sculptural Aso-Oke Gele resting snugly at forehead hairline y102-114 -->
    <path d="M 250 120 C 222 98, 212 64, 228 42 C 264 30, 336 30, 372 42 C 388 64, 378 98, 350 120 C 330 105, 270 105, 250 120 Z" fill="url(#fVert)" stroke="${r.deep}" stroke-width="1.2" />
    <path d="M 252 118 C 244 94, 246 70, 258 54 C 284 46, 316 46, 342 54 C 354 70, 356 94, 348 118 C 326 103, 274 103, 252 118 Z" fill="url(#fBody)" />
    <!-- Crisp layered Aso-Oke pleats with woven gold metallic thread -->
    <path d="M 228 60 C 268 46, 332 46, 372 60" stroke="${gold}" stroke-width="1.6" opacity="0.76" fill="none" />
    <path d="M 232 74 C 272 60, 328 60, 368 74" stroke="${r.deep}" stroke-width="2.1" opacity="0.54" fill="none" />
    <path d="M 237 87 C 274 75, 326 75, 363 87" stroke="${gold}" stroke-width="1.6" opacity="0.76" fill="none" />
    <path d="M 244 100 C 276 89, 324 89, 356 100" stroke="${r.deep}" stroke-width="2.1" opacity="0.60" fill="none" />
    <path d="M 251 114 C 278 102, 322 102, 349 114" stroke="${gold}" stroke-width="1.8" opacity="0.86" fill="none" />
  `);
}

function silkNeckScarf(p: AssetParams): string {
  const r = ramp(p.color ?? '#b83344');
  const accent = p.color2 ?? '#f5e8d0';
  return toUri(`
    ${defsBlock(r)}
    <path d="M 272 228 C 288 242, 312 242, 328 228 L 332 248 C 314 260, 286 260, 268 248 Z" fill="url(#fBody)" />
    <path d="M 304 252 C 314 278, 328 312, 336 338 L 314 344 C 308 314, 302 280, 296 254 Z" fill="url(#fVert)" />
    <path d="M 294 254 C 286 284, 276 318, 270 342 L 288 346 C 294 318, 298 286, 302 256 Z" fill="${r.dark}" />
    <circle cx="300" cy="252" r="6" fill="${r.mid}" stroke="${accent}" stroke-width="1.4" />
  `);
}

function leatherWaistBelt(p: AssetParams): string {
  const r = ramp(p.color ?? '#221c18');
  return toUri(`
    ${defsBlock(r)}
    <!-- Tailored exactly to narrowest waist x243-357, y478-496 -->
    <path d="M 242 478 C 276 490, 324 490, 358 478 L 359 496 C 324 508, 276 508, 241 496 Z" fill="url(#fBody)" stroke="${r.deep}" stroke-width="1" />
    <rect x="287" y="479" width="26" height="20" rx="4" fill="none" stroke="url(#metalGold)" stroke-width="3" />
    <line x1="300" y1="482" x2="300" y2="496" stroke="url(#metalGold)" stroke-width="2.4" />
  `);
}

function goldChainWaistBelt(p: AssetParams): string {
  const metal = metalUrl(p.color);
  const links: string[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const x = 244 + t * 112;
    const y = 482 + Math.sin(t * Math.PI) * 14;
    links.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="none" stroke="${metal}" stroke-width="1.9" />`);
  }
  return toUri(
    defsBlock(ramp('#e6c35c')) +
    links.join('') +
    `<path d="M 326 492 C 334 518, 338 544, 338 564" stroke="${metal}" stroke-width="2.4" stroke-dasharray="4 3" fill="none" />` +
    `<circle cx="338" cy="568" r="4.5" fill="${metal}" />`,
  );
}

function sheerTightsHosiery(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e1b22');
  const legs = fittedPantsPath({ topY: 500, hemY: 1185, fit: 'skinny' });
  return toUri(`
    ${defsBlock(r)}
    <path d="${legs}" fill="${r.mid}" opacity="0.52" />
    <path d="M 241 498 C 276 510, 324 510, 359 498 L 363 516 C 324 528, 276 528, 237 516 Z" fill="${r.dark}" opacity="0.78" />
    <path d="M 222 660 C 218 740, 224 830, 240 906 C 254 830, 252 740, 246 660 Z" fill="#ffffff" opacity="0.14" filter="url(#cBlur8)" />
    <path d="M 378 660 C 382 740, 376 830, 360 906 C 346 830, 348 740, 354 660 Z" fill="#ffffff" opacity="0.10" filter="url(#cBlur8)" />
  `);
}

function operaEveningGloves(p: AssetParams): string {
  const r = ramp(p.color ?? '#1e1920');
  const rightGlove =
    `M 398 352 C 412 356, 424 354, 431 346 C 436 388, 442 424, 439 452 ` +
    `C 436 484, 432 522, 429 556 C 431 570, 438 588, 437 608 ` +
    `C 436 624, 430 635, 425 636 C 421 636, 419 627, 419 615 ` +
    `C 417 627, 414 637, 410 637 C 406 636, 405 624, 406 611 ` +
    `C 403 619, 400 624, 396 622 C 393 619, 396 604, 401 590 ` +
    `C 403 580, 400 573, 401 563 C 402 555, 406 551, 407 544 ` +
    `C 404 510, 399 474, 400 440 C 401 410, 396 380, 398 352 Z`;

  let leftGloveEl = mirrored(`<path d="${rightGlove}" fill="url(#fBody)" />`);
  if (p.pose === 'handOnHip' || p.pose === 'vogue') {
    leftGloveEl = `<path d="M 168 350 C 180 356, 192 354, 200 346 C 192 380, 186 410, 192 436 C 204 468, 214 500, 224 532 C 228 544, 228 554, 224 558 C 218 562, 212 558, 208 548 C 198 518, 184 484, 168 446 C 156 416, 156 384, 168 350 Z" fill="url(#fBody)" />`;
  } else if (p.pose === 'twirl') {
    leftGloveEl = `<path d="M 200 190 C 212 186, 222 188, 230 194 C 222 162, 218 134, 218 118 C 218 102, 214 92, 206 90 C 196 88, 188 96, 186 112 C 184 134, 190 162, 200 190 Z" fill="url(#fBody)" />`;
  }
  return toUri(`
    ${defsBlock(r)}
    <path d="${rightGlove}" fill="url(#fBody)" />
    ${leftGloveEl}
  `);
}

/* ---------- Legacy generators (original catalog items without a new counterpart) ---------- */

function petal(cx: number, cy: number, r: number, color: string): string {
  return [0, 72, 144, 216, 288]
    .map(
      (a) =>
        `<circle cx="${(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1)}" cy="${(cy + r * Math.sin((a * Math.PI) / 180)).toFixed(1)}" r="${(r * 0.62).toFixed(1)}" fill="${color}"/>`,
    )
    .join('');
}

function flowerTropical(p: AssetParams): string {
  const color = p.color ?? '#e0607e';
  return toUri(
    petal(374, 102, 7, color) +
      `<circle cx="374" cy="102" r="3.8" fill="#f2c94c"/>` +
      `<ellipse cx="360" cy="117" rx="3.6" ry="6.5" fill="#5e8a5a" transform="rotate(-30 360 117)"/>`,
  );
}

function ankletBeads(p: AssetParams): string {
  const color = p.color ?? '#5fa8a0';
  return toUri(
    `<path d="M230,1206 A22,8 0 0 0 272,1206" stroke="${color}" stroke-width="2.8" fill="none"/>` +
      `<g fill="${color}">` +
      `<circle cx="236" cy="1210" r="2.2"/><circle cx="245" cy="1212" r="2.2"/>` +
      `<circle cx="254" cy="1212" r="2.2"/><circle cx="263" cy="1210" r="2.2"/>` +
      `</g>`,
  );
}

export const ACCESSORY_GENERATORS: Record<string, (p: AssetParams) => string> = {
  // Bags
  bag_leather_tote: structuredLeatherTote,
  bag_quilted_crossbody: quiltedCrossbodyBag,
  bag_mini_satchel: miniTopHandleSatchel,
  bag_beaded_clutch: beadedEveningClutch,
  bag_metallic_baguette: metallicBaguetteBag,
  bag_slouchy_hobo: slouchyHoboBag,
  bag_straw_tote: wovenStrawBeachTote,
  bag_bucket_bag: drawstringBucketBag,

  // Sunglasses
  shades_cateye: catEyeSunglasses,
  shades_aviator: aviatorSunglasses,
  shades_square: oversizedSquareShades,
  shades_retro_oval: retroOvalShades,
  shades_round_tortoise: roundTortoiseShades,
  shades_hex_rose: geometricHexShades,
  shades_rimless_shield: rimlessTintedShields,

  // Earrings
  ear_gold_hoops: classicGoldHoops,
  ear_pearl_drops: pearlDropEarrings,
  ear_crystal_chandelier: crystalChandelierDrops,
  ear_teardrop_studs: sculpturalTeardropStuds,
  ear_emerald_huggies: emeraldHuggies,
  ear_chain_links: doubleLinkChainEarrings,
  ear_celestial_stars: celestialStarDrops,

  // Necklaces
  neck_pearl_strand: pearlStrandNecklace,
  neck_layered_chains: layeredGoldChains,
  neck_diamond_solitaire: diamondSolitairePendant,
  neck_velvet_choker: velvetCrystalChoker,
  neck_cuban_collar: chunkyCubanCollar,
  neck_lariat_emerald: lariatYDropNecklace,
  neck_heart_locket: heartLocketPendant,
  neck_coral_beads: edoCoralBeadsNecklace,

  // Wristwatches
  watch_gold_classic: goldClassicWatch,
  watch_silver_chrono: silverChronoWatch,
  watch_rose_mesh: roseGoldMeshWatch,
  watch_leather_tank: leatherTankWatch,
  watch_diamond_bezel: diamondBezelWatch,
  watch_ceramic_sport: ceramicSportWatch,

  // Completing Accessories
  acc_sun_hat: wideBrimSunHat,
  acc_french_beret: frenchWoolBeret,
  acc_gele_headtie: nigerianGeleHeadtie,
  acc_satin_headband: satinPaddedHeadband,
  acc_silk_scarf: silkNeckScarf,
  acc_leather_belt: leatherWaistBelt,
  acc_chain_belt: goldChainWaistBelt,
  acc_sheer_tights: sheerTightsHosiery,
  acc_opera_gloves: operaEveningGloves,

  // Legacy catalog items
  placeholder_acc_flower_tropical: flowerTropical,
  placeholder_acc_anklet_beads: ankletBeads,
};

export function accessoryAsset(assetId: string, p: AssetParams): string {
  const fn = ACCESSORY_GENERATORS[assetId];
  return fn ? fn(p) : toUri('');
}

export const ACCESSORY_CATALOG: StyleCatalogEntry[] = [
  // Bags
  { id: 'bag_leather_tote', name: 'Structured Leather Tote', category: 'bags', defaultColor: '#7d492d' },
  { id: 'bag_quilted_crossbody', name: 'Quilted Chain Crossbody', category: 'bags', defaultColor: '#1e1b22' },
  { id: 'bag_mini_satchel', name: 'Mini Top-Handle Satchel', category: 'bags', defaultColor: '#a83344' },
  { id: 'bag_beaded_clutch', name: 'Pearl-Clasp Evening Clutch', category: 'bags', defaultColor: '#e6d8be' },
  { id: 'bag_metallic_baguette', name: 'Silver Baguette Shoulder Bag', category: 'bags', defaultColor: '#c8cfd6' },
  { id: 'bag_slouchy_hobo', name: 'Soft Suede Hobo Bag', category: 'bags', defaultColor: '#8c6244' },
  { id: 'bag_straw_tote', name: 'Woven Raffia Beach Tote', category: 'bags', defaultColor: '#d8be8e', defaultColor2: '#2f5a78' },
  { id: 'bag_bucket_bag', name: 'Drawstring Leather Bucket', category: 'bags', defaultColor: '#3e4e44' },

  // Sunglasses
  { id: 'shades_cateye', name: 'Noir Cat-Eye Frames', category: 'sunglasses', defaultColor: '#1e191e', defaultColor2: '#261e28' },
  { id: 'shades_aviator', name: 'Gold-Rim Aviators', category: 'sunglasses', defaultColor: 'gold', defaultColor2: '#3b4a3f' },
  { id: 'shades_square', name: 'Oversized Tortoise Squares', category: 'sunglasses', defaultColor: '#5a3520', defaultColor2: '#3d2518' },
  { id: 'shades_retro_oval', name: '90s Ivory Oval Shades', category: 'sunglasses', defaultColor: '#f4efe6', defaultColor2: '#222026' },
  { id: 'shades_round_tortoise', name: 'Vintage Round Tortoiseshell', category: 'sunglasses', defaultColor: '#6e3d1e', defaultColor2: '#382a1e' },
  { id: 'shades_hex_rose', name: 'Geometric Rose-Tint Hex', category: 'sunglasses', defaultColor: 'gold', defaultColor2: '#7a4854' },
  { id: 'shades_rimless_shield', name: 'Rimless Blush Shield', category: 'sunglasses', defaultColor: '#d97a96' },

  // Earrings
  { id: 'ear_gold_hoops', name: 'Sculpted Gold Hoops', category: 'earrings', defaultColor: 'gold' },
  { id: 'ear_pearl_drops', name: 'Freshwater Pearl Drops', category: 'earrings', defaultColor: 'gold' },
  { id: 'ear_crystal_chandelier', name: 'Diamond Marquis Drops', category: 'earrings', defaultColor: '#d8f0ff', defaultColor2: 'silver' },
  { id: 'ear_teardrop_studs', name: 'Molten Gold Teardrops', category: 'earrings', defaultColor: 'gold' },
  { id: 'ear_emerald_huggies', name: 'Emerald Baguette Huggies', category: 'earrings', defaultColor: '#1e7a52', defaultColor2: 'gold' },
  { id: 'ear_chain_links', name: 'Double-Link Chain Drops', category: 'earrings', defaultColor: 'gold' },
  { id: 'ear_celestial_stars', name: 'Celestial Star Drops', category: 'earrings', defaultColor: 'gold' },

  // Necklaces
  { id: 'neck_pearl_strand', name: 'Classic Pearl Strand', category: 'necklaces', defaultColor: 'gold' },
  { id: 'neck_layered_chains', name: 'Triple-Tier Gold Chains', category: 'necklaces', defaultColor: 'gold' },
  { id: 'neck_diamond_solitaire', name: 'Diamond Solitaire Pendant', category: 'necklaces', defaultColor: 'silver' },
  { id: 'neck_velvet_choker', name: 'Velvet & Crystal Choker', category: 'necklaces', defaultColor: '#1e1922' },
  { id: 'neck_cuban_collar', name: 'Chunky Cuban Link Collar', category: 'necklaces', defaultColor: 'gold' },
  { id: 'neck_lariat_emerald', name: 'Emerald Y-Drop Lariat', category: 'necklaces', defaultColor: 'gold', defaultColor2: '#1e7a52' },
  { id: 'neck_heart_locket', name: 'Rose-Gold Heart Locket', category: 'necklaces', defaultColor: 'rose' },
  { id: 'neck_coral_beads', name: 'Edo Coral Bead Collar', category: 'necklaces', defaultColor: '#c83424' },

  // Wristwatches
  { id: 'watch_gold_classic', name: 'Champagne Dial Gold Watch', category: 'watches', defaultColor: '#f7f1e3' },
  { id: 'watch_silver_chrono', name: 'Navy Dial Steel Chronograph', category: 'watches', defaultColor: '#1e2c44' },
  { id: 'watch_rose_mesh', name: 'Rose-Gold Milanese Mesh', category: 'watches', defaultColor: '#fff5f3' },
  { id: 'watch_leather_tank', name: 'Espresso Leather Tank Watch', category: 'watches', defaultColor: '#3b2416' },
  { id: 'watch_diamond_bezel', name: 'Pavé Diamond Bezel Watch', category: 'watches', defaultColor: '#eef6fc' },
  { id: 'watch_ceramic_sport', name: 'Ivory Ceramic Sport Watch', category: 'watches', defaultColor: '#f2efe9' },

  // Completing Accessories
  { id: 'acc_sun_hat', name: 'Wide-Brim Riviera Sun Hat', category: 'accessories', defaultColor: '#dfd0ad', defaultColor2: '#1e1b20' },
  { id: 'acc_french_beret', name: 'Crimson Wool Beret', category: 'accessories', defaultColor: '#9e192d' },
  { id: 'acc_gele_headtie', name: 'Sculpted Aso-Oke Gele', category: 'accessories', defaultColor: '#8b1e2d', defaultColor2: '#e6c35c' },
  { id: 'acc_satin_headband', name: 'Padded Satin Headband', category: 'accessories', defaultColor: '#2e4e44' },
  { id: 'acc_silk_scarf', name: 'Knotted Silk Neck Scarf', category: 'accessories', defaultColor: '#b83344', defaultColor2: '#f5e8d0' },
  { id: 'acc_leather_belt', name: 'Gold-Buckle Waist Belt', category: 'accessories', defaultColor: '#221c18' },
  { id: 'acc_chain_belt', name: 'Gold Chain Waist Belt', category: 'accessories', defaultColor: 'gold' },
  { id: 'acc_sheer_tights', name: 'Sheer Noir Tights', category: 'accessories', defaultColor: '#1e1b22' },
  { id: 'acc_opera_gloves', name: 'Satin Opera Evening Gloves', category: 'accessories', defaultColor: '#1e1920' },
];
