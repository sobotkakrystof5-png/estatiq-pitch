// S8 · Co chci · tma. Řádek výpisu se vrátí a rozpustí.
import { motion } from 'motion/react';
import { Logo, StatementRow, Word } from '../design/primitives';
import { instant, stripDissolve } from '../motion/presets';
import { s8, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

const closingRow = s8.rows!.closing[0]!;
const words = [s8.screen.calls, s8.screen.pilots, s8.screen.ask] as const;
const VISIBLE = 'inset(0% 0% 0% 0%)';
const WIPED_LEFT_TO_RIGHT = 'inset(0% 0% 0% 100%)';

export function S08Ask({ step, mode, direction }: SlideProps) {
  const showClosing = step === 3;
  const playDissolve = showClosing && mode === 'normal' && direction === 1;

  return (
    <div className="absolute inset-0 overflow-hidden text-fg">
      <div className="absolute left-edge top-[210px] flex flex-col gap-12">
        {words.map((word, index) => {
          const state =
            step === 3 ? 'hidden' : index < step ? 'dim' : index === step ? 'lit' : 'hidden';
          return (
            <Word key={index} state={state} dimTo={0.4} className="text-word">
              {text(word)}
            </Word>
          );
        })}
      </div>

      {showClosing && (
        <>
          <motion.div
            data-testid="s8-closing-strip"
            className="absolute left-1/2 top-[420px] -translate-x-1/2 bg-paper px-16 py-9"
            initial={playDissolve ? { clipPath: VISIBLE } : false}
            animate={{ clipPath: playDissolve ? WIPED_LEFT_TO_RIGHT : WIPED_LEFT_TO_RIGHT }}
            transition={playDissolve ? stripDissolve : instant}
          >
            <StatementRow {...closingRow} tone="paper" />
          </motion.div>
          <Logo className="absolute left-[800px] top-[650px] w-[320px]" />
        </>
      )}
    </div>
  );
}
