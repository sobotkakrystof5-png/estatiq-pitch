// Kresba dashboardu „Finance“ z EstatIQ s fiktivními daty (S4, krok Platby). Vzhled kopíruje dodaný screenshot,
// čísla se přepočítávají po každé události z `paymentsDemoEvents`. Pracuje v pevném poli 2000×1250 a škáluje se na šířku.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { formatCount, useElementSize } from '../../design/primitives';
import { dashboard } from '../../motion/presets';
import type { DeckMode } from '../../deck/types';
import {
  paymentsDemoEvents as events,
  paymentsDemoHistory as history,
  paymentsDemoMonths as months,
  paymentsDemoStatic as fixed,
  type DemoEvent,
} from '../../content/paymentsDemo';

const W = 2000;
const H = 1250;
const NB = ' ';
const MINUS = '−';

type Totals = { income: number; expense: number; debts: number; balance: number };

function totalsAt(n: number): Totals {
  let income = 0;
  let expense = 0;
  let debts = 0;
  for (const e of events.slice(0, n)) {
    if (e.kind === 'income') income += e.amount;
    if (e.kind === 'expense') expense += e.amount;
    if (e.kind === 'overdue') debts += e.amount;
    if (e.kind === 'settled') {
      debts -= e.amount;
      income += e.amount;
    }
  }
  return { income, expense, debts, balance: income - expense };
}

/** Plynulý přechod čísla k cíli; v instant režimu a při sestupu skočí. */
function useTween(target: number, mode: DeckMode): MotionValue<number> {
  const value = useMotionValue(target);
  useEffect(() => {
    if (mode === 'instant') {
      value.jump(target);
      return;
    }
    const controls = animate(value, target, dashboard.tween);
    return () => controls.stop();
  }, [target, mode, value]);
  return value;
}

const money = (v: number, signed = false) => {
  const sign = signed ? (v >= 0 ? '+' : MINUS) : '';
  return `${sign}${formatCount(Math.abs(v))}${NB}Kč`;
};

