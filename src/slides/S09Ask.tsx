// S9 · Co chci · tma. Závěr tvoří slogan a logo EstatIQ.
import { Logo, Word } from '../design/primitives';
import { s9, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

const words = [s9.screen.calls, s9.screen.pilots, s9.screen.ask] as const;

export function S09Ask({ step }: SlideProps) {
  const showClosing = step === 3;

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
        <div
          data-testid="s9-endcard"
          className="absolute inset-0 flex flex-col items-center justify-center gap-24 px-edge"
        >
          <Word state="lit" className="text-word">
            {text(s9.screen.tagline)}
          </Word>
          <Logo className="w-[420px]" />
        </div>
      )}
    </div>
  );
}
