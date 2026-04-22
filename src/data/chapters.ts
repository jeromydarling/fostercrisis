import type { StateRow } from './states';
import { NATIONAL } from './states';
export type Metric =
  | 'fosterCarePerCapita'
  | 'homesPer100'
  | 'childPoverty'
  | 'overdoseRate'
  | 'pollution'
  | 'missingFromCare'
  | 'capacityGap'
  | 'miseryIndex'
  | 'complicity'
  | 'religiosity'
  | 'obesity'
  | 'revolution'
  | 'pornSession'
  | 'churchSolution';

export type Geography = 'state' | 'county';

export type CountyProp = 'poverty' | 'overdose' | 'misery' | 'complicity';

export interface Chapter {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  metric: Metric;
  /** Which geography drives this chapter's choropleth. */
  geography: Geography;
  /** For county chapters: which property on the county feature to read. */
  countyProp?: CountyProp;
  /** Ramp of hex colors from low → bleak. */
  ramp: string[];
  unit: string;
  headline: string;
  subline: string;
  body: string;
  source: string;
  showChurches?: boolean;
}

export function metricValue(row: StateRow, metric: Metric): number {
  switch (metric) {
    case 'fosterCarePerCapita':
      return (row.fosterCare / row.childPop) * 1000;
    case 'homesPer100':
      return (row.licensedHomes / Math.max(1, row.fosterCare)) * 100;
    case 'childPoverty':
      return row.childPovertyPct;
    case 'overdoseRate':
      return (row.overdoseDeaths / (row.childPop * 4)) * 100000;
    case 'pollution':
      return row.pm25;
    case 'missingFromCare':
      return (row.missingFromCare / Math.max(1, row.fosterCare)) * 100;
    case 'capacityGap':
      return Math.max(0, 100 - (row.licensedHomes / Math.max(1, row.fosterCare)) * 100);
    case 'miseryIndex':
    case 'complicity':
      // These are county-level composites computed in geo.ts; when used
      // as state-level values, fall back to a rough average of poverty
      // and overdose z-space.
      return row.childPovertyPct / 30 + (row.overdoseDeaths / (row.childPop * 4)) * 1000;
    case 'religiosity':
      return row.religiosityPct;
    case 'obesity':
      return row.obesityPct;
    case 'revolution':
      // Composite "revolution" index: divorce rate (per 1k) normalized to
      // 0–50 + unwed-births-% directly. Rough but directional — both
      // signals bend at the same time in the same states.
      return row.divorceRate * 5 + row.unwedBirthPct;
    case 'pornSession':
      return row.pornSessionSec;
    case 'churchSolution':
      return row.congregations / Math.max(1, row.waitingAdoption);
  }
}

