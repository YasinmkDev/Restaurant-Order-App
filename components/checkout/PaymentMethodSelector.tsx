import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppText } from '../ui/AppText';
import { HonestNoticeModal } from '../ui/HonestNoticeModal';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { useOrderStore, PaymentMethod } from '../../store/order.store';

const PAYMENT_METHODS: {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  isSimulated?: boolean;
}[] = [
  {
    id: 'cash_on_delivery',
    title: 'Cash on delivery (COD)',
    subtitle: 'Pay the courier directly in cash at your doorstep',
    icon: 'cash-outline',
  },
  {
    id: 'credit_card',
    title: 'Debit / Credit card',
    subtitle: 'Visa, Mastercard, PayPak (Simulated authorization)',
    icon: 'card-outline',
    isSimulated: true,
  },
  {
    id: 'wallet',
    title: 'Mobile wallet (JazzCash / Easypaisa)',
    subtitle: 'Instant mobile account transfer (Simulated)',
    icon: 'wallet-outline',
    isSimulated: true,
  },
];

export function PaymentMethodSelector() {
  const { colors } = useTheme();
  const selectedMethod = useOrderStore((s) => s.selectedPaymentMethod);
  const setSelectedMethod = useOrderStore((s) => s.setSelectedPaymentMethod);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState({ title: '', message: '' });

  const handleSelect = (method: (typeof PAYMENT_METHODS)[0]) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedMethod(method.id);

    if (method.isSimulated) {
      setModalInfo({
        title: `${method.title} demo`,
        message:
          'In this mobile MVP, card and digital wallet authorizations run in local simulation mode. In production, this integrates with local payment gateways (JazzCash, Easypaisa, or 1Link / Stripe).',
      });
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {PAYMENT_METHODS.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <Pressable
            key={method.id}
            onPress={() => handleSelect(method)}
            accessible={true}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${method.title}, ${method.subtitle}`}
            style={[
              styles.row,
              isSelected && {
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
              },
              !isSelected && {
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            <Ionicons
              name={method.icon}
              size={18}
              color={isSelected ? colors.accent : colors.textSecondary}
              style={styles.icon}
            />

            <View style={styles.textBox}>
              <AppText variant="bodyMedium">{method.title}</AppText>
              <AppText variant="caption" color="secondary" numberOfLines={1}>
                {method.subtitle}
              </AppText>
            </View>

            <View
              style={[
                styles.radio,
                {
                  borderColor: isSelected ? colors.accent : colors.borderSubtle,
                },
              ]}
            >
              {isSelected && (
                <View
                  style={[
                    styles.radioDot,
                    { backgroundColor: colors.accent },
                  ]}
                />
              )}
            </View>
          </Pressable>
        );
      })}

      <HonestNoticeModal
        visible={modalVisible}
        title={modalInfo.title}
        message={modalInfo.message}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    minHeight: 56,
  },
  icon: {
    marginRight: Spacing.md,
  },
  textBox: {
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
