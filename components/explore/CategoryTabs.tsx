import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Spacing, Radius } from '../ui/theme';
import { DeliveryCategory } from '../../types/store';

export type CategoryKey = 'all' | DeliveryCategory;

interface CategoryTabsProps {
  selectedCategory: CategoryKey;
  onSelectCategory: (category: CategoryKey) => void;
}

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'food', label: 'Food & Dining' },
  { key: 'grocery', label: 'Groceries' },
  { key: 'package', label: 'Package Courier' },
];

interface PillLayout {
  x: number;
  width: number;
}

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 240,
  mass: 0.7,
};

export function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const { colors, isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<ScrollView>(null);

  const layoutsRef = useRef<Partial<Record<CategoryKey, PillLayout>>>({});
  const [layoutsReady, setLayoutsReady] = useState(false);

  const pillX = useSharedValue(0);
  const pillWidth = useSharedValue(0);
  const pillOpacity = useSharedValue(0);

  const updatePillPosition = useCallback(
    (key: CategoryKey, animate = true) => {
      const layout = layoutsRef.current[key];
      if (!layout) return;

      if (!animate || reducedMotion) {
        pillX.value = layout.x;
        pillWidth.value = layout.width;
        pillOpacity.value = 1;
      } else {
        pillX.value = withSpring(layout.x, SPRING_CONFIG);
        pillWidth.value = withSpring(layout.width, SPRING_CONFIG);
        pillOpacity.value = withSpring(1, SPRING_CONFIG);
      }

      // Keep active tab centered/visible in horizontal scroll
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: Math.max(0, layout.x - Spacing.md),
          animated: true,
        });
      }
    },
    [pillX, pillWidth, pillOpacity, reducedMotion]
  );

  const handleTabLayout = (key: CategoryKey, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    layoutsRef.current[key] = { x, width };

    // When active category is measured, initialize position
    if (key === selectedCategory) {
      if (!layoutsReady) {
        pillX.value = x;
        pillWidth.value = width;
        pillOpacity.value = 1;
        setLayoutsReady(true);
      } else {
        updatePillPosition(key, false);
      }
    }
  };

  useEffect(() => {
    if (layoutsReady) {
      updatePillPosition(selectedCategory, true);
    }
  }, [selectedCategory, layoutsReady, updatePillPosition]);

  const handlePress = (key: CategoryKey) => {
    if (selectedCategory === key) return;
    Haptics.selectionAsync().catch(() => {});
    onSelectCategory(key);
  };

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: pillWidth.value,
    opacity: pillOpacity.value,
  }));

  const pillShadow = {
    elevation: 4,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: isDark ? 0.45 : 0.28,
    shadowRadius: 6,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.track}>
          {/* ── Fluid Sliding Orange Pill Indicator ── */}
          <Animated.View
            style={[
              styles.slidingPill,
              { backgroundColor: colors.accent },
              pillShadow,
              animatedPillStyle,
            ]}
          />

          {/* ── Filter Options ── */}
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <Pressable
                key={cat.key}
                onLayout={(e) => handleTabLayout(cat.key, e)}
                onPress={() => handlePress(cat.key)}
                accessible={true}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${cat.label} category filter`}
                style={({ pressed }) => [
                  styles.tabPill,
                  {
                    backgroundColor: isActive
                      ? 'transparent'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(0, 0, 0, 0.04)',
                    borderColor: isActive
                      ? 'transparent'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)',
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    position: 'relative',
  },
  // The fluid sliding pill tag that glides behind the active text
  slidingPill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: Radius.full,
    zIndex: 1,
  },
  tabPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  tabLabel: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
