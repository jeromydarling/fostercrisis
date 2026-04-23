import { useEffect, useRef, useState } from 'react';
import mapboxgl, { type ExpressionSpecification } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';
import { CHAPTERS } from '../data/chapters';
import { loadAll, buildSyntheticChurches, type GeoBundle } from '../data/geo';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

/** Paint expression that reads the chapter's metric value directly off
 *  the feature's properties rather than feature-state. The metrics are
 *  already baked into properties by geo.ts (metric_${m} for states,
 *  poverty/overdose/misery/complicity for counties), so routing them
 *  through setFeatureState created a race on first load: the source's
 *  async feature indexing could still be in flight when
 *  setFeatureState fired, and any feature that missed the window
 *  rendered as the dark fallback until the next paint cycle nudged it.
 *  Reading properties directly removes the round-trip and makes first
 *  paint correct by construction. */
function buildFillPaint(
  propKey: string,
  ramp: string[],
  domain: [number, number]
): ExpressionSpecification {
  const [min, max] = domain;
  const span = max - min || 1;
  const stops = ramp.map(
    (c, i) => [min + (span * i) / (ramp.length - 1), c] as [number, string]
  );
  return [
    'case',
    ['==', ['coalesce', ['get', propKey], null], null],
    '#1a1f2b',
    ['interpolate', ['linear'], ['get', propKey], ...stops.flat()],
  ] as unknown as ExpressionSpecification;
}

function computeDomain(values: Iterable<number>): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!isFinite(min) || !isFinite(max)) return [0, 1];
  // Trim a couple percent off the top for visual contrast — outliers crush
  // the gradient otherwise.
  return [min, max];
}

function percentileDomain(values: number[], low = 0.05, high = 0.98): [number, number] {
  const sorted = values
    .filter((v) => Number.isFinite(v))
    .slice()
    .sort((a, b) => a - b);
  if (!sorted.length) return [0, 1];
  const lo = sorted[Math.floor(low * (sorted.length - 1))];
  const hi = sorted[Math.floor(high * (sorted.length - 1))];
  return [lo, hi > lo ? hi : lo + 1];
}

interface Props {
  chapterIndex: number;
  selectedFips: string | null;
  onHoverState?: (fips: string | null) => void;
  onSelectState?: (fips: string | null) => void;
  onBundleReady?: (bundle: GeoBundle) => void;
}

// Continental-U.S. bounds (lower 48). Mapbox fits these on load and on
// "back to national" view, with padding that's mobile-aware (no sidebar
// chrome on the left at narrow widths).
const US_BOUNDS: [[number, number], [number, number]] = [
  [-125, 24.5], // SW corner: San Diego / southern Florida latitude
  [-66.5, 49.5], // NE corner: Maine / northern border
];

function isMobileViewport() {
  return typeof window !== 'undefined' && window.innerWidth < 900;
}

function fitPaddingFor(mobile: boolean) {
  if (mobile) {
    // Generous symmetric padding on mobile so the continental US sits
    // comfortably inside the 50vh map strip without any trimming at
    // the edges — effectively a further zoom-out.
    return { top: 60, right: 40, bottom: 60, left: 40 };
  }
  // Desktop keeps the 440px sidebar clear on the left.
  return { top: 48, right: 48, bottom: 48, left: 460 };
}

/** Short, human-readable foster-care count used as the overlay label.
 *   350  → "350"   (tiny states like Wyoming, Vermont)
 *   5876 → "5.9K"
 *  45000 → "45K"
 */
function formatFosterCount(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '—';
  if (n < 1000) return String(Math.round(n));
  if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return Math.round(n / 1000) + 'K';
}

/** Build a points FeatureCollection of state-centroid overlays carrying
 *  the foster-care count + formatted label. Centroids are bbox-centers —
 *  good enough at continental zoom where the overlay lives, and avoids
 *  pulling in turf for a single calculation. */
function buildFosterCountPoints(
  states: FeatureCollection,
): FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (const f of states.features) {
    const props = f.properties as Record<string, unknown> | null;
    const count = typeof props?.fosterCare === 'number' ? (props.fosterCare as number) : null;
    if (count == null || count <= 0) continue;
    const bounds = featureBounds(f);
    const center = bounds.getCenter();
    if (!Number.isFinite(center.lng) || !Number.isFinite(center.lat)) continue;
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [center.lng, center.lat] },
      properties: {
        fips: f.id,
        name: (props?.name as string | undefined) ?? '',
        fosterCare: count,
        label: formatFosterCount(count),
      },
    });
  }
  return { type: 'FeatureCollection', features };
}

function featureBounds(f: GeoJSON.Feature): mapboxgl.LngLatBounds {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const visit = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === 'number') {
      const [x, y] = c as [number, number];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    } else if (Array.isArray(c)) {
      for (const inner of c) visit(inner);
    }
  };
  const g = f.geometry;
  if (g && 'coordinates' in g) visit(g.coordinates);
  return new mapboxgl.LngLatBounds([minX, minY], [maxX, maxY]);
}

