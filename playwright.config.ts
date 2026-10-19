import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from '@playwright/test';

// `playwright install` se nespouští. Pokud v cache chybí verze, kterou chce nainstalovaný
// @playwright/test, použije se nejnovější předinstalovaný headless Chromium (nebo PW_CHROMIUM_PATH).
function chromiumPath(): string | undefined {
  if (process.env.PW_CHROMIUM_PATH) return process.env.PW_CHROMIUM_PATH;
  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  if (!existsSync(cache)) return undefined;
  const dir = readdirSync(cache)
    .filter((d) => d.startsWith('chromium_headless_shell-'))
    .sort()
    .pop();
  if (!dir) return undefined;
  const bin = join(cache, dir, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell');
  return existsSync(bin) ? bin : undefined;
}

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  use: {
    viewport: { width: 1920, height: 1080 },
    launchOptions: { executablePath: chromiumPath() },
  },
});
