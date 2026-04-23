import { useEffect, useState } from 'react';
import { loadFeeds, type FeedBucket, type FeedItem, type FeedsFile } from '../data/feeds';
import { STATE_INDEX } from '../data/states';
import { StateOrgsDirectory } from './StateOrgsDirectory';

const BUCKETS: { key: FeedBucket; label: string; intro: string }[] = [
  {
    key: 'waiting_children',
    label: 'Kids waiting',
    intro:
      'A state-by-state directory of the people already in the fight — every state\'s official photolisting, the intake page you need to become a foster parent, the local Heart Gallery chapter, and a short list of orgs working on the ground. If your state is on the map above, it is on the list below. Start there.',
  },
  {
    key: 'system_news',
    label: 'State of the system',
    intro:
      'The news, research, and advocacy shaping American foster care. Independent reporting from The Imprint, reform voices, and the stories families are telling in their own words.',
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
  const [bzeekPlaying, setBzeekPlaying] = useState(false);

  useEffect(() => {
    loadFeeds().then((f) => {
      setFeeds(f);
      setLoading(false);
    });
  }, []);

  const selectedCode = selectedFips ? STATE_INDEX[selectedFips]?.code ?? null : null;

  const newsItems = feeds?.system_news ?? [];

  return (
    <section className="feed-section" id="feeds">
      <header className="feed-header">
        <p className="feed-eyebrow">Faces, voices, the system</p>
        <h2 className="feed-title">This is not a statistic.</h2>
        <p className="feed-lede">
          The numbers above are real children and the people already moving
          toward them. The directory refreshes when we refresh it; the news
          feed refreshes daily.
        </p>

        {/* Featured story — Mohammad Bzeek. Sits above the tabs so every
            visitor sees it, regardless of which feed they open. */}
        <article className="feed-featured" aria-label="Featured story">
          <p className="feed-featured-eyebrow">Featured · The Model</p>
          <h3 className="feed-featured-title">
            The most Christ-shaped life on this page was not lived by
            a Christian.
          </h3>
          <div className="feed-featured-media">
            {bzeekPlaying ? (
              <iframe
                src="https://www.youtube.com/embed/fqnoGDQ2i2k?autoplay=1&rel=0"
                title="Mohammad Bzeek — A Hero's Mission (Great Big Story)"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className="feed-thumb-btn"
                onClick={() => setBzeekPlaying(true)}
                aria-label="Play: Mohammad Bzeek — A Hero's Mission"
              >
                <img
                  src="https://i.ytimg.com/vi/fqnoGDQ2i2k/maxresdefault.jpg"
                  alt=""
                  loading="lazy"
                />
                <span className="feed-play" aria-hidden>▶</span>
              </button>
            )}
          </div>
          <div className="feed-featured-body">
            <p className="feed-featured-who">
              <strong>Mohammad Bzeek.</strong> Libyan-American Muslim.
              Los Angeles County, since 1995.
            </p>
            <p>
              Bzeek takes in terminally-ill foster children no one else
              will take &mdash; children with short diagnoses, many
              without families willing to be present at the end. He has
              fostered approximately <strong>80 children</strong>. He
              has buried <strong>10 of them</strong>. When the rest of
              them die, he is the one who holds them so they do not die
              alone.
            </p>
            <p className="feed-featured-kicker">
              If the American Church wants to know what James 1:27 looks
              like in the flesh &mdash; here it is. And it is not
              American. And it is not Christian.
            </p>
            <p className="feed-featured-credit">
              Video: Great Big Story via YouTube.{' '}
              <a
                href="https://youtu.be/fqnoGDQ2i2k"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube &rarr;
              </a>
            </p>
          </div>
        </article>

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
      </header>

      {bucket === 'waiting_children' ? (
        <StateOrgsDirectory activeCode={selectedCode} />
      ) : (
        <>
          {loading && <p className="feed-status">Loading stories…</p>}
          {!loading && !feeds && (
            <p className="feed-status">
              Feeds haven't been generated yet. They'll populate on the next
              GitHub Actions run.
            </p>
          )}
          {!loading && feeds && newsItems.length === 0 && (
            <p className="feed-status">No items in this feed yet.</p>
          )}
          <ul className="feed-grid" role="list">
            {newsItems.slice(0, 24).map((it) => (
              <FeedCard key={it.id} item={it} highlight={false} />
            ))}
          </ul>
        </>
      )}
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
