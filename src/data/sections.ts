import type { Localized } from './types';

/** Section beranda — urutan = nomor indeks di terrace ruler. */
export const sections = [
  { id: 'intro', label: { en: 'Intro', id: 'Intro' }, short: { en: 'Intro', id: 'Intro' } },
  {
    id: 'work',
    label: { en: 'Selected Work', id: 'Karya Pilihan' },
    short: { en: 'Work', id: 'Karya' },
  },
  { id: 'about', label: { en: 'About', id: 'Tentang' }, short: { en: 'About', id: 'Tentang' } },
  {
    id: 'skills',
    label: { en: 'Skills & Process', id: 'Skill & Proses' },
    short: { en: 'Skills', id: 'Skill' },
  },
  {
    id: 'experience',
    label: { en: 'Experience', id: 'Pengalaman' },
    short: { en: 'Exp', id: 'Pengalaman' },
  },
  { id: 'contact', label: { en: 'Contact', id: 'Kontak' }, short: { en: 'Contact', id: 'Kontak' } },
] as const satisfies readonly { id: string; label: Localized; short: Localized }[];

export type SectionId = (typeof sections)[number]['id'];
