// Kresba databáze dodavatelů z EstatIQ s fiktivními daty (S4, krok Databáze). Vzhled kopíruje dodaný screenshot
// v barvách prezentace. Pracuje v pevném poli 2000×1250 a škáluje se na šířku. Je statická, nic na ní neběží.
import type { ReactNode } from 'react';
import { useElementSize } from '../../design/primitives';
import {
  databaseDemoFilters as filters,
  databaseDemoSuppliers as suppliers,
  databaseDemoTabs as tabs,
} from '../../content/databaseDemo';

const W = 2000;
const H = 1250;
const COLUMNS = '320px 240px 210px 300px 300px 1fr 60px';

function Icon({ size = 33, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const icons = {
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </>
  ),
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  map: (
    <>
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15M9 3.236v15" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  external: (
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  ),
};

function Tab({
  icon,
  label,
  count,
  active = false,
}: {
  icon: keyof typeof icons;
  label: string;
  count: number;
  active?: boolean;
}) {
  return (
    <div
      className={`flex h-[84px] items-center gap-[20px] rounded-[22px] px-[36px] text-[31px] font-semibold ${
        active ? 'bg-mint text-night' : 'text-muted'
      }`}
    >
      <Icon size={36}>{icons[icon]}</Icon>
      {label}
      <span className="tabular-nums">({count})</span>
    </div>
  );
}

function ViewButton({ icon, active = false }: { icon: keyof typeof icons; active?: boolean }) {
  return (
    <div
      className={`flex h-[84px] w-[84px] items-center justify-center rounded-[22px] border-2 ${
        active ? 'border-mint bg-mint text-night' : 'border-line bg-night-2 text-muted'
      }`}
    >
      <Icon size={36}>{icons[icon]}</Icon>
    </div>
  );
}

function Select({
  icon,
  label,
  width,
}: {
  icon: keyof typeof icons;
  label: string;
  width: number;
}) {
  return (
    <div
      className="flex h-[84px] items-center justify-between rounded-[20px] border-2 border-line bg-night px-[28px] text-[26px] whitespace-nowrap text-fg"
      style={{ width }}
    >
      <span className="text-muted">
        <Icon>{icons[icon]}</Icon>
      </span>
      <span>{label}</span>
      <span className="text-muted">
        <Icon size={30}>{icons.chevron}</Icon>
      </span>
    </div>
  );
}

const cell = 'truncate pr-[20px]';

export function DatabaseTable() {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const scale = size.width > 0 ? size.width / W : 0.484;

  return (
    <div ref={ref} className="relative aspect-[16/10] w-full overflow-hidden bg-night">
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        <div
          className="absolute flex items-center gap-[8px] rounded-[30px] border-2 border-line bg-night-2 p-[10px]"
          style={{ left: 29, top: 0 }}
        >
          <Tab icon="building" label="Dodavatelé" count={tabs.suppliers} active />
          <Tab icon="star" label="Nabídky" count={tabs.offers} />
          <Tab icon="wrench" label="Poptávky" count={tabs.requests} />
        </div>
        <div className="absolute flex gap-[18px]" style={{ right: 17, top: 10 }}>
          <ViewButton icon="list" active />
          <ViewButton icon="grid" />
          <ViewButton icon="map" />
        </div>

        <div
          className="absolute flex items-center gap-[24px] rounded-[34px] border-2 border-line bg-night-2 px-[40px]"
          style={{ left: 29, top: 150, width: 1942, height: 156 }}
        >
          <div className="flex h-[84px] w-[540px] items-center gap-[22px] whitespace-nowrap rounded-[20px] border-2 border-line bg-night px-[28px] text-[26px] text-muted">
            <span className="shrink-0">
              <Icon>{icons.search}</Icon>
            </span>
            {filters.search}
          </div>
          <Select icon="filter" label={filters.field} width={320} />
          <Select icon="globe" label={filters.scope} width={230} />
          <Select icon="map" label={filters.region} width={330} />
          <Select icon="pin" label={filters.city} width={340} />
        </div>

        <div
          className="absolute overflow-hidden rounded-[34px] border-2 border-line bg-night-2"
          style={{ left: 29, top: 350, width: 1942, height: 1000 }}
        >
          <div
            className="grid h-[84px] items-center bg-night px-[40px] text-[26px] font-medium text-muted"
            style={{ gridTemplateColumns: COLUMNS }}
          >
            <span>Firma</span>
            <span>Obor</span>
            <span>Město</span>
            <span>Kraj</span>
            <span>Telefon</span>
            <span>E-mail</span>
            <span />
          </div>
          {suppliers.map((s, i) => (
            <div
              key={s.firm}
              data-testid="s4-supplier-row"
              className={`grid h-[92px] items-center border-t-2 border-line px-[40px] text-[25px] ${
                i === 4 ? 'bg-mint/10' : ''
              }`}
              style={{ gridTemplateColumns: COLUMNS }}
            >
              <span className={`${cell} text-fg`}>{s.firm}</span>
              <span className={`${cell} text-muted`}>{s.field}</span>
              <span className={`${cell} font-medium text-fg`}>{s.city}</span>
              <span className={`${cell} text-muted`}>{s.region}</span>
              <span className={`${cell} flex items-center gap-[14px] tabular-nums text-fg`}>
                <span className="shrink-0 text-muted">
                  <Icon size={28}>{icons.phone}</Icon>
                </span>
                {s.phone}
              </span>
              <span className={`${cell} flex items-center gap-[14px] text-fg`}>
                {s.email === '-' ? (
                  <span className="text-muted">-</span>
                ) : (
                  <>
                    <span className="shrink-0 text-muted">
                      <Icon size={28}>{icons.mail}</Icon>
                    </span>
                    <span className="truncate">{s.email}</span>
                  </>
                )}
              </span>
              <span className="flex justify-end text-muted">
                <Icon size={30}>{icons.external}</Icon>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
