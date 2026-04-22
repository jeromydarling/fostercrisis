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

// Column names change format year to year. Accept both the legacy
// `v002_rawvalue` style AND the new "Premature Death raw value" style
// (with spaces). Matchers are case-insensitive and tolerate the
// space/underscore/hyphen substitutions CHR cycles through.
const RAW = /\b[_\s-]*raw[_\s-]*value\b/i;

const COLUMN_HINTS = {
  poorHealth: [
    /poor.{0,3}or.{0,3}fair.{0,3}health.*raw/i,
    /\bv002[_\s-]*rawvalue\b/i,
  ],
  prematureDeath: [
    /premature.{0,3}death.*raw/i,
    /\bv001[_\s-]*rawvalue\b/i,
    /\byears.{0,3}of.{0,3}potential.{0,3}life.{0,3}lost.*raw/i,
  ],
  fipsState: [/^state.{0,3}fips.{0,3}code$/i, /^statecode$/i, /^state.{0,3}fips$/i],
  fipsCounty: [/^county.{0,3}fips.{0,3}code$/i, /^countycode$/i, /^county.{0,3}fips$/i],
};
void RAW; // exported helper kept for future expansion

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

// FIPS columns are non-negotiable — without them we can't key to county.
if (col.state < 0 || col.county < 0) {
  log.err('Could not locate FIPS columns in CHR CSV. Columns:');
  log.err(`  ${header.slice(0, 10).join(', ')}...`);
  process.exit(1);
}

// Indicator columns are optional — log warnings and keep whatever we can.
// The misery-index builder handles missing fields via z-score filtering.
if (col.poorHealth < 0) log.warn('poorHealth column not found — skipping that indicator');
if (col.prematureDeath < 0) log.warn('prematureDeath column not found — skipping that indicator');
if (col.poorHealth < 0 && col.prematureDeath < 0) {
  log.warn('No CHR indicator columns located. Writing empty file; misery index will fall back to SAIPE + CDC only.');
  writeJson('county-health-rankings.json', {
    _meta: { year: YEAR, source: 'CHR (empty — column schema changed)', url },
    values: {},
  });
  process.exit(0);
}

const values = {};
for (const r of rows) {
  const vs = Object.values(r);
  const sf = String(vs[col.state] ?? '').padStart(2, '0');
  const cf = String(vs[col.county] ?? '').padStart(3, '0');
  if (sf === '00' || cf === '000') continue; // state / nation rollups
  const fips = sf + cf;
  const ph = col.poorHealth >= 0 ? parseFloat(vs[col.poorHealth]) : NaN;
  const pd = col.prematureDeath >= 0 ? parseFloat(vs[col.prematureDeath]) : NaN;
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
