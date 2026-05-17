import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GameEngine as RNGameEngine,
  type GameEngineUpdateEventOptionType,
} from 'react-native-game-engine';
import { COLORS } from './constants';
import { LEVEL_COUNT } from './constants/levels';
import { GAME_SYSTEMS } from './systems';
import type { EntityMap, InputPatch, InputState, PhysicsContext, Viewport } from './types/ecs';
import type { GameSettings, RunResult, UserProfile } from './types/app';
import { isGameEntity } from './types/ecs';
import { HopSpeedControls } from './ui/HopSpeedControls';
import { TiltControls } from './ui/TiltControls';
import { LevelCompleteOverlay } from './ui/LevelCompleteOverlay';
import { MenuButton } from './ui/MenuButton';
import { RestartButton } from './ui/RestartButton';
import { createInitialEntities } from './utils/createInitialEntities';
import { getWindowViewport } from './utils/dimensions';
import { formatElapsed } from './utils/formatTime';
import {
  playCoinFeedback,
  playHitFeedback,
  playHopFeedback,
  playLevelCompleteFeedback,
  playStompFeedback,
  setHapticsEnabled,
} from './utils/feedback';
import { createPhysicsContext } from './utils/physics';
import { teardownPhysics } from './utils/teardownPhysics';

interface GameSession {
  id: number;
  physics: PhysicsContext;
  entities: EntityMap;
}

interface SessionOptions {
  score?: number;
  ambientClockMs?: number;
}

export interface GameEngineProps {
  profile: UserProfile;
  settings: GameSettings;
  bestScore: number;
  onExit: () => void;
  onRunEnd: (result: RunResult) => void;
}

function createGameSession(
  id: number,
  viewport: Viewport,
  levelIndex: number,
  options: SessionOptions = {},
): GameSession {
  const physics = createPhysicsContext(
    viewport,
    levelIndex,
    options.score ?? 0,
    options.ambientClockMs ?? 0,
  );
  const entities = createInitialEntities(physics);
  return { id, physics, entities };
}

export function GameEngine({
  profile,
  settings,
  bestScore,
  onExit,
  onRunEnd,
}: GameEngineProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const viewport: Viewport = { width, height };
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  const initialInput: InputState = { tiltX: 0, hopSpeed: settings.defaultHopSpeed };

  const sessionSeqRef = useRef(0);
  const sessionRef = useRef<GameSession | null>(null);
  const runRecordedRef = useRef(false);
  const runElapsedMsRef = useRef(0);

  const [session, setSession] = useState<GameSession>(() => {
    sessionSeqRef.current += 1;
    const initial = createGameSession(sessionSeqRef.current, getWindowViewport(), 0);
    sessionRef.current = initial;
    return initial;
  });

  const [score, setScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [skyColor, setSkyColor] = useState(session.physics.ambient.skyColor);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    setHapticsEnabled(settings.hapticsEnabled);
  }, [settings.hapticsEnabled]);

  useEffect(() => {
    const player = session.entities.player;
    if (player && isGameEntity(player)) {
      player.sprite.color = profile.avatarColor;
    }
  }, [session.id, profile.avatarColor, session.entities]);

  const submitRun = useCallback(
    (completedAllLevels: boolean) => {
      if (runRecordedRef.current) {
        return;
      }
      const currentScore = sessionRef.current?.physics.score ?? score;
      if (currentScore <= 0) {
        return;
      }

      runRecordedRef.current = true;
      const levelMs = sessionRef.current?.physics.elapsedMs ?? elapsedMs;
      const totalTimeMs = runElapsedMsRef.current + levelMs;

      onRunEnd({
        score: currentScore,
        totalTimeMs,
        completedAllLevels,
      });

      setIsNewBest(currentScore > bestScore);
    },
    [score, elapsedMs, bestScore, onRunEnd],
  );

  const startSession = useCallback(
    (level: number, options: SessionOptions = {}) => {
      const previous = sessionRef.current;
      if (previous) {
        teardownPhysics(previous.physics);
      }

      sessionSeqRef.current += 1;
      const next = createGameSession(sessionSeqRef.current, viewportRef.current, level, options);
      sessionRef.current = next;
      runRecordedRef.current = false;
      setSession(next);
      setLevelIndex(level);
      setScore(options.score ?? 0);
      setElapsedMs(0);
      setLevelComplete(false);
      setIsNewBest(false);
      setSkyColor(next.physics.ambient.skyColor);
      next.physics.input = { ...initialInput, hopSpeed: settings.defaultHopSpeed };
    },
    [settings.defaultHopSpeed],
  );

  const restartGame = useCallback(() => {
    runElapsedMsRef.current = 0;
    startSession(0);
  }, [startSession]);

  const advanceToNextLevel = useCallback(() => {
    const current = sessionRef.current;
    if (!current) {
      return;
    }

    runElapsedMsRef.current += current.physics.elapsedMs;

    const nextIndex = current.physics.levelIndex + 1;
    if (nextIndex >= LEVEL_COUNT) {
      return;
    }

    startSession(nextIndex, {
      score: current.physics.score,
      ambientClockMs: current.physics.ambientClockMs,
    });
  }, [startSession]);

  const handleExitToMenu = useCallback(() => {
    const completedAllLevels = levelIndex >= LEVEL_COUNT - 1 && levelComplete;
    submitRun(completedAllLevels);
    onExit();
  }, [submitRun, levelIndex, levelComplete, onExit]);

  useEffect(() => {
    if (levelComplete) {
      const finalMs = sessionRef.current?.physics.elapsedMs ?? 0;
      setElapsedMs(finalMs);
      return;
    }

    const id = setInterval(() => {
      const physics = sessionRef.current?.physics;
      if (!physics) {
        return;
      }
      setElapsedMs(physics.elapsedMs);
      setSkyColor(physics.ambient.skyColor);
    }, 100);

    return () => clearInterval(id);
  }, [levelComplete, session.id]);

  const handleInputChange = useCallback((patch: InputPatch) => {
    const physics = sessionRef.current?.physics;
    if (!physics) {
      return;
    }
    physics.input =
      typeof patch === 'function'
        ? patch(physics.input)
        : { ...physics.input, ...patch };
  }, []);

  const handleGameEvent = useCallback(
    (event: { type: string; score?: number }) => {
      switch (event.type) {
        case 'score-updated':
          if (typeof event.score === 'number') {
            setScore(event.score);
          }
          break;
        case 'coin-collected':
          playCoinFeedback();
          break;
        case 'enemy-stomped':
          playStompFeedback();
          break;
        case 'player-hit':
          playHitFeedback();
          break;
        case 'hop':
          playHopFeedback();
          break;
        case 'jump-pad':
          playHopFeedback();
          break;
        case 'level-complete': {
          playLevelCompleteFeedback();
          setLevelComplete(true);
          const current = sessionRef.current;
          const currentScore = typeof event.score === 'number' ? event.score : score;
          if (typeof event.score === 'number') {
            setScore(event.score);
          }
          const isWin =
            current !== null && current.physics.levelIndex >= LEVEL_COUNT - 1;
          if (isWin) {
            submitRun(true);
          } else if (currentScore > bestScore) {
            setIsNewBest(true);
          }
          break;
        }
        default:
          break;
      }
    },
    [score, bestScore, submitRun],
  );

  const hudTop = Math.max(insets.top, 12) + 8;
  const hudSide = Math.max(insets.left, 16);
  const controlsBottom = Math.max(insets.bottom, 16) + 12;

  return (
    <View style={[styles.container, { backgroundColor: skyColor }]}>
      <RNGameEngine
        key={`engine-${session.id}`}
        style={styles.game}
        systems={GAME_SYSTEMS as unknown as ((
          e: Record<string, unknown>,
          args: GameEngineUpdateEventOptionType,
        ) => Record<string, unknown>)[]}
        entities={session.entities as Record<string, unknown>}
        onEvent={handleGameEvent}
      >
        <ScoreHud
          playerName={profile.displayName}
          score={score}
          totalCoins={session.physics.totalCoins}
          levelIndex={levelIndex}
          elapsedMs={elapsedMs}
          season={session.physics.ambient.season}
          showTimer={settings.showTimer}
          top={hudTop}
          left={hudSide}
        />
      </RNGameEngine>

      <View
        style={[styles.chrome, { top: hudTop, right: Math.max(insets.right, 16) }]}
        pointerEvents="box-none"
      >
        <View style={styles.chromeRow}>
          <MenuButton onPress={handleExitToMenu} />
          <RestartButton onPress={restartGame} />
        </View>
      </View>

      <TiltControls
        key={`tilt-${session.id}`}
        enabled={!levelComplete}
        onInputChange={handleInputChange}
      />

      <HopSpeedControls
        key={`hop-${session.id}`}
        enabled={!levelComplete}
        onInputChange={handleInputChange}
        bottom={controlsBottom}
        initialSpeed={settings.defaultHopSpeed}
      />

      {levelComplete && (
        <LevelCompleteOverlay
          score={score}
          elapsedMs={elapsedMs}
          levelIndex={levelIndex}
          levelCount={LEVEL_COUNT}
          onNextLevel={advanceToNextLevel}
          onRestart={restartGame}
          onMenu={handleExitToMenu}
          isNewBest={isNewBest}
        />
      )}
    </View>
  );
}

