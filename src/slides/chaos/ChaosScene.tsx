// Chaos z S2: výpis z banky, tabulka, bubliny, počítadlo a kulisy. Čistě prezentační.
// S2 ho staví timeline (`hidden` = výchozí stav sekvence), S3 ho kreslí hotový a rozsype.
import type { ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { PaperProp, StatementRow, type StatementRowData } from '../../design/primitives';
import { chaos } from '../../motion/presets';
import { s2, text } from '../../content/slides';
import {
  bubbles,
  counterBox,
  EM,
  flight,
  props,
  ROW_H,
  sheetBox,
  sheetCells,
  sheetRowCount,
  sheetRows,
  sheetWidth,
  statementBox,
} from './layout';

const CLOSED_DOWN = 'inset(0% 0% 100% 0%)';
const OPEN = 'inset(0% 0% 0% 0%)';

const { screen, rows } = s2;

function Prop({
  name,
  label,
  hidden,
}: {
  name: keyof typeof props;
  label: string;
  hidden: boolean;
}) {
  const p = props[name];
  return (
    <motion.div
      data-piece={name}
      className="absolute"
      style={{ left: p.x, top: p.y, width: p.w, rotate: p.rotate }}
    >
      <motion.div data-build="prop" initial={hidden ? { opacity: 0 } : false}>
        <PaperProp kind={name} label={label} />
      </motion.div>
    </motion.div>
  );
}

function Bubble({
  name,
  message,
  time,
  hidden,
}: {
  name: keyof typeof bubbles;
  message: string;
  time: string;
  hidden: boolean;
}) {
  const b = bubbles[name];
  return (
    <motion.div data-piece={name} className="absolute" style={{ left: b.x, top: b.y }}>
      <motion.div
        data-build={name}
        className="relative flex items-end gap-6 rounded-[26px] rounded-bl-[6px] bg-[color-mix(in_srgb,var(--color-mint)_34%,var(--color-paper))] py-5 pr-6 pl-8 text-ink"
        style={{ originX: 0, originY: 1 }}
        initial={hidden ? { opacity: 0, scale: 0.8 } : false}
      >
        <span className="font-sans text-row whitespace-nowrap">{message}</span>
        <span className="text-label leading-none text-ink/45 tabular-nums">{time}</span>
        {/* Ocásek bubliny vlevo dole. */}
        <span
          aria-hidden
          className="absolute -bottom-0 -left-3 h-5 w-4 bg-inherit"
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        />
      </motion.div>
    </motion.div>
  );
}

/** Řádek, který přibude ve smyčce: wipe zleva, když `later` projde jeho indexem. */
function LaterRow({
  row,
  index,
  later,
}: {
  row: StatementRowData;
  index: number;
  later: MotionValue<number>;
}) {
  const clipPath = useTransform(
    later,
    [index, index + chaos.rowWipe],
    ['inset(0% 100% 0% 0%)', OPEN],
  );
  return (
    <motion.div className="absolute left-0" style={{ top: (8 + index) * ROW_H, clipPath }}>
      <StatementRow {...row} tone="paper" />
    </motion.div>
  );
}

function Sheet({ hidden }: { hidden: boolean }) {
  const letters = [...text(screen.sheetColumns)];
  const cellX = sheetCells.map((c) => sheetBox.index + (c - sheetCells[0]!) * EM);
  const bodyTop = sheetBox.head + sheetBox.letters;
  const height = bodyTop + sheetRowCount * ROW_H;
  const line = 'absolute bg-ink/12';
  return (
    <motion.div
      data-piece="sheet"
      className="absolute"
      style={{ left: sheetBox.x, top: sheetBox.y, width: sheetWidth, height }}
    >
      <motion.div
        data-build="sheet"
        className="absolute inset-0 overflow-hidden border border-ink/20 bg-fg"
        initial={hidden ? { clipPath: CLOSED_DOWN } : false}
      >
        <div
          className="flex items-center bg-green pl-6 text-label text-fg"
          style={{ height: sheetBox.head }}
        >
          {text(screen.sheetName)}
        </div>
        <div
          className="absolute inset-x-0 bg-ink/5"
          style={{ top: sheetBox.head, height: sheetBox.letters }}
        />
        <div
          className="absolute left-0 bg-ink/5"
          style={{ top: bodyTop, width: sheetBox.index, bottom: 0 }}
        />
        {letters.map((l, i) => (
          <div
            key={l}
            className="absolute flex items-center justify-center text-label leading-none text-ink/45"
            style={{
              left: cellX[i],
              width: cellX[i + 1]! - cellX[i]!,
              top: sheetBox.head,
              height: sheetBox.letters,
            }}
          >
            {l}
          </div>
        ))}
        {Array.from({ length: sheetRowCount }, (_, i) => (
          <div
            key={i}
            className="absolute flex items-center justify-center text-label leading-none text-ink/40 tabular-nums"
            style={{ left: 0, width: sheetBox.index, top: bodyTop + i * ROW_H, height: ROW_H }}
          >
            {i + 1}
          </div>
        ))}
        {cellX.map((x) => (
          <div
            key={x}
            className={`${line} w-px`}
            style={{ left: x, top: sheetBox.head, bottom: 0 }}
          />
        ))}
        {Array.from({ length: sheetRowCount + 1 }, (_, i) => (
          <div
            key={i}
            className={`${line} h-px`}
            style={{ left: 0, right: 0, top: bodyTop + i * ROW_H }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export function ChaosScene({
  hidden = false,
  count,
  later,
}: {
  /** Výchozí stav timeline S2 (nic ještě není vidět). */
  hidden?: boolean;
  count: ReactNode;
  /** Smyčka S2 (počet přibylých řádků). V S3 chybí, tam se kreslí jen hotový stav timeline. */
  later?: MotionValue<number>;
}) {
  const fade = hidden ? { opacity: 0 } : false;
  return (
    <div data-testid="chaos" className="absolute inset-0 text-ink">
      <Prop name="binder" label={text(screen.propBinder)} hidden={hidden} />
      <Prop name="invoices" label={text(screen.propInvoices)} hidden={hidden} />
      <Prop name="meter" label={text(screen.propMeter)} hidden={hidden} />

      <motion.div
        data-piece="panel"
        className="absolute"
        style={{ left: statementBox.x, top: statementBox.y, width: statementBox.w }}
      >
        <motion.div
          data-build="panel"
          className="border border-ink/15 bg-fg"
          style={{ padding: statementBox.pad }}
          initial={hidden ? { clipPath: CLOSED_DOWN } : false}
        >
          <div
            className="flex items-start border-b border-ink/15 text-label text-ink/70"
            style={{ height: statementBox.head - 16, marginBottom: 16 }}
          >
            {text(screen.statementTitle)}
          </div>
          {rows.statement.map((r) => (
            <motion.div key={r.vs} data-build="srow" initial={fade}>
              <StatementRow {...r} tone="paper" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <Sheet hidden={hidden} />

      {/* Přepsané řádky: startují přesně nad svým řádkem ve výpisu a letí do buněk. */}
      <motion.div
        data-piece="rows"
        className="absolute"
        style={{ left: sheetRows.x, top: sheetRows.y }}
      >
        {rows.statement.map((r, i) => (
          <motion.div
            key={r.vs}
            data-build="fly"
            className="absolute left-0"
            style={{ top: i * ROW_H }}
            initial={hidden ? { x: flight.dx, y: flight.dy, opacity: 0 } : false}
          >
            <StatementRow {...r} tone="paper" />
          </motion.div>
        ))}
        {later && rows.later.map((r, i) => <LaterRow key={r.vs} row={r} index={i} later={later} />)}
      </motion.div>

      <motion.div
        data-piece="counter"
        className="absolute text-right"
        style={{ right: counterBox.right, top: counterBox.top }}
      >
        <motion.div data-build="prop" initial={fade}>
          <div className="text-number">{count}</div>
          <div className="mt-2 text-label text-ink/60">{text(screen.counterLabel)}</div>
        </motion.div>
      </motion.div>

      <Bubble
        name="rent"
        message={text(screen.chatRent)}
        time={text(screen.chatRentTime)}
        hidden={hidden}
      />
      <Bubble
        name="water"
        message={text(screen.chatWater)}
        time={text(screen.chatWaterTime)}
        hidden={hidden}
      />
    </div>
  );
}
