import Matter from 'matter-js';
import { MAX_PHYSICS_DELTA_MS, PHYSICS_DELTA_MS } from '../constants';
import type { EntityMap } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { getPhysicsContext } from '../utils/physics';

/**
 * Steps Matter.js and syncs body state back into ECS components.
 */
export const PhysicsSystem = (
  entities: EntityMap,
  args: { time: { delta: number } },
): EntityMap => {
  const physics = getPhysicsContext(entities);
  if (physics.levelComplete || physics.gameOver) {
    return entities;
  }

  const rawDelta = args.time.delta || PHYSICS_DELTA_MS;
  const delta = Math.min(Math.max(rawDelta, 0), MAX_PHYSICS_DELTA_MS);

  Matter.Engine.update(physics.engine, delta);

  for (const key of Object.keys(entities)) {
    const entity = entities[key];
    if (!entity || !isGameEntity(entity)) {
      continue;
    }

    if (!entity.collider) {
      continue;
    }

    const { body } = entity.collider;
    entity.position.x = body.position.x;
    entity.position.y = body.position.y;
    entity.velocity.x = body.velocity.x;
    entity.velocity.y = body.velocity.y;
  }

  return entities;
};
