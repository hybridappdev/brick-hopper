import Matter from 'matter-js';
import type { GameEngineUpdateEventOptionType } from 'react-native-game-engine';
import {
  AUTO_HOP_INTERVAL_MS,
  AUTO_HOP_LAND_BOOST,
  FALL_RESPAWN_OFFSET_PX,
  HOP_COOLDOWN_MS,
  HOP_VERTICAL_IMPULSE,
  MAX_PHYSICS_DELTA_MS,
  PHYSICS_DELTA_MS,
  PLAYER_HEIGHT,
} from '../constants';
import type { EntityMap, GameEntity, HopLevel } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { getWorldCenterX } from '../utils/camera';
import { respawnPlayerAtSpawn } from '../utils/playerRespawn';
import { getPhysicsContext } from '../utils/physics';

/**
 * Brick stays under the screen center (world scrolls horizontally).
 * Auto-hops vertically to cross platforms and collect coins.
 */
export const MovementSystem = (
  entities: EntityMap,
  args: GameEngineUpdateEventOptionType,
): EntityMap => {
  const physics = getPhysicsContext(entities);
  if (physics.levelComplete) {
    return entities;
  }

  const rawDelta = args.time.delta || PHYSICS_DELTA_MS;
  const delta = Math.min(Math.max(rawDelta, 0), MAX_PHYSICS_DELTA_MS);
  const player = entities.player;

  if (!player || !isGameEntity(player) || !player.collider) {
    return entities;
  }

  tickHopCooldown(player, delta);
  syncPlayerToViewportCenter(player, physics);
  updateCheckpoint(player, physics);
  updateVerticalAutoHop(player, physics.input.hopSpeed, delta, args);
  checkFallRespawn(player, physics, args);

  return entities;
};

function tickHopCooldown(player: GameEntity, delta: number): void {
  if ((player.hopCooldownMs ?? 0) > 0) {
    player.hopCooldownMs = Math.max(0, (player.hopCooldownMs ?? 0) - delta);
  }
}

function normalizeHopSpeed(speed: HopLevel): HopLevel {
  if (speed === 0 || speed === 1 || speed === 2) {
    return speed;
  }
  return 1;
}

function canHop(player: GameEntity): boolean {
  return (
    (player.hopCooldownMs ?? 0) <= 0 &&
    Boolean(player.isGrounded || (player.coyoteMs ?? 0) > 0)
  );
}

/** Keep the brick in the horizontal center of the viewport while the map scrolls. */
function syncPlayerToViewportCenter(
  player: GameEntity,
  physics: ReturnType<typeof getPhysicsContext>,
): void {
  if (!player.collider) {
    return;
  }

  const centerX = getWorldCenterX(physics.camera.x, physics.viewport.width);
  const { body } = player.collider;
  const y = body.position.y;

  if (Math.abs(body.position.x - centerX) > 0.5 || Math.abs(body.velocity.x) > 0.05) {
    Matter.Body.setPosition(body, { x: centerX, y });
    Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y });
    player.position.x = centerX;
    player.position.y = y;
  }
}

function updateCheckpoint(
  player: GameEntity,
  physics: ReturnType<typeof getPhysicsContext>,
): void {
  const grounded = Boolean(player.isGrounded);
  const wasGrounded = player.wasGrounded ?? false;

  if (grounded && !wasGrounded) {
    physics.checkpoint = {
      x: player.position.x,
      y: player.position.y - PLAYER_HEIGHT * 0.2,
      cameraX: physics.camera.x,
    };
  }
}

function updateVerticalAutoHop(
  player: GameEntity,
  hopSpeed: HopLevel,
  delta: number,
  args: GameEngineUpdateEventOptionType,
): void {
  const grounded = Boolean(player.isGrounded);
  const wasGrounded = player.wasGrounded ?? false;
  const speed = normalizeHopSpeed(hopSpeed);
  const interval = AUTO_HOP_INTERVAL_MS[speed];

  if (grounded && !wasGrounded) {
    player.autoHopTimerMs = interval * AUTO_HOP_LAND_BOOST;
  }

  player.wasGrounded = grounded;

  if (!grounded) {
    return;
  }

  player.autoHopTimerMs = (player.autoHopTimerMs ?? 0) + delta;

  if (!canHop(player) || (player.autoHopTimerMs ?? 0) < interval) {
    return;
  }

  if (applyVerticalHop(player, speed)) {
    player.autoHopTimerMs = 0;
    player.hopCooldownMs = HOP_COOLDOWN_MS;
    args.dispatch?.({ type: 'hop' });
  }
}

function applyVerticalHop(player: GameEntity, hopSpeed: HopLevel): boolean {
  if (!player.collider) {
    return false;
  }

  const level = normalizeHopSpeed(hopSpeed);
  const { body } = player.collider;

  Matter.Body.setVelocity(body, {
    x: 0,
    y: HOP_VERTICAL_IMPULSE[level],
  });
  player.isGrounded = false;
  return true;
}

function checkFallRespawn(
  player: GameEntity,
  physics: ReturnType<typeof getPhysicsContext>,
  args: GameEngineUpdateEventOptionType,
): void {
  if (!player.collider) {
    return;
  }

  const fallLine = physics.playerSpawn.y + FALL_RESPAWN_OFFSET_PX;
  if (player.position.y <= fallLine) {
    return;
  }

  respawnPlayerAtSpawn(player, physics);
  args.dispatch?.({ type: 'player-hit' });
}
