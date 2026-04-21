# The Foster Crisis — A Map of American Silence

An interactive map that tells the story of America's foster care crisis
in six chapters, each layer growing more bleak — and ending on the argument
that the ~380,000 Christian congregations in the U.S. could end the
adoption waitlist overnight.

> **380,000 congregations × 1 family = 380,000 homes.**
> **The waitlist is 70,418.**
> **You would end it five times over.**

## Chapters

1. **The Baseline** — children in foster care per capita (state)
2. **The Capacity Gap** — licensed homes per 100 kids in care (state)
3. **Root Cause: Poverty** — child poverty rates (**county**, SAIPE)
4. **Root Cause: Overdose** — drug overdose deaths (**county**, CDC)
5. **Missing From Care** — NCMEC runaway / trafficking pipeline (state)
6. **The Solution** — Christian congregations per waiting child + HIFLD
   church points overlay (state + points)

## Running locally

```bash
npm install
cp .env.example .env     # paste your Mapbox public token
npm run dev              # http://localhost:5173
```

Grab a free token at <https://account.mapbox.com/access-tokens/>.

## Data pipeline

Boundaries (us-atlas 10m states + counties) are committed to
`public/data/` so the app renders offline. Live overlays are pulled at
build time, not at runtime, by the scripts in `scripts/`.

```bash
npm run data:all        # pulls SAIPE + CDC-OD + HIFLD (or OSM) churches
npm run data:saipe      # county child-poverty rates (Census SAIPE)
npm run data:cdc        # county drug-overdose rates (CDC NCHS VSRR)
npm run data:churches   # Christian places of worship (HIFLD → OSM fallback)
```

Each script writes to `public/data/*.json` (or `.geojson`), which the app
loads at runtime. If a file is missing:

| Missing | Behavior |
| --- | --- |
| `saipe-counties.json` | Chapter III falls back to state-level poverty and shows a banner telling you to run the script. |
| `cdc-overdose-counties.json` | Chapter IV falls back to state-level overdose rates. |
| `churches.geojson` | Chapter VI shows deterministic synthetic dots (same count, wrong positions) with a banner. |

## Data sources

| Column | Source |
| --- | --- |
| Foster care counts, waiting-adoption | AFCARS FY2023 (ACF / HHS) |
| Licensed homes | The Imprint 2024 Foster Care Survey |
| Child poverty (county) | Census SAIPE API — `SAEPOVRT0_17_PT` |
| Overdose deaths (county) | CDC NCHS VSRR Provisional — `xx3s-m5vs` |
| Missing from care | NCMEC 2024 Impact Report |
| Churches | HIFLD "All Places of Worship" (primary); OSM Overpass fallback |
| Congregation totals | 2020 U.S. Religion Census |

State-level values carrying a `_modeledMissing: true` flag in
`src/data/states.ts` were scaled from national aggregates; replace with
per-state tables when available.

## Stack

- Vite + React + TypeScript
- Mapbox GL JS v3 (Albers USA projection, dark-v11 style)
- `us-atlas@3` 10m boundaries (states + counties, committed to `public/`)
- `topojson-client` for runtime TopoJSON → GeoJSON conversion
