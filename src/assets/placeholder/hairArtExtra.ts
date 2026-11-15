import type { AssetParams } from './params';
import { braidTail, defs, hairRamp, openSkullBack, sleekHairlineFront, type StyleFn } from './hairArt';

/**
 * 22 additional wigs & hairstyles fitted cleanly to the 600×1280 figure
 * keeping face window (x 256–344, y 90–208) and throat (x 276–324) open.
 */

/** 9. Silk Press Waist Length — glass-straight waist-length wig with razor ends (y 70–515). */
const silkPress: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hSPb', r, 520) +
    `<path d="M 300 70 C 263 70, 244 94, 242 132 L 234 320 L 228 512 C 242 520, 258 518, 266 508 L 274 320 L 275 212 C 266 196, 257 174, 255 150 C 254 128, 256 108, 265 98 C 276 90, 288 89, 300 89 C 312 89, 324 90, 335 98 C 344 108, 346 128, 345 150 C 343 174, 334 196, 325 212 L 326 320 L 334 508 C 342 518, 358 520, 372 512 L 366 320 L 358 132 C 356 94, 337 70, 300 70 Z" fill="url(#hSPbMain)" />` +
    `<path d="M 244 210 L 240 495 M 356 210 L 360 495" stroke="${r.sh2}" stroke-width="1.6" opacity="0.45" />`;

  const front =
    defs('hSPf', r, 460) +
    `<path d="M 300 70 C 265 70, 246 94, 243 130 L 236 332 L 234 456 C 243 464, 253 460, 256 446 L 258 214 C 254 182, 252 142, 259 109 C 268 95, 285 90, 300 90 C 315 90, 332 95, 341 109 C 348 142, 346 182, 342 214 L 344 446 C 347 460, 357 464, 366 456 L 364 332 L 357 130 C 354 94, 335 70, 300 70 Z" fill="url(#hSPfMain)" />` +
    `<path d="M 300 70 L 300 90" stroke="${r.sh3}" stroke-width="1.8" opacity="0.7" />` +
    `<path d="M 250 130 L 246 420 M 350 130 L 354 420" stroke="url(#hSPfShine)" stroke-width="3.6" opacity="${shine ? '0.78' : '0.32'}" fill="none" filter="url(#hSPfBlur)" />`;
  return { back, front };
};

