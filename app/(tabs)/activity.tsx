import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../../components/ui/Screen';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../components/ui/theme';
import { useOrderStore } from '../../store/order.store';
import { ORDER_STATUS_METADATA } from '../../lib/orderStatus';
import {
  ActivityFilterChips,
  ActivityCategory,
} from '../../components/activity/ActivityFilterChips';
import { ActivityStatsBar } from '../../components/activity/ActivityStatsBar';
import { ActivityCard, ActivityFeedItem } from '../../components/activity/ActivityCard';
import { ActivityDetailModal } from '../../components/activity/ActivityDetailModal';

const INITIAL_ACTIVITY_ITEMS: ActivityFeedItem[] = [
  {
    id: 'act-1',
    category: 'payments',
    icon: 'checkmark-circle',
    iconColor: '#10B981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    title: 'Payment Confirmed · JazzCash',
    subtitle: 'Paid Rs. 1,950 for Cheezious Crown Crust Pizza order.',
    timestamp: 'Yesterday · 1:46 PM',
    isUnread: true,
    amountText: 'Rs. 1,950',
    amountType: 'debit',
    badgeLabel: 'Paid',
    actionLabel: 'View Receipt',
    metadata: {
      referenceId: 'JC-PK-8941028',
      details: [
        'Method: JazzCash Mobile Account (•••• 9842)',
        'Merchant: Cheezious F-7 Markaz, Islamabad',
        'Status: Settled & Verified',
      ],
    },
  },
  {
    id: 'act-2',
    category: 'rewards',
    icon: 'sparkles',
    iconColor: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    title: '+120 Swift Club Points Earned',
    subtitle: 'You completed your 8th delivery this month and unlocked Gold Tier.',
    timestamp: 'Yesterday · 2:10 PM',
    isUnread: true,
    amountText: '+120 Pts',
    amountType: 'credit',
    badgeLabel: 'Gold Tier',
    actionLabel: 'View Rewards',
    metadata: {
      referenceId: 'REW-GLD-4491',
      details: [
        'Current Balance: 520 Points',
        'Next Milestone: 800 Points (Free Biryani Feast)',
        'Points valid for 12 months',
      ],
    },
  },
  {
    id: 'act-3',
    category: 'orders',
    icon: 'checkmark-done',
    iconColor: '#10B981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    title: 'Delivered · Savour Foods',
    subtitle: 'Special Chicken Pulao delivered to Sector F-10/2 by Rider Bilal.',
    timestamp: '2 Oct · 8:38 PM',
    amountText: 'Rs. 1,060',
    amountType: 'debit',
    badgeLabel: 'Delivered',
    actionLabel: 'Reorder Dish',
    metadata: {
      referenceId: 'ORD-SAV-2091',
      details: [
        'Delivered on time (28 mins total duration)',
        'Handover PIN verified by rider',
        'Rated 5 Stars ★★★★★',
      ],
    },
  },
  {
    id: 'act-4',
    category: 'rewards',
    icon: 'gift',
    iconColor: '#EC4899',
    iconBg: 'rgba(236, 72, 153, 0.12)',
    title: 'Weekend Deal: 20% OFF Unlocked',
    subtitle: 'Use code WEEKEND20 for up to Rs. 300 off on all restaurants in Islamabad.',
    timestamp: '3 Oct · 11:00 AM',
    badgeLabel: 'Promo Code',
    actionLabel: 'Copy Voucher Code',
    metadata: {
      referenceId: 'VOUCHER-WKND-20',
      details: [
        'Code: WEEKEND20',
        'Minimum order: Rs. 999',
        'Valid until Sunday 11:59 PM',
      ],
    },
  },
  {
    id: 'act-5',
    category: 'security',
    icon: 'shield-checkmark',
    iconColor: '#3B82F6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    title: 'Security PIN Verified',
    subtitle: 'Contactless handover PIN was used to verify safe parcel collection.',
    timestamp: '30 Sep · 4:12 PM',
    badgeLabel: 'Security',
    metadata: {
      referenceId: 'SEC-PIN-8492',
      details: [
        'PIN: 8492 verified at 4:12 PM',
        'Dropoff: Sector G-11/3, Islamabad',
        'Courier: Hamza Malik',
      ],
    },
  },
  {
    id: 'act-6',
    category: 'security',
    icon: 'location',
    iconColor: '#8B5CF6',
    iconBg: 'rgba(139, 92, 246, 0.12)',
    title: 'Coverage Area Expanded',
    subtitle: 'Express 20-minute delivery is now active in Bahria Town & DHA Islamabad.',
    timestamp: '28 Sep · 10:00 AM',
    badgeLabel: 'Announcement',
    metadata: {
      referenceId: 'ANN-ISB-COV',
      details: [
        'New Hubs: Bahria Phase 7 & DHA Phase 2',
        'Over 85+ partner restaurants added',
        'Real-time courier fleet on standby',
      ],
    },
  },
];

