import Matter from 'matter-js';
import { createCollider } from '../components/Collider';
import { createPosition } from '../components/Position';
import { createSprite } from '../components/Sprite';
import { createVelocity } from '../components/Velocity';
import {
  COLORS,
  ENEMY_PATROL_SPEED,
  PLATFORM_HEIGHT,
  PLATFORM_WIDTH,
} from '../constants';
import { EntityRenderer } from '../renderers/EntityRenderer';
import type { GameEntity, PatrolComponent } from '../types/ecs';

export interface PlatformSpawnOptions {
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  patrol?: { minX: number; maxX: number; speed?: number };
}

export function createPlatformEntity(
  world: Matter.World,
  {
    x,
    y,
    width = PLATFORM_WIDTH,
    height = PLATFORM_HEIGHT,
    color = COLORS.platform,
    patrol,
  }: PlatformSpawnOptions,
): GameEntity {
  const body = Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    friction: 0.8,
    label: 'platform',
  });

  Matter.World.add(world, body);

  const entity: GameEntity = {
    entityType: 'platform',
    position: createPosition(body.position.x, body.position.y),
    velocity: createVelocity(),
    sprite: createSprite(width, height, color),
    collider: createCollider(body, true),
    renderer: EntityRenderer,
  };

  if (patrol) {
    const direction: 1 | -1 = patrol.minX < x ? 1 : -1;
    entity.patrol = {
      minX: patrol.minX,
      maxX: patrol.maxX,
      speed: patrol.speed ?? ENEMY_PATROL_SPEED,
      direction,
    };
  }

  return entity;
}
