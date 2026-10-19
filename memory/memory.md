# MEMORY — živý stav

Co se skutečně stalo, jaký je aktuální stav a proč. Formát: `pravidla.md`.

## Aktuální stav
- **Projekt:** prezentace EstatIQ pro elevator pitch Green Light; aktuální uživatelem zadaný rozpočet je 3:55. Původní podklad uváděl 3:00 + 7 minut otázek, povolený limit čeká na potvrzení.
- **Fáze:** hlavní pitch má devět realizovaných slajdů včetně modelu kreditů a odlišení. Před vystoupením zbývá doplnit skutečné screenshoty, ověřit otevřené údaje a udělat generálku nahlas.
- **Stack:** Vite + React 19 + TS + Tailwind v4 + Motion, single-file build (AGENTS.md).
- **Co existuje:** engine v `src/deck/`; S1–S9 a Z1–Z7 jsou realizované; veškerý obsah je v `src/content/slides.ts`; tokeny, primitiva, logo a styleguide `#/styleguide` (jen dev). Aktuální single-file build má 799,58 kB. PDF export má 54 stran a 16 finálních stavů. Typecheck, lint, `check:content`, build a vybrané e2e kontroly prošly; 16 varování zůstává kvůli známým placeholderům.

## Klíčová rozhodnutí
- **2026-10-19:** Je to aplikace pro promítání, ne web. Reason: pitch se promítá, nikdo ji neprochází.
- **2026-10-19:** Vite místo Next.js. Reason: prezentace nepotřebuje server ani routing. Statický export Next.js používá absolutní cesty `/_next/…` a z `file://` (flashka, cizí počítač) nefunguje. Vite + `vite-plugin-singlefile` dá jeden HTML soubor, který běží odkudkoli. EstatIQ je taky na Vite.
- **2026-10-19:** Vizuální systém **A „Noc“**: barvy, písmo a logo podle webu EstatIQ. Z webu se nepřebírá záře, mřížka, pill štítky ani karty po čtyřech.
- **2026-10-19:** Příběh **C „Chaos a klid“**: problém (slajd 2) je světlý a přeplněný, od odhalení (slajd 3) dál je tma a prázdno. Slajd 7 jde do čisté černé. Barva pozadí nese děj.
- **2026-10-19:** 8 slajdů a jejich mluvený text jsou schválené v dokumentu „EstatIQ: plán a pitch pro Green Light“ a přepsané v `docs/BRIEF.md` §6.
- **2026-10-19:** Banka, Excel a WhatsApp jsou na slajdech jako **slova**, ne jako ikony nebo oficiální loga. Reason: generické ikony jsou slop a cizí loga jsou ochranné známky.
- **2026-10-19:** Splynutí do loga na slajdu 3 je sjetí a prolínání, ne SVG morph. Reason: morph vypadá levně a je křehký.
- **2026-10-19:** Přeškrtnutí na slajdu 5 je jen u B2C (1 200 Kč). U B2B je 4,5 mil. Kč objem nájmů, ne náklad, takže se nepřeškrtává.
- **2026-10-19:** „Klik vyhrává“ přes přemountování slajdu (`epoch`) s `MotionGlobalConfig.instantAnimations`, ne přes `AnimatePresence initial={false}`. Reason: `initial={false}` drží Motion v kontextu po celý život dítěte, takže prvky, které se objeví v pozdějším kroku, by se přestaly animovat. Ověřeno e2e testem, který bez snapu padá.
- **2026-10-19:** Nouzový skok (`B`, `.`) jde na S8 krok 0 v režimu `instant`. Home/End a číslo + Enter jsou taky okamžité, šipky se animují.
- **2026-10-19:** Hlavní a záložní slajdy jsou oddělené sekce. Šipky mezi nimi nepřechází. `Esc` ze záložního slajdu vrátí na místo, odkud se otevřel přehled `Z`.
- **2026-10-19:** Klik myší nenaviguje. Ovládá se jen klávesnicí nebo prezentérem (BRIEF §5 myš nezmiňuje, náhodné kliknutí na pódiu by posunulo slajd).
- **2026-10-19:** Tokeny jsou ověřené v repech EstatIQ (`Projekty/EstatIQ - prelaunch/index.html`, `Projekty/Estatiq - aplikace /src/index.css`): night `#0B0F19`, night-2 `#0F172A`, fg `#F8FAFC`, muted `#94A3B8`, mint `#34D399` (emerald-400), green `#059669`, amber `#D97706`, red `#DC2626` a nový line `#1E293B` (okraje na webu). Paper, ink a black protějšek na webu nemají, zůstávají z BRIEF. Hex tabulka v BRIEF §3 tím neplatí, platí `tokens.css`. Reason: prompt 03.
- **2026-10-19:** Zůstává jedno písmo (Space Grotesk), i když web má tělo v Plus Jakarta Sans. Monospace web nepoužívá, takže pro řádky výpisu zůstává JetBrains Mono podle BRIEF.
- **2026-10-19:** Logo odpovídá `.splash-logo` z webu: Space Grotesk 700, letter-spacing −0,02em, „IQ“ v emerald-400. Rozdíly na webu: hlavička má „IQ“ v emerald-500 a tracking 0, aplikace emerald-600 (světlé UI). Proti textu ve stylu splash se SVG liší o 0,00 % pixelů (`e2e/logo.spec.ts`, snímek `test-results/logo-compare.png`).
- **2026-10-19:** `Word` nastupuje clip-path wipem zleva doprava (ve směru čtení), ne fade + slide-up. `StatementRow` „zezelená“ přetažením zelené kopie přes řádek, protože barva se animovat nesmí.
- **2026-10-19:** `→` a `★` Space Grotesk z fontsource nemá. Kreslí je `<Glyph>` a `check:content` je v textu slajdu odmítne.
- **2026-10-19:** Rozpad S2 → S3 trvá ≤ 600 ms (`rozpad` v `presets.ts`). Je to jediná výjimka z limitu 400 ms pro přechod (prompt 04). Klik během rozpadu ho přes `busyMs: 600` okamžitě dokončí.
- **2026-10-19:** Rozpad není přes `layoutId`. S3 při příchodu z S2 sám nakreslí hotový chaos (`ChaosScene`) ve ztlumeném stavu a slova vyjedou z pevných souřadnic v `src/slides/chaos/layout.ts`. Reason: plátno je zmenšené přes `transform: scale()` a projekce `layoutId` měří v px okna, takže by posuny vycházely o měřítko vedle. Navíc přímý skok, instant nebo PDF na S3 by neměl odkud animovat. Tahle cesta je deterministická.
- **2026-10-19:** Ztlumení v S2 kroku 1 trvá 0,8 s (BRIEF: „pomalu se stáhne“). Nic na něj nečeká, další klik jde hned na S3. Proto to není výjimka z pravidla „klik vyhrává“, jen z orientačních 400 ms pro odhalení kroku.
- **2026-10-19:** Slova v S3 jsou pod sebou u levého okraje v `text-hero` (200 px), ne vedle sebe. Reason: „Banka. Excel. WhatsApp.“ v jedné řadě by se do 1 680 px vešlo jen v ~125 px, a to je mimo typografickou škálu. Krok 0 (po rozpadu) svítí všechna tři slova. Kroky 1–3 rozsvítí vždy jedno a ostatní klesnou na 25 % (BRIEF: „klesnou“, takže předtím svítí).
- **2026-10-19:** S1 → S2: S1 se odkrojí `clip-path` zespodu nahoru a pod ním už stojí papír S2 (`s1Variants`, `cutInVariants`). Hranice papíru tak plynule pokračuje z mostu v kroku 2. Zpětné přechody jsou obyčejné prolnutí.
- **2026-10-19:** Smyčka v S2 je konečná: v tabulce přibude 5 řádků po 4 s (~20 s), pak je klid. Nekonečný posun tabulky by S3 nedokázal navázat bez skoku.
- **2026-10-19:** Bublina v S2 je „Nájem pošlu příští týden.“ místo „Dobrý den, nájem pošlu příští týden.“ z BRIEF. Reason: 6 slov porušuje limit 5 slov z CLAUDE.md §4.2, který má přednost.
- **2026-10-19:** `check:content` počítá číslo s nezlomitelnou mezerou mezi číslicemi („15 000,00“) jako jedno slovo. Řádky výpisu kontroluje jako jeden prvek na řádek, pole odděluje „·“.
- **2026-10-19:** S5 odvozuje objem nájmů (300 × 19 990 Kč), relativní cenu (4 990 / objem, zaokrouhleno na 0,1 %) a aktuální modelovou sazbu 10–12 % z čísel v obsahu; aritmetiku hlídá unit test.
- **2026-10-19:** S4 highlighty jsou zapsané v procentech v obsahu. Souřadnice jsou pracovní, dokud nebudou dodané skutečné screenshoty.
- **2026-10-19:** S6 přepínač `showMarketStat` je v obsahu výchozím stavem vypnutý, protože údaj 34 500 zatím nemá ověřený zdroj.
- **2026-10-19:** Jediný tvrdý střih je S6 → S7. S7 vpřed vstoupí do černé okamžitě, návrat ze S8 zůstává prolnutím. Linky S7 mají stopu `--fg` na 18 % a tok `--mint`, šířku 1,5 px a cyklus 2,4 s přes `strokeDashoffset`.
- **2026-10-19:** Původní S8 zobrazoval „Přidej. Pronajmi. Vydělávej.“ s logem EstatIQ; po přidání kreditního slajdu je tento závěr na S9. Žádost Green Light zůstává v předchozím kroku závěrečného slajdu.
- **2026-10-19:** Předchozí zadání rozšířilo hlavní pitch bez přidání slajdů; následné zadání výslovně přidalo devátý slajd. S3 ukazuje čtyři slovní značky (Banka, Excel, WhatsApp, Smlouvy); generické ikony zůstávají zakázané. S4 má tři screenshoty skutečného MVP: platby, přehled nemovitosti vlastníka a nájemnický portál.
- **2026-10-19:** S5 používá nájem 19 990 Kč a sazbu 10–12 % jen jako částku k ověření; z aritmetiky vychází 1 999–2 399 Kč. Cena EstatIQ 199 Kč/měsíc platí pro vlastníka do 5 bytů; nejde o ekvivalent kompletní správy.
- **2026-10-19:** S6 je roadmapa po fázích Dnes / Další / Později (původně tok smlouvy → správy → energií → daňových podkladů). Daňová část znamená evidenci a export podkladů, ne změnu daňových pravidel ani automatické podání.
- **2026-10-19:** S7 je vize: AI, dobrovolně sdílená historie nájemníka, služby, kauce a platby. Kredity mají vlastní S8. O přijetí nájemníka rozhoduje pronajímatel; zprostředkování služeb a plateb čeká na právní a obchodní ověření.
- **2026-10-19:** Model kreditů 1 000 Kč = 1 000 kreditů, 5 kreditů za návrh smlouvy a 600 kreditů za řemeslnickou zakázku je pouze příklad k diskusi, ne ceník ani připravená peněženka. Záložní S7 kauce neprezentuje průběžné automatické započtení během nájmu.
- **2026-10-19:** Kryštof výslovně rozšířil hlavní pitch na devět slajdů a cíl mezi 3 a 4 minutami. S8 zobrazuje model 1 000 kreditů, odečet 600 a 5 a zůstatek 395; celých 600 kreditů za práci řemeslníka se neprezentuje jako výnos EstatIQ. Příjmy (od 2026-10-19 večer přepsáno): affiliate marketing, personalizovaná reklama, poplatky za zprostředkování, AI kredity, provize z každé transakce; předplatné z výčtu zmizelo. S9 nese žádost a závěrečný slogan.
- **2026-10-19:** Konkurence už zvládá víc než evidenci: Repilot uvádí bankovní párování, upomínky, energie i peněženku s kurzem 1 kredit = 1 Kč; eviduje.cz smlouvy, platby, nájemnický portál a daňový přehled. Naše plánované odlišení je přenositelná dobrá historie nájemníka a návaznost závady či spotřeby na konkrétní službu. Je to hypotéza k pilotům, ne prokázaná nadřazenost.

