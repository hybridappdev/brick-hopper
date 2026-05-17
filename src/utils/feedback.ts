import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

async function safeImpact(style: Haptics.ImpactFeedbackStyle): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  try {
    await Haptics.impactAsync(style);
  } catch {
    // Haptics unavailable on some devices/simulators
  }
}

async function safeNotification(type: Haptics.NotificationFeedbackType): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  try {
    await Haptics.notificationAsync(type);
  } catch {
    // noop
  }
}

export function playCoinFeedback(): void {
  void safeImpact(Haptics.ImpactFeedbackStyle.Light);
}

export function playHopFeedback(): void {
  void safeImpact(Haptics.ImpactFeedbackStyle.Medium);
}

export function playHitFeedback(): void {
  void safeNotification(Haptics.NotificationFeedbackType.Error);
}

export function playLevelCompleteFeedback(): void {
  void safeNotification(Haptics.NotificationFeedbackType.Success);
}
