import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { useApp } from '../context/AppContext';
import type { HopLevel } from '../types/ecs';
import { ScreenShell } from '../ui/ScreenShell';

const HOP_OPTIONS: { level: HopLevel; label: string }[] = [
  { level: 0, label: 'Slow' },
  { level: 1, label: 'Normal' },
  { level: 2, label: 'Fast' },
];

export function SettingsScreen() {
  const { settings, updateSettings, navigate, clearHighScores, profile } = useApp();

  return (
    <ScreenShell title="Settings" onBack={() => navigate('intro')} scroll>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gameplay</Text>

        <ToggleRow
          label="Haptic feedback"
          value={settings.hapticsEnabled}
          onToggle={() => updateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
        />

        <ToggleRow
          label="Show timer in game"
          value={settings.showTimer}
          onToggle={() => updateSettings({ showTimer: !settings.showTimer })}
        />

        <Text style={styles.fieldLabel}>Default hop speed</Text>
        <View style={styles.segmentRow}>
          {HOP_OPTIONS.map(({ level, label }) => (
            <Pressable
              key={level}
              style={[
                styles.segment,
                settings.defaultHopSpeed === level && styles.segmentActive,
              ]}
              onPress={() => updateSettings({ defaultHopSpeed: level })}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  settings.defaultHopSpeed === level && styles.segmentLabelActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Pressable style={styles.linkRow} onPress={() => navigate('editProfile')}>
          <Text style={styles.linkLabel}>Edit profile</Text>
          <Text style={styles.linkHint}>{profile?.displayName}</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <Pressable
          style={styles.dangerRow}
          onPress={() =>
            Alert.alert('Clear high scores?', 'This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: () => void clearHighScores() },
            ])
          }
        >
          <Text style={styles.dangerLabel}>Clear high scores</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={styles.toggleRow} onPress={onToggle}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.toggle, value && styles.toggleOn]}>
        <View style={[styles.knob, value && styles.knobOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(22, 33, 62, 0.85)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.platform,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.scoreText,
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.55,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  toggleLabel: {
    color: COLORS.scoreText,
    fontSize: 16,
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
  fieldLabel: {
    color: COLORS.scoreText,
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 8,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: COLORS.player,
  },
  segmentLabel: {
    color: COLORS.scoreText,
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '600',
  },
  segmentLabelActive: {
    opacity: 1,
  },
  linkRow: {
    paddingVertical: 12,
  },
  linkLabel: {
    color: COLORS.scoreText,
    fontSize: 16,
    fontWeight: '600',
  },
  linkHint: {
    color: COLORS.scoreText,
    fontSize: 13,
    opacity: 0.5,
    marginTop: 2,
  },
  dangerRow: {
    paddingVertical: 12,
  },
  dangerLabel: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
});
