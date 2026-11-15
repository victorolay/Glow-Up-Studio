import type { AssetParams } from './params';
import { shade, toUri } from './primitives';
import { HAIR_STYLE_GENERATORS_EXTRA } from './hairArtExtra';

/*
 * Hair styles fitted precisely to the 600×1280 front-facing model in figure.ts:
 * - Face oval: x 254–346 (92px wide, center 300), y 84–208 (124px tall)
 * - Forehead hairline: y ~90–112; brows: y 119–125; eyes: y 131–140
 * - Nose: x 294–306, y 131–164; lips: x 285–315, y 173–189
 * - Ears: x 245–259 (L) and 341–355 (R), y 136–167
 * - Neck: x 277–323, y 192–253; shoulders: x 196–404 at y 282; bust: cy 382
 *
 * Both `back` and `front` layers keep the entire front-facing face window
 * (x 256–344, y 90–208) and front neck (x 276–324) completely open so the
 * model's eyes, brows, nose, cheeks, and lips are never covered regardless of
 * layer stacking order.
 */

const FALLBACK_COLOR = '#5C3622';

interface HairRamp {
  hi2: string;
  hi1: string;
  mid: string;
  sh1: string;
  sh2: string;
  sh3: string;
}

export function hairRamp(color: string): HairRamp {
  return {
    hi2: shade(color, 0.38),
    hi1: shade(color, 0.18),
    mid: color,
    sh1: shade(color, -0.22),
    sh2: shade(color, -0.42),
    sh3: shade(color, -0.58),
  };
}

export function defs(idPrefix: string, r: HairRamp, y2 = 340): string {
  return `<defs>
    <filter id="${idPrefix}Blur" filterUnits="userSpaceOnUse" x="180" y="30" width="240" height="430">
      <feGaussianBlur stdDeviation="1.8" />
    </filter>
    <linearGradient id="${idPrefix}Main" gradientUnits="userSpaceOnUse" x1="245" y1="68" x2="365" y2="${y2}">
      <stop offset="0" stop-color="${r.hi1}" />
      <stop offset="0.38" stop-color="${r.mid}" />
      <stop offset="0.78" stop-color="${r.sh1}" />
      <stop offset="1" stop-color="${r.sh2}" />
    </linearGradient>
    <linearGradient id="${idPrefix}Deep" gradientUnits="userSpaceOnUse" x1="250" y1="90" x2="350" y2="${y2}">
      <stop offset="0" stop-color="${r.sh1}" />
      <stop offset="0.55" stop-color="${r.sh2}" />
      <stop offset="1" stop-color="${r.sh3}" />
    </linearGradient>
    <linearGradient id="${idPrefix}Crown" gradientUnits="userSpaceOnUse" x1="260" y1="62" x2="340" y2="145">
      <stop offset="0" stop-color="${r.hi2}" />
      <stop offset="0.5" stop-color="${r.mid}" />
      <stop offset="1" stop-color="${r.sh1}" />
    </linearGradient>
    <linearGradient id="${idPrefix}Shine" gradientUnits="userSpaceOnUse" x1="0" y1="70" x2="0" y2="${Math.min(y2, 340)}">
      <stop offset="0" stop-color="${r.hi2}" stop-opacity="0" />
      <stop offset="0.35" stop-color="${r.hi2}" stop-opacity="0.78" />
      <stop offset="0.72" stop-color="${r.hi1}" stop-opacity="0.35" />
      <stop offset="1" stop-color="${r.mid}" stop-opacity="0" />
    </linearGradient>
  </defs>`;
}

/**
 * Open-face skull horseshoe behind the ears (fits x 249–351, crown y 76)
 * with the entire face window (x 256–344, y 90–208) cut out.
 */
export function openSkullBack(idPrefix: string): string {
  return (
    `<path d="M 300 76 ` +
    `C 268 76, 250 96, 249 128 ` +
    `C 248 148, 251 164, 256 177 ` +
    `C 259 178, 261 174, 260 166 ` +
    `C 256 152, 255 138, 255 126 ` +
    `C 256 104, 272 90, 300 89 ` +
    `C 328 90, 344 104, 345 126 ` +
    `C 345 138, 344 152, 340 166 ` +
    `C 339 174, 341 178, 344 177 ` +
    `C 349 164, 352 148, 351 128 ` +
    `C 350 96, 332 76, 300 76 Z" fill="url(#${idPrefix}Main)" />`
  );
}

