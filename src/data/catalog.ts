import type {
  AccessoryItem,
  BackgroundDef,
  Challenge,
  FilterDef,
  HairColorDef,
  HairItem,
  MakeupItem,
  OutfitItem,
  SkinTone,
  Wearable,
} from '@/game/types';
import { BACKGROUNDS, FILTERS } from './backgrounds';
import { CHALLENGES } from './challenges';
import { HAIR_COLORS, SKIN_TONES } from './items/customization';
import { ACCESSORY_ITEMS } from './items/accessories';
import { HAIR_ITEMS } from './items/hair';
import { MAKEUP_ITEMS } from './items/makeup';
import { OUTFIT_ITEMS } from './items/outfits';

export { OUTFIT_ITEMS, outfitVariant } from './items/outfits';
export { ACCESSORY_ITEMS } from './items/accessories';
export { HAIR_ITEMS } from './items/hair';
export { MAKEUP_ITEMS, MAKEUP_PRESETS, SKINCARE_PRODUCTS } from './items/makeup';
export { SKIN_TONES, HAIR_COLORS } from './items/customization';
export { BACKGROUNDS, FILTERS } from './backgrounds';
export { CHALLENGES } from './challenges';

export const ALL_WEARABLES: Wearable[] = [...OUTFIT_ITEMS, ...ACCESSORY_ITEMS, ...HAIR_ITEMS, ...MAKEUP_ITEMS];

const OUTFIT_CATEGORIES = ['dress', 'top', 'bottom', 'outerwear', 'swim', 'shoes'] as const;

function getOutfitItem(id: string): OutfitItem | undefined {
  const item = ALL_WEARABLES.find((i) => i.id === id);
  return item && (OUTFIT_CATEGORIES as readonly string[]).includes(item.category)
    ? (item as OutfitItem)
    : undefined;
}

function getAccessoryItem(id: string): AccessoryItem | undefined {
  const item = ALL_WEARABLES.find((i) => i.id === id);
  return item && item.category === 'accessory' ? item : undefined;
}

function getHairItem(id: string): HairItem | undefined {
  const item = ALL_WEARABLES.find((i) => i.id === id);
  return item && item.category === 'hair' ? item : undefined;
}

function getMakeupItem(id: string): MakeupItem | undefined {
  const item = ALL_WEARABLES.find((i) => i.id === id);
  return item && item.category === 'makeup' ? item : undefined;
}

function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

function getBackground(id: string): BackgroundDef | undefined {
  return BACKGROUNDS.find((b) => b.id === id);
}

function getFilter(id: string): FilterDef | undefined {
  return FILTERS.find((f) => f.id === id);
}

function getSkinTone(id: string): SkinTone | undefined {
  return SKIN_TONES.find((t) => t.id === id);
}

function getHairColor(id: string): HairColorDef | undefined {
  return HAIR_COLORS.find((c) => c.id === id);
}

export {
  getOutfitItem,
  getAccessoryItem,
  getHairItem,
  getMakeupItem,
  getChallenge,
  getBackground,
  getFilter,
  getSkinTone,
  getHairColor,
};
