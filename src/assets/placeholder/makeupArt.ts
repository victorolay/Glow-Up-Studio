import type { AssetParams } from './params';
import { shade, toUri } from './primitives';

/*
 * Hyper-realistic layered SVG makeup art calibrated to figure.ts on the
 * shared 600×1280 canvas:
 *   Face oval: x ∈ [254, 346], y ∈ [84, 208]
 *   Brows:     left (267..292, y≈119..125), right (308..333, y≈119..125)
 *   Eyes:      left (269.5..290.5, y≈130.5..139.6), right (309.5..330.5, y≈130.5..139.6)
 *   Cheeks:    apples (273/327, 153), cheekbones (266/334, 145)
 *   Nose:      bridge (300, 131..160), tip (300, 160)
 *   Lips:      upper (285..315, y≈173..179), lower (286..314, y≈178..188.5)
 */

export type FoundationStyle =
  | 'natural'
  | 'sheer'
  | 'satin'
  | 'matte'
  | 'dewy'
  | 'luminous'
  | 'softFocus'
  | 'fullCoverage';

export type ConcealerStyle =
  | 'natural'
  | 'brightening'
  | 'correcting'
  | 'lifted'
  | 'radiant'
  | 'fullCover';

export type BlushStyle =
  | 'classic'
  | 'draped'
  | 'sunkissed'
  | 'sculpted'
  | 'igari'
  | 'ombre'
  | 'dewy'
  | 'matteVelvet';

export type EyeshadowStyle =
  | 'softWash'
  | 'smokey'
  | 'cutCrease'
  | 'halo'
  | 'sunsetOmbre'
  | 'siren'
  | 'shimmerFoil'
  | 'editorialGraphic'
  | 'monochrome'
  | 'wetGloss';

export type EyeshadowFinish = 'matte' | 'satin' | 'shimmer' | 'metallic' | 'glitter' | 'gloss';

export type EyelinerStyle =
  | 'tightline'
  | 'thin'
  | 'classic'
  | 'winged'
  | 'bold'
  | 'foxEye'
  | 'siren'
  | 'catEye'
  | 'doubleWing'
  | 'floatingCrease'
  | 'puppy'
  | 'smudged'
  | 'reverse'
  | 'editorial';

export type MascaraStyle =
  | 'natural'
  | 'lengthening'
  | 'volumizing'
  | 'wispy'
  | 'catEye'
  | 'doll'
  | 'mega'
  | 'bottomAccent';

export type LipstickStyle =
  | 'matte'
  | 'velvet'
  | 'satin'
  | 'gloss'
  | 'lacquer'
  | 'vinyl'
  | 'stain'
  | 'ombre'
  | 'metallic'
  | 'shimmer'
  | 'balm';

export type BrowStyle =
  | 'natural'
  | 'feathered'
  | 'laminated'
  | 'sculpted'
  | 'arched'
  | 'straight'
  | 'ombre'
  | 'bleached';

export type ContourStyle = 'soft' | 'sculpted' | 'snatched' | 'noseFocus' | 'bronze' | 'editorial';

export type HighlighterStyle = 'natural' | 'glassSkin' | 'champagne' | 'strobe' | 'candlelight' | 'editorial';

export type EditorialAccentStyle =
  | 'none'
  | 'pearls'
  | 'crystals'
  | 'celestial'
  | 'goldLeaf'
  | 'underEyeDots'
  | 'innerDiamond'
  | 'sirenGems';

export type MakeupParams = AssetParams & {
  style?: string;
  color3?: string;
  foundationStyle?: FoundationStyle;
  concealerStyle?: ConcealerStyle;
  blushStyle?: BlushStyle;
  eyeshadowStyle?: EyeshadowStyle;
  mascaraStyle?: MascaraStyle;
  lipStyle?: LipstickStyle;
  browStyle?: BrowStyle;
  contourStyle?: ContourStyle;
  highlighterStyle?: HighlighterStyle;
  editorialStyle?: EditorialAccentStyle;
};

const FALLBACK_TONE = { id: 'honey', name: 'Honey', base: '#e3b491', shadow: '#bd8e6c' };

const FACE_OVAL_PATH =
  'M 300 84 C 272 84, 254 105, 254 134 C 254 158, 260 179, 274 193 ' +
  'C 285 204, 293 208, 300 208 C 307 208, 315 204, 326 193 ' +
  'C 340 179, 346 158, 346 134 C 346 105, 328 84, 300 84 Z';

const NECK_BLEND_PATH =
  'M 277 192 C 278 214, 276 232, 266 246 C 284 252, 316 252, 334 246 ' +
  'C 324 232, 322 214, 323 192 Z';

const UPPER_LIP_PATH =
  'M 284.7 177.9 C 289.5 173.6, 294.8 172.7, 300 175.3 ' +
  'C 305.2 172.7, 310.5 173.6, 315.3 177.9 C 309.4 179.4, 304.2 179.4, 300 178.9 ' +
  'C 295.8 179.4, 290.6 179.4, 284.7 177.9 Z';

const LOWER_LIP_PATH =
  'M 285.4 178.2 C 292.6 179.4, 307.4 179.4, 314.6 178.2 ' +
  'C 311.5 186.1, 305.3 189.1, 300 189.1 C 294.7 189.1, 288.5 186.1, 285.4 178.2 Z';

const FULL_LIP_CLIP_PATH =
  'M 284.5 177.9 C 289.5 173.5, 294.8 172.6, 300 175.2 ' +
  'C 305.2 172.6, 310.5 173.5, 315.5 177.9 C 312.2 186.2, 305.6 189.2, 300 189.2 ' +
  'C 294.4 189.2, 287.8 186.2, 284.5 177.9 Z';

function clamp(v: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, Number.isFinite(v) ? v : max));
}

function n(v: number): string {
  return v.toFixed(2);
}

function op(v: number): string {
  return clamp(v).toFixed(3);
}

function readParam(p: MakeupParams, key: keyof MakeupParams): string | undefined {
  const val = (p as Record<string, unknown>)[key as string];
  return typeof val === 'string' && val.length > 0 ? val : undefined;
}

function faceBlurDefs(prefix: string): string {
  return (
    `<filter id="${prefix}-b06" filterUnits="userSpaceOnUse" x="235" y="75" width="130" height="190"><feGaussianBlur stdDeviation="0.65"/></filter>` +
    `<filter id="${prefix}-b13" filterUnits="userSpaceOnUse" x="235" y="75" width="130" height="190"><feGaussianBlur stdDeviation="1.3"/></filter>` +
    `<filter id="${prefix}-b24" filterUnits="userSpaceOnUse" x="235" y="75" width="130" height="190"><feGaussianBlur stdDeviation="2.4"/></filter>` +
    `<filter id="${prefix}-b42" filterUnits="userSpaceOnUse" x="235" y="75" width="130" height="190"><feGaussianBlur stdDeviation="4.2"/></filter>` +
    `<filter id="${prefix}-b60" filterUnits="userSpaceOnUse" x="235" y="75" width="130" height="190"><feGaussianBlur stdDeviation="6.0"/></filter>`
  );
}

/* ============================================================================
 * 1. FOUNDATION
 * ========================================================================== */

export function foundationAsset(p: MakeupParams): string {
  const tone = p.skinTone ?? FALLBACK_TONE;
  const intensity = clamp(p.intensity ?? 0.85, 0.1, 1);
  const style = (readParam(p, 'foundationStyle') ?? readParam(p, 'style') ?? readParam(p, 'finish') ?? 'satin') as FoundationStyle;

  const baseTone = p.color ? p.color : shade(tone.base, 0.04);
  const highlightTone = shade(baseTone, 0.24);
  const warmPerimeter = shade(baseTone, -0.2);

  const coverageMap: Record<FoundationStyle, number> = {
    sheer: 0.24,
    natural: 0.34,
    satin: 0.42,
    dewy: 0.38,
    luminous: 0.4,
    softFocus: 0.48,
    matte: 0.52,
    fullCoverage: 0.62,
  };
  const cov = (coverageMap[style] ?? 0.42) * intensity;
  const isDewy = style === 'dewy' || style === 'luminous';
  const isMatte = style === 'matte' || style === 'softFocus';

  return toUri(
    `<defs>` +
    faceBlurDefs('mu-fd') +
    `<clipPath id="mu-fd-face"><path d="${FACE_OVAL_PATH}"/></clipPath>` +
    `<radialGradient id="mu-fd-veil" cx="50%" cy="46%" r="54%">` +
    `<stop offset="0%" stop-color="${baseTone}" stop-opacity="${op(cov * 0.95)}"/>` +
    `<stop offset="72%" stop-color="${baseTone}" stop-opacity="${op(cov * 0.72)}"/>` +
    `<stop offset="100%" stop-color="${warmPerimeter}" stop-opacity="${op(cov * 0.22)}"/>` +
    `</radialGradient>` +
    `<linearGradient id="mu-fd-neck" x1="0%" y1="0%" x2="0%" y2="100%">` +
    `<stop offset="0%" stop-color="${baseTone}" stop-opacity="${op(cov * 0.55)}"/>` +
    `<stop offset="100%" stop-color="${baseTone}" stop-opacity="0"/>` +
    `</linearGradient>` +
    `<radialGradient id="mu-fd-center-glow" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="${highlightTone}" stop-opacity="${op(isMatte ? cov * 0.24 : cov * 0.46)}"/>` +
    `<stop offset="100%" stop-color="${highlightTone}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `</defs>` +
    `<path d="${NECK_BLEND_PATH}" fill="url(#mu-fd-neck)" filter="url(#mu-fd-b24)"/>` +
    `<g clip-path="url(#mu-fd-face)">` +
    `<path d="${FACE_OVAL_PATH}" fill="url(#mu-fd-veil)"/>` +
    `<ellipse cx="300" cy="107" rx="22" ry="12" fill="url(#mu-fd-center-glow)" filter="url(#mu-fd-b24)"/>` +
    `<ellipse cx="277" cy="149" rx="14" ry="11" fill="url(#mu-fd-center-glow)" filter="url(#mu-fd-b24)"/>` +
    `<ellipse cx="323" cy="149" rx="14" ry="11" fill="url(#mu-fd-center-glow)" filter="url(#mu-fd-b24)"/>` +
    `<ellipse cx="300" cy="195" rx="11" ry="7" fill="url(#mu-fd-center-glow)" filter="url(#mu-fd-b24)"/>` +
    `<path d="M 256 122 C 254 148, 259 175, 274 192 C 266 173, 262 148, 262 122 Z" fill="${warmPerimeter}" opacity="${op(cov * 0.36)}" filter="url(#mu-fd-b42)"/>` +
    `<path d="M 344 122 C 346 148, 341 175, 326 192 C 334 173, 338 148, 338 122 Z" fill="${warmPerimeter}" opacity="${op(cov * 0.36)}" filter="url(#mu-fd-b42)"/>` +
    (isDewy
      ? `<g fill="#ffffff" filter="url(#mu-fd-b13)">` +
      `<ellipse cx="295" cy="107" rx="14" ry="4.5" opacity="${op(0.14 * intensity)}"/>` +
      `<ellipse cx="270" cy="146" rx="7.5" ry="2.8" transform="rotate(-14 270 146)" opacity="${op(0.16 * intensity)}"/>` +
      `<ellipse cx="330" cy="146" rx="7.5" ry="2.8" transform="rotate(14 330 146)" opacity="${op(0.14 * intensity)}"/>` +
      `<ellipse cx="300" cy="147" rx="1.6" ry="11" opacity="${op(0.15 * intensity)}"/>` +
      `</g>`
      : '') +
    (isMatte
      ? `<ellipse cx="300" cy="145" rx="28" ry="38" fill="${baseTone}" opacity="${op(0.14 * intensity)}" filter="url(#mu-fd-b42)"/>`
      : '') +
    `</g>`,
  );
}

/* ============================================================================
 * 2. CONCEALER
 * ========================================================================== */

export function concealerAsset(p: MakeupParams): string {
  const tone = p.skinTone ?? FALLBACK_TONE;
  const intensity = clamp(p.intensity ?? 0.9, 0.1, 1);
  const style = (readParam(p, 'concealerStyle') ?? readParam(p, 'style') ?? 'brightening') as ConcealerStyle;

  const liftStrength = style === 'brightening' || style === 'lifted' ? 0.34 : style === 'radiant' ? 0.28 : 0.22;
  const concealerTone = p.color ? p.color : shade(tone.base, liftStrength);
  const peachCorrector = shade('#e8997a', -0.05);
  const cov = (style === 'fullCover' ? 0.68 : style === 'natural' ? 0.42 : 0.56) * intensity;

  const triangle = (dir: -1 | 1) => {
    const inner = 300 + dir * 10;
    const mid = 300 + dir * 19.5;
    const outer = 300 + dir * 30.5;
    const liftOuter = 300 + dir * 34;
    return (
      `<path d="M ${n(inner)} 139.2 C ${n(mid)} 141.5, ${n(outer)} 140.2, ${n(liftOuter)} 136.5 ` +
      `C ${n(outer)} 145, ${n(mid + dir * 2)} 151.5, ${n(mid - dir * 1)} 152.5 ` +
      `C ${n(inner + dir * 2)} 149, ${n(inner)} 144, ${n(inner)} 139.2 Z" ` +
      `fill="url(#mu-cc-tri)" filter="url(#mu-cc-b24)"/>`
    );
  };

  return toUri(
    `<defs>` +
    faceBlurDefs('mu-cc') +
    `<clipPath id="mu-cc-face"><path d="${FACE_OVAL_PATH}"/></clipPath>` +
    `<radialGradient id="mu-cc-tri" cx="50%" cy="35%" r="65%">` +
    `<stop offset="0%" stop-color="${concealerTone}" stop-opacity="${op(cov)}"/>` +
    `<stop offset="70%" stop-color="${concealerTone}" stop-opacity="${op(cov * 0.52)}"/>` +
    `<stop offset="100%" stop-color="${concealerTone}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `</defs>` +
    `<g clip-path="url(#mu-cc-face)">` +
    (style === 'correcting' || style === 'fullCover' || style === 'brightening'
      ? `<g stroke="${peachCorrector}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="${op(cov * 0.42)}" filter="url(#mu-cc-b13)">` +
      `<path d="M 272 141.2 C 277 144.6, 285 144.6, 290 140.8"/>` +
      `<path d="M 328 141.2 C 323 144.6, 315 144.6, 310 140.8"/>` +
      `</g>`
      : '') +
    triangle(-1) +
    triangle(1) +
    `<ellipse cx="290" cy="138" rx="3.4" ry="2.2" fill="${concealerTone}" opacity="${op(cov * 0.55)}" filter="url(#mu-cc-b13)"/>` +
    `<ellipse cx="310" cy="138" rx="3.4" ry="2.2" fill="${concealerTone}" opacity="${op(cov * 0.55)}" filter="url(#mu-cc-b13)"/>` +
    (style === 'lifted' || style === 'brightening' || style === 'radiant'
      ? `<ellipse cx="300" cy="112" rx="11" ry="6" fill="${concealerTone}" opacity="${op(cov * 0.34)}" filter="url(#mu-cc-b24)"/>` +
      `<path d="M 299 131 L 301 131 L 301.4 159 L 298.6 159 Z" fill="${concealerTone}" opacity="${op(cov * 0.32)}" filter="url(#mu-cc-b13)"/>` +
      `<ellipse cx="300" cy="195.5" rx="6.5" ry="3.8" fill="${concealerTone}" opacity="${op(cov * 0.36)}" filter="url(#mu-cc-b24)"/>`
      : '') +
    (style === 'lifted'
      ? `<path d="M 270 137.5 L 261 132.5 L 263 135.8 L 270.5 140 Z" fill="${concealerTone}" opacity="${op(cov * 0.48)}" filter="url(#mu-cc-b13)"/>` +
      `<path d="M 330 137.5 L 339 132.5 L 337 135.8 L 329.5 140 Z" fill="${concealerTone}" opacity="${op(cov * 0.48)}" filter="url(#mu-cc-b13)"/>`
      : '') +
    `<circle cx="272" cy="149" r="4.2" fill="${concealerTone}" opacity="${op(cov * 0.44)}" filter="url(#mu-cc-b13)"/>` +
    `<circle cx="327" cy="147" r="4.0" fill="${concealerTone}" opacity="${op(cov * 0.44)}" filter="url(#mu-cc-b13)"/>` +
    `<circle cx="299" cy="169" r="3.6" fill="${concealerTone}" opacity="${op(cov * 0.4)}" filter="url(#mu-cc-b13)"/>` +
    `</g>`,
  );
}

