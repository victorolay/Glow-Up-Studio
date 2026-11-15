import { STARTING_COINS } from '@/data/config/scoring';
import type { AccessoryItem, Challenge, HairItem, MakeupItem, OutfitItem } from '@/game/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UnlockableItem = OutfitItem | AccessoryItem | HairItem | MakeupItem;

interface ProgressData {
  coins: number;
  lifetimeStars: number;
  unlockedItems: string[];
  unlockedChallenges: string[];
  muted: boolean;
}

interface ProgressActions {
  addCoins: (amount: number) => void;
  addStars: (stars: number) => void;
  tryUnlockItem: (item: UnlockableItem) => boolean;
  tryUnlockChallenge: (challenge: Challenge) => boolean;
  setMuted: (muted: boolean) => void;
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

      isItemUnlocked: (item) => {
        if (item.unlock.type === 'free') return true;
        if (item.unlock.type === 'coins') return get().unlockedItems.includes(item.id);
        return get().lifetimeStars >= (item.unlock.cost ?? Number.MAX_SAFE_INTEGER);
      },

      isChallengeUnlocked: (challenge) => {
        if (challenge.unlock.type === 'free') return true;
        if (challenge.unlock.type === 'coins') return get().unlockedChallenges.includes(challenge.id);
        return get().lifetimeStars >= (challenge.unlock.cost ?? Number.MAX_SAFE_INTEGER);
      },
    }),
    { name: 'glow-up-progress-v1' },
  ),
);
