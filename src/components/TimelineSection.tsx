// The Nerds' View — a rigorous, interactive master timeline that plots
// every series the site argues from on a single 1620 → 2030 axis, with
// era bands, event pins, and a hover scrubber.
//
// Swimlane layout: one horizontal strip per series, all sharing the
// same x-axis. Era backgrounds run top-to-bottom behind every lane.
// Event pins live in a pin rail at the bottom; hovering a pin surfaces
// the event's body in a panel below the chart. A vertical scrubber
// tracks the mouse and shows every series' value at that year in a
// sidebar card.

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  EVENTS,
  ERAS,
  SERIES,
  TIMELINE_MIN,
  TIMELINE_MAX,
  type Series,
  type TimelineEvent,
} from '../data/timeline';

// --- Layout constants --------------------------------------------------

const CHART_W = 1400;
const MARGIN = { top: 40, right: 40, bottom: 70, left: 180 };
const LANE_H = 92;
const LANE_GAP = 18;
const PIN_RAIL_H = 32;

const CHART_H =
  MARGIN.top +
  SERIES.length * LANE_H +
  (SERIES.length - 1) * LANE_GAP +
  PIN_RAIL_H +
  MARGIN.bottom;

function xScale(year: number) {
  const t = (year - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN);
  return MARGIN.left + t * (CHART_W - MARGIN.left - MARGIN.right);
}

function xInverse(px: number) {
  const t = (px - MARGIN.left) / (CHART_W - MARGIN.left - MARGIN.right);
  return TIMELINE_MIN + t * (TIMELINE_MAX - TIMELINE_MIN);
}

function laneTop(i: number) {
  return MARGIN.top + i * (LANE_H + LANE_GAP);
}

function laneBottom(i: number) {
  return laneTop(i) + LANE_H;
}

function pinRailY() {
  return MARGIN.top + SERIES.length * LANE_H + (SERIES.length - 1) * LANE_GAP + 20;
}

function yForSeries(series: Series, value: number, laneIndex: number) {
  const values = series.points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const top = laneTop(laneIndex) + 12;
  const bottom = laneBottom(laneIndex) - 12;
  const norm = (value - min) / span;
  // Flip: higher value = higher on screen
  return bottom - norm * (bottom - top);
}

// Catmull-Rom → cubic Bezier for smooth line curves.
function smoothPath(points: [number, number][]) {
  if (points.length < 2) return '';
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

// Linear-interpolate a series to a given year (returns null if outside
// the series' reported range).
function sampleSeries(series: Series, year: number): number | null {
  const pts = [...series.points].sort((a, b) => a.year - b.year);
  if (year < pts[0].year || year > pts[pts.length - 1].year) return null;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (year >= a.year && year <= b.year) {
      const t = (year - a.year) / (b.year - a.year || 1);
      return a.value + t * (b.value - a.value);
    }
  }
  return pts[pts.length - 1].value;
}

// Event color per kind.
const EVENT_COLORS: Record<TimelineEvent['kind'], string> = {
  baseline: '#8a5a2b',
  church: '#e6a42a',
  culture: '#c43a5b',
  crisis: '#ff5252',
};

const DECADE_TICKS = (() => {
  const ticks = [];
  // Major ticks every 50 years before 1900, every 25 before 2000, every 10 after.
  for (let y = TIMELINE_MIN; y <= TIMELINE_MAX; y++) {
    if (y < 1900 && y % 50 === 0) ticks.push(y);
    else if (y >= 1900 && y < 2000 && y % 25 === 0) ticks.push(y);
    else if (y >= 2000 && y % 10 === 0) ticks.push(y);
  }
  return ticks;
})();

// ----------------------------------------------------------------------

