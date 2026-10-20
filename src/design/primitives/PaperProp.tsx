/**
 * Kulisy papírového chaosu na S2: šanon, faktury, vodoměr. Vlastní vektorová kresba
 * (ne sada ikon), jen linka `--ink` a plochy v barvě papíru. Poměry stran odpovídají
 * `props` v `slides/chaos/layout.ts`, na které navazuje rozpad do S3.
 */
export type PaperPropKind = 'binder' | 'invoices' | 'meter';

const line = 'fill-none stroke-ink stroke-[4]';
const soft = 'fill-none stroke-muted stroke-[3]';

function Binder() {
  return (
    <svg viewBox="0 0 400 300" className="block w-full" strokeLinecap="round" strokeLinejoin="round">
      {/* okraje listů nad hřbetem */}
      <path d="M40 62 H360 M52 48 H348" className={soft} />
      {/* hřbet */}
      <rect x="20" y="76" width="360" height="170" rx="10" className={`${line} fill-paper`} />
      {/* otvor na prst */}
      <circle cx="78" cy="161" r="24" className={line} />
      {/* štítek */}
      <rect x="140" y="110" width="198" height="102" rx="4" className={line} />
      <path d="M162 142 H316 M162 166 H296 M162 190 H270" className={soft} />
      {/* kování dole */}
      <path d="M20 224 H380" className={line} />
    </svg>
  );
}

function Invoices() {
  return (
    <svg viewBox="0 0 250 354" className="block w-full" strokeLinecap="round" strokeLinejoin="round">
      {/* zadní list, lehce posunutý */}
      <path d="M52 20 H200 L232 52 V298 H52 Z" className={`${line} fill-paper`} />
      <rect x="22" y="40" width="176" height="290" className={`${line} fill-paper`} />
      {/* hlavička a tabulka */}
      <path d="M42 70 H110" className={line} />
      <path d="M42 92 H88" className={soft} />
      <path d="M42 138 H178 M42 168 H178 M42 198 H178 M42 228 H178" className={soft} />
      <path d="M130 266 H178" className={line} />
      <path d="M42 266 H100" className={soft} />
      {/* razítko */}
      <circle cx="146" cy="96" r="20" className={line} />
    </svg>
  );
}

function Meter() {
  return (
    <svg viewBox="0 0 300 400" className="block w-full" strokeLinecap="round" strokeLinejoin="round">
      {/* potrubí s přírubami */}
      <path d="M120 0 V96 M180 0 V96 M120 304 V400 M180 304 V400" className={line} />
      <rect x="104" y="80" width="92" height="22" rx="3" className={`${line} fill-paper`} />
      <rect x="104" y="298" width="92" height="22" rx="3" className={`${line} fill-paper`} />
      {/* tělo a ciferník */}
      <circle cx="150" cy="200" r="104" className={`${line} fill-paper`} />
      <circle cx="150" cy="200" r="78" className={soft} />
      {/* okénko s číslicemi */}
      <rect x="92" y="164" width="116" height="34" rx="3" className={line} />
      <path d="M115 164 V198 M138 164 V198 M161 164 V198 M184 164 V198" className={soft} />
      {/* malý ciferník a ručička */}
      <circle cx="150" cy="242" r="18" className={soft} />
      <path d="M150 242 L160 230" className="fill-none stroke-red stroke-[4]" />
    </svg>
  );
}

export function PaperProp({ kind, label }: { kind: PaperPropKind; label: string }) {
  return (
    <div role="img" aria-label={label}>
      {kind === 'binder' ? <Binder /> : kind === 'invoices' ? <Invoices /> : <Meter />}
    </div>
  );
}
