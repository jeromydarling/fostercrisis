// Canonical timeline data consumed by <TimelineSection />.
//
// This is the nerds' view of the whole argument — every series the site
// makes a case with, plotted on a single 1620 → 2030 axis with era
// shading and event pins. One source of truth; change a number here
// and the timeline re-renders.

export interface SeriesPoint {
  year: number;
  value: number;
}

export interface Series {
  id: string;
  label: string;
  unit: string;
  color: string;
  /** Values to format with (e.g. a TFR of "2.1", a percent of "40%"). */
  format: (v: number) => string;
  /** Raw data points. Sort not required; the component sorts on mount. */
  points: SeriesPoint[];
  /** Which direction means "worse"/"revolution" — used to tint the fill. */
  direction: 'down' | 'up';
  /** Short source caption for the legend. */
  source: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  body: string;
  kind: 'church' | 'culture' | 'crisis' | 'baseline';
}

export interface Era {
  start: number;
  end: number;
  label: string;
  /** CSS fill color (use rgba with low alpha). */
  fill: string;
}

export const TIMELINE_MIN = 1620;
export const TIMELINE_MAX = 2030;

// Series ---------------------------------------------------------------
export const SERIES: Series[] = [
  {
    id: 'tfr',
    label: 'Christian fertility — children per woman',
    unit: 'TFR',
    color: '#f7e26b',
    direction: 'down',
    format: (v) => v.toFixed(1),
    source: 'Haines; Pew 2025; Perry & Schleifer 2019',
    points: [
      { year: 1650, value: 9.0 },
      { year: 1700, value: 8.5 },
      { year: 1790, value: 8.0 },
      { year: 1800, value: 7.0 },
      { year: 1835, value: 7.0 },
      { year: 1850, value: 5.4 },
      { year: 1900, value: 3.8 },
      { year: 1935, value: 2.1 },
      { year: 1957, value: 3.77 },
      { year: 1972, value: 2.89 },
      { year: 1976, value: 1.70 },
      { year: 1990, value: 2.4 },
      { year: 2000, value: 2.3 },
      { year: 2010, value: 2.2 },
      { year: 2016, value: 2.5 },
      { year: 2024, value: 2.2 },
    ],
  },
  {
    id: 'worldview',
    label: 'Biblical worldview — % of U.S. adults',
    unit: '%',
    color: '#e6a42a',
    direction: 'down',
    format: (v) => v.toFixed(0) + '%',
    source: 'Barna / CRC AWVI 1992–2026',
    points: [
      { year: 1992, value: 12 },
      { year: 2000, value: 10 },
      { year: 2010, value: 8 },
      { year: 2016, value: 6 },
      { year: 2023, value: 4 },
      { year: 2026, value: 4 },
    ],
  },
  {
    id: 'foster',
    label: 'U.S. foster-care census — thousands',
    unit: 'K',
    color: '#ff5252',
    direction: 'up',
    format: (v) => v.toFixed(0) + 'K',
    source: 'AFCARS · historical child-welfare data',
    points: [
      { year: 1950, value: 250 },
      { year: 1960, value: 275 },
      { year: 1968, value: 290 },
      { year: 1970, value: 310 },
      { year: 1975, value: 395 },
      { year: 1980, value: 300 },
      { year: 1990, value: 400 },
      { year: 1999, value: 567 },
      { year: 2010, value: 400 },
      { year: 2018, value: 437 },
      { year: 2024, value: 329 },
    ],
  },
  {
    id: 'unwed',
    label: 'Births to unmarried women — % of U.S. births',
    unit: '%',
    color: '#ffb347',
    direction: 'up',
    format: (v) => v.toFixed(0) + '%',
    source: 'CDC NCHS · Brookings historical',
    points: [
      { year: 1950, value: 3 },
      { year: 1960, value: 5 },
      { year: 1970, value: 11 },
      { year: 1980, value: 18 },
      { year: 1990, value: 28 },
      { year: 2000, value: 33 },
      { year: 2010, value: 41 },
      { year: 2020, value: 40 },
      { year: 2023, value: 40 },
    ],
  },
  {
    id: 'divorce',
    label: 'U.S. divorce rate — per 1,000 population',
    unit: '/1k',
    color: '#c43a5b',
    direction: 'up',
    format: (v) => v.toFixed(1),
    source: 'CDC NVSS · historical vital statistics',
    points: [
      { year: 1920, value: 1.6 },
      { year: 1940, value: 2.0 },
      { year: 1950, value: 2.5 },
      { year: 1960, value: 2.2 },
      { year: 1970, value: 3.5 },
      { year: 1980, value: 5.2 },
      { year: 1990, value: 4.7 },
      { year: 2000, value: 4.0 },
      { year: 2010, value: 3.6 },
      { year: 2020, value: 2.3 },
      { year: 2024, value: 2.9 },
    ],
  },
];

