# BRIEF — prezentace EstatIQ pro Green Light

Zdroj pravdy pro obsah, design a animace. Technika je v `AGENTS.md`, chování v `CLAUDE.md`.

---

## 0. Účel a měřítko úspěchu

Výběr do akcelerátoru Green Light trvá 3 minuty prezentace a 7 minut otázek. Porota hodnotí inovaci, ověření u zákazníků, škálovatelnost, vazbu na Moravskoslezský kraj a tým.

Prezentace je úspěšná, když si porota po třech minutách pamatuje tři věci:
1. **Padoucha:** správce každý měsíc ručně přepisuje výpis z banky do Excelu.
2. **Jméno a jednu větu:** EstatIQ, jeden systém místo tří nástrojů.
3. **Ambici:** platební a datová vrstva nájemního bydlení.

Styl je Steve Jobs: jedna myšlenka na obrazovku, obří písmo, ticho a pauzy, odhalení na klik, „A ještě jedna věc.“ Na plátně jsou hesla, příběh se říká nahlas.

---

## 1. Příběh: chaos a klid

Celý příběh nese **barva pozadí**:

```
S1 tma ──► S2 PAPÍR, chaos ──► S3 chaos se rozpadne, pozadí ztmavne ──► S4–S6 tma, klid ──► S7 ČERNÁ ──► S8 tma
             (problém)            (odhalení)                              (produkt, cena, trh)   (vrchol)     (prosba)
```

- Dokud je problém, je světlo a nepořádek. Řádky, bubliny a papíry se překrývají.
- Od chvíle, kdy přijde EstatIQ, je tma a prázdné místo. Na plátně je vždy jen jedna věc.
- Slajd 7 je jediný úplně černý. Tím divák pozná, že přichází vrchol.

**Podpisový motiv: řádek bankovního výpisu.** Jde o jednořádkový záznam neproporcionálním písmem (`12.09  VS 2024031  15 000,00  NOVÁK`). Prochází celým příběhem:
- S1: na slova „ruční přepisování“ začnou zespodu prosakovat řádky. To je most do S2.
- S2: řádky se po jednom přesouvají do tabulky. To je ten padouch.
- S4: jeden řádek se sám spáruje s platbou a zezelená. Je to stejný motiv, jen vyřešený.
- S8: na poslední větě se objeví jeden řádek a rozpustí se. Kruh se uzavře.

Motiv je podpis, ne dekorace. Nikde jinde se neobjevuje.

**Časový rozpočet (3:00):**
| # | Slajd | Od | Do | s |
|---|---|---|---|---|
| 1 | Kdo jsem | 0:00 | 0:15 | 15 |
| 2 | Problém | 0:15 | 0:45 | 30 |
| 3 | Odhalení | 0:45 | 1:00 | 15 |
| 4 | Produkt | 1:00 | 1:30 | 30 |
| 5 | Proč platí | 1:30 | 1:55 | 25 |
| 6 | Škálovatelnost | 1:55 | 2:15 | 20 |
| 7 | Ještě jedna věc | 2:15 | 2:40 | 25 |
| 8 | Co chci | 2:40 | 3:00 | 20 |

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
| S2→S3 | Rozpad: chaos se rozsype, zůstanou tři slova a pozadí ztmavne | `layoutId` u slov a `clip-path` u pozadí |
| S3 | Tři slova sjedou do středu a prolnou se v logo | `transform` + `opacity`, bez morphu |
| S4 | Řádek výpisu „zaklapne“ do platby a zezelená | `spring.snap` |
| S5 | Červená čára se tahem nakreslí přes cenu | `stroke-dashoffset` |
| S7 | Linky od tří prvků tečou do loga | `stroke-dashoffset` ve smyčce, pomalé |
| S8 | Poslední řádek výpisu se rozpustí | `clip-path` a `opacity` |

Všude jinde stačí jednoduchý nástup ≤ 320 ms. Na každém slajdu je nejvýš jedna signature animace.

---

## 5. Ovládání a režimy (shrnutí, detail v promptech 02 a 07)

| Klávesa | Akce |
|---|---|
| → ↓ Space PageDown Enter | další krok |
| ← ↑ PageUp | předchozí krok |
| Home / End | slajd 1 / slajd 8 |
| číslo + Enter | skok na slajd |
| `B` nebo `.` | **nouzový skok na slajd 8** (tlačítko „černá obrazovka“ na prezentéru), mapování v `deck.config.ts` |
| `Z` | přehled záložních slajdů, `Esc` zpět na místo, kde přehled začal |
| `P` | otevře okno přednášejícího |
| `F` | celá obrazovka |
| `T` | start / reset stopek |
| `D` | debug: zobrazí kódy kláves (pro test prezentéru) |

