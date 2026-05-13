import type { Phase } from '../../data/sdlcData';
import styles from './PhaseLegend.module.css';

interface Props {
  data: Phase[];
  activePhase: number | null;
  onSelectPhase: (index: number) => void;
}

export default function PhaseLegend({ data, activePhase, onSelectPhase }: Props) {
  return (
    <div className={styles.legend}>
      {data.map((phase, i) => (
        <div
          key={i}
          className={`${styles.item} ${activePhase === i ? styles.active : ''}`}
          onClick={() => onSelectPhase(i)}
        >
          <div className={styles.dot} style={{ background: phase.color }} />
          <div className={styles.num}>{String(i + 1).padStart(2, '0')}</div>
          <div className={styles.name}>{phase.phase}</div>
          <div className={styles.count}>{phase.terms.length}</div>
        </div>
      ))}
    </div>
  );
}
