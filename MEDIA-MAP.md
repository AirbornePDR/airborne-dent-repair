# Airborne Dent Repair — new media, and where each piece goes

Everything here is web-optimised and ready to commit. Drop `public/` straight into
the Astro project so files land at `public/img/…` and `public/video/…`, then
reference them as `/img/…` and `/video/…`.

**Checked and clear:** no license plates in any frame. Texas requires no front plate
and every shot is front or side. Nothing needed redacting.

---

## Videos

| File | Source | Length | Where it goes |
|---|---|---|---|
| `hero-shop-dusk-vertical.mp4` | video3.mov | 10s | **Home hero, right panel** |
| `fleet-pan-01.mp4` | videos1 clip A | 9.5s | **Loaner fleet section** — `[MEDIA: FLEET-VIDEO]` |
| `fleet-pan-02.mp4` | videos1 clip B | 9.7s | Alternate for the same slot, or the Wholesale page |
| `shop-dusk-wide.mp4` | video2.mov, 14–26s | 12s | Full-width band — About, or behind the final CTA |

**Why the vertical clip is the hero.** The hero is a hard vertical split — the video
panel is tall and narrow, about 40% of the viewport. Landscape footage gets cropped
brutally in that shape. `video3.mov` is natively 720×1280 portrait, so it fills that
panel with no crop at all. It's the only piece here that fits the hero geometry.

**On resolution.** The source clips are 910×510 (and 720×1280 for the vertical), which
is below 720p. That would be a problem for a full-bleed hero — but every slot they're
going into is a *panel*, not full width:

- Hero right panel at a 1440px viewport ≈ 590px wide → the 720px vertical is fine
- Fleet slot at max container ≈ 800px wide → 910px source is fine

They'll hold up to roughly a 2200px viewport before softening. Acceptable. If the
owner has the camera originals rather than these exports, they'd future-proof it — but
this is not blocking.

All four are H.264, `yuv420p`, faststart, **audio stripped**. They autoplay muted and
loop with no sound toggle needed.

### Markup pattern

```html
<video
  class="hero-video"
  src="/video/hero-shop-dusk-vertical.mp4"
  poster="/img/poster-hero-shop-dusk-vertical.jpg"
  autoplay muted loop playsinline preload="metadata"
></video>
```

`muted` and `playsinline` are both required or iOS refuses to autoplay. The `poster`
matters — it's what shows while the video loads, and on connections too slow to start it.

---

## Photos

All shot at 6000×4000 on a real camera. Two web sizes each — `-2400` for hero and
full-width use, `-1200` for cards and grid tiles. Full-resolution originals are in
`ORIGINALS-fullres/`; don't commit those, they're for future crops.

| File | What it shows | Where it goes |
|---|---|---|
| `shop-exterior-fleet-lineup-*.jpg` | Four black AMGs lined up along the building, daylight | **`SHOP-EXTERIOR`** — the best single answer to "am I at the right place?" Also strong on Contact and About |
| `fleet-g63-and-lineup-*.jpg` | G 63 leading the line, low angle | **Loaner fleet section** |
| `fleet-g63-low-angle-*.jpg` | G 63 close, wheels and stance | Fleet, or a Wholesale accent |
| `fleet-lineup-golden-hour-*.jpg` | S-Class coupe leading, warm light | **Work gallery**, or fleet |
| `shop-dusk-headlights-*.jpg` | Dusk, headlights on, moody | About page, or pairs with `shop-dusk-wide.mp4` |

Posters for each video are in `public/img/poster-*.jpg`.

---

## What these two gaps close

**`SHOP-EXTERIOR`** — was outstanding since the first shot list. Closed.
**`FLEET-STILLS` / `FLEET-VIDEO`** — closed, with real footage of the actual vehicles
at the actual building.

## What this raises

These are staged fleet photos at the shop, which strongly implies they're the loaner
vehicles. **That still needs one sentence of confirmation from the owner.** If the
G 63, GLE 63 and S-Class coupe are genuinely what a customer gets handed keys to, that
is a headline, not a footnote — no competitor in Grayson County is lending an AMG while
they fix your hail damage. The `Confirm — which vehicles are loaners vs. customer cars?`
chip on the live site stays until he says so.

> **Resolved since this was written.** The owner confirmed the fleet is tiered: the
> black AMGs are reserved for specialty and exotic vehicles in for repair, and every
> other loaner comes through a partner rental provider. The chip is gone and the
> still row is labelled as the reserved tier. See CLAUDE.md for the two questions
> that replaced it.

## Still missing after this

- `OWNER-PORTRAIT` — the About page has the story and no face. Biggest remaining gap.
- Real windshield before/after
- Door ding and crease before/after pairs
