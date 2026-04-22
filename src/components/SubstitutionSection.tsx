import { SourceDetails, type Citation } from './SourceDetails';

const CITATIONS: Citation[] = [
  {
    label: 'Roe v. Wade (1973) — Supreme Court of the United States',
    note: '7–2 decision. Six of the seven majority justices were Protestant. Primary text of the decision.',
    href: 'https://www.law.cornell.edu/supremecourt/text/410/113',
    display: 'law.cornell.edu',
  },
  {
    label: 'Southern Baptist Convention — 1971 Resolution on Abortion',
    note: 'Messengers voted FOR legalization of abortion under specified circumstances, two years before Roe. The primary-source resolution.',
    href: 'https://www.sbc.net/resource-library/resolutions/resolution-on-abortion-2/',
    display: 'sbc.net',
  },
  {
    label: 'Guttmacher Institute — U.S. abortion statistics',
    note: 'Year-by-year totals 1973–present; pre-Roe estimates; post-Dobbs 2022/2024 numbers (1.126M in 2024, +21% from 2020).',
    href: 'https://www.guttmacher.org/united-states/abortion',
    display: 'guttmacher.org',
  },
  {
    label: 'Charlotte Lozier Institute — PRC spending and reach',
    note: 'Source for $452M/yr to pregnancy-resource centers across 2,775 locations.',
    href: 'https://lozierinstitute.org/',
    display: 'lozierinstitute.org',
  },
  {
    label: 'Bethany Christian Services — IRS Form 990',
    note: 'The largest Christian foster-care nonprofit in America runs on ~$84M/yr — less than one-fifth of annual PRC spending.',
    href: 'https://bethany.org/',
    display: 'bethany.org',
  },
  {
    label: 'Hartford Institute for Religion Research — megachurch data',
    note: '1,800+ megachurches in the U.S.; ~$28M average annual budget; total operating spend. Willow Creek 1975 / Saddleback 1980 / Life.Church 1996 founding data.',
    href: 'https://hartfordinstitute.org/megachurch-definition',
    display: 'hartfordinstitute.org',
  },
  {
    label: 'RIAA — U.S. Christian music industry revenue',
    note: '$1.7B/year Christian/gospel music industry; 28.4B streams (2023). Used for the worship-economy line.',
    href: 'https://www.riaa.com/',
    display: 'riaa.com',
  },
  {
    label: 'Pew Research — Religious Landscape Study',
    note: 'Denominational breakdown and attendance data underpinning the "5 substitutes" scale figures.',
    href: 'https://www.pewresearch.org/religion/religious-landscape-study/',
    display: 'pewresearch.org',
  },
  {
    label: 'Barna Research — Christian fostering / adoption rates',
    note: '~3% of American Christians have ever fostered; practicing-Christian rates on the tally row.',
    href: 'https://www.barna.com/',
    display: 'barna.com',
  },
  {
    label: 'Pornhub Insights — State of the Union',
    note: 'Bible Belt / Mississippi rank-order across 2014–2019. Counter-evidence to purity-culture claims.',
    href: 'https://www.pornhub.com/insights/united-states',
    display: 'pornhub.com/insights',
  },
  {
    label: 'Purdue / Ferraro (2006) — Religion and Obesity in American Adults',
    note: 'Denominational obesity table (Baptists 30%, Jews 1%, Muslims 0.7%) cited in the "lost war" section.',
    href: 'https://journals.sagepub.com/doi/10.1177/002214650604700203',
    display: 'journals.sagepub.com',
  },
  {
    label: 'True Love Waits campaign archive / SBC',
    note: 'True Love Waits (1993) and purity-culture movement scale — millions of pledges. Primary archive.',
    href: 'https://www.lifeway.com/en/product-family/true-love-waits',
    display: 'lifeway.com',
  },
];

// Part V — The Substitution & The Lost War.
//
// The closing argument of the entire site. What American Christianity did
// INSTEAD of fostering, 1980-2026. The pro-life movement that prevented
// and funded but refused to receive. The pornography battle won in
// public and lost in private. The six wars American Christianity claimed to fight
// and lost all six. The Christian-nation paradox that names itself by
// church attendance while failing every test the Bible actually uses.
//
// Placed after the Master Timeline as the final essay beat.

