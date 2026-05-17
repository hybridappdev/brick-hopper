import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { useApp } from '../context/AppContext';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ScreenShell } from '../ui/ScreenShell';
export function IntroScreen() {
  const { profile, bestScore, highScores, startGame, navigate } = useApp();

  if (!profile) {
    return null;
  }

  const topScore = highScores[0]?.score ?? bestScore;

  return (
    <ScreenShell>
      <Text style={styles.logo}>Brick Hopper</Text>
      <Text style={styles.tagline}>Tilt. Hop. Collect. Stomp.</Text>

      <View style={styles.playerCard}>
        <View style={[styles.avatar, { backgroundColor: profile.avatarColor }]} />
        <View>
          <Text style={styles.playerLabel}>Playing as</Text>
          <Text style={styles.playerName}>{profile.displayName}</Text>
        </View>
      </View>

      {topScore > 0 && (
        <Text style={styles.bestScore}>Best run · {topScore} pts</Text>
      )}

      <View style={styles.actions}>
        <PrimaryButton label="Play" onPress={startGame} />
        <PrimaryButton label="Levels" variant="secondary" onPress={() => navigate('levelPicker')} />
        <PrimaryButton label="High Scores" variant="secondary" onPress={() => navigate('highScores')} />
        <PrimaryButton label="Settings" variant="secondary" onPress={() => navigate('settings')} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  logo: {
    color: COLORS.scoreText,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tagline: {
    color: COLORS.coin,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 28,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(22, 33, 62, 0.85)',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.platform,
    marginBottom: 12,
    minWidth: 260,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  playerLabel: {
    color: COLORS.scoreText,
    fontSize: 11,
    opacity: 0.55,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playerName: {
    color: COLORS.scoreText,
    fontSize: 18,
    fontWeight: '700',
  },
  bestScore: {
    color: COLORS.scoreText,
    fontSize: 14,
    opacity: 0.65,
    marginBottom: 20,
  },
  actions: {
    gap: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
});
