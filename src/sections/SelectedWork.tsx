import { publishedProjects, sections, ui } from '../data';
import { useLocale } from '../hooks/useLocale';
import { ProjectList } from '../components/project/ProjectList';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TerraceNetwork } from '../components/ui/TerraceNetwork';

export function SelectedWork() {
  const { t } = useLocale();
  const meta = sections[1];

  return (
    <section id={meta.id} className="terrace" aria-labelledby="work-title">
      <SectionHeading
        id="work-title"
        index={1}
        aside={`${publishedProjects.length} ${t(ui.projectsCount)}`}
      >
        {t(meta.label)}
      </SectionHeading>
      <ProjectList projects={publishedProjects} />
      <TerraceNetwork variant="work" />
    </section>
  );
}