/** Sleek pulled-back hairline hugging FACE_OVAL (x 254–346, y 84) with ears & face completely clear. */
export function sleekHairlineFront(idPrefix: string, r: HairRamp, shine: boolean): string {
  return (
    `<path d="M 300 76 ` +
    `C 269 76, 251 97, 250 128 ` +
    `C 250 134, 252 138, 255 138 ` +
    `C 256 123, 260 110, 268 101 ` +
    `C 278 92, 290 91, 300 92 ` +
    `C 310 91, 322 92, 332 101 ` +
    `C 340 110, 344 123, 345 138 ` +
    `C 348 138, 350 134, 350 128 ` +
    `C 349 97, 331 76, 300 76 Z" fill="url(#${idPrefix}Crown)" />` +
    `<path d="M 263 102 C 276 92, 290 90, 300 91 C 310 90, 324 92, 337 102" stroke="${r.sh2}" stroke-width="1.6" opacity="0.32" fill="none" stroke-linecap="round" />` +
    `<path d="M 254 132 C 253 139, 254 146, 256 150" stroke="${r.sh1}" stroke-width="1.8" opacity="0.55" fill="none" stroke-linecap="round" />` +
    `<path d="M 346 132 C 347 139, 346 146, 344 150" stroke="${r.sh1}" stroke-width="1.8" opacity="0.55" fill="none" stroke-linecap="round" />` +
    (shine
      ? `<path d="M 272 85 C 288 79, 312 79, 328 85" stroke="${r.hi2}" stroke-width="3.2" opacity="0.58" fill="none" stroke-linecap="round" filter="url(#${idPrefix}Blur)" />`
      : '')
  );
}

export type StyleFn = (color: string, p: AssetParams) => { back: string; front: string };

