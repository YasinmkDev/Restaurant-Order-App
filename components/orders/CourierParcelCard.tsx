import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { formatCurrency } from '../../lib/currency';

export interface CourierPackageData {
  id: string;
  trackingNumber: string;
  packageType: string;
  weight: string;
  senderAddress: string;
  receiverAddress: string;
  status: 'in_transit' | 'delivered';
  dateText: string;
  etaMinutes?: number;
  riderName: string;
  riderPhone: string;
  fee: number;
}

interface CourierParcelCardProps {
  parcel: CourierPackageData;
  onTrack?: (parcel: CourierPackageData) => void;
}

export function CourierParcelCard({ parcel, onTrack }: CourierParcelCardProps) {
  const { colors, isDark } = useTheme();
  const isInTransit = parcel.status === 'in_transit';

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (parcel.riderPhone) {
      Linking.openURL(`tel:${parcel.riderPhone}`).catch(() => {});
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
          borderColor: isInTransit
            ? isDark
              ? 'rgba(255, 107, 0, 0.35)'
              : 'rgba(255, 107, 0, 0.25)'
            : isDark
            ? colors.borderSubtle
            : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      {/* ── Top Header ── */}
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={18}
              color={colors.accent}
            />
          </View>
          <View>
            <Text
              style={[
                styles.trackingNum,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            >
              {parcel.trackingNumber}
            </Text>
            <Text style={styles.metaSub}>
              {parcel.packageType} • {parcel.weight}
            </Text>
          </View>
        </View>

        {/* Status Pill */}
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isInTransit
                ? 'rgba(249, 115, 22, 0.12)'
                : 'rgba(16, 185, 129, 0.12)',
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isInTransit ? '#F97316' : '#10B981' },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isInTransit ? '#F97316' : '#10B981' },
            ]}
          >
            {isInTransit ? `In Transit (~${parcel.etaMinutes}m)` : 'Delivered'}
          </Text>
        </View>
      </View>

      {/* ── Route Timeline ── */}
      <View style={styles.routeContainer}>
        {/* Pickup Row */}
        <View style={styles.routeRow}>
          <View style={styles.timelineCol}>
            <View style={[styles.timelineNode, { borderColor: '#10B981' }]} />
            <View style={styles.timelineDottedLine} />
          </View>
          <View style={styles.routeAddressWrap}>
            <Text style={styles.routeRoleText}>PICKUP</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.routeAddressText,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            >
              {parcel.senderAddress}
            </Text>
          </View>
        </View>

        {/* Dropoff Row */}
        <View style={styles.routeRow}>
          <View style={styles.timelineCol}>
            <View style={[styles.timelineNode, { borderColor: colors.accent }]} />
          </View>
          <View style={styles.routeAddressWrap}>
            <Text style={styles.routeRoleText}>DROP-OFF</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.routeAddressText,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            >
              {parcel.receiverAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Courier Rider & Fee Footer ── */}
      <View style={styles.footerRow}>
        <View style={styles.riderCol}>
          <Text style={styles.riderLabel}>Rider</Text>
          <Text
            style={[
              styles.riderName,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            {parcel.riderName}
          </Text>
        </View>

        <View style={styles.actionsRight}>
          <Text
            style={[
              styles.feeText,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            {formatCurrency(parcel.fee)}
          </Text>

          {isInTransit && (
            <Pressable
              onPress={handleCall}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Call courier driver"
              style={[
                styles.callBtn,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' },
              ]}
            >
              <Ionicons name="call" size={14} color={colors.accent} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingNum: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  metaSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  routeContainer: {
    marginBottom: 14,
    paddingLeft: 4,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineCol: {
    alignItems: 'center',
    width: 16,
    marginRight: 10,
  },
  timelineNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 2,
  },
  timelineDottedLine: {
    width: 1.5,
    height: 20,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    marginVertical: 2,
  },
  routeAddressWrap: {
    flex: 1,
    paddingBottom: 4,
  },
  routeRoleText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  routeAddressText: {
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  riderCol: {
    gap: 1,
  },
  riderLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  riderName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feeText: {
    fontSize: 14,
    fontWeight: '900',
  },
  callBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
