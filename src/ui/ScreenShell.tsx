import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AmbientStatusBadge } from '../components/AmbientStatusBadge';
import { COLORS } from '../constants';
import { useApp } from '../context/AppContext';
import { AmbientPreviewProvider } from '../context/AmbientPreviewContext';
import { PrimaryButton } from './PrimaryButton';

interface ScreenShellProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  scroll?: boolean;
  /** Fast-forward day/night + seasons behind menu screens. */
  ambientPreview?: boolean;
  /** Show live season / time-of-day chip (requires ambientPreview). */
  showAmbientBadge?: boolean;
}

export function ScreenShell({
  title,
  subtitle,
  onBack,
  children,
  contentStyle,
  scroll = false,
  ambientPreview = true,
  showAmbientBadge = true,
}: ScreenShellProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { settings } = useApp();

  const body = (
    <View style={[styles.content, contentStyle]}>
      {ambientPreview && showAmbientBadge && <AmbientStatusBadge />}
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );

  const shell = (
    <View
      style={[
        styles.overlay,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
      ]}
    >
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
  );

  return (
    <View style={styles.bg}>
      {ambientPreview ? (
        <AmbientPreviewProvider width={width} height={height} ambience={settings.ambience}>
          {shell}
        </AmbientPreviewProvider>
      ) : (
        shell
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: COLORS.sky,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 31, 0.58)',
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
