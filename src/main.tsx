import App from '@/app/App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Offline-friendly app shell caching (production only — dev must always be fresh).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {
    // Registration is best-effort; the game works without it.
  });
}
