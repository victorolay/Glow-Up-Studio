import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { Button } from '@/components/ui/Button';
import { CheckIcon, ChevronLeftIcon, CoinIcon, StarIcon } from '@/components/ui/Icons';
import { BACKGROUNDS, FILTERS } from '@/data/backgrounds';
import { STAR_BLURBS } from '@/data/config/judgeComments';
import { buildGradeInput } from '@/game/engine/gradeInput';
import { grade } from '@/game/engine/scoring';
import { useCharacterStore } from '@/game/store/characterStore';
import { useGameStore } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { idbPutLook } from '@/utils/idb';
import { makeThumbnail } from '@/utils/photoExport';
import { playSfx } from '@/utils/sound';
import type { Challenge, SavedLookRecipe } from '@/game/types';
import { animate, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

export function ResultsStage({ challenge }: { challenge: Challenge }) {
  const back = useGameStore((s) => s.back);
  const exitToMenu = useGameStore((s) => s.exitToMenu);
  const startChallenge = useGameStore((s) => s.startChallenge);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const char = useCharacterStore();
  const addCoins = useProgressStore((s) => s.addCoins);
  const addStars = useProgressStore((s) => s.addStars);
  const recordChallengeScore = useProgressStore((s) => s.recordChallengeScore);
  const muted = useProgressStore((s) => s.muted);
  const reducedMotion = useReducedMotion();
  const [displayScore, setDisplayScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [revealMode, setRevealMode] = useState<'after' | 'before'>('after');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      challenge.id,
      background?.id,
      filter?.id,
      hintsUsed,
      char.skincare.skinHealth,
      char.makeup,
      char.outfit,
      char.accessories,
      char.hair,
    ],
  );

  // Award coins/stars and record personal best once per results visit.
  useEffect(() => {
    if (awarded.current || challenge.freePlay) return;
    awarded.current = true;
    addCoins(result.coins);
    addStars(result.stars);
    recordChallengeScore(challenge.id, result.total, result.stars);
    void playSfx('sparkle', muted);
  }, [
    challenge.freePlay,
    challenge.id,
    result.coins,
    result.stars,
    result.total,
    addCoins,
    addStars,
    recordChallengeScore,
    muted,
  ]);

  // Score count-up, instant under reduced motion.
  useEffect(() => {
    if (challenge.freePlay || reducedMotion) {
      setDisplayScore(result.total);
      return;
    }
    const controls = animate(0, result.total, {
      duration: 1.0,
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return () => controls.stop();
  }, [result.total, challenge.freePlay, reducedMotion]);

  const buildRecipe = (): SavedLookRecipe => ({
    skinToneId: char.skinToneId,
    eyeColorId: char.eyeColorId,
    freckles: char.freckles,
    beautyMark: char.beautyMark,
    skinHealth: char.skincare.skinHealth,
    makeup: { ...char.makeup },
    hair: { ...char.hair },
    outfit: { ...char.outfit },
    accessories: { ...char.accessories },
    pose: char.pose,
    backgroundId: char.backgroundId,
    filterId: char.filterId,
  });

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
      recipe: buildRecipe(),
    });
    setSaved(true);
    void playSfx('success', muted);
  };

  if (challenge.freePlay) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-4 py-8">
        <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 text-center shadow-soft sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-deep">
            Free Play Atelier
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">Look Complete</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Unscored creative session. Archive your portrait in the lookbook or start a graded
            occasion brief.
          </p>
          {favorite && (
            <div className="mt-5 space-y-2.5">
              <div className="inline-flex rounded-xl border border-line bg-surface-2/60 p-0.5">
                <button
                  type="button"
                  onClick={() => setRevealMode('after')}
                  aria-pressed={revealMode === 'after'}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                    revealMode === 'after' ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  Styled Look
                </button>
                <button
                  type="button"
                  onClick={() => setRevealMode('before')}
                  aria-pressed={revealMode === 'before'}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                    revealMode === 'before' ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  Before Glow-Up
                </button>
              </div>
              {revealMode === 'after' ? (
                <img
                  src={favorite.dataUrl}
                  alt="Your favorite shot"
                  className="mx-auto w-52 rounded-2xl border border-line shadow-soft"
                />
              ) : (
                <div className="mx-auto w-52 overflow-hidden rounded-2xl border border-line bg-surface-2/40 shadow-soft">
                  <CharacterCanvas bareMode ariaLabel="Model before glow-up" />
                </div>
              )}
            </div>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Button onClick={() => void saveLook()} disabled={saved || !favorite}>
              {saved && <CheckIcon className="h-4 w-4" />}
              <span>{saved ? 'Saved to Lookbook' : 'Save to Lookbook'}</span>
            </Button>
            <Button variant="soft" data-start="true" onClick={() => startChallenge(challenge.id)}>
              Play Again
            </Button>
            <Button variant="soft" onClick={exitToMenu}>
              All Challenges
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6"
      data-testid="results-stage"
    >
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[minmax(300px,360px)_1fr]">
        {/* Left Column: Portrait + Score Hero */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-line bg-surface p-5 text-center shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-deep">
              {challenge.title}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">The Verdict</h1>

            <div className="mt-3 flex items-baseline justify-center gap-1">
              <span
                className="font-display text-6xl font-bold tabular-nums text-accent-deep"
                aria-label={`Score ${result.total} out of 100`}
              >
                {displayScore}
              </span>
              <span className="text-lg font-medium tabular-nums text-ink-soft">/100</span>
            </div>

            <div
              className="mt-2.5 flex items-center justify-center gap-1"
              role="img"
              aria-label={`${result.stars} of 5 stars`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon
                  key={i}
                  filled={i < result.stars}
                  className={`h-6 w-6 ${i < result.stars ? 'text-gold' : 'text-line'}`}
                />
              ))}
            </div>

            <p className="mt-2 text-sm text-ink-soft">{STAR_BLURBS[result.stars]}</p>

            <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-surface-2/80 px-3.5 py-1.5 text-sm font-semibold tabular-nums text-ink">
              <CoinIcon className="h-4 w-4 text-gold" />
              <span aria-live="polite">+{result.coins} coins earned</span>
            </div>

            {result.hintPenalty > 0 && (
              <p className="mt-2 text-xs tabular-nums text-ink-soft">
                Hint usage: −{result.hintPenalty} points
              </p>
            )}
          </div>

          {favorite && (
            <div className="overflow-hidden rounded-3xl border border-line bg-surface p-3.5 text-center shadow-soft">
              <div className="mb-3 inline-flex rounded-xl border border-line bg-surface-2/60 p-0.5">
                <button
                  type="button"
                  onClick={() => setRevealMode('after')}
                  aria-pressed={revealMode === 'after'}
                  data-testid="reveal-after"
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                    revealMode === 'after' ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  Styled Look
                </button>
                <button
                  type="button"
                  onClick={() => setRevealMode('before')}
                  aria-pressed={revealMode === 'before'}
                  data-testid="reveal-before"
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                    revealMode === 'before' ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  Before Glow-Up
                </button>
              </div>
              {revealMode === 'after' ? (
                <img
                  src={favorite.dataUrl}
                  alt="Your favorite photo from the shoot"
                  className="mx-auto aspect-[600/1280] w-full max-w-[200px] rounded-2xl border border-line object-cover"
                />
              ) : (
                <div className="mx-auto aspect-[600/1280] w-full max-w-[200px] overflow-hidden rounded-2xl border border-line bg-surface-2/40">
                  <CharacterCanvas bareMode ariaLabel="Model before glow-up" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Critique + Category Breakdown + Actions */}
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <section
              aria-label="Judge feedback"
              className="rounded-3xl border border-line bg-surface p-5 shadow-soft"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Editorial Notes
              </h2>
              <div className="mt-2.5 space-y-2">
                {result.judgeComments.map((comment, i) => (
                  <p key={i} className="font-display text-lg italic leading-snug text-ink">
                    “{comment}”
                  </p>
                ))}
              </div>
            </section>

            <section
              aria-label="Score breakdown"
              className="rounded-3xl border border-line bg-surface p-5 shadow-soft"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Category Breakdown
              </h2>
              <div className="mt-3 space-y-3">
                {result.categories.map((cat) => (
                  <div key={cat.key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink">{cat.title}</span>
                      <span className="font-semibold tabular-nums text-ink-soft">
                        {cat.weighted}/{cat.max}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-gold"
                        style={{ width: `${(cat.weighted / cat.max) * 100}%` }}
                      />
                    </div>
                    <ul className="mt-1.5 space-y-0.5">
                      {cat.reasons.map((r, i) => (
                        <li
                          key={`${r.code}-${i}`}
                          className="flex items-baseline justify-between gap-2 text-xs text-ink-soft"
                        >
                          <span>{r.label}</span>
                          {r.points !== 0 && (
                            <span
                              className={`font-semibold tabular-nums ${
                                r.points > 0 ? 'text-accent-deep' : 'text-rose-600'
                              }`}
                            >
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
          </div>

          <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-line bg-surface p-3.5 shadow-soft">
            <Button onClick={() => void saveLook()} disabled={saved || !favorite}>
              {saved && <CheckIcon className="h-4 w-4" />}
              <span>{saved ? 'Saved to Lookbook' : 'Save to Lookbook'}</span>
            </Button>
            <Button variant="soft" data-start="true" onClick={() => startChallenge(challenge.id)}>
              Play Again
            </Button>
            <Button variant="soft" onClick={exitToMenu}>
              All Challenges
            </Button>
            <Button variant="ghost" onClick={back} aria-label="Back to photo studio">
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Photo Studio</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
