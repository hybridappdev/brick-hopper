import type { GameEngineUpdateEventOptionType } from 'react-native-game-engine';
import {
  COIN_PICKUP_RADIUS,
  COIN_PICKUP_SLOW_BONUS,
  COIN_RADIUS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../constants';
import type { EntityMap, GameEntity, HopLevel } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { countRemainingCoins } from './levelProgress';
import { getPhysicsContext } from './physics';
import Matter from 'matter-js';

function pickupRadius(hopSpeed: HopLevel): number {
  const slowBonus = hopSpeed === 0 ? COIN_PICKUP_SLOW_BONUS : 0;
  const playerReach = Math.max(PLAYER_WIDTH, PLAYER_HEIGHT) * 0.45;
  return COIN_PICKUP_RADIUS + COIN_RADIUS + playerReach + slowBonus;
}

function checkLevelComplete(
  entities: EntityMap,
  dispatch: GameEngineUpdateEventOptionType['dispatch'],
): void {
  const physics = getPhysicsContext(entities);
  if (physics.levelComplete) {
    return;
  }

  if (countRemainingCoins(entities) === 0) {
    physics.levelComplete = true;
    dispatch({ type: 'level-complete', score: physics.score });
  }
}

export function collectCoin(
  entities: EntityMap,
  coinKey: string,
  coin: GameEntity,
  dispatch: GameEngineUpdateEventOptionType['dispatch'],
): void {
  if (coin.collected || coin.entityType !== 'coin' || !coin.collider) {
    return;
  }

  const physics = getPhysicsContext(entities);
  coin.collected = true;
  physics.score += coin.value ?? 0;

  Matter.World.remove(physics.world, coin.collider.body);
  delete entities[coinKey];

  dispatch({ type: 'coin-collected', score: physics.score });
  dispatch({ type: 'score-updated', score: physics.score });
  checkLevelComplete(entities, dispatch);
}

/**
 * Picks up coins within reach (handles fast hops that skip collision events).
 */
export function collectCoinsInRange(
  entities: EntityMap,
  player: GameEntity,
  hopSpeed: HopLevel,
  dispatch: GameEngineUpdateEventOptionType['dispatch'],
): void {
  if (!player.collider) {
    return;
  }

  const radius = pickupRadius(hopSpeed);
  const radiusSq = radius * radius;
  const px = player.position.x;
  const py = player.position.y;

  for (const key of Object.keys(entities)) {
    const entity = entities[key];
    if (!entity || !isGameEntity(entity) || entity.entityType !== 'coin' || entity.collected) {
      continue;
    }

    const dx = entity.position.x - px;
    const dy = entity.position.y - py;
    if (dx * dx + dy * dy <= radiusSq) {
      collectCoin(entities, key, entity, dispatch);
    }
  }
}
