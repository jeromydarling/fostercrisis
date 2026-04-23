// Part XI — The Grave.
//
// The mortality coda. In-care deaths, the aging-out cliff, the adult
// mortality shadow through midlife, and the Swedish natural experiment.
// Ends on the pro-life hinge: "Why fight so hard for the unborn only to
// abandon the born?"
//
// Anchored to church_mirror_section_14.md in the repo root.

import { SourceDetails, type Citation } from './SourceDetails';
import { Prayer } from './Prayer';
import { PledgeCalendar } from './PledgeCalendar';
import { PRAYERS } from '../data/prayers';
import { EssayEpigraph } from './EssayEpigraph';
import { EPIGRAPHS } from '../data/epigraphs';
import { Md, MdInline, parseBlocks } from './Md';
import { Shareable } from './Shareable';
import rawContent from '../../content/grave.md?raw';

/** Editable prose lives in `content/grave.md`. The parser splits that
 *  file into named blocks keyed by `## blockId`. Everything structural
 *  (stat arrays, cards, citations, the Sweden visual) stays in this
 *  file; everything prose-y comes from the markdown. */
const C = parseBlocks(rawContent);

interface Stat {
  figure: string;
  label: string;
  sub: string;
  source: string;
}

const HEADLINE_STATS: Stat[] = [
  {
    figure: '42%',
    label: 'higher in-care mortality',
    sub: 'U.S. children currently in foster care vs. the general child population. 2003–2016 AFCARS, 8.3M person-years.',
    source: 'JAMA Pediatrics 2020',
  },
  {
    figure: '2.2×',
    label: 'adult all-cause mortality',
    sub: 'Adults with any history of state care as children, pooled across 13 cohort studies. n = 3,223,580.',
    source: 'Lancet Public Health 2022',
  },
  {
    figure: '3.35×',
    label: 'adult suicide rate',
    sub: 'Even after adjusting for pre-placement adversity. Effect persists into midlife.',
    source: 'Lancet Public Health 2022',
  },
  {
    figure: '8.6% / 1.8%',
    label: 'dead by age 20',
    sub: 'Swedish foster-placed vs. comparably maltreated children left at home. 21,000-case register.',
    source: 'Sweden register study',
  },
  {
    figure: '26.4%',
    label: 'suicidality by age 11',
    sub: 'U.S. children aged 9–11 entering foster care. Roughly 5× the general-population rate at that age.',
    source: 'Child Maltreatment 2014',
  },
  {
    figure: '~34',
    label: 'excess in-care deaths · year',
    sub: 'U.S. children who, at general-population mortality rates, would not have died this year.',
    source: 'AFCARS + JAMA Peds math',
  },
];

const CAUSES = [
  {
    label: 'Suicide',
    body:
      'The single biggest driver of excess mortality in every register study. 3.35× the general-population rate in the meta-analysis.',
  },
  {
    label: 'Accidental overdose',
    body:
      'Foster alumni have dramatically higher rates of substance-use disorder. The opioid epidemic that fills foster beds also empties them on the back end.',
  },
  {
    label: 'Homicide & violent death',
    body:
      'Alumni are concentrated in the housing and community situations where violent victimization is highest.',
  },
  {
    label: 'Accidents',
    body:
      'Motor-vehicle deaths especially — tracking unstable housing, unlicensed driving, risky behavior in young adulthood.',
  },
  {
    label: 'Cardiovascular · metabolic',
    body:
      'The biological reading on the chronic-illness findings of Part IX. Alumni enter midlife with 2–3× the rate of heart disease, stroke, diabetes.',
  },
  {
    label: 'Cancer',
    body:
      'Elevated, especially smoking- and alcohol-related cancers. Less studied but consistent with the allostatic-load pattern.',
  },
];

