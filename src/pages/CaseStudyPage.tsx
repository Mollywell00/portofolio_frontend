import { Link, useParams } from 'react-router';
import { findProject, profile, publishedProjects, ui } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLocale } from '../hooks/useLocale';
import { EarDemo } from '../components/project/EarDemo';
import { Pipeline } from '../components/project/Pipeline';
import { Picture } from '../components/ui/Picture';
import button from '../components/ui/Button.module.css';
import { NotFoundPage } from './NotFoundPage';
import styles from './CaseStudyPage.module.css';

export function CaseStudyPage() {
  const { slug } = useParams();
  const project = findProject(slug);
  return project ? <CaseStudy slug={project.slug} /> : <NotFoundPage />;
}

function CaseStudy({ slug }: { slug: string }) {
  const { t, tx, to } = useLocale();
  const index = publishedProjects.findIndex((p) => p.slug === slug);
  const project = publishedProjects[index];
  const next = publishedProjects[(index + 1) % publishedProjects.length];
  useDocumentTitle(`${project?.title ?? ''} — ${profile.name.full}`);
  if (!project) return null;

  const [firstWord, ...restWords] = project.title.split(' ');
  const cover = project.media?.[0];
  const facts = [
    { label: ui.role, value: t(project.role) },
    { label: ui.year, value: project.year },
    { label: ui.stack, value: project.stack.join(' · ') },
    project.environment
      ? { label: ui.environment, value: project.environment }
      : project.links?.[0] && { label: ui.links, link: project.links[0] },
  ].filter((f) => !!f);

  const rows = [
    { label: ui.context, body: project.context && [t(project.context)], ordered: false },
    { label: ui.problem, body: project.problem && [t(project.problem)], ordered: false },
    { label: ui.process, body: project.process && t(project.process), ordered: true },
    { label: ui.outcome, body: project.outcome && [t(project.outcome)], ordered: false },
    { label: ui.lessons, body: project.lessons && t(project.lessons), ordered: false },
  ].filter((r) => r.body && r.body.length > 0);

  return (
    <article className={styles.page} aria-labelledby="cs-title">
      <Link className={`t-meta ${styles.back}`} to={to('/#work')}>
        ← {t(ui.backToWork)}
      </Link>
      <p className="t-meta">
        {String(index + 1).padStart(2, '0')} / {t(ui.caseStudy)}
      </p>
      <h1 id="cs-title" className={`t-h1 ${styles.title}`}>
        <span>{firstWord}</span>
        {restWords.length > 0 && <span>{restWords.join(' ')}</span>}
      </h1>
      <p className={`t-lead ${styles.summary}`}>{t(project.summary)}</p>

      <dl className={styles.facts}>
        {facts.map((f) => (
          <div key={f.label.en}>
            <dt className="t-meta">{t(f.label)}</dt>
            <dd>
              {'link' in f && f.link ? (
                <a className={button.underline} href={f.link.href}>
                  {tx(f.link.label)} ↗
                </a>
              ) : (
                'value' in f && f.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      {cover && (
        <figure className={styles.cover}>
          <Picture media={cover} sizes="(max-width: 767px) 100vw, 90vw" priority />
        </figure>
      )}

      {project.pipeline && (
        <div className={styles.block}>
          <Pipeline steps={project.pipeline} label={t(ui.pipeline)} />
        </div>
      )}

      {project.demo === 'eye-aspect-ratio' && (
        <div className={styles.block}>
          <EarDemo />
        </div>
      )}

      <div className={styles.rows}>
        {rows.map(({ label, body, ordered }) => {
          const List = ordered ? 'ol' : 'ul';
          return (
            <section key={label.en} className={styles.row}>
              <h2 className="t-meta">{t(label)}</h2>
              {body && body.length === 1 ? (
                <p className="t-prose">{body[0]}</p>
              ) : (
                <List className={`t-prose ${styles.list}`}>
                  {body?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </List>
              )}
            </section>
          );
        })}
      </div>

      {project.links && project.links.length > 0 && (
        <p className={styles.links}>
          {project.links.map((link) => (
            <a key={link.href} className={button.button} href={link.href}>
              {tx(link.label)} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </p>
      )}

      {next && next.slug !== project.slug && (
        <Link className={styles.next} to={to(`/work/${next.slug}`)}>
          <span className="t-meta">{t(ui.nextProject)} →</span>
          <span className="t-h2">{next.title}</span>
        </Link>
      )}
    </article>
  );
}
