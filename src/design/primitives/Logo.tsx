import { logo } from './logo.generated';

/** Wordmark z obrysů písma (scripts/make-logo.ts). Velikost přes `className` (výška nebo šířka). */
export function Logo({ mono = false, className = '' }: { mono?: boolean; className?: string }) {
  return (
    <svg viewBox={logo.viewBox} className={`text-fg ${className}`} role="img" aria-label="EstatIQ">
      <path d={logo.estat} className="fill-current" />
      <path d={logo.iq} className={mono ? 'fill-current' : 'fill-mint'} />
    </svg>
  );
}
