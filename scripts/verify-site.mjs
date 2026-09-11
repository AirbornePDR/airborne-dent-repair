// Site-wide regression suite. `npm run verify:site` (build first).
//
// Every assertion here exists because the thing it checks actually went wrong
// once. Add to it rather than re-deriving a one-off check next time.

import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const TYPES = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg',
  '.jpeg':'image/jpeg','.png':'image/png','.mp4':'video/mp4','.woff2':'font/woff2',
  '.xml':'application/xml','.txt':'text/plain'};

const srv = http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join('dist', u);
  try { if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch {}
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end('nf'); }
  const b = fs.readFileSync(f);
  r.writeHead(200, {'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream',
    'Content-Length': b.length, 'Accept-Ranges': 'bytes'});
  r.end(b);
});
await new Promise((r) => srv.listen(4410, '127.0.0.1', r));
const BASE = 'http://127.0.0.1:4410';

const PAGES = ['/', '/services', '/wholesale', '/about', '/contact', '/privacy', '/terms',
  '/hail-damage-repair', '/paintless-dent-repair', '/windshield-replacement', '/window-tint'];

// Reference documents, not conversion pages. They are reached from the footer and
// their job is to be read, so they are not required to carry a CTA.
const NO_CTA_REQUIRED = new Set(['/privacy', '/terms']);

// 5 steps in a 2-column row, and five does not divide by two. Fixing it is a
// design decision (single column on tablet, or a sixth step), not a mechanical one.
const KNOWN_RAGGED = new Set(['/wholesale:steps']);

let fail = 0;
const ok = (cond, msg, extra) => {
  if (!cond) fail++;
  if (!cond) console.log(`FAIL ${msg}${extra ? '  [' + extra + ']' : ''}`);
  return cond;
};

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });

// ---------------------------------------------------------------- CTA routing
// A smoke test found the home page's "Get a Free Estimate" pointing at #contact,
// an anchor to a band with no form in it, and its closing CTA opening a mail
// client. Both bypassed the estimate form completely.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  for (const p of PAGES) {
    const pg = await ctx.newPage();
    await pg.route('**js.hcaptcha.com/**', (r) => r.abort());
    await pg.route('**web3forms.com/client/**', (r) => r.abort());
    await pg.goto(BASE + p, { waitUntil: 'load' });

    const cta = await pg.evaluate(() => {
      const btns = [...document.querySelectorAll('a.btn')];
      return btns.map((a) => {
        const href = a.getAttribute('href') || '';
        let reachesForm = false;
        if (href.startsWith('#') && href.length > 1) {
          const target = document.querySelector(href);
          reachesForm = !!(target && target.querySelector('form[data-w3f]'));
        }
        return {
          href,
          text: a.textContent.trim().slice(0, 40),
          primary: a.classList.contains('btn-solid'),
          mailto: href.startsWith('mailto:'),
          reachesForm,
        };
      });
    });

    // (1) no mail-client link may be dressed as a button. A plain address in a
    // contact block is fine; a button that opens Mail is not a CTA, it is an exit.
    const mailButtons = cta.filter((c) => c.mailto);
    ok(mailButtons.length === 0,
      `${p} has a mailto styled as a button`,
      mailButtons.map((m) => (m.primary ? 'PRIMARY ' : 'btn ') + m.text).join(' | '));

    // (2) every page offers a route to a form, either by linking to a page that
    // has one or by anchoring to a section on this page that contains one.
    if (!NO_CTA_REQUIRED.has(p)) {
      const routes = cta.filter((c) =>
        /^\/(contact|wholesale)\/?$/.test(c.href) || c.reachesForm);
      ok(routes.length > 0,
        `${p} has no CTA that reaches a form`,
        cta.map((c) => c.href).join(' | '));
    }

    // (3) an in-page anchor CTA must actually resolve to a section that has a
    // form. This is the exact home-page bug: #contact existed, but held no form.
    const deadAnchors = cta.filter((c) => c.href.startsWith('#') && c.href.length > 1 && !c.reachesForm);
    ok(deadAnchors.length === 0,
      `${p} has a button anchoring to a section with no form`,
      deadAnchors.map((d) => d.href + ' (' + d.text + ')').join(' | '));

    await pg.close();
  }
  await ctx.close();
}

// ------------------------------------------------- words fused to inline tags
// Astro collapses the newline+indent between a text node and an element that
// starts on the next source line, so "send them to\n<a>address</a>\nonce" renders
// as "send them toaddressonce". It is invisible in the source, which reads
// correctly, and only shows up in the built page. A space on the SAME line is
// preserved, so the fix is to keep the words and the tag together on one line.
{
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) files.push(p);
    }
  };
  walk('dist');
  const BEFORE = /[a-zA-Z0-9,;:]<(?:a |strong|em|code)/g;
  const AFTER = /<\/(?:a|strong|em|code)>[a-zA-Z0-9]/g;
  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    const hits = [];
    for (const re of [BEFORE, AFTER]) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(html))) {
        const start = Math.max(0, m.index - 45);
        hits.push('…' + html.slice(start, m.index + m[0].length + 25).replace(/\s+/g, ' '));
      }
    }
    ok(hits.length === 0, `${f} has a word fused to an inline tag`, hits.join('  ||  '));
  }
}

