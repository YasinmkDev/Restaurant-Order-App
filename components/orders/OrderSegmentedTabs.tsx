import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

export type OrderTabKey = 'active' | 'completed' | 'packages';

interface OrderTabConfig {
  key: OrderTabKey;
  label: string;
  badge?: number;
}

const TABS: OrderTabConfig[] = [
  { key: 'active', label: 'Active', badge: 1 },
  { key: 'completed', label: 'Completed' },
  { key: 'packages', label: 'Courier' },
];

interface OrderSegmentedTabsProps {
  selectedTab: OrderTabKey;
  onSelectTab: (tab: OrderTabKey) => void;
  activeCount?: number;
}

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 240,
  mass: 0.7,
};

export function OrderSegmentedTabs({
  selectedTab,
  onSelectTab,
  activeCount = 1,
}: OrderSegmentedTabsProps) {
  const { colors, isDark } = useTheme();
  const reducedMotion = useReducedMotion();

  const layoutsRef = useRef<Partial<Record<OrderTabKey, { x: number; width: number }>>>({});
  const [layoutsReady, setLayoutsReady] = useState(false);

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);

  const updateIndicator = useCallback(
    (key: OrderTabKey, animate = true) => {
      const layout = layoutsRef.current[key];
      if (!layout) return;

      if (!animate || reducedMotion) {
        indicatorX.value = layout.x;
        indicatorWidth.value = layout.width;
        indicatorOpacity.value = 1;
      } else {
        indicatorX.value = withSpring(layout.x, SPRING_CONFIG);
        indicatorWidth.value = withSpring(layout.width, SPRING_CONFIG);
        indicatorOpacity.value = withSpring(1, SPRING_CONFIG);
      }
    },
    [indicatorX, indicatorWidth, indicatorOpacity, reducedMotion]
  );

  const handleTabLayout = (key: OrderTabKey, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    layoutsRef.current[key] = { x, width };

    if (key === selectedTab) {
      if (!layoutsReady) {
        indicatorX.value = x;
        indicatorWidth.value = width;
        indicatorOpacity.value = 1;
        setLayoutsReady(true);
      } else {
        updateIndicator(key, false);
      }
    }
  };

  useEffect(() => {
    if (layoutsReady) {
      updateIndicator(selectedTab, true);
    }
  }, [selectedTab, layoutsReady, updateIndicator]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
    opacity: indicatorOpacity.value,
  }));

  const handlePress = (key: OrderTabKey) => {
    if (key === selectedTab) return;
    Haptics.selectionAsync().catch(() => {});
    onSelectTab(key);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      {/* ── Fluid Sliding Orange Indicator ── */}
      <Animated.View
        style={[
          styles.slidingIndicator,
          { backgroundColor: colors.accent },
          animatedIndicatorStyle,
        ]}
      />

      {/* ── Tab Buttons ── */}
      {TABS.map((tab) => {
        const isActive = selectedTab === tab.key;
        const showBadge = tab.key === 'active' && activeCount > 0;

        return (
          <Pressable
            key={tab.key}
            onLayout={(e) => handleTabLayout(tab.key, e)}
            onPress={() => handlePress(tab.key)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label} orders tab`}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isActive
                    ? '#FFFFFF'
                    : isDark
                    ? colors.textSecondary
                    : '#64748B',
                  fontWeight: isActive ? '700' : '600',
                },
              ]}
            >
              {tab.label}
            </Text>

            {showBadge && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isActive
                      ? '#FFFFFF'
                      : colors.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: isActive ? colors.accent : '#FFFFFF',
                    },
                  ]}
                >
                  {activeCount}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  slidingIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: Radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: Radius.full,
    zIndex: 2,
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
