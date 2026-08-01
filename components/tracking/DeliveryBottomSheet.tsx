import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Divider } from '../ui/Divider';
import { DeliveryTimeline } from './DeliveryTimeline';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { useOrderStore } from '../../store/order.store';
import { useDemoStore } from '../../store/demo.store';
import { ORDER_STATUS_METADATA } from '../../lib/orderStatus';
import { formatCurrency } from '../../lib/currency';

export function DeliveryBottomSheet() {
  const { colors, isDark } = useTheme();
  const currentOrder = useOrderStore((s) => s.currentOrder);
  const { isDemoMode, advanceStatus, restartSimulation } = useDemoStore();

  const [chatNoticeVisible, setChatNoticeVisible] = useState(false);

  const snapPoints = useMemo(() => ['24%', '58%', '94%'], []);

  const status = currentOrder?.status || 'out_for_delivery';
  const meta = ORDER_STATUS_METADATA[status];
  const isDelivered = status === 'delivered';

  // Safe ETA calculation
  const etaMinutes = isDelivered ? 0 : Math.max(1, currentOrder?.etaMinutes || 12);
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + etaMinutes * 60000);
  const formattedArrival = arrivalTime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (currentOrder?.driver?.phone) {
      Linking.openURL(`tel:${currentOrder.driver.phone}`).catch(() => {
        Alert.alert('Call Courier', `Dialing ${currentOrder.driver.phone}...`);
      });
    } else {
      Linking.openURL('tel:+923005551234').catch(() => {});
    }
  };

  const handleMessage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Alert.alert(
      `Chat with ${currentOrder?.driver.name || 'Ali Raza'}`,
      'Encrypted rider-to-customer chat session is active. Send dropoff instructions or location landmarks.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Quick Message', onPress: () => {} },
      ]
    );
  };

  const handleSupport = () => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert(
      'Swift Priority Care',
      'Need help with this active delivery? Call our dispatch hotline at +92 (51) 111-79438.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Helpline', onPress: () => Linking.openURL('tel:+925111179438').catch(() => {}) },
      ]
    );
  };

  return (
    <BottomSheet
      snapPoints={snapPoints}
      index={0} // Resting at 24% by default so the map is fully visible
      backgroundStyle={{
        backgroundColor: isDark ? colors.surface : '#FFFFFF',
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        borderWidth: 1,
        borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 16,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        width: 40,
        height: 5,
        borderRadius: 2.5,
      }}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 1. Top Summary: Live Beacon, ETA, and Quick Status ── */}
        <View style={styles.topSummary}>
          <View style={styles.statusRow}>
            <View style={styles.beaconWrap}>
              <View
                style={[
                  styles.liveDot,
                  { backgroundColor: isDelivered ? '#10B981' : colors.accent },
                ]}
              />
              <Text
                style={[
                  styles.liveTag,
                  { color: isDelivered ? '#10B981' : colors.accent },
                ]}
              >
                {isDelivered ? 'DELIVERY COMPLETE' : 'LIVE TRACKING'}
              </Text>
            </View>

            <View style={styles.arrivalPill}>
              <Ionicons name="time" size={13} color={colors.accent} />
              <Text style={[styles.arrivalPillText, { color: colors.accent }]}>
                {isDelivered ? 'Arrived' : `ETA ${etaMinutes} mins`}
              </Text>
            </View>
          </View>

          <Text
            numberOfLines={1}
            style={[
              styles.statusTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            {meta.label}
          </Text>

          <Text style={styles.statusSubtitle}>
            {isDelivered
              ? 'Handed over at your doorstep. Enjoy your meal!'
              : `Arriving by approx. ${formattedArrival} • On route with rider`}
          </Text>
        </View>

        {/* ── 2. Security Handover PIN Card ── */}
        {!isDelivered && (
          <View
            style={[
              styles.pinCard,
              {
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.25)',
              },
            ]}
          >
            <View style={styles.pinLeft}>
              <View style={styles.pinIconCircle}>
                <Ionicons name="shield-checkmark" size={18} color="#10B981" />
              </View>
              <View>
                <Text style={styles.pinCardTitle}>HANDOVER SECURITY PIN</Text>
                <Text style={styles.pinCardSubtitle}>
                  Give this code to rider upon arrival
                </Text>
              </View>
            </View>
            <View style={styles.pinCodeBadge}>
              <Text style={styles.pinCodeText}>8492</Text>
            </View>
          </View>
        )}

        <Divider style={styles.divider} />

        {/* ── 3. Courier Rider Profile & Instant Contact Controls ── */}
        {currentOrder?.driver && (
          <View
            style={[
              styles.driverCard,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              },
            ]}
          >
            <View style={styles.driverInfoRow}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: currentOrder.driver.avatar }}
                  style={styles.driverAvatar}
                  contentFit="cover"
                />
                <View style={styles.verifiedDot}>
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                </View>
              </View>

              <View style={styles.driverMeta}>
                <View style={styles.nameRow}>
                  <Text
                    style={[
                      styles.driverName,
                      { color: isDark ? colors.textPrimary : '#1E293B' },
                    ]}
                  >
                    {currentOrder.driver.name}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.ratingText}>
                      {currentOrder.driver.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.vehicleRow}>
                  <MaterialCommunityIcons name="moped" size={14} color="#94A3B8" />
                  <Text style={styles.vehicleText}>
                    {currentOrder.driver.vehicleModel} • {currentOrder.driver.vehiclePlate}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Action Buttons */}
            <View style={styles.driverActionsRow}>
              <Pressable
                onPress={handleCall}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Call courier driver"
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <Ionicons name="call" size={15} color={colors.accent} />
                <Text style={[styles.actionBtnText, { color: isDark ? '#FFFFFF' : '#1E293B' }]}>
                  Call
                </Text>
              </Pressable>

              <Pressable
                onPress={handleMessage}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Send message to courier"
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <Ionicons name="chatbubble-ellipses" size={15} color={colors.accent} />
                <Text style={[styles.actionBtnText, { color: isDark ? '#FFFFFF' : '#1E293B' }]}>
                  Message
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <Divider style={styles.divider} />

        {/* ── 4. Vertical Stepped Delivery Timeline ── */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            Delivery Timeline
          </Text>
          <DeliveryTimeline currentStatus={status} />
        </View>

        <Divider style={styles.divider} />

        {/* ── 5. Delivery Address & Dropoff Notes ── */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            Delivery Address
          </Text>
          <View
            style={[
              styles.addressCard,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
              },
            ]}
          >
            <View style={styles.addressRow}>
              <Ionicons name="location" size={16} color={colors.accent} />
              <Text
                style={[
                  styles.addressHeading,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {currentOrder?.deliveryAddress.title}
              </Text>
            </View>
            <Text style={styles.addressText}>
              {currentOrder?.deliveryAddress.fullAddress}
            </Text>
            <View style={styles.dropoffInstructionPill}>
              <Ionicons name="shield-checkmark-outline" size={12} color="#10B981" />
              <Text style={styles.dropoffInstructionText}>
                Leave at door • Contactless dropoff enabled
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* ── 6. Itemized Order Receipt ── */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            Itemized Order
          </Text>

          <View style={styles.receiptItemsList}>
            {currentOrder?.items.map((item, idx) => (
              <View key={`item-${idx}`} style={styles.receiptItemRow}>
                <View style={styles.qtyBadge}>
                  <Text style={[styles.qtyText, { color: colors.accent }]}>
                    {item.quantity}×
                  </Text>
                </View>
                <View style={styles.itemTitleCol}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.receiptItemTitle,
                      { color: isDark ? colors.textPrimary : '#1E293B' },
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.selectedAddOns?.length > 0 && (
                    <Text numberOfLines={1} style={styles.receiptItemSub}>
                      {item.selectedAddOns.map((a) => a.label).join(', ')}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.receiptItemPrice,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  {formatCurrency(item.basePrice * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.totalRow,
              { borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
            ]}
          >
            <Text
              style={[
                styles.totalLabel,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            >
              Total Paid
            </Text>
            <Text style={[styles.totalPrice, { color: colors.accent }]}>
              {formatCurrency(currentOrder?.total || 1399)}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* ── 7. Customer Support Helpline ── */}
        <Pressable
          onPress={handleSupport}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Need help with this delivery"
          style={({ pressed }) => [
            styles.helpButton,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons name="help-circle-outline" size={17} color={colors.accent} />
          <Text style={[styles.helpBtnText, { color: isDark ? '#FFFFFF' : '#1E293B' }]}>
            Need Help with this Order?
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
        </Pressable>

        {/* ── 8. Demo Mode Route Controls (if active) ── */}
        {isDemoMode && (
          <View
            style={[
              styles.demoCard,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <View style={styles.demoHeader}>
              <Ionicons name="hardware-chip-outline" size={14} color="#F59E0B" />
              <Text style={styles.demoTitle}>TELEMETRY SIMULATION CONTROLS</Text>
            </View>
            <View style={styles.demoButtonsRow}>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  advanceStatus();
                }}
                style={[styles.demoBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.demoBtnText}>Next Stage ➔</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  restartSimulation();
                }}
                style={[
                  styles.demoBtn,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' },
                ]}
              >
                <Text
                  style={[
                    styles.demoBtnText,
                    { color: isDark ? '#FFFFFF' : '#1E293B' },
                  ]}
                >
                  Restart Route ↺
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 48,
  },
  topSummary: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  beaconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  liveTag: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  arrivalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  arrivalPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTitle: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  pinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginTop: 10,
  },
  pinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pinIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCardTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  pinCardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  pinCodeBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.md,
  },
  pinCodeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  driverCard: {
    padding: 14,
    borderRadius: Radius.xl,
    borderWidth: 1,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  driverName: {
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  ratingText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#F59E0B',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  vehicleText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  driverActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  section: {
    paddingVertical: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  addressCard: {
    padding: 12,
    borderRadius: Radius.lg,
    gap: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressHeading: {
    fontSize: 13,
    fontWeight: '800',
  },
  addressText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
    paddingLeft: 22,
  },
  dropoffInstructionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    paddingLeft: 22,
  },
  dropoffInstructionText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  receiptItemsList: {
    gap: 8,
    marginBottom: 10,
  },
  receiptItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBadge: {
    width: 24,
  },
  qtyText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  itemTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  receiptItemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  receiptItemSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  receiptItemPrice: {
    fontSize: 13,
    fontWeight: '800',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '900',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.lg,
    marginTop: Spacing.xs,
  },
  helpBtnText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginLeft: 8,
  },
  divider: {
    marginVertical: 12,
  },
  demoCard: {
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  demoTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.6,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
