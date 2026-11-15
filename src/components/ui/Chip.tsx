interface ChipProps {
  children: React.ReactNode;
  tone?: 'default' | 'accent';
}

export function Chip({ children, tone = 'default' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        tone === 'accent' ? 'bg-accent/10 text-accent-deep' : 'bg-surface-2 text-ink-soft'
      }`}
    >
      {children}
    </span>
  );
}
