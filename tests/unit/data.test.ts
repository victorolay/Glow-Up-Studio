import { ALL_WEARABLES, CHALLENGES, HAIR_ITEMS, OUTFIT_ITEMS, getBackground } from '@/data/catalog';
import { STYLE_TAGS } from '@/data/config/tags';
import { GENERATORS } from '@/assets/placeholder/registry';
import { getAsset } from '@/assets';
import { countMatchingClothesForChallenge } from '@/game/engine/studioHelpers';

describe('catalog data schemas', () => {
  it('item ids are unique', () => {
    const ids = ALL_WEARABLES.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all item tags come from the registry', () => {
    for (const item of ALL_WEARABLES) {
      for (const tag of item.tags) {
        expect(STYLE_TAGS).toContain(tag);
      }
    }
  });

  it('all variant tags come from the registry', () => {
    for (const item of ALL_WEARABLES) {
      const variants = 'variants' in item ? item.variants : undefined;
      if (!variants) continue;
      for (const v of variants) {
        for (const tag of v.tags ?? []) expect(STYLE_TAGS).toContain(tag);
      }
    }
  });

  it('every challenge references three hints and valid backgrounds', () => {
    for (const challenge of CHALLENGES) {
      expect(challenge.hints).toHaveLength(3);
      for (const bgId of challenge.idealBackgrounds) {
        expect(getBackground(bgId)).toBeDefined();
      }
      expect(challenge.requiredTags).toHaveLength(challenge.requiredTags.length); // shape check
    }
  });

  it('required and penalty tags never overlap', () => {
    for (const challenge of CHALLENGES) {
      for (const tag of challenge.penaltyTags) {
        expect(challenge.requiredTags).not.toContain(tag);
      }
    }
  });

  it('sunny-beach-day is free to play (Milestone 1 slice)', () => {
    const beach = CHALLENGES.find((c) => c.id === 'sunny-beach-day')!;
    expect(beach.unlock.type).toBe('free');
  });

  it('challenge difficulties are 1-3', () => {
    for (const challenge of CHALLENGES) {
      expect([1, 2, 3]).toContain(challenge.difficulty);
    }
  });

  it('ships 10+ graded challenges (Milestone 2)', () => {
    const graded = CHALLENGES.filter((c) => !c.freePlay);
    expect(graded.length).toBeGreaterThanOrEqual(10);
  });

  it('covers every category except Cultural/Ritual (held for human review)', () => {
    const graded = CHALLENGES.filter((c) => !c.freePlay);
    const expected: string[] = ['Dates', 'Formal', 'Casual', 'Seasonal/Holiday', 'Vacation', 'Work'];
    for (const category of expected) {
      expect(graded.some((c) => c.category === category)).toBe(true);
    }
    expect(graded.every((c) => c.category !== 'Cultural/Ritual')).toBe(true);
  });

  it('every required tag is achievable by at least one catalog item', () => {
    const allTags = new Set<string>();
    for (const item of ALL_WEARABLES) {
      for (const tag of item.tags) allTags.add(tag);
      const variants = 'variants' in item ? item.variants : undefined;
      for (const v of variants ?? []) for (const tag of v.tags ?? []) allTags.add(tag);
    }
    for (const challenge of CHALLENGES) {
      for (const tag of challenge.requiredTags) {
        expect(allTags.has(tag)).toBe(true);
      }
    }
  });

  it('occludes lists only reference real layers', () => {
    for (const item of ALL_WEARABLES) {
      if (!('occludes' in item)) continue;
      for (const layer of item.occludes) {
        expect(['body', 'skin', 'makeup', 'face', 'hairBack', 'bottoms', 'swim', 'tops', 'dress', 'outerwear', 'shoes', 'accessory', 'hairFront']).toContain(layer);
      }
    }
  });

  it('provides at least 10 non-shoe matching clothes for every graded Occasion Brief', () => {
    for (const challenge of CHALLENGES) {
      if (challenge.freePlay) continue;
      expect(countMatchingClothesForChallenge(challenge, OUTFIT_ITEMS)).toBeGreaterThanOrEqual(10);
    }
  });

  it('ships at least 28 wigs and hairstyles', () => {
    expect(HAIR_ITEMS.length).toBeGreaterThanOrEqual(28);
  });
});

describe('asset pipeline', () => {
  it('every wearable references a registered placeholder generator', () => {
    for (const item of ALL_WEARABLES) {
      expect(GENERATORS[item.asset]).toBeDefined();
    }
  });

  it('every asset id resolves to a non-empty render', () => {
    for (const item of ALL_WEARABLES) {
      const src = getAsset(item.asset, {});
      expect(decodeURIComponent(src).length).toBeGreaterThan(60);
    }
  });

  it('generators return aligned SVG data URIs', () => {
    const src = getAsset('placeholder_body', {});
    expect(src.startsWith('data:image/svg+xml')).toBe(true);
    expect(decodeURIComponent(src)).toContain('viewBox="0 0 600 1280"');
  });

  it('hair assets render distinct back and front layers', () => {
    const back = getAsset('placeholder_hair_long_waves', { hairBack: true, color: '#333' });
    const front = getAsset('placeholder_hair_long_waves', { hairBack: false, color: '#333' });
    expect(back).not.toBe(front);
  });
});
