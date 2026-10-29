import { experience } from './experience';
import { projects } from './projects';
import { skillGroups } from './skills';
import type { Sourced } from './types';
import { validateContent } from '../utils/validateContent';

export { profile } from './profile';
export { processSteps } from './skills';
export { sections } from './sections';
export type { SectionId } from './sections';
export { ui } from './ui';

/** Di produksi hanya entri `published` yang keluar dari modul ini. */
const visible = <T extends Sourced>(items: T[]): T[] =>
  import.meta.env.DEV ? items : items.filter((item) => item.status === 'published');

if (import.meta.env.DEV) validateContent({ projects, experience, skillGroups });

export const publishedProjects = visible(projects);
export const publishedExperience = visible(experience);
export const publishedSkillGroups = visible(skillGroups);

export const findProject = (slug: string | undefined) =>
  publishedProjects.find((project) => project.slug === slug);
