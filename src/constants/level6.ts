import { clampCameraX, getWorldCenterX } from '../utils/camera';
import type { LevelDef } from './level';

/** Long horizontal route with fast movers and wide patrols. */
export function buildLevel6(groundY: number, viewportWidth: number): LevelDef {
  const playerSpawn = { x: 200, y: groundY - 60 };
  const initialCameraX = clampCameraX(
    playerSpawn.x - viewportWidth / 2,
    viewportWidth,
  );
  const pathCenterX = getWorldCenterX(initialCameraX, viewportWidth);
  const coinHopY = groundY - 50;

  return {
    id: 'level-6',
    playerSpawn,
    platforms: [
      { id: 'l6_platform_start', x: 240, y: groundY, width: 320 },
      { id: 'l6_platform_span_a', x: 560, y: groundY - 35, width: 180 },
      { id: 'l6_platform_span_b', x: 820, y: groundY - 70, width: 200 },
      { id: 'l6_platform_mid', x: 1080, y: groundY - 40, width: 220 },
      { id: 'l6_platform_high', x: 1340, y: groundY - 120, width: 200 },
      { id: 'l6_platform_drop', x: 1580, y: groundY - 55, width: 200 },
      { id: 'l6_platform_climb', x: 1820, y: groundY - 130, width: 200 },
      { id: 'l6_platform_end', x: 2100, y: groundY - 175, width: 280 },
    ],
    movingPlatforms: [
      {
        id: 'l6_platform_moving_a',
        x: 980,
        y: groundY - 200,
        width: 140,
        patrolMinX: 900,
        patrolMaxX: 1080,
        speed: 2,
      },
      {
        id: 'l6_platform_moving_b',
        x: 1680,
        y: groundY - 210,
        width: 140,
        patrolMinX: 1600,
        patrolMaxX: 1780,
        speed: 2.1,
      },
    ],
    coins: [
      { id: 'l6_coin_start_a', x: pathCenterX - 50, y: coinHopY },
      { id: 'l6_coin_start_b', x: pathCenterX, y: coinHopY },
      { id: 'l6_coin_start_c', x: pathCenterX + 50, y: coinHopY },
      { id: 'l6_coin_span_a', x: 560, y: groundY - 83 },
      { id: 'l6_coin_span_b', x: 820, y: groundY - 118 },
      { id: 'l6_coin_moving_a', x: 980, y: groundY - 248 },
      { id: 'l6_coin_mid', x: 1080, y: groundY - 88 },
      { id: 'l6_coin_high', x: 1340, y: groundY - 168 },
      { id: 'l6_coin_drop', x: 1580, y: groundY - 103 },
      { id: 'l6_coin_moving_b', x: 1680, y: groundY - 258 },
      { id: 'l6_coin_climb', x: 1820, y: groundY - 178 },
      { id: 'l6_coin_end', x: 2100, y: groundY - 223 },
    ],
    enemies: [
      {
        id: 'l6_enemy_a',
        x: 480,
        y: groundY - 122,
        patrolMinX: 420,
        patrolMaxX: 560,
      },
      {
        id: 'l6_enemy_b',
        x: 920,
        y: groundY - 122,
        patrolMinX: 860,
        patrolMaxX: 1000,
      },
      {
        id: 'l6_enemy_c',
        x: 1240,
        y: groundY - 122,
        patrolMinX: 1180,
        patrolMaxX: 1320,
      },
      {
        id: 'l6_enemy_d',
        x: 1920,
        y: groundY - 122,
        patrolMinX: 1860,
        patrolMaxX: 2000,
      },
    ],
    jumpPads: [
      { id: 'l6_jump_pad_a', x: 700, y: groundY - 108 },
      { id: 'l6_jump_pad_b', x: 1460, y: groundY - 108 },
    ],
    goal: { id: 'l6_goal_end', x: 2100, y: groundY - 223 },
  };
}
