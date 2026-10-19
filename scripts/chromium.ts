import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/** Použije předinstalovaný Chromium z cache bez stahování prohlížeče. */
export function chromiumPath(): string | undefined {
  if (process.env.PW_CHROMIUM_PATH) return process.env.PW_CHROMIUM_PATH;
  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  if (!existsSync(cache)) return undefined;
  const dir = readdirSync(cache)
    .filter((name) => name.startsWith('chromium_headless_shell-'))
    .sort()
    .pop();
  if (!dir) return undefined;
  const bin = join(cache, dir, 'chrome-headless_shell-mac-arm64', 'chrome-headless-shell');
  const alternate = join(cache, dir, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell');
  if (existsSync(bin)) return bin;
  return existsSync(alternate) ? alternate : undefined;
}
