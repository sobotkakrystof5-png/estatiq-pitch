# Fáze 3 — Design systém a primitiva

## Kontext
Standardní pořadí čtení. Hlavně BRIEF §2 (slop), §3 (design A) a §4 (motion). Použij skill `frontend-design`.
Pokud máš přístup k repu EstatIQ (Kryštof ho může přidat jako složku), **ověř** barvy, font loga a font čísel a tokeny opravuj podle něj. Bez přístupu použij hodnoty z BRIEF a zapiš otázku do memory.

## Cíl
Všechny stavební kameny, ze kterých se slajdy poskládají bez jediné natvrdo zapsané hodnoty.

## Rozsah
1. **Tokeny** v `tokens.css` podle BRIEF §3, typografická škála jako utility (`text-hero`, `text-number`, `text-word`, `text-label`) s trackingem a řádkováním.
2. **Logo:** pokud chybí `public/assets/logos/estatiq.svg`, vygeneruj ho skriptem `scripts/make-logo.ts` z obrysů Space Grotesk Bold přes opentype.js („Estat“ `--fg`, „IQ“ `--mint`). Ulož i jednobarevnou variantu. Porovnej s webem EstatIQ a rozdíly zapiš.
3. **`src/motion/presets.ts`** přesně podle tabulky BRIEF §4. Žádné jiné časy v projektu.
4. **Primitiva** v `src/design/primitives/`:
   - `Word`: heslo s nástupem, stavy `hidden | dim | lit`.
   - `Strike`: SVG čára přes obsah, kreslená přes `stroke-dashoffset` mírně šikmo, jako tah rukou.
   - `Counter`: tabulková číslice 0→N, easing `ease.out`, respektuje `mode: 'instant'`.
   - `StatementRow`: řádek výpisu (datum, VS, částka, jméno) v monospace. Je to **podpisový motiv**, pečlivě vyladěný.
   - `LaptopFrame`: minimální rám bez odlesků, uvnitř screenshot nebo placeholder.
   - `Placeholder`: podle BRIEF §7.
   - `FlowLine`: SVG linka se smyčkovým tokem (S7).
   - `Logo`.
5. **Kontrola obsahu** (`check:content`): nejvýš 5 slov na textový prvek `screen` (výjimky S1 a Z* uvedené v configu), nezlomitelné mezery v číslech a po jednopísmenných předložkách, hlášení `[doplnit` (chyba jen v `build:release`).
6. **Stránka `#/styleguide`** (jen ve vývoji): všechna primitiva a stavy na plátně 1920×1080.

## Mimo rozsah
Konkrétní slajdy.

## Kritéria přijetí
- [ ] Styleguide ukazuje všechna primitiva a vypadá jako ruční práce, ne jako komponentová knihovna.
- [ ] Diakritika ve všech řezech se vykresluje bez náhradního fontu.
- [ ] V `src/` mimo `tokens.css` není žádný hex a mimo `presets.ts` žádné `duration`.
- [ ] Logo SVG odpovídá webu (screenshot porovnání v `test-results/`).

## Konec fáze
Zapiš do memory (včetně ověřených či neověřených tokenů) a commitni jako `fáze 3: design systém`.
