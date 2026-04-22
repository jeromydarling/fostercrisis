import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  loadStateOrgs,
  ORG_TYPE_LABELS,
  type StateEntry,
  type StateOrgsFile,
} from '../data/stateOrgs';

interface Props {
  /** Optional state-code to deep-link / scroll to. Sourced from the
   *  map's selectedFips, converted upstream to a 2-letter code. */
  activeCode?: string | null;
}

export function StateOrgsDirectory({ activeCode }: Props) {
  const [data, setData] = useState<StateOrgsFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const cardsRef = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    loadStateOrgs().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  // Scroll & flash-highlight whichever state the viewer drilled into
  // on the map.
  useEffect(() => {
    if (!activeCode || !data) return;
    const el = cardsRef.current[activeCode];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeCode, data]);

  const entries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data)
      .sort(([, a], [, b]) => a.state.localeCompare(b.state))
      .filter(([code, entry]) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        if (code.toLowerCase().includes(q)) return true;
        if (entry.state.toLowerCase().includes(q)) return true;
        if (entry.orgs.some((o) => o.name.toLowerCase().includes(q))) return true;
        return false;
      });
  }, [data, query]);

  if (loading) {
    return <p className="dir-status">Loading the directory…</p>;
  }
  if (!data) {
    return (
      <p className="dir-status">
        The directory file hasn't been generated yet. It will populate on the
        next deploy.
      </p>
    );
  }

  return (
    <div className="dir">
      <div className="dir-controls">
        <label className="dir-search">
          <span className="dir-search-label">Filter</span>
          <input
            type="search"
            placeholder="State name, code, or org…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <p className="dir-count">
          {entries.length} {entries.length === 1 ? 'state' : 'states'}
        </p>
      </div>

      <ul className="dir-grid" role="list">
        {entries.map(([code, entry]) => (
          <StateCard
            key={code}
            code={code}
            entry={entry}
            active={code === activeCode}
            ref={(el) => {
              cardsRef.current[code] = el;
            }}
          />
        ))}
      </ul>
    </div>
  );
}

interface CardProps {
  code: string;
  entry: StateEntry;
  active: boolean;
}

const StateCard = forwardRef<HTMLLIElement, CardProps>(function StateCard(
  { code, entry, active },
  ref,
) {
  return (
    <li
      ref={ref}
      id={`state-${code}`}
      className={'dir-card' + (active ? ' is-active' : '')}
    >
      <header className="dir-card-head">
        <span className="dir-card-code">{code}</span>
        <h3 className="dir-card-state">{entry.state}</h3>
      </header>

      <ul className="dir-primary" role="list">
        {entry.photolisting && (
          <li>
            <span className="dir-primary-label">Photolisting</span>
            <a href={entry.photolisting.url} target="_blank" rel="noopener noreferrer">
              {entry.photolisting.name}
              <span className="dir-arrow" aria-hidden>↗</span>
            </a>
          </li>
        )}
        {entry.stateAgency && (
          <li>
            <span className="dir-primary-label">State agency</span>
            <a href={entry.stateAgency.url} target="_blank" rel="noopener noreferrer">
              {entry.stateAgency.name}
              {entry.stateAgency.pageName && (
                <span className="dir-primary-page"> · {entry.stateAgency.pageName}</span>
              )}
              <span className="dir-arrow" aria-hidden>↗</span>
            </a>
          </li>
        )}
        {entry.heartGallery &&
          entry.heartGallery.url !== entry.photolisting?.url && (
            <li>
              <span className="dir-primary-label">Heart Gallery</span>
              <a href={entry.heartGallery.url} target="_blank" rel="noopener noreferrer">
                {entry.heartGallery.name}
                {entry.heartGallery.isRegionalFallback && (
                  <span className="dir-primary-note"> (regional)</span>
                )}
                <span className="dir-arrow" aria-hidden>↗</span>
              </a>
            </li>
          )}
      </ul>

      {entry.orgs.length > 0 && (
        <div className="dir-orgs">
          <h4 className="dir-orgs-heading">In the fight</h4>
          <ul role="list">
            {entry.orgs.map((org) => (
              <li key={org.url} className={`dir-org dir-org-${org.type}`}>
                <div className="dir-org-head">
                  <a
                    className="dir-org-name"
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {org.name}
                    <span className="dir-arrow" aria-hidden>↗</span>
                  </a>
                  <span className="dir-org-chip">
                    {ORG_TYPE_LABELS[org.type] ?? org.type}
                  </span>
                </div>
                {org.description && <p className="dir-org-desc">{org.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
});