## Otevřené otázky
Čeká se na Kryštofa. Do té doby zůstává v obsahu `[doplnit: …]`.
- **Integrace (S6, S7):** s kým se EstatIQ integruje (banky, dodavatelé energií, účetní software, jiné služby) a jak se údaje berou? Dokud to není jasné, S6 píše jen „Integrace služeb.“ a S7 u výdajů integraci netvrdí.
- **S7 integrace výdajů:** s kým se přehled výdajů (voda, plyn, elektřina) integruje a jak se údaje berou (dodavatelé, měřidla, import faktur)? Dokud to není jasné, slajd integraci netvrdí.
- ~~**Tag u odhalení (slajd 3)**~~ — vyřešeno 2026-10-19: „Pronájem, který se řídí sám.“ (volba Kryštofa; pravdivé jen s bankovním párováním, viz níže).
- **Bankovní párování** (import výpisu GPC/ABO a párování podle VS): stihne se před pitchem? Na tom závisí pravdivost slajdů 2, 3, 4 a tvrzení o MVP na 9.
- **Časování:** devět hlavních slajdů má rozpočet 3:55. Aktuálních 422 slov znamená přibližně 3:03 čisté řeči při 138 slovech/min; kliky a zadané pauzy mají prostor do 3:55. Zkouška se stopkami zatím neproběhla. Potvrdit, zda Green Light povoluje až čtyři minuty; původní brief uváděl 3:00.
- **S4 screenshoty:** dodat čtyři skutečné snímky z MVP: přehled plateb, přehled nemovitosti v portálu vlastníka, portál nájemníka a dashboard pronajímatele a obrazovky Spotřeba, Databáze, Finance, Funkce a Integrace. Upřesnit, co ty tři ukazují a zda existují v MVP (databáze řemeslníků je podle S7 vize, nesmí vypadat jako hotový produkt). Upřesnit, co dashboard pronajímatele ukazuje a jak se liší od kroku „Přehled nemovitosti“; věta v poznámkách je zatím obecná. Souřadnice highlightů jsou pracovní, dokud snímky nepřijdou.
- **S5 sazba správy:** ověřit, zda lze pro konkrétní srovnávací příklad použít 10–12 %. Neříkat, že jde o typický tržní průměr, dokud nebude zdroj.
- **Daňové podklady:** potvrdit s účetním, jaké příjmy, výdaje, faktury a export lze slíbit v produktu a zda má jít o souhrn či export pro konkrétní účetní software.
- **Ověřený nájemník:** vymezit právní základ a rozsah ověření, souhlas s dokládáním příjmu a způsob, jak nájemník sdílí historii plateb.
- **Kredity a tržiště:** ověřit právní a platební model, provizi řemeslníka a provozovatele, způsob označení placených doporučení a případného licencovaného partnera. Příklady 1 000 / 600 / 5 kreditů zůstávají pracovní.
- **Odlišení od konkurence:** u pilotů ověřit, zda pronajímatelé a nájemníci skutečně chtějí přenositelnou platební historii a objednávky služeb přímo z událostí v pronájmu. Z veřejných produktových stránek zatím nelze tvrdit, že by to žádný konkurent neuměl.
- **Slajd 1:** škola a ročník (naposledy Friedrich-Schiller-Gymnasium Pirna, platí?), zdroj pro „5,0 ★ od klientů“ (jinak vypustit), světlé verze log Alteno a Vizeon.
- **Druhé kolo hovorů:** hodiny měsíčně na platby, proč správci nepřešli na levnější nástroje, aspoň jeden tester nebo pilot.
- **Počet správcovských firem v ČR:** jen jako odpověď na otázku, ne na slajd.
- **Datum pitche, vlastní notebook (HDMI/USB-C), druhý monitor pro režim přednášejícího, jak striktně se hlídá čas.**
- **BRIEF §3:** přepsat hex tabulku podle `tokens.css`? BRIEF se mění jen po schválení.
- **Assety v `public/` se do single-file buildu neinlinují.** Vite je jen zkopíruje do `dist/assets/`, takže `dist/index.html` by bez té složky neměl obrázky. Logo to neřeší, jde do HTML přes `logo.generated.ts`. Fotky a screenshoty ano. Návrh před fází 4: přesunout podklady do `src/assets/` a importovat je, pak je `vite-plugin-singlefile` vloží do HTML. Mění to strukturu z AGENTS.md, proto čeká na Kryštofa.
- **`steps` a `budgetSec` jsou dvakrát:** v `deck.config.ts` (podle promptu 02) i v typu `SlideContent` v `src/content/slides.ts`. Pro S1–S3 je `deck.config.ts` bere z obsahu a `src/content/slides.test.ts` hlídá, že se nerozejdou. Návrh trvá: nechat jen jedno místo.
- **Bublina v S2:** zkrácený text „Nájem pošlu příští týden.“ (viz rozhodnutí). Sedí, nebo jiná formulace do 5 slov?
- **Časy ve zprávách v S2** (22:04, 22:17) jsou fiktivní kulisa a navazují na „žádné zprávy v deset večer“ v S4. Nechat?
- **Ceník na záložním slajdu:** varianta po pásmech (300 j. ≈ 5 663 Kč), nebo cenová hypotéza z pitche (4 990 Kč)? Obě verze nesmí být vidět zároveň.
- **Z5 tým:** doplnit jméno parťáka na obchod a člověka z oboru.
- **Z6 finance:** po workshopu doplnit náklady a financování.

