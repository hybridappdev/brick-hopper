import {
  WEATHER_BY_SEASON,
  WEATHER_CYCLE_MS,
  WEATHER_LABELS,
  type WeatherName,
} from '../constants/weather';
import type { SeasonName } from '../constants/ambient';
import { lerpColor } from './color';

export interface WeatherIntensities {
  cloudCover: number;
  rainIntensity: number;
  snowIntensity: number;
  stormIntensity: number;
}

export const WEATHER_PRESETS: Record<WeatherName, WeatherIntensities> = {
  clear: { cloudCover: 0, rainIntensity: 0, snowIntensity: 0, stormIntensity: 0 },
  cloudy: { cloudCover: 0.72, rainIntensity: 0, snowIntensity: 0, stormIntensity: 0 },
  rain: { cloudCover: 0.55, rainIntensity: 0.88, snowIntensity: 0, stormIntensity: 0 },
  snow: { cloudCover: 0.48, rainIntensity: 0, snowIntensity: 0.92, stormIntensity: 0 },
  storm: { cloudCover: 0.85, rainIntensity: 1, snowIntensity: 0, stormIntensity: 0.95 },
};

function lerpWeather(a: WeatherIntensities, b: WeatherIntensities, t: number): WeatherIntensities {
  return {
    cloudCover: a.cloudCover + (b.cloudCover - a.cloudCover) * t,
    rainIntensity: a.rainIntensity + (b.rainIntensity - a.rainIntensity) * t,
    snowIntensity: a.snowIntensity + (b.snowIntensity - a.snowIntensity) * t,
    stormIntensity: a.stormIntensity + (b.stormIntensity - a.stormIntensity) * t,
  };
}

function weatherAtPhase(
  season: SeasonName,
  phase: number,
): { weather: WeatherName; nextWeather: WeatherName; localT: number; intensities: WeatherIntensities } {
  const pool = WEATHER_BY_SEASON[season];
  const p = ((phase % 1) + 1) % 1;
  const index = Math.min(pool.length - 1, Math.floor(p * pool.length));
  const localT = p * pool.length - index;
  const weather = pool[index];
  const nextWeather = pool[(index + 1) % pool.length];
  const intensities = lerpWeather(
    WEATHER_PRESETS[weather],
    WEATHER_PRESETS[nextWeather],
    localT,
  );
  return { weather, nextWeather, localT, intensities };
}

export function getWeatherIntensities(weather: WeatherName): WeatherIntensities {
  return { ...WEATHER_PRESETS[weather] };
}

export function computeWeather(ambientClockMs: number, season: SeasonName) {
  const phase = (ambientClockMs % WEATHER_CYCLE_MS) / WEATHER_CYCLE_MS;
  const sample = weatherAtPhase(season, phase);
  return {
    weatherPhase: phase,
    ...sample,
  };
}

/** Human-readable label from blended intensities. */
export function weatherLabelFromIntensities(intensities: WeatherIntensities): string {
  if (intensities.stormIntensity > 0.45) {
    return WEATHER_LABELS.storm;
  }
  if (intensities.rainIntensity > 0.35) {
    return WEATHER_LABELS.rain;
  }
  if (intensities.snowIntensity > 0.35) {
    return WEATHER_LABELS.snow;
  }
  if (intensities.cloudCover > 0.4) {
    return WEATHER_LABELS.cloudy;
  }
  return WEATHER_LABELS.clear;
}

/** Darkens / cools the sky sample for overcast and precipitation. */
export function applyWeatherToSky(
  skyColor: string,
  tintColor: string,
  tintOpacity: number,
  daylight: number,
  intensities: WeatherIntensities,
): { skyColor: string; tintColor: string; tintOpacity: number; sunScale: number; starScale: number } {
  const overcast = intensities.cloudCover * 0.55 + intensities.rainIntensity * 0.25;
  const wet = intensities.rainIntensity * 0.35 + intensities.stormIntensity * 0.2;
  const snowWash = intensities.snowIntensity * 0.4;

  const skyColorAdjusted = lerpColor(
    skyColor,
    lerpColor('#6a7a8f', '#9ab0c8', snowWash),
    Math.min(0.65, overcast + wet * 0.5),
  );

  const tintColorAdjusted = lerpColor(
    tintColor,
    lerpColor('#788898', '#d8e8f8', snowWash),
    overcast * 0.45 + wet * 0.3,
  );

  return {
    skyColor: skyColorAdjusted,
    tintColor: tintColorAdjusted,
    tintOpacity: Math.min(0.9, tintOpacity + overcast * 0.18 + wet * 0.12),
    sunScale: Math.max(0.08, 1 - overcast * 0.75 - wet * 0.35),
    starScale: Math.max(0.2, 1 - overcast * 0.5),
  };
}

export interface WeatherBackgroundWash {
  washColor: string;
  washOpacity: number;
  imageOpacityScale: number;
}

/** Tints the sunset artwork for overcast / rain / snow (sky + parallax hills). */
export function getWeatherBackgroundWash(
  intensities: WeatherIntensities,
  layer: 'sky' | 'hills',
): WeatherBackgroundWash {
  const depth = layer === 'hills' ? 1.2 : 1;
  const overcast = intensities.cloudCover;
  const wet = intensities.rainIntensity + intensities.stormIntensity * 0.55;
  const snow = intensities.snowIntensity;

  let washColor = '#5a6478';
  let washOpacity = overcast * 0.22 * depth;

  if (wet > 0.05) {
    washColor = lerpColor('#4a5568', '#2a3344', Math.min(1, wet + intensities.stormIntensity * 0.3));
    washOpacity += wet * 0.38 * depth;
  }

  if (snow > 0.05) {
    washColor = lerpColor(washColor, '#dce8f4', snow);
    washOpacity += snow * 0.28 * depth;
  }

  const imageOpacityScale = Math.max(
    0.25,
    1 - overcast * 0.28 - wet * 0.22 - snow * 0.12,
  );

  return {
    washColor,
    washOpacity: Math.min(0.72, washOpacity),
    imageOpacityScale,
  };
}
