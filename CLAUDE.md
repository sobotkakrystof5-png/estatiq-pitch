# CLAUDE.md — EstatIQ pitch (Green Light)

Závazné pro každou session v tomto repu (Claude Code i Codex). Čti na začátku každé session, ne jednou. Při rozporu s promptem platí tento soubor, pokud uživatel výslovně neřekne jinak.

## 0. První krok každé session
Přečti v tomto pořadí: `memory/index.md` → `memory/pravidla.md` → `memory/memory.md` → `AGENTS.md` → `docs/BRIEF.md`.
Pracuješ podle jednoho promptu z `docs/prompts/`. Nedělej práci z dalších fází.

## 1. Co stavíme (jedna věta)
Prezentaci na pitch EstatIQ před porotou Green Light. Aktuální verze podle Kryštofova zadání má osm hlavních slajdů a časový rozpočet 3:55. Je to **aplikace pro promítání, ne web**: žádné scrollování, SEO, responzivita pro mobil, formuláře ani navigace pro návštěvníky.

## 2. Jak jednat s uživatelem
- Uživatel je Kryštof, zakladatel EstatIQ a vývojář. Mluv s ním česky, věcně a bez nadšení a omáčky.
- Když je požadavek špatný, riskantní nebo v rozporu s briefem, řekni to **na začátku** odpovědi.
- Odpovědi piš krátce. Co jde říct třemi větami, nepiš patnácti.
- Kritika je vítaná. Pochvalu vynech.

## 3. Postup před každou změnou
1. Jednou větou zopakuj, co se chce.
2. Zkontroluj požadavek proti `memory.md` (Klíčová rozhodnutí, Záměrně neuděláno) a proti `docs/BRIEF.md`.
3. Když narazíš na rozpor, pojmenuj ho dřív, než začneš implementovat.
4. Implementuj.
5. Ve stejném kroku zapiš změnu do `memory/memory.md`.

## 4. Nevyjednatelná pravidla
1. **Žádný AI slop.** Seznam zakázaných vzorů je v `docs/BRIEF.md` §2. Když si nejsi jistý, jestli něco nepůsobí jako šablona, zeptej se.
2. **Na slajdu jsou jen hesla**, nejvýš 5 slov na jeden textový prvek. Všechno ostatní patří do poznámek přednášejícího. Hlídá to `npm run check:content`.
3. **Nevymýšlej fakta.** Čísla, jména, citace a údaje o zákaznících se berou jen z `src/content/`. Co chybí, má tvar `[doplnit: …]` a zapíše se do Otevřených otázek. Nikdy ho nenahrazuj odhadem.
4. **Animace nesmí přednášejícího zdržet** (`docs/BRIEF.md` §4). Každý klik se projeví okamžitě a žádná animace neblokuje navigaci.
5. **Funguje offline.** Žádné CDN, Google Fonts, analytika ani síťové požadavky za běhu.
6. **Neměň stack, strukturu slajdů ani design systém potichu.** Návrh přednes a rozhodnutí nech na uživateli.
7. **Žádné stock fotky, generické ikony ani vymyšlené screenshoty.** Chybějící asset má podobu popsaného placeholderu (BRIEF §7).
8. **Česká typografie:** nezlomitelná mezera po jednopísmenných předložkách a spojkách, v číslech (`4 990 Kč`) a mezi číslem a jednotkou. Desetinná čárka (`0,1 %`).

## 5. Kvalita a ověření
Než fázi prohlásíš za hotovou, projdi kritéria přijetí z jejího promptu. Výsledky ověř spuštěním: `npm run typecheck`, `npm run lint`, `npm test`, `npm run check:content`, případně `npm run build` a otevření `dist/index.html` přes `file://`. Co jsi neověřil, tak nenazývej.

## 6. Rozpor promptu s tímto souborem
Pojmenuj rozpor jednou až dvěma větami. U nevratných změn (stack, struktura, design systém, nahrazení placeholderu neověřeným obsahem) počkej na potvrzení. U drobností dej vědět a pokračuj.

## 7. Texty
Mluvený text (`notes`) i texty na slajdech jsou česky a nesmí znít jako AI. Při úpravě textu použij skill `humanize-text-cs`. Fakta a čísla nikdy neměň.
