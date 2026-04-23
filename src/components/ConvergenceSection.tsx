// Section IV — The Convergence.
//
// The single clearest thing this whole site argues. The two collapses —

import { SourceDetails, type Citation } from './SourceDetails';
import { Prayer } from './Prayer';
import { PledgeCalendar } from './PledgeCalendar';
import { PRAYERS } from '../data/prayers';
import { EssayEpigraph } from './EssayEpigraph';
import { EPIGRAPHS } from '../data/epigraphs';

const CITATIONS: Citation[] = [
  {
    label: 'CDC NVSS — Marriage and divorce',
    note: 'Crude divorce rate per 1,000 population, 1940–present. Some states (CA, HI, IN, MN, NM, OK) don\'t report to NVSS — those values are state vital-records estimates.',
    href: 'https://www.cdc.gov/nchs/nvss/marriage-divorce.htm',
    display: 'cdc.gov/nchs/nvss',
  },
  {
    label: 'CDC NCHS — Births to unmarried women, NVSR 72-1',
    note: 'Share of births to unmarried women by state, 2022. Source for the unwed-births leg of the revolution chart.',
    href: 'https://www.cdc.gov/nchs/data/nvsr/nvsr72/nvsr72-01.pdf',
    display: 'cdc.gov/nchs/nvsr',
  },
  {
    label: 'Guttmacher Institute — U.S. abortion statistics',
    note: 'Year-by-year abortion totals, 1973–2024, used in the cumulative abortion line on the convergence chart.',
    href: 'https://www.guttmacher.org/united-states/abortion',
    display: 'guttmacher.org',
  },
  {
    label: 'AFCARS — Children in foster care, 1980–present',
    note: 'Historical foster-care census used as the downstream line of the convergence chart.',
    href: 'https://www.acf.hhs.gov/cb/data-research/adoption-fostercare',
    display: 'acf.hhs.gov',
  },
  {
    label: 'CDC / NIDA — Opioid overdose deaths',
    note: 'Annual overdose-death totals, 1999–present. Source for the addiction leg of the convergence chart.',
    href: 'https://www.cdc.gov/drugoverdose/',
    display: 'cdc.gov',
  },
  {
    label: 'Pornhub Insights — State of the Union (2014–2019)',
    note: 'Average session duration by U.S. state, year-over-year rankings. The authoritative public source for what the telemetry actually shows.',
    href: 'https://www.pornhub.com/insights/united-states',
    display: 'pornhub.com/insights',
  },
];
// Christian fertility down, foster care up — are not coincidences. They
// are the same event, seen from two sides of the same door. They begin
// in the same decade (1960–1975), for the same reasons, with the same
// people saying yes to the same lie. American Christianity's guilt here
// is not identical to the playboys' or the lobbyists' — it is heavier,
// because it was the institution that had moral authority and declined
// to spend it.

