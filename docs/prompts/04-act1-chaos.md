# Fáze 4 — 1. dějství: chaos a odhalení (S1–S3)

## Kontext
Standardní pořadí čtení. Hlavně BRIEF §1 (příběh a motiv), §4 (signature animace) a §6 S1–S3. Použij `frontend-design`, pro texty `humanize-text-cs`.
Tohle je nejtěžší a nejdůležitější fáze. Když tady porota necítí bolest, odhalení nepřistane.

## Cíl
Tři slajdy, které z tmy přejdou do světlého chaosu a zase do klidu, plynule a bez jediného zdržení.

## Rozsah
1. Do `src/content/slides.ts` dej obsah S1–S3: texty na plátně, `notes` doslova z BRIEF a placeholdery `[doplnit: …]` jako `Fact` se `status: 'placeholder'`.
2. **S1:** kompozice podle BRIEF (asymetrie, fotka nebo placeholder). Krok 2 je most, kde řádky výpisu prosakují zespodu `clip-path` wipem a pozadí přechází do `--paper`.
3. **S2:** vyprávěcí timeline (`useAnimate`), která se spustí při vstupu. Trvá ~3 s, pak běží klidná smyčka (řádky jemně přibývají). Krok 1 timeline zmrazí a ztlumí scénu. Fiktivní data řádků jsou v `content`, jména česká, VS a částky realistické. Kulisy jsou fotky nebo placeholdery.
   - Excel ani WhatsApp nesmí mít oficiální logo. Poznají se podle mřížky, zeleného záhlaví a tvaru bubliny.
4. **S2→S3 rozpad:** tři nosné prvky chaosu přejdou přes `layoutId` do slov „Banka.“, „Excel.“ a „WhatsApp.“. Zbytek se rozsype (`opacity` a malý posun, stagger) a pozadí se `clip-path` stáhne do `--night`. Celé ≤ 600 ms. Tohle je jediná výjimka z limitu 400 ms, zapiš ji do memory.
5. **S3:** rozsvěcování slov a splynutí v logo (sjetí, zmenšení, prolnutí, ne morph). Tag je zatím placeholder.
6. Všechny stavy fungují i v režimu `instant` a při zpětném kroku (S3 → S2 obnoví chaos v zastaveném stavu).

## Mimo rozsah
S4 a dál.

## Kritéria přijetí
- [ ] Průchod S1–S3 klikáním v rytmu poznámek nikde nečeká na animaci.
- [ ] Rychlé proklikání (10 kliků za sekundu) skončí ve správném stavu bez artefaktů.
- [ ] Zpětný krok funguje na všech přechodech.
- [ ] 60 fps na S2 při CPU throttlingu 4× v DevTools (zapiš výsledek).
- [ ] `check:content` projde (S1 je v allowlistu).
- [ ] Sebekontrola proti BRIEF §2: vypiš 3 věci, které by mohly působit šablonovitě, a jak jsi je vyřešil.

## Konec fáze
Zapiš do memory (výjimka 600 ms, co nefungovalo) a commitni jako `fáze 4: S1–S3`.
