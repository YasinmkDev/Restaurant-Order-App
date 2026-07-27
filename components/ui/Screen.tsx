import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  safeBottom?: boolean;
}

export function Screen({
  children,
  style,
  edges = ['top', 'left', 'right'],
  safeBottom = false,
}: ScreenProps) {
  const { colors, isDark } = useTheme();

  const activeEdges: Edge[] = safeBottom ? [...edges, 'bottom'] : edges;

  return (
    <SafeAreaView
      edges={activeEdges}
      style={[styles.container, { backgroundColor: colors.background }, style]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
