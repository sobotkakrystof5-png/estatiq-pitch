import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { wordReveal } from '../../motion/presets';

export type WordState = 'hidden' | 'dim' | 'lit';

// Ořez je o kus větší než box písma, aby háčky nad verzálkami a ocásky nebyly useknuté.
const SHOWN = 'inset(-0.3em -0.15em -0.3em -0.15em)';
const HIDDEN = 'inset(-0.3em 100% -0.3em -0.15em)';

/**
 * Heslo. Nastoupí zleva doprava ve směru čtení (ne fade + slide-up) a dá se ztlumit.
 * `dimTo` je úroveň ztlumení podle slajdu (S3 25 %, S8 40 %, S6 60 %).
 */
export function Word({
  state,
  children,
  accent = false,
  dimTo = 0.25,
  className = '',
}: {
  state: WordState;
  children: ReactNode;
  accent?: boolean;
  dimTo?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={`inline-block ${accent ? 'text-mint' : ''} ${className}`}
      initial={false}
      animate={state}
      variants={{
        hidden: { clipPath: HIDDEN, opacity: 1 },
        dim: { clipPath: SHOWN, opacity: dimTo },
        lit: { clipPath: SHOWN, opacity: 1 },
      }}
      transition={wordReveal}
    >
      {children}
    </motion.span>
  );
}
