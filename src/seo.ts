import { profile, publishedProjects, ui } from './data';
import type { Locale } from './data/types';
import { LOCALES, pick } from './utils/i18n';

export interface PageMeta {
  /** Path tanpa prefix bahasa, mis. "/" atau "/work/myesics". */
  path: string;
  locale: Locale;
  title: string;
  description: string;
  /** false untuk 404: tidak masuk sitemap dan noindex. */
  indexable: boolean;
}

/** Semua halaman yang di-prerender, dengan judul & deskripsi per bahasa. */
export function allPages(): PageMeta[] {
  const pages: PageMeta[] = [];
  for (const locale of LOCALES) {
    pages.push({
      path: '/',
      locale,
      title: `${profile.name.full} — ${pick(profile.role, locale)}`,
      description: pick(profile.lead, locale),
      indexable: true,
    });
    for (const p of publishedProjects) {
      pages.push({
        path: `/work/${p.slug}`,
        locale,
        title: `${p.title} — ${profile.name.full}`,
        description: pick(p.summary, locale),
        indexable: true,
      });
    }
  }
  pages.push({
    path: '/404',
    locale: 'en',
    title: `${pick(ui.notFoundTitle, 'en')} — ${profile.name.full}`,
    description: pick(ui.notFoundBody, 'en'),
    indexable: false,
  });
  return pages;
}
