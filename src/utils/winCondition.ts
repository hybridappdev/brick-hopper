import type { GameEngineUpdateEventOptionType } from 'react-native-game-engine';
import type { EntityMap } from '../types/ecs';
import { countRemainingCoins } from './levelProgress';
import { getPhysicsContext } from './physics';

export function syncCoinsCleared(entities: EntityMap): void {
  const physics = getPhysicsContext(entities);
  physics.coinsCleared = countRemainingCoins(entities) === 0;
}

export function tryCompleteLevel(
  entities: EntityMap,
  dispatch: GameEngineUpdateEventOptionType['dispatch'],
): void {
  const physics = getPhysicsContext(entities);
  if (physics.levelComplete || physics.gameOver) {
    return;
  }

  syncCoinsCleared(entities);
  if (!physics.coinsCleared) {
    return;
  }

  physics.levelComplete = true;
  dispatch({ type: 'level-complete', score: physics.score });
}