// ------------------------------------------------------- links, layout, copy
{
  const ctx0 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  for (const p of PAGES) {
    const pg = await ctx0.newPage();
    await pg.route('**js.hcaptcha.com/**', (r) => r.abort());
    await pg.route('**web3forms.com/client/**', (r) => r.abort());
    await pg.goto(BASE + p, { waitUntil: 'load' });
    const hrefs = await pg.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')));
    for (const h of hrefs) {
      if (!h || /^(tel:|mailto:|http)/.test(h)) continue;
      if (h === '#') { ok(false, `${p} has a placeholder href="#"`); continue; }
      if (h.startsWith('#')) continue;
      const st = (await fetch(BASE + h)).status;
      ok(st === 200, `${p} links to ${h} which returns ${st}`);
    }
    const legal = await pg.evaluate(() => {
      const f = document.querySelector('footer');
      const hs = [...f.querySelectorAll('a')].map((a) => a.getAttribute('href'));
      return hs.includes('/privacy') && hs.includes('/terms');
    });
    ok(legal, `${p} footer is missing the privacy/terms links`);
    await pg.close();
  }
  await ctx0.close();
}

for (const w of [390, 768, 1000, 1280, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 } });
  for (const p of PAGES) {
    const pg = await ctx.newPage();
    const bad = [];
    await pg.route('**js.hcaptcha.com/**', (r) => r.abort());
    await pg.route('**web3forms.com/client/**', (r) => r.abort());
    pg.on('pageerror', (e) => bad.push('JS ' + e.message));
    pg.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(BASE)) bad.push(r.status() + ' ' + r.url()); });
    const resp = await pg.goto(BASE + p, { waitUntil: 'load' });
    await pg.evaluate(async () => {
      const step = Math.round(innerHeight * 0.7);
      for (let y = 0; y < document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 150));
    });

    const r = await pg.evaluate(() => {
      const de = document.documentElement;
      const H = de.outerHTML;
      // body carries the page-level overflow guard, so stop the walk there or it
      // masks a component that is genuinely too wide
      const clipped = (e) => {
        for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
          if (getComputedStyle(a).overflowX !== 'visible') return true;
        }
        return false;
      };
      let wide = null;
      for (const e of document.querySelectorAll('*')) {
        const b = e.getBoundingClientRect();
        if (b.width > 0 && b.right > de.clientWidth + 1 && !clipped(e)) {
          wide = e.tagName + '.' + (e.className || '').toString().slice(0, 30);
          break;
        }
      }
      // a tiled grid draws its rules as a background behind the tiles, so a last
      // row that is not full shows through as a pale block
      const ragged = [];
      for (const g of document.querySelectorAll('.gallery,.fleet-stills,.services,.steps,.others')) {
        const kids = [...g.children];
        if (!kids.length) continue;
        const cols = new Set(kids.map((k) => Math.round(k.getBoundingClientRect().left))).size;
        const gw = Math.round(g.getBoundingClientRect().width);
        let cells = 0;
        for (const k of kids) cells += (Math.round(k.getBoundingClientRect().width) >= gw - 2 ? cols : 1);
        if (cells % cols !== 0) ragged.push(g.className.split(' ')[0]);
      }
      return {
        sw: de.scrollWidth, iw: innerWidth, wide, ragged,
        navs: document.querySelectorAll('header.nav').length,
        foots: document.querySelectorAll('footer').length,
        broken: [...document.images].filter((i) => !(i.complete && i.naturalWidth > 0)).length,
        noalt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
        unlabelled: [...document.querySelectorAll('.shot')].filter((e) => {
          const bg = getComputedStyle(e).backgroundImage;
          return bg && bg !== 'none' && !e.getAttribute('aria-label');
        }).length,
        deductible: /deductible|out of pocket/i.test(document.body.innerText),
        withheld: /CRR|Waxahachie/i.test(H),
        staleHost: /vercel\.app|example\.com/i.test(H),
        placeholderKey: /PASTE_|not connected yet/i.test(H),
        titleEntity: /&(mdash|amp);|\\u20/i.test(document.title),
      };
    });

    const at = `${p} @${w}`;
    ok(resp.status() === 200, `${at} returned ${resp.status()}`);
    ok(r.sw <= r.iw, `${at} scrolls horizontally`, `${r.sw} > ${r.iw}, widest ${r.wide}`);
    ok(!bad.length, `${at} logged errors`, bad.join(' | '));
    ok(r.navs === 1 && r.foots === 1, `${at} nav/footer count`, `nav=${r.navs} foot=${r.foots}`);
    ok(!r.broken, `${at} has broken images`, String(r.broken));
    ok(!r.noalt, `${at} has an image with no alt`, String(r.noalt));
    ok(!r.unlabelled, `${at} has an unlabelled background tile`, String(r.unlabelled));
    ok(!r.deductible, `${at} mentions deductibles (blocked pending the owner's attorney)`);
    ok(!r.withheld, `${at} leaks the withheld partner name`);
    ok(!r.staleHost, `${at} contains a stale host`);
    ok(!r.placeholderKey, `${at} still shows a placeholder form key`);
    ok(!r.titleEntity, `${at} title contains a raw HTML entity`);
    const unexpected = r.ragged.filter((g) => !KNOWN_RAGGED.has(`${p}:${g}`));
    ok(unexpected.length === 0, `${at} has a half-empty grid row`, unexpected.join(' | '));

    await pg.close();
  }
  await ctx.close();
}

// autoplaying loops are motion; reduced motion must pause them
{
  const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const pg = await rm.newPage();
  await pg.goto(BASE + '/', { waitUntil: 'load' });
  await pg.waitForTimeout(900);
  const st = await pg.evaluate(() => [...document.querySelectorAll('video')].map((v) => v.paused && !v.loop && !v.hasAttribute('autoplay')));
  ok(st.length > 0 && st.every(Boolean), 'reduced motion does not pause the videos');
  await rm.close();
}

await browser.close();
srv.close();
console.log(fail ? `\n${fail} FAILURE(S)` : `\nALL SITE CHECKS PASSED — ${PAGES.length} pages`);
process.exit(fail ? 1 : 0);
