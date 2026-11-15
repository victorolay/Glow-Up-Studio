import { getAsset } from '@/assets';
import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { useCharacterLayers } from '@/components/character/useCharacterLayers';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
import {
  CameraIcon,
  DownloadIcon,
  PauseIcon,
  PlayIcon,
  Rotate360Icon,
  ShareIcon,
  StarIcon,
  TrashIcon,
} from '@/components/ui/Icons';
import { TabBar, type TabDef } from '@/components/ui/TabBar';
import { BACKGROUNDS, FILTERS } from '@/data/backgrounds';
import { isBackAngle } from '@/game/engine/studioHelpers';
import { MAX_SHOTS, useCharacterStore } from '@/game/store/characterStore';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { blobToDataUrl, downloadBlob, renderPhotoToBlob } from '@/utils/photoExport';
import { playSfx } from '@/utils/sound';
import type { Challenge, PhotoFraming, PhotoShot, PoseId } from '@/game/types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const POSES: Array<{ id: PoseId; label: string }> = [
  { id: 'relaxed', label: 'Relaxed' },
  { id: 'handOnHip', label: 'Hand on Hip' },
  { id: 'twirl', label: 'Twirl' },
  { id: 'runway', label: 'Runway Strut' },
  { id: 'vogue', label: 'Editorial Vogue' },
];

const FRAMINGS: Array<{ id: PhotoFraming; label: string }> = [
  { id: 'full', label: 'Full Body' },
  { id: 'half', label: 'Half Body' },
  { id: 'portrait', label: 'Portrait' },
];

const ANGLES: Array<{ deg: number; label: string }> = [
  { deg: 0, label: 'Front 0°' },
  { deg: 90, label: 'Side 90°' },
  { deg: 180, label: 'Back 180°' },
  { deg: 270, label: 'Side 270°' },
];

const BG_TABS: TabDef[] = BACKGROUNDS.map((b) => ({ id: b.id, label: b.name }));

