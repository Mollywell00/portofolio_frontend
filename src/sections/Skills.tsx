import type { CSSProperties } from 'react';
import { processSteps, publishedSkillGroups, sections } from '../data';
import { useLocale } from '../hooks/useLocale';
import { SectionHeading } from '../components/ui/SectionHeading';
import styles from './Skills.module.css';

export function Skills() {
  const { t, tx } = useLocale();
  const meta = sections[3];

  return (
    <section id={meta.id} className="terrace" aria-labelledby="skills-title">
      <SectionHeading id="skills-title" index={3}>
        {t(meta.label)}
      </SectionHeading>
      <div className={styles.groups}>
        {publishedSkillGroups.map((g) => (
          <div key={g.id} className={styles.group}>
            <h3 className="t-meta">{t(g.label)}</h3>
            <ul>
              {g.items.map((item) => (
                <li key={tx(item)}>{tx(item)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <ol className={styles.process}>
        {processSteps.map((step, i) => (
          <li key={step.title.en} style={{ '--level': i } as CSSProperties}>
            <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
            <h3 className={styles.stepTitle}>{t(step.title)}</h3>
            <p>{t(step.body)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
