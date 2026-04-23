import { useEffect, useState } from 'react';
import {
  captureShare,
  copyBlobToClipboard,
  downloadBlob,
  shareNative,
} from '../utils/captureShareImage';

interface Props {
  /** The live DOM node to capture — the wrapping Shareable's outer div.
   *  The capture utility clones it off-screen and renders to PNG. */
  targetNode: HTMLElement;
  /** Label for UI + filename. */
  label: string;
  onClose: () => void;
}

type Status =
  | { kind: 'capturing' }
  | { kind: 'ready'; blob: Blob; dataUrl: string }
  | { kind: 'error'; message: string };

type ToastKind = null | 'copied-image' | 'copied-link' | 'native-ok' | 'native-fail';

/** Modal presented when the reader taps a Shareable's share icon.
 *  Generates a branded PNG of the wrapped section and offers five
 *  actions: download, copy image, tweet, native share, copy link. */
export function ShareModal({ targetNode, label, onClose }: Props) {
  const [status, setStatus] = useState<Status>({ kind: 'capturing' });
  const [toast, setToast] = useState<ToastKind>(null);

  // Kick off the capture as soon as the modal opens.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { blob, dataUrl } = await captureShare({
          node: targetNode,
          attribution: label,
          width: 1080,
          pixelRatio: 2,
        });
        if (cancelled) return;
        setStatus({ kind: 'ready', blob, dataUrl });
      } catch (e) {
        if (cancelled) return;
        setStatus({
          kind: 'error',
          message: (e as Error)?.message ?? 'Could not generate image.',
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [targetNode, label]);

  // Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Toast timeout helper.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const pageUrl =
    typeof window !== 'undefined' ? window.location.href.split('#')[0] : 'https://fostercrisis.com/';
  const tweetText = `${label} — fostercrisis.com`;
  const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=${encodeURIComponent(pageUrl)}`;

  const onDownload = () => {
    if (status.kind !== 'ready') return;
    const slug = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    downloadBlob(status.blob, `fostercrisis-${slug}.png`);
  };

  const onCopyImage = async () => {
    if (status.kind !== 'ready') return;
    const ok = await copyBlobToClipboard(status.blob);
    setToast(ok ? 'copied-image' : 'native-fail');
  };

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setToast('copied-link');
    } catch {
      setToast('native-fail');
    }
  };

  const onNative = async () => {
    if (status.kind !== 'ready') return;
    const ok = await shareNative(status.blob, label, pageUrl);
    setToast(ok ? 'native-ok' : 'native-fail');
  };

  return (
    <div
      className="shareable-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Share ${label}`}
      onClick={(e) => {
        // Click on backdrop closes. Click inside the dialog itself does not.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="shareable-modal-dialog">
        <header className="shareable-modal-header">
          <div>
            <p className="shareable-modal-eyebrow">Share</p>
            <p className="shareable-modal-label">{label}</p>
          </div>
          <button
            type="button"
            className="shareable-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <div className="shareable-modal-preview">
          {status.kind === 'capturing' && (
            <div className="shareable-modal-loading">
              <span className="shareable-modal-spinner" aria-hidden />
              <span>Composing share image…</span>
            </div>
          )}
          {status.kind === 'error' && (
            <div className="shareable-modal-error">
              <strong>Couldn&rsquo;t render an image.</strong>
              <span>{status.message}</span>
              <span>You can still copy the link below.</span>
            </div>
          )}
          {status.kind === 'ready' && (
            <img
              src={status.dataUrl}
              alt={`Preview of share image for ${label}`}
              className="shareable-modal-preview-img"
            />
          )}
        </div>

        <div className="shareable-modal-actions">
          <button
            type="button"
            className="shareable-modal-btn shareable-modal-btn-primary"
            onClick={onDownload}
            disabled={status.kind !== 'ready'}
          >
            Download image
          </button>
          <button
            type="button"
            className="shareable-modal-btn"
            onClick={onCopyImage}
            disabled={status.kind !== 'ready'}
          >
            Copy image
          </button>
          <a
            className="shareable-modal-btn"
            href={tweetIntent}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on X
          </a>
          <button
            type="button"
            className="shareable-modal-btn shareable-modal-btn-native"
            onClick={onNative}
            disabled={status.kind !== 'ready'}
          >
            Share…
          </button>
          <button
            type="button"
            className="shareable-modal-btn shareable-modal-btn-quiet"
            onClick={onCopyLink}
          >
            Copy link
          </button>
        </div>

        {toast && (
          <p className="shareable-modal-toast">
            {toast === 'copied-image' && 'Image copied to clipboard.'}
            {toast === 'copied-link' && 'Link copied.'}
            {toast === 'native-ok' && 'Shared.'}
            {toast === 'native-fail' &&
              "Couldn't do that on this device — try Download instead."}
          </p>
        )}

        <p className="shareable-modal-hint">
          The image saves at 1080 px wide with a branded footer. Post to
          X, IG Stories, WhatsApp, SMS &mdash; wherever you meet people.
        </p>
      </div>
    </div>
  );
}
