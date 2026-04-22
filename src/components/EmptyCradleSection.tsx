// Section III — The Empty Cradle. 500 years of Christian fertility
// collapsing into three generations, on the same page where 70,418
// children are still waiting for a family.

import { SourceDetails, type Citation } from './SourceDetails';
import { Prayer } from './Prayer';
import { PRAYERS } from '../data/prayers';
import { EssayEpigraph } from './EssayEpigraph';
import { EPIGRAPHS } from '../data/epigraphs';

const CITATIONS: Citation[] = [
  {
    label: 'CDC NCHS — National Vital Statistics System, births & fertility',
    note: 'U.S. total fertility rate, births by year, births to unmarried women. Source for the fertility-collapse chart and every decade-by-decade TFR number.',
    href: 'https://www.cdc.gov/nchs/nvss/births.htm',
    display: 'cdc.gov/nchs',
  },
  {
    label: 'CIA World Factbook — Global total fertility rates',
    note: 'Benchmark TFRs used in the comparative chart (U.S. vs. European post-Christian cultures vs. global replacement).',
    href: 'https://www.cia.gov/the-world-factbook/field/total-fertility-rate/',
    display: 'cia.gov/world-factbook',
  },
  {
    label: 'Pew Research — Religion and fertility',
    note: 'Religiosity × fertility cross-tabulations; evangelical vs. mainline vs. non-religious birth-rate differentials.',
    href: 'https://www.pewresearch.org/religion/',
    display: 'pewresearch.org',
  },
  {
    label: 'AFCARS Report #30 — 70,418 children waiting for adoption',
    note: 'The anchor number for the vacancy argument — the empty bedrooms vs. the waiting children.',
    href: 'https://www.acf.hhs.gov/cb/data-research/adoption-fostercare',
    display: 'acf.hhs.gov',
  },
  {
    label: 'U.S. Religion Census 2020 — congregations / attendance',
    note: '~380,000 Christian congregations averaging ~100 families each. The pool against which "3% have ever fostered" is computed.',
    href: 'https://www.usreligioncensus.org/',
    display: 'usreligioncensus.org',
  },
];
//
// The argument is not that modern Christians *should* have 9 kids like
// the Puritans. It is that the combined refusal to have biological
// children AND take in waiting children leaves the pro-life claim
// structurally hollow. Christians are not obligated to reproduce at
// 1650 rates. They are obligated to make room.

interface FertilityRow {
  year: string;
  label: string;
  tfr: number;
  kind: 'history' | 'christian' | 'american' | 'present';
  note?: string;
}

// Sources: Open Book Publishers (early-modern demography); Cambridge
// Group for the History of Population; Haines & colonial parish records;
// PBS/First Measured Century; Statista historical series; Hacker 2019
// (Annales de démographie historique); CDC QuickStats 2020; Perry &
// Schleifer GSS 1972–2016; Pew Religion Projections; Pew RLS 2025;
// CNN/CDC 2026.
const FERTILITY: FertilityRow[] = [
  { year: '1650', label: 'Puritan New England woman', tfr: 9.0, kind: 'christian', note: 'range 7–11 · among the highest recorded in human history' },
  { year: '1790', label: 'American woman, early Republic', tfr: 8.0, kind: 'history' },
  { year: '1800', label: 'American woman', tfr: 7.0, kind: 'history' },
  { year: '1835', label: 'American woman', tfr: 7.0, kind: 'history' },
  { year: '1850', label: 'American woman', tfr: 5.4, kind: 'history', note: 'Orphan Train era · Protestant farm families routinely took in urban orphans' },
  { year: '1900', label: 'American woman', tfr: 3.8, kind: 'history' },
  { year: '1935', label: 'American woman', tfr: 2.1, kind: 'american', note: 'first approach to replacement' },
  { year: '1957', label: 'American woman · Baby Boom peak', tfr: 3.77, kind: 'american' },
  { year: '1972', label: 'Conservative Protestant (GSS)', tfr: 2.89, kind: 'christian' },
  { year: '1976', label: 'American woman · post-boom trough', tfr: 1.70, kind: 'american' },
  { year: '2016', label: 'Conservative Protestant (GSS)', tfr: 2.5, kind: 'christian', note: '−16% from 1972 — fastest decline of any Christian tradition' },
  { year: '2025', label: 'U.S. Christian woman (Pew)', tfr: 2.2, kind: 'christian' },
  { year: '2025', label: 'All U.S. women · all-time low', tfr: 1.59, kind: 'present', note: 'CDC 2026' },
];

