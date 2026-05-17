import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SEASON_NAMES } from '../constants/ambient';
import { COLORS } from '../constants';
import {
  type AmbienceSettings,
  type AmbientCycleSpeed,
  DEFAULT_AMBIENCE,
  type SeasonPreference,
  type TimeOfDayPreference,
  type WeatherPreference,
} from '../constants/ambienceDefaults';
import { WEATHER_LABELS, type WeatherName } from '../constants/weather';
import { timeOfDayLabelFromPreference } from '../utils/resolveAmbience';
import { OptionChips } from './OptionChips';

interface AmbienceSettingsPanelProps {
  ambience: AmbienceSettings;
  onChange: (patch: Partial<AmbienceSettings>) => void;
}

const SEASON_OPTIONS: { value: SeasonPreference; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  ...SEASON_NAMES.map((s) => ({
    value: s as SeasonPreference,
    label: s.charAt(0).toUpperCase() + s.slice(1),
  })),
];

const TIME_OPTIONS: { value: TimeOfDayPreference; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'dawn', label: 'Dawn' },
  { value: 'day', label: 'Day' },
  { value: 'dusk', label: 'Dusk' },
  { value: 'night', label: 'Night' },
];

const WEATHER_OPTIONS: { value: WeatherPreference; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  ...(Object.keys(WEATHER_LABELS) as WeatherName[]).map((w) => ({
    value: w as WeatherPreference,
    label: WEATHER_LABELS[w],
  })),
];

const SPEED_OPTIONS: { value: AmbientCycleSpeed; label: string }[] = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
];

function ToggleRow({
  label,
  hint,
  value,
  onToggle,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={styles.toggleRow} onPress={onToggle}>
      <View style={styles.toggleText}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {hint && <Text style={styles.toggleHint}>{hint}</Text>}
      </View>
      <View style={[styles.toggle, value && styles.toggleOn]}>
        <View style={[styles.knob, value && styles.knobOn]} />
      </View>
    </Pressable>
  );
}

export function AmbienceSettingsPanel({ ambience, onChange }: AmbienceSettingsPanelProps) {
  return (
    <View>
      <Text style={styles.intro}>
        These choices apply in-game and on menus. Pick Auto to let the sky change, or lock season,
        time, or weather.
      </Text>

      <ToggleRow
        label="Dynamic sky cycles"
        hint="Off = calm summer day unless you pick below"
        value={ambience.dynamicCycles}
        onToggle={() => onChange({ dynamicCycles: !ambience.dynamicCycles })}
      />

      <OptionChips
        label="Season"
        options={SEASON_OPTIONS}
        value={ambience.season}
        onChange={(season) => onChange({ season })}
      />

      <OptionChips
        label="Time of day"
        options={TIME_OPTIONS}
        value={ambience.timeOfDay}
        onChange={(timeOfDay) => onChange({ timeOfDay })}
      />

      <OptionChips
        label="Weather"
        options={WEATHER_OPTIONS}
        value={ambience.weather}
        onChange={(weather) => onChange({ weather })}
      />

      <OptionChips
        label="Cycle speed (in-game)"
        options={SPEED_OPTIONS}
        value={ambience.cycleSpeed}
        onChange={(cycleSpeed) => onChange({ cycleSpeed })}
      />

      <ToggleRow
        label="Fast preview on menus"
        hint="Quickly showcase sky changes behind menus"
        value={ambience.fastMenuPreview}
        onToggle={() => onChange({ fastMenuPreview: !ambience.fastMenuPreview })}
      />

      <Pressable
        style={styles.resetRow}
        onPress={() => onChange(DEFAULT_AMBIENCE)}
      >
        <Text style={styles.resetLabel}>Reset sky to defaults</Text>
      </Pressable>

      <Text style={styles.summary}>
        Now: {ambience.season === 'auto' ? 'Auto season' : ambience.season},{' '}
        {timeOfDayLabelFromPreference(ambience.timeOfDay)},{' '}
        {ambience.weather === 'auto' ? 'Auto weather' : WEATHER_LABELS[ambience.weather]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    color: COLORS.scoreText,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.72,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  toggleText: {
    flex: 1,
    paddingRight: 12,
  },
  toggleLabel: {
    color: COLORS.scoreText,
    fontSize: 16,
  },
  toggleHint: {
    color: COLORS.scoreText,
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: COLORS.platform,
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.scoreText,
    alignSelf: 'flex-start',
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
  resetRow: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetLabel: {
    color: COLORS.coin,
    fontSize: 15,
    fontWeight: '600',
  },
  summary: {
    color: COLORS.scoreText,
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 4,
  },
});
