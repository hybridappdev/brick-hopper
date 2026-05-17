import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let hapticsEnabled = true;

export function setHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
}

async function safeImpact(style: Haptics.ImpactFeedbackStyle): Promise<void> {
  if (Platform.OS === 'web' || !hapticsEnabled) {
    return;
  }
  try {
    await Haptics.impactAsync(style);
  } catch {
    // Haptics unavailable on some devices/simulators
  }
}

async function safeNotification(type: Haptics.NotificationFeedbackType): Promise<void> {
  if (Platform.OS === 'web' || !hapticsEnabled) {
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

export function playStompFeedback(): void {
  void safeImpact(Haptics.ImpactFeedbackStyle.Medium);
}
