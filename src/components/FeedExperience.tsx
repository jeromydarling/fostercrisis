import { FeedSection } from './FeedSection';

/** The Stories & News experience — standalone mode reachable from the
 *  main nav pill. Pulls what used to be buried in the Solution page's
 *  feed tabs (Bzeek, the state photolisting networks, The Imprint,
 *  NCCPR) up to first-class navigation. The Solution page is now
 *  reserved for the call to action + the state-by-state directory.
 */
export function FeedExperience() {
  return <FeedSection />;
}
