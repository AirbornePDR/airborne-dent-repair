# CLAUDE.md — Airborne Dent Repair

Read this before touching anything. It's the project's standing context.

## What this is

The website for **Airborne Dent Repair**, a paintless dent repair / hail / windshield
/ XPEL tint shop at 489 Reed Ln Unit 2, Gunter TX 75058.

Brendan is building and maintaining it. **The shop owner is the client** — he owns
the domain, the hosting account, and every approval. Brendan is a contractor here,
not the principal. When something needs a business decision (a claim about the shop,
a price, a guarantee), the answer is "ask the owner," not a reasonable guess.

## Stack

Astro 4 static site → Vercel. No database, no framework, no build step beyond Astro.
Plain CSS, hand-written. Node 18.17+.

```
src/layouts/Base.astro      shell: head, JSON-LD schema, nav, footer, inline page scripts
src/components/Nav.astro    top nav — links array lives here, one place
src/components/Footer.astro contact block, hours, address
src/pages/*.astro           one file per URL
src/styles/                 home.css · retail.css · wholesale.css
public/img/                 photos (real jobs only — see rules)
public/fonts/               Airborne Display woff2
```

### Three stylesheets, imported per page — this is deliberate

The pages share class names (`.svc`, `.chip`, `.cross`) but differ in accent color:
**olive `#65713A` on retail, navy `#054385` on wholesale.** Each page imports only
its own sheet so they never collide. Don't "helpfully" merge them into one global
stylesheet — it will break the accent system.

### The fonts are custom cuts, not a Google Fonts family

`AirborneDisplay-{Light,Regular,Medium}.woff2` are static instances cut from the
Archivo variable font at `wdth 118–120 / wght 200–300`. The width is the whole point:
stock Archivo is ~18% narrower on the same string and the headlines lose their
character. Never swap these for a `<link>` to Google Fonts.

## Brand tokens

```
--ink        #020303   page black
--ink-2      #0A0C08   raised black
--bone       #F9F9FA   white
--bone-dim   #9DA294   muted text
--olive      #65713A   retail accent
--olive-lift #9BAA61
--navy       #054385   wholesale / insurance accent
--navy-lift  #5CA4E6
--red        #C01E1F   urgency only, sparing
--hair       rgba(169,173,155,.20)  hairlines
--pad        clamp(1.25rem,4.5vw,4.5rem)
--rhythm     clamp(3.75rem,8vw,7rem)
```

Display type: `font-variation-settings:"wdth" 120,"wght" 250; line-height:.94;
letter-spacing:-.018em`.

## Non-negotiable content rules

These come from the client brief. They are not style preferences.

1. **`[CONFIRM]` tags in the copy are deliberate blanks.** They mark claims nobody
   has verified. **Never fill one with a plausible-sounding guess.** Either the owner
   answers it or the line gets cut. This is the single easiest way to damage this
   project — a fabricated certification or warranty term on a real business's site.
2. **No AI-generated and no stock photography, ever.** Every image is a real job from
   this shop. No composites, no "representative" images. If a photo is missing, the
   section ships without it or ships with a note that the photo is pending.
3. **Redact before publishing.** License plates, VINs, work orders, customer names.
   Files already scrubbed carry a `-REDACTED` suffix — follow that convention.
4. **The deductible assistance offer stays off the site** until the owner's attorney
   or carrier rep signs off in writing. Don't add it, don't hint at it.
5. **Headlines are white.** Olive is an accent — buttons, small labels, panels. It
   never touches a headline. Two-tone headlines (white line + olive line) were
   explicitly rejected as an AI/template tell.
6. **US English.** This is a Texas shop. A British-spelling pass already had to be
   reverted once (color, inquiries, aluminum, two weeks).
7. **Keep this project entirely separate from Built for the Badge.** BFTB is
   Brendan's own business. Nothing crosses in either direction — no shared brand
   system, palette, copy, repo, or Vercel project.

## Verified facts (safe to use in copy)

- Veteran owned. Founder served as a U.S. Army paratrooper, 1-501st Infantry
  (Airborne), 4th IBCT (A) / 25th ID, Alaska.
- Master ARC certified technician.
- Estimates are free. Lifetime warranty on all PDR work.
- Windshield service is both mobile and in-shop.
- Tint is XPEL exclusively, with manufacturer warranty.
- Wholesale: pickup and delivery offered, ~25 vehicles/week max, turnaround quoted
  after estimate.
- Reach: HQ in Gunter, regular service across greater DFW and North Texas, plus
  catastrophe response deployed nationally to severe hail events.
- Phone 682-226-0543 · Fax 833-907-5267
- Retail email `airbornepdr@gmail.com` · Claims `Claimsairbornedentrepair@gmail.com`
- Hours Mon–Sat 9–7, closed Sunday.

**Explicitly NOT true:** the owner does not hold the title "Regional Claims Liaison."
The shop *works with* one. An earlier brief got this wrong. No copy may claim the
title for him.

## State of the build

**Done and verified** — 6 pages build clean, no horizontal overflow at 390px or
1440px, one nav and one footer each, no broken images:

`/` · `/wholesale` · `/hail-damage-repair` · `/paintless-dent-repair` ·
`/windshield-replacement` · `/window-tint`

**Not built yet:**

- Services index, Claims, About, Contact pages
- Estimate form with photo upload (retail → `airbornepdr@gmail.com`;
  wholesale/claims → `Claimsairbornedentrepair@gmail.com`). Needs a backend because
  of the photo upload. Needs spam protection — honeypot + rate limit is enough at
  this volume; skip reCAPTCHA unless spam actually appears.
- Privacy policy + terms. **Required before any form collects data.**
- Four photos still have hash filenames and should be renamed descriptively for
  image SEO: `img-01601d4a77.jpeg`, `img-d658fbaced.jpeg`, `img-ea3b4a7cf7.jpeg`,
  `img-f518ef14c1.jpeg`. Update the `<img src>` that references each.

**Owner-blocked, can't be solved in code:** domain purchase, Google Business Profile
verification, the open `[CONFIRM]` answers, owner portrait, windshield and door-ding
before/after photos.

## Working conventions

- Verify before claiming done. `npm run build` must succeed. For layout changes,
  actually check the rendered page — Playwright headless at 390px and 1440px,
  asserting `document.documentElement.scrollWidth === window.innerWidth`. Horizontal
  overflow has bitten this project twice.
- The overflow cause both times: **implicit `auto` grid tracks size to max-content
  and are not clamped by their container.** There's a blanket
  `grid-template-columns:minmax(0,1fr)` guard rule near the top of each stylesheet.
  Keep it above the component rules so media queries still win.
- New page → copy the closest existing page's structure, import the stylesheet
  matching its accent, add it to the `links` array in `Nav.astro` and to
  `public/sitemap.xml`.
- Don't add dependencies without a reason that survives being questioned. The value
  of this site is that it's flat HTML on a CDN.
- Don't run `vercel` from the CLI unless you mean to — it writes `.vercel/project.json`
  linking the folder to a project, and Brendan has a separate Vercel project for BFTB.
  Deploy through the GitHub integration instead.
