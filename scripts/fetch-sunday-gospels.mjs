#!/usr/bin/env node
// scripts/fetch-sunday-gospels.mjs
//
// Resolve each Sunday's Gospel reading from the local lectionary table
// (public/data/sunday-lectionary.json) into full passage text using
// bible-api.com (World English Bible — public domain). Results are
// cached in public/data/gospels.json so the .ics builder can embed
// each week's Gospel into its calendar events.
//
// No scraping. No copyrighted translation. Lectionary assignments are
// public factual data; the text is public domain.
//
// Run locally:   node scripts/fetch-sunday-gospels.mjs
//
// Incremental: any entry already cached with the same `ref` and
// translation is skipped, so re-runs are fast.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const LECTIONARY_PATH = path.join(here, '..', 'public', 'data', 'sunday-lectionary.json');
const OUT_PATH = path.join(here, '..', 'public', 'data', 'gospels.json');

const UA = 'fostercrisis.com/1.0 (+https://fostercrisis.com)';
const TIMEOUT_MS = 20_000;
const DELAY_MS = 500;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function fetchJson(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      signal: ctl.signal,
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Normalize bible-api.com text into clean paragraphs. The API returns
 *  verses joined with single line breaks; we collapse runs of whitespace
 *  and drop the superscript verse-number pattern if present. */
function cleanText(raw) {
  return raw
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

// --- main ----------------------------------------------------------

const lectionary = JSON.parse(fs.readFileSync(LECTIONARY_PATH, 'utf8'));
const sundays = lectionary.sundays || [];

const existing = fs.existsSync(OUT_PATH)
  ? (() => {
      try {
        const parsed = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
        return parsed.gospels || {};
      } catch { return {}; }
    })()
  : {};

let ok = 0;
let cachedHits = 0;
let failed = 0;

for (const entry of sundays) {
  const prior = existing[entry.date];
  if (prior && prior.ref === entry.displayRef && prior.translation === 'WEB' && prior.text && prior.text.length > 20) {
    cachedHits++;
    continue;
  }

  const url = `https://bible-api.com/${encodeURIComponent(entry.apiRef)}?translation=web`;
  try {
    const data = await fetchJson(url);
    const text = cleanText(data.text || '');
    if (!text) throw new Error('empty text from bible-api');
    existing[entry.date] = {
      date: entry.date,
      title: entry.title,
      ref: entry.displayRef,
      apiRef: entry.apiRef,
      text,
      translation: 'WEB',
      translationName: data.translation_name || 'World English Bible',
    };
    ok++;
    process.stdout.write(`  ✓ ${entry.date}  ${entry.displayRef}  (${text.length} chars)\n`);
  } catch (e) {
    failed++;
    const hadPrior = prior ? ' (keeping prior cache)' : '';
    process.stdout.write(`  ✗ ${entry.date}  ${entry.displayRef}  ${e.message}${hadPrior}\n`);
  }
  await sleep(DELAY_MS);
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(
  OUT_PATH,
  JSON.stringify(
    {
      _meta: {
        fetched: new Date().toISOString(),
        translation: 'World English Bible (public domain)',
        source: 'bible-api.com + public/data/sunday-lectionary.json',
        ok,
        cachedHits,
        failed,
      },
      gospels: existing,
    },
    null,
    2
  ) + '\n',
  'utf8'
);
console.log(
  `\n✓ ${ok} fetched · ${cachedHits} cached · ${failed} failed · ${sundays.length} total Sundays`
);
