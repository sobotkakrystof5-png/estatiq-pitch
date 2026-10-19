// S2 · Problém · papír. Vyprávěcí timeline postaví chaos (~2,7 s), pak v tabulce
// klidně přibývají řádky. Krok 1 všechno zastaví a přes scénu se stáhne ztlumení.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  stagger,
  useAnimate,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
  type AnimationSequence,
} from 'motion/react';
import { formatCount } from '../design/primitives';
import { chaos, chaosLoop, ease } from '../motion/presets';
import { s2 } from '../content/slides';
import type { SlideProps } from '../deck/types';
import { ChaosScene } from './chaos/ChaosScene';
import { flight } from './chaos/layout';

const COUNT = Number(s2.screen.counter.value);
const LATER = s2.rows.later.length;
const OPEN = 'inset(0% 0% 0% 0%)';
const CLOSED_DOWN = 'inset(0% 0% 100% 0%)';

export function S02Problem({ step, mode, direction }: SlideProps) {
  // Timeline jen při běžném příchodu na krok 0. Návrat z S3, skok nebo instant = hotový chaos.
  const [play] = useState(() => step === 0 && mode === 'normal' && direction === 1);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const count = useMotionValue(play ? 0 : COUNT);
  const countText = useTransform(count, formatCount);
  const later = useMotionValue(0);
  const timeline = useRef<AnimationPlaybackControls | null>(null);
  const frozen = step >= 1;

  useLayoutEffect(() => {
    if (!play) return;
    const { at } = chaos;
    const sequence: AnimationSequence = [
      ['[data-build=prop]', { opacity: [0, 1] }, { ...chaos.build, at: at.props }],
      ['[data-build=panel]', { clipPath: [CLOSED_DOWN, OPEN] }, { ...chaos.build, at: at.panel }],
      // Kopie řádků se objeví zároveň s originálem ve výpisu (kryjí se), pak odletí.
      [
        '[data-build=srow]',
        { opacity: [0, 1] },
        { ...chaos.build, at: at.rows, delay: stagger(chaos.rowsEvery) },
      ],
      [
        '[data-build=fly]',
        { opacity: [0, 1] },
        { ...chaos.build, at: at.rows, delay: stagger(chaos.rowsEvery) },
      ],
      ['[data-build=sheet]', { clipPath: [CLOSED_DOWN, OPEN] }, { ...chaos.build, at: at.sheet }],
      [count, COUNT, { ...chaos.count, at: at.count }],
      [
        '[data-build=fly]',
        { x: [flight.dx, 0], y: [flight.dy, 0] },
        { ...chaos.fly, at: at.fly, delay: stagger(chaos.flyEvery) },
      ],
      ['[data-build=rent]', { opacity: [0, 1], scale: [0.8, 1] }, { ...chaos.pop, at: at.rent }],
      ['[data-build=water]', { opacity: [0, 1], scale: [0.8, 1] }, { ...chaos.pop, at: at.water }],
    ];
    const controls = animate(sequence, { defaultTransition: { ease: ease.out } });
    timeline.current = controls;
    controls.finished.then(() => {
      if (timeline.current === controls) timeline.current = null;
    });
    return () => {
      controls.stop();
      timeline.current = null;
    };
  }, [play, animate, count]);

  // Krok 1 timeline zmrazí na místě, návrat na krok 0 ji pustí dál.
  useEffect(() => {
    const controls = timeline.current;
    if (!controls) return;
    if (frozen) controls.pause();
    else controls.play();
  }, [frozen]);

  // Smyčka běží jen v kroku 0 a mimo instant (Motion by ji v instant jen přeskočil na konec).
  useEffect(() => {
    if (frozen || mode === 'instant') return;
    const from = later.get();
    const delay = timeline.current ? chaos.total - (timeline.current.time ?? 0) : 0;
    const controls = animate(later, LATER, chaosLoop(from, LATER, Math.max(0, delay)));
    return () => controls.stop();
  }, [frozen, mode, animate, later]);

  return (
    <div ref={scope} className="absolute inset-0">
      <ChaosScene
        hidden={play}
        count={<motion.span className="tabular-nums">{countText}</motion.span>}
        later={later}
      />
      <motion.div
        data-testid="chaos-hush"
        className="pointer-events-none absolute inset-0 bg-paper"
        initial={false}
        animate={{ opacity: frozen ? chaos.hushOpacity : 0 }}
        transition={chaos.hush}
      />
    </div>
  );
}