## Záměrně neuděláno
- **Responzivita pro mobil, SEO, meta tagy, analytika.** Nejde o web.
- **Živé demo uvnitř prezentace.** Živé demo běží v EstatIQ na notebooku, prezentace má statické screenshoty.
- **Číslo hodin na slajdu 2.** Počítadlo ukazuje „300 řádků / měsíc“ (aritmetika z příkladu). Hodiny až z hovorů.
- **`layoutId` mezi S2 a S3.** Viz rozhodnutí o rozpadu. Neopravovat zpět na `layoutId`.
- **Smyšlené produktové screenshoty.** Dokud nepřijdou skutečné snímky aplikace, S4 ukazuje popsané placeholdery.
- **Automatické stržení nájmu na slajdu 4.** Není v MVP a je to regulovaná platební služba. Patří jen do vize na slajdu 7.
- **Automatické daňové přiznání.** S6 mluví o evidenci a exportu podkladů, ne o automatickém podání nebo změně daňových pravidel.
- **Automatické odmítání nájemníků.** O přijetí rozhoduje pronajímatel; nájemník si volí, jakou historii sdílí.
- **Průběžné automatické započtení z kauce a její automatické doplňování.** Z7 ukazuje evidenci, upozornění a přípravu podkladů; vypořádání posuzuje pronajímatel.
- **Kredity jako hotová peněženka.** Model 1:1 a poplatky 600/5 jsou jen příklady do diskuse, dokud nebude ověřena právní struktura.

