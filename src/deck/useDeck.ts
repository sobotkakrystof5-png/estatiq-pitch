import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { MotionGlobalConfig } from 'motion/react';
import { allSlides, engine, shape } from '../deck.config';
import { dur } from '../motion/presets';
import { formatHash, parseHash } from './hash';
import { initialState, reduce, type DeckAction } from './reducer';
import type { DeckState } from './types';

export type NavAction = Exclude<DeckAction, { type: 'setMode' }>;

const setInstantAnimations = (on: boolean) => {
  MotionGlobalConfig.instantAnimations = on;
};

/**
 * Stav decku a navigace podle BRIEF §4:
 * - Klik vyhrává: přijde-li akce během běžícího přechodu, slajd se přemountuje
 *   s okamžitými animacemi (= skočí do cílového stavu) a teprve pak se akce provede.
 * - Dva kliky do `fastClickMs` zapnou `instant`, vypne ho `quietMs` klidu.
 * Stav se drží i v refu, takže rychlé kliky se nikdy neztratí ani nesloučí.
 */
export function useDeck() {
  const [state, setState] = useState<DeckState>(() =>
    initialState(shape, parseHash(shape, window.location.hash) ?? undefined),
  );
  const [epoch, setEpoch] = useState(0);
  const stateRef = useRef(state);
  const timing = useRef({
    lastAt: -Infinity,
    busyUntil: -Infinity,
    quiet: undefined as number | undefined,
  });

  const commit = useCallback((next: DeckState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const navigate = useCallback(
    (action: NavAction, opts: { instant?: boolean } = {}) => {
      const now = performance.now();
      const t = timing.current;
      const current = stateRef.current;
      const target = reduce(shape, current, action);
      if (target === current) return;

      const instant =
        opts.instant || current.mode === 'instant' || now - t.lastAt < engine.fastClickMs;

      if (now < t.busyUntil) {
        setInstantAnimations(true);
        flushSync(() => {
          setEpoch((e) => e + 1);
          commit({ ...current, mode: 'instant' });
        });
      }

      setInstantAnimations(instant);
      commit({ ...target, mode: instant ? 'instant' : 'normal' });

      const entered = target.slide !== current.slide ? (allSlides[target.slide]?.busyMs ?? 0) : 0;
      t.lastAt = now;
      t.busyUntil = now + Math.max(dur.slide * 1000, entered);

      window.clearTimeout(t.quiet);
      if (instant) {
        t.quiet = window.setTimeout(() => {
          setInstantAnimations(false);
          commit({ ...stateRef.current, mode: 'normal' });
        }, engine.quietMs);
      }
    },
    [commit],
  );

  const getState = useCallback(() => stateRef.current, []);

  // Pozice v URL, aby obnovení stránky nic neztratilo.
  const { slide, step } = state;
  useEffect(() => {
    const hash = formatHash(shape, { slide, step });
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  }, [slide, step]);

  useEffect(() => {
    const onHash = () => {
      const pos = parseHash(shape, window.location.hash);
      if (pos) navigate({ type: 'goto', ...pos }, { instant: true });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [navigate]);

  return { state, epoch, navigate, getState };
}
