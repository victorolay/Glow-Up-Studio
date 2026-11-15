import { getAsset } from '@/assets';
import type { AssetParams } from '@/assets';
import {
  getAccessoryItem,
  getHairColor,
  getHairItem,
  getMakeupItem,
  getOutfitItem,
  getSkinTone,
  outfitVariant,
} from '@/data/catalog';
import { DEFAULT_EYE_COLOR_ID, EYE_COLORS } from '@/data/items/customization';
import {
  OUTFIT_SLOT_LAYER,
  orderComposableLayers,
  resolveHiddenIds,
} from '@/game/engine/layers';
import type { ComposableLayer } from '@/game/engine/layers';
import { useCharacterStore } from '@/game/store/characterStore';
import type { AccessorySlot, LayerId, MakeupSlot, OutfitSlot, RenderLayer } from '@/game/types';
import { useMemo } from 'react';

const MAKEUP_Z: Record<MakeupSlot, number> = {
  foundation: 0,
  concealer: 1,
  blush: 2,
  eyeshadow: 3,
  eyeliner: 4,
  mascara: 5,
  lipstick: 6,
};

const ACCESSORY_Z: Partial<Record<AccessorySlot, number>> = {
  necklace: 0,
  anklet: 1,
  earrings: 2,
  bag: 3,
  glasses: 4,
  hairAccessory: 5,
  watch: 6,
  scarf: 7,
  hat: 15, // hats sit above hairFront so brims cover the fringe
};

/**
 * Slots that render on wardrobe layers instead of the accessory band:
 * tights sit under bottoms, gloves above tops but under dresses/outerwear,
 * belts above dresses but below outerwear.
 */
const SLOT_LAYER_OVERRIDE: Partial<Record<AccessorySlot, { layer: LayerId; zOffset: number }>> = {
  hosiery: { layer: 'bottoms', zOffset: -1 },
  gloves: { layer: 'tops', zOffset: 9 },
  belt: { layer: 'dress', zOffset: 8 },
};

const OUTFIT_SLOT_LABEL: Record<OutfitSlot, string> = {
  dress: 'dress',
  top: 'top',
  bottom: 'bottoms',
  outerwear: 'outerwear',
  swim: 'swimwear',
  shoes: 'shoes',
};

const LINER_STYLE_BY_ITEM: Record<string, 'thin' | 'winged' | 'bold'> = {
  'mk-el-thin': 'thin',
  'mk-el-winged': 'winged',
  'mk-el-bold': 'bold',
};

const FALLBACK_TONE = { id: 'honey', name: 'Honey', base: '#e3b491', shadow: '#bd8e6c' };

