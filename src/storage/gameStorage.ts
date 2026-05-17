import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_SETTINGS,
  type GameSettings,
  type HighScoreEntry,
  type UserProfile,
} from '../types/app';
import { STORAGE_KEYS } from './keys';

export const MAX_HIGH_SCORES = 10;

export interface PersistedGameData {
  profile: UserProfile | null;
  settings: GameSettings;
  highScores: HighScoreEntry[];
  bestScore: number;
}

const DEFAULT_DATA: PersistedGameData = {
  profile: null,
  settings: DEFAULT_SETTINGS,
  highScores: [],
  bestScore: 0,
};

export async function loadGameData(): Promise<PersistedGameData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.gameData);
    if (!raw) {
      return { ...DEFAULT_DATA };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedGameData>;
    return {
      profile: parsed.profile ?? null,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      highScores: Array.isArray(parsed.highScores) ? parsed.highScores : [],
      bestScore: typeof parsed.bestScore === 'number' ? parsed.bestScore : 0,
    };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export async function saveGameData(data: PersistedGameData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.gameData, JSON.stringify(data));
}

export function sortHighScores(entries: HighScoreEntry[]): HighScoreEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.totalTimeMs - b.totalTimeMs;
  });
}

export function mergeHighScore(
  existing: HighScoreEntry[],
  entry: HighScoreEntry,
): HighScoreEntry[] {
  const merged = sortHighScores([...existing, entry]).slice(0, MAX_HIGH_SCORES);
  return merged;
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
