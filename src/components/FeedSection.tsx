import { useEffect, useMemo, useState } from 'react';
import { loadFeeds, type FeedBucket, type FeedItem, type FeedsFile } from '../data/feeds';
import { STATE_INDEX } from '../data/states';

const BUCKETS: { key: FeedBucket; label: string; intro: string }[] = [
  {
    key: 'waiting_children',
    label: 'Kids waiting',
    intro:
      'Children across America hoping to be adopted. Every video embeds from the original source — the Heart Gallery, Grant Me Hope, AdoptUSKids, or the state program that produced it.',
  },
  {
    key: 'system_news',
    label: 'State of the system',
    intro:
      'The news, research, and advocacy shaping American foster care. Independent reporting from The Imprint and reform voices.',
  },
];

function formatDate(iso: string): string {
  const t = Date.parse(iso);
  if (!t) return '';
  return new Date(t).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface Props {
  selectedFips: string | null;
}

export function FeedSection({ selectedFips }: Props) {
  const [feeds, setFeeds] = useState<FeedsFile | null>(null);
  const [bucket, setBucket] = useState<FeedBucket>('waiting_children');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeeds().then((f) => {
      setFeeds(f);
      setLoading(false);
    });
  }, []);

  const selectedCode = selectedFips ? STATE_INDEX[selectedFips]?.code ?? null : null;
  const selectedName = selectedFips ? STATE_INDEX[selectedFips]?.name ?? null : null;

  const rawItems = feeds?.[bucket] ?? [];
  // When a state is selected, surface state-matched items first; otherwise
  // chronological order (feeds.json is already sorted newest-first).
  const items = useMemo(() => {
    if (!selectedCode) return rawItems;
    const matched: FeedItem[] = [];
    const rest: FeedItem[] = [];
    for (const it of rawItems) {
      if (it.state === selectedCode) matched.push(it);
      else rest.push(it);
    }
    return [...matched, ...rest];
  }, [rawItems, selectedCode]);

  const matchedCount = selectedCode
    ? rawItems.filter((it) => it.state === selectedCode).length
    : 0;

  return (
    <section className="feed-section" id="feeds">
      <header className="feed-header">
        <p className="feed-eyebrow">Faces, voices, the system</p>
        <h2 className="feed-title">This is not a statistic.</h2>
        <p className="feed-lede">
          The numbers above are real children. These feeds refresh daily,
          pulled directly from the organizations producing the stories.
        </p>
        <nav className="feed-tabs" role="tablist">
          {BUCKETS.map((b) => (
            <button
              key={b.key}
              role="tab"
              aria-selected={bucket === b.key}
              className={'feed-tab' + (bucket === b.key ? ' is-active' : '')}
              onClick={() => setBucket(b.key)}
            >
              {b.label}
            </button>
          ))}
        </nav>
        <p className="feed-intro">{BUCKETS.find((b) => b.key === bucket)?.intro}</p>
        {selectedCode && bucket === 'waiting_children' && (
          <p className="feed-state-note">
            {matchedCount > 0 ? (
              <>
                <strong>{matchedCount}</strong> item{matchedCount === 1 ? '' : 's'} tagged
                for {selectedName}, followed by national picks.
              </>
            ) : (
              <>
                No {selectedName}-specific items yet. Showing national stories —
                every one of them could be a {selectedName} child's story next week.
              </>
            )}
          </p>
        )}
      </header>

      {loading && <p className="feed-status">Loading stories…</p>}
      {!loading && !feeds && (
        <p className="feed-status">
          Feeds haven't been generated yet. They'll populate on the next
          GitHub Actions run.
        </p>
      )}
      {!loading && feeds && items.length === 0 && (
        <p className="feed-status">No items in this feed yet.</p>
      )}

      <ul className="feed-grid" role="list">
        {items.slice(0, 24).map((it) => (
          <FeedCard key={it.id} item={it} highlight={it.state === selectedCode} />
        ))}
      </ul>
    </section>
  );
}

function FeedCard({ item, highlight }: { item: FeedItem; highlight: boolean }) {
  const [playing, setPlaying] = useState(false);
  const date = formatDate(item.publishedAt);

  return (
    <li className={'feed-card' + (highlight ? ' is-state' : '')}>
      {item.type === 'youtube' && (
        <div className="feed-media">
          {playing && item.embedUrl ? (
            <iframe
              src={`${item.embedUrl}?autoplay=1&rel=0`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="feed-thumb-btn"
              onClick={() => setPlaying(true)}
              aria-label={`Play: ${item.title}`}
            >
              {item.thumbnail && <img src={item.thumbnail} alt="" loading="lazy" />}
              <span className="feed-play" aria-hidden>
                ▶
              </span>
            </button>
          )}
        </div>
      )}
      {item.type !== 'youtube' && item.thumbnail && (
        <a className="feed-media" href={item.url} target="_blank" rel="noopener noreferrer">
          <img src={item.thumbnail} alt="" loading="lazy" />
        </a>
      )}
      <div className="feed-body">
        <p className="feed-source">
          {item.source}
          {date && <span className="feed-dot" aria-hidden> · </span>}
          {date}
        </p>
        <h3 className="feed-card-title">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h3>
        {item.excerpt && <p className="feed-excerpt">{item.excerpt}</p>}
        {item.audioUrl && (
          <audio className="feed-audio" controls preload="none" src={item.audioUrl} />
        )}
      </div>
    </li>
  );
}
