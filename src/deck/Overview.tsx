// Přehled záložních slajdů (Z). Jen funkční mřížka, vzhled se ladí ve fázi 7.
import { MotionConfig } from 'motion/react';
import { backupSlides, engine, stage } from '../deck.config';
import { backgroundClass } from './Stage';

const THUMB_SCALE = 0.2;

export function Overview({ selected }: { selected: number }) {
  return (
    <div
      data-testid="overview"
      className="absolute inset-0 z-10 flex items-center justify-center bg-night"
    >
      <MotionConfig skipAnimations>
        <div
          className="grid gap-10"
          style={{ gridTemplateColumns: `repeat(${engine.overviewColumns}, auto)` }}
        >
          {backupSlides.map((def, i) => {
            const Slide = def.component;
            return (
              <div
                key={def.id}
                data-selected={i === selected}
                className="flex flex-col gap-3 font-mono text-muted"
              >
                <div
                  className={`relative overflow-hidden outline-4 outline-offset-4 ${i === selected ? 'outline-fg' : 'outline-transparent'}`}
                  style={{ width: stage.width * THUMB_SCALE, height: stage.height * THUMB_SCALE }}
                >
                  <div
                    className={`absolute top-0 left-0 origin-top-left ${backgroundClass[def.background]}`}
                    style={{
                      width: stage.width,
                      height: stage.height,
                      transform: `scale(${THUMB_SCALE})`,
                    }}
                  >
                    <Slide step={def.steps} mode="instant" direction={1} />
                  </div>
                </div>
                <span className="text-2xl">Z{i + 1}</span>
              </div>
            );
          })}
        </div>
      </MotionConfig>
    </div>
  );
}