export default function ActivityScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const currentOrder = useOrderStore((s) => s.currentOrder);

  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('all');
  const [items, setItems] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITY_ITEMS);
  const [selectedItem, setSelectedItem] = useState<ActivityFeedItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Derive dynamic live order activity item if an active delivery exists
  const liveOrderActivity = useMemo<ActivityFeedItem | null>(() => {
    if (!currentOrder) return null;
    const meta = ORDER_STATUS_METADATA[currentOrder.status];

    return {
      id: 'act-live-order',
      category: 'orders',
      icon: 'bicycle',
      iconColor: colors.accent,
      iconBg: 'rgba(255, 107, 0, 0.15)',
      title: `${meta.label} · ~${currentOrder.etaMinutes} mins away`,
      subtitle: `Rider ${currentOrder.driver.name} is on the way to ${currentOrder.deliveryAddress.title} on ${currentOrder.driver.vehicleModel}.`,
      timestamp: 'Happening now',
      isUnread: true,
      amountText: `ETA ${currentOrder.etaMinutes}m`,
      amountType: 'credit',
      badgeLabel: 'Live Delivery',
      actionLabel: 'Track On Live Map',
      metadata: {
        referenceId: `ORD-${currentOrder.id.replace('order-', '').toUpperCase()}`,
        details: [
          `Rider: ${currentOrder.driver.name} (${currentOrder.driver.vehiclePlate})`,
          `Destination: ${currentOrder.deliveryAddress.title}`,
          `Items: ${currentOrder.items[0]?.title || 'Package Order'}`,
        ],
      },
    };
  }, [currentOrder, colors.accent]);

  // Combined full list
  const fullList = useMemo(() => {
    if (liveOrderActivity) {
      return [liveOrderActivity, ...items];
    }
    return items;
  }, [liveOrderActivity, items]);

  // Filtered by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return fullList;
    return fullList.filter((item) => item.category === selectedCategory);
  }, [fullList, selectedCategory]);

  // Unread counts per category
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ActivityCategory, number>> = {};
    fullList.forEach((item) => {
      if (item.isUnread) {
        counts[item.category] = (counts[item.category] || 0) + 1;
        counts.all = (counts.all || 0) + 1;
      }
    });
    return counts;
  }, [fullList]);

  // Mark all as read
  const handleMarkAllRead = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setItems((prev) => prev.map((item) => ({ ...item, isUnread: false })));
  };

  // Open item modal & mark item read
  const handleOpenItem = (item: ActivityFeedItem) => {
    setSelectedItem(item);
    setModalVisible(true);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isUnread: false } : i))
    );
  };

  // Action button handling
  const handleAction = (item: ActivityFeedItem) => {
    if (item.category === 'orders') {
      if (currentOrder && item.id === 'act-live-order') {
        router.push(`/tracking/${currentOrder.id}` as any);
      } else {
        router.push('/(tabs)/orders' as any);
      }
    } else if (item.category === 'rewards') {
      Alert.alert(
        'Voucher Code Copied',
        'Code WEEKEND20 has been copied to your clipboard. Apply it at checkout for 20% OFF!',
        [{ text: 'Great' }]
      );
    } else if (item.category === 'payments') {
      router.push('/(tabs)/orders' as any);
    } else {
      Alert.alert(item.title, item.subtitle, [{ text: 'OK' }]);
    }
  };

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Top Header with Mark as Read ── */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            backgroundColor: isDark ? colors.background : '#FFFFFF',
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.screenTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            Activity Hub
          </Text>
          <Text style={styles.screenSubtitle}>
            Order updates, transaction receipts & rewards
          </Text>
        </View>

        {(categoryCounts.all || 0) > 0 && (
          <Pressable
            onPress={handleMarkAllRead}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
            style={({ pressed }) => [
              styles.markReadBtn,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons name="checkmark-done" size={15} color={colors.accent} />
            <Text style={[styles.markReadText, { color: colors.accent }]}>
              Mark read
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Top Stats Bar (Points, Deliveries, Savings) ── */}
        <ActivityStatsBar
          points={520}
          ordersThisMonth={8}
          totalSaved={650}
          onPressRewards={() => {
            Alert.alert(
              'Swift Rewards Club',
              'You have 520 Gold tier points! Redeem 800 points for a free Savour feast.',
              [{ text: 'OK' }]
            );
          }}
        />

        {/* ── Horizontal Filter Chips ── */}
        <ActivityFilterChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* ── Feed List ── */}
        <View style={styles.listContainer}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ActivityCard
                key={item.id}
                item={item}
                onPress={handleOpenItem}
                onActionPress={handleAction}
              />
            ))
          ) : (
            <View
              style={[
                styles.emptyStateCard,
                {
                  backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
                  borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              <Ionicons
                name="notifications-off-outline"
                size={38}
                color={isDark ? '#64748B' : '#94A3B8'}
                style={{ marginBottom: 10 }}
              />
              <Text
                style={[
                  styles.emptyTitle,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                No notifications in this category
              </Text>
              <Text style={styles.emptySubtitle}>
                You are all caught up! New updates regarding your deliveries and vouchers will appear here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Activity Detail Sheet Modal ── */}
      <ActivityDetailModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAction={handleAction}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: Spacing.md,
    paddingBottom: 160,
  },
  listContainer: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  emptyStateCard: {
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 270,
  },
});
