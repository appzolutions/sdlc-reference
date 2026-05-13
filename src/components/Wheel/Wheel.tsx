import { useState, useMemo } from 'react';
import type { Phase } from '../../data/sdlcData';
import styles from './Wheel.module.css';

interface Props {
  data: Phase[];
  activePhase: number | null;
  searching: boolean;
  onSelectPhase: (index: number) => void;
}

export default function Wheel({ data, activePhase, searching, onSelectPhase }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cx = 160, cy = 160, r = 140, innerR = 70;
  const n = data.length;
  const gap = 0.025;

  const segments = useMemo(() => data.map((phase, i) => {
    const startAngle = (i / n) * 2 * Math.PI - Math.PI / 2 + gap;
    const endAngle = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2 - gap;
    const midAngle = (startAngle + endAngle) / 2;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);

    const labelR = (r + innerR) / 2;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);

    const d = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;

    return { phase, i, d, lx, ly };
  }), [data, n]);

  const getOpacity = (i: number) => {
    if (searching) return 0.5;
    if (activePhase === null) return hoveredIndex === i ? 0.9 : 0.7;
    if (i === activePhase) return 1;
    return hoveredIndex === i ? 0.6 : 0.4;
  };

  return (
    <div className={styles.container}>
      <svg className={styles.svg} viewBox="0 0 320 320">
        {segments.map(({ phase, i, d, lx, ly }) => (
          <g
            key={i}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelectPhase(i)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <path
              d={d}
              fill={phase.color}
              opacity={getOpacity(i)}
              style={{ transition: 'opacity 0.2s' }}
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="18"
              pointerEvents="none"
            >
              {phase.icon}
            </text>
          </g>
        ))}
        <circle
          cx={cx}
          cy={cy}
          r={innerR - 4}
          style={{ fill: 'var(--surface)', stroke: 'var(--border)' }}
          strokeWidth="1"
        />
      </svg>
      <div className={styles.center}>
        <div className={styles.centerLabel}>SDLC</div>
        <div className={styles.centerSub}>{data.length} phases</div>
      </div>
    </div>
  );
}
