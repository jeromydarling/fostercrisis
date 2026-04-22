#!/usr/bin/env node
// scripts/fetch-churches.mjs
//
// Fetches Christian places of worship across the U.S. and writes a minimal
// GeoJSON point set. Robust against Overpass rate-limits (429) and
// gateway timeouts (504) — each state gets its own retry loop across
// multiple mirrors with exponential backoff, and if a huge state still
// times out as a single query, we chunk it by bbox and re-issue.
//
// Default source is OpenStreetMap via Overpass. HIFLD (--source hifld)
// is available as a fallback but the public ArcGIS endpoint URL has
// shifted over the years; update HIFLD_SERVICE if it 403s.
//
// Run:  node scripts/fetch-churches.mjs [--source osm|hifld|auto]
//       default: auto (OSM first, HIFLD fallback on total OSM failure)
//
// Output: public/data/churches.geojson
//
// This script is intentionally tolerant: it NEVER exits non-zero on
// partial data. The CI deploy needs to finish regardless of how many
// states came back; the app's geo.ts loader handles zero-features.

import fs from 'node:fs';
import path from 'node:path';
import { fetchJson, fetchText, log, OUT_DIR, ensureOutDir } from './lib.mjs';

const SOURCE = (process.argv.find((a) => a.startsWith('--source='))?.split('=')[1]) ||
  (process.argv.includes('--source') ? process.argv[process.argv.indexOf('--source') + 1] : 'auto');

// HIFLD "All Places of Worship" — ArcGIS REST.
const HIFLD_SERVICE =
  'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/All_Places_of_Worship/FeatureServer/0';

async function fetchHifld() {
  log.step('HIFLD All Places of Worship (ArcGIS)');
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

// --- OSM Overpass --------------------------------------------------------

const US_STATE_ISO = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA',
  'ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR',
  'PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

// Mirror pool — rotating on failure. Order matters: the first three are
// the best-known mirrors; the last two are backups that sometimes
// succeed when the front three are overloaded.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

// Very large states — if the full-state query times out, we chunk into
// four quadrants using a rough centroid bbox. Bboxes are
// [south, west, north, east] in OSM order.
const CHUNK_BBOX = {
  CA: [32.5, -124.5, 42.0, -114.1],
  TX: [25.8, -106.7, 36.5, -93.5],
  NY: [40.5, -79.8, 45.0, -71.9],
  FL: [24.5, -87.7, 31.0, -80.0],
  IL: [36.9, -91.6, 42.5, -87.0],
  PA: [39.7, -80.6, 42.3, -74.7],
  OH: [38.4, -84.9, 42.0, -80.5],
  GA: [30.4, -85.7, 35.0, -80.8],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function overpass(query, attempt) {
  const base = OVERPASS_ENDPOINTS[attempt % OVERPASS_ENDPOINTS.length];
  const url = `${base}?data=${encodeURIComponent(query)}`;
  const text = await fetchText(url, { timeoutMs: 150_000 });
  return { json: JSON.parse(text), mirror: base.split('/')[2] };
}

function queryForArea(iso) {
  return `[out:json][timeout:90];
area["ISO3166-2"="US-${iso}"]->.s;
(
  node["amenity"="place_of_worship"]["religion"~"christian",i](area.s);
  way["amenity"="place_of_worship"]["religion"~"christian",i](area.s);
);
out center tags;`;
}

function queryForBbox([s, w, n, e]) {
  return `[out:json][timeout:90];
(
  node["amenity"="place_of_worship"]["religion"~"christian",i](${s},${w},${n},${e});
  way["amenity"="place_of_worship"]["religion"~"christian",i](${s},${w},${n},${e});
);
out center tags;`;
}

// Try a state's full query across all mirrors with exponential backoff.
// Returns { elements, mirror } or null if every attempt failed.
async function fetchState(iso) {
  const MAX_ATTEMPTS = 6;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const { json, mirror } = await overpass(queryForArea(iso), attempt);
      return { elements: json.elements ?? [], mirror };
    } catch (e) {
      const mirror = OVERPASS_ENDPOINTS[attempt % OVERPASS_ENDPOINTS.length].split('/')[2];
      log.warn(`${iso} · ${mirror} attempt ${attempt + 1} failed (${e.message.slice(0, 120)})`);
      // Exponential backoff, capped at 30s.
      await sleep(Math.min(30_000, 1500 * Math.pow(1.8, attempt)));
    }
  }
  return null;
}

// Chunk a bbox into 4 equal quadrants and try each.
async function fetchStateChunked(iso, bbox) {
  const [s, w, n, e] = bbox;
  const midLat = (s + n) / 2;
  const midLon = (w + e) / 2;
  const chunks = [
    [s, w, midLat, midLon],
    [s, midLon, midLat, e],
    [midLat, w, n, midLon],
    [midLat, midLon, n, e],
  ];
  const elements = [];
  let successful = 0;
  for (let ci = 0; ci < chunks.length; ci++) {
    const chunk = chunks[ci];
    const MAX_ATTEMPTS = 4;
    let got = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const { json, mirror } = await overpass(queryForBbox(chunk), attempt);
        got = json;
        log.ok(`${iso} chunk ${ci + 1}/4 via ${mirror}: ${(json.elements ?? []).length}`);
        break;
      } catch (e) {
        log.warn(`${iso} chunk ${ci + 1}/4 attempt ${attempt + 1} failed (${e.message.slice(0, 100)})`);
        await sleep(Math.min(20_000, 1500 * Math.pow(1.8, attempt)));
      }
    }
    if (got) {
      elements.push(...(got.elements ?? []));
      successful++;
    }
  }
  return { elements, mirror: `${successful}/${chunks.length} chunks` };
}

