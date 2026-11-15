import type { AssetParams } from './params';
import { shade, toUri } from './primitives';
import type { PoseId, SkinTone } from '@/game/types';

/*
 * Base figure: stylized-vector illustration of the adult curvy hourglass model
 * on the shared 600×1280 canvas, split into the pipeline's body / skin / face
 * layers. Skin tone is applied by deriving the gradient ramps from the selected
 * tone so shading, undertones and highlights are preserved across the inclusive
 * tone range (AGENT.md §6 skin tones).
 */

const FALLBACK_TONE: SkinTone = { id: 'honey', name: 'Honey', base: '#e3b491', shadow: '#bd8e6c' };

interface Ramp {
  light: string;
  mid: string;
  mid2: string;
  dark: string;
  deep: string;
}

function ramp(tone: SkinTone): Ramp {
  const base = tone.base;
  return {
    light: shade(base, 0.3),
    mid: base,
    mid2: shade(base, -0.1),
    dark: shade(base, -0.26),
    deep: shade(base, -0.42),
  };
}

const BLUR_FILTERS = `
    <filter id="softBlur2" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="1280">
      <feGaussianBlur stdDeviation="2.2" />
    </filter>
    <filter id="softBlur4" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="1280">
      <feGaussianBlur stdDeviation="4.5" />
    </filter>
    <filter id="softBlur8" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="1280">
      <feGaussianBlur stdDeviation="8.5" />
    </filter>
    <filter id="softBlur12" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="1280">
      <feGaussianBlur stdDeviation="12" />
    </filter>`;

function skinDefs(r: Ramp): string {
  return `
    ${BLUR_FILTERS}
    <linearGradient id="skinTorsoGrad" x1="15%" y1="12%" x2="88%" y2="85%">
      <stop offset="0%" stop-color="${r.light}" />
      <stop offset="34%" stop-color="${r.mid}" />
      <stop offset="70%" stop-color="${r.mid2}" />
      <stop offset="100%" stop-color="${r.dark}" />
    </linearGradient>
    <linearGradient id="skinNeckGrad" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="${r.dark}" />
      <stop offset="30%" stop-color="${r.mid}" />
      <stop offset="72%" stop-color="${r.light}" />
      <stop offset="100%" stop-color="${r.dark}" />
    </linearGradient>
    <linearGradient id="skinArmLeftGrad" x1="0%" y1="10%" x2="100%" y2="78%">
      <stop offset="0%" stop-color="${r.light}" />
      <stop offset="46%" stop-color="${r.mid}" />
      <stop offset="100%" stop-color="${r.dark}" />
    </linearGradient>
    <linearGradient id="skinArmRightGrad" x1="0%" y1="20%" x2="100%" y2="68%">
      <stop offset="0%" stop-color="${r.dark}" />
      <stop offset="36%" stop-color="${r.mid}" />
      <stop offset="80%" stop-color="${r.light}" />
      <stop offset="100%" stop-color="${r.mid2}" />
    </linearGradient>
    <linearGradient id="skinLegLeftGrad" x1="10%" y1="14%" x2="94%" y2="56%">
      <stop offset="0%" stop-color="${r.light}" />
      <stop offset="42%" stop-color="${r.mid}" />
      <stop offset="84%" stop-color="${r.mid2}" />
      <stop offset="100%" stop-color="${r.dark}" />
    </linearGradient>
    <linearGradient id="skinLegRightGrad" x1="6%" y1="20%" x2="92%" y2="65%">
      <stop offset="0%" stop-color="${r.dark}" />
      <stop offset="28%" stop-color="${r.mid2}" />
      <stop offset="68%" stop-color="${r.mid}" />
      <stop offset="100%" stop-color="${r.light}" />
    </linearGradient>
    <radialGradient id="skinSpecular" cx="42%" cy="38%" r="58%">
      <stop offset="0%" stop-color="${r.light}" stop-opacity="0.88" />
      <stop offset="55%" stop-color="${r.light}" stop-opacity="0.30" />
      <stop offset="100%" stop-color="${r.light}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="bustLeftVol" cx="38%" cy="35%" r="62%">
      <stop offset="0%" stop-color="${r.light}" stop-opacity="0.92" />
      <stop offset="48%" stop-color="${r.mid}" stop-opacity="0.52" />
      <stop offset="85%" stop-color="${r.dark}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="${r.deep}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="bustRightVol" cx="42%" cy="35%" r="62%">
      <stop offset="0%" stop-color="${r.light}" stop-opacity="0.72" />
      <stop offset="48%" stop-color="${r.mid}" stop-opacity="0.46" />
      <stop offset="86%" stop-color="${r.dark}" stop-opacity="0.28" />
      <stop offset="100%" stop-color="${r.deep}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="warmSubsurfaceGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D97B6C" stop-opacity="0.26" />
      <stop offset="100%" stop-color="#D97B6C" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="rimLightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFE6B8" stop-opacity="0.48" />
      <stop offset="100%" stop-color="#FFE6B8" stop-opacity="0" />
    </linearGradient>`;
}

