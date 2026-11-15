import { LockIcon } from './Icons';
import type { ReactNode } from 'react';

export interface ItemCardVariant {
  id: string;
  name: string;
  color: string;
}

interface ItemCardProps {
  name: string;
  tags?: readonly string[];
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  previewSrc?: ReactNode;
  variants?: readonly ItemCardVariant[];
  activeVariantId?: string;
  onVariantClick?: (id: string) => void;
  lockedCost?: number;
  affordable?: boolean;
  onUnlock?: () => void;
  testid?: string;
}

/**
 * Editorial catalog card. The entire card acts as an accessible button;
 * color swatches and unlock controls stop propagation cleanly.
 */
export function ItemCard({
  name,
  tags,
  description,
  selected = false,
  onClick,
  previewSrc,
  variants,
  activeVariantId,
  onVariantClick,
  lockedCost,
  affordable,
  onUnlock,
  testid,
}: ItemCardProps) {
  const locked = lockedCost !== undefined;
  const interactive = !locked && onClick !== undefined;
  const ariaLabel = locked
    ? `${name} — locked, ${lockedCost} coins`
    : `${name}${selected ? ' (selected)' : ''}`;

  return (
    <div
      data-testid={testid}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? selected : undefined}
      aria-label={interactive ? ariaLabel : undefined}
      onClick={() => {
        if (interactive) onClick();
      }}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface p-2.5 transition-all duration-150 ${
        selected
          ? 'border-accent ring-2 ring-accent/35 shadow-soft'
          : 'border-line hover:border-accent/40'
      } ${interactive ? 'cursor-pointer hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent' : ''}`}
    >
      {previewSrc ? (
        <div className={locked ? 'opacity-65' : ''} aria-hidden="true">
          {previewSrc}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col items-start justify-start pt-2">
        <span className="line-clamp-1 text-sm font-semibold text-ink">{name}</span>
        {description && <span className="mt-0.5 line-clamp-2 text-xs text-ink-soft">{description}</span>}
        {tags && tags.length > 0 && (
          <p className="mt-1 line-clamp-1 text-[11px] capitalize text-ink-soft">
            {tags.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>

      {variants && variants.length > 0 && !locked && (
        <div
          className="relative z-10 mt-2.5 flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label={`${name} colors`}
          onClick={(e) => e.stopPropagation()}
        >
          {variants.map((v) => {
            const isVarActive = activeVariantId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                title={v.name}
                aria-label={`${name}: ${v.name}`}
                aria-pressed={isVarActive}
                onClick={(e) => {
                  e.stopPropagation();
                  onVariantClick?.(v.id);
                }}
                className={`h-6 w-6 rounded-full border transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isVarActive ? 'border-accent ring-2 ring-accent/40 ring-offset-1' : 'border-black/15'
                }`}
                style={{ backgroundColor: v.color }}
              />
            );
          })}
        </div>
      )}

      {locked && (
        <div className="relative z-20 mt-2.5 flex items-center justify-between gap-2 border-t border-line pt-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums text-ink-soft">
            <LockIcon className="h-3.5 w-3.5" />
            {lockedCost}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUnlock?.();
            }}
            disabled={!affordable}
            className="min-h-[36px] shrink-0 whitespace-nowrap rounded-lg bg-gold px-3 text-xs font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label={`Unlock ${name} for ${lockedCost} coins${affordable ? '' : ' (not enough coins)'}`}
          >
            Unlock
          </button>
        </div>
      )}
    </div>
  );
}
