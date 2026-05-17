import type { SpriteComponent } from '../types/ecs';

export function createSprite(
  width: number,
  height: number,
  color: string,
): SpriteComponent {
  return { width, height, color };
}

export type { SpriteComponent };
