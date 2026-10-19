# BRIEF — prezentace EstatIQ pro Green Light

Zdroj pravdy pro obsah, design a animace. Technika je v `AGENTS.md`, chování v `CLAUDE.md`.

---

## 0. Účel a měřítko úspěchu

Aktuální verze má podle Kryštofova zadání devět hlavních slajdů a rozpočet 3:55. Původní podklad počítal s 3:00 a 7 minutami otázek; povolený čas je potřeba před vystoupením potvrdit. Porota hodnotí inovaci, ověření u zákazníků, škálovatelnost, vazbu na Moravskoslezský kraj a tým.

Prezentace je úspěšná, když si porota po vystoupení pamatuje tři věci:
1. **Padoucha:** správce každý měsíc ručně přepisuje výpis z banky do Excelu.
2. **Jméno a jednu větu:** EstatIQ, jeden systém místo tří nástrojů.
3. **Ambici:** platební a datová vrstva nájemního bydlení.

Styl je Steve Jobs: jedna myšlenka na obrazovku, obří písmo, ticho a pauzy, odhalení na klik, „A ještě jedna věc.“ Na plátně jsou hesla, příběh se říká nahlas.

---

## 1. Příběh: chaos a klid

Celý příběh nese **barva pozadí**:

```
S1 tma ──► S2 PAPÍR, chaos ──► S3 rozpad a tma ──► S4–S6 klid ──► S7 ČERNÁ ──► S8 tma ──► S9 závěr
             (problém)             (odhalení)       (produkt a tok)    (vize)      (ekonomika)    (prosba)
```

- Dokud je problém, je světlo a nepořádek. Řádky, bubliny a papíry se překrývají.
- Od chvíle, kdy přijde EstatIQ, je tma a prázdné místo. Na plátně je vždy jen jedna věc.
- Slajd 7 je jediný úplně černý. Tím divák pozná, že přichází vrchol.

**Podpisový motiv: řádek bankovního výpisu.** Jde o jednořádkový záznam neproporcionálním písmem (`12.09  VS 2024031  15 000,00  NOVÁK`). Prochází celým příběhem:
- S1: na slova „ruční přepisování“ začnou zespodu prosakovat řádky. To je most do S2.
- S2: řádky se po jednom přesouvají do tabulky. To je ten padouch.
- S4: jeden řádek se sám spáruje s platbou a zezelená. Je to stejný motiv, jen vyřešený.
- S8: stejná řeč řádků vysvětlí model kreditů a zůstatek po dvou použitích.

Motiv je podpis, ne dekorace. Nikde jinde se neobjevuje.

**Časový rozpočet (3:55):**
| # | Slajd | Od | Do | s |
|---|---|---|---|---|
| 1 | Kdo jsem | 0:00 | 0:15 | 15 |
| 2 | Problém | 0:15 | 0:45 | 30 |
| 3 | Odhalení | 0:45 | 1:00 | 15 |
| 4 | Produkt | 1:00 | 1:30 | 30 |
| 5 | Proč platí | 1:30 | 1:55 | 25 |
| 6 | Od smlouvy po daně | 1:55 | 2:15 | 20 |
| 7 | Ještě jedna věc | 2:15 | 2:45 | 30 |
| 8 | Kredity, příjmy, odlišení | 2:45 | 3:35 | 50 |
| 9 | Co chci | 3:35 | 3:55 | 20 |

---

## 2. Žádný AI slop (nejdůležitější sekce)

Prezentace musí vypadat, jako by ji navrhl a desetkrát ručně doladil člověk, který zná nájemní bydlení. Nesmí připomínat šablonu z generátoru.

