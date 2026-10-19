// Debug (D): kódy kláves, které posílá prezentér, a stav enginu.
import type { DeckState } from './types';
import type { KeyRecord } from './useControls';

export function DebugOverlay({ log, state }: { log: KeyRecord[]; state: DeckState }) {
  return (
    <div
      data-testid="debug"
      className="fixed top-4 left-4 z-50 min-w-96 bg-black/85 p-4 font-mono text-sm leading-relaxed text-fg"
    >
      <div className="text-muted">
        slide {state.slide} · step {state.step} · {state.mode}
      </div>
      <table className="mt-2">
        <thead className="text-muted">
          <tr>
            <th className="pr-4 text-left font-normal">key</th>
            <th className="pr-4 text-left font-normal">code</th>
            <th className="pr-4 text-left font-normal">keyCode</th>
            <th className="text-left font-normal">mods</th>
          </tr>
        </thead>
        <tbody data-testid="debug-keys">
          {log.map((k) => (
            <tr key={`${k.at}-${k.code}-${k.key}`}>
              <td className="pr-4">{k.key === ' ' ? 'Space' : k.key}</td>
              <td className="pr-4">{k.code}</td>
              <td className="pr-4">{k.keyCode}</td>
              <td>{k.mods}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
