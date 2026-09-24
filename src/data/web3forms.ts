// Web3Forms access keys. Account: airbornepdr@gmail.com
//
// These are PUBLIC by design. They ship in the page HTML, they identify which
// inbox a submission is delivered to, and they are not secrets — there is
// nothing to leak by committing them. Do not move them to an env var expecting
// privacy; the only thing that buys is making them harder to find.
//
// Free tier: honeypot and hCaptcha are included. File upload is Pro, so neither
// form accepts photos yet.
//
// Until a real key is pasted in below, the form renders a visible "not connected"
// notice instead of a submit button, so a dead form cannot ship quietly.

export const RETAIL_ACCESS_KEY = 'a25430ac-44ba-4f98-bf03-5f500b9c0dd2';
// ^ delivers to airbornepdr@gmail.com — retail estimate form on /contact

export const CLAIMS_ACCESS_KEY = 'bcbe0c27-0ca8-439f-9d8d-a22ecf2d3675';
// ^ delivers to Claimsairbornedentrepair@gmail.com — wholesale & claims form on /wholesale

/** A key is live once it is no longer the placeholder. */
export const isConfigured = (key: string): boolean =>
  !!key && !key.startsWith('PASTE_') && key.length > 20;

/**
 * Flip to true the day the Web3Forms account is on Pro, then rebuild.
 *
 * Two things are gated on it, both verified Pro-only in the Web3Forms docs
 * ("Heads Up! This is a PRO feature"):
 *
 *  1. FILE ATTACHMENTS. /check-in shows a photo upload field when this is true
 *     and a "email your photographs instead" note when it is false. It must not
 *     ship a file input on the free plan — the upload is rejected server-side and
 *     the customer's photos vanish with no warning, which is worse than not
 *     offering it. Free-plan limit once enabled: ONE file, 5MB, sent as
 *     multipart/form-data rather than JSON.
 *
 *  2. THE AUTORESPONDER. It is configured in the Web3Forms dashboard, not here,
 *     so flipping this flag does not create it. See CLAUDE.md for the exact text
 *     that has to be pasted into the autoresponder settings.
 *
 * Flipping this also falsifies a sentence in the privacy policy — see the
 * tripwire table in CLAUDE.md. Change that page in the same commit.
 */
export const PRO_PLAN = true;