**Zakázáno:**
- Fialovo-modré a duhové přechody, rozmazané skvrny, záře za nadpisem (radial glow) a mřížka v pozadí. Na webu EstatIQ to je, sem se to nepřebírá.
- Skleněné karty (glassmorphism), karty po třech nebo čtyřech se stejnou ikonou nahoře, pill štítky („Beta přístup“), avatary „4 lidí už čeká“.
- Emoji, jiskřičky ✨, „AI“ jako ozdoba, 3D postavičky, stock fotky, generické sady ikon (Lucide, Heroicons…) jako ilustrace.
- Odrážky. Nadpisy slajdů („Problém“, „Řešení“). Čísla stránek, logo v rohu každého slajdu a progress bar viditelný publiku.
- Fráze typu „revoluce“, „odemkněte potenciál“, „chytré řešení“, „všechno na jednom místě“ jako ozdoba.
- Všechno vycentrované se stejnými odsazeními. Jednotné „fade-in + slide-up“ na každém prvku.
- Mockupy zařízení s odlesky. Vymyšlené screenshoty.

**Místo toho:**
- Skutečné fotky, skutečné screenshoty z aplikace a skutečná čísla.
- Hodně prázdného místa. Každý slajd má vlastní kompozici a asymetrie je povolená (např. S1: fotka vlevo, jméno vpravo dole).
- Jedno písmo s charakterem, záměrně vyladěný tracking a obrovský kontrast velikostí.
- Animace s rytmem příběhu: každý pohyb něco říká (rozpad, spárování, tok).
- Před dokončením každého slajdu si polož otázku: „Vypadá to jako ruční práce pro EstatIQ, nebo jako šablona?“ Pokud jako šablona, slajd předělej.

---

## 3. Design systém A „Noc“

Převzatý z webu EstatIQ. Přesné hodnoty ověř v repu EstatIQ (`tailwind.config` / CSS proměnné). Níže jsou hodnoty odečtené ze screenshotů, které platí, dokud se neověří.

### Barvy (tokeny v `src/design/tokens.css`)
| Token | Hodnota | Použití |
|---|---|---|
| `--night` | `#0B0F17` | výchozí pozadí (S1, S3–S6, S8) |
| `--night-2` | `#121826` | jemná plocha, rám notebooku |
| `--black` | `#000000` | jen S7 |
| `--paper` | `#F5F4EF` | jen chaos (S2, most v S1, záblesk v S8) |
| `--ink` | `#14171C` | text na papíru |
| `--fg` | `#F2F4F7` | text na tmě |
| `--muted` | `#8B95A5` | popisky, tlumené prvky |
| `--mint` | `#5ED39A` | „IQ“ v logu a **jedno** zvýrazněné slovo na slajdu, ne víc |
| `--green` | `#3E9B6C` | stav „zaplaceno“ ve screenshotu a zvýraznění |
| `--amber` | `#E2A93B` | stav „čeká“ (jen S4) |
| `--red` | `#E5484D` | přeškrtnutí (S5) a stav „po splatnosti“ |

Poměr: nejméně 90 % tvoří neutrální plochy (tma nebo papír). Mátová je vzácná, a proto má sílu.

### Typografie
- **Space Grotesk** (ověřit v repu EstatIQ), lokálně přes `@fontsource/space-grotesk`, řezy 400/500/700. Jedno písmo na všechno.
- Řádky výpisu jsou v monospace: ověř, co používá web, jinak `JetBrains Mono` přes `@fontsource`. Je to jediná výjimka z pravidla jednoho písma a slouží pro motiv.
- Čísla mají `font-variant-numeric: tabular-nums`, aby se počítadlo netřáslo.
- Velikosti na plátně 1920×1080: hlavní heslo 160–220 px, číslo 240–320 px, podpůrné slovo 64–96 px, popisek 28–32 px. Nic menšího než 28 px.
- Tracking: velké velikosti `-0.03em` až `-0.045em`, popisky `0`. Řádkování velkých hesel `0.95`.
- Ověř glyfy `ěščřžýáíéůúťďň ĚŠČŘŽÝÁÍÉŮÚŤĎŇ ★ → ×` a symbol Kč.

### Logo
Logo je wordmark „Estat“ v `--fg` a „IQ“ v `--mint`, tučný řez. Je potřeba jako **SVG s obrysy** (`public/assets/logos/estatiq.svg`). Pokud neexistuje, vygeneruj ho z obrysů písma (opentype.js) a porovnej se screenshotem webu.

