import { useEffect, type RefObject } from 'react';
import { useMotion } from './useMotion';
import { useMotionPolicy } from './useMotionPolicy';

/**
 * Geser elemen ±depth px mengikuti cursor (VISUAL_SPEC §5: nama ±8, meta ±4).
 * Mati di touch & reduced motion; posisi dikembalikan saat dimatikan.
 */
export function useMouseParallax<T extends HTMLElement | SVGElement>(
  ref: RefObject<T | null>,
  depth: number,
) {
  const { parallax } = useMotionPolicy();
  const motion = useMotion(parallax);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion) return;
    const { gsap } = motion;

    const toX = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' });
    const toY = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' });
    const onMove = (e: PointerEvent) => {
      toX(((e.clientX / window.innerWidth) * 2 - 1) * depth);
      toY(((e.clientY / window.innerHeight) * 2 - 1) * depth);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'x,y' });
    };
  }, [ref, motion, depth]);
}
