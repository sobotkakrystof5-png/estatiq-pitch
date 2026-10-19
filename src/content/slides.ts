// Jediný zdroj textů, čísel a poznámek. Obsah se doplní ve fázích 4–6.
export type Fact = { value: string; source?: string; status: 'verified' | 'placeholder' };

export type SlideContent = {
  id: string;
  title: string;
  budgetSec: number;
  steps: number;
  screen: Record<string, string | Fact>;
  notes: string;
};

export const slides: SlideContent[] = [];
