import { createPosition } from '../components/Position';
import { createSprite } from '../components/Sprite';
import { createVelocity } from '../components/Velocity';
import {
  getBackgroundScrollWidth,
  PARALLAX_HILLS_FACTOR,
  PARALLAX_SKY_FACTOR,
} from '../constants/background';
import { GroundVignetteRenderer } from '../renderers/GroundVignetteRenderer';
import { ImmersiveBackgroundRenderer } from '../renderers/ImmersiveBackgroundRenderer';
import type { GameEntity, Viewport } from '../types/ecs';

export type BackgroundLayerEntity = GameEntity & {
  entityType: 'decoration';
  parallaxFactor: number;
  layer?: 'sky' | 'hills';
};

function createBackgroundLayer(
  viewport: Viewport,
  parallaxFactor: number,
  layer?: 'sky' | 'hills',
): BackgroundLayerEntity {
  const width = getBackgroundScrollWidth(viewport.width, parallaxFactor);

  return {
    entityType: 'decoration',
    position: createPosition(0, 0),
    velocity: createVelocity(),
    sprite: createSprite(width, viewport.height, 'transparent'),
    parallaxFactor,
    layer,
    renderer: ImmersiveBackgroundRenderer,
  };
}

/** Mario-style parallax: two depths from the sunset artwork + bottom vignette. */
export function createBackgroundEntities(
  viewport: Viewport,
): Record<string, BackgroundLayerEntity> {
  return {
    bg_sunset_sky: createBackgroundLayer(viewport, PARALLAX_SKY_FACTOR, 'sky'),
    bg_sunset_hills: createBackgroundLayer(viewport, PARALLAX_HILLS_FACTOR, 'hills'),
    bg_vignette: {
      entityType: 'decoration',
      position: createPosition(0, viewport.height - 100),
      velocity: createVelocity(),
      sprite: createSprite(viewport.width, 100, 'transparent'),
      parallaxFactor: 0,
      renderer: GroundVignetteRenderer,
    },
  };
}
