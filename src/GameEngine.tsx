import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GameEngine as RNGameEngine,
  type GameEngineUpdateEventOptionType,
} from 'react-native-game-engine';
import { WeatherOverlay } from './components/WeatherOverlay';
import { LEVEL_COUNT } from './constants/levels';
import { GAME_SYSTEMS } from './systems';
import type { AmbientSnapshot } from './utils/ambient';
import {
  applyAmbienceToPhysics,
  syncBackgroundAmbient,
} from './utils/applyAmbienceToPhysics';
import type { EntityMap, InputPatch, InputState, PhysicsContext, Viewport } from './types/ecs';
import type { GameRunMode, GameSettings, RunResult, UserProfile } from './types/app';
import { isGameEntity } from './types/ecs';
import { TiltControls } from './ui/TiltControls';
import { FloatingScorePopup } from './ui/FloatingScorePopup';
import { GameTopBar } from './ui/GameTopBar';
import { LevelCompleteOverlay } from './ui/LevelCompleteOverlay';
import { useCameraShake } from './ui/useCameraShake';
import { COIN_PICKUP_GRACE_MS } from './constants/coin';
import { ENEMY_STOMP_SCORE } from './constants/enemy';
import { COIN_VALUE } from './constants/score';
import { createInitialEntities } from './utils/createInitialEntities';
import { getWindowViewport } from './utils/dimensions';
import { countRemainingCoins } from './utils/levelProgress';
import {
  playCoinSound,
  playHitSound,
  playHopSound,
  playStompSound,
  playWinSound,
  preloadSounds,
  setSoundEnabled,
} from './audio/soundManager';
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
  startLevelIndex?: number;
  runMode?: GameRunMode;
  unlockedLevelMaxIndex?: number;
  onExit: () => void;
  onRunEnd: (result: RunResult) => void;
  onLevelComplete?: (completedLevelIndex: number) => void;
}

function createGameSession(
  id: number,
  viewport: Viewport,
  levelIndex: number,
  ambience: GameSettings['ambience'],
  options: SessionOptions = {},
): GameSession {
  const physics = createPhysicsContext(
    viewport,
    levelIndex,
    options.score ?? 0,
    options.ambientClockMs ?? 0,
    ambience,
  );
  const entities = createInitialEntities(physics);
  return { id, physics, entities };
}

