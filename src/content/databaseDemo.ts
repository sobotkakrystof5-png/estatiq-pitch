// Fiktivní data pro kresbu databáze dodavatelů na S4, krok „Databáze.“ (výslovné zadání Kryštofa, 2026-10-20).
// Není to export z MVP: firmy, jména, telefony i e-maily jsou vymyšlené (telefony mají nulovou střední skupinu,
// e-maily doménu .example). Počet 453 a záložky Nabídky a Poptávky (0) jsou převzaté z dodaného screenshotu.

export type DemoSupplier = {
  firm: string;
  field: string;
  city: string;
  region: string;
  phone: string;
  email: string;
};

export const databaseDemoTabs = {
  suppliers: 453,
  offers: 0,
  requests: 0,
} as const;

export const databaseDemoSuppliers: readonly DemoSupplier[] = [
  {
    firm: 'Instalace Dvořák s.r.o.',
    field: 'Instalatér, Topenář',
    city: 'Ostrava',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 101',
    email: 'info@dvorak-instalace.example',
  },
  {
    firm: 'Jan Kubíček',
    field: 'Elektrikář',
    city: 'Ostrava',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 102',
    email: 'kubicek@elektro-ova.example',
  },
  {
    firm: 'Tomáš Vavřík',
    field: 'Instalatér',
    city: 'Havířov',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 103',
    email: '-',
  },
  {
    firm: 'Topení Morava s.r.o.',
    field: 'Topenář, Klimatizace, Plynař',
    city: 'Karviná',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 104',
    email: 'info@topeni-morava.example',
  },
  {
    firm: 'Petr Sládek',
    field: 'Malíř',
    city: 'Opava',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 105',
    email: 'sladek@malir-opava.example',
  },
  {
    firm: 'Zámečnictví Beneš',
    field: 'Zámečník',
    city: 'Ostrava',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 106',
    email: 'benes@zamky-ova.example',
  },
  {
    firm: 'Podlahy Fiala s.r.o.',
    field: 'Podlahář',
    city: 'Frýdek-Místek',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 107',
    email: 'info@podlahy-fiala.example',
  },
  {
    firm: 'Lukáš Hruška',
    field: 'Elektrikář, Revize',
    city: 'Třinec',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 108',
    email: 'hruska@revize-trinec.example',
  },
  {
    firm: 'Okna a dveře Bartoš',
    field: 'Okna a dveře',
    city: 'Nový Jičín',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 109',
    email: 'info@okna-bartos.example',
  },
  {
    firm: 'Plyn servis Ostrava s.r.o.',
    field: 'Plynař',
    city: 'Ostrava',
    region: 'Moravskoslezský kraj',
    phone: '+420 700 000 110',
    email: 'servis@plyn-ostrava.example',
  },
];

export const databaseDemoFilters = {
  search: 'Hledat dodavatele nebo poptávky...',
  field: 'Všechny obory',
  scope: 'Vše',
  region: 'Všechny kraje',
  city: 'Všechna města',
} as const;
