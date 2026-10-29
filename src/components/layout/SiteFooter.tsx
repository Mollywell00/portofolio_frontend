import { profile, ui } from '../../data';
import { useLocale } from '../../hooks/useLocale';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const { t } = useLocale();
  return (
    <footer className={`t-meta ${styles.footer}`}>
      <span>
        © {new Date().getFullYear()} {profile.name.full} · {t(profile.location)}
      </span>
      <span>{t(ui.builtWith)}</span>
    </footer>
  );
}
