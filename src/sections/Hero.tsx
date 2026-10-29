import { useRef } from 'react';
import { profile, ui } from '../data';
import { useLocale } from '../hooks/useLocale';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { EmailLink } from '../components/ui/EmailLink';
import { Magnetic } from '../components/ui/Magnetic';
import { LiquidField } from '../components/ui/LiquidField';
import button from '../components/ui/Button.module.css';
import styles from './Hero.module.css';

export function Hero() {
  const { t } = useLocale();
  const metaRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  useMouseParallax(metaRef, 4);
  useMouseParallax(nameRef, 8);

  return (
    <section id="intro" className={styles.hero} aria-labelledby="hero-name">
      <LiquidField />
      <p ref={metaRef} className="t-meta">
        00 / <span>{t(profile.role)}</span>
      </p>
      <h1
        ref={nameRef}
        id="hero-name"
        className={`t-display ${styles.name}`}
        aria-label={profile.name.full}
      >
        {profile.name.lines.map((line) => (
          <span key={line} className={styles.line} aria-hidden="true">
            <span>{line}</span>
          </span>
        ))}
      </h1>
      <hr className={styles.rule} />
      <div className={styles.lead}>
        <p className="t-lead">{t(profile.lead)}</p>
        <p className={`t-meta ${styles.status}`}>
          {t(ui.currently)}
          <br />
          <b>
            <span className={styles.dot} aria-hidden="true" />
            {profile.current.title}, {profile.current.org} · {t(profile.current.mode)}
          </b>
        </p>
      </div>
      <div className={styles.cta}>
        <Magnetic>
          <a className={`${button.button} ${button.primary}`} href="#work">
            {t(ui.ctaWork)} <span aria-hidden="true">↓</span>
          </a>
        </Magnetic>
        <Magnetic>
          <EmailLink className={button.button}>{t(ui.ctaEmail)}</EmailLink>
        </Magnetic>
      </div>
    </section>
  );
}
