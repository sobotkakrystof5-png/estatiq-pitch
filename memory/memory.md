# MEMORY — živý stav

Co se skutečně stalo, jaký je aktuální stav a proč. Formát: `pravidla.md`.

## Aktuální stav
- **Projekt:** prezentace EstatIQ pro elevator pitch Green Light (3 min prezentace + 7 min otázky).
- **Fáze:** 6 (S1–S8, Z1–Z7) hotová a commitnutá (`fáze 6: S7, S8, záložní`). Další krok je `docs/prompts/07-presenter-export.md`.
- **Stack:** Vite + React 19 + TS + Tailwind v4 + Motion, single-file build (AGENTS.md).
- **Co existuje:** engine v `src/deck/`; S1–S8 a Z1–Z7 jsou realizované; veškerý obsah je v `src/content/slides.ts`; tokeny, primitiva, logo a styleguide `#/styleguide` (jen dev). Fáze 6 ověřena: typecheck, lint, 38 unit testů, obsahová kontrola (16 varování = placeholdery), 19 e2e testů přes `file://`.

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
- **2026-10-19:** S5 odvozuje objem nájmů (300 × 15 000 Kč), relativní cenu (4 990 / objem, zaokrouhleno na 0,1 %) a 8–12% provizi z čísel v obsahu; aritmetiku hlídá unit test.
- **2026-10-19:** S4 highlighty jsou zapsané v procentech v obsahu. Souřadnice jsou pracovní, dokud nebudou dodané skutečné screenshoty.
- **2026-10-19:** S6 přepínač `showMarketStat` je v obsahu výchozím stavem vypnutý, protože údaj 34 500 zatím nemá ověřený zdroj.
- **2026-10-19:** Jediný tvrdý střih je S6 → S7. S7 vpřed vstoupí do černé okamžitě, návrat ze S8 zůstává prolnutím. Linky S7 mají stopu `--fg` na 18 % a tok `--mint`, šířku 1,5 px a cyklus 2,4 s přes `strokeDashoffset`.
- **2026-10-19:** S8 na konci znovu použije fiktivní řádek výpisu ze S2. Rozpustí se zleva doprava za 1,2 s; animace neblokuje další krok. Z1–Z7 drží jen obsah z briefu, bez odhadovaných cen, financí, jmen ani termínů.

## Otevřené otázky
Čeká se na Kryštofa. Do té doby zůstává v obsahu `[doplnit: …]`.
- **Tag u odhalení (slajd 3):** a) „Pronájem, který se řídí sám“ (pravdivé jen s bankovním párováním), b) „Celý nájem na jednom místě“, c) **doporučeno:** „Nájem bez přepisování.“ (navazuje na slajd 1 a 8, pravdivé s importem výpisu a párováním podle VS).
- **Bankovní párování** (import výpisu GPC/ABO a párování podle VS): stihne se před pitchem? Na tom závisí pravdivost slajdů 2, 4 a 8.
- **Časování:** odhad mluveného textu je 3:15 až 3:20. Hlavní přesah dělá slajd 5 (~42 s místo 25). Návrh: vyškrtnout větu „Platí se každý měsíc a klient, kterému to šetří čas, neodchází.“ a větu o „pasivním příjmu“ zkrátit na „Kdo si nájem řídí sám, zaplatí od 199 Kč.“
- **Slajd 2:** vyškrtnout „Knihy, podcasty a“? Je to v rozporu s poznámkou u slajdu 1 („neříkat knihy a podcasty“) a zmizel by tím i otevřený bod s tituly.
- **Slajd 4:** „Tři nástroje. Jedna obrazovka.“ ukazuje tři obrazovky. Návrh: „Jedna aplikace.“ Navíc mapování „Excel → portál vlastníka“ nesedí na slajd 2, kde Excel slouží ke zjištění, kdo zaplatil.
- **S4 screenshoty:** platby, portál vlastníka a portál nájemníka. Do dodání zůstávají tři popsané placeholdery; souřadnice highlightů jsou jen výchozí návrh.
- **S6 tržní statistika:** ověřit zdroj údaje „34 500 pronajímatelů 3+ bytů“, pokud se má zapnout `showMarketStat`.
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
- **Mazání `[doplnit: tag]` v S3.** Na plátně zůstává placeholder, dokud Kryštof nevybere tag.
- **Automatické stržení nájmu na slajdu 4.** Není v MVP a je to regulovaná platební služba. Patří jen do vize na slajdu 7.

## Changelog

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
