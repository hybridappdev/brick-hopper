import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './context/AppContext';
import { AppRoot } from './navigation/AppRoot';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={styles.root}>
          <StatusBar style="light" hidden />
          <AppRoot />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
