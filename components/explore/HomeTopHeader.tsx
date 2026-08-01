import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeRouter } from '../../hooks/useSafeRouter';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { VouchersModal } from '../account/VouchersModal';

const ROTATING_SEARCH_HINTS = [
  'Search "Savour Chicken Pulao"...',
  'Search "Cheezious Cheesy Tikka"...',
  'Search "Dum Pukht Mutton Biryani"...',
  'Search "Artisan Sourdough Pizza"...',
  'Search "Crispy Zinger Stacks"...',
  'Search "Flaky Almond Croissants"...',
];

interface HomeTopHeaderProps {
  userName?: string;
  onOpenSearch?: () => void;
  onOpenDietary?: () => void;
}

export function HomeTopHeader({
  userName = 'Max',
  onOpenSearch,
  onOpenDietary,
}: HomeTopHeaderProps) {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();

  // Modals state
  const [vouchersVisible, setVouchersVisible] = useState(false);

  // Rotating search hint
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % ROTATING_SEARCH_HINTS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Time-aware greeting
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        greeting: `Good morning, ${userName} ☀️`,
        subtext: 'Fresh breakfast & hot bakery bakes ready for dispatch',
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: `Good afternoon, ${userName} 🍛`,
        subtext: 'Lunch rush active • Guaranteed fast delivery under 30 mins',
      };
    } else if (hour >= 17 && hour < 22) {
      return {
        greeting: `Good evening, ${userName} 🌙`,
        subtext: 'Dinner picks from top-rated kitchens in Islamabad',
      };
    } else {
      return {
        greeting: `Midnight cravings, ${userName} 🔥`,
        subtext: '24/7 night delivery • Burgers, pizzas & snacks hot and ready',
      };
    }
  };

  const { greeting, subtext } = getGreetingData();

  const handleSearchPress = () => {
    Haptics.selectionAsync().catch(() => {});
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      router.navigate('/products' as any);
    }
  };

  const handleFilterPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onOpenDietary) {
      onOpenDietary();
    } else {
      router.navigate('/dietary' as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* ── 1. Top Brand & Deals Bar ── */}
      <View style={styles.topExecutiveBar}>
        {/* Brand Logo & Sub-tag */}
        <View style={styles.brandEmblem}>
          <Ionicons name="flash" size={19} color={colors.accent} />
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>SWIFT</Text>
          <View
            style={[
              styles.cityBadge,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            <Text style={[styles.cityBadgeText, { color: colors.textSecondary }]}>
              Islamabad
            </Text>
          </View>
        </View>

        {/* Right Action: Active Deals / Vouchers Pill */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            setVouchersVisible(true);
          }}
          style={({ pressed }) => [
            styles.dealsPill,
            {
              backgroundColor: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.10)',
              borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.25)',
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          hitSlop={4}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View available deals and discount vouchers"
        >
          <Ionicons name="pricetag" size={13} color="#F59E0B" />
          <Text style={styles.dealsPillText}>2 Deals Available</Text>
        </Pressable>
      </View>

      {/* ── 2. Smart Omnibar Search with Rotating Dish Suggestions ── */}
      <View style={styles.searchRowWrapper}>
        <Pressable
          onPress={handleSearchPress}
          style={({ pressed }) => [
            styles.searchOmnibar,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.borderSubtle,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          accessible={true}
          accessibilityRole="search"
          accessibilityLabel="Search restaurants, dishes, groceries"
        >
          <View style={styles.searchBarLeft}>
            <Ionicons name="search" size={18} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.searchHintText, { color: colors.textSecondary }]}>
              {ROTATING_SEARCH_HINTS[hintIndex]}
            </Text>
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleFilterPress();
            }}
            style={[
              styles.filterShortcutBtn,
              {
                backgroundColor: isDark ? 'rgba(255, 107, 0, 0.16)' : 'rgba(255, 107, 0, 0.08)',
                borderColor: isDark ? 'rgba(255, 107, 0, 0.3)' : 'rgba(255, 107, 0, 0.15)',
              },
            ]}
            hitSlop={8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Filter dietary preferences"
          >
            <Ionicons name="options-outline" size={15} color={colors.accent} />
          </Pressable>
        </Pressable>
      </View>

      {/* ── 3. Time-Aware Personalized Greeting & Micro-Perk Strip ── */}
      <View style={styles.greetingContainer}>
        <View style={styles.greetingHeaderRow}>
          <Text style={[styles.greetingTitle, { color: colors.textPrimary }]}>
            {greeting}
          </Text>
        </View>
        <Text style={[styles.greetingSubtext, { color: colors.textSecondary }]}>
          {subtext}
        </Text>

        {/* Swift Pass VIP Live Perk Ribbon */}
        <Pressable
          onPress={() => router.navigate('/(tabs)/account' as any)}
          style={[
            styles.vipPerkRibbon,
            {
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.10)' : 'rgba(16, 185, 129, 0.08)',
              borderColor: isDark ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.18)',
            },
          ]}
        >
          <View style={styles.perkLeft}>
            <Ionicons name="shield-checkmark" size={14} color="#10B981" />
            <Text style={[styles.perkText, { color: isDark ? '#34D399' : '#059669' }]}>
              Swift Pass VIP Active · Rs. 0 delivery on orders over Rs. 799
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={13} color="#10B981" />
        </Pressable>
      </View>

      {/* ── Vouchers & Deals Modal ── */}
      <VouchersModal
        visible={vouchersVisible}
        onClose={() => setVouchersVisible(false)}
        onApplyVoucher={(code) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          router.navigate('/checkout' as any);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  topExecutiveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  brandEmblem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  cityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginLeft: 2,
  },
  cityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dealsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 5,
  },
  dealsPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  searchRowWrapper: {
    marginBottom: Spacing.sm,
  },
  searchOmnibar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 46,
    borderRadius: Radius.full,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchHintText: {
    fontSize: 13,
    fontWeight: '500',
  },
  filterShortcutBtn: {
    padding: 6.5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  greetingContainer: {
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  greetingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  greetingSubtext: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  vipPerkRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  perkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  perkText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