/* ---------- Arm pose variants (left arm authored per pose; right stays relaxed) ---------- */

const ARM_RELAXED_LEFT = `M 224 270
  C 196 276, 178 306, 171 346
  C 164 388, 158 424, 161 452
  C 164 484, 168 522, 171 556
  C 169 570, 162 588, 163 608
  C 164 624, 170 635, 175 636
  C 179 636, 181 627, 181 615
  C 183 627, 186 637, 190 637
  C 194 636, 195 624, 194 611
  C 197 619, 200 624, 204 622
  C 207 619, 204 604, 199 590
  C 197 580, 200 573, 199 563
  C 198 555, 194 551, 193 544
  C 196 510, 201 474, 200 440
  C 199 406, 207 366, 219 326 Z`;

const ARM_HAND_ON_HIP_LEFT = `M 226 268
  C 202 276, 182 304, 170 340
  C 160 372, 154 398, 158 420
  C 162 442, 176 472, 192 502
  C 200 518, 208 538, 212 552
  C 214 560, 220 562, 224 558
  C 228 552, 226 542, 222 532
  C 214 508, 204 480, 192 452
  C 186 436, 184 416, 190 392
  C 198 356, 210 314, 224 282
  C 228 274, 230 266, 226 268 Z`;

const ARM_TWIRL_LEFT = `M 228 268
  C 216 246, 204 216, 196 186
  C 188 158, 184 132, 186 112
  C 188 96, 196 88, 206 90
  C 214 92, 218 102, 218 118
  C 219 142, 224 172, 232 202
  C 238 224, 244 246, 248 262
  C 250 270, 242 274, 228 268 Z`;

const ARM_BY_POSE: Record<PoseId, string> = {
  relaxed: ARM_RELAXED_LEFT,
  handOnHip: ARM_HAND_ON_HIP_LEFT,
  twirl: ARM_TWIRL_LEFT,
};

const ARM_RELAXED_RIGHT = `M 376 270
  C 404 276, 422 306, 429 346
  C 436 388, 442 424, 439 452
  C 436 484, 432 522, 429 556
  C 431 570, 438 588, 437 608
  C 436 624, 430 635, 425 636
  C 421 636, 419 627, 419 615
  C 417 627, 414 637, 410 637
  C 406 636, 405 624, 406 611
  C 403 619, 400 624, 396 622
  C 393 619, 396 604, 401 590
  C 403 580, 400 573, 401 563
  C 402 555, 406 551, 407 544
  C 404 510, 399 474, 400 440
  C 401 406, 393 366, 381 326 Z`;

const LEG_LEFT = `M 186 623
  C 186 664, 184 714, 195 768
  C 206 820, 215 868, 222 906
  C 223 919, 220 937, 217 963
  C 212 1005, 215 1053, 228 1099
  C 235 1127, 237 1147, 236 1165
  C 233 1181, 223 1199, 220 1213
  C 219 1222, 222 1228, 228 1229
  C 231 1233, 236 1235, 241 1233
  C 244 1236, 250 1237, 254 1234
  C 258 1237, 265 1237, 270 1233
  C 275 1235, 281 1231, 280 1220
  C 278 1203, 270 1185, 267 1165
  C 266 1147, 271 1121, 278 1089
  C 286 1051, 288 1005, 281 959
  C 277 935, 275 919, 277 903
  C 284 855, 294 795, 298 731
  C 300 701, 300 683, 300 669
  L 218 600 Z`;

const LEG_RIGHT = `M 414 623
  C 414 664, 416 714, 405 768
  C 394 820, 385 868, 378 906
  C 377 919, 380 937, 384 963
  C 389 1005, 386 1053, 373 1099
  C 366 1127, 364 1147, 365 1165
  C 368 1181, 379 1199, 383 1213
  C 384 1222, 381 1228, 375 1229
  C 372 1233, 367 1235, 362 1233
  C 359 1236, 353 1237, 349 1234
  C 345 1237, 338 1237, 333 1233
  C 327 1235, 321 1231, 323 1220
  C 325 1203, 333 1185, 336 1165
  C 337 1147, 332 1121, 325 1089
  C 317 1051, 315 1005, 322 959
  C 326 935, 328 919, 326 903
  C 319 855, 308 795, 302 731
  C 300 701, 300 683, 300 669
  L 382 600 Z`;

