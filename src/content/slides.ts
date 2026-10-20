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
      value: 'Kryštof Sobotka',
      source: 'vlastní foto dodané Kryštofem, 1200×1500 px',
      status: 'verified',
    },
    firstName: 'Kryštof',
    lastName: 'Sobotka',
    role: { value: `15${NB}let · student · zakladatel`, source: 'BRIEF §6 S1', status: 'verified' },
    logoAlteno: {
      value: 'Alteno',
      source: 'logo dodané Kryštofem (PNG, pozadí odstraněno)',
      status: 'verified',
    },
    cross: '×',
    logoVizeon: {
      value: 'Vizeon',
      source: 'logo dodané Kryštofem (PNG, pozadí odstraněno)',
      status: 'verified',
    },
    projects: { value: `15+${NB}projektů`, source: 'BRIEF §6 S1, poznámky', status: 'verified' },
  },
  rows: { bridge: statement.slice(0, 5) },
  notes: cs(
    'Jmenuji se Kryštof Sobotka. Je mi patnáct a [doplnit: škola a ročník]. Pod značkami Alteno a Vizeon stavím firmám weby a automatizace. U pronajímatelů vidím stejný problém. [pauza 2 s] Ruční přepisování.',
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
    propBinder: {
      value: 'Šanon se smlouvami',
      source: 'vlastní vektorová kresba, rozhodnutí Kryštofa',
      status: 'verified',
    },
    propInvoices: {
      value: 'Papírové faktury',
      source: 'vlastní vektorová kresba, rozhodnutí Kryštofa',
      status: 'verified',
    },
    propMeter: {
      value: 'Vodoměr',
      source: 'vlastní vektorová kresba, rozhodnutí Kryštofa',
      status: 'verified',
    },
  },
  rows: { statement, later: statementLater },
  notes: cs(
    'Když firmám automatizuji faktury, člověk často ručně přepisuje data mezi nástroji. V pronájmech je stejný problém. Správce porovnává výpis z banky s Excelem. Nájemníci píšou na WhatsApp, smlouvy a faktury leží v šanonu. [pauza 2 s] U správce s 300 byty jde modelově o 300 platebních řádků každý měsíc. A nakonec musí zjistit: kdo mu dluží?',
  ),
} satisfies SlideContent;

export const s3 = {
  id: 's3',
  title: 'Odhalení',
  budgetSec: 15,
  steps: 6,
  screen: {
    bank: 'Banka.',
    sheet: 'Excel.',
    chat: 'WhatsApp.',
    contracts: 'Smlouvy.',
    tag: {
      value: 'Pronájem, který se řídí sám.',
      source: 'volba Kryštofa, slajd 3',
      status: 'verified',
    },
  },
  notes: cs(
    'Banka. [klik] Excel. [klik] WhatsApp. [klik] Smlouvy. [klik] [pauza 2 s] Dnes jsou oddělené. EstatIQ propojí platby, dokumenty a komunikaci pro pronajímatele i nájemníka. [klik] EstatIQ. [klik]',
  ),
} satisfies SlideContent;

