import {
  DAY_CYCLE_MS,
  SEASON_CYCLE_MS,
  SEASON_NAMES,
  SEASON_TINT,
  SEASON_TINT_OPACITY,
  SKY_PALETTE,
  TINT_PALETTE,
  type SeasonName,
} from '../constants/ambient';
import { lerpColor } from './color';

export interface AmbientSnapshot {
  /** 0–1 position in the day/night loop. */
  timeOfDay: number;
  /** 0–1 position in the seasonal loop. */
  seasonPhase: number;
  season: SeasonName;
  /** 0 = full night, 1 = full daylight. */
  daylight: number;
  /** 0–1 star field visibility. */
  starOpacity: number;
  skyColor: string;
  tintColor: string;
  tintOpacity: number;
  vignetteColor: string;
  /** 0–1 sun disc visibility. */
  sunOpacity: number;
  /** 0–1 moon disc visibility. */
  moonOpacity: number;
  /** Sun horizontal position 0–1 across the sky band. */
  celestialX: number;
  /** Moon horizontal position 0–1 (offset from sun). */
  moonX: number;
  /** Vertical offset factor for celestial arc (0–1). */
  celestialY: number;
}

interface TimeKeyframe {
  at: number;
  sky: string;
  tint: string;
  tintOpacity: number;
  daylight: number;
  stars: number;
}

function blendVignette(daylight: number): string {
  const nightWeight = 1 - daylight;
  const alpha = 0.35 + nightWeight * 0.22;
  const r = Math.round(15 + nightWeight * (5 - 15));
  const g = Math.round(26 + nightWeight * (8 - 26));
  const b = Math.round(51 + nightWeight * (24 - 51));
  return `rgba(${r},${g},${b},${alpha})`;
}

const TIME_KEYFRAMES: TimeKeyframe[] = [
  { at: 0, sky: SKY_PALETTE.night, tint: TINT_PALETTE.night, tintOpacity: 0.72, daylight: 0, stars: 1 },
  { at: 0.18, sky: SKY_PALETTE.dawn, tint: TINT_PALETTE.dawn, tintOpacity: 0.45, daylight: 0.35, stars: 0.5 },
  { at: 0.32, sky: SKY_PALETTE.morning, tint: TINT_PALETTE.morning, tintOpacity: 0.28, daylight: 0.75, stars: 0.1 },
  { at: 0.5, sky: SKY_PALETTE.noon, tint: TINT_PALETTE.noon, tintOpacity: 0.12, daylight: 1, stars: 0 },
  { at: 0.68, sky: SKY_PALETTE.afternoon, tint: TINT_PALETTE.afternoon, tintOpacity: 0.2, daylight: 0.85, stars: 0 },
  { at: 0.82, sky: SKY_PALETTE.dusk, tint: TINT_PALETTE.dusk, tintOpacity: 0.38, daylight: 0.45, stars: 0.15 },
  { at: 0.94, sky: SKY_PALETTE.night, tint: TINT_PALETTE.night, tintOpacity: 0.68, daylight: 0.05, stars: 0.95 },
  { at: 1, sky: SKY_PALETTE.night, tint: TINT_PALETTE.night, tintOpacity: 0.72, daylight: 0, stars: 1 },
];

interface TimeSample {
  timeOfDay: number;
  skyColor: string;
  tintColor: string;
  tintOpacity: number;
  daylight: number;
  starOpacity: number;
  vignetteColor: string;
}

function sampleKeyframes(phase: number, keyframes: TimeKeyframe[]): TimeSample {
  const p = ((phase % 1) + 1) % 1;
  let i = 0;
  while (i < keyframes.length - 1 && keyframes[i + 1].at <= p) {
    i += 1;
  }
  const a = keyframes[i];
  const b = keyframes[Math.min(i + 1, keyframes.length - 1)];
  const span = b.at - a.at || 1;
  const t = (p - a.at) / span;

  return {
    timeOfDay: p,
    skyColor: lerpColor(a.sky, b.sky, t),
    tintColor: lerpColor(a.tint, b.tint, t),
    tintOpacity: a.tintOpacity + (b.tintOpacity - a.tintOpacity) * t,
    daylight: a.daylight + (b.daylight - a.daylight) * t,
    starOpacity: a.stars + (b.stars - a.stars) * t,
    vignetteColor: blendVignette(a.daylight + (b.daylight - a.daylight) * t),
  };
}

function seasonAt(phase: number): { season: SeasonName; localT: number } {
  const p = ((phase % 1) + 1) % 1;
  const index = Math.min(SEASON_NAMES.length - 1, Math.floor(p * SEASON_NAMES.length));
  const localT = p * SEASON_NAMES.length - index;
  return { season: SEASON_NAMES[index], localT };
}

function blendSeasonTint(baseTint: string, baseOpacity: number, season: SeasonName, localT: number): {
  tintColor: string;
  tintOpacity: number;
} {
  const nextIndex = (SEASON_NAMES.indexOf(season) + 1) % SEASON_NAMES.length;
  const nextSeason = SEASON_NAMES[nextIndex];
  const seasonColor = lerpColor(SEASON_TINT[season], SEASON_TINT[nextSeason], localT);
  return {
    tintColor: lerpColor(baseTint, seasonColor, SEASON_TINT_OPACITY),
    tintOpacity: Math.min(0.85, baseOpacity + SEASON_TINT_OPACITY * 0.35),
  };
}

/** Builds the current sky mood from a monotonic ambient clock (ms). */
export function computeAmbient(ambientClockMs: number): AmbientSnapshot {
  const timePhase = (ambientClockMs % DAY_CYCLE_MS) / DAY_CYCLE_MS;
  const seasonPhase = (ambientClockMs % SEASON_CYCLE_MS) / SEASON_CYCLE_MS;

  const timeSample = sampleKeyframes(timePhase, TIME_KEYFRAMES);
  const { season, localT } = seasonAt(seasonPhase);
  const seasonBlend = blendSeasonTint(
    timeSample.tintColor,
    timeSample.tintOpacity,
    season,
    localT,
  );

  const sunHeight = Math.sin(timePhase * Math.PI);
  const sunOpacity = Math.max(0, Math.min(1, sunHeight * 1.4)) * timeSample.daylight;
  const moonOpacity = Math.max(0, 1 - timeSample.daylight * 1.2) * timeSample.starOpacity;

  return {
    ...timeSample,
    seasonPhase,
    season,
    tintColor: seasonBlend.tintColor,
    tintOpacity: seasonBlend.tintOpacity,
    sunOpacity,
    moonOpacity,
    celestialX: timePhase,
    moonX: (timePhase + 0.52) % 1,
    celestialY: 0.12 + sunHeight * 0.22,
  };
}