### Plátno a kompozice
- Pevné plátno 1920×1080 se škáluje na okno s letterboxem v barvě pozadí aktuálního slajdu. Funguje i na projektoru 4:3.
- Okraje 120 px. Mřížka 12 sloupců slouží jen jako vodítko a není nikde vidět.

---

## 4. Motion systém: pokročilé animace, které nezdržují

### Pravidla
1. **Klik vyhrává.** Další klik během animace ji okamžitě dokončí (skok do cílového stavu) a teprve potom se provede. Animace se nikdy neřadí do fronty.
2. **Stav je deklarativní.** Vzhled slajdu je funkce `(slideIndex, step)`. Animace jsou jen přechody mezi stavy, takže zpětný krok, skok a export do PDF dávají vždy stejný výsledek.
3. **Rozpočet:**
   - přechod mezi slajdy ≤ 400 ms,
   - odhalení kroku ≤ 400 ms,
   - **vyprávěcí animace** (stavba chaosu v S2, počítadlo, tok linek v S7) běží samy, zatímco Kryštof mluví, trvají nejvýš 3 s (tok v S7 smí smyčkovat) a nikdy nečekají na klik.
4. **Rychlé klikání:** při dvou klicích do 300 ms přejde engine do režimu `instant` bez animací, dokud se nezpomalí. Hodí se pro nouzový skok.
5. Animuje se jen `transform`, `opacity`, `clip-path` a SVG `stroke-dashoffset`. Žádná paralaxa, 3D, blur ani animované stíny. Plynulých 60 fps na integrované grafice.
6. Žádný pohyb pro pohyb. Každá animace odpovídá na otázku „co tím říkám?“.

### Presety (`src/motion/presets.ts`, jediný zdroj timingu)
| Preset | Hodnota | Kdy |
|---|---|---|
| `ease.out` | `[0.16, 1, 0.3, 1]` | nástupy |
| `ease.inOut` | `[0.65, 0, 0.35, 1]` | přesuny, splynutí |
| `dur.step` | 0.32 s | odhalení kroku |
| `dur.slide` | 0.4 s | přechod slajdu |
| `dur.word` | 0.28 s | zvýraznění slova |
| `spring.snap` | `{ stiffness: 520, damping: 42 }` | spárování řádku (S4) |
| `stagger.rows` | 0.06 s | řádky výpisu |

### Signature animace (kde se smí „předvést“)
| Slajd | Animace | Technika |
|---|---|---|
| S1→S2 | Řádky prosakují zespodu a pozadí přejde z tmy do papíru | `clip-path` wipe zespodu nahoru a staggered řádky |
| S2 | Stavba chaosu: řádky letí z výpisu do tabulky, bubliny vyskakují, počítadlo 0→300 | timeline na `useAnimate`, spouští se při vstupu |
| S2→S3 | Rozpad: chaos se rozsype, zůstanou čtyři slovní značky a pozadí ztmavne | pevné kotvy a `clip-path` u pozadí |
| S3 | Čtyři slova sjedou do středu a prolnou se v logo | `transform` + `opacity`, bez morphu |
| S4 | Řádek výpisu „zaklapne“ do platby a zezelená | `spring.snap` |
| S5 | Modelová cena správy se porovná s cenou nástroje | postupné odhalení částky a ceny |
| S7 | Linky od čtyř prvků tečou do loga | `stroke-dashoffset` ve smyčce, pomalé |
| S8 | Kreditní řádky odečtou opravu a návrh smlouvy; pak se obraz vymění za odlišení | `transform` a `opacity` |

Všude jinde stačí jednoduchý nástup ≤ 320 ms. Na každém slajdu je nejvýš jedna signature animace.

---

## 5. Ovládání a režimy (shrnutí, detail v promptech 02 a 07)

| Klávesa | Akce |
|---|---|
| → ↓ Space PageDown Enter | další krok |
| ← ↑ PageUp | předchozí krok |
| Home / End | slajd 1 / slajd 9 |
| číslo + Enter | skok na slajd |
| `B` nebo `.` | **nouzový skok na slajd 9** (tlačítko „černá obrazovka“ na prezentéru), mapování v `deck.config.ts` |
| `Z` | přehled záložních slajdů, `Esc` zpět na místo, kde přehled začal |
| `P` | otevře okno přednášejícího |
| `F` | celá obrazovka |
| `T` | start / reset stopek |
| `D` | debug: zobrazí kódy kláves (pro test prezentéru) |

