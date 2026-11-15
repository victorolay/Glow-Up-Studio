import { hintCost, hintFor, HINT_TIERS } from '@/game/engine/hints';
import { useGameStore } from '@/game/store/gameStore';
import type { Challenge, HintTier } from '@/game/types';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface HintPanelProps {
  challenge: Challenge;
}

const TIER_LABELS: Record<HintTier, string> = {
  vibe: 'Vibe',
  category: 'Category',
  spoiler: 'Spoiler',
};

/** Three-tier hint system (AGENT.md §5.7): each tier costs more points. */
export function HintPanel({ challenge }: HintPanelProps) {
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const revealHint = useGameStore((s) => s.useHint);
  const [open, setOpen] = useState(false);

  const nextTier = HINT_TIERS.find((t) => !hintsUsed.includes(t));

  return (
    <div className="w-full">
      <Button variant="soft" className="w-full" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        💡 Hints {hintsUsed.length > 0 && `(${hintsUsed.length} used)`}
      </Button>
      {open && (
        <div className="mt-2 space-y-2 rounded-2xl border border-line bg-surface p-3">
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
                  <Button
                    variant="soft"
                    className="mt-1"
                    onClick={() => revealHint(tier)}
                    aria-label={`Reveal ${TIER_LABELS[tier]} hint, costs ${hintCost(tier)} points`}
                  >
                    Reveal (−{hintCost(tier)} pts)
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
