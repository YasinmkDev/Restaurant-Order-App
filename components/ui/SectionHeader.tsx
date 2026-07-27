import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../../hooks/useTheme';
import { Spacing } from './theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  accessibilityLabel?: string;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  accessibilityLabel,
}: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="sectionTitle">{title}</AppText>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || actionLabel}
        >
          <AppText variant="label" style={{ color: colors.accent }}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
});
