import { useEffect } from 'react';
import { useMotionPolicy } from './useMotionPolicy';

/**
 * Reveal sekali saat masuk layar untuk setiap `.terrace` di <main> (VISUAL_SPEC §5):
 * garis teras tergambar kiri→kanan, lalu isi naik 24px. Hanya CSS transform/opacity.
 * Reduced motion: tidak ada kelas → konten langsung tampil.
 */
export function useReveal(key: string) {
  const { reduced } = useMotionPolicy();

  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    const sections = document.querySelectorAll<HTMLElement>('main .terrace');
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    root.classList.add('reveal');
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      root.classList.remove('reveal');
      sections.forEach((s) => s.classList.remove('is-in'));
    };
  }, [key, reduced]);
}
