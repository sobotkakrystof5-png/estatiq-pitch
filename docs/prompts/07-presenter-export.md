# Fáze 7 — Režim přednášejícího, offline build, PDF

## Kontext
Standardní pořadí čtení. BRIEF §5 a §8.

## Cíl
Prezentace přežije cizí počítač, chybějící internet i rozbitý projektor.

## Rozsah
1. **Režim přednášejícího** (`P` otevře `?presenter` v novém okně):
   - vlevo aktuální krok (zmenšený Stage), vpravo náhled dalšího kroku,
   - pod nimi poznámky z `content` ve velkém písmu, `[pauza]` a `[klik]` vizuálně odlišené,
   - stopky odpočítávají 3:00 a startují prvním klikem ze S1 (nebo `T`), u každého slajdu je cílový čas a odchylka ±s,
   - od 2:40, pokud ještě není S8, se lišta zbarví na `--red`.
   - **Synchronizace:** `BroadcastChannel`, a když není k dispozici nebo selže (`file://`), `postMessage` přes `window.opener`. Ovládat jde z obou oken.
2. **Single-file build:** všechny obrázky a fonty inline. Ověř Playwrightem otevření `dist/index.html` přes `file://` s vypnutou sítí (`context.setOffline(true)`), průchod všemi kroky a nulové chyby v konzoli. Ověř i otevření okna přednášejícího z `file://`.
3. **Režim tisku `?print`:** bez animací, každý krok ve finálním stavu.
4. **`npm run pdf`:** Playwright projde všechny kroky v `?print` a vyrobí `export/pitch.pdf` (jedna stránka 1920×1080 na krok) a navíc `export/pitch-final.pdf` (jen poslední krok každého slajdu, včetně Z).
5. **`build:release`** selže, pokud zůstal `[doplnit`, a vypíše seznam toho, co chybí.

## Kritéria přijetí
- [ ] Offline e2e test z `file://` projde.
- [ ] Režim přednášejícího se synchronizuje v obou směrech, i z `file://`.
- [ ] PDF obsahuje všechny kroky a diakritika je v pořádku.
- [ ] Velikost `dist/index.html` je zapsaná v memory (cíl < 15 MB, jinak zmenši screenshoty do WebP).

## Konec fáze
Zapiš do memory a commitni jako `fáze 7: přednášející a export`.