/** 10. Old Hollywood Waves — deep side-parted S-wave glamour wig (y 68–360). */
const hollywoodWaves: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hHWb', r, 370) +
    `<path d="M 300 68 C 258 68, 238 92, 236 132 C 234 176, 224 220, 232 272 C 236 312, 232 344, 246 358 C 258 362, 268 346, 272 316 L 275 212 C 266 192, 257 170, 255 148 C 254 124, 258 106, 268 96 C 280 88, 294 88, 308 90 C 324 93, 338 102, 344 120 C 348 140, 346 172, 332 204 L 326 248 L 328 318 C 334 348, 346 364, 358 358 C 374 340, 368 302, 376 266 C 384 224, 370 176, 366 132 C 362 90, 340 68, 300 68 Z" fill="url(#hHWbMain)" />`;

  const front =
    defs('hHWf', r, 350) +
    `<path d="M 294 68 C 260 68, 242 90, 238 128 C 234 166, 242 198, 234 238 C 228 270, 232 308, 244 334 C 252 338, 258 326, 256 302 C 252 268, 260 228, 256 186 C 252 152, 254 118, 268 100 C 280 92, 306 94, 324 104 C 338 112, 344 134, 344 164 C 344 202, 338 248, 344 304 C 346 326, 352 338, 360 334 C 374 306, 376 266, 368 232 C 360 194, 366 158, 362 126 C 356 88, 332 68, 294 68 Z" fill="url(#hHWfMain)" />` +
    `<path d="M 276 74 L 284 94" stroke="${r.sh3}" stroke-width="1.6" opacity="0.65" />` +
    `<path d="M 244 160 C 234 186, 248 214, 236 244 C 228 270, 242 296, 246 322 M 356 152 C 366 182, 352 212, 364 242 C 372 268, 358 294, 354 322" stroke="${r.hi2}" stroke-width="2.6" opacity="${shine ? '0.72' : '0.3'}" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 11. Body Wave Lace Front — voluminous layered blowout wig (y 66–430). */
const lacefrontBodywave: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hLBb', r, 435) +
    `<path d="M 300 66 C 256 66, 234 94, 230 136 C 226 180, 214 236, 212 296 C 210 352, 224 402, 242 426 C 256 432, 268 416, 272 384 L 275 212 C 266 196, 258 174, 255 150 C 254 128, 256 108, 265 98 C 276 90, 288 89, 300 89 C 312 89, 324 90, 335 98 C 344 108, 346 128, 345 150 C 342 174, 334 196, 325 212 L 328 384 C 332 416, 344 432, 358 426 C 376 402, 390 352, 388 296 C 386 236, 374 180, 370 136 C 366 94, 344 66, 300 66 Z" fill="url(#hLBbMain)" />` +
    `<path d="M 226 230 C 216 286, 220 356, 238 408 M 374 230 C 384 286, 380 356, 362 408" stroke="${r.sh2}" stroke-width="2.2" opacity="0.44" fill="none" />`;

  const front =
    defs('hLBf', r, 410) +
    `<path d="M 300 66 C 260 66, 238 92, 234 132 C 230 174, 220 228, 222 288 C 224 338, 234 382, 246 402 C 254 394, 258 368, 256 328 C 253 274, 258 214, 254 168 C 252 142, 253 116, 262 102 C 272 93, 286 90, 300 90 C 314 90, 328 93, 338 102 C 347 116, 348 142, 346 168 C 342 214, 347 274, 344 328 C 342 368, 346 394, 354 402 C 366 382, 376 338, 378 288 C 380 228, 370 174, 366 132 C 362 92, 340 66, 300 66 Z" fill="url(#hLBfMain)" />` +
    `<path d="M 300 66 L 300 90" stroke="${r.sh3}" stroke-width="1.6" opacity="0.7" />` +
    `<path d="M 248 122 C 234 188, 228 274, 242 372 M 352 122 C 366 188, 372 274, 358 372" stroke="url(#hLBfShine)" stroke-width="3.6" opacity="${shine ? '0.75' : '0.3'}" fill="none" filter="url(#hLBfBlur)" />`;
  return { back, front };
};

/** 12. Feathered Butterfly Layers — '90s face-framing flipped layers (y 68–335). */
const butterflyLayers: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hBLb', r, 345) +
    `<path d="M 300 68 C 260 68, 240 92, 236 132 C 232 174, 222 222, 214 274 C 210 306, 224 328, 244 334 C 258 328, 268 304, 272 268 L 275 212 C 266 194, 258 172, 255 148 C 254 126, 256 106, 265 98 C 276 90, 288 89, 300 89 C 312 89, 324 90, 335 98 C 344 106, 346 126, 345 148 C 342 172, 334 194, 325 212 L 328 268 C 332 304, 342 328, 356 334 C 376 328, 390 306, 386 274 C 378 222, 368 174, 364 132 C 360 92, 340 68, 300 68 Z" fill="url(#hBLbMain)" />`;

  const front =
    defs('hBLf', r, 310) +
    `<path d="M 300 68 C 262 68, 242 92, 238 130 C 234 166, 226 206, 224 246 C 222 276, 230 296, 244 304 C 252 292, 254 268, 252 242 C 250 202, 258 164, 254 132 C 252 110, 262 96, 282 94 C 292 92, 297 91, 300 90 C 303 91, 308 92, 318 94 C 338 96, 348 110, 346 132 C 342 164, 350 202, 348 242 C 346 268, 348 292, 356 304 C 370 296, 378 276, 376 246 C 374 206, 366 166, 362 130 C 358 92, 338 68, 300 68 Z" fill="url(#hBLfMain)" />` +
    `<path d="M 254 146 C 234 176, 234 218, 244 252 M 346 146 C 366 176, 366 218, 356 252" stroke="${r.hi2}" stroke-width="2.4" opacity="${shine ? '0.72' : '0.32'}" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 13. Blunt Glass Bob — razor-straight chin-length bob wig (y 72–230). */
