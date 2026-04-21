import { useCallback, useEffect, useState } from 'react';
import { CHAPTERS } from './data/chapters';
import { CrisisMap } from './components/CrisisMap';
import { ChapterPanel } from './components/ChapterPanel';
import { StateTooltip } from './components/StateTooltip';
import type { GeoBundle } from './data/geo';

export default function App() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [hoveredFips, setHoveredFips] = useState<string | null>(null);
  const [bundle, setBundle] = useState<GeoBundle | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setChapterIndex((i) => Math.min(CHAPTERS.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setChapterIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onHoverState = useCallback((fips: string | null) => {
    setHoveredFips(fips);
  }, []);

  const chapter = CHAPTERS[chapterIndex];
  const countyChapter = chapter.geography === 'county';
  const seedNotice = countyChapter &&
    ((chapter.countyProp === 'poverty' && bundle && !bundle.hasCountyPoverty) ||
     (chapter.countyProp === 'overdose' && bundle && !bundle.hasCountyOverdose));

  return (
    <div className="app">
      <CrisisMap
        chapterIndex={chapterIndex}
        onHoverState={onHoverState}
        onBundleReady={setBundle}
      />
      <ChapterPanel index={chapterIndex} onChange={setChapterIndex} />
      <StateTooltip fips={hoveredFips} chapterIndex={chapterIndex} />

      {seedNotice && (
        <div className="banner" role="note">
          <strong>Showing state-level seed data.</strong>
          <span>
            Run <code>npm run data:{chapter.countyProp === 'poverty' ? 'saipe' : 'cdc'}</code>
            {' '}for real county-level values.
          </span>
        </div>
      )}

      {bundle && chapter.showChurches && !bundle.realChurches && (
        <div className="banner" role="note">
          <strong>Using synthetic church dots.</strong>
          <span>
            Run <code>npm run data:churches</code> to pull ~356k real HIFLD /
            OSM points.
          </span>
        </div>
      )}

      <footer className="footer">
        <span>
          380,000 congregations × 1 family = 380,000 homes.  The waitlist is
          70,418. You would end it five times over.
        </span>
      </footer>
    </div>
  );
}