/* ============================================================================
 * 3. BLUSH
 * ========================================================================== */

export function blushAsset(p: MakeupParams): string {
  const primary = p.color ?? '#df7888';
  const secondary = p.color2 ?? shade(primary, 0.22);
  const intensity = clamp(p.intensity ?? 0.85, 0.1, 1);
  const style = (readParam(p, 'blushStyle') ?? readParam(p, 'style') ?? 'classic') as BlushStyle;

  const core = shade(primary, -0.1);
  const halo = shade(primary, 0.18);
  const alpha = 0.34 + 0.48 * intensity;

  const cheekPair = (renderSide: (dir: -1 | 1) => string) => renderSide(-1) + renderSide(1);

  let artwork = '';
  if (style === 'draped') {
    artwork = cheekPair((dir) => {
      const cx = 300 + dir * 31;
      const tx = 300 + dir * 41;
      return (
        `<path d="M ${n(300 + dir * 21)} 155 C ${n(cx)} 148, ${n(tx)} 137, ${n(tx - dir * 3)} 123 ` +
        `C ${n(tx + dir * 3)} 129, ${n(tx + dir * 4)} 145, ${n(cx + dir * 4)} 158 ` +
        `C ${n(300 + dir * 25)} 162, ${n(300 + dir * 20)} 159, ${n(300 + dir * 21)} 155 Z" ` +
        `fill="${primary}" opacity="${op(alpha * 0.72)}" filter="url(#mu-bl-b42)"/>` +
        `<ellipse cx="${n(300 + dir * 32)}" cy="143" rx="9" ry="5.5" transform="rotate(${dir * -38} ${n(300 + dir * 32)} 143)" ` +
        `fill="${core}" opacity="${op(alpha * 0.56)}" filter="url(#mu-bl-b24)"/>`
      );
    });
  } else if (style === 'sunkissed') {
    artwork =
      cheekPair((dir) => {
        const cx = 300 + dir * 25;
        return (
          `<ellipse cx="${n(cx)}" cy="151.5" rx="14.5" ry="8.5" transform="rotate(${dir * -8} ${n(cx)} 151.5)" ` +
          `fill="${halo}" opacity="${op(alpha * 0.65)}" filter="url(#mu-bl-b42)"/>` +
          `<ellipse cx="${n(cx - dir * 1.5)}" cy="151.5" rx="8.5" ry="5" fill="${primary}" opacity="${op(alpha * 0.68)}" filter="url(#mu-bl-b24)"/>`
        );
      }) +
      `<ellipse cx="300" cy="148.5" rx="9" ry="4.2" fill="${primary}" opacity="${op(alpha * 0.44)}" filter="url(#mu-bl-b24)"/>`;
  } else if (style === 'sculpted') {
    artwork = cheekPair((dir) => {
      const cx = 300 + dir * 30;
      return (
        `<ellipse cx="${n(cx)}" cy="149" rx="15" ry="6.2" transform="rotate(${dir * -26} ${n(cx)} 149)" ` +
        `fill="${halo}" opacity="${op(alpha * 0.68)}" filter="url(#mu-bl-b42)"/>` +
        `<ellipse cx="${n(cx + dir * 2)}" cy="147.5" rx="10" ry="3.8" transform="rotate(${dir * -26} ${n(cx + dir * 2)} 147.5)" ` +
        `fill="${core}" opacity="${op(alpha * 0.66)}" filter="url(#mu-bl-b24)"/>`
      );
    });
  } else if (style === 'igari') {
    artwork = cheekPair((dir) => {
      const cx = 300 + dir * 21.5;
      return (
        `<ellipse cx="${n(cx)}" cy="146.5" rx="12" ry="6.5" fill="${halo}" opacity="${op(alpha * 0.72)}" filter="url(#mu-bl-b42)"/>` +
        `<ellipse cx="${n(cx)}" cy="146" rx="7.5" ry="4.2" fill="${primary}" opacity="${op(alpha * 0.76)}" filter="url(#mu-bl-b24)"/>`
      );
    });
  } else if (style === 'ombre') {
    artwork = cheekPair((dir) => {
      const cx = 300 + dir * 28;
      return (
        `<ellipse cx="${n(cx - dir * 3)}" cy="156" rx="13" ry="8" transform="rotate(${dir * -16} ${n(cx - dir * 3)} 156)" ` +
        `fill="${primary}" opacity="${op(alpha * 0.72)}" filter="url(#mu-bl-b42)"/>` +
        `<ellipse cx="${n(cx + dir * 6)}" cy="143" rx="11" ry="6.5" transform="rotate(${dir * -28} ${n(cx + dir * 6)} 143)" ` +
        `fill="${secondary}" opacity="${op(alpha * 0.66)}" filter="url(#mu-bl-b42)"/>`
      );
    });
  } else if (style === 'dewy') {
    artwork = cheekPair((dir) => {
      const cx = 300 + dir * 27;
      return (
        `<ellipse cx="${n(cx)}" cy="152" rx="14" ry="9" transform="rotate(${dir * -16} ${n(cx)} 152)" ` +
        `fill="${primary}" opacity="${op(alpha * 0.72)}" filter="url(#mu-bl-b42)"/>` +
        `<ellipse cx="${n(cx)}" cy="151" rx="8.5" ry="5.5" transform="rotate(${dir * -16} ${n(cx)} 151)" ` +
        `fill="${core}" opacity="${op(alpha * 0.56)}" filter="url(#mu-bl-b24)"/>` +
        `<ellipse cx="${n(cx + dir * 3)}" cy="146" rx="6.2" ry="2.1" transform="rotate(${dir * -18} ${n(cx + dir * 3)} 146)" ` +
        `fill="#ffffff" opacity="${op(0.28 * intensity)}" filter="url(#mu-bl-b13)"/>`
      );
    });
  } else if (style === 'matteVelvet') {
    artwork = cheekPair((dir) => {
      const cx = 300 + dir * 27.5;
      return (
        `<ellipse cx="${n(cx)}" cy="153" rx="15.5" ry="10.5" transform="rotate(${dir * -14} ${n(cx)} 153)" ` +
        `fill="${halo}" opacity="${op(alpha * 0.66)}" filter="url(#mu-bl-b60)"/>` +
        `<ellipse cx="${n(cx - dir * 1)}" cy="153" rx="9.5" ry="6" transform="rotate(${dir * -14} ${n(cx - dir * 1)} 153)" ` +
        `fill="${primary}" opacity="${op(alpha * 0.62)}" filter="url(#mu-bl-b42)"/>`
      );
    });
  } else {
    // classic
    artwork = cheekPair((dir) => {
      const cx = 300 + dir * 27.5;
      return (
        `<ellipse cx="${n(cx)}" cy="153" rx="15" ry="9.5" transform="rotate(${dir * -15} ${n(cx)} 153)" ` +
        `fill="${halo}" opacity="${op(alpha * 0.68)}" filter="url(#mu-bl-b42)"/>` +
        `<ellipse cx="${n(cx - dir * 1.2)}" cy="152.8" rx="9" ry="5.5" transform="rotate(${dir * -15} ${n(cx - dir * 1.2)} 152.8)" ` +
        `fill="${primary}" opacity="${op(alpha * 0.68)}" filter="url(#mu-bl-b24)"/>`
      );
    });
  }

  return toUri(
    `<defs>` +
    faceBlurDefs('mu-bl') +
    `<clipPath id="mu-bl-face"><path d="${FACE_OVAL_PATH}"/></clipPath>` +
    `</defs>` +
    `<g clip-path="url(#mu-bl-face)">${artwork}</g>`,
  );
}

/* ============================================================================
 * 4. EYESHADOW
 * ========================================================================== */

