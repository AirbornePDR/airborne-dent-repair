# Still to be answered

Every open question on the site, in one place. **This file is never deployed** —
it lives at the project root, not under `src/pages`, so it has no URL.

These used to render as orange `Confirm:` chips on the live pages. They are now
gated behind `SHOW_BUILD_NOTES` in `src/data/build-notes.ts`:

- `false` (current, production) — stripped from the build entirely
- `true` — every one of them shows in place, so you can walk the site and see them

Flip it, `npm run build`, and walk the pages. Flip it back before deploying.

Nothing here is a claim being hidden. Where an answer is missing the copy simply
does not make the claim — the rule that unverified copy does not ship has not
changed. This only stops the reminders being shown to customers.

---

## Owner questions — ALL 18 ANSWERED

Owner-confirmed 26 September 2026 and written into the pages. Every `Confirm:` chip
is gone from the source. The answers now live in CLAUDE.md under *Verified facts*,
which is where anything writing new copy should read them from.

**One clause was deliberately withheld.** On aluminum he added *"if being utilized
through the insurance carrier, the insurance is the ones to pay the difference not
the insured."* That promises what a third party will pay — it varies by policy and
carrier, the shop does not control it, and it sits a short step from "no out of
pocket", which rule 4 blocks pending his attorney. The site says aluminum costs more
and the difference is written into the estimate, which is true without promising who
absorbs it. **Needs the attorney before it goes any further.**

**Two services are deliberately unmentioned.** Chip/crack repair and PPF/vinyl are
not offered, and at the owner's direction the site does not discuss them at all
rather than explaining their absence. Practical consequences: do not bid on chip
repair or PPF search terms, and expect the occasional phone call asking, since the
site no longer heads it off. Re-add a line either place if those calls become a
nuisance.

## Photographs still needed — 4

Each of these currently renders as an empty hatched panel. The panel holds the
layout; it no longer says "photo needed" to the visitor.

- [ ] **A real windshield job.** Still the most-used gap. The hero on
      `/windshield-replacement` now carries a stand-in (a vehicle at the shop,
      captioned as the shop, claiming nothing about glass) so the page no longer
      reads as broken — swap it the day a real one is shot. Still genuinely empty:
      the windshield service card on `/`, `/services` and `/wholesale`.
- [ ] **A windshield before/after pair** — `/windshield-replacement`
- [ ] **A door ding before/after pair** — `/paintless-dent-repair`
- [ ] **Service-area map** — home page. A map graphic, not a photograph.

---

## Not blocked on the owner

- [ ] Claims page — pulled from the nav until it exists
- [ ] Rename four photos off hash filenames for image SEO:
      `img-01601d4a77.jpeg`, `img-d658fbaced.jpeg`, `img-ea3b4a7cf7.jpeg`,
      `img-f518ef14c1.jpeg` (and update every `<img src>` that points at them)
- [ ] `/wholesale` has 5 steps in a 2-column row between 700px and 1249px, which
      leaves one cell showing the grid's hairline background. Five does not divide
      by two — it needs a design decision, not a mechanical fix.
- [ ] Turn off the `WIP_BANNER` in `src/pages/index.astro` at launch
- [x] ~~Send one real test submission through each of the three forms~~ — DONE,
      all three confirmed delivering.
- [x] ~~Install the autoresponder text in the Web3Forms dashboard~~ — DONE.

---

## Decided, not open

Recorded here so they are not reopened by mistake:

- **Loaner tier** — owner-confirmed. Own AMG fleet for specialty and exotic
  vehicles, partner provider for everything else, courtesy at no charge both ways.
- **Unit designation** — owner-confirmed against his record. DD-214 question closed.
- **Partner's name** — withheld until that business agrees to be named. The copy
  says "a partner rental provider". See `WITHHELD-COPY.md` (gitignored).
- **Deductible assistance** — stays off the site entirely until his attorney or
  carrier rep signs off in writing. Not a chip; not written anywhere.
