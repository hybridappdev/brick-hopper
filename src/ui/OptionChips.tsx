import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';

export interface OptionChip<T extends string> {
  value: T;
  label: string;
}

interface OptionChipsProps<T extends string> {
  label: string;
  options: OptionChip<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function OptionChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: OptionChipsProps<T>) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Pressable
              key={option.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(option.value)}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    color: COLORS.scoreText,
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.player,
    borderColor: COLORS.platform,
  },
  chipLabel: {
    color: COLORS.scoreText,
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.75,
  },
  chipLabelActive: {
    opacity: 1,
  },
});
