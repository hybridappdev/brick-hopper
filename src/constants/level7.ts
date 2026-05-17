import { clampCameraX, getWorldCenterX } from '../utils/camera';
import type { LevelDef } from './level';

/** Vertical zigzag tower with three jump pads. */
export function buildLevel7(groundY: number, viewportWidth: number): LevelDef {
  const playerSpawn = { x: 180, y: groundY - 60 };
  const initialCameraX = clampCameraX(
    playerSpawn.x - viewportWidth / 2,
    viewportWidth,
  );
  const pathCenterX = getWorldCenterX(initialCameraX, viewportWidth);
  const coinHopY = groundY - 50;

  return {
    id: 'level-7',
    playerSpawn,
    platforms: [
      { id: 'l7_platform_start', x: 200, y: groundY, width: 280 },
      { id: 'l7_platform_zig_a', x: 440, y: groundY - 50, width: 150 },
      { id: 'l7_platform_zig_b', x: 620, y: groundY - 100, width: 150 },
      { id: 'l7_platform_zig_c', x: 800, y: groundY - 150, width: 160 },
      { id: 'l7_platform_zig_d', x: 1000, y: groundY - 95, width: 160 },
      { id: 'l7_platform_zig_e', x: 1180, y: groundY - 155, width: 180 },
      { id: 'l7_platform_zig_f', x: 1380, y: groundY - 80, width: 180 },
      { id: 'l7_platform_peak', x: 1600, y: groundY - 190, width: 200 },
      { id: 'l7_platform_end', x: 1880, y: groundY - 140, width: 260 },
    ],
    movingPlatforms: [
      {
        id: 'l7_platform_lift',
        x: 1280,
        y: groundY - 250,
        width: 130,
        patrolMinX: 1200,
        patrolMaxX: 1380,
        speed: 1.8,
      },
    ],
    coins: [
      { id: 'l7_coin_start_a', x: pathCenterX - 50, y: coinHopY },
      { id: 'l7_coin_start_b', x: pathCenterX, y: coinHopY },
      { id: 'l7_coin_start_c', x: pathCenterX + 50, y: coinHopY },
      { id: 'l7_coin_zig_a', x: 440, y: groundY - 98 },
      { id: 'l7_coin_zig_b', x: 620, y: groundY - 148 },
      { id: 'l7_coin_zig_c', x: 800, y: groundY - 198 },
      { id: 'l7_coin_zig_d', x: 1000, y: groundY - 143 },
      { id: 'l7_coin_lift', x: 1280, y: groundY - 298 },
      { id: 'l7_coin_zig_e', x: 1180, y: groundY - 203 },
      { id: 'l7_coin_peak', x: 1600, y: groundY - 238 },
      { id: 'l7_coin_end', x: 1880, y: groundY - 188 },
    ],
    enemies: [
      {
        id: 'l7_enemy_a',
        x: 520,
        y: groundY - 122,
        patrolMinX: 460,
        patrolMaxX: 580,
      },
      {
        id: 'l7_enemy_b',
        x: 920,
        y: groundY - 122,
        patrolMinX: 860,
        patrolMaxX: 980,
      },
      {
        id: 'l7_enemy_c',
        x: 1320,
        y: groundY - 122,
        patrolMinX: 1260,
        patrolMaxX: 1380,
      },
      {
        id: 'l7_enemy_d',
        x: 1720,
        y: groundY - 122,
        patrolMinX: 1660,
        patrolMaxX: 1800,
      },
    ],
    jumpPads: [
      { id: 'l7_jump_pad_a', x: 360, y: groundY - 108 },
      { id: 'l7_jump_pad_b', x: 900, y: groundY - 108 },
      { id: 'l7_jump_pad_c', x: 1500, y: groundY - 108 },
    ],
    goal: { id: 'l7_goal_end', x: 1880, y: groundY - 188 },
  };
}
