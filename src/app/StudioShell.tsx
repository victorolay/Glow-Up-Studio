import { getChallenge } from '@/data/catalog';
import { AccessoriesStage } from '@/game/stages/accessories/AccessoriesStage';
import { HairStage } from '@/game/stages/hair/HairStage';
import { MakeupStage } from '@/game/stages/makeup/MakeupStage';
import { OutfitStage } from '@/game/stages/outfit/OutfitStage';
import { PhotoShootStage } from '@/game/stages/photoShoot/PhotoShootStage';
import { ResultsStage } from '@/game/stages/results/ResultsStage';
import { SkincareStage } from '@/game/stages/skincare/SkincareStage';
import { FLOW, useGameStore, type StageId } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { Button } from '@/components/ui/Button';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const STAGE_COMPONENTS: Record<StageId, (props: { challenge: NonNullable<ReturnType<typeof getChallenge>> }) => JSX.Element> = {
  skincare: SkincareStage,
  makeup: MakeupStage,
  hair: HairStage,
  outfit: OutfitStage,
  accessories: AccessoriesStage,
  photoShoot: PhotoShootStage,
  results: ResultsStage,
};

/** In-challenge shell: top bar with coins/mute + animated stage switch. */
export function StudioShell() {
  const challengeId = useGameStore((s) => s.challengeId);
  const stageIndex = useGameStore((s) => s.stageIndex);
  const exitToMenu = useGameStore((s) => s.exitToMenu);
  const coins = useProgressStore((s) => s.coins);
  const muted = useProgressStore((s) => s.muted);
  const setMuted = useProgressStore((s) => s.setMuted);
  const reducedMotion = useReducedMotion();

  const challenge = getChallenge(challengeId ?? '');
  if (!challenge) return null;

  const stageId = FLOW[stageIndex];
  const Stage = STAGE_COMPONENTS[stageId];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <Button variant="ghost" className="min-h-[36px]" onClick={exitToMenu} aria-label="Exit to challenge menu">
          ☰ Menu
        </Button>
        <span className="font-display text-sm font-bold text-accent-deep">Glow Up Studio</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-bold text-ink" aria-label={`${coins} coins`}>
            🪙 {coins}
          </span>
          <Button
            variant="ghost"
            className="min-h-[36px] px-2"
            onClick={() => setMuted(!muted)}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {muted ? '🔇' : '🔊'}
          </Button>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={stageId}
            className="absolute inset-0"
            initial={reducedMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
          >
            <Stage challenge={challenge} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
