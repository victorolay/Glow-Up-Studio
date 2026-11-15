import { SCORING_CONFIG } from '@/data/config/scoring';
import type { Challenge, HintTier } from '@/game/types';

export const HINT_TIERS: readonly HintTier[] = ['vibe', 'category', 'spoiler'] as const;

/** Hint text for a tier, always sourced from challenge data (AGENT.md §5.7). */
export function hintFor(challenge: Challenge, tier: HintTier): string {
  const idx = HINT_TIERS.indexOf(tier);
  return challenge.hints[idx] ?? '';
}

export function hintCost(tier: HintTier): number {
  return SCORING_CONFIG.hintCosts[tier];
}

/** Total score penalty for the tiers used so far (duplicates ignored). */
export function totalHintPenalty(used: readonly HintTier[]): number {
  const unique = [...new Set(used)];
  return unique.reduce((sum, tier) => sum + hintCost(tier), 0);
}
