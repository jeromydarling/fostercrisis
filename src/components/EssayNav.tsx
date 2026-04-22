import { useEffect, useState } from 'react';

interface Part {
  id: string;
  roman: string;
  label: string;
}

const PARTS: Part[] = [
  { id: 'mirror',       roman: 'II',  label: 'The Mirror' },
  { id: 'cradle',       roman: 'III', label: 'The Empty Cradle' },
  { id: 'convergence',  roman: 'IV',  label: 'The Convergence' },
  { id: 'timeline',     roman: 'V',   label: 'Master Timeline' },
  { id: 'substitution', roman: 'VI',  label: 'The Substitution' },
];

/** Sticky secondary nav rail under the main header on the essay view.
 *  Uses IntersectionObserver to auto-highlight whichever section
 *  occupies the most viewport space. */
export function EssayNav() {
  const [activeId, setActiveId] = useState<string>(PARTS[0].id);

  useEffect(() => {
    const targets = PARTS.map((p) => document.getElementById(p.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!targets.length) return;

    // Track each section's intersection ratio and pick the one with
    // the highest ratio (i.e. most of it is in view). A simple
    // rootMargin trims off the top for the sticky header.
    const ratios = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.intersectionRatio);
        let best: { id: string; r: number } | null = null;
        for (const [id, r] of ratios) {
          if (!best || r > best.r) best = { id, r };
        }
        if (best && best.r > 0) setActiveId(best.id);
      },
      {
        rootMargin: '-90px 0px -40% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );
    for (const t of targets) obs.observe(t);
    return () => obs.disconnect();
  }, []);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    // Offset by the sticky headers so the section title lands cleanly
    // below them rather than being clipped.
    const offset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav className="essay-nav" aria-label="Essay sections">
      <div className="essay-nav-inner">
        <span className="essay-nav-label">PARTS</span>
        <ul role="list">
          {PARTS.map((p) => (
            <li key={p.id}>
              <a
                href={`#essay/${p.id}`}
                onClick={jump(p.id)}
                className={'essay-nav-link' + (activeId === p.id ? ' is-active' : '')}
                aria-current={activeId === p.id ? 'location' : undefined}
              >
                <span className="essay-nav-roman">{p.roman}</span>
                <span className="essay-nav-title">{p.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
