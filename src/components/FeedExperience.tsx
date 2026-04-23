import { FeedSection, type FeedView } from './FeedSection';

interface Props {
  view: FeedView;
}

/** Wrapper around FeedSection. Stories and News are two separate
 *  top-level modes reachable from the main nav; they share a
 *  rendering layer. */
export function FeedExperience({ view }: Props) {
  return <FeedSection view={view} />;
}
