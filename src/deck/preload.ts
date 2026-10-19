// Načte všechny fonty a obrázky dřív, než se ukáže první slajd. Nikdy nečeká déle než `timeoutMs`.
function loadImage(src: string) {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => undefined);
}

export function preloadAssets(images: readonly string[], timeoutMs: number): Promise<void> {
  const fonts = [...document.fonts].map((face) => face.load().catch(() => undefined));
  const all = Promise.all([...fonts, ...images.map(loadImage)]).then(() => document.fonts.ready);
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
  return Promise.race([all, timeout]).then(() => undefined);
}
