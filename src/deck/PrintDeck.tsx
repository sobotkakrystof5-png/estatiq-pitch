import { MotionConfig } from 'motion/react';
import { allSlides } from '../deck.config';
import { backgroundClass } from './Stage';
import './print.css';

/** Finální statické vykreslení každého kroku pro tiskový a PDF výstup. */
export function PrintDeck({ finalOnly = false }: { finalOnly?: boolean }) {
  const pages = allSlides.flatMap((def, slide) => {
    const steps = finalOnly
      ? [def.steps]
      : Array.from({ length: def.steps + 1 }, (_, step) => step);
    return steps.map((step) => ({ def, slide, step }));
  });

  return (
    <MotionConfig skipAnimations>
      <main className="print-document" data-print-count={pages.length}>
        {pages.map(({ def, slide, step }, index) => {
          const Slide = def.component;
          return (
            <section
              key={`${def.id}-${step}`}
              data-print-page={index + 1}
              data-slide={def.id}
              data-step={step}
              className={`print-page ${backgroundClass[def.background]}`}
            >
              <Slide step={step} mode="instant" direction={1} />
              <span className="sr-only">{slide + 1}</span>
            </section>
          );
        })}
      </main>
    </MotionConfig>
  );
}
