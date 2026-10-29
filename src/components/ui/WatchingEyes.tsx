import { useEffect, useId, useRef } from 'react';
import { useMotionPolicy } from '../../hooks/useMotionPolicy';
import { cn } from '../../utils/cn';
import styles from './WatchingEyes.module.css';

/** Diam selama ini (ms) → mata mulai berkedip. */
const IDLE_MS = 5000;
const ACTIVITY = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

const BLINK = styles.blink ?? 'blink';

const EYES = [110, 330].map((cx) => ({ cx, cy: 90 }));
const VIEW_W = 440;
/** Gerak pupil maksimum (unit viewBox) — tetap di dalam kelopak. */
const REACH_X = 26;
const REACH_Y = 16;

const almond = (cx: number, cy: number) =>
  `M${cx - 90} ${cy}C${cx - 50} ${cy - 62} ${cx + 50} ${cy - 62} ${cx + 90} ${cy}` +
  `C${cx + 50} ${cy + 62} ${cx - 50} ${cy + 62} ${cx - 90} ${cy}Z`;

// Enam landmark ala EAR (p1…p6) — rujukan ke proyek Drowsiness Detection.
const landmarks = (cx: number, cy: number) => [
  [cx - 90, cy],
  [cx - 32, cy - 44],
  [cx + 32, cy - 44],
  [cx + 90, cy],
  [cx + 32, cy + 44],
  [cx - 32, cy + 44],
];

interface WatchingEyesProps {
  label: string;
  className?: string | undefined;
}

/**
 * Dua mata bergaris di hero. Bila tidak ada aktivitas selama 5 detik, mata berkedip
 * dengan jeda acak (kadang dua kali); aktivitas apa pun menghentikannya.
 * Pupil mengikuti pointer (mouse, pen, atau sentuhan yang digeser).
 * Reduced motion: mata diam terbuka. Animasi hanya transform (CSS), < 3 kedip/detik.
 */
export function WatchingEyes({ label, className }: WatchingEyesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const clipId = useId();
  const { reduced } = useMotionPolicy();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reduced) return;

    let idleTimer = 0;
    let blinkTimer = 0;
    let doubled = false;

    const blink = () => {
      if (!document.hidden) {
        svg.classList.remove(BLINK);
        void svg.getBoundingClientRect(); // restart animasi CSS
        svg.classList.add(BLINK);
      }
      const double = !doubled && Math.random() < 0.25;
      doubled = double;
      blinkTimer = window.setTimeout(blink, double ? 280 : 2500 + Math.random() * 2000);
    };

    const wake = () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(blinkTimer);
      idleTimer = window.setTimeout(blink, IDLE_MS);
    };

    for (const type of ACTIVITY) window.addEventListener(type, wake, { passive: true });
    wake();
    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(blinkTimer);
      for (const type of ACTIVITY) window.removeEventListener(type, wake);
      svg.classList.remove(BLINK);
    };
  }, [reduced]);

  // Pupil mengikuti pointer; dihitung paling banyak sekali per frame.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reduced) return;
    const pupils = [...svg.querySelectorAll<SVGGElement>('[data-eye]')];
    let frame = 0;
    let px = 0;
    let py = 0;

    const update = () => {
      frame = 0;
      const rect = svg.getBoundingClientRect();
      const scale = rect.width / VIEW_W;
      if (!scale) return;
      pupils.forEach((pupil, i) => {
        const eye = EYES[i];
        if (!eye) return;
        // Arah dari pusat mata ke pointer, dalam unit viewBox.
        const dx = (px - (rect.left + eye.cx * scale)) / scale;
        const dy = (py - (rect.top + eye.cy * scale)) / scale;
        const dist = Math.hypot(dx, dy) || 1;
        const pull = Math.min(dist / 220, 1); // makin jauh, makin ke tepi
        const ox = (dx / dist) * REACH_X * pull;
        const oy = (dy / dist) * REACH_Y * pull;
        pupil.style.transform = `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px)`;
      });
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const recenter = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      for (const pupil of pupils) pupil.style.transform = '';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', recenter);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', recenter);
      recenter();
    };
  }, [reduced]);

  return (
    <svg
      ref={svgRef}
      className={cn(styles.eyes, className)}
      viewBox="0 0 440 180"
      role="img"
      aria-label={label}
    >
      <line className={styles.baseline} x1="0" y1="90" x2="440" y2="90" />
      {EYES.map(({ cx, cy }, i) => (
        <g key={cx} className={styles.eye}>
          <clipPath id={`${clipId}-${i}`}>
            <path d={almond(cx, cy)} />
          </clipPath>
          <g clipPath={`url(#${clipId}-${i})`}>
            <g className={styles.pupil} data-eye={i}>
              <circle className={styles.iris} cx={cx} cy={cy} r="30" />
              <circle className={styles.core} cx={cx} cy={cy} r="11" />
            </g>
          </g>
          <path className={styles.lid} d={almond(cx, cy)} />
          {landmarks(cx, cy).map(([x, y]) => (
            <circle key={`${x}-${y}`} className={styles.mark} cx={x} cy={y} r="2.5" />
          ))}
        </g>
      ))}
    </svg>
  );
}
