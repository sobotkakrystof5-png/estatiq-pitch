// Jediný zdroj textů, čísel a poznámek. Fáze 4: S1–S3, zbytek ve fázích 5–6.
import type { StatementRowData } from '../design/primitives/StatementRow';

export type Fact = { value: string; source?: string; status: 'verified' | 'placeholder' };

export type SlideContent = {
  id: string;
  title: string;
  budgetSec: number;
  steps: number;
  screen: Record<string, string | Fact>;
  /** Řádky výpisu na plátně (fiktivní data). check:content je bere jako jeden prvek na řádek. */
  rows?: Record<string, readonly StatementRowData[]>;
  /** Polohy jemného zvýraznění ve screenshotu, jako procenta jeho šířky a výšky. */
  highlights?: Record<string, { x: number; y: number; width: number; height: number }>;
  notes: string;
};

const NB = ' ';

/** Mluvený text je dlouhý: nezlomitelnou mezeru po jednopísmenném slově doplní funkce, ne ruka. */
const cs = (text: string) => text.replace(/(?<=^|[\s(])([aikosuvzAIKOSUVZ]) /g, `$1${NB}`);

const row = (date: string, vs: string, amount: string, name: string): StatementRowData => ({
  date,
  vs,
  amount: amount.replace(' ', NB),
  name,
});

/**
 * Fiktivní výpis jednoho správce za září: Ostrava, nájmy 7 500–15 000 Kč, VS = rok + číslo jednotky.
 * BARTOŠ poslal jen polovinu, aby výpis nebyl podezřele čistý.
 */
const statement = [
  row('01.09', '2024017', '12 500,00', 'DVOŘÁKOVÁ'),
  row('02.09', '2024003', '9 800,00', 'KREJČÍ'),
  row('03.09', '2024022', '14 200,00', 'POSPÍŠIL'),
  row('05.09', '2024009', '11 000,00', 'HORÁKOVÁ'),
  row('08.09', '2024041', '7 500,00', 'BARTOŠ'),
  row('10.09', '2024028', '13 900,00', 'ŠTĚPÁNEK'),
  row('12.09', '2024031', '15 000,00', 'NOVÁK'),
  row('15.09', '2024036', '10 400,00', 'VLČKOVÁ'),
];

/** Klidná smyčka v S2: řádky, které do tabulky přibývají, zatímco Kryštof mluví. */
const statementLater = [
  row('16.09', '2024012', '12 000,00', 'KOLÁŘ'),
  row('17.09', '2024044', '8 900,00', 'SVOBODOVÁ'),
  row('18.09', '2024019', '13 500,00', 'MAREK'),
  row('19.09', '2024025', '9 600,00', 'URBANOVÁ'),
  row('22.09', '2024007', '14 800,00', 'JELÍNEK'),
];

export const s1 = {
  id: 's1',
  title: 'Kdo jsem',
  budgetSec: 15,
  steps: 2,
  screen: {
    photo: {
      value: `Foto Kryštof · 4:5 · min.${NB}1200${NB}×${NB}1500${NB}px`,
      status: 'placeholder',
    },
    firstName: 'Kryštof',
    lastName: 'Sobotka',
    role: { value: `15${NB}let · student · zakladatel`, source: 'BRIEF §6 S1', status: 'verified' },
    logoAlteno: { value: 'Logo Alteno · světlé SVG', status: 'placeholder' },
    cross: '×',
    logoVizeon: { value: 'Logo Vizeon · světlé SVG', status: 'placeholder' },
    projects: { value: `15+${NB}projektů`, source: 'BRIEF §6 S1, poznámky', status: 'verified' },
  },
  rows: { bridge: statement.slice(0, 5) },
  notes: cs(
    'Dobrý den, jmenuji se Kryštof Sobotka, je mi patnáct a [doplnit: škola a ročník]. Pod značkami Alteno a Vizeon stavím firmám weby a automatizace, mám za sebou přes 15 projektů. A u realitek a pronajímatelů vidím pořád dokola jednu věc. [pauza 2 s] Ruční přepisování.',
  ),
} satisfies SlideContent;

export const s2 = {
  id: 's2',
  title: 'Problém',
  budgetSec: 30,
  steps: 1,
  screen: {
    statementTitle: `Výpis z${NB}účtu · září`,
    sheetName: 'nájmy_2026.xlsx',
    sheetColumns: 'ABCD',
    // BRIEF: „Dobrý den, nájem pošlu příští týden.“ má 6 slov, zkráceno kvůli limitu 5 (CLAUDE.md §4.2).
    chatRent: 'Nájem pošlu příští týden.',
    chatRentTime: '22:04',
    chatWater: 'Neteče teplá voda.',
    chatWaterTime: '22:17',
    counter: {
      value: '300',
      source: '300 bytů × 1 platba měsíčně (BRIEF §6 S2)',
      status: 'verified',
    },
    counterLabel: 'řádků / měsíc',
    propBinder: { value: 'Šanon se smlouvami · vlastní foto', status: 'placeholder' },
    propInvoices: { value: 'Papírové faktury · vlastní foto', status: 'placeholder' },
    propMeter: { value: 'Vodoměr · vlastní foto', status: 'placeholder' },
  },
  rows: { statement, later: statementLater },
  notes: cs(
    'Když firmám automatizuji faktury, pořád narážím na stejný vzorec: člověk ručně přepisuje data z jednoho místa do druhého. Pak jsem se ponořil do nemovitostí. Knihy, podcasty a hlavně dvanáct hovorů s realitkami a správci. A děje se tam totéž, jen ve větším měřítku. Správce otevře výpis z banky a přepisuje ho do Excelu, řádek po řádku. Nájemníci píšou na WhatsApp. Smlouvy leží v šanonu. [pauza 2 s] Každý měsíc. Jen aby zjistil, kdo mu dluží.',
  ),
} satisfies SlideContent;

export const s3 = {
  id: 's3',
  title: 'Odhalení',
  budgetSec: 15,
  steps: 5,
  screen: {
    bank: 'Banka.',
    sheet: 'Excel.',
    chat: 'WhatsApp.',
    tag: { value: '[doplnit: tag]', status: 'placeholder' },
  },
  notes: cs(
    'Banka. [klik] Excel. [klik] WhatsApp. [klik] [pauza 2 s] Nejsou to tři nástroje. Je to jeden. [klik] EstatIQ. [klik]',
  ),
} satisfies SlideContent;

const matchedPayment = statement[6]!;

export const s4 = {
  id: 's4',
  title: 'Produkt',
  budgetSec: 30,
  steps: 3,
  screen: {
    paymentShot: { value: 'Screenshot · platby · fiktivní Ostrava', status: 'placeholder' },
    ownerShot: { value: 'Screenshot · portál vlastníka · fiktivní Ostrava', status: 'placeholder' },
    tenantShot: {
      value: 'Screenshot · portál nájemníka · fiktivní Ostrava',
      status: 'placeholder',
    },
    paymentWord: 'Platby.',
    ownerWord: 'Vlastník.',
    tenantWord: 'Nájemník.',
    summary: 'Tři nástroje. Jedna obrazovka.',
  },
  rows: { matchedPayment: [matchedPayment] },
  highlights: {
    ownerLiveValue: { x: 62, y: 18, width: 28, height: 14 },
    tenantReportButton: { x: 64, y: 72, width: 27, height: 13 },
  },
  notes: cs(
    'Takhle vypadá stejný měsíc s EstatIQ. Banka: platby se vytvoří samy a správce na jedné obrazovce vidí, kdo zaplatil. [klik] Excel: vlastník bytu nedostává tabulky, vidí všechno živě ve svém portálu. [klik] WhatsApp: nájemník má vlastní portál. Vidí platby i smlouvu a závadu nahlásí jedním klikem. Žádné zprávy v deset večer. [pauza 2 s] Tři nástroje. Jedna obrazovka.',
  ),
} satisfies SlideContent;

export const s5Math = {
  units: 300,
  rentPerUnit: 15_000,
  monthlyPrice: 4_990,
  managementRate: [0.08, 0.12] as const,
};

const number = (value: number) =>
  new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 })
    .format(value)
    .replace(/[\u00a0\u202f]/g, NB);
