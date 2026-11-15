import { BLEMISH_POINTS, FACE_OVERLAY } from '@/components/character/useCharacterLayers';
import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
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

const STEPS: Array<{ id: SkincareStepId; title: string; blurb: string }> = [
  { id: 'scan', title: 'Skin Scan', blurb: 'Let the SkinPad read your skin.' },
  { id: 'cleanse', title: 'Cleanse', blurb: 'Foam, rinse, pat dry.' },
  { id: 'blemish', title: 'Blemish Care', blurb: 'Tap each blemish to soothe it with a patch.' },
  { id: 'mask', title: 'Mask', blurb: 'Pick a mask, apply, wait, peel off.' },
  { id: 'serum', title: 'Serum', blurb: 'Pick a serum, drop it on three spots.' },
  { id: 'moisturizer', title: 'Moisturize', blurb: 'Cream all over, cream under the eyes.' },
  { id: 'sunscreen', title: 'Sunscreen', blurb: 'Swipe across your face to protect.' },
];

const CONCERNS = [
  { label: 'Blemishes', x: 45.3, y: 12.5 },
  { label: 'Dark circles', x: 55, y: 11.5 },
  { label: 'Dry cheeks', x: 42.5, y: 13.5 },
  { label: 'Oily T-zone', x: 50, y: 8.5 },
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
  return { progress, start, stop, reset: () => { done.current = false; setProgress(0); } };
}

