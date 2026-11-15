import { SCORING_CONFIG } from '@/data/config/scoring';
import { CHALLENGES } from '@/data/challenges';
import { getBackground, getChallenge, getFilter, getOutfitItem } from '@/data/catalog';
import { buildGradeInput } from '@/game/engine/gradeInput';
import { grade, starsFor, type GradeInput } from '@/game/engine/scoring';
import type { LookState } from '@/game/engine/gradeInput';

const beachChallenge = getChallenge('sunny-beach-day')!;
const galaChallenge = getChallenge('black-tie-gala')!;

function makeLook(overrides: Partial<LookState> = {}): LookState {
  return {
    makeup: {
      foundation: { itemId: 'mk-foundation', variantId: 'match' },
      blush: { itemId: 'mk-blush-rose', variantId: 'rose' },
      mascara: { itemId: 'mk-mascara', variantId: 'black' },
      lipstick: { itemId: 'mk-lip-bare', variantId: 'bare' },
    },
    hair: { styleId: 'hair-beach-braids', variantId: 'chestnut' },
    outfit: {
      dress: { itemId: 'dress_aline_sundress', variantId: 'signature' },
      shoes: { itemId: 'shoe_barefoot' },
      outerwear: { itemId: 'swim_resort_kaftan', variantId: 'signature' },
    },
    accessories: {
      glasses: { itemId: 'shades_cateye', variantId: 'signature' },
      hat: { itemId: 'acc_sun_hat', variantId: 'signature' },
      hairAccessory: { itemId: 'acc-flower-tropical', variantId: 'hibiscus' },
      anklet: { itemId: 'acc-anklet-beads', variantId: 'turquoise' },
    },
    ...overrides,
  };
}

function gradeLook(look: LookState, opts: Partial<GradeInput> = {}) {
  const input: GradeInput = {
    ...buildGradeInput(look, beachChallenge, getBackground('bg-sandy-beach'), getFilter('golden'), [], 100, 4),
    ...opts,
  };
  return grade(input);
}

