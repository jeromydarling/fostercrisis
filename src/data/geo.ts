import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import { STATE_INDEX, STATES, type StateRow } from './states';
import { CHAPTERS, metricValue, type Metric } from './chapters';

// Minimal TopoJSON shape we actually consume.
type Topology = Parameters<typeof feature>[0];

// Vite rewrites asset URLs relative to `base` at build time. Using
// BASE_URL here keeps the app working at both `/` (dev / custom domain)
// and `/<repo>/` (GitHub Pages project site).
const BASE = import.meta.env.BASE_URL;

// us-atlas 10m boundaries are committed to /public/data/ so the app renders
// offline. The us-atlas 10m files total < 1 MB and haven't changed in years.
const STATES_URL = `${BASE}data/states-10m.json`;
const COUNTIES_URL = `${BASE}data/counties-10m.json`;

// Optional live-data overlays produced by `npm run data:*` scripts.
const SAIPE_URL = `${BASE}data/saipe-counties.json`;
const CDC_URL = `${BASE}data/cdc-overdose-counties.json`;
const CHURCHES_URL = `${BASE}data/churches.geojson`;
const MISERY_URL = `${BASE}data/misery-counties.json`;

export interface StateFeatureProps extends Partial<StateRow> {
  fips: string;
  name: string;
  [key: `metric_${string}`]: number | undefined;
}

export interface CountyFeatureProps {
  fips: string; // 5-digit state+county
  stateFips: string;
  name: string;
  poverty?: number;
  overdose?: number;
  /** Composite misery score. Higher = worse. Either loaded from
   *  misery-counties.json (z-score sum of poverty + overdose + CHR
   *  health outcomes + disability) or computed as a two-signal fallback
   *  from poverty + overdose when the real file isn't present. */
  misery?: number;
  /** Christian congregations per 10k residents. Either from the
   *  misery file (real PIP against HIFLD points) or approximated from
   *  state-level congregation totals scaled by child population. */
  churchesPer10k?: number;
  /** Complicity score = misery_percentile − (100 − churches_percentile).
   *  Positive = high misery + high church presence (the accusation).
   *  Negative = high misery + low church presence (unserved). */
  complicity?: number;
}

export interface GeoBundle {
  states: FeatureCollection<Geometry, StateFeatureProps>;
  counties: FeatureCollection<Geometry, CountyFeatureProps>;
  churches: FeatureCollection | null;
  /** Whether real HIFLD/OSM churches were loaded. */
  realChurches: boolean;
  /** Whether county-level SAIPE was loaded. */
  hasCountyPoverty: boolean;
  /** Whether county-level CDC overdose was loaded. */
  hasCountyOverdose: boolean;
  /** Whether the full misery-index file was loaded (CHR + ACS + PIP). */
  hasFullMisery: boolean;
}

interface MiseryFile {
  _meta: {
    indicators: string[];
    source: string;
    generated: string;
  };
  counties: Record<
    string,
    {
      misery: number;
      churchesPer10k?: number;
      complicity?: number;
    }
  >;
}

async function tryFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    // Vite's dev server SPA-falls back to index.html for missing files, so we
    // must verify the response is actually JSON before parsing.
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('json') && !ct.includes('geo+json')) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchStatesTopo(): Promise<FeatureCollection<Geometry, { name: string }>> {
  const topo = await tryFetch<Topology>(STATES_URL);
  if (!topo) throw new Error(`Missing ${STATES_URL}`);
  return feature(topo, topo.objects.states) as unknown as FeatureCollection<Geometry, { name: string }>;
}

async function fetchCountiesTopo(): Promise<FeatureCollection<Geometry, { name: string }>> {
  const topo = await tryFetch<Topology>(COUNTIES_URL);
  if (!topo) throw new Error(`Missing ${COUNTIES_URL}`);
  return feature(topo, topo.objects.counties) as unknown as FeatureCollection<Geometry, { name: string }>;
}

