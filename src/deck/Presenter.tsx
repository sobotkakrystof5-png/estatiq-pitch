import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { allSlides, engine, mainSlides, shape, stage, totalBudgetSec } from '../deck.config';
import { slides } from '../content/slides';
import { useElementSize } from '../design/primitives/useElementSize';
import { backgroundClass } from './Stage';
import { formatHash, parseHash } from './hash';
import { reduce } from './reducer';
import { usePresenterLink, type LinkMessage } from './sync';
import type { Position } from './types';
import type { NavAction } from './useDeck';

const formatTime = (seconds: number) => {
  const safe = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
};

function nextPosition(position: Position): Position | null {
  const next = reduce(shape, { ...position, mode: 'instant', direction: 1 }, { type: 'next' });
  return next.slide === position.slide && next.step === position.step ? null : next;
}

function SlidePreview({ position, label }: { position: Position | null; label: string }) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const scale = Math.min(size.width / stage.width, size.height / stage.height);
  const def = position ? allSlides[position.slide] : undefined;
  const Slide = def?.component;
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between font-mono text-sm uppercase tracking-widest text-muted">
        <span>{label}</span>
        {position && def && (
          <span>
            {def.id.toUpperCase()} · {position.step + 1}/{def.steps + 1}
          </span>
        )}
      </div>
      <div
        ref={ref}
        data-testid={label === 'Teď' ? 'presenter-current' : 'presenter-next'}
        data-presenter-slide={def?.id}
        data-presenter-step={position?.step}
        className="relative aspect-video overflow-hidden bg-black outline outline-1 outline-line"
      >
        {def && Slide ? (
          <div
            className={`absolute top-1/2 left-1/2 overflow-hidden ${backgroundClass[def.background]}`}
            style={{
              width: stage.width,
              height: stage.height,
              transform: `translate(-50%, -50%) scale(${scale || 0})`,
            }}
          >
            <Slide step={position!.step} mode="instant" direction={1} />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-label text-muted">
            Konec prezentace
          </div>
        )}
      </div>
    </section>
  );
}

function noteParts(notes: string) {
  return notes.split(/(\[(?:pauza(?:\s+[^\]]+)?|klik)\])/gi).filter(Boolean);
}

function Notes({ text }: { text: string }) {
  if (!text) return <p className="text-2xl text-muted">K tomuto slajdu nejsou poznámky.</p>;
  return (
    <p className="whitespace-pre-wrap text-[28px] leading-[1.32] text-fg">
      {noteParts(text).map((part, index) => {
        if (/^\[klik\]$/i.test(part))
          return (
            <span
              key={index}
              className="mx-1 rounded bg-mint/15 px-2 py-1 font-mono text-xl text-mint"
            >
              KLIK
            </span>
          );
        if (/^\[pauza/i.test(part)) {
          const pause = part.slice(1, -1).replace(/^pauza/i, 'Pauza');
          return (
            <span
              key={index}
              className="mx-1 rounded bg-amber/15 px-2 py-1 font-mono text-xl text-amber"
            >
              {pause.toUpperCase()}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}

export function Presenter() {
  const openerRef = useRef<Window | null>(window.opener);
  const [position, setPosition] = useState<Position>(
    () => parseHash(shape, window.location.hash) ?? { slide: 0, step: 0 },
  );
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const onMessage = useCallback((message: LinkMessage) => {
    if (message.kind === 'state') {
      setPosition(message.position);
      setTimerStartedAt(message.timerStartedAt);
    }
  }, []);
  const send = usePresenterLink('presenter', openerRef, onMessage);
  const def = allSlides[position.slide]!;
  const next = nextPosition(position);
  const content = slides[position.slide]!;
  const elapsed = timerStartedAt === null ? 0 : Math.max(0, (now - timerStartedAt) / 1000);
  const remaining = Math.max(0, totalBudgetSec - elapsed);
  const late =
    timerStartedAt !== null &&
    elapsed >= totalBudgetSec - engine.presenterTimerWarningSec &&
    position.slide !== 7;
  const targetStart =
    position.slide < mainSlides.length
      ? mainSlides.slice(0, position.slide).reduce((sum, slide) => sum + slide.budgetSec, 0)
      : totalBudgetSec;
  const deviation = timerStartedAt === null ? null : Math.round(elapsed - targetStart);

  useEffect(() => {
    const interval = window.setInterval(
      () => setNow(Date.now()),
      engine.presenterTimerTickMs,
    );
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const hash = formatHash(shape, position);
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  }, [position]);

  const navigate = useCallback((action: NavAction) => send({ kind: 'navigate', action }), [send]);
  const startTimer = useCallback(() => send({ kind: 'timer', startedAt: Date.now() }), [send]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === 'F5') {
        event.preventDefault();
        return;
      }
      let action: NavAction | null = null;
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(event.key))
        action = { type: 'next' };
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) action = { type: 'prev' };
      if (event.key.toLowerCase() === 't') {
        event.preventDefault();
        startTimer();
        return;
      }
      if (!action) return;
      event.preventDefault();
      navigate(action);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, startTimer]);

  const timeLabel = timerStartedAt === null ? 'PŘIPRAVENO' : `−${formatTime(remaining)}`;
  const deltaLabel = deviation === null ? '± —' : `${deviation > 0 ? '+' : ''}${deviation} s`;

  return (
    <MotionConfig skipAnimations>
      <main className="fixed inset-0 flex flex-col gap-4 overflow-hidden bg-night px-6 py-5 text-fg">
        <header className="flex shrink-0 items-center gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between font-mono text-sm tracking-widest text-muted">
              <span>
                {def.id.toUpperCase()} · {content.title}
              </span>
              <span>
                cíl {formatTime(targetStart)} · rozpočet {formatTime(def.budgetSec)} · odchylka{' '}
                {deltaLabel}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden bg-night-2">
              <div
                data-testid="presenter-timer-bar"
                className={`h-full ${late ? 'bg-red' : 'bg-mint'}`}
                style={{
                  width: `${Math.max(0, Math.min(100, (remaining / totalBudgetSec) * 100))}%`,
                }}
              />
            </div>
          </div>
          <output
            data-testid="presenter-timer"
            className={`min-w-36 text-right font-mono text-5xl ${late ? 'text-red' : 'text-fg'}`}
          >
            {timeLabel}
          </output>
          <button
            type="button"
            className="border border-line px-4 py-3 font-mono text-lg text-muted hover:text-fg"
            onClick={startTimer}
          >
            T · START / RESET
          </button>
        </header>

        <MotionConfig skipAnimations>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-5">
            <SlidePreview position={position} label="Teď" />
            <SlidePreview position={next} label="Další" />
          </div>
        </MotionConfig>

        <section
          className="flex min-h-0 shrink-0 flex-col border-t border-line pt-3"
          style={{ height: '38%' }}
        >
          <div className="mb-2 flex items-center justify-between font-mono text-sm uppercase tracking-widest text-muted">
            <span>Poznámky · {content.title}</span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Předchozí krok"
                className="border border-line px-4 py-2 text-fg"
                onClick={() => navigate({ type: 'prev' })}
              >
                PŘED
              </button>
              <button
                type="button"
                aria-label="Další krok"
                className="border border-line px-4 py-2 text-fg"
                onClick={() => navigate({ type: 'next' })}
              >
                DALŠÍ
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto pr-3">
            <Notes text={content.notes} />
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
