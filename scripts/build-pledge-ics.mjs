#!/usr/bin/env node
// scripts/build-pledge-ics.mjs
//
// Generate public/pledge.ics — the pledge calendar subscription. Each
// Sunday in the next ~52 weeks gets one event: the Catholic Sunday
// Gospel reading for that week, delivered as the words of Jesus,
// followed by the traditional acclamation. No Foster-Crisis commentary
// inside the event itself — the argument is on the site; the calendar
// lets the Church lead the rhythm.
//
// Inputs:
//   public/data/sunday-lectionary.json  — which readings on which dates
//   public/data/gospels.json            — text cached by fetch-sunday-gospels.mjs
//
// Output: public/pledge.ics
//
// Run locally:   node scripts/build-pledge-ics.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const LECTIONARY_PATH = path.join(here, '..', 'public', 'data', 'sunday-lectionary.json');
const GOSPELS_PATH = path.join(here, '..', 'public', 'data', 'gospels.json');
const OUT_PATH = path.join(here, '..', 'public', 'pledge.ics');

const START_HOUR = 9; // 9:00 Sunday local time (floating — no TZ)
const DURATION_MIN = 20;
const MAX_WEEKS = 52;

function pad(n) { return String(n).padStart(2, '0'); }

/** Floating local-time date format: YYYYMMDDTHHMMSS — no Z, no TZID. */
function fmtLocal(y, m, d, hh, mm) {
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
}

/** UTC timestamp for DTSTAMP: YYYYMMDDTHHMMSSZ */
function fmtUtc(date) {
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/** Escape a text value for ICS. */
function esc(v) {
  return String(v)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/** Fold long lines at 75 octets per RFC 5545 §3.1. */
function fold(line) {
  if (line.length <= 75) return line;
  const out = [];
  let rest = line;
  out.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    out.push(' ' + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) out.push(' ' + rest);
  return out.join('\r\n');
}

/** Parse a YYYY-MM-DD date as a local date (no TZ shift). */
function parseLocalDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Shape each event's description. Opens with the pledge-reminder
 *  framing so the subscriber is always brought back to why this
 *  calendar exists; the Gospel passage follows as "a word from the
 *  Lord to ponder." One short line of context and a link back to
 *  the site. */
function buildDescription({ title, ref, text, translationName }) {
  const parts = [];
  parts.push(
    "Just a gentle reminder that you pledged to seek the Lord's will concerning fostering and adoption. Here's a word from the Lord to ponder."
  );
  parts.push('');
  parts.push(`${title}`);
  parts.push(`A reading from the holy Gospel — ${ref}`);
  parts.push('');
  parts.push(text);
  parts.push('');
  parts.push('The Gospel of the Lord.');
  parts.push('');
  parts.push(`— ${translationName}, public domain.`);
  parts.push('fostercrisis.com');
  return parts.join('\n');
}

function buildIcs() {
  const lectionary = JSON.parse(fs.readFileSync(LECTIONARY_PATH, 'utf8'));
  const gospelsFile = fs.existsSync(GOSPELS_PATH)
    ? JSON.parse(fs.readFileSync(GOSPELS_PATH, 'utf8'))
    : { gospels: {} };
  const gospels = gospelsFile.gospels || {};

  const today = startOfToday();

  // Keep future Sundays only, capped at MAX_WEEKS.
  const upcoming = (lectionary.sundays || [])
    .filter((s) => parseLocalDate(s.date) >= today)
    .slice(0, MAX_WEEKS);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//fostercrisis.com//Sunday Gospel Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:The Sunday Gospel — fostercrisis.com',
    'X-WR-CALDESC:The Catholic Sunday Gospel reading, delivered each Sunday morning. The words of Jesus. The life of Jesus. Presented without commentary. The Word of the Lord.',
    'REFRESH-INTERVAL;VALUE=DURATION:P1D',
    'X-PUBLISHED-TTL:P1D',
  ];

  const stamp = fmtUtc(new Date());
  let emitted = 0;
  let missing = 0;

  for (const entry of upcoming) {
    const g = gospels[entry.date];
    if (!g || !g.text) {
      missing++;
      continue;
    }

    const d = parseLocalDate(entry.date);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const dtstart = fmtLocal(y, m, day, START_HOUR, 0);
    const dtend = fmtLocal(y, m, day, START_HOUR, DURATION_MIN);

    const summary = 'Weekly Pledge Reminder';
    const description = buildDescription({
      title: g.title || entry.title,
      ref: g.ref || entry.displayRef,
      text: g.text,
      translationName: g.translationName || 'World English Bible',
    });
    const uid = `gospel-${y}${pad(m)}${pad(day)}@fostercrisis.com`;

    lines.push(
      'BEGIN:VEVENT',
      fold('UID:' + uid),
      'DTSTAMP:' + stamp,
      'DTSTART:' + dtstart,
      'DTEND:' + dtend,
      fold('SUMMARY:' + esc(summary)),
      fold('DESCRIPTION:' + esc(description)),
      fold('URL;VALUE=URI:https://fostercrisis.com/'),
      'CATEGORIES:Sunday Gospel,Prayer',
      'END:VEVENT'
    );
    emitted++;
  }

  lines.push('END:VCALENDAR');
  return { ics: lines.join('\r\n') + '\r\n', emitted, missing };
}

const { ics, emitted, missing } = buildIcs();
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, ics, 'utf8');
console.log(
  `✓ wrote ${path.relative(path.join(here, '..'), OUT_PATH)}  (${emitted} events, ${missing} Sundays missing text)`
);