const TORSO = `M 277 192
  C 278 218, 275 240, 260 253
  C 242 266, 211 268, 196 282
  L 219 330
  C 218 355, 209 376, 213 398
  C 217 418, 234 438, 241 464
  C 246 481, 245 497, 238 514
  C 223 546, 188 575, 186 623
  C 185 643, 191 659, 200 673
  C 230 655, 271 673, 300 677
  C 329 673, 370 655, 400 673
  C 409 659, 415 643, 414 623
  C 412 575, 377 546, 362 514
  C 355 497, 354 481, 359 464
  C 366 438, 383 418, 387 398
  C 391 376, 382 355, 381 330
  L 404 282
  C 389 268, 358 266, 340 253
  C 325 240, 322 218, 323 192 Z`;

const TORSO_CLIP = `M 277 192
  C 278 218, 275 240, 260 253
  C 242 266, 211 268, 196 282
  L 219 330
  C 218 355, 209 376, 213 398
  C 217 418, 234 438, 241 464
  C 246 481, 245 497, 238 514
  C 223 546, 186 575, 186 623
  C 186 643, 191 659, 200 673
  C 230 655, 271 673, 300 677
  C 329 673, 370 655, 400 673
  C 409 659, 414 643, 414 623
  C 414 575, 377 546, 362 514
  C 355 497, 354 481, 359 464
  C 366 438, 383 418, 387 398
  C 391 376, 382 355, 381 330
  L 404 282
  C 389 268, 358 266, 340 253
  C 325 240, 322 218, 323 192 Z`;

const LEGS_CLIP = `M 186 623
  C 186 664, 184 714, 195 768
  C 206 820, 215 868, 222 906
  C 223 919, 220 937, 217 963
  C 212 1005, 215 1053, 228 1099
  C 235 1127, 237 1147, 236 1165
  C 233 1181, 223 1199, 220 1213
  C 219 1222, 222 1228, 228 1229
  C 231 1233, 236 1235, 241 1233
  C 244 1236, 250 1237, 254 1234
  C 258 1237, 265 1237, 270 1233
  C 275 1235, 281 1231, 280 1220
  C 278 1203, 270 1185, 267 1165
  C 266 1147, 271 1121, 278 1089
  C 286 1051, 288 1005, 281 959
  C 277 935, 275 919, 277 903
  C 284 855, 294 795, 298 731
  C 300 701, 300 683, 300 669
  L 382 600 L 218 600 Z`;

const FACE_OVAL = `M 300 84
  C 272 84, 254 105, 254 134
  C 254 158, 260 179, 274 193
  C 285 204, 293 208, 300 208
  C 307 208, 315 204, 326 193
  C 340 179, 346 158, 346 134
  C 346 105, 328 84, 300 84 Z`;

