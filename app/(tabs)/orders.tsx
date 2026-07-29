import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
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
import { useCartStore } from '../../store/cart.store';
import { OrderSegmentedTabs, OrderTabKey } from '../../components/orders/OrderSegmentedTabs';
import { ActiveOrderLiveCard } from '../../components/orders/ActiveOrderLiveCard';
import { PastOrderCard, PastOrderData } from '../../components/orders/PastOrderCard';
import { OrderReceiptModal } from '../../components/orders/OrderReceiptModal';
import { CourierParcelCard, CourierPackageData } from '../../components/orders/CourierParcelCard';
import { SupportWidget } from '../../components/orders/SupportWidget';

const PAST_ORDERS_DATA: PastOrderData[] = [
  {
    id: 'past-101',
    storeName: 'Cheezious F-7',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    itemsSummary: '1× Crown Crust Pizza (Large), 1× Cheesy Sticks',
    itemCount: 2,
    dateText: 'Delivered yesterday · 1:45 PM',
    status: 'delivered',
    total: 1950,
    paymentMethod: 'JazzCash',
    items: [
      { title: 'Crown Crust Pizza (Large)', quantity: 1, price: 1550 },
      { title: 'Cheesy Sticks & Dip', quantity: 1, price: 400 },
    ],
  },
  {
    id: 'past-102',
    storeName: 'Savour Foods Blue Area',
    storeImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
    itemsSummary: '2× Special Chicken Pulao with Shami Kabab',
    itemCount: 2,
    dateText: 'Delivered 2 Oct · 8:15 PM',
    status: 'delivered',
    total: 1060,
    paymentMethod: 'Cash on Delivery',
    items: [
      { title: 'Special Chicken Pulao with Kabab', quantity: 2, price: 530 },
    ],
  },
  {
    id: 'past-103',
    storeName: 'Tehzeeb Bakery',
    storeImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
    itemsSummary: '1× Chicken Puff Patties (Box of 4), 2× Chocolate Donut',
    itemCount: 3,
    dateText: 'Delivered 28 Sep · 5:20 PM',
    status: 'delivered',
    total: 940,
    paymentMethod: 'Visa •••• 4092',
    items: [
      { title: 'Chicken Puff Patties (Box of 4)', quantity: 1, price: 680 },
      { title: 'Chocolate Donut', quantity: 2, price: 130 },
    ],
  },
  {
    id: 'past-104',
    storeName: 'Chaaye Khana',
    storeImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80',
    itemsSummary: '1× Classic Club Sandwich + Karak Chai',
    itemCount: 2,
    dateText: 'Cancelled 24 Sep · 9:30 PM',
    status: 'cancelled',
    total: 820,
    paymentMethod: 'EasyPaisa',
    items: [
      { title: 'Classic Club Sandwich', quantity: 1, price: 650 },
      { title: 'Karak Chai', quantity: 1, price: 170 },
    ],
  },
];

