import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { countUp } from '../../motion/presets';
import type { DeckMode } from '../../deck/types';

// cs-CZ odděluje tisíce nezlomitelnou mezerou.
const format = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 });

/**
 * Tabulková číslice `from` → `to`, když je `active`. Nahoru se počítá s `ease.out`,
 * dolů (zpětný krok) a v `mode: 'instant'` skočí rovnou na cíl.
 */
export function Counter({
  to,
  from = 0,
  active,
  mode,
  className = '',
}: {
  to: number;
  from?: number;
  active: boolean;
  mode: DeckMode;
  className?: string;
}) {
  const value = useMotionValue(active ? to : from);
  const text = useTransform(value, (v) => format.format(Math.round(v)));

  useEffect(() => {
    const target = active ? to : from;
    if (mode === 'instant' || target < value.get()) {
      value.jump(target);
      return;
    }
    const controls = animate(value, target, countUp);
    return () => controls.stop();
  }, [active, to, from, mode, value]);

  return <motion.span className={`inline-block tabular-nums ${className}`}>{text}</motion.span>;
}
