import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeRouter } from '../../hooks/useSafeRouter';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { IconButton } from '../../components/ui/IconButton';
import { DeliveryMap } from '../../components/tracking/DeliveryMap';
import { DeliveryBottomSheet } from '../../components/tracking/DeliveryBottomSheet';
import { useCourierSimulation } from '../../hooks/useCourierSimulation';
import { useOrderRealtime } from '../../hooks/useOrderRealtime';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../components/ui/theme';
import { useOrderStore } from '../../store/order.store';
import { ORDER_STATUS_METADATA } from '../../lib/orderStatus';

export default function TrackingScreen() {
  const router = useSafeRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { colors, isDark } = useTheme();

  const currentOrder = useOrderStore((s) => s.currentOrder);

  // Safe fallback if order is missing
  if (!currentOrder) {
    return (
      <Screen safeBottom>
        <View style={[styles.topBarFallback, { borderBottomColor: colors.borderSubtle }]}>
          <IconButton
            icon={<Ionicons name="arrow-back" size={20} color={colors.textPrimary} />}
            onPress={() => router.replace('/(tabs)' as any)}
            accessibilityLabel="Back to explore"
            size={40}
          />
          <AppText variant="sectionTitle">Delivery status</AppText>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.missingContainer}>
          <Ionicons
            name="cube-outline"
            size={44}
            color={colors.textTertiary}
            style={{ marginBottom: Spacing.sm }}
          />
          <AppText variant="title" style={{ marginBottom: Spacing.xs }}>
            No active order
          </AppText>
          <AppText
            variant="body"
            color="secondary"
            style={{ textAlign: 'center', marginBottom: Spacing.xl }}
          >
            There is currently no active delivery to track for this reference ID.
          </AppText>
          <PrimaryButton
            label="Return to explore"
            onPress={() => router.replace('/(tabs)' as any)}
            style={{ width: '100%' }}
          />
        </View>
      </Screen>
    );
  }

  // Autonomous courier route simulation along Islamabad waypoints
  const { courierCoordinates, bearing, orderStatus } = useCourierSimulation({
    autoAdvance: true,
    stepIntervalMs: 2600,
  });

  // Optional Supabase Realtime synchronization layer
  useOrderRealtime(orderId);

  const statusMeta = ORDER_STATUS_METADATA[orderStatus];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/orders' as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Cinematic Map Layer */}
      <DeliveryMap
        courierCoordinates={courierCoordinates}
        bearing={bearing}
      />

      {/* Floating Top Controls with subtle elevation */}
      <View style={styles.topBar}>
        <IconButton
          icon={<Ionicons name="arrow-back" size={20} color={colors.textPrimary} />}
          onPress={handleBack}
          accessibilityLabel="Back to marketplace"
          variant="raised"
          size={44}
          style={styles.floatingButton}
        />

        {/* Quiet Tracking Pill */}
        <View
          style={[
            styles.trackingPill,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <View
            style={[
              styles.pulseDot,
              {
                backgroundColor:
                  orderStatus === 'delivered' ? colors.success : colors.accent,
              },
            ]}
          />
          <AppText variant="label" style={styles.pillText}>
            #{orderId || currentOrder.id} · {statusMeta.label}
          </AppText>
        </View>

        {/* GPS Locate / Recenter Button */}
        <IconButton
          icon={<Ionicons name="locate" size={20} color={colors.accent} />}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          }}
          accessibilityLabel="Recenter courier GPS"
          variant="raised"
          size={44}
          style={styles.floatingButton}
        />
      </View>

      {/* 22% / 52% / 92% Bottom Sheet */}
      <DeliveryBottomSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  topBarFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
  },
  missingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  topBar: {
    position: 'absolute',
    top: 56,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  floatingButton: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
  trackingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    maxWidth: '60%',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  pillText: {
    letterSpacing: -0.2,
  },
});
