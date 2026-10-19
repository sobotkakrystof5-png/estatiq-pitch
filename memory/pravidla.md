# PRAVIDLA — jak se vede paměť projektu

## 1. Základ
Každá změna projektu se zapíše do `memory.md` hned, ve stejném kroku. Ne na konci session a ne až po připomenutí.

## 2. Co se zapisuje
Vytvoření, přejmenování nebo smazání souboru. Změna obsahu slajdu, designu nebo animace. Technické rozhodnutí (knihovna, build, export). **Co se zkusilo a nefungovalo** (např. problém výkonu animace). Co se záměrně odkládá a proč. Otázky pro uživatele.

## 3. Co se nezapisuje
Komentáře k postupu („nejdřív jsem hledal…“), nic, co je vidět přímo v kódu, sebechvála, duplikace `CLAUDE.md` nebo `AGENTS.md` a session bez změn.

## 4. Formát záznamu v changelogu
Nejnovější nahoře:
```markdown
### RRRR-MM-DD — Krátký název
- **Co:** jedna až dvě věcné věty v minulém čase.
- **Proč:** důvod, nebo „na pokyn uživatele“.
- **Dopad:** čeho dalšího se to týká (jiné slajdy, časování, export). Nebo „izolované“.
- **Soubory:** `cesta/k/souboru`
```
Vždy absolutní datum. Žádná vymyšlená fakta: chybějící údaj patří do Otevřených otázek.

## 5. Údržba sekcí `memory.md`
| Sekce | Kdy |
|---|---|
| Aktuální stav | změna fáze nebo dokončení většího celku; přepisuje se |
| Klíčová rozhodnutí | rozhodnutí, ke kterému se nevracíme; jen se přidává |
| Otevřené otázky | vznikne otázka; po zodpovězení se smaže a odpověď jde do rozhodnutí nebo changelogu |
| Záměrně neuděláno | něco se vědomě vynechává; chrání to před „opravou“ |

## 6. Začátek a konec session
**Začátek:** projít pořadí čtení z `index.md` a nový požadavek porovnat s Klíčovými rozhodnutími a Záměrně neudělanými věcmi.
**Konec:** každá změna je v changelogu, Aktuální stav sedí a zodpovězené otázky jsou smazané.

## 7. Ověřuj, nepředpokládej
Paměť popisuje stav v době zápisu. Než se na něco z ní spolehneš, ověř to v kódu.
