# Fáze 8 — Generálka a QA

## Kontext
Standardní pořadí čtení. Celý BRIEF, hlavně §2 a §8. Použij `humanize-text-cs` na všechny `notes`, ale bez změny faktů a čísel.

## Cíl
Najít a opravit všechno, co by na pódiu mohlo selhat nebo vypadat jako šablona.

## Rozsah
1. **Audit slopu:** projdi každý krok (screenshoty z `npm run e2e`) proti BRIEF §2. Výstupem je tabulka `slajd | problém | oprava`. Opravuj jen po schválení Kryštofem.
2. **Audit textu:** počet slov na plátně, typografie (nezlomitelné mezery, uvozovky „“, desetinná čárka) a `notes` přes `humanize-text-cs`.
3. **Časování:** z `notes` spočítej odhad délky (~138 slov/min a pauzy). Vypiš tabulku slajd | odhad | rozpočet | rozdíl a navrhni škrty, ale neprováděj je.
4. **Výkon:** záznam výkonu v DevTools pro S2 a S7 při 4× throttlingu, výsledky do memory.
5. **Checklist na den pitche** do `docs/DEN-PITCHE.md`: nabitý notebook, redukce HDMI/USB-C, prezentér + baterie, flashka s `dist/index.html` a PDF, otestovat rozšířenou plochu, vypnout notifikace, jas na maximum, `F` celá obrazovka, `D` test prezentéru, živé demo EstatIQ připravené v jiném okně.
6. Zkontroluj, že `build:release` projde. Pokud ne, vypiš, co chybí od Kryštofa.

## Kritéria přijetí
- [ ] Všechny body BRIEF §8 jsou odškrtnuté, nebo mají v memory uvedený důvod.
- [ ] `docs/DEN-PITCHE.md` existuje.

## Konec fáze
Zapiš do memory, fázi nastav na „hotovo, čeká na generálku“ a commitni jako `fáze 8: QA`.
