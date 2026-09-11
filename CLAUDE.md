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
public/fonts/               Archivo variable woff2 (latin subset)
```

### Three stylesheets, imported per page — this is deliberate

The pages share class names (`.svc`, `.chip`, `.cross`) but differ in accent color:
**olive `#65713A` on retail, navy `#054385` on wholesale.** Each page imports only
its own sheet so they never collide. Don't "helpfully" merge them into one global
stylesheet — it will break the accent system.

### The font is a self-hosted variable font, never a Google Fonts link

`public/fonts/Archivo-var-latin.woff2` is the Archivo variable font, latin subset,
carrying both axes (`wdth 62–125`, `wght 100–900`). It is declared once in
`src/styles/fonts.css`, imported from `Base.astro`, and preloaded in the head.

The width is the whole point: stock Archivo at default width is ~18% narrower on the
same string and the headlines lose their character. The display type is specified with
`font-variation-settings` and `font-stretch`, and **those declarations only work
against a variable font** — they are inert against fixed static instances.

**Never link Google Fonts.** Cache partitioning killed the shared-cache argument years
ago, so a third-party font link now only buys a DNS lookup and connection before any
text renders. Self-hosting also keeps third-party requests at zero, which keeps the
privacy policy short.

Two implementation details that are easy to get wrong:

- Use `format("woff2")`. `format("woff2-variations")` is interim syntax that never
  made the spec; engines that do not recognise it skip the source silently.
- The preload **must** carry `crossorigin`, even though the file is same-origin.
  Fonts are always fetched in anonymous CORS mode; without it the preload does not
  match the real request and the file downloads twice.

This replaced three static cuts (`AirborneDisplay-{Light,Regular,Medium}.woff2`) that
existed only because Wix Studio's font picker exposed Archivo as a single family with
no width axis. Verified in-browser before the swap: the variable font at
`"wdth" 120,"wght" 250` measures 1749.64px on the H1 string against 1749.70px for the
old Regular cut — a 0.003% difference. Do not reintroduce static cuts; carrying both
is how they drift apart.

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
8. **A third party's business name does not go in copy until that party has agreed
   to be named.** The owner confirming that an arrangement exists is *not* the same
   as the other business agreeing to be listed on a website — he cannot give that
   consent on their behalf. Until they have agreed, describe the relationship
   generically ("a partner rental provider") and keep the named version in
   `WITHHELD-COPY.md`, which is gitignored. **A `[CONFIRM]` chip is not a licence
   to publish the thing being confirmed.** The chip belongs on the withheld version;
   the published page ships the generic wording. This rule was written after the
   partner's name went live with a chip attached to it, which published the name and
   flagged it at the same time — the flag does not undo the publishing.

## Verified facts (safe to use in copy)

- Veteran owned. Founder served as a U.S. Army paratrooper, 1-501st Infantry
  (Airborne), 4th IBCT (A) / 25th ID, Alaska.
- Master ARC certified technician.
- Estimates are free. Lifetime warranty on all PDR work.
- Windshield service is both mobile and in-shop.
- Tint is XPEL exclusively, with manufacturer warranty.
- Wholesale: pickup and delivery offered, ~25 vehicles/week max, turnaround quoted
  after estimate.
- **Loaners are tiered, and the tier is the point.** The shop's own black
  Mercedes-AMG fleet (S-Class coupe, GLE 63, G 63) is reserved for specialty and
  exotic vehicles in for repair. A customer bringing in a Passat does not get a
  Benz. Every other loaner is supplied through a partner rental provider, which the
  copy calls exactly that — the partner's name is withheld (see rule 8, and
  `WITHHELD-COPY.md`, which is gitignored). Owner-confirmed. Never write the fleet
  as a blanket promise to every customer.
- **Loaners are a courtesy at no charge**, both tiers, to every client doing business
  with the shop. Owner-confirmed. This is why the word *loaner* is correct sitewide;
  if that ever changes, "loaner" becomes "rental" everywhere and the page has to say
  who pays.
- Unit designation is owner-confirmed against his record: 1-501st "Geronimo"
  (Airborne), Alaska, dates as written. The DD-214 question is closed.
- Reach: HQ in Gunter, regular service across greater DFW and North Texas, plus
  catastrophe response deployed nationally to severe hail events.
- Phone 682-226-0543 · Fax 833-907-5267
- Retail email `airbornepdr@gmail.com` · Claims `Claimsairbornedentrepair@gmail.com`
- Hours Mon–Sat 9–7, closed Sunday.

**Explicitly NOT true:** the owner does not hold the title "Regional Claims Liaison."
The shop *works with* one. An earlier brief got this wrong. No copy may claim the
title for him.

