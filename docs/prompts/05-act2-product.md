# Fáze 5 — 2. dějství: produkt, cena, trh (S4–S6)

## Kontext
Standardní pořadí čtení. Hlavně BRIEF §6 S4–S6 a §4. Použij `frontend-design` a `humanize-text-cs`.

## Cíl
Tma a klid. Na plátně je vždy jedna věc. Produkt je skutečný, čísla sedí.

## Rozsah
1. Obsah S4–S6 do `content`. Souřadnice zvýraznění ve screenshotech jsou v % a patří k obsahu.
2. **S4:** `LaptopFrame` a screenshot nebo placeholder. Vedle jedno slovo. V kroku 0 „zaklapne“ `StatementRow` do řádku platby (`spring.snap`) a ten zezelená. Je to tentýž motiv ze S2, tentokrát vyřešený. Zvýraznění v krocích 1 a 2 jsou jemná (tenký rámeček nebo podsvícení `--mint` s nízkou opacitou, žádná pulzující záře). Krok 3 ukáže větu.
3. **S5:** asymetrické rozdělení. `Counter` jen tam, kde přidá napětí (4,5 mil. ne, 0,1 % ano, nebo nic). `Strike` jen přes 1 200 Kč. Ověř aritmetiku v unit testu: 300 × 15 000 = 4 500 000; 4 990 / 4 500 000 ≈ 0,11 %; 8–12 % z 15 000 = 1 200–1 800.
4. **S6:** tři slova na jedné ose a linka za okraj. `showMarketStat` jako přepínač v configu, výchozí vypnuto.
5. Placeholdery a `[doplnit` podle BRIEF (tag, varianta věty na S4).

## Mimo rozsah
Úprava screenshotů v aplikaci EstatIQ. Pokud chybí, zůstane placeholder a do memory se zapíše, jaké screenshoty a data potřebuješ.

## Kritéria přijetí
- [ ] Na žádném kroku není na plátně víc než jedna dominantní věc.
- [ ] Mátová je na slajdu nejvýš jednou.
- [ ] Unit test aritmetiky S5 projde.
- [ ] Průchod, rychlé proklikání i zpětný krok fungují bez artefaktů.
- [ ] Sebekontrola proti BRIEF §2 (3 rizika a jak jsi je vyřešil).

## Konec fáze
Zapiš do memory a commitni jako `fáze 5: S4–S6`.