const bluntGlassBob: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hBGb', r, 235) +
    `<path d="M 300 72 C 263 72, 244 94, 241 130 L 234 226 L 270 226 L 272 204 C 262 190, 256 168, 255 148 C 254 126, 256 106, 265 98 C 276 90, 288 89, 300 89 C 312 89, 324 90, 335 98 C 344 106, 346 126, 345 148 C 344 168, 338 190, 328 204 L 330 226 L 366 226 L 359 130 C 356 94, 337 72, 300 72 Z" fill="url(#hBGbDeep)" />`;

  const front =
    defs('hBGf', r, 232) +
    `<path d="M 300 72 C 264 72, 245 94, 242 130 L 235 224 L 256 224 C 254 192, 254 146, 259 109 C 268 95, 285 90, 300 90 C 315 90, 332 95, 341 109 C 346 146, 346 192, 344 224 L 365 224 L 358 130 C 355 94, 336 72, 300 72 Z" fill="url(#hBGfMain)" />` +
    `<path d="M 300 72 L 300 90" stroke="${r.sh3}" stroke-width="1.6" opacity="0.7" />` +
    `<path d="M 248 118 L 243 212 M 352 118 L 357 212" stroke="${r.hi2}" stroke-width="3.0" opacity="${shine ? '0.82' : '0.35'}" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 14. Asymmetric Chic Lob — sleek angled collarbone lob (y 72–278). */
const asymLob: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hALb', r, 285) +
    `<path d="M 300 72 C 262 72, 243 94, 240 132 L 232 238 L 268 242 L 274 206 C 264 190, 256 168, 255 146 C 254 126, 257 106, 266 98 C 278 90, 290 89, 302 89 C 314 90, 326 93, 336 102 C 344 112, 346 130, 345 150 C 343 172, 336 194, 328 212 L 330 274 L 368 278 L 360 132 C 357 94, 338 72, 300 72 Z" fill="url(#hALbDeep)" />`;

  const front =
    defs('hALf', r, 280) +
    `<path d="M 294 72 C 262 72, 244 94, 241 130 L 234 236 L 256 238 C 253 196, 254 146, 260 108 C 272 95, 294 92, 316 96 C 334 100, 342 114, 344 134 C 346 174, 345 224, 343 272 L 366 276 L 359 130 C 356 94, 332 72, 294 72 Z" fill="url(#hALfMain)" />` +
    `<path d="M 272 78 L 280 96" stroke="${r.sh3}" stroke-width="1.6" opacity="0.65" />` +
    `<path d="M 349 124 L 356 260 M 248 122 L 243 224" stroke="${r.hi2}" stroke-width="2.6" opacity="${shine ? '0.76' : '0.3'}" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 15. French Bob & Curtain Bangs — cheeky Parisienne bob with open face & wispy curtain fringe (y 70–218). */
