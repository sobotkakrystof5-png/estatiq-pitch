// Fiktivní data pro kresbu plánovaných funkcí na S4, krok „Funkce.“ (výslovné zadání Kryštofa, 2026-10-20).
// Není to výstup z MVP ani doložené výsledky: částky, doby, názvy dodavatelů energií i řemeslníci jsou vymyšlené.
// Dodavatelé energií jsou schválně „Dodavatel A až C“, aby fiktivní ceny nebyly připsané skutečným firmám.
// Řemeslníci jsou stejné vymyšlené firmy jako v kresbě databáze (`databaseDemo.ts`).

const NB = '\u00a0';

/** Částka s nezlomitelnými mezerami (číslo i jednotka). */
export const kc = (value: number) =>
  `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 })
    .format(value)
    .replace(/[\u00a0\u202f]/g, NB)}${NB}Kč`;

export const featuresDemoHeader = {
  tab: 'Funkce',
  badge: 'Plán',
} as const;

/** AI návrh smlouvy: řádky návrhu, `review` je ten, který má pronajímatel zkontrolovat. */
export const featuresDemoContract = {
  title: 'AI návrh smlouvy',
  tag: `Byt 3C${NB}· Ostrava`,
  rows: [
    { label: 'Doba', value: `12${NB}měsíců`, review: false },
    { label: 'Nájemné', value: kc(14_200), review: false },
    { label: 'Jistota', value: kc(28_400), review: true },
    { label: 'Předání', value: `1.${NB}11.`, review: false },
  ],
  reviewTag: 'Zkontrolovat',
  action: 'Schválit',
} as const;

/** Vysvětlení spotřeby: měsíční odečty (kWh), poslední měsíc vyskočí. */
export const featuresDemoConsumption = {
  title: 'Vysvětlení spotřeby',
  unit: 'kWh',
  months: ['Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj'],
  values: [22, 18, 17, 19, 24, 41],
  note: `Říjen:${NB}začala topná sezóna.`,
} as const;

/** Srovnání dodavatelů energií: roční cena, A je dosavadní dodavatel, nejlevnější je vyznačená. */
export const featuresDemoEnergy = {
  title: `Dodavatelé${NB}energií`,
  offers: [
    { name: `Dodavatel A${NB}· dnes`, yearly: 31_200 },
    { name: 'Dodavatel B', yearly: 28_900 },
    { name: 'Dodavatel C', yearly: 29_700 },
  ],
  savingLabel: 'Úspora za rok',
} as const;

/** Dobrovolně sdílená historie plateb a ověření, které jde jen se souhlasem a na právním základě. */
export const featuresDemoHistory = {
  title: 'Historie nájemníka',
  historyLabel: `Platby${NB}· 12${NB}měsíců`,
  months: 12,
  /** Indexy měsíců s opožděnou platbou (ostatní jsou včas). */
  late: [4],
  shareLabel: 'Sdílet historii',
  checks: ['Insolvence', 'Exekuce', 'Příjem'],
  checkStatus: `Souhlas a${NB}právní základ`,
  decision: 'Rozhoduje pronajímatel.',
} as const;

/** Tržiště: poptávka a nabídky řemeslníků; vybraná je nejlevnější. */
export const featuresDemoMarket = {
  title: 'Tržiště',
  tag: `Řemeslníci${NB}· energie`,
  request: 'Poptávka: výměna baterie',
  offers: [
    { name: 'Instalace Dvořák s.r.o.', price: 1_800, chosen: false },
    { name: 'Tomáš Vavřík', price: 1_650, chosen: true },
    { name: 'Topení Morava s.r.o.', price: 2_100, chosen: false },
  ],
  chosenTag: 'Vybráno',
} as const;