/** Build the ordered render layer stack from the current character state. */
export function useCharacterLayers(): RenderLayer[] {
  const char = useCharacterStore();
  return useMemo(() => {
    const layers: ComposableLayer[] = [];
    const tone = getSkinTone(char.skinToneId) ?? FALLBACK_TONE;
    const hairColor =
      char.hair.colorCustom ??
      getHairColor(char.hair.variantId ?? 'chestnut')?.base ??
      '#6b4230';
    const base: AssetParams = {
      skinTone: tone,
      pose: char.pose,
      hairColor,
    };

    // Body
    layers.push({
      key: 'body',
      layer: 'body',
      src: getAsset('placeholder_body', base),
      alt: 'Base figure',
    });

    // Skin state: concerns fade as steps complete, glow builds (§5.2)
    const sk = char.skincare.completed;
    const stepCount = Object.values(sk).filter(Boolean).length;
    const glow = Math.round((stepCount / 7) * 5);
    layers.push({
      key: 'skin',
      layer: 'skin',
      src: getAsset('placeholder_skin', {
        ...base,
        glow,
        concerns: {
          blemishes: !sk.blemish,
          dryness: !sk.moisturizer,
          darkCircles: !sk.moisturizer,
          oiliness: !(sk.cleanse && sk.mask),
        },
      }),
      alt: 'Skin state',
    });

    // Makeup
    for (const slot of Object.keys(char.makeup) as MakeupSlot[]) {
      const sel = char.makeup[slot];
      if (!sel) continue;
      const item = getMakeupItem(sel.itemId);
      if (!item) continue;
      const variant = item.variants?.find((v) => v.id === sel.variantId) ?? item.variants?.[0];
      const mp: AssetParams = {
        ...base,
        color: item.autoMatchSkinTone ? tone.base : variant?.colors.primary,
        color2: variant?.colors.secondary,
        intensity: sel.intensity,
        finish: sel.finish,
        linerStyle: slot === 'eyeliner' ? LINER_STYLE_BY_ITEM[item.id] : undefined,
      };
      layers.push({
        key: `mk-${slot}`,
        layer: 'makeup',
        zOffset: MAKEUP_Z[slot],
        src: getAsset(item.asset, mp),
        blend: item.blend,
        opacity: item.baseOpacity !== undefined ? item.baseOpacity * sel.intensity : undefined,
        alt: item.name,
      });
    }

    // Face features
    const iris = EYE_COLORS.find((e) => e.id === (char.eyeColorId || DEFAULT_EYE_COLOR_ID))?.hex;
    layers.push({
      key: 'face',
      layer: 'face',
      src: getAsset('placeholder_face', {
        ...base,
        freckles: char.freckles,
        beautyMark: char.beautyMark,
        iris,
      }),
      alt: 'Face',
    });

    // Hair (back + front)
    if (char.hair.styleId) {
      const hair = getHairItem(char.hair.styleId);
      if (hair) {
        const variant = hair.variants.find((v) => v.id === char.hair.variantId) ?? hair.variants[0];
        const hp: AssetParams = {
          ...base,
          color: char.hair.colorCustom ?? variant?.colors.primary,
          shine: char.hair.shine,
          parting: char.hair.parting,
        };
        layers.push({
          key: 'hair-back',
          layer: 'hairBack',
          src: getAsset(hair.asset, { ...hp, hairBack: true }),
          alt: `${hair.name} (back)`,
        });
        layers.push({
          key: 'hair-front',
          layer: 'hairFront',
          src: getAsset(hair.asset, { ...hp, hairBack: false }),
          alt: `${hair.name} (front)`,
        });
      }
    }

    // Outfit (with occlusion safety net)
    const worn = (Object.keys(char.outfit) as OutfitSlot[])
      .map((slot) => {
        const sel = char.outfit[slot];
        if (!sel) return null;
        const item = getOutfitItem(sel.itemId);
        if (!item) return null;
        return { slot, sel, item, layer: OUTFIT_SLOT_LAYER[slot] };
      })
      .filter((w): w is NonNullable<typeof w> => w !== null);
    const hidden = resolveHiddenIds(
      worn.map((w) => ({ id: w.item.id, layer: w.layer, occludes: w.item.occludes })),
    );
    for (const w of worn) {
      if (hidden.has(w.item.id)) continue;
      const variant = outfitVariant(w.item, w.sel.variantId);
      layers.push({
        key: `out-${w.slot}`,
        layer: w.layer,
        src: getAsset(w.item.asset, {
          ...base,
          color: variant?.colors.primary,
          color2: variant?.colors.secondary,
          pattern: variant?.pattern,
        }),
        alt: `${w.item.name} (${OUTFIT_SLOT_LABEL[w.slot]})`,
      });
    }

    // Accessories
    for (const slot of Object.keys(char.accessories) as AccessorySlot[]) {
      const sel = char.accessories[slot];
      if (!sel) continue;
      const item = getAccessoryItem(sel.itemId);
      if (!item) continue;
      const variant = item.variants?.find((v) => v.id === sel.variantId) ?? item.variants?.[0];
      const override = SLOT_LAYER_OVERRIDE[slot];
      layers.push({
        key: `acc-${slot}`,
        layer: override?.layer ?? 'accessory',
        zOffset: override ? override.zOffset : (ACCESSORY_Z[slot] ?? 0),
        src: getAsset(item.asset, {
          ...base,
          color: variant?.colors.primary,
          color2: variant?.colors.secondary,
          pattern: variant?.pattern,
        }),
        alt: `${item.name} (${slot})`,
      });
    }

    return orderComposableLayers(layers);
  }, [char]);
}

/** Face region in canvas percentages, for stage overlays (blemish taps etc.). */
export const FACE_OVERLAY = {
  left: '41.5%',
  top: '5.5%',
  width: '17%',
  height: '11.5%',
};

/** Blemish tap targets in canvas percentages. */
export const BLEMISH_POINTS = [
  { id: 'b1', x: 45.3, y: 11.6 },
  { id: 'b2', x: 54.5, y: 11.5 },
  { id: 'b3', x: 49.8, y: 13.2 },
];
