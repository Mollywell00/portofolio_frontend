import { sections, ui } from '../../data';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useLocale } from '../../hooks/useLocale';
import styles from './TerraceRuler.module.css';

const ids = sections.map((s) => s.id);

/** Navigasi bernomor di bawah layar (desktop/tablet). Segmen aktif memanjang + aksen. */
export function TerraceRuler() {
  const { t } = useLocale();
  const active = useActiveSection(ids);

  return (
    <nav className={styles.ruler} aria-label={t(ui.sectionsNav)}>
      <ol>
        {sections.map((s, i) => (
          <li key={s.id} className={s.id === active ? styles.active : undefined}>
            <a href={`#${s.id}`} aria-current={s.id === active ? 'true' : undefined}>
              {String(i).padStart(2, '0')} <span>{t(s.short)}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
