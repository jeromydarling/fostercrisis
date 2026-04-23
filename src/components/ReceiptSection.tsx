// Part X — The Receipt.
//
// The statistical receipt on red-state foster-care geography. For nine
// sections this site has argued that the states that call themselves
// "pro-family" the loudest have the hungriest, highest-count, most
// forgotten foster populations. Part X supplies the math — Pearson r
// = +0.33 between Cook PVI and foster-care rate; red-state mean 41%
// higher than blue-state mean; 8 of 10 highest-rate states Republican.
//
// Anchored to church_mirror_section_13.md in the repo root.

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
}

const HEADLINE_STATS: Stat[] = [
  {
    figure: '+0.33',
    label: 'Pearson r',
    sub: 'between Cook Partisan Voting Index and foster-care rate. Weak-to-moderate. Not trivial. Real.',
  },
  {
    figure: '41%',
    label: 'higher in red states',
    sub: 'Red-state mean: 6.35 per 1,000 kids. Blue-state mean: 4.49. The gap is the size of a small state.',
  },
  {
    figure: '8 of 10',
    label: 'highest-rate states',
    sub: 'are Republican-leaning. The other two — Maine and Vermont — are rural New England, wrecked by fentanyl.',
  },
];

interface Row {
  rank: number;
  state: string;
  rate: number;
  pvi: string;
  lean: 'red' | 'purple' | 'blue';
}

const TOP: Row[] = [
  { rank: 1,  state: 'West Virginia',    rate: 16.9, pvi: '+21', lean: 'red' },
  { rank: 2,  state: 'Alaska',           rate: 13.9, pvi: '+6',  lean: 'red' },
  { rank: 3,  state: 'Montana',          rate: 11.2, pvi: '+10', lean: 'red' },
  { rank: 4,  state: 'Kansas',           rate:  8.6, pvi: '+8',  lean: 'red' },
  { rank: 5,  state: 'Missouri',         rate:  8.2, pvi: '+9',  lean: 'red' },
  { rank: 6,  state: 'Arizona',          rate:  7.8, pvi: '+2',  lean: 'purple' },
  { rank: 7,  state: 'Maine',            rate:  7.4, pvi: '−4',  lean: 'blue' },
  { rank: 8,  state: 'Indiana',          rate:  7.1, pvi: '+9',  lean: 'red' },
  { rank: 9,  state: 'Vermont',          rate:  7.1, pvi: '−17', lean: 'blue' },
  { rank: 10, state: 'Kentucky',         rate:  7.0, pvi: '+15', lean: 'red' },
];

const BOTTOM: Row[] = [
  { rank: 41, state: 'Idaho',            rate:  3.0, pvi: '+18', lean: 'red' },
  { rank: 41, state: 'New York',         rate:  3.0, pvi: '−8',  lean: 'blue' },
  { rank: 41, state: 'South Carolina',   rate:  3.0, pvi: '+8',  lean: 'red' },
  { rank: 44, state: 'Colorado',         rate:  2.9, pvi: '−6',  lean: 'blue' },
  { rank: 45, state: 'Louisiana',        rate:  2.6, pvi: '+11', lean: 'red' },
  { rank: 46, state: 'Maryland',         rate:  2.3, pvi: '−15', lean: 'blue' },
  { rank: 47, state: 'Virginia',         rate:  2.2, pvi: '−3',  lean: 'blue' },
  { rank: 48, state: 'Utah',             rate:  1.9, pvi: '+11', lean: 'red' },
  { rank: 49, state: 'Delaware',         rate:  1.8, pvi: '−8',  lean: 'blue' },
  { rank: 50, state: 'New Jersey',       rate:  1.4, pvi: '−4',  lean: 'blue' },
];

