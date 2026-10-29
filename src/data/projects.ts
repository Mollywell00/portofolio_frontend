import { envirolandHome, myesicsLogin } from './media';
import type { Project } from './types';

// Urutan array = urutan tampil. Klaim mengikuti PORTFOLIO_STANDARD §4.
export const projects: Project[] = [
  {
    slug: 'myesics',
    title: 'MyESICS',
    year: '2026—',
    kind: { en: 'Frontend', id: 'Frontend' },
    role: { en: 'Frontend Web Engineer (team, remote)', id: 'Frontend Web Engineer (tim, remote)' },
    stack: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Express', 'PostgreSQL'],
    stackShort: ['Vue', 'TypeScript'],
    summary: {
      en: 'A web platform that helps companies manage environmental compliance — audits, monitoring reports, and water balance. I build its frontend with a team.',
      id: 'Platform web yang membantu perusahaan mengelola kepatuhan lingkungan — audit, laporan pemantauan, dan neraca air. Saya membangun frontend-nya bersama tim.',
    },
    context: {
      en: 'MyESICS turns environmental regulations into digital checklists, monitoring reports and analysis tools for companies in Indonesia.',
      id: 'MyESICS mengubah regulasi lingkungan menjadi checklist digital, laporan pemantauan, dan alat analisis untuk perusahaan di Indonesia.',
    },
    process: {
      en: [
        'Registration forms with auto-filled company data and responsive layouts.',
        'Environmental Monitoring Report (EMR) forms that highlight parameters above the quality standard.',
        'Audit Basic & Beyond detail views — scoring, charts and PDF export.',
        'Water balance reports and diagrams.',
        'The interface for AI recommendations.',
        'Compliance self-assessment (CSA), in-app notifications and HTML email templates.',
        'Excel export that follows the statutory compliance template.',
        'Mobile layouts across the newer modules.',
      ],
      id: [
        'Form registrasi dengan data perusahaan terisi otomatis dan tata letak responsif.',
        'Form Environmental Monitoring Report (EMR) yang menandai parameter di atas baku mutu.',
        'Tampilan detail Audit Basic & Beyond — skoring, grafik, dan ekspor PDF.',
        'Laporan dan diagram neraca air (water balance).',
        'Antarmuka rekomendasi AI.',
        'Compliance self-assessment (CSA), notifikasi dalam aplikasi, dan template email HTML.',
        'Ekspor Excel sesuai template statutory compliance.',
        'Tata letak mobile di modul-modul baru.',
      ],
    },
    links: [{ label: 'myesics.com', href: 'https://myesics.com/' }],
    media: [myesicsLogin],
    source: 'riwayat commit repo myesics (Mar–Okt 2026); myesics.com; pemilik 2026-10-28',
    status: 'published',
  },
  {
    slug: 'enviroland-website',
    title: 'Enviroland Website',
    year: '2025',
    kind: { en: 'Internship', id: 'Kerja Praktek' },
    role: { en: 'Web developer (internship)', id: 'Web developer (Kerja Praktek)' },
    stack: ['Laravel', 'PHP'],
    stackShort: ['Laravel'],
    summary: {
      en: 'The company website of a custom-home developer, built from scratch during my internship.',
      id: 'Website perusahaan pengembang rumah custom, saya bangun dari nol selama Kerja Praktek.',
    },
    context: {
      en: 'Internship at PT Enviroland, September – November 2025. The site was written by hand from an empty project.',
      id: 'Kerja Praktek di PT Enviroland, September – November 2025. Situs ditulis tangan dari proyek kosong.',
    },
    links: [{ label: 'enviroland.id', href: 'https://www.enviroland.id/' }],
    media: [envirolandHome],
    source: 'CV; enviroland.id; pemilik 2026-10-28 (dari nol, Laravel)',
    status: 'published',
  },
  {
    slug: 'drowsiness-detection',
    title: 'Drowsiness Detection',
    year: '2025',
    kind: { en: 'Prototype', id: 'Prototipe' },
    // TODO(pemilik): konfirmasi dikerjakan sendiri atau berkelompok.
    role: { en: 'Solo course project', id: 'Proyek kuliah (dikerjakan sendiri)' },
    stack: ['Python', 'PyTorch', 'OpenCV', 'MediaPipe'],
    stackShort: ['PyTorch', 'MediaPipe'],
    environment: 'Google Colab',
    summary: {
      en: 'A prototype that reads eye state from camera images to flag drowsiness, aimed at mining-worker safety.',
      id: 'Prototipe yang membaca kondisi mata dari gambar kamera untuk menandai kantuk, ditujukan untuk keselamatan pekerja tambang.',
    },
    context: {
      en: 'A course project in Informatics Engineering, aimed at the safety of mining workers. It was appreciated by the lecturers of the Database and Artificial Intelligence courses.',
      id: 'Proyek kuliah Teknik Informatika, ditujukan untuk keselamatan pekerja tambang. Mendapat apresiasi dari dosen mata kuliah Basis Data dan Artificial Intelligence.',
    },
    process: {
      en: [
        'Images labelled Drowsy / Non Drowsy, split 80% training and 20% validation.',
        'Transfer learning on MobileNetV2 with pretrained weights — 5 epochs, Adam, learning rate 1e-4.',
        'A geometric check with MediaPipe Face Mesh: the Eye Aspect Ratio, threshold 0.21.',
        'Both signals combined into one decision per image.',
      ],
      id: [
        'Gambar berlabel Drowsy / Non Drowsy, dibagi 80% training dan 20% validasi.',
        'Transfer learning pada MobileNetV2 dengan bobot pralatih — 5 epoch, Adam, learning rate 1e-4.',
        'Pemeriksaan geometris dengan MediaPipe Face Mesh: Eye Aspect Ratio, ambang 0.21.',
        'Kedua sinyal digabung menjadi satu keputusan per gambar.',
      ],
    },
    pipeline: [
      {
        title: { en: 'Camera image', id: 'Gambar kamera' },
        body: { en: 'A still frame of the face.', id: 'Satu frame wajah.' },
      },
      {
        title: { en: 'Grayscale + CLAHE', id: 'Grayscale + CLAHE' },
        body: {
          en: 'Even out lighting before analysis.',
          id: 'Meratakan pencahayaan sebelum dianalisis.',
        },
      },
      {
        title: { en: 'Face Mesh → EAR', id: 'Face Mesh → EAR' },
        body: {
          en: 'Eye landmarks give the Eye Aspect Ratio.',
          id: 'Landmark mata menghasilkan Eye Aspect Ratio.',
        },
        highlight: true,
      },
      {
        title: { en: 'MobileNetV2', id: 'MobileNetV2' },
        body: {
          en: 'Classifies Drowsy / Non Drowsy with a confidence.',
          id: 'Mengklasifikasi Drowsy / Non Drowsy beserta confidence.',
        },
        highlight: true,
      },
      {
        title: { en: 'Decision', id: 'Keputusan' },
        body: {
          en: 'Combines the EAR threshold with model confidence.',
          id: 'Menggabungkan ambang EAR dengan confidence model.',
        },
      },
    ],
    demo: 'eye-aspect-ratio',
    lessons: {
      en: [
        'One image shows drowsiness, not microsleep — microsleep needs how long the eyes stay closed, so the next step is video over time.',
        'Preprocessing must be identical in training and inference.',
        'A fair test uses people the model has never seen.',
      ],
      id: [
        'Satu gambar menunjukkan kantuk, bukan microsleep — microsleep butuh durasi mata tertutup, jadi langkah berikutnya adalah video dari waktu ke waktu.',
        'Preprocessing harus identik saat training dan inferensi.',
        'Pengujian yang adil memakai orang yang belum pernah dilihat model.',
      ],
    },
    source: 'CV; pemilik 2026-10-28 (2025, deskripsi kode Colab, dikerjakan sendiri)',
    status: 'published',
  },
];
