// S4 · Produkt · tma. Pět obrazovek MVP; dodané snímky jsou skutečné, ostatní zůstávají popsanými placeholdery.
import { useState } from 'react';
import { motion } from 'motion/react';
import { LaptopFrame, Word } from '../design/primitives';
import { stepReveal } from '../motion/presets';
import { s4, text } from '../content/slides';
import type { SlideProps } from '../deck/types';
import overviewShot from '../assets/screens/prehled.png';
import calendarShot from '../assets/screens/kalendar.png';
import propertiesShot from '../assets/screens/nemovitosti.png';
import formShot from '../assets/screens/formular.png';
import consumptionShot from '../assets/screens/spotreba.png';
import { PaymentsDashboard } from './payments/PaymentsDashboard';
import { IntegrationsScene } from './integrations/IntegrationsScene';
import { FeaturesScene } from './features/FeaturesScene';

const { screen } = s4;
const shots = [
  { key: 'paymentShot', label: screen.paymentWord, alt: screen.paymentShot },
  { key: 'ownerShot', label: screen.ownerWord, alt: screen.ownerShot },
  { key: 'consumptionShot', label: screen.consumptionWord, alt: screen.consumptionShot },
  { key: 'featuresShot', label: screen.featuresWord, alt: screen.featuresShot },
  { key: 'integrationsShot', label: screen.integrationsWord, alt: screen.integrationsShot },
] as const;
const stepOf = (key: (typeof shots)[number]['key']) => shots.findIndex((shot) => shot.key === key);
const featuresStep = stepOf('featuresShot');
const integrationsStep = stepOf('integrationsShot');
const summaryStep = shots.length;

/**
 * Čtyři snímky kroku „Přehled nemovitosti“ přes sebe, od zadního po přední: přehled, kalendář,
 * seznam nemovitostí a vpravo nahoře formulář. Tenká linka odděluje tmavé plochy. Pozice jsou v % displeje.
 */
const overviewShots = [
  { src: overviewShot, alt: screen.ownerShot, ratio: '1700 / 913', left: 0, top: 0, width: 58 },
  {
    src: calendarShot,
    alt: screen.calendarShot,
    ratio: '1700 / 967',
    left: 14,
    top: 18,
    width: 58,
  },
  {
    src: propertiesShot,
    alt: screen.propertiesShot,
    ratio: '1700 / 884',
    left: 28,
    top: 40,
    width: 58,
  },
  { src: formShot, alt: screen.formShot, ratio: '1100 / 1037', left: 70, top: 3, width: 30 },
] as const;

function OverviewShots() {
  return (
    <div className="absolute inset-0">
      {overviewShots.map((shot) => (
        <img
          key={shot.src}
          src={shot.src}
          alt={text(shot.alt)}
          className="absolute rounded-[8px] border-2 border-line bg-night-2"
          style={{
            left: `${shot.left}%`,
            top: `${shot.top}%`,
            width: `${shot.width}%`,
            aspectRatio: shot.ratio,
          }}
        />
      ))}
    </div>
  );
}

export function S04Product({ step, mode, direction }: SlideProps) {
  // Fiktivní platby v kroku 0 se přehrají jen při příchodu vpřed v normálním režimu, jinak je vidět hotový stav.
  const [playPayments] = useState(() => step === 0 && mode === 'normal' && direction === 1);

  return (
    <div className="absolute inset-0 text-fg">
      <motion.div
        className="absolute"
        style={{ left: 120, top: 170, width: 1000 }}
        initial={false}
        animate={{ opacity: step < integrationsStep ? 1 : 0 }}
        transition={stepReveal}
      >
        <LaptopFrame>
          <div className="relative h-full w-full">
            {shots.slice(0, integrationsStep).map((shot, index) => {
              const visible = step === index;
              return (
                <motion.div
                  key={shot.key}
                  data-testid={`s4-screen-${index}`}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: visible ? 1 : 0,
                    y: step > index ? -36 : step < index ? 36 : 0,
                  }}
                  transition={stepReveal}
                >
                  {shot.key === 'paymentShot' ? (
                    <PaymentsDashboard active={step === 0} play={playPayments} mode={mode} />
                  ) : shot.key === 'ownerShot' ? (
                    <OverviewShots />
                  ) : shot.key === 'consumptionShot' ? (
                    <img
                      src={consumptionShot}
                      alt={text(shot.alt)}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <FeaturesScene
                      on={step >= featuresStep}
                      animated={step === featuresStep && mode === 'normal'}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </LaptopFrame>
      </motion.div>

      <div className="absolute" style={{ left: 120, top: 160 }}>
        <IntegrationsScene active={step === integrationsStep} mode={mode} />
      </div>

      <div
        className="absolute flex h-[625px] w-[660px] items-center"
        style={{ left: 1220, top: 170 }}
      >
        {shots.map((shot, index) => (
          <div key={shot.key} data-testid="s4-word" className="absolute inset-0 flex items-center">
            <Word
              state={step === index ? 'lit' : 'hidden'}
              className="text-word max-w-full text-balance"
            >
              {text(shot.label)}
            </Word>
          </div>
        ))}
      </div>

      <div
        data-testid="s4-summary"
        className="absolute inset-0 flex items-center justify-center px-edge"
      >
        <Word state={step === summaryStep ? 'lit' : 'hidden'} className="text-word">
          {text(screen.summary)}
        </Word>
      </div>
    </div>
  );
}
