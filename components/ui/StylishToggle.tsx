import React, { useEffect } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface StylishToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  size?: 'sm' | 'md';
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel?: string;
}

export function StylishToggle({
  value,
  onValueChange,
  activeColor,
  inactiveColor,
  size = 'md',
  icon,
  accessibilityLabel,
}: StylishToggleProps) {
  const { colors, isDark } = useTheme();

  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 220,
    });
  }, [value]);

  const effectiveActiveColor = activeColor || colors.accent;
  const effectiveInactiveColor =
    inactiveColor || (isDark ? '#334155' : '#CBD5E1');

  const isSmall = size === 'sm';
  const trackWidth = isSmall ? 44 : 52;
  const trackHeight = isSmall ? 26 : 30;
  const thumbSize = isSmall ? 20 : 24;
  const travelDistance = trackWidth - thumbSize - (isSmall ? 6 : 6);

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [effectiveInactiveColor, effectiveActiveColor]
    );
    return {
      backgroundColor,
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * travelDistance }],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onValueChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
          },
          animatedTrackStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
            },
            animatedThumbStyle,
          ]}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={isSmall ? 10 : 12}
              color={value ? effectiveActiveColor : '#94A3B8'}
            />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    paddingHorizontal: 3,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 1,
  },
  thumb: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 3,
  },
});
