import { MAX_PHYSICS_DELTA_MS, PHYSICS_DELTA_MS } from '../constants';
import type { EntityMap } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { computeAmbient } from '../utils/ambient';
import { getPhysicsContext } from '../utils/physics';

/** Advances the ambient clock and syncs sky mood to background entities. */
export const AmbientSystem = (
  entities: EntityMap,
  args: { time: { delta: number } },
): EntityMap => {
  const physics = getPhysicsContext(entities);
  const rawDelta = args.time.delta || PHYSICS_DELTA_MS;
  const delta = Math.min(Math.max(rawDelta, 0), MAX_PHYSICS_DELTA_MS);

  physics.ambientClockMs += delta;
  physics.ambient = computeAmbient(physics.ambientClockMs);

  for (const key of Object.keys(entities)) {
    const entity = entities[key];
    if (!entity || !isGameEntity(entity) || entity.entityType !== 'decoration') {
      continue;
    }
    if (key.startsWith('bg_')) {
      entity.ambient = physics.ambient;
    }
  }

  return entities;
};
