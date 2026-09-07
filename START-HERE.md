# START HERE — first terminal session

You're picking up a finished-but-incomplete site. Read `CLAUDE.md` first; it has the
brand rules and the non-negotiables. This file is just the running order.

Brendan is working with a second Claude in a separate chat that has the full design
history. That one makes design and copy calls; you handle the local mechanics, the
code, and the deploy. If you hit something that needs a design or content decision —
which photo, what a headline says, whether a claim is true — **stop and ask him
rather than deciding.** He'll take it to the other session and come back with an
answer.

---

## 1. Get it running (do this first, all of it)

```bash
node -v                 # need 18.17+. If lower or missing, stop and tell him.
npm install             # ~30s, pulls Astro
npm run build           # must succeed — 6 pages
npm run dev             # give him the localhost URL and let him look
```

If `npm run build` fails, fix it before anything else and say what was wrong.
Don't proceed past a red build.

## 2. Verify it actually renders

Not "the build passed" — look at it. Playwright is the fastest way:

```bash
npm i -D playwright && npx playwright install chromium
```

For `/` and `/wholesale`, at 390px and 1440px, assert:

- `document.documentElement.scrollWidth === window.innerWidth` (no horizontal overflow)
- exactly one `nav` and one `footer` in the body
- zero `<img>` with `naturalWidth === 0` (no broken images)

All of that passed when the project was handed over. If any of it fails now,
something went wrong in transit — say so, don't paper over it.

## 3. Git

```bash
git rev-parse --show-toplevel
```

If that prints a path that isn't this folder, the folder got nested inside another
repo (probably Built for the Badge) — tell him to move it before doing anything else.
Otherwise `git init`, commit everything, and walk him through creating a GitHub repo
and pushing.

## 4. Then stop and check in

Don't roll straight into building the remaining pages. Report:

- build status
- render verification results
- git/GitHub status
- anything you found that looks wrong

Then ask what's next.

---

## What's queued after that

Rough priority. He'll confirm the order.

1. **Contact page** — highest value of the four remaining; it's what converts phone
   calls, and it needs no new photography.
2. **Privacy policy + terms** — gating the estimate form, and unglamorous enough to
   get skipped until it blocks something.
3. **Services index** — `/services`, linking the four existing service pages.
4. **About** — blocked on the owner portrait, so it can't finish, but the layout can.
5. **Claims** — wholesale/navy track.
6. **Estimate form** — the biggest single piece. Photo upload means a backend.
   Decide between a Vercel serverless function with Resend/Postmark, or a hosted form
   service. Attachment size caps are the deciding factor; some services cap low and
   hail damage means a customer sends six photos of a roof.
7. **Rename the four hash-named photos** and update their references.

## Two things that are more urgent than any of this

Both are on the owner, not on you, but they're worth surfacing every time they come up:

- **Google Business Profile.** Postal verification runs 5 days to 3 weeks. For a shop
  in Gunter, it outranks the website for "hail damage repair near me." It doesn't
  depend on the site being finished. Every day it isn't started is a day added to the
  end.
- **The domain**, bought in the owner's name. Once it exists, update `site:` in
  `astro.config.mjs` — it drives canonical URLs and the sitemap.