const frenchBobBangs: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hFBb', r, 225) +
    `<path d="M 300 70 C 262 70, 242 94, 238 130 C 235 162, 236 196, 246 216 C 254 220, 264 214, 268 202 C 260 184, 256 164, 255 144 C 255 124, 257 106, 266 98 C 276 90, 288 89, 300 89 C 312 89, 324 90, 334 98 C 343 106, 345 124, 345 144 C 344 164, 340 184, 332 202 C 336 214, 346 220, 354 216 C 364 196, 365 162, 362 130 C 358 94, 338 70, 300 70 Z" fill="url(#hFBbMain)" />`;

  const front =
    defs('hFBf', r, 220) +
    `<path d="M 300 70 C 264 70, 244 92, 240 128 C 237 156, 238 188, 246 212 C 252 214, 256 206, 256 190 C 254 164, 254 134, 262 114 C 272 104, 286 98, 297 96 L 300 88 L 303 96 C 314 98, 328 104, 338 114 C 346 134, 346 164, 344 190 C 344 206, 348 214, 354 212 C 362 188, 363 156, 360 128 C 356 92, 336 70, 300 70 Z" fill="url(#hFBfMain)" />` +
    `<path d="M 294 84 C 282 96, 270 105, 259 112 M 306 84 C 318 96, 330 105, 341 112" stroke="${r.sh2}" stroke-width="1.6" opacity="0.45" fill="none" />` +
    `<path d="M 250 118 C 242 150, 244 182, 249 204 M 350 118 C 358 150, 356 182, 351 204" stroke="${r.hi2}" stroke-width="2.3" opacity="${shine ? '0.68' : '0.28'}" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 16. Waist Knotless Box Braids — flowing multi-strand braids with gold cuffs (y 74–475). */
const knotlessBoxBraids: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const backStrands = [232, 242, 252, 348, 358, 368]
    .map((x, idx) => {
      const yEnd = 450 + (idx % 2) * 24;
      return (
        `<path d="M ${x} 130 Q ${x + (x < 300 ? -8 : 8)} 290 ${x + (x < 300 ? -4 : 4)} ${yEnd}" stroke="${r.sh1}" stroke-width="8.5" stroke-linecap="round" fill="none" />` +
        `<path d="M ${x} 130 Q ${x + (x < 300 ? -8 : 8)} 290 ${x + (x < 300 ? -4 : 4)} ${yEnd}" stroke="${r.mid}" stroke-width="5.2" stroke-dasharray="6 4" stroke-linecap="round" fill="none" />`
      );
    })
    .join('');

  const back = defs('hKBb', r, 480) + openSkullBack('hKBb') + backStrands;

  const cuffs = [242, 254, 346, 358]
    .map((x, idx) => `<rect x="${x - 4.5}" y="${250 + idx * 14}" width="9" height="5" rx="2" fill="#e6c35c" />`)
    .join('');
  const front =
    defs('hKBf', r, 440) +
    sleekHairlineFront('hKBf', r, shine) +
    `<path d="M 300 76 L 300 92 M 280 78 L 274 96 M 320 78 L 326 96" stroke="${r.sh3}" stroke-width="1.4" opacity="0.7" />` +
    braidTail(252, -1, 'hKBf', r, shine) +
    braidTail(348, 1, 'hKBf', r, shine) +
    cuffs;
  return { back, front };
};

/** 17. Fulani Tribal Braids — cornrow crown with beaded side braids (y 74–390). */
const fulaniBraids: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hFUb', r, 400) +
    openSkullBack('hFUb') +
    `<path d="M 250 156 Q 238 260 236 378" stroke="${r.sh1}" stroke-width="9" stroke-linecap="round" fill="none" />` +
    `<path d="M 350 156 Q 362 260 364 378" stroke="${r.sh1}" stroke-width="9" stroke-linecap="round" fill="none" />`;

  const beads = [246, 354]
    .flatMap((x) => [350, 360].map((y) => `<circle cx="${x}" cy="${y}" r="4.2" fill="#d9a441" stroke="${r.sh3}" stroke-width="0.8" />`))
    .join('');
  const front =
    defs('hFUf', r, 385) +
    sleekHairlineFront('hFUf', r, shine) +
    `<path d="M 272 80 C 266 90, 260 100, 256 112 M 286 77 C 282 86, 278 96, 275 104 M 300 76 L 300 92 M 314 77 C 318 86, 322 96, 325 104 M 328 80 C 334 90, 340 100, 344 112" stroke="${r.sh3}" stroke-width="2" opacity="0.72" fill="none" stroke-linecap="round" />` +
    braidTail(250, -1, 'hFUf', r, shine) +
    braidTail(350, 1, 'hFUf', r, shine) +
    beads;
  return { back, front };
};

/** 18. Goddess Boho Locs — textured locs with curly bohemian wisps (y 70–450). */
const goddessLocs: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const locs = [234, 245, 256, 344, 355, 366]
    .map((x, idx) => {
      const yEnd = 415 + (idx % 3) * 18;
      return (
        `<path d="M ${x} 126 C ${x - 8} 210, ${x + 6} 310, ${x - 3} ${yEnd}" stroke="${r.sh2}" stroke-width="8" stroke-linecap="round" fill="none" />` +
        `<path d="M ${x} 126 C ${x - 8} 210, ${x + 6} 310, ${x - 3} ${yEnd}" stroke="${r.mid}" stroke-width="4.5" stroke-dasharray="4 5" stroke-linecap="round" fill="none" />` +
        `<path d="M ${x - 3} ${yEnd - 12} C ${x - 12} ${yEnd + 2}, ${x + 8} ${yEnd + 14}, ${x - 4} ${yEnd + 26}" stroke="${r.hi1}" stroke-width="2.4" fill="none" stroke-linecap="round" />`
      );
    })
    .join('');

  const back = defs('hGLb', r, 455) + openSkullBack('hGLb') + locs;
  const front =
    defs('hGLf', r, 380) +
    sleekHairlineFront('hGLf', r, shine) +
    `<path d="M 248 158 C 232 200, 248 250, 236 300 C 228 334, 244 358, 238 386" stroke="${r.hi1}" stroke-width="2.6" fill="none" stroke-linecap="round" />` +
    `<path d="M 352 158 C 368 200, 352 250, 364 300 C 372 334, 356 358, 362 386" stroke="${r.hi1}" stroke-width="2.6" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 19. Royal Shuku Crown Braids — architectural Nigerian woven crown updo (y 38–180). */
