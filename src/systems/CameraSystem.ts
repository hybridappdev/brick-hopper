import { PHYSICS_DELTA_MS, TILT_SCROLL_SPEED } from '../constants';
import type { EntityMap } from '../types/ecs';
import { clampCameraX } from '../utils/camera';
import { getPhysicsContext } from '../utils/physics';

/**
 * Scrolls the map horizontally from phone tilt (accelerometer).
 */
export const CameraSystem = (
  entities: EntityMap,
  args: { time: { delta: number } },
): EntityMap => {
  const physics = getPhysicsContext(entities);
  const { width } = physics.viewport;
  const rawDelta = args.time.delta || PHYSICS_DELTA_MS;
  const frameScale = rawDelta / PHYSICS_DELTA_MS;

  const { tiltX } = physics.input;
  let nextX = physics.camera.x;

  if (Math.abs(tiltX) > 0.01) {
    nextX += tiltX * TILT_SCROLL_SPEED * frameScale;
  }

  physics.camera.x = clampCameraX(nextX, width);

  return entities;
};
