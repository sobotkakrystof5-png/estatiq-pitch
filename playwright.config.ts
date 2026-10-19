import { defineConfig } from '@playwright/test';
import { chromiumPath } from './scripts/chromium';

// `playwright install` se nespouští. Pokud v cache chybí verze, kterou chce nainstalovaný
// @playwright/test, použije se nejnovější předinstalovaný headless Chromium (nebo PW_CHROMIUM_PATH).
export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  use: {
    viewport: { width: 1920, height: 1080 },
    launchOptions: { executablePath: chromiumPath() },
  },
});
