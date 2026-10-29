import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './styles/global.css';
import { App } from './app/App';

const root = document.getElementById('root');
if (!root) throw new Error('#root tidak ditemukan');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Halaman hasil prerender → hydrate. 404.html dipakai untuk semua URL tak dikenal (EN & ID),
// jadi dirender ulang di klien agar bahasanya sesuai URL. Dev server → render biasa.
const isFallback = document.querySelector('meta[name="robots"][content="noindex"]');
if (root.hasChildNodes() && !isFallback) hydrateRoot(root, app);
else createRoot(root).render(app);
