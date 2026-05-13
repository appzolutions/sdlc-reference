import type { Term } from '../../data/sdlcData';
import styles from './TermCard.module.css';

interface Props {
  term: Term;
  color: string;
  query: string;
  phaseBadge?: string;
  phaseColor?: string;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <mark key={i} className={styles.highlight}>{part}</mark>
          : part ? <span key={i}>{part}</span> : null
      )}
    </>
  );
}

export default function TermCard({ term, color, query, phaseBadge, phaseColor }: Props) {
  return (
    <div
      className={styles.card}
      style={{ '--phase-color': color } as React.CSSProperties}
    >
      {phaseBadge && (
        <div className={styles.phaseBadge} style={{ color: phaseColor }}>
          {phaseBadge}
        </div>
      )}
      <div className={styles.top}>
        <div className={styles.name}>
          <Highlight text={term.term} query={query} />
        </div>
        {term.abbreviation && (
          <div className={styles.abbr}>
            <Highlight text={term.abbreviation} query={query} />
          </div>
        )}
      </div>
      <div className={styles.def}>
        <Highlight text={term.definition} query={query} />
      </div>
      {term.example && (
        <div className={styles.example}>
          <Highlight text={term.example} query={query} />
        </div>
      )}
      {term.tags.length > 0 && (
        <div className={styles.tags}>
          {term.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
