import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { CartItem } from '../../types/cart';
import { formatCurrency } from '../../lib/currency';

interface CheckoutItemCardProps {
  item: CartItem;
  onIncrease: (cartItemId: string) => void;
  onDecrease: (cartItemId: string) => void;
}

export function CheckoutItemCard({
  item,
  onIncrease,
  onDecrease,
}: CheckoutItemCardProps) {
  const { colors, isDark } = useTheme();

  const addOnsTotal = item.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const itemTotalPrice = (item.basePrice + addOnsTotal) * item.quantity;

  const handleDecrease = () => {
    Haptics.selectionAsync().catch(() => {});
    onDecrease(item.cartItemId);
  };

  const handleIncrease = () => {
    Haptics.selectionAsync().catch(() => {});
    onIncrease(item.cartItemId);
  };

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
      <View style={styles.contentRow}>
        {/* Item Thumbnail Image */}
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View
            style={[
              styles.placeholderThumbnail,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' },
            ]}
          >
            <Ionicons name="fast-food-outline" size={20} color="#94A3B8" />
          </View>
        )}

        {/* Item Details */}
        <View style={styles.infoCol}>
          <Text
            numberOfLines={1}
            style={[
              styles.itemTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            {item.title}
          </Text>

          {item.selectedAddOns.length > 0 && (
            <Text numberOfLines={1} style={styles.addOnsText}>
              {item.selectedAddOns.map((a) => a.label).join(', ')}
            </Text>
          )}

          {item.notes ? (
            <Text numberOfLines={1} style={styles.notesText}>
              Note: {item.notes}
            </Text>
          ) : null}

          {/* Stepper + Price Row */}
          <View style={styles.bottomRow}>
            {/* Inline Mini Stepper */}
            <View
              style={[
                styles.miniStepper,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              <Pressable
                onPress={handleDecrease}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Decrease item quantity"
                style={styles.miniStepperBtn}
              >
                <Ionicons
                  name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                  size={13}
                  color={item.quantity === 1 ? '#EF4444' : isDark ? '#FFFFFF' : '#1E293B'}
                />
              </Pressable>

              <Text
                style={[
                  styles.miniStepperCount,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {item.quantity}
              </Text>

              <Pressable
                onPress={handleIncrease}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Increase item quantity"
                style={styles.miniStepperBtn}
              >
                <Ionicons
                  name="add"
                  size={13}
                  color={isDark ? '#FFFFFF' : '#1E293B'}
                />
              </Pressable>
            </View>

            {/* Total Price for this item */}
            <Text
              style={[
                styles.priceText,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            >
              {formatCurrency(itemTotalPrice)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xs,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    marginRight: 12,
  },
  placeholderThumbnail: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  addOnsText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 2,
  },
  notesText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  miniStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 2,
    height: 28,
  },
  miniStepperBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStepperCount: {
    minWidth: 18,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '900',
  },
});
