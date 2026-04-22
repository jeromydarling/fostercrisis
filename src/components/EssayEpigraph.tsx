import type { Epigraph } from '../data/epigraphs';

interface Props {
  epigraph: Epigraph;
}

/** A quiet scripture opener at the top of each essay section.
 *  Italic serif, centered, with a small gold rule separating the
 *  verse from its reference. Bookends the prayer that closes the
 *  section — Scripture opens the argument, prayer closes it. */
export function EssayEpigraph({ epigraph }: Props) {
  return (
    <div className="essay-epigraph">
      <blockquote className="essay-epigraph-verse">
        <span className="essay-epigraph-mark" aria-hidden>
          &ldquo;
        </span>
        {epigraph.verse}
        <span className="essay-epigraph-mark" aria-hidden>
          &rdquo;
        </span>
      </blockquote>
      <div className="essay-epigraph-rule" aria-hidden />
      <p className="essay-epigraph-ref">{epigraph.reference}</p>
    </div>
  );
}
