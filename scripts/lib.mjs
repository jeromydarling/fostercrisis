// Shared helpers for data-fetch scripts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const OUT_DIR = path.join(ROOT, 'public', 'data');

export function ensureOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

export async function fetchJson(url, { timeoutMs = 30_000, headers = {} } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'fostercrisis-data/0.1', Accept: 'application/json', ...headers },
      signal: ctl.signal,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
    return res.json();
  } finally {
    clearTimeout(t);
  }
}

export async function fetchText(url, { timeoutMs = 60_000, headers = {} } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'fostercrisis-data/0.1', ...headers },
      signal: ctl.signal,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
    return res.text();
  } finally {
    clearTimeout(t);
  }
}

export function writeJson(name, data) {
  ensureOutDir();
  const p = path.join(OUT_DIR, name);
  fs.writeFileSync(p, JSON.stringify(data));
  const stat = fs.statSync(p);
  console.log(`  ✓ wrote ${name} (${(stat.size / 1024).toFixed(1)} KB)`);
  return p;
}

export function parseCsv(text) {
  // Minimal CSV parser that handles quoted fields with commas and CRLF.
  const rows = [];
  let cur = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { cur.push(field); field = ''; }
      else if (c === '\r') { /* ignore */ }
      else if (c === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
      else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  const header = rows.shift();
  return rows.filter((r) => r.length === header.length).map((r) =>
    Object.fromEntries(header.map((h, j) => [h, r[j]]))
  );
}

export const log = {
  step: (s) => console.log(`\n▸ ${s}`),
  ok: (s) => console.log(`  ✓ ${s}`),
  warn: (s) => console.warn(`  ! ${s}`),
  err: (s) => console.error(`  ✗ ${s}`),
};
