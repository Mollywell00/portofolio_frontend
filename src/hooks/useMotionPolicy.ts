import { useMediaQuery } from './useMediaQuery';

export interface MotionPolicy {
  reduced: boolean;
  finePointer: boolean;
  cursor: boolean;
  /** Cursor ikut dengan lerp (false saat reduced motion: menempel langsung). */
  cursorLerp: boolean;
  magnetic: boolean;
  parallax: boolean;
  webgl: 'animated' | 'static';
}

/**
 * Matriks perilaku PORTFOLIO_STANDARD §9 dalam satu tempat.
 * Semua efek bertanya ke sini, bukan membaca media query sendiri.
 */
export function useMotionPolicy(): MotionPolicy {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const pointerEffects = finePointer && !reduced;

  return {
    reduced,
    finePointer,
    cursor: finePointer,
    cursorLerp: pointerEffects,
    magnetic: pointerEffects,
    parallax: pointerEffects,
    webgl: pointerEffects ? 'animated' : 'static',
  };
}
