#!/usr/bin/env node
// scripts/fetch-churches.mjs
//
// Fetches Christian places of worship across the U.S. and writes a minimal
// GeoJSON point set. Tries HIFLD first (authoritative, ~356k points),
// falls back to OpenStreetMap via Overpass if HIFLD is unavailable.
//
// Run:  node scripts/fetch-churches.mjs [--source hifld|osm]
//
// Output: public/data/churches.geojson

import fs from 'node:fs';
import path from 'node:path';
import { fetchJson, fetchText, log, OUT_DIR, ensureOutDir } from './lib.mjs';

const SOURCE = (process.argv.find((a) => a.startsWith('--source='))?.split('=')[1]) ||
  (process.argv.includes('--source') ? process.argv[process.argv.indexOf('--source') + 1] : 'auto');

// HIFLD "All Places of Worship" — ArcGIS REST query endpoint.
// The dataset id changes occasionally; if this 403s, update to the latest
// from https://hifld-geoplatform.hub.arcgis.com/
const HIFLD_SERVICE =
  'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/All_Places_of_Worship/FeatureServer/0';

async function fetchHifld() {
  log.step('HIFLD All Places of Worship (ArcGIS)');
  // Paginate via objectIds + resultOffset for reliable order.
  const features = [];
  const pageSize = 2000;
  let offset = 0;
  for (;;) {
    const url = `${HIFLD_SERVICE}/query?where=1%3D1&outFields=NAME,CITY,STATE,RELIGION&returnGeometry=true&f=geojson&resultRecordCount=${pageSize}&resultOffset=${offset}&outSR=4326`;
    const page = await fetchJson(url, { timeoutMs: 60_000 });
    const feats = page.features ?? [];
    if (!feats.length) break;
    for (const f of feats) {
      if (!f.geometry || f.geometry.type !== 'Point') continue;
      features.push({
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          n: f.properties?.NAME ?? null,
          c: f.properties?.CITY ?? null,
          s: f.properties?.STATE ?? null,
        },
      });
    }
    log.ok(`HIFLD +${feats.length} (running total ${features.length})`);
    if (feats.length < pageSize) break;
    offset += pageSize;
  }
  return { features, sourceLabel: 'HIFLD All Places of Worship' };
}

// OpenStreetMap via Overpass — per-state query to keep payloads reasonable.
// religion ~ christian matches christian/catholic/baptist/...
const US_STATE_ISO = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA',
  'ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR',
  'PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
];

async function fetchOsm() {
  log.step('OpenStreetMap Overpass — christian places of worship');
  const features = [];
  for (const iso of US_STATE_ISO) {
    const q = `[out:json][timeout:120];
      area["ISO3166-2"="US-${iso}"]->.s;
      (
        node["amenity"="place_of_worship"]["religion"~"christian",i](area.s);
        way["amenity"="place_of_worship"]["religion"~"christian",i](area.s);
      );
      out center tags;`;
    let got = null;
    for (const base of OVERPASS_ENDPOINTS) {
      try {
        const body = 'data=' + encodeURIComponent(q);
        const text = await fetchText(base, {
          timeoutMs: 180_000,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        void body; // POSTs vary per mirror; some require POST, some accept GET.
        got = JSON.parse(text);
        break;
      } catch (e) {
        log.warn(`${iso} · ${base.split('/')[2]} failed (${e.message})`);
      }
    }
    if (!got) {
      log.err(`${iso}: all Overpass mirrors failed; continuing`);
      continue;
    }
    for (const el of got.elements ?? []) {
      const lon = el.lon ?? el.center?.lon;
      const lat = el.lat ?? el.center?.lat;
      if (typeof lon !== 'number' || typeof lat !== 'number') continue;
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lon, lat] },
        properties: {
          n: el.tags?.name ?? null,
          s: iso,
          d: el.tags?.denomination ?? null,
        },
      });
    }
    log.ok(`OSM ${iso}: ${got.elements?.length ?? 0} (running ${features.length})`);
  }
  return { features, sourceLabel: 'OpenStreetMap Overpass' };
}

async function main() {
  let result = null;
  if (SOURCE === 'hifld' || SOURCE === 'auto') {
    try {
      result = await fetchHifld();
    } catch (e) {
      log.warn(`HIFLD failed: ${e.message}`);
      if (SOURCE === 'hifld') process.exit(1);
    }
  }
  if (!result && (SOURCE === 'osm' || SOURCE === 'auto')) {
    result = await fetchOsm();
  }
  if (!result || !result.features.length) {
    log.err('No features fetched from any source.');
    process.exit(1);
  }
  const fc = {
    type: 'FeatureCollection',
    features: result.features,
    metadata: {
      source: result.sourceLabel,
      fetched: new Date().toISOString(),
      count: result.features.length,
    },
  };
  ensureOutDir();
  const outPath = path.join(OUT_DIR, 'churches.geojson');
  fs.writeFileSync(outPath, JSON.stringify(fc));
  const sz = fs.statSync(outPath).size;
  log.ok(`wrote churches.geojson — ${result.features.length.toLocaleString()} features (${(sz / 1024 / 1024).toFixed(1)} MB)`);
}

await main();
