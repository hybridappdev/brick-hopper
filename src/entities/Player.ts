import Matter from 'matter-js';
import { createCollider } from '../components/Collider';
import { createPosition } from '../components/Position';
import { createSprite } from '../components/Sprite';
import { createVelocity } from '../components/Velocity';
import {
  AUTO_HOP_INTERVAL_MS,
  COLORS,
  PLAYER_HEIGHT,
  PLAYER_PHYSICS,
  PLAYER_WIDTH,
} from '../constants';
import { EntityRenderer } from '../renderers/EntityRenderer';
import type { GameEntity } from '../types/ecs';

export interface PlayerSpawnOptions {
  x: number;
  y: number;
}

export function createPlayerEntity(
  world: Matter.World,
  { x, y }: PlayerSpawnOptions,
): GameEntity {
  const body = Matter.Bodies.rectangle(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, {
    ...PLAYER_PHYSICS,
    chamfer: { radius: 4 },
  });

  Matter.World.add(world, body);

  return {
    entityType: 'player',
    position: createPosition(body.position.x, body.position.y),
    velocity: createVelocity(),
    sprite: createSprite(PLAYER_WIDTH, PLAYER_HEIGHT, COLORS.player),
    collider: createCollider(body, false),
    isGrounded: false,
    autoHopTimerMs: AUTO_HOP_INTERVAL_MS[1] * 0.55,
    lastHopDirection: 1,
    renderer: EntityRenderer,
  };
}
