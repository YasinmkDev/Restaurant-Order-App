import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface QuickActionGridProps {
  onPressFavorites: () => void;
  onPressVouchers: () => void;
  onPressOrders: () => void;
  onPressHelp: () => void;
  favoritesCount?: number;
  vouchersCount?: number;
}

export function QuickActionGrid({
  onPressFavorites,
  onPressVouchers,
  onPressOrders,
  onPressHelp,
  favoritesCount = 8,
  vouchersCount = 3,
}: QuickActionGridProps) {
  const { colors, isDark } = useTheme();

  const handleTilePress = (action: () => void) => {
    Haptics.selectionAsync().catch(() => {});
    action();
  };

  const TILES = [
    {
      id: 'favs',
      label: 'Favorites',
      sublabel: `${favoritesCount} Saved`,
      icon: 'heart' as const,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      action: onPressFavorites,
    },
    {
      id: 'vouchers',
      label: 'Vouchers',
      sublabel: `${vouchersCount} Active`,
      icon: 'pricetag' as const,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
      action: onPressVouchers,
    },
    {
      id: 'orders',
      label: 'Orders',
      sublabel: 'History',
      icon: 'receipt' as const,
      color: colors.accent,
      bg: 'rgba(255, 107, 0, 0.1)',
      action: onPressOrders,
    },
    {
      id: 'support',
      label: 'Support',
      sublabel: '24/7 Help',
      icon: 'headset' as const,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.1)',
      action: onPressHelp,
    },
  ];

  return (
    <View style={styles.grid}>
      {TILES.map((tile) => (
        <Pressable
          key={tile.id}
          onPress={() => handleTilePress(tile.action)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`${tile.label}: ${tile.sublabel}`}
          style={({ pressed }) => [
            styles.tile,
            {
              backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
              borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: tile.bg }]}>
            <Ionicons name={tile.icon} size={18} color={tile.color} />
          </View>
          <Text
            style={[
              styles.tileLabel,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            {tile.label}
          </Text>
          <Text style={styles.tileSublabel}>{tile.sublabel}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: Spacing.md,
  },
  tile: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  tileSublabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
});
