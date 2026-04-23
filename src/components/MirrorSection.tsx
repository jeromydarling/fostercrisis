import { useEffect, useState } from 'react';
import { SourceDetails, type Citation } from './SourceDetails';
import { Prayer } from './Prayer';
import { PledgeCalendar } from './PledgeCalendar';
import { PRAYERS } from '../data/prayers';
import { EssayEpigraph } from './EssayEpigraph';
import { EPIGRAPHS } from '../data/epigraphs';
import { Shareable } from './Shareable';

const CITATIONS: Citation[] = [
  {
    label: 'AFCARS Report #30 (FY2023) — HHS / Children\'s Bureau',
    note: 'Point-in-time census: 368,530 children in care; 70,418 waiting for adoption; 34,817 legally free.',
    href: 'https://www.acf.hhs.gov/cb/data-research/adoption-fostercare',
    display: 'acf.hhs.gov',
  },
  {
    label: '2020 U.S. Religion Census',
    note: '~380,000 Christian congregations nationally. Source for every "churches per waiting child" calculation.',
    href: 'https://www.usreligioncensus.org/',
    display: 'usreligioncensus.org',
  },
  {
    label: 'Pew Research — Religious Landscape Study',
    note: 'State-level "% highly religious" composite (prayer, attendance, importance, certain belief). The reddest pews / longest waitlists overlay.',
    href: 'https://www.pewresearch.org/religion/religious-landscape-study/',
    display: 'pewresearch.org',
  },
  {
    label: 'Barna Research — Faith and fostering',
    note: 'Source for "3% of American Christians have ever fostered" and practicing-Christian adoption/fostering rates cited across the site.',
    href: 'https://www.barna.com/',
    display: 'barna.com',
  },
  {
    label: 'Pew — American Christianity attendance + giving',
    note: 'Weekly-attendance shares, denominational breakdown, giving data used in the stacks section.',
    href: 'https://www.pewresearch.org/religion/',
    display: 'pewresearch.org',
  },
];

// Every "Redirect" swap. One animated card cycles these every few seconds.
// The argument is: you already have the time. You already have the money.
// You chose something else with both.
const REDIRECTS = [
  {
    from: 'One $7,692 Disney Cruise (family of four, 4 nights)',
    to: '9 months of state fostering stipend for a teenager',
    note: 'VA rate · $905/mo × 9',
    bucket: 'Money',
  },
  {
    from: 'One year of Netflix (511 hours)',
    to: '511 evenings at the kitchen table with a child who has never had one',
    note: 'Licensing takes 30 hrs, one-time — you burn that every 20 days',
    bucket: 'Time',
  },
  {
    from: 'One year of social media (876 hours)',
    to: '876 hours of presence, eye contact, homework help — for a child who has never had any of it',
    note: '73 years of foster-parent CE (MN: 12 hrs/yr)',
    bucket: 'Time',
  },
  {
    from: 'One Passion Conference weekend — $11M in ticket revenue',
    to: '1,220 foster children cared for, one full year',
    note: '$189 × 60,000 attendees',
    bucket: 'Money',
  },
  {
    from: 'Lakewood Church\'s $90M annual budget',
    to: '3,600 child-years of fostering — every legally-free kid in TX · LA · AR · MS, for 2+ years',
    note: '',
    bucket: 'Money',
  },
  {
    from: 'One $10M church building campaign',
    to: '40 fostering families, supported for 10 years',
    note: 'At full USDA cost-to-raise',
    bucket: 'Money',
  },
  {
    from: '0.5% of American Christianity\'s $124B annual take',
    to: 'A full year of stipend for every one of the 70,418 children legally free and waiting for a forever family',
    note: '$620M · AFCARS legally-free count',
    bucket: 'Money',
  },
];

