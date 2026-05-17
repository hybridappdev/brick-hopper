import type { SeasonName } from './ambient';
import type { WeatherName } from './weather';

/** Used when dynamic cycles are off and a field is set to Auto. */
export const STATIC_AMBIENCE_DEFAULTS = {
  season: 'summer' as SeasonName,
  timeOfDay: 'day' as const,
  weather: 'clear' as WeatherName,
};

export type TimeOfDayPreference = 'auto' | 'dawn' | 'day' | 'dusk' | 'night';

/** Maps a fixed time-of-day choice to a point on the day/night loop (0–1). */
export const TIME_OF_DAY_PHASE: Record<Exclude<TimeOfDayPreference, 'auto'>, number> = {
  dawn: 0.22,
  day: 0.5,
  dusk: 0.82,
  night: 0.05,
};

export type SeasonPreference = 'auto' | SeasonName;
export type WeatherPreference = 'auto' | WeatherName;
export type AmbientCycleSpeed = 'slow' | 'normal' | 'fast';

export interface AmbienceSettings {
  /** When on, Auto fields cycle over time; when off, Auto uses static defaults. */
  dynamicCycles: boolean;
  season: SeasonPreference;
  timeOfDay: TimeOfDayPreference;
  weather: WeatherPreference;
  cycleSpeed: AmbientCycleSpeed;
  /** Fast-forward sky on menu screens (only when dynamic cycles are on). */
  fastMenuPreview: boolean;
}

export const DEFAULT_AMBIENCE: AmbienceSettings = {
  dynamicCycles: true,
  season: 'auto',
  timeOfDay: 'auto',
  weather: 'auto',
  cycleSpeed: 'normal',
  fastMenuPreview: true,
};

export const CYCLE_SPEED_MULTIPLIER: Record<AmbientCycleSpeed, number> = {
  slow: 0.45,
  normal: 1,
  fast: 2.5,
};

export function getCycleSpeedMultiplier(speed: AmbientCycleSpeed): number {
  return CYCLE_SPEED_MULTIPLIER[speed];
}
