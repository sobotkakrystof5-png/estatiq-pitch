# Fáze 2 — Deck engine

## Kontext
Přečti standardní pořadí (CLAUDE.md §0), hlavně BRIEF §4 (motion pravidla) a §5 (ovládání).

## Cíl
Engine, na který se dají slajdy jen „nacvaknout“. Rychlý, deterministický a odolný vůči panice na pódiu.

## Rozsah
1. **Stage:** plátno 1920×1080 škálované přes `transform: scale()` na velikost okna, vycentrované, s letterboxem v barvě pozadí aktuálního slajdu (každý slajd exportuje `background: 'night' | 'paper' | 'black'`).
2. **Model:** `deck.config.ts` obsahuje pořadí slajdů, `steps` pro každý slajd a časový rozpočet. Stav `{ slide, step, mode: 'normal' | 'instant' }` se řídí čistým reducerem (`next`, `prev`, `goto`, `jumpToFinal`) a má unit testy včetně hranic, přechodu mezi slajdy a zpětného kroku na poslední krok předchozího slajdu.
3. **Kontrakt slajdu:** `({ step, mode }) => JSX`. Slajd svůj vzhled odvozuje jen ze `step`, nemá vlastní časovače pro navigaci.
4. **Klik vyhrává:** když přijde klik během běžící animace, aktuální přechody se dokončí okamžitě (Motion: `animate` s `duration: 0` nebo `MotionConfig` s `transition={{ duration: 0 }}` po dobu jednoho snímku) a teprve pak se provede akce. Dva kliky do 300 ms přepnou `mode: 'instant'`, který se vypne po 800 ms klidu.
5. **Přechod mezi slajdy:** `AnimatePresence mode="popLayout"`, výchozí prolnutí ≤ 400 ms. Slajd může definovat vlastní vstupní a výstupní přechod (potřeba pro S1→S2 a S2→S3).
6. **Ovládání:** všechny klávesy z BRIEF §5. Mapování je v `deck.config.ts`, včetně nouzového skoku na S8 přes `B` a `.`. Klávesy, které prezentér posílá, zjistí debug overlay (`D`).
7. **URL:** hash `#/slide/step`, který se při obnovení stránky obnoví.
8. **Kurzor** se po 2 s skryje. Zakázat výběr textu a kontextové menu.
9. **Přednačtení:** při startu se načtou všechny obrázky a fonty (`document.fonts.ready`). Do té doby je na tmavém pozadí jen nenápadný indikátor.
10. **Přehled záložních slajdů** (`Z`): mřížka náhledů Z1–Z7, výběr šipkami a Enterem. `Esc` vrátí na místo, kde přehled začal.
11. Pro test vytvoř 3 dummy slajdy s 0, 2 a 4 kroky. **Žádný design**, jen čísla kroků.

## Mimo rozsah
Režim přednášejícího a export (fáze 7), design (fáze 3).

## Kritéria přijetí
- [ ] Unit testy reduceru projdou.
- [ ] Při držení šipky se nic nezasekne a stav vždy odpovídá počtu stisků.
- [ ] Klik uprostřed 400ms přechodu okamžitě ukáže cílový stav.
- [ ] Obnovení na `#/2/3` ukáže přesně tento krok.
- [ ] `D` ukáže kódy kláves.
- [ ] Playwright e2e projde všechny kroky tam i zpět bez chyb v konzoli.

## Konec fáze
Zapiš do memory, aktualizuj index a commitni jako `fáze 2: engine`.