const CITATIONS: Citation[] = [
  {
    label: 'Sakai, Lin, Flaherty et al. — JAMA Pediatrics (2020)',
    note: 'All-Cause Mortality Among Children in the US Foster Care System, 2003–2016. The anchor U.S. study: 35.4 vs 25.0 deaths per 100k person-years; IRR 1.42.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7171576/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'PolicyLab / Children\'s Hospital of Philadelphia — press release on Sakai et al.',
    note: 'Plain-English summary of the JAMA Pediatrics findings.',
    href: 'https://policylab.chop.edu/press-releases/first-its-kind-study-finds-children-foster-care-more-likely-die-children-overall-us',
    display: 'policylab.chop.edu',
  },
  {
    label: 'Batty et al. — The Lancet Public Health (2022)',
    note: 'Systematic review and meta-analysis, n = 3,223,580. 2.21× total mortality; 3.35× suicide. Effect persists into midlife after adjusting for pre-placement adversity.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9595443/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'UCL Linking Our Lives — ONS Longitudinal Study (UK)',
    note: '42-year follow-up of 1971–2001 UK care leavers. 70% higher premature mortality; elevated rates of unnatural death.',
    href: 'https://blogs.ucl.ac.uk/linking-our-lives/tag/foster-care/',
    display: 'blogs.ucl.ac.uk',
  },
  {
    label: 'NCCPR (2025) — Swedish 21,000-case register study',
    note: '8.6% of foster-placed vs 1.8% of comparably maltreated children left at home dead by age 20. ~4.8× mortality, driven by suicide.',
    href: 'https://www.nccprblog.org/2025/10/death-at-early-age-swedish-study-finds.html',
    display: 'nccprblog.org',
  },
  {
    label: 'Vinnerljung & Ribe (2001) — Swedish mortality study',
    note: 'Excess mortality in young-adult former foster children.',
    href: 'https://onlinelibrary.wiley.com/doi/abs/10.1111/1468-2397.00169',
    display: 'onlinelibrary.wiley.com',
  },
  {
    label: 'Vinnerljung, Hjern & Lindblad (2006)',
    note: 'Suicide attempts and severe psychiatric morbidity among former child welfare clients — Swedish national cohort.',
    href: 'https://acamh.onlinelibrary.wiley.com/doi/abs/10.1111/j.1469-7610.2005.01530.x',
    display: 'acamh.onlinelibrary.wiley.com',
  },
  {
    label: 'Anderson et al. — Child Maltreatment (2014)',
    note: '515 children aged 9–11 who entered foster care within the prior year. 26.4% suicidality history; 4.1% imminently suicidal.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4319651/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Katz et al. / CalYOUTH via The Imprint (2024)',
    note: '24% attempted suicide, 40% considered, among CA foster youth. LGBTQ+ foster youth 2–4× higher.',
    href: 'https://imprintnews.org/top-stories/foster-youth-are-at-great-risk-for-suicide-as-they-prepare-to-leave-the-system-california-study-finds/256210',
    display: 'imprintnews.org',
  },
  {
    label: 'Illinois Youth Survey analysis — SSWR 2025',
    note: 'Foster youth 13–19 are ~4× more likely to have seriously considered suicide in the past 12 months than peers in two-parent households.',
    href: 'https://sswr.confex.com/sswr/2025/webprogram/Paper58766.html',
    display: 'sswr.confex.com',
  },
  {
    label: 'Wayne State — Longitudinal Outcomes of Youth Who Age Out (dissertation)',
    note: 'U.S. Surgeon General lists former foster youth among the populations at highest suicide risk in America.',
    href: 'https://digitalcommons.wayne.edu/cgi/viewcontent.cgi?article=2938&context=oa_dissertations',
    display: 'digitalcommons.wayne.edu',
  },
  {
    label: 'Puls et al. — JAMA Network Open (2025)',
    note: 'Foster Care and Child Maltreatment Mortality Rates in the US, 2010–2023. Updated time-series through 2023.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12754682/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Child Welfare Monitor (2024)',
    note: 'NCANDS undercounts child-maltreatment fatalities by a factor of 2–3.',
    href: 'https://childwelfaremonitor.org/2024/05/07/a-jumble-of-standards-how-state-and-federal-authorities-have-underestimated-child-maltreatment-fatalities/',
    display: 'childwelfaremonitor.org',
  },
  {
    label: 'Casey Family Programs — National Alumni Study',
    note: 'Comorbidity and mental-health outcomes among U.S. foster alumni.',
    href: 'https://www.casey.org/national-alumni-study/',
    display: 'casey.org',
  },
  {
    label: 'Public Health Post (2020) — Fostering Mortality',
    note: 'Accessible summary of premature-death trends across the foster-care literature.',
    href: 'https://publichealthpost.org/health-equity/fostering-mortality/',
    display: 'publichealthpost.org',
  },
  {
    label: 'Pecora et al. (2008) — Harvard / Casey enhanced-care comparison',
    note: 'Therapeutic foster care reduced adult chronic illness by ~50% vs. standard public programs — proof the system is unevenly survivable.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/18519820/',
    display: 'pubmed.ncbi.nlm.nih.gov',
  },
  {
    label: 'AFCARS FY2024 / National Council for Adoption',
    note: 'Anchor population figures — 329,000 children in care; ~506,000 served annually.',
    href: 'https://adoptioncouncil.org/article/foster-care-and-adoption-statistics/',
    display: 'adoptioncouncil.org',
  },
];