export const s4 = {
  id: 's4',
  title: 'Produkt',
  budgetSec: 30,
  steps: 9,
  screen: {
    paymentShot: {
      value: `Platby a${NB}finance v${NB}EstatIQ`,
      source: 'vlastní kresba podle screenshotu MVP, fiktivní data (zadání Kryštofa 2026-10-20)',
      status: 'verified',
    },
    ownerShot: {
      value: `Přehled nemovitostí a${NB}peněz`,
      source: 'skutečný screenshot MVP dodaný Kryštofem, 2026-10-20',
      status: 'verified',
    },
    propertiesShot: {
      value: `Seznam nemovitostí v${NB}EstatIQ`,
      source: 'skutečný screenshot MVP dodaný Kryštofem, 2026-10-20',
      status: 'verified',
    },
    formShot: {
      value: 'Formulář nové nemovitosti',
      source: 'skutečný screenshot MVP dodaný Kryštofem, 2026-10-20',
      status: 'verified',
    },
    calendarShot: {
      value: `Kalendář úkolů v${NB}EstatIQ`,
      source: 'skutečný screenshot MVP dodaný Kryštofem, 2026-10-20',
      status: 'verified',
    },
    tenantShot: {
      value: `Seznam nájemníků v${NB}EstatIQ`,
      source: 'skutečný screenshot MVP dodaný Kryštofem, 2026-10-20',
      status: 'verified',
    },
    communicationShot: {
      value: `Komunikace a${NB}ověřený nájemník`,
      source: 'vlastní kresba plánované komunikace, fiktivní data (zadání Kryštofa 2026-10-20)',
      status: 'verified',
    },
    consumptionShot: {
      value: `Odečty spotřeby v${NB}EstatIQ`,
      source: 'skutečný screenshot MVP dodaný Kryštofem, 2026-10-20',
      status: 'verified',
    },
    databaseShot: {
      value: `Databáze dodavatelů v${NB}EstatIQ`,
      source: 'vlastní kresba podle screenshotu MVP, fiktivní data (zadání Kryštofa 2026-10-20)',
      status: 'verified',
    },
    financeShot: {
      value: `Přehled financí v${NB}EstatIQ`,
      source: 'skutečný screenshot MVP dodaný Kryštofem, 2026-10-20',
      status: 'verified',
    },
    featuresShot: {
      value: `Plánované funkce v${NB}EstatIQ`,
      source: 'vlastní kresba plánovaných funkcí, fiktivní data (zadání Kryštofa 2026-10-20)',
      status: 'verified',
    },
    integrationsShot: {
      value: 'Integrace: banky, e-mail, MCP, energie',
      source: 'seznam zadal Kryštof, 2026-10-20',
      status: 'verified',
    },
    integrationRaiffeisen: {
      value: 'Raiffeisenbank',
      source: 'seznam zadal Kryštof, 2026-10-20',
      status: 'verified',
    },
    integrationCsob: {
      value: 'ČSOB',
      source: 'seznam zadal Kryštof, 2026-10-20',
      status: 'verified',
    },
    integrationKb: {
      value: 'Komerční banka',
      source: 'seznam zadal Kryštof, 2026-10-20',
      status: 'verified',
    },
    integrationGmail: {
      value: 'Gmail',
      source: 'seznam zadal Kryštof, 2026-10-20',
      status: 'verified',
    },
    integrationMcp: {
      value: 'MCP',
      source: 'seznam zadal Kryštof, 2026-10-20',
      status: 'verified',
    },
    integrationCez: {
      value: 'ČEZ',
      source: 'seznam zadal Kryštof, 2026-10-20',
      status: 'verified',
    },
    integrationEon: {
      value: 'E.ON',
      source: 'seznam zadal Kryštof, 2026-10-20',
      status: 'verified',
    },
    integrationInnogy: {
      value: 'Innogy',
      source: 'seznam zadal Kryštof, 2026-10-20',
      status: 'verified',
    },
    paymentWord: 'Platby.',
    ownerWord: 'Přehled nemovitosti.',
    tenantWord: 'Nájemník.',
    communicationWord: 'Komunikace.',
    consumptionWord: 'Spotřeba.',
    databaseWord: 'Databáze.',
    financeWord: 'Finance.',
    featuresWord: 'Funkce.',
    integrationsWord: 'Integrace.',
    summary: 'Každý svůj přehled.',
  },
  notes: cs(
    'Banka se promění v přehled plateb: zelená zaplaceno, žlutá čeká, červená po splatnosti. [klik] Excel nahradí portál vlastníka s přehledem jeho nemovitostí a úkonů. [klik] WhatsApp nahradí evidenci nájemníků: pronajímatel je pozve přímo z aplikace a vidí stav pozvánky. Nájemník vidí jen svůj byt, ne interní údaje majitele ani jiné nájemníky. [klik] Komunikace, kterou chci přidat: zprávy a závady přímo u bytu místo WhatsAppu. Nájemník se ověří jednou, se souhlasem, a každý zaplacený nájem mu staví historii. Komu ji ukáže, rozhodne sám. [klik] Spotřeba: [doplnit: co ukazuje přehled spotřeby]. [klik] Databáze: [doplnit: co je v databázi]. [klik] Finance: [doplnit: co ukazují finance]. [klik] Funkce, které chci přidat: AI návrh smlouvy ke kontrole, vysvětlení spotřeby a srovnání dodavatelů energií. Nájemník si sám zvolí, jestli sdílí historii plateb. Ověření insolvence, exekucí nebo příjmu jde jen se souhlasem a na právním základě. [klik] Integrace: banky Raiffeisenbank, ČSOB a Komerční banka, Gmail, MCP a dodavatelé energií ČEZ, E.ON a Innogy. [doplnit: které už fungují a jak se údaje berou]. [klik]',
  ),
} satisfies SlideContent;

