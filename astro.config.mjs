import { defineConfig } from 'astro/config';

export default defineConfig({
  // Live domain. Single source of truth for canonical tags, og:url, the JSON-LD
  // url and the generated sitemap. Changing it here changes all of them.
  site: 'https://airbornedentrepair.com',
  build: { inlineStylesheets: 'auto' },
});
