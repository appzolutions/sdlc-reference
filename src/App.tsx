import { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header/Header';
import Wheel from './components/Wheel/Wheel';
import PhaseLegend from './components/PhaseLegend/PhaseLegend';
import ContentPanel from './components/ContentPanel/ContentPanel';
import { SDLC_DATA, type Phase, type Term } from './data/sdlcData';
import styles from './App.module.css';

export interface SearchResult {
  phase: Phase;
  term: Term;
}

export default function App() {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleToggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const handleSelectPhase = useCallback((index: number) => {
    setActivePhase(index);
    setSearchQuery('');
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const searchResults = useMemo<SearchResult[] | null>(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    const results: SearchResult[] = [];
    SDLC_DATA.forEach(phase => {
      phase.terms.forEach(term => {
        const haystack = `${term.term} ${term.abbreviation ?? ''} ${term.definition} ${term.example ?? ''} ${term.tags.join(' ')}`.toLowerCase();
        if (haystack.includes(q)) results.push({ phase, term });
      });
    });
    return results;
  }, [searchQuery]);

  const isSearching = searchResults !== null;

  return (
    <div className={styles.app}>
      <Header
        searchQuery={searchQuery}
        onSearch={handleSearch}
        resultsCount={searchResults?.length ?? null}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />
      <div className={styles.main}>
        <div className={styles.wheelPanel}>
          <div className={styles.wheelTitle}>Click a phase to explore</div>
          <Wheel
            data={SDLC_DATA}
            activePhase={isSearching ? null : activePhase}
            searching={isSearching}
            onSelectPhase={handleSelectPhase}
          />
          <PhaseLegend
            data={SDLC_DATA}
            activePhase={isSearching ? null : activePhase}
            onSelectPhase={handleSelectPhase}
          />
        </div>
        <ContentPanel
          data={SDLC_DATA}
          activePhase={activePhase}
          searchQuery={searchQuery}
          searchResults={searchResults}
          onSelectPhase={handleSelectPhase}
        />
      </div>
    </div>
  );
}
