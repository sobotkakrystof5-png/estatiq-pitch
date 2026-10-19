// S7 · Ještě jedna věc · černá. AI funkce, ověření, výdaje, řemeslníci, kauce a platby míří do stejného systému.
import { motion } from 'motion/react';
import { FlowLine, Logo, Word } from '../design/primitives';
import { stepReveal } from '../motion/presets';
import { s7, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

export function S07Vision({ step, mode }: SlideProps) {
  const settled = step >= 6;

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

        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 1920 1080"
        >
          <FlowLine d="M 535 205 C 665 215 725 390 830 478" active={step >= 1} mode={mode} />
          <FlowLine d="M 1390 205 C 1260 220 1205 390 1090 478" active={step >= 2} mode={mode} />
          <FlowLine d="M 1385 835 C 1270 805 1195 660 1095 603" active={step >= 3} mode={mode} />
          <FlowLine d="M 960 765 L 960 603" active={step >= 4} mode={mode} />
          <FlowLine d="M 540 840 C 680 800 742 655 830 603" active={step >= 5} mode={mode} />
        </svg>

        <motion.div
          className="absolute left-[120px] top-[165px] w-[530px]"
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0 }}
          transition={stepReveal}
        >
          <Word state={step >= 1 ? 'lit' : 'hidden'} className="max-w-full text-balance text-word">
            {text(s7.screen.ai)}
          </Word>
        </motion.div>
        <motion.div
          className="absolute left-[1270px] top-[165px] w-[530px]"
          initial={false}
          animate={{ opacity: step >= 2 ? 1 : 0 }}
          transition={stepReveal}
        >
          <Word state={step >= 2 ? 'lit' : 'hidden'} className="max-w-full text-balance text-word">
            {text(s7.screen.tenants)}
          </Word>
        </motion.div>
        <motion.div
          className="absolute left-[1400px] top-[790px] w-[400px]"
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0 }}
          transition={stepReveal}
        >
          <Word state={step >= 3 ? 'lit' : 'hidden'} className="max-w-full text-balance text-word">
            {text(s7.screen.expenses)}
          </Word>
          <p className="mt-5 text-label text-muted">{text(s7.screen.expensesDetail)}</p>
        </motion.div>
        <motion.div
          className="absolute left-[730px] top-[790px] w-[460px] text-center"
          initial={false}
          animate={{ opacity: step >= 4 ? 1 : 0 }}
          transition={stepReveal}
        >
          <Word state={step >= 4 ? 'lit' : 'hidden'} className="max-w-full text-balance text-word">
            {text(s7.screen.tradesmen)}
          </Word>
        </motion.div>
        <motion.div
          className="absolute left-[120px] top-[790px] w-[540px]"
          initial={false}
          animate={{ opacity: step >= 5 ? 1 : 0 }}
          transition={stepReveal}
        >
          <Word state={step >= 5 ? 'lit' : 'hidden'} className="max-w-full text-balance text-word">
            {text(s7.screen.payments)}
          </Word>
        </motion.div>

        <motion.div
          className="absolute"
          style={{ left: 760, top: 452, width: 400 }}
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0 }}
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
