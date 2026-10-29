import { useEffect, useState } from 'react';
import { loadMotion, type Motion } from '../animations/loadMotion';

/** Modul GSAP bila sudah dimuat (null sebelum siap atau bila efek dimatikan). */
export function useMotion(enabled: boolean): Motion | null {
  const [motion, setMotion] = useState<Motion | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    void loadMotion().then((m) => {
      if (alive) setMotion(m);
    });
    return () => {
      alive = false;
    };
  }, [enabled]);

  return enabled ? motion : null;
}