export function GameEngine({
  profile,
  settings,
  bestScore,
  startLevelIndex = 0,
  runMode = 'campaign',
  unlockedLevelMaxIndex = 0,
  onExit,
  onRunEnd,
  onLevelComplete,
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
  const startLevelRef = useRef(startLevelIndex);
  startLevelRef.current = startLevelIndex;
  const isCampaignRunRef = useRef(runMode === 'campaign');
  isCampaignRunRef.current = runMode === 'campaign';

  const [session, setSession] = useState<GameSession>(() => {
    sessionSeqRef.current += 1;
    const initial = createGameSession(
      sessionSeqRef.current,
      getWindowViewport(),
      startLevelIndex,
      settings.ambience,
    );
    sessionRef.current = initial;
    return initial;
  });

  const [score, setScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(startLevelIndex);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [remainingCoins, setRemainingCoins] = useState(session.physics.totalCoins);
  const [skyColor, setSkyColor] = useState(session.physics.displayAmbient.skyColor);
  const [displayAmbient, setDisplayAmbient] = useState<AmbientSnapshot>(
    session.physics.displayAmbient,
  );
  const [isNewBest, setIsNewBest] = useState(false);
  const [isOnPaceForBest, setIsOnPaceForBest] = useState(false);
  const [scorePopups, setScorePopups] = useState<{ id: number; label: string }[]>([]);
  const popupIdRef = useRef(0);
  const { shakeX, triggerShake } = useCameraShake();

  const pushScorePopup = useCallback((label: string) => {
    popupIdRef.current += 1;
    const id = popupIdRef.current;
    setScorePopups((prev) => [...prev, { id, label }]);
  }, []);

  const removeScorePopup = useCallback((id: number) => {
    setScorePopups((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    setHapticsEnabled(settings.hapticsEnabled);
    setSoundEnabled(settings.soundEnabled);
    preloadSounds();
  }, [settings.hapticsEnabled, settings.soundEnabled]);

  useEffect(() => {
    const current = sessionRef.current;
    if (!current) {
      return;
    }
    applyAmbienceToPhysics(current.physics, settings.ambience, { smoothFactor: 0.22 });
    syncBackgroundAmbient(
      current.entities,
      current.physics.displayAmbient,
      settings.ambience,
    );
    setSkyColor(current.physics.displayAmbient.skyColor);
    setDisplayAmbient({ ...current.physics.displayAmbient });
  }, [settings.ambience]);

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
      const next = createGameSession(
        sessionSeqRef.current,
        viewportRef.current,
        level,
        settings.ambience,
        options,
      );
      sessionRef.current = next;
      runRecordedRef.current = false;
      setSession(next);
      setLevelIndex(level);
      setScore(options.score ?? 0);
      setElapsedMs(0);
      setLevelComplete(false);
      setIsNewBest(false);
      setIsOnPaceForBest(false);
      setRemainingCoins(next.physics.totalCoins);
      setScorePopups([]);
      setSkyColor(next.physics.displayAmbient.skyColor);
      setDisplayAmbient({ ...next.physics.displayAmbient });
      next.physics.input = { ...initialInput, hopSpeed: settings.defaultHopSpeed };
    },
    [settings.ambience, settings.defaultHopSpeed],
  );

  const restartGame = useCallback(() => {
    runElapsedMsRef.current = 0;
    startSession(startLevelRef.current);
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
    const completedAllLevels =
      isCampaignRunRef.current &&
      levelIndex >= LEVEL_COUNT - 1 &&
      levelComplete;
    submitRun(completedAllLevels);
    onExit();
  }, [submitRun, levelIndex, levelComplete, onExit]);

  const canAdvanceToNextLevel =
    levelIndex < LEVEL_COUNT - 1 &&
    (isCampaignRunRef.current || levelIndex + 1 <= unlockedLevelMaxIndex);

  useEffect(() => {
    if (levelComplete) {
      const finalMs = sessionRef.current?.physics.elapsedMs ?? 0;
      setElapsedMs(finalMs);
      return;
    }

    const hudId = setInterval(() => {
      const physics = sessionRef.current?.physics;
      if (!physics) {
        return;
      }
      setElapsedMs(physics.elapsedMs);
      setSkyColor(physics.displayAmbient.skyColor);
      const current = sessionRef.current;
      if (current) {
        setRemainingCoins(countRemainingCoins(current.entities));
      }
    }, 100);

    const weatherId = setInterval(() => {
      const physics = sessionRef.current?.physics;
      if (!physics) {
        return;
      }
      setDisplayAmbient({ ...physics.displayAmbient });
    }, 33);

    return () => {
      clearInterval(hudId);
      clearInterval(weatherId);
    };
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
        case 'coin-collected': {
          playCoinFeedback();
          playCoinSound();
          const pickupMs = sessionRef.current?.physics.elapsedMs ?? 0;
          if (pickupMs >= COIN_PICKUP_GRACE_MS) {
            pushScorePopup(`+${COIN_VALUE}`);
          }
          const current = sessionRef.current;
          if (current) {
            setRemainingCoins(countRemainingCoins(current.entities));
          }
          break;
        }
        case 'enemy-stomped':
          playStompFeedback();
          playStompSound();
          pushScorePopup(`+${ENEMY_STOMP_SCORE}`);
          break;
        case 'player-hit':
          playHitFeedback();
          playHitSound();
          triggerShake();
          break;
        case 'hop':
          playHopFeedback();
          playHopSound();
          break;
        case 'jump-pad':
          playHopFeedback();
          playHopSound();
          break;
        case 'level-complete': {
          playLevelCompleteFeedback();
          playWinSound();
          setLevelComplete(true);
          const current = sessionRef.current;
          const currentScore = typeof event.score === 'number' ? event.score : score;
          if (typeof event.score === 'number') {
            setScore(event.score);
          }
          const isWin =
            current !== null && current.physics.levelIndex >= LEVEL_COUNT - 1;
          if (current) {
            setRemainingCoins(countRemainingCoins(current.entities));
            onLevelComplete?.(current.physics.levelIndex);
          }
          if (isWin && isCampaignRunRef.current) {
            submitRun(true);
          } else if (currentScore > bestScore) {
            setIsOnPaceForBest(true);
          }
          break;
        }
        default:
          break;
      }
    },
    [score, bestScore, submitRun, pushScorePopup, triggerShake, onLevelComplete],
  );

  const hudTop = Math.max(insets.top, 12) + 6;
  const hudPaddingLeft = Math.max(insets.left, 12);
  const hudPaddingRight = Math.max(insets.right, 12);
  const runElapsedMs = runElapsedMsRef.current + elapsedMs;
  const totalCoinsInLevel = session.physics.totalCoins;

  return (
    <View style={[styles.container, { backgroundColor: skyColor }]}>
      <Animated.View
        style={[styles.shakeLayer, { transform: [{ translateX: shakeX }] }]}
      >
      <RNGameEngine
        key={`engine-${session.id}`}
        style={styles.game}
        systems={GAME_SYSTEMS as unknown as ((
          e: Record<string, unknown>,
          args: GameEngineUpdateEventOptionType,
        ) => Record<string, unknown>)[]}
        entities={session.entities as Record<string, unknown>}
        onEvent={handleGameEvent}
      />
      </Animated.View>

      <View style={styles.weatherLayer} pointerEvents="none">
        <WeatherOverlay width={width} height={height} ambient={displayAmbient} />
      </View>

      {scorePopups.map((popup) => (
        <FloatingScorePopup
          key={popup.id}
          label={popup.label}
          anchorTop={hudTop + 52}
          anchorCenterX={width / 2}
          onDone={() => removeScorePopup(popup.id)}
        />
      ))}

      <GameTopBar
        score={score}
        bestScore={bestScore}
        remainingCoins={remainingCoins}
        totalCoins={totalCoinsInLevel}
        levelIndex={levelIndex}
        levelElapsedMs={elapsedMs}
        runElapsedMs={runElapsedMs}
        showTimer={settings.showTimer}
        top={hudTop}
        paddingLeft={hudPaddingLeft}
        paddingRight={hudPaddingRight}
        onMenu={handleExitToMenu}
        onRestart={restartGame}
      />

      <TiltControls
        key={`tilt-${session.id}`}
        enabled={!levelComplete}
        onInputChange={handleInputChange}
      />

      {levelComplete && (
        <LevelCompleteOverlay
          score={score}
          levelElapsedMs={elapsedMs}
          runElapsedMs={runElapsedMs}
          levelIndex={levelIndex}
          levelCount={LEVEL_COUNT}
          onNextLevel={advanceToNextLevel}
          onRestart={restartGame}
          onMenu={handleExitToMenu}
          showNextLevel={canAdvanceToNextLevel}
          isNewBest={isNewBest}
          isOnPaceForBest={isOnPaceForBest}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shakeLayer: {
    flex: 1,
  },
  game: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  weatherLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    elevation: 5,
  },
});