export async function loadAll(): Promise<GeoBundle> {
  const [statesFc, countiesFc, saipe, cdc, churches, misery] = await Promise.all([
    fetchStatesTopo(),
    fetchCountiesTopo(),
    tryFetch<{ values: Record<string, number> }>(SAIPE_URL),
    tryFetch<{ values: Record<string, number> }>(CDC_URL),
    tryFetch<FeatureCollection>(CHURCHES_URL),
    tryFetch<MiseryFile>(MISERY_URL),
  ]);

  // --- States: join per-state statistics + precompute each chapter metric ---
  const metrics: Metric[] = CHAPTERS.map((c) => c.metric);
  const states: FeatureCollection<Geometry, StateFeatureProps> = {
    ...statesFc,
    features: statesFc.features.map((f) => {
      const fips = String(f.id).padStart(2, '0');
      const row = STATE_INDEX[fips];
      const props: StateFeatureProps = {
        ...(row ?? {}),
        fips,
        name: row?.name ?? f.properties.name,
      };
      if (row) {
        for (const m of metrics) props[`metric_${m}`] = metricValue(row, m);
      }
      return { ...f, id: fips, properties: props };
    }),
  };

  // --- Counties: join SAIPE + CDC overdose when present ---
  const saipeVals = saipe?.values ?? {};
  const cdcVals = cdc?.values ?? {};

  // State-level fallback: if SAIPE/CDC files aren't present yet, fall back to
  // the per-state poverty and overdose values so chapters III/IV still render.
  const stateFallback = new Map<string, { pov: number; od: number }>();
  for (const s of STATES) {
    // Rough OD rate per 100k residents; chapter IV uses same denominator.
    const rate = (s.overdoseDeaths / (s.childPop * 4)) * 100000;
    stateFallback.set(s.fips, { pov: s.childPovertyPct, od: rate });
  }

  // --- Pass 1: compute per-county poverty + overdose (with state fallback) ---
  const provisional = countiesFc.features.map((f) => {
    const fips = String(f.id).padStart(5, '0');
    const stateFips = fips.slice(0, 2);
    const fb = stateFallback.get(stateFips);
    const pov = saipeVals[fips];
    const od = cdcVals[fips];
    return {
      f,
      fips,
      stateFips,
      poverty: Number.isFinite(pov) ? pov : fb?.pov,
      overdose: Number.isFinite(od) ? od : fb?.od,
    };
  });

  // --- Pass 2: compute seed misery (z-score of poverty + overdose) and
  //              churches-per-10k-residents (seeded from state totals)
  //              when the full misery-counties.json isn't available.
  const miseryMap = misery?.counties ?? {};

  const povVals = provisional.map((p) => p.poverty).filter((v): v is number => typeof v === 'number');
  const odVals = provisional.map((p) => p.overdose).filter((v): v is number => typeof v === 'number');
  const zStats = (arr: number[]) => {
    const n = arr.length || 1;
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    return { mean, sd: Math.sqrt(variance) || 1 };
  };
  const povZ = zStats(povVals);
  const odZ = zStats(odVals);

  // Pop estimate used only when we don't have a real ACS pop per county:
  // approximate county pop = state child pop * 4 * (county_pop / state_pop).
  // Without that denominator we fall back to per-state uniform share.
  const stateChurchPerPop = new Map<string, number>();
  for (const s of STATES) {
    const pop = s.childPop * 4; // rough total pop
    stateChurchPerPop.set(s.fips, (s.congregations / pop) * 10000);
  }

  const seededMisery = provisional.map((p) => {
    const real = miseryMap[p.fips];
    let miseryScore: number | undefined;
    let churchesPer10k: number | undefined;
    let complicity: number | undefined;

    if (real) {
      miseryScore = real.misery;
      churchesPer10k = real.churchesPer10k;
      complicity = real.complicity;
    } else {
      // Seed misery: z-score sum (poverty + overdose). Two signals is
      // weak but directionally correct — the same counties win either way.
      const povRaw = p.poverty;
      const odRaw = p.overdose;
      if (typeof povRaw === 'number' || typeof odRaw === 'number') {
        const zp = typeof povRaw === 'number' ? (povRaw - povZ.mean) / povZ.sd : 0;
        const zo = typeof odRaw === 'number' ? (odRaw - odZ.mean) / odZ.sd : 0;
        miseryScore = zp + zo;
      }
      // Seed churches-per-10k from state aggregates. All counties in a
      // state get the same value — the PIP script replaces this later.
      churchesPer10k = stateChurchPerPop.get(p.stateFips);
    }
    return { ...p, misery: miseryScore, churchesPer10k, complicity };
  });

  // Complicity: percentile(misery) + percentile(churchesPer10k) − 100.
  // Positive = both high (the indictment). Negative = low church + low
  // misery (neither acute). We rank separately so both can be seeded.
  if (!misery) {
    const mVals = seededMisery.map((s) => s.misery).filter((v): v is number => typeof v === 'number');
    const cVals = seededMisery.map((s) => s.churchesPer10k).filter((v): v is number => typeof v === 'number');
    mVals.sort((a, b) => a - b);
    cVals.sort((a, b) => a - b);
    const pct = (arr: number[], v: number) => {
      if (!arr.length) return 50;
      let lo = 0;
      let hi = arr.length;
      while (lo < hi) {
        const m = (lo + hi) >> 1;
        if (arr[m] < v) lo = m + 1;
        else hi = m;
      }
      return (lo / arr.length) * 100;
    };
    for (const s of seededMisery) {
      if (typeof s.misery !== 'number' || typeof s.churchesPer10k !== 'number') continue;
      s.complicity = pct(mVals, s.misery) + pct(cVals, s.churchesPer10k) - 100;
    }
  }

  const counties: FeatureCollection<Geometry, CountyFeatureProps> = {
    ...countiesFc,
    features: seededMisery.map((s) => ({
      ...s.f,
      id: s.fips,
      properties: {
        fips: s.fips,
        stateFips: s.stateFips,
        name: s.f.properties.name,
        poverty: s.poverty,
        overdose: s.overdose,
        misery: s.misery,
        churchesPer10k: s.churchesPer10k,
        complicity: s.complicity,
      },
    })),
  };

  return {
    states,
    counties,
    churches: churches ?? null,
    realChurches: !!churches,
    hasCountyPoverty: !!saipe,
    hasCountyOverdose: !!cdc,
    hasFullMisery: !!misery,
  };
}