function Money({ value, signed = false }: { value: MotionValue<number>; signed?: boolean }) {
  const text = useTransform(value, (v) => money(v, signed));
  return <motion.span className="tabular-nums">{text}</motion.span>;
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="31"
      height="31"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const icons = {
  wallet: (
    <Icon>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </Icon>
  ),
  trend: (
    <Icon>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </Icon>
  ),
  clock: (
    <Icon>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  ),
  alert: (
    <Icon>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </Icon>
  ),
  shield: (
    <Icon>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  ),
  bank: (
    <Icon>
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </Icon>
  ),
  gauge: (
    <Icon>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </Icon>
  ),
  arrow: (
    <Icon>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Icon>
  ),
};

type Tone = 'mint' | 'red' | 'blue' | 'amber' | 'teal';
const toneBox: Record<Tone, string> = {
  mint: 'bg-mint/10 text-mint',
  red: 'bg-red/15 text-red',
  blue: 'bg-blue-400/10 text-blue-400',
  amber: 'bg-amber/15 text-amber',
  teal: 'bg-teal-400/10 text-teal-400',
};

function Card({
  x,
  y,
  w,
  h,
  label,
  icon,
  tone,
  pulse = 0,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  icon: keyof typeof icons;
  tone: Tone;
  /** Mění se s každou událostí, která se karty týká; kartou při změně krátce problikne mint linka. */
  pulse?: number;
  children: ReactNode;
}) {
  return (
    <div
      className="absolute rounded-[34px] border-2 border-line bg-night-2"
      style={{ left: x, top: y, width: w, height: h }}
    >
      {pulse > 0 && (
        <motion.div
          key={pulse}
          aria-hidden
          className="absolute -inset-[2px] rounded-[34px] border-2 border-mint"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={dashboard.flash}
        />
      )}
      <div
        className="absolute text-[27px] font-medium text-muted"
        style={{ left: 36, top: 0, height: 126, display: 'flex', alignItems: 'center' }}
      >
        <span className="text-fg/70">{label}</span>
      </div>
      <div
        className={`absolute flex h-[61px] w-[61px] items-center justify-center rounded-[19px] ${toneBox[tone]}`}
        style={{ right: 35, top: 32 }}
      >
        {icons[icon]}
      </div>
      {children}
    </div>
  );
}

const value = 'absolute text-[58px] font-bold leading-none tracking-[-0.02em] text-fg';
const sub = 'absolute text-[23px] text-muted';

const CHART = { left: 147, right: 1270, top: 777, bottom: 1095, max: 40 } as const;
const pointX = (i: number) => CHART.left + ((CHART.right - CHART.left) * i) / (months.length - 1);
const pointY = (thousands: number) =>
  CHART.bottom - (Math.min(thousands, CHART.max) / CHART.max) * (CHART.bottom - CHART.top);

function Chart({ income, active }: { income: MotionValue<number>; active: boolean }) {
  const octY = useTransform(income, (v) => pointY(v / 1000));
  const line = useTransform(octY, (y) => {
    const head = history.map((v, i) => `${i === 0 ? 'M' : 'L'}${pointX(i)} ${pointY(v)}`).join(' ');
    return `${head} L${pointX(history.length)} ${y}`;
  });
  const area = useTransform(
    line,
    (d) => `${d} L${CHART.right} ${CHART.bottom} L${CHART.left} ${CHART.bottom} Z`,
  );
  const ticks = [40, 30, 20, 10, 0];
  return (
    <svg className="absolute inset-0" width={W} height={H} fill="none" aria-hidden>
      {ticks.map((t, i) => {
        const y = CHART.top + ((CHART.bottom - CHART.top) * i) / (ticks.length - 1);
        return (
          <g key={t}>
            <line
              x1={CHART.left}
              x2={CHART.right}
              y1={y}
              y2={y}
              stroke="var(--color-fg)"
              strokeWidth="2"
              strokeDasharray="7 6"
            />
            <text x={133} y={y + 8} textAnchor="end" fontSize="23" fill="var(--color-muted)">
              {t}k
            </text>
          </g>
        );
      })}
      {months.map((m, i) => (
        <g key={m}>
          <line
            x1={pointX(i)}
            x2={pointX(i)}
            y1={CHART.top}
            y2={CHART.bottom}
            stroke="var(--color-fg)"
            strokeWidth="2"
            strokeDasharray="7 6"
          />
          <text
            x={pointX(i) - (i === months.length - 1 ? 5 : 0)}
            y={1122}
            textAnchor="middle"
            fontSize="23"
            fill="var(--color-muted)"
          >
            {m}
          </text>
        </g>
      ))}
      <motion.path d={area} fill="var(--color-mint)" fillOpacity={active ? 0.14 : 0} />
      <motion.path d={line} stroke="var(--color-mint)" strokeWidth="5" strokeLinejoin="round" />
      {history.map((v, i) => (
        <circle
          key={i}
          cx={pointX(i)}
          cy={pointY(v)}
          r="8"
          fill="var(--color-night-2)"
          stroke="var(--color-mint)"
          strokeWidth="4"
        />
      ))}
      <motion.circle
        cx={pointX(history.length)}
        cy={octY}
        r="9"
        fill="var(--color-night-2)"
        stroke="var(--color-mint)"
        strokeWidth="4"
      />
    </svg>
  );
}

const ROW_H = 76;
const ROWS_TOP = 790;
const VISIBLE_ROWS = 3;

const kindLabel = (e: DemoEvent, settled: boolean) =>
  settled
    ? 'zaplaceno'
    : e.kind === 'income'
      ? 'zaplaceno'
      : e.kind === 'expense'
        ? 'výdaj'
        : 'po splatnosti';

function PaymentRow({
  event,
  slot,
  settled,
  mode,
}: {
  event: DemoEvent;
  slot: number;
  settled: boolean;
  mode: DeckMode;
}) {
  const overdue = event.kind === 'overdue' && !settled;
  const incoming = event.kind === 'income' || settled;
  const amount = `${incoming ? '+' : event.kind === 'expense' ? MINUS : ''}${formatCount(event.amount)}${NB}Kč`;
  const tone = overdue ? 'text-red' : incoming ? 'text-mint' : 'text-fg';
  return (
    <motion.div
      className="absolute flex items-center justify-between"
      style={{ left: 1402, width: 539, top: ROWS_TOP, height: ROW_H - 8 }}
      initial={mode === 'normal' ? { y: slot * ROW_H - 28, opacity: 0 } : false}
      animate={{ y: slot * ROW_H, opacity: slot < VISIBLE_ROWS ? 1 : 0 }}
      transition={dashboard.rowIn}
    >
      <div className="flex items-center gap-[18px]">
        <div className="relative h-[16px] w-[16px]">
          <span
            className={`absolute inset-0 rounded-full ${event.kind === 'expense' ? 'bg-muted' : 'bg-red'}`}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-mint"
            initial={false}
            animate={{ opacity: overdue || event.kind === 'expense' ? 0 : 1 }}
            transition={dashboard.settle}
          />
        </div>
        <div>
          <div className="text-[27px] font-medium leading-[1.15] text-fg">{event.title}</div>
          <div className="text-[21px] leading-[1.3] text-muted">
            {event.date} · {kindLabel(event, settled)}
          </div>
        </div>
      </div>
      <motion.div
        className={`text-[27px] font-bold tabular-nums ${tone}`}
        key={settled ? 'settled' : 'open'}
        initial={settled && mode === 'normal' ? { opacity: 0.2 } : false}
        animate={{ opacity: 1 }}
        transition={dashboard.settle}
      >
        {amount}
      </motion.div>
    </motion.div>
  );
}

export function PaymentsDashboard({
  active,
  play,
  mode,
}: {
  /** Krok „Platby.“ je na řadě; jinak se rovnou ukáže konečný stav. */
  active: boolean;
  /** Nástup přišel vpřed v normálním režimu, takže se události přehrají jedna po druhé. */
  play: boolean;
  mode: DeckMode;
}) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const [n, setN] = useState(play ? 0 : events.length);

  useEffect(() => {
    if (!play || mode !== 'normal') return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setN((prev) => Math.max(prev, i));
      if (i < events.length) timer = setTimeout(tick, dashboard.tick * 1000);
    };
    timer = setTimeout(tick, dashboard.start * 1000);
    return () => clearTimeout(timer);
  }, [play, mode]);

  // Mimo krok „Platby.“ se přehrávání dokončí, takže návrat vždy ukáže hotový stav.
  const shown = active ? n : events.length;
  const now = totalsAt(shown);
  const income = useTween(now.income, mode);
  const expense = useTween(now.expense, mode);
  const debts = useTween(now.debts, mode);
  const balance = useTween(now.balance, mode);
  const previous = history[history.length - 1]! * 1000;
  const delta = Math.round(((now.income - previous) / previous) * 100);
  const deltaText = `${delta >= 0 ? '+' : MINUS}${Math.abs(delta)}${NB}%`;

  const pulses = useMemo(() => {
    const count = (kinds: DemoEvent['kind'][]) =>
      events.slice(0, shown).filter((e) => kinds.includes(e.kind)).length;
    return {
      income: count(['income', 'settled']),
      balance: count(['income', 'settled', 'expense']),
      expense: count(['expense']),
      debts: count(['overdue', 'settled']),
    };
  }, [shown]);
  const animated = mode === 'normal' && play;

  const rows = events
    .map((e, i) => ({ e, i }))
    .filter(({ e, i }) => e.kind !== 'settled' && i < shown);
  const settledTitles = new Set(
    events
      .slice(0, shown)
      .filter((e) => e.kind === 'settled')
      .map((e) => e.title),
  );
  const scale = size.width > 0 ? size.width / W : 0.484;

  return (
    <div ref={ref} className="relative aspect-[16/10] w-full overflow-hidden bg-night">
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        <Card
          x={29}
          y={0}
          w={467}
          h={252}
          label="Příjmy tento měsíc"
          icon="wallet"
          tone="mint"
          pulse={animated ? pulses.income : 0}
        >
          <div className={value} style={{ left: 36, top: 122 }}>
            <Money value={income} />
          </div>
          <div className={`${sub} flex items-center gap-[10px]`} style={{ left: 36, top: 190 }}>
            <span
              className={`flex items-center gap-[10px] ${delta >= 0 ? 'text-mint' : 'text-red'}`}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {delta >= 0 ? (
                  <>
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </>
                ) : (
                  <>
                    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                    <polyline points="16 17 22 17 22 11" />
                  </>
                )}
              </svg>
              {deltaText}
            </span>
            <span>oproti minulému měsíci</span>
          </div>
        </Card>

        <Card
          x={525}
          y={0}
          w={466}
          h={252}
          label="Zůstatek"
          icon="trend"
          tone="mint"
          pulse={animated ? pulses.balance : 0}
        >
          <div className={`${value} !text-mint`} style={{ left: 36, top: 122 }}>
            <Money value={balance} signed />
          </div>
          <div className={sub} style={{ left: 36, top: 190 }}>
            příjmy – výdaje
          </div>
        </Card>

        <Card
          x={1020}
          y={0}
          w={467}
          h={225}
          label="Výdaje tento měsíc"
          icon="clock"
          tone="red"
          pulse={animated ? pulses.expense : 0}
        >
          <div className={value} style={{ left: 36, top: 122 }}>
            <Money value={expense} />
          </div>
        </Card>

        <Card
          x={1516}
          y={0}
          w={467}
          h={252}
          label="Dluhy"
          icon="alert"
          tone="red"
          pulse={animated ? pulses.debts : 0}
        >
          <div className={value} style={{ left: 36, top: 122 }}>
            <Money value={debts} />
          </div>
          <div className={sub} style={{ left: 36, top: 190 }}>
            po splatnosti
          </div>
        </Card>

        <div
          className="absolute text-[23px] font-medium uppercase text-fg/60"
          style={{ left: 29, top: 305 }}
        >
          Pojistky a úvěry
        </div>

        <Card x={29} y={357} w={632} h={254} label="Pojištění" icon="shield" tone="blue">
          <div className={value} style={{ left: 36, top: 122 }}>
            {fixed.properties}
          </div>
          <div className={sub} style={{ left: 36, top: 190 }}>
            nemovitostí
          </div>
        </Card>
        <Card x={690} y={357} w={632} h={254} label="Úvěry" icon="bank" tone="amber">
          <div className={value} style={{ left: 36, top: 122 }}>
            {money(fixed.loans)}
          </div>
          <div className={sub} style={{ left: 36, top: 190 }}>
            / měs.
          </div>
        </Card>
        <Card x={1351} y={357} w={632} h={254} label="Měřidla" icon="gauge" tone="teal">
          <div className={value} style={{ left: 36, top: 122 }}>
            {fixed.readings}
          </div>
          <div className={sub} style={{ left: 36, top: 190 }}>
            odečty tento měsíc
          </div>
        </Card>

        <div
          className="absolute rounded-[34px] border-2 border-line bg-night-2"
          style={{ left: 29, top: 667, width: 1289, height: 485 }}
        >
          <div
            className="absolute text-[27px] font-medium text-fg/70"
            style={{ left: 42, top: 38 }}
          >
            Příjmy za posledních 6 měsíců
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <Chart income={income} active />
        </div>

        <div
          className="absolute rounded-[34px] border-2 border-line bg-night-2"
          style={{ left: 1360, top: 667, width: 623, height: 485 }}
        >
          <div
            className="absolute text-[27px] font-medium text-fg/70"
            style={{ left: 40, top: 56 }}
          >
            Poslední platby
          </div>
          <div
            className="absolute text-[27px] font-medium text-muted"
            style={{ right: 62, top: 56 }}
          >
            Zobrazit vše
          </div>
        </div>
        <motion.div
          className="absolute text-center text-[27px] text-muted"
          style={{ left: 1402, width: 539, top: 835 }}
          initial={false}
          animate={{ opacity: shown === 0 ? 1 : 0 }}
          transition={dashboard.settle}
        >
          Vše v klidu
        </motion.div>
        {rows.map(({ e, i }, k) => (
          <PaymentRow
            key={i}
            event={e}
            slot={rows.length - 1 - k}
            settled={e.kind === 'overdue' && settledTitles.has(e.title)}
            mode={animated ? 'normal' : 'instant'}
          />
        ))}
        <div className="absolute h-[2px] bg-line" style={{ left: 1402, width: 539, top: 1030 }} />
        <div
          className="absolute flex items-center justify-center gap-[14px] rounded-full border-2 border-line text-[27px] font-medium text-fg"
          style={{ left: 1402, width: 539, top: 1058, height: 54 }}
        >
          Zobrazit vše
          <span className="h-[26px] w-[26px]">{icons.arrow}</span>
        </div>
      </div>
    </div>
  );
}
