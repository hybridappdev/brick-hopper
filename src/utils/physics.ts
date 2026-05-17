import Matter from 'matter-js';
import { GRAVITY_Y } from '../constants';
import type { PhysicsContext, Viewport } from '../types/ecs';

export function createPhysicsContext(viewport: Viewport): PhysicsContext {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.gravity.y = GRAVITY_Y;

  return {
    engine,
    world: engine.world,
    viewport,
    input: { tiltX: 0, hopSpeed: 1 },
    camera: { x: 0 },
    score: 0,
    playerSpawn: { x: 0, y: 0 },
    checkpoint: { x: 0, y: 0 },
    collisionHandlersRegistered: false,
    interactionHandlersRegistered: false,
    totalCoins: 0,
    levelComplete: false,
  };
}

export function getPhysicsContext(entities: Record<string, unknown>): PhysicsContext {
  const physicsEntity = entities.physics as { physics: PhysicsContext };
  return physicsEntity.physics;
}
