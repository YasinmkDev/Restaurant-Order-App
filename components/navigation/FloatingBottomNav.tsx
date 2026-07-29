import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  useReducedMotion,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { ColorSurgeCurtain } from './ColorSurgeCurtain';

// ─── Navigation Types ────────────────────────────────────────────────────────

export interface BottomTabBarRoute {
  key: string;
  name: string;
  params?: Record<string, any>;
}

export interface BottomTabBarProps {
  state: {
    index: number;
    routes: BottomTabBarRoute[];
  };
  navigation: {
    emit: (options: any) => any;
    navigate: (name: string, params?: Record<string, any>) => void;
  };
  descriptors?: Record<string, any>;
  insets?: any;
}

type TabRouteName = 'index' | 'orders' | 'activity' | 'account';

interface TabConfig {
  name: TabRouteName;
  label: string;
  activeIcon: keyof typeof MaterialCommunityIcons.glyphMap;
  inactiveIcon: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface ArcActionItem {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  bgColor: string;
  angleDeg: number;
  targetX: number;
  targetY: number;
  action: (router: ReturnType<typeof useRouter>) => void;
}

// ─── Constants & Math Calculations ──────────────────────────────────────────

const PILL_HEIGHT = 62;
const FAB_SIZE = 56;
const ACTION_BTN_SIZE = 48;
const ARC_RADIUS = 98; // Distance from center of FAB to center of each floating action

// ── Rainbow Arc Trigonometric Positions ──
// Semicircle spread over upper hemisphere (angles measured from positive X-axis):
// 150° (far left), 110° (mid left), 70° (mid right), 30° (far right)
// targetX = R * cos(angle)
// targetY = -R * sin(angle) (negative is upward in screen space)
const ARC_ACTIONS_BASE = [
  {
    id: 'cart',
    label: 'Checkout',
    icon: 'cart-outline' as const,
    color: '#FF6B6B', // Vibrant Coral
    bgColor: 'rgba(255, 107, 107, 0.15)',
    angleDeg: 150,
    targetX: Math.round(ARC_RADIUS * Math.cos((150 * Math.PI) / 180)), // -85px
    targetY: -Math.round(ARC_RADIUS * Math.sin((150 * Math.PI) / 180)), // -49px
    action: (router: ReturnType<typeof useRouter>) => {
      router.push('/checkout');
    },
  },
  {
    id: 'track',
    label: 'Track',
    icon: 'truck-fast-outline' as const,
    color: '#00D2D3', // Bright Turquoise
    bgColor: 'rgba(0, 210, 211, 0.15)',
    angleDeg: 110,
    targetX: Math.round(ARC_RADIUS * Math.cos((110 * Math.PI) / 180)), // -34px
    targetY: -Math.round(ARC_RADIUS * Math.sin((110 * Math.PI) / 180)), // -92px
    action: (router: ReturnType<typeof useRouter>) => {
      router.push('/tracking/ORD-2024-001');
    },
  },
  {
    id: 'deals',
    label: 'Offers',
    icon: 'ticket-percent-outline' as const,
    color: '#FECA57', // Golden Sun
    bgColor: 'rgba(254, 202, 87, 0.15)',
    angleDeg: 70,
    targetX: Math.round(ARC_RADIUS * Math.cos((70 * Math.PI) / 180)), // +34px
    targetY: -Math.round(ARC_RADIUS * Math.sin((70 * Math.PI) / 180)), // -92px
    action: (router: ReturnType<typeof useRouter>) => {
      router.push('/orders');
    },
  },
  {
    id: 'scan',
    label: 'Scan QR',
    icon: 'qrcode-scan' as const,
    color: '#A29BFE', // Soft Lavender/Violet
    bgColor: 'rgba(162, 155, 254, 0.15)',
    angleDeg: 30,
    targetX: Math.round(ARC_RADIUS * Math.cos((30 * Math.PI) / 180)), // +85px
    targetY: -Math.round(ARC_RADIUS * Math.sin((30 * Math.PI) / 180)), // -49px
    action: (router: ReturnType<typeof useRouter>) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
    },
  },
];

const SPRING_CONFIG = {
  damping: 14,
  stiffness: 280,
  mass: 0.8,
};

const ARC_SPRING_CONFIG = {
  damping: 12,
  stiffness: 240,
  mass: 0.7,
};

