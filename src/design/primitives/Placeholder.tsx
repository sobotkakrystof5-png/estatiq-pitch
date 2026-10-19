/**
 * Chybějící asset (BRIEF §7): rámeček ve finálním poměru stran, tenká přerušovaná
 * linka `--muted` a popis, co do něj patří. Nikdy stock ani AI obrázek.
 */
export function Placeholder({
  ratio,
  label,
  align = 'end',
  className = '',
}: {
  ratio: string;
  label: string;
  /** Kde je popis. `start` = nahoře, když spodek placeholderu překrývá jiný prvek. */
  align?: 'start' | 'end';
  className?: string;
}) {
  return (
    <div
      data-placeholder
      className={`flex ${align === 'start' ? 'items-start' : 'items-end'} border-2 border-dashed border-muted/50 p-8 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <span className="max-w-[24ch] text-label text-muted">{label}</span>
    </div>
  );
}
