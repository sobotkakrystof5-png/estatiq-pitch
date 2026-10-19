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
    propBinder: { value: 'Šanon se smlouvami · vlastní foto', status: 'placeholder' },
    propInvoices: { value: 'Papírové faktury · vlastní foto', status: 'placeholder' },
    propMeter: { value: 'Vodoměr · vlastní foto', status: 'placeholder' },
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
    tag: { value: 'Pronájem, který se řídí sám.', source: 'volba Kryštofa, slajd 3', status: 'verified' },
  },
  notes: cs(
    'Banka. [klik] Excel. [klik] WhatsApp. [klik] Smlouvy. [klik] [pauza 2 s] Dnes jsou oddělené. EstatIQ propojí platby, dokumenty a komunikaci pro pronajímatele i nájemníka. [klik] EstatIQ. [klik]',
  ),
} satisfies SlideContent;

const matchedPayment = statement[6]!;

export const s4 = {
  id: 's4',
  title: 'Produkt',
  budgetSec: 30,
  steps: 9,
  screen: {
    paymentShot: { value: 'Screenshot · platby · fiktivní Ostrava', status: 'placeholder' },
    ownerShot: { value: 'Screenshot · portál vlastníka · přehled nemovitosti', status: 'placeholder' },
    tenantShot: {
      value: 'Screenshot · portál nájemníka · fiktivní Ostrava',
      status: 'placeholder',
    },
    landlordShot: {
      value: 'Screenshot · dashboard pronajímatele · fiktivní Ostrava',
      status: 'placeholder',
    },
    consumptionShot: { value: 'Screenshot · spotřeba · fiktivní Ostrava', status: 'placeholder' },
    databaseShot: { value: 'Screenshot · databáze · fiktivní Ostrava', status: 'placeholder' },
    financeShot: { value: 'Screenshot · finance · fiktivní Ostrava', status: 'placeholder' },
    featuresShot: { value: 'Screenshot · funkce · fiktivní Ostrava', status: 'placeholder' },
    integrationsShot: { value: 'Screenshot · integrace · fiktivní Ostrava', status: 'placeholder' },
    paymentWord: 'Platby.',
    ownerWord: 'Přehled nemovitosti.',
    tenantWord: 'Nájemník.',
    landlordWord: 'Pronajímatel.',
    consumptionWord: 'Spotřeba.',
    databaseWord: 'Databáze.',
    financeWord: 'Finance.',
    featuresWord: 'Funkce.',
    integrationsWord: 'Integrace.',
    summary: 'Každý svůj přehled.',
  },
  rows: { matchedPayment: [matchedPayment] },
  highlights: {
    ownerLiveValue: { x: 62, y: 18, width: 28, height: 14 },
    tenantReportButton: { x: 64, y: 72, width: 27, height: 13 },
  },
  notes: cs(
    'Banka se promění v přehled plateb: zelená zaplaceno, žlutá čeká, červená po splatnosti. [klik] Excel nahradí portál vlastníka s přehledem jeho nemovitostí a úkonů. [klik] WhatsApp nahradí portál pro smlouvu, platby a hlášení závad. Nájemník vidí jen svůj byt, ne interní údaje majitele ani jiné nájemníky. [klik] Pronajímatel má vlastní dashboard: nájmy, platby a úkoly na jednom místě. [klik] Spotřeba: [doplnit: co ukazuje přehled spotřeby]. [klik] Databáze: [doplnit: co je v databázi]. [klik] Finance: [doplnit: co ukazují finance]. [klik] Funkce: [doplnit: které funkce se ukazují]. [klik] Integrace: [doplnit: s kým se EstatIQ integruje]. [klik]',
  ),
} satisfies SlideContent;

