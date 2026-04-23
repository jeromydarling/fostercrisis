import { useEffect, useState } from 'react';
import { loadFeeds, type FeedItem, type FeedsFile } from '../data/feeds';
import { Shareable } from './Shareable';

/** Which feed this section is rendering. Stories and News are two
 *  separate top-level modes in the main nav — the tab rail that used
 *  to live here has been removed in favor of giving each its own
 *  page. The component is essentially a switchable content shell now. */
export type FeedView = 'stories' | 'news';

interface Props {
  view: FeedView;
}

const HEADERS: Record<
  FeedView,
  { eyebrow: string; title: string; lede: string }
> = {
  stories: {
    eyebrow: 'Faces · the waiting · the model',
    title: 'This is not a statistic.',
    lede:
      "The numbers above are real children. Below: Mohammad Bzeek — the Libyan-American Muslim who has fostered roughly 80 terminally-ill children in Los Angeles County since 1995 — and the national photolisting networks that film the rest. Heart Gallery, Grant Me Hope, AdoptUSKids, America's Kids Belong, Forever Family. The most Christ-shaped lives on this page were not lived by Christians.",
  },
  news: {
    eyebrow: 'The state of the system',
    title: 'What is breaking, and who is saying so.',
    lede:
      'Independent reporting on American foster care. The Imprint, NCCPR, and the reform voices the mainstream press leaves unread.',
  },
};

function formatDate(iso: string): string {
  const t = Date.parse(iso);
  if (!t) return '';
  return new Date(t).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function FeedSection({ view }: Props) {
  const [feeds, setFeeds] = useState<FeedsFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bzeekPlaying, setBzeekPlaying] = useState(false);

  useEffect(() => {
    loadFeeds().then((f) => {
      setFeeds(f);
      setLoading(false);
    });
  }, []);

  // The `waiting_children` feed bucket carries the YouTube video
  // sources (Heart Gallery, Grant Me Hope, AdoptUSKids, etc.). The
  // bucket key is legacy; the content is Stories.
  const items =
    view === 'stories'
      ? feeds?.waiting_children ?? []
      : feeds?.system_news ?? [];

  const header = HEADERS[view];

  return (
    <section className="feed-section" id="feeds">
      <header className="feed-header">
        <p className="feed-eyebrow">{header.eyebrow}</p>
        <h2 className="feed-title">{header.title}</h2>
        <p className="feed-lede">{header.lede}</p>
      </header>

      {view === 'stories' && (
        <Shareable label="Bzeek · The Model" className="feed-featured-shareable">
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
                Bzeek takes in terminally-ill foster children no one
                else will take &mdash; children with short diagnoses,
                many without families willing to be present at the end.
                He has fostered approximately <strong>80 children</strong>.
                He has buried <strong>10 of them</strong>. When the rest
                of them die, he is the one who holds them so they do not
                die alone.
              </p>
              <p className="feed-featured-kicker">
                If the American Church wants to know what James 1:27
                looks like in the flesh &mdash; here it is. And it is
                not American. And it is not Christian.
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
        </Shareable>
      )}

      {loading && (
        <p className="feed-status">
          {view === 'stories' ? 'Loading stories…' : 'Loading the news…'}
        </p>
      )}
      {!loading && !feeds && (
        <p className="feed-status">
          Feeds haven't been generated yet. They'll populate on the next
          GitHub Actions run.
        </p>
      )}
      {!loading && feeds && items.length === 0 && (
        <p className="feed-status">No items in this feed yet.</p>
      )}
      {items.length > 0 && (
        <ul className="feed-grid" role="list">
          {items.slice(0, 24).map((it) => (
            <FeedCard key={it.id} item={it} highlight={false} />
          ))}
        </ul>
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
