# INDEX — mapa paměti

Čti jako první v každé session. Sám obsah nedrží, říká jen, kde co najdeš.

## 1. Stav projektu (jeden řádek)
**Fáze:** 4 hotová (S1–S3, commit `fáze 4: S1–S3`). Další krok je `docs/prompts/05-act2-product.md`.
Detail je v `memory.md` → Aktuální stav.

## 2. Systémové soubory
| Soubor | Obsah | Kdy na něj sáhnout |
|---|---|---|
| `memory/index.md` | mapa a stav v jednom řádku | nový systémový soubor nebo změna fáze |
| `memory/pravidla.md` | jak se vede paměť | jen na výslovný pokyn uživatele |
| `memory/memory.md` | stav, rozhodnutí, otázky, changelog | po každé změně projektu |
| `CLAUDE.md` | chování a proces | výjimečně, na rozhodnutí uživatele |
| `AGENTS.md` | stack, struktura, příkazy, konvence | při změně stacku, struktury nebo konvencí |
| `docs/BRIEF.md` | příběh, design, specifikace slajdů | při schválené změně obsahu nebo designu |
| `docs/prompts/*` | fázové zadání | po dokončení fáze se nemění |

## 3. Přednost při rozporu
Živý prompt uživatele → `CLAUDE.md` → `memory/pravidla.md` → `memory/memory.md` → `docs/BRIEF.md` → `AGENTS.md`. Rozpor se vždy nahlásí, nikdy se neřeší potichu.

## 4. Fáze
| # | Prompt | Výsledek |
|---|---|---|
| 1 | `01-scaffold.md` | projekt, nástroje, skripty, prázdný deck |
| 2 | `02-engine.md` | navigace, kroky, ovladač, škálování plátna |
| 3 | `03-design-system.md` | tokeny, písmo, logo, primitiva, motion presety |
| 4 | `04-act1-chaos.md` | slajdy 1–3: chaos a odhalení |
| 5 | `05-act2-product.md` | slajdy 4–6 |
| 6 | `06-act3-vision.md` | slajdy 7–8 a záložní slajdy |
| 7 | `07-presenter-export.md` | režim přednášejícího, offline build, PDF |
| 8 | `08-rehearsal-qa.md` | časování, audit slopu, generálka |

## 5. Rychlý start session
1. `CLAUDE.md` → `index.md` → `pravidla.md` → `memory.md` → `AGENTS.md` → `docs/BRIEF.md`.
2. V `memory.md` zjisti, kde se skončilo.
3. Otevři prompt aktuální fáze a pracuj.
4. Každou změnu zapiš do `memory.md` hned.
