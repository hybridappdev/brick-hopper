import { PLAYER_HEIGHT } from '../constants';
import type { GameEntity } from '../types/ecs';

/** True when the player is falling onto the enemy from above. */
export function isStompHit(player: GameEntity, enemy: GameEntity): boolean {
  if (!player.collider || !enemy.collider) {
    return false;
  }

  const falling = player.collider.body.velocity.y > 0;
  const feetAboveEnemy =
    player.position.y + PLAYER_HEIGHT * 0.25 < enemy.position.y;

  return falling && feetAboveEnemy;
}
