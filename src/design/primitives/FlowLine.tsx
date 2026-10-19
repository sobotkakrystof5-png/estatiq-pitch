import { motion } from 'motion/react';
import { drawStroke, flowLoop } from '../../motion/presets';
import type { DeckMode } from '../../deck/types';

/**
 * Linka toku (S7). Vykresluje `<g>`, takže se několik linek skládá do jednoho `<svg>`.
 * Stopa se natáhne tahem, po ní pak dokola teče krátký úsek (`stroke-dashoffset`).
 * Po návratu z `instant` se smyčka spustí znovu (klíč podle `mode`).
 */
export function FlowLine({
  d,
  active,
  mode,
  width = 1.5,
  baseOpacity = 0.18,
}: {
  d: string;
  active: boolean;
  mode: DeckMode;
  width?: number;
  baseOpacity?: number;
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
        transition={drawStroke}
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
          initial={{ strokeDashoffset: 0.12 }}
          animate={{ strokeDashoffset: -0.88 }}
          transition={flowLoop}
        />
      )}
    </g>
  );
}
