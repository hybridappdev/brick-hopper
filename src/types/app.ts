import type { AmbienceSettings } from '../constants/ambienceDefaults';
import { DEFAULT_AMBIENCE } from '../constants/ambienceDefaults';
import type { HopLevel } from './ecs';

export type { AmbienceSettings };
export { DEFAULT_AMBIENCE };

export interface UserProfile {
  id: string;
  displayName: string;
  avatarColor: string;
  createdAt: string;
}

export interface GameSettings {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  defaultHopSpeed: HopLevel;
  showTimer: boolean;
  ambience: AmbienceSettings;
}

export interface HighScoreEntry {
  id: string;
  playerName: string;
  avatarColor: string;
  score: number;
  totalTimeMs: number;
  completedAllLevels: boolean;
  dateIso: string;
}

export interface RunResult {
  score: number;
  totalTimeMs: number;
  completedAllLevels: boolean;
}

export type AppScreen =
  | 'loading'
  | 'createProfile'
  | 'intro'
  | 'game'
  | 'levelPicker'
  | 'settings'
  | 'highScores'
  | 'editProfile';

export type GameRunMode = 'campaign' | 'level';

export const DEFAULT_SETTINGS: GameSettings = {
  hapticsEnabled: true,
  soundEnabled: true,
  defaultHopSpeed: 1,
  showTimer: true,
  ambience: DEFAULT_AMBIENCE,
};
