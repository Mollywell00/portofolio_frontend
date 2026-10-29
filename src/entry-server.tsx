import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { routes } from './app/router';

export { allPages } from './seo';
export { localePath } from './utils/i18n';

/** Render satu URL menjadi HTML untuk #root (dipanggil scripts/prerender.mjs). */
export async function render(url: string): Promise<string> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(url, 'http://localhost')));
  if (context instanceof Response) throw new Error(`Redirect tak terduga saat prerender: ${url}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  );
}
