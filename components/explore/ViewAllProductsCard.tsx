import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppText } from '../ui/AppText';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface ViewAllProductsCardProps {
  totalCount: number;
  onExplore: () => void;
  onSelectCategory?: (categoryKey: string) => void;
}

const PREVIEW_AVATARS = [
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80', // Biryani
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80', // Burger
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80', // Pizza
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80', // Bakery
];

const PREVIEW_TAGS = [
  { id: 'biryani', label: '🍗 Biryani' },
  { id: 'burgers', label: '🍔 Burgers' },
  { id: 'pizza', label: '🍕 Pizza' },
  { id: 'bakery', label: '🥐 Bakery' },
  { id: 'chai', label: '☕ Karak Chai' },
  { id: 'groceries', label: '🛒 Mart' },
];

export function ViewAllProductsCard({
  totalCount,
  onExplore,
  onSelectCategory,
}: ViewAllProductsCardProps) {
  const { colors, isDark } = useTheme();

  const handlePressExplore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onExplore();
  };

  const handlePressTag = (catId: string) => {
    Haptics.selectionAsync().catch(() => {});
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      onExplore();
    }
  };

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? '#161922' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 107, 0, 0.28)' : 'rgba(255, 107, 0, 0.18)',
          shadowColor: colors.accent,
        },
      ]}
    >
      {/* Decorative top accent glow stripe */}
      <View
        style={[
          styles.glowStripe,
          {
            backgroundColor: colors.accent,
          },
        ]}
      />

      {/* Top Banner Row: Avatars Cluster + Badge */}
      <View style={styles.topRow}>
        <View style={styles.avatarCluster}>
          {PREVIEW_AVATARS.map((uri, index) => (
            <View
              key={index}
              style={[
                styles.avatarWrapper,
                {
                  marginLeft: index === 0 ? 0 : -14,
                  borderColor: isDark ? '#161922' : '#FFFFFF',
                  zIndex: 10 - index,
                },
              ]}
            >
              <Image source={{ uri }} style={styles.avatarImage} contentFit="cover" />
            </View>
          ))}
          <View
            style={[
              styles.avatarWrapper,
              styles.countAvatar,
              {
                marginLeft: -14,
                borderColor: isDark ? '#161922' : '#FFFFFF',
                backgroundColor: colors.accent,
                zIndex: 5,
              },
            ]}
          >
            <Text style={styles.countAvatarText}>+{Math.max(0, totalCount - PREVIEW_AVATARS.length)}</Text>
          </View>
        </View>

        <View
          style={[
            styles.sparkleBadge,
            {
              backgroundColor: isDark ? 'rgba(255, 107, 0, 0.15)' : 'rgba(255, 107, 0, 0.10)',
              borderColor: isDark ? 'rgba(255, 107, 0, 0.35)' : 'rgba(255, 107, 0, 0.25)',
            },
          ]}
        >
          <Ionicons name="sparkles" size={12} color={colors.accent} />
          <Text style={[styles.sparkleBadgeText, { color: colors.accent }]}>Full Menu</Text>
        </View>
      </View>

      {/* Headline & Description */}
      <View style={styles.textContent}>
        <AppText variant="title" style={styles.heading}>
          Explore the Full Menu
        </AppText>
        <AppText variant="caption" color="secondary" style={styles.subheading}>
          Looking for more? Browse all {totalCount}+ chef-crafted dishes, artisan bakes, and daily mart essentials with instant dietary & price filters.
        </AppText>
      </View>

      {/* Quick Category Chips */}
      <View style={styles.tagsContainer}>
        {PREVIEW_TAGS.map((tag) => (
          <Pressable
            key={tag.id}
            onPress={() => handlePressTag(tag.id)}
            style={({ pressed }) => [
              styles.tagPill,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                borderColor: colors.borderSubtle,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            hitSlop={4}
          >
            <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Main Call to Action Button */}
      <Pressable
        onPress={handlePressExplore}
        style={({ pressed }) => [
          styles.ctaButton,
          {
            backgroundColor: pressed ? colors.accentPressed : colors.accent,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`View all ${totalCount} items in catalog`}
      >
        <View style={styles.ctaContentRow}>
          <Ionicons name="restaurant-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.ctaButtonText}>Browse All {totalCount}+ Items</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </View>
      </Pressable>

      {/* Trust & Delivery Micro Ticker */}
      <View style={styles.microTickerRow}>
        <Ionicons name="flash-outline" size={12} color="#10B981" />
        <AppText variant="micro" color="secondary" style={styles.microTickerText}>
          Fastest delivery in 20-35 mins · Real-time live tracking
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  glowStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    marginTop: 2,
  },
  avatarCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  countAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countAvatarText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
  },
  sparkleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textContent: {
    marginBottom: Spacing.sm,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subheading: {
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: Spacing.sm,
  },
  tagPill: {
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ctaButton: {
    marginTop: Spacing.xs,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  ctaContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  microTickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: 4,
  },
  microTickerText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