const SUBSTITUTES = [
  {
    label: 'The Culture War',
    launched: 'Moral Majority 1979 · Christian Coalition 1989 · FRC 1983',
    scale: 'Hundreds of millions per year in political advocacy',
    replaced: 'Pastoral and covenantal authority',
  },
  {
    label: 'Pro-Life Movement + PRCs',
    launched: 'Organized post-Roe, late 1970s onward',
    scale: '$452M / year · 2,775 centers · $1B+ in state funding since 1995',
    replaced: 'Receiving the children of the crisis pregnancies the movement carried to term',
  },
  {
    label: 'Purity Culture',
    launched: 'True Love Waits 1993 · I Kissed Dating Goodbye 1997',
    scale: 'Millions of pledges · 1M+ books sold · abstinence-only as normative curriculum',
    replaced: 'A serious theology of marriage, sex, and family',
  },
  {
    label: 'The Megachurch',
    launched: 'Willow Creek 1975 · Saddleback 1980 · Life.Church 1996',
    scale: '1,800+ megachurches · ~$28M avg annual budget · billions in operating spend',
    replaced: 'Small, dense, covenantal congregations where fostering historically happened',
  },
  {
    label: 'The Worship Economy',
    launched: 'Vineyard, Hillsong 1983 · Passion 1997 · Bethel 2001',
    scale: '$1.7B / year music industry · 28.4B streams · Passion = $11M+ per weekend',
    replaced: 'Formative liturgy and scripture memorization',
  },
];

const LEDGER = [
  {
    pillar: 'Legalized',
    figure: '63 million',
    sub: 'abortions, 1973–2022. American Christianity wrote the ruling, then slept, then marched — in that order.',
    body:
      'Seven Supreme Court justices legalized abortion in Roe v. Wade in 1973. Six of them were Protestant. Two years earlier, the Southern Baptist Convention — the largest Protestant denomination in America — had voted FOR legalization. By 1970, mainline Protestants (PCUSA, UCC) were endorsing "abortion on demand" in their own resolutions. Evangelicals did not organize politically against Roe until 1980 — seven years after the decision, and roughly eight million abortions deep. The billion-dollar campaign that followed finally overturned Roe in 2022. It did not reduce abortion: 1.126 million in 2024, up 21% from 2020. American Christianity did not prevent this. It helped enable it, then cleaned up with a bumper sticker.',
  },
  {
    pillar: 'Funded',
    figure: '$452 M / yr',
    sub: 'to Pregnancy Resource Centers alone. Almost none of it reaches the 368,000 already-born children living in foster care tonight.',
    body:
      '$452M/yr on PRCs across 2,775 locations. Over $1B in public PRC funding since 1995. Tens of billions more across fifty years of March for Life, Susan B. Anthony List, Family Research Council, denominational lobbying arms, and state ballot campaigns. Meanwhile the 368,000 children already born and waiting in foster care tonight see almost none of it. Bethany Christian Services — the largest Christian foster-care nonprofit in America — runs on roughly $84M a year. That is less than one-fifth of a single year of PRC spending. The ~23,000 kids who age out every year with no family face devastating outcomes: 22–46% experience homelessness within a few years; 20% of the U.S. prison population is former foster youth; 86% of child sex-trafficking victims were in the child-welfare system at the time of victimization. American Christianity opens its wallet to prevent a birth. It closes it when the child actually arrives and ends up in the system the movement failed to notice.',
  },
  {
    pillar: 'Receive',
    figure: '3%',
    sub: 'of American Christians have ever fostered',
    body: '368,000 children in foster care tonight. 70,418 legally free and waiting for a forever family. 700,000 cycling through in a year. If one family per evangelical home that voted pro-life, donated to a PRC, or marched had fostered, the crisis would not exist. There would be a multi-year Christian waitlist.',
  },
];

const PASTOR_PORN = [
  { n: '67%', lbl: 'of U.S. pastors have personally struggled with pornography', note: 'up from 57% in 2015' },
  { n: '18%', lbl: 'of U.S. pastors currently struggle', note: 'nearly 1 in 5' },
  { n: '26%', lbl: 'of pastors under 45 currently struggle' },
  { n: '86%', lbl: 'of pastors believe it is common among Christian pastors' },
  { n: '81%', lbl: 'of pastors say their church does not adequately teach about compulsive sexual behavior' },
];

const CHRISTIAN_PORN = [
  { n: '75%', lbl: 'of Christian men report some level of porn consumption' },
  { n: '40%', lbl: 'of Christian women report some level of porn consumption' },
  { n: '54%', lbl: 'of practicing Christians view pornography', note: 'vs. 68% of non-Christians — a 14-point gap, not a chasm' },
  { n: '62%', lbl: 'of Christians agree that "a person can regularly view pornography and live a sexually healthy life"' },
  { n: '39%', lbl: 'of Gen Z adults view porn daily or weekly' },
];

