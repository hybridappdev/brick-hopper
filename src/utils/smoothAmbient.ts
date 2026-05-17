import type { AmbientSnapshot } from './ambient';
import { lerpColor } from './color';

const SMOOTH_FACTOR = 0.14;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function blendVignette(daylight: number): string {
  const nightWeight = 1 - daylight;
  const alpha = 0.35 + nightWeight * 0.22;
  const r = Math.round(15 + nightWeight * (5 - 15));
  const g = Math.round(26 + nightWeight * (8 - 26));
  const b = Math.round(51 + nightWeight * (24 - 51));
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Eases the rendered sky toward the simulation target to avoid harsh color pops. */
export function smoothAmbient(
  current: AmbientSnapshot | undefined,
  target: AmbientSnapshot,
  factor = SMOOTH_FACTOR,
): AmbientSnapshot {
  if (!current) {
    return target;
  }

  const daylight = lerp(current.daylight, target.daylight, factor);

  return {
    timeOfDay: lerp(current.timeOfDay, target.timeOfDay, factor),
    seasonPhase: lerp(current.seasonPhase, target.seasonPhase, factor),
    season: target.season,
    daylight,
    starOpacity: lerp(current.starOpacity, target.starOpacity, factor),
    skyColor: lerpColor(current.skyColor, target.skyColor, factor),
    tintColor: lerpColor(current.tintColor, target.tintColor, factor),
    tintOpacity: lerp(current.tintOpacity, target.tintOpacity, factor),
    vignetteColor: blendVignette(daylight),
    sunOpacity: lerp(current.sunOpacity, target.sunOpacity, factor),
    moonOpacity: lerp(current.moonOpacity, target.moonOpacity, factor),
    celestialX: lerp(current.celestialX, target.celestialX, factor),
    moonX: lerp(current.moonX, target.moonX, factor),
    celestialY: lerp(current.celestialY, target.celestialY, factor),
    weatherPhase: lerp(current.weatherPhase, target.weatherPhase, factor),
    weather: target.weather,
    weatherLabel: target.weatherLabel,
    cloudCover: lerp(current.cloudCover, target.cloudCover, factor),
    rainIntensity: lerp(current.rainIntensity, target.rainIntensity, factor),
    snowIntensity: lerp(current.snowIntensity, target.snowIntensity, factor),
    stormIntensity: lerp(current.stormIntensity, target.stormIntensity, factor),
    weatherAnimMs: target.weatherAnimMs,
  };
}
