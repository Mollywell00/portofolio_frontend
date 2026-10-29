import { useCallback, useSyncExternalStore } from 'react';
import { useMediaQuery } from './useMediaQuery';

export type Theme = 'light' | 'dark';

const KEY = 'theme';
const listeners = new Set<() => void>();

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

// Satu sumber untuk semua tombol tema (header + menu mobile).
let chosen: Theme | null = typeof window === 'undefined' ? null : readStored();

function setChosen(next: Theme) {
  chosen = next;
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // storage diblokir: tema tetap berlaku untuk sesi ini
  }
  for (const notify of listeners) notify();
}

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};

/**
 * Tema awal mengikuti sistem; pilihan pengguna disimpan (bila storage tersedia).
 * index.html menerapkan tema tersimpan sebelum render agar tidak berkedip.
 */
export function useTheme() {
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const stored = useSyncExternalStore(
    subscribe,
    () => chosen,
    () => null,
  );
  const theme: Theme = stored ?? (systemDark ? 'dark' : 'light');
  const toggle = useCallback(() => setChosen(theme === 'dark' ? 'light' : 'dark'), [theme]);
  return { theme, toggle };
}