export function GraveSection() {
  return (
    <section className="grave-section" id="grave">
      <EssayEpigraph epigraph={EPIGRAPHS.grave} />

      <div className="grave-hero">
        <p className="grave-eyebrow">Part XI · The Grave</p>
        <h2 className="grave-title">
          <MdInline>{C.heroTitle}</MdInline>
        </h2>
        <Md className="grave-lede">{C.heroLede}</Md>
      </div>

      {/* Six numbers */}
      <Shareable label="Part XI · Six numbers that end arguments" className="grave-headline-stats">
        <h3 className="grave-heading">
          <MdInline>{C.statsHeading}</MdInline>
        </h3>
        <ul className="grave-stats-grid" role="list">
          {HEADLINE_STATS.map((s) => (
            <li key={s.label} className="grave-stat">
              <span className="grave-stat-figure">{s.figure}</span>
              <span className="grave-stat-label">{s.label}</span>
              <span className="grave-stat-sub">{s.sub}</span>
              <span className="grave-stat-source">{s.source}</span>
            </li>
          ))}
        </ul>
      </Shareable>

      {/* In-care mortality */}
      <div className="grave-incare">
        <h3 className="grave-heading">
          <MdInline>{C.inCareHeading}</MdInline>
        </h3>
        <Md className="grave-body">{C.inCareBody}</Md>
        <div className="grave-incare-callout">
          <Md>{C.inCareCalloutBody}</Md>
          <p className="grave-incare-kicker">
            <MdInline>{C.inCareKicker}</MdInline>
          </p>
        </div>
      </div>

      {/* Aging-out cliff */}
      <div className="grave-cliff">
        <h3 className="grave-heading">
          <MdInline>{C.cliffHeading}</MdInline>
        </h3>
        <p className="grave-sub">
          <MdInline>{C.cliffSub}</MdInline>
        </p>
        <ul className="grave-cliff-list" role="list">
          <li>
            <span className="grave-cliff-fig">~24%</span>
            <span className="grave-cliff-body">
              of California foster youth have <strong>attempted suicide</strong>,
              compared to ~2% of U.S. young adults ages 18–25.
            </span>
          </li>
          <li>
            <span className="grave-cliff-fig">40%</span>
            <span className="grave-cliff-body">
              have seriously considered it — vs. 11% of the general young-adult population.
            </span>
          </li>
          <li>
            <span className="grave-cliff-fig">26.4%</span>
            <span className="grave-cliff-body">
              of 9-to-11-year-olds entering foster care already have a{' '}
              <strong>history of suicidality</strong>. 4.1% are imminently
              suicidal at the moment of assessment.
            </span>
          </li>
          <li>
            <span className="grave-cliff-fig">~4×</span>
            <span className="grave-cliff-body">
              more likely to have seriously considered suicide than peers
              in two-parent households (Illinois Youth Survey, 13–19-year-olds).
            </span>
          </li>
        </ul>
        <p className="grave-cliff-note">
          <MdInline>{C.cliffNote}</MdInline>
        </p>
      </div>

      {/* The shadow */}
      <div className="grave-shadow">
        <h3 className="grave-heading">
          <MdInline>{C.shadowHeading}</MdInline>
        </h3>
        <Md className="grave-body">{C.shadowBody}</Md>
        <ul className="grave-shadow-list" role="list">
          <li>
            <span className="grave-shadow-fig">2.21×</span>
            <span>total adult mortality among adults with any history of state care as children</span>
          </li>
          <li>
            <span className="grave-shadow-fig">3.35×</span>
            <span>adult suicide mortality — and the effect was <em>stronger</em> in higher-quality studies</span>
          </li>
          <li>
            <span className="grave-shadow-fig">Midlife</span>
            <span>the elevated mortality extended into the 40s, 50s, and 60s. This is not just young people dying soon after aging out.</span>
          </li>
          <li>
            <span className="grave-shadow-fig">Adjusted</span>
            <span>the association persisted even after controlling for early-life poverty, parental mental illness, parental incarceration, and parental substance use</span>
          </li>
        </ul>
        <blockquote className="grave-shadow-quote">
          <MdInline>{C.shadowQuoteBody}</MdInline>
          <cite>— <MdInline>{C.shadowQuoteCite}</MdInline></cite>
        </blockquote>
        <p className="grave-shadow-kicker">
          <MdInline>{C.shadowKicker}</MdInline>
        </p>
      </div>

      {/* Swedish natural experiment — two bars */}
      <Shareable label="Part XI · The Swedish experiment" className="grave-sweden">
        <h3 className="grave-heading">
          <MdInline>{C.swedenHeading}</MdInline>
        </h3>
        <p className="grave-sub">
          <MdInline>{C.swedenSub}</MdInline>
        </p>
        <div className="grave-sweden-bars" aria-label="Mortality by age 20 comparison">
          <div className="grave-sweden-bar grave-sweden-bar-home">
            <span className="grave-sweden-pct">1.8%</span>
            <div className="grave-sweden-track">
              <div className="grave-sweden-fill" style={{ height: '21%' }} aria-hidden />
            </div>
            <span className="grave-sweden-label">Left at home</span>
            <span className="grave-sweden-sub">after agency contact</span>
          </div>
          <div className="grave-sweden-bar grave-sweden-bar-care">
            <span className="grave-sweden-pct">8.6%</span>
            <div className="grave-sweden-track">
              <div className="grave-sweden-fill" style={{ height: '100%' }} aria-hidden />
            </div>
            <span className="grave-sweden-label">Removed to care</span>
            <span className="grave-sweden-sub">~4.8× the mortality</span>
          </div>
        </div>
        <Md className="grave-sweden-note">{C.swedenNote}</Md>
      </Shareable>

      {/* Why they die */}
      <div className="grave-causes">
        <h3 className="grave-heading">
          <MdInline>{C.causesHeading}</MdInline>
        </h3>
        <ul className="grave-causes-grid" role="list">
          {CAUSES.map((c) => (
            <li key={c.label} className="grave-cause">
              <span className="grave-cause-label">{c.label}</span>
              <p className="grave-cause-body">{c.body}</p>
            </li>
          ))}
        </ul>
        <Md className="grave-causes-kicker">{C.causesKicker}</Md>
      </div>

      {/* The single number */}
      <Shareable label="Part XI · Hundreds of thousands" className="grave-toll">
        <h3 className="grave-heading">
          <MdInline>{C.tollHeading}</MdInline>
        </h3>
        <p className="grave-toll-figure">
          <MdInline>{C.tollFigure}</MdInline>
        </p>
        <p className="grave-toll-frame">
          <MdInline>{C.tollFrame}</MdInline>
        </p>
        <div className="grave-toll-misery">
          <p>
            <MdInline>{C.tollMiseryIntro}</MdInline>
          </p>
          <p>
            <MdInline>{C.tollMiseryBody}</MdInline>
          </p>
          <p className="grave-toll-misery-kicker">
            <MdInline>{C.tollMiseryKicker}</MdInline>
          </p>
        </div>
      </Shareable>

      {/* Indictment */}
      <Shareable label="Part XI · The indictment" className="grave-indictment">
        <p className="grave-indictment-eyebrow">The indictment</p>
        <blockquote className="grave-indictment-quote">
          <span className="grave-indictment-line">
            <MdInline>{C.indictmentLine1}</MdInline>
          </span>
          <span className="grave-indictment-line">
            <MdInline>{C.indictmentLine2}</MdInline>
          </span>
          <span className="grave-indictment-line grave-indictment-question">
            <MdInline>{C.indictmentQuestion}</MdInline>
          </span>
        </blockquote>
      </Shareable>

      <Prayer prayer={PRAYERS.grave} />
      <Prayer prayer={PRAYERS.graveDepths} />
      <PledgeCalendar />
      <SourceDetails citations={CITATIONS} />
    </section>
  );
}
