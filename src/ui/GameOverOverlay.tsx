import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../constants';

interface GameOverOverlayProps {
  score: number;
  levelIndex: number;
  onRetry: () => void;
  onMenu: () => void;
}

export function GameOverOverlay({
  score,
  levelIndex,
  onRetry,
  onMenu,
}: GameOverOverlayProps) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(60),
        Animated.parallel([
          Animated.spring(cardScale, {
            toValue: 1,
            friction: 6,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [backdropOpacity, cardOpacity, cardScale]);

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        <Text style={styles.title}>Game Over</Text>
        <Text style={styles.subtitle}>
          Reached level {levelIndex + 1} · Score {score}
        </Text>

        <View style={styles.actions}>
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.primaryLabel}>Retry</Text>
          </Pressable>
          <Pressable
            onPress={onMenu}
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.secondaryLabel}>Main Menu</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 12, 28, 0.72)',
  },
  card: {
    width: '86%',
    maxWidth: 340,
    backgroundColor: 'rgba(22, 33, 62, 0.96)',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.45)',
    alignItems: 'center',
  },
  title: {
    color: COLORS.player,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.scoreText,
    fontSize: 14,
    opacity: 0.75,
    marginBottom: 24,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: COLORS.player,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  btnPressed: {
    opacity: 0.85,
  },
  primaryLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryLabel: {
    color: COLORS.scoreText,
    fontSize: 16,
    fontWeight: '600',
  },
});
