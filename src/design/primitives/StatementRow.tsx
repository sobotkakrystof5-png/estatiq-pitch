import { motion } from 'motion/react';
import { stepReveal } from '../../motion/presets';

export type StatementRowData = { date: string; vs: string; amount: string; name: string };

const SHOWN = 'inset(0 0% 0 0)';
const HIDDEN = 'inset(0 100% 0 0)';

/**
 * Podpisový motiv: jeden řádek bankovního výpisu, `12.09  VS 2024031  15 000,00  NOVÁK`.
 * Pevné sloupce v `ch`, částka zarovnaná doprava na desetinnou čárku, popisky (datum, „VS“)
 * tlumené, jméno verzálkami s mírným prostrkáním. Na papíře inkoust, na tmě `--fg`.
 * `matched`: přes řádek se zleva přetáhne jeho zelená kopie (barva se neanimuje, jen clip-path).
 */
export function StatementRow({
  date,
  vs,
  amount,
  name,
  tone = 'night',
  matched = false,
  matchDelay = 0,
  className = '',
}: StatementRowData & {
  tone?: 'paper' | 'night';
  matched?: boolean;
  matchDelay?: number;
  className?: string;
}) {
  const cells = (
    <>
      <span className="opacity-55">{date}</span>
      <span>
        <span className="opacity-55">VS</span>
        {' '}
        {vs}
      </span>
      <span className="text-right">{amount}</span>
      <span className="tracking-[0.06em] uppercase">{name}</span>
    </>
  );
  // Sloupce v em, ne v ch: Chrome u fontu s unicode-range počítá ch z náhradní metriky (0,5em).
  // JetBrains Mono má šířku znaku 0,6em: datum 5 znaků, „VS 2024031“ 10, částka 9, mezera 2,5.
  const grid = 'col-start-1 row-start-1 grid grid-cols-[3em_6em_5.4em_auto] gap-x-[1.5em]';

  return (
    <div
      className={`grid font-mono text-row whitespace-nowrap ${tone === 'paper' ? 'text-ink' : 'text-fg'} ${className}`}
    >
      <div className={grid}>{cells}</div>
      <motion.div
        aria-hidden
        className={`${grid} text-green`}
        initial={matched && matchDelay > 0 ? { clipPath: HIDDEN } : false}
        animate={{ clipPath: matched ? SHOWN : HIDDEN }}
        transition={{ ...stepReveal, delay: matched ? matchDelay : 0 }}
      >
        {cells}
      </motion.div>
    </div>
  );
}
