// Kresba plánovaných funkcí EstatIQ s fiktivními daty (S4, krok Funkce). Pět dlaždic v pevném poli 2000×1250 se
// rozehraje samo, jedna po druhé; klik animaci dokončí. Stav se odvozuje z kroku (`on`), ne z časovačů.
import type { ReactNode } from 'react';
import { useElementSize } from '../../design/primitives';
import { features } from '../../motion/presets';
import { PhaseContext, Reveal, fade, growX, growY, knob, pop, slideIn, wipe } from '../reveal';
import {
  featuresDemoConsumption as consumption,
  featuresDemoContract as contract,
  featuresDemoEnergy as energy,
  featuresDemoHeader as header,
  featuresDemoHistory as history,
  featuresDemoMarket as market,
  kc,
} from '../../content/featuresDemo';

const W = 2000;
const H = 1250;

const startOf = (index: number) => features.start + index * features.every;

function Tile({
  index,
  span,
  title,
  tag,
  children,
}: {
  index: number;
  span: string;
  title: string;
  tag?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[34px] border-2 border-line bg-night-2 p-[40px] ${span}`}
    >
      <Reveal
        at={startOf(index)}
        pose={wipe}
        className="flex items-baseline justify-between gap-[24px] whitespace-nowrap"
      >
        <div className="text-[48px] leading-none font-semibold text-fg">{title}</div>
        {tag ? <div className="text-[32px] text-muted">{tag}</div> : null}
      </Reveal>
      {children}
    </div>
  );
}

function ContractTile() {
  const t = startOf(0);
  return (
    <Tile index={0} span="col-span-3" title={contract.title} tag={contract.tag}>
      <div className="mt-[26px]">
        {contract.rows.map((row, i) => (
          <Reveal
            key={row.label}
            at={t + 0.1 + i * 0.1}
            pose={wipe}
            className="relative flex h-[72px] items-center justify-between border-t-2 border-line text-[42px]"
          >
            <span className="pl-[4px] text-muted">{row.label}</span>
            <span className="flex items-center gap-[28px] pr-[4px] tabular-nums text-fg">
              {row.review ? (
                <Reveal at={t + 0.65} pose={fade} className="text-[32px] text-amber">
                  {contract.reviewTag}
                </Reveal>
              ) : null}
              {row.value}
            </span>
            {row.review ? (
              <Reveal
                at={t + 0.6}
                pose={fade}
                className="absolute inset-0 border-l-[6px] border-mint bg-mint/10"
              />
            ) : null}
          </Reveal>
        ))}
      </div>
      <Reveal
        at={t + 0.6}
        pose={pop}
        className="mt-[24px] flex h-[84px] w-[300px] items-center justify-center rounded-[22px] bg-mint text-[38px] font-semibold text-night"
        style={{ transformOrigin: 'left center' }}
      >
        {contract.action}
      </Reveal>
    </Tile>
  );
}

const BAR_MAX = 200;
const CHART_H = 250;

function ConsumptionTile() {
  const t = startOf(1);
  const max = Math.max(...consumption.values);
  const last = consumption.values.length - 1;
  return (
    <Tile index={1} span="col-span-3" title={consumption.title} tag={consumption.unit}>
      <div className="mt-[22px] flex justify-between" style={{ height: CHART_H + 42 }}>
        {consumption.values.map((value, i) => {
          const height = (value / max) * BAR_MAX;
          const peak = i === last;
          return (
            <div key={consumption.months[i]} className="flex w-[100px] flex-col items-center">
              <div className="flex w-full flex-col justify-end" style={{ height: CHART_H }}>
                {peak ? (
                  <Reveal
                    at={t + 0.45}
                    pose={fade}
                    className="pb-[6px] text-center text-[40px] leading-none font-bold tabular-nums text-fg"
                  >
                    {value}
                  </Reveal>
                ) : null}
                <Reveal
                  at={t + 0.1 + i * 0.06}
                  pose={growY}
                  bar
                  className={`w-full rounded-t-[10px] ${peak ? 'bg-amber' : 'bg-muted/45'}`}
                  style={{ height, transformOrigin: 'bottom' }}
                />
              </div>
              <div className="mt-[10px] text-[30px] leading-none text-muted">
                {consumption.months[i]}
              </div>
            </div>
          );
        })}
      </div>
      <Reveal
        at={t + 0.6}
        pose={wipe}
        className="mt-[20px] flex h-[84px] items-center rounded-[22px] border-2 border-line bg-night px-[32px] text-[38px] text-fg"
      >
        {consumption.note}
      </Reveal>
    </Tile>
  );
}

function EnergyTile() {
  const t = startOf(2);
  const max = Math.max(...energy.offers.map((o) => o.yearly));
  const min = Math.min(...energy.offers.map((o) => o.yearly));
  return (
    <Tile index={2} span="col-span-2" title={energy.title}>
      <div className="mt-[26px] flex flex-col gap-[20px]">
        {energy.offers.map((offer, i) => {
          const best = offer.yearly === min;
          return (
            <div key={offer.name}>
              <Reveal
                at={t + 0.1 + i * 0.1}
                pose={wipe}
                className="flex items-baseline justify-between text-[36px]"
              >
                <span className={best ? 'text-fg' : 'text-muted'}>{offer.name}</span>
                <span className={`tabular-nums ${best ? 'font-bold text-mint' : 'text-fg'}`}>
                  {kc(offer.yearly)}
                </span>
              </Reveal>
              <div className="mt-[10px] h-[12px] rounded-full bg-line">
                <Reveal
                  at={t + 0.2 + i * 0.1}
                  pose={growX}
                  bar
                  className={`h-full rounded-full ${best ? 'bg-mint' : 'bg-muted/45'}`}
                  style={{ width: `${(offer.yearly / max) * 100}%`, transformOrigin: 'left' }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <Reveal
        at={t + 0.6}
        pose={wipe}
        className="mt-[26px] flex items-baseline justify-between border-t-2 border-line pt-[18px]"
      >
        <span className="text-[32px] text-muted">{energy.savingLabel}</span>
        <span className="text-[44px] leading-none font-bold tabular-nums text-mint">
          {kc(energy.offers[0].yearly - min)}
        </span>
      </Reveal>
    </Tile>
  );
}

function HistoryTile() {
  const t = startOf(3);
  return (
    <Tile index={3} span="col-span-2" title={history.title}>
      <Reveal at={t + 0.1} pose={wipe} className="mt-[22px] text-[30px] text-muted">
        {history.historyLabel}
      </Reveal>
      <div className="mt-[8px] flex gap-[8px]">
        {Array.from({ length: history.months }, (_, i) => (
          <Reveal
            key={i}
            at={t + 0.15 + i * 0.025}
            pose={pop}
            className={`h-[36px] w-[36px] rounded-[8px] ${
              (history.late as readonly number[]).includes(i) ? 'bg-amber' : 'bg-mint'
            }`}
          />
        ))}
      </div>
      <Reveal
        at={t + 0.5}
        pose={wipe}
        className="mt-[20px] flex h-[60px] items-center justify-between text-[38px] text-fg"
      >
        <span>{history.shareLabel}</span>
        <span className="relative h-[60px] w-[116px] rounded-full bg-line">
          <Reveal at={t + 0.7} pose={fade} className="absolute inset-0 rounded-full bg-mint" />
          <Reveal
            at={t + 0.7}
            pose={knob}
            className="absolute top-[6px] left-[6px] h-[48px] w-[48px] rounded-full bg-fg"
          />
        </span>
      </Reveal>
      <div className="mt-[18px] flex gap-[8px]">
        {history.checks.map((check, i) => (
          <Reveal
            key={check}
            at={t + 0.6 + i * 0.08}
            pose={wipe}
            className="flex h-[56px] items-center rounded-[16px] border-2 border-line bg-night px-[16px] text-[32px] text-fg"
          >
            {check}
          </Reveal>
        ))}
      </div>
      <Reveal at={t + 0.85} pose={wipe} className="mt-[10px] text-[34px] text-amber">
        {history.checkStatus}
      </Reveal>
      <Reveal at={t + 0.95} pose={fade} className="mt-[2px] text-[32px] text-muted">
        {history.decision}
      </Reveal>
    </Tile>
  );
}

function MarketTile() {
  const t = startOf(4);
  return (
    <Tile index={4} span="col-span-2" title={market.title} tag={market.tag}>
      <Reveal at={t + 0.1} pose={wipe} className="mt-[26px] text-[32px] text-muted">
        {market.request}
      </Reveal>
      <div className="mt-[18px] flex flex-col gap-[14px]">
        {market.offers.map((offer, i) => (
          <Reveal
            key={offer.name}
            at={t + 0.2 + i * 0.12}
            pose={slideIn}
            className={`relative flex h-[84px] items-center justify-between rounded-[20px] border-2 px-[26px] text-[32px] ${
              offer.chosen ? 'border-mint bg-mint/10' : 'border-line bg-night'
            }`}
          >
            <span className="truncate text-fg">{offer.name}</span>
            <span className="flex items-center gap-[18px] tabular-nums">
              {offer.chosen ? (
                <span className="text-[28px] text-mint">{market.chosenTag}</span>
              ) : null}
              <span className={offer.chosen ? 'font-bold text-mint' : 'text-fg'}>
                {kc(offer.price)}
              </span>
            </span>
          </Reveal>
        ))}
      </div>
    </Tile>
  );
}

export function FeaturesScene({ on, animated }: { on: boolean; animated: boolean }) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const scale = size.width > 0 ? size.width / W : 0.484;

  return (
    <PhaseContext.Provider value={{ on, animated }}>
      <div ref={ref} className="relative aspect-[16/10] w-full overflow-hidden bg-night">
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          <div
            className="absolute flex items-center gap-[8px] rounded-[30px] border-2 border-line bg-night-2 p-[10px]"
            style={{ left: 29, top: 0 }}
          >
            <div className="flex h-[84px] items-center rounded-[22px] bg-mint px-[36px] text-[31px] font-semibold text-night">
              {header.tab}
            </div>
          </div>
          <div
            className="absolute flex h-[84px] items-center rounded-[22px] border-2 border-amber px-[32px] text-[34px] font-semibold text-amber"
            style={{ right: 29, top: 10 }}
          >
            {header.badge}
          </div>
          <div
            className="absolute grid gap-[22px]"
            style={{
              left: 29,
              top: 140,
              width: 1942,
              height: 1110,
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: '560px 528px',
            }}
          >
            <ContractTile />
            <ConsumptionTile />
            <EnergyTile />
            <HistoryTile />
            <MarketTile />
          </div>
        </div>
      </div>
    </PhaseContext.Provider>
  );
}
