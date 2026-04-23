import { useEffect, useRef, useState } from 'react';
import { ShareModal } from './ShareModal';

interface Props {
  /** Content being wrapped — the "meaty block" a reader might want to share. */
  children: React.ReactNode;
  /** A short label that appears in the share modal header and on the
   *  branded footer of generated PNGs. Keep it concrete and human:
   *  "Part II · The Mirror", "Bzeek — The Model", "Grave · Six numbers". */
  label: string;
  /** Optional className to forward to the outer wrapper (so the
   *  Shareable can participate in existing grid / spacing layout). */
  className?: string;
  /** Optional inline style forwarded to the outer wrapper. */
  style?: React.CSSProperties;
}

/** Wraps any visually-distinct section of the site with a subtle share
 *  affordance in its top-right corner. The icon is invisible until the
 *  block intersects the viewport — preventing distracting reveals as
 *  the reader scrolls past out-of-view content — and remains at low
 *  opacity until hovered (desktop) or tapped (mobile).
 *
 *  On activation, the block's DOM is captured as a PNG via html-to-image
 *  with a branded fostercrisis.com footer appended. Users can download,
 *  copy, tweet, share natively, or copy a deep-link URL. */
export function Shareable({ children, label, className, style }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true); // SSR / old browser safety — always visible
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Reveal once the card is at least 30% in view. Once revealed,
          // it stays revealed — we disconnect so scrolling past doesn't
          // hide-then-reshow the button.
          if (e.intersectionRatio >= 0.3) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.3, 0.6, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={'shareable' + (className ? ' ' + className : '')}
      style={style}
    >
      {children}
      <button
        type="button"
        className={'shareable-trigger' + (visible ? ' is-visible' : '')}
        onClick={() => setOpen(true)}
        aria-label={`Share this section — ${label}`}
        tabIndex={visible ? 0 : -1}
      >
        {/* iOS-style share glyph: a box with an upward arrow */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v12M12 3L8 7M12 3l4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && wrapperRef.current && (
        <ShareModal
          targetNode={wrapperRef.current}
          label={label}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
