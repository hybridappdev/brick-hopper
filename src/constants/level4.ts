import { clampCameraX, getWorldCenterX } from '../utils/camera';
import type { LevelDef } from './level';

/** Tall stacks with two moving lifts and extra jump pads. */
export function buildLevel4(groundY: number, viewportWidth: number): LevelDef {
  const playerSpawn = { x: 180, y: groundY - 60 };
  const initialCameraX = clampCameraX(
    playerSpawn.x - viewportWidth / 2,
    viewportWidth,
  );
  const pathCenterX = getWorldCenterX(initialCameraX, viewportWidth);
  const coinHopY = groundY - 50;

  return {
    id: 'level-4',
    playerSpawn,
    platforms: [
      { id: 'l4_platform_start', x: 200, y: groundY, width: 260 },
      { id: 'l4_platform_tower_a', x: 460, y: groundY - 55, width: 140 },
      { id: 'l4_platform_tower_b', x: 620, y: groundY - 110, width: 140 },
      { id: 'l4_platform_tower_c', x: 780, y: groundY - 165, width: 160 },
      { id: 'l4_platform_ledge', x: 980, y: groundY - 80, width: 180 },
      { id: 'l4_platform_mid', x: 1200, y: groundY - 140, width: 200 },
      { id: 'l4_platform_span', x: 1460, y: groundY - 60, width: 220 },
      { id: 'l4_platform_peak', x: 1720, y: groundY - 190, width: 200 },
      { id: 'l4_platform_end', x: 2000, y: groundY - 120, width: 260 },
    ],
    movingPlatforms: [
      {
        id: 'l4_platform_lift_a',
        x: 900,
        y: groundY - 235,
        width: 130,
        patrolMinX: 840,
        patrolMaxX: 1020,
        speed: 1.5,
      },
      {
        id: 'l4_platform_lift_b',
        x: 1580,
        y: groundY - 175,
        width: 130,
        patrolMinX: 1500,
        patrolMaxX: 1680,
        speed: 1.9,
      },
    ],
    coins: [
      { id: 'l4_coin_start_a', x: pathCenterX - 50, y: coinHopY },
      { id: 'l4_coin_start_b', x: pathCenterX, y: coinHopY },
      { id: 'l4_coin_start_c', x: pathCenterX + 50, y: coinHopY },
      { id: 'l4_coin_tower_a', x: 460, y: groundY - 103 },
      { id: 'l4_coin_tower_b', x: 620, y: groundY - 158 },
      { id: 'l4_coin_tower_c', x: 780, y: groundY - 213 },
      { id: 'l4_coin_lift', x: 900, y: groundY - 283 },
      { id: 'l4_coin_mid', x: 1200, y: groundY - 188 },
      { id: 'l4_coin_span', x: 1460, y: groundY - 108 },
      { id: 'l4_coin_peak', x: 1720, y: groundY - 238 },
      { id: 'l4_coin_end', x: 2000, y: groundY - 168 },
    ],
    enemies: [
      {
        id: 'l4_enemy_a',
        x: 540,
        y: groundY - 122,
        patrolMinX: 480,
        patrolMaxX: 600,
      },
      {
        id: 'l4_enemy_b',
        x: 1080,
        y: groundY - 122,
        patrolMinX: 1020,
        patrolMaxX: 1160,
      },
      {
        id: 'l4_enemy_c',
        x: 1380,
        y: groundY - 122,
        patrolMinX: 1320,
        patrolMaxX: 1460,
      },
      {
        id: 'l4_enemy_d',
        x: 1880,
        y: groundY - 122,
        patrolMinX: 1820,
        patrolMaxX: 1960,
      },
    ],
    jumpPads: [
      { id: 'l4_jump_pad_a', x: 380, y: groundY - 108 },
      { id: 'l4_jump_pad_b', x: 1080, y: groundY - 108 },
      { id: 'l4_jump_pad_c', x: 1640, y: groundY - 108 },
    ],
  };
}
