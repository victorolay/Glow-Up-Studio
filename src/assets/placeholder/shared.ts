import { shade } from './primitives';
import type { AssetParams } from './params';
import type { SkinTone } from '@/game/types';

/*
 * Shared fabric/metal infrastructure for the wardrobe (clothingArt.ts) and
 * accessory (accessoriesArt.ts) generators: fabric ramps, the shared
 * blur/metal/gem defs block, cast-shadow coloring, and catalog entry typing.
 */

export interface FabricRamp {
  specular: string;
  light: string;
  mid: string;
  mid2: string;
  dark: string;
  deep: string;
}

export function ramp(base: string): FabricRamp {
  return {
    specular: shade(base, 0.48),
    light: shade(base, 0.25),
    mid: base,
    mid2: shade(base, -0.15),
    dark: shade(base, -0.32),
    deep: shade(base, -0.52),
  };
}

export const FALLBACK_TONE: SkinTone = { id: 'honey', name: 'Honey', base: '#e3b491', shadow: '#bd8e6c' };

export function castShadowColor(p: AssetParams): string {
  const tone = p.skinTone ?? FALLBACK_TONE;
  return shade(tone.base, -0.46);
}

export const SHARED_DEFS = `
  <filter id="cBlur2" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="1280">
    <feGaussianBlur stdDeviation="2.0" />
  </filter>
  <filter id="cBlur4" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="1280">
    <feGaussianBlur stdDeviation="4.2" />
  </filter>
  <filter id="cBlur8" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="1280">
    <feGaussianBlur stdDeviation="8.0" />
  </filter>
  <linearGradient id="metalGold" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#FFF7C8" />
    <stop offset="35%" stop-color="#E6C35C" />
    <stop offset="75%" stop-color="#B08728" />
    <stop offset="100%" stop-color="#6B4D0F" />
  </linearGradient>
  <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#FFFFFF" />
    <stop offset="40%" stop-color="#D4DCE3" />
    <stop offset="80%" stop-color="#8A949E" />
    <stop offset="100%" stop-color="#4B5259" />
  </linearGradient>
  <linearGradient id="metalRose" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#FFE4DC" />
    <stop offset="45%" stop-color="#E2A496" />
    <stop offset="85%" stop-color="#AD6A5B" />
    <stop offset="100%" stop-color="#6E392E" />
  </linearGradient>
  <radialGradient id="pearlGrad" cx="35%" cy="32%" r="65%">
    <stop offset="0%" stop-color="#FFFFFF" />
    <stop offset="45%" stop-color="#F6F1EA" />
    <stop offset="85%" stop-color="#D9CFC4" />
    <stop offset="100%" stop-color="#B0A395" />
  </radialGradient>
  <radialGradient id="gemFacet" cx="35%" cy="32%" r="65%">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.92" />
    <stop offset="40%" stop-color="#E8F6FF" stop-opacity="0.45" />
    <stop offset="100%" stop-color="#1E3A5F" stop-opacity="0" />
  </radialGradient>
`;

export function defsBlock(r: FabricRamp, extra = ''): string {
  return `
    <defs>
      ${SHARED_DEFS}
      <linearGradient id="fBody" x1="12%" y1="8%" x2="88%" y2="90%">
        <stop offset="0%" stop-color="${r.light}" />
        <stop offset="35%" stop-color="${r.mid}" />
        <stop offset="72%" stop-color="${r.mid2}" />
        <stop offset="100%" stop-color="${r.dark}" />
      </linearGradient>
      <linearGradient id="fVert" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="${r.light}" />
        <stop offset="45%" stop-color="${r.mid}" />
        <stop offset="85%" stop-color="${r.dark}" />
        <stop offset="100%" stop-color="${r.deep}" />
      </linearGradient>
      <linearGradient id="fSheer" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="${r.specular}" stop-opacity="0.58" />
        <stop offset="50%" stop-color="${r.mid}" stop-opacity="0.42" />
        <stop offset="100%" stop-color="${r.dark}" stop-opacity="0.68" />
      </linearGradient>
      <radialGradient id="fBustL" cx="38%" cy="35%" r="62%">
        <stop offset="0%" stop-color="${r.specular}" stop-opacity="0.72" />
        <stop offset="50%" stop-color="${r.light}" stop-opacity="0.34" />
        <stop offset="88%" stop-color="${r.dark}" stop-opacity="0.22" />
        <stop offset="100%" stop-color="${r.deep}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="fBustR" cx="42%" cy="35%" r="62%">
        <stop offset="0%" stop-color="${r.light}" stop-opacity="0.54" />
        <stop offset="50%" stop-color="${r.mid}" stop-opacity="0.28" />
        <stop offset="88%" stop-color="${r.dark}" stop-opacity="0.28" />
        <stop offset="100%" stop-color="${r.deep}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="fSheen" cx="40%" cy="34%" r="62%">
        <stop offset="0%" stop-color="${r.specular}" stop-opacity="0.62" />
        <stop offset="60%" stop-color="${r.light}" stop-opacity="0.16" />
        <stop offset="100%" stop-color="${r.mid}" stop-opacity="0" />
      </radialGradient>
      ${extra}
    </defs>
  `;
}

export interface StyleCatalogEntry {
  id: string;
  name: string;
  category: string;
  defaultColor: string;
  defaultColor2?: string;
}

export function metalUrl(metal?: string): string {
  if (metal === 'silver') return 'url(#metalSilver)';
  if (metal === 'rose') return 'url(#metalRose)';
  return 'url(#metalGold)';
}