const MAX_TFR = 11; // upper end of Puritan range — every bar scales to this.

const BIBLE = [
  { ref: 'Genesis 1:28', text: 'Be fruitful and multiply, fill the earth and subdue it.' },
  { ref: 'Psalm 127:3–5', text: 'Children are a heritage from the Lord. Blessed is the man whose quiver is full of them.' },
  { ref: 'Malachi 2:15', text: 'He seeks godly offspring.' },
  { ref: 'Proverbs 17:6', text: 'Children\'s children are a crown to the aged.' },
];

export function EmptyCradleSection() {
  return (
    <section className="cradle-section" id="cradle">
      <EssayEpigraph epigraph={EPIGRAPHS.cradle} />
      <div className="cradle-hero">
        <p className="cradle-eyebrow">Part III · The Empty Cradle</p>
        <h2 className="cradle-title">
          500 years of Christian fertility,<br />
          collapsed in three generations.
        </h2>
        <p className="cradle-lede">
          The Puritan woman in 1650 bore nine children in a one-room house
          and still opened her door when the widow's orphan next door
          needed a bed. The average American Christian woman in 2026
          bears <strong>2.2</strong>, lives in a <strong>four-bedroom
          house</strong>, earns <strong>ten times</strong> her ancestor's
          income, and has a <strong>3%</strong> chance of ever fostering.
          <br /><br />
          <em>What changed was not the text. What changed was the willingness
          to be inconvenienced by it.</em>
        </p>
      </div>

      {/* The 500-year chart — bars literally shrink as you scroll. */}
      <div className="cradle-chart">
        <h3 className="cradle-chart-heading">Children per woman · 1650 → 2025</h3>
        <p className="cradle-chart-sub">
          Puritan households routinely bore 7–11 children. Today's American
          Christian woman bears 2.2. The decline is not primarily
          theological — housing costs, delayed marriage, contraception,
          and urbanization all contributed. But it is a revealed
          preference.
        </p>
        <ul className="cradle-rows" role="list">
          {FERTILITY.map((r, i) => (
            <li key={i} className={`cradle-row kind-${r.kind}`}>
              <span className="cradle-year">{r.year}</span>
              <span className="cradle-label">{r.label}</span>
              <div className="cradle-bar-track">
                <div
                  className="cradle-bar"
                  style={{ width: `${(r.tfr / MAX_TFR) * 100}%` }}
                />
                <span className="cradle-tfr">{r.tfr.toFixed(r.tfr >= 10 ? 0 : 1)}</span>
              </div>
              {r.note && <span className="cradle-note">{r.note}</span>}
            </li>
          ))}
        </ul>
        <div className="cradle-headline">
          <span className="cradle-headline-num">76%</span>
          <span className="cradle-headline-lbl">
            collapse — Puritan woman to American Christian woman — in three
            and a half centuries. Most of it in the last one hundred years.
          </span>
        </div>
      </div>

      {/* The theology didn't change. */}
      <div className="cradle-bible">
        <h3 className="cradle-bible-heading">
          The theology didn't change. The behavior did.
        </h3>
        <p className="cradle-bible-sub">
          Every text the Puritans read is still in every Bible on every
          pew. Every major evangelical denomination still officially
          affirms children as a blessing. These verses have not been
          repealed. They have been ignored.
        </p>
        <div className="cradle-verses">
          {BIBLE.map((b) => (
            <figure key={b.ref} className="cradle-verse">
              <blockquote>“{b.text}”</blockquote>
              <figcaption>— {b.ref}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* The triple vacancy. */}
      <div className="cradle-vacancy">
        <h3 className="cradle-vacancy-heading">
          Three empty rooms in a four-bedroom house.
        </h3>
        <p className="cradle-vacancy-sub">
          The average American evangelical home today has four bedrooms
          and 2.2 children. Historically speaking, that house contains
          three simultaneous vacancies.
        </p>
        <div className="cradle-vacancies">
          <article className="vacancy">
            <span className="vacancy-num">I</span>
            <h4>The biological child that wasn't had.</h4>
            <p>
              Had this family maintained even 1972 conservative-Protestant
              fertility (2.89), there would be one more child in the
              house. At 1790 Christian fertility, <strong>six more</strong>.
            </p>
          </article>
          <article className="vacancy">
            <span className="vacancy-num">II</span>
            <h4>The sibling that only child never got.</h4>
            <p>
              2.2 is an average. Many Christian homes now have one child —
              growing up without the sibling discipleship, the built-in
              covenant community, and the hand-me-downs that 500 years of
              Christian family life assumed.
            </p>
          </article>
          <article className="vacancy">
            <span className="vacancy-num">III</span>
            <h4>The foster child that never came.</h4>
            <p>
              <strong>70,418</strong> legally-free waiting children.
              <strong> 380,000</strong> U.S. congregations. One child for
              every ~5 churches. And <strong>97%</strong> of American
              Christians have never said yes.
            </p>
          </article>
        </div>
      </div>

      {/* The square-footage paradox. */}
      <div className="cradle-paradox">
        <h3 className="cradle-paradox-heading">More house. Fewer children. Still no foster bed.</h3>
        <div className="cradle-compare">
          <article className="era era-then">
            <header>1850 American Christian farmhouse</header>
            <ul>
              <li><span>Biological children</span><strong>~5.4</strong></li>
              <li><span>Square feet</span><strong>~600</strong></li>
              <li><span>Orphan-train child taken in?</span><strong>Routine</strong></li>
              <li><span>Inflation-adjusted income</span><strong>1×</strong></li>
            </ul>
          </article>
          <div className="era-v" aria-hidden>→</div>
          <article className="era era-now">
            <header>2026 American evangelical home</header>
            <ul>
              <li><span>Biological children</span><strong>2.2</strong></li>
              <li><span>Square feet</span><strong>~2,500</strong></li>
              <li><span>Foster child taken in?</span><strong className="flag">3% chance</strong></li>
              <li><span>Inflation-adjusted income</span><strong>~10×</strong></li>
            </ul>
          </article>
        </div>
        <p className="cradle-paradox-note">
          The square footage is bigger. The family is smaller. The
          foster placement still hasn't happened. The empty bedroom is
          not a metaphor — it is the direct, measurable demographic
          consequence of a faith tradition that kept its theology of
          the family in the pulpit while removing it from the home.
        </p>
      </div>

      {/* Closing indictment — Option F from the source doc. */}
      <div className="cradle-closing">
        <p className="cradle-closing-eyebrow">The closing argument</p>
        <p className="cradle-closing-body">
          The Puritan woman in 1650 who buried three children and raised
          eight more in a six-hundred-square-foot house — who still
          opened her door when the widow's child next door needed a bed —
          would not recognize her spiritual descendants. She read the
          same Bible. She prayed to the same God. She believed the same
          Psalm 127.
        </p>
        <p className="cradle-closing-body">
          American Christianity has, in three generations, performed the
          most dramatic voluntary fertility collapse in the history of
          the religion — <strong>while still claiming that life is
          sacred and that children are a blessing from God</strong>. The
          Puritans put nine kids in a one-room house. The modern
          evangelical cannot find room for one in a four-bedroom one.
        </p>
        <p className="cradle-closing-kicker">
          The quiver is not full. The spare bedroom is not full. The pew,
          increasingly, is not full. If children are a heritage &mdash;
          what heritage have you left them?
        </p>
      </div>

      <Prayer prayer={PRAYERS.cradle} />
      <SourceDetails citations={CITATIONS} />
    </section>
  );
}
