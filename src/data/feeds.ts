export type FeedBucket = 'waiting_children' | 'system_news';

export type FeedItemType = 'youtube' | 'podcast' | 'article';

export interface FeedItem {
  id: string;
  source: string;
  title: string;
  url: string;
  type: FeedItemType;
  feed: FeedBucket;
  publishedAt: string;
  thumbnail?: string | null;
  embedUrl?: string;
  audioUrl?: string | null;
  excerpt?: string;
  /** Two-letter US state code if the fetcher detected one in the title
   *  or description. */
  state?: string | null;
}

export interface FeedsFile {
  _meta: {
    generated: string;
    sources: { name: string; kind: string; feed: FeedBucket }[];
  };
  waiting_children: FeedItem[];
  system_news: FeedItem[];
}

// Vite rewrites asset URLs relative to `base` at build time.
const BASE = import.meta.env.BASE_URL;

export async function loadFeeds(): Promise<FeedsFile | null> {
  try {
    const res = await fetch(`${BASE}data/feeds.json`);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('json')) return null;
    return (await res.json()) as FeedsFile;
  } catch {
    return null;
  }
}