/** Exact two-leg trouser contour generator matching figure.ts leg separation at (300, 669) and calf curvature. */
export function fittedPantsPath(opts: {
  topY: number;
  hemY: number;
  fit: 'skinny' | 'straight' | 'wide';
}): string {
  const { topY, hemY, fit } = opts;
  const topHalfW = topY <= 495 ? 58 : topY <= 545 ? 82 : 106;
  const topL = 300 - topHalfW;
  const topR = 300 + topHalfW;
  const ease = fit === 'skinny' ? 2.5 : fit === 'straight' ? 6 : 15;

  const hipSection =
    topY <= 525
      ? `M ${topL} ${topY} C ${topL - 10} 548, ${185 - ease * 0.4} 584, ${184 - ease * 0.4} 623`
      : `M ${topL} ${topY} C ${194 - ease * 0.4} 580, ${185 - ease * 0.4} 602, ${184 - ease * 0.4} 623`;

  const hipRightSection =
    topY <= 525
      ? `C ${415 + ease * 0.4} 584, ${topR + 10} 548, ${topR} ${topY}`
      : `C ${415 + ease * 0.4} 602, ${406 + ease * 0.4} 580, ${topR} ${topY}`;

  if (hemY <= 760) {
    const t = Math.max(0, Math.min(1, (hemY - 670) / 100));
    const lOutX = 186 - ease * 0.4 + t * 10;
    const lInX = 298 - t * 5;
    const rInX = 302 + t * 5;
    const rOutX = 414 + ease * 0.4 - t * 10;
    return (
      `${hipSection} C ${183 - ease * 0.4} 668, ${lOutX} ${hemY - 20}, ${lOutX} ${hemY} ` +
      `C ${lOutX + 35} ${hemY + 8}, ${lInX - 20} ${hemY + 8}, ${lInX} ${hemY} ` +
      `C 299 ${hemY - 25}, 300 695, 300 676 ` +
      `C 300 695, 301 ${hemY - 25}, ${rInX} ${hemY} ` +
      `C ${rInX + 20} ${hemY + 8}, ${rOutX - 35} ${hemY + 8}, ${rOutX} ${hemY} ` +
      `C ${rOutX} ${hemY - 20}, ${417 + ease * 0.4} 668, ${414 + ease * 0.4} 623 ${hipRightSection} Z`
    );
  }

  const lOuterKnee = fit === 'wide' ? 190 : 220 - ease * 0.7;
  const lInnerKnee = fit === 'wide' ? 286 : 279 + ease * 0.4;
  const rInnerKnee = 600 - lInnerKnee;
  const rOuterKnee = 600 - lOuterKnee;

  const lOuterCalf = fit === 'wide' ? 186 : 210 - ease * 0.8;
  const lInnerCalf = fit === 'wide' ? 290 : 288 + ease * 0.3;
  const rInnerCalf = 600 - lInnerCalf;
  const rOuterCalf = 600 - lOuterCalf;

  const lOuterHem = fit === 'skinny' ? 233 : fit === 'straight' ? 220 : 188;
  const lInnerHem = fit === 'skinny' ? 269 : fit === 'straight' ? 280 : 294;
  const rInnerHem = 600 - lInnerHem;
  const rOuterHem = 600 - lOuterHem;

  return (
    `${hipSection} ` +
    `C ${183 - ease * 0.4} 668, ${182 - ease * 0.4} 716, ${192 - ease * 0.5} 768 ` +
    `C ${203 - ease * 0.6} 820, ${213 - ease * 0.6} 868, ${lOuterKnee} 906 ` +
    `C ${214 - ease * 0.7} 956, ${lOuterCalf} 1005, ${222 - ease * 0.5} 1099 ` +
    `C ${228 - ease * 0.4} 1132, ${lOuterHem} 1152, ${lOuterHem} ${hemY} ` +
    `C ${lOuterHem + 14} ${hemY + 6}, ${lInnerHem - 14} ${hemY + 6}, ${lInnerHem} ${hemY} ` +
    `C ${lInnerHem + 2} 1145, ${lInnerCalf} 1065, ${lInnerCalf} 1005 ` +
    `C ${lInnerCalf} 955, ${lInnerKnee} 922, ${lInnerKnee} 903 ` +
    `C 286 850, 297 770, 300 676 ` +
    `C 303 770, 314 850, ${rInnerKnee} 903 ` +
    `C ${rInnerKnee} 922, ${rInnerCalf} 955, ${rInnerCalf} 1005 ` +
    `C ${rInnerCalf} 1065, ${rInnerHem - 2} 1145, ${rInnerHem} ${hemY} ` +
    `C ${rInnerHem + 14} ${hemY + 6}, ${rOuterHem - 14} ${hemY + 6}, ${rOuterHem} ${hemY} ` +
    `C ${rOuterHem} 1152, ${372 + ease * 0.4} 1132, ${378 + ease * 0.5} 1099 ` +
    `C ${rOuterCalf} 1005, ${386 + ease * 0.7} 956, ${rOuterKnee} 906 ` +
    `C ${387 + ease * 0.6} 868, ${397 + ease * 0.6} 820, ${408 + ease * 0.5} 768 ` +
    `C ${418 + ease * 0.4} 716, ${417 + ease * 0.4} 668, ${414 + ease * 0.4} 623 ${hipRightSection} Z`
  );
}
