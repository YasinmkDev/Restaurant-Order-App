import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { formatCurrency } from '../../lib/currency';

interface CheckoutPromoBarProps {
  appliedPromo: string | null;
  discountAmount: number;
  onApplyPromo: (code: string) => void;
  onRemovePromo: () => void;
}

export function CheckoutPromoBar({
  appliedPromo,
  discountAmount,
  onApplyPromo,
  onRemovePromo,
}: CheckoutPromoBarProps) {
  const { colors, isDark } = useTheme();
  const [inputCode, setInputCode] = useState('');

  const handleApply = () => {
    if (!inputCode.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onApplyPromo(inputCode.trim().toUpperCase());
    setInputCode('');
  };

  const handleQuickApply = (code: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onApplyPromo(code);
  };

  return (
    <View style={styles.container}>
      {appliedPromo ? (
        /* Applied voucher state */
        <View
          style={[
            styles.appliedBox,
            {
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
            },
          ]}
        >
          <View style={styles.appliedLeft}>
            <Ionicons name="pricetag" size={16} color="#10B981" />
            <View>
              <Text style={styles.appliedCodeText}>{appliedPromo} Applied</Text>
              <Text style={styles.appliedDiscountText}>
                Saving {formatCurrency(discountAmount)} on this order
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onRemovePromo();
            }}
            hitSlop={8}
            style={styles.removeBtn}
          >
            <Ionicons name="close-circle" size={18} color="#10B981" />
          </Pressable>
        </View>
      ) : (
        /* Input state */
        <View>
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
                borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <Ionicons
              name="pricetag-outline"
              size={17}
              color={isDark ? '#94A3B8' : '#64748B'}
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={inputCode}
              onChangeText={setInputCode}
              placeholder="Promo or voucher code"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              autoCapitalize="characters"
              style={[
                styles.textInput,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            />
            <Pressable
              onPress={handleApply}
              disabled={!inputCode.trim()}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Apply promo code"
              style={({ pressed }) => [
                styles.applyBtn,
                {
                  backgroundColor: inputCode.trim()
                    ? colors.accent
                    : isDark
                    ? 'rgba(255,255,255,0.08)'
                    : '#E2E8F0',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.applyBtnText,
                  {
                    color: inputCode.trim()
                      ? '#FFFFFF'
                      : isDark
                      ? '#64748B'
                      : '#94A3B8',
                  },
                ]}
              >
                Apply
              </Text>
            </Pressable>
          </View>

          {/* Quick suggestion */}
          <Pressable
            onPress={() => handleQuickApply('WEEKEND20')}
            style={styles.quickSuggestRow}
          >
            <Ionicons name="sparkles" size={12} color="#F59E0B" />
            <Text style={styles.quickSuggestText}>
              Available: Tap to apply <Text style={{ fontWeight: '800' }}>WEEKEND20</Text> (-20%)
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  appliedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appliedCodeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.3,
  },
  appliedDiscountText: {
    fontSize: 11,
    color: '#10B981',
    marginTop: 1,
  },
  removeBtn: {
    padding: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  applyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.md,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  quickSuggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  quickSuggestText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
  },
});