describe('scoring config integrity', () => {
  it('weights sum to 100', () => {
    const sum = Object.values(SCORING_CONFIG.weights).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it('star thresholds are descending', () => {
    const t = SCORING_CONFIG.starThresholds;
    for (let i = 1; i < t.length; i++) expect(t[i - 1]).toBeGreaterThan(t[i]);
  });
});

describe('starsFor', () => {
  it.each([
    [95, 5],
    [85, 4],
    [70, 3],
    [60, 2],
    [45, 1],
    [0, 1],
  ])('maps %i → %i stars', (total, stars) => {
    expect(starsFor(total)).toBe(stars);
  });
});

describe('grade — sunny beach day', () => {
  it('gives a top score to an on-brief beach look', () => {
    const result = gradeLook(makeLook());
    expect(result.total).toBeGreaterThan(70);
    expect(result.stars).toBeGreaterThanOrEqual(4);
  });

  it('is deterministic — identical inputs produce identical results', () => {
    const a = gradeLook(makeLook());
    const b = gradeLook(makeLook());
    expect(b).toEqual(a);
  });

  it('every category carries reasons and weighted ≤ max', () => {
    const result = gradeLook(makeLook());
    for (const cat of result.categories) {
      expect(cat.reasons.length).toBeGreaterThan(0);
      expect(cat.weighted).toBeLessThanOrEqual(cat.max + 0.001);
    }
  });

  it('total equals weighted sum minus hint penalty', () => {
    const withHints = gradeLook(makeLook(), { hintsUsed: ['vibe', 'category'] });
    const withoutHints = gradeLook(makeLook());
    const weightedSum = withoutHints.categories.reduce((sum, c) => sum + c.weighted, 0);
    expect(withHints.total).toBe(
      Math.round(Math.max(0, Math.min(100, weightedSum - 3 - 7))),
    );
  });

  it('penalizes formal pieces on a beach challenge with a reason', () => {
    const look = makeLook({
      outfit: { dress: { itemId: 'dress_mermaid_gown', variantId: 'signature' }, shoes: { itemId: 'shoe_ballet_flats', variantId: 'signature' } },
    });
    const result = gradeLook(look);
    const fit = result.categories.find((c) => c.key === 'challengeFit')!;
    const penalty = fit.reasons.find((r) => r.code === 'penalty-worn');
    expect(penalty).toBeDefined();
    expect(penalty!.points).toBeLessThan(0);
    expect(result.total).toBeLessThan(gradeLook(makeLook()).total);
  });

  it('flags clashing color families in cohesion', () => {
    const clashing = gradeLook(
      makeLook({
        makeup: { lipstick: { itemId: 'mk-lip-red', variantId: 'red' } }, // warm
      }),
    );
    const cohesion = clashing.categories.find((c) => c.key === 'cohesion')!;
    // With lilac hair (pastel) vs warm lip — expect a clash reason or lower cohesion than harmonious.
    const harmonious = gradeLook(makeLook()).categories.find((c) => c.key === 'cohesion')!;
    expect(cohesion.raw).toBeLessThanOrEqual(harmonious.raw);
  });

  it('mixing refined and relaxed pieces triggers the style-mix reason', () => {
    const mixed = gradeLook(
      makeLook({
        outfit: {
          dress: { itemId: 'dress_mermaid_gown', variantId: 'signature' },
          shoes: { itemId: 'shoe_barefoot' },
        },
      }),
    );
    const cohesion = mixed.categories.find((c) => c.key === 'cohesion')!;
    expect(cohesion.reasons.some((r) => r.code === 'style-mix')).toBe(true);
  });

  it('rewards the ideal background over a mismatched one', () => {
    const ideal = gradeLook(makeLook(), { background: getBackground('bg-sandy-beach') });
    const mismatch = gradeLook(makeLook(), { background: getBackground('bg-soft-studio') });
    const idealPhoto = ideal.categories.find((c) => c.key === 'photoBackground')!.raw;
    const mismatchPhoto = mismatch.categories.find((c) => c.key === 'photoBackground')!.raw;
    expect(idealPhoto).toBeGreaterThan(mismatchPhoto);
  });

  it('awards coins per config (base + stars + high-score bonus)', () => {
    const result = gradeLook(makeLook());
    const expected =
      SCORING_CONFIG.coins.base +
      result.stars * SCORING_CONFIG.coins.perStar +
      (result.total >= SCORING_CONFIG.coins.highScoreAt ? SCORING_CONFIG.coins.highScoreBonus : 0);
    expect(result.coins).toBe(expected);
  });

  it('always produces at least one judge comment', () => {
    const result = gradeLook(makeLook());
    expect(result.judgeComments.length).toBeGreaterThan(0);
    expect(result.judgeComments.length).toBeLessThanOrEqual(SCORING_CONFIG.maxJudgeComments);
  });

  it('beauty prep reflects skin health and makeup completeness', () => {
    const glow = gradeLook(makeLook(), { skinHealth: 100, makeupUsedSlots: 7 });
    const bare = gradeLook(makeLook(), { skinHealth: 0, makeupUsedSlots: 0 });
    const glowPrep = glow.categories.find((c) => c.key === 'beautyPrep')!.raw;
    const barePrep = bare.categories.find((c) => c.key === 'beautyPrep')!.raw;
    expect(glowPrep).toBe(100);
    expect(barePrep).toBe(0);
  });
});

describe('grade — free play and other challenges', () => {
  it('handles open briefs (free play) without required tags', () => {
    const freePlay = CHALLENGES.find((c) => c.freePlay)!;
    const result = grade(buildGradeInput(makeLook(), freePlay, undefined, getFilter('none'), [], 100, 4));
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.categories.find((c) => c.key === 'challengeFit')!.raw).toBeGreaterThanOrEqual(70);
  });

  it('scores a gala look higher on the gala challenge than a beach look', () => {
    const galaLook = makeLook({
      makeup: { foundation: { itemId: 'mk-foundation', variantId: 'match' }, lipstick: { itemId: 'mk-lip-red', variantId: 'red' }, mascara: { itemId: 'mk-mascara', variantId: 'black' } },
      hair: { styleId: 'hair-sleek-bun', variantId: 'jet' },
      outfit: { dress: { itemId: 'dress_mermaid_gown', variantId: 'signature' }, shoes: { itemId: 'shoe_ballet_flats', variantId: 'signature' } },
      accessories: { earrings: { itemId: 'ear_pearl_drops', variantId: 'gold' } },
    });
    const beachLook = makeLook();
    const galaForGala = grade(buildGradeInput(galaLook, galaChallenge, getBackground('bg-soft-studio'), getFilter('none'), [], 100, 5));
    const beachForGala = grade(buildGradeInput(beachLook, galaChallenge, getBackground('bg-sandy-beach'), getFilter('golden'), [], 100, 4));
    expect(galaForGala.total).toBeGreaterThan(beachForGala.total);
  });
});

describe('item data sanity used by scoring', () => {
  it('sundress carries beach + light-fabric tags', () => {
    const dress = getOutfitItem('dress_aline_sundress')!;
    expect(dress.tags).toContain('beach');
    expect(dress.tags).toContain('light-fabric');
  });
});
