/**
 * Znaky, které Space Grotesk z fontsource nemá (→ a ★). Kreslí se jako SVG ve velikosti
 * 1 em a v barvě textu, tloušťka čáry odpovídá řezu 500. V textu slajdu je check:content zakáže.
 */
export function Glyph({ name, className = '' }: { name: 'arrow' | 'star'; className?: string }) {
  if (name === 'arrow') {
    return (
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className={`inline-block h-[0.72em] w-[0.9em] align-[0.02em] ${className}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={9}
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M6 50 H90 M58 18 L90 50 L58 82" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={`inline-block h-[0.72em] w-[0.75em] align-[0.02em] ${className}`}
    >
      <path
        fill="currentColor"
        d="M50 4 L61.8 37.6 L97.6 38.2 L69 59.8 L79.4 94 L50 73.6 L20.6 94 L31 59.8 L2.4 38.2 L38.2 37.6 Z"
      />
    </svg>
  );
}
