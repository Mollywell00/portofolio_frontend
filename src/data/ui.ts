import type { Localized } from './types';

/** Teks antarmuka (bukan konten). Kunci baru wajib punya en + id. */
export const ui = {
  skipLink: { en: 'Skip to content', id: 'Lewati ke konten' },
  theme: { en: 'Theme', id: 'Tema' },
  themeToLight: { en: 'Switch to light theme', id: 'Ganti ke tema terang' },
  themeToDark: { en: 'Switch to dark theme', id: 'Ganti ke tema gelap' },
  switchLanguage: { en: 'Baca dalam Bahasa Indonesia', id: 'Read in English' },
  currently: { en: 'Currently', id: 'Saat ini' },
  ctaWork: { en: 'View work', id: 'Lihat karya' },
  ctaEmail: { en: 'Email me', id: 'Kirim email' },
  sendEmail: { en: 'Send an email', id: 'Kirim email' },
  projectsCount: { en: 'projects', id: 'proyek' },
  viewCaseStudy: { en: 'View case study', id: 'Lihat case study' },
  backToWork: { en: 'Back to work', id: 'Kembali ke karya' },
  nextProject: { en: 'Next', id: 'Berikutnya' },
  caseStudy: { en: 'Case study', id: 'Case study' },
  role: { en: 'Role', id: 'Peran' },
  year: { en: 'Year', id: 'Tahun' },
  stack: { en: 'Stack', id: 'Stack' },
  environment: { en: 'Environment', id: 'Lingkungan' },
  links: { en: 'Links', id: 'Tautan' },
  context: { en: 'Context', id: 'Konteks' },
  problem: { en: 'Problem', id: 'Masalah' },
  process: { en: 'Process', id: 'Proses' },
  outcome: { en: 'Outcome', id: 'Hasil' },
  lessons: { en: 'Lessons', id: 'Pelajaran' },
  contactHeading: { en: ["Let's", 'talk.'], id: ['Mari', 'bicara.'] },
  contactLine: {
    en: 'Open to frontend and web engineering work.',
    id: 'Terbuka untuk pekerjaan frontend dan web engineering.',
  },
  notFoundTitle: { en: 'Page not found', id: 'Halaman tidak ditemukan' },
  notFoundBody: {
    en: 'This page does not exist, or has moved.',
    id: 'Halaman ini tidak ada, atau sudah dipindah.',
  },
  home: { en: 'Back home', id: 'Kembali ke beranda' },
  menu: { en: 'Menu', id: 'Menu' },
  closeMenu: { en: 'Close', id: 'Tutup' },
  sectionsNav: { en: 'Sections', id: 'Bagian' },
  mainNav: { en: 'Main', id: 'Utama' },
  pipeline: { en: 'Pipeline', id: 'Alur' },
  earTitle: { en: 'Eye Aspect Ratio, interactive', id: 'Eye Aspect Ratio, interaktif' },
  earSlider: { en: 'Eye openness — drag', id: 'Keterbukaan mata — geser' },
  earAbove: {
    en: 'Above the 0.21 threshold — eye open',
    id: 'Di atas ambang 0.21 — mata terbuka',
  },
  earBelow: {
    en: 'Below the 0.21 threshold — eye treated as closed',
    id: 'Di bawah ambang 0.21 — mata dianggap tertutup',
  },
  earNote: {
    en: 'Illustrates the method only — not results from the prototype.',
    id: 'Hanya mengilustrasikan metode — bukan hasil dari prototipe.',
  },
  earDiagram: {
    en: 'Eye outline with six landmarks, p1 to p6',
    id: 'Garis mata dengan enam landmark, p1 sampai p6',
  },
  builtWith: { en: 'Built with React & GSAP', id: 'Dibuat dengan React & GSAP' },
} satisfies Record<string, Localized<string | string[]>>;

export type UiKey = keyof typeof ui;