const TALLY = [
  { claim: 'We are fighting for every life.',
    reality: '63M abortions, 1973–2022. Abortions now rising again post-Dobbs (1.126M, 2025).' },
  { claim: 'We are defending the family.',
    reality: 'Out-of-wedlock births: 5% → 40%. Christian fertility below replacement.' },
  { claim: 'We are making disciples.',
    reality: '4% biblical worldview. 1% Gen Z. 9% of born-again Christians.' },
  { claim: 'We are salt and light.',
    reality: '67% of pastors struggle with porn. 62% of Christians say it is fine.' },
  { claim: 'We are pro-life and pro-family.',
    reality: '3% foster rate. 368,000 in care tonight. 70,418 legally free and waiting. The 4-bedroom house has one empty bedroom.' },
  { claim: 'We are a Christian nation.',
    reality: '63 million babies killed since 1973. 75% of Christian men view pornography. 3% have ever fostered one of the 368,000 orphans in their own community.' },
];

const WARS = [
  {
    war: 'Against the Pill',
    did: 'Billy Graham (1959): "nothing in the Bible forbids it." Protestants adopt wholesale. Humanae Vitae stands alone.',
    result: 'Universal contraception. Christian fertility −50% in one lifetime.',
  },
  {
    war: 'Against abortion',
    did: 'SBC votes FOR legal abortion in 1971. Evangelical political response a decade after Roe.',
    result: '63M abortions 1973–2022. Roe overturned 2022; abortions then rise again.',
  },
  {
    war: 'Against no-fault divorce',
    did: 'Produced no coherent theology of marital permanence adequate to the no-fault era.',
    result: 'Divorce doubled 1960–1980. 1M children/year experience parental divorce. Christians divorce at rates indistinguishable from the general population.',
  },
  {
    war: 'Against pornography',
    did: 'Preached against in public. 67% of pastors and 54–75% of Christians use it in private.',
    result: 'Most rapid normalization of any sexual behavior in Christian history. 62% of Christians now call it morally acceptable.',
  },
  {
    war: 'Against family collapse',
    did: 'Culture-war rhetoric, purity culture, Moral Majority, Focus on the Family.',
    result: 'Unwed births 5% → 40%. 700K foster cases per year, most stemming from family collapse.',
  },
  {
    war: 'Against secularization',
    did: 'Built 1,800 megachurches, $1.7B/yr music industry, 2,775 PRCs — a full parallel economy.',
    result: 'Church attendance 42% → 30%. Biblical worldview 12% → 4%. Gen Z: 1%.',
  },
];

const NATION_LEDGER = [
  { n: '62%', lbl: 'Americans identify as Christian', sub: 'from ~90% in 1970' },
  { n: '30%', lbl: 'weekly church attendance', sub: 'from 42% in 2000' },
  { n: '4%', lbl: 'hold a biblical worldview', sub: 'from 12% in 1992' },
  { n: '1%', lbl: 'of Gen Z hold a biblical worldview' },
  { n: '40%', lbl: 'of U.S. children born outside marriage' },
  { n: '368 K', lbl: 'children in foster care tonight', sub: 'AFCARS point-in-time' },
  { n: '700 K', lbl: 'cycle through foster care each year' },
  { n: '3%', lbl: 'of American Christians have ever fostered' },
  { n: '70,418', lbl: 'legally free, waiting for a forever family' },
];

