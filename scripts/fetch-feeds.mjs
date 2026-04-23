#!/usr/bin/env node
// scripts/fetch-feeds.mjs
//
// Ingests the sources listed in scripts/feeds.config.json and writes a
// compact public/data/feeds.json consumed by <FeedSection />.
//
// Supported source kinds:
//   youtube-user     /feeds/videos.xml?user=<handle>       (legacy /user/ URLs)
//   youtube-channel  /feeds/videos.xml?channel_id=UC...    (modern)
//   youtube-playlist /feeds/videos.xml?playlist_id=PL...   (a curated list
//                                                           — most reliable
//                                                           for TV-affiliate
//                                                           "Wednesday's
//                                                           Child" and org
//                                                           waiting-children
//                                                           playlists)
//   rss              any Atom/RSS2 feed URL
//
// Each failed source logs a warning and is skipped — the workflow must
// keep going so one dead channel can't blank the whole feeds section.
//
// Run:  node scripts/fetch-feeds.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchText, log, OUT_DIR, ensureOutDir } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(here, 'feeds.config.json'), 'utf8'));

const MAX_PER_SOURCE = 24; // cap so one prolific channel doesn't crowd others
const US_STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan',
  MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana',
  NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

/** Try to detect a U.S. state from a title/description. Returns FIPS or null. */
function detectState(text) {
  if (!text) return null;
  const upper = text.toUpperCase();
  for (const [code, name] of Object.entries(US_STATE_NAMES)) {
    const re = new RegExp(`\\b(${code}|${name.replace(/ /g, '\\s')})\\b`, 'i');
    if (re.test(text) || upper.includes(` ${code} `)) return code;
  }
  return null;
}

// --- Minimal XML extractors (regex-based). YouTube + RSS share enough
//     predictable structure that we don't need a real parser for the
//     specific fields we want. -----------------------------------------
const rxEntry = /<entry[\s\S]*?<\/entry>/g;
const rxItem = /<item[\s\S]*?<\/item>/g;

function attr(s, key) {
  const re = new RegExp(`${key}=["']([^"']+)["']`);
  const m = re.exec(s);
  return m ? decodeHtml(m[1]) : null;
}

function tag(s, name) {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`);
  const m = re.exec(s);
  return m ? decodeHtml(m[1].trim().replace(/<!\[CDATA\[|\]\]>/g, '')) : null;
}

function tagAttr(s, name, att) {
  // Self-closing-or-not, first-occurrence attribute read.
  const re = new RegExp(`<${name}[^>]*\\b${att}=["']([^"']+)["']`);
  const m = re.exec(s);
  return m ? decodeHtml(m[1]) : null;
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

// --- Per-source fetchers ---------------------------------------------

async function pickBestYouTubeThumb(videoId) {
  // Try higher-resolution thumbnails first; YouTube serves a 120×90
  // placeholder with Content-Length ≈ 1097 bytes when the resolution
  // doesn't exist for a given video. Fall through until one sticks.
  const candidates = ['maxresdefault', 'sddefault', 'hqdefault'];
  for (const size of candidates) {
    const url = `https://i.ytimg.com/vi/${videoId}/${size}.jpg`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) continue;
      const len = Number(res.headers.get('content-length') || '0');
      // Placeholder is ~1.1 KB; any real thumbnail is multiple KB.
      if (len > 2000) return url;
    } catch {
      /* try next size */
    }
  }
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function youtubeFeedUrl(src) {
  if (src.kind === 'youtube-channel') {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${src.id}`;
  }
  if (src.kind === 'youtube-playlist') {
    return `https://www.youtube.com/feeds/videos.xml?playlist_id=${src.id}`;
  }
  return `https://www.youtube.com/feeds/videos.xml?user=${src.id}`;
}

async function fetchYouTube(src) {
  const url = youtubeFeedUrl(src);
  const xml = await fetchText(url, { timeoutMs: 20_000 });
  const items = [];
  const entries = xml.match(rxEntry) ?? [];
  for (const e of entries.slice(0, MAX_PER_SOURCE)) {
    const videoId = tag(e, 'yt:videoId');
    if (!videoId) continue;
    const title = tag(e, 'title') ?? '';
    const published = tag(e, 'published') ?? '';
    const description = tag(e, 'media:description') ?? '';
    const thumbnail = await pickBestYouTubeThumb(videoId);
    items.push({
      id: `yt:${videoId}`,
      source: src.name,
      title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnail,
      type: 'youtube',
      publishedAt: published,
      state: detectState(`${title} ${description}`),
      feed: src.feed,
    });
  }
  return items;
}

/** Pull og:image (or twitter:image) from an article HTML page. The
 *  RSS feeds for news publishers almost never carry a usable lead
 *  image, but the canonical article page always does — that's what
 *  Facebook/Twitter/Slack render. Time-boxed and failure-tolerant. */
