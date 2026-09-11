# Airborne Dent Repair — website

Static site. Astro + plain CSS, no framework, no database. Builds to flat HTML
that Vercel serves from its CDN.

Client: Airborne Dent Repair, 489 Reed Ln Unit 2, Gunter TX 75058.
Owner holds the accounts. Brendan builds and maintains.

---

## Run it locally

Requires Node 18.17+ (`node -v` to check; install from nodejs.org if missing).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the built dist/ locally
```

Open the folder in VS Code. Recommended extension: **Astro** (astro-build.astro-vscode)
— gives syntax highlighting and IntelliSense in `.astro` files.

---

## What's in here

```
src/
  layouts/Base.astro       shell: <head>, JSON-LD schema, nav, footer, page scripts
  components/Nav.astro     top nav — edit the links array here, one place
  components/Footer.astro  contact block, hours, address
  data/web3forms.ts        the two form access keys (public by design)
  pages/                   one .astro file per URL
    index.astro                    /
    services.astro                 /services
    wholesale.astro                /wholesale
    about.astro                    /about
    contact.astro                  /contact        ← retail estimate form
    hail-damage-repair.astro       /hail-damage-repair
    paintless-dent-repair.astro    /paintless-dent-repair
    windshield-replacement.astro   /windshield-replacement
    window-tint.astro              /window-tint
    privacy.astro                  /privacy
    terms.astro                    /terms
    sitemap.xml.ts                 /sitemap.xml    ← generated, not hand-edited
  styles/
    home.css        home page only
    retail.css      service, contact, about and legal pages (olive accent)
    wholesale.css   wholesale page (navy accent)
public/
  img/       all photos
  video/     the four shop and fleet clips
  fonts/     Archivo-var-latin.woff2 (variable font, both axes)
  robots.txt
scripts/
  verify-forms.mjs         npm run verify:forms — drives both forms end to end
```

### Why three stylesheets instead of one

The pages share class names (`.svc`, `.chip`, `.cross`) but the accent color
differs — olive on retail, navy on wholesale. Each page imports only its own
sheet, so they never collide. If you add a page, import the sheet that matches
its accent.

### The font

`public/fonts/Archivo-var-latin.woff2` is the Archivo variable font, latin subset,
carrying both axes (`wdth 62–125`, `wght 100–900`). Declared once in
`src/styles/fonts.css`, preloaded in the head. That width is what makes the
headlines read the way they do — stock Archivo is ~18% narrower on the same
string, and `font-variation-settings` only works against a variable font.

Don't swap it for a Google Fonts link, and don't reintroduce the three static cuts
it replaced. See CLAUDE.md for the two implementation details that are easy to get
wrong (`format("woff2")`, and `crossorigin` on the preload).

---

## Deploy to Vercel

**One time:**

1. Create a GitHub repo (private is fine) and push this folder.
2. vercel.com → Add New → Project → import the repo.
3. Vercel auto-detects Astro. Framework: Astro. Build: `npm run build`. Output: `dist`.
   Leave all of it as detected.
4. Deploy. Production is https://airbornedentrepair.com; branch pushes get their own preview URL.

**After that:** every `git push` to `main` redeploys automatically. Pushes to any
other branch get their own preview URL — use one when you want the owner to look
at something before it goes live.

### Custom domain — done

Live on **https://airbornedentrepair.com**, with `www` returning a 308 to the apex.

`site:` in `astro.config.mjs` is the single source of truth for the domain. It
drives the canonical tag, `og:url`, the `url` in the JSON-LD business record, and
every entry in the generated sitemap. Change it in one place and all of them
follow. The build throws if it is ever unset, rather than quietly emitting
canonicals for a placeholder host.

---

## Before launch

**Code side**

- [x] Services, About and Contact pages — built
- [x] Estimate form and wholesale/claims form — built (see below)
- [x] Privacy policy + terms pages — built and linked from the footer
- [x] Domain live on airbornedentrepair.com
- [ ] Claims page — still to build, and pulled from the nav until it exists
- [ ] Paste the wholesale/claims Web3Forms key into `src/data/web3forms.ts`;
      that form shows a "not connected" notice until it lands
- [ ] Rename the four leftover photos: `img-01601d4a77.jpeg`, `img-d658fbaced.jpeg`,
      `img-ea3b4a7cf7.jpeg`, `img-f518ef14c1.jpeg` (update the `<img src>` that
      references each; they're descriptive filenames for SEO, not cosmetics)
- [ ] Replace every `[CONFIRM]` in the copy with the owner's actual answer

**Owner side — start the first one today, it's the long pole**

- [ ] **Google Business Profile.** Postal verification takes 5 days to 3 weeks.
      Nothing else on this list gates launch that long. For a shop that lives on
      local search, this matters more than the site does.
- [ ] The remaining confirm answers
- [ ] Whether the loaner partner may be named on the public site
- [ ] A named person who watches the claims inbox after a storm — a form
      delivering into an inbox nobody reads is worse than no form
- [ ] Owner portrait
- [ ] Windshield and door-ding before/after photos (two service pages have
      placeholder-quality galleries until these land)

---

## The two forms

Built, on **Web3Forms** (account under `airbornepdr@gmail.com`), posting from the
browser — so the site is still fully static. No adapter, no SSR, no serverless
function. Keep it that way.

- Retail estimate on `/contact` → `airbornepdr@gmail.com`
- Wholesale and claims on `/wholesale` → `Claimsairbornedentrepair@gmail.com`
- Keys live in `src/data/web3forms.ts` and are **public by design** — they ship in
  the HTML and name the destination inbox. A placeholder key renders a visible
  "not connected" notice instead of a submit button, so a dead form can't ship
  quietly.
- Spam: the `botcheck` honeypot plus hCaptcha, both free tier.
- **No photo upload** — that is Web3Forms Pro. Both forms say so and point at
  email. Shipping it falsifies a sentence in the privacy policy; see the tripwire
  table in CLAUDE.md before you build it.
- `npm run verify:forms` drives both forms in Chromium and WebKit: markup,
  accessibility, validation, the happy path, and every failure mode. Run it after
  touching anything in the form path.

---

## Content rules that don't change

These came from the client brief and hold for anything added later.

1. **`[CONFIRM]` tags are deliberate.** They mark claims nobody has verified yet.
   Never fill one with a plausible guess — get the owner's answer or cut the line.
2. **No AI-generated or stock photography, ever.** Every image is a real job from
   his shop. No composites either.
3. **Redact before publishing.** License plates, VINs, work orders, customer
   names. Two files are already marked `-REDACTED` — that's the convention.
4. **The deductible assistance offer stays off the site** until his attorney or
   carrier rep signs off in writing.
5. **Headlines are white.** Olive is an accent — it never touches a headline.
6. This project stays entirely separate from Built for the Badge.

---

## Ownership

The site is built for the owner and belongs to him. Domain in his name, hosting
under his account, Brendan added as a collaborator. Worth putting in writing
before launch so there's no ambiguity later about who controls what.