## Changelog

### 2026-10-19 — S5: nájem 19 990 Kč a 199 Kč do 5 bytů
- **Co:** Na S5 je nájem jedné jednotky 19 990 Kč na obou stranách: správce 300 bytů hlídá 6,0 mil. Kč nájmů (cena 4 990 Kč zůstává, podíl ≈ 0,08 %, na slajdu „0,1 %“), model správy 10–12 % dává 1 999–2 399 Kč. Cena pro vlastníka je „199 Kč/měs.“ s popiskem „Pro vlastníka do 5 bytů“ (dřív „od 199 Kč“ pro vlastníka, který spravuje sám). Přepsány poznámky, BRIEF §S5 a test aritmetiky.
- **Proč:** na pokyn Kryštofa; výklad potvrzen dotazem (19 990 Kč = nájem jednoho bytu, 199 Kč = cena do 5 bytů).
- **Dopad:** cena pro správce nad 5 bytů zůstává 4 990 Kč pro 300 bytů, pásma mezi 5 a 300 byty nejsou určená. Konflikt se záložním Z2 (pásma ≈ 5 663 Kč) a se S8 (předplatné ve výčtu příjmů chybí) trvá. Rozdíl 199 Kč vs. 1 999–2 399 Kč se na slajdu schválně nepodává jako „desetkrát levněji“: správa je širší služba než EstatIQ (BRIEF §S5).
- **Soubory:** `src/content/slides.ts`, `src/content/s5-math.test.ts`, `docs/BRIEF.md`, `memory/memory.md`

### 2026-10-19 — S4: krok Integrace
- **Co:** Na S4 přibyl úplně poslední krok „Integrace.“ s placeholderem screenshotu za „Funkce.“. S4 má 9 kroků, shrnutí je krok 9. V poznámkách je `[doplnit: s kým se EstatIQ integruje]`.
- **Proč:** na pokyn Kryštofa.
- **Dopad:** S4 má 9 obrazovek v rozpočtu 30 s, tedy asi 3 s na krok; časování ověřit stopkami nebo kroky sloučit. Souvisí s otevřenou otázkou integrace výdajů v S7. PDF má 54 stran.
- **Soubory:** `src/content/slides.ts`, `src/slides/S04Product.tsx`, `e2e/deck.ts`, `e2e/engine.spec.ts`, `e2e/offline-presenter.spec.ts`, `docs/BRIEF.md`, `memory/memory.md`

### 2026-10-19 — S6: roadmapa po fázích
- **Co:** S6 se z osy „Smlouvy → Správa → Energie → Daně“ přestavělo na tři sloupce Dnes / Další / Později s hesly (celkem 12). Později obsahuje ověřeného nájemníka, integrace služeb, AI funkce, řemeslníky a kauci s platbami. Počet kroků zůstal 3 (krok 3 rozsvítí všechny sloupce). Poznámky přepsány, BRIEF §S6 také.
- **Proč:** na pokyn Kryštofa: S6 má ukázat všechno, co je v plánu, včetně ověření nájemníka a integrací.
- **Dopad:** S6 a S7 se částečně překrývají (ověřený nájemník, AI, řemeslníci, kauce a platby). Pro S7 jsem nic neměnil; zvážit zkrácení S7, ať se neříká totéž dvakrát. Integrace se nejmenují, v poznámkách je `[doplnit: které služby a jak se údaje berou]` (nový placeholder, `check:content` hlásí 24 varování). Zařazení funkcí do fází vychází z Z4 a S7, pořadí nebylo s nikým potvrzeno. Časování S6 (20 s) není ověřené stopkami.
- **Soubory:** `src/content/slides.ts`, `src/slides/S06Scale.tsx`, `docs/BRIEF.md`, `memory/memory.md`

### 2026-10-19 — S8: nový výčet příjmů
- **Co:** Pravá kolonka „Příjmy EstatIQ“ na S8 má pět položek: Affiliate marketing, Personalizovaná reklama, Poplatky za zprostředkování, AI kredity, Provize z každé transakce. Přepsány poznámky S8 a BRIEF §S8. Položky mají lokální velikost 60 px (88px `text-word` se pěti delšími hesly nevejde).
- **Proč:** na pokyn uživatele.
- **Dopad:** záložní Z1 „Obchodní model“ stále uvádí Předplatné / Kredity / Provize / Doporučení a nesedí s S8. S5 má cenu od 199 Kč/měsíc, což je s vypuštěným předplatným v rozporu. Reklama a affiliate musí být na produktu označené jako reklama.
- **Soubory:** `src/content/slides.ts`, `src/slides/S08Credits.tsx`, `docs/BRIEF.md`

### 2026-10-19 — S4: krok Funkce
- **Co:** Na S4 přibyl poslední krok „Funkce.“ s placeholderem screenshotu za „Finance.“. S4 má 8 kroků, shrnutí je krok 8. V poznámkách je `[doplnit: které funkce se ukazují]`.
- **Proč:** na pokyn Kryštofa.
- **Dopad:** S4 má 8 obrazovek v rozpočtu 30 s, tedy asi 3,5 s na krok; časování je třeba ověřit stopkami. PDF má 53 stran.
- **Soubory:** `src/content/slides.ts`, `src/slides/S04Product.tsx`, `e2e/deck.ts`, `e2e/engine.spec.ts`, `e2e/offline-presenter.spec.ts`, `docs/BRIEF.md`, `memory/memory.md`

### 2026-10-19 — S7: konkrétní přehled výdajů
- **Co:** Pod „Přehled výdajů.“ přibyl popisek „Voda, plyn, elektřina.“ (proud a elektřina jsou jedna položka). Poznámky mají `[doplnit: integrace, s kým a jak se údaje berou]`.
- **Proč:** na pokyn Kryštofa, aby bylo jasné, co přehled obsahuje.
- **Dopad:** izolované (S7, bez nového kroku). Integrace je v Otevřených otázkách; do doplnění se na slajdu netvrdí.
- **Soubory:** `src/content/slides.ts`, `src/slides/S07Vision.tsx`, `docs/BRIEF.md`, `memory/memory.md`

