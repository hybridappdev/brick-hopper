import Matter from 'matter-js';
import { PHYSICS_DELTA_MS } from '../constants';
import type { EntityMap } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { isPlayerOnPlatform } from '../utils/collision';
import { getPhysicsContext } from '../utils/physics';

/**
 * Patrols enemies and moving platforms; carries the player on moving platforms.
 */
export const PatrolSystem = (
  entities: EntityMap,
  args: { time: { delta: number } },
): EntityMap => {
  const physics = getPhysicsContext(entities);
  if (physics.levelComplete || physics.gameOver) {
    return entities;
  }

  const delta = args.time.delta || PHYSICS_DELTA_MS;
  const step = delta / PHYSICS_DELTA_MS;
  const player = entities.player;
  const playerBody =
    player && isGameEntity(player) && player.collider
      ? player.collider.body
      : null;

  for (const key of Object.keys(entities)) {
    const entity = entities[key];
    if (!entity || !isGameEntity(entity) || !entity.patrol || !entity.collider) {
      continue;
    }

    if (entity.entityType !== 'enemy' && entity.entityType !== 'platform') {
      continue;
    }

    const { body } = entity.collider;
    const patrol = entity.patrol;
    const prevX = body.position.x;
    let nextX = prevX + patrol.speed * patrol.direction * step;

    if (nextX <= patrol.minX) {
      nextX = patrol.minX;
      patrol.direction = 1;
    } else if (nextX >= patrol.maxX) {
      nextX = patrol.maxX;
      patrol.direction = -1;
    }

    const dx = nextX - prevX;
    Matter.Body.setPosition(body, { x: nextX, y: body.position.y });
    entity.position.x = nextX;
    entity.position.y = body.position.y;

    if (
      dx !== 0 &&
      entity.entityType === 'platform' &&
      playerBody &&
      player &&
      isGameEntity(player) &&
      isPlayerOnPlatform(playerBody, body)
    ) {
      Matter.Body.translate(playerBody, { x: dx, y: 0 });
      player.position.x += dx;
    }
  }

  return entities;
};
