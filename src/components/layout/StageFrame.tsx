import { ShowcaseContext } from '@/components/character/ShowcaseContext';
import { Button } from '@/components/ui/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
  Rotate360Icon,
  ZoomInIcon,
  ZoomOutIcon,
} from '@/components/ui/Icons';
import { summarizeLookCounts } from '@/game/engine/studioHelpers';
import { useCharacterStore } from '@/game/store/characterStore';
import type { Challenge, PoseId } from '@/game/types';
import { useEffect, useState, type ReactNode } from 'react';

const MIRROR_POSES: Array<{ id: PoseId; label: string }> = [
  { id: 'relaxed', label: 'Relaxed' },
  { id: 'handOnHip', label: 'Hip' },
  { id: 'twirl', label: 'Twirl' },
  { id: 'runway', label: 'Runway' },
  { id: 'vogue', label: 'Vogue' },
];

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
  /** Render prop receiving the active mirror zoom mode so CharacterCanvas scales seamlessly. */
  renderMirror?: (zoomMode: 'full' | 'face') => ReactNode;
  mirrorFooter?: ReactNode;
  defaultZoom?: 'full' | 'face';
  allowZoomToggle?: boolean;
  allowShowcaseToggle?: boolean;
  children: ReactNode;
}

/**
 * Responsive Atelier Layout:
 * - Mobile (< lg): compact top vanity mirror + independent scrollable controls + slim thumb-zone footer.
 * - Desktop (>= lg): full-height split studio with pinned Vanity Mirror on left and Styling Atelier on right.
 */
