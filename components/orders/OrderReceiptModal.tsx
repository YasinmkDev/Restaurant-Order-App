import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { formatCurrency } from '../../lib/currency';
import { PastOrderData } from './PastOrderCard';

interface OrderReceiptModalProps {
  order: PastOrderData | null;
  visible: boolean;
  onClose: () => void;
  onHelp?: (orderId: string) => void;
}

export function OrderReceiptModal({
  order,
  visible,
  onClose,
  onHelp,
}: OrderReceiptModalProps) {
  const { colors, isDark } = useTheme();

  if (!order) return null;

  const subtotal = order.total - 120;
  const deliveryFee = 99;
  const platformFee = 21;

  const handleDownload = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.scrimOverlay}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
              borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.08)',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text
                style={[
                  styles.sheetTitle,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                Order Receipt
              </Text>
              <Text style={styles.orderIdSubtitle}>
                #{order.id.replace('order-', '').toUpperCase()} • {order.storeName}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={[
                styles.closeButton,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' },
              ]}
            >
              <Ionicons name="close" size={18} color={isDark ? '#E2E8F0' : '#475569'} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Delivery Timestamp & Address */}
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                },
              ]}
            >
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={15} color={colors.accent} />
                <Text style={styles.infoText}>{order.dateText}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={15} color={colors.accent} />
                <Text numberOfLines={1} style={styles.infoText}>
                  House 42, Street 14, Sector F-10/2, Islamabad
                </Text>
              </View>
            </View>

            {/* Itemized Line Items */}
            <Text style={styles.sectionHeader}>ITEMS ORDERED</Text>
            <View style={styles.itemsList}>
              {order.items.map((item, idx) => (
                <View key={`item-${idx}`} style={styles.itemRow}>
                  <View style={styles.itemQtyWrap}>
                    <Text style={[styles.itemQtyText, { color: colors.accent }]}>
                      {item.quantity}×
                    </Text>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.itemTitle,
                      { color: isDark ? colors.textPrimary : '#1E293B' },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.itemPrice,
                      { color: isDark ? colors.textPrimary : '#1E293B' },
                    ]}
                  >
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Cost Breakdown */}
            <View style={styles.divider} />
            <Text style={styles.sectionHeader}>PAYMENT SUMMARY</Text>

            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Subtotal</Text>
              <Text
                style={[
                  styles.costValue,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {formatCurrency(subtotal)}
              </Text>
            </View>

            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Delivery Fee</Text>
              <Text
                style={[
                  styles.costValue,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {formatCurrency(deliveryFee)}
              </Text>
            </View>

            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Platform & Service Fee</Text>
              <Text
                style={[
                  styles.costValue,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {formatCurrency(platformFee)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={[styles.totalValue, { color: colors.accent }]}>
                {formatCurrency(order.total)}
              </Text>
            </View>

            {/* Payment Method Badge */}
            <View style={styles.paymentMethodRow}>
              <MaterialCommunityIcons
                name="cash-check"
                size={16}
                color="#10B981"
              />
              <Text style={styles.paymentMethodLabel}>
                Paid via {order.paymentMethod}
              </Text>
            </View>

            {/* Bottom Action Buttons */}
            <View style={styles.buttonStack}>
              <Pressable
                onPress={handleDownload}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Download receipt invoice"
                style={[
                  styles.downloadButton,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' },
                ]}
              >
                <Ionicons
                  name="download-outline"
                  size={16}
                  color={isDark ? '#E2E8F0' : '#475569'}
                />
                <Text
                  style={[
                    styles.downloadButtonText,
                    { color: isDark ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Download Invoice (PDF)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  onClose();
                  if (onHelp) onHelp(order.id);
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Get help with this order"
                style={styles.helpButton}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={16}
                  color={colors.accent}
                />
                <Text style={[styles.helpButtonText, { color: colors.accent }]}>
                  Need help with this order?
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    maxHeight: '85%',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  orderIdSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  infoBox: {
    padding: 12,
    borderRadius: Radius.md,
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  itemsList: {
    gap: 10,
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQtyWrap: {
    width: 28,
  },
  itemQtyText: {
    fontSize: 13,
    fontWeight: '800',
  },
  itemTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    marginVertical: 14,
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
  costValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  paymentMethodLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  buttonStack: {
    gap: 10,
    paddingBottom: 10,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Radius.lg,
  },
  downloadButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  helpButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
