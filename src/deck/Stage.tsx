import { useSyncExternalStore, type ReactNode } from 'react';
import { stage } from '../deck.config';
import type { Background } from './types';

export const backgroundClass: Record<Background, string> = {
  night: 'bg-night',
  paper: 'bg-paper',
  black: 'bg-black',
};

function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
}
const getScale = () => Math.min(window.innerWidth / stage.width, window.innerHeight / stage.height);

/** Pevné plátno 1920×1080 zmenšené na okno. Letterbox má barvu pozadí aktuálního slajdu. */
export function Stage({ background, children }: { background: Background; children: ReactNode }) {
  const scale = useSyncExternalStore(subscribe, getScale);
  return (
    <div className={`fixed inset-0 overflow-hidden ${backgroundClass[background]}`}>
      <div
        data-testid="stage"
        className="absolute top-1/2 left-1/2 overflow-hidden"
        style={{
          width: stage.width,
          height: stage.height,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
