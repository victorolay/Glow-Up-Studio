import { isBackAngle, normalizeAngle } from '@/game/engine/studioHelpers';
import { useCharacterStore } from '@/game/store/characterStore';
import type { PhotoFraming } from '@/game/types';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useShowcaseContext } from './ShowcaseContext';
import { useCharacterHairColor, useCharacterLayers } from './useCharacterLayers';

interface CharacterCanvasProps {
  /** Optional backdrop rendered behind the character (photo studio preview). */
  backgroundSrc?: string;
  filterCss?: string;
  /** Optional mirror camera mode: full body or close-up face focus. */
  zoomMode?: 'full' | 'face';
  /** Studio camera framing crop (overrides zoomMode when set). */
  framing?: PhotoFraming;
  /** Continuous 360-degree turntable angle in degrees. */
  turnAngle?: number;
  /** Enables horizontal pointer drag rotation on the canvas. */
  onTurnAngleChange?: (deg: number) => void;
  /** Enables animated fashion-week catwalk strut & pivot sequence. */
  runwayActive?: boolean;
  /** Shows the untouched model (no skincare glow, makeup, hair, or outfit). */
  bareMode?: boolean;
  /** Optional editorial magazine cover masthead & title overlay. */
  magazineCover?: { title: string; subtitle: string } | null;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

interface RunwayFrame {
  scale: number;
  translateX: number;
  translateY: number;
  rotateZ: number;
  angle: number;
  flash: number;
}

function sampleRunwayFrame(progress: number): RunwayFrame {
  const p = progress % 1;
  if (p < 0.44) {
    const u = p / 0.44;
    const stride = u * Math.PI * 6;
    return {
      scale: 0.7 + 0.34 * u,
      translateX: Math.sin(stride) * 1.4,
      translateY: -9 + 11 * u - Math.abs(Math.cos(stride)) * 1.1,
      rotateZ: Math.sin(stride) * 1.3,
      angle: 0,
      flash: 0,
    };
  }
  if (p < 0.58) {
    const u = (p - 0.44) / 0.14;
    return {
      scale: 1.04,
      translateX: 0,
      translateY: 2,
      rotateZ: Math.sin(u * Math.PI) * 1.2,
      angle: 0,
      flash: Math.sin(u * Math.PI) * 0.24,
    };
  }
  if (p < 0.76) {
    const u = (p - 0.58) / 0.18;
    return {
      scale: 1.04,
      translateX: 0,
      translateY: 2,
      rotateZ: 0,
      angle: u * 360,
      flash: 0,
    };
  }
  const u = (p - 0.76) / 0.24;
  const stride = u * Math.PI * 4;
  return {
    scale: 1.04 - 0.34 * u,
    translateX: Math.sin(stride) * 1.1,
    translateY: 2 - 11 * u - Math.abs(Math.cos(stride)) * 0.9,
    rotateZ: Math.sin(stride) * 1.0,
    angle: 180,
    flash: 0,
  };
}

/**
 * Stacked DOM-layer character compositor: every layer shares the
 * same 600×1280 canvas so layers, 360° turns, and runway motion align exactly.
 */
export function CharacterCanvas({
  backgroundSrc,
  filterCss,
  zoomMode = 'full',
  framing,
  turnAngle: turnAngleProp,
  onTurnAngleChange: onTurnAngleProp,
  runwayActive: runwayProp,
  bareMode = false,
  magazineCover,
  children,
  className = '',
  ariaLabel,
}: CharacterCanvasProps) {
  const showcase = useShowcaseContext();
  const pose = useCharacterStore((s) => s.pose);
  const hairColor = useCharacterHairColor();
  const reducedMotion = useReducedMotion();

  const turnAngle = turnAngleProp ?? showcase?.turnAngle ?? 0;
  const onTurnAngleChange = onTurnAngleProp ?? showcase?.setTurnAngle;
  const runwayActive = runwayProp ?? showcase?.runwayActive ?? false;

  const [runwayFrame, setRunwayFrame] = useState<RunwayFrame>(() => ({
    scale: 1,
    translateX: 0,
    translateY: 0,
    rotateZ: 0,
    angle: 0,
    flash: 0,
  }));

  useEffect(() => {
    if (!runwayActive) {
      setRunwayFrame({
        scale: 1,
        translateX: 0,
        translateY: 0,
        rotateZ: 0,
        angle: 0,
        flash: 0,
      });
      return;
    }
    if (reducedMotion) {
      setRunwayFrame({
        scale: 1.02,
        translateX: 0,
        translateY: 1.5,
        rotateZ: -0.8,
        angle: 0,
        flash: 0,
      });
      return;
    }

    let rafId = 0;
    const start = performance.now();
    const cycleMs = 6400;
    const tick = (now: number) => {
      const progress = ((now - start) % cycleMs) / cycleMs;
      setRunwayFrame(sampleRunwayFrame(progress));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [runwayActive, reducedMotion]);

  const effectiveAngle = normalizeAngle(runwayActive ? runwayFrame.angle : turnAngle);
  const isBackView = isBackAngle(effectiveAngle);
  const layers = useCharacterLayers({ bareMode, isBackView });

  // Framing / camera zoom
  const effectiveFraming: PhotoFraming = framing ?? (zoomMode === 'face' ? 'portrait' : 'full');
  const framingScale =
    effectiveFraming === 'portrait' ? 2.45 : effectiveFraming === 'half' ? 1.52 : 1;
  const framingOrigin =
    effectiveFraming === 'portrait'
      ? '50% 3%'
      : effectiveFraming === 'half'
        ? '50% 16%'
        : '50% 50%';

  // 360° foreshortening + 3D tilt (keeps profile graceful without collapsing to 0px)
  const rad = (effectiveAngle * Math.PI) / 180;
  const tiltDeg = Math.sin(rad) * 34;
  const widthFactor = 0.54 + 0.46 * Math.abs(Math.cos(rad));
  const poseTilt =
    !runwayActive && effectiveFraming === 'full'
      ? pose === 'vogue'
        ? 1.4
        : pose === 'runway'
          ? -0.9
          : 0
      : 0;

  // Pointer drag-to-rotate on canvas
  const dragRef = useRef<{ startX: number; startAngle: number } | null>(null);
  const canDrag = Boolean(onTurnAngleChange) && !runwayActive;

  const figureParts: string[] = [];
  if (framingScale !== 1) figureParts.push(`scale(${framingScale})`);
  if (runwayActive) {
    figureParts.push(
      `translate(${runwayFrame.translateX.toFixed(2)}%, ${runwayFrame.translateY.toFixed(2)}%)`,
      `scale(${runwayFrame.scale.toFixed(3)})`,
      `rotate(${runwayFrame.rotateZ.toFixed(2)}deg)`,
    );
  } else if (poseTilt !== 0) {
    figureParts.push(`rotate(${poseTilt}deg)`);
  }
  if (effectiveAngle !== 0) {
    figureParts.push(`perspective(1000px) rotateY(${tiltDeg.toFixed(1)}deg) scaleX(${widthFactor.toFixed(3)})`);
  }

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? 'Styled character'}
      onPointerDown={(e) => {
        if (!canDrag || !onTurnAngleChange) return;
        dragRef.current = { startX: e.clientX, startAngle: effectiveAngle };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragRef.current || !onTurnAngleChange) return;
        const dx = e.clientX - dragRef.current.startX;
        onTurnAngleChange(normalizeAngle(dragRef.current.startAngle + dx * 1.1));
      }}
      onPointerUp={() => {
        dragRef.current = null;
      }}
      onPointerCancel={() => {
        dragRef.current = null;
      }}
      className={`relative w-full select-none overflow-hidden ${
        canDrag ? 'cursor-grab touch-pan-y active:cursor-grabbing' : ''
      } ${className}`}
      style={{
        aspectRatio: '600 / 1280',
        filter: filterCss && filterCss !== 'none' ? filterCss : undefined,
      }}
    >
      {/* Backdrop */}
      {backgroundSrc && (
        <img
          src={backgroundSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Fashion-Week Catwalk Stage Atmosphere */}
      {runwayActive && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ zIndex: 1 }}>
          <div
            className="absolute inset-0"
            style={{
              background: backgroundSrc
                ? 'radial-gradient(circle at 50% 25%, rgba(20,12,28,0.18), rgba(10,6,16,0.72) 85%)'
                : 'linear-gradient(180deg, #120c1b 0%, #241634 62%, #140d1d 100%)',
            }}
          />
          {/* Dual runway spotlights */}
          <div
            className="absolute inset-0 opacity-65"
            style={{
              background:
                'conic-gradient(from 155deg at 22% -8%, rgba(255,232,188,0.28) 0deg, transparent 28deg), conic-gradient(from 175deg at 78% -8%, rgba(244,210,255,0.24) 0deg, transparent 28deg)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)',
            }}
          />
          {/* Illuminated perspective catwalk */}
          <div
            className="absolute bottom-0 left-1/2 h-[30%] w-[92%] -translate-x-1/2"
            style={{
              clipPath: 'polygon(26% 0%, 74% 0%, 100% 100%, 0% 100%)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(245,236,246,0.24) 65%, rgba(212,168,83,0.28) 100%)',
              borderTop: '1px solid rgba(255,255,255,0.28)',
            }}
          />
        </div>
      )}

