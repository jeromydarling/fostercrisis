import { MirrorSection } from './MirrorSection';
import { EmptyCradleSection } from './EmptyCradleSection';
import { ConvergenceSection } from './ConvergenceSection';
import { TimelineSection } from './TimelineSection';
import { SubstitutionSection } from './SubstitutionSection';
import { PipelineSection } from './PipelineSection';
import { WoundSection } from './WoundSection';
import { BodySection } from './BodySection';
import { EssayNav } from './EssayNav';

/** The Essay experience — argument-oriented. Eight long-form sections
 *  stacked, ending on the biological cascade: Wound → Pipeline → Score.
 *  An auto-highlighting section nav sits sticky under the main header. */
export function EssayExperience() {
  return (
    <>
      <EssayNav />
      <MirrorSection />
      <EmptyCradleSection />
      <ConvergenceSection />
      <TimelineSection />
      <SubstitutionSection />
      <PipelineSection />
      <WoundSection />
      <BodySection />
    </>
  );
}
