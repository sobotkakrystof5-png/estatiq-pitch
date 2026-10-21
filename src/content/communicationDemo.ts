// Fiktivní data pro kresbu komunikace a ověřeného nájemníka na S4, krok „Komunikace.“ (výslovné zadání Kryštofa,
// 2026-10-20). Není to výstup z MVP: jméno nájemníka, zprávy i čas jsou vymyšlené. Nájemné 14 200 Kč a byt 3C
// sedí na kresbu plateb a funkcí, instalatér Tomáš Vavřík je fiktivní firma z kresby databáze (`databaseDemo.ts`).

const NB = ' ';

export const communicationDemoThread = {
  title: `Byt 3C${NB}· Jana Malá`,
  badge: 'Plán',
  composer: 'Napsat zprávu…',
} as const;

export type DemoMessage =
  | { kind: 'in' | 'out'; text: string; time: string; chip?: string }
  | { kind: 'event'; text: string; tone: 'neutral' | 'paid' };

/** Zprávy a události ve vlákně shora dolů; událost vzniká z konkrétní zprávy (závada, platba). */
export const communicationDemoMessages: readonly DemoMessage[] = [
  { kind: 'in', text: `Teče kohoutek v${NB}koupelně.`, time: '9:12', chip: 'Závada' },
  { kind: 'event', text: `Závada předána${NB}· Tomáš Vavřík`, tone: 'neutral' },
  { kind: 'out', text: 'Instalatér dorazí zítra.', time: '9:20' },
  { kind: 'in', text: 'Nájem jsem poslal.', time: '18:04' },
  { kind: 'event', text: `Platba spárována${NB}· 14${NB}200${NB}Kč`, tone: 'paid' },
];

/** Ověřený nájemník: ověření proběhne jednou a se souhlasem, každý zaplacený nájem přidá měsíc do historie. */
export const communicationDemoVerified = {
  title: `Ověřený${NB}nájemník`,
  checks: ['Insolvence', 'Exekuce', 'Příjem'],
  checkOk: 'Ověřeno',
  once: `Jednou, se${NB}souhlasem.`,
  historyLabel: `Platby${NB}· 12${NB}měsíců`,
  months: 12,
  summary: `12${NB}měsíců, vše${NB}včas.`,
  shareLabel: 'Sdílet historii',
} as const;