      {/* Character compositor stack (scaled/rotated as a single aligned unit) */}
      <div
        className={`relative h-full w-full ${
          runwayActive ? '' : 'transition-transform duration-200 ease-out'
        }`}
        style={{
          zIndex: 2,
          transform: figureParts.join(' ') || undefined,
          transformOrigin: framingOrigin,
        }}
      >
        {layers.map((l) => (
          <img
            key={l.key}
            src={l.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{
              zIndex: l.z,
              mixBlendMode: l.blend ?? 'normal',
              opacity: l.opacity ?? 1,
            }}
          />
        ))}

        {/* Sculpted back-of-head crown when viewing 180-degree turntable */}
        {isBackView && !bareMode && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full"
            style={{
              left: '42.2%',
              top: '6.3%',
              width: '15.6%',
              height: '9.9%',
              zIndex: 42,
              background: `radial-gradient(circle at 38% 32%, ${hairColor}ee 0%, ${hairColor} 62%, #140e12 100%)`,
              boxShadow: 'inset 0 -8px 14px rgba(0,0,0,0.34)',
            }}
          />
        )}

        {children}
      </div>

      {/* Camera flash pulse on runway strike pose */}
      {runwayActive && runwayFrame.flash > 0.01 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-white"
          style={{ zIndex: 20, opacity: runwayFrame.flash }}
        />
      )}

      {/* Editorial Magazine Cover frame overlay */}
      {magazineCover && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2 sm:p-2.5"
          style={{ zIndex: 25 }}
        >
          <div className="rounded-lg bg-gradient-to-b from-ink/60 via-ink/20 to-transparent px-2 pt-0.5 pb-1.5 text-center">
            <p className="font-display text-base font-bold leading-none tracking-[0.24em] text-white drop-shadow sm:text-lg">
              GLOW UP
            </p>
            <p className="mt-0.5 text-[7px] font-semibold uppercase leading-none tracking-[0.2em] text-gold sm:text-[8px]">
              Atelier Editorial · Collector Issue
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-t from-ink/75 via-ink/30 to-transparent px-3 pb-2 pt-5 text-left">
            <p className="font-display text-base font-bold leading-tight text-white drop-shadow sm:text-lg">
              {magazineCover.title}
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-white/85">
              {magazineCover.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* Subtle turntable angle badge */}
      {!runwayActive && Math.round(effectiveAngle) !== 0 && !magazineCover && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-ink/75 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-white"
          style={{ zIndex: 30 }}
        >
          {Math.round(effectiveAngle)}°{isBackView ? ' · Back' : ''}
        </div>
      )}
    </div>
  );
}
