import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AVATAR_COLORS } from '../constants/avatars';
import { COLORS } from '../constants';
import { useApp } from '../context/AppContext';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ScreenShell } from '../ui/ScreenShell';

export function CreateProfileScreen() {
  const { saveProfile, profile, navigate } = useApp();
  const [name, setName] = useState(profile?.displayName ?? '');
  const [color, setColor] = useState(profile?.avatarColor ?? AVATAR_COLORS[0]);

  const canContinue = name.trim().length >= 2;

  return (
    <ScreenShell
      title={profile ? 'Edit Profile' : 'Create Profile'}
      subtitle="Pick a name and brick color"
      scroll
      onBack={profile ? () => navigate('settings') : undefined}
    >
      <View style={[styles.previewBrick, { backgroundColor: color }]} />

      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor="rgba(234,234,234,0.35)"
        value={name}
        onChangeText={setName}
        maxLength={16}
        autoCapitalize="words"
        autoCorrect={false}
      />

      <Text style={styles.colorLabel}>Brick color</Text>
      <View style={styles.colorRow}>
        {AVATAR_COLORS.map((c) => (
          <Pressable
            key={c}
            style={[
              styles.colorSwatch,
              { backgroundColor: c },
              color === c && styles.colorSwatchActive,
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <PrimaryButton
        label={profile ? 'Save' : 'Continue'}
        onPress={() => saveProfile(name, color)}
        disabled={!canContinue}
        style={styles.continue}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  previewBrick: {
    width: 56,
    height: 72,
    borderRadius: 6,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'rgba(22, 33, 62, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.platform,
    color: COLORS.scoreText,
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  colorLabel: {
    color: COLORS.scoreText,
    fontSize: 13,
    opacity: 0.6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 28,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchActive: {
    borderColor: COLORS.scoreText,
  },
  continue: {
    marginTop: 8,
  },
});
