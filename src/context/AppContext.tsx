import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LEVEL_COUNT } from '../constants/levels';
import { createId, loadGameData, mergeHighScore, saveGameData } from '../storage/gameStorage';
import {
  DEFAULT_SETTINGS,
  type AppScreen,
  type GameRunMode,
  type GameSettings,
  type HighScoreEntry,
  type RunResult,
  type UserProfile,
} from '../types/app';

interface AppContextValue {
  ready: boolean;
  screen: AppScreen;
  profile: UserProfile | null;
  settings: GameSettings;
  highScores: HighScoreEntry[];
  bestScore: number;
  unlockedLevelMaxIndex: number;
  gameStartLevel: number;
  gameRunMode: GameRunMode;
  navigate: (screen: AppScreen) => void;
  startGame: () => void;
  startLevel: (levelIndex: number) => void;
  exitGame: () => void;
  unlockLevelProgress: (completedLevelIndex: number) => Promise<void>;
  saveProfile: (displayName: string, avatarColor: string) => Promise<void>;
  updateSettings: (patch: Partial<GameSettings>) => Promise<void>;
  recordRun: (result: RunResult) => Promise<void>;
  clearHighScores: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<AppScreen>('loading');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [highScores, setHighScores] = useState<HighScoreEntry[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [unlockedLevelMaxIndex, setUnlockedLevelMaxIndex] = useState(0);
  const [gameStartLevel, setGameStartLevel] = useState(0);
  const [gameRunMode, setGameRunMode] = useState<GameRunMode>('campaign');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await loadGameData();
      if (cancelled) {
        return;
      }
      setProfile(data.profile);
      setSettings(data.settings);
      setHighScores(data.highScores);
      setBestScore(data.bestScore);
      setUnlockedLevelMaxIndex(data.unlockedLevelMaxIndex);
      setScreen(data.profile ? 'intro' : 'createProfile');
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(
    async (patch: {
      profile?: UserProfile | null;
      settings?: GameSettings;
      highScores?: HighScoreEntry[];
      bestScore?: number;
      unlockedLevelMaxIndex?: number;
    }) => {
      const nextProfile = patch.profile !== undefined ? patch.profile : profile;
      const nextSettings = patch.settings ?? settings;
      const nextHighScores = patch.highScores ?? highScores;
      const nextBest = patch.bestScore ?? bestScore;
      const nextUnlocked =
        patch.unlockedLevelMaxIndex !== undefined
          ? patch.unlockedLevelMaxIndex
          : unlockedLevelMaxIndex;

      await saveGameData({
        profile: nextProfile,
        settings: nextSettings,
        highScores: nextHighScores,
        bestScore: nextBest,
        unlockedLevelMaxIndex: nextUnlocked,
      });

      if (patch.profile !== undefined) {
        setProfile(patch.profile);
      }
      if (patch.settings) {
        setSettings(patch.settings);
      }
      if (patch.highScores) {
        setHighScores(patch.highScores);
      }
      if (patch.bestScore !== undefined) {
        setBestScore(patch.bestScore);
      }
      if (patch.unlockedLevelMaxIndex !== undefined) {
        setUnlockedLevelMaxIndex(patch.unlockedLevelMaxIndex);
      }
    },
    [profile, settings, highScores, bestScore, unlockedLevelMaxIndex],
  );

  const navigate = useCallback((next: AppScreen) => {
    setScreen(next);
  }, []);

  const startGame = useCallback(() => {
    setGameStartLevel(0);
    setGameRunMode('campaign');
    setScreen('game');
  }, []);

  const startLevel = useCallback((levelIndex: number) => {
    setGameStartLevel(levelIndex);
    setGameRunMode('level');
    setScreen('game');
  }, []);

  const unlockLevelProgress = useCallback(
    async (completedLevelIndex: number) => {
      const nextUnlocked = Math.min(
        LEVEL_COUNT - 1,
        Math.max(unlockedLevelMaxIndex, completedLevelIndex + 1),
      );
      if (nextUnlocked === unlockedLevelMaxIndex) {
        return;
      }
      await persist({ unlockedLevelMaxIndex: nextUnlocked });
    },
    [unlockedLevelMaxIndex, persist],
  );

  const exitGame = useCallback(() => {
    setScreen('intro');
  }, []);

  const saveProfile = useCallback(
    async (displayName: string, avatarColor: string) => {
      const trimmed = displayName.trim().slice(0, 16);
      if (!trimmed) {
        return;
      }

      const next: UserProfile = profile
        ? { ...profile, displayName: trimmed, avatarColor }
        : {
            id: createId(),
            displayName: trimmed,
            avatarColor,
            createdAt: new Date().toISOString(),
          };

      await persist({ profile: next });
      setScreen('intro');
    },
    [profile, persist],
  );

  const updateSettings = useCallback(
    async (patch: Partial<GameSettings>) => {
      const next = { ...settings, ...patch };
      await persist({ settings: next });
    },
    [settings, persist],
  );

  const recordRun = useCallback(
    async (result: RunResult) => {
      if (!profile) {
        return;
      }

      const entry: HighScoreEntry = {
        id: createId(),
        playerName: profile.displayName,
        avatarColor: profile.avatarColor,
        score: result.score,
        totalTimeMs: result.totalTimeMs,
        completedAllLevels: result.completedAllLevels,
        dateIso: new Date().toISOString(),
      };

      const nextHighScores = mergeHighScore(highScores, entry);
      const nextBest = Math.max(bestScore, result.score);

      await persist({
        highScores: nextHighScores,
        bestScore: nextBest,
      });
    },
    [profile, highScores, bestScore, persist],
  );

  const clearHighScores = useCallback(async () => {
    await persist({ highScores: [], bestScore: 0 });
  }, [persist]);

  const value = useMemo(
    () => ({
      ready,
      screen,
      profile,
      settings,
      highScores,
      bestScore,
      unlockedLevelMaxIndex,
      gameStartLevel,
      gameRunMode,
      navigate,
      startGame,
      startLevel,
      exitGame,
      unlockLevelProgress,
      saveProfile,
      updateSettings,
      recordRun,
      clearHighScores,
    }),
    [
      ready,
      screen,
      profile,
      settings,
      highScores,
      bestScore,
      unlockedLevelMaxIndex,
      gameStartLevel,
      gameRunMode,
      navigate,
      startGame,
      startLevel,
      exitGame,
      unlockLevelProgress,
      saveProfile,
      updateSettings,
      recordRun,
      clearHighScores,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
