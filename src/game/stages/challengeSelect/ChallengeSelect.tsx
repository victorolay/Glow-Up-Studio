import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { Button } from '@/components/ui/Button';
import {
  ChevronRightIcon,
  CloseIcon,
  CoinIcon,
  SoundOffIcon,
  SoundOnIcon,
  SparkleIcon,
  StarIcon,
  TrashIcon,
} from '@/components/ui/Icons';
import { getChallenge } from '@/data/catalog';
import { CHALLENGES } from '@/data/challenges';
import {
  CHALLENGE_FILTERS,
  difficultyLabel,
  editorialRankForStars,
  filterChallenges,
  type ChallengeFilter,
} from '@/game/engine/studioHelpers';
import { useGameStore } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { idbAllLooks, idbDeleteLook, type SavedLook } from '@/utils/idb';
import { playSfx } from '@/utils/sound';
import { useEffect, useMemo, useState } from 'react';

function Difficulty({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span
      aria-label={`Difficulty ${level} of 3 (${difficultyLabel(level)})`}
      className="inline-flex items-center gap-0.5 text-gold"
    >
      {Array.from({ length: 3 }, (_, i) => (
        <StarIcon
          key={i}
          filled={i < level}
          className={`h-3 w-3 ${i < level ? 'text-gold' : 'text-line'}`}
        />
      ))}
    </span>
  );
}

