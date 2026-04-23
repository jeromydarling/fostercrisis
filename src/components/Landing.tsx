import { EpigraphSection } from './EpigraphSection';

type LandingMode = 'map' | 'essay' | 'stories' | 'news' | 'solution';

/** Landing page — the epigraph with five "choose your experience"
 *  cards in place of the default scroll cue.
 *
 *  Map       = the data argument.
 *  Essay     = the written argument.
 *  Stories   = the faces — Bzeek + waiting children.
 *  News      = the independent reporting on the system.
 *  Solution  = the call to action + state-by-state directory.
 */
export function Landing({
  onChoose,
}: {
  onChoose: (mode: LandingMode) => void;
}) {
  return (
    <EpigraphSection
      footer={
        <div className="landing-chooser">
          <button
            type="button"
            className="landing-card landing-card-map"
            onClick={() => onChoose('map')}
          >
            <span className="landing-eyebrow">View I</span>
            <span className="landing-title">The Map</span>
            <span className="landing-sub">
              Twelve chapters across the cartography of the crisis.
              Poverty, overdose, complicity. Click any state to drill in.
            </span>
            <span className="landing-cta">Enter the map →</span>
          </button>

          <button
            type="button"
            className="landing-card landing-card-essay"
            onClick={() => onChoose('essay')}
          >
            <span className="landing-eyebrow">View II</span>
            <span className="landing-title">The Essay</span>
            <span className="landing-sub">
              Eleven parts, one argument: the time and money American
              Christianity has, the cradle it stopped filling, and the
              revolution it helped write.
            </span>
            <span className="landing-cta">Read the essay →</span>
          </button>

          <button
            type="button"
            className="landing-card landing-card-stories"
            onClick={() => onChoose('stories')}
          >
            <span className="landing-eyebrow">View III</span>
            <span className="landing-title">Stories</span>
            <span className="landing-sub">
              Mohammad Bzeek. The Heart Gallery, Grant Me Hope,
              AdoptUSKids. The children waiting tonight, and the people
              who have chosen to show up for them.
            </span>
            <span className="landing-cta">See the stories →</span>
          </button>

          <button
            type="button"
            className="landing-card landing-card-news"
            onClick={() => onChoose('news')}
          >
            <span className="landing-eyebrow">View IV</span>
            <span className="landing-title">News</span>
            <span className="landing-sub">
              Independent reporting on American foster care — The
              Imprint, NCCPR, reform voices the mainstream press leaves
              unread.
            </span>
            <span className="landing-cta">Read the news →</span>
          </button>

          <button
            type="button"
            className="landing-card landing-card-solution"
            onClick={() => onChoose('solution')}
          >
            <span className="landing-eyebrow">View V</span>
            <span className="landing-title">The Solution</span>
            <span className="landing-sub">
              Stand in the gap. Every org already in the fight in your
              state — and the one question the argument was always
              building toward: <em>what are you going to do about it?</em>
            </span>
            <span className="landing-cta">Open the directory →</span>
          </button>
        </div>
      }
    />
  );
}
