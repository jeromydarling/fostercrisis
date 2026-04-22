import { CHAPTERS, frameForState } from '../data/chapters';
import { STATE_INDEX } from '../data/states';

interface Props {
  index: number;
  onChange: (i: number) => void;
  selectedFips: string | null;
  onClearSelection: () => void;
}

export function ChapterPanel({ index, onChange, selectedFips, onClearSelection }: Props) {
  const chapter = CHAPTERS[index];
  const stateRow = selectedFips ? STATE_INDEX[selectedFips] : null;
  const framing = stateRow ? frameForState(chapter, stateRow) : null;

  const eyebrow = framing?.eyebrow ?? chapter.eyebrow;
  const title = framing?.title ?? chapter.title;
  const headline = framing?.headline ?? chapter.headline;
  const subline = framing?.subline ?? chapter.subline;
  const body = framing?.body ?? chapter.body;

  return (
    <aside className="sidebar">
      <div className="legend">
        <div className="legend-label">{chapter.unit}</div>
        <div
          className="legend-ramp"
          style={{
            background: `linear-gradient(90deg, ${chapter.ramp.join(', ')})`,
          }}
        />
        <div className="legend-ticks">
          <span>less</span>
          <span>more</span>
        </div>
        <p className="legend-source">{chapter.source}</p>
      </div>

      <header className="sidebar-header">
        {stateRow ? (
          <button className="back-btn" onClick={onClearSelection} type="button">
            <span aria-hidden>←</span> National view
          </button>
        ) : (
          <>
            <p className="brand">THE FOSTER CRISIS</p>
            <p className="brand-sub">A map of American silence.</p>
          </>
        )}
      </header>

      <div className="chapter-body">
        <p className="eyebrow">
          {eyebrow}
          {stateRow && <span className="eyebrow-state"> · {stateRow.name}</span>}
        </p>
        <h1 className="chapter-title">{title}</h1>

        <div className="headline">
          <span className="headline-number">{headline}</span>
          <span className="headline-sub">{subline}</span>
        </div>

        <p className="chapter-text">{body}</p>

        {stateRow && (
          <div className="state-cta">
            {stateRow.adoptionSite ? (
              <a
                className="state-cta-link"
                href={stateRow.adoptionSite}
                target="_blank"
                rel="noopener noreferrer"
              >
                Find a child waiting in {stateRow.name} →
              </a>
            ) : (
              <a
                className="state-cta-link muted"
                href={`https://www.adoptuskids.org/meet-the-children/search?state=${stateRow.code}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Meet {stateRow.name}'s waiting children (AdoptUSKids) →
              </a>
            )}
          </div>
        )}
      </div>

      <nav className="chapter-nav" aria-label="Chapters">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            className={'chapter-dot' + (i === index ? ' is-active' : '')}
            onClick={() => onChange(i)}
            aria-label={`${c.eyebrow}: ${c.title}`}
            aria-current={i === index ? 'step' : undefined}
          >
            <span className="chapter-dot-num">{c.number}</span>
            <span className="chapter-dot-title">{c.title}</span>
          </button>
        ))}
      </nav>

      <div className="chapter-controls">
        <button
          className="ctrl"
          onClick={() => onChange(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          ← Back
        </button>
        <span className="progress">
          {index + 1} / {CHAPTERS.length}
        </span>
        <button
          className="ctrl primary"
          onClick={() => onChange(Math.min(CHAPTERS.length - 1, index + 1))}
          disabled={index === CHAPTERS.length - 1}
        >
          Next →
        </button>
      </div>
    </aside>
  );
}
