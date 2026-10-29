import { publishedExperience, sections } from '../data';
import type { ExperienceKind, Localized } from '../data/types';
import { useLocale } from '../hooks/useLocale';
import { SectionHeading } from '../components/ui/SectionHeading';
import styles from './Experience.module.css';

const kindLabel: Record<ExperienceKind, Localized> = {
  work: { en: 'Work', id: 'Kerja' },
  community: { en: 'Community', id: 'Komunitas' },
  education: { en: 'Education', id: 'Pendidikan' },
};

export function Experience() {
  const { t } = useLocale();
  const meta = sections[4];

  return (
    <section id={meta.id} className="terrace" aria-labelledby="exp-title">
      <SectionHeading id="exp-title" index={4}>
        {t(meta.label)}
      </SectionHeading>
      <ol className={styles.list}>
        {publishedExperience.map((e) => (
          <li key={e.id}>
            <span className="t-meta">{t(e.period)}</span>
            <div>
              <h3 className={styles.title}>
                {t(e.title)} · {e.org}
              </h3>
              {e.detail && <p className="t-meta">{t(e.detail)}</p>}
            </div>
            <span className={`t-meta ${styles.kind}`}>{t(kindLabel[e.kind])}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
