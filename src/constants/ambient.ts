/** Full day/night loop duration (ms). */
export const DAY_CYCLE_MS = 90_000;

/** Full spring → summer → autumn → winter loop (ms). */
export const SEASON_CYCLE_MS = 360_000;

export type SeasonName = 'spring' | 'summer' | 'autumn' | 'winter';

export const SEASON_NAMES: SeasonName[] = ['spring', 'summer', 'autumn', 'winter'];

/** Sky fill behind parallax (visible at edges). */
export const SKY_PALETTE = {
  night: '#0a0e1f',
  dawn: '#3d2858',
  morning: '#5a8fbf',
  noon: '#6eb5e8',
  afternoon: '#7a9fd4',
  dusk: '#2a1f3d',
} as const;

/** Full-screen tint over the sunset artwork. */
export const TINT_PALETTE = {
  night: '#0c1440',
  dawn: '#ff9a6b',
  morning: '#ffe8b8',
  noon: '#fff8ef',
  afternoon: '#f5d6a8',
  dusk: '#c45c3a',
} as const;

/** Season accent layered on top of the time-of-day tint. */
export const SEASON_TINT: Record<SeasonName, string> = {
  spring: '#8fd4a0',
  summer: '#ffd27a',
  autumn: '#e87840',
  winter: '#a8c8e8',
};

export const SEASON_TINT_OPACITY = 0.22;

/** Sun / moon disc colors. */
export const CELESTIAL = {
  sun: '#ffe9a8',
  moon: '#d8e8ff',
  sunGlow: 'rgba(255, 220, 140, 0.35)',
  moonGlow: 'rgba(180, 200, 255, 0.25)',
} as const;

export const STAR_COUNT = 48;
