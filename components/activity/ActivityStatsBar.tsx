import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface ActivityStatsBarProps {
  points?: number;
  ordersThisMonth?: number;
  totalSaved?: number;
  onPressRewards?: () => void;
}

export function ActivityStatsBar({
  points = 520,
  ordersThisMonth = 8,
  totalSaved = 650,
  onPressRewards,
}: ActivityStatsBarProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
          borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      {/* ── Metric 1: Swift Club Points ── */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          if (onPressRewards) onPressRewards();
        }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Swift Rewards Points balance"
        style={styles.statColumn}
      >
        <View style={styles.iconRow}>
          <Ionicons name="sparkles" size={14} color="#F59E0B" />
          <Text style={[styles.statValue, { color: isDark ? colors.textPrimary : '#1E293B' }]}>
            {points}
          </Text>
        </View>
        <Text style={styles.statLabel}>Swift Points</Text>
      </Pressable>

      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
        ]}
      />

      {/* ── Metric 2: Completed Orders ── */}
      <View style={styles.statColumn}>
        <View style={styles.iconRow}>
          <MaterialCommunityIcons
            name="moped"
            size={16}
            color={colors.accent}
          />
          <Text style={[styles.statValue, { color: isDark ? colors.textPrimary : '#1E293B' }]}>
            {ordersThisMonth}
          </Text>
        </View>
        <Text style={styles.statLabel}>This Month</Text>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
        ]}
      />

      {/* ── Metric 3: Total Saved ── */}
      <View style={styles.statColumn}>
        <View style={styles.iconRow}>
          <Ionicons name="gift-outline" size={15} color="#10B981" />
          <Text style={[styles.statValue, { color: isDark ? colors.textPrimary : '#1E293B' }]}>
            Rs. {totalSaved}
          </Text>
        </View>
        <Text style={styles.statLabel}>Total Saved</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 28,
  },
});
