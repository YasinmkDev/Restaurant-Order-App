import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeRouter } from '../../hooks/useSafeRouter';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency } from '../../lib/currency';

interface FloatingCartButtonProps {
  onPress?: () => void;
  position?: 'center' | 'left' | 'right';
  bottomOffset?: number;
}

export function FloatingCartButton({
  onPress,
  position = 'center',
  bottomOffset: customBottomOffset,
}: FloatingCartButtonProps) {
  const router = useSafeRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const itemCount = useCartStore((s) => s.getItemCount());
  const total = useCartStore((s) => s.getTotal());

  const lastPressRef = useRef(0);
  const handlePress = useCallback(() => {
    const now = Date.now();
    if (now - lastPressRef.current < 600) {
      return;
    }
    lastPressRef.current = now;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (onPress) {
      onPress();
    } else {
      router.navigate('/checkout' as any);
    }
  }, [onPress, router]);

  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  const isVisible = itemCount > 0;

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
      opacity.value = withSpring(1);
    } else {
      translateY.value = withSpring(100, { damping: 18, stiffness: 220 });
      opacity.value = withSpring(0);
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!isVisible && translateY.value === 100) {
    return null;
  }

  const itemsLabel = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
  const calculatedBottom =
    customBottomOffset !== undefined
      ? customBottomOffset
      : Math.max(insets.bottom, 12) + 84;

  const positionStyle =
    position === 'left'
      ? styles.leftPosition
      : position === 'right'
      ? styles.rightPosition
      : styles.centerPosition;

  return (
    <View
      pointerEvents={isVisible ? 'box-none' : 'none'}
      style={[styles.container, positionStyle, { bottom: calculatedBottom }]}
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={handlePress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Shopping cart with ${itemsLabel}, total ${formatCurrency(total)}. View cart.`}
          style={({ pressed }) => [
            styles.pill,
            {
              backgroundColor: pressed ? colors.accentPressed : colors.accent,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          {/* Cart Icon & Count Badge */}
          <View style={styles.cartIconWrapper}>
            <Ionicons name="cart" size={17} color="#FFFFFF" />
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{itemCount}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Total Price */}
          <View style={styles.infoWrapper}>
            <Text style={styles.totalText}>{formatCurrency(total)}</Text>
          </View>

          {/* Small Arrow indicator */}
          <Ionicons
            name="arrow-forward"
            size={13}
            color="#FFFFFF"
            style={styles.arrow}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 90,
  },
  centerPosition: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftPosition: {
    alignItems: 'flex-start',
    paddingLeft: Spacing.md,
  },
  rightPosition: {
    alignItems: 'flex-end',
    paddingRight: Spacing.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    gap: 8,
  },
  cartIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingRight: 6,
  },
  countBadge: {
    position: 'absolute',
    top: -6,
    right: -4,
    backgroundColor: '#000000',
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  infoWrapper: {
    justifyContent: 'center',
  },
  totalText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  arrow: {
    marginLeft: 1,
    opacity: 0.9,
  },
});
