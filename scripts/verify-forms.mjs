import { chromium, webkit } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const T = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg',
  '.jpeg':'image/jpeg','.png':'image/png','.mp4':'video/mp4','.woff2':'font/woff2',
  '.xml':'application/xml','.txt':'text/plain'};
const srv = http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join('dist', u);
  try { if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch {}
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end('nf'); }
  const b = fs.readFileSync(f);
  r.writeHead(200, {'Content-Type': T[path.extname(f)] || 'application/octet-stream',
    'Content-Length': b.length, 'Accept-Ranges': 'bytes'});
  r.end(b);
});
await new Promise((r) => srv.listen(4400, '127.0.0.1', r));
const BASE = 'http://127.0.0.1:4400';

const FORMS = [
  { url: '/contact', result: '#estimate-result', btn: 'Send the request',
    fill: {'#r-name':'Jane Doe','#r-phone':'682-555-0134','#r-email':'jane@example.com','#r-vehicle':'2019 Ram 1500'},
    email: '#r-email', select: {'#r-damage':'Hail'},
    radios: ['input[name=insurance_claim][value="Not sure"]'], checks: [] },
  { url: '/wholesale', result: '#account-result', btn: 'Send the inquiry',
    fill: {'#w-business':'Gunter Auto Group','#w-contact':'Sam Reyes','#w-phone':'9725550147','#w-email':'sam@example.com','#w-volume':'30'},
    email: '#w-email', select: {},
    radios: ['input[name=business_type][value="Dealer"]'],
    checks: ['input[name=services][value="Hail damage repair"]','input[name=services][value="XPEL tint"]'] },
  // expectUpload: the only form with an attachment field, and only on the Pro
  // plan. Flip PRO_PLAN back to false and this flips with it.
  { url: '/check-in', result: '#checkin-result', btn: 'Send my check-in', expectUpload: true,
    fill: {'#c-name':'Sam Okafor','#c-cell':'9725550147','#c-email':'sam@example.com','#c-yearmake':'2019 Ram'},
    email: '#c-email', select: {},
    radios: ['input[value="Yes"][name^="08 Customer"]'], checks: [] },
];

const SKIP = new Set(JSON.parse(process.env.SKIP_FORMS || "[]"));
let fail = 0;
const ok = (cond, msg, extra) => { if (!cond) fail++; console.log(`${cond ? 'ok  ' : 'FAIL'} ${msg}${extra ? '  [' + extra + ']' : ''}`); };

async function setup(br, url, responder) {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  // keep the test offline from the real third parties
  await page.route('**js.hcaptcha.com/**', (r) => r.abort());
  await page.route('**web3forms.com/client/**', (r) => r.abort());
  const state = { calls: 0, body: null, files: [] };
  await page.route('https://api.web3forms.com/submit', async (route) => {
    state.calls++;
    const req = route.request();
    const raw = req.postData() || '';
    const ct = (req.headers()['content-type'] || '');
    if (ct.includes('multipart/form-data')) {
      // The upload form posts multipart, not JSON. Parse it to the same shape so
      // every payload assertion below keeps working across both encodings —
      // otherwise enabling upload silently skips those checks.
      const boundary = (ct.match(/boundary=(.+)$/) || [])[1];
      const body = {};
      state.files = [];
      for (const part of raw.split('--' + boundary)) {
        const name = (part.match(/name="([^"]+)"/) || [])[1];
        if (!name) continue;
        const filename = (part.match(/filename="([^"]*)"/) || [])[1];
        const value = part.split(/\r?\n\r?\n/).slice(1).join('\n\n').replace(/\r?\n--$/, '').trim();
        if (filename !== undefined) { state.files.push({ name, filename }); continue; }
        body[name] = name in body ? body[name] + ', ' + value : value;
      }
      state.body = body;
    } else {
      state.body = JSON.parse(raw || '{}');
    }
    await responder(route);
  });
  await page.goto(BASE + url, { waitUntil: 'load' });
  return { ctx, page, state };
}
const fillAll = async (page, F) => {
  for (const [s, v] of Object.entries(F.fill)) await page.fill(s, v);
  for (const [s, v] of Object.entries(F.select)) await page.selectOption(s, v);
  for (const s of F.radios) await page.check(s);
  for (const s of F.checks) await page.check(s);
};
const readResult = (page, sel) => page.evaluate((r) => {
  const e = document.querySelector(r);
  return { hidden: e.hidden, cls: e.className, txt: e.textContent.trim(), focused: document.activeElement === e };
}, sel);

