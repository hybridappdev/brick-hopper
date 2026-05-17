import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';

interface LevelCompleteOverlayProps {
  score: number;
  onRestart: () => void;
}

export function LevelCompleteOverlay({ score, onRestart }: LevelCompleteOverlayProps) {
  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>Level Complete!</Text>
        <Text style={styles.subtitle}>All coins collected</Text>
        <Text style={styles.score}>{score} pts</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onRestart}
        >
          <Text style={styles.buttonLabel}>Play Again</Text>
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
    marginVertical: 20,
  },
  button: {
    backgroundColor: COLORS.player,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
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
