// Node nezná import obrázků, který Vite ve slajdech používá. Pro skripty (check:content, pdf)
// stačí prázdná URL; skutečné obrázky řeší jen build.
import { URL } from 'node:url';

const IMAGE = /\.(png|jpe?g|webp|svg)$/i;

export async function load(url, context, nextLoad) {
  if (IMAGE.test(new URL(url).pathname)) {
    return { format: 'module', shortCircuit: true, source: "export default '';" };
  }
  return nextLoad(url, context);
}
