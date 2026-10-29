import { Link } from 'react-router';
import { profile, ui } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLocale } from '../hooks/useLocale';
import button from '../components/ui/Button.module.css';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const { t, to } = useLocale();
  useDocumentTitle(`${t(ui.notFoundTitle)} — ${profile.name.full}`);

  return (
    <section className={styles.page} aria-labelledby="nf-title">
      <p className="t-meta">404</p>
      <h1 id="nf-title" className="t-h1">
        {t(ui.notFoundTitle)}
      </h1>
      <p className="t-lead">{t(ui.notFoundBody)}</p>
      <Link className={`${button.button} ${button.primary}`} to={to('/')}>
        ← {t(ui.home)}
      </Link>
    </section>
  );
}
