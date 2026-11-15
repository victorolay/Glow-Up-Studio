import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { getChallenge } from '@/data/catalog';
import { CHALLENGES } from '@/data/challenges';
import { useGameStore } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { playSfx } from '@/utils/sound';
import { idbAllLooks, idbDeleteLook, type SavedLook } from '@/utils/idb';
import { useEffect, useState } from 'react';

function Difficulty({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span aria-label={`Difficulty ${level} of 3`} className="text-xs text-gold">
      {'★'.repeat(level)}
      <span className="text-line">{'★'.repeat(3 - level)}</span>
    </span>
  );
}

export function ChallengeSelect() {
  const startChallenge = useGameStore((s) => s.startChallenge);
  const coins = useProgressStore((s) => s.coins);
  const lifetimeStars = useProgressStore((s) => s.lifetimeStars);
  const muted = useProgressStore((s) => s.muted);
  const setMuted = useProgressStore((s) => s.setMuted);
  const isChallengeUnlocked = useProgressStore((s) => s.isChallengeUnlocked);
  const tryUnlockChallenge = useProgressStore((s) => s.tryUnlockChallenge);
  const [looks, setLooks] = useState<SavedLook[]>([]);

  useEffect(() => {
    idbAllLooks()
      .then(setLooks)
      .catch(() => setLooks([]));
  }, []);

  const pick = (id: string) => {
    const challenge = getChallenge(id);
    if (!challenge) return;
    if (challenge.unlock.type === 'stars' && !isChallengeUnlocked(challenge)) {
      if (tryUnlockChallenge(challenge)) {
        void playSfx('sparkle', muted);
        startChallenge(id);
      }
      return;
    }
    void playSfx('tap', muted);
    startChallenge(id);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <header className="flex items-center justify-between px-4 pt-5">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Glow Up Studio</h1>
          <p className="text-sm text-ink-soft">Style the moment. Own the glow.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className="rounded-full bg-gold/20 px-3 py-1 text-sm font-bold text-ink"
            aria-label={`${coins} coins`}
          >
            🪙 {coins}
          </span>
          <span className="text-xs text-ink-soft" aria-label={`${lifetimeStars} stars earned`}>
            ★ {lifetimeStars}
          </span>
          <Button
            variant="ghost"
            className="min-h-[36px]"
            onClick={() => setMuted(!muted)}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {muted ? '🔇' : '🔊'}
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 py-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-soft">Challenges</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CHALLENGES.map((c) => {
            const unlocked = isChallengeUnlocked(c);
            return (
              <button
                key={c.id}
                type="button"
                data-testid={`challenge-card-${c.id}`}
                onClick={() => pick(c.id)}
                aria-label={
                  unlocked
                    ? `Start ${c.title}`
                    : `${c.title} — locked, requires ${c.unlock.cost ?? '?'} stars`
                }
                className={`rounded-3xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  unlocked
                    ? 'border-line bg-surface shadow-soft hover:shadow-glow'
                    : 'border-line bg-surface-2 opacity-80'
                } ${c.freePlay ? 'bg-gradient-to-br from-surface to-accent/10' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-ink">{c.title}</h3>
                  <Difficulty level={c.difficulty} />
                </div>
                <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Chip tone="accent">{c.category}</Chip>
                  {c.freePlay && <Chip>No grading</Chip>}
                  {!unlocked && (
                    <Chip>
                      🔒 {c.unlock.type === 'stars' ? `${c.unlock.cost} ★ to unlock` : 'Locked'}
                    </Chip>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-ink-soft">
          Lookbook
        </h2>
        {looks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-ink-soft">
            Your saved looks will appear here after your first photo shoot.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {looks.map((look) => (
              <figure key={look.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                <img src={look.thumbnail} alt={`Saved look from ${look.challengeTitle}`} className="h-40 w-full object-cover" />
                <figcaption className="flex items-center justify-between p-2 text-xs text-ink-soft">
                  <span className="truncate">{look.challengeTitle}</span>
                  <span className="flex items-center gap-1">
                    {look.stars !== undefined && <span aria-label={`${look.stars} stars`}>★{look.stars}</span>}
                    <button
                      type="button"
                      onClick={() => {
                        void idbDeleteLook(look.id).then(() => idbAllLooks().then(setLooks));
                      }}
                      aria-label={`Delete look from ${look.challengeTitle}`}
                      className="rounded px-1 text-ink-soft hover:text-ink"
                    >
                      ✕
                    </button>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-[11px] text-ink-soft">
          Placeholder art — final photorealistic assets pending (see asset manifest).
        </p>
      </main>
    </div>
  );
}