export function ChallengeSelect() {
  const startChallenge = useGameStore((s) => s.startChallenge);
  const startWithLook = useGameStore((s) => s.startWithLook);
  const coins = useProgressStore((s) => s.coins);
  const lifetimeStars = useProgressStore((s) => s.lifetimeStars);
  const bestScores = useProgressStore((s) => s.bestScores);
  const muted = useProgressStore((s) => s.muted);
  const setMuted = useProgressStore((s) => s.setMuted);

  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [filter, setFilter] = useState<ChallengeFilter>('All');
  const [activeLook, setActiveLook] = useState<SavedLook | null>(null);

  useEffect(() => {
    idbAllLooks()
      .then(setLooks)
      .catch(() => setLooks([]));
  }, []);

  const visibleChallenges = useMemo(() => filterChallenges(CHALLENGES, filter), [filter]);
  const editorialRank = editorialRankForStars(lifetimeStars);

  const pick = (id: string) => {
    const challenge = getChallenge(id);
    if (!challenge) return;
    void playSfx('tap', muted);
    startChallenge(id);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-bg">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <h1 className="whitespace-nowrap font-display text-2xl font-bold tracking-tight text-ink sm:text-[26px]">
            Glow Up Studio
          </h1>

          <nav
            aria-label="Filter challenges by occasion"
            className="hidden items-center gap-1 lg:flex"
          >
            {CHALLENGE_FILTERS.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`min-h-[36px] shrink-0 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-accent ${
                    active
                      ? 'bg-surface-2 text-ink'
                      : 'text-ink-soft hover:bg-surface-2/60 hover:text-ink'
                  }`}
                >
                  {cat === 'Seasonal/Holiday' ? 'Seasonal' : cat}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <span
              className="inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-xl bg-surface-2/80 px-3 text-xs font-semibold tabular-nums text-ink sm:text-sm"
              aria-label={`${coins} coins`}
            >
              <CoinIcon className="h-4 w-4 text-gold" />
              <span>{coins}</span>
            </span>
            <span
              className="inline-flex min-h-[36px] items-center gap-1 whitespace-nowrap rounded-xl bg-surface-2/80 px-3 text-xs font-semibold tabular-nums text-ink sm:text-sm"
              aria-label={`${lifetimeStars} stars earned`}
            >
              <StarIcon filled className="h-3.5 w-3.5 text-gold" />
              <span>{lifetimeStars}</span>
            </span>
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              aria-pressed={muted}
              aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-soft transition hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
            >
              {muted ? <SoundOffIcon className="h-4 w-4" /> : <SoundOnIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Editorial Hero Spotlight */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-[1.35fr_0.65fr]">
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-deep">
                  Styling Atelier · {editorialRank}
                </p>
                <h2 className="mt-2 max-w-xl text-balance font-display text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
                  Style the moment. Own the glow.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base">
                  Prepare skin, craft bespoke makeup, curate wardrobe silhouettes, preview 360° &amp;
                  runway walks, and direct the final editorial shoot.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  data-start="true"
                  onClick={() => pick('sunny-beach-day')}
                  className="px-6"
                >
                  <span>Start Styling</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button variant="soft" onClick={() => pick('free-play')}>
                  <SparkleIcon className="h-4 w-4 text-accent-deep" />
                  <span>Open Free Play</span>
                </Button>
              </div>
            </div>

            <div className="relative hidden min-h-[260px] items-center justify-center overflow-hidden border-l border-line bg-[radial-gradient(circle_at_50%_40%,#fdf9fa_0%,#f1e7ec_80%,#e7dbe2_100%)] lg:flex">
              <div className="h-[280px] w-[260px] overflow-hidden">
                <CharacterCanvas zoomMode="face" ariaLabel="Studio model portrait" />
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Category Filter Strip */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-ink">Occasion Briefs</h2>
          <span className="text-xs font-medium tabular-nums text-ink-soft">
            {visibleChallenges.length} {visibleChallenges.length === 1 ? 'brief' : 'briefs'}
          </span>
        </div>

        <div
          className="no-scrollbar mb-5 flex items-center gap-1.5 overflow-x-auto pb-1 lg:hidden"
          role="group"
          aria-label="Filter challenges"
        >
          {CHALLENGE_FILTERS.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-xl border px-3.5 text-xs font-semibold transition ${
                  active
                    ? 'border-accent bg-accent text-white'
                    : 'border-line bg-surface text-ink-soft hover:text-ink'
                }`}
              >
                {cat === 'Seasonal/Holiday' ? 'Seasonal' : cat}
              </button>
            );
          })}
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleChallenges.map((c) => {
            const record = bestScores?.[c.id];

            return (
              <button
                key={c.id}
                type="button"
                data-testid={`challenge-card-${c.id}`}
                onClick={() => pick(c.id)}
                aria-label={`Start ${c.title}`}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 text-left shadow-soft transition-all duration-150 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-deep">
                      {c.category}
                      <span className="mx-1.5 text-line" aria-hidden="true">
                        ·
                      </span>
                      {c.freePlay ? 'No grading' : difficultyLabel(c.difficulty)}
                    </span>
                    {!c.freePlay && <Difficulty level={c.difficulty} />}
                  </div>

                  <h3 className="mt-2 font-display text-2xl font-bold text-ink">{c.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                    {c.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-line pt-3 text-xs font-semibold">
                  <span className="tabular-nums text-ink-soft">
                    {record
                      ? `Best ${record.score}/100 · ${record.stars}/5 ★`
                      : c.freePlay
                        ? 'Open studio'
                        : '7 stages · Graded'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-accent-deep transition-transform group-hover:translate-x-0.5">
                    <span>Enter Studio</span>
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Lookbook Gallery */}
        <section className="mt-10 pb-6" aria-label="Lookbook gallery">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">Lookbook</h2>
            {looks.length > 0 && (
              <span className="text-xs font-medium tabular-nums text-ink-soft">
                {looks.length} saved
              </span>
            )}
          </div>

          {looks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-surface/60 p-8 text-center">
              <p className="text-sm font-medium text-ink">No looks archived yet</p>
              <p className="mt-1 text-xs text-ink-soft">
                Complete a photo shoot and save your favorite portrait to build your personal
                lookbook.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {looks.map((look) => (
                <figure
                  key={look.id}
                  className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-soft"
                >
                  <button
                    type="button"
                    onClick={() => setActiveLook(look)}
                    aria-label={`Inspect saved look from ${look.challengeTitle}`}
                    className="block w-full overflow-hidden bg-surface-2/50 focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <img
                      src={look.thumbnail}
                      alt={`Saved look from ${look.challengeTitle}`}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </button>
                  <figcaption className="flex items-center justify-between gap-2 px-3 py-2.5 text-xs">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{look.challengeTitle}</p>
                      {look.stars !== undefined && (
                        <p className="mt-0.5 flex items-center gap-1 tabular-nums text-ink-soft">
                          <StarIcon filled className="h-3 w-3 text-gold" />
                          <span>{look.stars}/5</span>
                          {look.score !== undefined && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{look.score} pts</span>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        void idbDeleteLook(look.id).then(() => idbAllLooks().then(setLooks));
                      }}
                      aria-label={`Delete look from ${look.challengeTitle}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-soft transition hover:bg-surface-2 hover:text-ink"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Saved Look Inspection Modal */}
      {activeLook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Saved look: ${activeLook.challengeTitle}`}
          onClick={() => setActiveLook(null)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-surface shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">
                  {activeLook.challengeTitle}
                </h3>
                {activeLook.score !== undefined && (
                  <p className="text-xs tabular-nums text-ink-soft">
                    Score {activeLook.score}/100 · {activeLook.stars}/5 stars
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveLook(null)}
                aria-label="Close look preview"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft hover:bg-surface-2 hover:text-ink"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-surface-2/40 p-5">
              <img
                src={activeLook.thumbnail}
                alt={`Saved look from ${activeLook.challengeTitle}`}
                className="mx-auto aspect-[3/4] w-full max-w-[240px] rounded-2xl border border-line object-cover shadow-soft"
              />
            </div>
            {activeLook.recipe && (
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-3.5">
                <Button
                  variant="soft"
                  onClick={() => {
                    const recipe = activeLook.recipe!;
                    setActiveLook(null);
                    startWithLook('free-play', recipe);
                  }}
                >
                  <span>Remix in Free Play</span>
                </Button>
                <Button
                  onClick={() => {
                    const recipe = activeLook.recipe!;
                    const targetId = activeLook.challengeId;
                    setActiveLook(null);
                    startWithLook(targetId, recipe);
                  }}
                >
                  <span>Remix Look</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
