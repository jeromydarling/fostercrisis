import { useCallback, useEffect, useState } from 'react';
import { Landing } from './components/Landing';
import { ModeSwitcher, type Mode } from './components/ModeSwitcher';
import { MapExperience } from './components/MapExperience';
import { EssayExperience } from './components/EssayExperience';
import { SolutionExperience } from './components/SolutionExperience';
import { FeedExperience } from './components/FeedExperience';
import { ClosingEpigraph } from './components/ClosingEpigraph';
import { FinalBenediction } from './components/FinalBenediction';

/** Hash router:
 *    (no hash, or #)   → Landing (epigraph + choose)
 *    #map              → Map experience
 *    #essay            → Essay experience
 *    #feed / #stories  → Stories & News experience
 *    #solution         → Solution + state directory
 *  Everything else falls through to Landing.
 */
function parseMode(): Mode {
  const h = (typeof window === 'undefined' ? '' : window.location.hash)
    .replace(/^#\/?/, '')
    .split(/[/?]/)[0]
    .toLowerCase();
  if (h === 'map') return 'map';
  if (h === 'essay') return 'essay';
  if (h === 'feed' || h === 'stories' || h === 'news') return 'feed';
  if (h === 'solution') return 'solution';
  return 'landing';
}

export default function App() {
  const [mode, setModeState] = useState<Mode>(() => parseMode());

  // Cross-mode state: whichever state the visitor drilled into on the
  // Map survives a mode switch, so the Solution/Kids-Waiting directory
  // opens focused on the same place.
  const [selectedFips, setSelectedFips] = useState<string | null>(null);

  // Keep mode in sync with the URL hash.
  useEffect(() => {
    const sync = () => setModeState(parseMode());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const setMode = useCallback((m: Mode) => {
    if (m === 'landing') {
      history.pushState(null, '', window.location.pathname + window.location.search);
    } else {
      history.pushState(null, '', '#' + m);
    }
    setModeState(m);
    // Scroll to top on mode change so each experience starts clean.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="app">
      {mode !== 'landing' && <ModeSwitcher mode={mode} onChange={setMode} />}

      <main className={`mode-view mode-${mode}`}>
        {mode === 'landing' && <Landing onChoose={setMode} />}
        {mode === 'map' && (
          <MapExperience
            selectedFips={selectedFips}
            onSelectedFipsChange={setSelectedFips}
          />
        )}
        {mode === 'essay' && <EssayExperience />}
        {mode === 'feed' && <FeedExperience />}
        {mode === 'solution' && <SolutionExperience selectedFips={selectedFips} />}
      </main>

      {mode !== 'landing' && (
        <>
          <ClosingEpigraph />
          <FinalBenediction />
          <footer className="page-footer">
            <p>
              <strong>fostercrisis.com</strong> — a map, an indictment, and a
              directory. Every essay section carries its own
              <em> Sources</em> drawer; every map chapter names its
              source inline. Nothing on this site is unsourced. Feeds
              embed from the originating organizations; we never
              re-host children's videos or images.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
