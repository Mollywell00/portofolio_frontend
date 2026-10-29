import { profile, sections } from '../data';
import { useLocale } from '../hooks/useLocale';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TerraceNetwork } from '../components/ui/TerraceNetwork';
import styles from './About.module.css';

export function About() {
  const { t } = useLocale();
  const meta = sections[2];
  const [first, ...rest] = t(profile.about);

  return (
    <section id={meta.id} className="terrace" aria-labelledby="about-title">
      <div className={styles.split}>
        <SectionHeading id="about-title" index={2}>
          {t(meta.label)}
        </SectionHeading>
        <div className="t-prose">
          <p className={styles.big}>{first}</p>
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <TerraceNetwork variant="about" />
    </section>
  );
}
