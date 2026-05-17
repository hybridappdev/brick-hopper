import { buildLevel1, type LevelDef } from '../level';
import { buildLevel2 } from '../level2';
import { buildLevel3 } from '../level3';
import { buildLevel4 } from '../level4';
import { buildLevel5 } from '../level5';

export { LEVEL_META } from './meta';
export type { LevelMeta } from './meta';

export const LEVEL_COUNT = 5;

const LEVEL_BUILDERS: ((groundY: number, viewportWidth: number) => LevelDef)[] = [
  buildLevel1,
  buildLevel2,
  buildLevel3,
  buildLevel4,
  buildLevel5,
];

export function buildLevel(
  index: number,
  groundY: number,
  viewportWidth: number,
): LevelDef {
  const builder = LEVEL_BUILDERS[index] ?? LEVEL_BUILDERS[0];
  return builder(groundY, viewportWidth);
}
