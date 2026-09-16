/**
 * Promo mode: when true, the entire site behaves as fully free —
 * - The navbar hides Sign In / the user menu / the Pricing link
 * - Every <Protect plan="premium"> gate is bypassed so Premium tools work for everyone
 * - A dismissible banner announces the promo
 *
 * This does NOT delete or disable your Clerk auth/billing setup — it's still all there,
 * wired up and working. Flip this back to `false` (and redeploy) whenever you're ready
 * to re-enable sign-in and the Premium paywall. No other code changes needed.
 */
export const PROMO_MODE = true;

export const PROMO_MESSAGE = 'Everything on NovaTools is free for a limited time — no sign-in required.';
