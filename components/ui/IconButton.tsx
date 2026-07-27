import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Radius } from './theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: 'subtle' | 'raised' | 'transparent';
  size?: number;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'subtle',
  size = 44,
  style,
}: IconButtonProps) {
  const { colors } = useTheme();

  const backgroundColor =
    variant === 'raised'
      ? colors.surfaceRaised
      : variant === 'subtle'
      ? colors.surfaceMuted
      : 'transparent';

  const borderColor =
    variant === 'transparent' ? 'transparent' : colors.borderSubtle;

  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: Radius.full,
          backgroundColor,
          borderColor,
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
});
