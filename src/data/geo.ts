import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import { STATE_INDEX, type StateRow } from './states';
import { CHAPTERS, metricValue, type Metric } from './chapters';

// Minimal TopoJSON shape we actually consume.
type Topology = Parameters<typeof feature>[0];

// us-atlas 10m states TopoJSON. Lightweight (~85 KB) and battle-tested.
const STATES_TOPO = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

export interface StateFeatureProps extends Partial<StateRow> {
  fips: string;
  name: string;
  // Pre-computed per-metric values so Mapbox data-driven styles can key off
  // `metric_${id}` without needing to rewrite the source on chapter change.
  [key: `metric_${string}`]: number | undefined;
}

export async function loadStatesGeojson(): Promise<
  FeatureCollection<Geometry, StateFeatureProps>
> {
  const res = await fetch(STATES_TOPO);
  if (!res.ok) throw new Error(`Failed to load ${STATES_TOPO}`);
  const topo = (await res.json()) as Topology;
  const fc = feature(topo, topo.objects.states) as unknown as FeatureCollection<
    Geometry,
    { name: string }
  >;

  const metrics: Metric[] = CHAPTERS.map((c) => c.metric);
  const joined = {
    ...fc,
    features: fc.features.map((f) => {
      // us-atlas features carry `id` as the 2-digit state FIPS code.
      const fips = String(f.id).padStart(2, '0');
      const row = STATE_INDEX[fips];
      const props: StateFeatureProps = {
        ...(row ?? {}),
        fips,
        name: row?.name ?? f.properties.name,
      };
      if (row) {
        for (const m of metrics) {
          props[`metric_${m}`] = metricValue(row, m);
        }
      }
      return { ...f, id: fips, properties: props };
    }),
  };
  return joined;
}

// Placeholder congregation "dots" generated deterministically per state so the
// church solution overlay renders even without the full HIFLD geocoded set.
// Each state gets points proportional to its congregation count (capped for
// rendering performance).
export function buildCongregationPoints(): FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  // Rough state bounding boxes (min lon, min lat, max lon, max lat).
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

  // Poor man's PRNG — deterministic, so dots don't reshuffle between renders.
  function prng(seed: number) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
  }

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
        properties: { state: row.code },
      });
    }
  }
  return { type: 'FeatureCollection', features };
}
