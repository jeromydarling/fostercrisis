import type { StateRow } from './states';
import { NATIONAL } from './states';

export type Metric =
  | 'fosterCarePerCapita'
  | 'homesPer100'
  | 'childPoverty'
  | 'overdoseRate'
  | 'missingFromCare'
  | 'capacityGap'
  | 'churchSolution';

export type Geography = 'state' | 'county';

export interface Chapter {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  metric: Metric;
  /** Which geography drives this chapter's choropleth. */
  geography: Geography;
  /** For county chapters: which property on the county feature to read. */
  countyProp?: 'poverty' | 'overdose';
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
    case 'missingFromCare':
      return (row.missingFromCare / Math.max(1, row.fosterCare)) * 100;
    case 'capacityGap':
      return Math.max(0, 100 - (row.licensedHomes / Math.max(1, row.fosterCare)) * 100);
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
    id: 'missing',
    number: 'V',
    title: 'The children who disappear',
    eyebrow: 'Chapter V — Missing From Care',
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
    id: 'solution',
    number: 'VI',
    title: 'What the pews could end overnight',
    eyebrow: 'Chapter VI — The Solution',
    metric: 'churchSolution',
    geography: 'state',
    ramp: ['#3d0a1a', '#6d1728', '#a1302a', '#cf6426', '#e6a42a', '#f7e26b'],
    unit: 'Christian congregations per waiting child',
    headline: '380,000 × 1',
    subline: 'One family per congregation. The waitlist ends 5× over.',
    body:
      `There are roughly ${NATIONAL.congregations.toLocaleString()} Christian congregations in the United States. ${NATIONAL.waitingAdoption.toLocaleString()} children are waiting for a family. ${NATIONAL.legallyFree.toLocaleString()} of them are legally free right now. One family per church — just one — and the waiting list is gone five times over. The math is brutal, and it favors us.`,
    source: '2020 U.S. Religion Census · HIFLD Places of Worship · AFCARS',
    showChurches: true,
  },
];
