import { createBrowserRouter, type RouteObject } from 'react-router';
import type { Locale } from '../data/types';
import { CaseStudyPage } from '../pages/CaseStudyPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RootLayout } from './RootLayout';

const pages: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'work/:slug', element: <CaseStudyPage /> },
  { path: '*', element: <NotFoundPage /> },
];

const localeRoute = (path: string, locale: Locale): RouteObject => ({
  path,
  element: <RootLayout locale={locale} />,
  children: pages,
});

// Inggris di root, Indonesia di /id (VISUAL_SPEC §3). Dipakai juga oleh prerender.
export const routes: RouteObject[] = [localeRoute('/id', 'id'), localeRoute('/', 'en')];

export const createRouter = () => createBrowserRouter(routes);
