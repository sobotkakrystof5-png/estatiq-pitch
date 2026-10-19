// S6 · Roadmapa funkcí · tma. Tři fáze: dnes, další krok, později. Krok 3 rozsvítí všechny.
import { Word } from '../design/primitives';
import type { WordState } from '../design/primitives/Word';
import { s6, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

const { screen } = s6;
const phases = [
  { label: screen.nowLabel, items: [screen.now1, screen.now2, screen.now3] },
  { label: screen.nextLabel, items: [screen.next1, screen.next2, screen.next3, screen.next4] },
  {
    label: screen.laterLabel,
    items: [screen.later1, screen.later2, screen.later3, screen.later4, screen.later5],
  },
] as const;
const left = [120, 700, 1280] as const;

function phaseState(index: number, step: number): WordState {
  if (step >= 3) return 'lit';
  if (index > step) return 'hidden';
  return index === step ? 'lit' : 'dim';
}

export function S06Scale({ step }: SlideProps) {
  return (
    <div className="absolute inset-0 text-fg">
      <p className="absolute left-edge top-[130px] text-label text-muted">{text(screen.eyebrow)}</p>
      <div className="absolute left-[120px] right-[120px] top-[385px] h-px bg-line" />
      {phases.map(({ label, items }, index) => {
        const state = phaseState(index, step);
        return (
          <div key={index} className="absolute top-0 w-[520px]" style={{ left: left[index] }}>
            <div
              className={`absolute left-0 top-[385px] size-4 -translate-y-1/2 rounded-full ${state === 'lit' ? 'bg-mint' : 'bg-line'}`}
            />
            <Word state={state} dimTo={0.6} className="absolute left-0 top-[225px] text-word">
              {text(label)}
            </Word>
            <ul className="absolute left-0 top-[440px] flex flex-col gap-5">
              {items.map((item, i) => (
                <li key={i}>
                  <Word state={state} dimTo={0.6} className="text-[48px] leading-tight">
                    {text(item)}
                  </Word>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
