import type { MakeupSlot, PaletteFamily, SkincareStepId } from '@/game/types';

/**
 * All scoring constants live here (AGENT.md §5.9: keep weights and tag-matching
 * rules in data/config, never scattered through code).
 */
export const SCORING_CONFIG = {
  /** Category weights — must sum to 100. */
  weights: {
    challengeFit: 40,
    cohesion: 20,
    beautyPrep: 15,
    stylingDetails: 15,
    photoBackground: 10,
  },
  /** Challenge fit pools. */
  requiredPool: 70,
  bonusPool: 30,
  penaltyPerHit: 15,
  /** Cohesion. */
  paletteClashPenalty: 12,
  paletteClashFloor: 35,
  styleMixPenalty: 25,
  /** Beauty prep split. */
  skinShare: 0.6,
  makeupShare: 0.4,
  /** Styling details split (hair / shoes / accessories). */
  stylingShares: { hair: 0.4, shoes: 0.3, accessories: 0.3 },
  /** A sub-score counts as "on brief" after this many tag hits. */
  detailTagHitsForFull: 2,
  accessoryOnBriefScore: 100,
  accessoryOffBriefScore: 40,
  accessoryNoneWornScore: 30,
  /** Photo & background. */
  backgroundMatchScore: 100,
  backgroundTagScore: 60,
  filterBonus: 10,
  /** Hint costs, subtracted from the final score per tier used. */
  hintCosts: { vibe: 3, category: 7, spoiler: 12 },
  /** 5→1 star thresholds on the final 0-100 score. */
  starThresholds: [90, 80, 68, 55, 40],
  /** Coin rewards. */
  coins: { base: 20, perStar: 15, highScoreBonus: 50, highScoreAt: 90 },
  /** Judge feedback. */
  maxJudgeComments: 3,
} as const;

/** Makeup slots counted for beauty-prep completeness. */
export const ALL_MAKEUP_SLOTS: MakeupSlot[] = [
  'foundation',
  'concealer',
  'blush',
  'eyeshadow',
  'eyeliner',
  'mascara',
  'lipstick',
];

/**
 * Palette harmony: a family is compatible with the families in its list
 * (symmetric — keep both directions in sync).
 */
export const PALETTE_HARMONY: Record<PaletteFamily, PaletteFamily[]> = {
  warm: ['warm', 'neutral', 'earth'],
  cool: ['cool', 'neutral', 'jewel'],
  neutral: ['warm', 'cool', 'neutral', 'pastel', 'jewel', 'earth'],
  pastel: ['pastel', 'neutral', 'cool'],
  jewel: ['jewel', 'neutral', 'cool'],
  earth: ['earth', 'warm', 'neutral'],
};

export function palettesCompatible(a: PaletteFamily, b: PaletteFamily): boolean {
  return PALETTE_HARMONY[a].includes(b) && PALETTE_HARMONY[b].includes(a);
}

/** Progression starting wallet. */
export const STARTING_COINS = 120;

/**
 * Skin health meter points granted per completed skincare step.
 * Sums to 100 for a full routine (AGENT.md §5.2).
 */
export const SKINCARE_STEP_POINTS: Record<SkincareStepId, number> = {
  scan: 5,
  cleanse: 15,
  blemish: 15,
  mask: 15,
  serum: 15,
  moisturizer: 20,
  sunscreen: 15,
};