const shukuBraids: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hSKb', r, 210) +
    openSkullBack('hSKb') +
    `<path d="M 300 38 C 276 38, 266 56, 269 74 C 272 84, 286 88, 300 88 C 314 88, 328 84, 331 74 C 334 56, 324 38, 300 38 Z" fill="url(#hSKbCrown)" />` +
    `<path d="M 274 62 C 288 54, 312 54, 326 62 M 272 72 C 288 64, 312 64, 328 72" stroke="${r.sh2}" stroke-width="2.2" opacity="0.62" fill="none" />`;

  const front =
    defs('hSKf', r, 180) +
    sleekHairlineFront('hSKf', r, shine) +
    `<path d="M 264 102 C 274 84, 286 68, 294 46 M 278 96 C 286 80, 294 64, 298 44 M 336 102 C 326 84, 314 68, 306 46 M 322 96 C 314 80, 306 64, 302 44" stroke="${r.sh2}" stroke-width="2.0" opacity="0.58" fill="none" stroke-linecap="round" />` +
    `<circle cx="300" cy="40" r="4" fill="#e6c35c" />`;
  return { back, front };
};

/** 20. Springy Passion Twists — bohemian rope twists to shoulders (y 68–330). */
const passionTwists: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const coils = [234, 245, 355, 366]
    .map((x, idx) => `<path d="M ${x} 118 C ${x - 10} 165, ${x + 10} 215, ${x - 8} 265 C ${x + 8} 295, ${x - 4} 315, ${x} ${318 + (idx % 2) * 16}" stroke="${r.mid}" stroke-width="9" stroke-linecap="round" fill="none" />`)
    .join('');

  const back = defs('hPTwb', r, 340) + openSkullBack('hPTwb') + coils;
  const front =
    defs('hPTwf', r, 320) +
    sleekHairlineFront('hPTwf', r, shine) +
    `<path d="M 300 76 L 300 92" stroke="${r.sh3}" stroke-width="1.6" opacity="0.65" />` +
    `<path d="M 248 128 C 236 172, 250 218, 238 264 C 232 288, 244 306, 240 318" stroke="${r.hi1}" stroke-width="3.2" fill="none" stroke-linecap="round" />` +
    `<path d="M 352 128 C 364 172, 350 218, 362 264 C 368 288, 356 306, 360 318" stroke="${r.hi1}" stroke-width="3.2" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 21. Pineapple Puff Updo — high coiled crown puff (y 32–165). */
const pineappleCurls: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hPPb', r, 200) +
    openSkullBack('hPPb') +
    `<path d="M 300 32 C 278 30, 260 40, 252 54 C 244 64, 248 80, 262 84 C 276 86, 324 86, 338 84 C 352 80, 356 64, 348 54 C 340 40, 322 30, 300 32 Z" fill="url(#hPPbCrown)" />` +
    `<path d="M 262 56 C 272 44, 290 42, 300 50 C 310 42, 328 44, 338 56" stroke="${r.hi2}" stroke-width="2.4" opacity="${shine ? '0.68' : '0.3'}" fill="none" stroke-linecap="round" />`;

  const front =
    defs('hPPf', r, 160) +
    sleekHairlineFront('hPPf', r, shine) +
    `<path d="M 260 72 C 276 84, 324 84, 340 72" stroke="#d48c9c" stroke-width="3.5" fill="none" stroke-linecap="round" />` +
    `<path d="M 272 48 C 282 40, 296 42, 302 52 M 328 48 C 318 40, 304 42, 298 52" stroke="${r.sh2}" stroke-width="2" opacity="0.55" fill="none" />`;
  return { back, front };
};

/** 22. Defined Wash & Go Curls — long lush cascading spiral ringlets (y 62–355). */
const washGoRinglets: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hWGb', r, 360) +
    `<path d="M 300 62 C 266 60, 240 80, 232 114 C 222 146, 224 188, 218 228 C 212 268, 222 316, 240 348 C 254 352, 266 336, 270 302 L 275 212 C 264 192, 256 168, 255 144 C 254 122, 257 104, 266 96 C 276 90, 288 89, 300 89 C 312 89, 324 90, 334 96 C 343 104, 346 122, 345 144 C 344 168, 336 192, 325 212 L 330 302 C 334 336, 346 352, 360 348 C 378 316, 388 268, 382 228 C 376 188, 378 146, 368 114 C 360 80, 334 60, 300 62 Z" fill="url(#hWGbMain)" />`;

  const front =
    defs('hWGf', r, 340) +
    `<path d="M 300 62 C 268 62, 244 82, 236 116 C 230 148, 234 192, 228 242 C 224 278, 234 316, 248 332 C 256 322, 258 292, 254 252 C 250 202, 254 148, 260 112 C 268 96, 286 92, 300 92 C 314 92, 332 96, 340 112 C 346 148, 350 202, 346 252 C 342 292, 344 322, 352 332 C 366 316, 376 278, 372 242 C 366 192, 370 148, 364 116 C 356 82, 332 62, 300 62 Z" fill="url(#hWGfMain)" />` +
    `<path d="M 244 134 C 232 154, 248 176, 234 198 C 224 220, 244 246, 236 278 M 356 134 C 368 154, 352 176, 366 198 C 376 220, 356 246, 364 278" stroke="${r.hi2}" stroke-width="2.4" opacity="${shine ? '0.68' : '0.3'}" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 23. 1920s Sculpted Finger Waves — glossy flapper S-waves (y 73–190). */
