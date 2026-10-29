import type { Experience, Project, SkillGroup, Sourced } from '../data/types';

interface Content {
  projects: Project[];
  experience: Experience[];
  skillGroups: SkillGroup[];
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Mengembalikan daftar pelanggaran aturan konten (PORTFOLIO_STANDARD §2, §8.4). */
export function findContentIssues({ projects, experience, skillGroups }: Content): string[] {
  const issues: string[] = [];
  const checkSource = (kind: string, id: string, item: Sourced) => {
    if (item.status === 'published' && !item.source.trim())
      issues.push(`${kind} "${id}" dipublikasikan tanpa source`);
  };

  const slugs = new Set<string>();
  for (const p of projects) {
    checkSource('project', p.slug, p);
    if (!SLUG.test(p.slug)) issues.push(`project "${p.slug}": slug bukan kebab-case`);
    if (slugs.has(p.slug)) issues.push(`project "${p.slug}": slug ganda`);
    slugs.add(p.slug);
    if (p.status === 'published' && !p.year.trim())
      issues.push(`project "${p.slug}": dipublikasikan tanpa tahun`);
    for (const m of p.media ?? []) {
      if (!m.alt.en.trim()) issues.push(`project "${p.slug}": gambar ${m.src} tanpa alt`);
    }
  }
  for (const e of experience) checkSource('experience', e.id, e);
  for (const g of skillGroups) checkSource('skill group', g.id, g);
  return issues;
}

/** Dipanggil saat dev: pelanggaran langsung terlihat di console. */
export function validateContent(content: Content): void {
  const issues = findContentIssues(content);
  if (issues.length) console.error(`[content] ${issues.length} masalah:\n- ${issues.join('\n- ')}`);
}
