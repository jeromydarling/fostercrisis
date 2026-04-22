// Part VIII — The Wound Inside the Wound.
//
// Sexual abuse and mental-health collapse among American foster children.
// The causal engine of Part VII (the pipeline): the girl sexually abused
// in a foster home at 13 is the young woman pregnant by 19 and the inmate
// at 24. The 11-year-old with suicidality is the 16-year-old runaway and
// the 17-year-old trafficking victim. One story, not two.
//
// Anchored to church_mirror_section_11.md in the repo root.

import { SourceDetails, type Citation } from './SourceDetails';

interface Stat {
  figure: string;
  label: string;
  sub: string;
  source: string;
}

const HEADLINE_STATS: Stat[] = [
  {
    figure: '4×',
    label: 'more likely sexually abused',
    sub: 'than the general population. In group homes: 28×.',
    source: 'Benedict & Zuravin, Johns Hopkins',
  },
  {
    figure: '1 in 4',
    label: 'girls reported abuse',
    sub: 'actual or attempted sexual abuse in the one foster home they lived in longest.',
    source: 'Casey / Fanshel 1990',
  },
  {
    figure: '2×',
    label: 'combat veterans',
    sub: 'PTSD rate among former foster youth. 25% in the previous 12 months.',
    source: 'Casey NWAS (Harvard / UM)',
  },
  {
    figure: '~80%',
    label: 'mental-health disorder',
    sub: 'of children in foster care. Vs. ~20% in the general population.',
    source: 'NIH PMC / Mental Health Virginia',
  },
  {
    figure: '41%',
    label: 'suicidal ideation',
    sub: 'of 17-year-olds in California foster care. 23.5% had attempted.',
    source: 'CalYOUTH / Chapin Hall',
  },
  {
    figure: '80%',
    label: 'of alumni fail',
    sub: 'Only 20% of Casey Northwest alumni were classified as "doing well."',
    source: 'NCCPR / Casey NWAS',
  },
];

const ABUSE_SELF_REPORT = [
  {
    label: 'Oregon / Washington foster alumni',
    body: '~1 in 3 reported being abused by a foster parent or another adult in a foster home. The study didn\'t even ask about the most common form — foster children abusing each other.',
  },
  {
    label: 'Casey Northwest Alumni Study',
    body: '~1 in 3 of alumni reported abuse by a foster parent or another adult in the foster home.',
  },
  {
    label: 'Retrospective review of girls in care',
    body: '81% had been sexually abused (before and/or during care); 68% by more than one perpetrator; 95% had been neglected.',
  },
  {
    label: 'Baltimore case-records study',
    body: '28% of foster homes studied had documented abuse — more than 1 in 4.',
  },
];

const DIAGNOSIS_COMPARE = [
  { label: 'Major depression', foster: 19.0, general: 11.9 },
  { label: 'PTSD', foster: 13.4, general: 5.2 },
  { label: 'Conduct disorder', foster: 20.7, general: 7.0 },
  { label: 'ADHD', foster: 15.1, general: 4.5 },
];

