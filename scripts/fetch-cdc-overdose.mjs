#!/usr/bin/env node
// scripts/fetch-cdc-overdose.mjs
//
// Pulls the CDC NCHS VSRR Provisional County-Level Drug Overdose Deaths
// dataset via the Socrata API. The dataset ID has shifted across CDC's
// catalog refreshes — we try a list of known IDs and use the first one
// that responds with data. If none work, we skip (no crash) because
// src/data/geo.ts already falls back to state-level overdose estimates.
//
// Run:  node scripts/fetch-cdc-overdose.mjs

import { fetchJson, writeJson, log } from './lib.mjs';

// Known CDC county-level drug-overdose dataset IDs, most recent first.
// When one 404s (CDC rotates these annually), we try the next. Update
// by scanning https://data.cdc.gov and searching "County Drug Overdose".
const DATASET_IDS = [
  'xx3s-m5vs', // 2020–2023 VSRR
  '3v9z-v3zq', // 2023+ VSRR (newer refresh)
  'wpn7-6pb7', // alternate naming on some CDC mirrors
];

async function tryDataset(id) {
  const url = `https://data.cdc.gov/resource/${id}.json?$limit=50000&$order=month_year%20DESC`;
  log.ok(`GET ${url}`);
  return fetchJson(url);
}

log.step('CDC Provisional County Drug Overdose Deaths');

let rows = null;
let usedId = null;
for (const id of DATASET_IDS) {
  try {
    rows = await tryDataset(id);
    usedId = id;
    break;
  } catch (e) {
    log.warn(`  ${id}: ${e.message}`);
  }
}

if (!rows) {
  // Graceful skip — CDC dataset unavailable. geo.ts falls back to the
  // state-level `overdoseDeaths` field already in states.ts.
  log.warn(
    'All known CDC dataset IDs failed. Skipping — chapter IV will use the state-level overdose rates from states.ts.'
  );
  process.exit(0);
}

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
    datasetId: usedId,
    url: `https://data.cdc.gov/NCHS/VSRR-Provisional-County-Level-Drug-Overdose-Deaths/${usedId}`,
    metric: 'Age-adjusted overdose death rate (12-month ending), per 100k',
    fetched: new Date().toISOString(),
  },
  values: Object.fromEntries([...latest.entries()].map(([k, v]) => [k, v.rate])),
};
log.ok(`collected ${Object.keys(out.values).length} counties`);
writeJson('cdc-overdose-counties.json', out);
