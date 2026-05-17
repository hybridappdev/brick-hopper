import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SUNSET_BACKGROUND } from '../constants/background';
import { COLORS } from '../constants';
import { PrimaryButton } from './PrimaryButton';

interface ScreenShellProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  scroll?: boolean;
}

export function ScreenShell({
  title,
  subtitle,
  onBack,
  children,
  contentStyle,
  scroll = false,
}: ScreenShellProps) {
  const insets = useSafeAreaInsets();

  const body = (
    <View style={[styles.content, contentStyle]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );

  return (
    <ImageBackground source={SUNSET_BACKGROUND} style={styles.bg} resizeMode="cover">
      <View style={[styles.overlay, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
        {onBack && (
          <PrimaryButton
            label="← Back"
            variant="ghost"
            onPress={onBack}
            style={styles.backButton}
          />
        )}

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {scroll ? (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {body}
            </ScrollView>
          ) : (
            body
          )}
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 31, 0.72)',
    paddingHorizontal: 24,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
    minWidth: 0,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  title: {
    color: COLORS.scoreText,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.scoreText,
    fontSize: 15,
    opacity: 0.75,
    textAlign: 'center',
    marginBottom: 20,
  },
});