export function StageFrame({
  subtitle,
  challenge,
  onBack,
  onNext,
  nextDisabled,
  nextLabel = 'Next',
  backLabel = 'Back',
  dots,
  renderMirror,
  mirrorFooter,
  defaultZoom = 'full',
  allowZoomToggle = true,
  allowShowcaseToggle = true,
  children,
}: StageFrameProps) {
  const [zoomMode, setZoomMode] = useState<'full' | 'face'>(defaultZoom);
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [turnAngle, setTurnAngle] = useState(0);
  const [autoSpin, setAutoSpin] = useState(false);
  const [runwayActive, setRunwayActive] = useState(false);

  const pose = useCharacterStore((s) => s.pose);
  const setPose = useCharacterStore((s) => s.setPose);
  const skinHealth = useCharacterStore((s) => s.skincare.skinHealth);
  const makeupCount = useCharacterStore((s) => Object.keys(s.makeup).length);
  const outfitCount = useCharacterStore((s) => Object.keys(s.outfit).length);
  const accessoryCount = useCharacterStore((s) => Object.keys(s.accessories).length);

  // Smooth 360-degree auto-spin loop
  useEffect(() => {
    if (!autoSpin || runwayActive) return;
    let rafId = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      setTurnAngle((prev) => (prev + dt * 0.085) % 360);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [autoSpin, runwayActive]);

  const lookSummary = summarizeLookCounts({
    skinHealth,
    makeupCount,
    outfitCount,
    accessoryCount,
  });

  const cleanNextLabel = nextLabel.replace(/[›»]/g, '').trim();
  const cleanBackLabel = backLabel.replace(/[‹«]/g, '').trim();

  const effectiveZoom = runwayActive ? 'full' : zoomMode;

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col lg:grid lg:grid-cols-[minmax(360px,430px)_1fr] lg:gap-6 lg:px-8 lg:py-5">
      {/* Left / Top: Single Vanity Mirror container */}
      {renderMirror && (
        <section
          aria-label="Vanity mirror"
          className="relative flex shrink-0 flex-col border-b border-line bg-surface-2/40 px-4 py-2.5 lg:min-h-0 lg:rounded-3xl lg:border lg:bg-surface lg:p-4 lg:shadow-soft"
        >
          {/* Mirror toolbar */}
          <div className="mb-1.5 flex items-center justify-between gap-2 lg:mb-2.5">
            <span className="truncate text-[11px] font-medium tabular-nums text-ink-soft">
              {lookSummary}
            </span>
            <div className="flex shrink-0 items-center gap-1.5">
              {allowShowcaseToggle && (
                <button
                  type="button"
                  onClick={() => {
                    setShowcaseOpen((open) => {
                      if (open) {
                        setAutoSpin(false);
                        setRunwayActive(false);
                        setTurnAngle(0);
                      } else {
                        setZoomMode('full');
                      }
                      return !open;
                    });
                  }}
                  aria-pressed={showcaseOpen}
                  aria-label="Toggle 360 view and runway walk controls"
                  className={`inline-flex min-h-[28px] items-center gap-1 whitespace-nowrap rounded-lg border px-2 text-[11px] font-semibold transition ${
                    showcaseOpen || runwayActive || autoSpin || turnAngle !== 0
                      ? 'border-accent bg-accent text-white'
                      : 'border-line bg-surface text-ink-soft hover:text-ink'
                  }`}
                >
                  <Rotate360Icon className="h-3 w-3" />
                  <span>360° &amp; Runway</span>
                </button>
              )}

              {allowZoomToggle && (
                <div className="inline-flex rounded-lg border border-line bg-surface p-0.5">
                  <button
                    type="button"
                    onClick={() => setZoomMode('full')}
                    aria-pressed={effectiveZoom === 'full'}
                    aria-label="Full body view"
                    className={`inline-flex min-h-[28px] items-center gap-1 whitespace-nowrap rounded-md px-2 text-[11px] font-semibold transition ${
                      effectiveZoom === 'full' ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    <ZoomOutIcon className="h-3 w-3" />
                    <span>Full</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRunwayActive(false);
                      setZoomMode('face');
                    }}
                    aria-pressed={effectiveZoom === 'face'}
                    aria-label="Face close-up view"
                    className={`inline-flex min-h-[28px] items-center gap-1 whitespace-nowrap rounded-md px-2 text-[11px] font-semibold transition ${
                      effectiveZoom === 'face' ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    <ZoomInIcon className="h-3 w-3" />
                    <span>Face</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Studio spotlight mirror frame */}
          <ShowcaseContext.Provider
            value={
              allowShowcaseToggle
                ? {
                    turnAngle,
                    setTurnAngle: (deg) => {
                      setAutoSpin(false);
                      setTurnAngle(deg);
                    },
                    runwayActive,
                  }
                : null
            }
          >
            <div
              className={`relative mx-auto flex h-[30dvh] min-h-[190px] max-h-[260px] w-full max-w-[260px] items-center justify-center overflow-hidden rounded-2xl transition-colors duration-300 lg:h-auto lg:max-h-none lg:max-w-none lg:flex-1 lg:min-h-0 ${
                runwayActive
                  ? 'bg-[linear-gradient(180deg,#120c1b_0%,#241634_62%,#140d1d_100%)]'
                  : 'bg-[radial-gradient(circle_at_50%_35%,#fdf9fa_0%,#f1e7ec_75%,#e7dbe2_100%)]'
              }`}
            >
              <div
                className={
                  effectiveZoom === 'face'
                    ? 'h-full w-[220px] overflow-hidden sm:w-[250px] lg:h-[440px] lg:w-[330px] lg:rounded-xl'
                    : 'h-full max-h-full aspect-[600/1280]'
                }
              >
                {renderMirror(effectiveZoom)}
              </div>
            </div>
          </ShowcaseContext.Provider>

          {/* Compact 360 Turntable, Runway Walk & Pose Strip */}
          {allowShowcaseToggle && showcaseOpen && (
            <div
              className="mt-2 space-y-2 rounded-xl border border-line bg-surface p-2.5"
              aria-label="360 degree view, pose and runway controls"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setRunwayActive((r) => {
                      const nextRunway = !r;
                      if (nextRunway) {
                        setAutoSpin(false);
                        setZoomMode('full');
                      }
                      return nextRunway;
                    });
                  }}
                  aria-pressed={runwayActive}
                  className={`inline-flex min-h-[30px] items-center gap-1 whitespace-nowrap rounded-lg px-2.5 text-[11px] font-semibold transition ${
                    runwayActive
                      ? 'bg-accent text-white'
                      : 'border border-line bg-surface-2/60 text-ink hover:bg-surface-2'
                  }`}
                >
                  {runwayActive ? <PauseIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
                  <span>{runwayActive ? 'Pause Runway' : 'Runway Walk'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRunwayActive(false);
                    setAutoSpin((s) => !s);
                  }}
                  aria-pressed={autoSpin}
                  className={`inline-flex min-h-[30px] items-center gap-1 whitespace-nowrap rounded-lg px-2.5 text-[11px] font-semibold transition ${
                    autoSpin
                      ? 'bg-accent text-white'
                      : 'border border-line bg-surface-2/60 text-ink hover:bg-surface-2'
                  }`}
                >
                  <Rotate360Icon className="h-3 w-3" />
                  <span>{autoSpin ? 'Stop Spin' : 'Auto 360°'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSpin(false);
                      setRunwayActive(false);
                      setTurnAngle(0);
                    }}
                    className="min-h-[30px] rounded-md border border-line px-2 text-[11px] font-semibold tabular-nums text-ink-soft hover:text-ink"
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSpin(false);
                      setRunwayActive(false);
                      setTurnAngle(180);
                    }}
                    className="min-h-[30px] rounded-md border border-line px-2 text-[11px] font-semibold tabular-nums text-ink-soft hover:text-ink"
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-9 shrink-0 text-[11px] font-semibold tabular-nums text-ink-soft">
                  {Math.round(turnAngle)}°
                </span>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={Math.round(turnAngle)}
                  aria-label="360 degree rotation angle"
                  onChange={(e) => {
                    setAutoSpin(false);
                    setRunwayActive(false);
                    setTurnAngle(Number(e.target.value));
                  }}
                  className="h-1.5 flex-1 cursor-pointer accent-accent"
                />
              </div>

              <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
                {MIRROR_POSES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPose(p.id)}
                    aria-pressed={pose === p.id}
                    className={`min-h-[28px] shrink-0 whitespace-nowrap rounded-md px-2 text-[11px] font-semibold transition ${
                      pose === p.id
                        ? 'bg-ink text-white'
                        : 'bg-surface-2/70 text-ink-soft hover:text-ink'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mirrorFooter && <div className="mt-2.5">{mirrorFooter}</div>}
        </section>
      )}

      {/* Right / Bottom: Styling Atelier */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden lg:rounded-3xl lg:border lg:border-line lg:bg-surface lg:shadow-soft">
        {/* Stage Header */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-surface/80 px-4 py-2.5 lg:px-6 lg:py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider tabular-nums text-accent-deep">
                Stage {dots.current + 1} of {dots.total}
              </span>
              <span className="text-line" aria-hidden="true">
                ·
              </span>
              <span className="truncate text-xs text-ink-soft">{challenge.category}</span>
            </div>
            <h1 className="truncate font-display text-xl font-bold text-ink lg:text-2xl">
              {subtitle ?? challenge.title}
            </h1>
          </div>

          {/* Compact progress bar on mobile/tablet */}
          <div
            className="flex shrink-0 items-center gap-1 xl:hidden"
            aria-label={`Stage ${dots.current + 1} of ${dots.total}`}
          >
            {Array.from({ length: dots.total }, (_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all ${
                  i === dots.current
                    ? 'w-5 bg-accent'
                    : i < dots.current
                      ? 'w-2 bg-accent/50'
                      : 'w-2 bg-line'
                }`}
              />
            ))}
          </div>
        </header>

        {/* Scrollable interactive workspace */}
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-3 lg:p-6">{children}</main>

        {/* Pinned Action Footer */}
        <footer className="flex h-14 shrink-0 items-center justify-between gap-3 border-t border-line bg-surface px-4 lg:h-16 lg:px-6">
          <Button variant="soft" onClick={onBack} aria-label={cleanBackLabel}>
            <ChevronLeftIcon className="h-4 w-4" />
            <span>{cleanBackLabel}</span>
          </Button>
          <Button onClick={onNext} disabled={nextDisabled} data-testid="stage-next">
            <span>{cleanNextLabel}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </footer>
      </section>
    </div>
  );
}