const fingerWaves: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back = defs('hFWb', r, 200) + openSkullBack('hFWb');
  const front =
    defs('hFWf', r, 195) +
    sleekHairlineFront('hFWf', r, shine) +
    `<path d="M 254 112 C 246 124, 254 136, 248 150 C 244 162, 254 172, 252 184" stroke="${r.mid}" stroke-width="4.5" fill="none" stroke-linecap="round" />` +
    `<path d="M 346 112 C 354 124, 346 136, 352 150 C 356 162, 346 172, 348 184" stroke="${r.mid}" stroke-width="4.5" fill="none" stroke-linecap="round" />` +
    `<path d="M 264 96 C 276 86, 294 86, 308 92 C 320 86, 332 92, 338 102" stroke="${r.hi2}" stroke-width="2.4" opacity="${shine ? '0.8' : '0.35'}" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 24. Playful Space Buns — double high top-knots with face-framing tendrils (y 46–205). */
const twinSpaceBuns: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hSBub', r, 210) +
    openSkullBack('hSBub') +
    `<circle cx="262" cy="64" r="20" fill="url(#hSBubCrown)" />` +
    `<circle cx="338" cy="64" r="20" fill="url(#hSBubCrown)" />` +
    `<path d="M 250 58 C 258 48, 270 48, 274 58 M 326 58 C 330 48, 342 48, 350 58" stroke="${r.hi2}" stroke-width="2.2" opacity="${shine ? '0.7' : '0.32'}" fill="none" stroke-linecap="round" />`;

  const front =
    defs('hSBuf', r, 200) +
    sleekHairlineFront('hSBuf', r, shine) +
    `<path d="M 300 76 L 300 92" stroke="${r.sh3}" stroke-width="1.6" opacity="0.65" />` +
    `<path d="M 254 126 C 248 150, 248 176, 254 198 M 346 126 C 352 150, 352 176, 346 198" stroke="${r.mid}" stroke-width="3.4" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 25. Half-Up Ribbon Cascade — half-up crown puff with cascading waves (y 58–390). */
