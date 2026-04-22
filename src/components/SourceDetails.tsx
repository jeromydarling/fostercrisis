/** A reusable collapsible citation block rendered at the bottom of
 *  each essay section. Closed by default so it doesn't steal vertical
 *  space; opens to reveal full provenance for the claims made above.
 *
 *  Each citation is: a bold short label + an optional plain-text note
 *  + a link. The note carries the real citation (authors, year, journal).
 */
export interface Citation {
  label: string;
  note?: string;
  href: string;
  display?: string;
}

interface Props {
  citations: Citation[];
}

export function SourceDetails({ citations }: Props) {
  if (!citations.length) return null;
  return (
    <details className="section-sources">
      <summary>
        <span className="section-sources-label">Sources</span>
        <span className="section-sources-count">
          ({citations.length} {citations.length === 1 ? 'citation' : 'citations'})
        </span>
      </summary>
      <ul>
        {citations.map((c, i) => (
          <li key={i}>
            <strong>{c.label}</strong>
            {c.note ? <> &mdash; {c.note}</> : null}{' '}
            <a href={c.href} target="_blank" rel="noopener noreferrer">
              {c.display ?? 'link'}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
