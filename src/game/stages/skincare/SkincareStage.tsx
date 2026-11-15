import { BLEMISH_POINTS, FACE_OVERLAY } from '@/components/character/useCharacterLayers';
import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
import { CheckIcon, SparkleIcon } from '@/components/ui/Icons';
import { Meter } from '@/components/ui/Meter';
import { SKINCARE_STEP_POINTS } from '@/data/config/scoring';
import { SKINCARE_PRODUCTS } from '@/data/items/makeup';
import { useCharacterStore } from '@/game/store/characterStore';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { playSfx } from '@/utils/sound';
import type { Challenge, SkincareStepId } from '@/game/types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const STEPS: Array<{ id: SkincareStepId; title: string; short: string; blurb: string }> = [
  { id: 'scan', title: 'Skin Scan', short: '01 Scan', blurb: 'Run the diagnostic scanner to map skin concerns.' },
  { id: 'cleanse', title: 'Cleanse', short: '02 Cleanse', blurb: 'Build lather, splash clean, and gently pat dry.' },
  { id: 'blemish', title: 'Blemish Care', short: '03 Blemish', blurb: 'Tap each highlighted spot on the mirror to soothe it.' },
  { id: 'mask', title: 'Treatment Mask', short: '04 Mask', blurb: 'Select a mask formula, apply evenly, wait, and peel.' },
  { id: 'serum', title: 'Active Serum', short: '05 Serum', blurb: 'Choose a serum, then tap the face three times to absorb.' },
  { id: 'moisturizer', title: 'Moisturize', short: '06 Hydrate', blurb: 'Seal hydration with face cream and eye concentrate.' },
  { id: 'sunscreen', title: 'SPF Shield', short: '07 SPF', blurb: 'Swipe across the face in the mirror to blend SPF.' },
];

const CONCERNS = [
  { label: 'Minor blemishes', detail: 'T-zone & cheeks' },
  { label: 'Under-eye fatigue', detail: 'Needs peptide boost' },
  { label: 'Surface dryness', detail: 'Cheek barrier low' },
  { label: 'Excess shine', detail: 'Forehead & nose' },
];