const CITATIONS: Citation[] = [
  {
    label: 'Benedict & Zuravin, Johns Hopkins (1992)',
    note: 'Foster children ~4× more likely to be sexually abused; group-home children ~28× more likely. Via NCCPR issue paper.',
    href: 'https://nccpr.org/nccpr-issue-paper-1-foster-care-vs-family-preservation-the-track-record-for-safety-and-well-being/',
    display: 'nccpr.org',
  },
  {
    label: 'Spencer & Knudsen, Indiana',
    note: '3× more physical abuse and 2× more sexual abuse in foster homes than the general population; 10× / 28× in group homes.',
    href: 'https://nccpr.org/nccpr-issue-paper-1-foster-care-vs-family-preservation-the-track-record-for-safety-and-well-being/',
    display: 'nccpr.org',
  },
  {
    label: 'Fanshel et al., Casey alumni, Columbia UP 1990',
    note: '24% of girls in Casey Family Program reported actual or attempted sexual abuse — counting only the one foster home they lived in longest.',
    href: 'https://www.casey.org/northwest-alumni-study/',
    display: 'casey.org',
  },
  {
    label: 'Hobbs, Hobbs & Wynne — Leeds, UK (1999)',
    note: 'Foster children 7–8× more likely to be assessed for abuse; foster parents were perpetrators in 41% of cases. Via Illinois CFRC.',
    href: 'https://www.cfrc.illinois.edu/pubs/rp_20010501_ChildMaltreatmentInFosterCareAStudyOfRetrospectiveReporting.pdf',
    display: 'cfrc.illinois.edu',
  },
  {
    label: 'Tittle, Poertner, Garnier — Illinois CFRC',
    note: 'Baltimore case-record review (296 foster homes, 5 years): 48% of confirmed maltreatment was sexual abuse; foster parent was the perpetrator in 64%.',
    href: 'https://www.cfrc.illinois.edu/pubs/rp_20010501_ChildMaltreatmentInFosterCareAStudyOfRetrospectiveReporting.pdf',
    display: 'cfrc.illinois.edu',
  },
  {
    label: 'Pecora et al., Casey NWAS (2005)',
    note: 'Northwest Foster Care Alumni Study: PTSD at 2× the rate of Iraq War veterans; 25% past-12-month prevalence. Only 20% of alumni classified as "doing well."',
    href: 'https://www.thecrimson.com/article/2005/4/11/study-finds-foster-kids-suffer-ptsd/',
    display: 'thecrimson.com',
  },
  {
    label: 'Seattle Times coverage of Casey NWAS',
    note: 'Former foster youth face PTSD at twice the rate of combat veterans — study coverage.',
    href: 'https://www.seattletimes.com/seattle-news/study-ex-foster-children-face-big-hurdles/',
    display: 'seattletimes.com',
  },
  {
    label: 'NIH PMC — Mental Health Services for Children in Foster Care',
    note: 'Up to 80% with significant behavioral or mental-health problems; age-matched comparisons (depression, PTSD, conduct, ADHD); CFOMH Study data.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3061347/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Mental Health Virginia / VDSS synthesis',
    note: 'Foster children 5× more likely to have anxiety, 7× more likely to have depression than children outside the welfare system.',
    href: 'https://mentalhealthvirginia.org/disparities-in-mental-health-care-among-virginias-foster-children/',
    display: 'mentalhealthvirginia.org',
  },
  {
    label: 'Ballard Brief, BYU — Sexual Abuse of Children in the U.S. Foster Care System',
    note: 'Lifetime prevalence estimates; females 19.5% / males 10.4% reporting abuse while in foster care; predators\' own descriptions of target-child profile.',
    href: 'https://ballardbrief.byu.edu/issue-briefs/sexual-abuse-of-children-in-the-united-states-foster-care-system',
    display: 'ballardbrief.byu.edu',
  },
  {
    label: 'Courtney et al., CalYOUTH — via NIH PMC',
    note: '40.9% of California 17-year-olds in foster care reported suicidal ideation; 23.5% reported a suicide attempt by 17.',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9838394/',
    display: 'pmc.ncbi.nlm.nih.gov',
  },
  {
    label: 'Chapin Hall — Prevalence of Mental Health Disorders in CalYOUTH',
    note: 'Over 50% of CalYOUTH 17-year-olds had a current positive diagnosis for one or more mental/behavioral health disorder.',
    href: 'https://www.chapinhall.org/research/prevalence-of-mental-health-disorders-suggests-youth-reaching-age-of-majority-in-foster-care-need-special-attention/',
    display: 'chapinhall.org',
  },
  {
    label: 'The Imprint — "Suicide looms large in minds of many foster youth" (2020)',
    note: 'Foster children ~4× more likely to attempt suicide than other children; >25% of Denver-area 9–11-year-olds in foster care had a history of suicidality.',
    href: 'https://imprintnews.org/childrens-mental-health/suicide-looms-large-minds-many-foster-youth/47755',
    display: 'imprintnews.org',
  },
  {
    label: 'Ahrens et al. 2012 — ScienceDirect (2024 review)',
    note: 'Lifetime prevalence of sexual abuse among foster youth: 27%.',
    href: 'https://www.sciencedirect.com/science/article/abs/pii/S0145213424000334',
    display: 'sciencedirect.com',
  },
  {
    label: 'PubMed 2009 — Retrospective review of girls in foster care',
    note: '81% sexually abused before and/or during care; 68% by more than one perpetrator; 95% had been neglected.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/19550260/',
    display: 'pubmed.ncbi.nlm.nih.gov',
  },
  {
    label: 'HHS Child Welfare Outcomes — Florida',
    note: 'Florida\'s FY2020–FY2024 official reports claim <0.1% maltreatment per year — 30–100× lower than what outside researchers find via child self-report.',
    href: 'https://cwoutcomes.acf.hhs.gov/cwodatasite/byState/florida/',
    display: 'cwoutcomes.acf.hhs.gov',
  },
  {
    label: 'NCCPR — 80 percent failure analysis of Casey NWAS',
    note: 'Only 20% of Casey Northwest alumni were "doing well." Even with every fixable policy problem solved, that number reaches only 22.2%.',
    href: 'https://nccpr.org/80-percent-falure-a-brief-analysis-of-the-casey-family-programs-northwest-foster-care-alumni-study/',
    display: 'nccpr.org',
  },
];

