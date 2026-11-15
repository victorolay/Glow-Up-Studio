import type { StyleTag } from '@/data/config/tags';

/* ---------- Layers & rendering ---------- */

/** Ordered character layers, bottom → top. See AGENT.md §6. */
export type LayerId =
  | 'body'
  | 'skin'
  | 'makeup'
  | 'face'
  | 'hairBack'
  | 'bottoms'
  | 'swim'
  | 'tops'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'accessory'
  | 'hairFront';

export type BlendMode = 'normal' | 'multiply' | 'soft-light';

export type PoseId = 'relaxed' | 'handOnHip' | 'twirl';

/** A rendered layer instruction for the character compositor. */
export interface RenderLayer {
  key: string;
  src: string;
  z: number;
  blend?: BlendMode;
  opacity?: number;
  alt: string;
}

/* ---------- Items ---------- */

export type ItemCategory =
  | 'dress'
  | 'top'
  | 'bottom'
  | 'outerwear'
  | 'swim'
  | 'shoes'
  | 'accessory'
  | 'hair'
  | 'makeup';

export type PaletteFamily = 'warm' | 'cool' | 'neutral' | 'pastel' | 'jewel' | 'earth';

export type Pattern = 'solid' | 'floral' | 'stripes' | 'polka' | 'stripe' | 'houndstooth' | 'leopard';

export interface Variant {
  id: string;
  name: string;
  colors: { primary: string; secondary?: string };
  family: PaletteFamily;
  pattern?: Pattern;
  /** Extra style tags contributed when this variant is worn (e.g. 'floral'). */
  tags?: StyleTag[];
}

export interface Unlock {
  type: 'free' | 'coins' | 'stars';
  cost?: number;
}

export interface BaseItem {
  id: string;
  name: string;
  tags: StyleTag[];
  unlock: Unlock;
  /** Asset registry id (placeholder_ prefixed until real art lands). */
  asset: string;
}

export type OutfitSlot = 'dress' | 'top' | 'bottom' | 'outerwear' | 'swim' | 'shoes';

export interface OutfitItem extends BaseItem {
  category: 'dress' | 'top' | 'bottom' | 'outerwear' | 'swim' | 'shoes';
  layer: LayerId;
  /** LayerIds hidden when this item is worn (e.g. a dress hides tops and bottoms). */
  occludes: LayerId[];
  variants: Variant[];
}

export type AccessorySlot =
  | 'glasses'
  | 'hat'
  | 'necklace'
  | 'earrings'
  | 'bag'
  | 'hairAccessory'
  | 'anklet'
  | 'watch'
  | 'scarf'
  | 'belt'
  | 'hosiery'
  | 'gloves';

export interface AccessoryItem extends BaseItem {
  category: 'accessory';
  slot: AccessorySlot;
  variants?: Variant[];
}

export interface HairItem extends BaseItem {
  category: 'hair';
  variants: Variant[];
}

export type MakeupSlot =
  | 'foundation'
  | 'concealer'
  | 'blush'
  | 'eyeshadow'
  | 'eyeliner'
  | 'mascara'
  | 'lipstick';

export type LipFinish =
  | 'matte'
  | 'satin'
  | 'gloss'
  | 'stain'
  | 'velvet'
  | 'balm'
  | 'ombre'
  | 'lacquer'
  | 'vinyl'
  | 'metallic'
  | 'shimmer'
  | 'glitter';

export interface MakeupItem extends BaseItem {
  category: 'makeup';
  slot: MakeupSlot;
  blend: BlendMode;
  baseOpacity?: number;
  variants?: Variant[];
  /** Foundation/concealer auto-match the selected skin tone. */
  autoMatchSkinTone?: boolean;
}

export type Wearable = OutfitItem | AccessoryItem | HairItem | MakeupItem;

/* ---------- Skincare ---------- */

export type SkincareStepId =
  | 'scan'
  | 'cleanse'
  | 'blemish'
  | 'mask'
  | 'serum'
  | 'moisturizer'
  | 'sunscreen';

export interface SkincareProduct {
  id: string;
  name: string;
  step: SkincareStepId;
  description: string;
  colors: { primary: string };
}

/* ---------- Challenges ---------- */

export type ChallengeCategory =
  | 'Dates'
  | 'Formal'
  | 'Casual'
  | 'Seasonal/Holiday'
  | 'Vacation'
  | 'Cultural/Ritual'
  | 'Work';

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  description: string;
  difficulty: 1 | 2 | 3;
  requiredTags: StyleTag[];
  bonusTags: StyleTag[];
  penaltyTags: StyleTag[];
  idealBackgrounds: string[];
  hints: [string, string, string];
  unlock: Unlock;
  /** Free Play mode: no grading. */
  freePlay?: boolean;
}

/* ---------- Photo ---------- */

export interface BackgroundDef {
  id: string;
  name: string;
  tags: StyleTag[];
  asset: string;
}

export interface FilterDef {
  id: string;
  name: string;
  css: string;
  tags: StyleTag[];
}

export interface PhotoShot {
  id: string;
  backgroundId: string;
  poseId: PoseId;
  filterId: string;
  dataUrl: string;
}

/* ---------- Base customization ---------- */

export interface SkinTone {
  id: string;
  name: string;
  base: string;
  shadow: string;
}

export interface HairColorDef {
  id: string;
  name: string;
  base: string;
  family: PaletteFamily;
}

export type Parting = 'left' | 'center' | 'right';

/* ---------- Hints ---------- */

export type HintTier = 'vibe' | 'category' | 'spoiler';
