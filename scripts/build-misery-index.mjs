#!/usr/bin/env node
// scripts/build-misery-index.mjs
//
// Composes the county-level misery index + churches-per-10k + complicity
// score. Reads:
//   public/data/saipe-counties.json             (child poverty)
//   public/data/cdc-overdose-counties.json      (overdose rate)
//   public/data/county-health-rankings.json     (poor health, premature death)
//   public/data/acs-county.json                 (population + disability)
//   public/data/churches.geojson                (~356k point features)
//   public/data/counties-10m.json               (us-atlas TopoJSON)
//
// Writes public/data/misery-counties.json with the shape consumed by
// src/data/geo.ts:
//
//   {
//     _meta: { indicators: [...], source, generated },
//     counties: {
//       "01001": { misery: 1.23, churchesPer10k: 4.1, complicity: 88 },
//       ...
//     }
//   }
//
// Run:  node scripts/build-misery-index.mjs

import fs from 'node:fs';
import path from 'node:path';
import { feature } from 'topojson-client';
import { log, OUT_DIR, writeJson } from './lib.mjs';

function readJson(name) {
  const p = path.join(OUT_DIR, name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

log.step('Build misery index');

const saipe = readJson('saipe-counties.json');
const cdc = readJson('cdc-overdose-counties.json');
const chr = readJson('county-health-rankings.json');
const acs = readJson('acs-county.json');
const churchesRaw = readJson('churches.geojson');
const countiesTopo = readJson('counties-10m.json');

if (!countiesTopo) {
  log.err('Missing public/data/counties-10m.json — this file ships with the repo.');
  process.exit(1);
}

const countyFc = feature(countiesTopo, countiesTopo.objects.counties);

// --- Point-in-polygon churches → counties ------------------------------
const churchesPerCounty = new Map();
if (churchesRaw?.features?.length) {
  log.ok(`PIP ${churchesRaw.features.length.toLocaleString()} churches against ${countyFc.features.length} counties`);

  // Precompute county bboxes once.
  const bboxes = countyFc.features.map((f) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const visit = (coords) => {
      if (typeof coords[0] === 'number') {
        if (coords[0] < minX) minX = coords[0];
        if (coords[0] > maxX) maxX = coords[0];
        if (coords[1] < minY) minY = coords[1];
        if (coords[1] > maxY) maxY = coords[1];
      } else {
        for (const c of coords) visit(c);
      }
    };
    visit(f.geometry.coordinates);
    return { minX, minY, maxX, maxY, f };
  });

  // Spatial grid: 1° lat × 1° lon bins, each carrying county indices
  // whose bbox touches that bin.
  const grid = new Map();
  const key = (gx, gy) => `${gx}|${gy}`;
  for (let i = 0; i < bboxes.length; i++) {
    const b = bboxes[i];
    const gx0 = Math.floor(b.minX);
    const gx1 = Math.floor(b.maxX);
    const gy0 = Math.floor(b.minY);
    const gy1 = Math.floor(b.maxY);
    for (let gx = gx0; gx <= gx1; gx++) {
      for (let gy = gy0; gy <= gy1; gy++) {
        const k = key(gx, gy);
        let arr = grid.get(k);
        if (!arr) { arr = []; grid.set(k, arr); }
        arr.push(i);
      }
    }
  }

  // Ray-casting PIP against a Polygon or MultiPolygon feature.
  const pip = (feat, x, y) => {
    const rings = feat.geometry.type === 'Polygon'
      ? [feat.geometry.coordinates]
      : feat.geometry.coordinates;
    let inside = false;
    for (const poly of rings) {
      for (let r = 0; r < poly.length; r++) {
        const ring = poly[r];
        let inThisRing = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const xi = ring[i][0], yi = ring[i][1];
          const xj = ring[j][0], yj = ring[j][1];
          if ((yi > y) !== (yj > y)) {
            const at = xi + ((y - yi) / (yj - yi || 1e-12)) * (xj - xi);
            if (x < at) inThisRing = !inThisRing;
          }
        }
        // Even-odd for holes: XOR each ring.
        if (r === 0) inside = inside !== inThisRing;
        else inside = inside !== inThisRing;
      }
    }
    return inside;
  };

  let hits = 0;
  let misses = 0;
  let checked = 0;
  for (const f of churchesRaw.features) {
    if (f.geometry?.type !== 'Point') continue;
    const [x, y] = f.geometry.coordinates;
    const k = key(Math.floor(x), Math.floor(y));
    const candidates = grid.get(k);
    if (!candidates) { misses++; continue; }
    let placed = false;
    for (const idx of candidates) {
      const b = bboxes[idx];
      if (x < b.minX || x > b.maxX || y < b.minY || y > b.maxY) continue;
      checked++;
      if (pip(b.f, x, y)) {
        const fips = String(b.f.id).padStart(5, '0');
        churchesPerCounty.set(fips, (churchesPerCounty.get(fips) ?? 0) + 1);
        hits++;
        placed = true;
        break;
      }
    }
    if (!placed) misses++;
  }
  log.ok(`PIP complete: ${hits.toLocaleString()} placed, ${misses.toLocaleString()} unplaced (likely offshore/AK/HI simplification)`);
  log.ok(`  ${checked.toLocaleString()} candidate polygon tests`);
} else {
  log.warn('No churches.geojson — churchesPerCounty will be empty.');
}

