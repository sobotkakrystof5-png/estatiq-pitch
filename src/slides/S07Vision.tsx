// S7 · Ještě jedna věc · černá. Tři proudy míří do platební vrstvy.
import { motion } from 'motion/react';
import { FlowLine, Logo, Word } from '../design/primitives';
import { stepReveal } from '../motion/presets';
import { s7, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

export function S07Vision({ step, mode }: SlideProps) {
  const settled = step >= 5;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black text-fg">
      <motion.div
        data-testid="s7-scene"
        aria-hidden={settled}
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: settled ? 0.15 : 1 }}
        transition={stepReveal}
      >
        <div className="absolute inset-x-0 top-[470px] text-center">
          <Word state={step === 0 ? 'lit' : 'hidden'} className="text-word">
            {text(s7.screen.opening)}
          </Word>
        </div>

        <motion.div
          className="absolute text-word"
          style={{ left: '50%', top: '50%' }}
          initial={false}
          animate={{ x: step >= 2 ? -650 : 0, y: step >= 2 ? -390 : 0 }}
          transition={stepReveal}
        >
          <Word state={step >= 1 ? 'lit' : 'hidden'} className="text-word">
            {text(s7.screen.energy)}
          </Word>
        </motion.div>

        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 1920 1080"
        >
          <FlowLine d="M 465 168 C 650 168 650 418 805 500" active={step >= 2} mode={mode} />
          <FlowLine d="M 1760 220 C 1515 250 1305 430 1115 510" active={step >= 3} mode={mode} />
          <FlowLine d="M 680 830 C 720 790 770 650 835 590" active={step >= 4} mode={mode} />
        </svg>

        <motion.div
          className="absolute"
          style={{ left: 960, top: 160 }}
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0 }}
          transition={stepReveal}
        >
          <Word state={step >= 3 ? 'lit' : 'hidden'} className="text-word">
            {text(s7.screen.tenants)}
          </Word>
        </motion.div>

        <motion.div
          className="absolute"
          style={{ left: 120, top: 790 }}
          initial={false}
          animate={{ opacity: step >= 4 ? 1 : 0 }}
          transition={stepReveal}
        >
          <Word state={step >= 4 ? 'lit' : 'hidden'} className="text-word">
            {text(s7.screen.payments)}
          </Word>
        </motion.div>

        <motion.div
          className="absolute"
          style={{ left: 760, top: 452, width: 400 }}
          initial={false}
          animate={{ opacity: step >= 2 ? 1 : 0 }}
          transition={stepReveal}
        >
          <Logo className="h-auto w-full" />
        </motion.div>
      </motion.div>

      <motion.div
        data-testid="s7-final-statement"
        aria-label={`${text(s7.screen.finalLead)} ${text(s7.screen.finalTail)}`}
        className="absolute inset-x-0 top-[452px] z-10 flex items-center justify-center gap-5 whitespace-nowrap bg-black px-5 py-11 text-word"
        initial={false}
        animate={{ opacity: settled ? 1 : 0 }}
        transition={stepReveal}
      >
        <Word state={settled ? 'lit' : 'hidden'} accent className="text-word">
          {text(s7.screen.finalLead)}
        </Word>
        <Word state={settled ? 'lit' : 'hidden'} className="text-word">
          {text(s7.screen.finalTail)}
        </Word>
      </motion.div>
    </div>
  );
}
