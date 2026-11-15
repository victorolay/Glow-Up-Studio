import { getAsset } from '@/assets';
import { GENERATORS } from '@/assets/placeholder/registry';
import { ASSET_BUDGETS } from '@/data/config/assets';
import { SKIN_TONES } from '@/data/items/customization';

/**
 * Placeholder assets are code-generated; this guards the per-asset ceiling from
 * AGENT.md §9 so the art pipeline (and any future binary swap) stays inside the
 * documented stage budgets.
 */
const MAX_ASSET_BYTES = 50 * 1024;

const REPRESENTATIVE_PARAMS = {
  skinTone: SKIN_TONES[3],
  pose: 'handOnHip' as const,
  glow: 3,
  color: '#e89070',
  color2: '#a9c8e0',
  pattern: 'floral' as const,
  shine: true,
  freckles: true,
  beautyMark: true,
  iris: '#6b4a35',
  hairColor: '#6b4230',
  intensity: 0.7,
  finish: 'gloss' as const,
  parting: 'center' as const,
};

describe('asset budget policy', () => {
  it('documents a budget for every stage', () => {
    const stages = [
      'challengeSelect',
      'skincare',
      'makeup',
      'hair',
      'outfit',
      'accessories',
      'photoShoot',
      'results',
    ];
    for (const stage of stages) expect(ASSET_BUDGETS[stage as keyof typeof ASSET_BUDGETS]).toBeDefined();
  });

  it('every generator produces a data URI under the per-asset ceiling', () => {
    for (const id of Object.keys(GENERATORS)) {
      const src = getAsset(id, REPRESENTATIVE_PARAMS);
      const bytes = new TextEncoder().encode(src).length;
      expect(bytes).toBeLessThan(MAX_ASSET_BYTES);
    }
  });
});
