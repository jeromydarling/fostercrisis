import { toPng } from 'html-to-image';

/** Configuration for a single capture. */
export interface CaptureOptions {
  /** The DOM node to capture. */
  node: HTMLElement;
  /** A short human-readable label shown in the branded footer above
   *  the URL — e.g. "Part XI · The Grave". Optional. */
  attribution?: string;
  /** Output width in pixels. Defaults to 1080 (Instagram square native). */
  width?: number;
  /** Device-pixel scale. Defaults to 2 (retina-crisp shares). */
  pixelRatio?: number;
}

/** Produce a PNG blob + object URL for a given DOM node, with a
 *  branded footer appended below the captured content. The footer
 *  carries the fostercrisis.com URL, a tagline, and a small gold
 *  ornament so every share bears the site's identity.
 *
 *  Pipeline: clone the target node into a hidden off-DOM wrapper →
 *  inject a branded footer div beneath the clone → hand the wrapper
 *  to html-to-image → get a PNG data URL → convert to blob. */
export async function captureShare(
  opts: CaptureOptions
): Promise<{ blob: Blob; dataUrl: string }> {
  const { node, attribution, width = 1080, pixelRatio = 2 } = opts;

  // Wait for any webfonts used in the page to finish loading; otherwise
  // html-to-image may serialize fallback fonts into the PNG.
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore — proceed with whatever fonts are loaded */
    }
  }

  // Build a floating off-screen wrapper that contains a *clone* of the
  // target plus the branded footer. The clone approach means we don't
  // mutate the live DOM while the capture runs — scroll position, focus,
  // and hover states on the real page remain untouched.
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: -99999px;
    width: ${width}px;
    padding: 0;
    margin: 0;
    background: #0b0d12;
    color: #e6e7ea;
    box-sizing: border-box;
    font-family: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
  `;

  const clone = node.cloneNode(true) as HTMLElement;
  // Strip the Shareable's own chrome (trigger button, modal) so the
  // capture shows ONLY the content, not the share icon itself.
  clone.querySelectorAll('.shareable-trigger, .shareable-modal').forEach((el) =>
    el.parentNode?.removeChild(el)
  );
  // Normalise margins / floating positioning so the clone sits cleanly
  // at the top of the capture wrapper.
  clone.style.margin = '0';
  clone.style.position = 'static';
  clone.style.transform = 'none';

  wrapper.appendChild(clone);
  wrapper.appendChild(makeFooter(attribution));
  document.body.appendChild(wrapper);

  try {
    const dataUrl = await toPng(wrapper, {
      cacheBust: true,
      pixelRatio,
      width,
      backgroundColor: '#0b0d12',
      style: {
        margin: '0',
        padding: '0',
      },
      // Skip elements that can't be serialized (iframes, live
      // mapbox-gl canvases). The caller is expected to wrap stable
      // DOM only, but belt-and-braces.
      filter: (el) => {
        if (el instanceof HTMLIFrameElement) return false;
        if ((el as HTMLElement).classList?.contains('shareable-trigger')) return false;
        if ((el as HTMLElement).classList?.contains('shareable-modal')) return false;
        return true;
      },
    });
    const blob = await dataUrlToBlob(dataUrl);
    return { blob, dataUrl };
  } finally {
    document.body.removeChild(wrapper);
  }
}

function makeFooter(attribution?: string): HTMLElement {
  const footer = document.createElement('div');
  footer.style.cssText = `
    width: 100%;
    padding: 2.25rem 2.5rem 2.5rem;
    margin-top: 2rem;
    border-top: 1px solid rgba(247, 226, 107, 0.25);
    background: linear-gradient(180deg, #0b0d12 0%, #0e1118 100%);
    color: #e6e7ea;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  `;

  const ornament = document.createElement('div');
  ornament.textContent = '✦';
  ornament.style.cssText = `
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.6rem;
    color: #f7e26b;
    opacity: 0.85;
    line-height: 1;
    margin-bottom: 0.2rem;
  `;

  const url = document.createElement('div');
  url.textContent = 'fostercrisis.com';
  url.style.cssText = `
    font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace;
    font-size: 0.88rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #f7e26b;
    font-weight: 600;
  `;

  const tagline = document.createElement('div');
  tagline.textContent = '329,000 children in foster care tonight.';
  tagline.style.cssText = `
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-size: 1.05rem;
    color: #9aa0aa;
    margin-top: 0.25rem;
  `;

  footer.appendChild(ornament);
  footer.appendChild(url);
  footer.appendChild(tagline);

  if (attribution) {
    const attr = document.createElement('div');
    attr.textContent = attribution;
    attr.style.cssText = `
      font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace;
      font-size: 0.65rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #6b7280;
      margin-top: 0.5rem;
    `;
    footer.appendChild(attr);
  }

  return footer;
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return await res.blob();
}

/** Trigger a browser download of a PNG blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Copy a PNG blob to the clipboard if the browser supports it. */
export async function copyBlobToClipboard(blob: Blob): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.write) {
    return false;
  }
  try {
    const ClipboardItemCtor = (window as any).ClipboardItem;
    if (!ClipboardItemCtor) return false;
    await navigator.clipboard.write([new ClipboardItemCtor({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
}

/** Fire the browser's native share sheet with the PNG file attached.
 *  Returns false if the browser doesn't support File sharing or if the
 *  user cancelled. */
export async function shareNative(
  blob: Blob,
  title: string,
  url: string
): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) return false;
  try {
    const file = new File([blob], 'foster-crisis-share.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title, url });
      return true;
    }
    // Fall back to text-only share.
    await navigator.share({ title, url });
    return true;
  } catch {
    return false;
  }
}
