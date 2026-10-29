import { Link } from 'react-router';
import { profile, ui } from '../../data';
import { useLocale } from '../../hooks/useLocale';
import { LanguageSwitch } from './LanguageSwitch';
import { MobileMenu } from './MobileMenu';
import styles from './SiteHeader.module.css';
import { ThemeToggle } from './ThemeToggle';

export function SiteHeader() {
  const { t, to } = useLocale();
  const [a, b, c] = profile.name.initials.split('');

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to={to('/')}>
        <span aria-hidden="true">
          {a}
          <i>.</i>
          {b}
          <i>.</i>
          {c}
        </span>
        <span className="visually-hidden">
          {profile.name.full} — {t(ui.home)}
        </span>
      </Link>
      <div className={styles.tools}>
        <LanguageSwitch />
        <div className={styles.desktopOnly}>
          <ThemeToggle />
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