// Events on the 1959–1980 break. Rendered as a vertical timeline.
const TIMELINE = [
  { year: '1959', title: 'Billy Graham shrugs at the Pill',
    body: 'The leading evangelical of the century tells reporters he sees "nothing in the Bible which would forbid birth control." Protestant cover for contraception is now in place.' },
  { year: '1960', title: 'FDA approves the Pill (May 9)',
    body: 'For the first time in human history, sex can be reliably severed from procreation, unilaterally, by the woman.' },
  { year: '1962', title: '1.2 million American women on the Pill',
    body: 'Adoption of the technology outruns any theological deliberation.' },
  { year: '1965', title: 'Griswold v. Connecticut',
    body: 'Supreme Court legalizes contraception for married couples. The last legal brake is gone.' },
  { year: '1968', title: 'Humanae Vitae',
    body: 'Pope Paul VI reaffirms Catholic opposition to contraception. Not a single major Protestant voice joins him. American Protestantism is already gone.' },
  { year: '1969', title: 'California passes first no-fault divorce law',
    body: 'Reagan signs it. Marriage becomes legally dissolvable at will. By 1985, every state follows.' },
  { year: '1970', title: 'PC(USA) endorses "abortion on demand"',
    body: 'The Presbyterian Church (U.S.A.) publishes a report endorsing "mass contraceptive techniques," homosexuality, and "low-cost abortion on demand." Mainline Protestantism departs 1,900 years of sexual ethics in a single document.' },
  { year: '1971', title: 'The SBC votes for legal abortion',
    body: 'The Southern Baptist Convention passes a resolution calling for legalized abortion in cases of rape, incest, fetal deformity, and maternal health — two years before Roe.' },
  { year: '1972', title: 'Eisenstadt v. Baird',
    body: 'Contraception rights extended to unmarried people. The Pill is no longer a marriage tool.' },
  { year: '1973', title: 'Roe v. Wade',
    body: 'Abortion legalized nationwide. Most evangelical leaders initially call it a "Catholic issue" and stay quiet for five to seven years.' },
  { year: '1977', title: 'UCC celebrates "freedom, sensuousness, and androgyny"',
    body: 'United Church of Christ declares access to contraception and abortion matters of justice. Mainline capitulation is complete.' },
  { year: '1980', title: 'SBC finally opposes abortion',
    body: 'Nine years after calling for it. Seven years after Roe. Evangelical political pro-life movement begins a full generation too late to prevent the cultural shift.' },
];

// Five convergent curves, 1950→2024. Each normalized to its own scale
// (0–1) against the series maximum so all five lines fit the same chart.
// Raw values stored for the tooltips / legend numbers.
interface CurvePoint { year: number; value: number }
interface Curve { id: string; label: string; color: string; unit: string; points: CurvePoint[] }

const CURVES: Curve[] = [
  {
    id: 'tfr',
    label: 'Christian fertility (children per woman)',
    color: '#f7e26b',
    unit: '',
    points: [
      { year: 1950, value: 3.7 },
      { year: 1960, value: 3.6 },
      { year: 1970, value: 2.89 },
      { year: 1980, value: 2.5 },
      { year: 1990, value: 2.4 },
      { year: 2000, value: 2.3 },
      { year: 2010, value: 2.2 },
      { year: 2024, value: 1.9 },
    ],
  },
  {
    id: 'foster',
    label: 'Children in U.S. foster care (thousands)',
    color: '#ff5252',
    unit: 'K',
    points: [
      { year: 1950, value: 250 },
      { year: 1960, value: 275 },
      { year: 1970, value: 300 },
      { year: 1980, value: 300 },
      { year: 1990, value: 400 },
      { year: 2000, value: 567 },
      { year: 2010, value: 400 },
      { year: 2024, value: 329 },
    ],
  },
  {
    id: 'unwed',
    label: 'Births to unmarried women (% of U.S. births)',
    color: '#ffb347',
    unit: '%',
    points: [
      { year: 1950, value: 3 },
      { year: 1960, value: 5 },
      { year: 1970, value: 11 },
      { year: 1980, value: 18 },
      { year: 1990, value: 28 },
      { year: 2000, value: 33 },
      { year: 2010, value: 41 },
      { year: 2024, value: 40 },
    ],
  },
  {
    id: 'divorce',
    label: 'U.S. divorce rate (per 1,000 population)',
    color: '#c43a5b',
    unit: '',
    points: [
      { year: 1950, value: 2.2 },
      { year: 1960, value: 2.2 },
      { year: 1970, value: 3.5 },
      { year: 1980, value: 5.2 },
      { year: 1990, value: 4.7 },
      { year: 2000, value: 4.0 },
      { year: 2010, value: 3.6 },
      { year: 2024, value: 2.9 },
    ],
  },
  {
    id: 'abortion',
    label: 'U.S. abortions per year (thousands)',
    color: '#8b2440',
    unit: 'K',
    points: [
      // Pre-Roe estimates are necessarily imprecise (illegal procedures
      // weren't counted), but Guttmacher retroactively models
      // 200–500K/yr for 1950–1970. Post-Roe figures are CDC + Guttmacher.
      { year: 1950, value: 200 },
      { year: 1960, value: 200 },
      { year: 1970, value: 400 },
      { year: 1973, value: 745 },
      { year: 1980, value: 1554 },
      { year: 1990, value: 1609 },
      { year: 2000, value: 1313 },
      { year: 2010, value: 1102 },
      { year: 2020, value: 930 },
      { year: 2024, value: 1126 },
    ],
  },
];