const halfUpCascade: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hHUb', r, 395) +
    `<path d="M 300 56 C 280 56, 270 68, 272 80 C 260 88, 246 106, 242 138 C 236 184, 224 236, 228 296 C 232 344, 240 374, 250 388 C 260 390, 268 370, 272 332 L 275 212 C 266 192, 258 170, 255 148 C 254 126, 257 106, 266 96 C 276 90, 288 89, 300 89 C 312 89, 324 90, 334 96 C 343 106, 346 126, 345 148 C 342 170, 334 192, 325 212 L 328 332 C 332 370, 340 390, 350 388 C 360 374, 368 344, 372 296 C 376 236, 364 184, 358 138 C 354 106, 340 88, 328 80 C 330 68, 320 56, 300 56 Z" fill="url(#hHUbMain)" />`;

  const front =
    defs('hHUf', r, 350) +
    sleekHairlineFront('hHUf', r, shine) +
    `<path d="M 284 82 Q 300 86 316 82" stroke="#d88a9e" stroke-width="4" fill="none" stroke-linecap="round" />` +
    `<path d="M 250 144 C 236 202, 244 266, 244 338 M 350 144 C 364 202, 356 266, 356 338" stroke="${r.hi2}" stroke-width="2.4" opacity="${shine ? '0.68' : '0.3'}" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 26. Sleek Braided Genie Ponytail — snatched crown with floor-sweeping braided tail (y 58–420). */
const braidedGeniePony: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hBPb', r, 430) +
    openSkullBack('hBPb') +
    `<path d="M 302 64 C 336 52, 368 78, 376 126 C 384 184, 382 280, 372 414 C 366 422, 358 418, 356 402 C 358 282, 358 186, 348 128 C 340 94, 324 76, 302 74 Z" fill="url(#hBPbMain)" />` +
    `<path d="M 362 126 C 374 206, 370 300, 364 402" stroke="${r.sh3}" stroke-width="4.5" stroke-dasharray="7 6" fill="none" stroke-linecap="round" />`;

  const front =
    defs('hBPf', r, 180) +
    sleekHairlineFront('hBPf', r, shine) +
    `<path d="M 294 74 C 300 68, 310 68, 314 75" stroke="${r.hi2}" stroke-width="2" opacity="0.7" fill="none" />`;
  return { back, front };
};

/** 27. Architectural High Topknot — sculpted editorial pillar bun (y 38–180). */
const architecturalTopknot: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hATb', r, 190) +
    openSkullBack('hATb') +
    `<path d="M 300 38 C 282 38, 276 52, 278 72 L 282 82 L 318 82 L 322 72 C 324 52, 318 38, 300 38 Z" fill="url(#hATbCrown)" />` +
    `<path d="M 282 58 C 294 50, 308 50, 318 58 M 280 68 C 294 61, 308 61, 320 68" stroke="${r.hi2}" stroke-width="2.2" opacity="${shine ? '0.68' : '0.3'}" fill="none" />`;

  const front =
    defs('hATf', r, 175) +
    sleekHairlineFront('hATf', r, shine) +
    `<path d="M 268 100 C 282 88, 294 82, 300 78 C 306 82, 318 88, 332 100" stroke="${r.sh2}" stroke-width="1.4" opacity="0.45" fill="none" />`;
  return { back, front };
};

/** 28. Parisian Low Chignon — softly parted low nape knot (y 74–218). */
const parisianLowChignon: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hLCb', r, 225) +
    openSkullBack('hLCb') +
    `<ellipse cx="300" cy="204" rx="22" ry="13" fill="url(#hLCbDeep)" />` +
    `<path d="M 282 204 C 292 196, 308 196, 318 204" stroke="${r.hi1}" stroke-width="1.8" opacity="0.55" fill="none" />`;

  const front =
    defs('hLCf', r, 190) +
    sleekHairlineFront('hLCf', r, shine) +
    `<path d="M 300 76 L 300 92" stroke="${r.sh3}" stroke-width="1.6" opacity="0.7" />` +
    `<path d="M 255 126 C 252 146, 253 164, 258 178 M 345 126 C 348 146, 347 164, 342 178" stroke="${r.mid}" stroke-width="2.6" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 29. Runway Wet-Look Slick — slicked-back high-gloss editorial mane (y 72–365). */
