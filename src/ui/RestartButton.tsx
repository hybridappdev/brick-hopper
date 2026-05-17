import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants';

interface RestartButtonProps {
  onPress: () => void;
}

export function RestartButton({ onPress }: RestartButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
      hitSlop={12}
    >
      <Text style={styles.label}>Restart</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.controlBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonPressed: {
    backgroundColor: COLORS.controlActive,
  },
  label: {
    color: COLORS.scoreText,
    fontSize: 14,
    fontWeight: '700',
  },
});