export function eyeshadowAsset(p: MakeupParams): string {
  const primary = p.color ?? '#a97962';
  const secondary = p.color2 ?? shade(primary, 0.28);
  const tertiary = p.color3 ?? shade(primary, -0.34);
  const intensity = clamp(p.intensity ?? 0.85, 0.1, 1);
  const style = (readParam(p, 'eyeshadowStyle') ?? readParam(p, 'style') ?? 'softWash') as EyeshadowStyle;
  const finish = (readParam(p, 'finish') ?? (style === 'shimmerFoil' || style === 'halo' ? 'shimmer' : 'satin')) as EyeshadowFinish;

  const deep = shade(primary, -0.44);
  const transition = shade(primary, 0.22);
  const highlight = shade(secondary, 0.45);
  const alpha = 0.42 + 0.48 * intensity;

  const renderEye = (dir: -1 | 1): string => {
    const inner = 300 + dir * 9.5;
    const mid = 300 + dir * 19.2;
    const outer = 300 + dir * 30.0;
    const wing = 300 + dir * 35.5;
    const parts: string[] = [];

    // 1. Soft diffused transition halo under brow
    const transOpacity = style === 'smokey' || style === 'siren' ? alpha * 0.72 : alpha * 0.56;
    parts.push(
      `<path d="M ${n(wing)} 131 C ${n(outer)} 124.5, ${n(mid)} 124, ${n(inner + dir * 1)} 131.5 ` +
      `C ${n(mid)} 129, ${n(outer)} 130.5, ${n(outer)} 135.5 Z" ` +
      `fill="${transition}" opacity="${op(transOpacity)}" filter="url(#mu-es-b24)"/>`,
    );

    // 2. Style-specific lid & crease sculpting
    if (style === 'cutCrease') {
      parts.push(
        `<path d="M ${n(wing)} 130.5 C ${n(outer)} 124.8, ${n(mid)} 124.5, ${n(inner + dir * 1.5)} 131.2 ` +
        `C ${n(mid)} 128.8, ${n(outer)} 129.2, ${n(outer + dir * 1.5)} 135 Z" ` +
        `fill="${deep}" opacity="${op(alpha * 0.88)}" filter="url(#mu-es-b13)"/>`,
      );
      parts.push(
        `<path d="M ${n(outer - dir * 1)} 135.3 C ${n(mid + dir * 5)} 129.2, ${n(mid - dir * 5)} 129.2, ${n(inner)} 135.6 ` +
        `C ${n(mid - dir * 4)} 133.5, ${n(mid + dir * 4)} 133.5, ${n(outer - dir * 1)} 135.3 Z" ` +
        `fill="${secondary}" opacity="${op(alpha * 0.96)}"/>`,
      );
      parts.push(
        `<path d="M ${n(outer)} 135.3 C ${n(mid + dir * 5)} 129.2, ${n(mid - dir * 5)} 129.2, ${n(inner)} 135.6" ` +
        `stroke="${highlight}" stroke-width="0.65" fill="none" opacity="${op(alpha * 0.75)}"/>`,
      );
    } else if (style === 'halo') {
      // Deep inner + outer corners, bright spotlight center
      parts.push(
        `<path d="M ${n(outer)} 135.5 C ${n(outer - dir * 1)} 129.5, ${n(mid)} 127.5, ${n(inner)} 135.5 ` +
        `C ${n(mid - dir * 4)} 131.5, ${n(mid + dir * 4)} 131.5, ${n(outer)} 135.5 Z" ` +
        `fill="${primary}" opacity="${op(alpha * 0.85)}" filter="url(#mu-es-b13)"/>`,
      );
      parts.push(
        `<ellipse cx="${n(outer - dir * 2.5)}" cy="133.2" rx="4.5" ry="3.2" fill="${deep}" opacity="${op(alpha * 0.82)}" filter="url(#mu-es-b13)"/>`,
      );
      parts.push(
        `<ellipse cx="${n(inner + dir * 2.5)}" cy="133.8" rx="4.0" ry="2.8" fill="${deep}" opacity="${op(alpha * 0.72)}" filter="url(#mu-es-b13)"/>`,
      );
      parts.push(
        `<ellipse cx="${n(mid)}" cy="132.2" rx="4.4" ry="2.9" fill="${secondary}" opacity="${op(alpha * 0.96)}" filter="url(#mu-es-b06)"/>`,
      );
    } else if (style === 'smokey') {
      parts.push(
        `<path d="M ${n(wing)} 133 C ${n(outer + dir * 2)} 125.5, ${n(mid)} 125.5, ${n(inner)} 134.5 ` +
        `C ${n(mid)} 132, ${n(outer)} 133.5, ${n(wing)} 136 Z" ` +
        `fill="${primary}" opacity="${op(alpha * 0.92)}" filter="url(#mu-es-b13)"/>`,
      );
      parts.push(
        `<path d="M ${n(outer + dir * 2)} 135.5 C ${n(outer - dir * 1)} 129, ${n(mid)} 128.5, ${n(inner + dir * 1)} 135 ` +
        `C ${n(mid)} 132.2, ${n(outer)} 133, ${n(outer + dir * 2)} 135.5 Z" ` +
        `fill="${deep}" opacity="${op(alpha * 0.92)}" filter="url(#mu-es-b06)"/>`,
      );
      // Heavy lower-lash smoke
      parts.push(
        `<path d="M ${n(outer + dir * 2)} 136.5 C ${n(mid + dir * 4)} 141.2, ${n(mid - dir * 4)} 140.5, ${n(inner + dir * 3)} 138.2" ` +
        `stroke="${deep}" stroke-width="2.1" fill="none" stroke-linecap="round" opacity="${op(alpha * 0.62)}" filter="url(#mu-es-b13)"/>`,
      );
    } else if (style === 'siren') {
      // Lifted elongated outer cat-wing shadow
      parts.push(
        `<path d="M ${n(wing + dir * 3.5)} 126.8 L ${n(outer)} 130.5 C ${n(mid)} 128, ${n(inner + dir * 2)} 131.5, ${n(inner)} 135.6 ` +
        `C ${n(mid)} 132.2, ${n(outer)} 133.8, ${n(outer + dir * 1)} 136.2 L ${n(wing + dir * 3.5)} 126.8 Z" ` +
        `fill="${primary}" opacity="${op(alpha * 0.88)}" filter="url(#mu-es-b13)"/>`,
      );
      parts.push(
        `<path d="M ${n(wing + dir * 2)} 127.8 L ${n(outer - dir * 3)} 132 L ${n(outer)} 135.8 Z" ` +
        `fill="${deep}" opacity="${op(alpha * 0.84)}" filter="url(#mu-es-b06)"/>`,
      );
    } else if (style === 'sunsetOmbre') {
      parts.push(
        `<path d="M ${n(wing)} 132 C ${n(outer)} 125.8, ${n(mid)} 125.5, ${n(inner)} 135.5 ` +
        `C ${n(mid)} 131, ${n(outer)} 132, ${n(wing)} 135.5 Z" ` +
        `fill="${secondary}" opacity="${op(alpha * 0.78)}" filter="url(#mu-es-b13)"/>`,
      );
      parts.push(
        `<path d="M ${n(outer)} 135.4 C ${n(mid + dir * 4)} 129.4, ${n(mid - dir * 4)} 129.6, ${n(inner)} 135.5 ` +
        `C ${n(mid)} 131.6, ${n(outer)} 132, ${n(outer)} 135.4 Z" ` +
        `fill="${primary}" opacity="${op(alpha * 0.9)}" filter="url(#mu-es-b06)"/>`,
      );
      parts.push(
        `<ellipse cx="${n(outer - dir * 1)}" cy="133.6" rx="5.2" ry="3.1" fill="${tertiary}" opacity="${op(alpha * 0.75)}" filter="url(#mu-es-b13)"/>`,
      );
    } else if (style === 'editorialGraphic') {
      parts.push(
        `<path d="M ${n(wing + dir * 2.5)} 126.5 C ${n(outer)} 124.2, ${n(mid)} 124.8, ${n(inner + dir * 1)} 133 ` +
        `C ${n(mid)} 128.2, ${n(outer)} 129.5, ${n(outer + dir * 0.5)} 135.8 L ${n(wing + dir * 2.5)} 126.5 Z" ` +
        `fill="${primary}" opacity="${op(alpha * 0.94)}" filter="url(#mu-es-b06)"/>`,
      );
      parts.push(
        `<path d="M ${n(outer - dir * 1)} 135 C ${n(mid)} 129.8, ${n(inner + dir * 2)} 131.5, ${n(inner)} 135.6 ` +
        `C ${n(mid)} 132.4, ${n(outer - dir * 2)} 133, ${n(outer - dir * 1)} 135 Z" ` +
        `fill="${secondary}" opacity="${op(alpha * 0.85)}"/>`,
      );
    } else if (style === 'wetGloss') {
      parts.push(
        `<path d="M ${n(outer + dir * 1)} 135.3 C ${n(outer - dir * 2)} 127.6, ${n(mid - dir * 4)} 127.6, ${n(inner)} 135.5 ` +
        `C ${n(mid)} 131.2, ${n(outer - dir * 1)} 132, ${n(outer + dir * 1)} 135.3 Z" ` +
        `fill="${primary}" opacity="${op(alpha * 0.78)}" filter="url(#mu-es-b13)"/>`,
      );
      parts.push(
        `<ellipse cx="${n(mid)}" cy="131.8" rx="5.8" ry="1.6" fill="#ffffff" opacity="${op(0.45 * intensity)}" filter="url(#mu-es-b06)"/>`,
      );
      parts.push(
        `<ellipse cx="${n(mid - dir * 2)}" cy="131.2" rx="2.4" ry="0.8" fill="#ffffff" opacity="${op(0.65 * intensity)}"/>`,
      );
    } else {
      // softWash / shimmerFoil / monochrome
      parts.push(
        `<path d="M ${n(outer + dir * 1.5)} 135.5 C ${n(outer - dir * 2)} 127.2, ${n(mid - dir * 4)} 127.2, ${n(inner)} 135.6 ` +
        `C ${n(mid)} 131.4, ${n(outer - dir * 1)} 132.2, ${n(outer + dir * 1.5)} 135.5 Z" ` +
        `fill="url(#mu-es-lid)" opacity="${op(alpha * 0.9)}" filter="url(#mu-es-b06)"/>`,
      );
      parts.push(
        `<ellipse cx="${n(outer - dir * 1.5)}" cy="133.4" rx="4.6" ry="2.8" fill="${deep}" opacity="${op(alpha * 0.62)}" filter="url(#mu-es-b13)"/>`,
      );
    }

    // 3. Lower lashline gentle definition (all styles except editorialGraphic)
    if (style !== 'smokey' && style !== 'editorialGraphic') {
      parts.push(
        `<path d="M ${n(outer)} 136.8 C ${n(mid + dir * 3)} 140.2, ${n(mid - dir * 3)} 140.2, ${n(inner + dir * 5)} 138.6" ` +
        `stroke="${tertiary}" stroke-width="1.25" fill="none" stroke-linecap="round" opacity="${op(alpha * 0.42)}" filter="url(#mu-es-b06)"/>`,
      );
    }

    // 4. Inner tear-duct pearl pop & brow-bone soft lift
    parts.push(
      `<circle cx="${n(inner - dir * 0.2)}" cy="135.8" r="1.7" fill="${highlight}" opacity="${op(0.46 * intensity)}" filter="url(#mu-es-b06)"/>`,
      `<ellipse cx="${n(mid + dir * 1.5)}" cy="123.2" rx="5.5" ry="1.5" fill="${highlight}" opacity="${op(0.2 * intensity)}" filter="url(#mu-es-b24)"/>`,
    );

    // 5. Shimmer / Metallic / Glitter / Gloss specular micro-optics
    if (finish === 'shimmer' || finish === 'metallic' || finish === 'glitter' || style === 'shimmerFoil') {
      parts.push(
        `<ellipse cx="${n(mid)}" cy="132.4" rx="4.8" ry="1.8" fill="${highlight}" opacity="${op(0.42 * intensity)}" filter="url(#mu-es-b13)"/>`,
      );
      const specks = [
        [mid - dir * 3.2, 132.6, 0.34],
        [mid - dir * 1.0, 131.6, 0.44],
        [mid + dir * 1.6, 132.1, 0.38],
        [mid + dir * 3.8, 133.1, 0.32],
        [inner + dir * 2.1, 134.5, 0.35],
      ];
      for (const [sx, sy, sr] of specks) {
        parts.push(`<circle cx="${n(sx)}" cy="${n(sy)}" r="${sr}" fill="#ffffff" opacity="${op((finish === 'glitter' ? 0.78 : 0.52) * intensity)}"/>`);
      }
      if (finish === 'glitter') {
        parts.push(
          `<path d="M ${n(mid)} 130.3 L ${n(mid + 0.28)} 131.4 L ${n(mid + 1.35)} 131.65 L ${n(mid + 0.28)} 131.9 L ${n(mid)} 133.0 L ${n(mid - 0.28)} 131.9 L ${n(mid - 1.35)} 131.65 L ${n(mid - 0.28)} 131.4 Z" fill="#ffffff" opacity="${op(0.7 * intensity)}"/>`,
        );
      }
    }

    return `<g>${parts.join('')}</g>`;
  };

  return toUri(
    `<defs>` +
    faceBlurDefs('mu-es') +
    `<linearGradient id="mu-es-lid" x1="0%" y1="0%" x2="0%" y2="100%">` +
    `<stop offset="0%" stop-color="${secondary}"/>` +
    `<stop offset="62%" stop-color="${primary}"/>` +
    `<stop offset="100%" stop-color="${deep}"/>` +
    `</linearGradient>` +
    `</defs>` +
    renderEye(-1) +
    renderEye(1),
  );
}

/* ============================================================================
 * 5. EYELINER (mathematically mirrored per eye — zero nose-bridge crossing!)
 * ========================================================================== */

