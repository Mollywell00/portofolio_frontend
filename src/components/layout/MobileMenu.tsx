import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { sections, ui } from '../../data';
import { useLocale } from '../../hooks/useLocale';
import button from '../ui/Button.module.css';
import { LanguageSwitch } from './LanguageSwitch';
import styles from './MobileMenu.module.css';
import { ThemeToggle } from './ThemeToggle';

/**
 * Menu layar penuh untuk < 768px (VISUAL_SPEC §4.3). Memakai <dialog> modal:
 * fokus terkunci, Esc menutup, dan konten di belakang inert secara bawaan.
 */
export function MobileMenu() {
  const { t, to } = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { pathname, hash } = useLocation();

  // Tutup setelah navigasi.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname, hash]);

  return (
    <>
      <button
        type="button"
        className={`${button.pill} ${styles.trigger}`}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        {t(ui.menu)}
      </button>
      <dialog ref={dialogRef} className={styles.dialog} aria-label={t(ui.menu)}>
        <div className={styles.top}>
          <LanguageSwitch />
          <button type="button" className={button.pill} onClick={() => dialogRef.current?.close()}>
            {t(ui.closeMenu)}
          </button>
        </div>
        <nav aria-label={t(ui.sectionsNav)}>
          <ol className={styles.list}>
            {sections.map((s, i) => (
              <li key={s.id} style={{ paddingLeft: `calc(var(--terrace-step) * ${i} * 0.5)` }}>
                <Link to={to(`/#${s.id}`)} onClick={() => dialogRef.current?.close()}>
                  <span className="t-meta">{String(i).padStart(2, '0')}</span>
                  {t(s.label)}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <ThemeToggle />
      </dialog>
    </>
  );
}
