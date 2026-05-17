import Matter from 'matter-js';
import { createCollider } from '../components/Collider';
import { createPosition } from '../components/Position';
import { createSprite } from '../components/Sprite';
import { createVelocity } from '../components/Velocity';
import {
  COLORS,
  ENEMY_HEIGHT,
  ENEMY_PATROL_SPEED,
  ENEMY_WIDTH,
} from '../constants';
import { EntityRenderer } from '../renderers/EntityRenderer';
import type { GameEntity, PatrolComponent } from '../types/ecs';

export interface EnemySpawnOptions {
  x: number;
  y: number;
  patrolMinX: number;
  patrolMaxX: number;
  speed?: number;
}

export type EnemyEntity = GameEntity & {
  entityType: 'enemy';
  patrol: PatrolComponent;
};

export function createEnemyEntity(
  world: Matter.World,
  {
    x,
    y,
    patrolMinX,
    patrolMaxX,
    speed = ENEMY_PATROL_SPEED,
  }: EnemySpawnOptions,
): EnemyEntity {
  const body = Matter.Bodies.rectangle(x, y, ENEMY_WIDTH, ENEMY_HEIGHT, {
    isStatic: true,
    label: 'enemy',
  });

  Matter.World.add(world, body);

  const direction: 1 | -1 = patrolMinX < x ? 1 : -1;

  return {
    entityType: 'enemy',
    position: createPosition(body.position.x, body.position.y),
    velocity: createVelocity(),
    sprite: createSprite(ENEMY_WIDTH, ENEMY_HEIGHT, COLORS.enemy),
    collider: createCollider(body, true),
    patrol: {
      minX: patrolMinX,
      maxX: patrolMaxX,
      speed,
      direction,
    },
    renderer: EntityRenderer,
  };
}
