import { clampCameraX, getWorldCenterX } from '../utils/camera';
import type { LevelDef } from './level';

/** Stair-step layout with two moving platforms — harder than level 1. */
export function buildLevel2(groundY: number, viewportWidth: number): LevelDef {
  const playerSpawn = { x: 200, y: groundY - 60 };
  const initialCameraX = clampCameraX(
    playerSpawn.x - viewportWidth / 2,
    viewportWidth,
  );
  const pathCenterX = getWorldCenterX(initialCameraX, viewportWidth);
  const coinHopY = groundY - 50;

  return {
    id: 'level-2',
    playerSpawn,
    platforms: [
      { id: 'l2_platform_start', x: 220, y: groundY, width: 300 },
      { id: 'l2_platform_step_a', x: 520, y: groundY - 40, width: 160 },
      { id: 'l2_platform_step_b', x: 720, y: groundY - 85, width: 180 },
      { id: 'l2_platform_mid', x: 920, y: groundY - 125, width: 200 },
      { id: 'l2_platform_bridge', x: 1150, y: groundY - 55, width: 220 },
      { id: 'l2_platform_high', x: 1400, y: groundY - 155, width: 200 },
      { id: 'l2_platform_far', x: 1650, y: groundY - 95, width: 240 },
      { id: 'l2_platform_end', x: 1950, y: groundY - 185, width: 220 },
    ],
    movingPlatforms: [
      {
        id: 'l2_platform_moving_a',
        x: 850,
        y: groundY - 200,
        width: 140,
        patrolMinX: 780,
        patrolMaxX: 950,
        speed: 1.6,
      },
      {
        id: 'l2_platform_moving_b',
        x: 1750,
        y: groundY - 135,
        width: 140,
        patrolMinX: 1680,
        patrolMaxX: 1850,
        speed: 1.8,
      },
    ],
    coins: [
      { id: 'l2_coin_start_a', x: pathCenterX - 50, y: coinHopY },
      { id: 'l2_coin_start_b', x: pathCenterX, y: coinHopY },
      { id: 'l2_coin_start_c', x: pathCenterX + 50, y: coinHopY },
      { id: 'l2_coin_step_a', x: 520, y: groundY - 88 },
      { id: 'l2_coin_step_b', x: 720, y: groundY - 133 },
      { id: 'l2_coin_moving', x: 850, y: groundY - 248 },
      { id: 'l2_coin_mid', x: 920, y: groundY - 173 },
      { id: 'l2_coin_bridge', x: 1150, y: groundY - 103 },
      { id: 'l2_coin_high', x: 1400, y: groundY - 203 },
      { id: 'l2_coin_moving_b', x: 1750, y: groundY - 183 },
      { id: 'l2_coin_end', x: 1950, y: groundY - 233 },
    ],
    enemies: [
      {
        id: 'l2_enemy_a',
        x: 600,
        y: groundY - 122,
        patrolMinX: 550,
        patrolMaxX: 700,
      },
      {
        id: 'l2_enemy_b',
        x: 1100,
        y: groundY - 122,
        patrolMinX: 1050,
        patrolMaxX: 1200,
      },
      {
        id: 'l2_enemy_c',
        x: 1550,
        y: groundY - 122,
        patrolMinX: 1500,
        patrolMaxX: 1650,
      },
    ],
    jumpPads: [
      { id: 'l2_jump_pad_a', x: 650, y: groundY - 108 },
      { id: 'l2_jump_pad_b', x: 1280, y: groundY - 108 },
    ],
  };
}
