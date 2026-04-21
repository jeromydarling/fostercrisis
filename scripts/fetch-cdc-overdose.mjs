#!/usr/bin/env node
// scripts/fetch-cdc-overdose.mjs
//
// Pulls the CDC NCHS VSRR Provisional County-Level Drug Overdose Deaths
// dataset via its Socrata API and writes a compact {fips: rate} JSON.
//
//   Dataset: https://data.cdc.gov/NCHS/VSRR-Provisional-County-Level-Drug-Overdose-Deaths/xx3s-m5vs
//   Metric:  Age-adjusted death rate (12-month ending).
//
// Note: CDC suppresses counties with fewer than 20 deaths per reporting
// window. Suppressed counties will appear as missing data in the map.
//
// Run:  node scripts/fetch-cdc-overdose.mjs

import { fetchJson, writeJson, log } from './lib.mjs';

const DATASET = 'xx3s-m5vs';
const URL = `https://data.cdc.gov/resource/${DATASET}.json?$limit=50000&$order=month_year%20DESC`;

log.step('CDC Provisional County Drug Overdose Deaths');
log.ok(`GET ${URL}`);

const rows = await fetchJson(URL);
// Keep only the latest month for each FIPS code.
const latest = new Map();
for (const r of rows) {
  const fips = String(r.fipscode ?? r.county_fips ?? r.fips ?? '').padStart(5, '0');
  const rate = parseFloat(r.aadr ?? r.age_adjusted_rate ?? r.rate ?? r.data_value ?? '');
  const when = String(r.month_year ?? r.date ?? '');
  if (!fips || !Number.isFinite(rate)) continue;
  const prev = latest.get(fips);
  if (!prev || when > prev.when) latest.set(fips, { rate, when });
}

const out = {
  _meta: {
    source: 'CDC NCHS VSRR Provisional County-Level Drug Overdose Deaths',
    url: `https://data.cdc.gov/NCHS/VSRR-Provisional-County-Level-Drug-Overdose-Deaths/${DATASET}`,
    metric: 'Age-adjusted overdose death rate (12-month ending), per 100k',
    fetched: new Date().toISOString(),
  },
  values: Object.fromEntries([...latest.entries()].map(([k, v]) => [k, v.rate])),
};
log.ok(`collected ${Object.keys(out.values).length} counties`);
writeJson('cdc-overdose-counties.json', out);
