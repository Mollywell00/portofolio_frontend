import type { Profile } from './types';

// Sumber: CV, pernyataan pemilik 2026-10-28, LinkedIn (hanya tautan).
export const profile: Profile = {
  name: {
    full: 'Fahnur Qoirul Anwar',
    lines: ['Fahnur', 'Qoirul', 'Anwar'],
    initials: 'FQA',
  },
  role: {
    en: 'Technician & Web Engineer',
    id: 'Teknisi & Web Engineer',
  },
  lead: {
    en: 'I build web interfaces for real work — environmental compliance tools, company websites, and computer-vision experiments.',
    id: 'Saya membangun antarmuka web untuk pekerjaan nyata — aplikasi kepatuhan lingkungan, website perusahaan, dan eksperimen computer vision.',
  },
  current: {
    title: 'Frontend Web Engineer',
    org: 'MyESICS',
    mode: { en: 'Remote', id: 'Remote' },
  },
  about: {
    en: [
      "I'm an Informatics Engineering student at Universitas Muhammadiyah Magelang and a frontend web engineer at MyESICS, working remotely.",
      "I started learning web development on my own before university — through YouTube and online courses — after studying Electrical Engineering at vocational high school. I'm interested in web development and artificial intelligence, and was a member of Google Developer Student Clubs on campus in 2024.",
    ],
    id: [
      'Saya mahasiswa Teknik Informatika di Universitas Muhammadiyah Magelang dan frontend web engineer di MyESICS, bekerja secara remote.',
      'Saya mulai belajar web development secara otodidak sebelum kuliah — lewat YouTube dan course online — setelah menempuh Teknik Elektro di SMK. Saya tertarik pada web development dan kecerdasan buatan, dan menjadi anggota Google Developer Student Clubs di kampus pada 2024.',
    ],
  },
  location: { en: 'Indonesia', id: 'Indonesia' },
  email: { user: 'fahnurqoirul15', domain: 'gmail.com' },
  links: {
    gitlab: 'https://gitlab.com/fahnurqoirul15',
    linkedin: 'https://www.linkedin.com/in/fahnur-qoirul-anwar-202406285/',
    // github: menyusul (kendala login pemilik)
  },
};
