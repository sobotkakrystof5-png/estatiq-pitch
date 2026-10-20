// Fiktivní data pro animovaný dashboard na S4, krok „Platby.“ (výslovné zadání Kryštofa, 2026-10-20).
// Není to export z MVP: částky a názvy jsou vymyšlené jen pro demonstraci. Číslo za ' ' je nezlomitelná mezera.

export type DemoEvent = {
  /** Co se stalo: příjem, výdaj, nová pohledávka po splatnosti, nebo její úhrada. */
  kind: 'income' | 'expense' | 'overdue' | 'settled';
  title: string;
  date: string;
  amount: number;
};

/** Pořadí událostí v říjnu; po každé se přepočítají karty, graf i seznam plateb. */
export const paymentsDemoEvents: readonly DemoEvent[] = [
  { kind: 'income', title: 'Nájem · byt 1A', date: '01. 10.', amount: 1_000 },
  { kind: 'income', title: 'Nájem · byt 2B', date: '02. 10.', amount: 12_500 },
  { kind: 'income', title: 'Nájem · byt 3C', date: '03. 10.', amount: 14_200 },
  { kind: 'expense', title: 'Fond oprav', date: '05. 10.', amount: 2_300 },
  { kind: 'income', title: 'Zálohy na energie', date: '07. 10.', amount: 3_100 },
  { kind: 'expense', title: 'Voda a kanalizace', date: '09. 10.', amount: 1_800 },
  { kind: 'overdue', title: 'Nájem · byt 4D', date: '10. 10.', amount: 7_400 },
  { kind: 'settled', title: 'Nájem · byt 4D', date: '14. 10.', amount: 7_400 },
];

/** Příjmy květen–září v tisících Kč, říjen se skládá z událostí výše. */
export const paymentsDemoHistory = [21, 24, 27, 26, 31] as const;
export const paymentsDemoMonths = ['Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj'] as const;

/** Statické karty pod přehledem (Pojištění, Úvěry, Měřidla). */
export const paymentsDemoStatic = { properties: 4, loans: 0, readings: 1 } as const;
