import enviroland640avif from '../assets/images/enviroland-home-640.avif';
import enviroland640webp from '../assets/images/enviroland-home-640.webp';
import enviroland1280avif from '../assets/images/enviroland-home-1280.avif';
import enviroland1280webp from '../assets/images/enviroland-home-1280.webp';
import myesics640avif from '../assets/images/myesics-login-640.avif';
import myesics640webp from '../assets/images/myesics-login-640.webp';
import myesics1280avif from '../assets/images/myesics-login-1280.avif';
import myesics1280webp from '../assets/images/myesics-login-1280.webp';
import type { Media } from './types';

// Dihasilkan oleh `npm run images` dari _private/ (EXIF dibuang, statistik Enviroland dipotong).
const srcset = (s640: string, s1280: string) => `${s640} 640w, ${s1280} 1280w`;

export const myesicsLogin: Media = {
  src: myesics1280webp,
  srcset: {
    avif: srcset(myesics640avif, myesics1280avif),
    webp: srcset(myesics640webp, myesics1280webp),
  },
  width: 1280,
  height: 800,
  alt: {
    en: 'MyESICS sign-in page: a login form on the left and a forest-and-face illustration on the right.',
    id: 'Halaman masuk MyESICS: form login di kiri dan ilustrasi wajah berpadu hutan di kanan.',
  },
};

export const envirolandHome: Media = {
  src: enviroland1280webp,
  srcset: {
    avif: srcset(enviroland640avif, enviroland1280avif),
    webp: srcset(enviroland640webp, enviroland1280webp),
  },
  width: 1280,
  height: 507,
  alt: {
    en: 'Enviroland homepage hero: a modern house photo with the Enviroland title and two call-to-action buttons.',
    id: 'Hero beranda Enviroland: foto rumah modern dengan judul Enviroland dan dua tombol ajakan.',
  },
};
