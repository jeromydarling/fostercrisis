import React from 'react';

/** Minimal markdown renderer for the content layer. Content blocks live
 *  in `content/<section>/*.md` as pure text files so they can be edited
 *  safely from the GitHub web or mobile app without touching JSX.
 *
 *  Supported syntax:
 *    **bold**         → <strong>
 *    *italic*         → <em>
 *    `code`           → <code>
 *    [text](url)      → <a> (opens in new tab, noreferrer)
 *    blank line       → paragraph break
 *
 *  Deliberately NO heading / list / table / HTML support — when a
 *  content block needs structure beyond paragraphs with inline
 *  emphasis, it belongs in JSX, not in a markdown file. Keep the
 *  editing surface boring and un-break-able.
 */

interface BlockProps {
  children: string;
  className?: string;
}

/** Renders a multi-paragraph block. Blank lines separate paragraphs. */
export function Md({ children, className }: BlockProps) {
  const paragraphs = children
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={className}>
          {renderInline(p)}
        </p>
      ))}
    </>
  );
}

/** Renders an inline markdown string without wrapping in `<p>`. A
 *  single newline inside the string becomes a `<br>` — use it inside
 *  headings, kicker lines, and anywhere the visual cadence of an
 *  intentional hard break matters. Two blank-line-separated blocks
 *  should live in separate content ids, not in one MdInline. */
export function MdInline({ children }: { children: string }) {
  const lines = children.trim().split(/\n/);
  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {renderInline(line)}
        </React.Fragment>
      ))}
    </>
  );
}

/** Parse a content file (e.g. `content/grave.md`) into a record keyed
 *  by block id. Blocks start with `## <id>` on a line by themselves and
 *  extend until the next `## ` or end-of-file.
 *
 *    ## heroTitle
 *    The final section of the *diagnostic*.
 *
 *    ## heroLede
 *    Children who pass through…
 *
 *  The block id must be a bare JS identifier (no spaces). Content
 *  between blocks (e.g. comments after `##` lines) is preserved and
 *  returned trimmed. */
export function parseBlocks(md: string): Record<string, string> {
  const blocks: Record<string, string> = {};
  const re = /^##\s+([a-zA-Z][a-zA-Z0-9_-]*)\s*\n([\s\S]*?)(?=^##\s+[a-zA-Z]|$(?![\r\n]))/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    blocks[m[1]] = m[2].trim();
  }
  return blocks;
}

/** Tokenize a single line of markdown into React nodes. */
function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let rest = text;
  let key = 0;

  // One combined regex covers the four kinds of inline tokens we use.
  // Anchors: **…**  *…*  `…`  [text](url)
  const re =
    /(\*\*([^*\n]+)\*\*)|(\*([^*\n]+)\*)|(`([^`\n]+)`)|(\[([^\]\n]+)\]\(([^)\n]+)\))/;

  while (rest.length > 0) {
    const m = rest.match(re);
    if (!m) {
      out.push(rest);
      break;
    }
    if (m.index && m.index > 0) {
      out.push(rest.slice(0, m.index));
    }
    if (m[1]) {
      out.push(<strong key={key++}>{m[2]}</strong>);
    } else if (m[3]) {
      out.push(<em key={key++}>{m[4]}</em>);
    } else if (m[5]) {
      out.push(<code key={key++}>{m[6]}</code>);
    } else if (m[7]) {
      out.push(
        <a
          key={key++}
          href={m[9]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {m[8]}
        </a>
      );
    }
    rest = rest.slice((m.index ?? 0) + m[0].length);
  }

  return out;
}