export function metricFormat(metric: Metric, v: number): string {
  switch (metric) {
    case 'fosterCarePerCapita':
      return v.toFixed(1) + ' / 1,000 kids';
    case 'homesPer100':
    case 'missingFromCare':
    case 'capacityGap':
    case 'childPoverty':
      return v.toFixed(1) + '%';
    case 'overdoseRate':
      return v.toFixed(1) + ' / 100k';
    case 'pollution':
      return v.toFixed(1) + ' µg/m³ PM2.5';
    case 'miseryIndex':
      return v.toFixed(2) + ' (z-score sum)';
    case 'complicity':
      return v > 0 ? '+' + v.toFixed(0) + ' pts complicity' : v.toFixed(0) + ' pts';
    case 'religiosity':
      return v.toFixed(0) + '% highly religious';
    case 'obesity':
      return v.toFixed(1) + '% obese';
    case 'revolution':
      return v.toFixed(0) + ' pts (divorce + unwed-births)';
    case 'pornSession':
      return `${Math.floor(v / 60)}:${String(Math.round(v % 60)).padStart(2, '0')} avg visit`;
    case 'churchSolution':
      return v.toFixed(1) + ' churches / waiting child';
  }
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'baseline',
    number: 'I',
    title: 'The children nobody sees',
    eyebrow: 'Chapter I — The Baseline',
    metric: 'fosterCarePerCapita',
    geography: 'state',
    ramp: ['#1a1f2b', '#4a3848', '#7a4558', '#b24d5c', '#dc5858', '#ffb347'],
    unit: 'Children in foster care per 1,000 kids',
    headline: '368,530',
    subline: 'children in state custody tonight.',
    body:
      'One in every thousand American children will sleep somewhere tonight that is not a home. A shelter cot. A group ward. A caseworker’s office floor. They did nothing wrong. They are waiting for an adult, any adult, to choose them.',
    source: 'AFCARS FY2023 · U.S. Dept. of Health & Human Services',
  },
  {
    id: 'capacity',
    number: 'II',
    title: 'There are not enough beds',
    eyebrow: 'Chapter II — The Capacity Gap',
    metric: 'capacityGap',
    geography: 'state',
    ramp: ['#1a1f2b', '#3a2a3e', '#6b2f4b', '#a23452', '#cf3a4f', '#ff5252'],
    unit: 'Home shortfall (% gap below 100/100)',
    headline: '57 homes per 100 children',
    subline: 'The math does not work. It was never meant to.',
    body:
      'Nationally there are only 57 licensed foster homes for every 100 children in care. In four years, America lost 25,000 foster homes — from 220,000 to 195,404. Forty-eight states lost a quarter of their group-care providers. The beds are vanishing faster than the children.',
    source: 'Imprint 2024 Foster Care Survey · ACF "A Home for Every Child"',
  },
  {
    id: 'poverty',
    number: 'III',
    title: 'Neglect is a symptom of poverty',
    eyebrow: 'Chapter III — Root Cause: Poverty',
    metric: 'childPoverty',
    geography: 'county',
    countyProp: 'poverty',
    ramp: ['#1a1f2b', '#2f2a43', '#542c5a', '#873463', '#c43a5b', '#ff4d4d'],
    unit: 'Child poverty rate (%) — by county',
    headline: '1 in 6 American children',
    subline: 'live in poverty. In Mississippi, it’s more than 1 in 4.',
    body:
      'A hungry family is not an unsafe family — but state law often cannot tell the difference. 117 U.S. counties have child-poverty rates above 40%, and 81% of those counties sit in the American South. The kids removed for "neglect" overwhelmingly come from neighborhoods that society neglected first.',
    source: 'Census SAIPE 2022 · county-level SAEPOVRT0_17_PT',
  },
  {
    id: 'opioids',
    number: 'IV',
    title: 'The drug map is the foster map',
    eyebrow: 'Chapter IV — Root Cause: Overdose',
    metric: 'overdoseRate',
    geography: 'county',
    countyProp: 'overdose',
    ramp: ['#1a1f2b', '#2d2748', '#4e2a60', '#892f6a', '#c72f54', '#ff3838'],
    unit: 'Overdose deaths per 100,000 — by county',
    headline: '39.1%',
    subline: 'of foster removals in 2021 were caused by parental drug abuse.',
    body:
      'A 10% rise in county overdose deaths predicts a 4.4% rise in foster-care entries twelve months later. For infants under age 1, more than half of all removals are drug-related. The opioid map is not a parallel tragedy — it is the pipeline itself.',
    source: 'CDC Provisional County-Level Drug Overdose Deaths',
  },
  {
    id: 'pollution',
    number: 'V',
    title: 'The air they breathe',
    eyebrow: 'Chapter V — Root Cause: Pollution',
    metric: 'pollution',
    geography: 'state',
    ramp: ['#1a1f2b', '#2a2a48', '#4b2d5c', '#873468', '#c73b5a', '#ff8a3a'],
    unit: 'Annual mean PM2.5 (µg/m³) — EPA',
    headline: '9 µg/m³',
    subline:
      'is the WHO safe limit. Half of U.S. states exceed it. The heaviest air sits on top of the same counties filling the foster system.',
    body:
      'Lead paint in pre-1978 housing, diesel particulates on Delta and Rust Belt corridors, PM2.5 from coal-fired grids — the environmental insults that derail child development do not spread evenly. They concentrate in exactly the ZIP codes where poverty, addiction, and foster-care removal already concentrate. Prenatal PM2.5 exposure is linked to low birth weight, asthma, and neurodevelopmental delay. Blood-lead levels above 5 µg/dL remain common in Appalachia, the Delta, and industrial Midwest counties. The air and the water are part of the pipeline.',
    source: 'EPA EJScreen 2024 · EPA AQS annual mean PM2.5',
  },
  {
    id: 'missing',
    number: 'VI',
    title: 'The children who disappear',
    eyebrow: 'Chapter VI — Missing From Care',
    metric: 'missingFromCare',
    geography: 'state',
    ramp: ['#14151c', '#28182f', '#501a4b', '#901f55', '#d1244d', '#ff2b2b'],
    unit: 'Runaway / missing rate (% of foster census)',
    headline: '23,160',
    subline: 'children reported missing from care in 2024.',
    body:
      '86% of child sex-trafficking victims reported to NCMEC were in the child welfare system at the time. In one 70-city FBI sting, six of every ten children recovered came from foster or group homes. The foster system is not just failing these children — it is the single largest feeder into the American trafficking industry.',
    source: 'NCMEC 2024 Impact Report · FBI / Congressional Record',
  },
  {
    id: 'belt',
    number: 'VII',
    title: 'The Bible Belt is the foster belt',
    eyebrow: 'Chapter VII — The Mirror',
    metric: 'religiosity',
    geography: 'state',
    ramp: ['#14151c', '#312040', '#5e2756', '#972f5c', '#cd3a53', '#ffb347'],
    unit: '% of adults who are "highly religious" (Pew RLS)',
    headline: 'The most Christian states',
    subline: 'are the states where foster children are hungriest, highest-count, and most forgotten.',
    body:
      'Overlay the Pew religiosity map on the foster-children map and the borders match. Alabama, Arkansas, Louisiana, Mississippi, Oklahoma, Tennessee, West Virginia — the reddest pews produce the longest waiting lists. This is not a coincidence. It is a mirror American Christianity has refused to look into.',
    source: 'Pew Research Religious Landscape Study',
  },
  {
    id: 'weight',
    number: 'VIII',
    title: 'The discipline went to food',
    eyebrow: 'Chapter VIII — The Weight',
    metric: 'obesity',
    geography: 'state',
    ramp: ['#14151c', '#2c1f3a', '#5a2450', '#912e52', '#c73745', '#ffb347'],
    unit: 'Adult obesity rate (%) — CDC BRFSS',
    headline: 'The same map a third time.',
    subline: 'The most-churched states are also the heaviest. Discipline left the table and went to the table.',
    body:
      'Baptists have the highest obesity rate of any religious group in America (30%). Jews: 1%. Muslims: 0.7%. When alcohol and tobacco are discouraged but food is not, food becomes the last socially-sanctioned vice. The physical body of American Christianity is a map of misdirected discipline — and it is the same map where the foster children are waiting.',
    source: 'CDC BRFSS 2022 · Purdue/Ferraro denominational study',
  },
  {
    id: 'revolution',
    number: 'IX',
    title: 'The revolution\'s map',
    eyebrow: 'Chapter IX — The Sexual Revolution',
    metric: 'revolution',
    geography: 'state',
    ramp: ['#14151c', '#2a1428', '#541a3a', '#8f2440', '#c72f38', '#ffb347'],
    unit: 'Revolution Index · divorce + unwed births',
    headline: 'The Bible Belt divorces, too.',
    subline: 'And has its babies out of wedlock. And fills its foster homes. The revolution won inside the sanctuary first.',
    body:
      'Mississippi is the most religious state in America and has the highest unwed-birth rate (52%). Louisiana is third-most religious; half its births are outside of marriage. Arkansas — 70% "highly religious" — has the second-highest divorce rate in the country. American Christianity did not hold a line here. It adopted the package and then preached against it. The children born into that contradiction are the ones now in foster care.',
    source: 'CDC NVSS divorce 2022 · CDC NCHS unwed births 2022',
  },
  {
    id: 'quiethour',
    number: 'X',
    title: 'The quiet hour',
    eyebrow: 'Chapter X — What the Bible Belt watches',
    metric: 'pornSession',
    geography: 'state',
    ramp: ['#14151c', '#261636', '#4e1a48', '#8f245a', '#c72f54', '#ffb347'],
    unit: 'Average Pornhub visit duration (seconds)',
    headline: 'Mississippi watches the longest.',
    subline: 'Every year, in every annual Pornhub Insights report. The most religious state stays the longest.',
    body:
      'The authoritative source on this is the only one that owns the telemetry: Pornhub. In their 2014–2019 "State of the Union" Insights series, Mississippi ranked #1 every time. Louisiana, Alabama, Arkansas, Oklahoma — the same Bible Belt states that ranked highest in religiosity, obesity, unwed births, and foster-care demand — also watched the longest. The private life of American Christianity is documented by the website American Christianity preaches against.',
    source: 'Pornhub Insights · 2014–2019 U.S. State-of-the-Union series',
  },
  {
    id: 'misery',
    number: 'XI',
    title: 'The misery map',
    eyebrow: 'Chapter XI — The Misery Index',
    metric: 'miseryIndex',
    geography: 'county',
    countyProp: 'misery',
    ramp: ['#11131a', '#2a1f3a', '#572450', '#922a54', '#d9334d', '#ff4a2b'],
    unit: 'Composite misery score (higher = worse)',
    headline: 'The same map. Every time.',
    subline: 'Poverty. Overdose. Disability. Despair. They draw the same borders.',
    body:
      'Layer child poverty over overdose deaths over poor-health days over disability rates, and the map does not scatter — it coheres. The same counties light up, decade after decade. These are the places our children come from. This is where the entry point to foster care opens.',
    source: 'County Health Rankings · Census SAIPE · CDC NCHS · ACS disability',
  },
  {
    id: 'complicity',
    number: 'XII',
    title: 'Churches are right there',
    eyebrow: 'Chapter XII — Complicity',
    metric: 'miseryIndex',
    geography: 'county',
    countyProp: 'misery',
    ramp: ['#11131a', '#2a1f3a', '#572450', '#922a54', '#d9334d', '#ff4a2b'],
    unit: 'Misery score with Christian congregations overlaid',
    headline: 'The pews are not empty.',
    subline: 'They are next door to the suffering. They look away.',
    body:
      'This is the same misery map, with every Christian congregation in America dropped on top. In the Delta, in Appalachia, in South Texas, in the Rust Belt — the churches are not missing. They are right there. The capacity to end the foster waitlist exists. It is standing on every corner. It is choosing not to act.',
    source: 'HIFLD All Places of Worship · County Health Rankings · AFCARS',
    showChurches: true,
  },
  // Final chapter uses id='solution' and the state-framing helper below
  // rewrites its headline for the selected state.
  {
    id: 'solution',
    number: 'XIII',
    title: 'What the pews could end overnight',
    eyebrow: 'Chapter XIII — The Solution',
    metric: 'churchSolution',
    geography: 'state',
    ramp: ['#3d0a1a', '#6d1728', '#a1302a', '#cf6426', '#e6a42a', '#f7e26b'],
    unit: 'Christian congregations per waiting child',
    headline: '380,000 churches · ~100 families each',
    subline:
      'Families foster. Congregations surround. One family per church says yes — the waitlist ends 5× over, and every fostering family has 99 more standing with them.',
    body:
      `Congregations don't adopt. Families adopt. A congregation's job is to wrap itself around that family: meals for a year, babysitting, tutoring, rides, mentors for the kids, money when the state is slow, counsel for the marriage, and presence in the hardest week. There are roughly ${NATIONAL.congregations.toLocaleString()} Christian congregations in the United States, averaging around 100 families each — tens of millions of American Christian households. 368,000 children are in foster care tonight. ${NATIONAL.waitingAdoption.toLocaleString()} are legally free and waiting for a forever family. ~700,000 cycle through this system in a given year. If just one family in every congregation said yes — one — the legally-free waitlist would disappear five times over, and every one of those fostering families would have ninety-nine more wrapped around them. That is what pure religion looks like. James 1:27.`,
    source: '2020 U.S. Religion Census · HIFLD Places of Worship · AFCARS',
    showChurches: true,
  },
];

