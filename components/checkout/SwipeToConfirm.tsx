import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { formatCurrency } from '../../lib/currency';

interface SwipeToConfirmProps {
  onConfirm: () => void;
  isLoading?: boolean;
  totalAmount?: number;
}

const THUMB_SIZE = 52;
const PADDING = 5;
const CONFIRM_THRESHOLD = 0.82;

export function SwipeToConfirm({
  onConfirm,
  isLoading = false,
  totalAmount,
}: SwipeToConfirmProps) {
  const { colors, isDark } = useTheme();

  const [trackWidth, setTrackWidth] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const translateX = useSharedValue(0);
  const isConfirmed = useSharedValue(false);
  const successScale = useSharedValue(0);

  // Chevron shimmer breathing animation
  const shimmerTranslate = useSharedValue(0);
  const shimmerOpacity = useSharedValue(0.4);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    shimmerOpacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [shimmerTranslate, shimmerOpacity]);

  const maxTranslateX = Math.max(0, trackWidth - THUMB_SIZE - PADDING * 2);

  const triggerHapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const handleConfirmedJS = () => {
    setIsLocked(true);
    setShowSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    setTimeout(() => {
      onConfirm();
    }, 750);
  };

  const panGesture = Gesture.Pan()
    .enabled(!isLocked && !isLoading && trackWidth > 0)
    .onUpdate((event) => {
      'worklet';
      if (isConfirmed.value) return;
      const newX = Math.min(Math.max(0, event.translationX), maxTranslateX);
      translateX.value = newX;
    })
    .onEnd(() => {
      'worklet';
      if (isConfirmed.value) return;

      const progress = maxTranslateX > 0 ? translateX.value / maxTranslateX : 0;

      if (progress >= CONFIRM_THRESHOLD) {
        isConfirmed.value = true;
        translateX.value = withTiming(maxTranslateX, { duration: 130 });
        successScale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) });
        runOnJS(handleConfirmedJS)();
      } else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 260,
          overshootClamping: true,
        });
      }
    });

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && width !== trackWidth) {
      setTrackWidth(width);
    }
  };

  // Draggable thumb animation style
  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [0, maxTranslateX],
      [0, 25],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      translateX.value,
      [0, maxTranslateX * 0.5, maxTranslateX],
      [1, 1.05, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  // Gradient progress fill animation style
  const progressFillAnimatedStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_SIZE + PADDING,
    opacity: interpolate(
      translateX.value,
      [0, maxTranslateX * 0.1, maxTranslateX],
      [0, 0.9, 1],
      Extrapolation.CLAMP
    ),
  }));

  // Shimmering instruction label animation style
  const labelAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, maxTranslateX * 0.45],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: isConfirmed.value ? 0 : opacity,
    };
  });

  // Animated chevrons
  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
    opacity: shimmerOpacity.value,
  }));

  // Success text pop style - contained micro-scale
  const successPopStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      successScale.value,
      [0, 1],
      [0.94, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity: successScale.value,
    };
  });

  const handleAccessibleFallback = () => {
    if (isLocked || isLoading) return;
    setIsLocked(true);
    setShowSuccess(true);
    successScale.value = withTiming(1, { duration: 180 });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setTimeout(() => {
      onConfirm();
    }, 600);
  };

  return (
    <View style={styles.wrapper}>
      {/* ── Outer Glowing Track Container ── */}
      <View
        onLayout={onTrackLayout}
        style={[
          styles.track,
          {
            backgroundColor: isDark ? '#1C1917' : '#0F172A',
            borderColor: isDark ? 'rgba(255, 107, 0, 0.35)' : '#334155',
          },
        ]}
      >
        {/* Glowing Orange Progress Trail Fill */}
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: colors.accent },
            progressFillAnimatedStyle,
          ]}
        />

        {/* ── Instructional Label with Animated Chevrons ── */}
        <Animated.View style={[styles.labelWrapper, labelAnimatedStyle]}>
          <Text style={styles.labelText}>
            {totalAmount
              ? `Slide to Place Order • ${formatCurrency(totalAmount)}`
              : 'Slide to Place Order'}
          </Text>

          <Animated.View style={[styles.chevronsRow, chevronAnimatedStyle]}>
            <Ionicons name="chevron-forward" size={14} color="#FFB800" />
            <Ionicons
              name="chevron-forward"
              size={14}
              color="#FFB800"
              style={{ marginLeft: -6 }}
            />
            <Ionicons
              name="chevron-forward"
              size={14}
              color="#FFB800"
              style={{ marginLeft: -6 }}
            />
          </Animated.View>
        </Animated.View>

        {/* ── Success Celebration State ── */}
        {showSuccess && (
          <View style={styles.successLabelWrapper}>
            <Animated.View style={[styles.successRow, successPopStyle]}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.successText}>Order Dispatched!</Text>
            </Animated.View>
          </View>
        )}

        {/* ── Elevated Luminous Slider Thumb ── */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            accessible={true}
            accessibilityRole="adjustable"
            accessibilityLabel="Slide to place order"
            accessibilityHint="Swipe right across the track to confirm your order"
            style={[
              styles.thumb,
              {
                backgroundColor: showSuccess ? '#10B981' : colors.accent,
              },
              thumbAnimatedStyle,
            ]}
          >
            {showSuccess ? (
              <Ionicons name="checkmark" size={26} color="#FFFFFF" />
            ) : (
              <View style={styles.thumbInner}>
                <MaterialCommunityIcons
                  name="moped"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
            )}
          </Animated.View>
        </GestureDetector>
      </View>

      {/* ── Accessibility Tap-to-Confirm Fallback ── */}
      <Pressable
        onPress={handleAccessibleFallback}
        disabled={isLocked || isLoading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Tap to place order directly"
        style={styles.accessibleFallback}
      >
        <Text style={styles.fallbackPrompt}>
          Trouble sliding?{' '}
          <Text style={[styles.fallbackAction, { color: colors.accent }]}>
            Tap to confirm order
          </Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 62,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    padding: PADDING,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: Radius.full,
  },
  labelWrapper: {
    position: 'absolute',
    left: THUMB_SIZE + 10,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  labelText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  chevronsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successLabelWrapper: {
    position: 'absolute',
    left: 20,
    right: THUMB_SIZE + 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  successText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  thumbInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessibleFallback: {
    marginTop: 8,
    paddingVertical: Spacing.xxs,
    minHeight: 36,
    justifyContent: 'center',
  },
  fallbackPrompt: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  fallbackAction: {
    fontWeight: '800',
  },
});
