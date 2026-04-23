import { useEffect, useMemo, useState } from 'react';
import { loadFeeds, type FeedItem, type FeedsFile } from '../data/feeds';
import { Shareable } from './Shareable';

const PAGE_STEP = 24;

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
    // Lede intentionally blank — user is writing the intro copy for
    // this section. Once a non-empty string is set here, the <p> will
    // render again (see conditional below).
    lede: '',
  },
  news: {
    eyebrow: 'The state of the system',
    title: 'Giving a voice to the voiceless.',
    lede:
      'Independent reporting on American foster care. The Imprint, NCCPR, and the reform voices American Christianity desperately needs to hear.',
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
  const [pageSize, setPageSize] = useState(PAGE_STEP);

  useEffect(() => {
    loadFeeds().then((f) => {
      setFeeds(f);
      setLoading(false);
    });
  }, []);

  // Reset pagination whenever the view flips between stories/news so
  // users start at the top of the new bucket.
  useEffect(() => {
    setPageSize(PAGE_STEP);
  }, [view]);

  // The `waiting_children` feed bucket carries the YouTube video
  // sources (Heart Gallery, Grant Me Hope, AdoptUSKids, etc.). The
  // bucket key is legacy; the content is Stories.
  const items = useMemo(
    () =>
      view === 'stories'
        ? feeds?.waiting_children ?? []
        : feeds?.system_news ?? [],
    [view, feeds]
  );

  const visible = items.slice(0, pageSize);
  const hasMore = items.length > visible.length;
  const header = HEADERS[view];

  return (
    <section className="feed-section" id="feeds">
      <header className="feed-header">
        <p className="feed-eyebrow">{header.eyebrow}</p>
        <h2 className="feed-title">{header.title}</h2>
        {header.lede && <p className="feed-lede">{header.lede}</p>}
      </header>

      {view === 'stories' && (
        <Shareable label="Bzeek · The Model" className="feed-featured-shareable">
          <article className="feed-featured" aria-label="Featured story">
            <p className="feed-featured-eyebrow">Featured · The Model</p>
            <h3 className="feed-featured-title">
              Meet Mohammad Bzeek, a Libyan-American Muslim who fosters
              terminally ill children until they die.
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
                If American Christianity wants to know what James 1:27
                looks like in the flesh &mdash; here it is. He's not
                American. He's not Christian. But he's outpacing nearly
                all American Christians in his capacity to love.
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
        <>
          <ul className="feed-grid" role="list">
            {visible.map((it) => (
              <FeedCard key={it.id} item={it} highlight={false} />
            ))}
          </ul>
          {hasMore && (
            <div className="feed-more">
              <button
                type="button"
                className="feed-more-btn"
                onClick={() =>
                  setPageSize((n) => Math.min(n + PAGE_STEP, items.length))
                }
              >
                Load more
                <span className="feed-more-count">
                  {Math.min(PAGE_STEP, items.length - visible.length)} of{' '}
                  {items.length - visible.length} remaining
                </span>
              </button>
            </div>
          )}
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
