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

## Owner questions — 16

### Windshield & glass — `/windshield-replacement`
The biggest cluster. Five of the six open questions on the site are on this one page.

- [ ] Mobile service radius — how far out do you go?
- [ ] Chip repair offered, or replacement only?
- [ ] ADAS recalibration — in-house, sublet, or not offered?
- [ ] Glass sourcing — OEM, OEE, aftermarket?
- [ ] Are glass claims handled directly with the carrier?

### Window tint — `/window-tint`
- [ ] Which VLT percentages do you offer?
- [ ] Which XPEL film lines? (they make several at different price points)
- [ ] Is XPEL paint protection film offered as well as tint?

### Wholesale — `/wholesale`
- [ ] R&I — in-house or sublet?
- [ ] Which estimate platforms, and what is the documentation process?
- [ ] Do you work on-site at customer lots?
- [ ] Minimum units and pickup radius
- [ ] Billing terms
- [ ] Typical turnaround, single unit
- [ ] Wholesale rate structure
- [ ] Certificate of insurance — available on request?

### Paintless dent repair — `/paintless-dent-repair`
- [ ] Aluminium panel capability
- [ ] Conventional repair — in-house or referral?

### Hail — `/hail-damage-repair`
- [ ] Conventional repair — in-house or referral? (same question, second page)

---

## Photographs still needed — 4

Each of these currently renders as an empty hatched panel. The panel holds the
layout; it no longer says "photo needed" to the visitor.

- [ ] **A real windshield job.** Wanted in three places: the `/windshield-replacement`
      hero, and the windshield service card on `/services` and `/wholesale`. This is
      the most-used gap on the site.
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
- [ ] Send one real test submission through each of the three forms and confirm it
      lands in the right inbox — still the only unproven link in the form chain

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
