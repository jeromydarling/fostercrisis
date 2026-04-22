import { EpigraphSection } from './EpigraphSection';

/** Landing page — the epigraph with two "choose your experience"
 *  cards in place of the default scroll cue. */
export function Landing({ onChoose }: { onChoose: (mode: 'map' | 'essay') => void }) {
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
              Every state; every county of poverty, overdose, and
              complicity. Click any state to drill in.
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
              Five parts, one argument: the time and money American
              Christianity already has, the fertility cradle it stopped
              filling, the sexual revolution it never fought, and what
              it built instead of a home.
            </span>
            <span className="landing-cta">Read the essay →</span>
          </button>
        </div>
      }
    />
  );
}
