import type { GameEngineUpdateEventOptionType } from 'react-native-game-engine';
import type { PhysicsContext } from '../types/ecs';

export function loseLife(
  physics: PhysicsContext,
  dispatch: GameEngineUpdateEventOptionType['dispatch'],
): boolean {
  if (physics.levelComplete || physics.gameOver) {
    return false;
  }

  physics.lives = Math.max(0, physics.lives - 1);
  dispatch({ type: 'life-lost', lives: physics.lives });

  if (physics.lives <= 0) {
    physics.gameOver = true;
    dispatch({ type: 'game-over', score: physics.score });
    return true;
  }

  return false;
}
