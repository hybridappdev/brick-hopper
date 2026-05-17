import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import type { HopLevel, InputPatch } from '../types/ecs';

interface HopSpeedControlsProps {
  onInputChange: (patch: InputPatch) => void;
  enabled?: boolean;
  bottom: number;
  initialSpeed?: HopLevel;
}

const SPEEDS: { level: HopLevel; label: string }[] = [
  { level: 0, label: 'Slow' },
  { level: 1, label: 'Normal' },
  { level: 2, label: 'Fast' },
];

export function HopSpeedControls({
  onInputChange,
  enabled = true,
  bottom,
  initialSpeed = 1,
}: HopSpeedControlsProps) {
  const [active, setActive] = useState<HopLevel>(initialSpeed);

  useEffect(() => {
    setActive(initialSpeed);
    onInputChange({ hopSpeed: initialSpeed });
  }, [initialSpeed]);

  const selectSpeed = (level: HopLevel) => {
    if (!enabled) {
      return;
    }
    setActive(level);
    onInputChange({ hopSpeed: level });
  };

  useEffect(() => {
    if (!enabled || Platform.OS !== 'web') {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') selectSpeed(0);
      if (e.key === '2') selectSpeed(1);
      if (e.key === '3') selectSpeed(2);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, onInputChange]);

  return (
    <View style={[styles.container, { bottom }]} pointerEvents="box-none">
      <Text style={styles.label}>Hop speed</Text>
      <View style={styles.row}>
        {SPEEDS.map(({ level, label }) => {
          const isActive = active === level;
          return (
            <Pressable
              key={level}
              style={({ pressed }) => [
                styles.segment,
                isActive && styles.segmentActive,
                pressed && styles.segmentPressed,
                !enabled && styles.segmentDisabled,
              ]}
              onPress={() => selectSpeed(level)}
              disabled={!enabled}
            >
              <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
    elevation: 20,
  },
  label: {
    color: COLORS.scoreText,
    fontSize: 11,
    opacity: 0.5,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 26, 51, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  segmentActive: {
    backgroundColor: COLORS.player,
    borderColor: COLORS.platform,
  },
  segmentPressed: {
    opacity: 0.85,
  },
  segmentDisabled: {
    opacity: 0.4,
  },
  segmentLabel: {
    color: COLORS.scoreText,
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  segmentLabelActive: {
    opacity: 1,
  },
});
