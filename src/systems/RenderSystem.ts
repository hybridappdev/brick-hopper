import type { EntityMap } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { getPhysicsContext } from '../utils/physics';

/**
 * Renders entities using the scrollable map camera (not player-follow).
 */
export const RenderSystem = (entities: EntityMap): EntityMap => {
  const physics = getPhysicsContext(entities);
  const cameraX = physics.camera.x;

  for (const key of Object.keys(entities)) {
    const entity = entities[key];
    if (!entity || !isGameEntity(entity)) {
      continue;
    }

    if (entity.entityType === 'decoration') {
      const factor = entity.parallaxFactor ?? 0;
      entity.renderPosition = {
        x: -cameraX * factor,
        y: entity.position.y,
      };
      continue;
    }

    entity.renderPosition = {
      x: entity.position.x - cameraX,
      y: entity.position.y,
    };
  }

  return entities;
};
