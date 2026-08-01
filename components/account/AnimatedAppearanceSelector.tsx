import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface AnimatedAppearanceSelectorProps {
  mode: 'light' | 'dark';
  onChange: (mode: 'light' | 'dark') => void;
}

export function AnimatedAppearanceSelector({
  mode,
  onChange,
}: AnimatedAppearanceSelectorProps) {
  const { colors, isDark } = useTheme();
  const [containerWidth, setContainerWidth] = React.useState(320);

  const isDarkMode = mode === 'dark';
  const progress = useSharedValue(isDarkMode ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isDarkMode ? 1 : 0, {
      damping: 18,
      stiffness: 180,
    });
  }, [isDarkMode]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  const tabWidth = (containerWidth - 8) / 2;

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * tabWidth }],
    };
  });

  const sunIconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1], [0, -45]);
    const scale = interpolate(progress.value, [0, 1], [1.1, 0.9]);
    return {
      transform: [{ rotate: `${rotate}deg` }, { scale }],
    };
  });

  const moonIconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1], [45, 0]);
    const scale = interpolate(progress.value, [0, 1], [0.9, 1.1]);
    return {
      transform: [{ rotate: `${rotate}deg` }, { scale }],
    };
  });

  const handleSelect = (newMode: 'light' | 'dark') => {
    if (mode === newMode) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onChange(newMode);
  };

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.track,
        {
          backgroundColor: isDark ? '#1E2330' : '#F1F5F9',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      {/* Sliding Active Pill */}
      <Animated.View
        style={[
          styles.activeSlider,
          {
            width: tabWidth,
            backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
            shadowColor: colors.accent,
          },
          sliderStyle,
        ]}
      />

      {/* Light Option */}
      <Pressable
        onPress={() => handleSelect('light')}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Switch to Light Theme"
        style={styles.tabButton}
      >
        <Animated.View style={[styles.iconWrapper, sunIconStyle]}>
          <Ionicons
            name="sunny"
            size={18}
            color={!isDarkMode ? colors.accent : '#94A3B8'}
          />
        </Animated.View>
        <Text
          style={[
            styles.tabText,
            {
              color: !isDarkMode ? (isDark ? '#FFFFFF' : '#0F172A') : '#94A3B8',
              fontWeight: !isDarkMode ? '800' : '600',
            },
          ]}
        >
          Light Mode
        </Text>
      </Pressable>

      {/* Dark Option */}
      <Pressable
        onPress={() => handleSelect('dark')}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Switch to Dark Theme"
        style={styles.tabButton}
      >
        <Animated.View style={[styles.iconWrapper, moonIconStyle]}>
          <Ionicons
            name="moon"
            size={17}
            color={isDarkMode ? colors.accent : '#94A3B8'}
          />
        </Animated.View>
        <Text
          style={[
            styles.tabText,
            {
              color: isDarkMode ? (isDark ? '#FFFFFF' : '#0F172A') : '#94A3B8',
              fontWeight: isDarkMode ? '800' : '600',
            },
          ]}
        >
          Dark Mode
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    position: 'relative',
    height: 48,
  },
  activeSlider: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: Radius.full,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    height: '100%',
    gap: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13,
    letterSpacing: -0.2,
  },
});