/** 1. Long Waves — soft parted S-waves framing the face and cascading over shoulders onto upper bust (y 71–404). */
const longWaves: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shineOpacity = p.shine ? 0.8 : 0.32;

  // Open-face & open-neck left/right curtains so face (x 256–344) and throat (x 276–324) remain clear
  const back =
    defs('hLWb', r, 410) +
    `<path d="M 300 71 ` +
    `C 262 71, 242 94, 238 130 ` +
    `C 235 162, 240 194, 232 228 ` +
    `C 224 262, 218 298, 224 334 ` +
    `C 229 364, 238 386, 248 400 ` +
    `C 254 406, 263 398, 267 382 ` +
    `C 273 356, 276 322, 275 288 ` +
    `C 274 260, 274 236, 275 212 ` +
    `C 267 196, 258 176, 255 152 ` +
    `C 254 130, 255 112, 264 99 ` +
    `C 274 91, 288 89, 300 89 ` +
    `C 312 89, 326 91, 336 99 ` +
    `C 345 112, 346 130, 345 152 ` +
    `C 342 176, 333 196, 325 212 ` +
    `C 326 236, 326 260, 325 288 ` +
    `C 324 322, 327 356, 333 382 ` +
    `C 337 398, 346 406, 352 400 ` +
    `C 362 386, 371 364, 376 334 ` +
    `C 382 298, 376 262, 368 228 ` +
    `C 360 194, 365 162, 362 130 ` +
    `C 358 94, 338 71, 300 71 Z" fill="url(#hLWbMain)" />` +
    `<path d="M 252 184 C 242 226, 235 282, 242 344 C 254 322, 266 286, 274 234 Z" fill="url(#hLWbDeep)" opacity="0.72" />` +
    `<path d="M 348 184 C 358 226, 365 282, 358 344 C 346 322, 334 286, 326 234 Z" fill="url(#hLWbDeep)" opacity="0.78" />` +
    `<path d="M 237 224 C 226 258, 224 298, 232 338 C 237 360, 243 378, 251 390" stroke="${r.sh2}" stroke-width="1.8" opacity="0.38" fill="none" stroke-linecap="round" />` +
    `<path d="M 363 224 C 374 258, 376 298, 368 338 C 363 360, 357 378, 349 390" stroke="${r.sh2}" stroke-width="1.8" opacity="0.42" fill="none" stroke-linecap="round" />`;

  const front =
    defs('hLWf', r, 370) +
    `<path d="M 300 71 ` +
    `C 264 71, 244 94, 240 128 ` +
    `C 237 156, 242 184, 235 216 ` +
    `C 228 248, 226 286, 234 320 ` +
    `C 238 338, 244 352, 251 360 ` +
    `C 256 354, 258 340, 256 322 ` +
    `C 253 296, 254 268, 259 238 ` +
    `C 261 214, 260 190, 255 168 ` +
    `C 252 148, 252 126, 259 109 ` +
    `C 268 95, 285 90, 300 90 ` +
    `C 315 90, 332 95, 341 109 ` +
    `C 348 126, 348 148, 345 168 ` +
    `C 340 190, 339 214, 341 238 ` +
    `C 346 268, 347 296, 344 322 ` +
    `C 342 340, 344 354, 349 360 ` +
    `C 356 352, 362 338, 366 320 ` +
    `C 374 286, 372 248, 365 216 ` +
    `C 358 184, 363 156, 360 128 ` +
    `C 356 94, 336 71, 300 71 Z" fill="url(#hLWfMain)" />` +
    `<path d="M 300 72 L 300 90" stroke="${r.sh3}" stroke-width="1.6" opacity="0.65" stroke-linecap="round" />` +
    `<path d="M 259 110 C 269 95, 286 90, 300 90 C 314 90, 331 95, 341 110" stroke="${r.sh2}" stroke-width="1.8" opacity="0.3" fill="none" stroke-linecap="round" />` +
    `<path d="M 252 118 C 244 152, 249 186, 243 224 C 237 262, 238 302, 247 340" stroke="${r.sh2}" stroke-width="1.4" opacity="0.36" fill="none" stroke-linecap="round" />` +
    `<path d="M 348 118 C 356 152, 351 186, 357 224 C 363 262, 362 302, 353 340" stroke="${r.sh2}" stroke-width="1.4" opacity="0.4" fill="none" stroke-linecap="round" />` +
    `<path d="M 244 174 C 240 208, 246 244, 240 282" stroke="${r.sh1}" stroke-width="1.2" opacity="0.35" fill="none" stroke-linecap="round" />` +
    `<path d="M 356 174 C 360 208, 354 244, 360 282" stroke="${r.sh1}" stroke-width="1.2" opacity="0.35" fill="none" stroke-linecap="round" />` +
    `<g opacity="${shineOpacity.toFixed(2)}">` +
    `<path d="M 288 79 C 266 84, 252 103, 247 134 C 242 166, 247 202, 239 246 C 234 276, 236 306, 245 328" stroke="url(#hLWfShine)" stroke-width="3.6" fill="none" stroke-linecap="round" filter="url(#hLWfBlur)" />` +
    `<path d="M 312 79 C 334 84, 348 103, 353 134 C 358 166, 353 202, 361 246 C 366 276, 364 306, 355 328" stroke="url(#hLWfShine)" stroke-width="3.2" fill="none" stroke-linecap="round" filter="url(#hLWfBlur)" />` +
    `</g>`;

  return { back, front };
};

