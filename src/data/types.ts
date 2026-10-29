/**
 * Skema konten — lihat PORTFOLIO_STANDARD.md §2 (sumber), §4 (inventaris), §8.4 (skema).
 * Setiap entri wajib punya `source`. Entri `draft` tidak dirender di produksi.
 */

export type Locale = 'en' | 'id';

/** Teks dua bahasa. Inggris wajib; Indonesia opsional (fallback ke Inggris). */
export type Localized<T = string> = { en: T; id?: T };

/** Item yang sama di kedua bahasa (mis. nama teknologi) boleh string biasa. */
export type Text = string | Localized;

export type ContentStatus = 'draft' | 'published';

export interface Sourced {
  /** Asal fakta, mis. "CV", "enviroland.id", "pemilik 2026-10-28", "repo myesics". */
  source: string;
  status: ContentStatus;
}

export interface ExternalLink {
  label: Text;
  href: string;
}

export interface Media {
  /** Fallback (WebP lebar terbesar). */
  src: string;
  /** srcset per format, mis. "a-640.avif 640w, a-1280.avif 1280w". */
  srcset: { avif: string; webp: string };
  alt: Localized;
  /** Dimensi intrinsik — wajib agar tidak ada layout shift. */
  width: number;
  height: number;
  caption?: Localized;
}

export interface PipelineStep {
  title: Localized;
  body: Localized;
  /** Langkah inti yang ditonjolkan dengan warna aksen. */
  highlight?: boolean;
}

/** Visual interaktif khusus proyek, dirender oleh komponen yang sesuai. */
export type ProjectDemo = 'eye-aspect-ratio';

export interface Project extends Sourced {
  /** kebab-case, permanen setelah dipublikasikan (dipakai di URL /work/:slug). */
  slug: string;
  title: string;
  /** Mis. "2025" atau "2026—". */
  year: string;
  role: Localized;
  /** Label pendek untuk baris daftar, mis. "Frontend" / "Internship". */
  kind: Localized;
  stack: string[];
  summary: Localized;
  /** Tumpukan pendek untuk baris daftar (2 item). Default: 2 pertama dari `stack`. */
  stackShort?: string[];
  environment?: string;
  context?: Localized;
  problem?: Localized;
  process?: Localized<string[]>;
  outcome?: Localized;
  lessons?: Localized<string[]>;
  links?: ExternalLink[];
  /** Gambar pertama = cover di daftar proyek & hero case study. */
  media?: Media[];
  pipeline?: PipelineStep[];
  demo?: ProjectDemo;
}

export type ExperienceKind = 'work' | 'community' | 'education';

export interface Experience extends Sourced {
  id: string;
  period: Localized;
  title: Localized;
  org: string;
  kind: ExperienceKind;
  detail?: Localized;
}

export interface SkillGroup extends Sourced {
  id: string;
  label: Localized;
  items: Text[];
}

export interface ProcessStep {
  title: Localized;
  body: Localized;
}

export interface Profile {
  name: { full: string; lines: [string, string, string]; initials: string };
  role: Localized;
  lead: Localized;
  current: { title: string; org: string; mode: Localized };
  about: Localized<string[]>;
  location: Localized;
  /**
   * Email disimpan terpisah dan dirakit di browser (PORTFOLIO_STANDARD §3) —
   * jangan pernah menulis alamat utuh di markup statis.
   */
  email: { user: string; domain: string };
  links: { gitlab: string; linkedin: string; github?: string };
}
