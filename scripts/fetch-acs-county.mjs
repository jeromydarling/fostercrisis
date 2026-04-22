#!/usr/bin/env node
// scripts/fetch-acs-county.mjs
//
// Pulls two county-level columns from the American Community Survey
// 5-year estimates (latest available year, 2023) via the Census API:
//
//   B01003_001E  Total population
//   S1810_C03_001E  Percent of population with a disability
//
// No API key is required for low-volume requests.
//
// Run:  node scripts/fetch-acs-county.mjs [year]

import { fetchJson, writeJson, log } from './lib.mjs';

const YEAR = process.argv[2] || '2023';

const POP_URL = `https://api.census.gov/data/${YEAR}/acs/acs5?get=NAME,B01003_001E&for=county:*`;
const DIS_URL = `https://api.census.gov/data/${YEAR}/acs/acs5/subject?get=NAME,S1810_C03_001E&for=county:*`;

function rowsToMap(raw, valIdx) {
  const [header, ...rows] = raw;
  const iState = header.indexOf('state');
  const iCounty = header.indexOf('county');
  const map = {};
  for (const r of rows) {
    const fips = String(r[iState]).padStart(2, '0') + String(r[iCounty]).padStart(3, '0');
    const v = parseFloat(r[valIdx]);
    if (Number.isFinite(v) && v > 0) map[fips] = v;
  }
  return map;
}

log.step(`ACS ${YEAR} — county population + disability rate`);

log.ok(`GET ${POP_URL}`);
const popRaw = await fetchJson(POP_URL);
const pop = rowsToMap(popRaw, popRaw[0].indexOf('B01003_001E'));
log.ok(`population: ${Object.keys(pop).length} counties`);

log.ok(`GET ${DIS_URL}`);
const disRaw = await fetchJson(DIS_URL);
const dis = rowsToMap(disRaw, disRaw[0].indexOf('S1810_C03_001E'));
log.ok(`disability: ${Object.keys(dis).length} counties`);

writeJson('acs-county.json', {
  _meta: {
    year: YEAR,
    source: 'U.S. Census Bureau, American Community Survey 5-year estimates',
    urls: [POP_URL, DIS_URL],
  },
  population: pop,
  disabilityPct: dis,
});
