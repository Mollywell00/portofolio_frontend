import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import type { Locale } from '../data/types';
import { ui } from '../data';
import { Cursor } from '../components/cursor/Cursor';
import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';
import { TerraceRuler } from '../components/layout/TerraceRuler';
import { useReveal } from '../hooks/useReveal';
import { pick } from '../utils/i18n';
import { LocaleContext } from './LocaleContext';

// Transisi halaman hanya untuk navigasi di dalam situs, bukan muatan pertama:
// HTML hasil prerender harus langsung terlihat (LCP).
let navigated = false;

interface RootLayoutProps {
  locale: Locale;
}

/** Kerangka setiap halaman: bahasa, skip link, header, <main>, ruler (beranda saja), footer. */
export function RootLayout({ locale }: RootLayoutProps) {
  const { pathname, hash } = useLocation();
  const isHome = pathname === '/' || pathname === '/id' || pathname === '/id/';

  useReveal(pathname);

  useEffect(() => {
    navigated = true;
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Pindah halaman → mulai dari atas, kecuali menuju anchor.
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <LocaleContext value={locale}>
      <a className="visually-hidden skip-link" href="#main">
        {pick(ui.skipLink, locale)}
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <div key={pathname} className={navigated ? 'page page-enter' : 'page'}>
          <Outlet />
        </div>
      </main>
      <SiteFooter />
      {isHome && <TerraceRuler />}
      <Cursor />
    </LocaleContext>
  );
}
