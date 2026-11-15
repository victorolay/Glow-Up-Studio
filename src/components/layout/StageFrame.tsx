import { HintPanel } from '@/components/character/HintPanel';
import { Button } from '@/components/ui/Button';
import type { Challenge } from '@/game/types';
import type { ReactNode } from 'react';

interface StageFrameProps {
  title: string;
  subtitle?: string;
  challenge: Challenge;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
  dots: { current: number; total: number };
  children: ReactNode;
}

function Dots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Stage ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${i <= current ? 'bg-accent' : 'bg-line'}`}
        />
      ))}
    </div>
  );
}

/** Shared stage chrome: header, hint access, footer navigation. */
export function StageFrame({
  title,
  subtitle,
  challenge,
  onBack,
  onNext,
  nextDisabled,
  nextLabel = 'Next',
  backLabel = 'Back',
  dots,
  children,
}: StageFrameProps) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 px-4 pt-3">
        <Button variant="ghost" onClick={onBack} aria-label={backLabel}>
          ‹ {backLabel}
        </Button>
        <div className="min-w-0 text-center">
          <h1 className="truncate font-display text-lg font-bold text-ink">{title}</h1>
          {subtitle && <p className="truncate text-xs text-ink-soft">{subtitle}</p>}
        </div>
        <Dots {...dots} />
      </header>
      <div className="mx-4 mt-2">{!challenge.freePlay && <HintPanel challenge={challenge} />}</div>
      <main className="mt-2 flex-1 overflow-y-auto px-4 pb-2">{children}</main>
      <footer className="flex items-center justify-between gap-3 border-t border-line bg-surface/80 px-4 py-3 backdrop-blur">
        <Button variant="soft" onClick={onBack}>
          {backLabel}
        </Button>
        <Button onClick={onNext} disabled={nextDisabled} data-testid="stage-next">
          {nextLabel}
        </Button>
      </footer>
    </div>
  );
}
