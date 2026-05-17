import { buildLevel1, type LevelDef } from '../level';
import { buildLevel2 } from '../level2';

export const LEVEL_COUNT = 2;

const LEVEL_BUILDERS: ((groundY: number, viewportWidth: number) => LevelDef)[] = [
  buildLevel1,
  buildLevel2,
];

export function buildLevel(
  index: number,
  groundY: number,
  viewportWidth: number,
): LevelDef {
  const builder = LEVEL_BUILDERS[index] ?? LEVEL_BUILDERS[0];
  return builder(groundY, viewportWidth);
}
