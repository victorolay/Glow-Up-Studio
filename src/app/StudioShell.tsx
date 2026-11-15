import { HintPanel } from '@/components/character/HintPanel';
import { CoinIcon, LightbulbIcon, MenuIcon, SoundOffIcon, SoundOnIcon } from '@/components/ui/Icons';
import { getChallenge } from '@/data/catalog';
import { STAGE_LABELS } from '@/game/engine/studioHelpers';
import { AccessoriesStage } from '@/game/stages/accessories/AccessoriesStage';
import { HairStage } from '@/game/stages/hair/HairStage';
import { MakeupStage } from '@/game/stages/makeup/MakeupStage';
import { OutfitStage } from '@/game/stages/outfit/OutfitStage';
import { PhotoShootStage } from '@/game/stages/photoShoot/PhotoShootStage';
import { ResultsStage } from '@/game/stages/results/ResultsStage';
import { SkincareStage } from '@/game/stages/skincare/SkincareStage';
import { useCharacterStore } from '@/game/store/characterStore';
import { FLOW, useGameStore, type StageId } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const STAGE_COMPONENTS: Record<
  StageId,
  (props: { challenge: NonNullable<ReturnType<typeof getChallenge>> }) => JSX.Element
> = {
  skincare: SkincareStage,
  makeup: MakeupStage,
  hair: HairStage,
  outfit: OutfitStage,
  accessories: AccessoriesStage,
  photoShoot: PhotoShootStage,
  results: ResultsStage,
};

/** Unified responsive studio shell: slim top navigation bar, desktop stepper, hints popover, and stage canvas. */
export function StudioShell() {
  const challengeId = useGameStore((s) => s.challengeId);
  const stageIndex = useGameStore((s) => s.stageIndex);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const exitToMenu = useGameStore((s) => s.exitToMenu);
  const goToStage = useGameStore((s) => s.goToStage);
  const coins = useProgressStore((s) => s.coins);
  const muted = useProgressStore((s) => s.muted);
  const setMuted = useProgressStore((s) => s.setMuted);
  const shotsCount = useCharacterStore((s) => s.shots.length);
  const reducedMotion = useReducedMotion();
  const [hintsOpen, setHintsOpen] = useState(false);

  useEffect(() => {
    setHintsOpen(false);
  }, [stageIndex, challengeId]);

  const challenge = getChallenge(challengeId ?? '');
  if (!challenge) return null;

  const stageId = FLOW[stageIndex];
  const Stage = STAGE_COMPONENTS[stageId];
  const showHints = !challenge.freePlay && stageId !== 'results';

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg">
      <header className="relative z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface/95 px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={exitToMenu}
            aria-label="Exit to challenge menu"
            className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-2 text-xs font-semibold text-ink-soft transition hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent sm:px-2.5 sm:text-sm"
          >
            <MenuIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Challenges</span>
          </button>
          <span className="hidden h-4 w-px bg-line sm:inline-block" aria-hidden="true" />
          <span className="truncate font-display text-lg font-semibold text-ink sm:text-xl">
            {challenge.title}
          </span>
        </div>

        {/* Desktop interactive stage stepper */}
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Styling stages">
          {FLOW.map((id, idx) => {
            const isCurrent = idx === stageIndex;
            const isVisited = idx < stageIndex;
            const disabled = id === 'results' && shotsCount === 0 && stageId !== 'results';
            return (
              <button
                key={id}
                type="button"
                disabled={disabled}
                onClick={() => goToStage(idx)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 ${
                  isCurrent
                    ? 'bg-accent text-white shadow-soft'
                    : isVisited
                      ? 'text-accent-deep hover:bg-surface-2'
                      : 'text-ink-soft hover:bg-surface-2 hover:text-ink'
                }`}
              >
                <span className="tabular-nums opacity-75">{idx + 1}.</span>
                <span>{STAGE_LABELS[id]}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {showHints && (
            <button
              type="button"
              onClick={() => setHintsOpen((o) => !o)}
              aria-expanded={hintsOpen}
              aria-label="Toggle stylist hints"
              className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-accent ${
                hintsOpen
                  ? 'border-accent bg-accent/10 text-accent-deep'
                  : 'border-line bg-surface text-ink hover:bg-surface-2'
              }`}
            >
              <LightbulbIcon className="h-3.5 w-3.5 text-accent-deep" />
              <span>Hints{hintsUsed.length > 0 ? ` (${hintsUsed.length})` : ''}</span>
            </button>
          )}

          <span
            className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-surface-2/80 px-2.5 text-xs font-semibold tabular-nums text-ink"
            aria-label={`${coins} coins`}
          >
            <CoinIcon className="h-3.5 w-3.5 text-gold" />
            <span>{coins}</span>
          </span>

          <button
            type="button"
            onClick={() => setMuted(!muted)}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink-soft transition hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
          >
            {muted ? <SoundOffIcon className="h-4 w-4" /> : <SoundOnIcon className="h-4 w-4" />}
          </button>
        </div>

        {showHints && hintsOpen && (
          <div className="absolute right-3 top-16 z-40 w-[calc(100vw-24px)] max-w-sm sm:right-6">
            <HintPanel challenge={challenge} onClose={() => setHintsOpen(false)} />
          </div>
        )}
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={stageId}
            className="absolute inset-0"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <Stage challenge={challenge} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
