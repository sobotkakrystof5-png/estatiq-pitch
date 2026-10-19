// Styleguide (jen `npm run dev`, `#/styleguide`): všechna primitiva a jejich stavy na plátně 1920×1080.
// ← → přepíná desky, mezera přepíná stav (nástup, přeškrtnutí, počítadlo, spárování, tok).
// Texty jsou vzorky písma, ne obsah prezentace.
import { useEffect, useState } from 'react';
import { MotionGlobalConfig } from 'motion/react';
import { Stage } from '../deck/Stage';
import {
  Counter,
  FlowLine,
  Glyph,
  LaptopFrame,
  Logo,
  Placeholder,
  StatementRow,
  Strike,
  Word,
  type WordState,
} from '../design/primitives';

const NB = ' ';
const rows = [
  { date: '12.09', vs: '2024031', amount: `15${NB}000,00`, name: 'Novák' },
  { date: '12.09', vs: '2024017', amount: `12${NB}500,00`, name: 'Dvořáková' },
  { date: '13.09', vs: '2024044', amount: `9${NB}800,00`, name: 'Šťastný' },
  { date: '14.09', vs: '2024008', amount: `18${NB}200,00`, name: 'Černá' },
  { date: '15.09', vs: '2024052', amount: `11${NB}000,00`, name: 'Kučera' },
];

// Pruh barev v poměru, v jakém se mají na plátně objevit (BRIEF §3: ≥ 90 % neutrální plochy).
const swatches = [
  { name: 'night', cls: 'bg-night', share: 52 },
  { name: 'paper', cls: 'bg-paper', share: 22 },
  { name: 'black', cls: 'bg-black', share: 9 },
  { name: 'night-2', cls: 'bg-night-2', share: 5 },
  { name: 'line', cls: 'bg-line', share: 3 },
  { name: 'muted', cls: 'bg-muted', share: 3 },
  { name: 'fg', cls: 'bg-fg', share: 2 },
  { name: 'green', cls: 'bg-green', share: 1.2 },
  { name: 'amber', cls: 'bg-amber', share: 0.9 },
  { name: 'red', cls: 'bg-red', share: 0.9 },
  { name: 'mint', cls: 'bg-mint', share: 1 },
];

const CZ_UPPER = 'ĚŠČŘŽÝÁÍÉŮÚŤĎŇ';
const CZ_LOWER = `ěščřžýáíéůúťďň 4${NB}990${NB}Kč 0,1${NB}%`;

function Label({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`text-label text-muted ${className}`} style={style}>
      {children}
    </div>
  );
}

function TypeBoard() {
  return (
    <div className="absolute inset-0 bg-night">
      <div className="absolute top-edge left-edge text-hero">
        Příliš žluťoučký
        <br />
        kůň úpěl.
      </div>

      <div className="absolute bottom-edge left-edge flex items-baseline gap-14">
        <span className="text-number tabular-nums">4{NB}990</span>
        <span className="text-word">Platby.</span>
      </div>

      <div className="absolute right-edge bottom-[190px] flex w-[640px] flex-col gap-5">
        {(
          [
            ['400', 'font-normal'],
            ['500', 'font-medium'],
            ['700', 'font-bold'],
            ['mono', 'font-mono'],
          ] as const
        ).map(([name, cls]) => (
          <div key={name} className={`text-label ${cls}`}>
            <span className="inline-block w-[3.2em] text-muted">{name}</span>
            {CZ_UPPER}
            <br />
            <span className="inline-block w-[3.2em]" />
            {CZ_LOWER}
          </div>
        ))}
        <div className="text-label">
          <span className="inline-block w-[3.2em] text-muted">glyph</span>
          Česko <Glyph name="arrow" /> Slovensko · 5,0{NB}
          <Glyph name="star" />
        </div>
      </div>
      <Label className="absolute right-edge bottom-edge">hero · number · word · label</Label>
    </div>
  );
}

function ColorBoard() {
  return (
    <div className="absolute inset-0 bg-night">
      <div className="absolute top-[200px] left-edge flex items-end gap-16">
        <Logo className="w-[980px]" />
        <Logo mono className="mb-2 w-[300px] text-muted" />
      </div>
      <Label className="absolute top-[520px] left-edge">
        Logo · Space Grotesk 700, −0,02em, IQ v mint
      </Label>

      <div className="absolute right-edge bottom-[230px] left-edge">
        <div className="flex h-[72px] w-full overflow-hidden outline outline-line">
          {swatches.map((s) => (
            <div key={s.name} className={s.cls} style={{ width: `${s.share}%` }} />
          ))}
        </div>
        <div className="relative mt-3 h-[88px] whitespace-nowrap">
          {swatches.map((s, i) =>
            s.share >= 9 ? (
              <Label
                key={s.name}
                className="absolute top-0"
                // Popisek začíná tam, kde začíná jeho pruh.
                style={{ left: `${swatches.slice(0, i).reduce((n, x) => n + x.share, 0)}%` }}
              >
                {s.name}
              </Label>
            ) : null,
          )}
          <Label className="absolute top-[46px] right-0">
            night-2 · line · muted · fg · green · amber · red · mint
          </Label>
        </div>
      </div>
      <Label className="absolute bottom-edge left-edge">
        šířka = podíl na plátně · mint jen na jedno slovo
      </Label>
    </div>
  );
}