// --- Collect indicator streams per county ------------------------------
const counties = new Map();
const ensure = (fips) => {
  let c = counties.get(fips);
  if (!c) { c = {}; counties.set(fips, c); }
  return c;
};

if (saipe) for (const [fips, v] of Object.entries(saipe.values ?? {})) ensure(fips).poverty = v;
if (cdc) for (const [fips, v] of Object.entries(cdc.values ?? {})) ensure(fips).overdose = v;
if (chr) {
  for (const [fips, row] of Object.entries(chr.values ?? {})) {
    const c = ensure(fips);
    if (row.poorHealth != null) c.poorHealth = row.poorHealth;
    if (row.prematureDeath != null) c.prematureDeath = row.prematureDeath;
  }
}
if (acs) {
  for (const [fips, v] of Object.entries(acs.disabilityPct ?? {})) ensure(fips).disability = v;
  for (const [fips, v] of Object.entries(acs.population ?? {})) ensure(fips).population = v;
}

// Merge church counts.
for (const [fips, n] of churchesPerCounty) {
  ensure(fips).churchCount = n;
}

// --- Z-score each indicator; sum for misery ----------------------------
const indicators = ['poverty', 'overdose', 'poorHealth', 'prematureDeath', 'disability'];
const stats = {};
for (const k of indicators) {
  const vs = [];
  for (const c of counties.values()) {
    if (typeof c[k] === 'number' && Number.isFinite(c[k])) vs.push(c[k]);
  }
  if (!vs.length) { stats[k] = { mean: 0, sd: 1 }; continue; }
  const mean = vs.reduce((a, b) => a + b, 0) / vs.length;
  const sd = Math.sqrt(vs.reduce((a, b) => a + (b - mean) ** 2, 0) / vs.length) || 1;
  stats[k] = { mean, sd };
}

const out = {};
const miseryValues = [];
const churchesPer10kValues = [];

for (const [fips, c] of counties) {
  let sum = 0;
  let n = 0;
  for (const k of indicators) {
    if (typeof c[k] !== 'number') continue;
    sum += (c[k] - stats[k].mean) / stats[k].sd;
    n++;
  }
  const misery = n ? sum : null;
  const per10k = c.population && c.churchCount != null
    ? (c.churchCount / c.population) * 10000
    : null;

  out[fips] = { misery, churchesPer10k: per10k, churchCount: c.churchCount ?? 0, population: c.population ?? null };
  if (typeof misery === 'number') miseryValues.push(misery);
  if (typeof per10k === 'number') churchesPer10kValues.push(per10k);
}

// --- Complicity = percentile(misery) + percentile(churchesPer10k) − 100 -
miseryValues.sort((a, b) => a - b);
churchesPer10kValues.sort((a, b) => a - b);

const pct = (arr, v) => {
  if (!arr.length) return 50;
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (arr[m] < v) lo = m + 1; else hi = m;
  }
  return (lo / arr.length) * 100;
};

for (const [fips, row] of Object.entries(out)) {
  if (typeof row.misery === 'number' && typeof row.churchesPer10k === 'number') {
    out[fips].complicity = pct(miseryValues, row.misery) + pct(churchesPer10kValues, row.churchesPer10k) - 100;
  } else {
    out[fips].complicity = null;
  }
}

log.ok(`composed ${Object.keys(out).length} counties`);
writeJson('misery-counties.json', {
  _meta: {
    indicators,
    source: 'SAIPE · CDC VSRR · County Health Rankings · ACS · HIFLD',
    generated: new Date().toISOString(),
  },
  counties: out,
});
