import { ENEMY_PATROL_SPEED } from '../constants';
import { buildLevel } from '../constants/levels';
import { createBackgroundEntities } from '../entities/Background';
import { createCoinEntity } from '../entities/Coin';
import { createEnemyEntity } from '../entities/Enemy';
import { createJumpPadEntity } from '../entities/JumpPad';
import { createPlatformEntity } from '../entities/Platform';
import { createPlayerEntity } from '../entities/Player';
import type { EntityMap, PhysicsContext } from '../types/ecs';
import { clampCameraX, getWorldCenterX } from './camera';

export function createInitialEntities(physics: PhysicsContext): EntityMap {
  const { height: viewportHeight, width: viewportWidth } = physics.viewport;
  const groundY = viewportHeight - 120;
  const level = buildLevel(physics.levelIndex, groundY, viewportWidth);

  physics.playerSpawn = { ...level.playerSpawn };
  physics.camera.x = clampCameraX(
    level.playerSpawn.x - viewportWidth / 2,
    viewportWidth,
  );
  physics.checkpoint = {
    ...level.playerSpawn,
    cameraX: physics.camera.x,
  };
  physics.totalCoins = level.coins.length;
  physics.levelComplete = false;
  physics.elapsedMs = 0;
  physics.interactionHandlersRegistered = false;

  const entities: EntityMap = {
    physics: { physics },
    ...createBackgroundEntities(
      physics.viewport,
      physics.displayAmbient,
      physics.ambience,
    ),
  };

  for (const platform of level.platforms) {
    entities[platform.id] = createPlatformEntity(physics.world, {
      x: platform.x,
      y: platform.y,
      width: platform.width,
    });
  }

  for (const moving of level.movingPlatforms) {
    entities[moving.id] = createPlatformEntity(physics.world, {
      x: moving.x,
      y: moving.y,
      width: moving.width,
      patrol: {
        minX: moving.patrolMinX,
        maxX: moving.patrolMaxX,
        speed: moving.speed ?? ENEMY_PATROL_SPEED,
      },
    });
  }

  for (const coin of level.coins) {
    entities[coin.id] = createCoinEntity(physics.world, {
      x: coin.x,
      y: coin.y,
    });
  }

  for (const enemy of level.enemies) {
    entities[enemy.id] = createEnemyEntity(physics.world, {
      x: enemy.x,
      y: enemy.y,
      patrolMinX: enemy.patrolMinX,
      patrolMaxX: enemy.patrolMaxX,
    });
  }

  for (const pad of level.jumpPads) {
    entities[pad.id] = createJumpPadEntity(physics.world, {
      x: pad.x,
      y: pad.y,
    });
  }

  const spawnY = level.playerSpawn.y;
  const centerX = getWorldCenterX(physics.camera.x, viewportWidth);
  entities.player = createPlayerEntity(physics.world, { x: centerX, y: spawnY });

  return entities;
}
