// Part IX — The Body Keeps the Score.
//
// Chronic illness, allostatic load, ACE mechanism, and early death
// among foster care alumni — decades after they leave the system.
// Completes the three-section biological cascade:
//   VIII Wound (inside the system — abuse + suicide)
//   VII  Pipeline (near-term downstream — prison + trafficking)
//   IX   Score (decades later — heart disease, diabetes, early death)
//
// Anchored to church_mirror_section_12.md in the repo root.

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
    figure: '7×',
    label: 'chronic-condition rate',
    sub: 'Former foster youth age 25–26: 8.7% with a chronic condition. Economically secure peers: 1.2%.',
    source: 'Pediatrics 2014',
  },
  {
    figure: '2–3×',
    label: 'heart disease, cancer, respiratory',
    sub: 'Odds for adults with 4+ ACEs. By definition of removal, almost every foster child qualifies.',
    source: 'JAMA Network Open 2021',
  },
  {
    figure: '40%',
    label: 'overweight or obese',
    sub: 'of long-term foster children. In group homes: 60%.',
    source: 'NIH PMC 2010 (MCHJ)',
  },
  {
    figure: '+11%',
    label: 'diabetes per ACE point',
    sub: 'Each 1-point increase in ACE score → ~11% greater odds of type-2 diabetes.',
    source: 'Current Diabetes Reports',
  },
  {
    figure: '10 yrs',
    label: 'older biologically',
    sub: 'Shortened telomeres, advanced DNA methylation clocks, accelerated cellular aging. Measurable at 25.',
    source: 'Biorxiv / Psychotherapy & Psychosomatics',
  },
  {
    figure: '50%',
    label: 'fewer chronic disorders',
    sub: 'When foster care is funded correctly — low caseloads, trained workers. Proof this is policy, not destiny.',
    source: 'Harvard / Casey 2008',
  },
];

// Pediatrics 2014 — the definitive prospective comparison. 596 former
// foster youth vs. 1,461 economically secure + 456 economically insecure
// peers from the National Longitudinal Study of Adolescent Health.
// Ages 25–26.
const PEDS_COMPARE = [
  { label: 'Any chronic condition', secure: 1.2, insecure: 3.5, foster: 8.7, scaleMax: 10 },
  { label: 'No / nonprivate insurance', secure: 19, insecure: 30, foster: 41, scaleMax: 45 },
  { label: 'On Medicaid', secure: 5, insecure: 20, foster: 41, scaleMax: 45 },
];

