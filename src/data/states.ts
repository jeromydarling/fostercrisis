// State-level statistics for the Foster Crisis map.
//
// Sources (per column):
//   fosterCare, waitingAdoption
//     AFCARS FY2023 (Report #30, published November 2024).
//     https://www.acf.hhs.gov/cb/data-research/adoption-fostercare
//   licensedHomes
//     The Imprint 2024 Foster Home Survey (state-reported licensed + kin).
//     https://imprintnews.org/youth-services-insider/fewer-foster-youth-homes-2023-imprint-survey-finds/
//   childPop
//     Census Bureau ACS 2023 1-yr, population under 18.
//   childPovertyPct
//     Census SAIPE 2022 state rollup — SAEPOVRT0_17_PT.
//     (County-level values are fetched at build time into
//      public/data/saipe-counties.json; see scripts/fetch-saipe.mjs.)
//   overdoseDeaths
//     CDC WONDER multiple cause of death, 12-mo ending 2024, X40–X44, X60–X64,
//     X85, Y10–Y14 (drug overdose deaths). State totals.
//   missingFromCare
//     NCMEC 2024 Impact Report. National total 23,160; state values scaled
//     by foster-care census and marked `_modeled: true` until NCMEC state
//     tables are incorporated manually.
//   congregations
//     2020 U.S. Religion Census — Christian congregations by state.
//     https://www.usreligioncensus.org/
//   religiosityPct
//     Pew Research Religious Landscape Study, "% highly religious"
//     (pray daily, attend weekly, high importance of religion, belief in
//     God with absolute certainty). State-level.
//     https://www.pewresearch.org/religion/religious-landscape-study/
//   obesityPct
//     CDC BRFSS 2022 adult obesity rate (BMI ≥ 30). State-level.
//     https://www.cdc.gov/obesity/data/prevalence-maps.html
//   divorceRate
//     CDC NVSS 2022 crude divorce rate per 1,000 population. A handful
//     of states (CA, HI, IN, MN, NM, OK) don't report to NVSS; values
//     for those are best-available estimates from state vital records.
//     https://www.cdc.gov/nchs/nvss/marriage-divorce.htm
//   unwedBirthPct
//     CDC NCHS 2022 share of births to unmarried women by state.
//     https://www.cdc.gov/nchs/data/nvsr/nvsr72/nvsr72-01.pdf
//   pornSessionSec
//     Average Pornhub visit duration (seconds), composite of the
//     2014-2019 Pornhub Insights "state of the union" posts — the
//     authoritative public source, since Pornhub owns the telemetry.
//     Values are approximate; the *ordering* is what the argument
//     rests on: southern / Bible-Belt states consistently rank
//     highest; Mississippi has held the #1 slot across every annual
//     report.
//     https://www.pornhub.com/insights/united-states
//   pm25
//     EPA AQS annual mean PM2.5 concentration (µg/m³), 2022 state
//     aggregate. Seed values committed to the repo; refreshed on
//     deploy by scripts/fetch-ejscreen.mjs when the EPA EJScreen
//     REST service responds with state-level aggregates.
//     https://www.epa.gov/ejscreen

export interface StateRow {
  fips: string;
  code: string;
  name: string;
  childPop: number;
  fosterCare: number;
  waitingAdoption: number;
  licensedHomes: number;
  childPovertyPct: number;
  overdoseDeaths: number;
  missingFromCare: number;
  congregations: number;
  /** % of adults who qualify as "highly religious" in Pew RLS. */
  religiosityPct: number;
  /** CDC BRFSS adult obesity prevalence (%). */
  obesityPct: number;
  /** CDC NVSS crude divorce rate (divorces per 1,000 population). */
  divorceRate: number;
  /** CDC NCHS share of births to unmarried women (%). */
  unwedBirthPct: number;
  /** Pornhub Insights average visit duration (seconds). */
  pornSessionSec: number;
  /** EPA AQS annual mean PM2.5 (µg/m³). Seeded from 2022 averages;
   *  refreshable via scripts/fetch-ejscreen.mjs. */
  pm25: number;
  /** Official state adoption / foster recruitment site. Perplexity will
   *  fill these in; see scripts/update-adoption-sites.mjs (coming). */
  adoptionSite?: string;
  /** True when a value is scaled from a national aggregate rather than
   *  pulled from a per-state table. */
  _modeledMissing?: boolean;
}

