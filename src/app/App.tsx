import { StudioShell } from '@/app/StudioShell';
import { ChallengeSelect } from '@/game/stages/challengeSelect/ChallengeSelect';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useEffect } from 'react';

export default function App() {
  const challengeId = useGameStore((s) => s.challengeId);
  const stageIndex = useGameStore((s) => s.stageIndex);
  const startChallenge = useGameStore((s) => s.startChallenge);

  // Support ?autostart=1 to jump directly into the starter challenge for quick preview/testing.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && !useGameStore.getState().challengeId) {
      startChallenge('sunny-beach-day');
    }
  }, [startChallenge]);

  // Mirror state machine to document.body.dataset.state for predictable QA/accessibility.
  useEffect(() => {
    const stageId = FLOW[stageIndex];
    const state = !challengeId ? 'title' : stageId === 'results' ? 'gameover' : 'playing';
    document.body.dataset.state = state;
  }, [challengeId, stageIndex]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-bg text-ink">
      {challengeId ? <StudioShell /> : <ChallengeSelect />}
    </div>
  );
}
