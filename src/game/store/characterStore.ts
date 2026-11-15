import { DEFAULT_BACKGROUND_ID, DEFAULT_FILTER_ID } from '@/data/backgrounds';
import { SLOT_OCCLUDES } from '@/game/engine/layers';
import { SCORING_CONFIG, SKINCARE_STEP_POINTS } from '@/data/config/scoring';
import { DEFAULT_HAIR_COLOR_ID, DEFAULT_SKIN_TONE_ID } from '@/data/items/customization';
import type {
  AccessorySlot,
  LipFinish,
  MakeupSlot,
  OutfitSlot,
  Parting,
  PhotoShot,
  PoseId,
  SkincareStepId,
} from '@/game/types';
import { create } from 'zustand';

export interface VariantSelection {
  itemId: string;
  variantId?: string;
}

export interface MakeupSelection {
  itemId: string;
  variantId?: string;
  intensity: number;
  finish?: LipFinish;
}

interface SkincareState {
  completed: Record<SkincareStepId, boolean>;
  skinHealth: number;
}

interface CharacterData {
  skinToneId: string;
  eyeColorId: string;
  freckles: boolean;
  beautyMark: boolean;
  skincare: SkincareState;
  makeup: Partial<Record<MakeupSlot, MakeupSelection>>;
  hair: { styleId?: string; variantId?: string; colorCustom?: string; parting: Parting; shine: boolean };
  outfit: Partial<Record<OutfitSlot, VariantSelection>>;
  accessories: Partial<Record<AccessorySlot, VariantSelection>>;
  pose: PoseId;
  backgroundId: string;
  filterId: string;
  shots: PhotoShot[];
  favoriteShotId?: string;
}

interface CharacterActions {
  setSkinTone: (id: string) => void;
  setEyeColor: (id: string) => void;
  toggleFreckles: () => void;
  toggleBeautyMark: () => void;
  completeSkincareStep: (step: SkincareStepId) => void;
  resetSkincare: () => void;
  setMakeup: (slot: MakeupSlot, selection: MakeupSelection | null) => void;
  setHairStyle: (styleId: string) => void;
  setHairColor: (patch: { variantId?: string; colorCustom?: string }) => void;
  setParting: (parting: Parting) => void;
  setShine: (shine: boolean) => void;
  setOutfit: (slot: OutfitSlot, selection: VariantSelection | null) => void;
  setAccessory: (slot: AccessorySlot, selection: VariantSelection | null) => void;
  setPose: (pose: PoseId) => void;
  setBackground: (id: string) => void;
  setFilter: (id: string) => void;
  addShot: (shot: PhotoShot) => void;
  deleteShot: (id: string) => void;
  setFavorite: (id: string) => void;
  resetForChallenge: () => void;
}

export type CharacterStore = CharacterData & CharacterActions;

const DEFAULT_SKINCARE: SkincareState = {
  completed: {
    scan: false,
    cleanse: false,
    blemish: false,
    mask: false,
    serum: false,
    moisturizer: false,
    sunscreen: false,
  },
  skinHealth: 0,
};

const DEFAULT_HAIR = { variantId: DEFAULT_HAIR_COLOR_ID, parting: 'center', shine: true } as const;

const initialData: CharacterData = {
  skinToneId: DEFAULT_SKIN_TONE_ID,
  eyeColorId: 'brown',
  freckles: false,
  beautyMark: false,
  skincare: { ...DEFAULT_SKINCARE, completed: { ...DEFAULT_SKINCARE.completed } },
  makeup: {},
  hair: { ...DEFAULT_HAIR, parting: 'center', shine: true },
  outfit: {},
  accessories: {},
  pose: 'relaxed',
  backgroundId: DEFAULT_BACKGROUND_ID,
  filterId: DEFAULT_FILTER_ID,
  shots: [],
  favoriteShotId: undefined,
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  ...initialData,

  setSkinTone: (id) => set({ skinToneId: id }),
  setEyeColor: (id) => set({ eyeColorId: id }),
  toggleFreckles: () => set((s) => ({ freckles: !s.freckles })),
  toggleBeautyMark: () => set((s) => ({ beautyMark: !s.beautyMark })),

  completeSkincareStep: (step) =>
    set((s) => {
      if (s.skincare.completed[step]) return s;
      const health = Math.min(
        100,
        s.skincare.skinHealth + SKINCARE_STEP_POINTS[step],
      );
      return {
        skincare: { completed: { ...s.skincare.completed, [step]: true }, skinHealth: health },
      };
    }),

  resetSkincare: () =>
    set({ skincare: { ...DEFAULT_SKINCARE, completed: { ...DEFAULT_SKINCARE.completed } } }),

  setMakeup: (slot, selection) =>
    set((s) => {
      const makeup = { ...s.makeup };
      if (selection === null) delete makeup[slot];
      else makeup[slot] = selection;
      return { makeup };
    }),

  setHairStyle: (styleId) =>
    set((s) => ({ hair: { ...s.hair, styleId, colorCustom: undefined, variantId: DEFAULT_HAIR_COLOR_ID } })),
  setHairColor: (patch) => set((s) => ({ hair: { ...s.hair, ...patch } })),
  setParting: (parting) => set((s) => ({ hair: { ...s.hair, parting } })),
  setShine: (shine) => set((s) => ({ hair: { ...s.hair, shine } })),

  setOutfit: (slot, selection) =>
    set((s) => {
      const outfit = { ...s.outfit };
      if (selection === null) {
        delete outfit[slot];
        return { outfit };
      }
      outfit[slot] = selection;
      // Occlusion enforcement: dress hides tops/bottoms/swim, swim hides separates (§6).
      for (const target of SLOT_OCCLUDES[slot] ?? []) delete outfit[target];
      if (slot === 'top' || slot === 'bottom' || slot === 'swim') delete outfit.dress;
      return { outfit };
    }),

  setAccessory: (slot, selection) =>
    set((s) => {
      const accessories = { ...s.accessories };
      if (selection === null) delete accessories[slot];
      else accessories[slot] = selection;
      return { accessories };
    }),

  setPose: (pose) => set({ pose }),
  setBackground: (id) => set({ backgroundId: id }),
  setFilter: (id) => set({ filterId: id }),

  addShot: (shot) => set((s) => ({ shots: [...s.shots, shot], favoriteShotId: s.favoriteShotId ?? shot.id })),
  deleteShot: (id) =>
    set((s) => {
      const shots = s.shots.filter((sh) => sh.id !== id);
      return {
        shots,
        favoriteShotId: s.favoriteShotId === id ? shots[0]?.id : s.favoriteShotId,
      };
    }),
  setFavorite: (id) => set({ favoriteShotId: id }),

  resetForChallenge: () =>
    set({
      ...initialData,
      skincare: { ...DEFAULT_SKINCARE, completed: { ...DEFAULT_SKINCARE.completed } },
      hair: { ...DEFAULT_HAIR, parting: 'center', shine: true },
    }),
}));

export const MAX_SHOTS = 4;
export const HIGH_SCORE_FOR_BONUS = SCORING_CONFIG.coins.highScoreAt;
