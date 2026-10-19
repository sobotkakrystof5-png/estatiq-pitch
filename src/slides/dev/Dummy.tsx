// Testovací slajd pro engine (fáze 2). Žádný design, jen číslo slajdu a kroku.
import { motion } from 'motion/react';
import { stepReveal } from '../../motion/presets';
import type { SlideProps } from '../../deck/types';

export function makeDummy(label: string, steps: number) {
  function Dummy({ step }: SlideProps) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-12 font-mono text-fg">
        <div data-testid="dummy" className="text-[160px] leading-none">
          {label} · {step}/{steps}
        </div>
        <div className="flex gap-6">
          {Array.from({ length: steps }, (_, i) => (
            <motion.div
              key={i}
              data-testid="dummy-step"
              className="size-16 bg-fg"
              initial={false}
              animate={{ opacity: i < step ? 1 : 0.15 }}
              transition={stepReveal}
            />
          ))}
        </div>
      </div>
    );
  }
  Dummy.displayName = `Dummy(${label})`;
  return Dummy;
}