export const s5Math = {
  units: 300,
  rentPerUnit: 19_990,
  monthlyPrice: 4_990,
  managementRate: [0.1, 0.12] as const,
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
const rentVolume = s5Math.units * s5Math.rentPerUnit;
const thousands = (value: number) => number(Math.round(value / 1_000));
const managementFeeMin = thousands(rentVolume * s5Math.managementRate[0]);
const managementFeeMax = thousands(rentVolume * s5Math.managementRate[1]);

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
    b2bVolumeMain: { value: volumeInMillions, source: '300 × 19 990 Kč', status: 'verified' },
    b2bVolumeUnit: { value: `mil.${NB}Kč`, source: '300 × 19 990 Kč', status: 'verified' },
    rentLabel: { value: cs('měsíčně v nájmech'), source: 'BRIEF §6 S5', status: 'verified' },
    b2bPrice: {
      value: `${number(s5Math.monthlyPrice)}${NB}Kč`,
      source: 'BRIEF §6 S5',
      status: 'verified',
    },
    b2bRatio: { value: `${relativePrice}${NB}%`, source: '4 990 / 5 997 000', status: 'verified' },
    b2cContext: {
      value: `Model · ${number(s5Math.units)}${NB}bytů`,
      source: 'modelový příklad; sazbu 10–12 % ověřit',
      status: 'placeholder',
    },
    b2cRate: {
      value: `10–12${NB}%`,
      source: 'modelový příklad; sazbu ověřit',
      status: 'placeholder',
    },
    b2cManagerLabel: 'Správa nemovitosti',
    b2cFee: {
      value: `${managementFeeMin}–${managementFeeMax}${NB}tis.${NB}Kč`,
      source: '300 × 19 990 Kč × 10–12 %, zaokrouhleno na tisíce',
      status: 'verified',
    },
    b2cPeriod: 'měsíčně',
    b2cProductLabel: `Pro vlastníka do 5${NB}bytů`,
    b2cPrice: {
      value: `199${NB}Kč/měs.`,
      source: 'cena zadaná Kryštofem: do 5 bytů',
      status: 'verified',
    },
  },
  notes: cs(
    `Správce 300 bytů při nájmu 19${NB}990${NB}Kč hlídá 6 milionů měsíčně. [klik] EstatIQ stojí 4${NB}990${NB}Kč. [klik] To je asi 0,1 procenta. [pauza 2 s] [klik] U stejných 300 bytů dělá modelových 10 až 12 procent 600 až 720 tisíc korun měsíčně. Sazbu ověříme; správa zahrnuje víc služeb. [klik] Vlastník do pěti bytů platí 199${NB}Kč měsíčně.`,
  ),
} satisfies SlideContent;

export const s6 = {
  id: 's6',
  title: 'Roadmapa funkcí',
  budgetSec: 20,
  steps: 3,
  screen: {
    eyebrow: 'Postupné rozšíření.',
    nowLabel: 'Dnes.',
    now1: 'Platby.',
    now2: cs('Portál vlastníka.'),
    now3: cs('Portál nájemníka.'),
    nextLabel: 'Další.',
    next1: 'Smlouvy.',
    next2: cs('Zprávy a závady.'),
    next3: 'Energie.',
    next4: 'Daňové podklady.',
    laterLabel: 'Později.',
    later1: cs('Ověřený nájemník.'),
    later2: 'Integrace služeb.',
    later3: 'AI funkce.',
    later4: 'Řemeslníci.',
    later5: cs('Kauce a platby.'),
  },
  notes: cs(
    'Dnes je v aplikaci přehled plateb a portál vlastníka i nájemníka. [klik] Další krok: smlouvy a podpis, zprávy a závady, energie a daňové podklady. Daně jsou evidence a export podkladů, ne automatické podání. [klik] Později ověřený nájemník, který se ověřuje dobrovolně, o přijetí rozhoduje pronajímatel. Integrace s dalšími službami: [doplnit: které služby a jak se údaje berou]. K tomu AI funkce, řemeslníci a kauce s platbami po právním ověření. [klik] Všechno je jedna platforma. Pořadí ověříme v Ostravě.',
  ),
} satisfies SlideContent;

