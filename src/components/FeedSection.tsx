import { useEffect, useState } from 'react';
import { loadFeeds, type FeedItem, type FeedsFile } from '../data/feeds';
import { STATE_INDEX } from '../data/states';
import { StateOrgsDirectory } from './StateOrgsDirectory';
import { Shareable } from './Shareable';

/** Which of the three tabs is visible. Tabs are UI-level, not a 1:1
 *  mapping of feed buckets — the Directory tab is a hardcoded
 *  component, the other two pull from feeds.json. */
type Tab = 'stories' | 'directory' | 'news';

const TABS: { key: Tab; label: string; intro: string }[] = [
  {
    key: 'stories',
    label: 'Stories',
    intro:
      'Real children waiting for families, and the people already showing up for them. Featured here: Mohammad Bzeek — the Libyan-American Muslim who has fostered roughly 80 terminally-ill children in Los Angeles County since 1995. Below him, the national photolisting networks: Heart Gallery, Grant Me Hope, AdoptUSKids, America\'s Kids Belong, and Forever Family. The most Christ-shaped lives on this page were not lived by Christians.',
  },
  {
    key: 'directory',
    label: 'Directory',
    intro:
      "A state-by-state directory of the people already in the fight — every state's official photolisting, the intake page you need to become a foster parent, the local Heart Gallery chapter, and a short list of orgs working on the ground. If your state is on the map above, it is on the list below. Start there.",
  },
  {
    key: 'news',
    label: 'News',
    intro:
      'The news, research, and advocacy shaping American foster care. Independent reporting from The Imprint, reform voices (NCCPR), and the stories families are telling in their own words.',
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
  const [tab, setTab] = useState<Tab>('stories');
  const [loading, setLoading] = useState(true);
  const [bzeekPlaying, setBzeekPlaying] = useState(false);

  useEffect(() => {
    loadFeeds().then((f) => {
      setFeeds(f);
      setLoading(false);
    });
  }, []);

  const selectedCode = selectedFips ? STATE_INDEX[selectedFips]?.code ?? null : null;

  // The `waiting_children` bucket still carries the YouTube video
  // sources (Heart Gallery, Grant Me Hope, AdoptUSKids, etc.). We
  // surface it under the Stories tab — the bucket key is legacy, the
  // content is stories.
  const storyItems = feeds?.waiting_children ?? [];
  const newsItems = feeds?.system_news ?? [];

  const currentIntro = TABS.find((t) => t.key === tab)?.intro ?? '';

  return (
    <section className="feed-section" id="feeds">
      <header className="feed-header">
        <p className="feed-eyebrow">Faces, voices, the system</p>
        <h2 className="feed-title">This is not a statistic.</h2>
        <p className="feed-lede">
          The numbers above are real children. Below: their stories, the
          people already in the fight for them, and the state of the
          system they live in.
        </p>
        <nav className="feed-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={'feed-tab' + (tab === t.key ? ' is-active' : '')}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <p className="feed-intro">{currentIntro}</p>
      </header>

      {tab === 'stories' && (
        <>
          {/* Bzeek — the featured story, anchors the Stories tab */}
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
                  He has fostered approximately{' '}
                  <strong>80 children</strong>. He has buried{' '}
                  <strong>10 of them</strong>. When the rest of them die,
                  he is the one who holds them so they do not die alone.
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

          {/* Video grid — Heart Gallery, Grant Me Hope, AdoptUSKids, etc. */}
          {loading && <p className="feed-status">Loading stories&hellip;</p>}
          {!loading && !feeds && (
            <p className="feed-status">
              Feeds haven't been generated yet. They'll populate on the
              next GitHub Actions run.
            </p>
          )}
          {!loading && feeds && storyItems.length === 0 && (
            <p className="feed-status">No stories in this feed yet.</p>
          )}
          {storyItems.length > 0 && (
            <ul className="feed-grid" role="list">
              {storyItems.slice(0, 24).map((it) => (
                <FeedCard key={it.id} item={it} highlight={false} />
              ))}
            </ul>
          )}
        </>
      )}

      {tab === 'directory' && <StateOrgsDirectory activeCode={selectedCode} />}

      {tab === 'news' && (
        <>
          {loading && <p className="feed-status">Loading the news&hellip;</p>}
          {!loading && !feeds && (
            <p className="feed-status">
              Feeds haven't been generated yet. They'll populate on the
              next GitHub Actions run.
            </p>
          )}
          {!loading && feeds && newsItems.length === 0 && (
            <p className="feed-status">No items in this feed yet.</p>
          )}
          {newsItems.length > 0 && (
            <ul className="feed-grid" role="list">
              {newsItems.slice(0, 24).map((it) => (
                <FeedCard key={it.id} item={it} highlight={false} />
              ))}
            </ul>
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
