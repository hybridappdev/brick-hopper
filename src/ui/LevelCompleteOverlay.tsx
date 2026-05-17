import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../constants';
import { formatElapsed } from '../utils/formatTime';
import { LevelCompleteConfetti } from './LevelCompleteConfetti';

interface LevelCompleteOverlayProps {
  score: number;
  levelElapsedMs: number;
  runElapsedMs: number;
  levelIndex: number;
  levelCount: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onMenu: () => void;
  showNextLevel?: boolean;
  isNewBest?: boolean;
  isOnPaceForBest?: boolean;
}

function useCountUp(target: number, durationMs: number, delayMs: number) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - (1 - t) ** 3;
        setValue(Math.round(target * eased));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      clearTimeout(startTimer);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, durationMs, delayMs]);

  return value;
}

function Staggered({
  delay,
  children,
  style,
  slide = 14,
}: {
  delay: number;
  children: React.ReactNode;
  style?: object;
  slide?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(slide)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

export function LevelCompleteOverlay({
  score,
  levelElapsedMs,
  runElapsedMs,
  levelIndex,
  levelCount,
  onNextLevel,
  onRestart,
  onMenu,
  showNextLevel = true,
  isNewBest = false,
  isOnPaceForBest = false,
}: LevelCompleteOverlayProps) {
  const isLastLevel = levelIndex >= levelCount - 1;
  const canGoNext = !isLastLevel && showNextLevel;
  const levelNumber = levelIndex + 1;
  const showRunTime = levelIndex > 0 || runElapsedMs > levelElapsedMs;

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.82)).current;
  const cardTranslateY = useRef(new Animated.Value(48)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const badgeRotate = useRef(new Animated.Value(0)).current;
  const shimmerX = useRef(new Animated.Value(-1)).current;

  const displayScore = useCountUp(score, 700, 520);
  const title = isLastLevel ? 'You win!' : `Level ${levelNumber} complete!`;
  const badgeIcon = isLastLevel ? '★' : '✓';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(80),
        Animated.parallel([
          Animated.spring(cardScale, {
            toValue: 1,
            friction: 6,
            tension: 110,
            useNativeDriver: true,
          }),
          Animated.spring(cardTranslateY, {
            toValue: 0,
            friction: 7,
            tension: 95,
            useNativeDriver: true,
          }),
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(260),
      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
      Animated.timing(badgeRotate, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(shimmerX, {
        toValue: 1,
        duration: 2200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ).start();
  }, [
    backdropOpacity,
    badgeRotate,
    badgeScale,
    cardOpacity,
    cardScale,
    cardTranslateY,
    glowPulse,
    shimmerX,
  ]);

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.75],
  });

  const glowScale = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const badgeSpin = badgeRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-18deg', '0deg'],
  });

  const shimmerTranslate = shimmerX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-220, 220],
  });

  const buttonBaseDelay = isNewBest || isOnPaceForBest ? 1080 : 960;

  return (
    <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
      <View style={styles.backdropVignette} pointerEvents="none" />
      <LevelCompleteConfetti />

      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
        pointerEvents="none"
      />

      <Animated.View
        style={[
          styles.cardWrap,
          {
            opacity: cardOpacity,
            transform: [{ scale: cardScale }, { translateY: cardTranslateY }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.badge,
            isLastLevel && styles.badgeWin,
            {
              transform: [{ scale: badgeScale }, { rotate: badgeSpin }],
            },
          ]}
        >
          <Text style={styles.badgeIcon}>{badgeIcon}</Text>
        </Animated.View>

        <View style={styles.card}>
          <View style={styles.shimmer} pointerEvents="none">
            <Animated.View
              style={[
                styles.shimmerBeam,
                { transform: [{ translateX: shimmerTranslate }, { skewX: '-18deg' }] },
              ]}
            />
          </View>

          <Staggered delay={340} style={styles.titleBlock}>
            <Text style={[styles.title, isLastLevel && styles.titleWin]}>{title}</Text>
            <Text style={styles.subtitle}>Coins collected · Exit reached</Text>
          </Staggered>

          <Staggered delay={480} style={styles.scoreBlock}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.score}>{displayScore.toLocaleString()}</Text>
            <Text style={styles.scoreSuffix}>pts</Text>
          </Staggered>

          <Staggered delay={600} style={styles.timesBlock}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Level</Text>
              <Text style={styles.timeValue}>{formatElapsed(levelElapsedMs)}</Text>
            </View>
            {showRunTime && (
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Run</Text>
                <Text style={styles.timeValue}>{formatElapsed(runElapsedMs)}</Text>
              </View>
            )}
          </Staggered>

          {isNewBest && (
            <Staggered delay={720} style={styles.bannerWrap}>
              <View style={styles.newBestBanner}>
                <Text style={styles.newBest}>★ New high score!</Text>
              </View>
            </Staggered>
          )}
          {!isNewBest && isOnPaceForBest && (
            <Staggered delay={720} style={styles.bannerWrap}>
              <Text style={styles.onPace}>On pace for a new best!</Text>
            </Staggered>
          )}

          <View style={styles.actions}>
            {canGoNext && (
              <Staggered delay={buttonBaseDelay}>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.buttonPrimary,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={onNextLevel}
                >
                  <Text style={styles.buttonLabelPrimary}>Next Level</Text>
                </Pressable>
              </Staggered>
            )}

            <Staggered delay={buttonBaseDelay + (isLastLevel ? 0 : 90)}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  !isLastLevel && styles.buttonSecondary,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onRestart}
              >
                <Text style={styles.buttonLabel}>
                  {isLastLevel ? 'Play Again' : 'Restart Run'}
                </Text>
              </Pressable>
            </Staggered>

            <Staggered delay={buttonBaseDelay + (isLastLevel ? 90 : 180)}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonSecondary,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onMenu}
              >
                <Text style={styles.buttonLabel}>Main Menu</Text>
              </Pressable>
            </Staggered>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 20,
  },
  backdropVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderWidth: 0,
    // Soft center spotlight via shadow on iOS; subtle tint on all platforms
    ...(Platform.OS === 'web'
      ? { boxShadow: 'inset 0 0 120px 40px rgba(93, 211, 158, 0.08)' }
      : {}),
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: COLORS.platform,
  },
  cardWrap: {
    maxWidth: '92%',
    alignItems: 'center',
    paddingTop: 28,
  },
  card: {
    backgroundColor: COLORS.ground,
    borderRadius: 20,
    paddingTop: 32,
    paddingBottom: 22,
    paddingHorizontal: 26,
    alignItems: 'center',
    minWidth: 300,
    borderWidth: 2,
    borderColor: COLORS.platform,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.platform,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.45,
        shadowRadius: 24,
      },
      android: { elevation: 16 },
      default: {},
    }),
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shimmerBeam: {
    position: 'absolute',
    top: -40,
    bottom: -40,
    width: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  badge: {
    position: 'absolute',
    top: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.platform,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  badgeWin: {
    backgroundColor: COLORS.coin,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  badgeIcon: {
    color: '#0d1528',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  titleBlock: {
    alignItems: 'center',
  },
  title: {
    color: COLORS.scoreText,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  titleWin: {
    color: COLORS.coin,
    fontSize: 28,
  },
  subtitle: {
    color: COLORS.scoreText,
    fontSize: 14,
    opacity: 0.7,
    marginTop: 6,
  },
  scoreBlock: {
    alignItems: 'center',
    marginTop: 18,
  },
  scoreLabel: {
    color: COLORS.scoreText,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    opacity: 0.45,
    textTransform: 'uppercase',
  },
  score: {
    color: COLORS.coin,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    marginTop: 2,
    textShadowColor: 'rgba(245, 197, 66, 0.35)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  scoreSuffix: {
    color: COLORS.coin,
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.65,
    marginTop: -4,
  },
  timesBlock: {
    width: '100%',
    marginTop: 16,
    gap: 6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  timeLabel: {
    color: COLORS.scoreText,
    fontSize: 13,
    opacity: 0.5,
    fontWeight: '600',
  },
  timeValue: {
    color: COLORS.scoreText,
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  bannerWrap: {
    marginTop: 14,
    width: '100%',
    alignItems: 'center',
  },
  newBestBanner: {
    backgroundColor: 'rgba(245, 197, 66, 0.15)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.45)',
  },
  newBest: {
    color: COLORS.coin,
    fontSize: 14,
    fontWeight: '800',
  },
  onPace: {
    color: COLORS.coin,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  actions: {
    width: '100%',
    marginTop: 20,
    gap: 8,
  },
  button: {
    backgroundColor: COLORS.player,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: '100%',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLORS.platform,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(93, 211, 158, 0.45)',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonLabel: {
    color: COLORS.scoreText,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonLabelPrimary: {
    color: '#0d1528',
    fontSize: 16,
    fontWeight: '800',
  },
});
