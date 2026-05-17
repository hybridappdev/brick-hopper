import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../constants';
import { formatElapsed } from '../utils/formatTime';

interface GameTopBarProps {
  score: number;
  bestScore: number;
  lives: number;
  maxLives: number;
  remainingCoins: number;
  totalCoins: number;
  levelIndex: number;
  levelElapsedMs: number;
  runElapsedMs: number;
  showTimer: boolean;
  top: number;
  paddingLeft: number;
  paddingRight: number;
  onMenu: () => void;
  onRestart: () => void;
}

function CoinIcon({ size = 13 }: { size?: number }) {
  return (
    <View
      style={[
        styles.coinIcon,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View
        style={[
          styles.coinIconShine,
          {
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: size * 0.2,
            top: size * 0.18,
            left: size * 0.22,
          },
        ]}
      />
    </View>
  );
}

function LivesDisplay({ lives, maxLives }: { lives: number; maxLives: number }) {
  return (
    <View style={styles.livesZone}>
      {Array.from({ length: maxLives }, (_, i) => (
        <Text
          key={i}
          style={[styles.heart, i < lives ? styles.heartFull : styles.heartEmpty]}
        >
          ♥
        </Text>
      ))}
    </View>
  );
}

function CoinProgress({
  collected,
  total,
}: {
  collected: number;
  total: number;
}) {
  const fillAnim = useRef(new Animated.Value(total > 0 ? collected / total : 0)).current;

  useEffect(() => {
    const target = total > 0 ? collected / total : 0;
    Animated.spring(fillAnim, {
      toValue: target,
      friction: 8,
      tension: 120,
      useNativeDriver: false,
    }).start();
  }, [collected, total, fillAnim]);

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.coinZone}>
      <CoinIcon />
      <View style={styles.coinMeta}>
        <Text style={styles.coinCount}>
          {collected}
          <Text style={styles.coinCountDim}>/{total}</Text>
        </Text>
        <View style={styles.coinTrack}>
          <Animated.View style={[styles.coinFill, { width: fillWidth }]} />
        </View>
      </View>
    </View>
  );
}

function ChromeButton({
  label,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.chromeBtn, pressed && styles.chromeBtnPressed]}
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.chromeBtnLabel}>{label}</Text>
    </Pressable>
  );
}

export function GameTopBar({
  score,
  bestScore,
  lives,
  maxLives,
  remainingCoins,
  totalCoins,
  levelIndex,
  levelElapsedMs,
  runElapsedMs,
  showTimer,
  top,
  paddingLeft,
  paddingRight,
  onMenu,
  onRestart,
}: GameTopBarProps) {
  const [displayScore, setDisplayScore] = useState(score);
  const scoreScale = useRef(new Animated.Value(1)).current;
  const scorePop = useRef(new Animated.Value(0)).current;
  const prevScoreRef = useRef(score);
  const rafRef = useRef<number | null>(null);

  const collectedCoins = Math.max(0, totalCoins - remainingCoins);
  const isNewBest = bestScore > 0 && score > bestScore;

  useEffect(() => {
    if (score === prevScoreRef.current) {
      return;
    }

    const from = prevScoreRef.current;
    const to = score;
    prevScoreRef.current = score;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const duration = Math.min(360, 140 + Math.abs(to - from) * 6);
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplayScore(Math.round(from + (to - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    if (to > from) {
      scoreScale.setValue(1);
      scorePop.setValue(1);
      Animated.parallel([
        Animated.sequence([
          Animated.spring(scoreScale, {
            toValue: 1.08,
            friction: 5,
            tension: 320,
            useNativeDriver: true,
          }),
          Animated.spring(scoreScale, {
            toValue: 1,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scorePop, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [score, scoreScale, scorePop]);

  const popOpacity = scorePop.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const timerLabel =
    showTimer && levelIndex > 0
      ? formatElapsed(runElapsedMs)
      : showTimer
        ? formatElapsed(levelElapsedMs)
        : null;

  return (
    <View
      style={[
        styles.shell,
        { top, paddingLeft, paddingRight },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        <ChromeButton label="☰" onPress={onMenu} accessibilityLabel="Menu" />

        <View style={styles.divider} />

        <CoinProgress collected={collectedCoins} total={totalCoins} />

        <View style={styles.divider} />

        <LivesDisplay lives={lives} maxLives={maxLives} />

        <View style={styles.divider} />

        <View style={styles.scoreZone}>
          <Animated.View
            style={[styles.scorePop, { opacity: popOpacity }]}
            pointerEvents="none"
          />
          <Animated.Text
            style={[styles.scoreValue, { transform: [{ scale: scoreScale }] }]}
          >
            {displayScore.toLocaleString()}
          </Animated.Text>
          {isNewBest && <Text style={styles.bestTag}>★ best</Text>}
        </View>

        <View style={styles.divider} />

        <View style={styles.levelZone}>
          <Text style={styles.levelLabel}>LVL</Text>
          <Text style={styles.levelValue}>{levelIndex + 1}</Text>
          {timerLabel !== null && <Text style={styles.timer}>{timerLabel}</Text>}
        </View>

        <View style={styles.divider} />

        <ChromeButton label="↻" onPress={onRestart} accessibilityLabel="Restart" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 12, 28, 0.72)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 7,
    paddingHorizontal: 8,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
      default: {},
    }),
  },
  chromeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.controlBg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chromeBtnPressed: {
    backgroundColor: COLORS.controlActive,
  },
  chromeBtnLabel: {
    color: COLORS.scoreText,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 20,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  coinZone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 64,
  },
  coinIcon: {
    backgroundColor: COLORS.coin,
    borderWidth: 1.5,
    borderColor: '#e8b020',
    justifyContent: 'center',
  },
  coinIconShine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  coinMeta: {
    flex: 1,
    gap: 3,
  },
  coinCount: {
    color: COLORS.scoreText,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  coinCountDim: {
    color: COLORS.scoreText,
    fontWeight: '600',
    opacity: 0.45,
  },
  coinTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    overflow: 'hidden',
  },
  coinFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.coin,
  },
  scoreZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  scorePop: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.coin,
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.8,
    includeFontPadding: false,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  bestTag: {
    color: COLORS.coin,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginTop: -2,
    textTransform: 'lowercase',
  },
  levelZone: {
    width: 44,
    alignItems: 'center',
  },
  levelLabel: {
    color: COLORS.scoreText,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    opacity: 0.45,
  },
  levelValue: {
    color: COLORS.scoreText,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
    marginTop: -2,
  },
  timer: {
    color: COLORS.scoreText,
    fontSize: 9,
    fontWeight: '700',
    opacity: 0.5,
    marginTop: 1,
  },
  livesZone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minWidth: 44,
    justifyContent: 'center',
  },
  heart: {
    fontSize: 14,
    lineHeight: 16,
  },
  heartFull: {
    color: COLORS.player,
  },
  heartEmpty: {
    color: 'rgba(234, 234, 234, 0.2)',
  },
});
