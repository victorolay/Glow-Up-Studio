import type { HintTier, SavedLookRecipe } from '@/game/types';
import { create } from 'zustand';
import { useCharacterStore } from './characterStore';

/** Stage flow order (AGENT.md §1 core loop). */
export const FLOW = [
  'skincare',
  'makeup',
  'hair',
  'outfit',
  'accessories',
  'photoShoot',
  'results',
] as const;

export type StageId = (typeof FLOW)[number];

interface GameState {
  challengeId?: string;
  stageIndex: number;
  hintsUsed: HintTier[];
  startChallenge: (id: string) => void;
  startWithLook: (id: string, recipe: SavedLookRecipe) => void;
  exitToMenu: () => void;
  next: () => void;
  back: () => void;
  goToStage: (index: number) => void;
  useHint: (tier: HintTier) => void;
}

export const useGameStore = create<GameState>((set) => ({
  challengeId: undefined,
  stageIndex: 0,
  hintsUsed: [],

  startChallenge: (id) => {
    useCharacterStore.getState().resetForChallenge();
    set({ challengeId: id, stageIndex: 0, hintsUsed: [] });
  },

  startWithLook: (id, recipe) => {
    useCharacterStore.getState().loadLookRecipe(recipe);
    set({ challengeId: id, stageIndex: 3, hintsUsed: [] });
  },

  exitToMenu: () => set({ challengeId: undefined, stageIndex: 0, hintsUsed: [] }),

  next: () => set((s) => ({ stageIndex: Math.min(s.stageIndex + 1, FLOW.length - 1) })),
  back: () =>
    set((s) => {
      if (s.stageIndex > 0) return { stageIndex: s.stageIndex - 1 };
      return { challengeId: undefined, stageIndex: 0, hintsUsed: [] };
    }),
  goToStage: (index) =>
    set(() => ({
      stageIndex: Math.max(0, Math.min(index, FLOW.length - 1)),
    })),

  useHint: (tier) =>
    set((s) => ({
      hintsUsed: s.hintsUsed.includes(tier) ? s.hintsUsed : [...s.hintsUsed, tier],
    })),
}));
