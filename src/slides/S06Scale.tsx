// S6 · Škálovatelnost · tma. Rozsah se zvětšuje po jedné zastávce.
import { motion } from 'motion/react';
import { Word } from '../design/primitives';
import { stepReveal } from '../motion/presets';
import { s6, s6Config, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

const places = [s6.screen.czechia, s6.screen.slovakia, s6.screen.centralEurope] as const;

export function S06Scale({ step }: SlideProps) {
  return (
    <div className="absolute inset-0 text-fg">
      <div className="absolute right-edge left-edge flex items-center justify-between" style={{ top: 486 }}>
        {places.map((place, index) => {
          const activeIndex = Math.min(step, places.length - 1);
          const state = index < activeIndex ? 'dim' : index === activeIndex ? 'lit' : 'hidden';
          return (
            <Word
              key={index}
              state={state}
              dimTo={0.6}
              className="text-word"
            >
              {text(place)}
            </Word>
          );
        })}
      </div>

      {s6Config.showMarketStat && (
        <motion.p
          data-testid="s6-market-stat"
          className="absolute text-label text-muted"
          style={{ left: 120, top: 620 }}
          initial={false}
          animate={{ opacity: step >= 0 ? 1 : 0 }}
          transition={stepReveal}
        >
          {text(s6.screen.marketStat)}
        </motion.p>
      )}

      <motion.div
        data-testid="s6-extension"
        aria-hidden
        className="absolute h-[2px] w-[240px] origin-left bg-line"
        style={{ left: 1800, top: 532 }}
        initial={false}
        animate={{ scaleX: step >= 3 ? 1 : 0 }}
        transition={stepReveal}
      />
    </div>
  );
}