const wetLookSlick: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hWLb', r, 370) +
    `<path d="M 300 72 C 266 72, 248 94, 245 130 L 240 246 L 236 356 C 248 364, 260 360, 268 346 L 274 240 L 275 212 C 266 194, 257 172, 255 148 C 254 126, 256 108, 265 98 C 276 90, 288 89, 300 89 C 312 89, 324 90, 335 98 C 344 108, 346 126, 345 148 C 343 172, 334 194, 325 212 L 326 240 L 332 346 C 340 360, 352 364, 364 356 L 360 246 L 355 130 C 352 94, 334 72, 300 72 Z" fill="url(#hWLbDeep)" />` +
    `<path d="M 248 212 L 244 338 M 352 212 L 356 338" stroke="${r.hi2}" stroke-width="3.2" opacity="${shine ? '0.88' : '0.45'}" fill="none" filter="url(#hWLbBlur)" />`;

  const front =
    defs('hWLf', r, 195) +
    sleekHairlineFront('hWLf', r, true) +
    `<path d="M 264 84 C 280 76, 320 76, 336 84 M 256 102 C 272 90, 328 90, 344 102" stroke="${r.hi2}" stroke-width="2.6" opacity="0.82" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

/** 30. Tapered Curly Fade — sculpted curly top with tapered sides (y 58–170). */
const taperedCurlyFade: StyleFn = (color, p) => {
  const r = hairRamp(color);
  const shine = p.shine ?? true;
  const back =
    defs('hTCb', r, 180) +
    `<path d="M 300 58 C 274 58, 256 72, 250 96 C 246 116, 248 136, 254 152 L 258 148 C 254 132, 255 112, 264 98 C 274 90, 288 89, 300 89 C 312 89, 326 90, 336 98 C 345 112, 346 132, 342 148 L 346 152 C 352 136, 354 116, 350 96 C 344 72, 326 58, 300 58 Z" fill="url(#hTCbDeep)" />`;

  const front =
    defs('hTCf', r, 165) +
    `<path d="M 300 58 C 276 58, 258 72, 252 94 C 248 108, 250 122, 255 128 C 258 116, 265 104, 276 96 C 288 92, 312 92, 324 96 C 335 104, 342 116, 345 128 C 350 122, 352 108, 348 94 C 342 72, 324 58, 300 58 Z" fill="url(#hTCfCrown)" />` +
    `<path d="M 270 76 C 280 68, 294 68, 300 76 C 306 68, 320 68, 330 76" stroke="${r.hi2}" stroke-width="2.2" opacity="${shine ? '0.68' : '0.3'}" fill="none" stroke-linecap="round" />`;
  return { back, front };
};

export const HAIR_STYLE_GENERATORS_EXTRA: Record<string, StyleFn> = {
  placeholder_hair_silk_press: silkPress,
  placeholder_hair_hollywood_waves: hollywoodWaves,
  placeholder_hair_lacefront_bodywave: lacefrontBodywave,
  placeholder_hair_butterfly_layers: butterflyLayers,
  placeholder_hair_blunt_glass_bob: bluntGlassBob,
  placeholder_hair_asym_lob: asymLob,
  placeholder_hair_french_bob_bangs: frenchBobBangs,
  placeholder_hair_knotless_box_braids: knotlessBoxBraids,
  placeholder_hair_fulani_braids: fulaniBraids,
  placeholder_hair_goddess_locs: goddessLocs,
  placeholder_hair_shuku_braids: shukuBraids,
  placeholder_hair_passion_twists: passionTwists,
  placeholder_hair_pineapple_curls: pineappleCurls,
  placeholder_hair_wash_go_ringlets: washGoRinglets,
  placeholder_hair_finger_waves: fingerWaves,
  placeholder_hair_twin_space_buns: twinSpaceBuns,
  placeholder_hair_half_up_cascade: halfUpCascade,
  placeholder_hair_braided_genie_pony: braidedGeniePony,
  placeholder_hair_architectural_topknot: architecturalTopknot,
  placeholder_hair_parisian_low_chignon: parisianLowChignon,
  placeholder_hair_wet_look_slick: wetLookSlick,
  placeholder_hair_tapered_curly_fade: taperedCurlyFade,
};