/** 2. Beach Braids — tightly woven twin braids resting over inner shoulders/clavicles (x 261 & 339, y 76–368). */
export function braidTail(xCenter: number, side: -1 | 1, idPrefix: string, r: HairRamp, shine: boolean): string {
  const count = 9;
  const endY = 186 + count * 17;
  const endX = xCenter + side * -2;

  const spine =
    `<path d="M ${(xCenter - 8.5).toFixed(1)} 182 ` +
    `Q ${(xCenter - 7.5 + side * -1).toFixed(1)} 262 ${(endX - 4.5).toFixed(1)} ${endY.toFixed(1)} ` +
    `L ${(endX + 4.5).toFixed(1)} ${endY.toFixed(1)} ` +
    `Q ${(xCenter + 7.5 + side * -1).toFixed(1)} 262 ${(xCenter + 8.5).toFixed(1)} 182 Z" ` +
    `fill="${r.sh2}" />`;

  const links: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const y = 184 + i * 17;
    const x = xCenter + side * (1.2 - t * 3.2);
    const w = 10.8 - t * 3.6;
    const h = 14.5 - t * 2.4;

    links.push(
      `<path d="M ${(x + 1.8).toFixed(1)} ${(y - 1).toFixed(1)} ` +
      `C ${(x - w).toFixed(1)} ${(y + 0.5).toFixed(1)}, ${(x - w).toFixed(1)} ${(y + h * 0.72).toFixed(1)}, ${(x + 2.4).toFixed(1)} ${(y + h).toFixed(1)} ` +
      `C ${(x + 3.2).toFixed(1)} ${(y + h * 0.55).toFixed(1)}, ${(x + 3).toFixed(1)} ${(y + 2).toFixed(1)}, ${(x + 1.8).toFixed(1)} ${(y - 1).toFixed(1)} Z" ` +
      `fill="url(#${idPrefix}Main)" stroke="${r.sh2}" stroke-width="0.65" stroke-opacity="0.7" />`,
    );
    links.push(
      `<path d="M ${(x - 1.8).toFixed(1)} ${(y + 4.5).toFixed(1)} ` +
      `C ${(x + w).toFixed(1)} ${(y + 6).toFixed(1)}, ${(x + w).toFixed(1)} ${(y + h * 0.85 + 4.5).toFixed(1)}, ${(x - 2.4).toFixed(1)} ${(y + h + 5).toFixed(1)} ` +
      `C ${(x - 3.2).toFixed(1)} ${(y + h * 0.65 + 4.5).toFixed(1)}, ${(x - 3).toFixed(1)} ${(y + 7).toFixed(1)}, ${(x - 1.8).toFixed(1)} ${(y + 4.5).toFixed(1)} Z" ` +
      `fill="url(#${idPrefix}Main)" stroke="${r.sh2}" stroke-width="0.65" stroke-opacity="0.7" />`,
    );
    if (shine && i % 2 === 0) {
      links.push(
        `<path d="M ${(x - w * 0.45).toFixed(1)} ${(y + 3.5).toFixed(1)} Q ${x.toFixed(1)} ${(y + 5.5).toFixed(1)} ${(x + w * 0.45).toFixed(1)} ${(y + 7.5).toFixed(1)}" stroke="${r.hi2}" stroke-width="1.5" opacity="0.58" fill="none" stroke-linecap="round" />`,
      );
    }
  }

  return (
    spine +
    links.join('') +
    `<rect x="${(endX - 5.5).toFixed(1)}" y="${(endY - 1).toFixed(1)}" width="11" height="4" rx="2" fill="${r.sh3}" />` +
    `<path d="M ${(endX - 4.8).toFixed(1)} ${(endY + 3).toFixed(1)} ` +
    `C ${(endX - 6.5).toFixed(1)} ${(endY + 12).toFixed(1)}, ${(endX - 4).toFixed(1)} ${(endY + 23).toFixed(1)}, ${(endX - 0.5).toFixed(1)} ${(endY + 30).toFixed(1)} ` +
    `C ${(endX + 4).toFixed(1)} ${(endY + 23).toFixed(1)}, ${(endX + 6.5).toFixed(1)} ${(endY + 12).toFixed(1)}, ${(endX + 4.8).toFixed(1)} ${(endY + 3).toFixed(1)} Z" ` +
    `fill="url(#${idPrefix}Main)" />`
  );
}

const beachBraids: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? false;

  const back =
    defs('hBBb', r, 370) +
    openSkullBack('hBBb') +
    `<path d="M 254 156 C 250 168, 251 182, 255 194 L 265 190 C 262 178, 260 166, 258 156 Z" fill="url(#hBBbDeep)" />` +
    `<path d="M 346 156 C 350 168, 349 182, 345 194 L 335 190 C 338 178, 340 166, 342 156 Z" fill="url(#hBBbDeep)" />`;

  const front =
    defs('hBBf', r, 370) +
    sleekHairlineFront('hBBf', r, shine) +
    `<path d="M 300 76 L 300 92" stroke="${r.sh3}" stroke-width="1.7" opacity="0.72" stroke-linecap="round" />` +
    `<path d="M 298 81 C 278 81, 262 94, 254 118" stroke="${r.sh2}" stroke-width="1.9" opacity="0.45" fill="none" stroke-linecap="round" />` +
    `<path d="M 302 81 C 322 81, 338 94, 346 118" stroke="${r.sh2}" stroke-width="1.9" opacity="0.45" fill="none" stroke-linecap="round" />` +
    braidTail(261, -1, 'hBBf', r, shine) +
    braidTail(339, 1, 'hBBf', r, shine);

  return { back, front };
};