const volumeInMillions = new Intl.NumberFormat('cs-CZ', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}).format((s5Math.units * s5Math.rentPerUnit) / 1_000_000);
const relativePrice = new Intl.NumberFormat('cs-CZ', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}).format((s5Math.monthlyPrice / (s5Math.units * s5Math.rentPerUnit)) * 100);

export const s5 = {
  id: 's5',
  title: 'Proč platí',
  budgetSec: 25,
  steps: 4,
  screen: {
    b2bContext: {
      value: `Správce · ${number(s5Math.units)}${NB}bytů`,
      source: 'BRIEF §6 S5',
      status: 'verified',
    },
    b2bVolumeMain: { value: volumeInMillions, source: '300 × 15 000 Kč', status: 'verified' },
    b2bVolumeUnit: { value: `mil.${NB}Kč`, source: '300 × 15 000 Kč', status: 'verified' },
    rentLabel: { value: cs('měsíčně v nájmech'), source: 'BRIEF §6 S5', status: 'verified' },
    b2bPrice: {
      value: `${number(s5Math.monthlyPrice)}${NB}Kč`,
      source: 'BRIEF §6 S5',
      status: 'verified',
    },
    b2bRatio: { value: `${relativePrice}${NB}%`, source: '4 990 / 4 500 000', status: 'verified' },
    b2cContext: {
      value: 'Pronajímatel · správcovská firma',
      source: 'BRIEF §6 S5',
      status: 'verified',
    },
    b2cFee: { value: `1${NB}200${NB}Kč`, source: '8 % z 15 000 Kč', status: 'verified' },
    b2cPrice: { value: `od${NB}199${NB}Kč`, source: 'BRIEF §6 S5', status: 'verified' },
  },
  notes: cs(
    `Kolik to stojí? Správce 300 bytů hlídá při nájmu 15${NB}000${NB}Kč každý měsíc 4,5 milionu korun. [klik] EstatIQ ho stojí 4${NB}990${NB}Kč. [pauza 2 s] Jedna desetina procenta. Platí se každý měsíc a klient, kterému to šetří čas, neodchází. A pronajímatel, který dá byt správcovské firmě, odevzdá 8 až 12${NB}% nájmu, tedy 1${NB}200 až 1${NB}800${NB}Kč měsíčně. [klik] A kdo chce, aby byl nájem konečně pasivní příjem, zaplatí s EstatIQ od 199${NB}Kč.`,
  ),
} satisfies SlideContent;

