import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { drawStroke } from '../../motion/presets';
import { useElementSize } from './useElementSize';

/**
 * Přeškrtnutí tahem ruky: začne vlevo níž, skončí vpravo výš, lehce prohnuté
 * a s přesahem přes okraje. Kreslí se přes `stroke-dashoffset` (Motion `pathLength`).
 * SVG má viewBox v px prvku, takže tloušťka i kulaté konce se nedeformují.
 */
export function Strike({
  drawn,
  children,
  className = '',
}: {
  drawn: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [ref, { width: w, height: h }] = useElementSize<HTMLSpanElement>();
  const d =
    `M ${-0.04 * w} ${0.64 * h} ` +
    `C ${0.28 * w} ${0.6 * h}, ${0.62 * w} ${0.5 * h}, ${1.05 * w} ${0.36 * h}`;

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      {w > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
        >
          <motion.path
            d={d}
            fill="none"
            className="stroke-red"
            strokeWidth={Math.max(6, h * 0.075)}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
            transition={drawStroke}
          />
        </svg>
      )}
    </span>
  );
}
