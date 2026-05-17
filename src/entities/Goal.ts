import Matter from 'matter-js';
import { createCollider } from '../components/Collider';
import { createPosition } from '../components/Position';
import { createSprite } from '../components/Sprite';
import { createVelocity } from '../components/Velocity';
import { COLORS } from '../constants';
import { EntityRenderer } from '../renderers/EntityRenderer';
import type { GameEntity } from '../types/ecs';

export interface GoalSpawnOptions {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export type GoalEntity = GameEntity & {
  entityType: 'goal';
  goalReady: boolean;
};

const DEFAULT_WIDTH = 48;
const DEFAULT_HEIGHT = 64;

export function createGoalEntity(
  world: Matter.World,
  { x, y, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }: GoalSpawnOptions,
): GoalEntity {
  const body = Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    isSensor: true,
    label: 'goal',
  });

  Matter.World.add(world, body);

  return {
    entityType: 'goal',
    position: createPosition(body.position.x, body.position.y),
    velocity: createVelocity(),
    sprite: createSprite(width, height, COLORS.goalInactive),
    collider: createCollider(body, true),
    goalReady: false,
    renderer: EntityRenderer,
  };
}
