import { clampCameraX, getWorldCenterX } from '../utils/camera';
import type { LevelDef } from './level';

/** Final gauntlet — dense coins, enemies, and fast movers. */
export function buildLevel8(groundY: number, viewportWidth: number): LevelDef {
  const playerSpawn = { x: 200, y: groundY - 60 };
  const initialCameraX = clampCameraX(
    playerSpawn.x - viewportWidth / 2,
    viewportWidth,
  );
  const pathCenterX = getWorldCenterX(initialCameraX, viewportWidth);
  const coinHopY = groundY - 50;

  return {
    id: 'level-8',
    playerSpawn,
    platforms: [
      { id: 'l8_platform_start', x: 220, y: groundY, width: 300 },
      { id: 'l8_platform_rise_a', x: 500, y: groundY - 40, width: 150 },
      { id: 'l8_platform_rise_b', x: 700, y: groundY - 90, width: 150 },
      { id: 'l8_platform_rise_c', x: 900, y: groundY - 140, width: 170 },
      { id: 'l8_platform_span', x: 1140, y: groundY - 65, width: 200 },
      { id: 'l8_platform_high', x: 1380, y: groundY - 180, width: 200 },
      { id: 'l8_platform_drop', x: 1620, y: groundY - 90, width: 180 },
      { id: 'l8_platform_climb', x: 1860, y: groundY - 160, width: 180 },
      { id: 'l8_platform_crown', x: 2180, y: groundY - 220, width: 280 },
    ],
    movingPlatforms: [
      {
        id: 'l8_platform_moving_a',
        x: 1050,
        y: groundY - 230,
        width: 130,
        patrolMinX: 960,
        patrolMaxX: 1160,
        speed: 2.1,
      },
      {
        id: 'l8_platform_moving_b',
        x: 1520,
        y: groundY - 260,
        width: 130,
        patrolMinX: 1440,
        patrolMaxX: 1620,
        speed: 2.2,
      },
      {
        id: 'l8_platform_moving_c',
        x: 2040,
        y: groundY - 200,
        width: 130,
        patrolMinX: 1960,
        patrolMaxX: 2140,
        speed: 2.3,
      },
    ],
    coins: [
      { id: 'l8_coin_start_a', x: pathCenterX - 50, y: coinHopY },
      { id: 'l8_coin_start_b', x: pathCenterX, y: coinHopY },
      { id: 'l8_coin_start_c', x: pathCenterX + 50, y: coinHopY },
      { id: 'l8_coin_rise_a', x: 500, y: groundY - 88 },
      { id: 'l8_coin_rise_b', x: 700, y: groundY - 138 },
      { id: 'l8_coin_rise_c', x: 900, y: groundY - 188 },
      { id: 'l8_coin_moving_a', x: 1050, y: groundY - 278 },
      { id: 'l8_coin_span', x: 1140, y: groundY - 113 },
      { id: 'l8_coin_high', x: 1380, y: groundY - 228 },
      { id: 'l8_coin_moving_b', x: 1520, y: groundY - 308 },
      { id: 'l8_coin_drop', x: 1620, y: groundY - 138 },
      { id: 'l8_coin_climb', x: 1860, y: groundY - 208 },
      { id: 'l8_coin_moving_c', x: 2040, y: groundY - 248 },
      { id: 'l8_coin_crown_a', x: 2120, y: groundY - 268 },
      { id: 'l8_coin_crown_b', x: 2180, y: groundY - 268 },
      { id: 'l8_coin_crown_c', x: 2240, y: groundY - 268 },
    ],
    enemies: [
      {
        id: 'l8_enemy_a',
        x: 420,
        y: groundY - 122,
        patrolMinX: 360,
        patrolMaxX: 500,
      },
      {
        id: 'l8_enemy_b',
        x: 820,
        y: groundY - 122,
        patrolMinX: 760,
        patrolMaxX: 900,
      },
      {
        id: 'l8_enemy_c',
        x: 1280,
        y: groundY - 122,
        patrolMinX: 1220,
        patrolMaxX: 1360,
      },
      {
        id: 'l8_enemy_d',
        x: 1720,
        y: groundY - 122,
        patrolMinX: 1660,
        patrolMaxX: 1800,
      },
      {
        id: 'l8_enemy_e',
        x: 2080,
        y: groundY - 122,
        patrolMinX: 2020,
        patrolMaxX: 2160,
      },
    ],
    jumpPads: [
      { id: 'l8_jump_pad_a', x: 600, y: groundY - 108 },
      { id: 'l8_jump_pad_b', x: 1240, y: groundY - 108 },
      { id: 'l8_jump_pad_c', x: 1740, y: groundY - 108 },
    ],
    goal: { id: 'l8_goal_end', x: 2180, y: groundY - 268 },
  };
}
