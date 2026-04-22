import { useCallback, useEffect, useState } from 'react';
import { CHAPTERS } from './data/chapters';
import { CrisisMap } from './components/CrisisMap';
import { ChapterPanel } from './components/ChapterPanel';
import { StateTooltip } from './components/StateTooltip';
import { FeedSection } from './components/FeedSection';
import { MirrorSection } from './components/MirrorSection';
import { EmptyCradleSection } from './components/EmptyCradleSection';
import { ConvergenceSection } from './components/ConvergenceSection';
import { TimelineSection } from './components/TimelineSection';
import { SubstitutionSection } from './components/SubstitutionSection';
import type { GeoBundle } from './data/geo';

export default function App() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [hoveredFips, setHoveredFips] = useState<string | null>(null);
  const [selectedFips, setSelectedFips] = useState<string | null>(null);
  const [bundle, setBundle] = useState<GeoBundle | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedFips) {
        setSelectedFips(null);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setChapterIndex((i) => Math.min(CHAPTERS.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setChapterIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedFips]);

  const onHoverState = useCallback((fips: string | null) => {
    setHoveredFips(fips);
  }, []);

  const onSelectState = useCallback((fips: string | null) => {
    setSelectedFips(fips);
  }, []);

  const clearSelection = useCallback(() => setSelectedFips(null), []);

  const chapter = CHAPTERS[chapterIndex];
  const countyChapter = chapter.geography === 'county';
  const seedNotice = countyChapter && bundle && (
    (chapter.countyProp === 'poverty' && !bundle.hasCountyPoverty) ||
    (chapter.countyProp === 'overdose' && !bundle.hasCountyOverdose) ||
    ((chapter.countyProp === 'misery' || chapter.countyProp === 'complicity') && !bundle.hasFullMisery)
  );
  const seedCmd = (
    chapter.countyProp === 'poverty' ? 'saipe' :
    chapter.countyProp === 'overdose' ? 'cdc' :
    'misery'
  );

  return (
    <div className="app">
      <div className="map-section">
      <CrisisMap
        chapterIndex={chapterIndex}
        selectedFips={selectedFips}
        onHoverState={onHoverState}
        onSelectState={onSelectState}
        onBundleReady={setBundle}
      />
      <ChapterPanel
        index={chapterIndex}
        onChange={setChapterIndex}
        selectedFips={selectedFips}
        onClearSelection={clearSelection}
      />
      {/* Hide the hover tooltip when a state is selected — the sidebar
          already shows that state's detail, so the tooltip becomes redundant. */}
      {!selectedFips && <StateTooltip fips={hoveredFips} chapterIndex={chapterIndex} />}

      {seedNotice && (
        <div className="banner" role="note">
          <strong>Showing seed data.</strong>
          <span>
            Run <code>npm run data:{seedCmd}</code> for the real county values.
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

      <div className="footer">
        <span>
          380,000 congregations × 1 family = 380,000 homes.  The waitlist is
          70,418. You would end it five times over.
        </span>
        <a className="footer-scroll" href="#feeds">
          Scroll for real faces ↓
        </a>
      </div>
      </div>
      <FeedSection selectedFips={selectedFips} />
      <MirrorSection />
      <EmptyCradleSection />
      <ConvergenceSection />
      <TimelineSection />
      <SubstitutionSection />
      <footer className="page-footer">
        <p>
          <strong>fostercrisis.com</strong> — a map, an indictment, and a
          directory. Sources credited in every chapter. Feeds embed from the
          originating organizations; we never re-host children's videos or
          images.
        </p>
      </footer>
    </div>
  );
}
