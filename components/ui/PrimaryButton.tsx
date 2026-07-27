import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from './theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'; // for backwards compatibility
}

export function PrimaryButton({
  label,
  onPress,
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: PrimaryButtonProps) {
  const { colors } = useTheme();

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const containerPadding = isSmall
    ? { paddingVertical: 10, paddingHorizontal: 16 }
    : isLarge
    ? { paddingVertical: 16, paddingHorizontal: 24 }
    : { paddingVertical: 14, paddingHorizontal: 20 };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [
        styles.base,
        containerPadding,
        {
          backgroundColor: pressed ? colors.accentPressed : colors.accent,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <AppText
            variant={isSmall ? 'label' : 'bodyMedium'}
            style={[styles.label, textStyle]}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: Spacing.xs,
  },
  label: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
