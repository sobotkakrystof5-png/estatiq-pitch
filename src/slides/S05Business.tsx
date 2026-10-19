// S5 · Proč platí · tma. B2B nahoře, B2C níže a vpravo.
import { motion } from 'motion/react';
import { Strike, Word } from '../design/primitives';
import { stepReveal } from '../motion/presets';
import { s5, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

const { screen } = s5;

export function S05Business({ step }: SlideProps) {
  return (
    <div className="absolute inset-0 text-fg">
      <motion.div
        className="absolute"
        style={{ left: 145, top: 145 }}
        initial={false}
        animate={{ opacity: step >= 3 ? 0.16 : step >= 2 ? 0.24 : 1 }}
        transition={stepReveal}
      >
        <p className="text-label text-muted">{text(screen.b2bContext)}</p>
        <div
          data-testid="s5-volume"
          aria-label={`${text(screen.b2bVolumeMain)} ${text(screen.b2bVolumeUnit)}`}
          className="mt-14 flex items-baseline gap-5 whitespace-nowrap"
        >
          <span className="text-number">{text(screen.b2bVolumeMain)}</span>
          <span className="text-word">{text(screen.b2bVolumeUnit)}</span>
        </div>
        <p className="mt-5 text-label text-muted">{text(screen.rentLabel)}</p>
      </motion.div>

      <motion.div
        className="absolute"
        style={{ left: 145, top: 595 }}
        initial={false}
        animate={{ opacity: step >= 3 ? 0.16 : step >= 2 ? 0.5 : 1 }}
        transition={stepReveal}
      >
        <Word state={step >= 1 ? 'lit' : 'hidden'} className="text-word">
          {text(screen.b2bPrice)}
        </Word>
      </motion.div>

      <div className="absolute" style={{ left: 145, top: 720 }}>
        <Word
          state={step >= 3 ? 'dim' : step >= 2 ? 'lit' : 'hidden'}
          accent
          className="text-hero"
          dimTo={0.16}
        >
          {text(screen.b2bRatio)}
        </Word>
      </div>

      <motion.div
        className="absolute"
        style={{ left: 1120, top: 585 }}
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 20 }}
        transition={stepReveal}
      >
        <p className="text-label text-muted">{text(screen.b2cContext)}</p>
        <div className="mt-10" data-testid="s5-b2c-fee">
          <Strike drawn={step >= 3} className={`text-word ${step >= 4 ? 'opacity-35' : ''}`}>
            {text(screen.b2cFee)}
          </Strike>
        </div>
        <div className="mt-10">
          <Word state={step >= 4 ? 'lit' : 'hidden'} className="text-word">
            {text(screen.b2cPrice)}
          </Word>
        </div>
      </motion.div>
    </div>
  );
}
