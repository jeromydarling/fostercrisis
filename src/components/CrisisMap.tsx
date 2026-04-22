import { useEffect, useRef, useState } from 'react';
import mapboxgl, { type ExpressionSpecification } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';
import { CHAPTERS, type Chapter } from '../data/chapters';
import { loadAll, buildSyntheticChurches, type GeoBundle } from '../data/geo';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

function buildFillPaint(chapter: Chapter, domain: [number, number]): ExpressionSpecification {
  const [min, max] = domain;
  const span = max - min || 1;
  const stops = chapter.ramp.map(
    (c, i) => [min + (span * i) / (chapter.ramp.length - 1), c] as [number, string]
  );
  return [
    'case',
    ['==', ['coalesce', ['feature-state', 'value'], null], null],
    '#1a1f2b',
    ['interpolate', ['linear'], ['feature-state', 'value'], ...stops.flat()],
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
    // On mobile the sidebar is below the map in document flow (no
    // overlay), so padding is symmetric.
    return { top: 24, right: 20, bottom: 20, left: 20 };
  }
  // Desktop keeps the 440px sidebar clear on the left.
  return { top: 48, right: 48, bottom: 48, left: 460 };
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

    // Push the correct per-feature value into feature-state for the active
    // geography, compute a percentile domain, and paint.
    if (chapter.geography === 'state') {
      const metricKey = `metric_${chapter.metric}` as const;
      const values: number[] = [];
      for (const f of bundle.states.features) {
        const v = (f.properties as unknown as Record<string, number | undefined>)[metricKey];
        if (typeof v !== 'number' || !f.id) continue;
        values.push(v);
        map.setFeatureState({ source: 'states', id: f.id as string }, { value: v });
      }
      // Clear counties to prevent stale colors when we come back.
      for (const f of bundle.counties.features) {
        if (!f.id) continue;
        map.setFeatureState({ source: 'counties', id: f.id as string }, { value: null });
      }
      const domain = computeDomain(values);
      map.setPaintProperty('states-fill', 'fill-color', buildFillPaint(chapter, domain));
      map.setLayoutProperty('counties-fill', 'visibility', 'none');
      map.setLayoutProperty('states-fill', 'visibility', 'visible');
    } else {
      // county choropleth
      const prop = chapter.countyProp ?? 'poverty';
      const values: number[] = [];
      for (const f of bundle.counties.features) {
        const v = (f.properties as unknown as Record<string, number | undefined>)[prop];
        if (typeof v !== 'number' || !f.id) continue;
        values.push(v);
        map.setFeatureState({ source: 'counties', id: f.id as string }, { value: v });
      }
      const domain = percentileDomain(values);
      map.setPaintProperty('counties-fill', 'fill-color', buildFillPaint(chapter, domain));
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
