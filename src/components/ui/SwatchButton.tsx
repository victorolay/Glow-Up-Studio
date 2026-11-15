interface SwatchButtonProps {
  color: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
  size?: 'md' | 'lg';
}

/** Round color swatch with an accessible label and crisp selection ring. */
export function SwatchButton({ color, label, selected = false, onClick, size = 'md' }: SwatchButtonProps) {
  const dims = size === 'lg' ? 'h-11 w-11' : 'h-10 w-10';
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={selected}
      className={`${dims} relative shrink-0 rounded-full border transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        selected
          ? 'border-accent ring-2 ring-accent ring-offset-2 ring-offset-surface'
          : 'border-black/15'
      }`}
      style={{ backgroundColor: color }}
    />
  );
}
