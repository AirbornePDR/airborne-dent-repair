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

## Owner questions — 18 distinct

Grouped the way the conversation would go, not the way the site is ordered. Two
questions appear in two places each; answer once and both get filled.

### Windshield & glass — 5
Your highest-value service and the one with no photograph anywhere on the site.

1. **Mobile service radius.** How far out do you actually drive? A number here
   turns "mobile or in-shop" into something a customer in Sherman can act on.
2. **Chip repair — offered, or replacement only?** People search for chip repair
   specifically. If you do it, it is a page of its own.
3. **ADAS recalibration — in-house, sublet, or not offered?** Any car from roughly
   2018 on needs the camera recalibrated after a windshield. Dealers and carriers
   will ask, and "we don't know" loses the account.
4. **Glass sourcing — OEM, OEE, or aftermarket?** Second question every informed
   customer asks after price.
5. **Are glass claims handled directly with the carrier?** Most glass work is a
   zero-or-low-deductible claim. If you bill the carrier directly, that is a
   selling point and it is currently unsaid.

### Wholesale & fleet — 8
Twelve of the 27 markers were on this page. These are what a dealer asks before
opening an account.

6. **R&I — in-house or sublet?** Whether you remove and refit trim and panels.
7. **Estimate platforms and documentation process.** CCC, Mitchell, Audatex? A body
   shop needs to know before sending the first car.
8. **On-site work at customer lots** — will you work at their place, or does
   everything come to Reed Lane?
9. **Minimum units and pickup radius.** Pickup and delivery is already advertised;
   the terms of it are blank.
10. **Billing terms.** Net 30? On completion? An account cannot open without this.
11. **Typical turnaround, single unit.**
12. **Wholesale rate structure.** Matrix, flat, per panel?
13. **Certificate of insurance — available on request?** Most dealer groups require
    one before a vendor touches a car. A yes/no.

### Window tint — 3
14. **Which VLT percentages do you offer?** Texas regulates front sides; the page
    says so and then cannot say what you actually stock.
15. **Which XPEL film lines?** They make several at different price points.
16. **Is XPEL paint protection film offered as well as tint?** If yes, that is a
    service with no page at all right now.

### Paintless & hail — 2
17. **Aluminium panel capability.** Aluminium is a different skill and a different
    price. F-150s and a lot of German metal are aluminium.
18. **Conventional repair — in-house or referral?** *(asked on two pages)* When a
    panel is too far gone for paintless, what happens? "We refer you to someone we
    trust" is a perfectly good answer — silence is not.

### Quick wins
Several are one word. **13** (COI), **2** (chip repair), **16** (PPF), **3** (ADAS)
and **18** (referral) are yes/no or a single sentence. **10**, **11** and **12** are
the ones that need him to actually decide something.

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
