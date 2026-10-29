import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ui } from '../../data';
import type { Project } from '../../data/types';
import { useLocale } from '../../hooks/useLocale';
import { useMotion } from '../../hooks/useMotion';
import { Picture } from '../ui/Picture';
import styles from './ProjectPreview.module.css';

interface ProjectPreviewProps {
  projects: Project[];
  /** Slug proyek yang sedang di-hover; null = sembunyi. */
  active: string | null;
}

/**
 * Preview berbingkai bracket ⌜⌟ yang mengikuti cursor di atas daftar proyek (desktop saja).
 * Dekoratif: informasi yang sama ada di baris daftar, jadi aria-hidden.
 * Dirender ke <body> agar tidak terkena transform reveal/transisi halaman.
 */
export function ProjectPreview({ projects, active }: ProjectPreviewProps) {
  const { t } = useLocale();
  const motion = useMotion(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion) return;
    const { gsap } = motion;
    const toX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const toY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    let first = true;
    const onMove = (e: PointerEvent) => {
      if (first) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        first = false;
      }
      toX(e.clientX);
      toY(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.killTweensOf(el);
    };
  }, [motion]);

  return createPortal(
    <div ref={ref} className={styles.anchor} aria-hidden="true">
      <figure className={styles.frame} data-on={active !== null}>
        {projects.map((p) => {
          const cover = p.media?.[0];
          return (
            <div key={p.slug} className={styles.slide} data-show={p.slug === active}>
              {cover ? <Picture media={cover} sizes="360px" /> : <EyeGlyph />}
            </div>
          );
        })}
        <figcaption className="t-meta">{t(ui.viewCaseStudy)} →</figcaption>
      </figure>
    </div>,
    document.body,
  );
}

const GLYPH_POINTS = [
  [0, 0],
  [60, -16],
  [140, -16],
  [200, 0],
  [140, 16],
  [60, 16],
] as const;

/** Pengganti cover untuk proyek tanpa screenshot (Drowsiness Detection). */
function EyeGlyph() {
  return (
    <svg className={styles.glyph} viewBox="-20 -40 240 80">
      <path d="M0 0C40-22 160-22 200 0C160 22 40 22 0 0Z" />
      {GLYPH_POINTS.map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r="4" />
      ))}
    </svg>
  );
}