export function bodyAsset(p: AssetParams): string {
  const tone = p.skinTone ?? FALLBACK_TONE;
  const r = ramp(tone);
  const armLeft = ARM_BY_POSE[p.pose ?? 'relaxed'];

  return toUri(`
    <defs>${skinDefs(r)}
      <clipPath id="torsoClip"><path d="${TORSO_CLIP}" /></clipPath>
      <clipPath id="legsClip"><path d="${LEGS_CLIP}" /></clipPath>
    </defs>

    <g id="arms-and-hands">
      <path d="${armLeft}" fill="url(#skinArmLeftGrad)" />
      <path d="M 180 312 C 172 350, 168 394, 171 434 C 177 400, 182 354, 188 314 Z" fill="url(#skinSpecular)" opacity="0.62" filter="url(#softBlur4)" />
      <path d="M 193 366 C 195 408, 193 446, 190 496 C 194 498, 198 472, 200 438 C 201 406, 199 376, 193 366 Z" fill="${r.dark}" opacity="0.38" filter="url(#softBlur4)" />
      <path d="M 180 598 C 180 612, 180 624, 181 632" stroke="${r.deep}" stroke-width="1.0" opacity="0.40" stroke-linecap="round" />
      <path d="M 190 596 C 192 610, 193 622, 193 630" stroke="${r.deep}" stroke-width="0.95" opacity="0.38" stroke-linecap="round" />
      <ellipse cx="175" cy="631" rx="1.5" ry="2.4" fill="#FBE8E2" opacity="0.68" />
      <ellipse cx="189" cy="632" rx="1.4" ry="2.2" fill="#FBE8E2" opacity="0.62" />
      <path d="${ARM_RELAXED_RIGHT}" fill="url(#skinArmRightGrad)" />
      <path d="M 420 314 C 427 354, 431 398, 428 438 C 423 404, 419 357, 413 316 Z" fill="url(#skinSpecular)" opacity="0.42" filter="url(#softBlur4)" />
      <path d="M 405 354 C 401 400, 401 448, 406 506 C 400 492, 397 460, 398 436 C 398 404, 399 374, 405 354 Z" fill="${r.dark}" opacity="0.42" filter="url(#softBlur4)" />
      <path d="M 420 598 C 420 612, 420 624, 419 632" stroke="${r.deep}" stroke-width="1.0" opacity="0.42" stroke-linecap="round" />
      <path d="M 410 596 C 408 610, 407 622, 407 630" stroke="${r.deep}" stroke-width="0.95" opacity="0.40" stroke-linecap="round" />
      <ellipse cx="425" cy="631" rx="1.5" ry="2.4" fill="#FBE8E2" opacity="0.58" />
      <ellipse cx="411" cy="632" rx="1.4" ry="2.2" fill="#FBE8E2" opacity="0.56" />
    </g>

    <g id="legs-and-feet">
      <path d="${LEG_LEFT}" fill="url(#skinLegLeftGrad)" />
      <path d="${LEG_RIGHT}" fill="url(#skinLegRightGrad)" />
      <g clip-path="url(#legsClip)">
        <path d="M 299 671 C 292 736, 283 801, 274 869 C 283 836, 294 777, 300 716 C 306 777, 317 836, 326 869 C 317 801, 308 736, 301 671 Z" fill="${r.deep}" opacity="0.38" filter="url(#softBlur4)" />
        <path d="M 202 654 C 194 712, 202 780, 222 846 C 232 796, 230 722, 222 654 Z" fill="url(#skinSpecular)" opacity="0.68" filter="url(#softBlur8)" />
        <path d="M 389 658 C 397 716, 389 782, 370 846 C 360 796, 362 724, 370 658 Z" fill="url(#skinSpecular)" opacity="0.46" filter="url(#softBlur8)" />
        <ellipse cx="249" cy="908" rx="14" ry="19" fill="url(#skinSpecular)" opacity="0.62" filter="url(#softBlur4)" />
        <ellipse cx="351" cy="910" rx="13" ry="18" fill="url(#skinSpecular)" opacity="0.48" filter="url(#softBlur4)" />
        <path d="M 237 922 C 245 928, 256 928, 263 921" stroke="${r.mid}" stroke-width="2.2" opacity="0.34" filter="url(#softBlur2)" fill="none" />
        <path d="M 338 924 C 346 930, 357 930, 364 923" stroke="${r.mid}" stroke-width="2.2" opacity="0.38" filter="url(#softBlur2)" fill="none" />
        <ellipse cx="250" cy="908" rx="18" ry="20" fill="url(#warmSubsurfaceGlow)" />
        <ellipse cx="351" cy="910" rx="18" ry="20" fill="url(#warmSubsurfaceGlow)" />
        <path d="M 239 955 C 236 1015, 240 1075, 246 1138 C 253 1075, 254 1015, 250 955 Z" fill="url(#skinSpecular)" opacity="0.60" filter="url(#softBlur4)" />
        <path d="M 353 957 C 356 1017, 352 1077, 346 1140 C 340 1077, 339 1017, 343 957 Z" fill="url(#skinSpecular)" opacity="0.42" filter="url(#softBlur4)" />
        <path d="M 272 956 C 282 1006, 281 1062, 266 1126 C 261 1072, 264 1008, 272 956 Z" fill="${r.dark}" opacity="0.34" filter="url(#softBlur4)" />
        <path d="M 328 956 C 318 1006, 319 1062, 334 1126 C 339 1072, 336 1008, 328 956 Z" fill="${r.dark}" opacity="0.38" filter="url(#softBlur4)" />
      </g>
      <g id="feet-and-toes">
        <ellipse cx="242" cy="1156" rx="5" ry="7" fill="${r.light}" opacity="0.52" filter="url(#softBlur2)" />
        <ellipse cx="359" cy="1156" rx="5" ry="7" fill="${r.light}" opacity="0.45" filter="url(#softBlur2)" />
        <path d="M 250 1152 C 248 1175, 244 1196, 241 1212" stroke="${r.light}" stroke-width="2.4" opacity="0.40" filter="url(#softBlur2)" fill="none" />
        <path d="M 351 1152 C 353 1175, 357 1196, 360 1212" stroke="${r.light}" stroke-width="2.4" opacity="0.36" filter="url(#softBlur2)" fill="none" />
        <path d="M 267 1215 C 266 1222, 266 1228, 267 1233" stroke="${r.deep}" stroke-width="1.1" opacity="0.42" stroke-linecap="round" />
        <path d="M 255 1217 C 254 1223, 254 1229, 255 1234" stroke="${r.deep}" stroke-width="1.0" opacity="0.40" stroke-linecap="round" />
        <path d="M 243 1218 C 242 1224, 241 1229, 242 1233" stroke="${r.deep}" stroke-width="0.95" opacity="0.38" stroke-linecap="round" />
        <path d="M 232 1218 C 231 1223, 230 1227, 231 1230" stroke="${r.deep}" stroke-width="0.9" opacity="0.36" stroke-linecap="round" />
        <ellipse cx="274" cy="1226" rx="3.4" ry="2.2" fill="#FCEBE6" opacity="0.72" />
        <ellipse cx="262" cy="1230" rx="2.1" ry="1.6" fill="#FCEBE6" opacity="0.65" />
        <ellipse cx="250" cy="1231" rx="1.9" ry="1.5" fill="#FCEBE6" opacity="0.60" />
        <ellipse cx="238" cy="1230" rx="1.7" ry="1.3" fill="#FCEBE6" opacity="0.55" />
        <ellipse cx="227" cy="1226" rx="1.4" ry="1.1" fill="#FCEBE6" opacity="0.50" />
        <path d="M 335 1215 C 336 1222, 336 1228, 335 1233" stroke="${r.deep}" stroke-width="1.1" opacity="0.44" stroke-linecap="round" />
        <path d="M 347 1217 C 348 1223, 348 1229, 347 1234" stroke="${r.deep}" stroke-width="1.0" opacity="0.42" stroke-linecap="round" />
        <path d="M 359 1218 C 360 1224, 361 1229, 360 1233" stroke="${r.deep}" stroke-width="0.95" opacity="0.40" stroke-linecap="round" />
        <path d="M 370 1218 C 371 1223, 372 1227, 371 1230" stroke="${r.deep}" stroke-width="0.9" opacity="0.38" stroke-linecap="round" />
        <ellipse cx="328" cy="1226" rx="3.4" ry="2.2" fill="#FCEBE6" opacity="0.65" />
        <ellipse cx="340" cy="1230" rx="2.1" ry="1.6" fill="#FCEBE6" opacity="0.60" />
        <ellipse cx="352" cy="1231" rx="1.9" ry="1.5" fill="#FCEBE6" opacity="0.55" />
        <ellipse cx="364" cy="1230" rx="1.7" ry="1.3" fill="#FCEBE6" opacity="0.50" />
        <ellipse cx="375" cy="1226" rx="1.4" ry="1.1" fill="#FCEBE6" opacity="0.45" />
      </g>
    </g>

    <g id="torso-and-neck">
      <path d="${TORSO}" fill="url(#skinTorsoGrad)" />
      <g clip-path="url(#torsoClip)">
        <path d="M 278 198 C 282 226, 281 244, 272 256 C 288 262, 312 262, 328 256 C 319 244, 318 226, 322 198 Z" fill="url(#skinNeckGrad)" opacity="0.64" />
        <path d="M 276 196 C 286 213, 314 213, 324 196 C 320 213, 311 226, 300 227 C 289 226, 280 213, 276 196 Z" fill="${r.deep}" opacity="0.44" filter="url(#softBlur4)" />
        <path d="M 284 218 C 289 238, 294 256, 298 268" stroke="${r.light}" stroke-width="2.1" opacity="0.42" filter="url(#softBlur2)" fill="none" />
        <path d="M 316 218 C 311 238, 306 256, 302 268" stroke="${r.dark}" stroke-width="2.1" opacity="0.38" filter="url(#softBlur2)" fill="none" />
        <ellipse cx="300" cy="272" rx="7" ry="4.5" fill="${r.dark}" opacity="0.40" filter="url(#softBlur2)" />
        <path d="M 292 273 C 272 272, 246 266, 224 270" stroke="${r.light}" stroke-width="3.0" opacity="0.58" filter="url(#softBlur2)" fill="none" stroke-linecap="round" />
        <path d="M 290 276 C 270 277, 248 271, 228 274" stroke="${r.dark}" stroke-width="2.3" opacity="0.32" filter="url(#softBlur2)" fill="none" stroke-linecap="round" />
        <path d="M 308 273 C 328 272, 354 266, 376 270" stroke="${r.light}" stroke-width="3.0" opacity="0.48" filter="url(#softBlur2)" fill="none" stroke-linecap="round" />
        <path d="M 310 276 C 330 277, 352 271, 372 274" stroke="${r.dark}" stroke-width="2.3" opacity="0.34" filter="url(#softBlur2)" fill="none" stroke-linecap="round" />
        <ellipse cx="211" cy="288" rx="18" ry="12" fill="url(#skinSpecular)" opacity="0.68" filter="url(#softBlur4)" transform="rotate(-18 211 288)" />
        <ellipse cx="389" cy="288" rx="16" ry="11" fill="url(#skinSpecular)" opacity="0.42" filter="url(#softBlur4)" transform="rotate(18 389 288)" />
        <ellipse cx="255" cy="382" rx="42" ry="44" fill="url(#bustLeftVol)" />
        <ellipse cx="345" cy="382" rx="42" ry="44" fill="url(#bustRightVol)" />
        <path d="M 296 346 C 301 372, 301 398, 299 415 C 303 398, 304 372, 296 346 Z" fill="${r.deep}" opacity="0.45" filter="url(#softBlur2)" />
        <path d="M 222 414 C 246 433, 277 431, 296 416 C 280 425, 249 426, 222 414 Z" fill="${r.deep}" opacity="0.36" filter="url(#softBlur4)" />
        <path d="M 378 414 C 354 433, 323 431, 304 416 C 320 425, 351 426, 378 414 Z" fill="${r.deep}" opacity="0.40" filter="url(#softBlur4)" />
        <path d="M 240 448 C 247 476, 246 504, 237 530 C 248 506, 255 478, 252 448 Z" fill="url(#skinSpecular)" opacity="0.54" filter="url(#softBlur8)" />
        <path d="M 360 448 C 353 476, 354 504, 363 530 C 373 504, 371 474, 360 448 Z" fill="${r.dark}" opacity="0.34" filter="url(#softBlur8)" />
        <path d="M 300 428 C 299 462, 299 488, 300 512" stroke="${r.dark}" stroke-width="3.2" opacity="0.22" filter="url(#softBlur4)" fill="none" />
        <path d="M 277 458 C 279 482, 276 508, 270 532" stroke="${r.light}" stroke-width="8" opacity="0.30" filter="url(#softBlur8)" fill="none" />
        <path d="M 323 458 C 321 482, 324 508, 330 532" stroke="${r.dark}" stroke-width="7" opacity="0.18" filter="url(#softBlur8)" fill="none" />
        <ellipse cx="300" cy="521" rx="3.2" ry="5.2" fill="${r.deep}" opacity="0.50" filter="url(#softBlur2)" />
        <path d="M 297.5 517.5 C 299 515.5, 301 515.5, 302.5 517.5" stroke="${r.dark}" stroke-width="1.2" opacity="0.58" fill="none" stroke-linecap="round" />
        <path d="M 297.5 526 C 299 527.5, 301 527.5, 302.5 526" stroke="${r.light}" stroke-width="1.3" opacity="0.55" fill="none" stroke-linecap="round" />
        <path d="M 206 560 C 194 584, 192 618, 200 648 C 210 620, 213 586, 218 560 Z" fill="url(#skinSpecular)" opacity="0.68" filter="url(#softBlur8)" />
        <ellipse cx="256" cy="575" rx="28" ry="22" fill="url(#skinSpecular)" opacity="0.42" filter="url(#softBlur8)" />
        <ellipse cx="348" cy="582" rx="28" ry="24" fill="${r.dark}" opacity="0.20" filter="url(#softBlur8)" />
        <ellipse cx="206" cy="590" rx="22" ry="30" fill="url(#warmSubsurfaceGlow)" />
        <ellipse cx="394" cy="590" rx="22" ry="30" fill="url(#warmSubsurfaceGlow)" />
        <path d="M 198 282 C 183 305, 175 338, 170 372" stroke="url(#rimLightGrad)" stroke-width="2.2" fill="none" stroke-linecap="round" filter="url(#softBlur2)" />
        <path d="M 200 568 C 188 596, 186 630, 192 662" stroke="url(#rimLightGrad)" stroke-width="2.4" fill="none" stroke-linecap="round" filter="url(#softBlur2)" />
      </g>
    </g>

    <g id="head-base">
      <path d="M 255 137 C 247 136, 245 148, 248 158 C 250 165, 255 167, 259 164 Z" fill="${r.dark}" />
      <path d="M 345 137 C 353 136, 355 148, 352 158 C 350 165, 345 167, 341 164 Z" fill="${r.dark}" />
      <path d="${FACE_OVAL}" fill="url(#skinTorsoGrad)" />
      <ellipse cx="294" cy="108" rx="22" ry="12" fill="url(#skinSpecular)" opacity="0.62" filter="url(#softBlur4)" />
      <ellipse cx="272" cy="146" rx="9" ry="4.2" fill="${r.light}" opacity="0.44" filter="url(#softBlur2)" transform="rotate(-12 272 146)" />
      <ellipse cx="328" cy="146" rx="9" ry="4.2" fill="${r.light}" opacity="0.30" filter="url(#softBlur2)" transform="rotate(12 328 146)" />
      <path d="M 339 135 C 340 162, 331 184, 308 202 C 325 190, 342 168, 345 135 Z" fill="${r.dark}" opacity="0.34" filter="url(#softBlur4)" />
      <ellipse cx="300" cy="197" rx="8" ry="4.5" fill="${r.light}" opacity="0.42" filter="url(#softBlur2)" />
    </g>`);
}