export function eyelinerAsset(p: MakeupParams): string {
  const color = p.color ?? '#171115';
  const intensity = clamp(p.intensity ?? 0.95, 0.15, 1);
  const style = (readParam(p, 'linerStyle') ?? readParam(p, 'style') ?? 'winged') as EyelinerStyle;
  const edgeHighlight = shade(color, 0.32);

  const renderEye = (dir: -1 | 1): string => {
    const inner = 300 + dir * 9.5;
    const outer = 300 + dir * 30.2;
    const mid = 300 + dir * 19.2;
    const out: string[] = [];

    // Tightline root hug along upper lid margin (present on every style except pure reverse)
    if (style !== 'reverse') {
      out.push(
        `<path d="M ${n(inner)} 135.8 C ${n(300 + dir * 15)} 130.9, ${n(300 + dir * 24)} 130.9, ${n(outer)} 135.6" ` +
        `stroke="${color}" stroke-width="0.9" fill="none" stroke-linecap="round" opacity="${op(0.95 * intensity)}"/>`,
      );
    }

    if (style === 'tightline') {
      return out.join('');
    }

    if (style === 'smudged') {
      out.push(
        `<path d="M ${n(inner + dir * 1)} 135.4 C ${n(300 + dir * 15)} 130.4, ${n(300 + dir * 25)} 130.2, ${n(outer + dir * 3.8)} 133.5" ` +
        `stroke="${color}" stroke-width="2.1" fill="none" stroke-linecap="round" opacity="${op(0.74 * intensity)}" filter="url(#mu-el-b06)"/>`,
        `<path d="M ${n(mid + dir * 2)} 138.8 C ${n(300 + dir * 26)} 138.5, ${n(outer)} 137.2, ${n(outer + dir * 3.2)} 134.2" ` +
        `stroke="${color}" stroke-width="1.35" fill="none" stroke-linecap="round" opacity="${op(0.55 * intensity)}" filter="url(#mu-el-b06)"/>`,
      );
      return out.join('');
    }

    if (style === 'floatingCrease') {
      out.push(
        `<path d="M ${n(inner + dir * 2.5)} 131.6 C ${n(300 + dir * 15)} 126.4, ${n(300 + dir * 26)} 126.2, ${n(outer + dir * 5.2)} 129.6 ` +
        `C ${n(300 + dir * 25.5)} 127.4, ${n(300 + dir * 15)} 127.6, ${n(inner + dir * 2.5)} 131.6 Z" ` +
        `fill="${color}" opacity="${op(0.95 * intensity)}"/>`,
      );
      return out.join('');
    }

    if (style === 'reverse') {
      out.push(
        `<path d="M ${n(inner + dir * 1.5)} 136.6 C ${n(300 + dir * 16)} 140.2, ${n(300 + dir * 25)} 139.8, ${n(outer)} 136.2 ` +
        `L ${n(outer + dir * 5.6)} 132.2 C ${n(outer + dir * 1.4)} 136.6, ${n(300 + dir * 25)} 138.8, ${n(300 + dir * 16)} 139.2 ` +
        `C ${n(inner + dir * 4)} 138.4, ${n(inner + dir * 1.5)} 136.6, ${n(inner + dir * 1.5)} 136.6 Z" ` +
        `fill="${color}" opacity="${op(0.92 * intensity)}"/>`,
      );
      return out.join('');
    }

    // Calibrated wing geometry per style
    const wingDx =
      style === 'thin'
        ? 2.4
        : style === 'classic'
          ? 4.2
          : style === 'winged'
            ? 5.5
            : style === 'catEye'
              ? 6.2
              : style === 'foxEye'
                ? 7.2
                : style === 'siren'
                  ? 6.8
                  : style === 'bold'
                    ? 7.5
                    : style === 'doubleWing'
                      ? 6.4
                      : style === 'puppy'
                        ? 4.2
                        : style === 'editorial'
                          ? 8.5
                          : 5.0;

    const wingDy =
      style === 'thin'
        ? -1.6
        : style === 'classic'
          ? -3.2
          : style === 'winged'
            ? -4.6
            : style === 'catEye'
              ? -5.8
              : style === 'foxEye'
                ? -4.4
                : style === 'siren'
                  ? -3.6
                  : style === 'bold'
                    ? -6.0
                    : style === 'doubleWing'
                      ? -5.0
                      : style === 'puppy'
                        ? 1.5
                        : style === 'editorial'
                          ? -6.8
                          : -4.0;

    const thickness =
      style === 'thin' ? 0.85 : style === 'bold' || style === 'editorial' ? 2.1 : style === 'catEye' ? 1.65 : 1.3;

    const tipX = outer + dir * wingDx;
    const tipY = 135.6 + wingDy;

    // Tapered calligraphic upper-lid ribbon + razor wing tip
    out.push(
      `<path d="M ${n(inner)} 135.8 ` +
      `C ${n(300 + dir * 15)} ${n(130.7 - thickness * 0.65)}, ${n(300 + dir * 24)} ${n(130.5 - thickness)}, ${n(outer - dir * 1.2)} ${n(134.1 - thickness * 0.5)} ` +
      `L ${n(tipX)} ${n(tipY)} ` +
      `C ${n(outer + dir * wingDx * 0.45)} ${n(135.8 + wingDy * 0.25)}, ${n(outer + dir * 0.6)} 136.0, ${n(outer)} 135.9 ` +
      `C ${n(300 + dir * 24)} 131.5, ${n(300 + dir * 15)} 131.4, ${n(inner)} 135.8 Z" ` +
      `fill="${color}" opacity="${op(0.96 * intensity)}"/>`,
    );

    // Subtle sheen thread along the wing spine
    out.push(
      `<path d="M ${n(mid)} 131.6 C ${n(300 + dir * 25)} 131.4, ${n(outer)} 134.5, ${n(tipX - dir * 1)} ${n(tipY + 0.6)}" ` +
      `stroke="${edgeHighlight}" stroke-width="0.28" fill="none" opacity="${op(0.35 * intensity)}"/>`,
    );

    // Sharp inner tear-duct beak for foxEye / siren / editorial
    if (style === 'foxEye' || style === 'siren' || style === 'editorial') {
      const beakX = inner - dir * 2.2;
      const beakY = 137.1;
      out.push(
        `<path d="M ${n(inner + dir * 1.6)} 135.2 L ${n(beakX)} ${n(beakY)} L ${n(inner + dir * 2.4)} 136.8 Z" ` +
        `fill="${color}" opacity="${op(0.92 * intensity)}"/>`,
      );
    }

    // Siren lower outer corner smoke/line
    if (style === 'siren') {
      out.push(
        `<path d="M ${n(300 + dir * 23)} 138.6 C ${n(300 + dir * 27)} 138.2, ${n(outer)} 137.0, ${n(outer + dir * 2.5)} 135.3" ` +
        `stroke="${color}" stroke-width="0.95" fill="none" stroke-linecap="round" opacity="${op(0.75 * intensity)}" filter="url(#mu-el-b06)"/>`,
      );
    }

    // Double wing lower parallel winglet
    if (style === 'doubleWing') {
      out.push(
        `<path d="M ${n(300 + dir * 25)} 138.4 L ${n(outer + dir * 5.2)} 134.6 L ${n(outer + dir * 0.4)} 137.4 Z" ` +
        `fill="${color}" opacity="${op(0.92 * intensity)}"/>`,
      );
    }

    // Editorial geometric upper crease return
    if (style === 'editorial') {
      out.push(
        `<path d="M ${n(tipX)} ${n(tipY)} L ${n(300 + dir * 24)} 127.8 L ${n(tipX - dir * 1.5)} ${n(tipY + 1.1)} Z" ` +
        `fill="${color}" opacity="${op(0.88 * intensity)}"/>`,
      );
    }

    return out.join('');
  };

  return toUri(
    `<defs>${faceBlurDefs('mu-el')}</defs>` + renderEye(-1) + renderEye(1),
  );
}

/* ============================================================================
 * 6. MASCARA (individual tapered curved Bézier lash fibers — upper + lower)
 * ========================================================================== */

interface LashSpec {
  offset: number; // from 300 along eye width (9.8 .. 30.2)
  yBase: number;
  len: number;
  flare: number; // outward angle offset
  baseW: number;
}

const UPPER_LASH_SLOTS: LashSpec[] = [
  { offset: 10.6, yBase: 135.0, len: 1.8, flare: -0.35, baseW: 0.24 },
  { offset: 11.6, yBase: 134.2, len: 2.2, flare: -0.1, baseW: 0.28 },
  { offset: 12.6, yBase: 133.5, len: 2.5, flare: 0.15, baseW: 0.3 },
  { offset: 13.6, yBase: 132.9, len: 2.8, flare: 0.35, baseW: 0.32 },
  { offset: 14.6, yBase: 132.4, len: 3.1, flare: 0.6, baseW: 0.34 },
  { offset: 15.6, yBase: 132.0, len: 3.4, flare: 0.85, baseW: 0.36 },
  { offset: 16.6, yBase: 131.6, len: 3.6, flare: 1.05, baseW: 0.38 },
  { offset: 17.6, yBase: 131.4, len: 3.8, flare: 1.25, baseW: 0.4 },
  { offset: 18.6, yBase: 131.2, len: 4.0, flare: 1.5, baseW: 0.42 },
  { offset: 19.6, yBase: 131.1, len: 4.1, flare: 1.75, baseW: 0.42 },
  { offset: 20.6, yBase: 131.1, len: 4.2, flare: 2.0, baseW: 0.42 },
  { offset: 21.6, yBase: 131.2, len: 4.3, flare: 2.25, baseW: 0.42 },
  { offset: 22.6, yBase: 131.4, len: 4.4, flare: 2.55, baseW: 0.42 },
  { offset: 23.6, yBase: 131.7, len: 4.4, flare: 2.85, baseW: 0.4 },
  { offset: 24.6, yBase: 132.1, len: 4.4, flare: 3.15, baseW: 0.4 },
  { offset: 25.6, yBase: 132.6, len: 4.3, flare: 3.45, baseW: 0.38 },
  { offset: 26.6, yBase: 133.1, len: 4.2, flare: 3.75, baseW: 0.38 },
  { offset: 27.6, yBase: 133.7, len: 4.0, flare: 4.05, baseW: 0.36 },
  { offset: 28.6, yBase: 134.4, len: 3.7, flare: 4.35, baseW: 0.34 },
  { offset: 29.5, yBase: 135.1, len: 3.3, flare: 4.55, baseW: 0.3 },
];

const LOWER_LASH_SLOTS: LashSpec[] = [
  { offset: 15.2, yBase: 138.6, len: 1.2, flare: 0.4, baseW: 0.17 },
  { offset: 17.6, yBase: 139.1, len: 1.4, flare: 0.75, baseW: 0.19 },
  { offset: 20.0, yBase: 139.2, len: 1.55, flare: 1.05, baseW: 0.2 },
  { offset: 22.4, yBase: 139.0, len: 1.55, flare: 1.35, baseW: 0.2 },
  { offset: 24.8, yBase: 138.5, len: 1.45, flare: 1.7, baseW: 0.19 },
  { offset: 27.2, yBase: 137.8, len: 1.3, flare: 2.0, baseW: 0.17 },
];

export function mascaraAsset(p: MakeupParams): string {
  const color = p.color ?? '#161013';
  const intensity = clamp(p.intensity ?? 0.92, 0.15, 1);
  const style = (readParam(p, 'mascaraStyle') ?? readParam(p, 'style') ?? 'lengthening') as MascaraStyle;

  const lenMult =
    style === 'natural'
      ? 0.72
      : style === 'lengthening'
        ? 1.02
        : style === 'volumizing'
          ? 0.95
          : style === 'wispy'
            ? 1.08
            : style === 'mega'
              ? 1.2
              : style === 'doll'
                ? 1.1
                : 0.98;

  const widthMult =
    style === 'natural'
      ? 0.72
      : style === 'volumizing'
        ? 1.32
        : style === 'mega'
          ? 1.46
          : style === 'wispy'
            ? 1.02
            : 0.96;

  const lowerMult = style === 'bottomAccent' ? 1.55 : style === 'mega' ? 1.2 : style === 'natural' ? 0.65 : 0.92;

  const renderEye = (dir: -1 | 1): string => {
    const paths: string[] = [];

    // Softly feathered lash-root bed so lashes integrate seamlessly into the eyelid
    paths.push(
      `<path d="M ${n(300 + dir * 10)} 135.4 C ${n(300 + dir * 15)} 130.8, ${n(300 + dir * 24)} 130.8, ${n(300 + dir * 30)} 135.4" ` +
      `stroke="${color}" stroke-width="${style === 'volumizing' || style === 'mega' ? 1.45 : 0.95}" fill="none" stroke-linecap="round" opacity="${op(0.65 * intensity)}" filter="url(#mu-ms-b06)"/>`,
    );

    // Tapered curved upper lashes
    UPPER_LASH_SLOTS.forEach((slot, idx) => {
      const x0 = 300 + dir * slot.offset;
      const y0 = slot.yBase;

      let styleMod = 1.0;
      if (style === 'catEye') {
        styleMod = 0.68 + (idx / UPPER_LASH_SLOTS.length) * 0.65;
      } else if (style === 'doll') {
        const distFromMid = Math.abs(slot.offset - 19.8);
        styleMod = 1.15 - distFromMid * 0.032;
      } else if (style === 'wispy') {
        styleMod = idx % 3 === 0 ? 1.22 : idx % 3 === 1 ? 0.85 : 0.72;
      } else {
        // Subtle natural organic variance
        styleMod = idx % 2 === 0 ? 1.04 : 0.92;
      }

      const len = slot.len * lenMult * styleMod;
      const w = slot.baseW * widthMult;
      const flare = slot.flare * (style === 'catEye' ? 1.22 : 0.94);

      const xTip = x0 + dir * flare;
      const yTip = y0 - len;
      const xCtrl = x0 + dir * flare * 0.28;
      const yCtrl = y0 - len * 0.66;

      paths.push(
        `<path d="M ${n(x0 - w * 0.5)} ${n(y0)} ` +
        `Q ${n(xCtrl - w * 0.14)} ${n(yCtrl)}, ${n(xTip)} ${n(yTip)} ` +
        `Q ${n(xCtrl + w * 0.16)} ${n(yCtrl)}, ${n(x0 + w * 0.5)} ${n(y0)} Z" ` +
        `fill="${color}" opacity="${op(0.88 * intensity)}"/>`,
      );

      // Extra split micro-fiber for wispy / mega volume
      if ((style === 'mega' || (style === 'wispy' && idx % 3 === 0)) && idx >= 3 && idx <= 17) {
        const sx0 = x0 + dir * 0.42;
        const sxTip = sx0 + dir * (flare + 0.5);
        const syTip = y0 - len * 0.86;
        paths.push(
          `<path d="M ${n(sx0 - w * 0.3)} ${n(y0)} Q ${n(sx0 + dir * flare * 0.28)} ${n(y0 - len * 0.58)}, ${n(sxTip)} ${n(syTip)} ` +
          `Q ${n(sx0 + dir * flare * 0.28 + w * 0.14)} ${n(y0 - len * 0.58)}, ${n(sx0 + w * 0.3)} ${n(y0)} Z" ` +
          `fill="${color}" opacity="${op(0.78 * intensity)}"/>`,
        );
      }
    });

    // Delicate curved lower lashes
    LOWER_LASH_SLOTS.forEach((slot) => {
      const x0 = 300 + dir * slot.offset;
      const y0 = slot.yBase;
      const len = slot.len * lowerMult;
      const w = slot.baseW * (style === 'bottomAccent' ? 1.35 : 0.95);
      const xTip = x0 + dir * slot.flare * 0.65;
      const yTip = y0 + len;
      const xCtrl = x0 + dir * slot.flare * 0.2;
      const yCtrl = y0 + len * 0.55;

      paths.push(
        `<path d="M ${n(x0 - w * 0.5)} ${n(y0)} ` +
        `Q ${n(xCtrl - w * 0.12)} ${n(yCtrl)}, ${n(xTip)} ${n(yTip)} ` +
        `Q ${n(xCtrl + w * 0.12)} ${n(yCtrl)}, ${n(x0 + w * 0.5)} ${n(y0)} Z" ` +
        `fill="${color}" opacity="${op(0.55 * intensity)}"/>`,
      );
    });

    return paths.join('');
  };

  return toUri(`<defs>${faceBlurDefs('mu-ms')}</defs>` + renderEye(-1) + renderEye(1));
}

/* ============================================================================
 * 7. LIPSTICK (3D anatomical planes, liner contour, micro-creases, finishes)
 * ========================================================================== */

