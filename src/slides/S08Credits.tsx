// S8 · Model kreditů a odlišení · tma. Zůstatek ukazuje uživatelskou platbu, ne tržbu platformy.
import { motion } from 'motion/react';
import { Glyph, Word } from '../design/primitives';
import { creditMove, stepReveal } from '../motion/presets';
import { s8, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

const { screen } = s8;
const revenue = [screen.affiliate, screen.ads, screen.promoted, screen.brokerage, screen.aiCredits, screen.commission];
const edge = [screen.edgeEnergy, screen.edgeMarketplace, screen.edgeHistory, screen.edgeCredits, screen.edgeChat];

export function S08Credits({ step }: SlideProps) {
  const compare = step >= 4;
  const balance = step === 0 ? screen.topupCredits : step === 1 ? screen.afterRepair : screen.balance;

  return (
    <div className="absolute inset-0 overflow-hidden text-fg">
      <motion.div
        data-testid="s8-credit-model"
        aria-hidden={compare}
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: compare ? 0 : 1, y: compare ? -creditMove.phaseY : 0 }}
        transition={stepReveal}
      >
        <div className="absolute left-edge top-[115px] w-[885px]">
          <p className="text-label text-muted">{text(screen.caveat)}</p>
          <div className="mt-14">
            <p className="text-label text-muted">{text(screen.topupLabel)}</p>
            <p className="mt-2 text-hero">{text(screen.topupMoney)}</p>
          </div>
          <div className="mt-8 flex items-center gap-7 border-b border-line pb-11">
            <Glyph name="arrow" className="h-[62px] w-[74px] text-mint" />
            <div>
              <p className="text-word">{text(screen.topupCredits)}</p>
              <p className="mt-2 text-label text-muted">{text(screen.rate)}</p>
            </div>
          </div>
          <div className="mt-7 space-y-3 font-mono text-row">
            <motion.div
              className="flex justify-between gap-8"
              initial={false}
              animate={{ opacity: step >= 1 ? 1 : 0, x: step >= 1 ? 0 : creditMove.entryX }}
              transition={stepReveal}
            >
              <span>{text(screen.repairLabel)}</span>
              <span className="text-muted">{text(screen.repairDebit)}</span>
            </motion.div>
            <motion.div
              className="flex justify-between gap-8"
              initial={false}
              animate={{ opacity: step >= 2 ? 1 : 0, x: step >= 2 ? 0 : creditMove.entryX }}
              transition={stepReveal}
            >
              <span>{text(screen.contractLabel)}</span>
              <span className="text-muted">{text(screen.contractDebit)}</span>
            </motion.div>
          </div>
          <div className="mt-9 flex items-baseline justify-between border-t border-line pt-6">
            <p className="text-label text-muted">{text(screen.balanceLabel)}</p>
            <p data-testid="s8-balance" className="text-word text-mint">{text(balance)}</p>
          </div>
        </div>

        <div className="absolute bottom-[135px] left-[1080px] top-[182px] w-px bg-line" />
        <motion.div
          data-testid="s8-revenue"
          className="absolute left-[1155px] top-[190px] w-[650px]"
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0, x: step >= 3 ? 0 : creditMove.entryX }}
          transition={stepReveal}
        >
          <p className="text-label text-muted">{text(screen.revenueLabel)}</p>
          <div className="mt-12 flex flex-col gap-7">
            {revenue.map((item, index) => (
              <Word key={index} state={step >= 3 ? 'lit' : 'hidden'} className="text-[52px] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
                {text(item)}
              </Word>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        data-testid="s8-comparison"
        aria-hidden={!compare}
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: compare ? 1 : 0, y: compare ? 0 : creditMove.phaseY }}
        transition={stepReveal}
      >
        <div className="absolute bottom-[145px] left-1/2 top-[155px] w-px bg-line" />
        <div className="absolute left-edge top-[240px] w-[720px]">
          <p className="text-label text-muted">{text(screen.marketLabel)}</p>
          <p className="mt-16 text-word leading-[1.3] text-muted">{text(screen.marketBaseline)}</p>
        </div>
        <div className="absolute left-[1070px] top-[240px] w-[735px]">
          <p className="text-label text-mint">{text(screen.edgeLabel)}</p>
          <div className="mt-14 flex flex-col gap-8">
            {edge.map((item, index) => (
              <Word key={index} state={compare ? 'lit' : 'hidden'} className="text-[68px] font-medium leading-[1.2] tracking-[-0.03em]">
                {text(item)}
              </Word>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
