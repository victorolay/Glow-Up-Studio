import { hintCost, hintFor, HINT_TIERS } from '@/game/engine/hints';
import { useGameStore } from '@/game/store/gameStore';
import type { Challenge, HintTier } from '@/game/types';
import { Button } from '@/components/ui/Button';
import { CloseIcon, LightbulbIcon } from '@/components/ui/Icons';

interface HintPanelProps {
  challenge: Challenge;
  onClose?: () => void;
}

const TIER_LABELS: Record<HintTier, string> = {
  vibe: 'Vibe',
  category: 'Category',
  spoiler: 'Spoiler',
};

/** Three-tier hint panel content: each tier costs progressively more points. */
export function HintPanel({ challenge, onClose }: HintPanelProps) {
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const revealHint = useGameStore((s) => s.useHint);
  const nextTier = HINT_TIERS.find((t) => !hintsUsed.includes(t));

  return (
    <div
      className="w-full rounded-2xl border border-line bg-surface p-4 shadow-elevated"
      role="region"
      aria-label="Stylist hints"
    >
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <LightbulbIcon className="h-4 w-4 text-accent-deep" />
          <h3 className="font-display text-lg font-semibold text-ink">Stylist Notes</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close hints"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-surface-2 hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {HINT_TIERS.map((tier) => {
          const used = hintsUsed.includes(tier);
          const isNext = tier === nextTier;
          if (!used && !isNext) return null;
          return (
            <div key={tier} className="text-sm">
              <span className="font-semibold text-accent-deep">{TIER_LABELS[tier]}:</span>{' '}
              {used ? (
                <span className="text-ink">{hintFor(challenge, tier)}</span>
              ) : (
                <div className="mt-1.5">
                  <Button
                    variant="soft"
                    onClick={() => revealHint(tier)}
                    aria-label={`Reveal ${TIER_LABELS[tier]} hint, costs ${hintCost(tier)} points`}
                  >
                    Reveal {TIER_LABELS[tier]} (−{hintCost(tier)} pts)
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
