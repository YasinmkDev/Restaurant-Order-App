import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface DividerProps {
  style?: ViewStyle;
  spacing?: number;
}

export function Divider({ style, spacing = 0 }: DividerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.line,
        {
          backgroundColor: colors.divider,
          marginVertical: spacing,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
