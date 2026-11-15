import { Button } from '@/components/ui/Button';
import { STAR_BLURBS } from '@/data/config/judgeComments';
import { BACKGROUNDS, FILTERS } from '@/data/backgrounds';
import { buildGradeInput } from '@/game/engine/gradeInput';
import { grade } from '@/game/engine/scoring';
import { useCharacterStore } from '@/game/store/characterStore';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { idbPutLook } from '@/utils/idb';
import { makeThumbnail } from '@/utils/photoExport';
import { playSfx } from '@/utils/sound';
import type { Challenge } from '@/game/types';
import { useReducedMotion } from 'framer-motion';
import { animate } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

export function ResultsStage({ challenge }: { challenge: Challenge }) {
  const back = useGameStore((s) => s.back);
  const exitToMenu = useGameStore((s) => s.exitToMenu);
  const startChallenge = useGameStore((s) => s.startChallenge);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const char = useCharacterStore();
  const addCoins = useProgressStore((s) => s.addCoins);
  const addStars = useProgressStore((s) => s.addStars);
  const muted = useProgressStore((s) => s.muted);
  const reducedMotion = useReducedMotion();
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const awarded = useRef(false);

  const favorite = char.shots.find((s) => s.id === char.favoriteShotId) ?? char.shots[0];
  const background = BACKGROUNDS.find((b) => b.id === char.backgroundId);
  const filter = FILTERS.find((f) => f.id === char.filterId);

  const result = useMemo(
    () =>
      grade(
        buildGradeInput(
          char,
          challenge,
          background,
          filter,
          hintsUsed,
          char.skincare.skinHealth,
          Object.keys(char.makeup).length,
        ),
      ),
    // Deterministic per AGENT.md §5.9; recompute only when the flow changes inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [challenge.id, background?.id, filter?.id, hintsUsed, char.skincare.skinHealth, char.makeup, char.outfit, char.accessories, char.hair],
  );

  // Award coins/stars exactly once per results visit.
  useEffect(() => {
    if (awarded.current || challenge.freePlay) return;
    awarded.current = true;
    addCoins(result.coins);
    addStars(result.stars);
    void playSfx('sparkle', muted);
  }, [challenge.freePlay, result.coins, result.stars, addCoins, addStars, muted]);

  // Score count-up, instant under reduced motion.
  useEffect(() => {
    if (challenge.freePlay || reducedMotion) {
      setDisplayScore(result.total);
      return;
    }
    const controls = animate(0, result.total, {
      duration: 1.2,
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return () => controls.stop();
  }, [result.total, challenge.freePlay, reducedMotion]);

  const saveLook = async () => {
    if (!favorite) return;
    const thumbnail = await makeThumbnail(favorite.dataUrl);
    await idbPutLook({
      id: `look-${Date.now()}`,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      createdAt: Date.now(),
      score: challenge.freePlay ? undefined : result.total,
      stars: challenge.freePlay ? undefined : result.stars,
      thumbnail,
    });
    setSaved(true);
    void playSfx('success', muted);
  };

  if (challenge.freePlay) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-ink">Free Play Complete</h1>
        <p className="mt-2 max-w-sm text-center text-sm text-ink-soft">
          No grades here — just vibes. Save your look to the lookbook or dive into another challenge.
        </p>
        {favorite && <img src={favorite.dataUrl} alt="Your favorite shot" className="mt-5 w-56 rounded-3xl border-4 border-surface shadow-soft" />}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => void saveLook()} disabled={saved || !favorite}>
            {saved ? '✓ Saved to Lookbook' : 'Save to Lookbook'}
          </Button>
          <Button variant="soft" onClick={() => startChallenge(challenge.id)}>
            Play Again
          </Button>
          <Button variant="soft" onClick={exitToMenu}>
            All Challenges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-5" data-testid="results-stage">
      <div className="mx-auto w-full max-w-lg">
        <header className="text-center">
          <h1 className="font-display text-3xl font-bold text-ink">The Verdict</h1>
          <p className="text-sm text-ink-soft">{challenge.title}</p>
        </header>

        <div className="mt-4 rounded-3xl border border-line bg-surface p-5 text-center shadow-soft">
          <div className="text-6xl font-bold text-accent" aria-label={`Score ${result.total} out of 100`}>
            {displayScore}
          </div>
          <div className="mt-2 text-3xl" role="img" aria-label={`${result.stars} of 5 stars`}>
            {'★'.repeat(result.stars)}
            <span className="text-line">{'★'.repeat(5 - result.stars)}</span>
          </div>
          <p className="mt-1 text-sm text-ink-soft">{STAR_BLURBS[result.stars]}</p>
          <p className="mt-3 text-sm font-semibold text-gold" aria-live="polite">
            +{result.coins} coins earned 🪙
          </p>
          {result.hintPenalty > 0 && (
            <p className="mt-1 text-xs text-ink-soft">
              Hint usage: −{result.hintPenalty} points
            </p>
          )}
        </div>

        {favorite && (
          <img
            src={favorite.dataUrl}
            alt="Your favorite photo from the shoot"
            className="mx-auto mt-4 w-44 rounded-3xl border-4 border-surface shadow-soft"
          />
        )}

        <section className="mt-5" aria-label="Judge feedback">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink-soft">The judge says</h2>
          <div className="space-y-2 rounded-3xl border border-line bg-surface p-4">
            {result.judgeComments.map((comment, i) => (
              <p key={i} className="text-sm text-ink">
                “{comment}”
              </p>
            ))}
          </div>
        </section>

        <section className="mt-5" aria-label="Score breakdown">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink-soft">Breakdown</h2>
          <div className="space-y-3 rounded-3xl border border-line bg-surface p-4">
            {result.categories.map((cat) => (
              <div key={cat.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{cat.title}</span>
                  <span className="text-ink-soft">
                    {cat.weighted}/{cat.max}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-gold"
                    style={{ width: `${(cat.weighted / cat.max) * 100}%` }}
                  />
                </div>
                <ul className="mt-1.5 space-y-1">
                  {cat.reasons.map((r, i) => (
                    <li key={`${r.code}-${i}`} className="flex items-baseline justify-between gap-2 text-xs text-ink-soft">
                      <span>{r.label}</span>
                      {r.points !== 0 && (
                        <span className={`font-semibold ${r.points > 0 ? 'text-accent-deep' : 'text-rose-500'}`}>
                          {r.points > 0 ? '+' : ''}
                          {r.points}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 mb-4 flex flex-wrap justify-center gap-3">
          <Button onClick={() => void saveLook()} disabled={saved || !favorite}>
            {saved ? '✓ Saved to Lookbook' : 'Save to Lookbook'}
          </Button>
          <Button variant="soft" onClick={() => startChallenge(challenge.id)}>
            Play Again
          </Button>
          <Button variant="soft" onClick={exitToMenu}>
            All Challenges
          </Button>
          <Button variant="ghost" onClick={back} aria-label="Back to photo studio">
            ‹ Photo Studio
          </Button>
        </div>
        <p className="pb-2 text-center text-[11px] text-ink-soft">
          Stage {FLOW.indexOf('results') + 1}/{FLOW.length} · deterministic scoring — every point maps to a reason above.
        </p>
      </div>
    </div>
  );
}
