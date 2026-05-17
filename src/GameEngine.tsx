import React, { useCallback, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GameEngine as RNGameEngine,
  type GameEngineUpdateEventOptionType,
} from 'react-native-game-engine';
import { COLORS } from './constants';
import { GAME_SYSTEMS } from './systems';
import type { EntityMap, InputPatch, InputState, PhysicsContext, Viewport } from './types/ecs';
import { TiltControls } from './ui/TiltControls';
import { LevelCompleteOverlay } from './ui/LevelCompleteOverlay';
import { RestartButton } from './ui/RestartButton';
import { createInitialEntities } from './utils/createInitialEntities';
import { getWindowViewport } from './utils/dimensions';
import {
  playCoinFeedback,
  playHitFeedback,
  playHopFeedback,
  playLevelCompleteFeedback,
} from './utils/feedback';
import { createPhysicsContext } from './utils/physics';
import { teardownPhysics } from './utils/teardownPhysics';

interface GameSession {
  id: number;
  physics: PhysicsContext;
  entities: EntityMap;
}

const INITIAL_INPUT: InputState = { tiltX: 0, hopSpeed: 1 };

function createGameSession(id: number, viewport: Viewport): GameSession {
  const physics = createPhysicsContext(viewport);
  const entities = createInitialEntities(physics);
  return { id, physics, entities };
}

export function GameEngine() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const viewport: Viewport = { width, height };
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  const sessionSeqRef = useRef(0);
  const sessionRef = useRef<GameSession | null>(null);
  const [session, setSession] = useState<GameSession>(() => {
    sessionSeqRef.current += 1;
    const initial = createGameSession(sessionSeqRef.current, getWindowViewport());
    sessionRef.current = initial;
    return initial;
  });

  const [score, setScore] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);

  const restartGame = useCallback(() => {
    const previous = sessionRef.current;
    if (previous) {
      teardownPhysics(previous.physics);
    }

    sessionSeqRef.current += 1;
    const next = createGameSession(sessionSeqRef.current, viewportRef.current);
    sessionRef.current = next;
    setSession(next);
    setScore(0);
    setLevelComplete(false);
    next.physics.input = { ...INITIAL_INPUT };
    next.physics.checkpoint = {
      ...next.physics.playerSpawn,
      cameraX: next.physics.camera.x,
    };
  }, []);

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
        case 'player-hit':
          playHitFeedback();
          break;
        case 'hop':
          playHopFeedback();
          break;
        case 'jump-pad':
          playHopFeedback();
          break;
        case 'level-complete':
          playLevelCompleteFeedback();
          setLevelComplete(true);
          if (typeof event.score === 'number') {
            setScore(event.score);
          }
          break;
        default:
          break;
      }
    },
    [],
  );

  const hudTop = Math.max(insets.top, 12) + 8;
  const hudSide = Math.max(insets.left, 16);

  return (
    <View style={styles.container}>
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
          score={score}
          totalCoins={session.physics.totalCoins}
          top={hudTop}
          left={hudSide}
        />
      </RNGameEngine>

      <View
        style={[styles.chrome, { top: hudTop, right: Math.max(insets.right, 16) }]}
        pointerEvents="box-none"
      >
        <RestartButton onPress={restartGame} />
      </View>

      <TiltControls
        key={`tilt-${session.id}`}
        enabled={!levelComplete}
        onInputChange={handleInputChange}
      />

      {levelComplete && (
        <LevelCompleteOverlay score={score} onRestart={restartGame} />
      )}
    </View>
  );
}

function ScoreHud({
  score,
  totalCoins,
  top,
  left,
}: {
  score: number;
  totalCoins: number;
  top: number;
  left: number;
}) {
  return (
    <View style={[styles.hud, { top, left }]} pointerEvents="none">
      <Text style={styles.scoreLabel}>Score</Text>
      <Text style={styles.scoreValue}>{score}</Text>
      <Text style={styles.coinCount}>{totalCoins} coins in level</Text>
      <Text style={styles.swipeHint}>
        {Platform.OS === 'web' ? 'Arrow keys to explore' : 'Tilt phone to explore'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1a33',
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
  hud: {
    position: 'absolute',
  },
  scoreLabel: {
    color: COLORS.scoreText,
    fontSize: 14,
    opacity: 0.7,
  },
  scoreValue: {
    color: COLORS.scoreText,
    fontSize: 28,
    fontWeight: '800',
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
