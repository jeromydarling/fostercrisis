import { CHAPTERS } from '../data/chapters';

interface Props {
  index: number;
  onChange: (i: number) => void;
}

export function ChapterPanel({ index, onChange }: Props) {
  const chapter = CHAPTERS[index];
  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <p className="brand">THE FOSTER CRISIS</p>
        <p className="brand-sub">A map of American silence.</p>
      </header>

      <div className="chapter-body">
        <p className="eyebrow">{chapter.eyebrow}</p>
        <h1 className="chapter-title">{chapter.title}</h1>

        <div className="headline">
          <span className="headline-number">{chapter.headline}</span>
          <span className="headline-sub">{chapter.subline}</span>
        </div>

        <p className="chapter-text">{chapter.body}</p>

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
