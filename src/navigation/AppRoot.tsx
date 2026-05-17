import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';
import { useApp } from '../context/AppContext';
import { preloadBackgroundAssets } from '../utils/backgroundAssets';
import { GameEngine } from '../GameEngine';
import { CreateProfileScreen } from '../screens/CreateProfileScreen';
import { HighScoresScreen } from '../screens/HighScoresScreen';
import { IntroScreen } from '../screens/IntroScreen';
import { LevelPickerScreen } from '../screens/LevelPickerScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export function AppRoot() {
  const {
    ready,
    screen,
    profile,
    settings,
    bestScore,
    gameStartLevel,
    gameRunMode,
    unlockedLevelMaxIndex,
    exitGame,
    recordRun,
    unlockLevelProgress,
  } = useApp();

  useEffect(() => {
    void preloadBackgroundAssets();
  }, []);

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
        startLevelIndex={gameStartLevel}
        runMode={gameRunMode}
        unlockedLevelMaxIndex={unlockedLevelMaxIndex}
        onExit={exitGame}
        onRunEnd={recordRun}
        onLevelComplete={unlockLevelProgress}
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
    case 'levelPicker':
      return <LevelPickerScreen />;
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
