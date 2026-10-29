import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../../hooks/useMotion';
import { useMotionPolicy } from '../../hooks/useMotionPolicy';
import styles from './Cursor.module.css';

type CursorState = 'default' | 'link' | 'project';

const INTERACTIVE = 'a, button, input, label, select, textarea, summary, [role="button"]';

/** Wujud cursor menurut elemen di bawahnya: `data-cursor` menang, lalu elemen interaktif. */
function stateFor(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return 'default';
  const marked = target.closest('[data-cursor]')?.getAttribute('data-cursor');
  if (marked === 'project' || marked === 'link') return marked;
  return target.closest(INTERACTIVE) ? 'link' : 'default';
}

/**
 * Titik + cincin yang mengikuti pointer presisi (VISUAL_SPEC §5).
 * Cincin ikut dengan lerp; saat reduced motion menempel langsung.
 * Cursor native baru disembunyikan setelah cursor kustom benar-benar siap.
 */
export function Cursor() {
  const { cursor, cursorLerp } = useMotionPolicy();
  const motion = useMotion(cursor);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!motion || !dot || !ring) return;
    const { gsap } = motion;

    const lag = cursorLerp ? 0.45 : 0;
    // Titik menempel tanpa tween; cincin menyusul dengan lag.
    const dotX = gsap.quickSetter(dot, 'x', 'px');
    const dotY = gsap.quickSetter(dot, 'y', 'px');
    const ringX = gsap.quickTo(ring, 'x', { duration: lag, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: lag, ease: 'power3.out' });
    let first = true;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (first) {
        // Lompat langsung ke posisi awal agar cincin tidak meluncur dari pojok.
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        first = false;
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => setState(stateFor(e.target));
    const onLeave = () => setVisible(false);

    document.documentElement.classList.add('has-cursor');
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf([dot, ring]);
    };
  }, [motion, cursorLerp]);

  if (!cursor) return null;
  return (
    <div className={styles.cursor} data-state={state} data-visible={visible} aria-hidden="true">
      <div ref={ringRef} className={styles.ring}>
        <span />
      </div>
      <div ref={dotRef} className={styles.dot} />
    </div>
  );
}
