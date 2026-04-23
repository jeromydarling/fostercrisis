import { toPng } from 'html-to-image';

/** Configuration for a single capture. */
export interface CaptureOptions {
  /** The DOM node to capture — usually the outer Shareable div. */
  node: HTMLElement;
  /** Short attribution label rendered above the URL in the footer. */
  attribution?: string;
  /** Device-pixel multiplier. Defaults to 2 for retina-crisp output. */
  pixelRatio?: number;
}

/** Capture a PNG of the given DOM node with a branded
 *  fostercrisis.com footer appended beneath the block.
 *
 *  Approach: html-to-image captures the live DOM node (filtering out
 *  the Shareable's own chrome) → we load the result as an Image → we
 *  paint it onto a larger canvas and draw the branded footer directly
 *  using the Canvas 2D text API. This avoids every fragile aspect of
 *  cloning elements into off-screen wrappers (broken layout context,
 *  missing computed styles, off-screen rendering optimizations).
 */
export async function captureShare(
  opts: CaptureOptions
): Promise<{ blob: Blob; dataUrl: string }> {
  const { node, attribution, pixelRatio: requestedPr = 1.5 } = opts;

  // Make sure web fonts have loaded before html-to-image serializes
  // computed styles; otherwise the PNG falls back to system fonts.
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* non-fatal */
    }
  }

  // Use scrollWidth/scrollHeight so content that overflows the element's
  // padded box (long word-wrapped paragraphs, italic descenders, etc.)
  // still makes it into the capture. offsetHeight sometimes under-
  // reports when line-height + descenders push past the content box.
  const rawW = Math.max(node.offsetWidth, node.scrollWidth);
  const rawH = Math.max(node.offsetHeight, node.scrollHeight);

  // Mobile browsers cap canvas dimensions around 4096 × 4096 (some older
  // devices lower). Given our footer reserve, scale the pixel ratio
  // down until BOTH capture and final canvas stay safely under 3800.
  const MAX_CANVAS_DIM = 3800;
  const FOOTER_RAW_H = 170;
  const maxRaw = Math.max(rawW, rawH + FOOTER_RAW_H);
  const pixelRatio = Math.min(requestedPr, Math.max(1, MAX_CANVAS_DIM / maxRaw));

  // Capture the live node. We pass width/height explicitly so html-to-
  // image doesn't trust a stale or partial bounding box. The filter
  // keeps our own UI out of the image.
  const contentDataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio,
    width: rawW,
    height: rawH,
    backgroundColor: '#0b0d12',
    filter: (el) => {
      if (el instanceof HTMLIFrameElement) return false;
      const cls = (el as HTMLElement).classList;
      if (!cls) return true;
      if (cls.contains('shareable-trigger')) return false;
      if (cls.contains('shareable-modal')) return false;
      return true;
    },
  });

  const contentImage = await loadImage(contentDataUrl);
  const contentW = contentImage.naturalWidth || contentImage.width;
  const contentH = contentImage.naturalHeight || contentImage.height;

  // Footer height is proportional to the pixel ratio so the branded
  // band looks correct at retina resolution.
  const footerH = Math.round(170 * pixelRatio);
  const canvas = document.createElement('canvas');
  canvas.width = contentW;
  canvas.height = contentH + footerH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Paint the dark background across the whole canvas first so the
  // transition between content and footer is seamless.
  ctx.fillStyle = '#0b0d12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the captured content at native size.
  ctx.drawImage(contentImage, 0, 0, contentW, contentH);

  // Draw a gradient divider between content and footer.
  const divY = contentH;
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, 'rgba(247, 226, 107, 0)');
  grad.addColorStop(0.5, 'rgba(247, 226, 107, 0.35)');
  grad.addColorStop(1, 'rgba(247, 226, 107, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, divY, canvas.width, Math.max(1, pixelRatio));

  // Draw the branded footer text.
  drawFooter(ctx, {
    x: 0,
    y: contentH + Math.round(20 * pixelRatio),
    width: canvas.width,
    pixelRatio,
    attribution,
  });

  const blob = await canvasToBlob(canvas);
  const dataUrl = canvas.toDataURL('image/png');
  return { blob, dataUrl };
}

