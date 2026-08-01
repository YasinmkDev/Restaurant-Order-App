import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { Product } from '../../types/product';
import { Store } from '../../types/store';
import { formatCurrency } from '../../lib/currency';

export interface FeaturedCarouselItem {
  product: Product;
  store?: Store;
  badgeTag: string;
}

interface HeroFeaturedCarouselProps {
  items: FeaturedCarouselItem[];
  onPressItem: (product: Product) => void;
  autoPlayInterval?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HeroFeaturedCarousel({
  items,
  onPressItem,
  autoPlayInterval = 4000,
}: HeroFeaturedCarouselProps) {
  const { colors, isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const reducedMotion = useReducedMotion();

  // Card dimensions and centering calculations
  const CARD_WIDTH = Math.round(windowWidth - Spacing.md * 2);
  const GAP = 12;
  const SNAP_INTERVAL = CARD_WIDTH + GAP;
  const SIDE_INSET = (windowWidth - CARD_WIDTH) / 2;

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isInteracting = useRef(false);

  // Auto-switch interval using exact pixel offsets
  useEffect(() => {
    if (items.length <= 1 || reducedMotion) return;

    const timer = setInterval(() => {
      if (isInteracting.current) return;

      setCurrentIndex((prev) => {
        const next = (prev + 1) % items.length;
        flatListRef.current?.scrollToOffset({
          offset: next * SNAP_INTERVAL,
          animated: true,
        });
        return next;
      });
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [items.length, autoPlayInterval, reducedMotion, SNAP_INTERVAL]);

  const handlePressPagination = (index: number) => {
    Haptics.selectionAsync().catch(() => {});
    setCurrentIndex(index);
    flatListRef.current?.scrollToOffset({
      offset: index * SNAP_INTERVAL,
      animated: true,
    });
  };

  const handleScroll = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SNAP_INTERVAL);
    if (index >= 0 && index < items.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SNAP_INTERVAL);
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="center"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        keyExtractor={(item) => `carousel-${item.product.id}`}
        contentContainerStyle={{
          paddingHorizontal: SIDE_INSET,
        }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        onTouchStart={() => {
          isInteracting.current = true;
        }}
        onTouchEnd={() => {
          setTimeout(() => {
            isInteracting.current = false;
          }, 2000);
        }}
        renderItem={({ item }) => (
          <CarouselSlide
            item={item}
            width={CARD_WIDTH}
            colors={colors}
            isDark={isDark}
            onPress={() => onPressItem(item.product)}
          />
        )}
      />

      {/* ── Modern Dynamic Pagination Indicators ── */}
      <View style={styles.paginationRow}>
        {items.map((_, index) => (
          <PaginationDot
            key={`dot-${index}`}
            index={index}
            currentIndex={currentIndex}
            accentColor={colors.accent}
            onPress={() => handlePressPagination(index)}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Individual Slide Component ─────────────────────────────────────────────

interface CarouselSlideProps {
  item: FeaturedCarouselItem;
  width: number;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
  onPress: () => void;
}

function CarouselSlide({
  item,
  width,
  colors,
  isDark,
  onPress,
}: CarouselSlideProps) {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.98, { damping: 14, stiffness: 350 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 14, stiffness: 350 });
  };

  const storeName = item.store?.name || 'Featured Kitchen';
  const deliveryTime = item.store?.deliveryTime || item.product.preparationTime || '15–20 min';

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.product.name} from ${storeName}, ${formatCurrency(item.product.basePrice)}`}
      style={[
        styles.slideCard,
        {
          width,
          backgroundColor: isDark ? colors.surfaceRaised : '#18181B',
          borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
        },
        animatedStyle,
      ]}
    >
      {/* Background Hero Image */}
      <Image
        source={{ uri: item.product.image }}
        style={styles.heroImage}
        contentFit="cover"
        transition={300}
      />

      {/* Multi-Layered Scrim for High Legibility */}
      <View style={styles.topScrim} />
      <View style={styles.bottomScrim} />

      {/* Top Floating Glass Badges */}
      <View style={styles.topBadgesRow}>
        {/* Promotional Tag */}
        <View style={styles.tagBadge}>
          <Ionicons name="flame" size={13} color="#FFFFFF" />
          <Text style={styles.tagText}>{item.badgeTag.toUpperCase()}</Text>
        </View>

        {/* Rating & Delivery Time Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {item.product.rating ? item.product.rating.toFixed(1) : '4.9'}
          </Text>
          <Text style={styles.badgeDot}>•</Text>
          <Text style={styles.timeText}>{deliveryTime}</Text>
        </View>
      </View>

      {/* Bottom Content Area */}
      <View style={styles.bottomContent}>
        {/* Store Name & Category Subtitle */}
        <View style={styles.merchantRow}>
          <MaterialCommunityIcons name="storefront-outline" size={13} color="rgba(255,255,255,0.8)" />
          <Text numberOfLines={1} style={styles.merchantName}>
            {storeName}
          </Text>
        </View>

        {/* Product Title */}
        <Text numberOfLines={1} style={styles.productTitle}>
          {item.product.name}
        </Text>

        {/* Price & Action Row */}
        <View style={styles.priceActionRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.currencyPrefix}>from</Text>
            <Text style={styles.priceValue}>
              {formatCurrency(item.product.basePrice)}
            </Text>
          </View>

          {/* Quick Action Pill Button */}
          <View
            style={[
              styles.actionPill,
              { backgroundColor: colors.accent },
            ]}
          >
            <Text style={styles.actionPillText}>Order Now</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

// ─── Dynamic Expanding Pagination Dot ───────────────────────────────────────

interface PaginationDotProps {
  index: number;
  currentIndex: number;
  accentColor: string;
  onPress: () => void;
}

function PaginationDot({
  index,
  currentIndex,
  accentColor,
  onPress,
}: PaginationDotProps) {
  const isActive = index === currentIndex;
  const shouldReduceMotion = useReducedMotion();

  const width = useSharedValue(isActive ? 20 : 6);
  const opacity = useSharedValue(isActive ? 1 : 0.35);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (shouldReduceMotion) {
      width.value = isActive ? 20 : 6;
      opacity.value = isActive ? 1 : 0.35;
      return;
    }

    // Snappy, modern micro-animation: fast 180ms cubic ease-out avoids sluggish lag
    width.value = withTiming(isActive ? 20 : 6, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(isActive ? 1 : 0.35, {
      duration: 160,
    });
  }, [isActive, shouldReduceMotion]);

  const animatedDotStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withTiming(0.85, { duration: 100 });
  };

  const handlePressOut = () => {
    pressScale.value = withTiming(1, { duration: 120 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={10}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Go to slide ${index + 1}`}
    >
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: isActive ? accentColor : 'rgba(150, 150, 150, 0.5)',
          },
          animatedDotStyle,
        ]}
      />
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  slideCard: {
    height: 245,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Top subtle gradient to ensure badges pop
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  // Light bottom scrim so food photo remains clearly visible
  bottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 115,
    backgroundColor: 'rgba(0,0,0,0.40)',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: Radius.full,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 15, 0.65)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: Radius.full,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  badgeDot: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
    fontSize: 10,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '500',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  merchantName: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  productTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  priceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currencyPrefix: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontWeight: '500',
  },
  priceValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7.5,
    borderRadius: Radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  actionPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    height: 6,
    borderRadius: Radius.full,
  },
  dotActive: {
    width: 20,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(150, 150, 150, 0.35)',
  },
});