- Kurzor se po 2 s nečinnosti skryje.
- URL ukládá pozici (`#/3/2`), takže obnovení stránky nic neztratí.
- **Režim přednášejícího** (druhé okno na notebooku, projektor je rozšířená plocha): aktuální krok, náhled dalšího, poznámky s vyznačenými pauzami, odpočet 3:55 a odchylka od časového plánu. Od 3:35, pokud ještě není slajd 9, se lišta zbarví na červenou.

---

## 6. Slajdy po slajdech

Formát: **Na plátně** (každý krok), **Pohyb**, **Poznámky** (mluvený text pro režim přednášejícího, beze změn ze schváleného dokumentu). `[pauza]` a `[klik]` jsou pokyny pro přednášejícího.

### S1 · Kdo jsem · tma · 0:00–0:15
- **Krok 0 (automaticky):** vlevo fotka 4:5 přes ~45 % výšky, posunutá z osy. Vpravo dole velké „Kryštof Sobotka“, pod ním „15 let · student · zakladatel“ v `--muted`.
- **Krok 1:** řádek důkazů: světlá loga Alteno × Vizeon · „15+ projektů“. „5,0 ★“ jen se zdrojem, jinak vypustit.
- **Krok 2 (na „ruční přepisování“):** zespodu prosakují řádky výpisu na papíře. To je most do S2.
- **Pohyb:** fotka 0,4 s opacity, jméno vyjede 24 px zespodu, podtitul +120 ms, důkazy naposledy.
- **Poznámky:** Jmenuji se Kryštof Sobotka. Je mi patnáct a [doplnit: škola a ročník]. Pod značkami Alteno a Vizeon stavím firmám weby a automatizace. U pronajímatelů vidím stejný problém. [pauza 2 s] Ruční přepisování.

### S2 · Problém · PAPÍR · 0:15–0:45
- **Krok 0 (automaticky, vyprávěcí timeline ~3 s, pak klidná smyčka):**
  - uprostřed výpis z banky (HTML/CSS, fiktivní data, žádné logo banky), řádky po jednom letí do mřížky tabulky (Excel naznačený mřížkou a zeleným pruhem záhlaví, bez loga),
  - z rohu vyskočí dvě chatové bubliny (zelená bublina, bez loga WhatsAppu): „Dobrý den, nájem pošlu příští týden.“ a „Neteče teplá voda.“,
  - v pozadí kulisy: šanon se smlouvami, papírové faktury, fotka vodoměru (skutečné fotky, do té doby placeholder),
  - nahoře vpravo počítadlo 0 → **300** a pod ním „řádků / měsíc“ (300 bytů = 300 platebních řádků v modelovém příkladu).
  - Banka, Excel a WhatsApp musí být v chaosu nejvýraznější. Energie se tu neukazují; přijdou v S6 a S7.
- **Krok 1 (na „kdo mu dluží“):** všechno se zastaví (pauza timeline) a přes scénu se pomalu stáhne ztlumení (`opacity`).
- **Poznámky:** Když firmám automatizuji faktury, člověk často ručně přepisuje data mezi nástroji. V pronájmech je stejný problém. Správce porovnává výpis z banky s Excelem. Nájemníci píšou na WhatsApp, smlouvy a faktury leží v šanonu. [pauza 2 s] U správce s 300 byty jde modelově o 300 platebních řádků každý měsíc. A nakonec musí zjistit: kdo mu dluží?

