import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { formatCurrency } from '../../lib/currency';

export interface PastOrderData {
  id: string;
  storeName: string;
  storeImage: string;
  itemsSummary: string;
  itemCount: number;
  dateText: string;
  status: 'delivered' | 'cancelled';
  total: number;
  paymentMethod: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
}

interface PastOrderCardProps {
  order: PastOrderData;
  onReorder: (order: PastOrderData) => void;
  onViewReceipt: (order: PastOrderData) => void;
  onRate?: (order: PastOrderData) => void;
}

export function PastOrderCard({
  order,
  onReorder,
  onViewReceipt,
  onRate,
}: PastOrderCardProps) {
  const { colors, isDark } = useTheme();

  const isDelivered = order.status === 'delivered';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
          borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      {/* ── Top Row: Store Avatar + Status + Price ── */}
      <View style={styles.topRow}>
        <Image
          source={{ uri: order.storeImage }}
          style={styles.storeLogo}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.storeDetails}>
          <Text
            numberOfLines={1}
            style={[styles.storeName, { color: isDark ? colors.textPrimary : '#1E293B' }]}
          >
            {order.storeName}
          </Text>

          <View style={styles.metaRow}>
            {/* Status Pill */}
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: isDelivered
                    ? 'rgba(16, 185, 129, 0.12)'
                    : 'rgba(239, 68, 68, 0.12)',
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isDelivered ? '#10B981' : '#EF4444' },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isDelivered ? '#10B981' : '#EF4444' },
                ]}
              >
                {isDelivered ? 'Delivered' : 'Cancelled'}
              </Text>
            </View>

            <Text style={styles.dateText}>{order.dateText}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text
            style={[styles.priceText, { color: isDark ? colors.textPrimary : '#1E293B' }]}
          >
            {formatCurrency(order.total)}
          </Text>
          <Text style={styles.paymentMethodText}>{order.paymentMethod}</Text>
        </View>
      </View>

      {/* ── Middle: Itemized Summary Pill ── */}
      <View
        style={[
          styles.summaryBox,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
          },
        ]}
      >
        <MaterialCommunityIcons
          name="bag-checked"
          size={14}
          color={colors.accent}
          style={{ marginRight: 6 }}
        />
        <Text numberOfLines={1} style={styles.itemsSummaryText}>
          {order.itemsSummary}
        </Text>
      </View>

      {/* ── Bottom Action Row ── */}
      <View style={styles.actionRow}>
        {/* Receipt / Details Button */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            onViewReceipt(order);
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`View receipt for ${order.storeName}`}
          style={({ pressed }) => [
            styles.secondaryBtn,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons name="receipt-outline" size={14} color={isDark ? '#E2E8F0' : '#475569'} />
          <Text style={[styles.secondaryBtnText, { color: isDark ? '#E2E8F0' : '#475569' }]}>
            Receipt
          </Text>
        </Pressable>

        {/* 1-Tap Reorder Button */}
        <Pressable
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            onReorder(order);
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Reorder from ${order.storeName}`}
          style={({ pressed }) => [
            styles.reorderBtn,
            {
              backgroundColor: colors.accent,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <Ionicons name="repeat" size={14} color="#FFFFFF" />
          <Text style={styles.reorderBtnText}>Reorder</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  storeDetails: {
    flex: 1,
    marginRight: 8,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
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
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  paymentMethodText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: Radius.md,
    marginBottom: 14,
  },
  itemsSummaryText: {
    flex: 1,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.md,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: Radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  reorderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
