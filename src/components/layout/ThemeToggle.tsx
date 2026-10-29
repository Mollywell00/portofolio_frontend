import { ui } from '../../data';
import { useLocale } from '../../hooks/useLocale';
import { useTheme } from '../../hooks/useTheme';
import button from '../ui/Button.module.css';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLocale();
  return (
    <button type="button" className={button.pill} onClick={toggle}>
      {t(ui.theme)}
      <span className="visually-hidden">
        : {t(theme === 'dark' ? ui.themeToLight : ui.themeToDark)}
      </span>
    </button>
  );
}