### S3 · Odhalení · papír → TMA · 0:45–1:00
- **Krok 0:** rozpad. Z chaosu vyjedou čtyři slovní značky: **Banka. Excel. WhatsApp. Smlouvy.** Čtvrté slovo vyjede ze šanonu. Pozadí se stáhne z papíru do tmy.
- **Kroky 1–4:** na každé vyslovené slovo se rozsvítí ono a ostatní klesnou na 25 %.
- **Krok 5 („Je to jeden.“):** slova sjedou do středu, zmenší se a prolnou se v logo EstatIQ.
- **Krok 6:** pod logem se objeví tag v `--muted`.
- **Poznámky:** Banka. [klik] Excel. [klik] WhatsApp. [klik] Smlouvy. [klik] [pauza 2 s] Dnes jsou oddělené. EstatIQ propojí platby, dokumenty a komunikaci pro pronajímatele i nájemníka. [klik] EstatIQ. [klik]
- **Tag:** „Pronájem, který se řídí sám.“ Platí jen po ověření skutečného bankovního párování.

### S4 · Produkt · tma · 1:00–1:30
- **Kroky 0–2:** tři statické screenshoty skutečné aplikace v jednoduchém CSS rámu notebooku; žádné mockupy ani video. Vedle se vystřídají popisky **Platby.** → **Přehled nemovitosti.** → **Nájemník.**
  - Platby: zelená zaplaceno, žlutá čeká, červená po splatnosti; jedna platba zezelená.
  - Portál vlastníka: jeho nemovitosti, přehled plateb a související úkony.
  - Portál nájemníka: vlastní smlouva, platby a hlášení závady.
- **Krok 3:** screenshoty zmizí; zůstane **Každý svůj přehled.**
- **Snímky:** jen skutečné MVP, fiktivní osobní data a realistická Ostrava. Chybějící snímky zůstávají placeholdery. Automatické stržení nájmu na S4 nepatří.
- **Poznámky:** Banka se promění v přehled plateb: zelená zaplaceno, žlutá čeká, červená po splatnosti. [klik] Excel nahradí portál vlastníka s přehledem jeho nemovitostí a úkonů. [klik] WhatsApp nahradí portál pro smlouvu, platby a hlášení závad. Nájemník vidí jen svůj byt, ne interní údaje majitele ani jiné nájemníky. [klik]

### S5 · Proč platí · tma · 1:30–1:55
- Rozdělená obrazovka bez dělicí čáry: B2B vlevo, modelový příklad vlastníka vpravo.
- **Vlevo B2B:** správce · 300 bytů; při nájmu 15 000 Kč celkem 4,5 mil. Kč měsíčně. Klik odhalí 4 990 Kč za EstatIQ a následně 0,1 % objemu nájmů.
- **Vpravo, krok 3:** model při nájmu 20 000 Kč; sazba 10–12 % dává aritmeticky 2 000–2 400 Kč měsíčně. Sazbu ověřit, neoznačovat za typický průměr.
- **Krok 4:** objeví se od 199 Kč/měs. pro vlastníka, který si správu zajišťuje sám.
- Správcovská firma poskytuje širší službu; nejde o totožné nabídky. Nepřeškrtávat cenu správy.
- **Nedělat:** srovnání s Repilotem ani tvrzení o úspoře jako garantovaném výsledku.
- **Poznámky:** Správce 300 bytů při nájmu 15 000 Kč hlídá 4,5 milionu měsíčně. [klik] EstatIQ stojí 4 990 Kč. [klik] To je asi 0,1 procenta. [pauza 2 s] [klik] Při nájmu 20 000 Kč dělá modelových 10 až 12 procent 2 000 až 2 400 Kč měsíčně. Sazbu ověříme; správa zahrnuje víc služeb. [klik] EstatIQ od 199 Kč měsíčně.
  - *Otevřené: zkrácení kvůli času (memory.md).*

### S6 · Od smlouvy po daně · tma · 1:55–2:15
- **Kroky 0–3:** štítek „Postupné rozšíření.“ a na jedné ose se postupně rozsvěcí **Smlouvy. → Správa. → Energie. → Daně.** Pod každým slovem krátce: podpis a dokumenty; platby, zprávy a závady; spotřeba a dodavatelé; přehled příjmů a výdajů.
- **Poznámky:** Rozšíření chceme ověřit v Ostravě. Po přijetí nájemníka se smlouva podepíše. [klik] Platby, zprávy, faktury a závady se vážou k nemovitosti. [klik] Energie i spotřeba mají své místo. [klik] Záznamy vytvoří přehled příjmů a výdajů pro přiznání. Je to evidence a export podkladů, ne automatické podání ani změna pravidel.

