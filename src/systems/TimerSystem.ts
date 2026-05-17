import { MAX_PHYSICS_DELTA_MS, PHYSICS_DELTA_MS } from '../constants';
import type { EntityMap } from '../types/ecs';
import { getPhysicsContext } from '../utils/physics';

/** Advances per-level elapsed time while the level is in progress. */
export const TimerSystem = (
  entities: EntityMap,
  args: { time: { delta: number } },
): EntityMap => {
  const physics = getPhysicsContext(entities);
  if (physics.levelComplete || physics.gameOver) {
    return entities;
  }

  const rawDelta = args.time.delta || PHYSICS_DELTA_MS;
  const delta = Math.min(Math.max(rawDelta, 0), MAX_PHYSICS_DELTA_MS);
  physics.elapsedMs += delta;

  return entities;
};