/** 3. Sleek Bun — high sculpted ballerina bun anchored directly to the crown (y 49–83, head y 76–208). */
const sleekBun: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? false;

  const back =
    defs('hSBb', r, 210) +
    openSkullBack('hSBb') +
    `<path d="M 300 49 ` +
    `C 282 49, 275 59, 276 70 ` +
    `C 277 78, 286 83, 300 83 ` +
    `C 314 83, 323 78, 324 70 ` +
    `C 325 59, 318 49, 300 49 Z" fill="url(#hSBbCrown)" />` +
    `<path d="M 281 74 C 288 79, 312 79, 319 74" stroke="${r.sh2}" stroke-width="2.5" opacity="0.65" fill="none" stroke-linecap="round" />` +
    `<path d="M 283 61 C 292 54, 308 54, 317 61" stroke="${r.hi2}" stroke-width="2.4" opacity="${shine ? '0.68' : '0.35'}" fill="none" stroke-linecap="round" />` +
    `<path d="M 286 68 C 295 63, 306 63, 315 68" stroke="${r.sh1}" stroke-width="1.6" opacity="0.5" fill="none" stroke-linecap="round" />`;

  const front =
    defs('hSBf', r, 180) +
    sleekHairlineFront('hSBf', r, shine) +
    `<path d="M 264 103 C 275 91, 288 84, 297 78" stroke="${r.sh1}" stroke-width="1.1" opacity="0.4" fill="none" />` +
    `<path d="M 336 103 C 325 91, 312 84, 303 78" stroke="${r.sh1}" stroke-width="1.1" opacity="0.4" fill="none" />`;

  return { back, front };
};

/** 4. Curly Bob — chin-length bouncy spiral curls framing the face with open face window (x 230–370, y 68–232). */
const curlyBob: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? false;

  const back =
    defs('hCBb', r, 245) +
    `<path d="M 300 68 ` +
    `C 289 65, 276 68, 268 74 ` +
    `C 256 73, 246 82, 244 92 ` +
    `C 234 98, 230 110, 234 122 ` +
    `C 226 132, 226 146, 233 156 ` +
    `C 227 168, 229 182, 237 192 ` +
    `C 234 204, 240 218, 250 222 ` +
    `C 254 232, 266 234, 276 226 ` +
    `C 282 222, 284 214, 280 204 ` +
    `C 272 194, 262 178, 257 158 ` +
    `C 254 140, 255 116, 264 99 ` +
    `C 274 91, 288 89, 300 89 ` +
    `C 312 89, 326 91, 336 99 ` +
    `C 345 116, 346 140, 343 158 ` +
    `C 338 178, 328 194, 320 204 ` +
    `C 316 214, 318 222, 324 226 ` +
    `C 334 234, 346 232, 350 222 ` +
    `C 360 218, 366 204, 363 192 ` +
    `C 371 182, 373 168, 367 156 ` +
    `C 374 146, 374 132, 366 122 ` +
    `C 370 110, 366 98, 356 92 ` +
    `C 354 82, 344 73, 332 74 ` +
    `C 324 68, 311 65, 300 68 Z" fill="url(#hCBbMain)" />` +
    `<path d="M 245 164 C 242 192, 252 218, 268 227 C 276 216, 278 196, 264 176 Z" fill="url(#hCBbDeep)" opacity="0.76" />` +
    `<path d="M 355 164 C 358 192, 348 218, 332 227 C 324 216, 322 196, 336 176 Z" fill="url(#hCBbDeep)" opacity="0.8" />`;

  const front =
    defs('hCBf', r, 240) +
    `<path d="M 300 68 ` +
    `C 276 67, 254 78, 244 96 ` +
    `C 235 112, 233 132, 236 150 ` +
    `C 232 166, 235 186, 242 200 ` +
    `C 246 212, 254 220, 262 222 ` +
    `C 256 208, 253 190, 256 170 ` +
    `C 253 150, 252 130, 257 112 ` +
    `C 262 103, 270 106, 275 100 ` +
    `C 282 95, 290 100, 296 94 ` +
    `C 299 91, 301 91, 304 94 ` +
    `C 310 100, 318 95, 325 100 ` +
    `C 330 106, 338 103, 343 112 ` +
    `C 348 130, 347 150, 344 170 ` +
    `C 347 190, 344 208, 338 222 ` +
    `C 346 220, 354 212, 358 200 ` +
    `C 365 186, 368 166, 364 150 ` +
    `C 367 132, 365 112, 356 96 ` +
    `C 346 78, 324 67, 300 68 Z" fill="url(#hCBfMain)" />` +
    `<path d="M 271 96 C 264 102, 265 110, 270 112" stroke="${r.mid}" stroke-width="2.4" fill="none" stroke-linecap="round" />` +
    `<path d="M 329 96 C 336 102, 335 110, 330 112" stroke="${r.mid}" stroke-width="2.4" fill="none" stroke-linecap="round" />` +
    `<path d="M 255 118 C 246 126, 245 138, 252 146 C 245 156, 245 168, 252 178 C 246 188, 248 202, 257 210" stroke="${r.sh2}" stroke-width="1.8" opacity="0.5" fill="none" stroke-linecap="round" />` +
    `<path d="M 345 118 C 354 126, 355 138, 348 146 C 355 156, 355 168, 348 178 C 354 188, 352 202, 343 210" stroke="${r.sh2}" stroke-width="1.8" opacity="0.52" fill="none" stroke-linecap="round" />` +
    `<g opacity="${shine ? '0.72' : '0.3'}">` +
    `<path d="M 278 76 C 266 80, 256 89, 251 100" stroke="${r.hi2}" stroke-width="2.6" fill="none" stroke-linecap="round" />` +
    `<path d="M 322 76 C 334 80, 344 89, 349 100" stroke="${r.hi2}" stroke-width="2.4" fill="none" stroke-linecap="round" />` +
    `<path d="M 244 126 C 239 135, 240 144, 245 151" stroke="${r.hi1}" stroke-width="2.4" fill="none" stroke-linecap="round" />` +
    `<path d="M 356 126 C 361 135, 360 144, 355 151" stroke="${r.hi1}" stroke-width="2.2" fill="none" stroke-linecap="round" />` +
    `<path d="M 242 164 C 238 174, 240 184, 246 192" stroke="${r.hi1}" stroke-width="2.2" fill="none" stroke-linecap="round" />` +
    `<path d="M 358 164 C 362 174, 360 184, 354 192" stroke="${r.hi1}" stroke-width="2.1" fill="none" stroke-linecap="round" />` +
    `</g>`;

  return { back, front };
};