### 2026-10-19 — S4: Spotřeba, Databáze, Finance
- **Co:** Na S4 přibyly za „Pronajímatel.“ kroky „Spotřeba.“, „Databáze.“ a „Finance.“ s placeholdery screenshotů. S4 má 7 kroků, shrnutí je krok 7. Poznámky mají u nových kroků `[doplnit]`, protože není známý jejich obsah.
- **Proč:** na pokyn Kryštofa.
- **Dopad:** S4 je nyní 7 obrazovek v rozpočtu 30 s, tedy asi 4 s na krok; hrozí nestíhání. Databáze je podle S7 vize, ne MVP. PDF má 52 stran.
- **Soubory:** `src/content/slides.ts`, `src/slides/S04Product.tsx`, `e2e/deck.ts`, `e2e/engine.spec.ts`, `e2e/offline-presenter.spec.ts`, `docs/BRIEF.md`, `memory/memory.md`

### 2026-10-19 — S7: AI funkce, výdaje, řemeslníci
- **Co:** Na S7 se „AI pro pronájem.“ přejmenovalo na „AI funkce.“ a „Energie a řemeslníci.“ se rozdělilo na dvě větve: „Přehled výdajů.“ (voda, plyn, elektřina, energie jen v poznámkách) a „Řemeslníci v okolí.“ (databáze řemeslníků). Větev řemeslníků je dole uprostřed s přímou linkou do loga. S7 má 6 kroků místo 5, závěrečná věta je krok 6.
- **Proč:** na pokyn Kryštofa.
- **Dopad:** mluvený text S7 je mírně delší (rozpočet 30 s). Databáze řemeslníků a přehled výdajů jsou vize, ne MVP; databázi je potřeba vzít odněkud (vlastní sběr, partneři) a rozhodnout později. PDF má 49 stran. Seznam utilit na slajdu není, drží se limit hesel.
- **Soubory:** `src/content/slides.ts`, `src/slides/S07Vision.tsx`, `e2e/deck.ts`, `e2e/engine.spec.ts`, `e2e/offline-presenter.spec.ts`, `docs/BRIEF.md`, `memory/memory.md`

### 2026-10-19 — S4: dashboard pronajímatele
- **Co:** Na S4 přibyl čtvrtý krok „Pronajímatel.“ za „Nájemník.“ s placeholderem screenshotu dashboardu; shrnutí „Každý svůj přehled.“ je teď krok 4. Do poznámek přibyla jedna věta bez konkrétních údajů o obsahu dashboardu.
- **Proč:** na pokyn Kryštofa.
- **Dopad:** S4 má 4 kroky místo 3, mluvený text je o jednu větu delší (rozpočet S4 je 30 s). Vyjasnit rozdíl od kroku „Přehled nemovitosti“ (Otevřené otázky). PDF export má 48 stran (dřív 47); e2e S4→S5 a tisk upraveny.
- **Soubory:** `src/content/slides.ts`, `src/slides/S04Product.tsx`, `e2e/deck.ts`, `e2e/engine.spec.ts`, `e2e/offline-presenter.spec.ts`, `docs/BRIEF.md`, `memory/memory.md`

### 2026-10-19 — Kreditní model a konkurence v hlavním pitchi
- **Co:** Přibyl devátý hlavní slajd. S8 ukazuje modelové dobití 1 000 kreditů, opravu za 600, AI návrh smlouvy za 5 a zůstatek 395; pak odhalí možné příjmy a plánované odlišení vůči trhu. Původní závěr přešel na S9. S7 nově výslovně mluví o ověření, přenosné historii, řemeslnících a evidenci kauce. Záložní Z3 obsahuje věcné srovnání s Repilotem a eviduje.cz.
- **Proč:** Kryštof požádal o hlavní kreditní slajd, obecnou monetizaci, srovnání s konkurencí a čas 3–4 minuty.
- **Dopad:** prezentace má devět hlavních slajdů a rozpočet 3:55. Mluvený text má 422 slov, tedy asi 3:03 čisté řeči při 138 slovech/min. Příklady kreditů nejsou ceník, provize ani právní model nejsou potvrzené a odlišení vyžaduje piloty. Build 799,58 kB, kontrola obsahu prošla s 16 známými placeholdery, PDF má 47 a 16 stran. V cílených e2e kontrolách prošlo 13 testů; dvě očekávání zastarala po změně kroků S3/S7, byla opravena a při opakování obě prošla. Generálka ani skutečné screenshoty dosud nejsou hotové.
- **Soubory:** `src/content/slides.ts`, `src/slides/S08Credits.tsx`, `src/slides/S09Ask.tsx`, `src/deck.config.ts`, `src/deck/Presenter.tsx`, `src/motion/presets.ts`, `e2e/deck.ts`, `e2e/engine.spec.ts`, `e2e/offline-presenter.spec.ts`, `docs/BRIEF.md`, `AGENTS.md`, `CLAUDE.md`, `src/slides/README.md`, `memory/memory.md`

### 2026-10-19 — Rozšířená hlavní pitch linka
- **Co:** S3 přešlo na čtyři slovní značky, S4 na tři skutečné obrazovky MVP a S5 na modelový příklad nájmu 20 000 Kč. S6 teď ukazuje správu od smlouvy po daňové podklady; S7 rozšiřuje vizi o AI, ověřenou historii nájemníka, energie, řemeslníky, kredity a platby. Z1, Z4 a Z7 doplňují obchodní model, roadmapu a opatrný postup s kaucí.
- **Proč:** na pokyn Kryštofa, který zvolil rozšířit hlavní pitch.
- **Dopad:** zůstává 8 hlavních slajdů; S3 má 6 kroků, S4 3. Portály mají oddělený přístup: vlastník vidí své nemovitosti a jejich provozní přehled, nájemník jen informace ke svému nájmu. Model 10–12 % čeká na zdroj, screenshoty S4 na dodání, kreditní a platební model na právní ověření. Daňová část slibuje jen evidenci a export. Odhad mluveného textu je 2:39 při 138 slovech/min. Typecheck, lint, `check:content` a build prošly; PDF má 42 a 15 stran. `npm run pdf` skončil na `EPERM` při spuštění wrapperu `tsx`; přímý `node --import tsx scripts/export-pdf.ts` mimo sandbox PDF úspěšně znovu vytvořil. Testy se nespouštěly.
- **Soubory:** `src/content/slides.ts`, `src/slides/S03Reveal.tsx`, `src/slides/S04Product.tsx`, `src/slides/S05Business.tsx`, `src/slides/S06Scale.tsx`, `src/slides/S07Vision.tsx`, `src/slides/chaos/layout.ts`, `src/slides/backup/Slides.tsx`, `docs/BRIEF.md`, `e2e/deck.ts`, `e2e/act1.spec.ts`, `src/content/s5-math.test.ts`, `memory/memory.md`

