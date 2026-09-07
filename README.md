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
  pages/                   one .astro file per URL
    index.astro                    /
    wholesale.astro                /wholesale
    hail-damage-repair.astro       /hail-damage-repair
    paintless-dent-repair.astro    /paintless-dent-repair
    windshield-replacement.astro   /windshield-replacement
    window-tint.astro              /window-tint
  styles/
    home.css        home page only
    retail.css      the four service pages (olive accent)
    wholesale.css   wholesale page (navy accent)
public/
  img/       all photos
  fonts/     Airborne Display (custom Archivo instances)
  robots.txt
  sitemap.xml
```

### Why three stylesheets instead of one

The pages share class names (`.svc`, `.chip`, `.cross`) but the accent color
differs — olive on retail, navy on wholesale. Each page imports only its own
sheet, so they never collide. If you add a page, import the sheet that matches
its accent.

### The fonts

`AirborneDisplay-{Light,Regular,Medium}.woff2` are static instances cut from the
Archivo variable font at `wdth 118–120 / wght 200–300`. That width is what makes
the headlines read the way they do — stock Archivo is ~18% narrower on the same
string. Don't swap them for a Google Fonts link.

---

## Deploy to Vercel

**One time:**

1. Create a GitHub repo (private is fine) and push this folder.
2. vercel.com → Add New → Project → import the repo.
3. Vercel auto-detects Astro. Framework: Astro. Build: `npm run build`. Output: `dist`.
   Leave all of it as detected.
4. Deploy. You get a `*.vercel.app` URL in about 40 seconds.

**After that:** every `git push` to `main` redeploys automatically. Pushes to any
other branch get their own preview URL — use one when you want the owner to look
at something before it goes live.

### Custom domain

Buy the domain in the **owner's name**, on his card. Then in Vercel:
Project → Settings → Domains → add it, and point the registrar's nameservers or
A/CNAME records where Vercel tells you. Propagation is usually under an hour.

Then update `site:` in `astro.config.mjs` to the real domain — it drives the
canonical tags and the sitemap. Rebuild and push.

---

## Before launch

**Code side**

- [ ] Four pages still to build: Services index, Claims, About, Contact
- [ ] Estimate form (see below)
- [ ] Privacy policy + terms pages — required before any form collects data
- [ ] Rename the four leftover photos: `img-01601d4a77.jpeg`, `img-d658fbaced.jpeg`,
      `img-ea3b4a7cf7.jpeg`, `img-f518ef14c1.jpeg` (update the `<img src>` that
      references each; they're descriptive filenames for SEO, not cosmetics)
- [ ] Replace every `[CONFIRM]` in the copy with the owner's actual answer

**Owner side — start the first one today, it's the long pole**

- [ ] **Google Business Profile.** Postal verification takes 5 days to 3 weeks.
      Nothing else on this list gates launch that long. For a shop that lives on
      local search, this matters more than the site does.
- [ ] Domain purchase, in his name
- [ ] The 8 open confirm answers
- [ ] Owner portrait
- [ ] Windshield and door-ding before/after photos (two service pages have
      placeholder-quality galleries until these land)

---

## The estimate form

Not built yet. When it is:

- Retail submissions → `airbornepdr@gmail.com`
- Wholesale and claims → `Claimsairbornedentrepair@gmail.com`
- Needs photo upload, so it needs a backend. Options: a Vercel serverless
  function writing to Resend/Postmark, or a form service (Formspree, Basin) if
  you'd rather not maintain one. Photo upload is the deciding factor — some
  form services cap attachment size low.
- Spam protection required. Honeypot field plus a rate limit is enough at this
  volume; skip reCAPTCHA unless spam actually shows up.
- Privacy policy and terms have to exist before it goes live.

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
