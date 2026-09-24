/**
 * Build notes — the `Confirm:` chips and `Photo needed` captions.
 *
 * These are messages to Brendan and the owner, not to customers. They used to
 * render on the live site, which meant a visitor looking for hail repair read
 * "Confirm: ADAS recalibration — in-house, sublet, or not offered" and saw a shop
 * that had not finished its own website.
 *
 *   false  → production. Notes are stripped from the build entirely; the
 *            surrounding copy still reads correctly without them.
 *   true   → working build. Every open question shows on the page, in place, so
 *            you can walk the site and see exactly what is still unanswered.
 *
 * The full list lives in PENDING.md at the project root, which is committed but
 * never deployed — it is not under src/pages, so it has no URL.
 *
 * Nothing here hides a claim. A blocked claim is CUT, not concealed: the rule is
 * still that unverified copy does not ship. This only controls whether the
 * reminder about it is visible to the public.
 */
export const SHOW_BUILD_NOTES = false;
