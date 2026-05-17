import type { EntityMap } from '../types/ecs';
import { isGameEntity } from '../types/ecs';

export function countRemainingCoins(entities: EntityMap): number {
  let count = 0;
  for (const key of Object.keys(entities)) {
    const entity = entities[key];
    if (entity && isGameEntity(entity) && entity.entityType === 'coin') {
      count += 1;
    }
  }
  return count;
}
