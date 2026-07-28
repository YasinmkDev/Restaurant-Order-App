import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { CategoryKey } from './CategoryTabs';

interface BentoServicesGridProps {
  onSelectCategory: (category: CategoryKey) => void;
  onOpenDeals?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface BentoCardConfig {
  id: string;
  category: CategoryKey;
  title: string;
  subtitle: string;
  badge: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  bgLight: string;
  bgDark: string;
}

const BENTO_ITEMS: BentoCardConfig[] = [
  {
    id: 'food',
    category: 'food',
    title: 'Food Delivery',
    subtitle: '80+ top kitchens',
    badge: 'Popular',
    icon: 'silverware-fork-knife',
    color: '#FF6B00',
    bgLight: 'rgba(255, 107, 0, 0.08)',
    bgDark: 'rgba(255, 107, 0, 0.14)',
  },
  {
    id: 'grocery',
    category: 'grocery',
    title: 'Groceries',
    subtitle: 'Fresh in 15 min',
    badge: '⚡ Express',
    icon: 'basket-outline',
    color: '#10B981',
    bgLight: 'rgba(16, 185, 129, 0.08)',
    bgDark: 'rgba(16, 185, 129, 0.14)',
  },
  {
    id: 'package',
    category: 'package',
    title: 'Send Package',
    subtitle: 'Doorstep pickup',
    badge: 'Live OTP',
    icon: 'truck-fast-outline',
    color: '#8B5CF6',
    bgLight: 'rgba(139, 92, 246, 0.08)',
    bgDark: 'rgba(139, 92, 246, 0.14)',
  },
  {
    id: 'deals',
    category: 'all',
    title: 'Flash Offers',
    subtitle: 'Up to 40% OFF',
    badge: 'Save Big',
    icon: 'ticket-percent-outline',
    color: '#F59E0B',
    bgLight: 'rgba(245, 158, 11, 0.08)',
    bgDark: 'rgba(245, 158, 11, 0.14)',
  },
];

export function BentoServicesGrid({
  onSelectCategory,
  onOpenDeals,
}: BentoServicesGridProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {BENTO_ITEMS.map((item) => (
          <BentoTile
            key={item.id}
            item={item}
            isDark={isDark}
            colors={colors}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              if (item.id === 'deals' && onOpenDeals) {
                onOpenDeals();
              } else {
                onSelectCategory(item.category);
              }
            }}
          />
        ))}
      </View>
    </View>
  );
}

function BentoTile({
  item,
  isDark,
  colors,
  onPress,
}: {
  item: BentoCardConfig;
  isDark: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 12, stiffness: 350 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.subtitle}, ${item.badge}`}
      style={[
        styles.tile,
        {
          backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
        animatedStyle,
      ]}
    >
      {/* Top Row: Icon Circle + Badge */}
      <View style={styles.tileHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isDark ? item.bgDark : item.bgLight },
          ]}
        >
          <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
        </View>

        <View
          style={[
            styles.badgeWrap,
            { backgroundColor: isDark ? item.bgDark : item.bgLight },
          ]}
        >
          <Text style={[styles.badgeText, { color: item.color }]}>
            {item.badge}
          </Text>
        </View>
      </View>

      {/* Bottom Text Area */}
      <View style={styles.tileBottom}>
        <Text
          numberOfLines={1}
          style={[
            styles.tileTitle,
            { color: isDark ? colors.textPrimary : '#1E293B' },
          ]}
        >
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.tileSubtitle}>
          {item.subtitle}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '48.2%',
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
    minHeight: 104,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrap: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tileBottom: {
    gap: 2,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  tileSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