function MotionBoard({ on }: { on: boolean }) {
  const states: WordState[] = on ? ['dim', 'lit', 'dim'] : ['hidden', 'hidden', 'lit'];
  return (
    <div className="absolute inset-0 bg-night">
      {/* Papír: výpis tak, jak ho správce vidí. Mírně pootočený, posunutý z osy. */}
      <div className="absolute top-0 left-0 h-[620px] w-[1040px] bg-paper">
        <div className="absolute top-[120px] left-[120px] origin-top-left -rotate-[1.2deg]">
          {rows.map((r, i) => (
            <StatementRow key={r.vs} {...r} tone="paper" className={i === 2 ? '' : 'opacity-70'} />
          ))}
        </div>
        <Label className="absolute bottom-[56px] left-[120px] text-ink/50">
          StatementRow · paper
        </Label>
      </div>

      <div className="absolute top-[150px] right-edge text-right">
        <Counter to={300} active={on} mode="normal" className="text-number" />
        <Label>Counter · ease.out</Label>
      </div>

      <div className="absolute top-[700px] left-edge">
        <StatementRow {...rows[0]!} matched={on} />
        <Label className="mt-4">StatementRow · {on ? 'matched' : 'raw'}</Label>
      </div>

      <div className="absolute right-edge bottom-[150px] text-right">
        <Strike drawn={on}>
          <span className="text-number tabular-nums">1{NB}200</span>
        </Strike>
        <Label>Strike</Label>
      </div>

      <div className="absolute bottom-edge left-edge flex items-baseline gap-12 text-word">
        <Word state={states[0]!}>Banka.</Word>
        <Word state={states[1]!}>Excel.</Word>
        <Word state={states[2]!} accent>
          WhatsApp.
        </Word>
        <Label>Word · {states.join(' / ')}</Label>
      </div>
    </div>
  );
}

function FrameBoard({ on }: { on: boolean }) {
  return (
    <div className="absolute inset-0 bg-black">
      <div className="absolute top-[150px] left-edge w-[980px]">
        <LaptopFrame>
          <Placeholder
            ratio="16/10"
            label={`Screenshot: platby, 2880${NB}×${NB}1800${NB}px`}
            className="h-full w-full"
          />
        </LaptopFrame>
        <Label className="mt-6">LaptopFrame · Placeholder</Label>
      </div>

      <div className="absolute top-[150px] right-edge w-[400px]">
        <Placeholder ratio="4/5" label={`Foto Kryštof, 4:5, min.${NB}1200${NB}×${NB}1500${NB}px`} />
      </div>

      <svg className="absolute right-0 bottom-0 h-[460px] w-[760px]" viewBox="0 0 760 460">
        <FlowLine d="M 20 120 C 200 120, 300 230, 420 230" active={on} mode="normal" />
        <FlowLine d="M 20 400 C 200 400, 300 230, 420 230" active={on} mode="normal" />
        <FlowLine d="M 230 20 C 300 100, 340 230, 420 230" active={on} mode="normal" />
      </svg>
      <Logo className="absolute right-[120px] bottom-[195px] w-[220px]" />
      <Label className="absolute right-edge bottom-[56px]">FlowLine · {on ? 'tok' : 'klid'}</Label>
    </div>
  );
}

const boards = [TypeBoard, ColorBoard, MotionBoard, FrameBoard];
const backgrounds = ['night', 'night', 'night', 'black'] as const;

export function Styleguide() {
  const [board, setBoard] = useState(0);
  const [on, setOn] = useState(false);

  useEffect(() => {
    MotionGlobalConfig.instantAnimations = false;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setBoard((b) => Math.min(boards.length - 1, b + 1));
      else if (e.key === 'ArrowLeft') setBoard((b) => Math.max(0, b - 1));
      else if (e.key === ' ') setOn((v) => !v);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const Board = boards[board]!;
  return (
    <Stage background={backgrounds[board]!}>
      <Board on={on} />
      <div className="absolute bottom-6 left-6 font-mono text-label text-muted/60">
        {board + 1}/{boards.length}
      </div>
    </Stage>
  );
}
