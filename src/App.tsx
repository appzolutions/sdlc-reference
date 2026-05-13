import { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header/Header';
import AIBar from './components/AIBar/AIBar';
import Wheel from './components/Wheel/Wheel';
import PhaseLegend from './components/PhaseLegend/PhaseLegend';
import ContentPanel from './components/ContentPanel/ContentPanel';
import { SDLC_DATA, type Phase, type Term } from './data/sdlcData';
import { generateCustomSdlc } from './services/generateSdlc';
import styles from './App.module.css';

export interface SearchResult {
  phase: Phase;
  term: Term;
}

export default function App() {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const [customData, setCustomData] = useState<Phase[] | null>(() => {
    try {
      const saved = localStorage.getItem('sdlc_custom_data');
      return saved ? (JSON.parse(saved) as Phase[]) : null;
    } catch {
      return null;
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateProgress, setGenerateProgress] = useState(0);

  const activeData = customData ?? SDLC_DATA;

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

  const handleGenerate = useCallback(async (idea: string, apiKey: string) => {
    setIsGenerating(true);
    setGenerateError(null);
    setGenerateProgress(0);
    setActivePhase(null);
    setSearchQuery('');
    try {
      const data = await generateCustomSdlc(idea, apiKey, setGenerateProgress);
      setCustomData(data);
      localStorage.setItem('sdlc_custom_data', JSON.stringify(data));
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : 'Generation failed. Check your API key and try again.',
      );
    } finally {
      setIsGenerating(false);
      setGenerateProgress(0);
    }
  }, []);

  const handleReset = useCallback(() => {
    setCustomData(null);
    localStorage.removeItem('sdlc_custom_data');
    setGenerateError(null);
    setActivePhase(null);
    setSearchQuery('');
  }, []);

  const searchResults = useMemo<SearchResult[] | null>(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    const results: SearchResult[] = [];
    activeData.forEach(phase => {
      phase.terms.forEach(term => {
        const haystack =
          `${term.term} ${term.abbreviation ?? ''} ${term.definition} ${term.example ?? ''} ${term.tags.join(' ')}`.toLowerCase();
        if (haystack.includes(q)) results.push({ phase, term });
      });
    });
    return results;
  }, [searchQuery, activeData]);

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
      <AIBar
        onGenerate={handleGenerate}
        onReset={handleReset}
        isLoading={isGenerating}
        isCustomActive={customData !== null}
        error={generateError}
        progressChars={generateProgress}
      />
      <div className={`${styles.main} ${isGenerating ? styles.generating : ''}`}>
        <div className={styles.wheelPanel}>
          <div className={styles.wheelTitle}>
            {isGenerating ? 'Generating…' : 'Click a phase to explore'}
          </div>
          <Wheel
            data={activeData}
            activePhase={isSearching ? null : activePhase}
            searching={isSearching}
            onSelectPhase={handleSelectPhase}
          />
          <PhaseLegend
            data={activeData}
            activePhase={isSearching ? null : activePhase}
            onSelectPhase={handleSelectPhase}
          />
        </div>
        <ContentPanel
          data={activeData}
          activePhase={activePhase}
          searchQuery={searchQuery}
          searchResults={searchResults}
          onSelectPhase={handleSelectPhase}
        />
      </div>
    </div>
  );
}
