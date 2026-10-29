import { useEffect, type RefObject } from 'react';
import { useMotion } from './useMotion';
import { useMotionPolicy } from './useMotionPolicy';

interface MagneticOptions {
  /** Tarikan maksimum dalam px (VISUAL_SPEC: 10). */
  max?: number;
  strength?: number;
}

/** Elemen tertarik ke arah cursor, kembali dengan ease elastic. Mati di touch & reduced motion. */
export function useMagnetic<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { max = 10, strength = 0.35 }: MagneticOptions = {},
) {
  const { magnetic } = useMotionPolicy();
  const motion = useMotion(magnetic);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion) return;
    const { gsap, ease } = motion;

    const toX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const toY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      toX(gsap.utils.clamp(-max, max, (e.clientX - (r.left + r.width / 2)) * strength));
      toY(gsap.utils.clamp(-max, max, (e.clientY - (r.top + r.height / 2)) * strength));
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: ease.magnet });

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'x,y' });
    };
  }, [ref, motion, max, strength]);
}
