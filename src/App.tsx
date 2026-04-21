import { useCallback, useEffect, useState } from 'react';
import { CHAPTERS } from './data/chapters';
import { CrisisMap } from './components/CrisisMap';
import { ChapterPanel } from './components/ChapterPanel';
import { StateTooltip } from './components/StateTooltip';

export default function App() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [hoveredFips, setHoveredFips] = useState<string | null>(null);

  // Keyboard navigation.
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

  return (
    <div className="app">
      <CrisisMap chapterIndex={chapterIndex} onHoverState={onHoverState} />
      <ChapterPanel index={chapterIndex} onChange={setChapterIndex} />
      <StateTooltip fips={hoveredFips} chapterIndex={chapterIndex} />
      <footer className="footer">
        <span>
          380,000 congregations × 1 family = 380,000 homes.  The waitlist is
          70,418. You would end it five times over.
        </span>
      </footer>
    </div>
  );
}
