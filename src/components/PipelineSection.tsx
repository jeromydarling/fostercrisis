// Part VII — The Pipeline.
//
// The closing data-dump before the Solution. American conservatism is
// obsessed with crime; the pipeline numbers are the receipt that the
// cheapest crime-reduction program in America is a spare bedroom, and
// the movement that preached law-and-order loudest refused to open it.
//
// Anchored to the foster_to_crime_pipeline.md doc in the repo root.

import { SourceDetails, type Citation } from './SourceDetails';
import { Prayer } from './Prayer';
import { PledgeCalendar } from './PledgeCalendar';
import { PRAYERS } from '../data/prayers';
import { EssayEpigraph } from './EssayEpigraph';
import { EPIGRAPHS } from '../data/epigraphs';

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

const CITATIONS: Citation[] = [
  {
    label: 'Bald, Chyn, Humlum & Stephenson (2022) — NBER / CEPR',
    note: '"~1 in 5 U.S. prison inmates is a former foster child." Also the causal finding that, for the marginal child, foster placement reduces arrest / conviction / incarceration vs. being left home.',
    href: 'https://cepr.org/voxeu/columns/foster-care-prison-pipeline',
    display: 'cepr.org',
  },
  {
    label: 'Chapin Hall Midwest Evaluation of the Adult Functioning of Former Foster Youth',
    note: '732 youth followed 17→26 across IL, IA, WI. Source for "70% arrested by 26" / "~81% of males" and the 55% pregnant by 19 / 71% by 21 figures.',
    href: 'https://ocfcpacourts.us/wp-content/uploads/2020/06/Midwest_Evaluation_of_the_Adult_Functioning_001015.pdf',
    display: 'Midwest Study PDF',
  },
  {
    label: 'Foster care, permanency, and risk of prison entry — NIH PMC',
    note: 'Prospective study of WA foster youth. Source for the prison-entry-by-exit-type table (Adopted 3.2% → Juvenile detention 48.2%).',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8975219/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Children and Youth Services Review (2025)',
    note: 'Longitudinal analysis — 42% lifetime incarceration rate by age 20.',
    href: 'https://www.sciencedirect.com/science/article/abs/pii/S0145213425002248',
    display: 'sciencedirect.com',
  },
  {
    label: 'American University — Criminal Law Practitioner',
    note: '"The Foster-Care-to-Prison Pipeline." Source for the 5+ placements → 90% criminal-legal involvement finding.',
    href: 'https://www.crimlawpractitioner.org/post/the-foster-care-to-prison-pipeline-a-road-to-incarceration',
    display: 'crimlawpractitioner.org',
  },
  {
    label: 'American Journal of Public Health — NIH PMC',
    note: 'Foster-care homelessness outcomes. 22–30% homeless during transition; 31–46% by 26.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3969135/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Dworsky & Courtney — Teen pregnancy among young women in foster care',
    note: 'NIH PMC. Foster females pregnant at 50% vs. 20% general population by 19.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3902972/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Iowa HHS — Human Trafficking Safety of Children in Foster Care',
    note: '~60% of child sex-trafficking victims recovered in 2013 FBI raid came from foster care or group homes.',
    href: 'https://hhs.iowa.gov/media/6797',
    display: 'hhs.iowa.gov',
  },
  {
    label: 'Loyola Children\'s Legal Rights Journal',
    note: 'Confirms FBI 60%, NCMEC 86%, and Connecticut 86-of-88 trafficking-victim figures.',
    href: 'https://lawecommons.luc.edu/cgi/viewcontent.cgi?article=1160&context=clrj',
    display: 'lawecommons.luc.edu',
  },
  {
    label: 'Annie E. Casey Foundation — Cost Avoidance',
    note: '~$250 billion over a decade from failed foster transitions; justice-system / lost-earnings / teen-parenthood breakdown.',
    href: 'https://www.aecf.org/resources/cost-avoidance-the-business-case-for-investing-in-youth-aging-out-of-foster',
    display: 'aecf.org',
  },
  {
    label: 'The Imprint — "Decriminalize young people who grew up in foster care"',
    note: 'Framing context on the transition-window arrest/incarceration numbers.',
    href: 'https://imprintnews.org/top-stories/decriminalize-young-people-who-grew-up-in-foster-care/246740',
    display: 'imprintnews.org',
  },
  {
    label: 'Casey Family Programs (2024) — pregnant-and-parenting foster youth',
    note: '"Continuity of involvement" — the intergenerational foster-removal cycle.',
    href: 'https://www.casey.org/pregnant-parenting-strategies/',
    display: 'casey.org',
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
      <EssayEpigraph epigraph={EPIGRAPHS.pipeline} />
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

      <Prayer prayer={PRAYERS.pipeline} />
      <PledgeCalendar />
      <SourceDetails citations={CITATIONS} />
    </section>
  );
}
