import { useCallback, useEffect, useRef, useState } from 'react';
import { backupSlides, engine, keymap, shape } from '../deck.config';
import type { NavAction } from './useDeck';
import type { DeckState, Position } from './types';

export type KeyRecord = { key: string; code: string; keyCode: number; mods: string; at: number };
export type OverviewState = { selected: number };

/** Stav, který se čte z event handlerů: hodnota pro render a ref pro okamžité čtení. */
function useRefState<T>(initial: T) {
  const [value, setValue] = useState(initial);
  const ref = useRef(value);
  const set = useCallback((next: T) => {
    ref.current = next;
    setValue(next);
  }, []);
  return [value, set, ref] as const;
}

const isBackup = (slide: number) => slide >= shape.mainCount;
const lastMain = (): Position => ({ slide: shape.mainCount - 1, step: 0 });

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
  else void document.documentElement.requestFullscreen().catch(() => undefined);
}

function modifiers(e: KeyboardEvent) {
  return [e.ctrlKey && 'Ctrl', e.metaKey && 'Meta', e.altKey && 'Alt', e.shiftKey && 'Shift']
    .filter(Boolean)
    .join('+');
}

/** Klávesnice a prezentér (BRIEF §5). Mapování je v `deck.config.ts`. */
export function useControls(
  navigate: (a: NavAction, o?: { instant?: boolean }) => void,
  getState: () => DeckState,
) {
  const [overview, setOverview, overviewRef] = useRefState<OverviewState | null>(null);
  const [debug, setDebug, debugRef] = useRefState(false);
  const [keyLog, setKeyLog] = useState<KeyRecord[]>([]);
  const returnTo = useRef<Position | null>(null);
  const digits = useRef({ value: '', at: 0 });

  useEffect(() => {
    const goto = (pos: Position, instant = false) =>
      navigate({ type: 'goto', ...pos }, { instant });

    const openOverview = () => {
      const { slide, step } = getState();
      if (!isBackup(slide)) returnTo.current = { slide, step };
      setOverview({ selected: isBackup(slide) ? slide - shape.mainCount : 0 });
    };

    const closeOverview = () => {
      setOverview(null);
      if (!isBackup(getState().slide)) return;
      goto(returnTo.current ?? lastMain(), true);
    };

    const onOverviewKey = (key: string) => {
      const ov = overviewRef.current;
      if (!ov) return;
      const delta: Record<string, number> = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -engine.overviewColumns,
        ArrowDown: engine.overviewColumns,
      };
      if (key in delta) {
        const selected = Math.min(
          backupSlides.length - 1,
          Math.max(0, ov.selected + (delta[key] ?? 0)),
        );
        setOverview({ selected });
      } else if (key === 'Enter') {
        setOverview(null);
        goto({ slide: shape.mainCount + ov.selected, step: 0 });
      } else if (key === 'Escape' || key.toLowerCase() === 'z') {
        closeOverview();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (debugRef.current) {
        const record = {
          key: e.key,
          code: e.code,
          keyCode: e.keyCode,
          mods: modifiers(e),
          at: Date.now(),
        };
        setKeyLog((log) => [record, ...log].slice(0, 10));
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const command = keymap[e.key] ?? keymap[e.key.toLowerCase()];

      if (command === 'debug') {
        e.preventDefault();
        setDebug(!debugRef.current);
        return;
      }
      if (command === 'fullscreen') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (overviewRef.current) {
        e.preventDefault();
        onOverviewKey(e.key);
        return;
      }

      // Číslo + Enter: skok na hlavní slajd.
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        const now = performance.now();
        const fresh = now - digits.current.at < engine.digitBufferMs;
        digits.current = { value: (fresh ? digits.current.value : '') + e.key, at: now };
        return;
      }
      const typed =
        performance.now() - digits.current.at < engine.digitBufferMs ? digits.current.value : '';
      digits.current = { value: '', at: 0 };
      if (e.key === 'Enter' && typed) {
        e.preventDefault();
        const n = Math.min(shape.mainCount, Math.max(1, Number(typed)));
        goto({ slide: n - 1, step: 0 }, true);
        return;
      }

      if (!command) return;
      e.preventDefault();
      switch (command) {
        case 'next':
        case 'prev':
          navigate({ type: command });
          break;
        case 'first':
          goto({ slide: 0, step: 0 }, true);
          break;
        case 'last':
          goto(lastMain(), true);
          break;
        case 'final':
          navigate({ type: 'jumpToFinal' }, { instant: true });
          break;
        case 'overview':
          openOverview();
          break;
        case 'back':
          if (isBackup(getState().slide)) goto(returnTo.current ?? lastMain(), true);
          break;
        case 'presenter':
        case 'timer':
          // Fáze 7: okno přednášejícího a stopky.
          break;
        case 'ignore':
          break;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, getState, setOverview, overviewRef, setDebug, debugRef]);

  return { overview, debug, keyLog };
}