### 2026-10-19 — Přehled nemovitosti a závěrečný slogan
- **Co:** Na S4 přibyl krok „Přehled nemovitosti.“ mezi platby a portál vlastníka. Poslední krok S8 teď zobrazuje „Přidej. Pronajmi. Vydělávej.“ s logem EstatIQ.
- **Proč:** na pokyn Kryštofa.
- **Dopad:** S4 má nově čtyři produktové ukázky a pět stavů včetně shrnutí; S8 zachovává žádost Green Light před závěrečnou značkou. Všechny čtyři screenshoty S4 jsou placeholdery do dodání podkladů. Build prošel, kontrola obsahu prošla s 16 očekávanými placeholdery a PDF export má 42 stran plus 15 finálních stavů. `npm run pdf` narazil na sandboxové `EPERM` v TSX/Chromium; přímý `node --import tsx scripts/export-pdf.ts` po spuštění mimo sandbox export dokončil.
- **Soubory:** `src/content/slides.ts`, `src/slides/S04Product.tsx`, `src/slides/S08Ask.tsx`, `docs/BRIEF.md`, `e2e/deck.ts`, `e2e/engine.spec.ts`, `memory/memory.md`

### 2026-10-19 — Tag slajdu 3
- **Co:** `s3.screen.tag` nahrazen placeholderem `[doplnit: tag]` textem „Pronájem, který se řídí sám.“ (status `verified`, zdroj „volba Kryštofa, slajd 3“). `check:content` nově hlásí 15 varování místo 16.
- **Proč:** Kryštof zadal tag z variant v Otevřených otázkách. Pozor: claim platí jen po dokončení bankovního párování.

### 2026-10-19 — Fáze 8: generálka a QA
- **Co:** Prošel jsem screenshoty všech 41 kroků S1–S8 a Z1–Z7 proti BRIEF §2; nenašel jsem generické šablonové prvky. Poznámky S2, S6 a S8 jsem stylisticky uhladil bez změny čísel nebo tvrzení. Přidal jsem checklist na den pitche.
- **Proč:** na pokyn uživatele (prompt 08).
- **Dopad:** `check:content` prošel s 16 oznámenými placeholdery. `npm run build:release` správně neprošel, dokud se nedodají hodnoty níže. 22 e2e testů prošlo v Google Chrome offline přes `file://`; `npm run pdf` ověřil 41 stran a 15 finálních stran. Čas je odhad podle 138 slov/min a určených pauz:

  | Slajd | Odhad | Rozpočet | Rozdíl |
  |---|---:|---:|---:|
  | S1 | 18,5 s | 15 s | +3,5 s |
  | S2 | 33,3 s | 30 s | +3,3 s |
  | S3 | 6,8 s | 15 s | −8,2 s |
  | S4 | 25,0 s | 30 s | −5,0 s |
  | S5 | 33,3 s | 25 s | +8,3 s |
  | S6 | 18,5 s | 20 s | −1,5 s |
  | S7 | 22,4 s* | 25 s | −2,6 s* |
  | S8 | 24,6 s | 20 s | +4,6 s |

  Celkem 182,4 s (3:02,4); *S7 nezahrnuje dvě neurčené pauzy. Návrhy, neprovedeno: na S1 zkrátit větu „Pod značkami Alteno a Vizeon stavím firmám weby a automatizace“; na S2 vypustit „Knihy, podcasty a“ (navazuje na otevřený rozpor s poznámkou S1); na S5 vypustit větu „Platí se každý měsíc a klient, kterému to šetří čas, neodchází.“; na S8 zkrátit žádost například na „Odborníky, kteří mi poradí, co mi chybí, a parťáka na prodej.“ Žádný škrt není provedený; ověřit při generálce, které jsou potřeba.

  Záznam Chrome DevTools Protocol při 4× CPU throttlingu: S2 413 snímků, 59,7 fps, p95 16,8 ms, 1 snímek nad 25 ms; S7 325 snímků, 60,0 fps, p95 16,7 ms, žádný nad 25 ms. Nejde o měření na integrované grafice. Trace soubory jsou lokální a ignorované v `test-results/performance/`.

  Stav bodů BRIEF §8: obsahová kontrola, kroky vpřed/vzad i během animace, offline Google Chrome a PDF ověřeny. Firefox není v prostředí nainstalovaný; fyzický prezentér, nouzový skok z něj, druhý monitor a projektor vyžadují zkoušku na místě. 60 fps na integrované grafice nebylo tímto headless měřením ověřeno. Generálka se stopkami ještě neproběhla; odhad je nad 3:00 a v obsahu stále jsou `[doplnit]`.

  Pro úspěšný `build:release` Kryštof musí dodat: školu a ročník, fotku a světlá loga pro S1; vlastní fotky šanonu, faktur a vodoměru pro S2; tag pro S3; screenshoty plateb, přehledu nemovitosti a obou portálů pro S4; ověřený údaj/zdroj trhu pro S6; zvolenou variantu ceny pro Z2; jména obchodního parťáka a člověka z oboru pro Z5; obsah financí po workshopu pro Z6. Samostatně ověřit pravdivost MVP/bankovního párování a školního údaje před pitchem.
- **Soubory:** `src/content/slides.ts`, `docs/DEN-PITCHE.md`, `memory/index.md`, `memory/memory.md`, `export/pitch.pdf`, `export/pitch-final.pdf`

