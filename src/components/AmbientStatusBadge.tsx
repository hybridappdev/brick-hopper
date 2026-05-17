import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { useAmbientPreview } from '../context/AmbientPreviewContext';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function timeOfDayLabel(daylight: number): string {
  if (daylight > 0.85) {
    return 'Day';
  }
  if (daylight > 0.45) {
    return 'Dusk';
  }
  if (daylight > 0.15) {
    return 'Dawn';
  }
  return 'Night';
}

/** Live season + time readout synced to the menu ambient preview. */
export function AmbientStatusBadge() {
  const preview = useAmbientPreview();
  if (!preview) {
    return null;
  }

  const { ambient } = preview;

  return (
    <View style={styles.badge} pointerEvents="none">
      <Text style={styles.text}>
        {capitalize(ambient.season)} · {ambient.weatherLabel} · {timeOfDayLabel(ambient.daylight)}
      </Text>
      <Text style={styles.hint}>Sky cycles faster on menus</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    marginBottom: 4,
  },
  text: {
    color: COLORS.coin,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  hint: {
    color: COLORS.scoreText,
    fontSize: 11,
    opacity: 0.45,
    marginTop: 2,
  },
});
