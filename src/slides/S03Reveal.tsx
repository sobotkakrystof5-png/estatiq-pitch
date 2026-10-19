// S3 · Odhalení · papír → tma. Krok 0 je rozpad chaosu z S2: kulisy se rozsypou, z banky,
// tabulky a bubliny vyjedou tři slova a papír se stáhne k ose. Kroky 1–3 rozsvítí slovo,
// krok 4 je slije do loga (sjetí, zmenšení, prolnutí, ne morph), krok 5 ukáže tag.
import { useLayoutEffect, useState } from 'react';
import { motion, useAnimate, type AnimationSequence } from 'motion/react';
import { formatCount, Logo, Word, useElementSize } from '../design/primitives';
import { chaos, merge, rozpad } from '../motion/presets';
import { s2, s3, text } from '../content/slides';
import { stage } from '../deck/canvas';
import type { SlideProps } from '../deck/types';
import { ChaosScene } from './chaos/ChaosScene';
import { anchors, pieces } from './chaos/layout';

const { screen } = s3;
const WORDS = [
  { key: 'bank', label: text(screen.bank) },
  { key: 'sheet', label: text(screen.sheet) },
  { key: 'chat', label: text(screen.chat) },
] as const;

/** Slova pod sebou u levého okraje, svisle uprostřed. `text-hero`: 200 px × 0,95. */
const EDGE = 120;
const LINE = 190;
const TOP = (stage.height - LINE * WORDS.length) / 2;
const lineCenter = (i: number) => TOP + i * LINE + LINE / 2;
const center = { x: stage.width / 2, y: stage.height / 2 };

const OPEN = 'inset(0% 0% 0% 0%)';
const CURTAIN = 'inset(50% 0% 50% 0%)';
const LOGO_H = 180;

function WordLine({ index, label, step }: { index: number; label: string; step: number }) {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const merged = step >= 4;
  const state = step === 0 || merged || step - 1 === index ? 'lit' : 'dim';
  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{
        x: merged ? center.x - (EDGE + width / 2) : 0,
        y: merged ? center.y - lineCenter(index) : 0,
        scale: merged ? merge.wordScale : 1,
        opacity: merged ? 0 : 1,
      }}
      transition={merge.transition}
    >
      <Word state={state} className="text-hero">
        {label}
      </Word>
    </motion.div>
  );
}

export function S03Reveal({ step, mode, direction }: SlideProps) {
  // Rozpad jen při běžném příchodu z S2. Skok, instant a návrat z S4 ukážou hotový stav.
  const [play] = useState(() => step === 0 && mode === 'normal' && direction === 1);
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useLayoutEffect(() => {
    if (!play) return;
    const sequence: AnimationSequence = pieces.map((p, i) => [
      `[data-piece=${p.key}]`,
      { opacity: 0, x: p.drift[0], y: p.drift[1] },
      { ...rozpad.scatter, at: i * rozpad.scatterEvery },
    ]);
    WORDS.forEach((w, i) => {
      const width = scope.current.querySelector<HTMLElement>(`[data-word=${w.key}]`)!.offsetWidth;
      const from = {
        x: anchors[w.key].x - (EDGE + width / 2),
        y: anchors[w.key].y - lineCenter(i),
      };
      sequence.push(
        [
          `[data-word=${w.key}]`,
          { x: [from.x, 0], y: [from.y, 0], scale: [rozpad.fromScale, 1] },
          { ...rozpad.travel, at: rozpad.at.travel },
        ],
        [`[data-word=${w.key}]`, { opacity: [0, 1] }, { ...rozpad.appear, at: rozpad.at.travel }],
      );
    });
    sequence.push([
      '[data-testid=reveal-ghost]',
      { clipPath: [OPEN, CURTAIN] },
      { ...rozpad.curtain, at: rozpad.at.curtain },
    ]);
    const controls = animate(sequence);
    return () => controls.stop();
  }, [play, animate, scope]);

  return (
    <div ref={scope} className="absolute inset-0 text-fg">
      {WORDS.map((w, i) => (
        <motion.div
          key={w.key}
          data-word={w.key}
          data-testid="reveal-word"
          className="absolute text-hero"
          style={{ left: EDGE, top: TOP + i * LINE }}
          initial={play ? { opacity: 0 } : false}
        >
          <WordLine index={i} label={w.label} step={step} />
        </motion.div>
      ))}

      <div
        className="absolute inset-x-0 flex flex-col items-center"
        style={{ top: center.y - LOGO_H / 2 }}
      >
        <motion.div
          data-testid="reveal-logo"
          initial={false}
          animate={{ opacity: step >= 4 ? 1 : 0, scale: step >= 4 ? 1 : merge.logoFrom }}
          transition={merge.transition}
        >
          <Logo className="block h-[180px] w-auto" />
        </motion.div>
        <Word state={step >= 5 ? 'lit' : 'hidden'} className="mt-14 text-word text-muted">
          {text(screen.tag)}
        </Word>
      </div>

      {/* Papír s hotovým chaosem z S2 (ve ztlumeném stavu kroku 1). Stáhne se k ose a zmizí. */}
      {play && (
        <motion.div
          data-testid="reveal-ghost"
          className="absolute inset-0 bg-paper"
          initial={{ clipPath: OPEN }}
        >
          <ChaosScene count={formatCount(Number(s2.screen.counter.value))} />
          <div className="absolute inset-0 bg-paper" style={{ opacity: chaos.hushOpacity }} />
          {/* Inkoustové kopie slov: na papíře jsou tmavé, kde papír zmizí, svítí světlé pod ním. */}
          {WORDS.map((w, i) => (
            <motion.div
              key={w.key}
              data-word={w.key}
              className="absolute text-hero text-ink"
              style={{ left: EDGE, top: TOP + i * LINE }}
              initial={{ opacity: 0 }}
            >
              {w.label}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
