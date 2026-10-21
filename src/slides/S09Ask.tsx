// S9 · Závěr · tma. Jen slogan a logo EstatIQ; žádost (piloty, mentoři, tým) zazní ústně.
import { Logo, Word } from '../design/primitives';
import { s9, text } from '../content/slides';

export function S09Ask() {
  return (
    <div
      data-testid="s9-endcard"
      className="absolute inset-0 flex flex-col items-center justify-center gap-24 px-edge text-fg"
    >
      <Word state="lit" className="text-word">
        {text(s9.screen.tagline)}
      </Word>
      <Logo className="w-[420px]" />
    </div>
  );
}
