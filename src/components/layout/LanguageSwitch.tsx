import { Link, useLocation } from 'react-router';
import { ui } from '../../data';
import { useLocale } from '../../hooks/useLocale';
import { switchLocalePath } from '../../utils/i18n';
import button from '../ui/Button.module.css';
import styles from './LanguageSwitch.module.css';

/** Pindah ke halaman yang sama di bahasa lain (/ ↔ /id), anchor dipertahankan. */
export function LanguageSwitch() {
  const { locale, t } = useLocale();
  const { pathname, hash } = useLocation();
  const target = locale === 'en' ? 'id' : 'en';

  return (
    <Link
      className={button.pill}
      to={switchLocalePath(pathname, target) + hash}
      hrefLang={target}
      lang={target}
    >
      <span className={locale === 'en' ? styles.on : undefined}>EN</span>
      <span aria-hidden="true">/</span>
      <span className={locale === 'id' ? styles.on : undefined}>ID</span>
      <span className="visually-hidden">— {t(ui.switchLanguage)}</span>
    </Link>
  );
}