### S7 · Ještě jedna věc · ČERNÁ · 2:15–2:45
- **Krok 0:** čistá černá, uprostřed jen **A ještě jedna věc.** (80 px, `--fg`).
- **Kroky 1–4:** postupně se objeví **AI pro pronájem.**, **Ověřený nájemník.**, **Energie a řemeslníci.**, **Kauce a platby.** Ke každému bodu vede linka do loga; linky se rozbíhají postupně a pak tečou.
- **Krok 5:** všechno klesne na 15 % a doprostřed přijde věta **Platební vrstva nájemního bydlení.** Slovo „Platební“ je v `--mint`.
- **Pravidla:** jde o vizi, ne současné MVP. AI návrhy smluv kontroluje člověk. Ověření a sdílení historie volí nájemník; o přijetí rozhoduje pronajímatel. Kauce je evidence a podklad k rozhodnutí vlastníka, ne automatické stržení během nájmu. Automatické platby a tok peněz dodavatelům vyžadují právní a partnerské ověření.
- **Poznámky:** A ještě jedna věc. [pauza 2 s] [klik] AI může připravit návrh smlouvy ke kontrole a vysvětlit spotřebu. [klik] Nájemník se může dobrovolně ověřit v registrech, doložit příjem a při stěhování ukázat historii: 12 měsíců, vše včas. O přijetí rozhoduje pronajímatel. [klik] Při závadě si v aplikaci objedná řemeslníka z okolí; u energií dostane srovnání. [klik] Kauci budeme evidovat a hlídat upomínky; o dalším kroku rozhodne vlastník. [klik] Platební a datová vrstva nájemního bydlení.

