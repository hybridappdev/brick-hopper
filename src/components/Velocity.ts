import type { VelocityComponent } from '../types/ecs';

export function createVelocity(x = 0, y = 0): VelocityComponent {
  return { x, y };
}

export type { VelocityComponent };
