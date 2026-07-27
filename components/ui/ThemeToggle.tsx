import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius } from './theme';

export function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();

  const handlePress = () => {
    Haptics.selectionAsync().catch(() => {});
    toggleTheme();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surfaceMuted,
          borderColor: colors.borderSubtle,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon-outline'}
        size={18}
        color={isDark ? '#F2B542' : colors.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
