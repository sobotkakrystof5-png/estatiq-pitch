// S4, krok Integrace: loga služeb po jednom naskočí kolem loga EstatIQ a linky do něj začnou téct.
import { motion } from 'motion/react';
import { FlowLine, Logo } from '../../design/primitives';
import { instant, integrations } from '../../motion/presets';
import { s4, text } from '../../content/slides';
import type { DeckMode } from '../../deck/types';
import raiffeisenLogo from '../../assets/logos/integrations/raiffeisen.svg';
import eonLogo from '../../assets/logos/integrations/eon.svg';
import csobLogo from '../../assets/logos/integrations/csob.svg';
import kbLogo from '../../assets/logos/integrations/kb.svg';
import cezLogo from '../../assets/logos/integrations/cez.svg';
import gmailLogo from '../../assets/logos/integrations/gmail.svg';
import innogyLogo from '../../assets/logos/integrations/innogy.svg';
import mcpLogo from '../../assets/logos/integrations/mcp.svg';

const { screen } = s4;

/** Pole scény 1060×760 px. Dlaždice 250×120, střed (HUB_X, HUB_Y) je logo EstatIQ. */
export const SCENE = { width: 1060, height: 760 } as const;
const TILE = { w: 250, h: 120 } as const;
const HUB = { x: 530, y: 380, halfW: 165, halfH: 60 } as const;

type Side = 'left' | 'right' | 'top' | 'bottom';
type Item = {
  key: keyof typeof screen;
  /** Soubor loga. `null` = zatím chybí, kreslí se popsaný placeholder (BRIEF §7). */
  logo: string | null;
  side: Side;
  cy: number;
  /** Vnitřní okraj dlaždice v px; úzké logo dostane menší, ať je čitelné. */
  pad?: number;
};

/** Pořadí v poli je pořadí, v jakém loga naskakují: banky, e-mail a MCP, energie. */
const items: readonly Item[] = [
  { key: 'integrationRaiffeisen', logo: raiffeisenLogo, side: 'left', cy: 130 },
  { key: 'integrationCsob', logo: csobLogo, side: 'left', cy: 380 },
  { key: 'integrationKb', logo: kbLogo, side: 'left', cy: 630 },
  { key: 'integrationGmail', logo: gmailLogo, side: 'top', cy: 60 },
  { key: 'integrationMcp', logo: mcpLogo, side: 'bottom', cy: 700 },
  { key: 'integrationCez', logo: cezLogo, side: 'right', cy: 130 },
  { key: 'integrationEon', logo: eonLogo, side: 'right', cy: 380 },
  { key: 'integrationInnogy', logo: innogyLogo, side: 'right', cy: 630, pad: 8 },
];

function tileBox({ side, cy }: Item) {
  const cx = side === 'left' ? TILE.w / 2 : side === 'right' ? SCENE.width - TILE.w / 2 : HUB.x;
  return { cx, cy, left: cx - TILE.w / 2, top: cy - TILE.h / 2 };
}

/** Křivka z hrany dlaždice do hrany loga EstatIQ (tok jde k logu). */
function linePath(item: Item) {
  const { cx, cy } = tileBox(item);
  if (item.side === 'top')
    return `M ${cx} ${cy + TILE.h / 2 + 8} L ${HUB.x} ${HUB.y - HUB.halfH - 16}`;
  if (item.side === 'bottom')
    return `M ${cx} ${cy - TILE.h / 2 - 8} L ${HUB.x} ${HUB.y + HUB.halfH + 16}`;
  const dir = item.side === 'left' ? 1 : -1;
  const x0 = cx + dir * (TILE.w / 2 + 8);
  const x1 = HUB.x - dir * (HUB.halfW + 16);
  const mid = (x0 + x1) / 2;
  return `M ${x0} ${cy} C ${mid} ${cy} ${mid} ${HUB.y} ${x1} ${HUB.y}`;
}

export function IntegrationsScene({ active, mode }: { active: boolean; mode: DeckMode }) {
  const lag = (index: number) => (mode === 'normal' ? index * integrations.gap : 0);

  return (
    <div className="relative" style={{ width: SCENE.width, height: SCENE.height }}>
      <svg
        className="absolute inset-0"
        width={SCENE.width}
        height={SCENE.height}
        viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
        aria-hidden
      >
        {items.map((item, index) => (
          <FlowLine
            key={item.key}
            d={linePath(item)}
            active={active}
            mode={mode}
            delay={lag(index) + (mode === 'normal' ? integrations.lineLag : 0)}
          />
        ))}
      </svg>

      <motion.div
        className="absolute"
        style={{
          left: HUB.x - HUB.halfW,
          top: HUB.y - HUB.halfH,
          width: HUB.halfW * 2,
          height: HUB.halfH * 2,
        }}
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={instant}
      >
        <Logo className="h-full w-full" />
      </motion.div>

      {items.map((item, index) => {
        const box = tileBox(item);
        const name = text(screen[item.key]);
        return (
          <motion.div
            key={item.key}
            data-testid="s4-integration"
            data-placeholder={item.logo ? undefined : ''}
            className={`absolute flex items-center justify-center rounded-[14px] ${
              item.logo ? 'bg-paper' : 'border-2 border-dashed border-muted/50 p-4'
            }`}
            style={{
              left: box.left,
              top: box.top,
              width: TILE.w,
              height: TILE.h,
              padding: item.logo ? (item.pad ?? 22) : undefined,
            }}
            initial={false}
            animate={{ opacity: active ? 1 : 0, scale: active ? 1 : integrations.scaleFrom }}
            transition={
              active && mode === 'normal' ? { ...integrations.tile, delay: lag(index) } : instant
            }
          >
            {item.logo ? (
              <img src={item.logo} alt={name} className="h-full w-full object-contain" />
            ) : (
              <span className="text-label text-fg">{name}</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
