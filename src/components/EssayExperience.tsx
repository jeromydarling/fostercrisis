import { MirrorSection } from './MirrorSection';
import { EmptyCradleSection } from './EmptyCradleSection';
import { ConvergenceSection } from './ConvergenceSection';
import { TimelineSection } from './TimelineSection';
import { SubstitutionSection } from './SubstitutionSection';
import { PipelineSection } from './PipelineSection';
import { WoundSection } from './WoundSection';
import { BodySection } from './BodySection';
import { ReceiptSection } from './ReceiptSection';
import { EssayNav } from './EssayNav';

/** The Essay experience — argument-oriented. Nine long-form sections
 *  stacked; the cascade Wound (VIII) → Pipeline (VII) → Score (IX)
 *  is followed by the statistical receipt at Part X. An
 *  auto-highlighting section nav sits sticky under the main header. */
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
      <ReceiptSection />
    </>
  );
}
