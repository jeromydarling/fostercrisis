import { Fragment } from 'react';
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
          {paragraphs.map((p, i) => {
            // Single newlines within a paragraph are preserved as
            // line breaks — matters for verse-style prayers (Psalm
            // 130, Prayer for Our Country) where the stanza shape is
            // part of the text.
            const lines = p.split('\n');
            return (
              <p key={i}>
                {lines.map((line, j) => (
                  <Fragment key={j}>
                    {line}
                    {j < lines.length - 1 && <br />}
                  </Fragment>
                ))}
              </p>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
