import Matter from 'matter-js';
import type { PhysicsContext } from '../types/ecs';

/** Clears Matter bodies, events, and engine state before a full game reset. */
export function teardownPhysics(physics: PhysicsContext): void {
  (physics.engine as Matter.Engine & { events?: Record<string, unknown> }).events = {};
  Matter.World.clear(physics.world, false);
  Matter.Engine.clear(physics.engine);
}
