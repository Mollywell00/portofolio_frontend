// Ubah screenshot mentah (_private/, tidak di-commit) menjadi aset siap pakai di
// src/assets/images: dipotong, metadata/EXIF dibuang (default sharp), AVIF + WebP, 2 lebar.
// Jalankan: npm run images
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const RAW = '_private/screenshots-raw';
const OUT = 'src/assets/images';
const WIDTHS = [640, 1280];

const jobs = [
  // Halaman login aplikasi MyESICS — tanpa data pengguna.
  { name: 'myesics-login', src: 'myesics-app-login-desktop.png', crop: null },
  // Hero enviroland.id. Statistik bisnis (50+ / 5.0 / 20+, y≈590–670) dipotong
  // sesuai PORTFOLIO_STANDARD §4.3 — hanya bagian atas yang dipakai.
  {
    name: 'enviroland-home',
    src: 'enviroland-home-desktop.png',
    crop: { left: 0, top: 0, width: 1440, height: 570 },
  },
];

mkdirSync(OUT, { recursive: true });

for (const job of jobs) {
  let base = sharp(join(RAW, job.src));
  if (job.crop) base = base.extract(job.crop);
  const buffer = await base.toBuffer();
  for (const width of WIDTHS) {
    const resized = sharp(buffer).resize({ width, withoutEnlargement: true });
    await resized.clone().avif({ quality: 55 }).toFile(join(OUT, `${job.name}-${width}.avif`));
    const info = await resized.clone().webp({ quality: 78 }).toFile(join(OUT, `${job.name}-${width}.webp`));
    console.log(`${job.name}-${width}: ${info.width}×${info.height}`);
  }
}
