#!/usr/bin/env node
// scripts/build-all.mjs
//
// Runs every data-refresh script in the correct order. Fails fast if any
// upstream source is unavailable, so CI or local users see a loud error
// rather than stale data.
//
//   npm run data:all
//
// Individual scripts can also be run on their own via npm scripts.

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = [
  'fetch-saipe.mjs',
  'fetch-cdc-overdose.mjs',
  'fetch-churches.mjs',
];

function run(rel) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [path.join(here, rel)], {
      stdio: 'inherit',
      env: process.env,
    });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${rel} exited ${code}`))));
  });
}

for (const s of scripts) {
  await run(s);
}
console.log('\n✓ data refresh complete — see public/data/*.json');
