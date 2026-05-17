import type { EntityMap, GameEntity } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { COYOTE_TIME_MS, MAX_PHYSICS_DELTA_MS, PHYSICS_DELTA_MS } from '../constants';
import { isPlayerGroundedOnPlatforms } from '../utils/collision';
import { getPhysicsContext } from '../utils/physics';

/**
 * Per-frame ground detection (more reliable than collision events alone).
 * Maintains coyote time when the player walks off a ledge.
 */
export const CollisionSystem = (
  entities: EntityMap,
  args: { time: { delta: number } },
): EntityMap => {
  const physics = getPhysicsContext(entities);
  if (physics.levelComplete) {
    return entities;
  }

  const player = entities.player;
  if (!player || !isGameEntity(player) || !player.collider) {
    return entities;
  }

  const rawDelta = args.time.delta || PHYSICS_DELTA_MS;
  const delta = Math.min(Math.max(rawDelta, 0), MAX_PHYSICS_DELTA_MS);
  updateGroundState(player, entities, delta);
  return entities;
};

function updateGroundState(
  player: GameEntity,
  entities: EntityMap,
  delta: number,
): void {
  const onGround = isPlayerGroundedOnPlatforms(player.collider!.body, entities);

  if (onGround) {
    player.isGrounded = true;
    player.coyoteMs = COYOTE_TIME_MS;
    return;
  }

  player.isGrounded = false;
  if ((player.coyoteMs ?? 0) > 0) {
    player.coyoteMs = Math.max(0, (player.coyoteMs ?? 0) - delta);
  }
}
