import type Matter from 'matter-js';
import type { ColliderComponent } from '../types/ecs';

export function createCollider(body: Matter.Body, isStatic: boolean): ColliderComponent {
  return { body, isStatic };
}

export type { ColliderComponent };
