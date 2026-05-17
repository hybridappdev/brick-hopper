import Matter from 'matter-js';
import { createCollider } from '../components/Collider';
import { createPosition } from '../components/Position';
import { createSprite } from '../components/Sprite';
import { createVelocity } from '../components/Velocity';
import {
  COLORS,
  JUMP_PAD_FORCE,
  JUMP_PAD_HEIGHT,
  JUMP_PAD_WIDTH,
} from '../constants';
import { EntityRenderer } from '../renderers/EntityRenderer';
import type { GameEntity } from '../types/ecs';

export interface JumpPadSpawnOptions {
  x: number;
  y: number;
  jumpForce?: number;
}

export type JumpPadEntity = GameEntity & {
  entityType: 'jumpPad';
  jumpForce: number;
};

export function createJumpPadEntity(
  world: Matter.World,
  { x, y, jumpForce = JUMP_PAD_FORCE }: JumpPadSpawnOptions,
): JumpPadEntity {
  const body = Matter.Bodies.rectangle(x, y, JUMP_PAD_WIDTH, JUMP_PAD_HEIGHT, {
    isStatic: true,
    isSensor: true,
    label: 'jumpPad',
  });

  Matter.World.add(world, body);

  return {
    entityType: 'jumpPad',
    position: createPosition(body.position.x, body.position.y),
    velocity: createVelocity(),
    sprite: createSprite(JUMP_PAD_WIDTH, JUMP_PAD_HEIGHT, COLORS.jumpPad),
    collider: createCollider(body, true),
    jumpForce,
    renderer: EntityRenderer,
  };
}
