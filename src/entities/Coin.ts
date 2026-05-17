import Matter from 'matter-js';
import { createCollider } from '../components/Collider';
import { createPosition } from '../components/Position';
import { createSprite } from '../components/Sprite';
import { createVelocity } from '../components/Velocity';
import { COIN_RADIUS, COIN_VALUE, COLORS } from '../constants';
import { EntityRenderer } from '../renderers/EntityRenderer';
import type { GameEntity } from '../types/ecs';

export interface CoinSpawnOptions {
  x: number;
  y: number;
  value?: number;
}

export type CoinEntity = GameEntity & { entityType: 'coin'; value: number };

export function createCoinEntity(
  world: Matter.World,
  { x, y, value = COIN_VALUE }: CoinSpawnOptions,
): CoinEntity {
  const diameter = COIN_RADIUS * 2;
  const body = Matter.Bodies.circle(x, y, COIN_RADIUS, {
    isStatic: true,
    isSensor: true,
    label: 'coin',
  });

  Matter.World.add(world, body);

  return {
    entityType: 'coin',
    position: createPosition(body.position.x, body.position.y),
    velocity: createVelocity(),
    sprite: createSprite(diameter, diameter, COLORS.coin),
    collider: createCollider(body, true),
    value,
    collected: false,
    renderer: EntityRenderer,
  };
}
