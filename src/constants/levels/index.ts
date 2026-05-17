import { buildLevel1, type LevelDef } from '../level';
import { buildLevel2 } from '../level2';
import { buildLevel3 } from '../level3';
import { buildLevel4 } from '../level4';
import { buildLevel5 } from '../level5';
import { buildLevel6 } from '../level6';
import { buildLevel7 } from '../level7';
import { buildLevel8 } from '../level8';

export { LEVEL_META } from './meta';
export type { LevelMeta } from './meta';

export const LEVEL_COUNT = 8;

const LEVEL_BUILDERS: ((groundY: number, viewportWidth: number) => LevelDef)[] = [
  buildLevel1,
  buildLevel2,
  buildLevel3,
  buildLevel4,
  buildLevel5,
  buildLevel6,
  buildLevel7,
  buildLevel8,
];

const STATS_GROUND_Y = 800;
const STATS_VIEWPORT_WIDTH = 400;

export function buildLevel(
  index: number,
  groundY: number,
  viewportWidth: number,
): LevelDef {
  const builder = LEVEL_BUILDERS[index] ?? LEVEL_BUILDERS[0];
  return builder(groundY, viewportWidth);
}

export function getLevelStats(index: number): { coinCount: number } {
  const level = buildLevel(index, STATS_GROUND_Y, STATS_VIEWPORT_WIDTH);
  return { coinCount: level.coins.length };
}
