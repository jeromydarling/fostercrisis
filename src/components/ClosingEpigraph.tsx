// Closing benediction — Jesus's words about children, placed as the
// final line of every non-landing experience. The argument opens on
// James 1:27 (the test — what you do for the orphan is what your
// religion actually is) and closes on Matthew 19:14 (the reply — the
// children are His, and the kingdom is theirs). The site sits in the
// distance between those two verses.

export function ClosingEpigraph() {
  return (
    <section className="closing-epigraph" aria-label="Closing benediction">
      <div className="closing-rule" aria-hidden />

      <blockquote className="closing-quote">
        Let the little children come to me
        <br className="closing-break" /> and do not hinder them,
        <br className="closing-break" /> for to such belongs the kingdom of heaven.
      </blockquote>

      <p className="closing-attr">
        <span className="closing-dash" aria-hidden>—</span>
        <span className="closing-speaker">Jesus</span>
        <span className="closing-sep" aria-hidden>·</span>
        <span className="closing-ref">Matthew 19:14 (ESV)</span>
      </p>
    </section>
  );
}
