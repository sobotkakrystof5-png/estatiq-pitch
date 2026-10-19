// Z1–Z7 · zálohy pro otázky. Každý diagram drží jedinou myšlenku a žádné odrážky.
import type { ReactNode } from 'react';
import { Logo } from '../../design/primitives';
import { z1, z2, z3, z4, z5, z6, z7, text } from '../../content/slides';

function AbsoluteText({
  children,
  className = '',
  left,
  top,
}: {
  children: ReactNode;
  className?: string;
  left: number;
  top: number;
}) {
  return (
    <p className={`absolute whitespace-nowrap text-word ${className}`} style={{ left, top }}>
      {children}
    </p>
  );
}

export function Z01BusinessModel() {
  return (
    <div data-testid="backup-z1" className="absolute inset-0 overflow-hidden text-fg">
      <svg aria-hidden className="absolute inset-0 size-full" viewBox="0 0 1920 1080">
        <path
          d="M 490 255 C 660 255 700 455 845 505"
          className="fill-none stroke-line"
          strokeWidth="2"
        />
        <path
          d="M 1430 255 C 1260 255 1220 455 1075 505"
          className="fill-none stroke-line"
          strokeWidth="2"
        />
        <path
          d="M 480 775 C 660 775 700 625 845 575"
          className="fill-none stroke-line"
          strokeWidth="2"
        />
        <path
          d="M 1440 775 C 1260 775 1220 625 1075 575"
          className="fill-none stroke-line"
          strokeWidth="2"
        />
        <path
          d="M 700 435 C 760 470 800 495 845 505"
          className="fill-none stroke-mint opacity-55"
          strokeWidth="2"
        />
        <path
          d="M 1220 435 C 1160 470 1120 495 1075 505"
          className="fill-none stroke-mint opacity-55"
          strokeWidth="2"
        />
        <path
          d="M 700 630 C 760 600 800 580 845 575"
          className="fill-none stroke-mint opacity-55"
          strokeWidth="2"
        />
        <path
          d="M 1220 630 C 1160 600 1120 580 1075 575"
          className="fill-none stroke-mint opacity-55"
          strokeWidth="2"
        />
      </svg>
      <AbsoluteText left={150} top={200}>
        {text(z1.screen.subscription)}
      </AbsoluteText>
      <AbsoluteText left={1300} top={200}>
        {text(z1.screen.credits)}
      </AbsoluteText>
      <AbsoluteText left={150} top={720}>
        {text(z1.screen.commission)}
      </AbsoluteText>
      <AbsoluteText left={1200} top={720}>
        {text(z1.screen.implementation)}
      </AbsoluteText>
      <Logo className="absolute left-[770px] top-[472px] w-[380px]" />
    </div>
  );
}

export function Z02Pricing() {
  return (
    <div
      data-testid="backup-z2"
      className="absolute inset-0 flex items-center justify-center px-edge text-fg"
    >
      <p className="max-w-[1400px] text-center text-word">{text(z2.screen.price)}</p>
    </div>
  );
}

export function Z03Positioning() {
  return (
    <div data-testid="backup-z3" className="absolute inset-0 overflow-hidden text-fg">
      <div
        data-testid="z3-positioning"
        aria-label={`${text(z3.screen.evidence)} ${text(z3.screen.layer)}`}
        className="absolute inset-0"
      >
        <div className="absolute left-[250px] right-[260px] top-[530px] h-[2px] bg-line" />
        <AbsoluteText left={250} top={420} className="text-muted">
          {text(z3.screen.evidence)}
        </AbsoluteText>
        <AbsoluteText left={1160} top={420} className="text-mint">
          {text(z3.screen.layer)}
        </AbsoluteText>
        <Logo className="absolute left-[1200px] top-[620px] w-[400px]" />
      </div>
    </div>
  );
}

export function Z04Roadmap() {
  const milestones = [
    z4.screen.system,
    z4.screen.transaction,
    z4.screen.investor,
    z4.screen.marketplace,
  ] as const;
  const positions = [200, 610, 1050, 1450] as const;

  return (
    <div data-testid="backup-z4" className="absolute inset-0 overflow-hidden text-fg">
      <div className="absolute left-[230px] right-[230px] top-[550px] h-[2px] bg-line" />
      {milestones.map((milestone, index) => (
        <div key={index} className="absolute top-[550px]" style={{ left: positions[index] }}>
          <span className="block size-6 -translate-y-1/2 rounded-full bg-mint" />
          <p className="absolute left-1/2 top-[-135px] -translate-x-1/2 whitespace-nowrap text-word">
            {text(milestone)}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Z05Team() {
  return (
    <div data-testid="backup-z5" className="absolute inset-0 overflow-hidden text-fg">
      <p className="absolute left-[150px] top-[380px] whitespace-nowrap text-hero">
        {text(z5.screen.founder)}
      </p>
      <div className="absolute left-[1020px] top-[285px] w-[760px]">
        <p className="text-label text-muted">{text(z5.screen.salesRole)}</p>
        <p data-testid="z5-sales-placeholder" className="mt-3 text-word">
          {text(z5.screen.salesPerson)}
        </p>
        <p className="mt-14 text-label text-muted">{text(z5.screen.industryRole)}</p>
        <p data-testid="z5-industry-placeholder" className="mt-3 text-word">
          {text(z5.screen.industryPerson)}
        </p>
      </div>
    </div>
  );
}

export function Z06Finance() {
  return (
    <div data-testid="backup-z6" className="absolute inset-0 overflow-hidden text-fg">
      <p className="absolute left-[270px] top-[335px] text-word">{text(z6.screen.costs)}</p>
      <div className="absolute left-[960px] top-[300px] h-[390px] w-[2px] bg-line" />
      <p className="absolute left-[1120px] top-[335px] text-word">{text(z6.screen.funding)}</p>
      <p className="absolute left-[270px] top-[600px] whitespace-nowrap text-label text-muted">
        {text(z6.screen.detail)}
      </p>
    </div>
  );
}

export function Z07Deposit() {
  const steps = [
    z7.screen.reminders,
    z7.screen.offset,
    z7.screen.replenishment,
    z7.screen.documents,
  ] as const;
  const positions = [300, 740, 1180, 1620] as const;

  return (
    <div data-testid="backup-z7" className="absolute inset-0 overflow-hidden text-fg">
      <p className="absolute left-edge top-[145px] text-word">{text(z7.screen.question)}</p>
      <p className="absolute left-edge top-[265px] text-label text-mint">
        {text(z7.screen.digitalDeposit)}
      </p>
      <div className="absolute left-[210px] right-[210px] top-[625px] h-[2px] bg-line" />
      {steps.map((label, index) => (
        <div
          key={index}
          className="absolute top-[625px] -translate-x-1/2"
          style={{ left: positions[index] }}
        >
          <span className="block size-6 -translate-y-1/2 rounded-full bg-mint" />
          <p className="absolute left-1/2 top-[38px] -translate-x-1/2 whitespace-nowrap text-label">
            {text(label)}
          </p>
        </div>
      ))}
    </div>
  );
}
