import type { SeasonName } from './ambient';

/** Full weather rotation (clear → rain → storm → …) in ms. */
export const WEATHER_CYCLE_MS = 75_000;

export type WeatherName = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm';

export const WEATHER_LABELS: Record<WeatherName, string> = {
  clear: 'Sunny',
  cloudy: 'Cloudy',
  rain: 'Rain',
  snow: 'Snow',
  storm: 'Storm',
};

/** Seasonal weather order — blends smoothly between neighbors in the list. */
export const WEATHER_BY_SEASON: Record<SeasonName, WeatherName[]> = {
  spring: ['clear', 'cloudy', 'rain', 'clear', 'cloudy'],
  summer: ['clear', 'clear', 'cloudy', 'storm', 'clear'],
  autumn: ['cloudy', 'rain', 'clear', 'rain', 'cloudy'],
  winter: ['cloudy', 'snow', 'clear', 'snow', 'cloudy'],
};

export const RAIN_DROP_COUNT = 72;
export const SNOW_FLAKE_COUNT = 40;
export const CLOUD_BLOB_COUNT = 5;