### S8 · Kredity, příjmy a odlišení · tma · 2:45–3:35
- **Krok 0:** modelový účetní tok, bez skutečné peněženky: 1 000 Kč se mění na 1 000 kreditů, pod tím „1 kredit = 1 Kč“. Štítek **Model, ne ceník.**
- **Krok 1:** přiletí řádek **Oprava bytu −600 kreditů**, zůstatek se změní na 400 kreditů.
- **Krok 2:** přiletí řádek **AI návrh smlouvy −5 kreditů**, zůstatek 395 kreditů. Částka za řemeslníka není automaticky tržba EstatIQ; výnos platformy by tvořila smluvní provize.
- **Krok 3:** vpravo nastoupí čtyři zdroje možných příjmů: **Předplatné. AI funkce. Provize. Doporučení.** Doporučení dodavatelů musí být jasně označená.
- **Krok 4:** účetní tok se stáhne a objeví se poctivé srovnání: trh už nabízí platby, smlouvy, portály i kredity. Naší plánovanou sázkou je přenositelná historie nájemníka a návaznost závady na opravu či spotřeby na nabídku.
- **Pravidla:** 1 000 / 600 / 5 kreditů je pracovní příklad, ne schválený ceník. Zprostředkování oprav a přijímání kreditu pro třetí strany vyžaduje ověřený platební model, případně partnera. Neprezentovat konkurenční odlišení jako ověřený výsledek.
- **Poznámky:** Tohle je model, ne dnešní ceník. Tisíc korun dá tisíc kreditů. [klik] Oprava za šest set kreditů nechá čtyři sta. Celých šest set není náš výnos: řemeslník má cenu práce, EstatIQ by mělo smluvní provizi. [klik] Návrh smlouvy za pět kreditů nechá tři sta devadesát pět. [klik] Vydělávat chceme z předplatného, AI funkcí, provizí a označených doporučení energií. [klik] Repilot už používá kredity; eviduje.cz má platby, smlouvy i portál. Naší sázkou je přenosná historie nájemníka a cesta od závady k opravě nebo od spotřeby k nabídce. Ověříme ji v pilotech.
- **Podklady ke konkurenci:** [Repilot](https://www.repilot.cz/) popisuje bankovní párování, upomínky a spotřebu; [jeho ceník](https://www.repilot.cz/cenik) uvádí peněženku a kurz 1 kredit = 1 Kč. [eviduje.cz](https://www.eviduje.cz/features) uvádí smlouvy, portál nájemníka a přehled pro daně. Proto nejsou samotné kredity ani základní evidence věrohodnou výhodou.

### S9 · Co chci · tma · 3:35–3:55
- **Kroky 0–2:** jedno heslo po druhém, zarovnané vlevo a pod sebou, předchozí klesne na 40 %: **12 hovorů.** → **2 piloty.** → **Mentoři. Tým.**
- **Krok 3:** hesla zmizí. Uprostřed se objeví **Přidej. Pronajmi. Vydělávej.** a pod ním logo EstatIQ. Konec.
- **Poznámky:** MVP je hotové a mluvil jsem s dvanácti realitkami a správci. [klik] Do Startup Show chci dva pilotní správce. [klik] Od Green Light chci mentory a pomoc najít obchodního parťáka. [pauza 2 s] [klik] Přidej. Pronajmi. Vydělávej. Děkuji.

### Záložní slajdy (Z), jen na otázky
Stejný design, ale smí mít víc obsahu (nejvýš jedna jednoduchá tabulka nebo diagram). Odrážky ani tady ne.
| # | Slajd | Obsah |
|---|---|---|
| Z1 | Obchodní model | předplatné · kredity · provize · doporučené služby; detaily po hlavním S8. |
| Z2 | Ceník | `[doplnit: varianta ceníku]`, jen jedna verze |
| Z3 | Konkurence | „Trh dnes“ proti „Naše sázka“; přehled veřejně doložených funkcí a hypotézy k pilotům v poznámkách. |
| Z4 | Roadmapa | MVP → AI a data → platby → služby; podrobnosti v poznámkách |
| Z5 | Tým | Kryštof + koho hledám (obchod, obor) |
| Z6 | Finance | `[doplnit po workshopu Finance]`, dnes jen náklady a financování |
| Z7 | Co když nájemník nezaplatí | upomínky → evidence kauce → rozhodnutí vlastníka → vypořádání po skončení; bez příslibu průběžného automatického započtení |

---

## 7. Assety a placeholdery

| Asset | Cesta | Stav |
|---|---|---|
| Fotka Kryštofa 4:5, min. 1200×1500 | `public/assets/photos/krystof.jpg` | chybí |
| Logo EstatIQ SVG | `public/assets/logos/estatiq.svg` | chybí, případně vygenerovat (fáze 3) |
| Alteno, Vizeon, světlé SVG | `public/assets/logos/` | chybí |
| Screenshoty: platby, portál vlastníka, portál nájemníka (2880×1800) | `public/assets/screens/` | chybí |
| Vlastní fotky: vodoměr, šanon, faktury | `public/assets/photos/` | chybí |

**Placeholder** je rámeček ve finálním poměru stran s tenkou přerušovanou linkou `--muted` a popisem, co do něj patří (např. „Foto Kryštof, 4:5, min. 1200 × 1500 px“). Nikdy se do něj nedává stock fotka ani AI obrázek.

---

## 8. Definice „hotovo“ pro celou prezentaci
- [ ] Všech 9 slajdů a záložní slajdy odpovídají §6 a `check:content` projde.
- [ ] Každý krok jde vpřed i vzad a další klik během animace ji okamžitě dokončí.
- [ ] `dist/index.html` běží z `file://` bez sítě v Chrome i Firefoxu.
- [ ] Ověřeno se skutečným prezentérem včetně nouzového skoku.
- [ ] Režim přednášejícího funguje na druhém monitoru.
- [ ] `export/pitch.pdf` obsahuje všechny kroky.
- [ ] 60 fps na integrované grafice a žádná chyba v konzoli.
- [ ] Generálka se stopkami mezi 3:00 a 4:00 a v obsahu nezůstal žádný `[doplnit`; potvrdit povolený čas u Green Light.
