# Fázové prompty: jak s nimi pracovat

1. Každá fáze má jeden prompt. Vlož ho do Claude Code nebo Codexu **celý** jako první zprávu nové session.
2. Další fázi začni až ve chvíli, kdy předchozí splňuje svá kritéria přijetí a je commitnutá.
3. Na konci fáze agent aktualizuje `memory/memory.md` a `memory/index.md` (řádek „Fáze“).
4. Claude Code a Codex se mohou střídat. Codex čte `AGENTS.md`, který ho odkáže na `CLAUDE.md`.
5. Hodí se nechat jeden nástroj stavět a druhý dělat review: „Projdi diff fáze N proti promptu a BRIEF §2 a §4. Vypiš jen konkrétní problémy.“

Každý prompt má stejnou kostru: **Kontext → Cíl → Rozsah → Mimo rozsah → Kritéria přijetí → Konec fáze.**

| # | Prompt | Závisí na |
|---|---|---|
| 01 | scaffold | — |
| 02 | engine | 01 |
| 03 | design-system | 02 |
| 04 | act1-chaos (S1–S3) | 03 |
| 05 | act2-product (S4–S6) | 03 |
| 06 | act3-vision (S7, S8, Z) | 03 |
| 07 | presenter-export | 02 (nejlépe po 06) |
| 08 | rehearsal-qa | vše |
