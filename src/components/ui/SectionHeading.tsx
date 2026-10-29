import type { ReactNode } from 'react';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  id: string;
  index: number;
  children: ReactNode;
  /** Info tambahan di sisi kanan, mis. jumlah proyek. */
  aside?: ReactNode;
}

export function SectionHeading({ id, index, children, aside }: SectionHeadingProps) {
  return (
    <div className={styles.head}>
      <h2 id={id} className="t-h2">
        <span className={`t-meta ${styles.index}`}>{String(index).padStart(2, '0')}</span>
        {children}
      </h2>
      {aside && <p className="t-meta">{aside}</p>}
    </div>
  );
}