The homepage step 02 previously claimed it and now reads "We document the damage, talk
to your adjuster, and manage the file so you don't have to." — true without needing
anyone to confirm anything. A sharper line is available **only** if the owner states
the exact relationship in writing: "works directly with" could mean staff, a
contractor, or a contact on the carrier side, and those read very differently.

## State of the build

**Done and verified** — 9 pages build clean, no horizontal overflow at 390, 768,
1000, 1280 or 1440px, one nav and one footer each, no broken images, every video
decoding with a poster, every internal link resolving 200, and no grid row left
half empty:

`/` · `/services` · `/wholesale` · `/about` · `/contact` · `/hail-damage-repair` ·
`/paintless-dent-repair` · `/windshield-replacement` · `/window-tint`

**Nav is five items and every one of them resolves.** `Claims` was pulled: it was
linking to a 404, and there is no approved copy to build the page from. Put it back
the moment `/claims` exists. A nav link to a 404 is worse than no link.

**`/about` is built from `about-page-copy.md`**, which sits in the project root and
is **gitignored on purpose** — this repo is public and that file carries the note
that the deductible assistance offer needs the owner's attorney before it appears
anywhere public. Two deliberate departures from that draft:
the warranty sentence is scoped to *paintless* repair, because "every repair carries
a lifetime warranty" would extend it to glass and tint, which is not the verified
fact. (The draft's second ask — check the unit against the DD-214 — is now answered,
and that chip has been removed.)

**Media, as of the shoot delivered with `MEDIA-MAP.md`:**

- **`SHOP-EXTERIOR` — closed.** `shop-exterior-fleet-lineup-*.jpg` leads the Contact
  hero.
- **`FLEET-STILLS` and `FLEET-VIDEO` — closed.** `fleet-pan-01.mp4` plus a three-up
  still row in the home fleet section; `fleet-pan-02.mp4` runs as a band on
  /wholesale. The old "which vehicles are loaners" chip is answered and gone. The
  still row now carries the eyebrow **"Our Own Fleet · Reserved For Specialty &
  Exotic Vehicles"**, so the photos cannot be read as a blanket promise. Keep that
  label if you move the photos.
- `hero-shop-dusk-vertical.mp4` is the home hero (720×1280, the only clip that fits
  that panel uncropped); `shop-dusk-wide.mp4` runs behind the home closing CTA.
- Videos are silent, autoplay+loop+`playsinline`+poster, and are paused with `loop`
  stripped under `prefers-reduced-motion` by the script in `Base.astro`.
- Photos ship at `-1200` and `-2400` and are wired as `<img srcset>`, not CSS
  backgrounds, so the browser actually picks between the two sizes.
- `ORIGINALS-fullres/` is gitignored. Full-resolution frames live there for future
  crops and must not be committed.

**The home fleet block carries no open `[CONFIRM]` and is launch-ready.** The
partner's name was pulled rather than published with a chip attached — see rule 8.
The chip lives with the withheld variant in `WITHHELD-COPY.md`, not on the page.

**Still open (photo gaps):** `OWNER-PORTRAIT` — now slotted on `/about`, which is
where it is most missed — a real windshield before/after pair, a door-ding
before/after pair, the windshield service card shot, and the service-area map slot
on the home page. Those placeholders are deliberately still visible on the site.

**Grid rows must divide.** A tiled grid (`.gallery`, `.steps`, `.others`,
`.services`) draws its 1px rules as a hairline *background* behind the tiles, so a
last row that is not full shows that background as a pale block. Column count has to
divide item count at every breakpoint. `retail.css` carries `.steps-3`, `.steps-4`
and `.others-4` modifiers for the counts the base rules do not suit. **One known
instance remains:** `/wholesale` has 5 steps in a 2-column row between 700px and
1249px. Five does not divide by two, so fixing it is a design choice — single column
on tablet, or a sixth step — not a mechanical fix.

**Not built yet:**

- Claims page
- **Photo upload on the forms.** Web3Forms Pro only. Both forms currently tell people
  to email photos instead. **Shipping this makes the privacy policy false** — the
  sentence "Neither form accepts file or photo uploads" has to change in the same
  commit, along with the form copy telling people to email them. See the tripwire
  table under *Privacy and terms*.
- **A named person who monitors the claims inbox after a storm.** Still unanswered.
  A form that delivers into an inbox nobody is watching is worse than no form.
- Four photos still have hash filenames and should be renamed descriptively for
  image SEO: `img-01601d4a77.jpeg`, `img-d658fbaced.jpeg`, `img-ea3b4a7cf7.jpeg`,
  `img-f518ef14c1.jpeg`. Update the `<img src>` that references each.

**Owner-blocked, can't be solved in code:** domain purchase, Google Business Profile
verification, the open `[CONFIRM]` answers, owner portrait, windshield and door-ding
before/after photos.

## The domain and everything that derives from it

Live on **https://airbornedentrepair.com**; `www` 308s to the apex.