export const s6Config = { showMarketStat: false } as const;

export const s6 = {
  id: 's6',
  title: 'Škálovatelnost',
  budgetSec: 20,
  steps: 3,
  screen: {
    czechia: 'Česko',
    slovakia: 'Slovensko',
    centralEurope: 'Střední Evropa',
    marketStat: {
      value: `34${NB}500${NB}pronajímatelů 3+ bytů`,
      source: 'BRIEF §6 S6; zdroj k ověření',
      status: 'placeholder',
    },
  },
  notes: cs(
    'Začínáme v Ostravě se správci, se kterými už mluvím. Pak celé Česko. [klik] Potom Slovensko, s podobnými nájmy i jazykem. [klik] Nakonec střední Evropa. [pauza 2 s] Jádro zůstává stejné. Mění se jen místní pravidla. A software se s každým dalším bytem neprodražuje.',
  ),
} satisfies SlideContent;

export const s7 = {
  id: 's7',
  title: 'Ještě jedna věc',
  budgetSec: 25,
  steps: 5,
  screen: {
    opening: `A${NB}ještě jedna věc.`,
    energy: 'Energie.',
    tenants: 'Ověření nájemníci.',
    payments: 'Každá platba.',
    finalLead: 'Platební',
    finalTail: 'vrstva nájemního bydlení.',
  },
  notes: cs(
    'A ještě jedna věc. [pauza 2 s] Energie. [klik] Smlouvy s dodavateli energií uzavřené přímo v EstatIQ. [klik] Nájemníci, kteří si u nás budují ověřenou historii plateb. [klik] A časem každá platba kolem nájmu. [pauza] Nájem, energie, služby. Všechno přes nás proteče. [pauza] [klik] Nechceme být další evidence. Chceme být platební a datová vrstva nájemního bydlení.',
  ),
} satisfies SlideContent;