for (const [engine, launcher] of [['CHROMIUM', chromium], ['WEBKIT  ', webkit]]) {
  const br = await launcher.launch();
  for (const F of FORMS) {
    const okJson = (route) => route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Form submitted successfully' }) });

    // ---------- markup / accessibility ----------
    {
      const { ctx, page } = await setup(br, F.url, okJson);
      const a = await page.evaluate(() => {
        const f = document.querySelector('form[data-w3f]');
        const ctrls = [...f.querySelectorAll('input:not([type=hidden]):not(.w3f-hp),select,textarea')];
        const unlabelled = ctrls.filter((c) => {
          if (c.closest('label')) return false;
          return !(c.id && f.querySelector('label[for="' + c.id + '"]'));
        }).map((c) => c.name || c.type);
        const texty = ctrls.filter((c) => ['text','tel','email','number'].includes(c.type) || c.tagName === 'SELECT' || c.tagName === 'TEXTAREA');
        const noDesc = texty.filter((c) => !c.getAttribute('aria-describedby')).map((c) => c.name);
        const hp = f.querySelector('.w3f-hp');
        const hpBox = hp ? hp.getBoundingClientRect() : null;
        const res = f.querySelector('.w3f-result');
        const btn = f.querySelector('button[type=submit]');
        return { unlabelled, noDesc,
          hpOk: !!hp && hp.name === 'botcheck' && hp.tabIndex === -1 && !!hpBox && (hpBox.right < 0 || hpBox.width <= 1),
          captcha: !!f.querySelector('.h-captcha[data-captcha="true"]'),
          keyOk: !!f.querySelector('input[name=access_key]') && f.querySelector('input[name=access_key]').value.length > 20,
          resOk: !!res && res.getAttribute('role') === 'status' && res.getAttribute('aria-live') === 'polite'
                 && res.getAttribute('tabindex') === '-1' && res.hidden,
          btnOk: !!btn && btn.type === 'submit',
          legends: [...f.querySelectorAll('fieldset')].map((x) => !!x.querySelector('legend')),
          action: f.getAttribute('action'), method: (f.getAttribute('method') || '').toUpperCase(),
          fileInputs: f.querySelectorAll('input[type=file]').length,
          enctype: f.getAttribute('enctype') || '',
          unconfigured: !!f.querySelector('.w3f-unconfigured') };
      });
      ok(a.unlabelled.length === 0, `${engine} every control has a <label>          ${F.url}`, a.unlabelled.join(','));
      ok(a.noDesc.length === 0,     `${engine} text controls have aria-describedby  ${F.url}`, a.noDesc.join(','));
      ok(a.legends.length > 0 && a.legends.every(Boolean), `${engine} every fieldset has a legend        ${F.url}`);
      ok(a.hpOk,      `${engine} honeypot hidden, out of tab order  ${F.url}`);
      ok(a.captcha,   `${engine} hCaptcha widget present            ${F.url}`);
      ok(a.keyOk,     `${engine} access_key present                 ${F.url}`);
      ok(a.resOk,     `${engine} result region wired, hidden first  ${F.url}`);
      // A missing submit button is correct when the access key is still a
      // placeholder — that state is asserted below instead.
      if (!a.unconfigured) ok(a.btnOk, `${engine} real keyboard-reachable submit     ${F.url}`);
      ok(a.action === 'https://api.web3forms.com/submit' && a.method === 'POST',
                      `${engine} no-JS action/method intact         ${F.url}`);
      // Upload is expected on /check-in only, and ONLY when it is wired correctly.
      // A file input without multipart/form-data silently drops the attachment:
      // Web3Forms rejects it and the customer is told the form sent fine. That is
      // the failure this assertion exists to catch, not the presence of the field.
      if (F.expectUpload) {
        ok(a.fileInputs === 1,
                      `${engine} exactly one upload field           ${F.url}`);
        ok(a.enctype.includes('multipart/form-data'),
                      `${engine} enctype set, attachment not dropped ${F.url}  [${a.enctype || 'MISSING'}]`);
      } else {
        ok(a.fileInputs === 0,
                      `${engine} no file input, as intended         ${F.url}`);
      }

      if (a.unconfigured) {
        // Key still a placeholder: assert the deliberate "not connected" state
        // rather than the submit path, and make sure the lead still has a route.
        const u = await page.evaluate(() => {
          const n = document.querySelector('.w3f-unconfigured');
          return n ? n.textContent.replace(/\s+/g, ' ').trim() : null;
        });
        ok(!!u, `${engine} unconfigured notice shown         ${F.url}`);
        ok(!!u && /682-226-0543/.test(u), `${engine} phone offered while unconnected   ${F.url}`);
        ok(!!u && /gmail\.com/.test(u), `${engine} email offered while unconnected   ${F.url}`);
        await ctx.close();
        continue;
      }
      await page.locator('form[data-w3f] button[type=submit]').focus();
      const focused = await page.evaluate(() => document.activeElement.tagName + ':' + document.activeElement.type);
      ok(focused === 'BUTTON:submit', `${engine} submit is focusable               ${F.url}`, focused);
      await ctx.close();
    }
    if (SKIP.has(F.url)) continue;

    // ---------- validation blocks the network ----------
    {
      const { ctx, page, state } = await setup(br, F.url, okJson);
      await page.locator('form[data-w3f] button[type=submit]').click();
      await page.waitForTimeout(250);
      const r = await readResult(page, F.result);
      const inv = await page.evaluate(() => document.querySelectorAll('[aria-invalid="true"]').length);
      const onBad = await page.evaluate(() => document.activeElement.getAttribute('aria-invalid') === 'true');
      ok(state.calls === 0, `${engine} empty submit makes NO request     ${F.url}`);
      ok(!r.hidden && r.cls.includes('bad') && inv > 0, `${engine} empty submit marks fields invalid  ${F.url}`, inv + ' invalid');
      ok(onBad, `${engine} focus goes to first invalid field  ${F.url}`);

      await fillAll(page, F);
      await page.fill(F.email, 'not-an-email');
      await page.locator('form[data-w3f] button[type=submit]').click();
      await page.waitForTimeout(250);
      ok(state.calls === 0, `${engine} malformed email blocks request    ${F.url}`);
      await ctx.close();
    }

    // ---------- happy path ----------
    {
      const { ctx, page, state } = await setup(br, F.url, okJson);
      await fillAll(page, F);
      if (F.expectUpload) {
        // A real attachment, not a mocked one. The failure this catches is the
        // attachment being accepted by the page and then quietly dropped on the
        // way out — the customer is told "Sent." and the photo never existed.
        await page.setInputFiles('input[type=file]', {
          name: 'damage.jpg', mimeType: 'image/jpeg',
          buffer: Buffer.from('\xFF\xD8\xFF\xE0 not a real jpeg, but a real upload', 'latin1'),
        });
      }
      await page.locator('form[data-w3f] button[type=submit]').click();
      await page.waitForTimeout(500);
      const r = await readResult(page, F.result);
      ok(state.calls === 1, `${engine} valid submit posts exactly once   ${F.url}`);
      if (F.expectUpload) {
        const att = state.files.find((f) => f.name === 'attachment');
        ok(!!att, `${engine} attachment reached the request    ${F.url}`, att && att.filename);
        ok(att && att.filename === 'damage.jpg',
           `${engine} attachment kept its filename      ${F.url}`, att && att.filename);
      }
      ok(!r.hidden && r.cls.includes('ok') && /Sent\./.test(r.txt), `${engine} success rendered inline            ${F.url}`);
      ok(r.focused, `${engine} focus moved to result message      ${F.url}`);
      ok(page.url().startsWith(BASE), `${engine} stayed on our page, no redirect    ${F.url}`);
      ok(state.body && state.body.access_key && state.body.access_key.length > 20, `${engine} payload carries access_key        ${F.url}`);
      ok(state.body && 'botcheck' in state.body === false, `${engine} unchecked honeypot not submitted   ${F.url}`);
      if (F.checks.length) ok(state.body && state.body.services === 'Hail damage repair, XPEL tint',
        `${engine} checkbox group joined not clobbered ${F.url}`, String(state.body.services));
      const cleared = await page.inputValue(Object.keys(F.fill)[0]);
      ok(cleared === '', `${engine} form reset after success          ${F.url}`);
      await ctx.close();
    }

    // ---------- 200 but success:false must NOT show success ----------
    {
      const { ctx, page, state } = await setup(br, F.url, (route) => route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Invalid access key' }) }));
      await fillAll(page, F);
      await page.locator('form[data-w3f] button[type=submit]').click();
      await page.waitForTimeout(500);
      const r = await readResult(page, F.result);
      ok(state.calls === 1 && r.cls.includes('bad') && !r.cls.includes(' ok'),
         `${engine} 200 + success:false = FAILURE      ${F.url}`);
      ok(/Invalid access key/.test(r.txt), `${engine} server reason surfaced            ${F.url}`);
      ok(/682-226-0543/.test(r.txt), `${engine} phone fallback shown on failure    ${F.url}`);
      // the expected address is whatever the form declares, not a hardcoded guess
      const declared = await page.evaluate(() =>
        document.querySelector('form[data-w3f]').getAttribute('data-fallback-email'));
      ok(r.txt.includes(declared), `${engine} correct email fallback shown       ${F.url}`, declared);
      ok(r.focused, `${engine} focus moved to error message      ${F.url}`);
      const kept = await page.inputValue(Object.keys(F.fill)[0]);
      ok(kept !== '', `${engine} input preserved on failure        ${F.url}`);
      await ctx.close();
    }

    // ---------- HTTP 500 ----------
    {
      const { ctx, page } = await setup(br, F.url, (route) => route.fulfill({
        status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Server error' }) }));
      await fillAll(page, F);
      await page.locator('form[data-w3f] button[type=submit]').click();
      await page.waitForTimeout(500);
      const r = await readResult(page, F.result);
      ok(r.cls.includes('bad') && /682-226-0543/.test(r.txt), `${engine} HTTP 500 shows error + fallback    ${F.url}`);
      await ctx.close();
    }

    // ---------- network failure ----------
    {
      const { ctx, page } = await setup(br, F.url, (route) => route.abort());
      await fillAll(page, F);
      await page.locator('form[data-w3f] button[type=submit]').click();
      await page.waitForTimeout(600);
      const r = await readResult(page, F.result);
      ok(r.cls.includes('bad') && /682-226-0543/.test(r.txt), `${engine} network failure shows fallback     ${F.url}`);
      const enabled = await page.locator('form[data-w3f] button[type=submit]').isEnabled();
      ok(enabled, `${engine} submit re-enabled after failure    ${F.url}`);
      await ctx.close();
    }
  }
  await br.close();
}
srv.close();
console.log(fail ? `\n${fail} FAILURE(S)` : '\nALL FORM CHECKS PASSED (Chromium + WebKit)');
process.exit(fail ? 1 : 0);
