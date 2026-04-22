import { useCallback, useEffect, useState } from 'react';
import { CHAPTERS } from '../data/chapters';
import { CrisisMap } from './CrisisMap';
import { ChapterPanel } from './ChapterPanel';
import { StateTooltip } from './StateTooltip';

/** The Map experience — the cartographic argument. Interactive Mapbox
 *  with the 12 chapters and state drill-down. Faces of real children
 *  live under #solution now. */
export function MapExperience() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [hoveredFips, setHoveredFips] = useState<string | null>(null);
  const [selectedFips, setSelectedFips] = useState<string | null>(null);

  // Keyboard chapter navigation.
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

  return (
    <>
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
        {!selectedFips && <StateTooltip fips={hoveredFips} chapterIndex={chapterIndex} />}

        <div className="footer">
          <span>
            380,000 congregations × ~100 families each. One family per church
            says yes — the waitlist ends 5× over.
          </span>
          <a className="footer-scroll" href="#solution">
            See the faces → The Solution
          </a>
        </div>
      </div>
    </>
  );
}
