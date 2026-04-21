# The Foster Crisis — A Map of American Silence

An interactive map that tells the story of America's foster care crisis
in six chapters, each layer growing more bleak — and ending on the argument
that the ~380,000 Christian congregations in the U.S. could end the
adoption waitlist overnight.

> **380,000 congregations × 1 family = 380,000 homes.**
> **The waitlist is 70,418.**
> **You would end it five times over.**

## Chapters

1. **The Baseline** — children in foster care per capita.
2. **The Capacity Gap** — licensed homes per 100 kids in care.
3. **Root Cause: Poverty** — child poverty rates (SAIPE).
4. **Root Cause: Overdose** — CDC drug overdose deaths.
5. **Missing From Care** — NCMEC runaway / trafficking pipeline.
6. **The Solution** — Christian congregations per waiting child.

## Running locally

```bash
npm install
cp .env.example .env     # then paste your Mapbox public token
npm run dev
```

Then open http://localhost:5173 .

### Mapbox token

The map uses Mapbox GL JS with the **Dark** and **Albers USA** style. Grab
a free public token at <https://account.mapbox.com/access-tokens/> and put
it in `.env` as:

```
VITE_MAPBOX_TOKEN=pk.your-token
```

## Data sources

See `src/data/states.ts` for per-field citations. Headline sources:

| Area | Source |
| --- | --- |
| Foster care counts | AFCARS FY2023 (ACF / HHS) |
| Licensed homes | The Imprint 2024 Foster Care Survey |
| Child poverty | Census SAIPE 2022 |
| Overdose deaths | CDC Provisional County Drug Overdose |
| Missing from care | NCMEC 2024 Impact Report |
| Congregations | 2020 U.S. Religion Census / HIFLD |

Values tagged `_modeledMissing` have been modeled from national totals
scaled by child population; swap for direct AFCARS/NCMEC pulls when
refreshing.

## Stack

- Vite + React + TypeScript
- Mapbox GL JS v3 (Albers USA projection)
- `us-atlas@3` state boundaries (TopoJSON, ~85 KB) fetched at runtime
  from jsDelivr and converted with `topojson-client`