const COURIER_PACKAGES_DATA: CourierPackageData[] = [
  {
    id: 'pkg-1',
    trackingNumber: 'SWIFT-PK-8921',
    packageType: 'Confidential Legal Documents',
    weight: '0.4 kg',
    senderAddress: 'House 42, Sector F-10/2, Islamabad',
    receiverAddress: 'State Life Building, Blue Area, Islamabad',
    status: 'in_transit',
    dateText: 'Started 12 mins ago',
    etaMinutes: 14,
    riderName: 'Hamza Malik',
    riderPhone: '+923019876543',
    fee: 250,
  },
  {
    id: 'pkg-2',
    trackingNumber: 'SWIFT-PK-7410',
    packageType: 'Electronics Parcel Box',
    weight: '1.8 kg',
    senderAddress: 'Plaza 14, I-8 Markaz, Islamabad',
    receiverAddress: 'Apartment 302, Sector G-11/3, Islamabad',
    status: 'delivered',
    dateText: 'Delivered 30 Sep · 4:10 PM',
    riderName: 'Bilal Ahmed',
    riderPhone: '+923331122334',
    fee: 380,
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const currentOrder = useOrderStore((s) => s.currentOrder);
  const addItemToCart = useCartStore((s) => s.addItem);

  const [selectedTab, setSelectedTab] = useState<OrderTabKey>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<PastOrderData | null>(null);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter completed past orders based on search query
  const filteredPastOrders = useMemo(() => {
    if (!searchQuery.trim()) return PAST_ORDERS_DATA;
    const q = searchQuery.toLowerCase().trim();
    return PAST_ORDERS_DATA.filter(
      (order) =>
        order.storeName.toLowerCase().includes(q) ||
        order.itemsSummary.toLowerCase().includes(q) ||
        order.paymentMethod.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Handle 1-Tap Reorder
  const handleReorder = (order: PastOrderData) => {
    order.items.forEach((item, index) => {
      addItemToCart({
        cartItemId: `reorder-${order.id}-${index}-${Date.now()}`,
        productId: `prod-${order.id}-${index}`,
        storeId: order.id,
        title: item.title,
        quantity: item.quantity,
        basePrice: item.price,
        selectedAddOns: [],
        image: order.storeImage,
      });
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setToastMessage(`Added items from ${order.storeName} to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Handle Receipt Modal
  const handleViewReceipt = (order: PastOrderData) => {
    setSelectedReceiptOrder(order);
    setReceiptVisible(true);
  };

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Top Header ── */}
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
            My Orders
          </Text>
          <Text style={styles.screenSubtitle}>
            Live deliveries, parcel couriers & past history
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/cart' as any)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Open cart"
          style={[
            styles.cartHeaderBtn,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
            },
          ]}
        >
          <Ionicons name="cart-outline" size={20} color={colors.accent} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Sliding Segmented Tabs ── */}
        <OrderSegmentedTabs
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          activeCount={currentOrder ? 1 : 0}
        />

        {/* ── Optional Search Bar for Completed Orders ── */}
        {selectedTab === 'completed' && (
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              },
            ]}
          >
            <Ionicons
              name="search"
              size={18}
              color={isDark ? '#94A3B8' : '#64748B'}
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search previous orders or restaurants..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              style={[
                styles.searchInput,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery('')}
                hitSlop={8}
                style={styles.clearBtn}
              >
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={isDark ? '#94A3B8' : '#64748B'}
                />
              </Pressable>
            )}
          </View>
        )}

        {/* ── Active Tab View ── */}
        {selectedTab === 'active' && (
          <View style={styles.tabContent}>
            {currentOrder ? (
              <ActiveOrderLiveCard
                order={currentOrder}
                onOpenChat={() => {
                  Alert.alert(
                    'Chat with Driver',
                    `Direct message channel with ${currentOrder.driver?.name || 'your rider'} is ready.`,
                    [{ text: 'OK' }]
                  );
                }}
              />
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
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: isDark ? 'rgba(255, 107, 0, 0.12)' : 'rgba(255, 107, 0, 0.08)' },
                  ]}
                >
                  <Ionicons name="bicycle" size={38} color={colors.accent} />
                </View>
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  No active orders right now
                </Text>
                <Text style={styles.emptySubtitle}>
                  Order hot food, groceries, or book an on-demand courier parcel rider across Islamabad & Rawalpindi.
                </Text>
                <Pressable
                  onPress={() => router.push('/(tabs)' as any)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Explore nearby restaurants and food"
                  style={[styles.exploreBtn, { backgroundColor: colors.accent }]}
                >
                  <Ionicons name="compass-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.exploreBtnText}>Explore Top Food</Text>
                </Pressable>
              </View>
            )}

            {/* Quick Reorder Section for convenience */}
            <View style={styles.quickReorderSection}>
              <View style={styles.sectionHeaderRow}>
                <Text
                  style={[
                    styles.sectionHeading,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  Reorder Favorites
                </Text>
                <Pressable onPress={() => setSelectedTab('completed')}>
                  <Text style={[styles.seeAllText, { color: colors.accent }]}>
                    View All
                  </Text>
                </Pressable>
              </View>

              {PAST_ORDERS_DATA.slice(0, 2).map((order) => (
                <PastOrderCard
                  key={order.id}
                  order={order}
                  onReorder={handleReorder}
                  onViewReceipt={handleViewReceipt}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── Completed Tab View ── */}
        {selectedTab === 'completed' && (
          <View style={styles.tabContent}>
            {filteredPastOrders.length > 0 ? (
              filteredPastOrders.map((order) => (
                <PastOrderCard
                  key={order.id}
                  order={order}
                  onReorder={handleReorder}
                  onViewReceipt={handleViewReceipt}
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
                  name="search-outline"
                  size={36}
                  color={isDark ? '#64748B' : '#94A3B8'}
                  style={{ marginBottom: 8 }}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  No matching orders
                </Text>
                <Text style={styles.emptySubtitle}>
                  We could not find any previous deliveries matching &ldquo;{searchQuery}&rdquo;.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Courier Tab View ── */}
        {selectedTab === 'packages' && (
          <View style={styles.tabContent}>
            {COURIER_PACKAGES_DATA.map((pkg) => (
              <CourierParcelCard
                key={pkg.id}
                parcel={pkg}
                onTrack={(parcel) => {
                  Alert.alert(
                    'Courier Tracking',
                    `Tracking live parcel ${parcel.trackingNumber}. Rider ${parcel.riderName} is on route.`,
                    [{ text: 'OK' }]
                  );
                }}
              />
            ))}
          </View>
        )}

        {/* ── 24/7 Live Order Support ── */}
        <SupportWidget
          onContactSupport={() => {
            Alert.alert(
              'Swift Courier Support',
              'Connecting you with our 24/7 priority customer care team in Islamabad.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call Helpline', onPress: () => {} },
              ]
            );
          }}
        />
      </ScrollView>

      {/* ── Itemized Order Receipt Modal ── */}
      <OrderReceiptModal
        order={selectedReceiptOrder}
        visible={receiptVisible}
        onClose={() => setReceiptVisible(false)}
        onHelp={(orderId) => {
          Alert.alert(
            'Order Dispute & Help',
            `Our support specialist will review Order #${orderId.toUpperCase()} and contact you within 5 minutes.`,
            [{ text: 'OK' }]
          );
        }}
      />

      {/* ── Reorder Feedback Toast ── */}
      {toastMessage && (
        <View
          style={[
            styles.toastBox,
            {
              backgroundColor: isDark ? '#1E293B' : '#0F172A',
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.toastText}>{toastMessage}</Text>
          <Pressable
            onPress={() => {
              setToastMessage(null);
              router.push('/cart' as any);
            }}
            style={styles.toastActionBtn}
          >
            <Text style={[styles.toastActionText, { color: colors.accent }]}>
              View Cart
            </Text>
          </Pressable>
        </View>
      )}
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
  cartHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 160,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  clearBtn: {
    padding: 2,
  },
  tabContent: {
    marginBottom: Spacing.md,
  },
  emptyStateCard: {
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
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
    marginBottom: 16,
    maxWidth: 280,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  quickReorderSection: {
    marginTop: Spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  toastBox: {
    position: 'absolute',
    bottom: 96,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 999,
  },
  toastText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
  toastActionBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  toastActionText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});
