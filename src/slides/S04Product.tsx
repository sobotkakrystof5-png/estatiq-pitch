// S4 · Produkt · tma. Tři reálné obrazovky zatím zastupují popsané placeholdery.
import { motion } from 'motion/react';
import { LaptopFrame, Placeholder, StatementRow, Word } from '../design/primitives';
import { pairing, spring, stepReveal } from '../motion/presets';
import { s4, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

const { screen, rows, highlights } = s4;
const shots = [
  { key: 'paymentShot', label: screen.paymentWord, alt: screen.paymentShot },
  { key: 'ownerShot', label: screen.ownerWord, alt: screen.ownerShot },
  { key: 'tenantShot', label: screen.tenantWord, alt: screen.tenantShot },
] as const;

function Highlight({
  rect,
}: {
  rect: { x: number; y: number; width: number; height: number };
}) {
  return (
    <div
      aria-hidden
      data-testid="s4-highlight"
      className="absolute border border-mint/40 bg-mint/5"
      style={{ left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.width}%`, height: `${rect.height}%` }}
    />
  );
}

export function S04Product({ step, mode, direction }: SlideProps) {
  const shouldPair = step === 0 && mode === 'normal' && direction === 1;
  const matchedRow = rows.matchedPayment[0]!;

  return (
    <div className="absolute inset-0 text-fg">
      <motion.div
        className="absolute"
        style={{ left: 120, top: 170, width: 1000 }}
        initial={false}
        animate={{ opacity: step < 3 ? 1 : 0 }}
        transition={stepReveal}
      >
        <LaptopFrame>
          <div className="relative h-full w-full">
            {shots.map((shot, index) => {
              const visible = step < 3 && step === index;
              return (
                <motion.div
                  key={shot.key}
                  data-testid={`s4-screen-${index}`}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: visible ? 1 : 0, y: step > index ? -36 : step < index ? 36 : 0 }}
                  transition={stepReveal}
                >
                  <Placeholder ratio="16/10" label={text(shot.alt)} className="h-full w-full p-8" />
                  {index === 0 && step === 0 && (
                    <motion.div
                      data-testid="s4-payment-row"
                      className="absolute"
                      style={{ left: '-10%', top: '62%' }}
                      initial={shouldPair ? { x: -180, y: 125 } : { x: 120, y: 0 }}
                      animate={{ x: 120, y: 0 }}
                      transition={spring.snap}
                    >
                      <StatementRow
                        {...matchedRow}
                        matched
                        matchDelay={shouldPair ? pairing.greenDelay : 0}
                      />
                    </motion.div>
                  )}
                  {index === 1 && step === 1 && <Highlight rect={highlights.ownerLiveValue} />}
                  {index === 2 && step === 2 && <Highlight rect={highlights.tenantReportButton} />}
                </motion.div>
              );
            })}
          </div>
        </LaptopFrame>
      </motion.div>

      <div className="absolute flex h-[625px] w-[660px] items-center" style={{ left: 1220, top: 170 }}>
        {shots.map((shot, index) => (
          <div key={shot.key} data-testid="s4-word" className="absolute inset-0 flex items-center">
            <Word
              state={step === index ? 'lit' : 'hidden'}
              className="text-word"
            >
              {text(shot.label)}
            </Word>
          </div>
        ))}
      </div>

      <div data-testid="s4-summary" className="absolute inset-0 flex items-center justify-center px-edge">
        <Word state={step === 3 ? 'lit' : 'hidden'} className="text-word">
          {text(screen.summary)}
        </Word>
      </div>
    </div>
  );
}