const CONFOUNDERS = [
  {
    label: 'Opioids',
    body:
      'West Virginia (16.9 per 1,000) and Kentucky (7.0) are the #1 and #10 foster-care-rate states in the country, and also top-tier for per-capita overdose deaths and neonatal abstinence syndrome. Vermont and Maine — the "blue" outliers in the top 10 — are the New England states hit hardest by fentanyl. What the top of the list actually tracks is parental substance-use disorder.',
  },
  {
    label: 'Child poverty',
    body:
      'Red states dominate the worst-off rankings for child poverty (Mississippi, Louisiana, West Virginia, Arkansas, Alabama, Kentucky). Child poverty is among the strongest predictors of foster-care entry in every peer-reviewed analysis, independent of politics. The pipeline is a poverty pipeline as much as anything else.',
  },
  {
    label: 'Removal-propensity policy',
    body:
      'Montana removes children at roughly 6× the national median rate. Next-door Idaho removes at a fraction of that — and both are deep-red rural states. Agency culture and judicial practice drive enormous state-to-state variation that partisan lean alone cannot explain.',
  },
];

const CITATIONS: Citation[] = [
  {
    label: 'Annie E. Casey Foundation / KIDS COUNT Data Center (2021)',
    note: 'State-level rate of children in foster care per 1,000 under age 18. The primary dataset for every rate figure in this section.',
    href: 'https://www.kvc.org/wp-content/uploads/2024/08/AECF-2021-Rate-of-children-in-foster-care-by-age-group-_-KIDS-COUNT-Data-Center.pdf',
    display: 'kvc.org · KIDS COUNT',
  },
  {
    label: 'KIDS COUNT Data Center — Children ages 0–17 in foster care',
    note: 'Live interactive data table; source for the state rankings.',
    href: 'https://datacenter.aecf.org/data/tables/6242-children-ages-birth-to-17-in-foster-care',
    display: 'datacenter.aecf.org',
  },
  {
    label: 'National Council for Adoption — AFCARS 2024 Update',
    note: 'State-level foster-care and adoption statistics used to cross-check the KIDS COUNT rates.',
    href: 'https://adoptioncouncil.org/article/foster-care-and-adoption-statistics/',
    display: 'adoptioncouncil.org',
  },
  {
    label: 'Christian Alliance for Orphans — US Foster Care Statistics 2026',
    note: 'Source for Utah\'s Latter-day Saint kinship-network context behind its 1.9-per-1,000 foster rate.',
    href: 'https://cafo.org/foster-care-statistics/',
    display: 'cafo.org',
  },
  {
    label: 'NCCPR — 2024 Rate-of-Removal Index',
    note: 'Documents the 6× variation in how readily states remove children per 1,000 in poverty. Source for the "removal-propensity policy" confounder.',
    href: 'https://nccpr.org/wp-content/uploads/2025/10/2024NCCPRRateifRemovalIndex.pdf',
    display: 'nccpr.org',
  },
  {
    label: 'World Population Review — Red States 2026 (Cook PVI 2024)',
    note: 'Source for state Cook Partisan Voting Index values used as the x-axis in the scatter plot.',
    href: 'https://worldpopulationreview.com/state-rankings/red-states',
    display: 'worldpopulationreview.com',
  },
  {
    label: '270toWin — 2024 Presidential Election Results',
    note: 'Cross-validates the Cook PVI state lean values.',
    href: 'https://www.270towin.com/2024-election',
    display: '270towin.com',
  },
  {
    label: 'USAFacts — How Red or Blue Is Your State',
    note: 'Partisan-lean summary referenced against the Cook PVI categorization.',
    href: 'https://usafacts.org/articles/how-red-or-blue-is-your-state/',
    display: 'usafacts.org',
  },
  {
    label: 'Brookings — What the Nation Told Us in 2024, State by State',
    note: 'Context on the state-level partisan shifts from 2020 to 2024.',
    href: 'https://www.brookings.edu/articles/what-the-nation-told-us-in-2024-state-by-state/',
    display: 'brookings.edu',
  },
  {
    label: 'Pew Research — Religious Landscape Study',
    note: 'State religiosity rankings used to pair "most Christian state" with "highest foster-care rate." West Virginia is #1 on both.',
    href: 'https://www.pewresearch.org/religion/religious-landscape-study/',
    display: 'pewresearch.org',
  },
  {
    label: 'Annie E. Casey Foundation — 2023 KIDS COUNT Data Book',
    note: 'Primary source for the state-level child well-being rankings cited in the "child poverty" confounder.',
    href: 'https://www.aecf.org/resources/2023-kids-count-data-book',
    display: 'aecf.org',
  },
  {
    label: 'CDC — Drug Overdose Death Rates',
    note: 'Per-capita overdose-death rate by state, cross-referenced with the foster-care top-10 to support the "opioids" confounder.',
    href: 'https://www.cdc.gov/drugoverdose/deaths/index.html',
    display: 'cdc.gov',
  },
  {
    label: 'NIH PMC — Neonatal Abstinence Syndrome Epidemiology',
    note: 'Primary evidence that opioid-exposed births concentrate in exactly the states that top the foster-care-rate list.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6677243/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
];

const SCATTER_URL = `${import.meta.env.BASE_URL}red-blue-foster-scatter.png`;

function RowCells({ row }: { row: Row }) {
  return (
    <>
      <span className="receipt-table-rank">#{row.rank}</span>
      <span className="receipt-table-state">{row.state}</span>
      <span className="receipt-table-rate">{row.rate.toFixed(1)}</span>
      <span className={'receipt-table-pvi receipt-table-pvi-' + row.lean}>
        {row.pvi}
      </span>
    </>
  );
}

export function ReceiptSection() {
  return (
    <section className="receipt-section" id="receipt">
      <EssayEpigraph epigraph={EPIGRAPHS.receipt} />

      <div className="receipt-hero">
        <p className="receipt-eyebrow">Part X · The Receipt</p>
        <h2 className="receipt-title">
          Same map. <span className="receipt-underline">Every time.</span>
        </h2>
        <p className="receipt-lede">
          For nine sections this site has argued that the states that call
          themselves <em>pro-family</em> the loudest have the hungriest,
          highest-count, most-forgotten foster populations.
          <br /><br />
          Part X supplies the statistical receipt — and the honesty to name
          what the receipt is <em>not</em>.
        </p>
      </div>

      {/* Three headline numbers */}
      <div className="receipt-headline-stats">
        <h3 className="receipt-heading">The correlation</h3>
        <ul className="receipt-stats-grid" role="list">
          {HEADLINE_STATS.map((s) => (
            <li key={s.label} className="receipt-stat">
              <span className="receipt-stat-figure">{s.figure}</span>
              <span className="receipt-stat-label">{s.label}</span>
              <span className="receipt-stat-sub">{s.sub}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scatter plot — the full 50-state chart */}
      <div className="receipt-scatter">
        <figure>
          <img
            src={SCATTER_URL}
            alt="Scatter plot of U.S. state foster-care rate (KIDS COUNT 2021) against Cook Partisan Voting Index 2024. Best-fit line slopes up and to the right; Pearson r = +0.33. West Virginia at the extreme top right."
            loading="lazy"
          />
          <figcaption>
            Each dot is a state. Vertical: children in foster care per
            1,000 kids under 18 (KIDS COUNT 2021). Horizontal: 2024 Cook
            PVI &mdash; negative is Democratic lean, positive is
            Republican lean. Best-fit slope: <strong>+0.10</strong>{' '}
            foster-care cases per 1,000 kids per additional PVI point of
            Republican lean. The slope is up and to the right. The
            spread is wide.
          </figcaption>
        </figure>
      </div>

      {/* Top 10 / Bottom 10 tables side-by-side */}
      <div className="receipt-tables">
        <h3 className="receipt-heading">Top ten · bottom ten</h3>
        <p className="receipt-sub">
          Eight of the ten highest-rate states are Republican-leaning.
          And yet — Utah (PVI +11, 1.9 per 1,000) and Louisiana (PVI +11,
          2.6) sit in the <em>lowest</em> ten. The red/blue story is not
          clean at either tail. LDS kinship networks in Utah and aggressive
          Families-First policy in Louisiana both prove the geography is
          not destiny.
        </p>
        <div className="receipt-tables-grid">
          <div className="receipt-table">
            <p className="receipt-table-caption">Highest foster-care rate</p>
            <ul role="list">
              {TOP.map((r, i) => (
                <li key={r.state + i} className="receipt-table-row">
                  <RowCells row={r} />
                </li>
              ))}
            </ul>
          </div>
          <div className="receipt-table">
            <p className="receipt-table-caption">Lowest foster-care rate</p>
            <ul role="list">
              {BOTTOM.map((r, i) => (
                <li key={r.state + i} className="receipt-table-row">
                  <RowCells row={r} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="receipt-table-legend">
          <span className="receipt-table-pvi receipt-table-pvi-red">+N</span>{' '}
          Republican lean &middot;{' '}
          <span className="receipt-table-pvi receipt-table-pvi-purple">±N</span>{' '}
          purple &middot;{' '}
          <span className="receipt-table-pvi receipt-table-pvi-blue">−N</span>{' '}
          Democratic lean
        </p>
      </div>

      {/* Three confounders — honest accounting */}
      <div className="receipt-confounders">
        <h3 className="receipt-heading">
          What&rsquo;s really driving the correlation
        </h3>
        <p className="receipt-sub">
          The +0.33 is real. But foster-care rate is not a straightforward
          function of voting pattern. Three variables dominate the variance,
          and all three happen to co-vary with conservative rural geography.
        </p>
        <ul className="receipt-confounders-grid" role="list">
          {CONFOUNDERS.map((c) => (
            <li key={c.label} className="receipt-confounder">
              <span className="receipt-confounder-label">{c.label}</span>
              <p className="receipt-confounder-body">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* The two readings — charitable / uncharitable */}
      <div className="receipt-readings">
        <h3 className="receipt-heading">You can read the pattern two ways.</h3>
        <div className="receipt-readings-grid">
          <div className="receipt-reading receipt-reading-charitable">
            <span className="receipt-reading-tag">The charitable reading</span>
            <p className="receipt-reading-body">
              Red states remove at higher rates because they have more
              exposure to the actual drivers &mdash; opioids, child
              poverty, rural isolation &mdash; and their agencies sometimes
              err toward removal. The church in those states did not cause
              the entries. It is <em>adjacent</em> to them.
            </p>
          </div>
          <div className="receipt-reading receipt-reading-uncharitable">
            <span className="receipt-reading-tag">The uncharitable reading</span>
            <p className="receipt-reading-body">
              The church in those states had every tool &mdash; Sunday
              attendance, extended-family networks, the longest-running
              pro-life infrastructure in the country &mdash; and still
              produced the highest per-capita rate of children sleeping
              away from home in America. The Latter-day Saints did it in
              Utah (1.9 per 1,000, effectively the lowest rate in the
              country). Everyone else did not.
            </p>
          </div>
        </div>
        <p className="receipt-readings-note">
          Both readings can be true. The second one is the one the data
          supports most honestly.
        </p>
      </div>

      {/* Indictment closer */}
      <div className="receipt-indictment">
        <p className="receipt-indictment-eyebrow">The indictment</p>
        <blockquote className="receipt-indictment-quote">
          <span className="receipt-indictment-line">
            The red-state church did not cause the foster crisis.
          </span>
          <span className="receipt-indictment-line">
            It lives inside it.
          </span>
          <span className="receipt-indictment-line receipt-indictment-kicker">
            A disproportionate share of the 329,000 beds is within three
            miles of a biblically faithful pulpit.
          </span>
        </blockquote>
      </div>

      <Prayer prayer={PRAYERS.receipt} />
      <PledgeCalendar />
      <SourceDetails citations={CITATIONS} />
    </section>
  );
}
