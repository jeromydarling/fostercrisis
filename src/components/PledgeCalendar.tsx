import { useEffect, useState } from 'react';

/** The Pledge — a calendar subscription in lieu of an email list.
 *  One webcal:// URL. Users add it to Apple Calendar, Google
 *  Calendar, Outlook, or Fantastical and receive a Sunday-morning
 *  meditation every week for the next year: scripture, the number,
 *  and one action.
 *
 *  Zero backend. Zero subscriber list. The .ics file lives at
 *  /pledge.ics, regenerated on every deploy, and calendar apps poll
 *  it on their own schedule. Unsubscribe = remove the calendar.
 */
export function PledgeCalendar() {
  const [host, setHost] = useState('fostercrisis.com');

  useEffect(() => {
    // On the client, use the actual host so previews on github.io
    // and custom domains both yield a valid webcal link.
    if (typeof window !== 'undefined') {
      setHost(window.location.host);
    }
  }, []);

  const webcalHref = `webcal://${host}/pledge.ics`;
  const httpsHref = `https://${host}/pledge.ics`;

  return (
    <aside className="pledge" aria-label="The pledge">
      <div className="pledge-card">
        <div className="pledge-ornament" aria-hidden>
          &#10057;
        </div>
        <p className="pledge-eyebrow">The Pledge</p>
        <p className="pledge-line">
          <em>I will prayerfully consider opening my home to a child.</em>
        </p>
        <p className="pledge-body">
          Add one year of Sunday Gospel readings to your calendar &mdash;
          the passages the Church hears at Mass each week. The words of
          Jesus. The life of Jesus. Presented without commentary.
        </p>

        <a
          className="pledge-btn"
          href={webcalHref}
          aria-label="Add the Sunday Gospel calendar to your calendar app"
        >
          <span className="pledge-btn-icon" aria-hidden>
            &#128197;
          </span>
          <span>Add to my calendar</span>
        </a>

        <p className="pledge-fine">
          Fifty-two Sundays. The Catholic Sunday Gospel each week, in the
          public-domain World English Bible. Works with Apple, Google,
          and Outlook. Free. No email, no account. Unsubscribe by
          removing the calendar.
        </p>

        <details className="pledge-manual">
          <summary>Or copy the subscription URL</summary>
          <code className="pledge-url">{httpsHref}</code>
          <p className="pledge-manual-note">
            Paste this into your calendar app&rsquo;s &ldquo;Subscribe to
            calendar&rdquo; field (Google Calendar &rarr; From URL; Apple
            Calendar &rarr; File &rarr; New Calendar Subscription).
          </p>
        </details>
      </div>
    </aside>
  );
}
