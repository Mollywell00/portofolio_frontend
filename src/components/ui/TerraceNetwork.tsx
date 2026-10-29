import type { CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import styles from './TerraceNetwork.module.css';

type Corner = 'tl' | 'tr' | 'bl' | 'br';
type Point = [number, number];

const W = 600;
const H = 340;

/** Satu konfigurasi per section — seed tetap agar SSR dan klien menggambar hal yang sama. */
const VARIANTS = {
  work: { seed: 11, corner: 'tr', levels: 4, width: 46 },
  about: { seed: 23, corner: 'br', levels: 4, width: 34 },
  skills: { seed: 37, corner: 'tr', levels: 4, width: 44 },
  experience: { seed: 41, corner: 'br', levels: 5, width: 48 },
} satisfies Record<string, { seed: number; corner: Corner; levels: number; width: number }>;

export type TerraceVariant = keyof typeof VARIANTS;

/** PRNG kecil yang deterministik (mulberry32). */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const segment = ([x1, y1]: Point, [x2, y2]: Point) =>
  `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;

/**
 * Bukit terasering low-poly, digambar untuk sudut kanan-bawah (dicerminkan lewat CSS).
 * Tiap teras = satu kontur titik; kontur yang bersebelahan dijahit jadi segitiga.
 * Teras makin pendek ke atas, puncaknya di tepi.
 */
const build = ({ seed, levels }: { seed: number; levels: number }) => {
  const rand = random(seed);
  const gap = (H - 50) / levels;
  const rows: Point[][] = [];

  for (let k = 0; k <= levels; k++) {
    const y = H - k * gap;
    const start = k === 0 ? 0 : W * (0.1 + 0.72 * (k / levels) ** 1.25) + (rand() - 0.5) * 50;
    const row: Point[] = [];
    for (let x = W; x > start; x -= 42 + rand() * 46) {
      row.unshift([x, y + (rand() - 0.5) * 16 + Math.sin(x * 0.012 + k) * 7]);
    }
    // Pematang teras: ujung kiri tiap kontur melandai ke teras di bawahnya.
    if (k > 0) row.unshift([Math.max(0, start), y + gap * 0.45]);
    rows.push(row);
  }

  const ridges: string[] = [];
  const mesh: string[] = [];
  rows.forEach((row, k) => {
    for (let i = 1; i < row.length; i++) ridges.push(segment(row[i - 1]!, row[i]!));
    const upper = rows[k + 1];
    if (!upper?.length) return;
    // Jahit dua kontur: maju di sisi yang titik berikutnya lebih kiri.
    let i = 0;
    let j = 0;
    const link = () => {
      const a = row[i]!;
      const b = upper[j]!;
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < gap * 2.4) mesh.push(segment(a, b));
    };
    link();
    while (i < row.length - 1 || j < upper.length - 1) {
      const nextA = row[i + 1];
      const nextB = upper[j + 1];
      if (!nextB || (nextA && nextA[0] < nextB[0])) i++;
      else j++;
      link();
    }
  });

  // Simpul lepas di atas puncak, masing-masing tersambung ke satu titik teras teratas.
  const top = rows.at(-1) ?? [];
  const strays: Point[] = [];
  for (let s = 0; s < 4 && top.length; s++) {
    const anchor = top[Math.floor(rand() * top.length)]!;
    const stray: Point = [
      Math.min(W - 6, anchor[0] + (rand() - 0.5) * 120),
      anchor[1] - 26 - rand() * 30,
    ];
    strays.push(stray);
    mesh.push(segment(anchor, stray));
  }

  const nodes = [...rows.flat(), ...strays].map(([x, y]) => {
    const roll = rand();
    // Dibulatkan: angka desimal panjang di HTML bisa terbaca sebagai nomor telepon oleh check-privacy.
    const round = (n: number) => Math.round(n * 10) / 10;
    return { x: round(x), y: round(y), hub: roll < 0.3, pulse: roll < 0.12, delay: rand() * 6 };
  });
  return { ridges: ridges.join(''), mesh: mesh.join(''), nodes };
};

const SHAPES = Object.fromEntries(
  Object.entries(VARIANTS).map(([key, variant]) => [key, build(variant)]),
) as Record<TerraceVariant, ReturnType<typeof build>>;

interface TerraceNetworkProps {
  variant: TerraceVariant;
  className?: string | undefined;
}

/** Hiasan latar section: jaring garis berbentuk bukit terasering. Dekoratif. */
export function TerraceNetwork({ variant, className }: TerraceNetworkProps) {
  const { corner, width } = VARIANTS[variant];
  const { ridges, mesh, nodes } = SHAPES[variant];

  return (
    <div
      className={cn(styles.network, styles[corner], className)}
      style={{ '--width': `${width}%` } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${W} ${H}`}>
        <path className={styles.mesh} d={mesh} />
        <path className={styles.ridge} d={ridges} />
        {nodes.map(({ x, y, hub, pulse, delay }) =>
          hub ? (
            <g key={`${x}-${y}`}>
              <circle
                className={cn(styles.halo, pulse && styles.pulse)}
                cx={x}
                cy={y}
                r="8"
                style={{ '--delay': `${delay.toFixed(2)}s` } as CSSProperties}
              />
              <circle className={styles.hub} cx={x} cy={y} r="3.2" />
            </g>
          ) : (
            <circle key={`${x}-${y}`} className={styles.dot} cx={x} cy={y} r="1.8" />
          ),
        )}
      </svg>
    </div>
  );
}
