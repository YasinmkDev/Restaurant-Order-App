import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { formatCurrency } from '../../lib/currency';

interface WalletCardProps {
  balance?: number;
  onTopUp: () => void;
  onManageMethods: () => void;
}

export function WalletCard({
  balance = 450,
  onTopUp,
  onManageMethods,
}: WalletCardProps) {
  const { colors, isDark } = useTheme();

  const handleTopUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onTopUp();
  };

  const handleManage = () => {
    Haptics.selectionAsync().catch(() => {});
    onManageMethods();
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
      {/* ── Top Header: Balance ── */}
      <View style={styles.topRow}>
        <View>
          <View style={styles.labelRow}>
            <MaterialCommunityIcons name="wallet" size={16} color={colors.accent} />
            <Text style={styles.walletLabel}>SWIFT WALLET</Text>
          </View>
          <Text
            style={[
              styles.balanceText,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            {formatCurrency(balance)}
          </Text>
        </View>

        {/* Top Up Button */}
        <Pressable
          onPress={handleTopUp}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Top up wallet balance"
          style={({ pressed }) => [
            styles.topUpBtn,
            { backgroundColor: colors.accent, opacity: pressed ? 0.88 : 1 },
          ]}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.topUpBtnText}>Top Up</Text>
        </Pressable>
      </View>

      {/* ── Linked Methods Pills ── */}
      <View style={styles.methodsRow}>
        <View
          style={[
            styles.methodPill,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
            },
          ]}
        >
          <View style={[styles.methodDot, { backgroundColor: '#E11D48' }]} />
          <Text style={styles.methodText}>JazzCash</Text>
        </View>

        <View
          style={[
            styles.methodPill,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
            },
          ]}
        >
          <View style={[styles.methodDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.methodText}>EasyPaisa</Text>
        </View>

        <View
          style={[
            styles.methodPill,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
            },
          ]}
        >
          <Ionicons name="card" size={11} color="#3B82F6" />
          <Text style={styles.methodText}>Visa •• 4092</Text>
        </View>

        <Pressable
          onPress={handleManage}
          style={styles.manageBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Manage payment methods"
        >
          <Text style={[styles.manageBtnText, { color: colors.accent }]}>
            Edit
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  walletLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  balanceText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  topUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  topUpBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  methodsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  methodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  methodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  methodText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  manageBtn: {
    marginLeft: 'auto',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  manageBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
});
