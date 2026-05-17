import { CAMERA_EDGE_PADDING, WORLD_WIDTH } from './world';

/** Distant layer — moves slowly (Mario-style far hills / sky). */
export const PARALLAX_SKY_FACTOR = 0.1;

/** Closer layer — moves faster for depth from the same artwork. */
export const PARALLAX_HILLS_FACTOR = 0.32;

export const SUNSET_BACKGROUND = require('../../assets/pixel-sunset.jpg');

export function getBackgroundScrollWidth(
  viewportWidth: number,
  parallaxFactor: number,
): number {
  const maxCameraX = Math.max(
    0,
    WORLD_WIDTH - viewportWidth - CAMERA_EDGE_PADDING,
  );
  return Math.ceil(viewportWidth + maxCameraX * parallaxFactor);
}