// ─── Tab Configuration ───────────────────────────────────────────────────────

const LEFT_TABS: TabConfig[] = [
  {
    name: 'index',
    label: 'Home',
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  {
    name: 'orders',
    label: 'Orders',
    activeIcon: 'receipt-text',
    inactiveIcon: 'receipt-text-outline',
  },
];

const RIGHT_TABS: TabConfig[] = [
  {
    name: 'activity',
    label: 'Activity',
    activeIcon: 'bell',
    inactiveIcon: 'bell-outline',
  },
  {
    name: 'account',
    label: 'Account',
    activeIcon: 'account-circle',
    inactiveIcon: 'account-circle-outline',
  },
];

// ─── TabPillItem: Individual Icon Button ─────────────────────────────────────

interface TabPillItemProps {
  config: TabConfig;
  isFocused: boolean;
  reducedMotion: boolean | null;
  colors: ReturnType<typeof useTheme>['colors'];
  onPress: () => void;
  onLongPress: () => void;
}

function TabPillItem({
  config,
  isFocused,
  reducedMotion,
  colors,
  onPress,
  onLongPress,
}: TabPillItemProps) {
  const scale = useSharedValue(isFocused ? 1.1 : 1.0);
  const lift = useSharedValue(isFocused ? -2 : 0);

  useEffect(() => {
    if (reducedMotion) {
      scale.value = isFocused ? 1.1 : 1.0;
      lift.value = isFocused ? -2 : 0;
    } else {
      scale.value = withSpring(isFocused ? 1.1 : 1.0, SPRING_CONFIG);
      lift.value = withSpring(isFocused ? -2 : 0, SPRING_CONFIG);
    }
  }, [isFocused, reducedMotion]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }, { scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessible={true}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={`${config.label} tab${isFocused ? ', selected' : ''}`}
      style={({ pressed }) => [
        styles.tabButton,
        { opacity: pressed ? 0.65 : 1 },
      ]}
    >
      <Animated.View style={[styles.tabIconWrap, animatedIconStyle]}>
        <MaterialCommunityIcons
          name={isFocused ? config.activeIcon : config.inactiveIcon}
          size={22}
          color={isFocused ? colors.accent : colors.textTertiary}
        />
      </Animated.View>
      <Text
        numberOfLines={1}
        style={[
          styles.tabLabel,
          {
            color: isFocused ? colors.accent : colors.textTertiary,
            fontWeight: isFocused ? '700' : '500',
          },
        ]}
      >
        {config.label}
      </Text>
    </Pressable>
  );
}

// ─── FloatingArcButton: Individual Rainbow Action Item ──────────────────────

interface FloatingArcButtonProps {
  item: (typeof ARC_ACTIONS_BASE)[number];
  isOpen: boolean;
  index: number;
  totalCount: number;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
  reducedMotion: boolean | null;
  onPress: () => void;
}

function FloatingArcButton({
  item,
  isOpen,
  index,
  totalCount,
  colors,
  isDark,
  reducedMotion,
  onPress,
}: FloatingArcButtonProps) {
  const progress = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      progress.value = isOpen ? 1 : 0;
      return;
    }

    if (isOpen) {
      // Opening: cascade from left to right (0ms, 35ms, 70ms, 105ms)
      const delayMs = index * 35;
      progress.value = withDelay(delayMs, withSpring(1, ARC_SPRING_CONFIG));
    } else {
      // Closing: reverse cascade (right to left)
      const reverseIndex = totalCount - 1 - index;
      const delayMs = reverseIndex * 25;
      progress.value = withDelay(
        delayMs,
        withTiming(0, { duration: 160, easing: Easing.in(Easing.cubic) })
      );
    }
  }, [isOpen, index, totalCount, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentX = progress.value * item.targetX;
    const currentY = progress.value * item.targetY;
    const scale = progress.value * pressScale.value;

    return {
      opacity: progress.value,
      transform: [
        { translateX: currentX },
        { translateY: currentY },
        { scale },
      ],
    };
  });

  const handlePressIn = () => {
    pressScale.value = withSpring(0.88, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, SPRING_CONFIG);
  };

  const shadowStyle = {
    elevation: 8,
    shadowColor: isDark ? '#000' : item.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.6 : 0.25,
    shadowRadius: 10,
  };

  return (
    <Animated.View
      pointerEvents={isOpen ? 'auto' : 'none'}
      style={[styles.floatingActionContainer, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={item.label}
        style={[
          styles.floatingActionButton,
          {
            backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
            borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
          },
          shadowStyle,
        ]}
      >
        <View
          style={[
            styles.floatingActionInner,
            { backgroundColor: item.bgColor },
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={22}
            color={item.color}
          />
        </View>
      </Pressable>

      {/* Floating pill mini-label beneath */}
      <View
        style={[
          styles.actionLabelBadge,
          {
            backgroundColor: isDark ? 'rgba(30,30,30,0.92)' : 'rgba(255,255,255,0.95)',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.actionLabelText,
            { color: isDark ? colors.textPrimary : '#222222' },
          ]}
        >
          {item.label}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Center FAB ─────────────────────────────────────────────────────────────

interface CenterFabProps {
  colors: ReturnType<typeof useTheme>['colors'];
  reducedMotion: boolean | null;
  isOpen: boolean;
  onToggle: () => void;
}

function CenterFab({
  colors,
  reducedMotion,
  isOpen,
  onToggle,
}: CenterFabProps) {
  const fabScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      rotation.value = isOpen ? 135 : 0;
    } else {
      rotation.value = withSpring(isOpen ? 135 : 0, {
        damping: 12,
        stiffness: 260,
      });
    }
  }, [isOpen, reducedMotion]);

  const handlePress = () => {
    Haptics.impactAsync(
      isOpen
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    ).catch(() => { });

    if (!reducedMotion) {
      fabScale.value = withSpring(0.86, { damping: 8, stiffness: 450 }, () => {
        fabScale.value = withSpring(1, SPRING_CONFIG);
      });
    }
    onToggle();
  };

  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.fabWrap, fabAnimStyle]}>
      <Pressable
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={isOpen ? 'Close menu' : 'Open quick actions'}
        style={[
          styles.fab,
          {
            backgroundColor: isOpen ? colors.accent : colors.surfaceRaised,
            borderColor: isOpen ? colors.accent : colors.borderSubtle,
          },
        ]}
      >
        <Animated.View style={iconAnimStyle}>
          <MaterialCommunityIcons
            name="plus"
            size={28}
            color={isOpen ? '#FFFFFF' : colors.accent}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main FloatingBottomNav Component ───────────────────────────────────────

export function FloatingBottomNav({ state, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [isOpen, setIsOpen] = useState(false);
  const backdropOpacity = useSharedValue(0);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      backdropOpacity.value = next
        ? withTiming(1, { duration: 240 })
        : withTiming(0, { duration: 180 });
      return next;
    });
  }, [backdropOpacity]);

  const closeMenu = useCallback(() => {
    if (isOpen) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
      setIsOpen(false);
      backdropOpacity.value = withTiming(0, { duration: 180 });
    }
  }, [isOpen, backdropOpacity]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.45,
  }));

  const makeHandlers = (routeName: string, routeKey: string) => {
    const isFocused = state.routes[state.index]?.name === routeName;
    const onPress = () => {
      if (isOpen) {
        closeMenu();
      }
      const event = navigation.emit({
        type: 'tabPress',
        target: routeKey,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        Haptics.selectionAsync().catch(() => { });
        navigation.navigate(routeName);
      }
    };
    const onLongPress = () => {
      navigation.emit({ type: 'tabLongPress', target: routeKey });
    };
    return { isFocused, onPress, onLongPress };
  };

  const pillShadow = {
    elevation: 6,
    shadowColor: isDark ? '#000' : '#B0AEA5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.5 : 0.22,
    shadowRadius: 12,
  };

  const fabShadow = {
    elevation: 10,
    shadowColor: isDark ? '#000' : '#B0AEA5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: isDark ? 0.6 : 0.28,
    shadowRadius: 14,
  };

  return (
    <>
      {/* ── High-Velocity Directional Color Surge Curtain ── */}
      <ColorSurgeCurtain currentIndex={state.index} />

      <View
        pointerEvents="box-none"
        style={[
          styles.bottomNavContainer,
          { bottom: 20 },
        ]}
      >
      {/* ── Outside Tap Scrim / Backdrop ── */}
      {isOpen && (
        <Pressable
          style={[
            styles.backdropPressable,
            { top: -screenHeight, height: screenHeight * 2 },
          ]}
          onPress={closeMenu}
          accessible={false}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: '#000000' },
              animatedBackdropStyle,
            ]}
          />
        </Pressable>
      )}
      {/* Row: Left Pill + FAB Gap + Right Pill */}
      <View style={styles.rowWrap} pointerEvents="box-none">
        {/* ── Left Pill ── */}
        <View
          style={[
            styles.pill,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.borderSubtle,
            },
            pillShadow,
          ]}
        >
          {LEFT_TABS.map((config) => {
            const route = state.routes.find(
              (r: BottomTabBarRoute) => r.name === config.name
            );
            if (!route) return null;
            const { isFocused, onPress, onLongPress } = makeHandlers(
              route.name,
              route.key
            );
            return (
              <TabPillItem
                key={route.key}
                config={config}
                isFocused={isFocused}
                reducedMotion={reducedMotion}
                colors={colors}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>

        {/* ── Center FAB & Floating Arc Center Anchor ── */}
        <View style={styles.fabGap} pointerEvents="box-none">
          {/* Rainbow Arc Floating Buttons anchored to FAB Center */}
          <View
            pointerEvents="box-none"
            style={styles.floatingArcAnchor}
          >
            {ARC_ACTIONS_BASE.map((item, index) => (
              <FloatingArcButton
                key={item.id}
                item={item}
                isOpen={isOpen}
                index={index}
                totalCount={ARC_ACTIONS_BASE.length}
                colors={colors}
                isDark={isDark}
                reducedMotion={reducedMotion}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
                  closeMenu();
                  item.action(router);
                }}
              />
            ))}
          </View>

          {/* The Center FAB */}
          <View style={[styles.fabShadowWrap, fabShadow]}>
            <CenterFab
              colors={colors}
              reducedMotion={reducedMotion}
              isOpen={isOpen}
              onToggle={toggleMenu}
            />
          </View>
        </View>

        {/* ── Right Pill ── */}
        <View
          style={[
            styles.pill,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.borderSubtle,
            },
            pillShadow,
          ]}
        >
          {RIGHT_TABS.map((config) => {
            const route = state.routes.find(
              (r: BottomTabBarRoute) => r.name === config.name
            );
            if (!route) return null;
            const { isFocused, onPress, onLongPress } = makeHandlers(
              route.name,
              route.key
            );
            return (
              <TabPillItem
                key={route.key}
                config={config}
                isFocused={isFocused}
                reducedMotion={reducedMotion}
                colors={colors}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  </>
);
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdropPressable: {
    position: 'absolute',
    left: -Spacing.md - 40,
    right: -Spacing.md - 40,
    zIndex: 90,
  },
  bottomNavContainer: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 999,
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pill: {
    flex: 1,
    height: PILL_HEIGHT,
    borderRadius: Radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    overflow: 'visible',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  // Center gap between the two pills
  fabGap: {
    width: FAB_SIZE + 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  fabShadowWrap: {
    borderRadius: FAB_SIZE / 2,
    marginBottom: 6,
  },
  fabWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Anchor point exactly at center of FAB for arc coordinates
  floatingArcAnchor: {
    position: 'absolute',
    // Center point of FAB: FAB_SIZE is 56, marginBottom is 6, paddingBottom is 4
    bottom: 6 + FAB_SIZE / 2,
    left: (FAB_SIZE + 16) / 2,
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  // Individual action wrapper centered at (0, 0)
  floatingActionContainer: {
    position: 'absolute',
    width: ACTION_BTN_SIZE,
    height: ACTION_BTN_SIZE,
    left: -ACTION_BTN_SIZE / 2,
    top: -ACTION_BTN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingActionButton: {
    width: ACTION_BTN_SIZE,
    height: ACTION_BTN_SIZE,
    borderRadius: ACTION_BTN_SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  floatingActionInner: {
    width: ACTION_BTN_SIZE - 4,
    height: ACTION_BTN_SIZE - 4,
    borderRadius: (ACTION_BTN_SIZE - 4) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabelBadge: {
    position: 'absolute',
    top: ACTION_BTN_SIZE + 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  actionLabelText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
