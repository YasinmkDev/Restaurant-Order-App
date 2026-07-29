import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export interface ColorSurgeCurtainProps {
  /**
   * Active tab index to trigger directional surge on change.
   */
  currentIndex: number;
}

export function ColorSurgeCurtain({ currentIndex }: ColorSurgeCurtainProps) {
  const { colors } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const prevIndexRef = useRef(currentIndex);
  const isFirstRender = useRef(true);

  // Extra width so the skewed sheet completely blankets screen and corners
  const sheetWidth = Math.round(screenWidth * 1.6);
  const offscreenDistance = Math.round(screenWidth * 1.5);

  const translateX = useSharedValue(-offscreenDistance);
  const opacity = useSharedValue(0);
  const skewDeg = useSharedValue('-6deg');

  const badgeOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0.85);

  useEffect(() => {
    // Avoid animating on initial app mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevIndexRef.current = currentIndex;
      return;
    }

    if (currentIndex === prevIndexRef.current) return;

    const isForward = currentIndex > prevIndexRef.current;
    prevIndexRef.current = currentIndex;

    // Choreographed 3-stage sweep:
    // Stage 1: Sweep in from edge to center (320ms)
    // Stage 2: Hold over screen so user clearly sees the orange surge (200ms)
    // Stage 3: Sweep out past the opposite edge (320ms)
    // Total: ~840ms
    const IN_DURATION = 320;
    const HOLD_DURATION = 200;
    const OUT_DURATION = 320;

    const inEasing = Easing.bezier(0.16, 1, 0.3, 1);
    const outEasing = Easing.bezier(0.35, 0, 0.8, 0.95);

    opacity.value = 1;

    // Badge pop in center while screen is covered
    badgeOpacity.value = withSequence(
      withDelay(140, withTiming(1, { duration: 160 })),
      withDelay(HOLD_DURATION, withTiming(0, { duration: 180 }))
    );

    badgeScale.value = withSequence(
      withDelay(140, withSpring(1.08, { damping: 10, stiffness: 280 })),
      withDelay(HOLD_DURATION, withTiming(0.88, { duration: 180 }))
    );

    if (isForward) {
      // Sweeping Left → Right
      skewDeg.value = '-6deg';
      translateX.value = -offscreenDistance;

      translateX.value = withSequence(
        // 1. Sweep to center covering the full screen
        withTiming(0, { duration: IN_DURATION, easing: inEasing }),
        // 2. Hold across the screen, then sweep out
        withDelay(
          HOLD_DURATION,
          withTiming(
            offscreenDistance,
            { duration: OUT_DURATION, easing: outEasing },
            (finished) => {
              if (finished) {
                opacity.value = 0;
              }
            }
          )
        )
      );
    } else {
      // Sweeping Right → Left
      skewDeg.value = '6deg';
      translateX.value = offscreenDistance;

      translateX.value = withSequence(
        // 1. Sweep to center covering the full screen
        withTiming(0, { duration: IN_DURATION, easing: inEasing }),
        // 2. Hold across the screen, then sweep out
        withDelay(
          HOLD_DURATION,
          withTiming(
            -offscreenDistance,
            { duration: OUT_DURATION, easing: outEasing },
            (finished) => {
              if (finished) {
                opacity.value = 0;
              }
            }
          )
        )
      );
    }
  }, [currentIndex, offscreenDistance]);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { skewX: skewDeg.value },
    ],
  }));

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));

  const surgeColor = colors.accent;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.fullScreenOverlay,
        { width: screenWidth, height: screenHeight },
      ]}
    >
      <Animated.View
        style={[
          styles.surgeSheet,
          {
            width: sheetWidth,
            height: screenHeight * 1.4,
            top: -screenHeight * 0.2,
            left: (screenWidth - sheetWidth) / 2,
            backgroundColor: surgeColor,
            shadowColor: surgeColor,
          },
          animatedSheetStyle,
        ]}
      >
        {/* Leading edge light strip */}
        <View style={styles.leadingGlowBar} />
        {/* Trailing edge soft accent */}
        <View style={styles.trailingGlowBar} />

        {/* Centered Brand Mark that pops into view while the screen is blanketed in orange */}
        <Animated.View style={[styles.centerBadgeWrap, animatedBadgeStyle]}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="bike-fast" size={44} color={surgeColor} />
          </View>
          <Text style={styles.brandTitle}>SWIFT</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 900,
    overflow: 'hidden',
  },
  surgeSheet: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 32,
  },
  leadingGlowBar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 10,
  },
  trailingGlowBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  centerBadgeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