export function CrisisMap({
  chapterIndex,
  selectedFips,
  onHoverState,
  onSelectState,
  onBundleReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const bundleRef = useRef<GeoBundle | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!MAPBOX_TOKEN) {
      setLoadError('Missing VITE_MAPBOX_TOKEN. Create a .env with VITE_MAPBOX_TOKEN=pk.… and restart `npm run dev`.');
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const mobile = isMobileViewport();

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      bounds: US_BOUNDS,
      fitBoundsOptions: { padding: fitPaddingFor(mobile) },
      minZoom: 2.3,
      maxZoom: 9,
      projection: 'albers',
      attributionControl: false,
      hash: false,
      // Cooperative gestures on touch so a one-finger vertical swipe
      // scrolls the page instead of being swallowed by the map. Two
      // fingers still pan/zoom. Mapbox surfaces a small "use two
      // fingers" overlay when the user tries a one-finger pan.
      cooperativeGestures: mobile,
      // Keep scroll-zoom off on mobile regardless — one-finger scroll
      // is exclusively for page navigation on small screens.
      scrollZoom: !mobile,
    });
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    let hoveredStateFips: string | null = null;

    map.on('load', async () => {
      try {
        const bundle = await loadAll();
        bundleRef.current = bundle;
        onBundleReady?.(bundle);

        const churchesFc: FeatureCollection =
          bundle.churches ?? buildSyntheticChurches();

        // --- State source + layers ---
        map.addSource('states', {
          type: 'geojson',
          data: bundle.states,
          promoteId: 'fips',
        });
        map.addLayer({
          id: 'states-fill',
          type: 'fill',
          source: 'states',
          paint: { 'fill-color': '#1a1f2b', 'fill-opacity': 0.9 },
        });
        map.addLayer({
          id: 'states-line',
          type: 'line',
          source: 'states',
          paint: { 'line-color': '#0b0d12', 'line-width': 0.6 },
        });
        map.addLayer({
          id: 'states-hover',
          type: 'line',
          source: 'states',
          paint: {
            'line-color': '#fff6d5',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'selected'], false], 2.4,
              ['boolean', ['feature-state', 'hover'], false], 1.8,
              0,
            ],
            'line-opacity': 0.95,
          },
        });

        // --- County source + layer (placed below states-line so state
        //      borders still read clearly on the county choropleth). ---
        map.addSource('counties', {
          type: 'geojson',
          data: bundle.counties,
          promoteId: 'fips',
        });
        map.addLayer(
          {
            id: 'counties-fill',
            type: 'fill',
            source: 'counties',
            layout: { visibility: 'none' },
            paint: { 'fill-color': '#1a1f2b', 'fill-opacity': 0.92 },
          },
          'states-line'
        );

        // --- Churches ---
        map.addSource('churches', { type: 'geojson', data: churchesFc });
        map.addLayer({
          id: 'churches-glow',
          type: 'circle',
          source: 'churches',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              3, 1.1, 6, 2.6, 8, 4.2,
            ],
            'circle-color': '#f7e26b',
            'circle-opacity': 0.45,
            'circle-blur': 0.7,
          },
        });
        map.addLayer({
          id: 'churches-core',
          type: 'circle',
          source: 'churches',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              3, 0.6, 6, 1.2, 8, 1.9,
            ],
            'circle-color': '#ffffff',
            'circle-opacity': 0.85,
          },
        });

        // --- Persistent foster-care-by-state overlay ----------------
        // Circles at state centroids, sized proportionally to the
        // number of children in foster care on any given night. Stays
        // visible on every chapter so the kid count always reads over
        // whatever choropleth the current chapter is painting.
        map.addSource('foster-counts', {
          type: 'geojson',
          data: buildFosterCountPoints(bundle.states),
        });
        map.addLayer({
          id: 'foster-counts-circle',
          type: 'circle',
          source: 'foster-counts',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'fosterCare'],
              0, 4,
              1000, 9,
              5000, 15,
              15000, 23,
              45000, 36,
            ],
            'circle-color': '#ffe9b3',
            'circle-opacity': 0.92,
            'circle-stroke-color': '#1a1009',
            'circle-stroke-width': 1.1,
            'circle-stroke-opacity': 0.9,
          },
        });
        map.addLayer({
          id: 'foster-counts-label',
          type: 'symbol',
          source: 'foster-counts',
          layout: {
            'text-field': ['get', 'label'],
            'text-size': [
              'interpolate', ['linear'], ['get', 'fosterCare'],
              0, 9,
              5000, 10.5,
              45000, 13,
            ],
            'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
            'text-allow-overlap': true,
            'text-ignore-placement': true,
          },
          paint: {
            'text-color': '#1a1009',
            'text-halo-color': '#ffe9b3',
            'text-halo-width': 0.5,
          },
        });

        // --- Click: select / deselect ---
        map.on('click', 'states-fill', (e) => {
          const f = e.features?.[0];
          if (!f) return;
          e.originalEvent?.stopPropagation();
          const fips = f.id as string;
          onSelectState?.(fips);
        });
        // Click on empty canvas (outside any state) clears selection.
        map.on('click', (e) => {
          const hit = map.queryRenderedFeatures(e.point, { layers: ['states-fill'] });
          if (!hit.length) onSelectState?.(null);
        });

        // --- Hover ---
        map.on('mousemove', 'states-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const f = e.features?.[0];
          if (!f) return;
          const fips = f.id as string;
          if (hoveredStateFips && hoveredStateFips !== fips) {
            map.setFeatureState({ source: 'states', id: hoveredStateFips }, { hover: false });
          }
          hoveredStateFips = fips;
          map.setFeatureState({ source: 'states', id: fips }, { hover: true });
          onHoverState?.(fips);
        });
        map.on('mouseleave', 'states-fill', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredStateFips) {
            map.setFeatureState({ source: 'states', id: hoveredStateFips }, { hover: false });
            hoveredStateFips = null;
          }
          onHoverState?.(null);
        });

        setReady(true);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : String(err));
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chapter change: pick geography, recolor, toggle visibility.
  useEffect(() => {
    const map = mapRef.current;
    const bundle = bundleRef.current;
    if (!ready || !map || !bundle) return;
    const chapter = CHAPTERS[chapterIndex];

    // Paint expressions read the active chapter's metric directly off
    // each feature's properties — metric_* on states, poverty/overdose/
    // misery/complicity on counties. Both are populated by geo.ts at
    // bundle assembly time, so they're already present when the source
    // becomes queryable.
    if (chapter.geography === 'state') {
      const propKey = `metric_${chapter.metric}`;
      const values: number[] = [];
      for (const f of bundle.states.features) {
        const v = (f.properties as unknown as Record<string, number | undefined>)[propKey];
        if (typeof v === 'number') values.push(v);
      }
      const domain = computeDomain(values);
      map.setPaintProperty('states-fill', 'fill-color', buildFillPaint(propKey, chapter.ramp, domain));
      map.setLayoutProperty('counties-fill', 'visibility', 'none');
      map.setLayoutProperty('states-fill', 'visibility', 'visible');
    } else {
      const propKey = chapter.countyProp ?? 'poverty';
      const values: number[] = [];
      for (const f of bundle.counties.features) {
        const v = (f.properties as unknown as Record<string, number | undefined>)[propKey];
        if (typeof v === 'number') values.push(v);
      }
      const domain = percentileDomain(values);
      map.setPaintProperty('counties-fill', 'fill-color', buildFillPaint(propKey, chapter.ramp, domain));
      map.setLayoutProperty('counties-fill', 'visibility', 'visible');
      // Keep state fill as a dim backdrop so Alaska/Hawaii still draw.
      map.setPaintProperty('states-fill', 'fill-color', '#12151d');
      map.setLayoutProperty('states-fill', 'visibility', 'visible');
    }

    const churchVis = chapter.showChurches ? 'visible' : 'none';
    map.setLayoutProperty('churches-glow', 'visibility', churchVis);
    map.setLayoutProperty('churches-core', 'visibility', churchVis);
  }, [chapterIndex, ready]);

  // Selected state: toggle feature-state + animate the camera.
  const prevSelectedRef = useRef<string | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    const bundle = bundleRef.current;
    if (!ready || !map || !bundle) return;

    const prev = prevSelectedRef.current;
    if (prev && prev !== selectedFips) {
      map.setFeatureState({ source: 'states', id: prev }, { selected: false });
    }

    if (selectedFips) {
      map.setFeatureState({ source: 'states', id: selectedFips }, { selected: true });
      const feat = bundle.states.features.find((f) => f.id === selectedFips);
      if (feat) {
        const bounds = featureBounds(feat);
        map.fitBounds(bounds, {
          padding: fitPaddingFor(isMobileViewport()),
          duration: 900,
          maxZoom: 7,
        });
      }
    } else if (prev) {
      // Back to the continental-U.S. view with mobile-aware padding.
      map.fitBounds(US_BOUNDS, {
        padding: fitPaddingFor(isMobileViewport()),
        duration: 900,
      });
    }

    prevSelectedRef.current = selectedFips;
  }, [selectedFips, ready]);

  return (
    <div className="map-root">
      <div ref={containerRef} className="map-canvas" />
      {loadError && (
        <div className="map-error" role="alert">
          <strong>Map failed to load.</strong>
          <p>{loadError}</p>
        </div>
      )}
    </div>
  );
}
