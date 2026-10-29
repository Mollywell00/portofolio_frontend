import type { ProcessStep, SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: { en: 'Frontend' },
    items: ['HTML, CSS, JavaScript', 'TypeScript', 'React, Next.js', 'Vue 3', 'Tailwind CSS'],
    source: 'CV; pemilik; repo myesics',
    status: 'published',
  },
  {
    id: 'backend',
    label: { en: 'Backend & Data' },
    items: ['PHP, Laravel', 'Node.js, Express', 'PostgreSQL', 'MySQL'],
    source: 'CV; pemilik 2026-10-28; repo myesics',
    status: 'published',
  },
  {
    id: 'ai',
    label: { en: 'AI / Computer Vision' },
    items: ['Python', 'PyTorch', 'OpenCV', 'MediaPipe'],
    source: 'CV; proyek Drowsiness Detection',
    status: 'published',
  },
  {
    id: 'other',
    label: { en: 'Tools & Other', id: 'Tools & Lainnya' },
    items: [
      'Git, GitLab CI, Vite',
      { en: 'Computer & network literacy', id: 'Literasi komputer & jaringan' },
      { en: 'English (B2)', id: 'Bahasa Inggris (B2)' },
    ],
    source: 'CV; repo myesics',
    status: 'published',
  },
];

// Diturunkan dari pola kerja di repo MyESICS; disetujui pemilik (Fase 2).
export const processSteps: ProcessStep[] = [
  {
    title: { en: 'Understand', id: 'Pahami' },
    body: {
      en: 'Read the requirement at its source — a regulation form, a spreadsheet, a user flow.',
      id: 'Baca kebutuhan dari sumbernya — form regulasi, spreadsheet, alur pengguna.',
    },
  },
  {
    title: { en: 'Build', id: 'Bangun' },
    body: {
      en: 'Turn it into typed, reusable interface components.',
      id: 'Ubah menjadi komponen antarmuka yang bertipe dan bisa dipakai ulang.',
    },
  },
  {
    title: { en: 'Adapt', id: 'Sesuaikan' },
    body: {
      en: 'Make it work on every screen, and export to the formats people use (PDF, Excel).',
      id: 'Pastikan berjalan di semua layar, dan bisa diekspor ke format yang dipakai orang (PDF, Excel).',
    },
  },
  {
    title: { en: 'Ship', id: 'Rilis' },
    body: {
      en: 'Release through CI, then fix what real use reveals.',
      id: 'Rilis lewat CI, lalu perbaiki apa yang ditemukan dari pemakaian nyata.',
    },
  },
];