export const creditMath = {
  topupKc: 1_000,
  creditsPerKc: 1,
  repairCredits: 600,
  contractCredits: 5,
} as const;

const topupCredits = creditMath.topupKc * creditMath.creditsPerKc;
const afterRepair = topupCredits - creditMath.repairCredits;
const remainingCredits = afterRepair - creditMath.contractCredits;

export const s8 = {
  id: 's8',
  title: 'Kredity a monetizace',
  budgetSec: 50,
  steps: 4,
  screen: {
    caveat: 'Model, ne ceník.',
    topupLabel: 'Dobití',
    topupMoney: {
      value: `${number(creditMath.topupKc)}${NB}Kč`,
      source: 'modelový příklad zadaný Kryštofem',
      status: 'verified',
    },
    rate: {
      value: `1${NB}kredit = 1${NB}Kč`,
      source: 'modelový příklad zadaný Kryštofem',
      status: 'verified',
    },
    topupCredits: {
      value: `${number(topupCredits)}${NB}kreditů`,
      source: '1 000 Kč × 1 kredit/Kč',
      status: 'verified',
    },
    repairLabel: 'Oprava bytu',
    repairDebit: {
      value: `−${number(creditMath.repairCredits)}${NB}kreditů`,
      source: 'modelový příklad zadaný Kryštofem',
      status: 'verified',
    },
    contractLabel: 'AI návrh smlouvy',
    contractDebit: {
      value: `−${number(creditMath.contractCredits)}${NB}kreditů`,
      source: 'modelový příklad zadaný Kryštofem',
      status: 'verified',
    },
    balanceLabel: 'Zbývá',
    afterRepair: {
      value: `${number(afterRepair)}${NB}kreditů`,
      source: '1 000 − 600',
      status: 'verified',
    },
    balance: {
      value: `${number(remainingCredits)}${NB}kreditů`,
      source: '1 000 − 600 − 5',
      status: 'verified',
    },
    revenueLabel: 'Příjmy EstatIQ',
    affiliate: 'Affiliate marketing',
    ads: 'Personalizovaná reklama',
    brokerage: cs('Poplatky za zprostředkování'),
    aiCredits: 'AI kredity',
    commission: cs('Provize z každé transakce'),
    marketLabel: 'Co už umí trh',
    marketBaseline: 'Platby. Smlouvy. Portály. Kredity.',
    edgeLabel: 'Naše plánované odlišení',
    edgeHistory: 'Přenositelná historie.',
    edgeRepair: cs('Závada až k opravě.'),
    edgeEnergy: cs('Spotřeba až k nabídce.'),
  },
  notes: cs(
    'Tohle je model, ne dnešní ceník. Tisíc korun dá tisíc kreditů. [klik] Oprava za šest set kreditů nechá čtyři sta. Celých šest set není náš výnos: řemeslník má cenu práce, EstatIQ by mělo smluvní provizi. [klik] Návrh smlouvy za pět kreditů nechá tři sta devadesát pět. [klik] Vydělávat chceme pěti způsoby: affiliate marketing, personalizovaná reklama, poplatky za zprostředkování služby, AI kredity a provize z každé transakce. Reklama i doporučení budou jasně označené. [klik] Repilot už používá kredity; eviduje.cz má platby, smlouvy i portál. Naší sázkou je přenosná historie nájemníka a cesta od závady k opravě nebo od spotřeby k nabídce. Ověříme ji v pilotech.',
  ),
} satisfies SlideContent;

