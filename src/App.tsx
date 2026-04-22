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
import { EpigraphSection } from './components/EpigraphSection';

export default function App() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [hoveredFips, setHoveredFips] = useState<string | null>(null);
  const [selectedFips, setSelectedFips] = useState<string | null>(null);

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

  // Banners telling the viewer to run `npm run ...` were dev-tooling —
  // removed from production. The fallback data still renders; users
  // don't need to know which pipeline stage produced it.

  return (
    <div className="app">
      <EpigraphSection />
      <div className="map-section" id="map">
      <CrisisMap
        chapterIndex={chapterIndex}
        selectedFips={selectedFips}
        onHoverState={onHoverState}
        onSelectState={onSelectState}
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
