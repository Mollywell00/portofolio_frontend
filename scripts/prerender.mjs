// Prerender setiap halaman menjadi HTML statis (PORTFOLIO_STANDARD §11: LCP mobile).
// Dijalankan setelah `vite build` (klien) dan `vite build --ssr` (server).
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const SITE = (process.env.SITE_URL ?? 'https://fahnur-portfolio.vercel.app').replace(/\/$/, '');

const { render, allPages, localePath } = await import(
  pathToFileURL(join(ROOT, 'dist-ssr', 'entry-server.js')).href
);
// CSS (±8 KB gzip) di-inline: menghapus satu round-trip yang memblokir render di mobile.
const template = readFileSync(join(DIST, 'index.html'), 'utf8').replace(
  /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/,
  (_, href) => `<style>${readFileSync(join(DIST, href), 'utf8')}</style>`,
);

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** URL publik → file. cleanUrls di vercel.json menyajikan /work/x dari work/x.html. */
const fileFor = (url) => (url === '/' ? 'index.html' : `${url.slice(1)}.html`);

const pages = allPages();
const sitemap = [];

for (const page of pages) {
  const url = page.indexable ? localePath(page.path, page.locale) : '/404';
  const html = await render(page.indexable ? url : '/__not-found__');
  const abs = `${SITE}${url === '/' ? '' : url}`;
  const og = `${SITE}/og-${page.locale}.png`;

  const head = [
    `<meta name="description" content="${escape(page.description)}" />`,
    page.indexable
      ? `<link rel="canonical" href="${abs}" />`
      : `<meta name="robots" content="noindex" />`,
  ];
  if (page.indexable) {
    for (const alt of ['en', 'id']) {
      const altUrl = localePath(page.path, alt);
      head.push(
        `<link rel="alternate" hreflang="${alt}" href="${SITE}${altUrl === '/' ? '' : altUrl}" />`,
      );
    }
    head.push(`<link rel="alternate" hreflang="x-default" href="${SITE}${page.path === '/' ? '' : page.path}" />`);
    sitemap.push(abs);
  }
  head.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Fahnur Qoirul Anwar" />`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta property="og:url" content="${abs}" />`,
    `<meta property="og:image" content="${og}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="${page.locale === 'id' ? 'id_ID' : 'en_US'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  );

  const out = template
    .replace(/<html lang="[^"]*">/, `<html lang="${page.locale}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, '')
    .replace('</head>', `    ${head.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const file = join(DIST, fileFor(url));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, out);
  console.log(`✓ ${url.padEnd(34)} → ${fileFor(url)}`);
}

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
rmSync(join(ROOT, 'dist-ssr'), { recursive: true, force: true });
console.log(`✓ sitemap.xml (${sitemap.length} URL) · robots.txt · situs: ${SITE}`);