export interface Framing {
  eyebrow: string;
  title: string;
  headline: string;
  subline: string;
  body: string;
}

const nf = (n: number) => Math.round(n).toLocaleString();

/**
 * Reframe a chapter's copy around a specific state when the viewer has
 * drilled in. Falls back to national framing by returning undefined.
 */
export function frameForState(chapter: Chapter, row: StateRow): Framing {
  const name = row.name;
  const homes = row.licensedHomes;
  const kids = row.fosterCare;
  const homesPer100 = (homes / Math.max(1, kids)) * 100;
  const odRate = (row.overdoseDeaths / Math.max(1, row.childPop * 4)) * 100000;
  const churchesPerChild = row.congregations / Math.max(1, row.waitingAdoption);
  const povertyKids = Math.round(row.childPop * row.childPovertyPct / 100);

  const base = {
    eyebrow: chapter.eyebrow,
    title: chapter.title,
  };

  switch (chapter.id) {
    case 'baseline':
      return {
        ...base,
        headline: nf(kids),
        subline: `children in ${name} custody tonight.`,
        body: `Across ${name}, ${nf(kids)} children will sleep somewhere tonight that is not a home. That is ${(kids / row.childPop * 1000).toFixed(1)} out of every 1,000 children in the state. They did nothing wrong. They are waiting for an adult, any adult, to choose them.`,
      };
    case 'capacity':
      return {
        ...base,
        headline: `${homesPer100.toFixed(0)} homes / 100 kids`,
        subline: `${name} has ${nf(homes)} licensed foster homes for ${nf(kids)} children in care.`,
        body: `If every licensed foster home in ${name} took in one child, ${nf(Math.max(0, kids - homes))} would still be without a family. The math doesn't work here either. It was never meant to.`,
      };
    case 'poverty':
      return {
        ...base,
        headline: `${row.childPovertyPct.toFixed(0)}%`,
        subline: `of ${name} children live in poverty.`,
        body: `That is roughly ${nf(povertyKids)} kids in ${name} living below the poverty line. A hungry family is not an unsafe family — but state law often cannot tell the difference. This is where the entry point to foster care opens.`,
      };
    case 'opioids':
      return {
        ...base,
        headline: nf(row.overdoseDeaths),
        subline: `drug overdose deaths in ${name} last year (~${odRate.toFixed(0)} per 100k).`,
        body: `A 10% rise in county overdose deaths predicts a 4.4% rise in foster-care entries twelve months later. For infants under age 1, more than half of all removals in ${name} are drug-related. The opioid map is not a parallel tragedy — it is the pipeline.`,
      };
    case 'pollution': {
      const pm = row.pm25;
      const overLimit = pm > 9;
      return {
        ...base,
        headline: `${pm.toFixed(1)} µg/m³`,
        subline: overLimit
          ? `${name}'s air sits above the WHO safe limit of 9 µg/m³.`
          : `${name} is at or below the WHO safe limit of 9 µg/m³.`,
        body: `${name}'s annual mean PM2.5 is ${pm.toFixed(1)} µg/m³ (EPA AQS). The heaviest pollution in any state does not spread evenly — it concentrates on the same ZIP codes where poverty, addiction, and foster-care removal already concentrate. Lead paint, diesel corridors, and prenatal particulate exposure are part of the pipeline into the system.`,
      };
    }
    case 'missing':
      return {
        ...base,
        headline: `~${nf(row.missingFromCare)}`,
        subline: `${name} children reported missing from care in 2024.`,
        body: `86% of child sex-trafficking victims reported to NCMEC nationally were in the child welfare system at the time. ${name}'s share of that pipeline runs through group homes, shelter placements, and the children no one knew where to put.`,
      };
    case 'belt':
      return {
        ...base,
        headline: `${row.religiosityPct}% highly religious`,
        subline: `${name} is more religious than ${Math.round(((row.religiosityPct - 55) / 55) * 100)}% of the national average — and its foster waitlist is ${nf(row.waitingAdoption)}.`,
        body: `${nf(row.congregations)} congregations across ${name}. ${row.religiosityPct}% of adults pray daily, attend weekly, and say religion is very important. ${nf(row.waitingAdoption)} of the state's children are waiting for a family. The reddest pews produce the longest waiting lists. This is the mirror.`,
      };
    case 'weight':
      return {
        ...base,
        headline: `${row.obesityPct.toFixed(1)}%`,
        subline: `of ${name} adults are obese. The state ranks ${row.obesityPct >= 35 ? 'among the heaviest in the nation' : 'near the national average'}.`,
        body: `In ${name}, ${row.obesityPct.toFixed(1)}% of adults are obese while ${nf(kids)} children wait in state custody. Physical discipline is the first kind of discipline. It is not accidentally missing here — it is a symptom of the same disordered priorities that leave foster homes empty.`,
      };
    case 'revolution':
      return {
        ...base,
        headline: `${row.unwedBirthPct}% unwed · ${row.divorceRate.toFixed(1)} / 1k divorced`,
        subline: `${name} is ${row.religiosityPct}% "highly religious" — and still broke this way.`,
        body: `${row.unwedBirthPct}% of ${name}'s babies are born outside of marriage. ${row.divorceRate.toFixed(1)} divorces per 1,000 residents. And ${row.religiosityPct}% of adults call themselves "highly religious." The sexual revolution didn't skip ${name}. It was adopted inside the sanctuary first, and the children born into the contradiction are the ones waiting for a foster family tonight.`,
      };
    case 'quiethour': {
      const mm = Math.floor(row.pornSessionSec / 60);
      const ss = String(Math.round(row.pornSessionSec % 60)).padStart(2, '0');
      return {
        ...base,
        headline: `${mm}:${ss} per visit`,
        subline: `What ${name} actually does in private — Pornhub's own data.`,
        body: `Pornhub Insights has published the numbers: ${name}'s average visitor stays ${mm}:${ss}. The state is also ${row.religiosityPct}% "highly religious." The private life of American Christianity is measured by the website American Christianity preaches against, and the website is keeping better records than American Christianity is.`,
      };
    }
    case 'misery':
      return {
        ...base,
        headline: name,
        subline: `Poverty + overdose + poor health + disability — the same counties every time.`,
        body: `Zoom the misery map anywhere in ${name} and the same counties keep lighting up, decade after decade. These are the places ${name}'s foster children come from. This is where the entry point opens.`,
      };
    case 'complicity':
      return {
        ...base,
        headline: `${nf(row.congregations)} churches`,
        subline: `in ${name}. ${nf(row.waitingAdoption)} children are waiting for a family.`,
        body: `Every Christian congregation in ${name} is a dot on this map. They are not missing. They stand in the Delta, in Appalachia, in the suburbs, in the city. The capacity to end ${name}'s foster waitlist is already here. It is choosing not to act.`,
      };
    case 'solution':
      return {
        ...base,
        headline: `${nf(row.congregations)} churches`,
        subline: `in ${name} · ~${nf(row.congregations * 100)} families worth of community. ${nf(row.waitingAdoption)} children legally free and waiting. ${nf(row.fosterCare)} in care tonight.`,
        body: `${nf(row.congregations)} Christian congregations across ${name} — roughly ${nf(row.congregations * 100)} families of covenant community. Families foster. Congregations surround. If one family in every ${name} congregation said yes, and every other family in that congregation said yes to supporting them — meals, babysitters, tutors, rides, mentors for the kids — the state's legally-free waitlist would disappear ${churchesPerChild.toFixed(0)} times over, and every fostering family would have ninety-nine more standing with them. That is the math that actually works. James 1:27.`,
      };
    default:
      return {
        ...base,
        headline: chapter.headline,
        subline: chapter.subline,
        body: chapter.body,
      };
  }
}
