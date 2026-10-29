import { profile } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLocale } from '../hooks/useLocale';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Experience } from '../sections/Experience';
import { Hero } from '../sections/Hero';
import { SelectedWork } from '../sections/SelectedWork';
import { Skills } from '../sections/Skills';

export function HomePage() {
  const { t } = useLocale();
  useDocumentTitle(`${profile.name.full} — ${t(profile.role)}`);

  return (
    <>
      <Hero />
      <SelectedWork />
      <About />
      <Skills />
      <Experience />
      <Contact />
    </>
  );
}
