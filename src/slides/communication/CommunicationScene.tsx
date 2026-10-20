// Kresba komunikace a ověřeného nájemníka z EstatIQ s fiktivními daty (S4, krok Komunikace). Vlevo vlákno zpráv
// u bytu místo WhatsAppu, vpravo ověřený nájemník s historií plateb. Pole 2000×1250 škálované na displej;
// přehraje se samo (~2,5 s), klik animaci dokončí.
import { useElementSize } from '../../design/primitives';
import { communication } from '../../motion/presets';
import { PhaseContext, Reveal, fade, knob, pop, wipe, type Pose } from '../reveal';
import {
  communicationDemoMessages as messages,
  communicationDemoThread as thread,
  communicationDemoVerified as verified,
} from '../../content/communicationDemo';

const W = 2000;
const H = 1250;

const fromLeft: Pose = {
  hidden: { opacity: 0, x: -communication.bubbleX },
  shown: { opacity: 1, x: 0 },
};
const fromRight: Pose = {
  hidden: { opacity: 0, x: communication.bubbleX },
  shown: { opacity: 1, x: 0 },
};

/** Čas nástupu zprávy v pořadí vlákna (s od vstupu do kroku). */
const messageAt = [0.1, 0.6, 0.9, 1.3, 1.65] as const;

function Tick() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={40}
      height={40}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

function Thread() {
  return (
    <div
      className="absolute overflow-hidden rounded-[34px] border-2 border-line bg-night-2 p-[40px]"
      style={{ left: 29, top: 0, width: 1180, height: 1250 }}
    >
      <div className="flex items-center justify-between">
        <Reveal
          at={communication.start}
          pose={wipe}
          className="text-[52px] leading-none font-semibold whitespace-nowrap text-fg"
        >
          {thread.title}
        </Reveal>
        <div className="flex h-[84px] items-center rounded-[22px] border-2 border-amber px-[32px] text-[34px] font-semibold text-amber">
          {thread.badge}
        </div>
      </div>

      <div className="mt-[56px] flex flex-col gap-[36px]">
        {messages.map((message, i) => {
          const at = messageAt[i] ?? 0;
          if (message.kind === 'event') {
            const paid = message.tone === 'paid';
            return (
              <Reveal
                key={i}
                at={at}
                pose={wipe}
                className="flex items-center gap-[18px] pl-[6px] text-[36px]"
              >
                <span
                  className={`h-[16px] w-[16px] rounded-full ${paid ? 'bg-mint' : 'bg-muted'}`}
                />
                <span className={paid ? 'font-medium text-mint' : 'text-muted'}>
                  {message.text}
                </span>
              </Reveal>
            );
          }
          const own = message.kind === 'out';
          return (
            <Reveal
              key={i}
              at={at}
              pose={own ? fromRight : fromLeft}
              className={`flex flex-col gap-[14px] ${own ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`flex items-end gap-[28px] border-2 px-[34px] py-[26px] text-[46px] leading-[1.15] text-fg ${
                  own
                    ? 'rounded-[30px] rounded-br-[8px] border-mint bg-mint/15'
                    : 'rounded-[30px] rounded-bl-[8px] border-line bg-night'
                }`}
              >
                <span>{message.text}</span>
                <span className="text-[28px] text-muted tabular-nums">{message.time}</span>
              </div>
              {message.chip ? (
                <Reveal
                  at={at + 0.2}
                  pose={fade}
                  className="rounded-[14px] border-2 border-amber px-[18px] py-[6px] text-[30px] text-amber"
                >
                  {message.chip}
                </Reveal>
              ) : null}
            </Reveal>
          );
        })}
      </div>

      <div
        className="absolute flex h-[100px] items-center rounded-[28px] border-2 border-line bg-night px-[36px] text-[38px] text-muted"
        style={{ left: 40, right: 40, bottom: 40 }}
      >
        {thread.composer}
      </div>
    </div>
  );
}

function Verified() {
  const t = communication.start;
  return (
    <div
      className="absolute flex flex-col justify-between overflow-hidden rounded-[34px] border-2 border-line bg-night-2 p-[40px]"
      style={{ left: 1231, top: 0, width: 740, height: 1250 }}
    >
      <div>
        <Reveal
          at={t}
          pose={wipe}
          className="text-[52px] leading-none font-semibold whitespace-nowrap text-fg"
        >
          {verified.title}
        </Reveal>
        <div className="mt-[44px]">
          {verified.checks.map((check, i) => (
            <Reveal
              key={check}
              at={0.5 + i * 0.2}
              pose={wipe}
              className="flex h-[104px] items-center justify-between border-t-2 border-line text-[42px]"
            >
              <span className="text-fg">{check}</span>
              <span className="flex items-center gap-[14px] text-[36px] text-mint">
                <Tick />
                {verified.checkOk}
              </span>
            </Reveal>
          ))}
        </div>
        <Reveal at={1.1} pose={fade} className="mt-[16px] text-[36px] text-muted">
          {verified.once}
        </Reveal>
      </div>

      <div>
        <Reveal at={1.2} pose={wipe} className="text-[32px] text-muted">
          {verified.historyLabel}
        </Reveal>
        <div className="mt-[16px] flex gap-[8px]">
          {Array.from({ length: verified.months }, (_, i) => (
            <Reveal
              key={i}
              at={1.25 + i * 0.03}
              pose={pop}
              className="h-[46px] w-[46px] rounded-[10px] bg-mint"
            />
          ))}
        </div>
        <Reveal
          at={1.7}
          pose={wipe}
          className="mt-[34px] text-[58px] leading-[1.05] font-bold tracking-[-0.02em] whitespace-nowrap text-mint"
        >
          {verified.summary}
        </Reveal>
      </div>

      <Reveal
        at={2.0}
        pose={wipe}
        className="flex h-[64px] items-center justify-between text-[40px] text-fg"
      >
        <span>{verified.shareLabel}</span>
        <span className="relative h-[64px] w-[124px] rounded-full bg-line">
          <Reveal at={2.15} pose={fade} className="absolute inset-0 rounded-full bg-mint" />
          <Reveal
            at={2.15}
            pose={knob}
            className="absolute top-[7px] left-[7px] h-[50px] w-[50px] rounded-full bg-fg"
          />
        </span>
      </Reveal>
    </div>
  );
}

export function CommunicationScene({ on, animated }: { on: boolean; animated: boolean }) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const scale = size.width > 0 ? size.width / W : 0.484;

  return (
    <PhaseContext.Provider value={{ on, animated }}>
      <div ref={ref} className="relative aspect-[16/10] w-full overflow-hidden bg-night">
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          <Thread />
          <Verified />
        </div>
      </div>
    </PhaseContext.Provider>
  );
}