/** Press-and-hold progress helper with rAF accumulation. */
function useHoldProgress(onComplete: () => void) {
  const [progress, setProgress] = useState(0);
  const holding = useRef(false);
  const raf = useRef<number>(0);
  const done = useRef(false);
  const cb = useRef(onComplete);
  cb.current = onComplete;

  const stop = useCallback(() => {
    holding.current = false;
    cancelAnimationFrame(raf.current);
  }, []);

  const start = useCallback(() => {
    if (done.current) return;
    holding.current = true;
    const tick = () => {
      if (!holding.current) return;
      setProgress((p) => {
        const next = Math.min(100, p + 3.5);
        if (next >= 100 && !done.current) {
          done.current = true;
          stop();
          cb.current();
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [stop]);

  useEffect(() => stop, [stop]);
  return {
    progress,
    start,
    stop,
    reset: () => {
      done.current = false;
      setProgress(0);
    },
  };
}

export function SkincareStage({ challenge }: { challenge: Challenge }) {
  const next = useGameStore((s) => s.next);
  const back = useGameStore((s) => s.back);
  const completed = useCharacterStore((s) => s.skincare.completed);
  const skinHealth = useCharacterStore((s) => s.skincare.skinHealth);
  const completeSkincareStep = useCharacterStore((s) => s.completeSkincareStep);
  const muted = useProgressStore((s) => s.muted);
  const reducedMotion = useReducedMotion();

  const [active, setActive] = useState<SkincareStepId>(
    () => STEPS.find((s) => !completed[s.id])?.id ?? 'sunscreen',
  );
  const step = STEPS.find((s) => s.id === active) ?? STEPS[0];
  const completedCount = Object.values(completed).filter(Boolean).length;

  const finishStep = useCallback(
    (id: SkincareStepId) => {
      completeSkincareStep(id);
      void playSfx('success', muted);
      const nextStep = STEPS.find((s) => !completed[s.id] && s.id !== id)?.id;
      if (nextStep) setActive(nextStep);
    },
    [completed, completeSkincareStep, muted],
  );

  const dots = { current: FLOW.indexOf('skincare'), total: FLOW.length };

  return (
    <StageFrame
      title={challenge.title}
      subtitle="Skincare Prep"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextLabel="Makeup"
      dots={dots}
      defaultZoom="face"
      renderMirror={(zoomMode) => (
        <CharacterCanvas zoomMode={zoomMode} ariaLabel="Your character receiving skincare">
          <div
            className="absolute rounded-[45%] border border-dashed border-accent/35"
            style={{
              left: FACE_OVERLAY.left,
              top: FACE_OVERLAY.top,
              width: FACE_OVERLAY.width,
              height: FACE_OVERLAY.height,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
          {active === 'blemish' && <BlemishTargets onDone={() => finishStep('blemish')} />}
          {active === 'serum' && (
            <TapFaceTimes times={3} label="Apply serum drops" onDone={() => finishStep('serum')} />
          )}
          {active === 'sunscreen' && <SwipeFace onDone={() => finishStep('sunscreen')} />}
        </CharacterCanvas>
      )}
      mirrorFooter={
        <div className="rounded-xl border border-line bg-surface-2/40 px-3 py-2">
          <Meter label={`Skin health · ${completedCount}/7 complete`} value={skinHealth} />
        </div>
      }
    >
      <div className="space-y-4">
        {/* Step selector strip */}
        <div
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap"
          role="tablist"
          aria-label="Skincare steps"
        >
          {STEPS.map((s) => {
            const isDone = Boolean(completed[s.id]);
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-testid={`skincare-step-${s.id}`}
                onClick={() => setActive(s.id)}
                className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-accent ${
                  isActive
                    ? 'border-accent bg-accent text-white shadow-soft'
                    : isDone
                      ? 'border-accent/25 bg-accent/10 text-accent-deep'
                      : 'border-line bg-surface text-ink-soft hover:text-ink'
                }`}
              >
                {isDone && <CheckIcon className="h-3.5 w-3.5" />}
                <span>{s.short}</span>
              </button>
            );
          })}
        </div>

        {/* Active step card */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">{step.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{step.blurb}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-accent-deep">
              +{SKINCARE_STEP_POINTS[active]} health
            </span>
          </div>

          <div className="mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {active === 'scan' && <ScanStep onDone={() => finishStep('scan')} />}
                {active === 'cleanse' && <CleanseStep onDone={() => finishStep('cleanse')} />}
                {active === 'blemish' && (
                  <div className="rounded-xl border border-line bg-surface-2/50 p-4 text-sm text-ink-soft">
                    Tap the three glowing points directly on the character’s face in the mirror to
                    soothe blemishes and apply hydrocolloid patches.
                  </div>
                )}
                {active === 'mask' && <MaskStep onDone={() => finishStep('mask')} />}
                {active === 'serum' && <SerumStep onDone={() => finishStep('serum')} />}
                {active === 'moisturizer' && (
                  <MoisturizerStep onDone={() => finishStep('moisturizer')} />
                )}
                {active === 'sunscreen' && (
                  <div className="rounded-xl border border-line bg-surface-2/50 p-4 text-sm text-ink-soft">
                    Drag or swipe smoothly across the dashed face zone in the mirror until SPF
                    coverage reaches 100%.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {completed[active] && (
            <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-sm font-semibold text-accent-deep">
              <CheckIcon className="h-4 w-4" />
              <span>Step complete (+{SKINCARE_STEP_POINTS[active]} skin health)</span>
            </div>
          )}
        </div>

        {completedCount === STEPS.length && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4">
            <div className="flex items-center gap-2.5">
              <SparkleIcon className="h-5 w-5 shrink-0 text-accent-deep" />
              <div>
                <p className="text-sm font-semibold text-ink">Glass-skin glow achieved</p>
                <p className="text-xs text-ink-soft">
                  Skin health is at 100%. Ready for foundation and color.
                </p>
              </div>
            </div>
            <Button onClick={next}>Makeup</Button>
          </div>
        )}
      </div>
    </StageFrame>
  );
}

/* ---------- Step interactions ---------- */

function ScanStep({ onDone }: { onDone: () => void }) {
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const reducedMotion = useReducedMotion();

  const runScan = () => {
    setScanning(true);
    window.setTimeout(
      () => {
        setScanning(false);
        setDone(true);
      },
      reducedMotion ? 80 : 1200,
    );
  };

  return (
    <div data-testid="skincare-scan">
      {!done ? (
        <Button onClick={runScan} disabled={scanning}>
          {scanning ? 'Scanning complexion…' : 'Run SkinPad Scan'}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CONCERNS.map((c) => (
              <div
                key={c.label}
                className="flex items-center justify-between rounded-xl border border-line bg-surface-2/40 px-3 py-2.5 text-xs"
              >
                <span className="font-semibold text-ink">{c.label}</span>
                <span className="text-ink-soft">{c.detail}</span>
              </div>
            ))}
          </div>
          <Button onClick={onDone}>Save Diagnostic & Continue</Button>
        </div>
      )}
    </div>
  );
}

function CleanseStep({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'foam' | 'rinse' | 'pat'>('foam');
  const [rinses, setRinses] = useState(0);
  const [pats, setPats] = useState(0);
  const foam = useHoldProgress(() => setPhase('rinse'));

  return (
    <div data-testid="skincare-cleanse" className="space-y-3">
      {phase === 'foam' && (
        <div>
          <Button
            className="w-full"
            onPointerDown={foam.start}
            onPointerUp={foam.stop}
            onPointerLeave={foam.stop}
            aria-label="Hold to apply cleansing foam"
          >
            Hold to Work Up Foam ({Math.round(foam.progress)}%)
          </Button>
          <div className="mt-3">
            <Meter label="Lather" value={foam.progress} />
          </div>
        </div>
      )}
      {phase === 'rinse' && (
        <Button
          className="w-full"
          onClick={() => {
            const n = rinses + 1;
            setRinses(n);
            if (n >= 3) setPhase('pat');
          }}
        >
          Splash Warm Water ({rinses}/3)
        </Button>
      )}
      {phase === 'pat' && (
        <Button
          className="w-full"
          onClick={() => {
            const n = pats + 1;
            setPats(n);
            if (n >= 3) onDone();
          }}
        >
          Pat Dry with Towel ({pats}/3)
        </Button>
      )}
    </div>
  );
}

function BlemishTargets({ onDone }: { onDone: () => void }) {
  const [cleared, setCleared] = useState<Set<string>>(new Set());
  const muted = useProgressStore((s) => s.muted);

  const tap = (id: string) => {
    if (cleared.has(id)) return;
    const next = new Set(cleared);
    next.add(id);
    setCleared(next);
    void playSfx('tap', muted);
    if (next.size === BLEMISH_POINTS.length) onDone();
  };

  return (
    <>
      {BLEMISH_POINTS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => tap(p.id)}
          aria-label={cleared.has(p.id) ? 'Blemish soothed' : 'Soothe blemish'}
          className="absolute h-6 w-6 rounded-full focus-visible:outline-2 focus-visible:outline-accent"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)' }}
          data-testid={`blemish-${p.id}`}
        >
          <span
            aria-hidden="true"
            className={`block h-full w-full rounded-full border transition-all duration-300 ${
              cleared.has(p.id)
                ? 'scale-75 border-white/70 bg-[#efe0d0]/90'
                : 'border-white bg-rose-400/75 shadow-glow'
            }`}
          />
        </button>
      ))}
    </>
  );
}

function MaskStep({ onDone }: { onDone: () => void }) {
  const masks = SKINCARE_PRODUCTS.filter((p) => p.step === 'mask');
  const [picked, setPicked] = useState<string>();
  const [applied, setApplied] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [peel, setPeel] = useState(0);
  const apply = useHoldProgress(() => setApplied(true));
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!applied) return;
    const t = window.setTimeout(() => setWaiting(true), reducedMotion ? 50 : 2000);
    return () => window.clearTimeout(t);
  }, [applied, reducedMotion]);

  if (!picked) {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {masks.map((m) => (
          <Button
            key={m.id}
            variant="soft"
            onClick={() => setPicked(m.id)}
            aria-label={`Choose ${m.name}`}
          >
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: m.colors.primary }}
              aria-hidden="true"
            />
            <span className="truncate">{m.name}</span>
          </Button>
        ))}
      </div>
    );
  }
  if (!applied) {
    return (
      <div>
        <Button
          className="w-full"
          onPointerDown={apply.start}
          onPointerUp={apply.stop}
          onPointerLeave={apply.stop}
          aria-label="Hold to apply mask"
        >
          Hold to Smooth Mask ({Math.round(apply.progress)}%)
        </Button>
        <div className="mt-3">
          <Meter label="Coverage" value={apply.progress} />
        </div>
      </div>
    );
  }
  if (!waiting) {
    return (
      <p className="text-sm font-medium text-ink-soft" role="status">
        Mask setting — nourishing actives absorbing…
      </p>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-ink-soft">
        <label htmlFor="peel">Slide to peel off mask</label>
        <span className="tabular-nums font-semibold text-ink">{peel}%</span>
      </div>
      <input
        id="peel"
        type="range"
        min={0}
        max={100}
        value={peel}
        onChange={(e) => {
          const v = Number(e.target.value);
          setPeel(v);
          if (v >= 100) onDone();
        }}
        className="mt-2 h-8 w-full cursor-pointer accent-[var(--c-accent)]"
        aria-label="Peel off mask"
      />
    </div>
  );
}

function SerumStep({ onDone }: { onDone: () => void }) {
  const serums = SKINCARE_PRODUCTS.filter((p) => p.step === 'serum');
  const [picked, setPicked] = useState<string>();
  const [drops, setDrops] = useState(0);
  const muted = useProgressStore((s) => s.muted);
  const reducedMotion = useReducedMotion();

  if (!picked) {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {serums.map((m) => (
          <Button
            key={m.id}
            variant="soft"
            onClick={() => setPicked(m.id)}
            aria-label={`Choose ${m.name}`}
          >
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: m.colors.primary }}
              aria-hidden="true"
            />
            <span className="truncate">{m.name}</span>
          </Button>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        onClick={() => {
          const n = drops + 1;
          setDrops(n);
          void playSfx('sparkle', muted);
          if (n >= 3) onDone();
        }}
        aria-label={`Apply serum drop ${drops + 1} of 3`}
      >
        Dispense Serum Drop ({drops}/3)
      </Button>
      {!reducedMotion && drops > 0 && (
        <motion.div
          className="mx-auto h-1.5 w-10 rounded-full bg-accent/40"
          animate={{ y: [0, 6, 12], opacity: [1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function TapFaceTimes({
  times,
  label,
  onDone,
}: {
  times: number;
  label: string;
  onDone: () => void;
}) {
  const [count, setCount] = useState(0);
  const muted = useProgressStore((s) => s.muted);
  return (
    <button
      type="button"
      onClick={() => {
        const n = count + 1;
        setCount(n);
        void playSfx('tap', muted);
        if (n >= times) onDone();
      }}
      className="absolute inset-0 rounded-[45%]"
      style={{
        left: FACE_OVERLAY.left,
        top: FACE_OVERLAY.top,
        width: FACE_OVERLAY.width,
        height: FACE_OVERLAY.height,
      }}
      aria-label={`${label} (${count}/${times})`}
    />
  );
}

function MoisturizerStep({ onDone }: { onDone: () => void }) {
  const [cream, setCream] = useState(false);
  const [eye, setEye] = useState(false);
  const moisturizer = SKINCARE_PRODUCTS.find((p) => p.id === 'sk-moisturizer');
  const eyeCream = SKINCARE_PRODUCTS.find((p) => p.id === 'sk-eyecream');

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      <Button
        variant={cream ? 'soft' : 'primary'}
        onClick={() => {
          setCream(true);
          if (eye) onDone();
        }}
        aria-label={cream ? 'Moisturizer applied' : `Apply ${moisturizer?.name}`}
      >
        {cream && <CheckIcon className="h-4 w-4 text-accent-deep" />}
        <span>{moisturizer?.name}</span>
      </Button>
      <Button
        variant={eye ? 'soft' : 'primary'}
        onClick={() => {
          setEye(true);
          if (cream) onDone();
        }}
        aria-label={eye ? 'Eye cream applied' : `Apply ${eyeCream?.name}`}
      >
        {eye && <CheckIcon className="h-4 w-4 text-accent-deep" />}
        <span>{eyeCream?.name}</span>
      </Button>
    </div>
  );
}

function SwipeFace({ onDone }: { onDone: () => void }) {
  const dist = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const muted = useProgressStore((s) => s.muted);
  const TARGET = 420;
  const pct = Math.min(100, Math.round((progress / TARGET) * 100));

  return (
    <>
      <div
        role="slider"
        aria-label="Sunscreen coverage"
        aria-valuenow={pct}
        className="absolute touch-none rounded-[45%]"
        style={{
          left: FACE_OVERLAY.left,
          top: FACE_OVERLAY.top,
          width: FACE_OVERLAY.width,
          height: FACE_OVERLAY.height,
        }}
        onPointerMove={(e) => {
          const point = { x: e.clientX, y: e.clientY };
          if (last.current) {
            const d = Math.hypot(point.x - last.current.x, point.y - last.current.y);
            dist.current += d;
            setProgress(dist.current);
            if (dist.current >= TARGET) {
              void playSfx('sparkle', muted);
              onDone();
            }
          }
          last.current = point;
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap rounded-md bg-surface/90 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-ink shadow-soft">
        SPF {pct}%
      </div>
    </>
  );
}
