// The final word. Revelation 21:1–5 — the eschatological promise that
// answers every dark statistic on the site. Placed after the
// ClosingEpigraph (Matthew 19:14) and before the page footer, so the
// reading experience ends on:
//
//   James 1:27     — the test  (landing)
//   [argument]
//   Matthew 19:14  — the invitation (ClosingEpigraph)
//   Rev 21:1–5     — the promise (this component)
//
// Visually distinct from the per-section Prayer cards — those are
// cream-parchment inside the argument; this is dark with a warm
// golden halo, like dawn breaking on the last page.

export function FinalBenediction() {
  return (
    <section className="benediction" aria-label="Final benediction">
      <div className="benediction-halo" aria-hidden />

      <div className="benediction-inner">
        <p className="benediction-ornament" aria-hidden>
          &#10047;
        </p>
        <p className="benediction-eyebrow">The Promise</p>

        <blockquote className="benediction-passage">
          <p>
            Then I saw a new heaven and a new earth, for the first
            heaven and the first earth had passed away, and the sea
            was no more.
          </p>
          <p>
            And I heard a loud voice from the throne saying,{' '}
            <em>
              &ldquo;Behold, the dwelling place of God is with man. He
              will dwell with them, and they will be his people, and
              God himself will be with them as their God.
            </em>
          </p>
          <p className="benediction-passage-emphasis">
            <em>
              He will wipe away every tear from their eyes, and death
              shall be no more, neither shall there be mourning, nor
              crying, nor pain anymore, for the former things have
              passed away.&rdquo;
            </em>
          </p>
        </blockquote>

        <div className="benediction-rule" aria-hidden />

        <p className="benediction-kicker">
          Behold, I am making all things new.
        </p>

        <p className="benediction-ref">
          Revelation 21&hairsp;:&hairsp;1&ndash;5
        </p>
      </div>
    </section>
  );
}
