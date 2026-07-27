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

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function SecondaryButton({
  label,
  onPress,
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: SecondaryButtonProps) {
  const { colors } = useTheme();

  const isSmall = size === 'sm';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [
        styles.base,
        isSmall ? styles.smallPadding : styles.normalPadding,
        {
          backgroundColor: pressed ? colors.borderSubtle : colors.surfaceMuted,
          borderColor: colors.borderSubtle,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <AppText
            variant={isSmall ? 'label' : 'bodyMedium'}
            style={[{ color: colors.textPrimary }, textStyle]}
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  smallPadding: {
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  normalPadding: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: Spacing.xs,
  },
});