// SVG dimensions + layout.
const CHART_W = 820;
const CHART_H = 340;
const PADDING = { top: 24, right: 24, bottom: 44, left: 24 };
const X_MIN = 1950;
const X_MAX = 2024;

function xScale(year: number) {
  const r = (year - X_MIN) / (X_MAX - X_MIN);
  return PADDING.left + r * (CHART_W - PADDING.left - PADDING.right);
}

function yScale(value: number, curve: Curve) {
  const max = Math.max(...curve.points.map((p) => p.value));
  const min = Math.min(...curve.points.map((p) => p.value));
  const span = max - min || 1;
  const r = (value - min) / span;
  // Invert so higher values go up on screen.
  return PADDING.top + (1 - r) * (CHART_H - PADDING.top - PADDING.bottom);
}

function pathFor(curve: Curve) {
  return curve.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.year).toFixed(1)} ${yScale(p.value, curve).toFixed(1)}`)
    .join(' ');
}

// Three lies + their cost.
const LIES = [
  {
    num: 'I',
    lie: 'Sex can be severed from procreation without cost.',
    body: 'Protestants accepted this first, often enthusiastically. Billy Graham in 1959: "nothing in the Bible would forbid birth control." By 1965 the Pill was the most common contraceptive among married Protestant women. Evangelical sex manuals of the 1970s celebrated contraception as marriage-strengthening. The theology of the body collapsed before the cultural battle was even joined.',
  },
  {
    num: 'II',
    lie: 'Marriage is a contract that can be dissolved at will.',
    body: 'Christians divorced at Baby-Boom-peak rates. By 1980, conservative Protestant divorce rates were roughly equivalent to the general population\'s. Evangelicals, the supposed defenders of the family, produced no coherent theology of marital permanence adequate to the no-fault era — only a culture-war rhetoric that could not explain why the pews looked identical to the country club.',
  },
  {
    num: 'III',
    lie: 'Children are a lifestyle choice, not a covenant gift.',
    body: 'The moment Psalm 127 stopped being read as prescriptive — "blessed is the man whose quiver is full, if he wants it to be" — American Christianity ceased to be a culture of children. It became a culture of adults who occasionally had children, up to 2.2.',
  },
];

const BODY_COUNT = [
  { n: '1.2 M', label: 'out-of-wedlock births in 1990 alone' },
  { n: '40%', label: 'of U.S. children now born outside marriage' },
  { n: '368 K', label: 'in foster care on any given night' },
  { n: '700 K', label: 'cycling through foster care in a year' },
  { n: '23 K', label: 'who age out every year with no family' },
  { n: '70,418', label: 'legally free, waiting for a forever family' },
];

export function ConvergenceSection() {
  return (
    <section className="convergence-section" id="convergence">
      <EssayEpigraph epigraph={EPIGRAPHS.convergence} />
      <div className="conv-hero">
        <p className="conv-eyebrow">Part IV · The Convergence</p>
        <h2 className="conv-title">
          The two collapses are the same event,<br />
          seen from two sides of the same door.
        </h2>
        <p className="conv-lede">
          Christian fertility down, foster care up. Out-of-wedlock births
          from <strong>5%</strong> to <strong>40%</strong>. Divorce
          doubled in twenty years. Abortion crossed a million a year
          within five years of <em>Roe</em>. All five curves bend in
          <strong> 1960–1975</strong>, for the same reason, because the
          same people said yes to the same lie.
          <br /><br />
          <em>American Christianity's guilt is not identical to the
          playboys' or the lobbyists'. It is heavier. It was the
          institution with the greatest moral authority in mid-century
          America — and in the decade that mattered most, it either
          blessed the revolution, adopted it in private, or failed to
          oppose it in public until the damage was already generational.</em>
        </p>
      </div>

      {/* The five-curves chart. One SVG, five normalized lines, shaded
          break-window 1960-1975 behind them. */}
      <div className="conv-chart-wrap">
        <h3 className="conv-chart-heading">Five lines. One break window. Fifteen years.</h3>
        <p className="conv-chart-sub">
          Each line is plotted on its own scale — the point is not the
          height, but the shape. All five bend in the same shaded
          fifteen-year window.
        </p>
        <div className="conv-chart-scroll">
          <svg
            className="conv-chart"
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Five convergent curves across 1950-2024"
          >
            {/* The shaded "break window" 1960-1975. */}
            <rect
              x={xScale(1960)}
              y={PADDING.top}
              width={xScale(1975) - xScale(1960)}
              height={CHART_H - PADDING.top - PADDING.bottom}
              fill="rgba(247, 226, 107, 0.06)"
              stroke="rgba(247, 226, 107, 0.25)"
              strokeDasharray="3 3"
            />
            <text
              x={(xScale(1960) + xScale(1975)) / 2}
              y={PADDING.top + 14}
              textAnchor="middle"
              fontFamily="var(--ff-mono)"
              fontSize="10"
              fill="#f7e26b"
              letterSpacing="0.12em"
            >
              THE BREAK · 1960 – 1975
            </text>

            {/* Decade gridlines on the x-axis. */}
            {[1960, 1970, 1980, 1990, 2000, 2010, 2020].map((y) => (
              <g key={y}>
                <line
                  x1={xScale(y)}
                  y1={PADDING.top}
                  x2={xScale(y)}
                  y2={CHART_H - PADDING.bottom}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                />
                <text
                  x={xScale(y)}
                  y={CHART_H - 18}
                  textAnchor="middle"
                  fontFamily="var(--ff-mono)"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {y}
                </text>
              </g>
            ))}

            {/* The five lines. */}
            {CURVES.map((c) => (
              <g key={c.id}>
                <path
                  d={pathFor(c)}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={2.25}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.4))' }}
                />
                {c.points.map((p, i) => (
                  <circle
                    key={i}
                    cx={xScale(p.year)}
                    cy={yScale(p.value, c)}
                    r={3}
                    fill={c.color}
                    opacity={0.9}
                  />
                ))}
                {/* End label. */}
                <text
                  x={xScale(c.points[c.points.length - 1].year) - 4}
                  y={yScale(c.points[c.points.length - 1].value, c) - 8}
                  textAnchor="end"
                  fontFamily="var(--ff-mono)"
                  fontSize="10"
                  fill={c.color}
                >
                  {c.points[c.points.length - 1].value}
                  {c.unit}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <ul className="conv-legend" role="list">
          {CURVES.map((c) => (
            <li key={c.id}>
              <span className="conv-legend-swatch" style={{ background: c.color }} />
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
        <p className="conv-chart-caption">
          The Christian line goes down. The foster line goes up. The
          out-of-wedlock line goes up <strong>eight times over</strong>.
          The divorce line more than doubles in twenty years. The
          abortion line crosses <strong>one million a year</strong>
          within five years of <em>Roe</em>, peaks in 1990, and —
          after a thirty-year decline — is climbing again post-
          <em>Dobbs</em>. All five curves bend in the same decade
          because a single package — the Pill, no-fault divorce,
          sexual liberation, individual autonomy elevated above
          covenant — landed on American life simultaneously, and
          American Christianity either endorsed it, stayed silent, or
          adopted it privately while condemning it publicly.
        </p>
      </div>

      {/* The timeline of the break — 1959-1980. */}
      <div className="conv-timeline-wrap">
        <h3 className="conv-timeline-heading">The timeline of the break</h3>
        <p className="conv-timeline-sub">
          Twenty-one years from Billy Graham's shrug to the Southern
          Baptist Convention finally opposing abortion — a full
          generation after the moment it would have mattered.
        </p>
        <ol className="conv-timeline" role="list">
          {TIMELINE.map((t, i) => (
            <li key={i} className="conv-event">
              <span className="conv-event-year">{t.year}</span>
              <div className="conv-event-body">
                <h4>{t.title}</h4>
                <p>{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Three lies. */}
      <div className="conv-lies">
        <h3 className="conv-lies-heading">Three lies American Christianity bought</h3>
        <div className="conv-lies-grid">
          {LIES.map((l) => (
            <article key={l.num} className="conv-lie">
              <span className="conv-lie-num">{l.num}</span>
              <h4>{l.lie}</h4>
              <p>{l.body}</p>
            </article>
          ))}
        </div>
      </div>

      {/* The generational body count. */}
      <div className="conv-count">
        <h3 className="conv-count-heading">The generational body count</h3>
        <p className="conv-count-sub">
          These are the children — not abstractions — for whom the
          American Christianity's theological surrender in 1960–1980 was paid.
        </p>
        <ul className="conv-count-grid" role="list">
          {BODY_COUNT.map((b, i) => (
            <li key={i}>
              <span className="conv-count-num">{b.n}</span>
              <span className="conv-count-lbl">{b.label}</span>
            </li>
          ))}
        </ul>
        <p className="conv-count-kicker">
          And the <strong>380,000 congregations</strong> — the same
          institutions that accepted contraception in the 1960s, stayed
          quiet on abortion until 1980, divorced at pagan rates, reduced
          their own childbearing to below replacement, and now fill
          their Sundays with worship music, church merchandise, and
          Disney-vacation announcements — are, collectively, saying yes
          to <strong>3%</strong> of them.
        </p>
      </div>

      {/* Closing — Option G (sexual revolution indictment). */}
      <div className="conv-closing">
        <p className="conv-closing-eyebrow">The closing argument</p>
        <p className="conv-closing-body">
          In 1959, Billy Graham looked at the Pill and said he saw
          nothing in the Bible that forbade it. In 1971, the Southern
          Baptist Convention voted <em>for</em> legalized abortion — two
          years before Roe. In 1970, the Presbyterian Church (U.S.A.)
          endorsed "mass contraceptive techniques" and "abortion on
          demand" in a single resolution.
        </p>
        <p className="conv-closing-body">
          And for the next fifty-five years, American Christianity
          reduced its own fertility by <strong>50%</strong>, divorced
          at rates indistinguishable from the culture, and quietly
          watched out-of-wedlock births climb from <strong>5% to
          40%</strong>.
        </p>
        <p className="conv-closing-body">
          Every one of those children — the 1.2 million born outside
          marriage in 1990, the 700,000 who now cycle through foster
          care each year, the 70,418 waiting right now — is a line item
          in the ledger American Christianity started running in the
          decade it either blessed the sexual revolution, adopted it
          in private, or failed to oppose it in public.
          <strong> Ninety-seven percent</strong> of American Christians
          have never taken in a single one.
        </p>
        <p className="conv-closing-kicker">
          The revolution cost two generations of children their families.
          American Christianity helped fund it — and American Christianity
          is still the one who won't open the spare bedroom.
        </p>
      </div>

      <Prayer prayer={PRAYERS.convergence} />
      <PledgeCalendar />
      <SourceDetails citations={CITATIONS} />
    </section>
  );
}
