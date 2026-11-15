import { STARTING_COINS } from '@/data/config/scoring';
import { DEFAULT_SKIN_TONE_ID } from '@/data/items/customization';
import type { AccessoryItem, Challenge, HairItem, MakeupItem, OutfitItem } from '@/game/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UnlockableItem = OutfitItem | AccessoryItem | HairItem | MakeupItem;

export interface MuseProfile {
  skinToneId: string;
  eyeColorId: string;
  freckles: boolean;
  beautyMark: boolean;
}

export interface ChallengeRecord {
  score: number;
  stars: number;
}

const DEFAULT_MUSE: MuseProfile = {
  skinToneId: DEFAULT_SKIN_TONE_ID,
  eyeColorId: 'brown',
  freckles: false,
  beautyMark: false,
};

interface ProgressData {
  coins: number;
  lifetimeStars: number;
  unlockedItems: string[];
  unlockedChallenges: string[];
  muted: boolean;
  muse: MuseProfile;
  bestScores: Record<string, ChallengeRecord>;
}

interface ProgressActions {
  addCoins: (amount: number) => void;
  addStars: (stars: number) => void;
  tryUnlockItem: (item: UnlockableItem) => boolean;
  tryUnlockChallenge: (challenge: Challenge) => boolean;
  setMuted: (muted: boolean) => void;
  setMuse: (patch: Partial<MuseProfile>) => void;
  resetMuse: () => void;
  recordChallengeScore: (challengeId: string, score: number, stars: number) => void;
  isItemUnlocked: (item: UnlockableItem) => boolean;
  isChallengeUnlocked: (challenge: Challenge) => boolean;
}

export type ProgressStore = ProgressData & ProgressActions;

const DEFAULT_DATA: ProgressData = {
  coins: STARTING_COINS,
  lifetimeStars: 0,
  unlockedItems: [],
  unlockedChallenges: [],
  muted: false,
  muse: { ...DEFAULT_MUSE },
  bestScores: {},
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_DATA,

      addCoins: (amount) => set((s) => ({ coins: Math.max(0, s.coins + amount) })),
      addStars: (stars) => set((s) => ({ lifetimeStars: s.lifetimeStars + stars })),

      tryUnlockItem: (item) => {
        const { unlock } = item;
        if (unlock.type !== 'coins' || unlock.cost === undefined) return false;
        const state = get();
        if (state.unlockedItems.includes(item.id) || state.coins < unlock.cost) return false;
        set({ coins: state.coins - unlock.cost, unlockedItems: [...state.unlockedItems, item.id] });
        return true;
      },

      tryUnlockChallenge: (challenge) => {
        const { unlock } = challenge;
        if (unlock.type !== 'stars' || unlock.cost === undefined) return false;
        const state = get();
        if (state.unlockedChallenges.includes(challenge.id) || state.lifetimeStars < unlock.cost) {
          return false;
        }
        set({ unlockedChallenges: [...state.unlockedChallenges, challenge.id] });
        return true;
      },

      setMuted: (muted) => set({ muted }),

      setMuse: (patch) =>
        set((s) => ({
          muse: { ...(s.muse ?? DEFAULT_MUSE), ...patch },
        })),

      resetMuse: () => set({ muse: { ...DEFAULT_MUSE } }),

      recordChallengeScore: (challengeId, score, stars) =>
        set((s) => {
          const prev = s.bestScores?.[challengeId];
          const nextScore = prev ? Math.max(prev.score, score) : score;
          const nextStars = prev ? Math.max(prev.stars, stars) : stars;
          return {
            bestScores: {
              ...(s.bestScores ?? {}),
              [challengeId]: { score: nextScore, stars: nextStars },
            },
          };
        }),

      isItemUnlocked: () => true,

      isChallengeUnlocked: () => true,
    }),
    { name: 'glow-up-progress-v1' },
  ),
);
