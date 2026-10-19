// S1 · Kdo jsem · tma. Fotka vlevo z osy, jméno vpravo dole, důkazy pod fotkou.
// Krok 2 je most do S2: zespodu vystoupá papír a na něm prosakují řádky výpisu.
import { useState } from 'react';
import { motion } from 'motion/react';
import { Placeholder, StatementRow } from '../design/primitives';
import { bridge, intro, stepReveal } from '../motion/presets';
import { s1, text } from '../content/slides';
import type { SlideProps } from '../deck/types';

const { screen, rows } = s1;

const SHOWN = 'inset(-10% 0% -10% 0%)';
const WIPED = 'inset(-10% 100% -10% 0%)';

export function S01Intro({ step, mode, direction }: SlideProps) {
  // Nástup jen při běžném příchodu na krok 0. Zpětný krok, skok a instant ukážou hotový stav.
  const [play] = useState(() => step === 0 && mode === 'normal' && direction === 1);

  return (
    <div className="absolute inset-0 text-fg">
      <motion.div
        className="absolute"
        style={{ left: 220, top: 150, height: 486 }}
        initial={play ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={intro.photo}
      >
        <Placeholder ratio="4/5" label={text(screen.photo)} className="h-full" />
      </motion.div>

      {/* Důkazy: zleva doprava pod fotkou, naposledy. */}
      <motion.div
        data-testid="s1-proofs"
        className="absolute text-label text-fg"
        style={{ left: 220, top: 700 }}
        initial={false}
        animate={{ clipPath: step >= 1 ? SHOWN : WIPED }}
        transition={stepReveal}
      >
        <div className="flex items-center gap-8">
          <Placeholder ratio="3/1" label={text(screen.logoAlteno)} className="h-[104px] p-3!" />
          <span>{text(screen.cross)}</span>
          <Placeholder ratio="3/1" label={text(screen.logoVizeon)} className="h-[104px] p-3!" />
        </div>
        <p className="mt-8">{text(screen.projects)}</p>
      </motion.div>

      <div className="absolute" style={{ right: 120, bottom: 150 }}>
        <motion.h1
          className="text-hero"
          initial={play ? { opacity: 0, y: intro.rise } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={intro.name}
        >
          {text(screen.firstName)}
          <br />
          {text(screen.lastName)}
        </motion.h1>
        <motion.p
          className="mt-8 text-label text-muted"
          initial={play ? { opacity: 0, y: intro.rise } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={intro.role}
        >
          {text(screen.role)}
        </motion.p>
      </div>

      {/* Most do S2: papír zespodu, řádky vystoupají s ním. */}
      <motion.div
        data-testid="s1-bridge"
        className="absolute inset-0 bg-paper"
        initial={false}
        animate={{
          clipPath: step >= 2 ? `inset(${bridge.paperTop}% 0% 0% 0%)` : 'inset(100% 0% 0% 0%)',
        }}
        transition={bridge.transition}
      >
        <motion.div
          className="absolute"
          style={{ left: 220, top: 680 }}
          initial={false}
          animate={{ y: step >= 2 ? 0 : bridge.rowsRise }}
          transition={bridge.transition}
        >
          {rows.bridge.map((r) => (
            <StatementRow key={r.vs} {...r} tone="paper" />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
