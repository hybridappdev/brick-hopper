import type Matter from 'matter-js';
import type { EntityMap, GameEntity } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { isPlayerOnPlatform } from './collision';

const EDGE_MARGIN_PX = 36;

/** Platform the player is standing on, if any. */
export function getGroundedPlatform(
  playerBody: Matter.Body,
  entities: EntityMap,
): GameEntity | null {
  for (const key of Object.keys(entities)) {
    const entity = entities[key];
    if (
      entity &&
      isGameEntity(entity) &&
      entity.entityType === 'platform' &&
      entity.collider &&
      isPlayerOnPlatform(playerBody, entity.collider.body)
    ) {
      return entity;
    }
  }
  return null;
}

/**
 * True when another hop in `direction` would likely leave the current platform.
 */
export function isNearPlatformEdge(
  playerBody: Matter.Body,
  entities: EntityMap,
  direction: -1 | 0 | 1,
): boolean {
  if (direction === 0) {
    return false;
  }

  const platform = getGroundedPlatform(playerBody, entities);
  if (!platform?.collider) {
    return false;
  }

  const platformBody = platform.collider.body;
  if (direction === 1) {
    return playerBody.bounds.max.x >= platformBody.bounds.max.x - EDGE_MARGIN_PX;
  }
  return playerBody.bounds.min.x <= platformBody.bounds.min.x + EDGE_MARGIN_PX;
}
