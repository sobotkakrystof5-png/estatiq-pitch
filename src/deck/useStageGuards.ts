import { useEffect, useState } from 'react';
import { engine, preloadImages } from '../deck.config';
import { preloadAssets } from './preload';

/** Kurzor zmizí po `ms` bez pohybu myši. */
export function useIdleCursor(ms: number) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), ms);
    const onMove = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), ms);
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('mousemove', onMove);
    };
  }, [ms]);
  return idle;
}

/** Žádné kontextové menu na pódiu. */
export function useNoContextMenu() {
  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    window.addEventListener('contextmenu', block);
    return () => window.removeEventListener('contextmenu', block);
  }, []);
}

/** `true`, až jsou načtené fonty a obrázky (nebo vypršela pojistka). */
export function usePreload() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    void preloadAssets(preloadImages, engine.preloadTimeoutMs).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}
