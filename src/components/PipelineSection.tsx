// Part VII — The Pipeline.
//
// The closing data-dump before the Solution. American conservatism is
// obsessed with crime; the pipeline numbers are the receipt that the
// cheapest crime-reduction program in America is a spare bedroom, and
// the movement that preached law-and-order loudest refused to open it.
//
// Anchored to the foster_to_crime_pipeline.md doc in the repo root.

interface Stat {
  figure: string;
  label: string;
  sub: string;
  source: string;
}

const HEADLINE_STATS: Stat[] = [
  {
    figure: '1 in 5',
    label: 'U.S. prison inmates',
    sub: 'is a former foster child. ~25× overrepresentation.',
    source: 'BJS via CEPR 2022',
  },
  {
    figure: '70%',
    label: 'arrested by 26',
    sub: 'of former foster youth. For males, nearly 81%.',
    source: 'Chapin Hall Midwest Study',
  },
  {
    figure: '60%',
    label: 'of trafficking victims',
    sub: 'recovered in a 2013 FBI multi-city raid came from foster or group homes.',
    source: 'Iowa HHS · Loyola CLRJ',
  },
  {
    figure: '71%',
    label: 'pregnant by 21',
    sub: 'of young women who age out. Double the national rate.',
    source: 'Midwest Evaluation via FosterVA',
  },
  {
    figure: '42%',
    label: 'incarcerated by 20',
    sub: 'lifetime incarceration rate for foster youth.',
    source: 'Children & Youth Services Review, 2025',
  },
  {
    figure: '$250B',
    label: 'taxpayer bill',
    sub: 'over 10 years from ~300,000 failed transitions.',
    source: 'Annie E. Casey Foundation',
  },
];

const EXITS = [
  { label: 'Adopted', pct: 3.2 },
  { label: 'Guardianship / kin', pct: 7.0 },
  { label: 'Aged out', pct: 8.6 },
  { label: 'Reunified with family', pct: 13.2 },
  { label: 'AWOL / runaway', pct: 19.1 },
  { label: 'Exited to juvenile detention', pct: 48.2 },
];

export function PipelineSection() {
  return (
    <section className="pipe-section" id="pipeline">
      <div className="pipe-hero">
        <p className="pipe-eyebrow">Part VII · The Pipeline</p>
        <h2 className="pipe-title">
          American conservatism is <span className="pipe-underline">obsessed</span> with crime.
        </h2>
        <p className="pipe-lede">
          It won't do the easiest thing to end it.
          <br /><br />
          <strong>
            Raise the children who become the criminals.
          </strong>
          <br /><br />
          American foster care isn't a safety net. For hundreds of
          thousands of children it's a conveyor belt — into prison,
          into homelessness, into sex trafficking, into teen
          pregnancy, into the next generation of foster kids. The
          numbers below are not projections. They are the receipt.
        </p>
      </div>

      {/* Six headline stats in a responsive grid */}
      <div className="pipe-headline-stats">
        <h3 className="pipe-heading">The six numbers</h3>
        <ul className="pipe-stats-grid" role="list">
          {HEADLINE_STATS.map((s) => (
            <li key={s.label} className="pipe-stat">
              <span className="pipe-stat-figure">{s.figure}</span>
              <span className="pipe-stat-label">{s.label}</span>
              <span className="pipe-stat-sub">{s.sub}</span>
              <span className="pipe-stat-source">{s.source}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* The exit-type ladder — prison entry by how you leave care */}
      <div className="pipe-exits">
        <h3 className="pipe-heading">
          How you leave care decides whether you go to prison.
        </h3>
        <p className="pipe-sub">
          A prospective study of Washington State foster youth tracked
          prison entry between ages 18 and 23 by how each child exited
          the system. The permanency a child gets is the permanency a
          child keeps.
        </p>
        <ul className="pipe-exits-list" role="list">
          {EXITS.map((e) => (
            <li key={e.label} className="pipe-exit">
              <span className="pipe-exit-label">{e.label}</span>
              <div className="pipe-exit-bar-track">
                <div
                  className="pipe-exit-bar-fill"
                  style={{ width: `${(e.pct / 50) * 100}%` }}
                  aria-hidden
                />
              </div>
              <span className="pipe-exit-pct">{e.pct.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
        <p className="pipe-exits-source">
          Source: Foster care, permanency, and risk of prison entry — NIH PMC,
          Journal of Research in Crime and Delinquency.
        </p>
      </div>

      {/* The causal twist — the NBER / CEPR 2022 finding that closes
          the argument: for the marginal child, foster care REDUCES
          crime risk versus being left home. */}
      <div className="pipe-causal">
        <h3 className="pipe-heading">The twist that closes it.</h3>
        <p className="pipe-causal-body">
          A 2022 quasi-experimental study used near-random assignment
          of child-welfare investigators as a natural experiment. For
          the <em>marginal</em> child — one whose placement depended
          on investigator strictness — foster placement actually{' '}
          <strong>reduced</strong> arrest by age 19 from 37% to 12%,
          conviction from 35% to 7%, and incarceration from 26% to
          5%.
        </p>
        <ol className="pipe-causal-chain">
          <li>
            Foster youth are catastrophically overrepresented in
            prison. Observational fact.
          </li>
          <li>
            For the marginal child, foster care <em>reduces</em> crime
            risk versus being left home.
          </li>
          <li>
            <strong>
              Which means the homes these children were removed from
              were even worse than the system that fails them.
            </strong>
          </li>
          <li>
            American Christianity let both exist. There is no
            interpretation of the data under which the American
            Church comes out looking responsible.
          </li>
        </ol>
        <p className="pipe-causal-source">
          Source: Bald, Chyn, Humlum &amp; Stephenson (2022), NBER /
          CEPR.
        </p>
      </div>

      {/* The indictment — sits as the section's closer. */}
      <div className="pipe-indictment">
        <p className="pipe-indictment-eyebrow">The indictment</p>
        <blockquote className="pipe-indictment-quote">
          <span className="pipe-indictment-line">
            The cheapest crime-reduction program in America is a spare
            bedroom.
          </span>
          <span className="pipe-indictment-line">
            The loudest voices against crime in America come from the
            pews.
          </span>
          <span className="pipe-indictment-line pipe-indictment-kicker">
            They have never met.
          </span>
        </blockquote>
      </div>
    </section>
  );
}