export function SkincareStage({ challenge }: { challenge: Challenge }) {
  const next = useGameStore((s) => s.next);
  const back = useGameStore((s) => s.back);
  const completed = useCharacterStore((s) => s.skincare.completed);
  const skinHealth = useCharacterStore((s) => s.skincare.skinHealth);
  const completeSkincareStep = useCharacterStore((s) => s.completeSkincareStep);
  const muted = useProgressStore((s) => s.muted);
  const reducedMotion = useReducedMotion();

  const [active, setActive] = useState<SkincareStepId>(() => STEPS.find((s) => !completed[s.id])?.id ?? 'sunscreen');
  const step = STEPS.find((s) => s.id === active) ?? STEPS[0];

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
      subtitle="Skincare"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextLabel="Makeup ›"
      dots={dots}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Character with interaction overlays */}
        <div className="mx-auto w-full max-w-[300px] shrink-0">
          <CharacterCanvas ariaLabel="Your character receiving skincare">
            <div
              className="absolute rounded-[45%] border-2 border-dashed border-accent/30"
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
            {active === 'serum' && <TapFaceTimes times={3} label="Apply serum drops" onDone={() => finishStep('serum')} />}
            {active === 'sunscreen' && <SwipeFace onDone={() => finishStep('sunscreen')} />}
          </CharacterCanvas>
        </div>

        {/* Step panel */}
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Skincare steps">
            {STEPS.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active === s.id}
                data-testid={`skincare-step-${s.id}`}
                onClick={() => setActive(s.id)}
                className={`min-h-[36px] rounded-full px-3 py-1 text-xs font-semibold transition ${
                  active === s.id
                    ? 'bg-accent text-white'
                    : completed[s.id]
                      ? 'bg-accent/10 text-accent-deep'
                      : 'bg-surface text-ink-soft'
                }`}
              >
                {completed[s.id] ? '✓ ' : ''}
                {s.title}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
            <h2 className="font-display text-xl font-bold text-ink">{step.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">{step.blurb}</p>
            <div className="mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                >
                  {active === 'scan' && <ScanStep onDone={() => finishStep('scan')} />}
                  {active === 'cleanse' && <CleanseStep onDone={() => finishStep('cleanse')} />}
                  {active === 'blemish' && (
                    <p className="text-sm text-ink-soft">
                      Tap the glowing dots on your face to shrink blemishes and apply soothing patches.
                    </p>
                  )}
                  {active === 'mask' && <MaskStep onDone={() => finishStep('mask')} />}
                  {active === 'serum' && <SerumStep onDone={() => finishStep('serum')} />}
                  {active === 'moisturizer' && <MoisturizerStep onDone={() => finishStep('moisturizer')} />}
                  {active === 'sunscreen' && (
                    <p className="text-sm text-ink-soft">
                      Swipe across your face (the dashed area) to spread the SPF.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {completed[active] && (
              <p className="mt-3 text-sm font-semibold text-accent-deep">
                ✓ Done — +{SKINCARE_STEP_POINTS[active]} skin health
              </p>
            )}
          </div>

          <div className="mt-3">
            <Meter label="Skin health" value={skinHealth} />
          </div>
        </div>
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
    window.setTimeout(() => {
      setScanning(false);
      setDone(true);
    }, reducedMotion ? 100 : 1600);
  };

  return (
    <div data-testid="skincare-scan">
      {!done ? (
        <Button onClick={runScan} disabled={scanning}>
          {scanning ? 'Scanning…' : 'Start skin scan'}
        </Button>
      ) : (
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {CONCERNS.map((c) => (
              <span key={c.label} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-deep">
                {c.label}
              </span>
            ))}
          </div>
          <Button onClick={onDone}>Save scan results</Button>
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
            Hold to foam up ({Math.round(foam.progress)}%)
          </Button>
          <div className="mt-2">
            <Meter label="Foam" value={foam.progress} />
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
          Splash! Rinse ({rinses}/3)
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
          Pat dry ({pats}/3)
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
          className="absolute h-11 w-11 rounded-full focus-visible:outline-2 focus-visible:outline-accent"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)' }}
          data-testid={`blemish-${p.id}`}
        >
          <span
            aria-hidden="true"
            className={`block h-full w-full rounded-full transition-all duration-500 ${
              cleared.has(p.id) ? 'scale-90 bg-[#efe0d0] opacity-90' : 'bg-rose-300/70'
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
    const t = window.setTimeout(() => setWaiting(true), reducedMotion ? 50 : 2500);
    return () => window.clearTimeout(t);
  }, [applied, reducedMotion]);

  if (!picked) {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {masks.map((m) => (
          <Button key={m.id} variant="soft" onClick={() => setPicked(m.id)} aria-label={`Choose ${m.name}`}>
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: m.colors.primary }} aria-hidden="true" />
            {m.name}
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
          Hold to apply ({Math.round(apply.progress)}%)
        </Button>
        <div className="mt-2">
          <Meter label="Mask coverage" value={apply.progress} />
        </div>
      </div>
    );
  }
  if (!waiting) {
    return <p className="text-sm text-ink-soft" role="status">Mask setting… let it work its magic ✨</p>;
  }
  return (
    <div>
      <label htmlFor="peel" className="text-sm font-medium text-ink-soft">
        Peel off
      </label>
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
        className="mt-2 w-full accent-[var(--c-accent)]"
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
          <Button key={m.id} variant="soft" onClick={() => setPicked(m.id)} aria-label={`Choose ${m.name}`}>
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: m.colors.primary }} aria-hidden="true" />
            {m.name}
          </Button>
        ))}
      </div>
    );
  }
  return (
    <div>
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
        Drop serum ({drops}/3)
      </Button>
      {!reducedMotion && drops > 0 && (
        <motion.div
          className="mx-auto mt-2 h-2 w-10 rounded-full bg-accent/40"
          animate={{ y: [0, 8, 16], opacity: [1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function TapFaceTimes({ times, label, onDone }: { times: number; label: string; onDone: () => void }) {
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
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <Button
        variant={cream ? 'soft' : 'primary'}
        onClick={() => {
          setCream(true);
          if (eye) onDone();
        }}
        aria-label={cream ? 'Moisturizer applied' : `Apply ${moisturizer?.name}`}
      >
        {cream ? '✓ ' : ''}
        {moisturizer?.name}
      </Button>
      <Button
        variant={eye ? 'soft' : 'primary'}
        onClick={() => {
          setEye(true);
          if (cream) onDone();
        }}
        aria-label={eye ? 'Eye cream applied' : `Apply ${eyeCream?.name}`}
      >
        {eye ? '✓ ' : ''}
        {eyeCream?.name}
      </Button>
    </div>
  );
}

function SwipeFace({ onDone }: { onDone: () => void }) {
  const dist = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const muted = useProgressStore((s) => s.muted);
  const TARGET = 500;

  return (
    <>
      <div
        role="slider"
        aria-label="Sunscreen coverage"
        aria-valuenow={Math.min(100, Math.round((progress / TARGET) * 100))}
        className="absolute rounded-[45%] touch-none"
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
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-ink-soft">
        swipe! {Math.min(100, Math.round((progress / TARGET) * 100))}%
      </div>
    </>
  );
}
