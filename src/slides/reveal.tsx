// Společné jádro kreslených obrazovek na S4 (Funkce, Komunikace): položka přejde z `hidden` do `shown` `at` sekund
// po vstupu do kroku. Stav se odvozuje z kroku (`on`), ne z časovačů; mimo krok a v instantním režimu skočí hned.
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import { motion, type TargetAndTransition } from 'motion/react';
import { features, instant } from '../motion/presets';

export type Phase = { on: boolean; animated: boolean };
export const PhaseContext = createContext<Phase>({ on: true, animated: false });

export type Pose = { hidden: TargetAndTransition; shown: TargetAndTransition };
export const wipe: Pose = {
  hidden: { clipPath: features.wipeFrom },
  shown: { clipPath: features.wipeTo },
};
export const fade: Pose = { hidden: { opacity: 0 }, shown: { opacity: 1 } };
export const pop: Pose = { hidden: { opacity: 0, scale: 0.6 }, shown: { opacity: 1, scale: 1 } };
export const growY: Pose = { hidden: { scaleY: 0 }, shown: { scaleY: 1 } };
export const growX: Pose = { hidden: { scaleX: 0 }, shown: { scaleX: 1 } };
export const slideIn: Pose = {
  hidden: { opacity: 0, x: features.offerX },
  shown: { opacity: 1, x: 0 },
};
export const knob: Pose = { hidden: { x: 0 }, shown: { x: features.knobX } };

/** Položka dlaždice: do `shown` přejde `at` sekund po vstupu do kroku, mimo krok se hned vrátí do `hidden`. */
export function Reveal({
  at,
  pose,
  bar = false,
  className,
  style,
  children,
}: {
  at: number;
  pose: Pose;
  bar?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const { on, animated } = useContext(PhaseContext);
  return (
    <motion.div
      className={className}
      style={style}
      initial={false}
      animate={on ? pose.shown : pose.hidden}
      transition={on && animated ? { ...(bar ? features.bar : features.item), delay: at } : instant}
    >
      {children}
    </motion.div>
  );
}
