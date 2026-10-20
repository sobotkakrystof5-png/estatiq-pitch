import { useCallback, useEffect, useMemo, useRef, useState, type Ref } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { allSlides, engine, shape } from '../deck.config';
import { slideFade } from '../motion/presets';
import { DebugOverlay } from './DebugOverlay';
import { Overview } from './Overview';
import { reduce } from './reducer';
import { Stage, backgroundClass } from './Stage';
import type { DeckState, SlideDef } from './types';
import { usePresenterLink, type LinkMessage, type LinkPayload } from './sync';
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
  const presenterWindow = useRef<Window | null>(null);
  const stateRef = useRef(state);
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(null);
  const timerRef = useRef<number | null>(timerStartedAt);
  const sendRef = useRef<(message: LinkPayload) => string>(() => '');
  const navigateWithTimer = useCallback(
    (action: Parameters<typeof navigate>[0], options?: Parameters<typeof navigate>[1]) => {
      const current = getState();
      const target = reduce(shape, current, action);
      if (
        timerRef.current === null &&
        current.slide === 0 &&
        action.type === 'next' &&
        target !== current
      ) {
        const startedAt = Date.now();
        timerRef.current = startedAt;
        setTimerStartedAt(startedAt);
      }
      navigate(action, options);
    },
    [getState, navigate],
  );
  const navigateWithTimerRef = useRef(navigateWithTimer);

  const onLinkMessage = useCallback((message: LinkMessage) => {
    if (message.kind === 'hello') {
      const current = stateRef.current;
      sendRef.current({
        kind: 'state',
        position: { slide: current.slide, step: current.step },
        timerStartedAt: timerRef.current,
      });
    } else if (message.kind === 'navigate') {
      navigateWithTimerRef.current(message.action);
    } else if (message.kind === 'timer') {
      timerRef.current = message.startedAt;
      setTimerStartedAt(message.startedAt);
    }
  }, []);
  const send = usePresenterLink('stage', presenterWindow, onLinkMessage);

  useEffect(() => {
    stateRef.current = state;
    timerRef.current = timerStartedAt;
    sendRef.current = send;
    navigateWithTimerRef.current = navigateWithTimer;
  }, [navigateWithTimer, send, state, timerStartedAt]);

  useEffect(() => {
    send({
      kind: 'state',
      position: { slide: state.slide, step: state.step },
      timerStartedAt,
    });
  }, [send, state.slide, state.step, timerStartedAt]);

  const openPresenter = useCallback(() => {
    if (presenterWindow.current && !presenterWindow.current.closed) {
      presenterWindow.current.focus();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('print');
    url.searchParams.delete('final');
    url.searchParams.set('presenter', '');
    presenterWindow.current = window.open(
      url.toString(),
      'estatiq-presenter',
      'popup,width=1500,height=1000',
    );
    presenterWindow.current?.focus();
  }, []);
  const startTimer = useCallback(() => {
    const startedAt = Date.now();
    timerRef.current = startedAt;
    setTimerStartedAt(startedAt);
    send({ kind: 'timer', startedAt });
  }, [send]);
  const controlCallbacks = useMemo(
    () => ({ onPresenter: openPresenter, onTimer: startTimer }),
    [openPresenter, startTimer],
  );
  const { overview, debug, keyLog } = useControls(navigateWithTimer, getState, controlCallbacks);
  const cursorHidden = useIdleCursor(engine.cursorIdleMs);
  useNoContextMenu();

  const def = allSlides[state.slide]!;

  return (
    <div className={`fixed inset-0 touch-none select-none ${cursorHidden ? 'cursor-none' : ''}`}>
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
