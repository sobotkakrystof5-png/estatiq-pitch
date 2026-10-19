import type { Ref } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { allSlides, engine } from '../deck.config';
import { slideFade } from '../motion/presets';
import { DebugOverlay } from './DebugOverlay';
import { Overview } from './Overview';
import { Stage, backgroundClass } from './Stage';
import type { DeckState, SlideDef } from './types';
import { useControls } from './useControls';
import { useDeck } from './useDeck';
import { useIdleCursor, useNoContextMenu, usePreload } from './useStageGuards';

function SlideFrame({
  def,
  state,
  ref,
}: {
  def: SlideDef;
  state: DeckState;
  ref?: Ref<HTMLDivElement>;
}) {
  const Slide = def.component;
  return (
    <motion.div
      ref={ref}
      data-slide={def.id}
      data-step={state.step}
      className={`absolute inset-0 ${backgroundClass[def.background]}`}
      variants={{ ...slideFade, ...def.variants }}
      initial="enter"
      animate="center"
      exit="exit"
      custom={state.direction}
    >
      <Slide step={state.step} mode={state.mode} direction={state.direction} />
    </motion.div>
  );
}

export function Deck() {
  const ready = usePreload();
  const { state, epoch, navigate, getState } = useDeck();
  const { overview, debug, keyLog } = useControls(navigate, getState);
  const cursorHidden = useIdleCursor(engine.cursorIdleMs);
  useNoContextMenu();

  const def = allSlides[state.slide]!;

  return (
    <div className={`fixed inset-0 select-none ${cursorHidden ? 'cursor-none' : ''}`}>
      <Stage background={ready ? def.background : 'night'}>
        {ready ? (
          // `epoch` se mění, když klik přijde během přechodu: celý přechod se zahodí a slajd stojí v cíli.
          <AnimatePresence key={epoch} mode="popLayout" custom={state.direction}>
            <SlideFrame key={def.id} def={def} state={state} />
          </AnimatePresence>
        ) : (
          <div data-testid="loading" className="absolute inset-0 flex items-center justify-center">
            <div className="size-2 animate-pulse rounded-full bg-muted" />
          </div>
        )}
        {ready && overview && <Overview selected={overview.selected} />}
      </Stage>
      {debug && <DebugOverlay log={keyLog} state={state} />}
    </div>
  );
}
