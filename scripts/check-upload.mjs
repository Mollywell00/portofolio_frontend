// Pastikan file privat tercantum di .vercelignore sebelum deploy (dipanggil oleh `npm run deploy`).
import { existsSync, readFileSync } from 'node:fs';

const REQUIRED = ['Dokumen dari Anwar-1.pdf', 'myesics', '_private', '.env*'];
const listed = existsSync('.vercelignore')
  ? readFileSync('.vercelignore', 'utf8').split(/\r?\n/).map((l) => l.trim())
  : [];
const missing = REQUIRED.filter((entry) => !listed.includes(entry));
if (missing.length) {
  console.error(`✗ .vercelignore belum mengecualikan: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('✓ .vercelignore mengecualikan semua file privat.');
