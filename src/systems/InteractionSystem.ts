import Matter from 'matter-js';
import type { GameEngineUpdateEventOptionType } from 'react-native-game-engine';
import { JUMP_PAD_FORCE } from '../constants';
import type { EntityMap, GameEntity } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { collectCoin, collectCoinsInRange } from '../utils/coinCollect';
import { respawnPlayer } from '../utils/playerRespawn';
import { getPhysicsContext } from '../utils/physics';

function findEntityByBody(
  entities: EntityMap,
  body: Matter.Body,
): { key: string; entity: GameEntity } | null {
  for (const key of Object.keys(entities)) {
    const entity = entities[key];
    if (entity && isGameEntity(entity) && entity.collider?.body === body) {
      return { key, entity };
    }
  }
  return null;
}

function applyJumpPad(
  player: GameEntity,
  jumpForce: number,
  dispatch: GameEngineUpdateEventOptionType['dispatch'],
): void {
  if (!player.collider) {
    return;
  }

  const { body } = player.collider;
  Matter.Body.setVelocity(body, {
    x: body.velocity.x,
    y: jumpForce,
  });
  player.isGrounded = false;
  dispatch({ type: 'jump-pad' });
}

function registerInteractionHandlers(
  entities: EntityMap,
  player: GameEntity,
  dispatch: GameEngineUpdateEventOptionType['dispatch'],
): void {
  const physics = getPhysicsContext(entities);
  if (physics.interactionHandlersRegistered || !player.collider) {
    return;
  }

  const playerBody = player.collider.body;

  Matter.Events.on(physics.engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      const { bodyA, bodyB } = pair;

      const playerIsA = bodyA === playerBody;
      const playerIsB = bodyB === playerBody;
      if (!playerIsA && !playerIsB) {
        continue;
      }

      const otherBody = playerIsA ? bodyB : bodyA;
      const other = findEntityByBody(entities, otherBody);

      if (other?.entity.entityType === 'coin') {
        collectCoin(entities, other.key, other.entity, dispatch);
        continue;
      }

      if (other?.entity.entityType === 'enemy') {
        respawnPlayer(player, entities);
        dispatch({ type: 'player-hit' });
        continue;
      }

      if (other?.entity.entityType === 'jumpPad') {
        applyJumpPad(player, other.entity.jumpForce ?? JUMP_PAD_FORCE, dispatch);
        continue;
      }

      if (otherBody.label === 'jumpPad') {
        applyJumpPad(player, JUMP_PAD_FORCE, dispatch);
      }
    }
  });

  physics.interactionHandlersRegistered = true;
}

/**
 * Registers gameplay collision handlers (coins, enemies, jump pads).
 */
export const InteractionSystem = (
  entities: EntityMap,
  args: GameEngineUpdateEventOptionType,
): EntityMap => {
  const player = entities.player;
  if (!player || !isGameEntity(player)) {
    return entities;
  }

  registerInteractionHandlers(entities, player, args.dispatch);

  const physics = getPhysicsContext(entities);
  if (!physics.levelComplete) {
    collectCoinsInRange(entities, player, physics.input.hopSpeed, args.dispatch);
  }

  return entities;
};
