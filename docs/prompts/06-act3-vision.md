# Fáze 6 — 3. dějství: vrchol a prosba (S7, S8, Z1–Z7)

## Kontext
Standardní pořadí čtení. Hlavně BRIEF §6 S7, S8 a Záložní slajdy, §1 (uzavření kruhu). Použij `frontend-design` a `humanize-text-cs`.

## Cíl
Vrchol, který přepne místnost do ticha, a konec, který se vrátí k padouchovi.

## Rozsah
1. **S7:** přechod z S6 do `--black` je jediný „tvrdý“ střih v prezentaci (bez prolnutí, okamžitě), což je záměrný kontrast. Kroky podle BRIEF. `FlowLine` teče pomalu (cyklus ~2,4 s), 1–2 px, `--fg` s nízkou opacitou a v toku prosvítá `--mint`. Krok 5 ztlumí vše a ukáže větu.
2. **S8:** hesla pod sebou, v kroku 3 jeden `StatementRow` na proužku `--paper`, který se rozpustí (`clip-path` zleva doprava, ~1,2 s, vyprávěcí, neblokuje). Zůstane malé logo.
3. **Z1–Z7:** stejný design, obsah podle tabulky v BRIEF. Kde chybí data, je tam placeholder. Z3 je pozicování, ne tabulka funkcí. Z7 jsou 4 kroky digitální kauce jako časová osa.
4. Obsah do `content` a `check:content` pro Z s mírnějším limitem z configu.

## Kritéria přijetí
- [ ] Střih do černé na S7 působí záměrně, ne jako chyba.
- [ ] Tok linek běží plynule a nezatěžuje CPU (rAF ne, CSS nebo Motion na `stroke-dashoffset`).
- [ ] `Esc` z přehledu záložních slajdů vrátí přesně na předchozí krok.
- [ ] Průchod, rychlé proklikání i zpětný krok fungují.
- [ ] Sebekontrola proti BRIEF §2.

## Konec fáze
Zapiš do memory a commitni jako `fáze 6: S7, S8, záložní`.
