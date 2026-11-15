import { layerZ, LAYER_ORDER, orderComposableLayers, resolveHiddenIds } from '@/game/engine/layers';

describe('layer order', () => {
  it('follows AGENT.md §6 ordering', () => {
    expect(LAYER_ORDER).toEqual([
      'body',
      'skin',
      'makeup',
      'face',
      'hairBack',
      'bottoms',
      'swim',
      'tops',
      'dress',
      'outerwear',
      'shoes',
      'accessory',
      'hairFront',
    ]);
  });

  it('layer z increases monotonically', () => {
    for (let i = 1; i < LAYER_ORDER.length; i++) {
      expect(layerZ(LAYER_ORDER[i])).toBeGreaterThan(layerZ(LAYER_ORDER[i - 1]));
    }
  });
});

describe('resolveHiddenIds', () => {
  const dress = { id: 'out-gala-gown', layer: 'dress' as const, occludes: ['tops', 'bottoms', 'swim'] as const };
  const top = { id: 'out-tank', layer: 'tops' as const, occludes: [] as const };
  const shorts = { id: 'out-denim-shorts', layer: 'bottoms' as const, occludes: [] as const };
  const bikini = { id: 'out-bikini', layer: 'swim' as const, occludes: ['tops', 'bottoms'] as const };

  it('a dress hides worn tops and bottoms', () => {
    const hidden = resolveHiddenIds([dress, top, shorts]);
    expect(hidden.has('out-tank')).toBe(true);
    expect(hidden.has('out-denim-shorts')).toBe(true);
    expect(hidden.has('out-gala-gown')).toBe(false);
  });

  it('no occlusion without a covering garment', () => {
    const hidden = resolveHiddenIds([top, shorts]);
    expect(hidden.size).toBe(0);
  });

  it('swim occludes separates when worn together', () => {
    const hidden = resolveHiddenIds([bikini, top, shorts]);
    expect(hidden.has('out-tank')).toBe(true);
    expect(hidden.has('out-denim-shorts')).toBe(true);
  });

  it('is symmetric with occlusion direction — top does not hide dress', () => {
    const hidden = resolveHiddenIds([top, dress]);
    expect(hidden.has('out-gala-gown')).toBe(false);
    expect(hidden.has('out-tank')).toBe(true);
  });
});

describe('orderComposableLayers', () => {
  it('sorts layers into stable z order regardless of input order', () => {
    const ordered = orderComposableLayers([
      { key: 'a', layer: 'hairFront', src: 'a', alt: '' },
      { key: 'b', layer: 'body', src: 'b', alt: '' },
      { key: 'c', layer: 'dress', src: 'c', alt: '' },
      { key: 'd', layer: 'accessory', src: 'd', alt: '' },
    ]);
    expect(ordered.map((l) => l.key)).toEqual(['b', 'c', 'd', 'a']);
    expect(ordered[0].z).toBeLessThan(ordered[1].z);
    expect(ordered[3].z).toBeGreaterThan(ordered[2].z);
  });

  it('respects intra-layer z offsets', () => {
    const ordered = orderComposableLayers([
      { key: 'necklace', layer: 'accessory', zOffset: 0, src: 'n', alt: '' },
      { key: 'hat', layer: 'accessory', zOffset: 15, src: 'h', alt: '' },
    ]);
    expect(ordered[0].key).toBe('necklace');
    expect(ordered[1].key).toBe('hat');
  });

  it('passes blend and opacity through', () => {
    const ordered = orderComposableLayers([
      { key: 'blush', layer: 'makeup', src: 'b', alt: '', blend: 'soft-light', opacity: 0.6 },
    ]);
    expect(ordered[0].blend).toBe('soft-light');
    expect(ordered[0].opacity).toBe(0.6);
  });
});
