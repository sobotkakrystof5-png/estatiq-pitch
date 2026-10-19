# AGENTS.md — technický popis repa estatiq-pitch

Fakta pro libovolného AI asistenta (Claude Code, Codex, Cursor). **Pravidla chování jsou v `CLAUDE.md` a platí pro všechny nástroje, ne jen pro Claude.** Pokud ho tvůj nástroj nenačítá automaticky, přečti ho ručně. Aktuální stav projektu je v `memory/memory.md`.

## Přehled
- **Co to je:** prezentace na pitch EstatIQ pro akcelerátor Green Light (VŠB-TUO). Aktuální verze má rozpočet 3:55 a 9 hlavních slajdů; záložní slajdy slouží na otázky poroty. Povolený čas pořadatele je nutné potvrdit.
- **Typ:** aplikace pro promítání s pevným plátnem 1920×1080 (16:9), ovládaná klávesnicí nebo prezentérem. Nejde o web.
- **Stack:** Vite + React 19 + TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/vite`, tokeny v `@theme`), Motion (`motion/react`, nástupce Framer Motion), `@fontsource/space-grotesk` a `@fontsource/jetbrains-mono` (jen latin + latin-ext), `vite-plugin-singlefile`. Dev: `opentype.js` 1.3.4 (logo, kontrola glyfů; v2 dává v cestách NaN). Testy: Vitest a Playwright (Chromium je předinstalovaný, `playwright install` nespouštěj, pokud prohlížeč chybí).
- **Výstupy:** `dist/index.html` je jeden soubor se všemi assety inline a funguje z `file://` bez sítě. `export/pitch.pdf` má jednu stránku na každý krok a `export/pitch-final.pdf` poslední krok každého slajdu; slouží jako záloha na flashku.

## Příkazy
| Příkaz | Co dělá |
|---|---|
| `npm run dev` | vývojový server |
| `npm run build` | produkční single-file build do `dist/` |
| `npm run build:release` | build, který selže, pokud v obsahu zůstal `[doplnit` |
| `npm run pdf` | Playwright vyrenderuje všechny kroky a finální stavy slajdů do PDF |
| `npm run check:content` | kontrola obsahu: max. 5 slov na prvek, nezlomitelné mezery, placeholdery |
| `npm run typecheck` / `lint` / `test` | TS, ESLint, Vitest |
| `npm run make:logo` | znovu vygeneruje logo z obrysů Space Grotesk 700 (`public/assets/logos/estatiq*.svg`, `src/design/primitives/logo.generated.ts`) |
| `npm run shoot:styleguide` | spustí Vite a nafotí `#/styleguide` do `test-results/styleguide/` (vizuální kontrola) |
| `npm run e2e` | build a Playwright nad `dist/index.html` přes `file://`: projde všechny kroky a hlídá chyby v konzoli. Když v cache chybí Chromium pro nainstalovanou verzi Playwrightu, `playwright.config.ts` vezme nejnovější `chromium_headless_shell-*` z cache (nebo `PW_CHROMIUM_PATH`) |

## Struktura (cílová)
```
CLAUDE.md  AGENTS.md
memory/            index.md · pravidla.md · memory.md
docs/BRIEF.md      zadání: příběh, design, slajdy
docs/prompts/      fázové prompty 01–08
public/assets/     photos/ · screens/ · logos/   (jen skutečné podklady)
scripts/           check-content.ts · make-logo.ts · shoot-styleguide.ts · export-pdf.ts
src/
  main.tsx  App.tsx
  deck/            engine: types, canvas (rozměr plátna), reducer (+test), hash, useDeck, useControls, Stage, Overview, DebugOverlay,
                   useStageGuards (kurzor, kontextové menu, preload), preload; fáze 7: sync, Presenter, PrintDeck
  motion/          presets.ts (časy, easingy, varianty), jediný zdroj timingu
  design/          tokens.css (@theme: barvy, škála text-hero/number/word/label/row, spacing edge),
                   primitives/ (Word, Strike, Counter, StatementRow, LaptopFrame, Placeholder, FlowLine, Logo, Glyph)
  styleguide/      #/styleguide, jen v `npm run dev` (v buildu není)
  slides/          S01Intro.tsx … S09Ask.tsx, backup/Z01…Z07, dev/Dummy.tsx (testovací slajd enginu),
                   chaos/ (ChaosScene + layout.ts: chaos z S2, ze kterého S3 startuje rozpad)
  content/         slides.ts: jediný zdroj textů, čísel a poznámek; check.ts: pravidla check:content
  deck.config.ts   pořadí slajdů, kroky, časový rozpočet, časy ovládání, mapování kláves
e2e/               Playwright nad buildem: deck.ts (pomůcky), engine, act1 (S1–S3 + fps při throttlingu 4×), logo
```

