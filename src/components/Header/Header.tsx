import styles from './Header.module.css';

interface Props {
  searchQuery: string;
  onSearch: (query: string) => void;
  resultsCount: number | null;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Header({ searchQuery, onSearch, resultsCount, isDark, onToggleTheme }: Props) {
  const countLabel =
    resultsCount === null ? '' : `${resultsCount} result${resultsCount !== 1 ? 's' : ''}`;

  return (
    <header className={styles.header}>
      <div>
        <div className={styles.logo}>SDLC <span>REF</span></div>
        <div className={styles.tagline}>Software Development Lifecycle · Developer Reference</div>
      </div>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search any term, abbreviation..."
          autoComplete="off"
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className={styles.resultsCount}>{countLabel}</div>
      <button
        className={`${styles.themeToggle} ${isDark ? styles.dark : styles.light}`}
        onClick={onToggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className={styles.toggleTrack}>
          <span className={styles.toggleThumb} />
        </span>
        {isDark ? '☾' : '☀'}
      </button>
    </header>
  );
}
