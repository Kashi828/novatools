/** Small color-math helpers for deriving a full tint/shade ramp from one base color,
 * so a "fully custom theme" only requires the user to pick 3 colors (primary,
 * secondary, accent) rather than every single shade used across the site.
 */

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function normalizeHex(value: string): string | null {
  const normalized = value.trim().startsWith('#') ? value.trim() : `#${value.trim()}`;
  return HEX_PATTERN.test(normalized) ? normalized.toUpperCase() : null;
}

export function isValidHex(value: string): boolean {
  return normalizeHex(value) !== null;
}

function hexToHsl(hex: string) {
  const normalized = normalizeHex(hex) ?? '#C9A961';
  const clean = normalized.slice(1);
  const bigint = parseInt(clean, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToRgbString(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toByte = (v: number) => Math.round((v + m) * 255);
  return `${toByte(r)} ${toByte(g)} ${toByte(b)}`;
}

/** Given a base hex color, returns the shade ramp as "R G B" strings. */
export function derivePrimaryRamp(baseHex: string) {
  const { h, s } = hexToHsl(baseHex);
  return {
    50: hslToRgbString(h, Math.min(s, 60), 95),
    100: hslToRgbString(h, Math.min(s, 65), 88),
    400: hslToRgbString(h, s, 68),
    500: hslToRgbString(h, s, 55),
    600: hslToRgbString(h, s, 44),
    700: hslToRgbString(h, s, 35),
  };
}

export function deriveSecondaryRamp(baseHex: string) {
  const { h, s } = hexToHsl(baseHex);
  return {
    400: hslToRgbString(h, s, 62),
    500: hslToRgbString(h, s, 48),
    600: hslToRgbString(h, s, 38),
  };
}

export function deriveAccentRamp(baseHex: string) {
  const { h, s } = hexToHsl(baseHex);
  return {
    400: hslToRgbString(h, s * 0.5, 65),
    500: hslToRgbString(h, s * 0.5, 48),
  };
}