export function PhotoShootStage({ challenge }: { challenge: Challenge }) {
  const next = useGameStore((s) => s.next);
  const back = useGameStore((s) => s.back);
  const shots = useCharacterStore((s) => s.shots);
  const favoriteShotId = useCharacterStore((s) => s.favoriteShotId);
  const addShot = useCharacterStore((s) => s.addShot);
  const deleteShot = useCharacterStore((s) => s.deleteShot);
  const setFavorite = useCharacterStore((s) => s.setFavorite);
  const backgroundId = useCharacterStore((s) => s.backgroundId);
  const setBackground = useCharacterStore((s) => s.setBackground);
  const filterId = useCharacterStore((s) => s.filterId);
  const setFilter = useCharacterStore((s) => s.setFilter);
  const pose = useCharacterStore((s) => s.pose);
  const setPose = useCharacterStore((s) => s.setPose);
  const muted = useProgressStore((s) => s.muted);
  const reducedMotion = useReducedMotion();

  const [framing, setFraming] = useState<PhotoFraming>('full');
  const [coverEnabled, setCoverEnabled] = useState(false);
  const [turnAngle, setTurnAngle] = useState(0);
  const [autoSpin, setAutoSpin] = useState(false);
  const [runwayActive, setRunwayActive] = useState(false);

  const layers = useCharacterLayers({ isBackView: isBackAngle(turnAngle) });

  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(false);
  const [exporting, setExporting] = useState(false);

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

  const background = BACKGROUNDS.find((b) => b.id === backgroundId) ?? BACKGROUNDS[0];
  const filter = FILTERS.find((f) => f.id === filterId) ?? FILTERS[0];
  const favorite = shots.find((s) => s.id === favoriteShotId) ?? shots[0];
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const magazineCover = coverEnabled
    ? { title: challenge.title, subtitle: `${background.name} · ${filter.name}` }
    : null;

  const takePhoto = async () => {
    if (busy || shots.length >= MAX_SHOTS) return;
    setBusy(true);
    setAutoSpin(false);
    setRunwayActive(false);
    try {
      const blob = await renderPhotoToBlob({
        backgroundSrc: getAsset(background.asset),
        layers,
        filterCss: filter.css,
        framing,
        magazineCover,
      });
      const dataUrl = await blobToDataUrl(blob);
      const shot: PhotoShot = {
        id: `shot-${Date.now()}`,
        backgroundId: background.id,
        poseId: pose,
        filterId: filter.id,
        framing,
        magazineCover: coverEnabled,
        dataUrl,
      };
      addShot(shot);
      setFlash(true);
      void playSfx('shutter', muted);
      window.setTimeout(() => setFlash(false), reducedMotion ? 50 : 350);
    } finally {
      setBusy(false);
    }
  };

  const exportFavorite = async () => {
    if (!favorite) return;
    setExporting(true);
    try {
      const favBg = BACKGROUNDS.find((b) => b.id === favorite.backgroundId) ?? background;
      const favFilter = FILTERS.find((f) => f.id === favorite.filterId) ?? filter;
      const blob = await renderPhotoToBlob({
        backgroundSrc: getAsset(favBg.asset),
        layers,
        filterCss: favFilter.css,
        framing: favorite.framing ?? framing,
        magazineCover: favorite.magazineCover
          ? { title: challenge.title, subtitle: `${favBg.name} · ${favFilter.name}` }
          : null,
      });
      downloadBlob(blob, `glow-up-${challenge.id}.png`);
    } finally {
      setExporting(false);
    }
  };

  const shareFavorite = async () => {
    if (!favorite || !canShare) return;
    setExporting(true);
    try {
      const favBg = BACKGROUNDS.find((b) => b.id === favorite.backgroundId) ?? background;
      const favFilter = FILTERS.find((f) => f.id === favorite.filterId) ?? filter;
      const blob = await renderPhotoToBlob({
        backgroundSrc: getAsset(favBg.asset),
        layers,
        filterCss: favFilter.css,
        framing: favorite.framing ?? framing,
        magazineCover: favorite.magazineCover
          ? { title: challenge.title, subtitle: `${favBg.name} · ${favFilter.name}` }
          : null,
      });
      const file = new File([blob], `glow-up-${challenge.id}.png`, { type: 'image/png' });
      await navigator.share({
        title: `Glow Up Studio — ${challenge.title}`,
        files: [file],
      });
    } catch {
      // Share cancelled by user; no-op.
    } finally {
      setExporting(false);
    }
  };

  return (
    <StageFrame
      title={challenge.title}
      subtitle="Photo Studio"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextDisabled={shots.length === 0}
      nextLabel="View Verdict"
      dots={{ current: FLOW.indexOf('photoShoot'), total: FLOW.length }}
      allowZoomToggle={false}
      allowShowcaseToggle={false}
      renderMirror={() => (
        <div className="relative h-full w-full">
          <CharacterCanvas
            backgroundSrc={getAsset(background.asset)}
            filterCss={filter.css}
            framing={runwayActive ? 'full' : framing}
            turnAngle={turnAngle}
            onTurnAngleChange={(deg) => {
              setAutoSpin(false);
              setTurnAngle(deg);
            }}
            runwayActive={runwayActive}
            magazineCover={magazineCover}
            ariaLabel={`Character posing at the ${background.name}`}
          />
          <AnimatePresence>
            {flash && (
              <motion.div
                className="pointer-events-none absolute inset-0 bg-white"
                initial={{ opacity: reducedMotion ? 0 : 0.9 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0.05 : 0.35 }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
        </div>
      )}
      mirrorFooter={
        <Button
          className="w-full"
          onClick={() => void takePhoto()}
          disabled={busy || shots.length >= MAX_SHOTS}
          data-testid="take-photo"
          aria-label={shots.length >= MAX_SHOTS ? 'Photo limit reached' : 'Take photo'}
        >
          <CameraIcon className="h-4 w-4" />
          <span>
            {busy ? 'Developing…' : shots.length >= MAX_SHOTS ? 'Film Full' : 'Take Photo'}
          </span>
        </Button>
      }
    >
      <div className="space-y-5">
        <section aria-label="Backdrop">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink">Backdrop</h2>
            <span className="text-xs font-medium text-ink-soft">{background.name}</span>
          </div>
          <TabBar
            tabs={BG_TABS}
            active={background.id}
            onChange={setBackground}
            ariaLabel="Photo backdrops"
          />
        </section>

        {/* Runway Walk & 360 Turntable */}
        <section
          aria-label="Runway and 360 turntable"
          className="rounded-2xl border border-line bg-surface p-4 shadow-soft"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-ink">Runway &amp; 360° Turntable</h2>
              <p className="text-xs text-ink-soft">
                Inspect every silhouette angle or preview a live catwalk strut.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={runwayActive ? 'primary' : 'soft'}
                onClick={() => {
                  setRunwayActive((r) => {
                    const nextRunway = !r;
                    if (nextRunway) {
                      setAutoSpin(false);
                      setFraming('full');
                    }
                    return nextRunway;
                  });
                }}
                aria-pressed={runwayActive}
                data-testid="runway-toggle"
              >
                {runwayActive ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                <span>{runwayActive ? 'Pause Runway' : 'Runway Walk'}</span>
              </Button>
              <Button
                variant={autoSpin ? 'primary' : 'soft'}
                onClick={() => {
                  setRunwayActive(false);
                  setAutoSpin((s) => !s);
                }}
                aria-pressed={autoSpin}
              >
                <Rotate360Icon className="h-4 w-4" />
                <span>{autoSpin ? 'Stop 360°' : 'Auto 360°'}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-xs font-semibold tabular-nums text-ink-soft">
              {Math.round(turnAngle)}°
            </span>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={Math.round(turnAngle)}
              aria-label="Model turntable angle"
              onChange={(e) => {
                setAutoSpin(false);
                setRunwayActive(false);
                setTurnAngle(Number(e.target.value));
              }}
              className="h-2 flex-1 cursor-pointer accent-accent"
            />
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {ANGLES.map((a) => (
              <button
                key={a.deg}
                type="button"
                onClick={() => {
                  setAutoSpin(false);
                  setRunwayActive(false);
                  setTurnAngle(a.deg);
                }}
                className={`min-h-[32px] rounded-lg border px-2.5 text-xs font-semibold tabular-nums transition ${
                  Math.abs(turnAngle - a.deg) < 12 && !runwayActive
                    ? 'border-accent bg-accent text-white'
                    : 'border-line bg-surface-2/50 text-ink-soft hover:text-ink'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <section
            aria-label="Pose"
            className="rounded-2xl border border-line bg-surface p-4 shadow-soft"
          >
            <h2 className="mb-2.5 text-sm font-semibold text-ink">Pose</h2>
            <div className="flex flex-wrap gap-2">
              {POSES.map((p) => (
                <Button
                  key={p.id}
                  variant={pose === p.id ? 'primary' : 'soft'}
                  onClick={() => setPose(p.id)}
                  aria-pressed={pose === p.id}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </section>

          <section
            aria-label="Filter"
            className="rounded-2xl border border-line bg-surface p-4 shadow-soft"
          >
            <h2 className="mb-2.5 text-sm font-semibold text-ink">Color Grade</h2>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Button
                  key={f.id}
                  variant={filterId === f.id ? 'primary' : 'soft'}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filterId === f.id}
                >
                  {f.name}
                </Button>
              ))}
            </div>
          </section>
        </div>

        {/* Framing & Editorial Magazine Cover */}
        <section
          aria-label="Framing and editorial cover"
          className="rounded-2xl border border-line bg-surface p-4 shadow-soft"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-ink">Camera Framing &amp; Cover</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {FRAMINGS.map((fr) => (
                  <Button
                    key={fr.id}
                    variant={framing === fr.id ? 'primary' : 'soft'}
                    onClick={() => {
                      setRunwayActive(false);
                      setFraming(fr.id);
                    }}
                    aria-pressed={framing === fr.id}
                  >
                    {fr.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant={coverEnabled ? 'primary' : 'soft'}
              onClick={() => setCoverEnabled((c) => !c)}
              aria-pressed={coverEnabled}
              data-testid="magazine-cover-toggle"
            >
              <span>Magazine Cover: {coverEnabled ? 'On' : 'Off'}</span>
            </Button>
          </div>
        </section>

        <section
          aria-label="Your shots"
          data-testid="shot-strip"
          className="rounded-2xl border border-line bg-surface p-4 shadow-soft"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-ink">
              Contact Sheet{' '}
              <span className="font-normal tabular-nums text-ink-soft">
                ({shots.length}/{MAX_SHOTS})
              </span>
            </h2>
            {favorite && (
              <div className="flex items-center gap-2">
                <Button
                  variant="soft"
                  onClick={() => void exportFavorite()}
                  disabled={exporting}
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>{exporting ? 'Exporting…' : 'Export PNG'}</span>
                </Button>
                {canShare && (
                  <Button
                    variant="soft"
                    onClick={() => void shareFavorite()}
                    disabled={exporting}
                    aria-label="Share photo"
                  >
                    <ShareIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {shots.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-surface-2/40 p-6 text-center">
              <p className="text-sm font-medium text-ink">No exposures yet</p>
              <p className="mt-1 text-xs text-ink-soft">
                Select a backdrop, framing, and pose, then press Take Photo to capture your look.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {shots.map((shot) => {
                const selected = shot.id === favorite?.id;
                return (
                  <div key={shot.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => setFavorite(shot.id)}
                      aria-pressed={selected}
                      aria-label={`Select shot ${shot.id} as favorite`}
                      className={`block overflow-hidden rounded-xl border-2 transition focus-visible:outline-2 focus-visible:outline-accent ${
                        selected ? 'border-accent ring-2 ring-accent/35' : 'border-line'
                      }`}
                    >
                      <img src={shot.dataUrl} alt="Your photo shoot shot" className="h-40 w-auto" />
                    </button>
                    {selected && (
                      <span className="pointer-events-none absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-[10px] font-semibold text-white shadow-soft">
                        <StarIcon filled className="h-2.5 w-2.5" />
                        <span>Favorite</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteShot(shot.id)}
                      aria-label={`Delete shot ${shot.id}`}
                      className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-surface/95 text-ink-soft shadow-soft transition hover:text-ink"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </StageFrame>
  );
}
