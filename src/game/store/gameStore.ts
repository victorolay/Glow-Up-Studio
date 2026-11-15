import type { HintTier } from '@/game/types';
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
  exitToMenu: () => void;
  next: () => void;
  back: () => void;
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

  exitToMenu: () => set({ challengeId: undefined, stageIndex: 0, hintsUsed: [] }),

  next: () => set((s) => ({ stageIndex: Math.min(s.stageIndex + 1, FLOW.length - 1) })),
  back: () =>
    set((s) => {
      if (s.stageIndex > 0) return { stageIndex: s.stageIndex - 1 };
      return { challengeId: undefined, stageIndex: 0, hintsUsed: [] };
    }),

  useHint: (tier) =>
    set((s) => ({
      hintsUsed: s.hintsUsed.includes(tier) ? s.hintsUsed : [...s.hintsUsed, tier],
    })),
}));