async function fetchOgImage(url) {
  try {
    const html = await fetchText(url, { timeoutMs: 12_000 });
    // Scan the <head> only; articles with long bodies blow up the
    // regex backtracker otherwise. `<head>…</head>` is consistently
    // under 16 KB.
    const head = /<head[^>]*>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? html.slice(0, 16_000);
    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    ];
    for (const re of patterns) {
      const m = re.exec(head);
      if (m && m[1]) {
        const raw = decodeHtml(m[1]);
        // Resolve protocol-relative and root-relative URLs.
        if (raw.startsWith('//')) return 'https:' + raw;
        if (raw.startsWith('/')) {
          const u = new URL(url);
          return `${u.protocol}//${u.host}${raw}`;
        }
        return raw;
      }
    }
  } catch {
    /* network/parse failure — caller will fall back to RSS image or null */
  }
  return null;
}

async function fetchRss(src) {
  const xml = await fetchText(src.url, { timeoutMs: 20_000 });
  // Try RSS 2.0 <item> first; if empty, try Atom <entry>.
  const rawItems = xml.match(rxItem) ?? xml.match(rxEntry) ?? [];
  const items = [];
  for (const raw of rawItems.slice(0, MAX_PER_SOURCE)) {
    const title = tag(raw, 'title') ?? '';
    let url =
      tag(raw, 'link') ??
      tagAttr(raw, 'link', 'href') ??
      null;
    const pubDate =
      tag(raw, 'pubDate') ??
      tag(raw, 'published') ??
      tag(raw, 'updated') ??
      '';
    const description =
      tag(raw, 'description') ??
      tag(raw, 'summary') ??
      tag(raw, 'content:encoded') ??
      tag(raw, 'content') ??
      '';
    // Podcast: enclosure url
    const audioUrl = tagAttr(raw, 'enclosure', 'url');
    // Cover image: itunes:image, media:thumbnail, or nothing
    let img =
      tagAttr(raw, 'itunes:image', 'href') ??
      tagAttr(raw, 'media:thumbnail', 'url') ??
      tagAttr(raw, 'media:content', 'url') ??
      null;
    // Try to extract first <img> from description HTML if nothing above.
    if (!img) {
      const m = /<img[^>]+src=["']([^"']+)["']/i.exec(description);
      if (m) img = decodeHtml(m[1]);
    }
    if (!title || !url) continue;
    // Fetch og:image from the article page for article-type items. We
    // skip this for podcasts (itunes:image is the canonical cover) and
    // for items that already have a reasonable-looking image.
    if (!audioUrl && !img) {
      const og = await fetchOgImage(url);
      if (og) img = og;
    }
    // Strip HTML from description for card excerpt.
    const excerpt = description.replace(/<[^>]+>/g, '').trim().slice(0, 220);
    items.push({
      id: url,
      source: src.name,
      title,
      url,
      audioUrl,
      thumbnail: img,
      excerpt,
      type: audioUrl ? 'podcast' : 'article',
      publishedAt: pubDate,
      state: detectState(`${title} ${description}`),
      feed: src.feed,
    });
  }
  return items;
}

async function fetchSource(src) {
  try {
    let items;
    if (
      src.kind === 'youtube-user' ||
      src.kind === 'youtube-channel' ||
      src.kind === 'youtube-playlist'
    ) {
      items = await fetchYouTube(src);
    } else if (src.kind === 'rss') {
      items = await fetchRss(src);
    } else {
      log.warn(`Unknown source kind: ${src.kind}`);
      return [];
    }
    log.ok(`${src.name}: ${items.length} items`);
    return items;
  } catch (e) {
    log.warn(`${src.name} failed (${e.message})`);
    return [];
  }
}

// ---------------------------------------------------------------------

log.step(`Ingest ${config.sources.length} feed sources`);

const all = [];
for (const src of config.sources) {
  const items = await fetchSource(src);
  all.push(...items);
}

// Sort newest-first per bucket, cap final totals.
const byFeed = { waiting_children: [], system_news: [] };
for (const it of all) {
  if (byFeed[it.feed]) byFeed[it.feed].push(it);
}
for (const key of Object.keys(byFeed)) {
  byFeed[key].sort((a, b) => {
    const ta = Date.parse(a.publishedAt) || 0;
    const tb = Date.parse(b.publishedAt) || 0;
    return tb - ta;
  });
  byFeed[key] = byFeed[key].slice(0, 96);
}

const out = {
  _meta: {
    generated: new Date().toISOString(),
    sources: config.sources.map((s) => ({ name: s.name, kind: s.kind, feed: s.feed })),
  },
  waiting_children: byFeed.waiting_children,
  system_news: byFeed.system_news,
};

ensureOutDir();
const p = path.join(OUT_DIR, 'feeds.json');
fs.writeFileSync(p, JSON.stringify(out));
const sz = fs.statSync(p).size;
log.ok(
  `wrote feeds.json — ${out.waiting_children.length} waiting, ${out.system_news.length} news (${(sz / 1024).toFixed(1)} KB)`
);
