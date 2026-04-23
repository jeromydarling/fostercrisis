import { MirrorSection } from './MirrorSection';
import { EmptyCradleSection } from './EmptyCradleSection';
import { ConvergenceSection } from './ConvergenceSection';
import { TimelineSection } from './TimelineSection';
import { SubstitutionSection } from './SubstitutionSection';
import { PipelineSection } from './PipelineSection';
import { WoundSection } from './WoundSection';
import { BodySection } from './BodySection';
import { ReceiptSection } from './ReceiptSection';
import { GraveSection } from './GraveSection';
import { EssayNav } from './EssayNav';

/** The Essay experience — argument-oriented. Ten long-form sections
 *  stacked; Pipeline/Wound/Score (VII–IX) name the harm, Receipt (X)
 *  and Grave (XI) are the two receipts — geographic and mortal. An
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
      <GraveSection />
    </>
  );
}