export const s5Math = {
  units: 300,
  rentPerUnit: 19_990,
  monthlyPrice: 4_990,
  selfManagedRent: 19_990,
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
const managementFeeMin = number(s5Math.selfManagedRent * s5Math.managementRate[0]);
const managementFeeMax = number(s5Math.selfManagedRent * s5Math.managementRate[1]);

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
      value: `Model · nájem ${number(s5Math.selfManagedRent)}${NB}Kč`,
      source: 'modelový příklad; sazbu 10–12 % ověřit',
      status: 'placeholder',
    },
    b2cRate: { value: `10–12${NB}%`, source: 'modelový příklad; sazbu ověřit', status: 'placeholder' },
    b2cManagerLabel: 'Správa nemovitosti',
    b2cFee: {
      value: `${managementFeeMin}–${managementFeeMax}${NB}Kč`,
      source: '19 990 Kč × 10–12 %',
      status: 'verified',
    },
    b2cPeriod: 'měsíčně',
    b2cProductLabel: `Pro vlastníka do 5${NB}bytů`,
    b2cPrice: { value: `199${NB}Kč/měs.`, source: 'cena zadaná Kryštofem: do 5 bytů', status: 'verified' },
  },
  notes: cs(
    `Správce 300 bytů při nájmu 19${NB}990${NB}Kč hlídá 6 milionů měsíčně. [klik] EstatIQ stojí 4${NB}990${NB}Kč. [klik] To je asi 0,1 procenta. [pauza 2 s] [klik] Při stejném nájmu dělá modelových 10 až 12 procent 1${NB}999 až 2${NB}399${NB}Kč měsíčně. Sazbu ověříme; správa zahrnuje víc služeb. [klik] Vlastník do pěti bytů platí 199${NB}Kč měsíčně.`,
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

export const s7 = {
  id: 's7',
  title: 'Ještě jedna věc',
  budgetSec: 30,
  steps: 6,
  screen: {
    opening: `A${NB}ještě jedna věc.`,
    ai: 'AI funkce.',
    tenants: 'Ověřený nájemník.',
    expenses: 'Přehled výdajů.',
    expensesDetail: 'Voda, plyn, elektřina.',
    tradesmen: cs('Řemeslníci v okolí.'),
    payments: cs('Kauce a platby.'),
    finalLead: 'Platební',
    finalTail: 'vrstva nájemního bydlení.',
  },
  notes: cs(
    'A ještě jedna věc. [pauza 2 s] [klik] AI funkce: návrh smlouvy ke kontrole a vysvětlení spotřeby. [klik] Nájemník se může dobrovolně ověřit v registrech, doložit příjem a při stěhování ukázat historii: 12 měsíců, vše včas. O přijetí rozhoduje pronajímatel. [klik] Přehled výdajů: voda, plyn a elektřina na jednom místě, [doplnit: integrace, s kým a jak se údaje berou]; u energií srovnání. [klik] Databáze řemeslníků z okolí; při závadě si v aplikaci objedná toho, kdo je nablízku. [klik] Kauci budeme evidovat a hlídat upomínky; o dalším kroku rozhodne vlastník. [klik] Platební a datová vrstva nájemního bydlení.',
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
    topupMoney: { value: `${number(creditMath.topupKc)}${NB}Kč`, source: 'modelový příklad zadaný Kryštofem', status: 'verified' },
    rate: { value: `1${NB}kredit = 1${NB}Kč`, source: 'modelový příklad zadaný Kryštofem', status: 'verified' },
    topupCredits: { value: `${number(topupCredits)}${NB}kreditů`, source: '1 000 Kč × 1 kredit/Kč', status: 'verified' },
    repairLabel: 'Oprava bytu',
    repairDebit: { value: `−${number(creditMath.repairCredits)}${NB}kreditů`, source: 'modelový příklad zadaný Kryštofem', status: 'verified' },
    contractLabel: 'AI návrh smlouvy',
    contractDebit: { value: `−${number(creditMath.contractCredits)}${NB}kreditů`, source: 'modelový příklad zadaný Kryštofem', status: 'verified' },
    balanceLabel: 'Zbývá',
    afterRepair: { value: `${number(afterRepair)}${NB}kreditů`, source: '1 000 − 600', status: 'verified' },
    balance: { value: `${number(remainingCredits)}${NB}kreditů`, source: '1 000 − 600 − 5', status: 'verified' },
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

export const slides: SlideContent[] = [s1, s2, s3, s4, s5, s6, s7, s8, s9, z1, z2, z3, z4, z5, z6, z7];

/** Text faktu nebo řetězce, jak se ukáže na plátně. */
export const text = (v: string | Fact) => (typeof v === 'string' ? v : v.value);
