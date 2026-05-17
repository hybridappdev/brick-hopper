import Matter from 'matter-js';
import { GRAVITY_Y } from '../constants';
import type { PhysicsContext, Viewport } from '../types/ecs';
import { computeAmbient } from './ambient';

export function createPhysicsContext(
  viewport: Viewport,
  levelIndex = 0,
  initialScore = 0,
  ambientClockMs = 0,
): PhysicsContext {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.gravity.y = GRAVITY_Y;

  return {
    engine,
    world: engine.world,
    viewport,
    input: { tiltX: 0, hopSpeed: 1 },
    camera: { x: 0 },
    score: initialScore,
    playerSpawn: { x: 0, y: 0 },
    checkpoint: { x: 0, y: 0 },
    collisionHandlersRegistered: false,
    interactionHandlersRegistered: false,
    totalCoins: 0,
    levelComplete: false,
    levelIndex,
    elapsedMs: 0,
    ambientClockMs,
    ambient: computeAmbient(ambientClockMs),
  };
}

export function getPhysicsContext(entities: Record<string, unknown>): PhysicsContext {
  const physicsEntity = entities.physics as { physics: PhysicsContext };
  return physicsEntity.physics;
}
