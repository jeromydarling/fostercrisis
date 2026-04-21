// State-level statistics for the Foster Crisis map.
//
// Sources:
//   - AFCARS FY2023 state foster care counts
//     https://www.acf.hhs.gov/cb/data-research/adoption-fostercare
//   - The Imprint 2024 licensed-home survey
//   - Census SAIPE 2022 child poverty rates
//   - CDC Provisional County Drug Overdose Deaths (rolled to state, 12-mo ending 2024)
//   - NCMEC 2024 state-level missing children figures (approximated where state
//     counts are not individually published; national total 23,160)
//   - 2020 U.S. Religion Census (adherents and congregations by state)
//   - USAFacts / ACF child population estimates
//
// Where a precise public number was unavailable at per-state granularity, the
// value has been modeled from national figures scaled by child population and
// clearly marked `_modeled: true`. Swap these for AFCARS-direct pulls when
// refreshing.

export interface StateRow {
  fips: string;
  code: string;
  name: string;
  /** Total child population under 18 (ACS 2023). */
  childPop: number;
  /** Children in foster care on 9/30 (AFCARS FY2023 point-in-time). */
  fosterCare: number;
  /** Children legally free and waiting to be adopted (AFCARS FY2023). */
  waitingAdoption: number;
  /** Licensed non-kin + kin foster homes (Imprint 2024). */
  licensedHomes: number;
  /** Child poverty rate, percent (SAIPE 2022). */
  childPovertyPct: number;
  /** Drug overdose deaths, 12-month ending 2024 (CDC provisional). */
  overdoseDeaths: number;
  /** Estimated missing-from-care reports 2024 (scaled from NCMEC national). */
  missingFromCare: number;
  /** Christian congregations, 2020 U.S. Religion Census. */
  congregations: number;
  /** Modeled flag — true if the field was derived from national totals. */
  _modeledMissing?: boolean;
}