- Kurzor se po 2 s nečinnosti skryje.
- URL ukládá pozici (`#/3/2`), takže obnovení stránky nic neztratí.
- **Režim přednášejícího** (druhé okno na notebooku, projektor je rozšířená plocha): aktuální krok, náhled dalšího, poznámky s vyznačenými pauzami, odpočet 3:00 a odchylka od časového plánu. Od 2:40, pokud ještě není slajd 8, se lišta zbarví na červenou.

---

## 6. Slajdy po slajdech

Formát: **Na plátně** (každý krok), **Pohyb**, **Poznámky** (mluvený text pro režim přednášejícího, beze změn ze schváleného dokumentu). `[pauza]` a `[klik]` jsou pokyny pro přednášejícího.

### S1 · Kdo jsem · tma · 0:00–0:15
- **Krok 0 (automaticky):** vlevo fotka 4:5 přes ~45 % výšky, posunutá z osy. Vpravo dole velké „Kryštof Sobotka“, pod ním „15 let · student · zakladatel“ v `--muted`.
- **Krok 1:** řádek důkazů: světlá loga Alteno × Vizeon · „15+ projektů“. „5,0 ★“ jen se zdrojem, jinak vypustit.
- **Krok 2 (na „ruční přepisování“):** zespodu prosakují řádky výpisu na papíře. To je most do S2.
- **Pohyb:** fotka 0,4 s opacity, jméno vyjede 24 px zespodu, podtitul +120 ms, důkazy naposledy.
- **Poznámky:** Dobrý den, jmenuji se Kryštof Sobotka, je mi patnáct a [doplnit: škola a ročník]. Pod značkami Alteno a Vizeon stavím firmám weby a automatizace, mám za sebou přes 15 projektů. A u realitek a pronajímatelů vidím pořád dokola jednu věc. [pauza 2 s] Ruční přepisování.

### S2 · Problém · PAPÍR · 0:15–0:45
- **Krok 0 (automaticky, vyprávěcí timeline ~3 s, pak klidná smyčka):**
  - uprostřed výpis z banky (HTML/CSS, fiktivní data, žádné logo banky), řádky po jednom letí do mřížky tabulky (Excel naznačený mřížkou a zeleným pruhem záhlaví, bez loga),
  - z rohu vyskočí dvě chatové bubliny (zelená bublina, bez loga WhatsAppu): „Dobrý den, nájem pošlu příští týden.“ a „Neteče teplá voda.“,
  - v pozadí kulisy: šanon se smlouvami, papírové faktury, fotka vodoměru (skutečné fotky, do té doby placeholder),
  - nahoře vpravo počítadlo 0 → **300** a pod ním „řádků / měsíc“.
  - Banka, Excel a WhatsApp musí být v chaosu nejvýraznější. Energie se tu neukazují, šetří se na S7.
- **Krok 1 (na „kdo mu dluží“):** všechno se zastaví (pauza timeline) a přes scénu se pomalu stáhne ztlumení (`opacity`).
- **Poznámky:** Když firmám automatizuji faktury, vidím pořád stejný vzorec: člověk ručně přepisuje data z jednoho místa do druhého. Pak jsem se ponořil do nemovitostí. Knihy, podcasty a hlavně dvanáct hovorů s realitkami a správci. A ten vzorec je tam taky. Jen mnohem větší. Správce otevře výpis z banky a řádek po řádku ho přepisuje do Excelu. Nájemníci píšou na WhatsApp. Smlouvy leží v šanonu. [pauza 2 s] Každý měsíc. Jen aby zjistil, kdo mu dluží.
  - *Otevřené: vyškrtnout „Knihy, podcasty a“ (memory.md).*