// Fallback synthetic church dots — only used if the user hasn't run
// `npm run data:churches` yet. Deterministic per state.
export function buildSyntheticChurches(): FeatureCollection {
  const bboxes: Record<string, [number, number, number, number]> = {
    AL: [-88.47, 30.14, -84.89, 35.01], AK: [-168.0, 54.5, -140.0, 71.4],
    AZ: [-114.82, 31.33, -109.05, 37.00], AR: [-94.62, 33.00, -89.64, 36.50],
    CA: [-124.41, 32.53, -114.13, 42.01], CO: [-109.06, 36.99, -102.04, 41.00],
    CT: [-73.73, 40.98, -71.79, 42.05], DE: [-75.79, 38.45, -75.05, 39.84],
    DC: [-77.12, 38.79, -76.91, 38.99], FL: [-87.63, 24.50, -80.03, 31.00],
    GA: [-85.61, 30.36, -80.84, 35.00], HI: [-160.0, 18.91, -154.8, 22.23],
    ID: [-117.24, 41.99, -111.04, 49.00], IL: [-91.51, 36.97, -87.02, 42.51],
    IN: [-88.10, 37.77, -84.78, 41.76], IA: [-96.64, 40.37, -90.14, 43.50],
    KS: [-102.05, 36.99, -94.59, 40.00], KY: [-89.57, 36.50, -81.96, 39.15],
    LA: [-94.04, 28.93, -88.82, 33.02], ME: [-71.08, 43.06, -66.95, 47.46],
    MD: [-79.49, 37.89, -75.05, 39.72], MA: [-73.51, 41.24, -69.93, 42.89],
    MI: [-90.42, 41.70, -82.41, 48.31], MN: [-97.24, 43.50, -89.49, 49.38],
    MS: [-91.66, 30.17, -88.10, 34.99], MO: [-95.77, 35.99, -89.10, 40.62],
    MT: [-116.05, 44.36, -104.04, 49.00], NE: [-104.05, 40.00, -95.31, 43.00],
    NV: [-120.00, 35.00, -114.04, 42.00], NH: [-72.56, 42.70, -70.61, 45.31],
    NJ: [-75.56, 38.93, -73.89, 41.36], NM: [-109.05, 31.33, -103.00, 37.00],
    NY: [-79.76, 40.50, -71.86, 45.02], NC: [-84.32, 33.84, -75.46, 36.59],
    ND: [-104.05, 45.94, -96.55, 49.00], OH: [-84.82, 38.40, -80.52, 41.98],
    OK: [-103.00, 33.62, -94.43, 37.00], OR: [-124.57, 42.00, -116.46, 46.29],
    PA: [-80.52, 39.72, -74.69, 42.27], RI: [-71.86, 41.15, -71.12, 42.02],
    SC: [-83.35, 32.03, -78.54, 35.22], SD: [-104.06, 42.48, -96.44, 45.95],
    TN: [-90.31, 34.98, -81.65, 36.68], TX: [-106.65, 25.84, -93.51, 36.50],
    UT: [-114.05, 37.00, -109.04, 42.00], VT: [-73.44, 42.72, -71.46, 45.01],
    VA: [-83.68, 36.54, -75.24, 39.47], WA: [-124.85, 45.54, -116.92, 49.00],
    WV: [-82.64, 37.20, -77.72, 40.64], WI: [-92.89, 42.49, -86.80, 47.08],
    WY: [-111.06, 41.00, -104.05, 45.01],
  };
  function prng(seed: number) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
  }
  const features: GeoJSON.Feature[] = [];
  for (const fips in STATE_INDEX) {
    const row = STATE_INDEX[fips];
    const bbox = bboxes[row.code];
    if (!bbox) continue;
    const [minLon, minLat, maxLon, maxLat] = bbox;
    const cap = Math.min(600, Math.max(30, Math.round(row.congregations / 60)));
    const rand = prng(parseInt(fips, 10) * 2654435761);
    for (let i = 0; i < cap; i++) {
      const lon = minLon + rand() * (maxLon - minLon);
      const lat = minLat + rand() * (maxLat - minLat);
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lon, lat] },
        properties: { state: row.code, synthetic: true },
      });
    }
  }
  return { type: 'FeatureCollection', features };
}
