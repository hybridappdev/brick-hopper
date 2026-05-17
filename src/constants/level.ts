export interface PlatformDef {
  id: string;
  x: number;
  y: number;
  width?: number;
}

export interface MovingPlatformDef extends PlatformDef {
  patrolMinX: number;
  patrolMaxX: number;
  speed?: number;
}

export interface CoinDef {
  id: string;
  x: number;
  y: number;
}

export interface EnemyDef {
  id: string;
  x: number;
  y: number;
  patrolMinX: number;
  patrolMaxX: number;
}

export interface JumpPadDef {
  id: string;
  x: number;
  y: number;
}

import { clampCameraX, getWorldCenterX } from '../utils/camera';

export interface LevelDef {
  id: string;
  playerSpawn: { x: number; y: number };
  platforms: PlatformDef[];
  movingPlatforms: MovingPlatformDef[];
  coins: CoinDef[];
  enemies: EnemyDef[];
  jumpPads: JumpPadDef[];
}

/** Wider platforms and coin trails for left/right exploration. */
export function buildLevel1(groundY: number, viewportWidth: number): LevelDef {
  const playerSpawn = { x: 180, y: groundY - 60 };
  /** Brick stays at viewport center — start coins must sit on that path. */
  const initialCameraX = clampCameraX(
    playerSpawn.x - viewportWidth / 2,
    viewportWidth,
  );
  const pathCenterX = getWorldCenterX(initialCameraX, viewportWidth);
  const coinHopY = groundY - 50;

  return {
    id: 'level-1',
    playerSpawn,
    platforms: [
      { id: 'platform_start', x: 200, y: groundY, width: 340 },
      { id: 'platform_bridge', x: 480, y: groundY, width: 200 },
      { id: 'platform_mid', x: 700, y: groundY - 90, width: 240 },
      { id: 'platform_step', x: 960, y: groundY - 50, width: 180 },
      { id: 'platform_high', x: 1180, y: groundY - 170, width: 220 },
      { id: 'platform_far', x: 1480, y: groundY - 90, width: 280 },
      { id: 'platform_end', x: 1780, y: groundY - 160, width: 240 },
    ],
    movingPlatforms: [
      {
        id: 'platform_moving',
        x: 820,
        y: groundY - 150,
        width: 150,
        patrolMinX: 760,
        patrolMaxX: 920,
        speed: 1.4,
      },
    ],
    coins: [
      { id: 'coin_start_a', x: pathCenterX - 50, y: coinHopY },
      { id: 'coin_start_b', x: pathCenterX, y: coinHopY },
      { id: 'coin_start_c', x: pathCenterX + 50, y: coinHopY },
      { id: 'coin_bridge', x: 480, y: groundY - 50 },
      { id: 'coin_mid', x: 700, y: groundY - 138 },
      { id: 'coin_moving', x: 820, y: groundY - 198 },
      { id: 'coin_step', x: 960, y: groundY - 98 },
      { id: 'coin_high', x: 1180, y: groundY - 218 },
      { id: 'coin_far_a', x: 1420, y: groundY - 138 },
      { id: 'coin_far_b', x: 1540, y: groundY - 138 },
      { id: 'coin_end', x: 1780, y: groundY - 208 },
    ],
    enemies: [
      {
        id: 'enemy_mid',
        x: 640,
        y: groundY - 122,
        patrolMinX: 600,
        patrolMaxX: 780,
      },
      {
        id: 'enemy_far',
        x: 1380,
        y: groundY - 122,
        patrolMinX: 1320,
        patrolMaxX: 1520,
      },
    ],
    jumpPads: [
      { id: 'jump_pad_mid', x: 560, y: groundY - 108 },
      { id: 'jump_pad_high', x: 1040, y: groundY - 108 },
    ],
  };
}