### 2026-10-19 — Fáze 7: přednášející a export
- **Co:** Přibyl režim přednášejícího s aktuálním a dalším krokem, poznámkami, časovým rozpočtem a synchronizací navigace i stopek přes `BroadcastChannel` a `window.opener.postMessage`. `?print` vykreslí každý krok bez animací; `npm run pdf` vytvoří kompletní PDF a PDF finálních stavů.
- **Proč:** na pokyn uživatele (prompt 07).
- **Dopad:** single-file build má 788,70 kB. Offline e2e přes `file://` prošlo (22 testů), včetně ovládání presenteru oběma směry. PDF má 41 a 15 stran, české fonty jsou načtené a každá strana odpovídá plátnu 1920×1080. `build:release` správně končí chybou a vypíše 16 chybějících hodnot. `check:content` a release check používají `node --import tsx`, protože spouštěč `tsx` v sandboxu narážel na `EPERM` při vytvoření IPC socketu.
- **Soubory:** `AGENTS.md`, `package.json`, `playwright.config.ts`, `scripts/chromium.ts`, `scripts/export-pdf.ts`, `src/App.tsx`, `src/deck.config.ts`, `src/deck/{Deck,Presenter,PrintDeck,sync,useControls,print}.ts*`, `e2e/offline-presenter.spec.ts`, `memory/index.md`, `memory/memory.md`

### 2026-10-19 — Fáze 6: S7, S8, záložní
- **Co:** Dummy S7–S8 a Z1–Z7 nahradily finální černý vrchol s tokem tří linek, závěrečné heslo a rozpuštění řádku výpisu a sedm záložních kompozic. Ceny, finance a chybějící lidé zůstali jako placeholdery. Obsahová kontrola i test kroků teď zahrnují také Z slajdy.
- **Proč:** na pokyn uživatele (prompt 06).
- **Dopad:** S6 → S7 je jediný tvrdý střih; S8 používá 1,2s `clip-path` animaci, která neblokuje navigaci. Typecheck, lint, 38 unit testů, build a 19 e2e testů prošly; obsahová kontrola prošla s 16 placeholder varováními. E2E potvrzuje přesný návrat z přehledu, rychlý průchod, tok `strokeDashoffset` a okamžitý střih. S2 při 4× CPU throttlingu: 59,4 fps průměr, p95 16,8 ms. Vizuální sebekontrola BRIEF §2: bez karet, generických ikon a neověřených tvrzení; Z3 zůstává pozicování a Z7 časová osa. `npm run check:content` má známé omezení `EPERM` v sandboxu, ekvivalentní skript prošel přes `node --import tsx scripts/check-content.ts`.
- **Soubory:** `src/content/slides.ts`, `src/content/slides.test.ts`, `src/deck.config.ts`, `src/design/primitives/FlowLine.tsx`, `src/motion/presets.ts`, `src/slides/S07Vision.tsx`, `src/slides/S08Ask.tsx`, `src/slides/backup/Slides.tsx`, `e2e/engine.spec.ts`, `memory/index.md`, `memory/memory.md`

### 2026-10-19 — Fáze 5: S4–S6
- **Co:** Dummy S4–S6 nahradily produktová ukázka s řádkem, který se spáruje a zezelená, asymetrický ceník B2B/B2C a expanze Česko → Slovensko → střední Evropa. Screenshoty jsou popsané placeholdery; S4 highlighty jsou procentuální hodnoty v obsahu. Přibyl test výpočtů S5 a engine e2e teď testuje nové slajdy.
- **Proč:** na pokyn uživatele (prompt 05).
- **Dopad:** všech 17 e2e testů prošlo včetně rychlého proklikání, zpětného průchodu a S2 FPS kontroly (59,7 fps průměr, p95 16,8 ms). typecheck, lint, 29 unit testů a obsahová kontrola také prošly. `npm run check:content` v sandboxu končí `EPERM` při IPC socketu `tsx`; stejný skript prošel přes `node --import tsx scripts/check-content.ts`. Vizuální sebekontrola BRIEF §2: 1) chybějící screenshoty jsou výslovné placeholdery, 2) bankovní párování zůstává k potvrzení a text mluvené části je zachován dle briefu, 3) neověřený údaj trhu je skrytý, dokud se nedodá zdroj. Otevřená zůstává i formulace závěru S4.
- **Soubory:** `src/content/slides.ts`, `src/content/s5-math.test.ts`, `src/slides/S04Product.tsx`, `src/slides/S05Business.tsx`, `src/slides/S06Scale.tsx`, `src/deck.config.ts`, `src/design/primitives/StatementRow.tsx`, `src/motion/presets.ts`, `e2e/deck.ts`, `e2e/engine.spec.ts`, `memory/index.md`, `memory/memory.md`

### 2026-10-19 — Fáze 4: S1–S3
- **Co:** Vznikly slajdy S1 (fotka vlevo, jméno vpravo dole, důkazy pod fotkou, most z papíru a řádků výpisu), S2 (timeline na `useAnimate` 2,7 s: výpis, tabulka se zeleným pruhem, 8 řádků přeletí do buněk, dvě bubliny, počítadlo 0 → 300, pak smyčka a v kroku 1 zmrazení se ztlumením) a S3 (rozpad ≤ 600 ms, rozsvěcování slov, splynutí v logo, tag). Obsah S1–S3 je v `src/content/slides.ts` s fiktivním výpisem (Ostrava, česká jména, VS = rok + jednotka) a poznámkami doslova z BRIEF. S4–S8 jsou dummy se správným počtem kroků. `Placeholder` dostal `align`, `Counter` exportuje `formatCount`, rozměr plátna se přesunul do `src/deck/canvas.ts`. E2e se přepsaly na skutečný deck (`e2e/deck.ts`, `engine.spec.ts` testuje mechaniku na dummy S4–S8) a přibyl `act1.spec.ts`.
- **Proč:** na pokyn uživatele (prompt 04).
- **Dopad:** fáze 5 nahradí dummy S4, takže se `engine.spec.ts` musí přesunout na slajdy, které ještě dummy jsou. S4 má podle BRIEF pokračovat stejným motivem řádku (`StatementRow`). Plynulost S2 při CPU throttlingu 4× (headless Chromium, CDP `Emulation.setCPUThrottlingRate`, ne DevTools na integrované grafice): 194 snímků, průměr 59,4 fps, p95 16,7 ms, 1 snímek nad 25 ms. Co nefungovalo: skrytý výchozí stav přes `style` hrozil přepsáním hodnot z `useAnimate` při re-renderu, proto je v `initial`. Smyčka pod `instantAnimations` jen skočí na konec, proto se spouští až v `mode: 'normal'`. Import `stage` z `deck.config.ts` do slajdu udělal kruh a `check:content` padal na TDZ. Chrome serializuje `inset(50% 0% 50% 0%)` jako `inset(50% 0%)`. Výchozí `p-8` v `Placeholder` přebíjí `p-3` z `className`, nutné `p-3!`.
- **Soubory:** `src/slides/S01Intro.tsx`, `src/slides/S02Problem.tsx`, `src/slides/S03Reveal.tsx`, `src/slides/chaos/*`, `src/content/slides.ts`, `src/content/slides.test.ts`, `src/content/check*.ts`, `src/motion/presets.ts`, `src/deck.config.ts`, `src/deck/canvas.ts`, `src/design/primitives/{Placeholder,Counter,index}.ts*`, `src/smoke.test.ts` (smazán), `e2e/*`, `AGENTS.md`, `memory/index.md`

