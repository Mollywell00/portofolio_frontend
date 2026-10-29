import { useCallback, useContext } from 'react';
import { LocaleContext } from '../app/LocaleContext';
import type { Localized, Text } from '../data/types';
import { localePath, pick, text } from '../utils/i18n';

/** Bahasa aktif + helper: t() untuk Localized, tx() untuk Text, to() untuk path. */
export function useLocale() {
  const locale = useContext(LocaleContext);
  const t = useCallback(<T>(value: Localized<T>) => pick(value, locale), [locale]);
  const tx = useCallback((value: Text) => text(value, locale), [locale]);
  const to = useCallback((path: string) => localePath(path, locale), [locale]);
  return { locale, t, tx, to };
}
