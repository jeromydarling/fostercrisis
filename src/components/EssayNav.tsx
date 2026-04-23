import { useEffect, useRef, useState } from 'react';

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
  { id: 'pipeline',     roman: 'VII', label: 'The Pipeline' },
  { id: 'wound',        roman: 'VIII', label: 'The Wound' },
  { id: 'score',        roman: 'IX', label: 'The Score' },
  { id: 'receipt',      roman: 'X',   label: 'The Receipt' },
];

/** Sticky secondary nav rail under the main header on the essay view.
 *  Desktop: horizontal pill rail with all eight parts visible at once.
 *  Mobile: an elegant dropdown (current-part pill with chevron) so the
 *  viewport isn't cluttered by a cropped horizontal scroller. Both
 *  modes track the active section via IntersectionObserver. */
export function EssayNav() {
  const [activeId, setActiveId] = useState<string>(PARTS[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  // Track each section's intersection ratio and pick the one with
  // the highest ratio (i.e. most of it is in view).
  useEffect(() => {
    const targets = PARTS.map((p) => document.getElementById(p.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!targets.length) return;

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

  // Close the mobile menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Offset by the sticky headers so the section title lands cleanly
    // below them rather than being clipped.
    const offset = 110;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const handleLinkClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    jump(id);
  };

  const handleMenuClick = (id: string) => () => {
    jump(id);
    setMenuOpen(false);
  };

  const active = PARTS.find((p) => p.id === activeId) ?? PARTS[0];

  return (
    <nav className="essay-nav" aria-label="Essay sections" ref={navRef}>
      <div className="essay-nav-inner">
        <span className="essay-nav-label">PARTS</span>

        {/* Desktop rail — all parts visible as pills */}
        <ul className="essay-nav-list" role="list">
          {PARTS.map((p) => (
            <li key={p.id}>
              <a
                href={`#essay/${p.id}`}
                onClick={handleLinkClick(p.id)}
                className={'essay-nav-link' + (activeId === p.id ? ' is-active' : '')}
                aria-current={activeId === p.id ? 'location' : undefined}
              >
                <span className="essay-nav-roman">{p.roman}</span>
                <span className="essay-nav-title">{p.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile dropdown — elegant single-row trigger + panel */}
        <div className={'essay-nav-mobile' + (menuOpen ? ' is-open' : '')}>
          <button
            type="button"
            className="essay-nav-trigger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
          >
            <span className="essay-nav-roman">{active.roman}</span>
            <span className="essay-nav-title">{active.label}</span>
            <span className="essay-nav-caret" aria-hidden>
              &#9662;
            </span>
          </button>

          <ul
            className="essay-nav-menu"
            role="listbox"
            aria-hidden={!menuOpen}
          >
            {PARTS.map((p) => (
              <li key={p.id} role="option" aria-selected={activeId === p.id}>
                <button
                  type="button"
                  onClick={handleMenuClick(p.id)}
                  className={
                    'essay-nav-menu-item' +
                    (activeId === p.id ? ' is-active' : '')
                  }
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span className="essay-nav-roman">{p.roman}</span>
                  <span className="essay-nav-title">{p.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