### 2026-10-19 — Fáze 3: design systém
- **Co:** Tokeny přepsané podle rep EstatIQ, přibyla typografická škála (`text-hero` 200, `text-number` 280, `text-word` 88, `text-label` 30, `text-row` 34 px) a `spacing-edge` 120 px. Logo se generuje z obrysů (`scripts/make-logo.ts`, opentype.js 1.3.4). Vznikla primitiva Word, Strike, Counter, StatementRow, LaptopFrame, Placeholder, FlowLine, Logo a Glyph, dev styleguide `#/styleguide` (4 desky) a skript `shoot:styleguide`. `check:content` se přesunul do `src/content/check.ts` s testy: výjimky z limitu slov jsou v `deck.config.ts` (`s1`, `z*`), přibyla kontrola mezer v číslech a zákaz `→` a `★`, `[doplnit` je mimo release varování. Fonty se importují jen v podmnožinách latin a latin-ext (build 799 → 716 kB). `presets.ts` dostal `dur.draw` 0,4, `dur.count` 2,4 a `dur.flow` 2,8 s: tabulka v BRIEF je nemá, rozpočet z pravidla 3 drží.
- **Proč:** na pokyn uživatele (prompt 03).
- **Dopad:** slajdy 4–6 skládají z primitiv. Co nefungovalo: opentype.js 2.0 s výchozím `optimize` generuje v cestách `NaN` a `@types` jsou pro v1, proto pin 1.3.4. Jednotka `ch` u JetBrains Mono vycházela 0,5em místo 0,6em (unicode-range), sloupce výpisu jsou proto v `em`.
- **Soubory:** `src/design/*`, `src/design/primitives/*`, `src/styleguide/Styleguide.tsx`, `src/content/check*.ts`, `src/motion/presets.ts`, `src/deck.config.ts`, `src/main.tsx`, `src/App.tsx`, `scripts/*`, `public/assets/logos/estatiq*.svg`, `e2e/logo.spec.ts`, `package.json`, `AGENTS.md`, `memory/index.md`

### 2026-10-19 — Fáze 2: engine
- **Co:** Vznikl engine: čistý reducer (`next`, `prev`, `goto`, `jumpToFinal`, `setMode`) s testy, hash `#/slajd/krok`, plátno 1920×1080 se škálováním a letterboxem v barvě slajdu, prolínání přes `AnimatePresence mode="popLayout"` s vlastními variantami na slajd, „klik vyhrává“, režim `instant` (300 ms / 800 ms), klávesy z BRIEF §5 včetně čísla + Enter, přehled `Z`, debug `D`, skrytí kurzoru, zákaz výběru a kontextového menu, preload fontů a obrázků s pojistkou 4 s. `presets.ts` dostal hodnoty z BRIEF §4 a výchozí `slideFade`, protože je engine potřebuje už teď. `P` a `T` jsou namapované, ale nic nedělají (fáze 7). `F5` se zachytí, aby prezentér nemohl stránku obnovit. `npm run e2e` teď builduje a pouští 10 testů.
- **Proč:** na pokyn uživatele (prompt 02).
- **Dopad:** slajdy ve fázích 4–6 musí dodržet kontrakt z AGENTS.md → Engine. Dummy slajdy v `deck.config.ts` se pak nahradí. Pořadí dummy je 0, 4 a 2 kroky, aby `#/2/3` z kritérií přijetí byl platný krok. Playwright běží s předinstalovaným Chromiem 1243 přes `executablePath`. `SlideProps` má navíc `direction`, který potřebuje prompt 04 („S3 → S2 obnoví chaos v zastaveném stavu“).
- **Soubory:** `src/deck/*`, `src/deck.config.ts`, `src/motion/presets.ts`, `src/slides/dev/Dummy.tsx`, `src/App.tsx`, `e2e/engine.spec.ts`, `playwright.config.ts`, `package.json`, `AGENTS.md`, `memory/index.md`

### 2026-10-19 — Fáze 1: scaffold
- **Co:** Postavena kostra Vite + React 19 + TS strict + Tailwind v4 + Motion, single-file build, ESLint, Prettier, Vitest, Playwright, tokeny z BRIEF §3 a `check:content` (kontrola 5 slov, nbsp, placeholdery, `--release`). `pdf` a `e2e` zatím jen vypíší TODO.
- **Proč:** na pokyn uživatele.
- **Dopad:** izolované. Playwright 1.64 chce Chromium 1248, v cache je 1243 (`playwright install` se nespouští), takže e2e a pdf ve fázích 7–8 potřebují `executablePath` nebo pin starší verze `@playwright/test`. `dist/index.html` ověřen přes `file://` bez chyb. ESLint ignoruje `.claude/`.
- **Soubory:** `package.json`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `playwright.config.ts`, `index.html`, `src/**`, `scripts/check-content.ts`, `.gitignore`

### 2026-10-19 — Setup dokumentace
- **Co:** Vznikly `CLAUDE.md`, `AGENTS.md`, `memory/*`, `docs/BRIEF.md` a fázové prompty 01–08.
- **Proč:** na pokyn uživatele, jako základ před stavbou.
- **Dopad:** izolované.
- **Soubory:** všechny výše.