/** 5. Ponytail — sleek pulled-back crown with high S-waved ponytail sweeping over right shoulder (y 62–294). */
const ponytail: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? false;

  const back =
    defs('hPTb', r, 300) +
    openSkullBack('hPTb') +
    `<path d="M 304 71 ` +
    `C 326 60, 356 68, 368 98 ` +
    `C 378 124, 378 158, 372 192 ` +
    `C 366 226, 368 258, 356 286 ` +
    `C 352 294, 347 294, 345 288 ` +
    `C 340 270, 342 246, 346 218 ` +
    `C 350 186, 350 152, 342 122 ` +
    `C 334 96, 320 82, 302 78 Z" fill="url(#hPTbMain)" />` +
    `<path d="M 314 80 C 334 92, 346 122, 349 160 C 351 198, 347 238, 346 274 C 354 252, 361 214, 361 174 C 361 132, 346 90, 314 80 Z" fill="url(#hPTbDeep)" opacity="0.65" />` +
    `<path d="M 301 70 C 308 68, 314 73, 311 79 C 306 81, 300 77, 301 70 Z" fill="${r.sh3}" />` +
    `<path d="M 322 72 C 346 74, 363 100, 367 138 C 371 174, 365 216, 354 256" stroke="${r.hi2}" stroke-width="2.8" opacity="${shine ? '0.72' : '0.3'}" fill="none" stroke-linecap="round" filter="url(#hPTbBlur)" />`;

  const front =
    defs('hPTf', r, 180) +
    sleekHairlineFront('hPTf', r, shine) +
    `<path d="M 294 76 C 299 71, 308 70, 313 75 C 308 77, 300 77, 294 76 Z" fill="${r.sh2}" opacity="0.65" />` +
    `<path d="M 255 128 C 253 140, 255 152, 258 162" stroke="${r.mid}" stroke-width="2" fill="none" stroke-linecap="round" />` +
    `<path d="M 345 128 C 347 140, 345 152, 342 162" stroke="${r.mid}" stroke-width="2" fill="none" stroke-linecap="round" />`;

  return { back, front };
};

