import type { APIRoute } from 'astro';

// The sitemap is generated from the pages that actually exist, not maintained by
// hand. Adding a page to src/pages puts it in the sitemap; deleting one removes
// it. The host comes from `site` in astro.config.mjs, the same source the
// canonical tags use, so the two can never disagree about the domain again.
//
// URLs carry a trailing slash because that is what Astro's directory build emits
// and what the canonical tag on each page says. A sitemap that lists /about while
// the page declares /about/ as canonical is asking search engines to pick.

const PRIORITY: Record<string, string> = {
  '/': '1.0',
  '/services/': '0.9',
  '/contact/': '0.9',
  '/hail-damage-repair/': '0.9',
  '/paintless-dent-repair/': '0.9',
  '/wholesale/': '0.8',
  '/windshield-replacement/': '0.8',
  '/window-tint/': '0.8',
  '/about/': '0.7',
  '/privacy/': '0.3',
  '/terms/': '0.3',
};

const routes = Object.keys(import.meta.glob('./**/*.astro'))
  .map((file) => file.replace(/^\.\//, '').replace(/\.astro$/, ''))
  .map((name) => (name === 'index' ? '/' : `/${name}/`))
  .sort((a, b) => (Number(PRIORITY[b] ?? '0.5') - Number(PRIORITY[a] ?? '0.5')) || a.localeCompare(b));

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('astro.config.mjs is missing `site` — the sitemap cannot be built without it.');

  const urls = routes
    .map((route) => {
      const loc = new URL(route, site).href;
      return `  <url><loc>${loc}</loc><priority>${PRIORITY[route] ?? '0.5'}</priority></url>`;
    })
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
