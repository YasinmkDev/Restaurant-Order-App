import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

export type ActivityCategory = 'all' | 'orders' | 'payments' | 'rewards' | 'security';

interface FilterOption {
  key: ActivityCategory;
  label: string;
  iconName?: string;
}

const CATEGORIES: FilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'orders', label: 'Deliveries' },
  { key: 'payments', label: 'Payments' },
  { key: 'rewards', label: 'Rewards & Offers' },
  { key: 'security', label: 'Security' },
];

interface ActivityFilterChipsProps {
  selectedCategory: ActivityCategory;
  onSelectCategory: (cat: ActivityCategory) => void;
  categoryCounts?: Partial<Record<ActivityCategory, number>>;
}

export function ActivityFilterChips({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}: ActivityFilterChipsProps) {
  const { colors, isDark } = useTheme();

  const handlePress = (key: ActivityCategory) => {
    if (key === selectedCategory) return;
    Haptics.selectionAsync().catch(() => {});
    onSelectCategory(key);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.key;
        const count = categoryCounts[cat.key];

        return (
          <Pressable
            key={cat.key}
            onPress={() => handlePress(cat.key)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${cat.label} filter`}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? colors.accent
                  : isDark
                  ? 'rgba(255,255,255,0.06)'
                  : '#F1F5F9',
                borderColor: isSelected
                  ? colors.accent
                  : isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <Text
              style={[
                styles.chipLabel,
                {
                  color: isSelected
                    ? '#FFFFFF'
                    : isDark
                    ? colors.textSecondary
                    : '#475569',
                  fontWeight: isSelected ? '800' : '600',
                },
              ]}
            >
              {cat.label}
            </Text>

            {typeof count === 'number' && count > 0 && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isSelected
                      ? 'rgba(255,255,255,0.25)'
                      : colors.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: isSelected ? '#FFFFFF' : '#FFFFFF',
                    },
                  ]}
                >
                  {count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    gap: 8,
    paddingBottom: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 12.5,
    letterSpacing: -0.1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
});