export const s9 = {
  id: 's9',
  title: 'Co chci',
  budgetSec: 20,
  steps: 3,
  screen: {
    calls: `12${NB}hovorů.`,
    pilots: `2${NB}piloty.`,
    ask: 'Mentoři. Tým.',
    tagline: 'Přidej. Pronajmi. Vydělávej.',
  },
  notes: cs(
    'MVP je hotové a mluvil jsem s dvanácti realitkami a správci. [klik] Do Startup Show chci dva pilotní správce. [klik] Od Green Light chci mentory a pomoc najít obchodního parťáka. [pauza 2 s] [klik] Přidej. Pronajmi. Vydělávej. Děkuji.',
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
    recommendation: 'Doporučení',
  },
  notes: cs(
    'Výnosy mohou tvořit předplatné, provize za zprostředkované služby a transparentně označená doporučení dodavatelů energií či řemeslníků. Kredity jsou zatím pracovní model, ne schválený ceník ani peněženka. Příklad k diskusi: balíček 1 000 Kč za 1 000 kreditů, návrh nájemní smlouvy za 5 kreditů a řemeslnická zakázka za 600 kreditů. Je potřeba stanovit, jaká část zakázky připadne řemeslníkovi a jaká provize platformě. Před zavedením kreditů a toků peněz je potřeba ověřit právní model a případně použít licencovaného platebního partnera.',
  ),
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
    evidence: 'Trh dnes',
    layer: 'Naše sázka',
  },
  notes: cs(
    'Repilot už má párování banky, upomínky, energie i kreditovou peněženku. eviduje.cz uvádí smlouvy, nájemnický portál a daňový přehled. Samotné platby ani kredity tedy nejsou odlišení. Chceme ověřit, jestli pronajímatelé ocení přenosnou dobrou historii nájemníka a jestli z nahlášené závady nebo z dat o spotřebě skutečně vznikne objednávka služby. Silnější tvrzení o konkurenci patří až za piloty.',
  ),
} satisfies SlideContent;

export const z4 = {
  id: 'z4',
  title: 'Roadmapa',
  budgetSec: 0,
  steps: 0,
  screen: {
    system: 'MVP',
    transaction: cs('AI a data'),
    investor: 'Platby',
    marketplace: 'Služby',
  },
  notes: cs(
    'Roadmapu rozdělit na ověřitelné kroky: dnešní MVP tvoří přehled plateb a portály vlastníka a nájemníka podle skutečného stavu aplikace. V cílovém portálu vlastník uvidí všechny své nemovitosti, platby, faktury, spotřebu a opravy; nájemník jen vlastní smlouvu, platby, spotřebu a požadavky, bez přístupu k jiným nájemníkům a interním financím majitele. Další krok může propojit zprávy a podklady pro daně. Později přidat AI návrhy smluv ke kontrole, vysvětlení spotřeby a srovnání dodavatelů energií. Nájemník by mohl dobrovolně sdílet historii plateb. Ověření insolvenčních a exekučních záznamů či příjmu vyžaduje potřebný právní základ, přiměřený rozsah údajů a souhlas tam, kde je nutný; výsledek nesmí automaticky rozhodnout o přijetí. Nakonec tržiště energií a řemeslníků s transparentní provizí. Automatické stržení nájmu a příjem peněz za nezávislé dodavatele vyžadují zvláštní právní a partnerské řešení.',
  ),
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
    evidence: 'Evidence kauce',
    decision: 'Rozhodnutí vlastníka',
    settlement: 'Vypořádání po skončení',
  },
  notes: cs(
    'EstatIQ může evidovat výši kauce, upozornit na nezaplacený nájem a připravit přehled plateb a komunikace. O případném započtení rozhoduje pronajímatel po kontrole konkrétní situace. Občanský zákoník výslovně upravuje vrácení jistoty a započtení dluhů při skončení nájmu; tento slajd proto neslibuje automatické stržení z kauce během trvání nájmu ani automatické navyšování jistoty. Konkrétní postup nechat posoudit právníkem.',
  ),
} satisfies SlideContent;

export const slides: SlideContent[] = [
  s1,
  s2,
  s3,
  s4,
  s5,
  s6,
  s8,
  s9,
  z1,
  z2,
  z3,
  z4,
  z5,
  z6,
  z7,
];

/** Text faktu nebo řetězce, jak se ukáže na plátně. */
export const text = (v: string | Fact) => (typeof v === 'string' ? v : v.value);
