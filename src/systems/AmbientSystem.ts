import { MAX_PHYSICS_DELTA_MS, PHYSICS_DELTA_MS } from '../constants';
import { getCycleSpeedMultiplier } from '../constants/ambienceDefaults';
import type { EntityMap } from '../types/ecs';
import { computeAmbient } from '../utils/ambient';
import { getPhysicsContext } from '../utils/physics';
import { syncBackgroundAmbient } from '../utils/applyAmbienceToPhysics';
import { smoothAmbient } from '../utils/smoothAmbient';

/** Advances the ambient clock and syncs sky mood to background entities. */
export const AmbientSystem = (
  entities: EntityMap,
  args: { time: { delta: number } },
): EntityMap => {
  const physics = getPhysicsContext(entities);
  const rawDelta = args.time.delta || PHYSICS_DELTA_MS;
  const delta = Math.min(Math.max(rawDelta, 0), MAX_PHYSICS_DELTA_MS);

  const speed = getCycleSpeedMultiplier(physics.ambience.cycleSpeed);
  physics.ambientClockMs += delta * speed;
  physics.ambient = computeAmbient(physics.ambientClockMs, physics.ambience);
  physics.displayAmbient = smoothAmbient(physics.displayAmbient, physics.ambient);

  syncBackgroundAmbient(entities, physics.displayAmbient, physics.ambience);

  return entities;
};
