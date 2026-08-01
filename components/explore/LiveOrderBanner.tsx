import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeRouter } from '../../hooks/useSafeRouter';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface LiveOrderBannerProps {
  orderId?: string;
  riderName?: string;
  storeName?: string;
  etaMinutes?: number;
}

export function LiveOrderBanner({
  orderId = 'ORD-2024-001',
  riderName = 'Ahmed Khan',
  storeName = 'Tehzeeb Bakery',
  etaMinutes = 9,
}: LiveOrderBannerProps) {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();
  const [visible, setVisible] = useState(true);

  // Pulsing beacon animation
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.7);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.in(Easing.ease) })
      ),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1000 }),
        withTiming(0.8, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [pulseScale, pulseOpacity]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  if (!visible) return null;

  const handleTrack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.navigate(`/tracking/${orderId}` as any);
  };

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={handleTrack}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Active order: ${riderName} is arriving in ${etaMinutes} minutes from ${storeName}. Tap to track live.`}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: isDark ? '#1C1917' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 107, 0, 0.35)' : 'rgba(255, 107, 0, 0.25)',
            opacity: pressed ? 0.92 : 1,
          },
        ]}
      >
        {/* Left: Rider & Beacon Indicator */}
        <View style={styles.riderAvatarWrap}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.accent }]}>
            <MaterialCommunityIcons name="bike-fast" size={22} color="#FFFFFF" />
          </View>
          {/* Animated Green Beacon Dot */}
          <View style={styles.beaconContainer}>
            <Animated.View style={[styles.pulseRing, animatedPulseStyle]} />
            <View style={styles.solidBeacon} />
          </View>
        </View>

        {/* Center: Live Status Content */}
        <View style={styles.centerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.liveTagText}>ACTIVE DELIVERY</Text>
            <Text style={styles.etaText}>• Arriving in ~{etaMinutes} min</Text>
          </View>
          <Text numberOfLines={1} style={[styles.headlineText, { color: isDark ? colors.textPrimary : '#1E293B' }]}>
            {riderName} is on the way
          </Text>
          <Text numberOfLines={1} style={styles.storeSubtext}>
            from {storeName} (4 items)
          </Text>
        </View>

        {/* Right: Track Button */}
        <View style={[styles.trackButton, { backgroundColor: colors.accent }]}>
          <Text style={styles.trackButtonText}>Track</Text>
          <Ionicons name="chevron-forward" size={13} color="#FFFFFF" />
        </View>

        {/* Dismiss subtle 'X' button */}
        <Pressable
          onPress={() => setVisible(false)}
          hitSlop={10}
          style={styles.dismissBtn}
          accessibilityLabel="Dismiss live order banner"
        >
          <Ionicons name="close" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  riderAvatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  beaconContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  solidBeacon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  liveTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  etaText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#F97316',
  },
  headlineText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 1,
  },
  storeSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: Radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 14,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  dismissBtn: {
    position: 'absolute',
    top: 6,
    right: 8,
    padding: 4,
  },
});
