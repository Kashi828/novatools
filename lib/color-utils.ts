/** Color-math helpers for deriving a full tint/shade ramp from one exact base color,
 * so a "fully custom theme" only requires the user to pick 3 colors (primary,
 * secondary, accent) rather than every single shade used across the site.
 *
 * NOTE ON THE PREVIOUS BUG: this used to convert the picked color to HSL and then snap
 * every shade to a FIXED lightness (e.g. the "500" shade was always rendered at L=55%,
 * and the accent ramp even halved saturation). That silently discarded the color the
 * user actually chose — a pale pastel and a deep jewel tone both collapsed to the same
 * brightness, and a vivid accent came out washed-out grey. Meanwhile the logo used the
 * raw hex directly, so the logo and the rest of the site visibly disagreed.
 *
 * Fix: the base ("500"/DEFAULT) shade is now the user's EXACT color, untouched. Lighter
 * shades are true linear RGB mixes toward white, darker ones toward black. Every shade
 * stays visibly related to what was picked, and the logo always matches the UI.
 */

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function normalizeHex(value: string): string | null {
  const normalized = value.trim().startsWith('#') ? value.trim() : `#${value.trim()}`;
  return HEX_PATTERN.test(normalized) ? normalized.toUpperCase() : null;
}

export function isValidHex(value: string): boolean {
  return normalizeHex(value) !== null;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): Rgb {
  const normalized = normalizeHex(hex) ?? '#C9A961';
  const bigint = parseInt(normalized.slice(1), 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function mix(a: Rgb, b: Rgb, weight: number): Rgb {
  return {
    r: Math.round(a.r + (b.r - a.r) * weight),
    g: Math.round(a.g + (b.g - a.g) * weight),
    b: Math.round(a.b + (b.b - a.b) * weight),
  };
}

function rgbToString({ r, g, b }: Rgb): string {
  return `${r} ${g} ${b}`;
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

/** Given a base hex color, returns the shade ramp as "R G B" strings
 * (space-separated, matching what the CSS custom properties expect). */
export function derivePrimaryRamp(baseHex: string) {
  const base = hexToRgb(baseHex);
  return {
    50: rgbToString(mix(base, WHITE, 0.92)),
    100: rgbToString(mix(base, WHITE, 0.82)),
    400: rgbToString(mix(base, WHITE, 0.25)),
    500: rgbToString(base), // exact color the user picked
    600: rgbToString(mix(base, BLACK, 0.18)),
    700: rgbToString(mix(base, BLACK, 0.32)),
  };
}

export function deriveSecondaryRamp(baseHex: string) {
  const base = hexToRgb(baseHex);
  return {
    400: rgbToString(mix(base, WHITE, 0.25)),
    500: rgbToString(base), // exact color the user picked
    600: rgbToString(mix(base, BLACK, 0.22)),
  };
}

export function deriveAccentRamp(baseHex: string) {
  const base = hexToRgb(baseHex);
  return {
    400: rgbToString(mix(base, WHITE, 0.3)),
    500: rgbToString(base), // exact color the user picked
  };
}
