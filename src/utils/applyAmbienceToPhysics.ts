import type { AmbienceSettings } from '../constants/ambienceDefaults';
import type { AmbientSnapshot, EntityMap, PhysicsContext } from '../types/ecs';
import { isGameEntity } from '../types/ecs';
import { computeAmbient } from './ambient';
import { smoothAmbient } from './smoothAmbient';

/** Applies saved ambience settings to the live physics / background state. */
export function applyAmbienceToPhysics(
  physics: PhysicsContext,
  ambience: AmbienceSettings,
  options?: { snapDisplay?: boolean; smoothFactor?: number },
): void {
  physics.ambience = ambience;
  const target = computeAmbient(physics.ambientClockMs, ambience);
  physics.ambient = target;

  if (options?.snapDisplay) {
    physics.displayAmbient = target;
  } else if (options?.smoothFactor !== undefined) {
    physics.displayAmbient = smoothAmbient(
      physics.displayAmbient,
      target,
      options.smoothFactor,
    );
  }
}

export function syncBackgroundAmbient(
  entities: EntityMap,
  ambient: AmbientSnapshot,
  ambience?: AmbienceSettings,
): void {
  for (const key of Object.keys(entities)) {
    if (!key.startsWith('bg_')) {
      continue;
    }
    const entity = entities[key];
    if (entity && isGameEntity(entity)) {
      entity.ambient = ambient;
      if (ambience !== undefined) {
        entity.ambience = ambience;
      }
    }
  }
}