const CITATIONS: Citation[] = [
  {
    label: 'Pediatrics 2014 — Chronic Health Conditions and Former Foster Youth',
    note: 'Prospective comparison of 596 former foster youth vs. 1,461 economically secure + 456 economically insecure peers from Add Health. Source for the 8.7% chronic-condition rate and the "beyond economic insecurity" finding.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4243069/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Turney & Wildeman (2016) — Foster care and child health, UC Irvine',
    note: '2011–2012 National Survey of Children\'s Health. Foster-involved children: 2× asthma/obesity, 3× hearing/vision, 7× depression, etc.',
    href: 'https://news.uci.edu/2016/10/17/foster-care-children-at-much-greater-risk-of-physical-mental-health-problems/',
    display: 'news.uci.edu',
  },
  {
    label: 'Felitti et al. (1998) — The original ACE Study',
    note: 'Kaiser Permanente / CDC. Established the dose-response relationship between childhood adversity and nearly every major cause of adult death.',
    href: 'https://www.cdc.gov/violenceprevention/aces/about.html',
    display: 'cdc.gov/violenceprevention',
  },
  {
    label: 'JAMA Network Open (2021) — ACE meta-analysis',
    note: '≥4 ACEs vs. none: 2–3× odds of heart disease, cancer, respiratory disease; 3–6× odds of mental illness; 2.03× multimorbidity.',
    href: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2785394',
    display: 'jamanetwork.com',
  },
  {
    label: 'Current Diabetes Reports — ACEs and type-2 diabetes',
    note: 'Multi-country (England, Saudi Arabia, WHO 10-country). ~3× diabetes odds with 4+ ACEs; ~11% greater odds per ACE point.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5292871/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'JACC Advances (2025) — ACE-burden and ischemic heart disease',
    note: '1.3–1.7× increased risk of ischemic heart disease per unit increase in ACE score; CHD patients 1.24× composite outcome per ACE point.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12145704/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Journal of Health Care for the Poor and Underserved (2021) — dose-response chronic disease',
    note: 'Monotonic stepwise increase in depression, COPD, heart attack, stroke, diabetes, cancer, digestive disease with each additional ACE.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8462987/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Biorxiv / Columbia (2022) — Allostatic load and cellular aging',
    note: 'Chronic stress-hormone exposure shortens telomeres, advances DNA methylation clocks. Biological aging measurable at cellular level.',
    href: 'https://www.biorxiv.org/content/10.1101/2022.02.22.481548.full',
    display: 'biorxiv.org',
  },
  {
    label: 'Psychotherapy and Psychosomatics (2023) — Pediatric allostatic load review',
    note: 'Children separated from parents or exposed to ACEs have significantly elevated allostatic load scores, predicting worse physical health and working-memory deficits.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10716875/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'BMJ Open (2019) — Allostatic load mediation',
    note: 'Early allostatic load in foster youth mediates later cardiovascular disease, metabolic syndrome, cognitive decline, accelerated aging.',
    href: 'https://bmjopen.bmj.com/content/9/7/e030339',
    display: 'bmjopen.bmj.com',
  },
  {
    label: 'Maternal and Child Health Journal / NIH PMC (2010) — Obesity in foster care',
    note: '40% long-term foster kids overweight/obese; 60% in group homes. Psychotropic medications contribute to weight gain.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3586377/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Jackson (2008) — Casey National Foster Care Alumni Study',
    note: 'Comorbidity stack: 98% of alumni with depression had comorbid mental illness; 89.9% had comorbid physical health problems; 82% of alumni with PTSD had co-occurring physical ailments.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3061347/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Pecora et al. (2008) — Harvard / Casey enhanced-care study',
    note: 'Quasi-experimental comparison of private model program vs. public programs (OR/WA). Private-program alumni: ~50% fewer adult major depression / substance use disorders; significantly fewer cardiometabolic disorders.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/18519820/',
    display: 'pubmed.ncbi.nlm.nih.gov',
  },
  {
    label: 'Casey Family Programs Northwest Alumni Study',
    note: 'PTSD at ~2× Iraq War veterans; only ~20% of alumni classified as "doing well."',
    href: 'https://www.casey.org/northwest-alumni-study/',
    display: 'casey.org',
  },
  {
    label: 'Van der Kolk (2014) — The Body Keeps the Score',
    note: 'The foundational clinical text on trauma\'s biological imprint; title and framing of this section borrow from it.',
    href: 'https://www.besselvanderkolk.com/resources/the-body-keeps-the-score',
    display: 'besselvanderkolk.com',
  },
];

