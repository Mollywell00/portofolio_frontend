import { useId, useState } from 'react';
import { ui } from '../../data';
import { useLocale } from '../../hooks/useLocale';
import { cn } from '../../utils/cn';
import styles from './EarDemo.module.css';

/** Ambang dari kode prototipe (avg_ear < 0.21). */
const THRESHOLD = 0.21;
/** Setengah lebar mata: p1 = (0,0), p4 = (200,0) → ‖p1−p4‖ = 200. */
const WIDTH = 200;

/**
 * Ilustrasi EAR: geser keterbukaan mata, nilai dihitung dengan rumus asli
 * EAR = (‖p2−p6‖ + ‖p3−p5‖) / (2‖p1−p4‖). Hanya ilustrasi metode, bukan hasil.
 */
export function EarDemo() {
  const { t } = useLocale();
  const id = useId();
  const [openness, setOpenness] = useState(1);

  const h = 1 + 16 * openness; // setengah tinggi kelopak di x=60 dan x=140
  const points = [
    [0, 0],
    [60, -h],
    [140, -h],
    [WIDTH, 0],
    [140, h],
    [60, h],
  ] as const;
  const ear = (2 * h + 2 * h) / (2 * WIDTH);
  const closed = ear < THRESHOLD;
  const c = h * 1.33;

  return (
    <div className={styles.demo}>
      <h2 className={`t-meta ${styles.title}`}>{t(ui.earTitle)}</h2>
      <svg viewBox="-30 -60 260 120" role="img" aria-label={t(ui.earDiagram)}>
        <line className={styles.axis} x1="0" y1="0" x2={WIDTH} y2="0" />
        <path
          className={styles.lid}
          d={`M0 0C40 ${-c} 160 ${-c} ${WIDTH} 0C160 ${c} 40 ${c} 0 0Z`}
        />
        <line className={styles.span} x1="60" y1={-h} x2="60" y2={h} />
        <line className={styles.span} x1="140" y1={-h} x2="140" y2={h} />
        {points.map(([x, y], i) => (
          <g key={i}>
            <circle className={styles.point} cx={x} cy={y} r="3.5" />
            <text
              className={styles.label}
              x={x + (i === 0 ? -18 : i === 3 ? 8 : -6)}
              y={y + (y < 0 ? -9 : y > 0 ? 16 : 3)}
            >
              p{i + 1}
            </text>
          </g>
        ))}
      </svg>
      <div>
        <label className="t-meta" htmlFor={id}>
          {t(ui.earSlider)}
        </label>
        <input
          id={id}
          className={styles.slider}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={openness}
          onChange={(e) => setOpenness(Number(e.target.value))}
        />
        <output className={styles.value} htmlFor={id} aria-live="polite">
          {ear.toFixed(2)}
        </output>
        <p className={cn('t-meta', closed && styles.closed)}>
          {t(closed ? ui.earBelow : ui.earAbove)}
        </p>
        <p className={styles.formula}>EAR = (‖p2−p6‖ + ‖p3−p5‖) / (2‖p1−p4‖)</p>
        <p className={styles.note}>{t(ui.earNote)}</p>
      </div>
    </div>
  );
}
