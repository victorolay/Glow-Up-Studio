import { getChallenge } from '@/data/catalog';
import { hintCost, hintFor, HINT_TIERS, totalHintPenalty } from '@/game/engine/hints';
import { SCORING_CONFIG } from '@/data/config/scoring';

const challenge = getChallenge('sunny-beach-day')!;

describe('hints', () => {
  it('exposes exactly three tiers in cost order', () => {
    expect(HINT_TIERS).toEqual(['vibe', 'category', 'spoiler']);
    expect(hintCost('vibe')).toBeLessThan(hintCost('category'));
    expect(hintCost('category')).toBeLessThan(hintCost('spoiler'));
  });

  it('reads hint text from challenge data, never hard-coded', () => {
    expect(hintFor(challenge, 'vibe')).toBe(challenge.hints[0]);
    expect(hintFor(challenge, 'category')).toBe(challenge.hints[1]);
    expect(hintFor(challenge, 'spoiler')).toBe(challenge.hints[2]);
  });

  it('costs match the scoring config', () => {
    expect(hintCost('vibe')).toBe(SCORING_CONFIG.hintCosts.vibe);
    expect(hintCost('spoiler')).toBe(SCORING_CONFIG.hintCosts.spoiler);
  });

  it('sums penalties for all used tiers', () => {
    expect(totalHintPenalty([])).toBe(0);
    expect(totalHintPenalty(['vibe'])).toBe(SCORING_CONFIG.hintCosts.vibe);
    expect(totalHintPenalty(['vibe', 'category', 'spoiler'])).toBe(
      SCORING_CONFIG.hintCosts.vibe + SCORING_CONFIG.hintCosts.category + SCORING_CONFIG.hintCosts.spoiler,
    );
  });

  it('ignores duplicate tiers', () => {
    expect(totalHintPenalty(['vibe', 'vibe'])).toBe(SCORING_CONFIG.hintCosts.vibe);
  });
});
