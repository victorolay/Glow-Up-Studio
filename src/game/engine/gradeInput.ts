import type { StyleTag } from '@/data/config/tags';
import {
  getAccessoryItem,
  getHairItem,
  getMakeupItem,
  getOutfitItem,
} from '@/data/catalog';
import type {
  AccessorySlot,
  BackgroundDef,
  FilterDef,
  MakeupSlot,
  OutfitSlot,
  PaletteFamily,
} from '@/game/types';
import type { GradeInput } from './scoring';

/**
 * Structural snapshot of the character look — satisfied by the character store
 * state without importing it (keeps the engine independent from zustand).
 */
export interface LookState {
  makeup: Partial<Record<MakeupSlot, { itemId: string; variantId?: string }>>;
  hair: { styleId?: string; variantId?: string; colorCustom?: string };
  outfit: Partial<Record<OutfitSlot, { itemId: string; variantId?: string }>>;
  accessories: Partial<Record<AccessorySlot, { itemId: string; variantId?: string }>>;
}

/**
 * Build the pure GradeInput from a look snapshot plus session context.
 * Collects merged tags, palette families, and per-detail tag sets.
 */
export function buildGradeInput(
  look: LookState,
  challenge: GradeInput['challenge'],
  background: BackgroundDef | undefined,
  filter: FilterDef | undefined,
  hintsUsed: readonly string[],
  skinHealth: number,
  makeupUsedSlots: number,
): GradeInput {
  const wornTags = new Set<StyleTag>();
  const palette: PaletteFamily[] = [];
  const hairTags: StyleTag[] = [];
  const shoesTags: StyleTag[] = [];
  const accessoryTagSets: StyleTag[][] = [];

  const pushTags = (tags: readonly StyleTag[]): StyleTag[] => {
    for (const t of tags) wornTags.add(t);
    return [...tags];
  };

  // Outfit
  for (const sel of Object.values(look.outfit)) {
    if (!sel) continue;
    const item = getOutfitItem(sel.itemId);
    if (!item) continue;
    const variant = item.variants.find((v) => v.id === sel.variantId);
    pushTags([...item.tags, ...(variant?.tags ?? [])]);
    if (variant) palette.push(variant.family);
    if (item.category === 'shoes') shoesTags.push(...item.tags, ...(variant?.tags ?? []));
  }

  // Hair
  if (look.hair.styleId) {
    const hair = getHairItem(look.hair.styleId);
    if (hair) {
      hairTags.push(...pushTags(hair.tags));
      const color = look.hair.colorCustom
        ? undefined
        : hair.variants.find((v) => v.id === look.hair.variantId);
      if (color) {
        palette.push(color.family);
      } else {
        palette.push('neutral'); // custom colors score as neutral
      }
    }
  }

  // Accessories
  for (const sel of Object.values(look.accessories)) {
    if (!sel) continue;
    const item = getAccessoryItem(sel.itemId);
    if (!item) continue;
    const variant = item.variants?.find((v) => v.id === sel.variantId);
    const tags = pushTags([...item.tags, ...(variant?.tags ?? [])]);
    accessoryTagSets.push(tags);
    if (variant) palette.push(variant.family);
  }

  // Makeup (tags participate in the brief; lipstick color joins the palette)
  for (const sel of Object.values(look.makeup)) {
    if (!sel) continue;
    const item = getMakeupItem(sel.itemId);
    if (!item) continue;
    pushTags(item.tags);
    const variant = item.variants?.find((v) => v.id === sel.variantId);
    if (variant) palette.push(variant.family);
  }

  return {
    challenge,
    wornTags: [...wornTags],
    detail: { hairTags, shoesTags, accessoryTagSets },
    palette,
    skinHealth,
    makeupUsedSlots,
    background,
    filter,
    hintsUsed,
  };
}
