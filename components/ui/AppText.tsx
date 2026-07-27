import React from 'react';
import { Text, StyleSheet, TextStyle, TextProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './theme';

export type TextVariant =
  | 'display'
  | 'title'
  | 'sectionTitle'
  | 'body'
  | 'bodyMedium'
  | 'label'
  | 'caption'
  | 'micro'
  // Backward compatibility aliases
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyBold'
  | 'captionBold';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'inverse'
  // Backward compatibility alias
  | 'emerald'
  | 'muted';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  style?: TextStyle;
  children: React.ReactNode;
}

export function AppText({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();

  // Normalize variants
  const resolvedVariant =
    variant === 'h1'
      ? 'display'
      : variant === 'h2'
      ? 'title'
      : variant === 'h3'
      ? 'sectionTitle'
      : variant === 'bodyBold'
      ? 'bodyMedium'
      : variant === 'captionBold'
      ? 'label'
      : variant;

  const colorStyle: TextStyle = {
    color:
      color === 'secondary'
        ? colors.textSecondary
        : color === 'tertiary' || color === 'muted'
        ? colors.textTertiary
        : color === 'accent'
        ? colors.accent
        : color === 'success' || color === 'emerald'
        ? colors.success
        : color === 'warning'
        ? colors.warning
        : color === 'danger'
        ? colors.danger
        : color === 'inverse'
        ? '#FFFFFF'
        : colors.textPrimary,
  };

  return (
    <Text
      style={[styles[resolvedVariant], colorStyle, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  display: Typography.display,
  title: Typography.title,
  sectionTitle: Typography.sectionTitle,
  body: Typography.body,
  bodyMedium: Typography.bodyMedium,
  label: Typography.label,
  caption: Typography.caption,
  micro: Typography.micro,
});
