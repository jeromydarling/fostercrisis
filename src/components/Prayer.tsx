import type { Prayer as PrayerData } from '../data/prayers';

interface Props {
  prayer: PrayerData;
}

/** A meditative prayer block appended to the end of each essay section
 *  (before the Sources drawer). Rendered as a cream-parchment panel
 *  deliberately distinct from the dark polemic around it — a visual
 *  pause where the indictment ends and the meditation begins. */
export function Prayer({ prayer }: Props) {
  const paragraphs = prayer.body.split('\n\n');
  return (
    <aside
      className="prayer"
      aria-label={`Prayer: ${prayer.title}`}
      role="complementary"
    >
      <div className="prayer-card">
        <div className="prayer-ornament" aria-hidden>
          &#10047;
        </div>

        <p className="prayer-eyebrow">{prayer.theme}</p>
        <h3 className="prayer-title">{prayer.title}</h3>

        <div className="prayer-body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="prayer-rule" aria-hidden />

        <p className="prayer-source">
          {prayer.attribution} &middot;{' '}
          <a
            href={prayer.sourceHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            source
          </a>
        </p>
        {prayer.sourceNote ? (
          <p className="prayer-source-note">{prayer.sourceNote}</p>
        ) : null}
      </div>
    </aside>
  );
}