interface FooterOpts {
  x: number;
  y: number;
  width: number;
  pixelRatio: number;
  attribution?: string;
}

function drawFooter(ctx: CanvasRenderingContext2D, o: FooterOpts): void {
  const { x, y, width, pixelRatio: pr, attribution } = o;
  const cx = x + width / 2;
  let cy = y + Math.round(8 * pr);

  // Gold ornament (✦) — generous size, soft glow via text-shadow via
  // shadowBlur on canvas.
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f7e26b';
  ctx.shadowColor = 'rgba(247, 226, 107, 0.45)';
  ctx.shadowBlur = 16 * pr;
  ctx.font = `${Math.round(28 * pr)}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillText('✦', cx, cy);
  ctx.restore();
  cy += Math.round(38 * pr);

  // URL — spaced mono, accent yellow, bold.
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f7e26b';
  ctx.font = `700 ${Math.round(18 * pr)}px "JetBrains Mono", ui-monospace, monospace`;
  ctx.fillText(applyLetterSpacing('FOSTERCRISIS.COM', 4 * pr), cx, cy);
  ctx.restore();
  cy += Math.round(32 * pr);

  // Tagline — italic serif, muted.
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#9aa0aa';
  ctx.font = `italic ${Math.round(18 * pr)}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillText('329,000 children in foster care tonight.', cx, cy);
  ctx.restore();
  cy += Math.round(30 * pr);

  // Optional attribution — tiny mono, dimmest. No letter-spacing here
  // (the URL above carries the badge look; letter-spacing doubles the
  // string width and clips on narrow captures). Auto-shrinks the font
  // until the line fits, then ellipsizes if it still overflows.
  if (attribution) {
    const sidePadding = Math.round(24 * pr);
    const safeWidth = Math.max(100, width - sidePadding * 2);
    fitAndDrawText(ctx, {
      text: attribution.toUpperCase(),
      x: cx,
      y: cy,
      maxWidth: safeWidth,
      fill: '#6b7280',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      startSizePx: 11,
      minSizePx: 8,
      pr,
    });
  }
}

interface FitTextOpts {
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  fill: string;
  fontFamily: string;
  fontStyle?: string;
  fontWeight?: string;
  startSizePx: number;
  minSizePx: number;
  pr: number;
}

/** Draw a single-line piece of center-aligned text, shrinking the font
 *  size until it fits within `maxWidth`, and ellipsizing if it still
 *  doesn't fit at the minimum size. */
function fitAndDrawText(ctx: CanvasRenderingContext2D, o: FitTextOpts): void {
  const { text, x, y, maxWidth, fill, fontFamily, fontStyle, fontWeight, pr } = o;
  let size = o.startSizePx;
  let rendered = text;
  const applyFont = () => {
    const parts = [fontStyle, fontWeight, `${Math.round(size * pr)}px`, fontFamily];
    ctx.font = parts.filter(Boolean).join(' ');
  };
  applyFont();
  while (ctx.measureText(rendered).width > maxWidth && size > o.minSizePx) {
    size -= 0.5;
    applyFont();
  }
  if (ctx.measureText(rendered).width > maxWidth) {
    while (rendered.length > 1 && ctx.measureText(rendered + '…').width > maxWidth) {
      rendered = rendered.slice(0, -1);
    }
    rendered = rendered + '…';
  }
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = fill;
  ctx.fillText(rendered, x, y);
  ctx.restore();
}

/** Canvas has no letter-spacing API, so we manually space the
 *  characters. Returns a string with zero-width spaces? No — simpler:
 *  we insert a thin space character proportional to the desired gap. */
function applyLetterSpacing(text: string, _px: number): string {
  // Thin space (U+2009) gives a small uniform gap that renders
  // consistently across fonts. If we need larger spacing, use hair
  // space (U+200A) which is narrower. For our two uses (URL and
  // attribution), a single thin space between characters matches the
  // ~0.22em letter-spacing we use in CSS.
  return text.split('').join(' ');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image failed to load'));
    img.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Canvas.toBlob returned null'));
    }, 'image/png');
  });
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
