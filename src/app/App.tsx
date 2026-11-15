import { StudioShell } from '@/app/StudioShell';
import { ChallengeSelect } from '@/game/stages/challengeSelect/ChallengeSelect';
import { useGameStore } from '@/game/store/gameStore';

export default function App() {
  const challengeId = useGameStore((s) => s.challengeId);
  return (
    <div className="mx-auto flex h-dvh max-w-2xl flex-col overflow-hidden bg-bg text-ink">
      {challengeId ? <StudioShell /> : <ChallengeSelect />}
    </div>
  );
}
