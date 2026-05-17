import type { LevelRecord } from '../storage/gameStorage';

/** First incomplete level up to unlocked max, or 0 if all cleared. */
export function getContinueCampaignLevel(
  records: LevelRecord[],
  unlockedMaxIndex: number,
): number {
  for (let i = 0; i <= unlockedMaxIndex; i++) {
    if (!records[i]?.completed) {
      return i;
    }
  }
  return 0;
}

export function canShowContinueCampaign(
  records: LevelRecord[],
  unlockedMaxIndex: number,
): boolean {
  if (unlockedMaxIndex < 1) {
    return false;
  }
  return records.some((r) => r.completed);
}
