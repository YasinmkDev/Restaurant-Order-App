import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { Divider } from '../ui/Divider';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { Product } from '../../types/product';
import { formatCurrency } from '../../lib/currency';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  showDivider?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ProductCard({
  product,
  onPress,
  showDivider = true,
}: ProductCardProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(1);
  const lastPressRef = useRef(0);

  const handlePress = useCallback(() => {
    const now = Date.now();
    if (now - lastPressRef.current < 550) {
      return;
    }
    lastPressRef.current = now;
    onPress();
  }, [onPress]);

  const handlePressIn = () => {
    opacity.value = withTiming(0.85, { duration: 120 });
  };

  const handlePressOut = () => {
    opacity.value = withTiming(1, { duration: 160 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${product.name}, ${formatCurrency(product.basePrice)}`}
        style={[styles.row, animatedStyle]}
      >
        <View style={styles.details}>
          <AppText variant="bodyMedium" numberOfLines={1}>
            {product.name}
          </AppText>
          <AppText
            variant="caption"
            color="secondary"
            numberOfLines={2}
            style={styles.description}
          >
            {product.description}
          </AppText>
          <View style={styles.footer}>
            <AppText variant="label" style={{ color: colors.textPrimary }}>
              {formatCurrency(product.basePrice)}
            </AppText>
            <AppText variant="caption" color="tertiary" style={styles.dotSeparator}>
              ·
            </AppText>
            <AppText variant="caption" color="secondary">
              ★ {product.rating.toFixed(1)}
            </AppText>
          </View>
        </View>

        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: product.image }}
            style={[
              styles.thumbnail,
              { backgroundColor: colors.surfaceMuted },
            ]}
            contentFit="cover"
            transition={180}
          />
          <View
            style={[
              styles.addAffordance,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            <Ionicons name="add" size={14} color={colors.accent} />
          </View>
        </View>
      </AnimatedPressable>

      {showDivider && <Divider style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: 88,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotSeparator: {
    marginHorizontal: Spacing.xs,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: 84,
    height: 84,
    borderRadius: Radius.md,
  },
  addAffordance: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  divider: {
    marginTop: 2,
  },
});
