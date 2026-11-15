/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg-rgb) / <alpha-value>)',
        surface: 'rgb(var(--c-surface-rgb) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2-rgb) / <alpha-value>)',
        ink: 'rgb(var(--c-ink-rgb) / <alpha-value>)',
        'ink-soft': 'rgb(var(--c-ink-soft-rgb) / <alpha-value>)',
        accent: 'rgb(var(--c-accent-rgb) / <alpha-value>)',
        'accent-deep': 'rgb(var(--c-accent-deep-rgb) / <alpha-value>)',
        gold: 'rgb(var(--c-gold-rgb) / <alpha-value>)',
        line: 'rgb(var(--c-line-rgb) / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(35, 27, 41, 0.08)',
        elevated: '0 16px 40px rgba(35, 27, 41, 0.12)',
        glow: '0 0 24px rgba(158, 79, 118, 0.22)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