/** 6. Short Crop — tailored, feathered pixie cut hugging the 92×124 head (x 247–353, y 73–182). */
const shortCrop: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? false;

  const back =
    defs('hSCb', r, 190) +
    `<path d="M 300 73 ` +
    `C 267 73, 248 95, 247 126 ` +
    `C 246 146, 251 164, 257 177 ` +
    `C 260 176, 261 170, 260 162 ` +
    `C 256 148, 255 136, 256 124 ` +
    `C 257 104, 272 90, 300 89 ` +
    `C 328 90, 343 104, 344 124 ` +
    `C 345 136, 344 148, 340 162 ` +
    `C 339 170, 340 176, 343 177 ` +
    `C 349 164, 354 146, 353 126 ` +
    `C 352 95, 333 73, 300 73 Z" fill="url(#hSCbDeep)" />`;

  const front =
    defs('hSCf', r, 180) +
    `<path d="M 300 73 ` +
    `C 268 73, 250 94, 248 124 ` +
    `C 247 134, 249 144, 253 151 ` +
    `C 254 141, 254 132, 257 122 ` +
    `C 260 112, 266 102, 274 95 ` +
    `C 286 98, 298 101, 312 102 ` +
    `C 324 103, 334 108, 341 115 ` +
    `C 345 125, 346 138, 347 151 ` +
    `C 351 144, 353 134, 352 124 ` +
    `C 350 94, 332 73, 300 73 Z" fill="url(#hSCfCrown)" />` +
    `<path d="M 271 84 C 288 92, 306 99, 326 103" stroke="${r.sh2}" stroke-width="1.5" opacity="0.45" fill="none" stroke-linecap="round" />` +
    `<path d="M 280 79 C 299 85, 318 93, 336 103" stroke="${r.hi2}" stroke-width="2.3" opacity="${shine ? '0.72' : '0.32'}" fill="none" stroke-linecap="round" />` +
    `<path d="M 255 118 C 254 128, 255 138, 257 146" stroke="${r.sh1}" stroke-width="1.6" opacity="0.55" fill="none" stroke-linecap="round" />` +
    `<path d="M 345 118 C 346 128, 345 138, 343 146" stroke="${r.sh1}" stroke-width="1.6" opacity="0.55" fill="none" stroke-linecap="round" />`;

  return { back, front };
};

/** 7. Elegant Updo — romantic twisted chignon on crown with soft inward-curling jawline tendrils (y 53–196). */
const elegantUpdo: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? false;

  const back =
    defs('hEUb', r, 210) +
    openSkullBack('hEUb') +
    `<path d="M 300 53 ` +
    `C 279 53, 271 63, 273 73 ` +
    `C 275 80, 285 84, 300 84 ` +
    `C 315 84, 325 80, 327 73 ` +
    `C 329 63, 321 53, 300 53 Z" fill="url(#hEUbCrown)" />` +
    `<path d="M 276 68 C 289 58, 311 58, 324 68" stroke="${r.sh2}" stroke-width="2" opacity="0.52" fill="none" stroke-linecap="round" />` +
    `<path d="M 283 76 C 296 68, 313 69, 322 75" stroke="${r.hi2}" stroke-width="2.2" opacity="${shine ? '0.72' : '0.35'}" fill="none" stroke-linecap="round" />`;

  const front =
    defs('hEUf', r, 200) +
    sleekHairlineFront('hEUf', r, shine) +
    `<path d="M 300 76 L 300 92" stroke="${r.sh2}" stroke-width="1.5" opacity="0.58" stroke-linecap="round" />` +
    `<path d="M 255 124 C 250 140, 250 158, 254 174 C 257 183, 260 190, 265 194 C 259 188, 257 180, 255 170 C 253 156, 253 140, 256 124 Z" fill="url(#hEUfMain)" />` +
    `<path d="M 345 124 C 350 140, 350 158, 346 174 C 343 183, 340 190, 335 194 C 341 188, 343 180, 345 170 C 347 156, 347 140, 344 124 Z" fill="url(#hEUfMain)" />`;

  return { back, front };
};

