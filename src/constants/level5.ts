import { clampCameraX, getWorldCenterX } from '../utils/camera';
import type { LevelDef } from './level';

/** Finale — long route, fast movers, dense patrols. */
export function buildLevel5(groundY: number, viewportWidth: number): LevelDef {
  const playerSpawn = { x: 200, y: groundY - 60 };
  const initialCameraX = clampCameraX(
    playerSpawn.x - viewportWidth / 2,
    viewportWidth,
  );
  const pathCenterX = getWorldCenterX(initialCameraX, viewportWidth);
  const coinHopY = groundY - 50;

  return {
    id: 'level-5',
    playerSpawn,
    platforms: [
      { id: 'l5_platform_start', x: 220, y: groundY, width: 300 },
      { id: 'l5_platform_rise_a', x: 500, y: groundY - 45, width: 150 },
      { id: 'l5_platform_rise_b', x: 700, y: groundY - 95, width: 150 },
      { id: 'l5_platform_rise_c', x: 900, y: groundY - 145, width: 170 },
      { id: 'l5_platform_span', x: 1140, y: groundY - 70, width: 200 },
      { id: 'l5_platform_high', x: 1380, y: groundY - 175, width: 200 },
      { id: 'l5_platform_drop', x: 1620, y: groundY - 95, width: 180 },
      { id: 'l5_platform_climb', x: 1860, y: groundY - 155, width: 180 },
      { id: 'l5_platform_crown', x: 2120, y: groundY - 215, width: 260 },
    ],
    movingPlatforms: [
      {
        id: 'l5_platform_moving_a',
        x: 1050,
        y: groundY - 225,
        width: 130,
        patrolMinX: 960,
        patrolMaxX: 1160,
        speed: 2,
      },
      {
        id: 'l5_platform_moving_b',
        x: 1520,
        y: groundY - 255,
        width: 130,
        patrolMinX: 1440,
        patrolMaxX: 1620,
        speed: 2.1,
      },
      {
        id: 'l5_platform_moving_c',
        x: 1980,
        y: groundY - 195,
        width: 130,
        patrolMinX: 1900,
        patrolMaxX: 2080,
        speed: 2.2,
      },
    ],
    coins: [
      { id: 'l5_coin_start_a', x: pathCenterX - 50, y: coinHopY },
      { id: 'l5_coin_start_b', x: pathCenterX, y: coinHopY },
      { id: 'l5_coin_start_c', x: pathCenterX + 50, y: coinHopY },
      { id: 'l5_coin_rise_a', x: 500, y: groundY - 93 },
      { id: 'l5_coin_rise_b', x: 700, y: groundY - 143 },
      { id: 'l5_coin_rise_c', x: 900, y: groundY - 193 },
      { id: 'l5_coin_moving_a', x: 1050, y: groundY - 273 },
      { id: 'l5_coin_span', x: 1140, y: groundY - 118 },
      { id: 'l5_coin_high', x: 1380, y: groundY - 223 },
      { id: 'l5_coin_moving_b', x: 1520, y: groundY - 303 },
      { id: 'l5_coin_drop', x: 1620, y: groundY - 143 },
      { id: 'l5_coin_climb', x: 1860, y: groundY - 203 },
      { id: 'l5_coin_moving_c', x: 1980, y: groundY - 243 },
      { id: 'l5_coin_crown', x: 2120, y: groundY - 263 },
    ],
    enemies: [
      {
        id: 'l5_enemy_a',
        x: 420,
        y: groundY - 122,
        patrolMinX: 360,
        patrolMaxX: 500,
      },
      {
        id: 'l5_enemy_b',
        x: 820,
        y: groundY - 122,
        patrolMinX: 760,
        patrolMaxX: 900,
      },
      {
        id: 'l5_enemy_c',
        x: 1280,
        y: groundY - 122,
        patrolMinX: 1220,
        patrolMaxX: 1360,
      },
      {
        id: 'l5_enemy_d',
        x: 1720,
        y: groundY - 122,
        patrolMinX: 1660,
        patrolMaxX: 1800,
      },
      {
        id: 'l5_enemy_e',
        x: 2020,
        y: groundY - 122,
        patrolMinX: 1960,
        patrolMaxX: 2100,
      },
    ],
    jumpPads: [
      { id: 'l5_jump_pad_a', x: 600, y: groundY - 108 },
      { id: 'l5_jump_pad_b', x: 1240, y: groundY - 108 },
      { id: 'l5_jump_pad_c', x: 1740, y: groundY - 108 },
    ],
    goal: { id: 'l5_goal_end', x: 2120, y: groundY - 263 },
  };
}
