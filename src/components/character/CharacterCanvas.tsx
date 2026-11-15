import type { ReactNode } from 'react';
import { useCharacterLayers } from './useCharacterLayers';

interface CharacterCanvasProps {
  /** Optional backdrop rendered behind the character (photo studio preview). */
  backgroundSrc?: string;
  filterCss?: string;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * Stacked DOM-layer character compositor (AGENT.md §2): every layer shares the
 * same 1000×1600 canvas so layers align exactly; makeup layers blend.
 */
export function CharacterCanvas({
  backgroundSrc,
  filterCss,
  children,
  className = '',
  ariaLabel,
}: CharacterCanvasProps) {
  const layers = useCharacterLayers();
  return (
    <div
      role="img"
      aria-label={ariaLabel ?? 'Styled character'}
      className={`relative w-full select-none ${className}`}
      style={{
        aspectRatio: '600 / 1280',
        filter: filterCss && filterCss !== 'none' ? filterCss : undefined,
      }}
    >
      {backgroundSrc && (
        <img
          src={backgroundSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: -1 }}
        />
      )}
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
      {children}
    </div>
  );
}