// Breakdown of the $124B that U.S. churches collect every year. Numbers
// roll up to 100%; drawn as a single horizontal stacked bar.
const BUDGET = [
  { label: 'Staff salaries', pct: 50, color: '#cf6426' },
  { label: 'Buildings & mortgages', pct: 25, color: '#a1302a' },
  { label: 'Utilities, supplies', pct: 13, color: '#6d1728' },
  { label: 'Ministries & outreach', pct: 10, color: '#e6a42a' },
  { label: 'Missions (incl. foster)', pct: 2, color: '#f7e26b' },
];

// George Barna / Cultural Research Center, AWVI 2026. The Catholic row is
// intentionally omitted — Barna's biblical-worldview test is calibrated
// on a Protestant-wired doctrinal standard Catholics do not claim to meet.
// Including them would be comparing denominations that aren't playing the
// same game.
const WORLDVIEW_GEN = [
  { label: 'Gen Z (18–29)', pct: 1 },
  { label: 'Millennials (30–44)', pct: 2 },
  { label: 'Gen X (45–60)', pct: 7 },
  { label: 'Boomers (61–79)', pct: 7 },
];
const WORLDVIEW_DENOM = [
  { label: 'Non-denominational', pct: 13 },
  { label: 'Pentecostal', pct: 10 },
  { label: 'Baptist (incl. SBC)', pct: 8 },
  { label: 'Broad Protestant', pct: 7 },
  { label: 'Mainline Protestant', pct: 2 },
];

