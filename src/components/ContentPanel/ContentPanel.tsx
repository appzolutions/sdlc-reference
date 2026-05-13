import { useRef, useEffect } from 'react';
import type { Phase } from '../../data/sdlcData';
import type { SearchResult } from '../../App';
import TermCard from '../TermCard/TermCard';
import styles from './ContentPanel.module.css';

interface Props {
  data: Phase[];
  activePhase: number | null;
  searchQuery: string;
  searchResults: SearchResult[] | null;
  onSelectPhase: (index: number) => void;
}

export default function ContentPanel({
  data,
  activePhase,
  searchQuery,
  searchResults,
  onSelectPhase,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isSearching = searchResults !== null;
  const hasSearch = Boolean(searchQuery.trim());

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [activePhase, hasSearch]);

  const renderWelcome = () => (
    <div className={styles.welcome}>
      <div className={styles.welcomeIcon}>⬡</div>
      <h2>Developer Vocabulary Reference</h2>
      <p>Click any phase on the wheel or in the list to explore all related terms, abbreviations, and meeting-ready example sentences.</p>
      <p>Use the search bar to find any term across all phases instantly.</p>
      <div className={styles.welcomeHint}>← Select a phase to begin</div>
    </div>
  );

  const renderPhase = () => {
    if (activePhase === null) return null;
    const phase = data[activePhase];
    return (
      <>
        <div className={styles.phaseHeader}>
          <div
            className={styles.phaseIcon}
            style={{
              background: `${phase.color}22`,
              border: `1px solid ${phase.color}44`,
            }}
          >
            {phase.icon}
          </div>
          <div className={styles.phaseInfo}>
            <div className={styles.phaseName}>{phase.phase}</div>
            <div className={styles.phaseSummary}>{phase.summary}</div>
            <div className={styles.phaseMeta}>
              <span className={styles.metaChip}>{phase.terms.length} terms</span>
              <span
                className={styles.metaChip}
                style={{ color: phase.color, borderColor: `${phase.color}44` }}
              >
                ● Active Phase
              </span>
            </div>
          </div>
        </div>
        {Object.entries(
          phase.terms.reduce<Record<string, typeof phase.terms>>((acc, term) => {
            (acc[term.category] ??= []).push(term);
            return acc;
          }, {})
        ).map(([category, terms]) => (
          <div key={category} className={styles.categorySection}>
            <div className={styles.categoryTitle}>{category}</div>
            <div className={styles.termsGrid}>
              {terms.map((term, i) => (
                <TermCard key={i} term={term} color={phase.color} query="" />
              ))}
            </div>
          </div>
        ))}
        <div className={styles.phaseNav}>
          <button
            className={styles.navBtn}
            disabled={activePhase === 0}
            onClick={() => onSelectPhase(activePhase - 1)}
          >
            ← Previous
          </button>
          <button
            className={styles.navBtn}
            disabled={activePhase === data.length - 1}
            onClick={() => onSelectPhase(activePhase + 1)}
          >
            Next →
          </button>
        </div>
      </>
    );
  };

  const renderSearch = () => {
    if (!searchResults) return null;
    if (searchResults.length === 0) {
      return (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🔍</div>
          <p>No results found for "<strong>{searchQuery}</strong>"</p>
        </div>
      );
    }
    return (
      <>
        <div className={styles.resultsHeader}>
          <h2>Search Results</h2>
          <p>
            {searchResults.length} term{searchResults.length !== 1 ? 's' : ''} found for "{searchQuery}"
          </p>
        </div>
        <div className={styles.termsGrid}>
          {searchResults.map(({ phase, term }, i) => (
            <TermCard
              key={i}
              term={term}
              color={phase.color}
              query={searchQuery.trim().toLowerCase()}
              phaseBadge={`${phase.icon} ${phase.phase}`}
              phaseColor={phase.color}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={styles.panel} ref={panelRef}>
      {isSearching
        ? renderSearch()
        : activePhase !== null
          ? renderPhase()
          : renderWelcome()}
    </div>
  );
}
