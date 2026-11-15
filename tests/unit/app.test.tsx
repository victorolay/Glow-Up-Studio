import App from '@/app/App';
import { useGameStore } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { useCharacterStore } from '@/game/store/characterStore';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('app smoke test', () => {
  beforeEach(() => {
    useGameStore.setState({ challengeId: undefined, stageIndex: 0, hintsUsed: [] });
    useProgressStore.setState({ coins: 120, lifetimeStars: 0, unlockedItems: [], unlockedChallenges: [], muted: true });
    useCharacterStore.getState().resetForChallenge();
  });

  it('renders the challenge select screen', async () => {
    render(<App />);
    // Flush the lookbook lookup microtask inside act to avoid act warnings.
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole('heading', { name: 'Glow Up Studio' })).toBeInTheDocument();
    expect(screen.getByTestId('challenge-card-sunny-beach-day')).toBeInTheDocument();
    expect(screen.getByTestId('challenge-card-free-play')).toBeInTheDocument();
  });

  it('walks the full flow from challenge select through skincare to results', async () => {
    render(<App />);

    // Start the beach challenge
    fireEvent.click(screen.getByTestId('challenge-card-sunny-beach-day'));
    expect(await screen.findByTestId('skincare-step-scan')).toBeInTheDocument();

    // Walk skincare quickly via step tabs + Next
    for (const step of ['scan', 'cleanse', 'blemish', 'mask', 'serum', 'moisturizer', 'sunscreen']) {
      fireEvent.click(screen.getByTestId(`skincare-step-${step}`));
    }
    fireEvent.click(screen.getByTestId('stage-next')); // → makeup
    expect(await screen.findByTestId('makeup-panel-base')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('stage-next')); // → hair
    expect(await screen.findByTestId('hair-styles')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('stage-next')); // → outfit
    expect(await screen.findByTestId('outfit-grid')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('stage-next')); // → accessories
    expect(await screen.findByTestId('accessory-none-glasses')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('stage-next')); // → photo shoot
    expect(await screen.findByTestId('take-photo')).toBeInTheDocument();

    // Results requires a shot — next is disabled until a photo is taken.
    const nextButton = screen.getByTestId('stage-next') as HTMLButtonElement;
    expect(nextButton).toBeDisabled();
  });

  it('respects occlusion: selecting a dress clears tops and bottoms', () => {
    const { setOutfit } = useCharacterStore.getState();
    setOutfit('top', { itemId: 'top_ribbed_bodysuit', variantId: 'signature' });
    setOutfit('bottom', { itemId: 'bot_denim_shorts', variantId: 'signature' });
    expect(useCharacterStore.getState().outfit.top).toBeDefined();
    setOutfit('dress', { itemId: 'dress_aline_sundress', variantId: 'signature' });
    const outfit = useCharacterStore.getState().outfit;
    expect(outfit.dress).toBeDefined();
    expect(outfit.top).toBeUndefined();
    expect(outfit.bottom).toBeUndefined();
    expect(outfit.swim).toBeUndefined();
  });

  it('tracks skin health as steps complete, capped at 100', () => {
    const store = useCharacterStore.getState();
    for (const step of ['scan', 'cleanse', 'blemish', 'mask', 'serum', 'moisturizer', 'sunscreen'] as const) {
      store.completeSkincareStep(step);
    }
    expect(useCharacterStore.getState().skincare.skinHealth).toBe(100);
    store.completeSkincareStep('scan'); // duplicate is a no-op
    expect(useCharacterStore.getState().skincare.skinHealth).toBe(100);
  });
});
