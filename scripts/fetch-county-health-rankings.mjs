#!/usr/bin/env node
// scripts/fetch-county-health-rankings.mjs
//
// Pulls County Health Rankings Analytic Data (one CSV per year, county
// FIPS + ~80 indicators) and writes the two composite-relevant columns
// we need for the misery index:
//   - "Poor or fair health" (percent of adults, self-reported)
//   - "Premature death" (years of potential life lost before age 75,
//     per 100,000)
//
// Column IDs in the CHR analytic file rotate yearly. If the script
// fails to find a column, update the COLUMN_HINTS list below from:
//   https://www.countyhealthrankings.org/explore-health-rankings/rankings-data-documentation
//
// Run:  node scripts/fetch-county-health-rankings.mjs [year]

import { fetchText, parseCsv, writeJson, log } from './lib.mjs';

const YEAR = process.argv[2] || '2024';

// CHR publishes at this path pattern. We try both historic URLs.
const URLS = [
  `https://www.countyhealthrankings.org/sites/default/files/media/document/analytic_data${YEAR}.csv`,
  `https://www.countyhealthrankings.org/sites/default/files/media/document/analytic_data${YEAR}_0.csv`,
];

const COLUMN_HINTS = {
  poorHealth: [/poor.or.fair.health.*rawvalue/i, /v002.*rawvalue/i],
  prematureDeath: [/premature.death.*rawvalue/i, /v001.*rawvalue/i],
  fipsState: [/^statecode$/i, /state.?fips/i],
  fipsCounty: [/^countycode$/i, /county.?fips/i],
};

function findCol(header, hints) {
  for (const h of hints) {
    const idx = header.findIndex((c) => h.test(c));
    if (idx >= 0) return idx;
  }
  return -1;
}

async function tryFetch() {
  for (const url of URLS) {
    try {
      log.ok(`GET ${url}`);
      const text = await fetchText(url, { timeoutMs: 120_000 });
      return { url, text };
    } catch (e) {
      log.warn(`  ${e.message}`);
    }
  }
  throw new Error('All CHR URLs failed — update URL list in fetch-county-health-rankings.mjs');
}

log.step(`County Health Rankings ${YEAR}`);
const { url, text } = await tryFetch();

const rows = parseCsv(text);
if (!rows.length) {
  log.err('No rows parsed from CHR CSV');
  process.exit(1);
}
const header = Object.keys(rows[0]);
const col = {
  state: findCol(header, COLUMN_HINTS.fipsState),
  county: findCol(header, COLUMN_HINTS.fipsCounty),
  poorHealth: findCol(header, COLUMN_HINTS.poorHealth),
  prematureDeath: findCol(header, COLUMN_HINTS.prematureDeath),
};
for (const [k, v] of Object.entries(col)) {
  if (v < 0) {
    log.err(`Could not locate column: ${k}`);
    log.err(`Header was: ${header.slice(0, 10).join(', ')}...`);
    process.exit(1);
  }
}

const values = {};
for (const r of rows) {
  const vs = Object.values(r);
  const sf = String(vs[col.state] ?? '').padStart(2, '0');
  const cf = String(vs[col.county] ?? '').padStart(3, '0');
  if (sf === '00' || cf === '000') continue; // state / nation rollups
  const fips = sf + cf;
  const ph = parseFloat(vs[col.poorHealth]);
  const pd = parseFloat(vs[col.prematureDeath]);
  if (!Number.isFinite(ph) && !Number.isFinite(pd)) continue;
  values[fips] = {
    poorHealth: Number.isFinite(ph) ? ph : null,
    prematureDeath: Number.isFinite(pd) ? pd : null,
  };
}

log.ok(`collected ${Object.keys(values).length} counties`);
writeJson('county-health-rankings.json', {
  _meta: {
    year: YEAR,
    source: 'County Health Rankings & Roadmaps (University of Wisconsin)',
    url,
  },
  values,
});
