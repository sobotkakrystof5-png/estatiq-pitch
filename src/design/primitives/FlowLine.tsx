import { motion } from 'motion/react';
import { drawStroke, dur, flowLoop } from '../../motion/presets';
import type { DeckMode } from '../../deck/types';

/**
 * Linka toku (S4, Integrace). Vykresluje `<g>`, takže se několik linek skládá do jednoho `<svg>`.
 * Stopa se natáhne tahem, po ní pak dokola teče krátký úsek (`stroke-dashoffset`).
 * Po návratu z `instant` se smyčka spustí znovu (klíč podle `mode`).
 */
export function FlowLine({
  d,
  active,
  mode,
  width = 1.5,
  baseOpacity = 0.18,
  delay = 0,
}: {
  d: string;
  active: boolean;
  mode: DeckMode;
  width?: number;
  baseOpacity?: number;
  /** Sekundy do začátku tahu a toku (postupné rozbíhání více linek). */
  delay?: number;
}) {
  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        className="stroke-fg"
        strokeWidth={width}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? baseOpacity : 0 }}
        transition={{
          pathLength: { ...drawStroke.pathLength, delay },
          opacity: { ...drawStroke.opacity, delay },
        }}
      />
      {active && (
        <motion.path
          key={mode}
          d={d}
          fill="none"
          className="stroke-mint"
          strokeWidth={width}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.12 0.88"
          initial={{ strokeDashoffset: 0.12, opacity: 0 }}
          animate={{ strokeDashoffset: -0.88, opacity: 1 }}
          transition={{
            strokeDashoffset: { ...flowLoop, delay: delay + dur.draw },
            opacity: { ...drawStroke.opacity, delay: delay + dur.draw },
          }}
        />
      )}
    </g>
  );
}
