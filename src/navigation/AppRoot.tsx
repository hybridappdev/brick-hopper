import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';
import { useApp } from '../context/AppContext';
import { GameEngine } from '../GameEngine';
import { CreateProfileScreen } from '../screens/CreateProfileScreen';
import { HighScoresScreen } from '../screens/HighScoresScreen';
import { IntroScreen } from '../screens/IntroScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export function AppRoot() {
  const {
    ready,
    screen,
    profile,
    settings,
    bestScore,
    exitGame,
    recordRun,
  } = useApp();

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.player} />
      </View>
    );
  }

  if (screen === 'game' && profile) {
    return (
      <GameEngine
        profile={profile}
        settings={settings}
        bestScore={bestScore}
        onExit={exitGame}
        onRunEnd={recordRun}
      />
    );
  }

  switch (screen) {
    case 'createProfile':
      return <CreateProfileScreen />;
    case 'editProfile':
      return <CreateProfileScreen />;
    case 'intro':
      return <IntroScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'highScores':
      return <HighScoresScreen />;
    default:
      return <IntroScreen />;
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
