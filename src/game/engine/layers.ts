import type { BlendMode, LayerId, OutfitSlot, RenderLayer } from '@/game/types';

/**
 * Character layer compositing rules (AGENT.md §6):
 * body → skin → makeup → face → hair(back) → bottoms → swim → tops →
 * dress → outerwear → shoes → accessories → hair(front).
 */
export const LAYER_ORDER: readonly LayerId[] = [
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
] as const;

export function layerBaseIndex(layer: LayerId): number {
  const i = LAYER_ORDER.indexOf(layer);
  return i < 0 ? 0 : i * 10;
}

/** Absolute z index for a layer with an optional intra-layer offset. */
export function layerZ(layer: LayerId, offset = 0): number {
  return layerBaseIndex(layer) + offset;
}

/** Map an outfit slot to the character layer its items render on. */
export const OUTFIT_SLOT_LAYER: Record<OutfitSlot, LayerId> = {
  dress: 'dress',
  top: 'tops',
  bottom: 'bottoms',
  outerwear: 'outerwear',
  swim: 'swim',
  shoes: 'shoes',
};

/**
 * Store-level mirror of garment `occludes` rules: selecting the key slot clears
 * the listed slots (a dress hides tops/bottoms/swim, a swimsuit hides separates).
 */
export const SLOT_OCCLUDES: Partial<Record<OutfitSlot, OutfitSlot[]>> = {
  dress: ['top', 'bottom', 'swim'],
  swim: ['top', 'bottom'],
};

export interface OcclusionItem {
  id: string;
  layer: LayerId;
  occludes?: readonly LayerId[];
}

/**
 * Ids of worn items that are visually hidden because another worn item
 * occludes their layer. Pure and unit-tested.
 */
export function resolveHiddenIds(items: readonly OcclusionItem[]): Set<string> {
  const wornLayers = new Set(items.map((i) => i.layer));
  const hidden = new Set<string>();
  for (const item of items) {
    for (const target of item.occludes ?? []) {
      if (!wornLayers.has(target)) continue;
      for (const other of items) {
        if (other.layer === target) hidden.add(other.id);
      }
    }
  }
  return hidden;
}

export interface ComposableLayer {
  key: string;
  layer: LayerId;
  /** Optional offset within the layer band (e.g. accessory stacking order). */
  zOffset?: number;
  src: string;
  blend?: BlendMode;
  opacity?: number;
  alt: string;
}

/** Sort composable layers into their stable render order. */
export function orderComposableLayers(layers: readonly ComposableLayer[]): RenderLayer[] {
  return [...layers]
    .sort(
      (a, b) =>
        layerBaseIndex(a.layer) + (a.zOffset ?? 0) - (layerBaseIndex(b.layer) + (b.zOffset ?? 0)) ||
        a.key.localeCompare(b.key),
    )
    .map((l) => ({
      key: l.key,
      src: l.src,
      z: layerBaseIndex(l.layer) + (l.zOffset ?? 0),
      blend: l.blend,
      opacity: l.opacity,
      alt: l.alt,
    }));
}
