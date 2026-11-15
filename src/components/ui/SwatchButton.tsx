interface SwatchButtonProps {
  color: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
  size?: 'md' | 'lg';
}

/** Round color swatch with an accessible label and a selected ring. */
export function SwatchButton({ color, label, selected = false, onClick, size = 'md' }: SwatchButtonProps) {
  const dims = size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={selected}
      className={`${dims} rounded-full border-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        selected ? 'border-accent ring-2 ring-accent/40' : 'border-line'
      }`}
      style={{ backgroundColor: color }}
    />
  );
}