// --- main -----------------------------------------------------------------

// A state is "complete enough" if it already has at least this many
// features in the existing file. DC is the smallest real state at ~535,
// so 30 is a safe floor — anything below means the prior run failed or
// was truncated.
const MIN_FEATURES_PER_STATE = 30;

async function main() {
  ensureOutDir();
  const outPath = path.join(OUT_DIR, 'churches.geojson');

  // --- Load existing file (from the restored cache) so we can resume. ---
  let existingFeatures = [];
  const existingCounts = new Map(); // ISO → count
  if (fs.existsSync(outPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      if (Array.isArray(prev.features)) {
        existingFeatures = prev.features;
        for (const f of existingFeatures) {
          const s = f.properties?.s;
          if (s) existingCounts.set(s, (existingCounts.get(s) ?? 0) + 1);
        }
        log.ok(
          `loaded existing file: ${existingFeatures.length.toLocaleString()} features across ${existingCounts.size} states`
        );
      }
    } catch (e) {
      log.warn(`existing churches.geojson unreadable (${e.message}); starting fresh`);
      existingFeatures = [];
      existingCounts.clear();
    }
  }

  // Build the "needs fetching" state list.
  const needs = US_STATE_ISO.filter((iso) => (existingCounts.get(iso) ?? 0) < MIN_FEATURES_PER_STATE);
  const skipped = US_STATE_ISO.length - needs.length;
  if (skipped > 0) {
    log.ok(
      `${skipped} state${skipped === 1 ? '' : 's'} already have ≥${MIN_FEATURES_PER_STATE} features — skipping. Fetching ${needs.length}: ${needs.join(', ') || '(none)'}`
    );
  }

  // --- Fetch just the missing ones. ---
  const newFeatures = [];

  if (needs.length > 0 && (SOURCE === 'osm' || SOURCE === 'auto')) {
    log.step('OpenStreetMap Overpass — christian places of worship');
    for (const iso of needs) {
      let got = await fetchState(iso);
      if ((!got || got.elements.length === 0) && CHUNK_BBOX[iso]) {
        log.warn(`${iso}: full-state query exhausted; chunking into 4 bboxes`);
        got = await fetchStateChunked(iso, CHUNK_BBOX[iso]);
      }
      if (!got || got.elements.length === 0) {
        log.err(`${iso}: no features after all attempts; leaving for next run`);
        continue;
      }
      for (const el of got.elements) {
        const lon = el.lon ?? el.center?.lon;
        const lat = el.lat ?? el.center?.lat;
        if (typeof lon !== 'number' || typeof lat !== 'number') continue;
        newFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lon, lat] },
          properties: {
            n: el.tags?.name ?? null,
            s: iso,
            d: el.tags?.denomination ?? null,
          },
        });
      }
      log.ok(`OSM ${iso}: +${got.elements.length} (new total ${existingFeatures.length + newFeatures.length})`);
      await sleep(500);
    }
  }

  if (
    newFeatures.length === 0 &&
    existingFeatures.length === 0 &&
    (SOURCE === 'hifld' || SOURCE === 'auto')
  ) {
    log.step('Falling back to HIFLD');
    try {
      const hifld = await fetchHifld();
      newFeatures.push(...hifld.features);
    } catch (e) {
      log.warn(`HIFLD failed: ${e.message}`);
    }
  }

  // Merge existing + new. No dedupe needed — we only fetched states we
  // didn't already have, so there's no overlap.
  const merged = [...existingFeatures, ...newFeatures];

  const fc = {
    type: 'FeatureCollection',
    features: merged,
    metadata: {
      source: 'OpenStreetMap Overpass',
      fetched: new Date().toISOString(),
      count: merged.length,
      patched: newFeatures.length > 0,
    },
  };

  fs.writeFileSync(outPath, JSON.stringify(fc));
  const sz = fs.statSync(outPath).size;

  const stateSummary = US_STATE_ISO.map((iso) => {
    const prev = existingCounts.get(iso) ?? 0;
    const added = newFeatures.filter((f) => f.properties?.s === iso).length;
    return { iso, prev, added, total: prev + added };
  });
  const missing = stateSummary.filter((s) => s.total < MIN_FEATURES_PER_STATE).map((s) => s.iso);
  const addedStates = stateSummary.filter((s) => s.added > 0).map((s) => `${s.iso}(+${s.added})`);

  log.ok(
    `wrote churches.geojson — ${merged.length.toLocaleString()} features (${(sz / 1024 / 1024).toFixed(1)} MB)`
  );
  if (addedStates.length) log.ok(`  added this run: ${addedStates.join(', ')}`);
  if (missing.length) {
    log.warn(
      `  still missing (<${MIN_FEATURES_PER_STATE} features): ${missing.join(', ')} — re-run to patch`
    );
  } else {
    log.ok(`  all 51 states have ≥${MIN_FEATURES_PER_STATE} features. Cache is complete.`);
  }
}

await main();

