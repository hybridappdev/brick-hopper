import Matter from 'matter-js';
import type { EntityMap, GameEntity, PhysicsContext, SpawnPoint } from '../types/ecs';

export function getRespawnPoint(physics: PhysicsContext): SpawnPoint {
  return physics.checkpoint ?? physics.playerSpawn;
}

export function respawnPlayerAt(
  player: GameEntity,
  physics: PhysicsContext,
  point: SpawnPoint,
): void {
  if (!player.collider) {
    return;
  }

  const { body } = player.collider;

  Matter.Body.setPosition(body, { x: point.x, y: point.y });
  Matter.Body.setVelocity(body, { x: 0, y: 0 });
  player.position.x = point.x;
  player.position.y = point.y;
  player.isGrounded = false;
  player.autoHopTimerMs = 0;
  player.hopCooldownMs = 0;
}

export function respawnPlayerAtSpawn(
  player: GameEntity,
  physics: PhysicsContext,
): void {
  const point = getRespawnPoint(physics);
  respawnPlayerAt(player, physics, point);
  if (point.cameraX !== undefined) {
    physics.camera.x = point.cameraX;
  }
}

export function respawnPlayer(player: GameEntity, entities: EntityMap): void {
  const physicsEntity = entities.physics as { physics: PhysicsContext };
  respawnPlayerAtSpawn(player, physicsEntity.physics);
}
