import { lazy, Suspense, useSyncExternalStore } from 'react';
import { Deck } from './deck/Deck';

// Styleguide jen ve vývoji. V produkčním buildu je větev mrtvá a modul se do HTML nedostane.
const Styleguide = import.meta.env.DEV
  ? lazy(() => import('./styleguide/Styleguide').then((m) => ({ default: m.Styleguide })))
  : null;

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}
const isStyleguide = () => window.location.hash === '#/styleguide';

export function App() {
  const styleguide = useSyncExternalStore(subscribe, isStyleguide);
  if (Styleguide && styleguide) {
    return (
      <Suspense>
        <Styleguide />
      </Suspense>
    );
  }
  return <Deck />;
}