export function SubstitutionSection() {
  return (
    <section className="subst-section" id="substitution">
      <div className="subst-hero">
        <p className="subst-eyebrow">Part V · The Substitution &amp; The Lost War</p>
        <h2 className="subst-title">
          What the Christians did <span className="subst-underline">instead</span>.
        </h2>
        <p className="subst-lede">
          If American Christianity lost the war in 1960–1980, the question is
          what it has been doing for the forty-six years since.
          <br /><br />
          The answer: it built a parallel economy and political apparatus
          in <em>response</em> to the sexual revolution that is, measured
          in dollars and hours, vastly larger than its fostering
          commitment. American Christianity did not do nothing after 1980. It did
          many things.
          <br /><br />
          <strong>It simply did not do the one thing that would have
          measurably reduced the damage: open the spare bedroom.</strong>
        </p>
      </div>

      {/* The five substitutes */}
      <div className="subst-substitutes">
        <h3 className="subst-heading">The five substitutes</h3>
        <p className="subst-sub">
          Five things American Christianity built instead of fostering
          networks. Each is real, well-funded, and institutionally serious.
          None of them is absorbing the 70,000 children produced by the
          revolution American Christianity lost.
        </p>
        <ul className="subst-list">
          {SUBSTITUTES.map((s) => (
            <li key={s.label} className="subst-item">
              <header>
                <span className="subst-item-label">{s.label}</span>
                <span className="subst-item-when">{s.launched}</span>
              </header>
              <p className="subst-item-scale">{s.scale}</p>
              <p className="subst-item-replaced">
                <span className="subst-tag">in place of</span> {s.replaced}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* The pro-life ledger — three columns */}
      <div className="subst-ledger">
        <h3 className="subst-heading">The pro-life ledger</h3>
        <p className="subst-sub">
          Legalized. Funded. <strong>Refused to receive.</strong>
          <br />
          American Christianity helped legalize abortion, spent fifty
          years funding the cleanup, and — on the one ask the Bible
          actually made (James 1:27) — has a single-digit participation
          rate.
        </p>
        <div className="subst-ledger-grid">
          {LEDGER.map((col) => (
            <article key={col.pillar} className={`subst-col subst-col-${col.pillar.toLowerCase()}`}>
              <span className="subst-col-pillar">{col.pillar}</span>
              <span className="subst-col-figure">{col.figure}</span>
              <span className="subst-col-sub">{col.sub}</span>
              <p>{col.body}</p>
            </article>
          ))}
        </div>
        <p className="subst-ledger-note">
          <strong>The math the movement has never reconciled:</strong> if
          every evangelical family that has voted pro-life, donated to a
          PRC, attended a March for Life, or placed a "Choose Life"
          bumper sticker on their car had fostered or adopted one child
          from state custody, there would be a multi-year Christian
          <em> waitlist</em> for the next waiting child. Instead, after
          fifty years of "every life is sacred" rhetoric, the fostering
          rate among Christians is <strong>3%</strong>. The movement
          meant every <em>unborn</em> life, and stopped caring the moment
          the child was born into a broken home.
        </p>
      </div>

      {/* The pornography indictment — pastor vs Christian columns */}
      <div className="subst-porn">
        <h3 className="subst-heading">The battle won in public, lost in private</h3>
        <p className="subst-sub">
          American Christianity fought the sexual revolution on Sunday
          and surrendered to it on Tuesday. The fight (abortion laws,
          marriage amendments, purity culture) cost billions. The private
          capitulation (pornography, divorce, fertility collapse,
          cohabitation) cost credibility.
        </p>
        <div className="subst-porn-grid">
          <div className="subst-porn-col">
            <h4>Inside the pulpit</h4>
            <p className="subst-porn-byline">Barna / Pure Desire 2024, U.S. pastors</p>
            <ul>
              {PASTOR_PORN.map((s, i) => (
                <li key={i}>
                  <span className="subst-porn-num">{s.n}</span>
                  <span className="subst-porn-lbl">{s.lbl}</span>
                  {s.note && <span className="subst-porn-note">{s.note}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="subst-porn-col">
            <h4>Inside the pew</h4>
            <p className="subst-porn-byline">Barna / Pure Desire 2024, U.S. Christians</p>
            <ul>
              {CHRISTIAN_PORN.map((s, i) => (
                <li key={i}>
                  <span className="subst-porn-num">{s.n}</span>
                  <span className="subst-porn-lbl">{s.lbl}</span>
                  {s.note && <span className="subst-porn-note">{s.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="subst-porn-kicker">
          The gap between Christian and non-Christian porn use is
          <strong> 14 percentage points</strong>. The much-vaunted
          spiritual difference is a rounding error. The pastors preaching
          against the revolution from the pulpit are watching it at home
          at nearly the same rate as their congregants.
        </p>
      </div>

      {/* The 46-year tally */}
      <div className="subst-tally">
        <h3 className="subst-heading">The 46-year tally</h3>
        <p className="subst-sub">
          What American Christianity claimed it was doing, versus what the data
          actually shows, measured since the founding of the Moral
          Majority in 1979.
        </p>
        <ul className="subst-tally-list" role="list">
          {TALLY.map((t, i) => (
            <li key={i}>
              <span className="subst-tally-claim">
                <span className="subst-tally-mark">“</span>
                {t.claim}
                <span className="subst-tally-mark">”</span>
              </span>
              <span className="subst-tally-arrow" aria-hidden>→</span>
              <span className="subst-tally-reality">{t.reality}</span>
            </li>
          ))}
        </ul>
        <p className="subst-tally-kicker">
          Every single metric American Christianity pointed to as a measure
          of its cultural influence has either collapsed or reversed in
          the forty-six years it has been politically mobilized to
          "save" the country.
        </p>
      </div>

      {/* The six wars */}
      <div className="subst-wars">
        <h3 className="subst-heading">Six wars. Six losses.</h3>
        <p className="subst-sub">
          American Christianity claimed to be fighting for America's soul.
          Here is the ledger on every front it picked.
        </p>
        <div className="subst-wars-grid">
          {WARS.map((w, i) => (
            <article key={i} className="subst-war">
              <span className="subst-war-num">{String(i + 1).padStart(2, '0')}</span>
              <h4>{w.war}</h4>
              <p className="subst-war-did">
                <span className="subst-war-tag">Did</span> {w.did}
              </p>
              <p className="subst-war-result">
                <span className="subst-war-tag subst-war-tag-result">Result</span> {w.result}
              </p>
            </article>
          ))}
        </div>
        <p className="subst-wars-kicker">
          Six wars. Six losses. And in the losing, the casualties were
          not its own institutions — the institutions <em>thrived</em>
          on the war. The casualties were the children the war
          produced, that American Christianity refused to receive.
        </p>
      </div>

      {/* The two possibilities */}
      <div className="subst-possibilities">
        <h3 className="subst-heading">Two readings. Both damning.</h3>
        <p className="subst-sub">
          There are only two ways to read this ledger.
        </p>
        <div className="subst-possibilities-grid">
          <article className="subst-possibility">
            <span className="subst-possibility-num">I</span>
            <h4>American Christianity lost the war.</h4>
            <p>
              The most politically mobilized, best-funded, most
              institutionally organized Christian movement in history —
              with 380,000 buildings, $124 billion per year, majority-
              Christian populations in most states, and friendly Supreme
              Courts — was unable to prevent contraception, divorce,
              pornography, cohabitation, out-of-wedlock birth, abortion,
              family collapse, or the rise of a Gen Z with 1% biblical
              worldview.
            </p>
            <p className="subst-possibility-k">
              If the war was real and American Christianity fought sincerely, this
              is the most comprehensive institutional defeat in American
              religious history.
            </p>
          </article>
          <article className="subst-possibility">
            <span className="subst-possibility-num">II</span>
            <h4>American Christianity wrote it.</h4>
            <p>
              By accepting contraception in the 1960s, remaining silent
              on abortion until 1980, divorcing at pagan rates, consuming
              pornography at near-pagan rates, abandoning Psalm 127 in
              practice while quoting it from the pulpit, and building
              consumer empires instead of covenantal communities —
              American Christianity was <em>enabling</em> the collapse
              it claimed to oppose.
            </p>
            <p className="subst-possibility-k">
              The 70,418 legally-free children waiting — and the 368,000
              in care tonight — are not collateral damage of a lost war.
              They are the predictable consequence of a theology that had
              already surrendered.
            </p>
          </article>
        </div>
        <p className="subst-possibilities-kicker">
          Either reading is damning. There is no third reading in which
          the ledger clears.
        </p>
      </div>

      {/* The Christian-nation paradox */}
      <div className="subst-nation">
        <h3 className="subst-heading">The "Christian nation" paradox</h3>
        <p className="subst-sub">
          American Christianity has spent seventy-five years calling this
          a Christian nation. In 2026, the ledger is this.
        </p>
        <ul className="subst-nation-grid" role="list">
          {NATION_LEDGER.map((n, i) => (
            <li key={i}>
              <span className="subst-nation-n">{n.n}</span>
              <span className="subst-nation-lbl">{n.lbl}</span>
              {n.sub && <span className="subst-nation-sub">{n.sub}</span>}
            </li>
          ))}
        </ul>
        <p className="subst-nation-kicker">
          This is not a Christian nation. It is a nation with
          <strong> 380,000 Christian buildings</strong> and a fostering
          rate <strong>indistinguishable from unbelief</strong>. A
          nation's Christianity is not measured by the size of its
          Sunday gathering. It is measured by the lives inside it —
          the marriages kept, the children received, the strangers
          welcomed, the widow and the orphan protected (James 1:27).
          <br /><br />
          By that measure — the only measure the Bible actually uses —
          America stopped being a Christian nation a long time ago.
        </p>
      </div>

      {/* The closer — the whole site rests on this sentence. */}
      <div className="subst-final">
        <p className="subst-final-eyebrow">The closer</p>
        <blockquote className="subst-final-quote">
          <span className="subst-final-line">American Christianity is in debt.</span>
          <span className="subst-final-line">They are in debt to all of the children.</span>
          <span className="subst-final-line subst-final-kicker">Crystal clear.</span>
        </blockquote>
      </div>

      <SourceDetails citations={CITATIONS} />
    </section>
  );
}