export function MirrorSection() {
  const [cycleIdx, setCycleIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-cycle the Redirect card every 5 seconds unless the user pauses it.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setCycleIdx((i) => (i + 1) % REDIRECTS.length);
    }, 5200);
    return () => clearInterval(t);
  }, [paused]);

  const current = REDIRECTS[cycleIdx];

  return (
    <section className="mirror-section" id="mirror">
      <EssayEpigraph epigraph={EPIGRAPHS.mirror} />
      <div className="mirror-hero">
        <p className="mirror-eyebrow">Part II · The Mirror of American Christianity</p>
        <h2 className="mirror-title">
          You said you didn't have time. <br />
          You said you couldn't afford it.
        </h2>
        <p className="mirror-lede">
          American Christianity collects <strong>$124 billion a year</strong>,
          builds <strong>$4.6 billion</strong> in new facilities,
          sustains a <strong>$1.7 billion</strong> Christian music industry,
          watches <strong>7 hours of screens daily</strong>, and
          fosters at a rate of <strong>3%</strong> — barely above
          the <strong>2%</strong> of the general, often-godless public.
          <br /><br />
          <em>Every excuse about time and money is answered by the numbers American Christianity already wrote down about itself.</em>
        </p>
      </div>

      {/* TIME vs MONEY — the two columns of excuses, dismantled */}
      <div className="mirror-stacks">
        <div className="stack stack-time">
          <h3 className="stack-heading">The time you said you didn't have</h3>
          <ul className="stack-list">
            <li><span className="stack-num">7 hrs / day</span><span className="stack-lbl">screens (US adult avg)</span></li>
            <li><span className="stack-num">2.4 hrs / day</span><span className="stack-lbl">social media</span></li>
            <li><span className="stack-num">1.4 hrs / day</span><span className="stack-lbl">Netflix alone</span></li>
            <li><span className="stack-num">5+ hrs / day</span><span className="stack-lbl">teens in Christian homes (Barna)</span></li>
            <li><span className="stack-num">54 hrs / yr</span><span className="stack-lbl">at church (≈36 services × 1.5 hrs)</span></li>
          </ul>
          <p className="stack-need">
            <strong>What the license costs in time:</strong> about
            <strong> 30 hours once</strong> (training, paperwork, home
            study), then <strong>12 hours a year</strong> of continuing
            education. You already burn that in a Netflix fortnight.
            <br /><br />
            <span className="stack-burn">
              What the child costs you is the rest of your life. The license
              is cheap. The calling is not. The only question is whether
              you're going to spend your life loving a human being that no
              one else would love — or scrolling.
            </span>
          </p>
        </div>

        <div className="stack stack-money">
          <h3 className="stack-heading">The money you said you couldn't spend</h3>
          <Shareable
            label="Part II · $124B the money you said you couldn't spend"
            className="stack-list-shareable"
          >
            <ul className="stack-list">
              <li><span className="stack-num">$124B / yr</span><span className="stack-lbl">U.S. church income</span></li>
              <li><span className="stack-num">$4.6B / yr</span><span className="stack-lbl">new church construction (2025)</span></li>
              <li><span className="stack-num">$1.7B / yr</span><span className="stack-lbl">Christian music industry</span></li>
              <li><span className="stack-num">$11M / wknd</span><span className="stack-lbl">Passion Conference tickets</span></li>
              <li><span className="stack-num">$7,692</span><span className="stack-lbl">one Disney cruise, family of four</span></li>
              <li><span className="stack-num">$5,000 / yr</span><span className="stack-lbl">average family vacation</span></li>
            </ul>
          </Shareable>
          <Shareable
            label="Part II · What fostering actually costs the family"
            className="stack-need-shareable"
          >
            <p className="stack-need">
              <strong>What fostering costs the family: nothing. The state
              pays <em>you</em>.</strong>
              <br /><br />
              Every state pays a monthly stipend — typically
              <strong> $450–$1,200 per child per month</strong>, more for
              teens and kids with medical or trauma needs. Medicaid covers
              the child's health and dental. Most adoptions from foster
              care cost the family <strong>$0</strong> — no placement fees,
              no legal fees — and come with an ongoing adoption-assistance
              subsidy to age 18 (often 21). The federal adoption tax credit
              adds roughly <strong>$16,000</strong>. About 30 states waive
              state-college tuition for kids who came out of care.
              <br /><br />
              <span className="stack-burn">
                This isn't a financial ask. It's a spiritual one. The state
                has already handled the money. What's left is whether you
                have the yes.
              </span>
            </p>
          </Shareable>
        </div>
      </div>

      {/* THE REDIRECT — one auto-cycling swap */}
      <div
        className="redirect"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <p className="redirect-eyebrow">The Redirect · {current.bucket}</p>
        <div className="redirect-swap" key={cycleIdx}>
          <div className="redirect-from">
            <span className="redirect-label">Redirect</span>
            <span className="redirect-content">{current.from}</span>
          </div>
          <div className="redirect-arrow" aria-hidden>→</div>
          <div className="redirect-to">
            <span className="redirect-label">
              {current.bucket === 'Time' ? 'Time better spent' : 'You would fund'}
            </span>
            <span className="redirect-content">{current.to}</span>
            {current.note && <span className="redirect-note">{current.note}</span>}
          </div>
        </div>
        <div className="redirect-dots">
          {REDIRECTS.map((_, i) => (
            <button
              key={i}
              className={'redirect-dot' + (i === cycleIdx ? ' is-active' : '')}
              onClick={() => setCycleIdx(i)}
              aria-label={`Show swap ${i + 1}`}
            />
          ))}
        </div>
        <p className="redirect-caption">
          {paused ? 'Paused — move away to resume.' : 'Auto-cycles every 5 seconds. Hover to pause.'}
        </p>
      </div>

      {/* THE $124B STACKED BAR — where church giving actually goes */}
      <Shareable label="Part II · $124B vs $30B" className="budget">
        <h3 className="budget-heading">Where the $124 billion actually goes</h3>
        <p className="budget-sub">
          Of every dollar collected by U.S. churches:
        </p>
        <div className="budget-bar" role="img" aria-label="U.S. church spending breakdown">
          {BUDGET.map((seg) => (
            <div
              key={seg.label}
              className="budget-seg"
              style={{ width: `${seg.pct}%`, background: seg.color }}
              title={`${seg.label}: ${seg.pct}%`}
            >
              <span className="budget-pct">{seg.pct}%</span>
            </div>
          ))}
        </div>
        <ul className="budget-legend">
          {BUDGET.map((seg) => (
            <li key={seg.label}>
              <span className="budget-dot" style={{ background: seg.color }} />
              <span className="budget-label">{seg.label}</span>
              <span className="budget-value">{seg.pct}%</span>
            </li>
          ))}
        </ul>
        <div className="budget-compare">
          <div>
            <span className="budget-compare-num">$124B</span>
            <span className="budget-compare-label">American Christianity's annual income</span>
          </div>
          <span className="budget-compare-v">vs</span>
          <div>
            <span className="budget-compare-num">$30B</span>
            <span className="budget-compare-label">U.S. foster-care system — total federal + state + local budget</span>
          </div>
        </div>
        <p className="budget-pnote">
          American Christianity's annual take is <strong>four times</strong> the cost of
          the entire national foster system. Since 1994 — the span in which
          biblical worldview collapsed from 12% to 4% — the total has been
          roughly <strong>$3.7 trillion</strong>. That's 123 years of the
          entire foster system, all paid in three decades, all spent on
          itself.
        </p>
      </Shareable>

      {/* THE WORLDVIEW CAP — 4% biblical worldview, 1% Gen Z */}
      <Shareable label="Part II · 4% biblical worldview" className="worldview">
        <h3 className="worldview-heading">You said you believed.</h3>
        <p className="worldview-lede">
          American Christianity's footprint is staggering. What it produces
          — measured in actual biblical conviction — is not. George Barna's
          2026 worldview survey:
        </p>
        <div className="worldview-big">
          <span className="worldview-num">4%</span>
          <span className="worldview-lbl">
            of American adults hold a biblical worldview.<br />
            <em>Down from 12% in the early 1990s.</em>
          </span>
        </div>

        <div className="worldview-row">
          <div className="worldview-col">
            <h4>By generation</h4>
            <ul>
              {WORLDVIEW_GEN.map((r) => (
                <li key={r.label}>
                  <div className="wv-label">{r.label}</div>
                  <div className="wv-track">
                    <div className="wv-fill" style={{ width: `${Math.max(2, r.pct) * 4}%` }} />
                    <span className="wv-pct">{r.pct}%</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="worldview-note">
              <strong>1%.</strong> Raised inside 380,000 congregations. One in one hundred.
            </p>
          </div>

          <div className="worldview-col">
            <h4>By Christian denomination</h4>
            <ul>
              {WORLDVIEW_DENOM.map((r) => (
                <li key={r.label}>
                  <div className="wv-label">{r.label}</div>
                  <div className="wv-track">
                    <div className="wv-fill" style={{ width: `${Math.max(2, r.pct) * 4}%` }} />
                    <span className="wv-pct">{r.pct}%</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="worldview-note">
              Source: Cultural Research Center, AWVI 2026. Catholic data is
              omitted — Barna's test is calibrated on a Protestant doctrinal
              standard Catholics do not claim to meet.
            </p>
          </div>
        </div>
      </Shareable>

      {/* THE CLOSING INDICTMENT (Option D · The Screen Indictment) */}
      <div className="indictment">
        <p className="indictment-eyebrow">The closing argument</p>
        <p className="indictment-body">
          The average American Christian will spend seven hours today looking
          at a screen and roughly ten minutes in prayer. They will watch
          1.4 hours of Netflix and give 2.8% of their income to their church.
          Only <strong>4 in 100</strong> of them — and <strong>1 in 100</strong>
          {' '}of their Gen Z children — hold a biblical worldview, even as
          their pastors preach in buildings that cost $4.6 billion a year to
          expand. Somewhere tonight, a 12-year-old girl is sleeping in her
          fourth placement this year because 29 out of every 30 of those
          Christians could not find 30 hours to become licensed.
        </p>
        <p className="indictment-kicker">
          Where your treasure is, there your heart will also be. The
          phone won your heart &mdash; a heart that could have given
          a home to a child.
        </p>
      </div>

      <Prayer prayer={PRAYERS.mirror} />
      <PledgeCalendar />
      <SourceDetails citations={CITATIONS} />
    </section>
  );
}
