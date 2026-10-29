# Fahnur Qoirul Anwar — Portfolio

Portofolio interaktif (React 19 · TypeScript · Vite · GSAP). Aturan konten, privasi, dan desain ada di [PORTFOLIO_STANDARD.md](PORTFOLIO_STANDARD.md); keputusan per fase di [`docs/`](docs/).

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build klien + SSR, lalu prerender semua halaman ke `dist/` |
| `npm run check` | Typecheck, lint, format, build, pemeriksaan privasi |
| `npm run images` | Optimasi screenshot dari `_private/` ke `src/assets/images/` |
| `npm run og` | Buat ulang gambar Open Graph (`public/og-*.png`) |
| `npm run deploy` | Cek `.vercelignore` → `check` → deploy produksi ke Vercel |

## Struktur

```
src/
├─ app/          router, layout, konteks bahasa
├─ pages/        beranda, case study, 404
├─ sections/     section beranda
├─ components/   layout · ui · cursor · project
├─ animations/   GSAP (dimuat terpisah) + easing
├─ hooks/        motion policy, magnetic, parallax, reveal, tema, bahasa
├─ data/         SEMUA konten (EN/ID) — komponen tidak berisi teks
├─ styles/       token, reset, tipografi
├─ entry-server.tsx · seo.ts   prerender & metadata
scripts/         prerender, privasi, gambar, OG, guard upload
```

## Mengubah konten

Edit file di `src/data/`. Setiap entri wajib punya `source` (asal fakta) dan `status`; hanya `published` yang tampil di produksi. Jangan menambah angka atau klaim tanpa sumber (lihat Standar §2).

## Privasi

CV, folder `myesics/`, dan `_private/` tidak pernah di-commit (`.gitignore`) maupun diunggah (`.vercelignore`). `npm run check:privacy` menggagalkan build bila nomor telepon, email utuh, atau istilah di `_private/privacy-terms.txt` muncul di `dist/` atau `src/`.
