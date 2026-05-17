import {
  DAY_CYCLE_MS,
  SEASON_CYCLE_MS,
  SEASON_NAMES,
  type SeasonName,
} from '../constants/ambient';
import {
  DEFAULT_AMBIENCE,
  STATIC_AMBIENCE_DEFAULTS,
  TIME_OF_DAY_PHASE,
  type AmbienceSettings,
  type TimeOfDayPreference,
} from '../constants/ambienceDefaults';
import type { WeatherName } from '../constants/weather';
import { computeWeather, getWeatherIntensities, type WeatherIntensities } from './weather';

function seasonAt(phase: number): { season: SeasonName; localT: number } {
  const p = ((phase % 1) + 1) % 1;
  const index = Math.min(SEASON_NAMES.length - 1, Math.floor(p * SEASON_NAMES.length));
  const localT = p * SEASON_NAMES.length - index;
  return { season: SEASON_NAMES[index], localT };
}

export function resolveSeason(
  ambientClockMs: number,
  ambience: AmbienceSettings,
): { season: SeasonName; localT: number; seasonPhase: number } {
  if (ambience.season !== 'auto') {
    return { season: ambience.season, localT: 0, seasonPhase: 0 };
  }
  if (!ambience.dynamicCycles) {
    return {
      season: STATIC_AMBIENCE_DEFAULTS.season,
      localT: 0,
      seasonPhase: 0,
    };
  }
  const seasonPhase = (ambientClockMs % SEASON_CYCLE_MS) / SEASON_CYCLE_MS;
  const { season, localT } = seasonAt(seasonPhase);
  return { season, localT, seasonPhase };
}

export function resolveTimePhase(ambientClockMs: number, ambience: AmbienceSettings): number {
  if (ambience.timeOfDay !== 'auto') {
    return TIME_OF_DAY_PHASE[ambience.timeOfDay];
  }
  if (!ambience.dynamicCycles) {
    return TIME_OF_DAY_PHASE[STATIC_AMBIENCE_DEFAULTS.timeOfDay];
  }
  return (ambientClockMs % DAY_CYCLE_MS) / DAY_CYCLE_MS;
}

export function resolveWeather(
  ambientClockMs: number,
  season: SeasonName,
  ambience: AmbienceSettings,
): {
  weather: WeatherName;
  weatherPhase: number;
  intensities: WeatherIntensities;
} {
  if (ambience.weather !== 'auto') {
    return {
      weather: ambience.weather,
      weatherPhase: 0,
      intensities: getWeatherIntensities(ambience.weather),
    };
  }
  if (!ambience.dynamicCycles) {
    const weather = STATIC_AMBIENCE_DEFAULTS.weather;
    return {
      weather,
      weatherPhase: 0,
      intensities: getWeatherIntensities(weather),
    };
  }
  const sample = computeWeather(ambientClockMs, season);
  return {
    weather: sample.weather,
    weatherPhase: sample.weatherPhase,
    intensities: sample.intensities,
  };
}

export function mergeAmbienceSettings(
  partial?: Partial<AmbienceSettings>,
): AmbienceSettings {
  return { ...DEFAULT_AMBIENCE, ...partial };
}

export function timeOfDayLabelFromPreference(pref: TimeOfDayPreference): string {
  if (pref === 'auto') {
    return 'Auto';
  }
  return pref.charAt(0).toUpperCase() + pref.slice(1);
}
