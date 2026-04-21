#!/usr/bin/env node
// scripts/fetch-saipe.mjs
//
// Pulls county-level SAIPE (Small Area Income and Poverty Estimates) for the
// latest available year and writes a compact {fips:rate} JSON. No API key is
// required for the public SAIPE endpoint.
//
//   SAEPOVRTALL_PT  All-ages poverty rate (percent)
//   SAEPOVRT0_17_PT Children 0-17 poverty rate (percent)
//
// Docs: https://www.census.gov/data/developers/data-sets/Poverty.html
//
// Run:  node scripts/fetch-saipe.mjs [year]

import { fetchJson, writeJson, log } from './lib.mjs';

const YEAR = process.argv[2] || '2022';
const URL = `https://api.census.gov/data/timeseries/poverty/saipe?get=NAME,SAEPOVRT0_17_PT&for=county:*&time=${YEAR}`;

log.step(`SAIPE ${YEAR} — county child poverty`);
log.ok(`GET ${URL}`);

const raw = await fetchJson(URL);
// raw[0] is the header row: ["NAME","SAEPOVRT0_17_PT","time","state","county"]
const [header, ...rows] = raw;
const iName = header.indexOf('NAME');
const iRate = header.indexOf('SAEPOVRT0_17_PT');
const iState = header.indexOf('state');
const iCounty = header.indexOf('county');

const out = {
  _meta: {
    year: YEAR,
    source: 'U.S. Census Bureau, Small Area Income and Poverty Estimates',
    url: URL,
    metric: 'Children 0–17 in poverty (percent)',
  },
  values: {},
};

for (const r of rows) {
  const rate = parseFloat(r[iRate]);
  if (!Number.isFinite(rate)) continue;
  const fips = String(r[iState]).padStart(2, '0') + String(r[iCounty]).padStart(3, '0');
  out.values[fips] = rate;
  // Keep a friendly county name for tooltips.
  out[`name_${fips}`] = r[iName];
}

log.ok(`collected ${Object.keys(out.values).length} counties`);
writeJson('saipe-counties.json', out);