### S3 · Odhalení · papír → TMA · 0:45–1:00
- **Krok 0:** rozpad. Chaos se rozsype a z jeho tří nejvýraznějších částí vzniknou tři slova v řadě: **Banka. Excel. WhatsApp.** Pozadí se zároveň stáhne z papíru do tmy.
- **Kroky 1–3:** na každé vyslovené slovo se to slovo rozsvítí (`--fg`) a ostatní klesnou na 25 %.
- **Krok 4 („Je to jeden.“):** slova sjedou do středu, zmenší se a prolnou se v logo EstatIQ.
- **Krok 5:** pod logem se objeví tag v `--muted`. Kolem je prázdno.
- **Poznámky:** Banka. [klik] Excel. [klik] WhatsApp. [klik] [pauza 2 s] Nejsou to tři nástroje. Je to jeden. [klik] EstatIQ. [klik]
- **Tag:** `[doplnit: tag]` (varianty v memory.md, doporučeno „Nájem bez přepisování.“).

### S4 · Produkt · tma · 1:00–1:30
- **Kroky 0–2:** jeden skutečný screenshot v jednoduchém CSS rámu notebooku (tenká linka `--night-2`, žádné odlesky). Vedle jedno slovo 96 px: **Platby.** → **Vlastník.** → **Nájemník.** Předchozí screenshot odjede a nový vjede zespodu.
  - Krok 0, platby: řádek výpisu přiletí a „zaklapne“ (`spring.snap`) do platby, která zezelená (zelená zaplaceno, žlutá čeká, červená po splatnosti).
  - Krok 1, portál vlastníka: zvýrazní se jeden živý údaj (souřadnice zvýraznění jsou v `content`, v %).
  - Krok 2, portál nájemníka: tlačítko „Nahlásit závadu“ se zvýrazní.
- **Krok 3:** screenshoty zmizí a zůstane věta **Tři nástroje. Jedna obrazovka.** (*otevřené: „Jedna aplikace.“*)
- **Data ve screenshotech:** fiktivní, Ostrava, ideálně 300 jednotek (sedí na S5), realistická česká jména. Žádná skutečná osobní data.
- **Poznámky:** Takhle vypadá stejný měsíc s EstatIQ. Banka: platby se vytvoří samy a správce na jedné obrazovce vidí, kdo zaplatil. [klik] Excel: vlastník bytu nedostává tabulky, vidí všechno živě ve svém portálu. [klik] WhatsApp: nájemník má vlastní portál. Vidí platby i smlouvu a závadu nahlásí jedním klikem. Žádné zprávy v deset večer. [pauza 2 s] Tři nástroje. Jedna obrazovka.

### S5 · Proč platí · tma · 1:30–1:55
- Rozdělená obrazovka bez dělicí čáry, levá polovina výš než pravá (asymetrie).
- **Vlevo B2B, krok 0:** malý popisek „správce · 300 bytů“, obří **4,5 mil. Kč**, pod tím „měsíčně v nájmech“.
- **Krok 1:** pod tím **4 990 Kč**.
- **Krok 2:** **0,1 %** v `--mint`. Je to jediné mátové slovo na slajdu.
- **Vpravo B2C, krok 3:** popisek „pronajímatel · správcovská firma“, **1 200 Kč**, přes které se nakreslí červená čára (`stroke-dashoffset`).
- **Krok 4:** **od 199 Kč**.
- **Nedělat:** srovnání s Repilotem. Nepřeškrtávat 4,5 mil.
- **Poznámky:** Kolik to stojí? Správce 300 bytů hlídá při nájmu 15 000 Kč každý měsíc 4,5 milionu korun. [klik] EstatIQ ho stojí 4 990 Kč. [pauza 2 s] Jedna desetina procenta. Platí se každý měsíc a klient, kterému to šetří čas, neodchází. A pronajímatel, který dá byt správcovské firmě, odevzdá 8 až 12 % nájmu, tedy 1 200 až 1 800 Kč měsíčně. [klik] A kdo chce, aby byl nájem konečně pasivní příjem, zaplatí s EstatIQ od 199 Kč.
  - *Otevřené: zkrácení kvůli času (memory.md).*

### S6 · Škálovatelnost · tma · 1:55–2:15
- **Kroky 0–2:** zleva doprava na jedné vodorovné ose **Česko** → **Slovensko** → **Střední Evropa**. Každé slovo se rozsvítí na klik a předchozí zůstává svítit, jen klesne na 60 %.
- **Krok 3:** za posledním slovem se tenká linka protáhne až za okraj plátna. Ambice beze slov.
- Volitelně (`showMarketStat`, výchozí vypnuto): pod „Česko“ malé „34 500 pronajímatelů 3+ bytů“.
- **Nedělat:** mapu Evropy, šipky do Německa, „sky is the limit“.
- **Poznámky:** Začínáme tady v Ostravě, se správci, se kterými už mluvím, a pak celé Česko. [klik] Potom Slovensko, s podobnými nájmy i jazykem. [klik] A pak střední Evropa. [pauza 2 s] Jádro zůstává stejné, mění se jen místní pravidla. A software se s každým dalším bytem neprodražuje.

