import type { AmbienceSettings } from './ambienceDefaults';
import { getCycleSpeedMultiplier } from './ambienceDefaults';

/** Faster day/night + season cycle on menu screens (showcase for the player). */
export const MENU_AMBIENT_SPEED = 28;

/** Weather advances slower than sky on menus so blends stay readable. */
export const MENU_WEATHER_SPEED = 4;

/** In-game ambient runs at real-time (1×). */
export const GAME_AMBIENT_SPEED = 1;

/** Clock multiplier for menu backdrop preview. */
export function getMenuPreviewClockSpeed(ambience: AmbienceSettings): number {
  if (!ambience.dynamicCycles) {
    return 0;
  }
  if (ambience.fastMenuPreview) {
    return MENU_AMBIENT_SPEED;
  }
  return getCycleSpeedMultiplier(ambience.cycleSpeed);
}

/** Clock multiplier for menu weather (rain, clouds, snow). */
export function getMenuPreviewWeatherClockSpeed(ambience: AmbienceSettings): number {
  if (!ambience.dynamicCycles) {
    return 0;
  }
  if (ambience.fastMenuPreview) {
    return MENU_WEATHER_SPEED;
  }
  return getCycleSpeedMultiplier(ambience.cycleSpeed);
}