// AFCARS FY2023 state totals + supporting columns. Foster-care and
// waiting-adoption counts are from AFCARS Report #30. Licensed-home totals
// reflect the Imprint 2024 survey. Poverty reflects SAIPE 2022. Overdose
// reflects CDC 12-mo 2024. Congregations reflect the 2020 Religion Census.
export const STATES: StateRow[] = [
  { fips: '01', code: 'AL', name: 'Alabama',             childPop: 1082000, fosterCare:  5876, waitingAdoption: 1420, licensedHomes:  3100, childPovertyPct: 21.8, overdoseDeaths:  1480, missingFromCare:  380, congregations: 9100, religiosityPct: 77, obesityPct: 39.9, divorceRate: 3.7, unwedBirthPct: 43, pornSessionSec: 605, pm25: 8.5, _modeledMissing: true },
  { fips: '02', code: 'AK', name: 'Alaska',              childPop:  178000, fosterCare:  2912, waitingAdoption:  790, licensedHomes:  1120, childPovertyPct: 13.0, overdoseDeaths:   300, missingFromCare:   85, congregations:  900, religiosityPct: 45, obesityPct: 34.2, divorceRate: 4.3, unwedBirthPct: 38, pornSessionSec: 540, pm25: 4.0, _modeledMissing: true },
  { fips: '04', code: 'AZ', name: 'Arizona',             childPop: 1612000, fosterCare: 12115, waitingAdoption: 2980, licensedHomes:  4880, childPovertyPct: 15.8, overdoseDeaths:  2400, missingFromCare:  510, congregations: 6700, religiosityPct: 53, obesityPct: 31.6, divorceRate: 3.2, unwedBirthPct: 41, pornSessionSec: 560, pm25: 7.0, _modeledMissing: true },
  { fips: '05', code: 'AR', name: 'Arkansas',            childPop:  700000, fosterCare:  4010, waitingAdoption:  960, licensedHomes:  1620, childPovertyPct: 21.4, overdoseDeaths:   620, missingFromCare:  200, congregations: 6300, religiosityPct: 70, obesityPct: 40.0, divorceRate: 5.2, unwedBirthPct: 43, pornSessionSec: 600, pm25: 8.0, _modeledMissing: true },
  { fips: '06', code: 'CA', name: 'California',          childPop: 8600000, fosterCare: 54340, waitingAdoption: 7210, licensedHomes: 18900, childPovertyPct: 16.3, overdoseDeaths: 11400, missingFromCare: 2700, congregations:31000, religiosityPct: 47, obesityPct: 28.3, divorceRate: 2.7, unwedBirthPct: 38, pornSessionSec: 575, pm25: 9.8, _modeledMissing: true },
  { fips: '08', code: 'CO', name: 'Colorado',            childPop: 1258000, fosterCare:  4380, waitingAdoption:  780, licensedHomes:  2160, childPovertyPct: 10.5, overdoseDeaths:  1620, missingFromCare:  320, congregations: 5200, religiosityPct: 47, obesityPct: 24.9, divorceRate: 3.5, unwedBirthPct: 27, pornSessionSec: 550, pm25: 7.5, _modeledMissing: true },
  { fips: '09', code: 'CT', name: 'Connecticut',         childPop:  720000, fosterCare:  3600, waitingAdoption:  610, licensedHomes:  1940, childPovertyPct: 12.0, overdoseDeaths:  1350, missingFromCare:  160, congregations: 3100, religiosityPct: 43, obesityPct: 29.3, divorceRate: 2.6, unwedBirthPct: 35, pornSessionSec: 555, pm25: 7.0, _modeledMissing: true },
  { fips: '10', code: 'DE', name: 'Delaware',            childPop:  204000, fosterCare:   460, waitingAdoption:  110, licensedHomes:   260, childPovertyPct: 14.5, overdoseDeaths:   500, missingFromCare:   45, congregations: 1000, religiosityPct: 52, obesityPct: 36.5, divorceRate: 2.7, unwedBirthPct: 44, pornSessionSec: 580, pm25: 8.5, _modeledMissing: true },
  { fips: '11', code: 'DC', name: 'District of Columbia',childPop:  130000, fosterCare:   620, waitingAdoption:   90, licensedHomes:   320, childPovertyPct: 22.6, overdoseDeaths:   570, missingFromCare:   60, congregations:  800, religiosityPct: 53, obesityPct: 24.3, divorceRate: 2.6, unwedBirthPct: 54, pornSessionSec: 520, pm25: 8.5, _modeledMissing: true },
  { fips: '12', code: 'FL', name: 'Florida',             childPop: 4310000, fosterCare: 21340, waitingAdoption: 3760, licensedHomes:  8420, childPovertyPct: 16.2, overdoseDeaths:  7200, missingFromCare: 1600, congregations:17800, religiosityPct: 54, obesityPct: 30.1, divorceRate: 3.4, unwedBirthPct: 42, pornSessionSec: 575, pm25: 7.0, _modeledMissing: true },
  { fips: '13', code: 'GA', name: 'Georgia',             childPop: 2530000, fosterCare: 10420, waitingAdoption: 2220, licensedHomes:  4700, childPovertyPct: 17.9, overdoseDeaths:  2400, missingFromCare:  720, congregations:14200, religiosityPct: 66, obesityPct: 35.6, divorceRate: 3.2, unwedBirthPct: 44, pornSessionSec: 595, pm25: 8.5, _modeledMissing: true },
  { fips: '15', code: 'HI', name: 'Hawaii',              childPop:  284000, fosterCare:  1340, waitingAdoption:  330, licensedHomes:   560, childPovertyPct: 12.8, overdoseDeaths:   300, missingFromCare:   70, congregations: 1200, religiosityPct: 47, obesityPct: 25.9, divorceRate: 2.7, unwedBirthPct: 36, pornSessionSec: 605, pm25: 5.5, _modeledMissing: true },
  { fips: '16', code: 'ID', name: 'Idaho',               childPop:  466000, fosterCare:  1480, waitingAdoption:  410, licensedHomes:   880, childPovertyPct: 12.5, overdoseDeaths:   400, missingFromCare:  110, congregations: 2400, religiosityPct: 51, obesityPct: 31.7, divorceRate: 4.2, unwedBirthPct: 27, pornSessionSec: 555, pm25: 7.0, _modeledMissing: true },
  { fips: '17', code: 'IL', name: 'Illinois',            childPop: 2650000, fosterCare: 18040, waitingAdoption: 2410, licensedHomes:  7100, childPovertyPct: 15.6, overdoseDeaths:  3800, missingFromCare:  820, congregations:12800, religiosityPct: 51, obesityPct: 34.1, divorceRate: 2.3, unwedBirthPct: 38, pornSessionSec: 570, pm25: 8.8, _modeledMissing: true },
  { fips: '18', code: 'IN', name: 'Indiana',             childPop: 1568000, fosterCare: 10900, waitingAdoption: 2420, licensedHomes:  4100, childPovertyPct: 15.3, overdoseDeaths:  2100, missingFromCare:  520, congregations: 9200, religiosityPct: 54, obesityPct: 37.4, divorceRate: 3.1, unwedBirthPct: 40, pornSessionSec: 575, pm25: 9.5, _modeledMissing: true },
  { fips: '19', code: 'IA', name: 'Iowa',                childPop:  704000, fosterCare:  4620, waitingAdoption:  980, licensedHomes:  1940, childPovertyPct: 12.3, overdoseDeaths:   460, missingFromCare:  170, congregations: 4700, religiosityPct: 55, obesityPct: 36.5, divorceRate: 2.1, unwedBirthPct: 35, pornSessionSec: 555, pm25: 8.5, _modeledMissing: true },
  { fips: '20', code: 'KS', name: 'Kansas',              childPop:  712000, fosterCare:  6240, waitingAdoption: 1520, licensedHomes:  2060, childPovertyPct: 13.7, overdoseDeaths:   700, missingFromCare:  210, congregations: 4500, religiosityPct: 55, obesityPct: 37.4, divorceRate: 2.8, unwedBirthPct: 35, pornSessionSec: 580, pm25: 7.5, _modeledMissing: true },
  { fips: '21', code: 'KY', name: 'Kentucky',            childPop: 1000000, fosterCare:  8950, waitingAdoption: 2330, licensedHomes:  3300, childPovertyPct: 19.5, overdoseDeaths:  1980, missingFromCare:  410, congregations: 7900, religiosityPct: 63, obesityPct: 40.1, divorceRate: 3.5, unwedBirthPct: 40, pornSessionSec: 580, pm25: 8.5, _modeledMissing: true },
  { fips: '22', code: 'LA', name: 'Louisiana',           childPop: 1065000, fosterCare:  3960, waitingAdoption:  910, licensedHomes:  1880, childPovertyPct: 24.3, overdoseDeaths:  1900, missingFromCare:  370, congregations: 8600, religiosityPct: 71, obesityPct: 38.6, divorceRate: 2.4, unwedBirthPct: 50, pornSessionSec: 620, pm25: 8.5, _modeledMissing: true },
  { fips: '23', code: 'ME', name: 'Maine',               childPop:  250000, fosterCare:  1940, waitingAdoption:  550, licensedHomes:   980, childPovertyPct: 12.2, overdoseDeaths:   620, missingFromCare:   80, congregations: 1400, religiosityPct: 34, obesityPct: 32.0, divorceRate: 3.3, unwedBirthPct: 38, pornSessionSec: 555, pm25: 5.5, _modeledMissing: true },
  { fips: '24', code: 'MD', name: 'Maryland',            childPop: 1305000, fosterCare:  4060, waitingAdoption:  660, licensedHomes:  1980, childPovertyPct: 11.3, overdoseDeaths:  2500, missingFromCare:  380, congregations: 6400, religiosityPct: 54, obesityPct: 32.3, divorceRate: 2.0, unwedBirthPct: 40, pornSessionSec: 575, pm25: 8.5, _modeledMissing: true },
  { fips: '25', code: 'MA', name: 'Massachusetts',       childPop: 1300000, fosterCare:  7720, waitingAdoption: 1210, licensedHomes:  3600, childPovertyPct: 11.8, overdoseDeaths:  2100, missingFromCare:  380, congregations: 5300, religiosityPct: 33, obesityPct: 28.1, divorceRate: 1.6, unwedBirthPct: 34, pornSessionSec: 555, pm25: 7.0, _modeledMissing: true },
  { fips: '26', code: 'MI', name: 'Michigan',            childPop: 2090000, fosterCare: 10220, waitingAdoption: 2280, licensedHomes:  4200, childPovertyPct: 16.4, overdoseDeaths:  2600, missingFromCare:  640, congregations:10400, religiosityPct: 53, obesityPct: 36.3, divorceRate: 2.6, unwedBirthPct: 38, pornSessionSec: 570, pm25: 8.5, _modeledMissing: true },
  { fips: '27', code: 'MN', name: 'Minnesota',           childPop: 1270000, fosterCare:  7980, waitingAdoption: 1320, licensedHomes:  3400, childPovertyPct: 10.5, overdoseDeaths:  1300, missingFromCare:  390, congregations: 6200, religiosityPct: 49, obesityPct: 34.5, divorceRate: 2.0, unwedBirthPct: 32, pornSessionSec: 525, pm25: 7.5, _modeledMissing: true },
  { fips: '28', code: 'MS', name: 'Mississippi',         childPop:  680000, fosterCare:  3720, waitingAdoption:  860, licensedHomes:  1500, childPovertyPct: 27.7, overdoseDeaths:   540, missingFromCare:  220, congregations: 6800, religiosityPct: 77, obesityPct: 40.1, divorceRate: 3.0, unwedBirthPct: 52, pornSessionSec: 630, pm25: 8.0, _modeledMissing: true },
  { fips: '29', code: 'MO', name: 'Missouri',            childPop: 1360000, fosterCare: 12900, waitingAdoption: 2720, licensedHomes:  4900, childPovertyPct: 16.1, overdoseDeaths:  1650, missingFromCare:  560, congregations: 9100, religiosityPct: 60, obesityPct: 36.4, divorceRate: 2.9, unwedBirthPct: 40, pornSessionSec: 580, pm25: 8.5, _modeledMissing: true },
  { fips: '30', code: 'MT', name: 'Montana',             childPop:  215000, fosterCare:  2580, waitingAdoption:  720, licensedHomes:   980, childPovertyPct: 13.9, overdoseDeaths:   190, missingFromCare:   90, congregations: 1700, religiosityPct: 48, obesityPct: 29.5, divorceRate: 3.6, unwedBirthPct: 35, pornSessionSec: 545, pm25: 6.5, _modeledMissing: true },
  { fips: '31', code: 'NE', name: 'Nebraska',            childPop:  487000, fosterCare:  3120, waitingAdoption:  610, licensedHomes:  1380, childPovertyPct: 12.7, overdoseDeaths:   240, missingFromCare:  140, congregations: 2900, religiosityPct: 58, obesityPct: 35.8, divorceRate: 2.6, unwedBirthPct: 32, pornSessionSec: 545, pm25: 7.0, _modeledMissing: true },
  { fips: '32', code: 'NV', name: 'Nevada',              childPop:  686000, fosterCare:  4280, waitingAdoption:  790, licensedHomes:  1520, childPovertyPct: 16.0, overdoseDeaths:  1060, missingFromCare:  240, congregations: 1800, religiosityPct: 49, obesityPct: 31.6, divorceRate: 4.2, unwedBirthPct: 42, pornSessionSec: 565, pm25: 6.5, _modeledMissing: true },
  { fips: '33', code: 'NH', name: 'New Hampshire',       childPop:  250000, fosterCare:  1280, waitingAdoption:  280, licensedHomes:   700, childPovertyPct:  8.6, overdoseDeaths:   450, missingFromCare:   70, congregations: 1100, religiosityPct: 33, obesityPct: 30.6, divorceRate: 2.8, unwedBirthPct: 28, pornSessionSec: 555, pm25: 6.0, _modeledMissing: true },
  { fips: '34', code: 'NJ', name: 'New Jersey',          childPop: 1970000, fosterCare:  3980, waitingAdoption:  610, licensedHomes:  2780, childPovertyPct: 11.5, overdoseDeaths:  2800, missingFromCare:  440, congregations: 7800, religiosityPct: 55, obesityPct: 29.6, divorceRate: 1.9, unwedBirthPct: 34, pornSessionSec: 570, pm25: 8.5, _modeledMissing: true },
  { fips: '35', code: 'NM', name: 'New Mexico',          childPop:  470000, fosterCare:  2120, waitingAdoption:  470, licensedHomes:   900, childPovertyPct: 22.7, overdoseDeaths:   950, missingFromCare:  160, congregations: 2600, religiosityPct: 57, obesityPct: 33.6, divorceRate: 2.9, unwedBirthPct: 50, pornSessionSec: 565, pm25: 6.0, _modeledMissing: true },
  { fips: '36', code: 'NY', name: 'New York',            childPop: 3980000, fosterCare: 15360, waitingAdoption: 1720, licensedHomes:  7400, childPovertyPct: 17.6, overdoseDeaths:  6000, missingFromCare: 1420, congregations:18500, religiosityPct: 46, obesityPct: 29.5, divorceRate: 2.2, unwedBirthPct: 37, pornSessionSec: 565, pm25: 7.0, _modeledMissing: true },
  { fips: '37', code: 'NC', name: 'North Carolina',      childPop: 2320000, fosterCare: 11020, waitingAdoption: 2260, licensedHomes:  4700, childPovertyPct: 17.0, overdoseDeaths:  4100, missingFromCare:  720, congregations:14800, religiosityPct: 65, obesityPct: 36.1, divorceRate: 2.7, unwedBirthPct: 41, pornSessionSec: 585, pm25: 8.0, _modeledMissing: true },
  { fips: '38', code: 'ND', name: 'North Dakota',        childPop:  188000, fosterCare:  1520, waitingAdoption:  380, licensedHomes:   720, childPovertyPct: 11.8, overdoseDeaths:   110, missingFromCare:   60, congregations: 1500, religiosityPct: 53, obesityPct: 36.0, divorceRate: 2.3, unwedBirthPct: 33, pornSessionSec: 500, pm25: 6.5, _modeledMissing: true },
  { fips: '39', code: 'OH', name: 'Ohio',                childPop: 2540000, fosterCare: 16300, waitingAdoption: 3400, licensedHomes:  7300, childPovertyPct: 17.6, overdoseDeaths:  4800, missingFromCare:  940, congregations:14600, religiosityPct: 58, obesityPct: 37.9, divorceRate: 2.9, unwedBirthPct: 42, pornSessionSec: 575, pm25: 9.0, _modeledMissing: true },
  { fips: '40', code: 'OK', name: 'Oklahoma',            childPop:  968000, fosterCare:  6560, waitingAdoption: 1740, licensedHomes:  2680, childPovertyPct: 17.9, overdoseDeaths:   820, missingFromCare:  350, congregations: 9100, religiosityPct: 66, obesityPct: 40.0, divorceRate: 3.4, unwedBirthPct: 42, pornSessionSec: 595, pm25: 8.0, _modeledMissing: true },
  { fips: '41', code: 'OR', name: 'Oregon',              childPop:  830000, fosterCare:  4600, waitingAdoption:  810, licensedHomes:  1980, childPovertyPct: 13.2, overdoseDeaths:  1700, missingFromCare:  260, congregations: 4200, religiosityPct: 46, obesityPct: 31.1, divorceRate: 3.1, unwedBirthPct: 32, pornSessionSec: 555, pm25: 7.5, _modeledMissing: true },
  { fips: '42', code: 'PA', name: 'Pennsylvania',        childPop: 2560000, fosterCare: 15140, waitingAdoption: 2670, licensedHomes:  7800, childPovertyPct: 15.4, overdoseDeaths:  5200, missingFromCare:  930, congregations:13800, religiosityPct: 52, obesityPct: 34.1, divorceRate: 2.3, unwedBirthPct: 40, pornSessionSec: 570, pm25: 9.0, _modeledMissing: true },
  { fips: '44', code: 'RI', name: 'Rhode Island',        childPop:  200000, fosterCare:  1920, waitingAdoption:  310, licensedHomes:   860, childPovertyPct: 15.3, overdoseDeaths:   430, missingFromCare:   80, congregations:  900, religiosityPct: 49, obesityPct: 29.5, divorceRate: 2.1, unwedBirthPct: 43, pornSessionSec: 560, pm25: 7.5, _modeledMissing: true },
  { fips: '45', code: 'SC', name: 'South Carolina',      childPop: 1100000, fosterCare:  3900, waitingAdoption:  780, licensedHomes:  1940, childPovertyPct: 18.4, overdoseDeaths:  2100, missingFromCare:  370, congregations: 7800, religiosityPct: 70, obesityPct: 36.1, divorceRate: 2.4, unwedBirthPct: 46, pornSessionSec: 595, pm25: 8.0, _modeledMissing: true },
  { fips: '46', code: 'SD', name: 'South Dakota',        childPop:  220000, fosterCare:  1740, waitingAdoption:  470, licensedHomes:   680, childPovertyPct: 13.1, overdoseDeaths:   110, missingFromCare:   70, congregations: 2000, religiosityPct: 59, obesityPct: 38.4, divorceRate: 2.5, unwedBirthPct: 38, pornSessionSec: 510, pm25: 6.5, _modeledMissing: true },
  { fips: '47', code: 'TN', name: 'Tennessee',           childPop: 1530000, fosterCare:  8780, waitingAdoption: 1980, licensedHomes:  4300, childPovertyPct: 18.9, overdoseDeaths:  3500, missingFromCare:  540, congregations:11900, religiosityPct: 73, obesityPct: 37.5, divorceRate: 3.0, unwedBirthPct: 40, pornSessionSec: 590, pm25: 8.5, _modeledMissing: true },
  { fips: '48', code: 'TX', name: 'Texas',               childPop: 7500000, fosterCare: 16240, waitingAdoption: 3120, licensedHomes:  7200, childPovertyPct: 18.2, overdoseDeaths:  5200, missingFromCare: 2300, congregations:27800, religiosityPct: 64, obesityPct: 35.9, divorceRate: 1.4, unwedBirthPct: 37, pornSessionSec: 580, pm25: 8.0, _modeledMissing: true },
  { fips: '49', code: 'UT', name: 'Utah',                childPop:  930000, fosterCare:  2520, waitingAdoption:  480, licensedHomes:  1200, childPovertyPct:  8.1, overdoseDeaths:   570, missingFromCare:  220, congregations: 3100, religiosityPct: 64, obesityPct: 30.6, divorceRate: 2.9, unwedBirthPct: 19, pornSessionSec: 570, pm25: 7.5, _modeledMissing: true },
  { fips: '50', code: 'VT', name: 'Vermont',             childPop:  116000, fosterCare:   960, waitingAdoption:  230, licensedHomes:   520, childPovertyPct: 10.4, overdoseDeaths:   220, missingFromCare:   40, congregations:  700, religiosityPct: 34, obesityPct: 28.8, divorceRate: 2.8, unwedBirthPct: 40, pornSessionSec: 535, pm25: 5.5, _modeledMissing: true },
  { fips: '51', code: 'VA', name: 'Virginia',            childPop: 1820000, fosterCare:  5260, waitingAdoption: 1040, licensedHomes:  2760, childPovertyPct: 12.2, overdoseDeaths:  2500, missingFromCare:  600, congregations:10400, religiosityPct: 61, obesityPct: 34.1, divorceRate: 2.5, unwedBirthPct: 33, pornSessionSec: 575, pm25: 8.0, _modeledMissing: true },
  { fips: '53', code: 'WA', name: 'Washington',          childPop: 1640000, fosterCare:  6700, waitingAdoption:  910, licensedHomes:  2920, childPovertyPct: 11.3, overdoseDeaths:  3400, missingFromCare:  540, congregations: 6700, religiosityPct: 45, obesityPct: 31.0, divorceRate: 2.8, unwedBirthPct: 32, pornSessionSec: 560, pm25: 7.5, _modeledMissing: true },
  { fips: '54', code: 'WV', name: 'West Virginia',       childPop:  354000, fosterCare:  5840, waitingAdoption: 1580, licensedHomes:  1600, childPovertyPct: 22.5, overdoseDeaths:  1300, missingFromCare:  170, congregations: 3900, religiosityPct: 69, obesityPct: 41.2, divorceRate: 3.0, unwedBirthPct: 43, pornSessionSec: 590, pm25: 8.5, _modeledMissing: true },
  { fips: '55', code: 'WI', name: 'Wisconsin',           childPop: 1240000, fosterCare:  7080, waitingAdoption: 1340, licensedHomes:  3400, childPovertyPct: 12.5, overdoseDeaths:  1400, missingFromCare:  400, congregations: 6300, religiosityPct: 45, obesityPct: 36.1, divorceRate: 2.3, unwedBirthPct: 38, pornSessionSec: 555, pm25: 7.5, _modeledMissing: true },
  { fips: '56', code: 'WY', name: 'Wyoming',             childPop:  130000, fosterCare:   760, waitingAdoption:  200, licensedHomes:   320, childPovertyPct: 11.7, overdoseDeaths:   110, missingFromCare:   40, congregations:  900, religiosityPct: 54, obesityPct: 33.0, divorceRate: 3.7, unwedBirthPct: 31, pornSessionSec: 550, pm25: 5.5, _modeledMissing: true },
];

export const NATIONAL = {
  // AFCARS point-in-time (9/30/2023). "Tonight's bed" framing.
  fosterCare: 368530,
  // AFCARS children waiting to be adopted.
  waitingAdoption: 70418,
  // AFCARS children with parental rights terminated ("legally free").
  legallyFree: 34817,
  // Children who cycled through foster care in FY2023. "A year of
  // American childhood" framing — the flow number, not the stock.
  throughYear: 700000,
  licensedHomes: 195404,
  licensedHomesPrior: 220000,
  agingOutYearly: 20000,
  childMaltreatmentVictims: 532228,
  childFatalitiesFromAbuse: 1773,
  overdoseDeaths: 107941,
  missingFromCare: 23160,
  congregations: 380000,
};

export const STATE_INDEX: Record<string, StateRow> = STATES.reduce(
  (acc, s) => {
    acc[s.fips] = s;
    return acc;
  },
  {} as Record<string, StateRow>
);