function capitalizeSeason(season: string): string {
  return season.charAt(0).toUpperCase() + season.slice(1);
}

function ScoreHud({
  playerName,
  score,
  totalCoins,
  levelIndex,
  elapsedMs,
  season,
  showTimer,
  top,
  left,
}: {
  playerName: string;
  score: number;
  totalCoins: number;
  levelIndex: number;
  elapsedMs: number;
  season: string;
  showTimer: boolean;
  top: number;
  left: number;
}) {
  const hopHint =
    Platform.OS === 'web'
      ? 'Arrow keys · 1–3 hop speed'
      : 'Tilt to explore · tap hop speed';

  return (
    <View style={[styles.hud, { top, left }]} pointerEvents="none">
      <Text style={styles.playerName}>{playerName}</Text>
      <Text style={styles.levelLabel}>
        Level {levelIndex + 1} · {capitalizeSeason(season)}
      </Text>
      <Text style={styles.scoreLabel}>Score</Text>
      <Text style={styles.scoreValue}>{score}</Text>
      {showTimer && <Text style={styles.timer}>{formatElapsed(elapsedMs)}</Text>}
      <Text style={styles.coinCount}>{totalCoins} coins in level</Text>
      <Text style={styles.swipeHint}>{hopHint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  game: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  chrome: {
    position: 'absolute',
    zIndex: 20,
    elevation: 20,
  },
  chromeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hud: {
    position: 'absolute',
  },
  playerName: {
    color: COLORS.scoreText,
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.85,
    marginBottom: 2,
  },
  levelLabel: {
    color: COLORS.scoreText,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreLabel: {
    color: COLORS.scoreText,
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  scoreValue: {
    color: COLORS.scoreText,
    fontSize: 28,
    fontWeight: '800',
  },
  timer: {
    color: COLORS.scoreText,
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.65,
    marginTop: 2,
  },
  coinCount: {
    color: COLORS.scoreText,
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  swipeHint: {
    color: COLORS.scoreText,
    fontSize: 11,
    opacity: 0.35,
    marginTop: 8,
  },
});
