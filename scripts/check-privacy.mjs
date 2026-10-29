// Pemeriksaan privasi (PORTFOLIO_STANDARD §3, §13): gagal bila data pribadi
// ditemukan di hasil build atau sumber. Istilah sensitif tambahan (alamat, dll.)
// dibaca dari _private/privacy-terms.txt — file itu sendiri tidak di-commit.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = process.cwd();
// Semua yang di-build atau di-commit (bukan hanya hasil build).
const TARGETS = ['dist', 'src', 'public', 'docs', 'scripts', 'index.html', 'README.md', 'PORTFOLIO_STANDARD.md'];
const TEXT_EXT = new Set(['.html', '.js', '.css', '.ts', '.tsx', '.json', '.svg', '.txt', '.md', '.xml']);
const FORBIDDEN_FILES = [/\.pdf$/i, /\.sql$/i, /(^|[\\/])\.env/];

const patterns = [
  { name: 'nomor telepon', re: /(?:\+62|\b0)8\d{8,11}\b/g },
  { name: 'alamat email utuh', re: /[\w.+-]+@[\w-]+\.[a-z]{2,}(?:\.[a-z]{2,})?/gi },
];

const termsFile = join(ROOT, '_private', 'privacy-terms.txt');
if (existsSync(termsFile)) {
  for (const term of readFileSync(termsFile, 'utf8').split(/\r?\n/)) {
    const t = term.trim();
    if (t && !t.startsWith('#'))
      patterns.push({ name: 'istilah privat', re: new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi') });
  }
} else {
  console.warn('! _private/privacy-terms.txt tidak ada — hanya pola umum yang diperiksa.');
}

// Pengecualian yang disengaja (bukan data pribadi).
const ALLOWED = [/noreply@/i, /^[\w.-]+@\d/];

function* walk(path) {
  if (!existsSync(path)) return;
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) yield* walk(join(path, entry));
  } else yield path;
}

const problems = [];
for (const target of TARGETS) {
  for (const file of walk(join(ROOT, target))) {
    const rel = relative(ROOT, file);
    if (FORBIDDEN_FILES.some((re) => re.test(rel))) {
      problems.push(`${rel}: jenis file terlarang`);
      continue;
    }
    if (!TEXT_EXT.has(extname(file))) continue;
    const content = readFileSync(file, 'utf8');
    for (const { name, re } of patterns) {
      for (const match of content.matchAll(re)) {
        if (ALLOWED.some((ok) => ok.test(match[0]))) continue;
        problems.push(`${rel}: ${name} → "${match[0]}"`);
      }
    }
  }
}

if (problems.length) {
  console.error(`✗ Pemeriksaan privasi gagal (${problems.length}):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('✓ Pemeriksaan privasi lolos.');
