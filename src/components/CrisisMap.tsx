import { useEffect, useRef, useState } from 'react';
import mapboxgl, { type ExpressionSpecification } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';
import { CHAPTERS, type Chapter } from '../data/chapters';
import { loadStatesGeojson, buildCongregationPoints } from '../data/geo';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

// Default ramp stops keyed off each chapter's metric. Each chapter supplies six
// colors; we map those to six thresholds via interpolation.
function buildFillPaint(chapter: Chapter, domain: [number, number]) {
  const [min, max] = domain;
  const span = max - min || 1;
  const stops = chapter.ramp.map((c, i) => [min + (span * i) / (chapter.ramp.length - 1), c] as [number, number | string]);
  const expr: ExpressionSpecification = [
    'interpolate',
    ['linear'],
    ['coalesce', ['feature-state', 'value'], 0],
    ...stops.flat(),
  ] as unknown as ExpressionSpecification;
  return expr;
}

function computeDomain(fc: FeatureCollection, metricKey: string): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const f of fc.features) {
    const v = (f.properties as Record<string, number | undefined>)[metricKey];
    if (typeof v !== 'number') continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!isFinite(min) || !isFinite(max)) return [0, 1];
  return [min, max];
}

interface Props {
  chapterIndex: number;
  onHoverState?: (fips: string | null) => void;
}

export function CrisisMap({ chapterIndex, onHoverState }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geoRef = useRef<FeatureCollection | null>(null);
  const churchesRef = useRef<FeatureCollection | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Init map once.
  useEffect(() => {
    if (!containerRef.current) return;
    if (!MAPBOX_TOKEN) {
      setLoadError('Missing VITE_MAPBOX_TOKEN. Create a .env with VITE_MAPBOX_TOKEN=pk.… and restart `npm run dev`.');
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-96.5, 38.5],
      zoom: 3.4,
      minZoom: 2.5,
      maxZoom: 9,
      projection: 'albers',
      attributionControl: false,
      hash: false,
    });
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    let hoveredFips: string | null = null;

    map.on('load', async () => {
      try {
        const [fc, churches] = await Promise.all([
          loadStatesGeojson(),
          Promise.resolve(buildCongregationPoints()),
        ]);
        geoRef.current = fc;
        churchesRef.current = churches;

        map.addSource('states', {
          type: 'geojson',
          data: fc,
          promoteId: 'fips',
          generateId: false,
        });
        map.addSource('churches', {
          type: 'geojson',
          data: churches,
        });

        // Choropleth fill.
        map.addLayer({
          id: 'states-fill',
          type: 'fill',
          source: 'states',
          paint: {
            'fill-color': '#1a1f2b',
            'fill-opacity': 0.85,
          },
        });

        // Hairline borders.
        map.addLayer({
          id: 'states-line',
          type: 'line',
          source: 'states',
          paint: {
            'line-color': '#0b0d12',
            'line-width': 0.6,
          },
        });

        // Hover outline.
        map.addLayer({
          id: 'states-hover',
          type: 'line',
          source: 'states',
          paint: {
            'line-color': '#fff6d5',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              1.8,
              0,
            ],
          },
        });

        // Churches overlay (hidden by default).
        map.addLayer({
          id: 'churches-glow',
          type: 'circle',
          source: 'churches',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              3, 1.4,
              6, 3.0,
              8, 5.0,
            ],
            'circle-color': '#f7e26b',
            'circle-opacity': 0.55,
            'circle-blur': 0.6,
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
              3, 0.7,
              6, 1.4,
              8, 2.2,
            ],
            'circle-color': '#ffffff',
            'circle-opacity': 0.9,
          },
        });

        // Hover handlers.
        map.on('mousemove', 'states-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const f = e.features?.[0];
          if (!f) return;
          const fips = f.id as string;
          if (hoveredFips && hoveredFips !== fips) {
            map.setFeatureState({ source: 'states', id: hoveredFips }, { hover: false });
          }
          hoveredFips = fips;
          map.setFeatureState({ source: 'states', id: fips }, { hover: true });
          onHoverState?.(fips);
        });
        map.on('mouseleave', 'states-fill', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredFips) {
            map.setFeatureState({ source: 'states', id: hoveredFips }, { hover: false });
            hoveredFips = null;
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

  // On chapter change: recolor fill + toggle churches.
  useEffect(() => {
    const map = mapRef.current;
    const fc = geoRef.current;
    if (!ready || !map || !fc) return;
    const chapter = CHAPTERS[chapterIndex];
    const metricKey = `metric_${chapter.metric}`;
    const domain = computeDomain(fc, metricKey);

    // Push current-metric value into feature-state so interpolation works.
    for (const f of fc.features) {
      const v = (f.properties as Record<string, number | undefined>)[metricKey];
      if (typeof v !== 'number' || !f.id) continue;
      map.setFeatureState({ source: 'states', id: f.id as string }, { value: v });
    }

    map.setPaintProperty('states-fill', 'fill-color', buildFillPaint(chapter, domain));
    const churchVis = chapter.showChurches ? 'visible' : 'none';
    map.setLayoutProperty('churches-glow', 'visibility', churchVis);
    map.setLayoutProperty('churches-core', 'visibility', churchVis);
  }, [chapterIndex, ready]);

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
