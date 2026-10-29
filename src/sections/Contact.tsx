import { profile, sections, ui } from '../data';
import { useLocale } from '../hooks/useLocale';
import { EmailLink } from '../components/ui/EmailLink';
import { Magnetic } from '../components/ui/Magnetic';
import button from '../components/ui/Button.module.css';
import styles from './Contact.module.css';

export function Contact() {
  const { t } = useLocale();
  const meta = sections[5];
  const [first, second] = t(ui.contactHeading);

  return (
    <section id={meta.id} className="terrace" aria-labelledby="contact-title">
      <p className="t-meta">05 / {t(meta.label)}</p>
      <h2 id="contact-title" className={`t-display ${styles.heading}`}>
        <span>{first}</span>
        <em>{second}</em>
      </h2>
      <p className={styles.line}>{t(ui.contactLine)}</p>
      <div className={styles.links}>
        <Magnetic>
          <EmailLink className={`${button.button} ${button.primary}`}>
            {t(ui.sendEmail)} <span aria-hidden="true">↗</span>
          </EmailLink>
        </Magnetic>
        <Magnetic>
          <a className={button.underline} href={profile.links.linkedin} rel="me noopener">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </Magnetic>
        <Magnetic>
          <a className={button.underline} href={profile.links.gitlab} rel="me noopener">
            GitLab <span aria-hidden="true">↗</span>
          </a>
        </Magnetic>
        {profile.links.github && (
          <Magnetic>
            <a className={button.underline} href={profile.links.github} rel="me noopener">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </Magnetic>
        )}
      </div>
    </section>
  );
}
