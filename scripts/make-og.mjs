// Buat gambar Open Graph 1200×630 (EN & ID) ke public/ dengan font situs.
// Dirender oleh Chrome headless lokal. Jalankan ulang hanya bila teks/desain berubah.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
// Font disematkan sebagai data URL agar pasti termuat sebelum screenshot.
const font = (pkg, file) =>
  `data:font/woff2;base64,${readFileSync(join(ROOT, 'node_modules', pkg, 'files', file)).toString('base64')}`;

const copy = {
  en: { role: 'Technician & Web Engineer', now: 'Frontend Web Engineer · MyESICS · Remote' },
  id: { role: 'Teknisi & Web Engineer', now: 'Frontend Web Engineer · MyESICS · Remote' },
};

const eye = (cx) => `
  <path d="M${cx - 90} 90C${cx - 50} 28 ${cx + 50} 28 ${cx + 90} 90C${cx + 50} 152 ${cx - 50} 152 ${cx - 90} 90Z" fill="none" stroke="#E8E4DA" stroke-width="2"/>
  <circle cx="${cx - 14}" cy="94" r="30" fill="#151513" stroke="#9C978C"/>
  <circle cx="${cx - 14}" cy="94" r="11" fill="#9DB57F"/>
  ${[[-90, 0], [-32, -44], [32, -44], [90, 0], [32, 44], [-32, 44]]
    .map(([x, y]) => `<circle cx="${cx + x}" cy="${90 + y}" r="3.5" fill="#9DB57F" opacity=".8"/>`)
    .join('')}`;

const html = ({ role, now }) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:OgSerif;src:url(${font('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff2')})}
@font-face{font-family:OgSans;src:url(${font('@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-opsz-normal.woff2')})}
@font-face{font-family:OgMono;src:url(${font('@fontsource-variable/jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#151513;color:#E8E4DA;padding:64px 72px;position:relative;overflow:hidden;font-family:OgSans}
.meta{font:500 18px OgMono;letter-spacing:.08em;text-transform:uppercase;color:#9C978C}
.name{font:400 128px/0.86 OgSerif;letter-spacing:-.035em;margin-top:28px}
.name span{display:block}.name span:nth-child(2){padding-left:48px}.name span:nth-child(3){padding-left:96px}
.rule{position:absolute;left:72px;right:72px;bottom:118px;height:1px;background:#2E2D29}
.foot{position:absolute;left:72px;right:72px;bottom:64px;display:flex;justify-content:space-between}
.foot b{color:#E8E4DA;font-weight:500}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#9DB57F;margin-right:10px}
svg{position:absolute;right:56px;top:150px;width:520px}
</style></head><body>
<p class="meta">00 / ${role.replace('&', '&amp;')}</p>
<h1 class="name"><span>Fahnur</span><span>Qoirul</span><span>Anwar</span></h1>
<svg viewBox="0 0 440 180"><line x1="0" y1="90" x2="440" y2="90" stroke="#2E2D29" stroke-dasharray="3 5"/>${eye(110)}${eye(330)}</svg>
<div class="rule"></div>
<div class="foot meta"><span><span class="dot"></span><b>${now}</b></span><span>Portfolio</span></div>
</body></html>`;

const tmp = mkdtempSync(join(tmpdir(), 'og-'));
for (const [locale, text] of Object.entries(copy)) {
  const page = join(tmp, `og-${locale}.html`);
  writeFileSync(page, html(text));
  execFileSync(CHROME, [
    '--headless=new', '--hide-scrollbars', '--allow-file-access-from-files',
    '--window-size=1200,630', '--virtual-time-budget=3000',
    `--screenshot=${join(ROOT, 'public', `og-${locale}.png`)}`, pathToFileURL(page).href,
  ], { stdio: 'ignore' });
  console.log(`✓ public/og-${locale}.png`);
}
