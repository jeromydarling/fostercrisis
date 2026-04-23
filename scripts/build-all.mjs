#!/usr/bin/env node
// scripts/build-all.mjs
//
// Runs every data-refresh script in order, then composes the misery index.
//
//   npm run data:all

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const fetchers = [
  'fetch-saipe.mjs',
  'fetch-cdc-overdose.mjs',
  'fetch-county-health-rankings.mjs',
  'fetch-acs-county.mjs',
  'fetch-ejscreen.mjs',
  'fetch-churches.mjs',
  'fetch-feeds.mjs',
  'fetch-sunday-gospels.mjs',
];
const composers = ['build-misery-index.mjs', 'build-pledge-ics.mjs'];

function run(rel) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [path.join(here, rel)], {
      stdio: 'inherit',
      env: process.env,
    });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${rel} exited ${code}`))));
  });
}

for (const s of [...fetchers, ...composers]) {
  try {
    await run(s);
  } catch (e) {
    console.error(`  ! ${s} failed: ${e.message}`);
  }
}
console.log('\n✓ data refresh complete — see public/data/*.json');