// Events ---------------------------------------------------------------
export const EVENTS: TimelineEvent[] = [
  { year: 1620, title: 'Plymouth Colony lands', kind: 'baseline',
    body: 'Puritan households average 7–11 children. Orphaned cousins are absorbed as a matter of covenant.' },
  { year: 1776, title: 'Declaration of Independence', kind: 'baseline',
    body: 'American fertility roughly 8. Church attendance is effectively universal in the new republic.' },
  { year: 1854, title: 'Orphan Trains begin', kind: 'baseline',
    body: '~250,000 urban orphans will be placed with rural Protestant families over the next 75 years — families that already averaged 5–8 biological children.' },
  { year: 1935, title: 'Social Security Act', kind: 'baseline',
    body: 'Aid to Dependent Children establishes the federal architecture that becomes the modern foster-care system.' },
  { year: 1957, title: 'Baby Boom peak', kind: 'baseline',
    body: 'American TFR hits 3.77. The last pre-Pill generation is born. Pews are full; the country is post-war religious.' },
  { year: 1959, title: 'Billy Graham shrugs at the Pill', kind: 'church',
    body: 'The leading evangelical of the century tells reporters: "nothing in the Bible which would forbid birth control." Protestant cover is in place.' },
  { year: 1960, title: 'FDA approves the Pill', kind: 'culture',
    body: 'For the first time in human history, sex can be reliably severed from procreation, unilaterally, by the woman. May 9, 1960.' },
  { year: 1965, title: 'Griswold v. Connecticut', kind: 'culture',
    body: 'Supreme Court legalizes contraception for married couples. The last legal brake is dismantled.' },
  { year: 1968, title: 'Humanae Vitae', kind: 'church',
    body: 'Pope Paul VI reaffirms Catholic opposition to contraception. Not a single major Protestant voice joins him.' },
  { year: 1969, title: 'First no-fault divorce law', kind: 'culture',
    body: 'Reagan signs California\'s no-fault divorce law. By 1985, every state follows.' },
  { year: 1970, title: 'PC(USA) endorses abortion on demand', kind: 'church',
    body: 'The Presbyterian Church (U.S.A.) endorses "mass contraceptive techniques" and "low-cost abortion on demand" in a single resolution.' },
  { year: 1971, title: 'SBC votes for legal abortion', kind: 'church',
    body: 'Southern Baptist Convention passes a resolution calling for legalized abortion — two years before Roe.' },
  { year: 1973, title: 'Roe v. Wade', kind: 'culture',
    body: 'Abortion legalized nationwide. Most evangelical leaders call it "a Catholic issue" and stay quiet for the next five to seven years.' },
  { year: 1977, title: 'UCC celebrates "androgyny"', kind: 'church',
    body: 'United Church of Christ declares access to contraception and abortion matters of justice. Mainline capitulation complete.' },
  { year: 1980, title: 'SBC reverses on abortion', kind: 'church',
    body: 'The Southern Baptist Convention finally adopts a resolution against abortion. Nine years after calling for it. Seven years after Roe.' },
  { year: 1992, title: 'AWVI baseline — 12%', kind: 'baseline',
    body: 'Barna\'s first major Biblical Worldview survey: 12% of Americans hold a biblical worldview.' },
  { year: 1999, title: 'Foster-care census peak', kind: 'crisis',
    body: 'The U.S. foster-care system reaches its all-time high: 567,000 children in state custody.' },
  { year: 2016, title: 'Conservative Protestant TFR = 2.5', kind: 'crisis',
    body: 'Down 16% from 1972 — the fastest percentage decline of any Christian tradition.' },
  { year: 2024, title: 'AWVI = 4%, Gen Z = 1%', kind: 'crisis',
    body: 'Biblical worldview falls to 4% of all adults, 1% among Gen Z. 70,418 children legally free and waiting for a family.' },
];

// Eras ------------------------------------------------------------------
export const ERAS: Era[] = [
  { start: 1620, end: 1776, label: 'Puritan · Colonial', fill: 'rgba(139, 69, 19, 0.07)' },
  { start: 1776, end: 1900, label: 'Early Republic · Industrial', fill: 'rgba(207, 100, 38, 0.06)' },
  { start: 1900, end: 1945, label: 'Modern · Pre-war', fill: 'rgba(160, 82, 45, 0.05)' },
  { start: 1945, end: 1965, label: 'Post-war revival', fill: 'rgba(247, 226, 107, 0.06)' },
  { start: 1965, end: 1985, label: 'Sexual Revolution', fill: 'rgba(207, 47, 84, 0.09)' },
  { start: 1985, end: 2010, label: 'Culture Wars', fill: 'rgba(145, 47, 90, 0.06)' },
  { start: 2010, end: 2030, label: 'Present', fill: 'rgba(255, 82, 82, 0.06)' },
];