export const s8 = {
  id: 's8',
  title: 'Co chci',
  budgetSec: 20,
  steps: 3,
  screen: {
    calls: `12${NB}hovorů.`,
    pilots: `2${NB}piloty.`,
    ask: 'Mentoři. Tým.',
  },
  rows: { closing: [statement[0]!] },
  notes: cs(
    'Dnes mám hotové MVP a mluvil jsem s dvanácti realitkami a správci. [klik] Do Startup Show chci dva pilotní správce. [klik] Od Green Light chci dvě věci. Odborníky, od kterých se naučím, co mi chybí, a pomoc najít parťáka, který umí prodávat. [pauza 2 s] [klik] Aby žádný správce už nemusel přepisovat výpis z banky do Excelu. Děkuji.',
  ),
} satisfies SlideContent;

export const z1 = {
  id: 'z1',
  title: 'Obchodní model',
  budgetSec: 0,
  steps: 0,
  screen: {
    subscription: 'Předplatné',
    credits: 'Kredity',
    commission: 'Provize',
    implementation: 'Implementace',
  },
  notes: '',
} satisfies SlideContent;

export const z2 = {
  id: 'z2',
  title: 'Ceník',
  budgetSec: 0,
  steps: 0,
  screen: {
    price: { value: '[doplnit: varianta ceníku]', status: 'placeholder' },
  },
  notes: '',
} satisfies SlideContent;

export const z3 = {
  id: 'z3',
  title: 'Konkurence',
  budgetSec: 0,
  steps: 0,
  screen: {
    evidence: 'Evidence',
    layer: 'Vrstva',
  },
  notes: '',
} satisfies SlideContent;

export const z4 = {
  id: 'z4',
  title: 'Roadmapa',
  budgetSec: 0,
  steps: 0,
  screen: {
    system: 'Systém',
    transaction: 'Transakce',
    investor: 'Investor',
    marketplace: 'Tržiště',
  },
  notes: '',
} satisfies SlideContent;

export const z5 = {
  id: 'z5',
  title: 'Tým',
  budgetSec: 0,
  steps: 0,
  screen: {
    founder: 'Kryštof',
    salesRole: 'Obchod',
    salesPerson: { value: '[doplnit: jméno parťáka]', status: 'placeholder' },
    industryRole: 'Obor',
    industryPerson: { value: `[doplnit: člověk z${NB}oboru]`, status: 'placeholder' },
  },
  notes: '',
} satisfies SlideContent;

export const z6 = {
  id: 'z6',
  title: 'Finance',
  budgetSec: 0,
  steps: 0,
  screen: {
    costs: 'Náklady',
    funding: 'Financování',
    detail: { value: '[doplnit po workshopu Finance]', status: 'placeholder' },
  },
  notes: '',
} satisfies SlideContent;

export const z7 = {
  id: 'z7',
  title: 'Co když nájemník nezaplatí',
  budgetSec: 0,
  steps: 0,
  screen: {
    question: 'Co když nájemník nezaplatí?',
    digitalDeposit: 'Digitální kauce',
    reminders: 'Upomínky',
    offset: 'Započtení',
    replenishment: 'Doplnění',
    documents: 'Podklady',
  },
  notes: '',
} satisfies SlideContent;

export const slides: SlideContent[] = [s1, s2, s3, s4, s5, s6, s7, s8, z1, z2, z3, z4, z5, z6, z7];

/** Text faktu nebo řetězce, jak se ukáže na plátně. */
export const text = (v: string | Fact) => (typeof v === 'string' ? v : v.value);
