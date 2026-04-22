import { type ReactNode } from 'react';

// Site epigraph — the verse that frames every argument below.
//
// James 1:27 (ESV). The single sentence the Bible uses to define
// 'pure religion' names one test and one alone: what you do for the
// orphan. The single greatest measure of a nation or a belief system
// is how it treats its children. The foster crisis is an indictment
// of American Christianity.
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
        Religion that is pure and undefiled before God the Father is this:
        <br className="epigraph-break" />
        <strong className="epigraph-emph"> to visit orphans and widows in their affliction,</strong>
        <br className="epigraph-break" />
        and to keep oneself unstained from the world.
      </blockquote>

      <p className="epigraph-attr">
        <span className="epigraph-dash" aria-hidden>—</span>
        <span className="epigraph-ref">James 1:27 (ESV)</span>
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
