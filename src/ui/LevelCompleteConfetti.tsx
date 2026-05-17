import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';

const CONFETTI_COLORS = [COLORS.coin, COLORS.platform, COLORS.player, '#ffffff', '#7ec8ff'];
const PARTICLE_COUNT = 32;

interface ParticleSpec {
  id: number;
  originX: number;
  driftX: number;
  riseY: number;
  fallY: number;
  size: number;
  color: string;
  delay: number;
  spin: number;
  isCircle: boolean;
}

function randomParticle(id: number, spread: number): ParticleSpec {
  const angle = (Math.random() * 0.8 + 0.1) * Math.PI;
  const force = 80 + Math.random() * 160;
  return {
    id,
    originX: (Math.random() - 0.5) * spread * 0.35,
    driftX: Math.cos(angle) * force * (Math.random() > 0.5 ? 1 : -1),
    riseY: -(40 + Math.random() * 90),
    fallY: 120 + Math.random() * 220,
    size: 5 + Math.random() * 7,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? COLORS.coin,
    delay: Math.random() * 180,
    spin: (Math.random() - 0.5) * 720,
    isCircle: Math.random() > 0.45,
  };
}

function ConfettiParticle({ spec }: { spec: ParticleSpec }) {
  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(spec.delay),
      Animated.parallel([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1400 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 520,
            delay: 700,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [opacity, progress, spec.delay]);

  const translateX = progress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [spec.originX, spec.originX + spec.driftX * 0.55, spec.originX + spec.driftX],
  });

  const translateY = progress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, spec.riseY, spec.fallY],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${spec.spin}deg`],
  });

  const scale = progress.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 1.2, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: spec.size,
          height: spec.isCircle ? spec.size : spec.size * 0.45,
          borderRadius: spec.isCircle ? spec.size / 2 : 2,
          backgroundColor: spec.color,
          opacity,
          transform: [{ translateX }, { translateY }, { rotate }, { scale }],
        },
      ]}
    />
  );
}

interface LevelCompleteConfettiProps {
  spread?: number;
}

export function LevelCompleteConfetti({ spread = 320 }: LevelCompleteConfettiProps) {
  const particles = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, id) => randomParticle(id, spread)),
    [spread],
  );

  return (
    <View style={styles.layer} pointerEvents="none">
      {particles.map((spec) => (
        <ConfettiParticle key={spec.id} spec={spec} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
});
