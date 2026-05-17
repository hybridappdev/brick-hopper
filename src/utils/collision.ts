import type Matter from 'matter-js';

/** How close the player's feet must be to a platform top to count as grounded. */
export const GROUND_TOLERANCE_PX = 22;

export function isPlayerOnPlatform(
  playerBody: Matter.Body,
  platformBody: Matter.Body,
): boolean {
  const playerBottom = playerBody.bounds.max.y;
  const platformTop = platformBody.bounds.min.y;
  const horizontalOverlap =
    playerBody.bounds.min.x < platformBody.bounds.max.x &&
    playerBody.bounds.max.x > platformBody.bounds.min.x;

  return (
    horizontalOverlap &&
    Math.abs(playerBottom - platformTop) <= GROUND_TOLERANCE_PX &&
    playerBody.velocity.y >= -1.2
  );
}

export function isPlayerGroundedOnPlatforms(
  playerBody: Matter.Body,
  entities: Record<string, unknown>,
): boolean {
  if (playerBody.velocity.y < -2) {
    return false;
  }

  for (const key of Object.keys(entities)) {
    const entity = entities[key] as { entityType?: string; collider?: { body: Matter.Body } };
    if (entity?.entityType !== 'platform' || !entity.collider) {
      continue;
    }
    if (isPlayerOnPlatform(playerBody, entity.collider.body)) {
      return true;
    }
  }

  return false;
}
