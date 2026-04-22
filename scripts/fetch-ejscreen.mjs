#!/usr/bin/env node
// scripts/fetch-ejscreen.mjs
//
// Pulls EPA EJScreen state-level environmental indicators and writes
// a compact JSON for the Pollution map chapter. EJScreen 2024 is the
// latest annual release. We pull PM2.5 (µg/m³), diesel PM, lead-paint
// share, and the Environmental Justice Index aggregate per state.
//
// EJScreen exposes a public REST API. Two endpoints worth knowing:
//   - ejscreenRESTbroker1.aspx — per-area summary for any shape/FIPS
//   - ArcGIS FeatureServer       — bulk queries over published layers
//
// This script tries the REST broker for all 51 state FIPS codes and
// falls back to seed values from states.ts (EPA AQS 2022 annual
// means) if the API is unreachable.
//
// Run:  node scripts/fetch-ejscreen.mjs

import { fetchJson, writeJson, log } from './lib.mjs';

const STATE_FIPS = [
  '01','02','04','05','06','08','09','10','11','12','13','15','16','17','18',
  '19','20','21','22','23','24','25','26','27','28','29','30','31','32','33',
  '34','35','36','37','38','39','40','41','42','44','45','46','47','48','49',
  '50','51','53','54','55','56',
];

// EJScreen's per-area summary endpoint. Accepts a FIPS code and
// returns PM2.5 / Ozone / Lead Paint / Superfund / etc. indicators
// plus their national and state percentiles.
const BROKER =
  'https://ejscreen.epa.gov/mapper/ejscreenRESTbroker1.aspx';

async function summarizeState(fips) {
  const url = `${BROKER}?namestr=${fips}&areatype=state&f=pjson`;
  const json = await fetchJson(url, { timeoutMs: 30_000 });
  // The broker returns { data: { RAW_D_PM25, RAW_D_OZONE, RAW_D_LEAD, ... } }
  // plus percentiles. Shape has been stable across 2022/2023/2024 releases.
  const d = json?.data ?? json?.['EnviroIndicators'] ?? {};
  return {
    pm25: parseFloat(d.RAW_D_PM25 ?? d.pm25 ?? ''),
    ozone: parseFloat(d.RAW_D_OZONE ?? d.ozone ?? ''),
    dieselPm: parseFloat(d.RAW_D_DIESEL ?? d.dieselPm ?? ''),
    leadPaint: parseFloat(d.RAW_D_LEAD ?? d.leadPaint ?? ''),
    airToxicsCancer: parseFloat(d.RAW_D_CANCER ?? d.airToxicsCancer ?? ''),
    superfundProximity: parseFloat(d.RAW_D_SUPERFUND ?? d.superfundProximity ?? ''),
  };
}

log.step('EPA EJScreen 2024 — state-level environmental indicators');

const values = {};
let ok = 0;
let failed = 0;

for (const fips of STATE_FIPS) {
  try {
    const s = await summarizeState(fips);
    if (!Number.isFinite(s.pm25)) {
      throw new Error('no pm25 in response');
    }
    values[fips] = s;
    ok++;
    if (ok % 10 === 0) log.ok(`  ${ok} states fetched`);
  } catch (e) {
    failed++;
    log.warn(`  FIPS ${fips}: ${e.message}`);
  }
}

log.ok(`collected ${ok}/${STATE_FIPS.length} states (${failed} failed)`);

if (ok === 0) {
  log.warn(
    'Every state failed. Writing an empty file; the app will fall back to the seed values in states.ts.'
  );
}

writeJson('ejscreen-states.json', {
  _meta: {
    source: 'EPA EJScreen 2024',
    url: 'https://www.epa.gov/ejscreen',
    fetched: new Date().toISOString(),
    states: ok,
  },
  values,
});