### S7 · Ještě jedna věc · ČERNÁ · 2:15–2:40
- **Krok 0:** čistá černá, uprostřed jen **A ještě jedna věc.** (80 px, `--fg`).
- **Krok 1:** věta zmizí a objeví se **Energie.**
- **Krok 2:** „Energie.“ se zmenší a odjede vlevo nahoru, uprostřed se objeví logo. Od „Energie“ k logu se natáhne linka a začne téct.
- **Krok 3:** vpravo nahoře **Ověření nájemníci.** a druhá linka.
- **Krok 4:** dole **Každá platba.** a třetí linka. Tři linky pomalu tečou do loga (smyčka).
- **Krok 5:** všechno klesne na 15 % a doprostřed přijde věta **Platební vrstva nájemního bydlení.** Slovo „Platební“ je v `--mint`.
- **Pravidla:** o budoucnosti jen „chceme“ a „časem“. Jen tři prvky. Tržiště, investoři a AI sem nepatří.
- **Poznámky:** A ještě jedna věc. [pauza 2 s] Energie. [klik] Smlouvy s dodavateli energií uzavřené přímo v EstatIQ. [klik] Nájemníci, kteří si u nás budují ověřenou historii plateb. [klik] A časem každá platba kolem nájmu. [pauza] Nájem, energie, služby. Všechno přes nás proteče. [pauza] [klik] Nechceme být další evidence. Chceme být platební a datová vrstva nájemního bydlení.

### S8 · Co chci · tma · 2:40–3:00
- **Kroky 0–2:** jedno heslo po druhém, zarovnané vlevo a pod sebou, předchozí klesne na 40 %: **12 hovorů.** → **2 piloty.** → **Mentoři. Tým.**
- **Krok 3 (na poslední větě):** hesla zmizí. Uprostřed se objeví jeden řádek výpisu na proužku papíru a pomalu se rozpustí (`clip-path`). Zůstane malé logo. Konec.
- **Poznámky:** Kde jsem dnes? MVP je hotové a mluvil jsem s dvanácti realitkami a správci. [klik] Do Startup Show chci dva pilotní správce. [klik] A od Green Light chci dvě věci: odborníky, od kterých se naučím, co mi chybí, a pomoc najít parťáka, který umí prodávat. [pauza 2 s] [klik] Aby žádný správce už nemusel přepisovat výpis z banky do Excelu. Děkuji.

### Záložní slajdy (Z), jen na otázky
Stejný design, ale smí mít víc obsahu (nejvýš jedna jednoduchá tabulka nebo diagram). Odrážky ani tady ne.
| # | Slajd | Obsah |
|---|---|---|
| Z1 | Obchodní model | předplatné · kredity · provize · implementace. Tok peněz jako diagram. |
| Z2 | Ceník | `[doplnit: varianta ceníku]`, jen jedna verze |
| Z3 | Konkurence | pozicování „evidence vs. vrstva“. Ne tabulka funkcí, kde prohráváme v jádru. |
| Z4 | Roadmapa | 4 vrstvy: systém → transakce → investor → tržiště |
| Z5 | Tým | Kryštof + koho hledám (obchod, obor) |
| Z6 | Finance | `[doplnit po workshopu Finance]`, dnes jen náklady a financování |
| Z7 | Co když nájemník nezaplatí | digitální kauce ve 4 krocích (upomínky → započtení → doplnění → podklady) |

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
- [ ] Všech 8 slajdů a záložní slajdy odpovídají §6 a `check:content` projde.
- [ ] Každý krok jde vpřed i vzad a další klik během animace ji okamžitě dokončí.
- [ ] `dist/index.html` běží z `file://` bez sítě v Chrome i Firefoxu.
- [ ] Ověřeno se skutečným prezentérem včetně nouzového skoku.
- [ ] Režim přednášejícího funguje na druhém monitoru.
- [ ] `export/pitch.pdf` obsahuje všechny kroky.
- [ ] 60 fps na integrované grafice a žádná chyba v konzoli.
- [ ] Generálka se stopkami ≤ 3:00 a v obsahu nezůstal žádný `[doplnit`.
