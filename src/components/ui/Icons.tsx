import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
};

export function MenuIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function SoundOnIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function SoundOffIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m21 9-6 6M15 9l6 6" />
    </svg>
  );
}

export function LightbulbIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M9 18h6M10 21h4" />
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    </svg>
  );
}

export function CameraIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function DownloadIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M12 4v11m0 0-4-4m4 4 4-4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function ShareIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.9 7.6-4.4M8.2 13.1l7.6 4.4" />
    </svg>
  );
}

export function TrashIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </svg>
  );
}

export function LockIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function CheckIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function CloseIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ZoomInIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4M11 8v6M8 11h6" />
    </svg>
  );
}

export function ZoomOutIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4M8 11h6" />
    </svg>
  );
}

export function SparkleIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M19 3v3M20.5 4.5h-3" />
    </svg>
  );
}

export function CoinIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8M9.5 10.5c0-1 1.1-1.5 2.5-1.5s2.5.6 2.5 1.5-1 1.3-2.5 1.5-2.5.6-2.5 1.5 1.1 1.5 2.5 1.5 2.5-.6 2.5-1.5" />
    </svg>
  );
}

export function StarIcon({ className = 'h-4 w-4', filled = false, ...rest }: IconProps & { filled?: boolean }) {
  return (
    <svg
      {...base}
      fill={filled ? 'currentColor' : 'none'}
      className={className}
      {...rest}
    >
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    </svg>
  );
}

export function Rotate360Icon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

export function PlayIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" className={className} {...rest}>
      <path d="M7 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export function PauseIcon({ className = 'h-4 w-4', ...rest }: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" className={className} {...rest}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
