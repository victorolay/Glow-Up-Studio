import { getAsset } from '@/assets';
import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { useCharacterLayers } from '@/components/character/useCharacterLayers';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
import { TabBar, type TabDef } from '@/components/ui/TabBar';
import { BACKGROUNDS, FILTERS } from '@/data/backgrounds';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { MAX_SHOTS, useCharacterStore } from '@/game/store/characterStore';
import { useProgressStore } from '@/game/store/progressStore';
import { blobToDataUrl, downloadBlob, renderPhotoToBlob } from '@/utils/photoExport';
import { playSfx } from '@/utils/sound';
import type { Challenge, PhotoShot, PoseId } from '@/game/types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

const POSES: Array<{ id: PoseId; label: string }> = [
  { id: 'relaxed', label: 'Relaxed' },
  { id: 'handOnHip', label: 'Hand on hip' },
  { id: 'twirl', label: 'Twirl' },
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
  const layers = useCharacterLayers();
  const reducedMotion = useReducedMotion();
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(false);
  const [exporting, setExporting] = useState(false);

  const background = BACKGROUNDS.find((b) => b.id === backgroundId) ?? BACKGROUNDS[0];
  const filter = FILTERS.find((f) => f.id === filterId) ?? FILTERS[0];
  const favorite = shots.find((s) => s.id === favoriteShotId) ?? shots[0];

  const takePhoto = async () => {
    if (busy || shots.length >= MAX_SHOTS) return;
    setBusy(true);
    try {
      const blob = await renderPhotoToBlob({
        backgroundSrc: getAsset(background.asset),
        layers,
        filterCss: filter.css,
      });
      const dataUrl = await blobToDataUrl(blob);
      const shot: PhotoShot = {
        id: `shot-${Date.now()}`,
        backgroundId: background.id,
        poseId: pose,
        filterId: filter.id,
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
      const blob = await renderPhotoToBlob({
        backgroundSrc: getAsset(background.asset),
        layers,
        filterCss: filter.css,
      });
      downloadBlob(blob, `glow-up-${challenge.id}.png`);
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
      nextLabel="Results ›"
      dots={{ current: FLOW.indexOf('photoShoot'), total: FLOW.length }}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="mx-auto w-full max-w-[300px] shrink-0">
          <div className="relative">
            <CharacterCanvas
              backgroundSrc={getAsset(background.asset)}
              filterCss={filter.css}
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
          <Button
            className="mt-3 w-full"
            onClick={() => void takePhoto()}
            disabled={busy || shots.length >= MAX_SHOTS}
            data-testid="take-photo"
            aria-label={shots.length >= MAX_SHOTS ? 'Photo limit reached' : 'Take photo'}
          >
            📸 {busy ? 'Developing…' : shots.length >= MAX_SHOTS ? 'Film full' : 'Take Photo'}
          </Button>
        </div>

        <div className="flex-1 space-y-4">
          <section aria-label="Backdrop">
            <h2 className="mb-2 text-sm font-semibold text-ink">Backdrop</h2>
            <TabBar tabs={BG_TABS} active={background.id} onChange={setBackground} ariaLabel="Photo backdrops" />
          </section>

          <section aria-label="Pose">
            <h2 className="mb-2 text-sm font-semibold text-ink">Pose</h2>
            <div className="flex flex-wrap gap-2">
              {POSES.map((p) => (
                <Button
                  key={p.id}
                  variant={pose === p.id ? 'primary' : 'soft'}
                  className="min-h-[36px]"
                  onClick={() => setPose(p.id)}
                  aria-pressed={pose === p.id}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </section>

          <section aria-label="Filter">
            <h2 className="mb-2 text-sm font-semibold text-ink">Filter</h2>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Button
                  key={f.id}
                  variant={filterId === f.id ? 'primary' : 'soft'}
                  className="min-h-[36px]"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filterId === f.id}
                >
                  {f.name}
                </Button>
              ))}
            </div>
          </section>

          <section aria-label="Your shots" data-testid="shot-strip">
            <h2 className="mb-2 text-sm font-semibold text-ink">
              Shots ({shots.length}/{MAX_SHOTS}) — pick your favorite
            </h2>
            {shots.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-ink-soft">
                No shots yet. Strike a pose and take one!
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {shots.map((shot) => {
                  const selected = shot.id === favorite?.id;
                  return (
                    <div key={shot.id} className="relative">
                      <button
                        type="button"
                        onClick={() => setFavorite(shot.id)}
                        aria-pressed={selected}
                        aria-label={`Select shot ${shot.id} as favorite`}
                        className={`block overflow-hidden rounded-2xl border-2 transition ${
                          selected ? 'border-accent ring-2 ring-accent/40' : 'border-line'
                        }`}
                      >
                        <img src={shot.dataUrl} alt="Your photo shoot shot" className="h-36 w-auto" />
                      </button>
                      {selected && (
                        <span className="absolute right-1 top-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                          ★ Favorite
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteShot(shot.id)}
                        aria-label={`Delete shot ${shot.id}`}
                        className="absolute bottom-1 right-1 rounded-full bg-surface px-2 py-0.5 text-xs text-ink-soft hover:text-ink"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {favorite && (
              <Button variant="soft" className="mt-3" onClick={() => void exportFavorite()} disabled={exporting}>
                {exporting ? 'Exporting…' : '⬇ Export PNG'}
              </Button>
            )}
          </section>
        </div>
      </div>
    </StageFrame>
  );
}
