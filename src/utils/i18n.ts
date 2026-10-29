import type { Locale, Localized, Text } from '../data/types';

export const LOCALES: readonly Locale[] = ['en', 'id'];
export const DEFAULT_LOCALE: Locale = 'en';

/** Ambil teks sesuai bahasa; fallback ke Inggris bila terjemahan belum ada. */
export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.en;
}

export function text(value: Text, locale: Locale): string {
  return typeof value === 'string' ? value : pick(value, locale);
}

/** Path internal per bahasa: Inggris di root, Indonesia di /id. */
export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? '/id' : `/id${clean}`;
}

/** Path yang sama di bahasa lain — dipakai tombol EN/ID. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const base = pathname.replace(/^\/id(?=\/|$)/, '') || '/';
  return localePath(base, to);
}
