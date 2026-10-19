# Fáze 1 — Scaffold

## Kontext
Přečti `CLAUDE.md`, `memory/index.md`, `memory/pravidla.md`, `memory/memory.md`, `AGENTS.md` a `docs/BRIEF.md` (stačí §0–§5). Repo zatím obsahuje jen dokumentaci.

## Cíl
Postavit kostru projektu se všemi nástroji, aby další fáze řešily už jen obsah a chování.

## Rozsah
1. Vite + React 19 + TypeScript (`strict`, `noUncheckedIndexedAccess`) v kořeni repa. Dokumentaci nepřepisuj.
2. Tailwind v4 přes `@tailwindcss/vite`. Prázdný `src/design/tokens.css` s `@theme` blokem a tokeny z BRIEF §3 (hodnoty zatím ze screenshotů).
3. `motion`, `@fontsource/space-grotesk`, `@fontsource/jetbrains-mono` (font řádků výpisu se ověří ve fázi 3).
4. `vite-plugin-singlefile` a `base: './'`. Build musí dát jeden `dist/index.html`.
5. ESLint (flat config, react-hooks), Prettier, Vitest a Playwright (Chromium je předinstalovaný, `playwright install` nespouštěj).
6. Skripty podle tabulky v `AGENTS.md`. Ty, které ještě nemají logiku, zatím jen vypíší „TODO fáze N“ a skončí kódem 0. Výjimka: `check:content` vytvoř hned jako skutečný skript (`scripts/check-content.ts`, spouštěný přes `tsx`), zatím nad prázdným obsahem.
7. Adresářová struktura podle `AGENTS.md`, s prázdnými moduly a krátkým komentářem, k čemu slouží.
8. `src/content/slides.ts` s typy (bez obsahu):
   ```ts
   type Fact = { value: string; source?: string; status: 'verified' | 'placeholder' };
   type SlideContent = { id: string; title: string; budgetSec: number; steps: number; screen: Record<string, string | Fact>; notes: string };
   ```
9. `.gitignore` (`node_modules`, `dist`, `export`, `test-results`), `git init` a první commit.

## Mimo rozsah
Navigace, design a slajdy.

## Kritéria přijetí
- [ ] `npm run dev` ukáže prázdnou tmavou stránku (`--night`).
- [ ] `npm run build` vytvoří jediný soubor `dist/index.html`, který se otevře přes `file://` bez chyb v konzoli.
- [ ] `typecheck`, `lint`, `test` (jeden smoke test) a `check:content` projdou.
- [ ] V kódu nejsou natvrdo zapsané barvy ani časy.

## Konec fáze
Aktualizuj `memory/memory.md` (Aktuální stav, changelog) a fázi v `memory/index.md`. Commitni jako `fáze 1: scaffold`.
