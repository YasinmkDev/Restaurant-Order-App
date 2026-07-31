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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../components/ui/Screen';
import { Divider } from '../components/ui/Divider';
import { AddressSelectorModal } from '../components/checkout/AddressSelectorModal';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { SwipeToConfirm } from '../components/checkout/SwipeToConfirm';
import {
  DeliveryOptionSelector,
  DeliverySpeed,
} from '../components/checkout/DeliveryOptionSelector';
import { CourierTipSelector } from '../components/checkout/CourierTipSelector';
import { CheckoutPromoBar } from '../components/checkout/CheckoutPromoBar';
import { CheckoutItemCard } from '../components/checkout/CheckoutItemCard';
import { useTheme } from '../hooks/useTheme';
import { Radius, Spacing } from '../components/ui/theme';
import { useCartStore } from '../store/cart.store';
import { useOrderStore } from '../store/order.store';
import { formatCurrency } from '../lib/currency';
import { DEMO_ROUTE_COORDINATES } from '../data/routeCoordinates';
import { Order } from '../types/order';

export default function CheckoutScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const baseDeliveryFee = useCartStore((s) => s.getDeliveryFee());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const selectedAddress = useOrderStore((s) => s.selectedAddress);
  const selectedPaymentMethod = useOrderStore((s) => s.selectedPaymentMethod);
  const setCurrentOrder = useOrderStore((s) => s.setCurrentOrder);

  // Checkout states
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('standard');
  const [courierTip, setCourierTip] = useState(50);
  const [appliedPromo, setAppliedPromo] = useState<string | null>('WEEKEND20');
  const [dropoffOption, setDropoffOption] = useState<'door' | 'hand' | 'meet'>('door');
  const [isProcessing, setIsProcessing] = useState(false);

  const isEmpty = items.length === 0;

  // Additional calculation fees
  const priorityFee = deliverySpeed === 'priority' ? 60 : 0;
  const platformFee = 21; // Standard platform fee

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo === 'WEEKEND20') {
      return Math.round(subtotal * 0.2); // 20% off
    }
    if (appliedPromo === 'WELCOME99') {
      return baseDeliveryFee; // Free delivery
    }
    return 100;
  }, [appliedPromo, subtotal, baseDeliveryFee]);

  // Grand total
  const grandTotal = Math.max(
    0,
    subtotal + baseDeliveryFee + priorityFee + platformFee + courierTip - discountAmount
  );

  const handleOrderConfirmed = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const generatedOrderId = `order-sw-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: generatedOrderId,
      customerName: 'Max Khan',
      status: 'placed',
      items: [...items],
      subtotal,
      deliveryFee: baseDeliveryFee + priorityFee,
      total: grandTotal,
      deliveryAddress: selectedAddress,
      paymentMethod: selectedPaymentMethod,
      driver: {
        id: 'driver-ali-1',
        name: 'Ali Raza',
        phone: '+92 300 5551234',
        rating: 4.9,
        vehicleModel: 'Honda CD 70 (Red)',
        vehiclePlate: 'ICT-RI-842',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      },
      createdAt: new Date().toISOString(),
      etaMinutes: deliverySpeed === 'priority' ? 18 : 25,
      currentCoordinates: DEMO_ROUTE_COORDINATES[0],
      routeProgress: 0,
    };

    setCurrentOrder(newOrder);
    clearCart();

    router.replace(`/tracking/${generatedOrderId}` as any);
  };

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Top Bar ── */}
      <View
        style={[
          styles.topBar,
          {
            borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            backgroundColor: isDark ? colors.background : '#FFFFFF',
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back to cart"
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={isDark ? colors.textPrimary : '#1E293B'}
          />
        </Pressable>

        <View style={styles.titleCol}>
          <Text
            style={[
              styles.screenTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            Review & Checkout
          </Text>
          <Text style={styles.screenSubtitle}>
            Final step before courier dispatch
          </Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      {/* ── Empty State ── */}
      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconCircle,
              { backgroundColor: isDark ? 'rgba(255, 107, 0, 0.12)' : 'rgba(255, 107, 0, 0.08)' },
            ]}
          >
            <Ionicons name="cart-outline" size={44} color={colors.accent} />
          </View>
          <Text
            style={[
              styles.emptyTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            Your cart is empty
          </Text>
          <Text style={styles.emptyDesc}>
            Add some delicious items or courier parcels to proceed with checkout.
          </Text>
          <Pressable
            onPress={() => router.replace('/(tabs)' as any)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Start shopping"
            style={[styles.continueBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.continueBtnText}>Explore Restaurants</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Section 1: Delivery Address & Dropoff Notes ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[
                  styles.sectionHeading,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                Delivery Address
              </Text>
              <Pressable
                onPress={() => setAddressModalVisible(true)}
                hitSlop={8}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Change delivery address"
              >
                <Text style={[styles.actionLinkText, { color: colors.accent }]}>
                  Change
                </Text>
              </Pressable>
            </View>

            <View
              style={[
                styles.addressCard,
                {
                  backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
                  borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              <View style={styles.addressTop}>
                <View
                  style={[
                    styles.addressIconWrap,
                    { backgroundColor: 'rgba(255, 107, 0, 0.1)' },
                  ]}
                >
                  <Ionicons name="location" size={18} color={colors.accent} />
                </View>
                <View style={styles.addressInfo}>
                  <Text
                    style={[
                      styles.addressTitle,
                      { color: isDark ? colors.textPrimary : '#1E293B' },
                    ]}
                  >
                    {selectedAddress.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.addressFull}>
                    {selectedAddress.fullAddress}
                  </Text>
                </View>
              </View>

              {/* Drop-off Preferences */}
              <View style={styles.dropoffPillsRow}>
                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setDropoffOption('door');
                  }}
                  style={[
                    styles.dropoffPill,
                    {
                      backgroundColor:
                        dropoffOption === 'door'
                          ? colors.accent
                          : isDark
                          ? 'rgba(255,255,255,0.06)'
                          : '#F1F5F9',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropoffPillText,
                      { color: dropoffOption === 'door' ? '#FFFFFF' : '#94A3B8' },
                    ]}
                  >
                    Leave at door
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setDropoffOption('hand');
                  }}
                  style={[
                    styles.dropoffPill,
                    {
                      backgroundColor:
                        dropoffOption === 'hand'
                          ? colors.accent
                          : isDark
                          ? 'rgba(255,255,255,0.06)'
                          : '#F1F5F9',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropoffPillText,
                      { color: dropoffOption === 'hand' ? '#FFFFFF' : '#94A3B8' },
                    ]}
                  >
                    Hand to me
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setDropoffOption('meet');
                  }}
                  style={[
                    styles.dropoffPill,
                    {
                      backgroundColor:
                        dropoffOption === 'meet'
                          ? colors.accent
                          : isDark
                          ? 'rgba(255,255,255,0.06)'
                          : '#F1F5F9',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropoffPillText,
                      { color: dropoffOption === 'meet' ? '#FFFFFF' : '#94A3B8' },
                    ]}
                  >
                    Meet outside
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ── Section 2: Delivery Speed (Priority vs Standard) ── */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionHeading,
                { color: isDark ? colors.textPrimary : '#1E293B', marginBottom: 10 },
              ]}
            >
              Delivery Speed
            </Text>
            <DeliveryOptionSelector
              selectedSpeed={deliverySpeed}
              onSelectSpeed={setDeliverySpeed}
              priorityFee={60}
            />
          </View>

          {/* ── Section 3: Itemized Order Summary ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[
                  styles.sectionHeading,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </Text>
              <Pressable
                onPress={() => router.back()}
                hitSlop={8}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Add more items to cart"
              >
                <Text style={[styles.actionLinkText, { color: colors.accent }]}>
                  + Add more
                </Text>
              </Pressable>
            </View>

            <View style={styles.itemsList}>
              {items.map((item) => (
                <CheckoutItemCard
                  key={item.cartItemId}
                  item={item}
                  onIncrease={(id) => updateQuantity(id, item.quantity + 1)}
                  onDecrease={(id) => updateQuantity(id, item.quantity - 1)}
                />
              ))}
            </View>
          </View>

          {/* ── Section 4: Promo Codes & Vouchers ── */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionHeading,
                { color: isDark ? colors.textPrimary : '#1E293B', marginBottom: 10 },
              ]}
            >
              Promo Code & Discounts
            </Text>
            <CheckoutPromoBar
              appliedPromo={appliedPromo}
              discountAmount={discountAmount}
              onApplyPromo={(code) => setAppliedPromo(code)}
              onRemovePromo={() => setAppliedPromo(null)}
            />
          </View>

          {/* ── Section 5: Courier Rider Gratuity ── */}
          <View style={styles.section}>
            <CourierTipSelector
              selectedTip={courierTip}
              onSelectTip={setCourierTip}
              riderName="Ali Raza"
            />
          </View>

          {/* ── Section 6: Payment Method Hub ── */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionHeading,
                { color: isDark ? colors.textPrimary : '#1E293B', marginBottom: 10 },
              ]}
            >
              Payment Method
            </Text>
            <PaymentMethodSelector />
          </View>

          {/* ── Section 7: Transparent Cost Breakdown ── */}
          <View
            style={[
              styles.billCard,
              {
                backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
                borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <Text
              style={[
                styles.billHeading,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            >
              Payment Summary
            </Text>

            {/* Subtotal */}
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Items Subtotal</Text>
              <Text
                style={[
                  styles.costVal,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {formatCurrency(subtotal)}
              </Text>
            </View>

            {/* Base Delivery Fee */}
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Delivery Fee</Text>
              <Text
                style={[
                  styles.costVal,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {formatCurrency(baseDeliveryFee)}
              </Text>
            </View>

            {/* Priority Dispatch Fee */}
            {deliverySpeed === 'priority' && (
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Priority Dispatch</Text>
                <Text
                  style={[
                    styles.costVal,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  +{formatCurrency(priorityFee)}
                </Text>
              </View>
            )}

            {/* Platform & Service Fee */}
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Service & Platform Fee</Text>
              <Text
                style={[
                  styles.costVal,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {formatCurrency(platformFee)}
              </Text>
            </View>

            {/* Courier Rider Tip */}
            {courierTip > 0 && (
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Courier Rider Tip</Text>
                <Text
                  style={[
                    styles.costVal,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  +{formatCurrency(courierTip)}
                </Text>
              </View>
            )}

            {/* Voucher Discount */}
            {discountAmount > 0 && (
              <View style={styles.costRow}>
                <Text style={[styles.costLabel, { color: '#10B981', fontWeight: '700' }]}>
                  Voucher Discount ({appliedPromo})
                </Text>
                <Text style={[styles.costVal, { color: '#10B981', fontWeight: '800' }]}>
                  -{formatCurrency(discountAmount)}
                </Text>
              </View>
            )}

            <Divider style={styles.costDivider} />

            {/* Total Row */}
            <View style={styles.totalRow}>
              <View>
                <Text
                  style={[
                    styles.totalLabel,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  Total Amount
                </Text>
                <Text style={styles.totalSubtext}>Includes all taxes & fees</Text>
              </View>
              <Text style={[styles.totalAmount, { color: colors.accent }]}>
                {formatCurrency(grandTotal)}
              </Text>
            </View>
          </View>

          {/* ── Section 8: Slide to Confirm Order ── */}
          <View style={styles.sliderContainer}>
            <SwipeToConfirm
              onConfirm={handleOrderConfirmed}
              isLoading={isProcessing}
              totalAmount={grandTotal}
            />
          </View>
        </ScrollView>
      )}

      {/* ── Address Selector Modal ── */}
      <AddressSelectorModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 60,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  actionLinkText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  addressCard: {
    padding: 14,
    borderRadius: Radius.xl,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  addressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  addressFull: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  dropoffPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  dropoffPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  dropoffPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  itemsList: {
    gap: 6,
  },
  billCard: {
    padding: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  billHeading: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  costVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  costDivider: {
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '900',
  },
  totalSubtext: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '900',
  },
  sliderContainer: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 280,
  },
  continueBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
