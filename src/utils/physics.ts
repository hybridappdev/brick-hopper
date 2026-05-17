import Matter from 'matter-js';
import { GRAVITY_Y } from '../constants';
import { LIVES_PER_RUN } from '../constants/world';
import type { AmbienceSettings } from '../constants/ambienceDefaults';
import { DEFAULT_AMBIENCE } from '../constants/ambienceDefaults';
import type { PhysicsContext, Viewport } from '../types/ecs';
import { computeAmbient } from './ambient';

export function createPhysicsContext(
  viewport: Viewport,
  levelIndex = 0,
  initialScore = 0,
  ambientClockMs = 0,
  ambience: AmbienceSettings = DEFAULT_AMBIENCE,
): PhysicsContext {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.gravity.y = GRAVITY_Y;
  const ambient = computeAmbient(ambientClockMs, ambience);

  return {
    engine,
    world: engine.world,
    viewport,
    input: { tiltX: 0, hopSpeed: 1 },
    camera: { x: 0 },
    score: initialScore,
    playerSpawn: { x: 0, y: 0 },
    checkpoint: { x: 0, y: 0 },
    interactionHandlersRegistered: false,
    totalCoins: 0,
    coinsCleared: false,
    levelComplete: false,
    gameOver: false,
    lives: LIVES_PER_RUN,
    maxLives: LIVES_PER_RUN,
    levelIndex,
    elapsedMs: 0,
    ambientClockMs,
    ambience,
    ambient,
    displayAmbient: ambient,
  };
}

export function getPhysicsContext(entities: Record<string, unknown>): PhysicsContext {
  const physicsEntity = entities.physics as { physics: PhysicsContext };
  return physicsEntity.physics;
}
