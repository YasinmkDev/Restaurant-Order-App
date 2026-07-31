import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface Voucher {
  code: string;
  title: string;
  discount: string;
  minOrder: string;
  expiry: string;
}

const AVAILABLE_VOUCHERS: Voucher[] = [
  {
    code: 'WEEKEND20',
    title: 'Weekend Feast 20% OFF',
    discount: '20% off up to Rs. 300',
    minOrder: 'Min. order Rs. 999',
    expiry: 'Expires in 2 days',
  },
  {
    code: 'WELCOME99',
    title: 'First Delivery Waiver',
    discount: 'Rs. 99 Delivery Fee Discount',
    minOrder: 'No minimum order',
    expiry: 'Valid for new accounts',
  },
  {
    code: 'SWIFTPASS',
    title: 'VIP Double Cashback',
    discount: '10% Cashback to Wallet',
    minOrder: 'Valid on Food & Parcel orders',
    expiry: 'Expires end of month',
  },
];

interface VouchersModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyVoucher: (code: string) => void;
}

export function VouchersModal({
  visible,
  onClose,
  onApplyVoucher,
}: VouchersModalProps) {
  const { colors, isDark } = useTheme();

  const handleCopy = (code: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onApplyVoucher(code);
    onClose();
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
                Available Vouchers
              </Text>
              <Text style={styles.sheetSubtitle}>
                3 active promo discounts available for your account
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
            {AVAILABLE_VOUCHERS.map((v) => (
              <View
                key={v.code}
                style={[
                  styles.voucherCard,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                <View style={styles.voucherTop}>
                  <View>
                    <Text
                      style={[
                        styles.voucherTitle,
                        { color: isDark ? colors.textPrimary : '#1E293B' },
                      ]}
                    >
                      {v.title}
                    </Text>
                    <Text style={styles.voucherDiscount}>{v.discount}</Text>
                    <Text style={styles.voucherMeta}>
                      {v.minOrder} • {v.expiry}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleCopy(v.code)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Apply voucher code ${v.code}`}
                    style={[styles.applyBtn, { backgroundColor: colors.accent }]}
                  >
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </Pressable>
                </View>

                {/* Dotted coupon footer with code */}
                <View
                  style={[
                    styles.couponCodeRow,
                    {
                      borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    },
                  ]}
                >
                  <Ionicons name="pricetag" size={12} color="#F59E0B" />
                  <Text style={styles.codeText}>{v.code}</Text>
                </View>
              </View>
            ))}
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
    maxHeight: '80%',
    paddingBottom: 28,
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
  sheetSubtitle: {
    fontSize: 11.5,
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
    gap: 12,
  },
  voucherCard: {
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  voucherTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  voucherTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  voucherDiscount: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 2,
  },
  voucherMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  applyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: Radius.md,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  couponCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
});
