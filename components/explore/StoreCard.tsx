import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { AppText } from '../ui/AppText';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { Store } from '../../types/store';
import { formatCurrency } from '../../lib/currency';

interface StoreCardProps {
  store: Store;
  onPress: () => void;
  variant?: 'featured' | 'horizontal';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StoreCard({
  store,
  onPress,
  variant = 'horizontal',
}: StoreCardProps) {
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
    opacity.value = withTiming(0.88, { duration: 120 });
  };

  const handlePressOut = () => {
    opacity.value = withTiming(1, { duration: 160 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const isFeatured = variant === 'featured';

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${store.name}, ${store.rating} stars, ${store.deliveryTime} delivery`}
      style={[
        isFeatured ? styles.featuredCard : styles.horizontalCard,
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.imageWrapper,
          {
            backgroundColor: colors.surfaceMuted,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Image
          source={{ uri: store.image }}
          style={isFeatured ? styles.featuredImage : styles.horizontalImage}
          contentFit="cover"
          transition={200}
        />
      </View>

      <View style={styles.info}>
        <AppText
          variant={isFeatured ? 'title' : 'bodyMedium'}
          numberOfLines={1}
          style={styles.name}
        >
          {store.name}
        </AppText>
        <AppText variant="caption" color="secondary" numberOfLines={1}>
          ★ {store.rating.toFixed(1)} · {store.deliveryTime} · {formatCurrency(store.deliveryFee)} delivery
        </AppText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  horizontalCard: {
    width: 220,
    marginRight: Spacing.md,
  },
  imageWrapper: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  horizontalImage: {
    width: '100%',
    height: 120,
  },
  info: {
    marginTop: Spacing.xs,
  },
  name: {
    marginBottom: 2,
  },
});
