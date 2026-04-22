import { MirrorSection } from './MirrorSection';
import { EmptyCradleSection } from './EmptyCradleSection';
import { ConvergenceSection } from './ConvergenceSection';
import { TimelineSection } from './TimelineSection';
import { SubstitutionSection } from './SubstitutionSection';

/** The Essay experience — argument-oriented. Five long-form sections
 *  stacked, ending on the debt closer. */
export function EssayExperience() {
  return (
    <>
      <MirrorSection />
      <EmptyCradleSection />
      <ConvergenceSection />
      <TimelineSection />
      <SubstitutionSection />
    </>
  );
}
