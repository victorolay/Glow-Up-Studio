/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        'surface-2': 'var(--c-surface-2)',
        ink: 'var(--c-ink)',
        'ink-soft': 'var(--c-ink-soft)',
        accent: 'var(--c-accent)',
        'accent-deep': 'var(--c-accent-deep)',
        gold: 'var(--c-gold)',
        line: 'var(--c-line)',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(43, 35, 51, 0.10)',
        glow: '0 0 24px rgba(176, 106, 143, 0.25)',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};