export function WoundSection() {
  return (
    <section className="wound-section" id="wound">
      <div className="wound-hero">
        <p className="wound-eyebrow">Part VIII · The Wound Inside the Wound</p>
        <h2 className="wound-title">
          The system <span className="wound-underline">recreates</span> the
          wound it was built to heal.
        </h2>
        <p className="wound-lede">
          Part VII described the downstream — prison, homelessness,
          trafficking, early parenthood. This is what happens to foster
          children while they are still <em>inside</em> the system.
          <br /><br />
          Foster children are sexually abused at multiples of the
          general-population rate. The mental-health collapse that
          follows is so severe that foster alumni carry PTSD at
          <strong> twice the rate of U.S. combat veterans</strong>.
          <br /><br />
          These children live a hell on earth. The receipts are below.
        </p>
      </div>

      <div className="wound-headline-stats">
        <h3 className="wound-heading">Six numbers that should stop every sermon cold</h3>
        <ul className="wound-stats-grid" role="list">
          {HEADLINE_STATS.map((s) => (
            <li key={s.label} className="wound-stat">
              <span className="wound-stat-figure">{s.figure}</span>
              <span className="wound-stat-label">{s.label}</span>
              <span className="wound-stat-sub">{s.sub}</span>
              <span className="wound-stat-source">{s.source}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="wound-abuse">
        <h3 className="wound-heading">
          Inside the house they were sent to for safety.
        </h3>
        <p className="wound-sub">
          When outside researchers interview foster children directly,
          the reported abuse rates are 30&ndash;100× higher than what
          states officially report. The federal system is designed to
          protect the bureaucracy, not the child.
        </p>
        <ul className="wound-abuse-list" role="list">
          {ABUSE_SELF_REPORT.map((a) => (
            <li key={a.label} className="wound-abuse-item">
              <span className="wound-abuse-label">{a.label}</span>
              <p className="wound-abuse-body">{a.body}</p>
            </li>
          ))}
        </ul>

        <div className="wound-targeting">
          <p className="wound-targeting-eyebrow">What child molesters said when asked directly</p>
          <blockquote className="wound-targeting-quote">
            They target &ldquo;children who do not have many friends and
            who appear to lack confidence, to have low self-esteem, and to
            be unhappy and emotionally needy.&rdquo;
          </blockquote>
          <p className="wound-targeting-punch">
            — a near-perfect description of a foster child mid-placement.
            The system gathers these children into facilities, places them
            with strangers, moves them every few months, and is shocked
            when 24% of the girls report sexual abuse.
          </p>
        </div>
      </div>

      <div className="wound-mental">
        <h3 className="wound-heading">
          The mental-health collapse.
        </h3>
        <p className="wound-sub">
          Foster adolescents vs. the general population, age-matched —
          from the Casey Field Office Mental Health Study via NIH PMC.
        </p>
        <ul className="wound-compare-list" role="list">
          {DIAGNOSIS_COMPARE.map((d) => (
            <li key={d.label} className="wound-compare-item">
              <span className="wound-compare-label">{d.label}</span>
              <div className="wound-compare-bars">
                <div className="wound-compare-row">
                  <span className="wound-compare-who">Foster</span>
                  <div className="wound-compare-track">
                    <div
                      className="wound-compare-fill wound-compare-fill-foster"
                      style={{ width: `${(d.foster / 25) * 100}%` }}
                      aria-hidden
                    />
                  </div>
                  <span className="wound-compare-pct">{d.foster.toFixed(1)}%</span>
                </div>
                <div className="wound-compare-row">
                  <span className="wound-compare-who">General</span>
                  <div className="wound-compare-track">
                    <div
                      className="wound-compare-fill wound-compare-fill-general"
                      style={{ width: `${(d.general / 25) * 100}%` }}
                      aria-hidden
                    />
                  </div>
                  <span className="wound-compare-pct">{d.general.toFixed(1)}%</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="wound-ptsd">
          <p className="wound-ptsd-line">
            <strong>Former foster children suffer PTSD at roughly 2× the
            rate of Iraq War veterans.</strong>{' '}
            25% of alumni had PTSD in the previous 12 months. Among
            sexually abused foster children specifically: 60%. Among
            alumni with depression: 94% had comorbid PTSD.
          </p>
          <p className="wound-ptsd-kicker">
            We send 19-year-olds to war and call it service. We send
            3-year-olds to foster care and call it care.<br />
            <em>The 3-year-olds come home more traumatized.</em>
          </p>
        </div>
      </div>

      <div className="wound-suicide">
        <h3 className="wound-heading">Suicide: the numbers no one wants to cite.</h3>
        <div className="wound-suicide-grid">
          <div className="wound-suicide-card">
            <span className="wound-suicide-n">40.9%</span>
            <span className="wound-suicide-lbl">
              of 17-year-olds in California foster care reported suicidal ideation.
            </span>
            <span className="wound-suicide-vs">vs. 12% general adolescent</span>
          </div>
          <div className="wound-suicide-card">
            <span className="wound-suicide-n">23.5%</span>
            <span className="wound-suicide-lbl">
              reported a <strong>suicide attempt</strong> by age 17.
            </span>
            <span className="wound-suicide-vs">vs. 2.5% general adolescent</span>
          </div>
          <div className="wound-suicide-card">
            <span className="wound-suicide-n">&gt;25%</span>
            <span className="wound-suicide-lbl">
              of 9-to-11-year-olds in Denver-area foster care have a
              history of suicidality.
            </span>
            <span className="wound-suicide-vs">Ages 9&ndash;11.</span>
          </div>
        </div>
        <p className="wound-suicide-kicker">
          One in four California 17-year-olds in foster care has already
          tried to kill themselves. The American Church is arguing about
          whether to modernize the sanctuary lighting.
        </p>
      </div>

      <div className="wound-chain">
        <h3 className="wound-heading">
          This section produces the last section.
        </h3>
        <p className="wound-chain-body">
          Part VIII is not a separate tragedy. It is the causal engine
          of Part VII. The girl sexually abused in a foster home at 13
          is the young woman pregnant by 19 and the inmate at 24. The
          11-year-old with suicidality is the 16-year-old runaway and
          the 17-year-old trafficking victim.
        </p>
        <p className="wound-chain-kicker">
          These are one story.
        </p>
      </div>

      <div className="wound-indictment">
        <p className="wound-indictment-eyebrow">The indictment</p>
        <blockquote className="wound-indictment-quote">
          <span className="wound-indictment-line">
            Every theologian who ever preached on the problem of evil was,
            unknowingly, standing next to the answer.
          </span>
          <span className="wound-indictment-line">
            It is a 13-year-old girl whose foster father has a key to her
            room. It is an 11-year-old boy who has already thought about
            how he would do it if he ever did it.
          </span>
          <span className="wound-indictment-line wound-indictment-kicker">
            The wounds are not abstractions.
          </span>
        </blockquote>
      </div>

      <SourceDetails citations={CITATIONS} />
    </section>
  );
}
