import { clampCameraX, getWorldCenterX } from '../utils/camera';
import type { LevelDef } from './level';

/** Wide gaps and three enemies — rewards careful hops. */
export function buildLevel3(groundY: number, viewportWidth: number): LevelDef {
  const playerSpawn = { x: 200, y: groundY - 60 };
  const initialCameraX = clampCameraX(
    playerSpawn.x - viewportWidth / 2,
    viewportWidth,
  );
  const pathCenterX = getWorldCenterX(initialCameraX, viewportWidth);
  const coinHopY = groundY - 50;

  return {
    id: 'level-3',
    playerSpawn,
    platforms: [
      { id: 'l3_platform_start', x: 220, y: groundY, width: 280 },
      { id: 'l3_platform_gap_a', x: 560, y: groundY - 35, width: 150 },
      { id: 'l3_platform_gap_b', x: 780, y: groundY - 75, width: 160 },
      { id: 'l3_platform_mid', x: 1000, y: groundY - 115, width: 200 },
      { id: 'l3_platform_bridge', x: 1260, y: groundY - 45, width: 200 },
      { id: 'l3_platform_high', x: 1520, y: groundY - 165, width: 220 },
      { id: 'l3_platform_drop', x: 1780, y: groundY - 85, width: 180 },
      { id: 'l3_platform_end', x: 2050, y: groundY - 195, width: 240 },
    ],
    movingPlatforms: [
      {
        id: 'l3_platform_moving',
        x: 1120,
        y: groundY - 210,
        width: 130,
        patrolMinX: 1040,
        patrolMaxX: 1220,
        speed: 1.7,
      },
    ],
    coins: [
      { id: 'l3_coin_start_a', x: pathCenterX - 50, y: coinHopY },
      { id: 'l3_coin_start_b', x: pathCenterX, y: coinHopY },
      { id: 'l3_coin_start_c', x: pathCenterX + 50, y: coinHopY },
      { id: 'l3_coin_gap_a', x: 560, y: groundY - 83 },
      { id: 'l3_coin_gap_b', x: 780, y: groundY - 123 },
      { id: 'l3_coin_moving', x: 1120, y: groundY - 258 },
      { id: 'l3_coin_mid', x: 1000, y: groundY - 163 },
      { id: 'l3_coin_bridge', x: 1260, y: groundY - 93 },
      { id: 'l3_coin_high', x: 1520, y: groundY - 213 },
      { id: 'l3_coin_drop', x: 1780, y: groundY - 133 },
      { id: 'l3_coin_end', x: 2050, y: groundY - 243 },
    ],
    enemies: [
      {
        id: 'l3_enemy_a',
        x: 480,
        y: groundY - 122,
        patrolMinX: 420,
        patrolMaxX: 540,
      },
      {
        id: 'l3_enemy_b',
        x: 920,
        y: groundY - 122,
        patrolMinX: 860,
        patrolMaxX: 1000,
      },
      {
        id: 'l3_enemy_c',
        x: 1680,
        y: groundY - 122,
        patrolMinX: 1620,
        patrolMaxX: 1760,
      },
    ],
    jumpPads: [
      { id: 'l3_jump_pad_a', x: 680, y: groundY - 108 },
      { id: 'l3_jump_pad_b', x: 1380, y: groundY - 108 },
    ],
    goal: { id: 'l3_goal_end', x: 2050, y: groundY - 243 },
  };
}
