import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Font yang dipakai teks di atas lipatan — dipreload agar LCP tidak menunggu CSS → font.
const PRELOAD_FONTS = [
  /bricolage-grotesque-latin-opsz-normal.*\.woff2$/,
  /instrument-serif-latin-400-normal.*\.woff2$/,
];

function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) =>
          PRELOAD_FONTS.some((re) => re.test(f)),
        );
        return files.map((file) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: `/${file}`,
            as: 'font',
            type: 'font/woff2',
            crossorigin: '',
          },
          injectTo: 'head',
        }));
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadFonts()],
  css: {
    modules: { localsConvention: 'camelCaseOnly' },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        // GSAP dipisah agar cache-nya bertahan saat kode aplikasi berubah.
        manualChunks: (id) => (id.includes('node_modules/gsap') ? 'gsap' : undefined),
      },
    },
  },
  server: {
    // Folder privat tidak boleh pernah disajikan oleh dev server.
    fs: { deny: ['myesics/**', '_private/**', '*.pdf'] },
  },
});
