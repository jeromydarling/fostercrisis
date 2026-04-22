export type Mode = 'landing' | 'map' | 'essay';

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

/** Persistent slim header. Logo returns to the landing page; the
 *  Map / Essay pill switches between the two experiences without
 *  ever dropping the visitor back to the home screen. */
export function ModeSwitcher({ mode, onChange }: Props) {
  return (
    <header className="mode-switcher" role="banner">
      <button
        type="button"
        className="mode-brand"
        onClick={() => onChange('landing')}
        aria-label="fostercrisis.com — return to the home page"
      >
        <span className="mode-brand-mark" aria-hidden>
          {/* Gold house + red empty doorway, matching the favicon */}
          <svg viewBox="0 0 32 32" width="18" height="18">
            <rect width="32" height="32" rx="4" fill="transparent" />
            <path
              d="M5.5 14.5 L16 5.5 L26.5 14.5 L26.5 26 Q26.5 27 25.5 27 L6.5 27 Q5.5 27 5.5 26 Z"
              fill="none"
              stroke="#f7e26b"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <rect x="13.5" y="18" width="5" height="9" rx="0.5" fill="#ff5252" opacity="0.85" />
          </svg>
        </span>
        <span className="mode-brand-name">fostercrisis.com</span>
      </button>

      <div className="mode-pill" role="tablist" aria-label="Experience">
        <button
          role="tab"
          aria-selected={mode === 'map'}
          className={'mode-tab' + (mode === 'map' ? ' is-active' : '')}
          onClick={() => onChange('map')}
        >
          The Map
        </button>
        <button
          role="tab"
          aria-selected={mode === 'essay'}
          className={'mode-tab' + (mode === 'essay' ? ' is-active' : '')}
          onClick={() => onChange('essay')}
        >
          The Essay
        </button>
      </div>
    </header>
  );
}