export function TimelineSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger line draw-in animations after mount.
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Track mouse for scrubber.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * CHART_W;
      if (svgX < MARGIN.left || svgX > CHART_W - MARGIN.right) {
        setHoverYear(null);
        return;
      }
      setHoverYear(Math.round(xInverse(svgX)));
    };
    const onLeave = () => setHoverYear(null);
    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseleave', onLeave);
    return () => {
      svg.removeEventListener('mousemove', onMove);
      svg.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Precompute smoothed paths per series.
  const paths = useMemo(() => {
    return SERIES.map((s, i) => {
      const pts: [number, number][] = [...s.points]
        .sort((a, b) => a.year - b.year)
        .map((p) => [xScale(p.year), yForSeries(s, p.value, i)]);
      return smoothPath(pts);
    });
  }, []);

  // Scrubbed values per series at hoverYear (for sidebar card).
  const scrubbed = useMemo(() => {
    if (hoverYear == null) return null;
    return SERIES.map((s) => ({
      series: s,
      value: sampleSeries(s, hoverYear),
    }));
  }, [hoverYear]);

  const closestEvent = useMemo(() => {
    if (hoverYear == null) return null;
    let best: TimelineEvent | null = null;
    let bestDist = Infinity;
    for (const e of EVENTS) {
      const d = Math.abs(e.year - hoverYear);
      if (d < bestDist) {
        best = e;
        bestDist = d;
      }
    }
    return best && bestDist <= 5 ? best : null;
  }, [hoverYear]);

  const eventToShow = activeEvent ?? closestEvent;

  return (
    <section className="timeline-section" id="timeline">
      <div className="tl-hero">
        <p className="tl-eyebrow">The Nerds' View · Master Timeline</p>
        <h2 className="tl-title">
          Four hundred years.<br />Five curves. One break.
        </h2>
        <p className="tl-lede">
          Every series this site argues from, on a single axis. Christian
          fertility from 1650. Biblical worldview from 1992. Foster care,
          unwed births, and divorce from 1950. Nineteen pinned events
          across 400 years. Hover anywhere to scrub values at that exact
          year. Click a pin to stop on it.
        </p>
      </div>

      <div className="tl-wrap">
        <div className="tl-scroll">
          <svg
            ref={svgRef}
            className={'tl-svg' + (mounted ? ' is-mounted' : '')}
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Master timeline of Christian fertility, biblical worldview, foster care, unwed births, and divorce rate from 1620 to 2030"
          >
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.id} id={`grad-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
              <linearGradient id="tl-grid-fade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="20%" stopColor="rgba(255,255,255,0.06)" />
                <stop offset="80%" stopColor="rgba(255,255,255,0.06)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* --- Era bands (span all lanes vertically) --- */}
            {ERAS.map((era, i) => {
              const x0 = xScale(Math.max(era.start, TIMELINE_MIN));
              const x1 = xScale(Math.min(era.end, TIMELINE_MAX));
              return (
                <g key={i} className="tl-era">
                  <rect
                    x={x0}
                    y={MARGIN.top - 20}
                    width={x1 - x0}
                    height={CHART_H - MARGIN.top - MARGIN.bottom + 20}
                    fill={era.fill}
                  />
                  <text
                    x={(x0 + x1) / 2}
                    y={MARGIN.top - 8}
                    textAnchor="middle"
                    fontFamily="var(--ff-mono)"
                    fontSize="10"
                    letterSpacing="0.16em"
                    fill="rgba(255,255,255,0.38)"
                    style={{ textTransform: 'uppercase' }}
                  >
                    {era.label}
                  </text>
                </g>
              );
            })}

            {/* --- Year gridlines --- */}
            {DECADE_TICKS.map((y) => (
              <line
                key={y}
                x1={xScale(y)}
                y1={MARGIN.top}
                x2={xScale(y)}
                y2={CHART_H - MARGIN.bottom}
                stroke="rgba(255,255,255,0.035)"
                strokeWidth={1}
              />
            ))}

            {/* --- Lanes --- */}
            {SERIES.map((s, i) => {
              const laneY0 = laneTop(i);
              const laneY1 = laneBottom(i);
              return (
                <g key={s.id}>
                  {/* Lane baseline */}
                  <line
                    x1={MARGIN.left}
                    y1={laneY1}
                    x2={CHART_W - MARGIN.right}
                    y2={laneY1}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={1}
                  />

                  {/* Lane label */}
                  <text
                    x={MARGIN.left - 12}
                    y={laneY0 + 16}
                    textAnchor="end"
                    fontFamily="var(--ff-serif)"
                    fontStyle="italic"
                    fontSize="13"
                    fill="rgba(230, 231, 234, 0.92)"
                  >
                    {s.label}
                  </text>
                  <text
                    x={MARGIN.left - 12}
                    y={laneY0 + 32}
                    textAnchor="end"
                    fontFamily="var(--ff-mono)"
                    fontSize="9"
                    letterSpacing="0.1em"
                    fill="rgba(230, 231, 234, 0.45)"
                    style={{ textTransform: 'uppercase' }}
                  >
                    {s.source}
                  </text>

                  {/* Series direction arrow */}
                  <text
                    x={MARGIN.left - 12}
                    y={laneY1 - 8}
                    textAnchor="end"
                    fontFamily="var(--ff-mono)"
                    fontSize="9"
                    fill={s.color}
                    letterSpacing="0.1em"
                  >
                    {s.direction === 'down' ? '▼ collapsing' : '▲ climbing'}
                  </text>

                  {/* Gradient fill under the line */}
                  <path
                    d={
                      paths[i] +
                      ` L ${xScale(s.points[s.points.length - 1].year)} ${laneY1} ` +
                      `L ${xScale(s.points[0].year)} ${laneY1} Z`
                    }
                    fill={`url(#grad-${s.id})`}
                    opacity={mounted ? 1 : 0}
                    style={{ transition: 'opacity 800ms ease 300ms' }}
                  />

                  {/* The smooth line itself */}
                  <path
                    d={paths[i]}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={2.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="tl-line"
                    style={{ animationDelay: `${i * 140}ms` }}
                  />

                  {/* Point markers */}
                  {s.points.map((p, j) => (
                    <circle
                      key={j}
                      cx={xScale(p.year)}
                      cy={yForSeries(s, p.value, i)}
                      r={2.4}
                      fill={s.color}
                      opacity={mounted ? 0.85 : 0}
                      style={{ transition: `opacity 500ms ease ${600 + j * 30}ms` }}
                    />
                  ))}
                </g>
              );
            })}

            {/* --- Pin rail --- */}
            <line
              x1={MARGIN.left}
              y1={pinRailY()}
              x2={CHART_W - MARGIN.right}
              y2={pinRailY()}
              stroke="rgba(247, 226, 107, 0.25)"
              strokeWidth={1}
              strokeDasharray="2 4"
            />
            {EVENTS.map((e, i) => {
              const x = xScale(e.year);
              const isActive = activeEvent?.year === e.year;
              return (
                <g
                  key={i}
                  className={'tl-pin' + (isActive ? ' is-active' : '')}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveEvent(isActive ? null : e)}
                >
                  <line
                    x1={x}
                    y1={MARGIN.top}
                    x2={x}
                    y2={pinRailY()}
                    stroke={EVENT_COLORS[e.kind]}
                    strokeWidth={1}
                    strokeDasharray="2 3"
                    opacity={isActive ? 0.6 : 0.18}
                    style={{ transition: 'opacity 200ms ease' }}
                  />
                  <circle
                    cx={x}
                    cy={pinRailY()}
                    r={isActive ? 7 : 5}
                    fill={EVENT_COLORS[e.kind]}
                    stroke="#0b0d12"
                    strokeWidth={2}
                    style={{
                      transition: 'r 200ms ease',
                      filter: `drop-shadow(0 0 ${isActive ? 10 : 4}px ${EVENT_COLORS[e.kind]})`,
                    }}
                  />
                  <text
                    x={x}
                    y={pinRailY() + 22}
                    textAnchor="middle"
                    fontFamily="var(--ff-mono)"
                    fontSize="10"
                    fill={isActive ? EVENT_COLORS[e.kind] : 'rgba(230, 231, 234, 0.55)'}
                    letterSpacing="0.04em"
                  >
                    {e.year}
                  </text>
                </g>
              );
            })}

            {/* --- Scrubber --- */}
            {hoverYear != null && (
              <g className="tl-scrubber" pointerEvents="none">
                <line
                  x1={xScale(hoverYear)}
                  y1={MARGIN.top}
                  x2={xScale(hoverYear)}
                  y2={CHART_H - MARGIN.bottom}
                  stroke="rgba(255, 246, 213, 0.6)"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
                <rect
                  x={Math.min(xScale(hoverYear) - 26, CHART_W - MARGIN.right - 52)}
                  y={MARGIN.top - 30}
                  width={52}
                  height={22}
                  fill="rgba(11, 13, 18, 0.95)"
                  stroke="rgba(255, 246, 213, 0.6)"
                  rx={3}
                />
                <text
                  x={Math.min(xScale(hoverYear), CHART_W - MARGIN.right - 26)}
                  y={MARGIN.top - 14}
                  textAnchor="middle"
                  fontFamily="var(--ff-mono)"
                  fontSize="11"
                  fill="#fff6d5"
                  letterSpacing="0.08em"
                >
                  {hoverYear}
                </text>

                {/* Point dots on each lane at hoverYear */}
                {SERIES.map((s, i) => {
                  const v = sampleSeries(s, hoverYear);
                  if (v == null) return null;
                  return (
                    <circle
                      key={s.id}
                      cx={xScale(hoverYear)}
                      cy={yForSeries(s, v, i)}
                      r={4}
                      fill={s.color}
                      stroke="#0b0d12"
                      strokeWidth={1.5}
                    />
                  );
                })}
              </g>
            )}

            {/* --- X axis major ticks (under pin rail) --- */}
            {DECADE_TICKS.filter((y) => (y < 1950 && y % 50 === 0) || y % 25 === 0).map((y) => (
              <text
                key={y}
                x={xScale(y)}
                y={CHART_H - MARGIN.bottom + 24}
                textAnchor="middle"
                fontFamily="var(--ff-mono)"
                fontSize="10"
                fill="rgba(230, 231, 234, 0.35)"
              >
                {y}
              </text>
            ))}
          </svg>
        </div>

        {/* Sidebar card — shows scrubbed values + active event body */}
        <aside className="tl-sidebar">
          <div className="tl-sidebar-head">
            <span className="tl-sidebar-lbl">Year</span>
            <span className="tl-sidebar-year">{hoverYear ?? '—'}</span>
          </div>
          <div className="tl-sidebar-values">
            {scrubbed ? (
              scrubbed.map((row) => (
                <div key={row.series.id} className="tl-val">
                  <span className="tl-val-swatch" style={{ background: row.series.color }} />
                  <span className="tl-val-lbl">{row.series.label.split(' — ')[0]}</span>
                  <span className="tl-val-num">
                    {row.value != null ? row.series.format(row.value) : '—'}
                  </span>
                </div>
              ))
            ) : (
              <p className="tl-sidebar-hint">
                Hover the chart to scrub through 400 years of data. Click an
                event pin to stop on it.
              </p>
            )}
          </div>

          {eventToShow && (
            <div className={`tl-event tl-event-${eventToShow.kind}`}>
              <span className="tl-event-year">{eventToShow.year}</span>
              <h4>{eventToShow.title}</h4>
              <p>{eventToShow.body}</p>
              {activeEvent && (
                <button className="tl-event-close" onClick={() => setActiveEvent(null)}>
                  ×
                </button>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Legend — kind key for event pins */}
      <div className="tl-legend">
        <h4 className="tl-legend-heading">Event pins</h4>
        <ul>
          <li><span className="tl-kind" style={{ background: EVENT_COLORS.baseline }} /> Baseline / pre-revolution</li>
          <li><span className="tl-kind" style={{ background: EVENT_COLORS.church }} /> Church action</li>
          <li><span className="tl-kind" style={{ background: EVENT_COLORS.culture }} /> Cultural / legal</li>
          <li><span className="tl-kind" style={{ background: EVENT_COLORS.crisis }} /> Crisis marker</li>
        </ul>
        <p className="tl-legend-note">
          Pin colors encode the actor. The <em>church</em> pins are the
          ones this site argues about most: when the American Church
          spoke, shrugged, or stayed silent.
        </p>
      </div>
    </section>
  );
}
