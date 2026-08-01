import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { useSafeRouter } from '../../hooks/useSafeRouter';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { Order } from '../../types/order';

interface ActiveOrderLiveCardProps {
  order: Order;
  onOpenChat?: () => void;
}

const STEPS = [
  { key: 'placed', label: 'Confirmed', icon: 'checkmark-circle' as const },
  { key: 'preparing', label: 'Kitchen', icon: 'restaurant-outline' as const },
  { key: 'out_for_delivery', label: 'On Way', icon: 'bicycle-outline' as const },
  { key: 'delivered', label: 'Arrived', icon: 'home-outline' as const },
];

export function ActiveOrderLiveCard({
  order,
  onOpenChat,
}: ActiveOrderLiveCardProps) {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();

  // Active step index
  const currentStepIndex =
    order.status === 'delivered'
      ? 3
      : order.status === 'out_for_delivery'
      ? 2
      : order.status === 'preparing'
      ? 1
      : 0;

  // Pulsing beacon animation
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.7);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 900, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.in(Easing.ease) })
      ),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 900 }),
        withTiming(0.8, { duration: 900 })
      ),
      -1,
      true
    );
  }, [pulseScale, pulseOpacity]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (order.driver?.phone) {
      Linking.openURL(`tel:${order.driver.phone}`).catch(() => {});
    }
  };

  const handleTrackMap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.navigate(`/tracking/${order.id}` as any);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 107, 0, 0.35)' : 'rgba(255, 107, 0, 0.25)',
        },
      ]}
    >
      {/* ── Top Header: Order ID + Live ETA ── */}
      <View style={styles.headerRow}>
        <View style={styles.orderIdGroup}>
          <Text style={[styles.orderIdText, { color: isDark ? colors.textPrimary : '#1E293B' }]}>
            Order #{order.id.replace('order-', '').toUpperCase()}
          </Text>
          <Text style={styles.storeNameText}>
            {order.items[0]?.title || 'Courier Delivery'}
          </Text>
        </View>

        <View style={styles.etaBadge}>
          <View style={styles.beaconWrap}>
            <Animated.View style={[styles.beaconPulse, animatedPulseStyle]} />
            <View style={styles.beaconDot} />
          </View>
          <Text style={styles.etaText}>~{order.etaMinutes} mins</Text>
        </View>
      </View>

      {/* ── 4-Stage Step Progress Tracker ── */}
      <View style={styles.progressContainer}>
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <React.Fragment key={step.key}>
              {/* Step Circle & Label */}
              <View style={styles.stepColumn}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor: isCompleted
                        ? colors.accent
                        : isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(0,0,0,0.06)',
                      borderColor: isCurrent
                        ? colors.accent
                        : 'transparent',
                      borderWidth: isCurrent ? 2 : 0,
                    },
                  ]}
                >
                  <Ionicons
                    name={step.icon}
                    size={14}
                    color={
                      isCompleted
                        ? '#FFFFFF'
                        : isDark
                        ? '#94A3B8'
                        : '#64748B'
                    }
                  />
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.stepLabel,
                    {
                      color: isCompleted
                        ? isDark
                          ? '#FFFFFF'
                          : '#1E293B'
                        : '#94A3B8',
                      fontWeight: isCurrent ? '800' : '600',
                    },
                  ]}
                >
                  {step.label}
                </Text>
              </View>

              {/* Connecting Line between steps */}
              {idx < STEPS.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    {
                      backgroundColor:
                        idx < currentStepIndex
                          ? colors.accent
                          : isDark
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(0,0,0,0.08)',
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* ── Rider Information & Handover PIN Bar ── */}
      <View
        style={[
          styles.riderRow,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          },
        ]}
      >
        <Image
          source={{ uri: order.driver?.avatar }}
          style={styles.driverAvatar}
          contentFit="cover"
        />

        <View style={styles.driverInfo}>
          <Text style={[styles.driverName, { color: isDark ? colors.textPrimary : '#1E293B' }]}>
            {order.driver?.name}
          </Text>
          <Text style={styles.driverVehicle}>
            {order.driver?.vehicleModel} • {order.driver?.vehiclePlate}
          </Text>
        </View>

        {/* Security Handover PIN */}
        <View style={styles.pinBadge}>
          <Text style={styles.pinLabel}>HANDOVER PIN</Text>
          <Text style={styles.pinNumber}>8492</Text>
        </View>
      </View>

      {/* ── Action Buttons ── */}
      <View style={styles.actionsRow}>
        {/* Call Driver */}
        <Pressable
          onPress={handleCall}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Call delivery driver"
          style={({ pressed }) => [
            styles.secondaryActionBtn,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons name="call" size={15} color={colors.accent} />
          <Text style={[styles.secondaryActionText, { color: isDark ? '#FFFFFF' : '#1E293B' }]}>
            Call
          </Text>
        </Pressable>

        {/* Chat */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            if (onOpenChat) onOpenChat();
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Message delivery driver"
          style={({ pressed }) => [
            styles.secondaryActionBtn,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons name="chatbubble-ellipses" size={15} color={colors.accent} />
          <Text style={[styles.secondaryActionText, { color: isDark ? '#FFFFFF' : '#1E293B' }]}>
            Chat
          </Text>
        </Pressable>

        {/* Track Live GPS Map */}
        <Pressable
          onPress={handleTrackMap}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Open live map tracking"
          style={({ pressed }) => [
            styles.primaryActionBtn,
            {
              backgroundColor: colors.accent,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <Ionicons name="map" size={15} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>Track Map</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderIdGroup: {
    flex: 1,
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  storeNameText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  beaconWrap: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  beaconPulse: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F97316',
  },
  beaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F97316',
  },
  etaText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F97316',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  stepColumn: {
    alignItems: 'center',
    width: 58,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  stepLine: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 2,
    marginBottom: 16,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: 16,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '700',
  },
  driverVehicle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  pinBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.4,
  },
  pinNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
  },
  secondaryActionText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
