interface MeterProps {
  value: number;
  max?: number;
  label: string;
  showValue?: boolean;
}

/** Labeled progress meter with a text fallback so state isn't color-only (§9). */
export function Meter({ value, max = 100, label, showValue = true }: MeterProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-ink-soft">
        <span>{label}</span>
        {showValue && (
          <span aria-hidden="true">
            {Math.round(value)}/{max}
          </span>
        )}
      </div>
      <div
        role="meter"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-2.5 overflow-hidden rounded-full bg-surface-2"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