export function BodySection() {
  return (
    <section className="score-section" id="score">
      <EssayEpigraph epigraph={EPIGRAPHS.score} />
      <div className="score-hero">
        <p className="score-eyebrow">Part IX · The Body Keeps the Score</p>
        <h2 className="score-title">
          The wound is now a <span className="score-underline">coronary</span>.
        </h2>
        <p className="score-lede">
          Part VIII showed what the system does to children while they are
          inside it. Part VII showed what it does to them shortly after they
          leave. This is what it does to them <strong>30, 40, and 50 years later.</strong>
          <br /><br />
          Every removal, every abuse, every placement, every dose of a
          psychotropic lands somewhere in the endocrine and cardiovascular
          systems. By age 25, a foster alum’s bloodwork reads a decade
          older than their peers. By 55, the hospital bill is due.
          <br /><br />
          <em>The body of a foster alum is a biological ledger. The receipts
          are in this section.</em>
        </p>
      </div>

      <div className="score-headline-stats">
        <h3 className="score-heading">Six numbers that close the indictment</h3>
        <ul className="score-stats-grid" role="list">
          {HEADLINE_STATS.map((s) => (
            <li key={s.label} className="score-stat">
              <span className="score-stat-figure">{s.figure}</span>
              <span className="score-stat-label">{s.label}</span>
              <span className="score-stat-sub">{s.sub}</span>
              <span className="score-stat-source">{s.source}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pediatrics 2014 — the definitive prospective evidence */}
      <div className="score-peds">
        <h3 className="score-heading">
          It isn’t poverty doing this. It’s foster care.
        </h3>
        <p className="score-sub">
          The single most important study in this section. Harvard /
          University of Washington researchers prospectively tracked three
          groups from late adolescence to ages 25&ndash;26:{' '}
          <strong>596 former foster youth</strong>,{' '}
          <strong>1,461 economically secure peers</strong>, and{' '}
          <strong>456 economically insecure peers</strong> from Add Health.
          The economically insecure group had elevated risk on two outcomes.
          The foster group had elevated risk on <em>nearly every outcome
          measured</em>.
        </p>

        <ul className="score-peds-list" role="list">
          {PEDS_COMPARE.map((row) => (
            <li key={row.label} className="score-peds-item">
              <span className="score-peds-label">{row.label}</span>
              <div className="score-peds-bars">
                <div className="score-peds-row">
                  <span className="score-peds-who">Econ. secure</span>
                  <div className="score-peds-track">
                    <div
                      className="score-peds-fill score-peds-fill-secure"
                      style={{ width: `${(row.secure / row.scaleMax) * 100}%` }}
                      aria-hidden
                    />
                  </div>
                  <span className="score-peds-pct">{row.secure.toFixed(1)}%</span>
                </div>
                <div className="score-peds-row">
                  <span className="score-peds-who">Econ. insecure</span>
                  <div className="score-peds-track">
                    <div
                      className="score-peds-fill score-peds-fill-insecure"
                      style={{ width: `${(row.insecure / row.scaleMax) * 100}%` }}
                      aria-hidden
                    />
                  </div>
                  <span className="score-peds-pct">{row.insecure.toFixed(1)}%</span>
                </div>
                <div className="score-peds-row">
                  <span className="score-peds-who">Former foster</span>
                  <div className="score-peds-track">
                    <div
                      className="score-peds-fill score-peds-fill-foster"
                      style={{ width: `${(row.foster / row.scaleMax) * 100}%` }}
                      aria-hidden
                    />
                  </div>
                  <span className="score-peds-pct">{row.foster.toFixed(1)}%</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="score-peds-note">
          <strong>The foster gap exceeds the poverty gap.</strong> A child
          removed from poverty into foster care ends up sicker than a child
          left in poverty. The system that was supposed to rescue them
          poisoned them slower.
        </p>
      </div>

      {/* ACE mechanism — the cascade from trauma to disease */}
      <div className="score-mechanism">
        <h3 className="score-heading">How adversity becomes disease.</h3>
        <p className="score-sub">
          The Kaiser / CDC ACE Study (1998) established a dose-response
          relationship between childhood trauma and nearly every major
          cause of adult death. Nearly every foster child has 4+ ACEs by
          the very act of being removed.
        </p>
        <ol className="score-cascade" role="list">
          <li>
            <span className="score-cascade-step">Removal · abuse · neglect · placement instability</span>
            <span className="score-cascade-arrow" aria-hidden>↓</span>
          </li>
          <li>
            <span className="score-cascade-step">4+ ACEs on the 10-item questionnaire (usually 7&ndash;10 by adulthood)</span>
            <span className="score-cascade-arrow" aria-hidden>↓</span>
          </li>
          <li>
            <span className="score-cascade-step">Chronic HPA-axis activation · cortisol dysregulation · inflammatory cascade</span>
            <span className="score-cascade-arrow" aria-hidden>↓</span>
          </li>
          <li>
            <span className="score-cascade-step">Shortened telomeres · advanced DNA methylation clocks · accelerated cellular aging</span>
            <span className="score-cascade-arrow" aria-hidden>↓</span>
          </li>
          <li className="score-cascade-final">
            <span className="score-cascade-step">
              Hypertension, type-2 diabetes, ischemic heart disease,
              stroke, cancer, liver &amp; kidney disease — at 40 to 55.
            </span>
          </li>
        </ol>
        <p className="score-mechanism-note">
          &ldquo;Allostatic load&rdquo; is the technical name. In plain English: every
          trauma a child survives, their body files away. The body keeps
          the score.
        </p>
      </div>

      {/* The obesity callout — the slow coronary */}
      <div className="score-obesity">
        <h3 className="score-heading">The slow coronary.</h3>
        <div className="score-obesity-grid">
          <div className="score-obesity-card">
            <span className="score-obesity-n">40%</span>
            <span className="score-obesity-lbl">
              of long-term foster children are overweight or obese.
            </span>
            <span className="score-obesity-vs">vs. 31.7% NHANES general population</span>
          </div>
          <div className="score-obesity-card">
            <span className="score-obesity-n">60%</span>
            <span className="score-obesity-lbl">
              of children in <strong>group homes</strong> are overweight or obese.
            </span>
            <span className="score-obesity-vs">43% are obese at intake.</span>
          </div>
          <div className="score-obesity-card">
            <span className="score-obesity-n">70–80%</span>
            <span className="score-obesity-lbl">
              probability adolescent obesity becomes <strong>adult</strong> obesity.
            </span>
            <span className="score-obesity-vs">Type-2 diabetes, CVD, cancer all compound from it.</span>
          </div>
        </div>
        <p className="score-obesity-kicker">
          We medicate foster children into obesity, then send them into
          adulthood with the coronary risk profile of a 50-year-old.
        </p>
      </div>

      {/* The 50% proof — this is policy, not destiny */}
      <div className="score-proof">
        <p className="score-proof-eyebrow">The proof this is policy, not destiny</p>
        <p className="score-proof-body">
          A 2008 Harvard / Casey quasi-experimental study compared alumni of
          a model private foster-care program with alumni of the two public
          programs in Oregon and Washington. Same demographic. Same intake
          records. Same states.
        </p>
        <ul className="score-proof-list" role="list">
          <li>
            Significantly <strong>fewer</strong> cardiometabolic disorders.
          </li>
          <li>
            Significantly <strong>fewer</strong> ulcers.
          </li>
          <li>
            <strong>~50% fewer</strong> cases of adult major depression.
          </li>
          <li>
            <strong>~50% fewer</strong> substance-use disorders.
          </li>
          <li>
            <strong>44.7% fewer</strong> 12-month mental disorders overall.
          </li>
        </ul>
        <p className="score-proof-kicker">
          When foster care is funded correctly &mdash; low caseloads, trained
          workers, good services &mdash; the disease rate falls by half.
          <br />
          The disease is not destiny. It&rsquo;s policy. And the American
          Church has been silent on the policy for fifty years while the
          hospitals fill with its silence.
        </p>
      </div>

      {/* The three-part cascade synthesis — one child across a lifetime */}
      <div className="score-cascade-synth">
        <p className="score-cascade-synth-eyebrow">
          Parts VIII + VII + IX are one story
        </p>
        <div className="score-cascade-synth-grid">
          <div className="score-cascade-synth-card">
            <span className="score-cascade-synth-roman">VIII</span>
            <span className="score-cascade-synth-title">The Wound</span>
            <span className="score-cascade-synth-sub">
              Abuse. PTSD. Suicide.<br />Inside the system.
            </span>
          </div>
          <span className="score-cascade-synth-arrow" aria-hidden>→</span>
          <div className="score-cascade-synth-card">
            <span className="score-cascade-synth-roman">VII</span>
            <span className="score-cascade-synth-title">The Pipeline</span>
            <span className="score-cascade-synth-sub">
              Prison. Trafficking.<br />Homelessness. Pregnancy.
            </span>
          </div>
          <span className="score-cascade-synth-arrow" aria-hidden>→</span>
          <div className="score-cascade-synth-card">
            <span className="score-cascade-synth-roman">IX</span>
            <span className="score-cascade-synth-title">The Score</span>
            <span className="score-cascade-synth-sub">
              Heart disease. Diabetes.<br />Cancer. Early death.
            </span>
          </div>
        </div>
        <p className="score-cascade-synth-body">
          Same child. Thirteen in a group home. Twenty-one in a prison cell
          or a pregnancy ward. Forty-five in a cardiology clinic. Fifty-eight
          at a funeral.
        </p>
        <p className="score-cascade-synth-kicker">
          These are not three sins. They are one abdication, compounding
          biologically across a human lifetime.
        </p>
      </div>

      {/* Indictment closer */}
      <div className="score-indictment">
        <p className="score-indictment-eyebrow">The indictment</p>
        <blockquote className="score-indictment-quote">
          <span className="score-indictment-line">
            The American Church was offered a binary choice:
          </span>
          <span className="score-indictment-line">
            Take the orphan into your home. Or fund the hospital bed they will occupy at fifty-five.
          </span>
          <span className="score-indictment-line score-indictment-kicker">
            The body keeps the bill. The Church signed the invoice in blank.
          </span>
        </blockquote>
      </div>

      <Prayer prayer={PRAYERS.score} />
      <PledgeCalendar />
      <SourceDetails citations={CITATIONS} />
    </section>
  );
}