export function lipstickAsset(p: MakeupParams): string {
  const color = p.color ?? '#c85a68';
  const color2 = p.color2 ?? shade(color, 0.28);
  const intensity = clamp(p.intensity ?? 0.92, 0.15, 1);
  const finish = (readParam(p, 'finish') ?? readParam(p, 'lipStyle') ?? readParam(p, 'style') ?? 'satin') as LipstickStyle;

  const upperShade = shade(color, -0.14);
  const lowerShadow = shade(color, -0.34);
  const lipHighlight = shade(color, 0.3);
  const linerTone = shade(color, -0.4);

  const isStain = finish === 'stain';
  const isVelvet = finish === 'velvet';
  const isBalm = finish === 'balm';
  const isOmbre = finish === 'ombre';
  const isMetallic = finish === 'metallic' || finish === 'shimmer';
  const isGlossy = finish === 'gloss' || finish === 'lacquer' || finish === 'vinyl';

  const baseOpacity = (isBalm ? 0.52 : isStain ? 0.78 : isVelvet ? 0.88 : 0.94) * intensity;
  const edgeFilter = isStain || isVelvet ? 'filter="url(#mu-lp-b13)"' : '';

  const glossOpacity =
    finish === 'vinyl'
      ? 0.78
      : finish === 'lacquer'
        ? 0.68
        : finish === 'gloss'
          ? 0.58
          : finish === 'balm'
            ? 0.42
            : finish === 'satin'
              ? 0.24
              : isMetallic
                ? 0.34
                : 0;

  return toUri(
    `<defs>` +
    faceBlurDefs('mu-lp') +
    `<clipPath id="mu-lp-clip"><path d="${FULL_LIP_CLIP_PATH}"/></clipPath>` +
    `<linearGradient id="mu-lp-upper" x1="0%" y1="0%" x2="0%" y2="100%">` +
    `<stop offset="0%" stop-color="${linerTone}"/>` +
    `<stop offset="42%" stop-color="${upperShade}"/>` +
    `<stop offset="100%" stop-color="${lowerShadow}"/>` +
    `</linearGradient>` +
    `<radialGradient id="mu-lp-lower" cx="50%" cy="38%" r="62%">` +
    `<stop offset="0%" stop-color="${isOmbre ? color2 : lipHighlight}"/>` +
    `<stop offset="56%" stop-color="${color}"/>` +
    `<stop offset="100%" stop-color="${lowerShadow}"/>` +
    `</radialGradient>` +
    `<radialGradient id="mu-lp-stain" cx="50%" cy="22%" r="60%">` +
    `<stop offset="0%" stop-color="${lowerShadow}" stop-opacity="0.96"/>` +
    `<stop offset="55%" stop-color="${color}" stop-opacity="0.72"/>` +
    `<stop offset="100%" stop-color="${color}" stop-opacity="0.06"/>` +
    `</radialGradient>` +
    `</defs>` +
    `<g clip-path="url(#mu-lp-clip)" ${edgeFilter}>` +
    (isStain
      ? `<path d="${UPPER_LIP_PATH}" fill="url(#mu-lp-stain)" opacity="${op(baseOpacity)}"/>` +
      `<path d="${LOWER_LIP_PATH}" fill="url(#mu-lp-stain)" opacity="${op(baseOpacity)}"/>`
      : `<path d="${UPPER_LIP_PATH}" fill="url(#mu-lp-upper)" opacity="${op(baseOpacity)}"/>` +
      `<path d="${LOWER_LIP_PATH}" fill="url(#mu-lp-lower)" opacity="${op(baseOpacity)}"/>`) +
    // Ombre inner bloom on upper + lower lip center
    (isOmbre
      ? `<ellipse cx="300" cy="177.2" rx="7.2" ry="2.4" fill="${color2}" opacity="${op(0.72 * intensity)}" filter="url(#mu-lp-b13)"/>` +
      `<ellipse cx="300" cy="182.2" rx="8.2" ry="3.8" fill="${color2}" opacity="${op(0.84 * intensity)}" filter="url(#mu-lp-b13)"/>`
      : '') +
    // Defined vermilion edge contour for crisp architectural lip finishes
    (!isStain && !isVelvet && !isBalm
      ? `<path d="${FULL_LIP_CLIP_PATH}" fill="none" stroke="${linerTone}" stroke-width="0.7" opacity="${op(0.55 * intensity)}"/>`
      : '') +
    // Corner depth & occlusal mouth-parting shadow for 3D plumpness
    `<path d="M 285.4 178.1 C 292.5 179.5, 307.5 179.5, 314.6 178.1" stroke="${shade(color, -0.58)}" stroke-width="0.95" fill="none" stroke-linecap="round" opacity="${op(0.75 * intensity)}"/>` +
    `<circle cx="285.6" cy="178.2" r="1.4" fill="${shade(color, -0.55)}" opacity="${op(0.5 * intensity)}" filter="url(#mu-lp-b06)"/>` +
    `<circle cx="314.4" cy="178.2" r="1.4" fill="${shade(color, -0.55)}" opacity="${op(0.5 * intensity)}" filter="url(#mu-lp-b06)"/>` +
    // Micro-creases on matte / satin / velvet / stain for natural skin texture
    (!isGlossy
      ? `<g stroke="${shade(color, -0.45)}" stroke-width="0.32" fill="none" opacity="${op(0.24 * intensity)}">` +
      `<path d="M 292 179.5 C 291.5 182.5, 291.8 184.8, 292.4 186.6"/>` +
      `<path d="M 295.5 179.8 C 295.2 183, 295.4 185.5, 295.8 187.8"/>` +
      `<path d="M 299.8 180 C 299.8 183.4, 299.8 186, 299.8 188.3"/>` +
      `<path d="M 304.3 179.8 C 304.6 183, 304.4 185.5, 304 187.8"/>` +
      `<path d="M 308 179.5 C 308.5 182.5, 308.2 184.8, 307.6 186.6"/>` +
      `</g>`
      : '') +
    // Subtle matte velvety pillow lift
    (finish === 'matte' || isVelvet
      ? `<ellipse cx="300" cy="183.2" rx="6.2" ry="2.2" fill="${lipHighlight}" opacity="${op(0.2 * intensity)}" filter="url(#mu-lp-b13)"/>`
      : '') +
    // Metallic / Shimmer pearlescent sheen + flecks
    (isMetallic
      ? `<ellipse cx="300" cy="183" rx="7.6" ry="2.3" fill="${shade(color2, 0.45)}" opacity="${op(0.5 * intensity)}" filter="url(#mu-lp-b06)"/>` +
      `<circle cx="297.2" cy="183.2" r="0.38" fill="#ffffff" opacity="${op(0.8 * intensity)}"/>` +
      `<circle cx="300.6" cy="182.6" r="0.44" fill="#ffffff" opacity="${op(0.85 * intensity)}"/>` +
      `<circle cx="303.4" cy="183.5" r="0.35" fill="#ffffff" opacity="${op(0.75 * intensity)}"/>`
      : '') +
    // Wet lacquer / gloss / satin catchlights
    (glossOpacity > 0
      ? `<path d="M 293.5 182.6 C 297.5 184.2, 302.5 184.2, 306.5 182.6 C 303.5 185.3, 296.5 185.3, 293.5 182.6 Z" ` +
      `fill="#ffffff" opacity="${op(glossOpacity * intensity)}" filter="url(#mu-lp-b06)"/>` +
      (isGlossy
        ? `<ellipse cx="298.8" cy="183.2" rx="2.8" ry="0.65" fill="#ffffff" opacity="${op(Math.min(1, glossOpacity * 1.25) * intensity)}"/>` +
        `<ellipse cx="303.6" cy="182.8" rx="1.1" ry="0.45" fill="#ffffff" opacity="${op(glossOpacity * 0.9 * intensity)}"/>` +
        `<ellipse cx="295.4" cy="174.9" rx="1.6" ry="0.45" transform="rotate(-14 295.4 174.9)" fill="#ffffff" opacity="${op(glossOpacity * 0.65 * intensity)}"/>` +
        `<ellipse cx="304.6" cy="174.9" rx="1.6" ry="0.45" transform="rotate(14 304.6 174.9)" fill="#ffffff" opacity="${op(glossOpacity * 0.65 * intensity)}"/>`
        : '')
      : '') +
    `</g>`,
  );
}

/* ============================================================================
 * 8. ADDITIONAL PRO MAKEUP GENERATORS (Eyebrows, Contour, Highlighter, LipLiner, Editorial)
 * ========================================================================== */

export function eyebrowAsset(p: MakeupParams): string {
  const tone = p.skinTone ?? FALLBACK_TONE;
  const intensity = clamp(p.intensity ?? 0.85, 0.1, 1);
  const style = (readParam(p, 'browStyle') ?? readParam(p, 'style') ?? 'feathered') as BrowStyle;

  const browColor = p.color ?? (style === 'bleached' ? shade(tone.base, 0.26) : shade(tone.base, -0.62));
  const softFill = shade(browColor, 0.16);

  const renderBrow = (dir: -1 | 1): string => {
    const innerX = 300 + dir * 8.0;
    const peakX = 300 + dir * 21.5;
    const outerX = 300 + dir * 33.4;

    const archLift = style === 'arched' ? -1.1 : style === 'straight' ? 0.9 : style === 'laminated' ? -0.6 : 0;
    const tailY = style === 'straight' ? 123.6 : 125.1;

    const browShapePath =
      `M ${n(outerX)} ${n(tailY)} C ${n(peakX + dir * 3)} ${n(118.4 + archLift)}, ${n(innerX + dir * 6)} ${n(118.8 + archLift * 0.5)}, ${n(innerX)} 124.2 ` +
      `C ${n(innerX + dir * 7)} ${n(122.0 + archLift * 0.3)}, ${n(peakX)} ${n(121.6 + archLift)}, ${n(outerX)} ${n(tailY)} Z`;

    const clipId = `mu-br-clip-${dir === -1 ? 'l' : 'r'}`;
    const baseFill =
      `<path d="${browShapePath}" fill="${softFill}" opacity="${op((style === 'sculpted' ? 0.68 : style === 'ombre' ? 0.56 : 0.36) * intensity)}" filter="url(#mu-br-b06)"/>`;

    // Individual natural hair strokes sculpted smoothly along the brow curve
    const strokes: string[] = [];
    const steps = 22;
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const bx = innerX + dir * (t * (33.0 - 8.2));
      const archCurve = Math.sin(t * Math.PI) * (2.4 - archLift * 0.7);
      const by = 124.3 - archCurve + t * (tailY - 124.3);

      // Laminated tilts hairs slightly higher; classic curves along the tail
      const hairTilt = (style === 'laminated' ? 0.9 : 1.4) + t * 2.8;
      const hairLen = (style === 'laminated' ? 3.2 : 2.5) - t * 0.95;

      const strokeAlpha = style === 'ombre' ? (0.28 + t * 0.58) * intensity : 0.72 * intensity;
      strokes.push(
        `<path d="M ${n(bx)} ${n(by + 0.4)} Q ${n(bx + dir * hairTilt * 0.45)} ${n(by - hairLen * 0.45)}, ${n(bx + dir * hairTilt)} ${n(by - hairLen)}" ` +
        `stroke="${browColor}" stroke-width="${style === 'bleached' ? 0.36 : 0.32}" fill="none" stroke-linecap="round" opacity="${op(strokeAlpha)}"/>`,
      );
    }

    // Clip hair tips softly inside an expanded natural brow envelope so zero spikes jut upward
    const envelopePath =
      `M ${n(outerX + dir * 0.6)} ${n(tailY + 0.5)} C ${n(peakX + dir * 3)} ${n(117.7 + archLift)}, ${n(innerX + dir * 6)} ${n(118.1 + archLift * 0.5)}, ${n(innerX - dir * 0.4)} 124.6 ` +
      `C ${n(innerX + dir * 7)} ${n(122.7 + archLift * 0.3)}, ${n(peakX)} ${n(122.4 + archLift)}, ${n(outerX + dir * 0.6)} ${n(tailY + 0.5)} Z`;

    return (
      `<clipPath id="${clipId}"><path d="${envelopePath}"/></clipPath>` +
      baseFill +
      `<g clip-path="url(#${clipId})">${strokes.join('')}</g>`
    );
  };

  return toUri(`<defs>${faceBlurDefs('mu-br')}</defs>` + renderBrow(-1) + renderBrow(1));
}

export function contourAsset(p: MakeupParams): string {
  const tone = p.skinTone ?? FALLBACK_TONE;
  const intensity = clamp(p.intensity ?? 0.78, 0.1, 1);
  const style = (readParam(p, 'contourStyle') ?? readParam(p, 'style') ?? 'soft') as ContourStyle;

  const baseContour = p.color ?? (style === 'bronze' ? shade(tone.base, -0.3) : shade(tone.base, -0.38));
  const alpha = (style === 'editorial' || style === 'snatched' ? 0.48 : style === 'soft' ? 0.28 : 0.38) * intensity;

  const side = (dir: -1 | 1): string => {
    const cheekStart = 300 + dir * 43;
    const cheekEnd = 300 + dir * 22;
    const templeX = 300 + dir * 41;
    const jawX = 300 + dir * 32;
    return (
      // Cheekbone hollow
      `<path d="M ${n(cheekStart)} 149 C ${n(300 + dir * 36)} 156, ${n(300 + dir * 29)} 161, ${n(cheekEnd)} 165" ` +
      `stroke="${baseContour}" stroke-width="${style === 'snatched' || style === 'editorial' ? 4.8 : 6.0}" fill="none" stroke-linecap="round" opacity="${op(alpha)}" filter="url(#mu-ct-b42)"/>` +
      // Temple / hairline contour
      `<ellipse cx="${n(templeX)}" cy="112" rx="7" ry="14" transform="rotate(${dir * 18} ${n(templeX)} 112)" fill="${baseContour}" opacity="${op(alpha * 0.65)}" filter="url(#mu-ct-b42)"/>` +
      // Jawline carve
      `<path d="M ${n(jawX)} 178 C ${n(300 + dir * 24)} 192, ${n(300 + dir * 13)} 201, ${n(300 + dir * 4)} 205" ` +
      `stroke="${baseContour}" stroke-width="4.2" fill="none" stroke-linecap="round" opacity="${op(alpha * 0.68)}" filter="url(#mu-ct-b42)"/>`
    );
  };

  // Nose bridge & tip sculpt
  const noseAlpha = style === 'noseFocus' || style === 'snatched' || style === 'editorial' ? alpha * 0.85 : alpha * 0.48;
  const nose =
    `<path d="M 296.6 131 C 296.2 142, 296.4 153, 296.8 159" stroke="${baseContour}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="${op(noseAlpha)}" filter="url(#mu-ct-b13)"/>` +
    `<path d="M 303.4 131 C 303.8 142, 303.6 153, 303.2 159" stroke="${baseContour}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="${op(noseAlpha)}" filter="url(#mu-ct-b13)"/>` +
    `<path d="M 296.5 161.2 Q 300 163.5, 303.5 161.2" stroke="${baseContour}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="${op(noseAlpha * 0.75)}" filter="url(#mu-ct-b13)"/>`;

  return toUri(
    `<defs>` +
    faceBlurDefs('mu-ct') +
    `<clipPath id="mu-ct-face"><path d="${FACE_OVAL_PATH}"/></clipPath>` +
    `</defs>` +
    `<g clip-path="url(#mu-ct-face)">` +
    side(-1) +
    side(1) +
    nose +
    `<ellipse cx="300" cy="88" rx="22" ry="6" fill="${baseContour}" opacity="${op(alpha * 0.55)}" filter="url(#mu-ct-b42)"/>` +
    `</g>`,
  );
}

