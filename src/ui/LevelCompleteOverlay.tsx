import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { formatElapsed } from '../utils/formatTime';

interface LevelCompleteOverlayProps {
  score: number;
  elapsedMs: number;
  levelIndex: number;
  levelCount: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onMenu: () => void;
  isNewBest?: boolean;
}

export function LevelCompleteOverlay({
  score,
  elapsedMs,
  levelIndex,
  levelCount,
  onNextLevel,
  onRestart,
  onMenu,
  isNewBest = false,
}: LevelCompleteOverlayProps) {
  const isLastLevel = levelIndex >= levelCount - 1;
  const levelNumber = levelIndex + 1;

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {isLastLevel ? 'You win!' : `Level ${levelNumber} complete!`}
        </Text>
        <Text style={styles.subtitle}>All coins collected</Text>
        <Text style={styles.score}>{score} pts</Text>
        <Text style={styles.time}>Time: {formatElapsed(elapsedMs)}</Text>
        {isNewBest && <Text style={styles.newBest}>New high score!</Text>}

        {!isLastLevel && (
          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonPrimary, pressed && styles.buttonPressed]}
            onPress={onNextLevel}
          >
            <Text style={styles.buttonLabel}>Next Level</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            !isLastLevel && styles.buttonSecondary,
            pressed && styles.buttonPressed,
          ]}
          onPress={onRestart}
        >
          <Text style={styles.buttonLabel}>{isLastLevel ? 'Play Again' : 'Restart Run'}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, styles.buttonSecondary, pressed && styles.buttonPressed]}
          onPress={onMenu}
        >
          <Text style={styles.buttonLabel}>Main Menu</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 20,
  },
  card: {
    backgroundColor: COLORS.ground,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    minWidth: 280,
    borderWidth: 2,
    borderColor: COLORS.platform,
  },
  title: {
    color: COLORS.scoreText,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.scoreText,
    fontSize: 14,
    opacity: 0.75,
    marginTop: 6,
  },
  score: {
    color: COLORS.coin,
    fontSize: 36,
    fontWeight: '800',
    marginTop: 20,
  },
  time: {
    color: COLORS.scoreText,
    fontSize: 16,
    opacity: 0.8,
    marginTop: 8,
    marginBottom: 8,
  },
  newBest: {
    color: COLORS.coin,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.player,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPrimary: {
    marginTop: 0,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.platform,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    color: COLORS.scoreText,
    fontSize: 16,
    fontWeight: '700',
  },
});
