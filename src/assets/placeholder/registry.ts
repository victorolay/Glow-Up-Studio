import type { AssetParams } from './params';
import { ACCESSORY_GENERATORS } from './accessoriesArt';
import { backgroundAsset } from './backgroundArt';
import { CLOTHING_GENERATORS } from './clothingArt';
import { bodyAsset, faceAsset, skinAsset } from './figure';
import { HAIR_GENERATORS } from './hairArt';
import {
  blushAsset,
  concealerAsset,
  eyelinerAsset,
  eyeshadowAsset,
  foundationAsset,
  lipstickAsset,
  mascaraAsset,
} from './makeupArt';
import { toUri } from './primitives';

type Generator = (p: AssetParams) => string;

/**
 * Asset registry (AGENT.md §6). Layer ids dispatch to:
 *  - `placeholder_body|skin|face` — the base figure layers (figure.ts)
 *  - `placeholder_makeup_*` — makeup products (makeupArt.ts)
 *  - `placeholder_hair_*` — hairstyles (hairArt.ts)
 *  - wardrobe ids (`top_*`, `dress_*`, `bot_*`, `out_*`, `swim_*`, `shoe_*`) —
 *    CLOTHING_GENERATORS (clothingArt.ts)
 *  - accessory ids (`bag_*`, `shades_*`, `ear_*`, `neck_*`, `watch_*`,
 *    `acc_*`) — ACCESSORY_GENERATORS (accessoriesArt.ts), including the
 *    legacy `placeholder_acc_flower_tropical` / `placeholder_acc_anklet_beads`
 *  - `placeholder_bg_*` — photo backdrops (backgroundArt.ts)
 */
export const GENERATORS: Record<string, Generator> = {
  placeholder_body: (p) => bodyAsset(p),
  placeholder_skin: (p) => skinAsset(p),
  placeholder_face: (p) => faceAsset(p),
  placeholder_makeup_foundation: (p) => foundationAsset(p),
  placeholder_makeup_concealer: (p) => concealerAsset(p),
  placeholder_makeup_blush: (p) => blushAsset(p),
  placeholder_makeup_eyeshadow: (p) => eyeshadowAsset(p),
  placeholder_makeup_eyeliner_thin: (p) => eyelinerAsset({ ...p, linerStyle: 'thin' }),
  placeholder_makeup_eyeliner_winged: (p) => eyelinerAsset({ ...p, linerStyle: 'winged' }),
  placeholder_makeup_eyeliner_bold: (p) => eyelinerAsset({ ...p, linerStyle: 'bold' }),
  placeholder_makeup_mascara: (p) => mascaraAsset(p),
  placeholder_makeup_lipstick: (p) => lipstickAsset(p),
  ...HAIR_GENERATORS,
  placeholder_bg_sandy_beach: () => backgroundAsset('placeholder_bg_sandy_beach'),
  placeholder_bg_beach_cafe: () => backgroundAsset('placeholder_bg_beach_cafe'),
  placeholder_bg_golden_dunes: () => backgroundAsset('placeholder_bg_golden_dunes'),
  placeholder_bg_soft_studio: () => backgroundAsset('placeholder_bg_soft_studio'),
  placeholder_bg_cafe_terrace: () => backgroundAsset('placeholder_bg_cafe_terrace'),
  placeholder_bg_city_street: () => backgroundAsset('placeholder_bg_city_street'),
  placeholder_bg_rooftop: () => backgroundAsset('placeholder_bg_rooftop'),
  placeholder_bg_office: () => backgroundAsset('placeholder_bg_office'),
  placeholder_bg_ballroom: () => backgroundAsset('placeholder_bg_ballroom'),
  placeholder_bg_pumpkin_patch: () => backgroundAsset('placeholder_bg_pumpkin_patch'),
  placeholder_bg_snowy_village: () => backgroundAsset('placeholder_bg_snowy_village'),
  placeholder_bg_cozy_den: () => backgroundAsset('placeholder_bg_cozy_den'),
  placeholder_bg_club_lounge: () => backgroundAsset('placeholder_bg_club_lounge'),
  placeholder_bg_owambe_hall: () => backgroundAsset('placeholder_bg_owambe_hall'),
  ...CLOTHING_GENERATORS,
  ...ACCESSORY_GENERATORS,
};

const cache = new Map<string, string>();

/** Resolve an asset id to a data URI with the given params (memoized). */
export function getAsset(id: string, params: AssetParams = {}): string {
  const key = `${id}|${JSON.stringify(params)}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const gen = GENERATORS[id];
  const src = gen ? gen(params) : toUri('');
  cache.set(key, src);
  return src;
}

export type { AssetParams };