## Engine (kontrakt pro slajdy)
- Slajd je `({ step, mode, direction }) => JSX` a v `deck.config.ts` má `SlideDef`: `id`, `component`, `steps` (počet kliků, stavy 0…steps), `background` (`night` | `paper` | `black`), `budgetSec`, volitelně `variants` (`enter` / `center` / `exit`, doplní výchozí `slideFade`) a `busyMs` (délka vyprávěcí animace po vstupu).
- Vyprávěcí animace se rozhoduje při mountu nebo změně kroku. Když je `mode === 'instant'`, skočí rovnou na konec. `direction === -1` znamená příchod zpětným krokem.
- Vzor slajdu s nástupem: `const [play] = useState(() => step === 0 && mode === 'normal' && direction === 1)`. Jen když `play`, startuje nástup (`initial` se skrytým stavem, `useAnimate` sekvence); jinak se kreslí hotový stav. Skrytý výchozí stav patří do `initial`, ne do `style` (style by přepsal hodnoty z imperativní animace).
- Smyčky (`repeat`, dlouhé lineární animace) spouštěj jen v `mode === 'normal'`: pod `instantAnimations` je Motion jen skočí na konec a už nepoběží.
- Slajdy importují rozměr plátna z `src/deck/canvas.ts`, ne z `deck.config.ts` (kruhový import).
- „Klik vyhrává“ řeší engine: když přijde akce během přechodu (`dur.slide` nebo `busyMs`), přemountuje slajd přes `epoch` s `MotionGlobalConfig.instantAnimations` a teprve pak akci provede. Slajdy proto nesmí držet stav, který by přemountování ztratilo, a vše odvozují ze `step`.
- Hash `#/3/2` = hlavní slajd 3 (od 1), krok 2 (od 0). Záložní `#/z2/0`. Next/prev nepřechází mezi hlavními a záložními slajdy.

## Konvence
- Identifikátory jsou anglicky, obsah a komentáře k obsahu česky.
- **Text slajdu nikdy nepiš natvrdo do komponenty.** Patří do `src/content/slides.ts`.
- **Časy a easingy nepiš natvrdo do komponent.** Patří do `src/motion/presets.ts`.
- Barvy jen přes tokeny z `src/design/tokens.css`. Hex hodnoty v komponentách jsou zakázané.
- Typografie jen přes škálu `text-hero`, `text-number`, `text-word`, `text-label`, `text-row`. Okraj plátna `p-edge` / `left-edge` (120 px).
- `→` a `★` v písmu nejsou: kresli je `<Glyph>`, `check:content` je v textu slajdu odmítne.
- Jednotku `ch` nepoužívej: Chrome ji u fontů s `unicode-range` počítá z náhradní metriky. Pro monospace použij `em` (JetBrains Mono = 0,6em na znak).
- Animuj jen `transform`, `opacity`, `clip-path` a SVG `stroke-dashoffset`. Žádný `filter: blur` na velkých plochách a žádné animace layoutu kromě `layoutId`.
- Jeden slajd = jedna komponenta. Stav slajdu se odvozuje deklarativně z indexu kroku (`step`), ne z časovačů.
- Commity jsou malé a česky, ve tvaru `fáze N: co`.

## Lokální skills
| Skill | Kdy |
|---|---|
| `frontend-design` (globální skill Claude Code; v Codexu přečti BRIEF §2–§4) | návrh a ladění vizuálu slajdů (fáze 3–6) |
| `humanize-text-cs` (`.claude/skills/`) | každá úprava mluveného textu nebo textu na slajdu |
| `project-memory-system` (`.claude/skills/`) | údržba `memory/` (pravidla jsou v `memory/pravidla.md`) |

## Vazba na paměť
Každá změna faktů v tomto souboru se ve stejném kroku zapíše i do `memory/memory.md`.
