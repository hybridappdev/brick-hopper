import { createPosition } from '../components/Position';
import { createSprite } from '../components/Sprite';
import { createVelocity } from '../components/Velocity';
import { ParallaxBandRenderer } from '../renderers/ParallaxBandRenderer';
import type { GameEntity } from '../types/ecs';

export interface DecorationSpawnOptions {
  y: number;
  width: number;
  height: number;
  color: string;
  parallaxFactor: number;
}

export type DecorationEntity = GameEntity & {
  entityType: 'decoration';
  parallaxFactor: number;
};

/** Screen-space parallax band (no physics body). */
export function createDecorationEntity({
  y,
  width,
  height,
  color,
  parallaxFactor,
}: DecorationSpawnOptions): DecorationEntity {
  return {
    entityType: 'decoration',
    position: createPosition(0, y),
    velocity: createVelocity(),
    sprite: createSprite(width, height, color),
    parallaxFactor,
    renderer: ParallaxBandRenderer,
  };
}
