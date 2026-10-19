// S6 · Pronájem od smlouvy po daně · tma. Čtyři části jednoho životního cyklu.
import { Word } from '../design/primitives';
import { s6, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

const stages = [
  { label: s6.screen.contract, detail: s6.screen.contractDetail },
  { label: s6.screen.dailyManagement, detail: s6.screen.managementDetail },
  { label: s6.screen.maintenance, detail: s6.screen.energyDetail },
  { label: s6.screen.taxes, detail: s6.screen.taxDetail },
] as const;
const positions = [160, 565, 1010, 1480] as const;

export function S06Scale({ step }: SlideProps) {
  const activeIndex = Math.min(step, stages.length - 1);

  return (
    <div className="absolute inset-0 text-fg">
      <p className="absolute left-edge top-[150px] text-label text-muted">{text(s6.screen.eyebrow)}</p>
      <div className="absolute left-[160px] right-[160px] h-px bg-line" style={{ top: 532 }} />
      {stages.map(({ label, detail }, index) => {
        const state = index < activeIndex ? 'dim' : index === activeIndex ? 'lit' : 'hidden';
        return (
          <div key={index} className="absolute top-[532px]" style={{ left: positions[index] }}>
            <div
              className={`size-4 -translate-y-1/2 rounded-full ${index === activeIndex ? 'bg-mint' : 'bg-line'}`}
            />
            <div className="absolute left-[-20px] top-[-140px] w-[380px]">
              <Word state={state} dimTo={0.6} className="text-word">
                {text(label)}
              </Word>
              <Word state={state} dimTo={0.6} className="mt-3 text-label text-muted">
                {text(detail)}
              </Word>
            </div>
          </div>
        );
      })}
    </div>
  );
}