`site` in `astro.config.mjs` is the **single source of truth**. It drives the
canonical tag, `og:url`, the `url` in the JSON-LD business record, and every entry
in the sitemap. Change it there and all four follow. `Base.astro` throws if it is
unset rather than quietly emitting canonicals for a placeholder host.

**The sitemap is generated, not hand-maintained.** `src/pages/sitemap.xml.ts`
enumerates the real pages via `import.meta.glob`, so adding a page to `src/pages`
puts it in the sitemap and deleting one removes it. The old hand-edited
`public/sitemap.xml` is gone, and with it the step in "new page →" that everyone
forgets. URLs carry a trailing slash to match what the canonical tags declare.

**Page titles must use real characters, never HTML entities.** The `title` prop is
a string, so `&mdash;` in it renders as the literal text "&mdash;" in the browser
tab and in search results — every page but the home page shipped that way until the
domain went live, and `/wholesale` also carried an uninterpreted `—`. Write
"—" and "&" directly; Astro escapes them correctly on the way out.

## Calls to action

The four service pages are the pattern: **`btn-solid` goes to a form, `btn-ghost`
goes to `tel:`.** Nothing else is a button.

- **A button never opens a mail client.** A plain address in a contact block or in
  prose is fine; a button that launches Mail is not a call to action, it is an exit.
  The estimate form is the intended path and email is the fallback behind it.
- **An in-page anchor CTA must land on a section that actually contains a form.**
  The home page shipped a hero button pointing at `#contact`, which was a closing
  band with a phone number and no form in it, and a closing button that was a
  `mailto:`. Both bypassed the estimate form completely, on the page that gets the
  most traffic. Only `/wholesale` legitimately uses an anchor (`#account`), because
  that section holds its form.
- Every page except `/privacy` and `/terms` must offer at least one route to a
  form. Those two are reference documents reached from the footer.
- Phone links use the `tel:+1682...` E.164 form everywhere.

`npm run verify:site` asserts the first three. They were checked by reintroducing
each bug into the built output and confirming the suite went red — an assertion
that has never failed is decoration.

## The two forms

Retail estimate on `/contact` → `airbornepdr@gmail.com`. Wholesale & claims on
`/wholesale` → `Claimsairbornedentrepair@gmail.com`. Both post to **Web3Forms**
from the browser, so **the site is still fully static** — no adapter, no SSR, no
serverless function. Keep it that way.

- Access keys live in `src/data/web3forms.ts`. They are **public by design** — they
  ship in the HTML and name the destination inbox. Nothing is leaked by committing
  them; do not "secure" them into env vars expecting privacy.
- **A placeholder key renders a visible "not connected" notice instead of a submit
  button**, with the phone and email offered instead. A dead form cannot ship
  quietly. **Both keys are now live**, so neither form shows that notice; the
  mechanism stays for whatever form comes next.
- Success requires **HTTP 200 *and* `success: true`** in the body. A 200 carrying
  `success:false` is a failure and is rendered as one. Never relax that.
- Every failure path shows the phone number and the right inbox, so a lead is not
  lost to a network blip.
- Free tier: honeypot (`botcheck`) and hCaptcha are included, **file upload is Pro**.
  Neither form takes photos yet; both say so and point at email.
- hCaptcha only blocks submission if the widget actually rendered. If the script is
  blocked, the submit goes through rather than stranding the person.
- `npm run verify:forms` drives both forms in Chromium and WebKit: labels,
  `aria-describedby`, fieldset legends, honeypot, validation, the happy path, a
  200-with-`success:false`, an HTTP 500, and a dead network. Run it after touching
  anything in the form path.

**Third-party requests are no longer zero on these two pages.** `/contact` and
`/wholesale` load Web3Forms' client script and hCaptcha; every other page still
loads nothing external. The privacy policy says so, and it has to stay true.

**Do not put deductible copy on these forms** — no "we help with your deductible",
no "no out of pocket". Still blocked pending the owner's attorney (rule 4).

## Privacy and terms

`/privacy` and `/terms` exist because the forms collect names and phone numbers.
Linked from the footer on every page and from under each submit button.

**They are a careful template, not legal review.** They were written to be accurate
to what the site actually does — the two forms' exact fields, Web3Forms and Gmail as
the route, hCaptcha, Vercel logs, no analytics, no selling or sharing, and how to ask
for deletion. Nobody has had them reviewed by an attorney. If the owner wants that,
this is the draft to hand over. Keep them true: **if the forms change what they
collect, or a new third party is added, these pages change in the same commit.**

**Named tripwires.** These are sentences that are true today and become lies the
moment a specific feature ships. Each one changes in the same commit as the change
that breaks it, not in a follow-up:

| Page | Sentence | Broken by |
|---|---|---|
| `/privacy` | "Neither form accepts file or photo uploads." | **Shipping photo upload.** |
| `/privacy` | "We have not added Google Analytics or any other tracking or advertising service." | Adding any analytics, including Vercel Analytics, which is off by default but one toggle away. |
| `/privacy` | The two lists of exact form fields. | Adding, renaming or removing any field on either form. |
| `/terms` | "Photographs of repairs on this site are of work carried out." | Publishing a repair photo that is not this shop's job. Rule 2 already forbids that. |

The first one is the live risk: photo upload is the next thing anyone will build on
these forms, both forms currently advertise that they do not take attachments, and
the privacy policy states it as fact.

## The before/after sliders

Five of them: two on `/`, one each on `/hail-damage-repair`, `/window-tint` and
`/wholesale`. Marked `[data-ba]`, wired in `Base.astro`.

**The `<input type="range">` is for keyboard and screen readers only. It does not
handle pointer input.** A range input is dragged by its thumb, and on iOS Safari a
touch that misses the thumb does nothing at all — no jump to the tap, no drag. The
thumb here is invisible and 56px wide inside an image about 350px across on a phone,
so nearly every touch missed it. Desktop hid the problem because a mouse click on the
track *is* turned into a jump. That asymmetry is the bug: "works on web, dead on
mobile."

So the container owns pointer input and writes the value back into the range. One
path for mouse, touch and pen. Things worth not undoing:

- `.ba` keeps `touch-action:pan-y`. Not `none` — a vertical swipe starting on the
  photo still has to scroll the page.
- Touch waits for ~4px of sideways movement before grabbing the handle, so scrolling
  past a slider does not yank it. A mouse moves immediately, since nothing competes.
- `.ba-pointer .ba-range{pointer-events:none}` is what stops the input swallowing the
  touch. The class is added by the script, so if `PointerEvent` is missing the native
  range is still in charge.
- Keyboard still works through the range, and the focus ring is drawn on `.ba` via
  `:has()` because the input itself is `opacity:0`.

**This was fixed without a reproduction.** It does not reproduce in Chromium or in
Playwright's WebKit, with touch emulation, at any width — both engines pass a tap and
a drag against the old code. The fix removes the dependency on native range touch
behaviour rather than patching an observed failure, so **if it still misbehaves on a
real iPhone, the diagnosis above is wrong and the next person should not assume it is
right.** Test on the device.

## Working conventions

- **Choose fixtures to break the code, not to confirm it.** The email validator
  shipped with a regex whose "not whitespace, not at-sign" character class had lost
  its backslash — it had been written `[^\s@]` and became `[^s@]`, which is "not the
  letter s, not an at-sign". It silently rejected every address whose local part
  started with "s". Two forms ran the same validator; the one seeded with `jane@`
  passed and the one seeded with `sam@` failed. Nothing about that was designed —
  had both fixtures been `jane@`, the bug would have shipped with a green suite.
  Pick inputs that probe the boundary the code actually draws: the character class,
  the empty string, the duplicate key, the value that snaps to the step. A fixture
  that only demonstrates the happy path is decoration.
- **Escapes do not survive being written through a generator script.** Both times a
  backslash has gone missing in this project, it was because the edit was applied by
  a throwaway Node script that built the replacement in a template literal. Edit
  files containing regexes or escapes directly, and grep the result afterwards to
  confirm the backslash is still there.
- Verify before claiming done. `npm run build` must succeed. For layout changes,
  actually check the rendered page — Playwright headless at 390px and 1440px,
  asserting `document.documentElement.scrollWidth === window.innerWidth`. Horizontal
  overflow has bitten this project twice.
- The overflow cause, three times now: **implicit `auto` grid tracks size to
  max-content and are not clamped by their container.** There's a blanket
  `grid-template-columns:minmax(0,1fr)` guard rule near the top of each stylesheet.
  Keep it above the component rules so media queries still win. The third instance
  was `.intro` missing from that list in `retail.css`, which pushed `/about` to
  455px wide at a 390px viewport. **When you add a multi-column grid, add it to the
  guard list in the same edit.**
- Careful with `aspect-ratio` on a grid item: once its height is clamped by a
  `max-height`, it stops stretching and resolves its **width** back from that
  height. That silently shrank the home gallery's lead tile and left an empty cell.
  Cap width, not height.
- New page → copy the closest existing page's structure, import the stylesheet
  matching its accent, add it to the `links` array in `Nav.astro` and to
  `public/sitemap.xml`.
- Don't add dependencies without a reason that survives being questioned. The value
  of this site is that it's flat HTML on a CDN.
- Don't run `vercel` from the CLI unless you mean to — it writes `.vercel/project.json`
  linking the folder to a project, and Brendan has a separate Vercel project for BFTB.
  Deploy through the GitHub integration instead.
