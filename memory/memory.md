# MEMORY — živý stav

Co se skutečně stalo, jaký je aktuální stav a proč. Formát: `pravidla.md`.

## Aktuální stav
- **Projekt:** prezentace EstatIQ pro elevator pitch Green Light (3 min prezentace + 7 min otázky).
- **Fáze:** 2 (engine) hotová a commitnutá (`fáze 2: engine`, obsahuje i scaffold z fáze 1). Další krok je `docs/prompts/03-design-system.md`.
- **Stack:** Vite + React 19 + TS + Tailwind v4 + Motion, single-file build (AGENTS.md).
- **Co existuje:** dokumentace, kostra z fáze 1 a engine v `src/deck/` s dummy slajdy D1–D3 (0, 4 a 2 kroky) a Z1–Z7. Kontrakt slajdu je v AGENTS.md → Engine. Ověřeno: typecheck, lint, 11 unit testů, `check:content`, 10 e2e testů nad `dist/index.html` přes `file://`.

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

## Otevřené otázky
Čeká se na Kryštofa. Do té doby zůstává v obsahu `[doplnit: …]`.
- **Tag u odhalení (slajd 3):** a) „Pronájem, který se řídí sám“ (pravdivé jen s bankovním párováním), b) „Celý nájem na jednom místě“, c) **doporučeno:** „Nájem bez přepisování.“ (navazuje na slajd 1 a 8, pravdivé s importem výpisu a párováním podle VS).
- **Bankovní párování** (import výpisu GPC/ABO a párování podle VS): stihne se před pitchem? Na tom závisí pravdivost slajdů 2, 4 a 8.
- **Časování:** odhad mluveného textu je 3:15 až 3:20. Hlavní přesah dělá slajd 5 (~42 s místo 25). Návrh: vyškrtnout větu „Platí se každý měsíc a klient, kterému to šetří čas, neodchází.“ a větu o „pasivním příjmu“ zkrátit na „Kdo si nájem řídí sám, zaplatí od 199 Kč.“
- **Slajd 2:** vyškrtnout „Knihy, podcasty a“? Je to v rozporu s poznámkou u slajdu 1 („neříkat knihy a podcasty“) a zmizel by tím i otevřený bod s tituly.
- **Slajd 4:** „Tři nástroje. Jedna obrazovka.“ ukazuje tři obrazovky. Návrh: „Jedna aplikace.“ Navíc mapování „Excel → portál vlastníka“ nesedí na slajd 2, kde Excel slouží ke zjištění, kdo zaplatil.
- **Slajd 1:** škola a ročník (naposledy Friedrich-Schiller-Gymnasium Pirna, platí?), zdroj pro „5,0 ★ od klientů“ (jinak vypustit), světlé verze log Alteno a Vizeon.
- **Logo EstatIQ jako SVG.** Font loga ověřit v repu EstatIQ. Pokud SVG neexistuje, vygeneruje se z obrysů písma (fáze 3).
- **Druhé kolo hovorů:** hodiny měsíčně na platby, proč správci nepřešli na levnější nástroje, aspoň jeden tester nebo pilot.
- **Počet správcovských firem v ČR:** jen jako odpověď na otázku, ne na slajd.
- **Datum pitche, vlastní notebook (HDMI/USB-C), druhý monitor pro režim přednášejícího, jak striktně se hlídá čas.**
- **Assety v `public/` se do single-file buildu neinlinují.** Vite je jen zkopíruje do `dist/assets/`, takže `dist/index.html` by bez té složky neměl obrázky. Návrh pro fázi 3: přesunout podklady do `src/assets/` a importovat je, pak je `vite-plugin-singlefile` vloží do HTML. Mění to strukturu z AGENTS.md, proto čeká na Kryštofa.
- **`steps` a `budgetSec` jsou dvakrát:** v `deck.config.ts` (podle promptu 02) i v typu `SlideContent` v `src/content/slides.ts`. Návrh: při plnění obsahu ve fázi 4 nechat jen `deck.config.ts`.
- **Ceník na záložním slajdu:** varianta po pásmech (300 j. ≈ 5 663 Kč), nebo cenová hypotéza z pitche (4 990 Kč)? Obě verze nesmí být vidět zároveň.

## Záměrně neuděláno
- **Responzivita pro mobil, SEO, meta tagy, analytika.** Nejde o web.
- **Živé demo uvnitř prezentace.** Živé demo běží v EstatIQ na notebooku, prezentace má statické screenshoty.
- **Číslo hodin na slajdu 2.** Počítadlo ukazuje „300 řádků / měsíc“ (aritmetika z příkladu). Hodiny až z hovorů.
- **Automatické stržení nájmu na slajdu 4.** Není v MVP a je to regulovaná platební služba. Patří jen do vize na slajdu 7.

## Changelog

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
