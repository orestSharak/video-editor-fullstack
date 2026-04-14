import { Placeholder } from './Placeholder';
import { InfoBox } from './InfoBox';
import { NotesSection } from './NotesSection';

export function Preview() {
  return (
    <section className="flex justify-between px-6 items-start">
      <NotesSection />
      <Placeholder />
      <InfoBox />
    </section>
  );
}
