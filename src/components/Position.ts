import type { PositionComponent } from '../types/ecs';

export function createPosition(x: number, y: number): PositionComponent {
  return { x, y };
}

export type { PositionComponent };
