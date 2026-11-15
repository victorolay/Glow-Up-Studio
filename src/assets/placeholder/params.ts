import type { LipFinish, Parting, Pattern, PoseId, SkinTone } from '@/game/types';

/** Parameters resolved at render time by the character compositor. */
export interface AssetParams {
  skinTone?: SkinTone;
  pose?: PoseId;
  /** Skincare glow level 0-5. */
  glow?: number;
  concerns?: { blemishes: boolean; dryness: boolean; darkCircles: boolean; oiliness: boolean };
  /** Primary / secondary colors for tintable assets. */
  color?: string;
  color2?: string;
  pattern?: Pattern;
  parting?: Parting;
  shine?: boolean;
  freckles?: boolean;
  beautyMark?: boolean;
  iris?: string;
  hairColor?: string;
  /** Makeup intensity 0-1. */
  intensity?: number;
  finish?: LipFinish;
  /** Which half of a two-layer (back/front) asset to render. */
  hairBack?: boolean;
  /** Eyeliner style variant — mirrors makeupArt's EyelinerStyle union. */
  linerStyle?:
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
}
