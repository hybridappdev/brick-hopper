/** Parses #RRGGBB or #RRGGBBAA into channel tuples. */
function parseHex(hex: string): [number, number, number, number] {
  const raw = hex.replace('#', '');
  if (raw.length === 6) {
    return [
      parseInt(raw.slice(0, 2), 16),
      parseInt(raw.slice(2, 4), 16),
      parseInt(raw.slice(4, 6), 16),
      255,
    ];
  }
  return [
    parseInt(raw.slice(0, 2), 16),
    parseInt(raw.slice(2, 4), 16),
    parseInt(raw.slice(4, 6), 16),
    parseInt(raw.slice(6, 8), 16),
  ];
}

function toHex(r: number, g: number, b: number, a = 255): string {
  const c = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, '0');
  if (a >= 255) {
    return `#${c(r)}${c(g)}${c(b)}`;
  }
  return `#${c(r)}${c(g)}${c(b)}${c(a)}`;
}

/** Linear blend between two hex colors (supports #RRGGBB). */
export function lerpColor(from: string, to: string, t: number): string {
  const a = parseHex(from);
  const b = parseHex(to);
  const mix = (i: number) => a[i] + (b[i] - a[i]) * t;
  return toHex(mix(0), mix(1), mix(2), mix(3));
}

/** Returns rgba(...) for use in React Native styles. */
export function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}