export function highlighterAsset(p: MakeupParams): string {
  const tone = p.skinTone ?? FALLBACK_TONE;
  const rawColor = p.color ?? '#fff2df';
  const color = shade(rawColor, -0.04);
  const warmSheen = shade(tone.base, 0.52);
  const intensity = clamp(p.intensity ?? 0.88, 0.1, 1);
  const style = (readParam(p, 'highlighterStyle') ?? readParam(p, 'style') ?? 'champagne') as HighlighterStyle;

  const baseOp = (style === 'strobe' || style === 'editorial' ? 0.56 : style === 'glassSkin' ? 0.46 : 0.36) * intensity;
  const isGlass = style === 'glassSkin' || style === 'editorial';

  const side = (dir: -1 | 1): string => {
    const cheekX = 300 + dir * 32.5;
    const browX = 300 + dir * 20;
    const innerX = 300 + dir * 9.5;
    return (
      `<ellipse cx="${n(cheekX)}" cy="144.8" rx="9.5" ry="3.2" transform="rotate(${dir * -18} ${n(cheekX)} 144.8)" fill="url(#mu-hl-glow)" opacity="${op(baseOp)}" filter="url(#mu-hl-b24)"/>` +
      (isGlass || style === 'strobe'
        ? `<ellipse cx="${n(cheekX + dir * 0.5)}" cy="144.4" rx="4.6" ry="1.15" transform="rotate(${dir * -18} ${n(cheekX + dir * 0.5)} 144.4)" fill="${warmSheen}" opacity="${op(baseOp * 0.65)}" filter="url(#mu-hl-b13)"/>`
        : '') +
      `<ellipse cx="${n(browX)}" cy="123.5" rx="5.0" ry="1.2" fill="${color}" opacity="${op(baseOp * 0.48)}" filter="url(#mu-hl-b13)"/>` +
      `<circle cx="${n(innerX)}" cy="135.7" r="1.35" fill="${color}" opacity="${op(baseOp * 0.72)}" filter="url(#mu-hl-b06)"/>`
    );
  };

  return toUri(
    `<defs>` +
    faceBlurDefs('mu-hl') +
    `<clipPath id="mu-hl-face"><path d="${FACE_OVAL_PATH}"/></clipPath>` +
    `<radialGradient id="mu-hl-glow" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="${color}" stop-opacity="0.95"/>` +
    `<stop offset="60%" stop-color="${warmSheen}" stop-opacity="0.45"/>` +
    `<stop offset="100%" stop-color="${warmSheen}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `</defs>` +
    `<g clip-path="url(#mu-hl-face)">` +
    side(-1) +
    side(1) +
    `<ellipse cx="300" cy="144" rx="1.1" ry="9.0" fill="${warmSheen}" opacity="${op(baseOp * 0.58)}" filter="url(#mu-hl-b13)"/>` +
    `<ellipse cx="300" cy="159.8" rx="1.65" ry="1.1" fill="${color}" opacity="${op(baseOp * 0.5)}" filter="url(#mu-hl-b13)"/>` +
    `<path d="M 296.5 173.4 Q 300 175.4, 303.5 173.4" stroke="${color}" stroke-width="0.8" fill="none" stroke-linecap="round" opacity="${op(baseOp * 0.6)}" filter="url(#mu-hl-b06)"/>` +
    `<ellipse cx="300" cy="196.2" rx="4.5" ry="2.2" fill="${warmSheen}" opacity="${op(baseOp * 0.34)}" filter="url(#mu-hl-b13)"/>` +
    `</g>`,
  );
}

export function lipLinerAsset(p: MakeupParams): string {
  const color = p.color ?? '#8b4a4b';
  const intensity = clamp(p.intensity ?? 0.85, 0.1, 1);
  const style = (readParam(p, 'style') ?? 'natural') as 'natural' | 'overlined' | 'sculpted90s' | 'blurred';

  const blur = style === 'blurred' ? 'filter="url(#mu-ll-b13)"' : style === 'sculpted90s' ? 'filter="url(#mu-ll-b06)"' : '';
  const width = style === 'sculpted90s' ? 1.25 : style === 'overlined' ? 1.05 : 0.75;
  const path =
    style === 'overlined'
      ? 'M 284.2 177.8 C 289.2 172.8, 294.6 171.8, 300 174.4 C 305.4 171.8, 310.8 172.8, 315.8 177.8 ' +
      'C 312.5 186.8, 305.8 190.1, 300 190.1 C 294.2 190.1, 287.5 186.8, 284.2 177.8 Z'
      : FULL_LIP_CLIP_PATH;

  return toUri(
    `<defs>${faceBlurDefs('mu-ll')}</defs>` +
    `<path d="${path}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${op(0.85 * intensity)}" ${blur}/>`,
  );
}

export function editorialAccentsAsset(p: MakeupParams): string {
  const color = p.color ?? '#f5f2f8';
  const intensity = clamp(p.intensity ?? 0.95, 0.1, 1);
  const style = (readParam(p, 'editorialStyle') ?? readParam(p, 'style') ?? 'pearls') as EditorialAccentStyle;

  if (style === 'none') {
    return toUri('');
  }

  const pearl = (cx: number, cy: number, r: number) =>
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#mu-ed-pearl)" opacity="${op(intensity)}"/>` +
    `<circle cx="${n(cx - r * 0.28)}" cy="${n(cy - r * 0.28)}" r="${n(r * 0.26)}" fill="#ffffff" opacity="${op(0.9 * intensity)}"/>`;

  const crystal = (cx: number, cy: number, r: number) =>
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${color}" opacity="${op(0.9 * intensity)}"/>` +
    `<path d="M ${n(cx)} ${n(cy - r * 1.4)} L ${n(cx + r * 0.3)} ${n(cy - r * 0.3)} L ${n(cx + r * 1.4)} ${n(cy)} L ${n(cx + r * 0.3)} ${n(cy + r * 0.3)} L ${n(cx)} ${n(cy + r * 1.4)} L ${n(cx - r * 0.3)} ${n(cy + r * 0.3)} L ${n(cx - r * 1.4)} ${n(cy)} L ${n(cx - r * 0.3)} ${n(cy - r * 0.3)} Z" fill="#ffffff" opacity="${op(0.95 * intensity)}"/>`;

  const side = (dir: -1 | 1): string => {
    if (style === 'pearls') {
      return pearl(300 + dir * 32.5, 134.5, 1.35) + pearl(300 + dir * 35.8, 131.2, 1.05) + pearl(300 + dir * 38.2, 127.8, 0.8);
    }
    if (style === 'crystals') {
      return crystal(300 + dir * 32.8, 134.8, 1.1) + crystal(300 + dir * 36.2, 130.8, 0.85) + crystal(300 + dir * 19.2, 141.8, 0.75);
    }
    if (style === 'celestial') {
      return crystal(300 + dir * 34.5, 131.5, 1.35) + pearl(300 + dir * 29.0, 142.2, 0.75) + crystal(300 + dir * 38.0, 136.5, 0.7);
    }
    if (style === 'goldLeaf') {
      const gx = 300 + dir * 34;
      return (
        `<path d="M ${n(gx)} 128 L ${n(gx + dir * 3.5)} 130 L ${n(gx + dir * 2)} 135 L ${n(gx - dir * 1)} 133 Z" fill="${color}" opacity="${op(0.85 * intensity)}"/>` +
        `<path d="M ${n(gx + dir * 4)} 135 L ${n(gx + dir * 6)} 137 L ${n(gx + dir * 4.5)} 139.5 Z" fill="${shade(color, 0.3)}" opacity="${op(0.8 * intensity)}"/>`
      );
    }
    if (style === 'underEyeDots') {
      return pearl(300 + dir * 19.2, 141.6, 0.95);
    }
    if (style === 'innerDiamond') {
      return crystal(300 + dir * 9.5, 135.8, 1.05);
    }
    if (style === 'sirenGems') {
      return crystal(300 + dir * 9.5, 136.0, 0.95) + crystal(300 + dir * 34.0, 132.5, 1.05) + crystal(300 + dir * 37.5, 129.5, 0.75);
    }
    return '';
  };

  return toUri(
    `<defs>` +
    `<radialGradient id="mu-ed-pearl" cx="35%" cy="30%" r="70%">` +
    `<stop offset="0%" stop-color="#ffffff"/>` +
    `<stop offset="55%" stop-color="${color}"/>` +
    `<stop offset="100%" stop-color="${shade(color, -0.35)}"/>` +
    `</radialGradient>` +
    `</defs>` +
    side(-1) +
    side(1),
  );
}

/* ============================================================================
 * 9. CURATED OPTION CATALOGS & FULL LOOK PRESETS
 * ========================================================================== */

export interface MakeupOption {
  id: string;
  label: string;
  params: Partial<MakeupParams>;
}

export const FOUNDATION_OPTIONS: MakeupOption[] = [
  { id: 'sheer-skin-tint', label: 'Sheer Skin Tint', params: { foundationStyle: 'sheer', intensity: 0.75 } },
  { id: 'natural-second-skin', label: 'Natural Second Skin', params: { foundationStyle: 'natural', intensity: 0.85 } },
  { id: 'satin-silk', label: 'Satin Silk Veil', params: { foundationStyle: 'satin', intensity: 0.88 } },
  { id: 'velvet-matte', label: 'Velvet Matte Blur', params: { foundationStyle: 'matte', intensity: 0.9 } },
  { id: 'dewy-glass', label: 'Dewy Glass Skin', params: { foundationStyle: 'dewy', intensity: 0.9 } },
  { id: 'luminous-radiant', label: 'Luminous Radiant', params: { foundationStyle: 'luminous', intensity: 0.92 } },
  { id: 'soft-focus-blur', label: 'Soft-Focus Cloud', params: { foundationStyle: 'softFocus', intensity: 0.92 } },
  { id: 'full-coverage-studio', label: 'Studio Full Coverage', params: { foundationStyle: 'fullCoverage', intensity: 0.95 } },
];

export const CONCEALER_OPTIONS: MakeupOption[] = [
  { id: 'natural-brighten', label: 'Natural Brighten', params: { concealerStyle: 'natural', intensity: 0.8 } },
  { id: 'peach-corrector', label: 'Peach Color Corrector', params: { concealerStyle: 'correcting', intensity: 0.88 } },
  { id: 'lifted-triangle', label: 'Lifted Snatched Triangle', params: { concealerStyle: 'lifted', intensity: 0.9 } },
  { id: 'brightening-eye', label: 'Under-Eye Brightener', params: { concealerStyle: 'brightening', intensity: 0.92 } },
  { id: 'radiant-serum', label: 'Radiant Serum Boost', params: { concealerStyle: 'radiant', intensity: 0.85 } },
  { id: 'studio-full', label: 'Studio Full Cover', params: { concealerStyle: 'fullCover', intensity: 0.96 } },
];

export const BLUSH_OPTIONS: MakeupOption[] = [
  { id: 'rose-petal-classic', label: 'Rose Petal Classic', params: { color: '#df7888', blushStyle: 'classic', intensity: 0.82 } },
  { id: 'peach-bellini-sunkissed', label: 'Peach Bellini Sun-Kissed', params: { color: '#e88b72', blushStyle: 'sunkissed', intensity: 0.86 } },
  { id: 'berry-wine-draped', label: 'Berry Wine Draped', params: { color: '#a84463', blushStyle: 'draped', intensity: 0.85 } },
  { id: 'coral-nectar-dewy', label: 'Coral Nectar Dewy', params: { color: '#ef7668', blushStyle: 'dewy', intensity: 0.88 } },
  { id: 'terracotta-sculpted', label: 'Terracotta Sculpted', params: { color: '#c46854', blushStyle: 'sculpted', intensity: 0.84 } },
  { id: 'sakura-igari', label: 'Sakura Doll Igari', params: { color: '#f293aa', blushStyle: 'igari', intensity: 0.85 } },
  { id: 'plum-velvet-ombre', label: 'Plum Sunset Ombré', params: { color: '#9c436b', color2: '#eb8c79', blushStyle: 'ombre', intensity: 0.88 } },
  { id: 'apricot-cloud-matte', label: 'Apricot Cloud Matte', params: { color: '#e69478', blushStyle: 'matteVelvet', intensity: 0.84 } },
  { id: 'hibiscus-flush', label: 'Hibiscus Pop Flush', params: { color: '#dc4b68', blushStyle: 'dewy', intensity: 0.86 } },
  { id: 'mauve-cashmere', label: 'Mauve Cashmere', params: { color: '#b87687', blushStyle: 'classic', intensity: 0.82 } },
  { id: 'guava-gloss', label: 'Guava Glass Cheek', params: { color: '#eb6c7d', blushStyle: 'dewy', intensity: 0.9 } },
  { id: 'burnt-sienna-bronze', label: 'Burnt Sienna Sun', params: { color: '#b9614a', blushStyle: 'sunkissed', intensity: 0.86 } },
  { id: 'strawberry-milk', label: 'Strawberry Milk Soft', params: { color: '#f08ca4', blushStyle: 'igari', intensity: 0.82 } },
  { id: 'rosewood-sculpt', label: 'Rosewood Lift', params: { color: '#ad5e69', blushStyle: 'sculpted', intensity: 0.85 } },
  { id: 'crimson-bitten-cheek', label: 'Crimson Cold-Flush', params: { color: '#b73247', blushStyle: 'sunkissed', intensity: 0.8 } },
  { id: 'lavender-cool-pop', label: 'Cool Lavender Veil', params: { color: '#c584b8', blushStyle: 'draped', intensity: 0.8 } },
  { id: 'tangerine-editorial', label: 'Tangerine Editorial', params: { color: '#eb7448', blushStyle: 'draped', intensity: 0.86 } },
  { id: 'cinnamon-spice', label: 'Cinnamon Spice', params: { color: '#a85a47', blushStyle: 'matteVelvet', intensity: 0.84 } },
];

export const EYESHADOW_OPTIONS: MakeupOption[] = [
  { id: 'champagne-soft-wash', label: 'Champagne Soft Wash', params: { color: '#c2997e', color2: '#f0d5be', eyeshadowStyle: 'softWash', finish: 'satin', intensity: 0.82 } },
  { id: 'espresso-smokey', label: 'Espresso Smokey Eye', params: { color: '#4d3228', color2: '#9a715c', color3: '#2c1a14', eyeshadowStyle: 'smokey', finish: 'matte', intensity: 0.92 } },
  { id: 'rose-quartz-halo', label: 'Rose Quartz Halo', params: { color: '#a65d6e', color2: '#f6cad4', eyeshadowStyle: 'halo', finish: 'shimmer', intensity: 0.9 } },
  { id: 'golden-hour-sunset', label: 'Golden Hour Sunset', params: { color: '#d46a4c', color2: '#f3be6b', color3: '#7a2b3f', eyeshadowStyle: 'sunsetOmbre', finish: 'shimmer', intensity: 0.92 } },
  { id: 'cut-crease-cocoa', label: 'Cocoa Sculpt Cut-Crease', params: { color: '#6b4435', color2: '#f2dfd1', eyeshadowStyle: 'cutCrease', finish: 'satin', intensity: 0.92 } },
  { id: 'emerald-siren', label: 'Emerald Siren Smoke', params: { color: '#216955', color2: '#7dc9ad', eyeshadowStyle: 'siren', finish: 'metallic', intensity: 0.9 } },
  { id: 'amethyst-duochrome', label: 'Amethyst Duochrome', params: { color: '#6a4487', color2: '#d39cf2', eyeshadowStyle: 'halo', finish: 'shimmer', intensity: 0.92 } },
  { id: 'copper-foil-shimmer', label: 'Molten Copper Foil', params: { color: '#b85c38', color2: '#f2b179', eyeshadowStyle: 'shimmerFoil', finish: 'metallic', intensity: 0.94 } },
  { id: 'slate-editorial-smoke', label: 'Slate Noir Editorial', params: { color: '#39404d', color2: '#9ba6ba', eyeshadowStyle: 'smokey', finish: 'matte', intensity: 0.9 } },
  { id: 'peach-sorbet-matte', label: 'Peach Sorbet Matte', params: { color: '#df8c74', color2: '#fbd4c5', eyeshadowStyle: 'softWash', finish: 'matte', intensity: 0.84 } },
  { id: 'midnight-sapphire-halo', label: 'Midnight Sapphire', params: { color: '#203b73', color2: '#89b4f8', eyeshadowStyle: 'halo', finish: 'metallic', intensity: 0.92 } },
  { id: 'burgundy-velvet-smokey', label: 'Burgundy Velvet Smoke', params: { color: '#6d2538', color2: '#cc6e85', color3: '#3b101d', eyeshadowStyle: 'smokey', finish: 'satin', intensity: 0.92 } },
  { id: 'pearl-frost-wet-gloss', label: 'Pearl Wet-Lid Gloss', params: { color: '#d7c2bc', color2: '#fff7f2', eyeshadowStyle: 'wetGloss', finish: 'gloss', intensity: 0.88 } },
  { id: 'bronze-goddess-satin', label: 'Bronze Goddess Satin', params: { color: '#9c663e', color2: '#eab97e', eyeshadowStyle: 'siren', finish: 'shimmer', intensity: 0.9 } },
  { id: 'lavender-mist-wash', label: 'Lavender Mist', params: { color: '#9e84b8', color2: '#e7daf7', eyeshadowStyle: 'softWash', finish: 'satin', intensity: 0.82 } },
  { id: 'olive-gold-siren', label: 'Olive Gold Siren', params: { color: '#586137', color2: '#d9c472', eyeshadowStyle: 'siren', finish: 'metallic', intensity: 0.9 } },
  { id: 'ruby-noir-cut-crease', label: 'Ruby Noir Cut-Crease', params: { color: '#781f2f', color2: '#f4c7cc', eyeshadowStyle: 'cutCrease', finish: 'shimmer', intensity: 0.94 } },
  { id: 'taupe-sculpt-contour', label: 'Cool Taupe Sculpt', params: { color: '#8a766d', color2: '#dfd1ca', eyeshadowStyle: 'monochrome', finish: 'matte', intensity: 0.84 } },
  { id: 'cobalt-graphic-wash', label: 'Cobalt Runway Sweep', params: { color: '#2852c2', color2: '#95b8ff', eyeshadowStyle: 'editorialGraphic', finish: 'satin', intensity: 0.94 } },
  { id: 'opal-prism-glitter', label: 'Opal Prism Glitter', params: { color: '#c4a8c9', color2: '#fdf2ff', eyeshadowStyle: 'shimmerFoil', finish: 'glitter', intensity: 0.92 } },
];

export const EYELINER_OPTIONS: MakeupOption[] = [
  { id: 'obsidian-classic-wing', label: 'Obsidian Classic Wing', params: { color: '#140f12', linerStyle: 'classic', intensity: 0.96 } },
  { id: 'onyx-fox-eye', label: 'Onyx Fox-Eye Wing', params: { color: '#120d10', linerStyle: 'foxEye', intensity: 0.98 } },
  { id: 'velvet-tightline', label: 'Invisible Tightline', params: { color: '#1d1519', linerStyle: 'tightline', intensity: 0.9 } },
  { id: 'ink-micro-thin', label: 'Micro-Thin Flick', params: { color: '#1a1317', linerStyle: 'thin', intensity: 0.95 } },
  { id: 'dramatic-bold-wing', label: 'Dramatic Studio Wing', params: { color: '#110c0f', linerStyle: 'bold', intensity: 0.98 } },
  { id: 'siren-double-smoke', label: 'Siren Sharp Smoke', params: { color: '#181115', linerStyle: 'siren', intensity: 0.96 } },
  { id: 'retro-cat-eye', label: 'Retro Curved Cat-Eye', params: { color: '#140e12', linerStyle: 'catEye', intensity: 0.98 } },
  { id: 'graphic-double-wing', label: 'Graphic Double Wing', params: { color: '#140f12', linerStyle: 'doubleWing', intensity: 0.96 } },
  { id: 'floating-crease-noir', label: 'Floating Crease Noir', params: { color: '#171115', linerStyle: 'floatingCrease', intensity: 0.95 } },
  { id: 'espresso-puppy-liner', label: 'Espresso Puppy Liner', params: { color: '#452b20', linerStyle: 'puppy', intensity: 0.9 } },
  { id: 'kohl-smudged-smoke', label: 'Smudged Kohl Smoke', params: { color: '#241b1e', linerStyle: 'smudged', intensity: 0.92 } },
  { id: 'reverse-siren-berry', label: 'Reverse Siren Berry', params: { color: '#5e1c30', linerStyle: 'reverse', intensity: 0.92 } },
  { id: 'editorial-cobalt-wing', label: 'Editorial Cobalt Wing', params: { color: '#2049b8', linerStyle: 'editorial', intensity: 0.96 } },
  { id: 'metallic-gold-wing', label: '24K Gold Wing', params: { color: '#d4a243', linerStyle: 'winged', intensity: 0.96 } },
  { id: 'emerald-cat-eye', label: 'Emerald Cat-Eye', params: { color: '#1b634b', linerStyle: 'catEye', intensity: 0.94 } },
  { id: 'burgundy-fox-eye', label: 'Burgundy Fox-Eye', params: { color: '#611d2d', linerStyle: 'foxEye', intensity: 0.94 } },
  { id: 'silver-chrome-floating', label: 'Silver Chrome Crease', params: { color: '#c4cdd9', linerStyle: 'floatingCrease', intensity: 0.95 } },
  { id: 'charcoal-soft-wing', label: 'Charcoal Soft Wing', params: { color: '#39383d', linerStyle: 'winged', intensity: 0.9 } },
];

export const MASCARA_OPTIONS: MakeupOption[] = [
  { id: 'noir-natural-curl', label: 'Noir Natural Curl', params: { color: '#171114', mascaraStyle: 'natural', intensity: 0.88 } },
  { id: 'obsidian-lengthening', label: 'Obsidian Lengthening', params: { color: '#140e11', mascaraStyle: 'lengthening', intensity: 0.94 } },
  { id: 'ultra-volumizing-black', label: 'Ultra-Volumizing Black', params: { color: '#120c0f', mascaraStyle: 'volumizing', intensity: 0.96 } },
  { id: 'feathered-wispy', label: 'Feathered Wispy Lash', params: { color: '#150f12', mascaraStyle: 'wispy', intensity: 0.95 } },
  { id: 'cat-eye-flare', label: 'Cat-Eye Outer Flare', params: { color: '#140e11', mascaraStyle: 'catEye', intensity: 0.96 } },
  { id: 'babydoll-lift', label: 'Babydoll Center Lift', params: { color: '#150f12', mascaraStyle: 'doll', intensity: 0.94 } },
  { id: 'mega-editorial-lash', label: 'Mega Editorial Faux-Lash', params: { color: '#110b0e', mascaraStyle: 'mega', intensity: 0.98 } },
  { id: 'twiggy-bottom-accent', label: '60s Bottom-Lash Accent', params: { color: '#161013', mascaraStyle: 'bottomAccent', intensity: 0.94 } },
  { id: 'espresso-soft-lash', label: 'Warm Espresso Lash', params: { color: '#3f261b', mascaraStyle: 'lengthening', intensity: 0.9 } },
  { id: 'burgundy-wine-lash', label: 'Burgundy Wine Lash', params: { color: '#5c1a2d', mascaraStyle: 'wispy', intensity: 0.92 } },
  { id: 'cobalt-electric-lash', label: 'Electric Cobalt Lash', params: { color: '#1d47a8', mascaraStyle: 'volumizing', intensity: 0.94 } },
  { id: 'plum-velvet-lash', label: 'Plum Velvet Lash', params: { color: '#451d52', mascaraStyle: 'catEye', intensity: 0.92 } },
];

export const LIPSTICK_OPTIONS: MakeupOption[] = [
  { id: 'bare-rose-satin', label: 'Bare Rose Satin', params: { color: '#c97c7e', finish: 'satin', intensity: 0.88 } },
  { id: 'velvet-crimson-matte', label: 'Velvet Crimson Matte', params: { color: '#a81c2e', finish: 'matte', intensity: 0.96 } },
  { id: 'spiced-chai-matte', label: 'Spiced Chai Matte', params: { color: '#9e6258', finish: 'matte', intensity: 0.92 } },
  { id: 'cherry-syrup-gloss', label: 'Cherry Syrup Gloss', params: { color: '#b9223a', finish: 'gloss', intensity: 0.92 } },
  { id: 'bitten-berry-stain', label: 'Bitten Berry Stain', params: { color: '#8f2442', finish: 'stain', intensity: 0.9 } },
  { id: 'mocha-ombre-90s', label: '90s Mocha Ombré', params: { color: '#6b3b34', color2: '#c98b7c', finish: 'ombre', intensity: 0.94 } },
  { id: 'peach-glaze-lacquer', label: 'Peach Glaze Lacquer', params: { color: '#de7864', finish: 'lacquer', intensity: 0.9 } },
  { id: 'rosewood-cashmere-velvet', label: 'Rosewood Cashmere', params: { color: '#9d515b', finish: 'velvet', intensity: 0.92 } },
  { id: 'ruby-vinyl-mirror', label: 'Ruby Mirror Vinyl', params: { color: '#b5152b', finish: 'vinyl', intensity: 0.96 } },
  { id: 'nude-caramel-satin', label: 'Caramel Nude Satin', params: { color: '#b87b64', finish: 'satin', intensity: 0.9 } },
  { id: 'plum-noir-matte', label: 'Plum Noir Matte', params: { color: '#581934', finish: 'matte', intensity: 0.96 } },
  { id: 'strawberry-jelly-gloss', label: 'Strawberry Jelly Gloss', params: { color: '#d94c6a', finish: 'gloss', intensity: 0.88 } },
  { id: 'terracotta-suede-matte', label: 'Terracotta Suede', params: { color: '#b34f3c', finish: 'matte', intensity: 0.94 } },
  { id: 'champagne-gold-metallic', label: 'Champagne Rose Metallic', params: { color: '#b8766f', color2: '#f3d2b3', finish: 'metallic', intensity: 0.92 } },
  { id: 'wine-merlot-stain', label: 'Wine Merlot Stain', params: { color: '#6b182c', finish: 'stain', intensity: 0.92 } },
  { id: 'mauve-silk-satin', label: 'Mauve Silk Satin', params: { color: '#a86b7e', finish: 'satin', intensity: 0.9 } },
  { id: 'coral-crush-gloss', label: 'Coral Crush Gloss', params: { color: '#e35c4e', finish: 'gloss', intensity: 0.9 } },
  { id: 'espresso-cocoa-ombre', label: 'Espresso Nude Ombré', params: { color: '#522c26', color2: '#bc8170', finish: 'ombre', intensity: 0.95 } },
  { id: 'petal-pink-blurred', label: 'Petal Pink Velvet', params: { color: '#dc7c96', finish: 'velvet', intensity: 0.88 } },
  { id: 'brick-red-classic-matte', label: 'Classic Brick Matte', params: { color: '#9c2c27', finish: 'matte', intensity: 0.95 } },
  { id: 'bronze-pearl-shimmer', label: 'Bronze Pearl Shimmer', params: { color: '#9c5646', color2: '#ebbd94', finish: 'shimmer', intensity: 0.92 } },
  { id: 'blackberry-lacquer', label: 'Blackberry Lacquer', params: { color: '#4d142c', finish: 'lacquer', intensity: 0.96 } },
  { id: 'honey-nectar-balm', label: 'Honey Nectar Balm', params: { color: '#cc7c72', finish: 'balm', intensity: 0.85 } },
  { id: 'scarlet-satin-glam', label: 'Scarlet Satin Glam', params: { color: '#c42130', finish: 'satin', intensity: 0.96 } },
];

export const EYEBROW_OPTIONS: MakeupOption[] = [
  { id: 'natural-feathered', label: 'Natural Feathered', params: { browStyle: 'feathered', intensity: 0.84 } },
  { id: 'soap-laminated', label: 'Soap Laminated Lift', params: { browStyle: 'laminated', intensity: 0.9 } },
  { id: 'sculpted-arch', label: 'Sculpted Editorial Arch', params: { browStyle: 'arched', intensity: 0.9 } },
  { id: 'soft-powder-fill', label: 'Soft Powder Sculpt', params: { browStyle: 'sculpted', intensity: 0.88 } },
  { id: 'straight-editorial', label: 'Straight Model Brow', params: { browStyle: 'straight', intensity: 0.86 } },
  { id: 'fluffy-ombre', label: 'Fluffy Ombré Brow', params: { browStyle: 'ombre', intensity: 0.9 } },
  { id: 'espresso-microblade', label: 'Espresso Microblade', params: { color: '#382218', browStyle: 'feathered', intensity: 0.92 } },
  { id: 'bleached-high-fashion', label: 'Runway Bleached Brow', params: { browStyle: 'bleached', intensity: 0.88 } },
];

export const CONTOUR_OPTIONS: MakeupOption[] = [
  { id: 'soft-sculpt', label: 'Soft Natural Sculpt', params: { contourStyle: 'soft', intensity: 0.72 } },
  { id: 'snatched-cheek', label: 'Snatched Cheekbone', params: { contourStyle: 'snatched', intensity: 0.84 } },
  { id: 'nose-refine', label: 'Precision Nose + Cheek', params: { contourStyle: 'noseFocus', intensity: 0.82 } },
  { id: 'editorial-chisel', label: 'Editorial Chisel', params: { contourStyle: 'editorial', intensity: 0.88 } },
  { id: 'sun-bronze', label: 'Warm Sun Bronzer', params: { contourStyle: 'bronze', intensity: 0.8 } },
  { id: 'cool-taupe-shadow', label: 'Cool Taupe Hollow', params: { color: '#7a635a', contourStyle: 'sculpted', intensity: 0.78 } },
];

export const HIGHLIGHTER_OPTIONS: MakeupOption[] = [
  { id: 'champagne-glass', label: 'Champagne Glass Dew', params: { color: '#ffefd9', highlighterStyle: 'glassSkin', intensity: 0.9 } },
  { id: 'rose-gold-dew', label: 'Rose Gold Dew', params: { color: '#ffd9d6', highlighterStyle: 'glassSkin', intensity: 0.88 } },
  { id: 'pearlescent-icy', label: 'Icy Opal Pearl', params: { color: '#f2f4ff', highlighterStyle: 'strobe', intensity: 0.9 } },
  { id: 'golden-hour-strobe', label: 'Golden Hour Strobe', params: { color: '#ffe3a8', highlighterStyle: 'strobe', intensity: 0.92 } },
  { id: 'soft-candlelight', label: 'Soft Candlelight', params: { color: '#fae6d2', highlighterStyle: 'natural', intensity: 0.78 } },
  { id: 'opal-duochrome', label: 'Opal Lavender Glow', params: { color: '#f5dcff', highlighterStyle: 'editorial', intensity: 0.9 } },
  { id: 'bronze-sunbeam', label: 'Bronze Sunbeam', params: { color: '#f2c18d', highlighterStyle: 'champagne', intensity: 0.88 } },
  { id: 'editorial-wet-shine', label: 'Runway Wet-Look Beam', params: { color: '#ffffff', highlighterStyle: 'editorial', intensity: 0.94 } },
];

export const EDITORIAL_OPTIONS: MakeupOption[] = [
  { id: 'none', label: 'No Face Accents', params: { editorialStyle: 'none' } },
  { id: 'teardrop-pearls', label: 'Outer Wing Pearls', params: { color: '#faf6f0', editorialStyle: 'pearls', intensity: 0.95 } },
  { id: 'under-eye-crystals', label: 'Crystalline Wing + Dot', params: { color: '#e8f4ff', editorialStyle: 'crystals', intensity: 0.95 } },
  { id: 'celestial-stars', label: 'Celestial Starlight', params: { color: '#fff4d4', editorialStyle: 'celestial', intensity: 0.95 } },
  { id: 'gold-leaf-temples', label: '24K Gold Leaf Foil', params: { color: '#e6b85c', editorialStyle: 'goldLeaf', intensity: 0.92 } },
  { id: 'minimal-pearl-dots', label: 'Under-Eye Pearl Dots', params: { color: '#fcf8f2', editorialStyle: 'underEyeDots', intensity: 0.94 } },
  { id: 'diamond-inner-corner', label: 'Inner-Corner Diamond', params: { color: '#eef7ff', editorialStyle: 'innerDiamond', intensity: 0.95 } },
  { id: 'siren-gem-wing', label: 'Siren Diamond Cluster', params: { color: '#f5e8ff', editorialStyle: 'sirenGems', intensity: 0.96 } },
];

export interface MakeupLookPreset {
  id: string;
  name: string;
  vibe: string;
  foundationId: string;
  concealerId: string;
  contourId: string;
  highlighterId: string;
  eyebrowId: string;
  blushId: string;
  eyeshadowId: string;
  eyelinerId: string;
  mascaraId: string;
  lipstickId: string;
  editorialId: string;
}

export const MAKEUP_LOOKS: MakeupLookPreset[] = [
  {
    id: 'clean-girl-dewy',
    name: 'Glass Skin Clean Glow',
    vibe: 'Luminous skin, feathered brows, micro-tightline, glossy bare rose lips',
    foundationId: 'dewy-glass',
    concealerId: 'radiant-serum',
    contourId: 'soft-sculpt',
    highlighterId: 'champagne-glass',
    eyebrowId: 'soap-laminated',
    blushId: 'coral-nectar-dewy',
    eyeshadowId: 'pearl-frost-wet-gloss',
    eyelinerId: 'velvet-tightline',
    mascaraId: 'noir-natural-curl',
    lipstickId: 'honey-nectar-balm',
    editorialId: 'none',
  },
  {
    id: 'classic-paris-red',
    name: 'Parisian Velvet Red',
    vibe: 'Soft-focus complexion, crisp classic wing, timeless crimson matte lip',
    foundationId: 'satin-silk',
    concealerId: 'brightening-eye',
    contourId: 'soft-sculpt',
    highlighterId: 'soft-candlelight',
    eyebrowId: 'natural-feathered',
    blushId: 'rose-petal-classic',
    eyeshadowId: 'champagne-soft-wash',
    eyelinerId: 'obsidian-classic-wing',
    mascaraId: 'obsidian-lengthening',
    lipstickId: 'velvet-crimson-matte',
    editorialId: 'none',
  },
  {
    id: 'siren-fox-glam',
    name: 'Siren Fox-Eye Glam',
    vibe: 'Lifted bronze siren shadow, razor fox-eye liner, mocha ombré lip',
    foundationId: 'full-coverage-studio',
    concealerId: 'lifted-triangle',
    contourId: 'snatched-cheek',
    highlighterId: 'golden-hour-strobe',
    eyebrowId: 'sculpted-arch',
    blushId: 'terracotta-sculpted',
    eyeshadowId: 'bronze-goddess-satin',
    eyelinerId: 'onyx-fox-eye',
    mascaraId: 'cat-eye-flare',
    lipstickId: 'mocha-ombre-90s',
    editorialId: 'none',
  },
  {
    id: 'soft-bridal-rose',
    name: 'Bridal Rose Quartz',
    vibe: 'Romantic rose-quartz halo eye, soft lashes, cashmere rosewood lip',
    foundationId: 'luminous-radiant',
    concealerId: 'peach-corrector',
    contourId: 'soft-sculpt',
    highlighterId: 'rose-gold-dew',
    eyebrowId: 'natural-feathered',
    blushId: 'mauve-cashmere',
    eyeshadowId: 'rose-quartz-halo',
    eyelinerId: 'ink-micro-thin',
    mascaraId: 'feathered-wispy',
    lipstickId: 'bare-rose-satin',
    editorialId: 'minimal-pearl-dots',
  },
  {
    id: '90s-supermodel-espresso',
    name: '90s Espresso Supermodel',
    vibe: 'Chiseled matte contour, smokey espresso lid, carved cocoa ombré lip',
    foundationId: 'velvet-matte',
    concealerId: 'studio-full',
    contourId: 'editorial-chisel',
    highlighterId: 'soft-candlelight',
    eyebrowId: 'espresso-microblade',
    blushId: 'cinnamon-spice',
    eyeshadowId: 'espresso-smokey',
    eyelinerId: 'kohl-smudged-smoke',
    mascaraId: 'ultra-volumizing-black',
    lipstickId: 'espresso-cocoa-ombre',
    editorialId: 'none',
  },
  {
    id: 'sunset-editorial-glow',
    name: 'Golden Hour Editorial',
    vibe: 'Sun-drenched sunset ombré eye, draped peach blush, lacquer lips',
    foundationId: 'dewy-glass',
    concealerId: 'lifted-triangle',
    contourId: 'sun-bronze',
    highlighterId: 'bronze-sunbeam',
    eyebrowId: 'fluffy-ombre',
    blushId: 'plum-velvet-ombre',
    eyeshadowId: 'golden-hour-sunset',
    eyelinerId: 'metallic-gold-wing',
    mascaraId: 'feathered-wispy',
    lipstickId: 'peach-glaze-lacquer',
    editorialId: 'gold-leaf-temples',
  },
  {
    id: 'dark-romance-berry',
    name: 'Dark Romance Merlot',
    vibe: 'Burgundy velvet smoke, draped wine blush, bitten merlot stain',
    foundationId: 'soft-focus-blur',
    concealerId: 'brightening-eye',
    contourId: 'cool-taupe-shadow',
    highlighterId: 'pearlescent-icy',
    eyebrowId: 'sculpted-arch',
    blushId: 'berry-wine-draped',
    eyeshadowId: 'burgundy-velvet-smokey',
    eyelinerId: 'burgundy-fox-eye',
    mascaraId: 'burgundy-wine-lash',
    lipstickId: 'wine-merlot-stain',
    editorialId: 'none',
  },
  {
    id: 'coquette-doll-pink',
    name: 'Coquette Doll Flush',
    vibe: 'Sakura igari cheeks, babydoll lashes, strawberry jelly gloss, pearls',
    foundationId: 'satin-silk',
    concealerId: 'radiant-serum',
    contourId: 'soft-sculpt',
    highlighterId: 'rose-gold-dew',
    eyebrowId: 'straight-editorial',
    blushId: 'sakura-igari',
    eyeshadowId: 'peach-sorbet-matte',
    eyelinerId: 'espresso-puppy-liner',
    mascaraId: 'babydoll-lift',
    lipstickId: 'strawberry-jelly-gloss',
    editorialId: 'teardrop-pearls',
  },
  {
    id: 'ice-queen-opal',
    name: 'Opal Prism Runway',
    vibe: 'Holographic opal glitter, floating silver crease, icy glass strobe',
    foundationId: 'dewy-glass',
    concealerId: 'brightening-eye',
    contourId: 'cool-taupe-shadow',
    highlighterId: 'opal-duochrome',
    eyebrowId: 'bleached-high-fashion',
    blushId: 'lavender-cool-pop',
    eyeshadowId: 'opal-prism-glitter',
    eyelinerId: 'silver-chrome-floating',
    mascaraId: 'mega-editorial-lash',
    lipstickId: 'petal-pink-blurred',
    editorialId: 'siren-gem-wing',
  },
  {
    id: 'runway-emerald-foil',
    name: 'Emerald Siren Couture',
    vibe: 'Metallic emerald wing shadow, sculpted nose contour, caramel satin lip',
    foundationId: 'full-coverage-studio',
    concealerId: 'lifted-triangle',
    contourId: 'nose-refine',
    highlighterId: 'golden-hour-strobe',
    eyebrowId: 'soap-laminated',
    blushId: 'burnt-sienna-bronze',
    eyeshadowId: 'emerald-siren',
    eyelinerId: 'emerald-cat-eye',
    mascaraId: 'mega-editorial-lash',
    lipstickId: 'nude-caramel-satin',
    editorialId: 'diamond-inner-corner',
  },
  {
    id: 'cobalt-high-fashion',
    name: 'Cobalt Graphic Studio',
    vibe: 'Runway cobalt graphic eye, editorial wet-shine highlight, vinyl lip',
    foundationId: 'satin-silk',
    concealerId: 'studio-full',
    contourId: 'editorial-chisel',
    highlighterId: 'editorial-wet-shine',
    eyebrowId: 'straight-editorial',
    blushId: 'apricot-cloud-matte',
    eyeshadowId: 'cobalt-graphic-wash',
    eyelinerId: 'editorial-cobalt-wing',
    mascaraId: 'cobalt-electric-lash',
    lipstickId: 'spiced-chai-matte',
    editorialId: 'under-eye-crystals',
  },
  {
    id: 'ruby-noir-evening',
    name: 'Ruby Noir Gala',
    vibe: 'Sharp ruby cut-crease, dramatic studio wing, mirror vinyl crimson lip',
    foundationId: 'full-coverage-studio',
    concealerId: 'studio-full',
    contourId: 'snatched-cheek',
    highlighterId: 'champagne-glass',
    eyebrowId: 'sculpted-arch',
    blushId: 'rosewood-sculpt',
    eyeshadowId: 'ruby-noir-cut-crease',
    eyelinerId: 'dramatic-bold-wing',
    mascaraId: 'mega-editorial-lash',
    lipstickId: 'ruby-vinyl-mirror',
    editorialId: 'celestial-stars',
  },
];
