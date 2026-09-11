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