/** 8. Natural Afro — lush, cloud-soft coiled halo with open face window (x 224–376, y 56–214). */
const naturalAfro: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? false;

  const back =
    defs('hNAb', r, 225) +
    // Open-face halo so face (x 255–345, y 89–205) stays completely visible in any layer order
    `<path d="M 300 56 ` +
    `C 286 55, 274 60, 266 64 ` +
    `C 254 64, 244 72, 240 82 ` +
    `C 230 88, 226 100, 228 112 ` +
    `C 222 124, 222 138, 228 150 ` +
    `C 224 162, 228 176, 238 184 ` +
    `C 240 196, 250 206, 262 208 ` +
    `C 270 214, 282 212, 286 204 ` +
    `C 272 194, 260 176, 256 154 ` +
    `C 254 134, 255 114, 264 98 ` +
    `C 274 90, 288 89, 300 89 ` +
    `C 312 89, 326 90, 336 98 ` +
    `C 345 114, 346 134, 344 154 ` +
    `C 340 176, 328 194, 314 204 ` +
    `C 318 212, 330 214, 338 208 ` +
    `C 350 206, 360 196, 362 184 ` +
    `C 372 176, 376 162, 372 150 ` +
    `C 378 138, 378 124, 372 112 ` +
    `C 374 100, 370 88, 360 82 ` +
    `C 356 72, 346 64, 334 64 ` +
    `C 326 60, 314 55, 300 56 Z" fill="url(#hNAbMain)" />` +
    `<path d="M 248 156 C 246 178, 254 198, 272 206 L 284 204 C 270 194, 260 176, 256 154 Z" fill="url(#hNAbDeep)" opacity="0.68" />` +
    `<path d="M 352 156 C 354 178, 346 198, 328 206 L 316 204 C 330 194, 340 176, 344 154 Z" fill="url(#hNAbDeep)" opacity="0.68" />` +
    `<g opacity="0.34" stroke="${r.sh2}" stroke-width="1.6" fill="none" stroke-linecap="round">` +
    `<path d="M 237 136 C 232 142, 234 150, 240 154" />` +
    `<path d="M 363 136 C 368 142, 366 150, 360 154" />` +
    `<path d="M 241 168 C 237 174, 240 182, 246 185" />` +
    `<path d="M 359 168 C 363 174, 360 182, 354 185" />` +
    `</g>` +
    `<g opacity="${shine ? '0.62' : '0.28'}" stroke="${r.hi2}" stroke-width="2" fill="none" stroke-linecap="round">` +
    `<path d="M 278 63 C 288 59, 312 59, 322 63" />` +
    `<path d="M 243 87 C 235 96, 232 108, 233 118" />` +
    `<path d="M 357 87 C 365 96, 368 108, 367 118" />` +
    `</g>`;

  const front =
    defs('hNAf', r, 165) +
    `<path d="M 300 57 ` +
    `C 270 57, 245 72, 236 98 ` +
    `C 232 112, 234 128, 240 138 ` +
    `C 246 140, 252 138, 254 134 ` +
    `C 253 125, 256 118, 259 113 ` +
    `C 259 107, 264 103, 268 100 ` +
    `C 272 95, 278 94, 283 94 ` +
    `C 288 91, 295 92, 300 92 ` +
    `C 305 92, 312 91, 317 94 ` +
    `C 322 94, 328 95, 332 100 ` +
    `C 336 103, 341 107, 341 113 ` +
    `C 344 118, 347 125, 346 134 ` +
    `C 348 138, 354 140, 360 138 ` +
    `C 366 128, 368 112, 364 98 ` +
    `C 355 72, 330 57, 300 57 Z" fill="url(#hNAfCrown)" />` +
    `<g opacity="0.38" stroke="${r.sh2}" stroke-width="1.5" fill="none" stroke-linecap="round">` +
    `<path d="M 262 84 C 270 78, 280 78, 288 83" />` +
    `<path d="M 312 83 C 320 78, 330 78, 338 84" />` +
    `<path d="M 286 73 C 294 69, 306 69, 314 73" />` +
    `<path d="M 244 106 C 246 98, 252 92, 259 89" />` +
    `<path d="M 356 106 C 354 98, 348 92, 341 89" />` +
    `</g>`;

  return { back, front };
};

export const HAIR_STYLE_GENERATORS: Record<string, StyleFn> = {
  placeholder_hair_long_waves: longWaves,
  placeholder_hair_beach_braids: beachBraids,
  placeholder_hair_sleek_bun: sleekBun,
  placeholder_hair_curly_bob: curlyBob,
  placeholder_hair_ponytail: ponytail,
  placeholder_hair_short_crop: shortCrop,
  placeholder_hair_elegant_updo: elegantUpdo,
  placeholder_hair_natural_afro: naturalAfro,
  ...HAIR_STYLE_GENERATORS_EXTRA,
};

export function hairAsset(assetId: string, p: AssetParams): string {
  const fn = HAIR_STYLE_GENERATORS[assetId];
  if (!fn) return toUri('');
  const color = p.color ?? FALLBACK_COLOR;
  const parts = fn(color, p);
  return toUri(p.hairBack ? parts.back : parts.front);
}

export const HAIR_GENERATORS: Record<string, (p: AssetParams) => string> = Object.fromEntries(
  Object.keys(HAIR_STYLE_GENERATORS).map((id) => [id, (p: AssetParams) => hairAsset(id, p)]),
);
