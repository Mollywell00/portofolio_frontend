import { useEffect, useRef } from 'react';
import { useMotion } from '../../hooks/useMotion';
import { useMotionPolicy } from '../../hooks/useMotionPolicy';
import { cn } from '../../utils/cn';
import { clamp, lerp } from '../../utils/math';
import styles from './LiquidField.module.css';

/** Jarak antar-titik (px) — harus sama dengan background-size di CSS. */
const SPACING = 9;
/** Jari-jari tetesan tinta (sel). */
const RADIUS = 2.6;
/** Sisa kecepatan & tinta per frame: makin dekat 1, makin lama mengalir. */
const VEL_KEEP = 0.955;
const INK_KEEP = 0.968;
const MAX_VEL = 3;
/** Tingkat warna/ukuran titik; satu fill per tingkat. */
const LEVELS = 8;
/** Diam selama ini (ms) → tetesan "hantu" mengaduk pelan agar tetap hidup di HP. */
const IDLE_MS = 2500;

type Point = { x: number; y: number };

interface LiquidFieldProps {
  className?: string | undefined;
}

/**
 * Latar hero: grid titik halftone dengan tinta cair. Cursor, jari yang menggeser layar,
 * dan tap meneteskan tinta yang terbawa arus, berpusar, lalu memudar; scroll ikut
 * menyeret arusnya. Simulasi kasar (adveksi semi-Lagrange) di grid titik itu sendiri.
 * Jalan di gsap.ticker, berhenti di luar viewport. Reduced motion: hanya titik diam.
 */