/** Face features layer: brows, eyes, sculpted nose, sculpted lips, natural blush. */
export function faceAsset(p: AssetParams): string {
  const tone = p.skinTone ?? FALLBACK_TONE;
  const r = ramp(tone);
  const iris = p.iris ?? '#4A2E1B';

  const freckles = p.freckles
    ? `<g fill="${r.deep}" opacity="0.5">` +
      [
        [265, 148],
        [272, 156],
        [279, 150],
        [286, 157],
        [293, 152],
        [307, 152],
        [314, 157],
        [321, 150],
        [328, 156],
        [335, 148],
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2"/>`)
        .join('') +
      `</g>`
    : '';

  const beautyMark = p.beautyMark ? `<circle cx="312" cy="184" r="1.6" fill="${r.deep}" opacity="0.85"/>` : '';

  return toUri(`
    <defs>${BLUR_FILTERS}
      <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#D97B6C" stop-opacity="0.38" />
        <stop offset="65%" stop-color="#D97B6C" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#D97B6C" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="irisGradFace" cx="45%" cy="42%" r="55%">
        <stop offset="0%" stop-color="${shade(iris, 0.3)}" />
        <stop offset="52%" stop-color="${iris}" />
        <stop offset="88%" stop-color="${shade(iris, -0.45)}" />
        <stop offset="100%" stop-color="${shade(iris, -0.6)}" />
      </radialGradient>
      <linearGradient id="lipUpperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${shade(tone.base, -0.52)}" />
        <stop offset="65%" stop-color="${shade(tone.base, -0.34)}" />
        <stop offset="100%" stop-color="${shade(tone.base, -0.52)}" />
      </linearGradient>
      <linearGradient id="lipLowerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${shade(tone.base, -0.34)}" />
        <stop offset="45%" stop-color="${shade(tone.base, -0.1)}" />
        <stop offset="100%" stop-color="${shade(tone.base, -0.52)}" />
      </linearGradient>
    </defs>

    <ellipse cx="273" cy="153" rx="14" ry="10" fill="url(#cheekBlush)" />
    <ellipse cx="327" cy="153" rx="14" ry="10" fill="url(#cheekBlush)" />

    <g id="nose">
      <path d="M 297 131 C 296 143, 296 154, 295 161 C 298 164, 302 164, 305 161 C 304 154, 304 143, 303 131 Z" fill="url(#skinSpecular)" opacity="0.54" filter="url(#softBlur2)" />
      <path d="M 303 134 C 306 146, 307 156, 305 162 C 303 165, 299 166, 295 163" stroke="${r.dark}" stroke-width="1.8" opacity="0.34" filter="url(#softBlur2)" fill="none" stroke-linecap="round" />
      <ellipse cx="294.5" cy="162.5" rx="2.1" ry="1.2" fill="${r.deep}" opacity="0.36" />
      <ellipse cx="305.5" cy="162.5" rx="2.1" ry="1.2" fill="${r.deep}" opacity="0.38" />
      <ellipse cx="299.5" cy="160.2" rx="2.6" ry="2.0" fill="${r.light}" opacity="0.62" />
    </g>

    <g id="eyes-and-brows">
      <path d="M 267 125 C 274 119, 284 119, 292 124 C 284 122, 275 122, 267 125 Z" fill="${shade(tone.base, -0.55)}" opacity="0.82" />
      <path d="M 333 125 C 326 119, 316 119, 308 124 C 316 122, 325 122, 333 125 Z" fill="${shade(tone.base, -0.55)}" opacity="0.82" />
      <path d="M 271 131 C 277 127, 286 128, 291 132" stroke="${r.dark}" stroke-width="1.2" opacity="0.48" fill="none" stroke-linecap="round" />
      <path d="M 329 131 C 323 127, 314 128, 309 132" stroke="${r.dark}" stroke-width="1.2" opacity="0.48" fill="none" stroke-linecap="round" />
      <path d="M 271 136 C 276 131, 285 131, 290 136 C 285 139.6, 276 139.6, 271 136 Z" fill="#F8F5F2" />
      <circle cx="280.8" cy="135.5" r="4.0" fill="url(#irisGradFace)" />
      <circle cx="280.8" cy="135.5" r="1.9" fill="#110906" />
      <circle cx="279.6" cy="134.2" r="1.05" fill="#FFFFFF" opacity="0.95" />
      <path d="M 269.5 135.5 C 275 130.5, 285 130.5, 290.5 136" stroke="#1E130E" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <path d="M 272 138 C 277 140, 284 140, 289 137.5" stroke="${r.dark}" stroke-width="0.9" opacity="0.48" fill="none" />
      <path d="M 310 136 C 315 131, 324 131, 329 136 C 324 139.6, 315 139.6, 310 136 Z" fill="#F8F5F2" />
      <circle cx="319.2" cy="135.5" r="4.0" fill="url(#irisGradFace)" />
      <circle cx="319.2" cy="135.5" r="1.9" fill="#110906" />
      <circle cx="318.0" cy="134.2" r="1.05" fill="#FFFFFF" opacity="0.95" />
      <path d="M 309.5 136 C 315 130.5, 325 130.5, 330.5 135.5" stroke="#1E130E" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <path d="M 311 137.5 C 316 140, 323 140, 328 138" stroke="${r.dark}" stroke-width="0.9" opacity="0.48" fill="none" />
    </g>

    <g id="lips">
      <path d="M 298 166 L 298 174 M 302 166 L 302 174" stroke="${r.light}" stroke-width="1.0" opacity="0.35" />
      <path d="M 285 178 C 290 174, 295 173, 300 175.5 C 305 173, 310 174, 315 178 C 309 179.5, 304 179.5, 300 179 C 296 179.5, 291 179.5, 285 178 Z" fill="url(#lipUpperGrad)" />
      <path d="M 286 178.5 C 293 179.5, 307 179.5, 314 178.5 C 311 186, 305 188.5, 300 188.5 C 295 188.5, 289 186, 286 178.5 Z" fill="url(#lipLowerGrad)" />
      <path d="M 286 178.4 C 293 179.6, 307 179.6, 314 178.4" stroke="${shade(tone.base, -0.52)}" stroke-width="1.0" opacity="0.72" fill="none" stroke-linecap="round" />
      <path d="M 293 190.5 C 297 192.5, 303 192.5, 307 190.5" stroke="${r.dark}" stroke-width="1.8" opacity="0.34" filter="url(#softBlur2)" fill="none" />
      <ellipse cx="299" cy="183.5" rx="5.0" ry="1.3" fill="#FFFFFF" opacity="0.52" filter="url(#softBlur2)" />
    </g>

    ${freckles}
    ${beautyMark}`);
}

/** Skin state layer: concerns fade and glow builds as steps complete (§5.2). */
export function skinAsset(p: AssetParams): string {
  const tone = p.skinTone ?? FALLBACK_TONE;
  const r = ramp(tone);
  const glow = p.glow ?? 0;
  const c = p.concerns ?? { blemishes: true, dryness: true, darkCircles: true, oiliness: true };
  const parts: string[] = [];

  if (c.blemishes) {
    // Clean, non-graphic: soft flat spots that visibly shrink when treated (§5.2, §10).
    parts.push(
      `<g fill="${r.dark}" opacity="0.42">` +
        `<circle cx="272" cy="149" r="3.4" />` +
        `<circle cx="327" cy="147" r="3.0" />` +
        `<circle cx="299" cy="169" r="2.6" />` +
        `</g>`,
    );
  }
  if (c.darkCircles) {
    parts.push(
      `<g stroke="${r.deep}" stroke-width="2.4" fill="none" opacity="0.28" stroke-linecap="round" filter="url(#softBlur2)">` +
        `<path d="M 272 141 C 277 145, 285 145, 290 141" />` +
        `<path d="M 310 141 C 315 145, 323 145, 328 141" />` +
        `</g>`,
    );
  }
  if (c.dryness) {
    parts.push(
      `<g fill="#ffffff" opacity="0.12">` +
        `<ellipse cx="268" cy="156" rx="12" ry="7" />` +
        `<ellipse cx="332" cy="156" rx="12" ry="7" />` +
        `<ellipse cx="300" cy="100" rx="20" ry="9" />` +
        `</g>`,
    );
  }
  if (c.oiliness) {
    parts.push(
      `<g fill="#ffffff" opacity="0.2">` +
        `<ellipse cx="300" cy="102" rx="17" ry="8" />` +
        `<ellipse cx="300" cy="152" rx="7" ry="5" />` +
        `</g>`,
    );
  }

  const glowOpacity = 0.05 + glow * 0.04;
  parts.push(
    `<g fill="#ffffff">` +
      `<ellipse cx="272" cy="150" rx="20" ry="8" opacity="${glowOpacity.toFixed(3)}" />` +
      `<ellipse cx="328" cy="150" rx="20" ry="8" opacity="${glowOpacity.toFixed(3)}" />` +
      `<ellipse cx="211" cy="288" rx="26" ry="9" opacity="${(glowOpacity * 0.8).toFixed(3)}" />` +
      `<ellipse cx="389" cy="288" rx="26" ry="9" opacity="${(glowOpacity * 0.8).toFixed(3)}" />` +
      `<ellipse cx="300" cy="273" rx="40" ry="6" opacity="${(glowOpacity * 0.5).toFixed(3)}" />` +
      `<ellipse cx="255" cy="390" rx="26" ry="26" opacity="${(glowOpacity * 0.4).toFixed(3)}" />` +
      `<ellipse cx="345" cy="390" rx="26" ry="26" opacity="${(glowOpacity * 0.4).toFixed(3)}" />` +
      `</g>`,
  );

  return toUri(`
    <defs>${BLUR_FILTERS}</defs>
    ${parts.join('')}`);
}
