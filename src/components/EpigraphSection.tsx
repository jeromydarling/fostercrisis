import { type ReactNode } from 'react';

// Site epigraph — the single verse that frames everything below.
// Matthew 19:14 (ESV) · the moment the children's names reach the
// kingdom before they reach anyone else.
//
// If `footer` is provided, it replaces the default scroll cue.
// The Landing component uses that slot to render its "choose your
// experience" cards.

interface Props {
  footer?: ReactNode;
}

export function EpigraphSection({ footer }: Props = {}) {
  return (
    <section className="epigraph" aria-label="Epigraph">
      <div className="epigraph-rule epigraph-rule-top" aria-hidden />

      <blockquote className="epigraph-quote">
        Let the little children come to me
        <br className="epigraph-break" /> and do not hinder them,
        <br className="epigraph-break" /> for to such belongs the kingdom of heaven.
      </blockquote>

      <p className="epigraph-attr">
        <span className="epigraph-dash" aria-hidden>—</span>
        <span className="epigraph-speaker">Jesus</span>
        <span className="epigraph-sep" aria-hidden>·</span>
        <span className="epigraph-ref">Matthew 19:14 (ESV)</span>
      </p>

      <div className="epigraph-rule epigraph-rule-bot" aria-hidden />

      {footer ?? (
        <a className="epigraph-scroll" href="#map">
          <span className="epigraph-scroll-lbl">The map of those children's reality</span>
          <span className="epigraph-scroll-arrow" aria-hidden>↓</span>
        </a>
      )}
    </section>
  );
}
