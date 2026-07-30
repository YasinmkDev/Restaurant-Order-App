import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { formatCurrency } from '../../lib/currency';

interface ProductFloatingBottomBarProps {
  quantity: number;
  totalPrice: number;
  isValid: boolean;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart: () => void;
}

export function ProductFloatingBottomBar({
  quantity,
  totalPrice,
  isValid,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
}: ProductFloatingBottomBarProps) {
  const { colors, isDark } = useTheme();

  const handleDecrease = () => {
    if (quantity <= 1) return;
    Haptics.selectionAsync().catch(() => {});
    onDecreaseQuantity();
  };

  const handleIncrease = () => {
    Haptics.selectionAsync().catch(() => {});
    onIncreaseQuantity();
  };

  const handleAdd = () => {
    onAddToCart();
  };

  return (
    <View
      style={[
        styles.floatingContainer,
        {
          backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
          borderTopColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      {/* ── Ergonomic Stepper Left ── */}
      <View
        style={[
          styles.stepperBox,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          },
        ]}
      >
        <Pressable
          onPress={handleDecrease}
          disabled={quantity <= 1}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Decrease quantity"
          style={({ pressed }) => [
            styles.stepperBtn,
            {
              opacity: quantity <= 1 ? 0.3 : pressed ? 0.6 : 1,
            },
          ]}
        >
          <Ionicons
            name="remove"
            size={18}
            color={isDark ? colors.textPrimary : '#1E293B'}
          />
        </Pressable>

        <Text
          style={[
            styles.stepperValue,
            { color: isDark ? colors.textPrimary : '#1E293B' },
          ]}
        >
          {quantity}
        </Text>

        <Pressable
          onPress={handleIncrease}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Increase quantity"
          style={({ pressed }) => [
            styles.stepperBtn,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Ionicons
            name="add"
            size={18}
            color={isDark ? colors.textPrimary : '#1E293B'}
          />
        </Pressable>
      </View>

      {/* ── Prominent Add to Cart Button Right ── */}
      <Pressable
        onPress={handleAdd}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Add to cart for ${formatCurrency(totalPrice)}`}
        style={({ pressed }) => [
          styles.addCartBtn,
          {
            backgroundColor: colors.accent,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
      >
        <Ionicons name="cart" size={17} color="#FFFFFF" />
        <Text style={styles.addCartBtnText}>
          Add to Cart • {formatCurrency(totalPrice)}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 4,
  },
  stepperBtn: {
    width: 38,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
  },
  addCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: Radius.full,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  addCartBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
});