export function LiquidField({ className }: LiquidFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reduced } = useMotionPolicy();
  const motion = useMotion(!reduced);

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!field || !canvas || !ctx || !motion) return;
    const { gsap } = motion;

    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let ink = new Float32Array(0);
    let nvx = new Float32Array(0);
    let nvy = new Float32Array(0);
    let nink = new Float32Array(0);
    let palette: string[] = [];
    let wet = false;

    const resize = () => {
      const rect = field.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / SPACING);
      rows = Math.ceil(height / SPACING);
      const n = cols * rows;
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      ink = new Float32Array(n);
      nvx = new Float32Array(n);
      nvy = new Float32Array(n);
      nink = new Float32Array(n);
    };

    // Warna diambil dari token CSS agar ikut tema terang/gelap.
    const toRgb = (value: string) => {
      ctx.fillStyle = '#000';
      ctx.fillStyle = value.trim() || '#000';
      const hex = String(ctx.fillStyle);
      if (hex.startsWith('#')) return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      return (hex.match(/\d+/g) ?? []).slice(0, 3).map(Number);
    };
    const readPalette = () => {
      const style = getComputedStyle(field);
      const cool = toRgb(style.getPropertyValue('--ink-cool'));
      const warm = toRgb(style.getPropertyValue('--ink-warm'));
      palette = Array.from({ length: LEVELS }, (_, level) => {
        const t = (level + 1) / LEVELS;
        const [r, g, b] = cool.map((c, k) => Math.round(lerp(c, warm[k] ?? c, t)));
        return `rgba(${r},${g},${b},${(0.3 + 0.65 * t).toFixed(2)})`;
      });
    };

    /** Teteskan tinta + dorongan arus di sel (x, y). */
    const drop = (x: number, y: number, dx: number, dy: number, amount: number) => {
      const reach = Math.ceil(RADIUS * 2);
      const i0 = Math.max(0, Math.floor(x - reach));
      const i1 = Math.min(cols - 1, Math.ceil(x + reach));
      const j0 = Math.max(0, Math.floor(y - reach));
      const j1 = Math.min(rows - 1, Math.ceil(y + reach));
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const d2 = ((i + 0.5 - x) ** 2 + (j + 0.5 - y) ** 2) / RADIUS ** 2;
          if (d2 > 4) continue;
          const g = Math.exp(-d2);
          const k = j * cols + i;
          vx[k] = clamp(vx[k]! + dx * g, -MAX_VEL, MAX_VEL);
          vy[k] = clamp(vy[k]! + dy * g, -MAX_VEL, MAX_VEL);
          ink[k] = Math.min(1.3, ink[k]! + amount * g);
        }
      }
      wet = true;
    };

    /** Garis tetesan dari a ke b agar jejaknya tidak putus-putus. */
    const stroke = (a: Point, b: Point, amount: number) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const steps = Math.min(40, Math.max(1, Math.ceil(Math.hypot(dx, dy) / 0.7)));
      const push = 0.9 / Math.sqrt(steps);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        drop(a.x + dx * t, a.y + dy * t, dx * push, dy * push, amount / Math.sqrt(steps));
      }
    };

    const advect = (time: number) => {
      let total = 0;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          // Telusuri mundur sepanjang arus, ambil nilai bilinear dari sana.
          const x = clamp(i - vx[k]!, 0, cols - 1.001);
          const y = clamp(j - vy[k]!, 0, rows - 1.001);
          const x0 = Math.floor(x);
          const y0 = Math.floor(y);
          const fx = x - x0;
          const fy = y - y0;
          const a = y0 * cols + x0;
          const b = a + (x0 + 1 < cols ? 1 : 0);
          const c = a + (y0 + 1 < rows ? cols : 0);
          const d = c + (b - a);
          const mix = (f: Float32Array) => lerp(lerp(f[a]!, f[b]!, fx), lerp(f[c]!, f[d]!, fx), fy);
          const wetness = mix(ink) * INK_KEEP;
          nink[k] = wetness < 0.01 ? 0 : wetness;
          nvx[k] = mix(vx) * VEL_KEEP;
          nvy[k] = mix(vy) * VEL_KEEP;
          if (wetness > 0.02) {
            // Pusaran kecil supaya tinta bergulung seperti asap/cairan, bukan cuma bergeser.
            nvx[k]! += 0.035 * Math.sin(j * 0.33 + time * 1.4);
            nvy[k]! += 0.035 * Math.cos(i * 0.31 + time * 1.1);
          }
          total += nink[k]!;
        }
      }
      [vx, nvx] = [nvx, vx];
      [vy, nvy] = [nvy, vy];
      [ink, nink] = [nink, ink];
      return total;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const shapes = palette.map(() => new Path2D());
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const wetness = ink[j * cols + i]!;
          if (wetness < 0.04) continue;
          const t = Math.min(1, wetness);
          const level = Math.min(LEVELS - 1, Math.floor(t * LEVELS));
          const size = lerp(1.6, SPACING * 0.62, t);
          shapes[level]?.rect(
            (i + 0.5) * SPACING - size / 2,
            (j + 0.5) * SPACING - size / 2,
            size,
            size,
          );
        }
      }
      shapes.forEach((shape, level) => {
        ctx.fillStyle = palette[level] ?? '';
        ctx.fill(shape);
      });
    };

    let target: Point | null = null; // posisi pointer/jari di layar
    let trail: Point | null = null; // posisi sebelumnya, dalam sel
    let ghost: Point | null = null;
    let splash: Point | null = null;
    let lastInput = -Infinity;
    let lastScroll = window.scrollY;

    const tick = (time: number) => {
      const rect = field.getBoundingClientRect();
      const toCell = (p: Point) => ({
        x: (p.x - rect.left) / SPACING,
        y: (p.y - rect.top) / SPACING,
      });

      // Posisi dihitung ulang tiap frame: scroll dengan pointer diam pun menggambar jejak.
      if (target) {
        const now = toCell(target);
        if (trail) stroke(trail, now, 0.55);
        trail = now;
        ghost = null;
      } else {
        trail = null;
      }

      if (splash) {
        const at = toCell(splash);
        for (let a = 0; a < 6; a++) {
          const angle = (a / 6) * Math.PI * 2;
          drop(
            at.x + Math.cos(angle),
            at.y + Math.sin(angle),
            Math.cos(angle) * 1.4,
            Math.sin(angle) * 1.4,
            0.45,
          );
        }
        splash = null;
      }

      if (!target && performance.now() - lastInput > IDLE_MS) {
        const now = {
          x: cols * (0.62 + 0.3 * Math.sin(time * 0.31)),
          y: rows * (0.45 + 0.3 * Math.sin(time * 0.47 + 1.2)),
        };
        if (ghost) stroke(ghost, now, 0.22);
        ghost = now;
      }

      // Scroll menyeret arus berlawanan arah gerak layar → tinta tertinggal lalu menyusul.
      const scrolled = clamp(window.scrollY - lastScroll, -60, 60) / SPACING;
      lastScroll = window.scrollY;
      if (scrolled && wet) {
        for (let k = 0; k < ink.length; k++) {
          if (ink[k]! > 0.02) vy[k] = clamp(vy[k]! - scrolled * 0.25, -MAX_VEL, MAX_VEL);
        }
      }

      if (!wet) return;
      const steps = clamp(Math.round(gsap.ticker.deltaRatio(60)), 1, 2);
      let total = 0;
      for (let s = 0; s < steps; s++) total = advect(time);
      draw();
      if (total < 0.01) wet = false;
    };

    const input = (p: Point | null) => {
      target = p;
      lastInput = performance.now();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') input({ x: e.clientX, y: e.clientY });
    };
    // Di HP jari yang menggeser layar memicu scroll, bukan pointermove — touchmove tetap jalan.
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) input({ x: touch.clientX, y: touch.clientY });
    };
    const onTouchEnd = () => input(null);
    const onDown = (e: PointerEvent) => {
      splash = { x: e.clientX, y: e.clientY };
      lastInput = performance.now();
    };
    const onLeave = () => input(null);

    resize();
    readPalette();
    const sizer = new ResizeObserver(resize);
    sizer.observe(field);
    const themeObserver = new MutationObserver(readPalette);
    themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] });
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', readPalette);

    let running = false;
    const visibility = new IntersectionObserver(([entry]) => {
      const visible = !!entry?.isIntersecting;
      if (visible === running) return;
      running = visible;
      if (visible) {
        // Input yang terjadi saat tak terlihat (mis. tap di section lain) dibuang.
        lastScroll = window.scrollY;
        trail = ghost = splash = null;
        gsap.ticker.add(tick);
      } else {
        gsap.ticker.remove(tick);
      }
    });
    visibility.observe(field);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      visibility.disconnect();
      sizer.disconnect();
      themeObserver.disconnect();
      scheme.removeEventListener('change', readPalette);
      gsap.ticker.remove(tick);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      ctx.clearRect(0, 0, width, height);
    };
  }, [motion]);

  return (
    <div ref={fieldRef} className={cn(styles.field, className)} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
