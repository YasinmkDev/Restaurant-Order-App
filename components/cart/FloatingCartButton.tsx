import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency } from '../../lib/currency';

interface FloatingCartButtonProps {
  onPress: () => void;
}

export function FloatingCartButton({ onPress }: FloatingCartButtonProps) {
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
    onPress();
  }, [onPress]);

  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  const isVisible = itemCount > 0;

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
      opacity.value = withSpring(1);
    } else {
      translateY.value = withSpring(100, { damping: 18, stiffness: 200 });
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
  const bottomOffset = Math.max(insets.bottom, 12) + 84;

  return (
    <View
      pointerEvents={isVisible ? 'auto' : 'none'}
      style={[styles.container, { bottom: bottomOffset }]}
    >
      <Animated.View style={[styles.wrapper, animatedStyle]}>
        <Pressable
          onPress={handlePress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Shopping cart with ${itemsLabel}, total ${formatCurrency(total)}. View cart.`}
          style={({ pressed }) => [
            styles.bar,
            {
              backgroundColor: pressed ? colors.accentPressed : colors.accent,
            },
          ]}
        >
          {/* Left item counter */}
          <View style={styles.left}>
            <View style={styles.countBadge}>
              <AppText variant="label" style={styles.textWhite}>
                {itemCount}
              </AppText>
            </View>
            <AppText variant="bodyMedium" style={styles.textWhite}>
              {itemsLabel}
            </AppText>
          </View>

          {/* Right action and total */}
          <View style={styles.right}>
            <AppText variant="bodyMedium" style={styles.textWhite}>
              View cart · {formatCurrency(total)}
            </AppText>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#FFFFFF"
              style={styles.arrow}
            />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    alignItems: 'center',
    zIndex: 90,
  },
  wrapper: {
    width: '100%',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    minHeight: 52,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  countBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  arrow: {
    marginLeft: Spacing.xs,
  },
});
