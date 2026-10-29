import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import type { Project } from '../../data/types';
import { useLocale } from '../../hooks/useLocale';
import { useMotionPolicy } from '../../hooks/useMotionPolicy';
import { Picture } from '../ui/Picture';
import { ProjectPreview } from './ProjectPreview';
import styles from './ProjectList.module.css';

interface ProjectListProps {
  projects: Project[];
}

/**
 * Daftar proyek bertingkat. Desktop: baris lain meredup saat hover/fokus dan preview
 * berbingkai mengikuti cursor. Mobile: cover statis di bawah baris.
 */
export function ProjectList({ projects }: ProjectListProps) {
  const { t, to } = useLocale();
  const { cursor } = useMotionPolicy();
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <ul className={styles.list}>
        {projects.map((p, i) => {
          const cover = p.media?.[0];
          return (
            <li key={p.slug} className={styles.item} style={{ '--level': i } as CSSProperties}>
              <Link
                className={styles.row}
                to={to(`/work/${p.slug}`)}
                data-cursor="project"
                onPointerEnter={() => setActive(p.slug)}
                onPointerLeave={() => setActive(null)}
              >
                <span className={`t-meta ${styles.index}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={`t-h3 ${styles.title}`}>{p.title}</h3>
                <span className={`t-meta ${styles.role}`}>
                  {t(p.kind)} · {p.year}
                </span>
                <span className={`t-meta ${styles.stack}`}>
                  {(p.stackShort ?? p.stack.slice(0, 2)).join(' · ')}
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
              {cover && (
                <div className={styles.thumb}>
                  <Picture media={cover} sizes="(max-width: 767px) 100vw, 1px" />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {cursor && <ProjectPreview projects={projects} active={active} />}
    </>
  );
}
