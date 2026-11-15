import { Chip } from './Chip';
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
 * Catalog card. The whole card is a single accessible button (whole surface is
 * the touch target — AGENT.md §9); variant dots and the unlock action stop
 * propagation from the card click.
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
      className={`relative flex flex-col rounded-2xl border bg-surface p-3 transition ${
        selected ? 'border-accent ring-2 ring-accent/40' : 'border-line'
      } ${interactive ? 'cursor-pointer hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent' : ''}`}
    >
      {previewSrc ? <div aria-hidden="true">{previewSrc}</div> : null}
      <div className="flex flex-1 flex-col items-start justify-center pt-1">
        <span className="text-sm font-semibold text-ink">{name}</span>
        {description && <span className="mt-0.5 text-xs text-ink-soft">{description}</span>}
        {tags && tags.length > 0 && (
          <span className="mt-1.5 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </span>
        )}
      </div>
      {variants && variants.length > 0 && !locked && (
        <div
          className="relative z-10 mt-2 flex items-center gap-1.5"
          role="group"
          aria-label={`${name} colors`}
          onClick={(e) => e.stopPropagation()}
        >
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              title={v.name}
              aria-label={`${name}: ${v.name}`}
              aria-pressed={activeVariantId === v.id}
              onClick={(e) => {
                e.stopPropagation();
                onVariantClick?.(v.id);
              }}
              className={`h-6 w-6 rounded-full border-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                activeVariantId === v.id ? 'border-accent ring-2 ring-accent/40' : 'border-line'
              }`}
              style={{ backgroundColor: v.color }}
            />
          ))}
        </div>
      )}
      {locked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl bg-ink/60 text-white">
          <span className="text-lg" aria-hidden="true">
            🔒
          </span>
          <span className="text-xs font-semibold">{lockedCost} coins</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUnlock?.();
            }}
            disabled={!affordable}
            className="min-h-[36px] rounded-full bg-gold px-3 text-xs font-bold text-ink disabled:opacity-50"
            aria-label={`Unlock ${name} for ${lockedCost} coins${affordable ? '' : ' (not enough coins)'}`}
          >
            Unlock
          </button>
        </div>
      )}
    </div>
  );
}
