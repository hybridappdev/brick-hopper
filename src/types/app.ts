import type { HopLevel } from './ecs';

export interface UserProfile {
  id: string;
  displayName: string;
  avatarColor: string;
  createdAt: string;
}

export interface GameSettings {
  hapticsEnabled: boolean;
  defaultHopSpeed: HopLevel;
  showTimer: boolean;
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
  | 'settings'
  | 'highScores'
  | 'editProfile';

export const DEFAULT_SETTINGS: GameSettings = {
  hapticsEnabled: true,
  defaultHopSpeed: 1,
  showTimer: true,
};
