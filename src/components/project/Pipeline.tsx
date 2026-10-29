import type { CSSProperties } from 'react';
import type { PipelineStep } from '../../data/types';
import { useLocale } from '../../hooks/useLocale';
import { cn } from '../../utils/cn';
import styles from './Pipeline.module.css';

interface PipelineProps {
  steps: PipelineStep[];
  label: string;
}

/** Alur bertingkat: tiap langkah turun satu "teras" dari sebelumnya. */
export function Pipeline({ steps, label }: PipelineProps) {
  const { t } = useLocale();
  return (
    <ol className={styles.pipe} aria-label={label}>
      {steps.map((step, i) => (
        <li
          key={step.title.en}
          className={cn(step.highlight && styles.highlight)}
          style={{ '--level': i } as CSSProperties}
        >
          <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
          <b>{t(step.title)}</b>
          <p>{t(step.body)}</p>
        </li>
      ))}
    </ol>
  );
}
