import Matter from 'matter-js';
import type { GameEngineUpdateEventOptionType } from 'react-native-game-engine';
import { ENEMY_STOMP_SCORE, STOMP_BOUNCE_VY } from '../constants';
import type { EntityMap, GameEntity } from '../types/ecs';
import { getPhysicsContext } from './physics';

export function defeatEnemy(
  entities: EntityMap,
  enemyKey: string,
  enemy: GameEntity,
  player: GameEntity,
  dispatch: GameEngineUpdateEventOptionType['dispatch'],
): void {
  if (!enemy.collider || !player.collider) {
    return;
  }

  const physics = getPhysicsContext(entities);
  physics.score += ENEMY_STOMP_SCORE;

  Matter.World.remove(physics.world, enemy.collider.body);
  delete entities[enemyKey];

  const { body } = player.collider;
  Matter.Body.setVelocity(body, {
    x: body.velocity.x,
    y: STOMP_BOUNCE_VY,
  });
  player.isGrounded = false;

  dispatch({ type: 'enemy-stomped', score: physics.score });
  dispatch({ type: 'score-updated', score: physics.score });
}