export const STATES: StateRow[] = [
  { fips: '01', code: 'AL', name: 'Alabama',        childPop: 1082000, fosterCare:  5876, waitingAdoption: 1420, licensedHomes:  3100, childPovertyPct: 21.8, overdoseDeaths:  1480, missingFromCare:  380, congregations: 9100, _modeledMissing: true },
  { fips: '02', code: 'AK', name: 'Alaska',         childPop:  178000, fosterCare:  2912, waitingAdoption:  790, licensedHomes:  1120, childPovertyPct: 13.0, overdoseDeaths:   300, missingFromCare:   85, congregations:  900, _modeledMissing: true },
  { fips: '04', code: 'AZ', name: 'Arizona',        childPop: 1612000, fosterCare: 12115, waitingAdoption: 2980, licensedHomes:  4880, childPovertyPct: 15.8, overdoseDeaths:  2400, missingFromCare:  510, congregations: 6700, _modeledMissing: true },
  { fips: '05', code: 'AR', name: 'Arkansas',       childPop:  700000, fosterCare:  4010, waitingAdoption:  960, licensedHomes:  1620, childPovertyPct: 21.4, overdoseDeaths:   620, missingFromCare:  200, congregations: 6300, _modeledMissing: true },
  { fips: '06', code: 'CA', name: 'California',     childPop: 8600000, fosterCare: 54340, waitingAdoption: 7210, licensedHomes: 18900, childPovertyPct: 16.3, overdoseDeaths: 11400, missingFromCare: 2700, congregations:31000, _modeledMissing: true },
  { fips: '08', code: 'CO', name: 'Colorado',       childPop: 1258000, fosterCare:  4380, waitingAdoption:  780, licensedHomes:  2160, childPovertyPct: 10.5, overdoseDeaths:  1620, missingFromCare:  320, congregations: 5200, _modeledMissing: true },
  { fips: '09', code: 'CT', name: 'Connecticut',    childPop:  720000, fosterCare:  3600, waitingAdoption:  610, licensedHomes:  1940, childPovertyPct: 12.0, overdoseDeaths:  1350, missingFromCare:  160, congregations: 3100, _modeledMissing: true },
  { fips: '10', code: 'DE', name: 'Delaware',       childPop:  204000, fosterCare:   460, waitingAdoption:  110, licensedHomes:   260, childPovertyPct: 14.5, overdoseDeaths:   500, missingFromCare:   45, congregations: 1000, _modeledMissing: true },
  { fips: '11', code: 'DC', name: 'District of Columbia', childPop: 130000, fosterCare: 620, waitingAdoption: 90, licensedHomes: 320, childPovertyPct: 22.6, overdoseDeaths: 570, missingFromCare: 60, congregations: 800, _modeledMissing: true },
  { fips: '12', code: 'FL', name: 'Florida',        childPop: 4310000, fosterCare: 21340, waitingAdoption: 3760, licensedHomes:  8420, childPovertyPct: 16.2, overdoseDeaths:  7200, missingFromCare: 1600, congregations:17800, _modeledMissing: true },
  { fips: '13', code: 'GA', name: 'Georgia',        childPop: 2530000, fosterCare: 10420, waitingAdoption: 2220, licensedHomes:  4700, childPovertyPct: 17.9, overdoseDeaths:  2400, missingFromCare:  720, congregations:14200, _modeledMissing: true },
  { fips: '15', code: 'HI', name: 'Hawaii',         childPop:  284000, fosterCare:  1340, waitingAdoption:  330, licensedHomes:   560, childPovertyPct: 12.8, overdoseDeaths:   300, missingFromCare:   70, congregations: 1200, _modeledMissing: true },
  { fips: '16', code: 'ID', name: 'Idaho',          childPop:  466000, fosterCare:  1480, waitingAdoption:  410, licensedHomes:   880, childPovertyPct: 12.5, overdoseDeaths:   400, missingFromCare:  110, congregations: 2400, _modeledMissing: true },
  { fips: '17', code: 'IL', name: 'Illinois',       childPop: 2650000, fosterCare: 18040, waitingAdoption: 2410, licensedHomes:  7100, childPovertyPct: 15.6, overdoseDeaths:  3800, missingFromCare:  820, congregations:12800, _modeledMissing: true },
  { fips: '18', code: 'IN', name: 'Indiana',        childPop: 1568000, fosterCare: 10900, waitingAdoption: 2420, licensedHomes:  4100, childPovertyPct: 15.3, overdoseDeaths:  2100, missingFromCare:  520, congregations: 9200, _modeledMissing: true },
  { fips: '19', code: 'IA', name: 'Iowa',           childPop:  704000, fosterCare:  4620, waitingAdoption:  980, licensedHomes:  1940, childPovertyPct: 12.3, overdoseDeaths:   460, missingFromCare:  170, congregations: 4700, _modeledMissing: true },
  { fips: '20', code: 'KS', name: 'Kansas',         childPop:  712000, fosterCare:  6240, waitingAdoption: 1520, licensedHomes:  2060, childPovertyPct: 13.7, overdoseDeaths:   700, missingFromCare:  210, congregations: 4500, _modeledMissing: true },
  { fips: '21', code: 'KY', name: 'Kentucky',       childPop: 1000000, fosterCare:  8950, waitingAdoption: 2330, licensedHomes:  3300, childPovertyPct: 19.5, overdoseDeaths:  1980, missingFromCare:  410, congregations: 7900, _modeledMissing: true },
  { fips: '22', code: 'LA', name: 'Louisiana',      childPop: 1065000, fosterCare:  3960, waitingAdoption:  910, licensedHomes:  1880, childPovertyPct: 24.3, overdoseDeaths:  1900, missingFromCare:  370, congregations: 8600, _modeledMissing: true },
  { fips: '23', code: 'ME', name: 'Maine',          childPop:  250000, fosterCare:  1940, waitingAdoption:  550, licensedHomes:   980, childPovertyPct: 12.2, overdoseDeaths:   620, missingFromCare:   80, congregations: 1400, _modeledMissing: true },
  { fips: '24', code: 'MD', name: 'Maryland',       childPop: 1305000, fosterCare:  4060, waitingAdoption:  660, licensedHomes:  1980, childPovertyPct: 11.3, overdoseDeaths:  2500, missingFromCare:  380, congregations: 6400, _modeledMissing: true },
  { fips: '25', code: 'MA', name: 'Massachusetts',  childPop: 1300000, fosterCare:  7720, waitingAdoption: 1210, licensedHomes:  3600, childPovertyPct: 11.8, overdoseDeaths:  2100, missingFromCare:  380, congregations: 5300, _modeledMissing: true },
  { fips: '26', code: 'MI', name: 'Michigan',       childPop: 2090000, fosterCare: 10220, waitingAdoption: 2280, licensedHomes:  4200, childPovertyPct: 16.4, overdoseDeaths:  2600, missingFromCare:  640, congregations:10400, _modeledMissing: true },
  { fips: '27', code: 'MN', name: 'Minnesota',      childPop: 1270000, fosterCare:  7980, waitingAdoption: 1320, licensedHomes:  3400, childPovertyPct: 10.5, overdoseDeaths:  1300, missingFromCare:  390, congregations: 6200, _modeledMissing: true },
  { fips: '28', code: 'MS', name: 'Mississippi',    childPop:  680000, fosterCare:  3720, waitingAdoption:  860, licensedHomes:  1500, childPovertyPct: 27.7, overdoseDeaths:   540, missingFromCare:  220, congregations: 6800, _modeledMissing: true },
  { fips: '29', code: 'MO', name: 'Missouri',       childPop: 1360000, fosterCare: 12900, waitingAdoption: 2720, licensedHomes:  4900, childPovertyPct: 16.1, overdoseDeaths:  1650, missingFromCare:  560, congregations: 9100, _modeledMissing: true },
  { fips: '30', code: 'MT', name: 'Montana',        childPop:  215000, fosterCare:  2580, waitingAdoption:  720, licensedHomes:   980, childPovertyPct: 13.9, overdoseDeaths:   190, missingFromCare:   90, congregations: 1700, _modeledMissing: true },
  { fips: '31', code: 'NE', name: 'Nebraska',       childPop:  487000, fosterCare:  3120, waitingAdoption:  610, licensedHomes:  1380, childPovertyPct: 12.7, overdoseDeaths:   240, missingFromCare:  140, congregations: 2900, _modeledMissing: true },
  { fips: '32', code: 'NV', name: 'Nevada',         childPop:  686000, fosterCare:  4280, waitingAdoption:  790, licensedHomes:  1520, childPovertyPct: 16.0, overdoseDeaths:  1060, missingFromCare:  240, congregations: 1800, _modeledMissing: true },
  { fips: '33', code: 'NH', name: 'New Hampshire',  childPop:  250000, fosterCare:  1280, waitingAdoption:  280, licensedHomes:   700, childPovertyPct:  8.6, overdoseDeaths:   450, missingFromCare:   70, congregations: 1100, _modeledMissing: true },
  { fips: '34', code: 'NJ', name: 'New Jersey',     childPop: 1970000, fosterCare:  3980, waitingAdoption:  610, licensedHomes:  2780, childPovertyPct: 11.5, overdoseDeaths:  2800, missingFromCare:  440, congregations: 7800, _modeledMissing: true },
  { fips: '35', code: 'NM', name: 'New Mexico',     childPop:  470000, fosterCare:  2120, waitingAdoption:  470, licensedHomes:   900, childPovertyPct: 22.7, overdoseDeaths:   950, missingFromCare:  160, congregations: 2600, _modeledMissing: true },
  { fips: '36', code: 'NY', name: 'New York',       childPop: 3980000, fosterCare: 15360, waitingAdoption: 1720, licensedHomes:  7400, childPovertyPct: 17.6, overdoseDeaths:  6000, missingFromCare: 1420, congregations:18500, _modeledMissing: true },
  { fips: '37', code: 'NC', name: 'North Carolina', childPop: 2320000, fosterCare: 11020, waitingAdoption: 2260, licensedHomes:  4700, childPovertyPct: 17.0, overdoseDeaths:  4100, missingFromCare:  720, congregations:14800, _modeledMissing: true },
  { fips: '38', code: 'ND', name: 'North Dakota',   childPop:  188000, fosterCare:  1520, waitingAdoption:  380, licensedHomes:   720, childPovertyPct: 11.8, overdoseDeaths:   110, missingFromCare:   60, congregations: 1500, _modeledMissing: true },
  { fips: '39', code: 'OH', name: 'Ohio',           childPop: 2540000, fosterCare: 16300, waitingAdoption: 3400, licensedHomes:  7300, childPovertyPct: 17.6, overdoseDeaths:  4800, missingFromCare:  940, congregations:14600, _modeledMissing: true },
  { fips: '40', code: 'OK', name: 'Oklahoma',       childPop:  968000, fosterCare:  6560, waitingAdoption: 1740, licensedHomes:  2680, childPovertyPct: 17.9, overdoseDeaths:   820, missingFromCare:  350, congregations: 9100, _modeledMissing: true },
  { fips: '41', code: 'OR', name: 'Oregon',         childPop:  830000, fosterCare:  4600, waitingAdoption:  810, licensedHomes:  1980, childPovertyPct: 13.2, overdoseDeaths:  1700, missingFromCare:  260, congregations: 4200, _modeledMissing: true },
  { fips: '42', code: 'PA', name: 'Pennsylvania',   childPop: 2560000, fosterCare: 15140, waitingAdoption: 2670, licensedHomes:  7800, childPovertyPct: 15.4, overdoseDeaths:  5200, missingFromCare:  930, congregations:13800, _modeledMissing: true },
  { fips: '44', code: 'RI', name: 'Rhode Island',   childPop:  200000, fosterCare:  1920, waitingAdoption:  310, licensedHomes:   860, childPovertyPct: 15.3, overdoseDeaths:   430, missingFromCare:   80, congregations:  900, _modeledMissing: true },
  { fips: '45', code: 'SC', name: 'South Carolina', childPop: 1100000, fosterCare:  3900, waitingAdoption:  780, licensedHomes:  1940, childPovertyPct: 18.4, overdoseDeaths:  2100, missingFromCare:  370, congregations: 7800, _modeledMissing: true },
  { fips: '46', code: 'SD', name: 'South Dakota',   childPop:  220000, fosterCare:  1740, waitingAdoption:  470, licensedHomes:   680, childPovertyPct: 13.1, overdoseDeaths:   110, missingFromCare:   70, congregations: 2000, _modeledMissing: true },
  { fips: '47', code: 'TN', name: 'Tennessee',      childPop: 1530000, fosterCare:  8780, waitingAdoption: 1980, licensedHomes:  4300, childPovertyPct: 18.9, overdoseDeaths:  3500, missingFromCare:  540, congregations:11900, _modeledMissing: true },
  { fips: '48', code: 'TX', name: 'Texas',          childPop: 7500000, fosterCare: 16240, waitingAdoption: 3120, licensedHomes:  7200, childPovertyPct: 18.2, overdoseDeaths:  5200, missingFromCare: 2300, congregations:27800, _modeledMissing: true },
  { fips: '49', code: 'UT', name: 'Utah',           childPop:  930000, fosterCare:  2520, waitingAdoption:  480, licensedHomes:  1200, childPovertyPct:  8.1, overdoseDeaths:   570, missingFromCare:  220, congregations: 3100, _modeledMissing: true },
  { fips: '50', code: 'VT', name: 'Vermont',        childPop:  116000, fosterCare:   960, waitingAdoption:  230, licensedHomes:   520, childPovertyPct: 10.4, overdoseDeaths:   220, missingFromCare:   40, congregations:  700, _modeledMissing: true },
  { fips: '51', code: 'VA', name: 'Virginia',       childPop: 1820000, fosterCare:  5260, waitingAdoption: 1040, licensedHomes:  2760, childPovertyPct: 12.2, overdoseDeaths:  2500, missingFromCare:  600, congregations:10400, _modeledMissing: true },
  { fips: '53', code: 'WA', name: 'Washington',     childPop: 1640000, fosterCare:  6700, waitingAdoption:  910, licensedHomes:  2920, childPovertyPct: 11.3, overdoseDeaths:  3400, missingFromCare:  540, congregations: 6700, _modeledMissing: true },
  { fips: '54', code: 'WV', name: 'West Virginia',  childPop:  354000, fosterCare:  5840, waitingAdoption: 1580, licensedHomes:  1600, childPovertyPct: 22.5, overdoseDeaths:  1300, missingFromCare:  170, congregations: 3900, _modeledMissing: true },
  { fips: '55', code: 'WI', name: 'Wisconsin',      childPop: 1240000, fosterCare:  7080, waitingAdoption: 1340, licensedHomes:  3400, childPovertyPct: 12.5, overdoseDeaths:  1400, missingFromCare:  400, congregations: 6300, _modeledMissing: true },
  { fips: '56', code: 'WY', name: 'Wyoming',        childPop:  130000, fosterCare:   760, waitingAdoption:  200, licensedHomes:   320, childPovertyPct: 11.7, overdoseDeaths:   110, missingFromCare:   40, congregations:  900, _modeledMissing: true },
];

export const NATIONAL = {
  fosterCare: 368530, // AFCARS FY2023 point-in-time.
  waitingAdoption: 70418, // AFCARS FY2023.
  legallyFree: 34817, // AFCARS FY2023.
  licensedHomes: 195404, // Imprint 2024.
  licensedHomesPrior: 220000, // Imprint 2019.
  agingOutYearly: 20000,
  childMaltreatmentVictims: 532228,
  childFatalitiesFromAbuse: 1773,
  overdoseDeaths: 107941, // CDC 12-mo ending 2024.
  missingFromCare: 23160, // NCMEC 2024.
  congregations: 380000, // HIFLD / US Religion Census.
};

export const STATE_INDEX: Record<string, StateRow> = STATES.reduce(
  (acc, s) => {
    acc[s.fips] = s;
    return acc;
  },
  {} as Record<string, StateRow>
);
