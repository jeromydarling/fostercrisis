import { useEffect, useState } from 'react';

/** The Pledge — a calendar subscription in lieu of an email list.
 *  Each Sunday delivers the Catholic Sunday Gospel reading into the
 *  subscriber's calendar. Three one-click paths (Apple, Google, Copy)
 *  because a single `webcal://` link fails silently on any platform
 *  whose browser hasn't registered the scheme. */
export function PledgeCalendar() {
  const [host, setHost] = useState('fostercrisis.com');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHost(window.location.host);
    }
  }, []);

  const httpsHref = `https://${host}/pledge.ics`;
  const webcalHref = `webcal://${host}/pledge.ics`;
  const googleHref = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(
    webcalHref
  )}`;

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(httpsHref);
      } else {
        // Last-ditch fallback for browsers without Clipboard API
        const el = document.createElement('textarea');
        el.value = httpsHref;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // If even that fails, show a prompt so the URL is still accessible
      window.prompt('Copy this calendar subscription URL:', httpsHref);
    }
  }

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

        <div className="pledge-btns" role="group" aria-label="Add calendar subscription">
          <a
            className="pledge-btn"
            href={webcalHref}
            aria-label="Add to Apple Calendar, iOS, or macOS"
          >
            <span className="pledge-btn-icon" aria-hidden>&#63743;</span>
            <span>Apple</span>
          </a>
          <a
            className="pledge-btn"
            href={googleHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Add to Google Calendar"
          >
            <span className="pledge-btn-icon" aria-hidden>&#128197;</span>
            <span>Google</span>
          </a>
          <button
            type="button"
            className={'pledge-btn pledge-btn-copy' + (copied ? ' is-copied' : '')}
            onClick={copy}
            aria-label="Copy the subscription URL to paste into any calendar app"
          >
            <span className="pledge-btn-icon" aria-hidden>
              {copied ? '✓' : '⧉'}
            </span>
            <span>{copied ? 'Copied' : 'Copy URL'}</span>
          </button>
        </div>

        <p className="pledge-fine">
          Fifty-two weeks of gentle reminders.
        </p>

        <details className="pledge-manual">
          <summary>Outlook, Fantastical, or any other calendar</summary>
          <code className="pledge-url">{httpsHref}</code>
          <p className="pledge-manual-note">
            Paste this URL into your calendar app&rsquo;s <em>Subscribe
            to calendar</em> field. In Outlook: <em>Add calendar &rarr;
            Subscribe from web</em>. In Fantastical: <em>File &rarr;
            New Calendar Subscription</em>. Unsubscribe any time by
            removing the calendar.
          </p>
        </details>
      </div>
    </aside>
  );
}
