import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Spacing } from '../ui/theme';
import { CategoryKey } from './CategoryTabs';

export interface CravingItem {
  id: string;
  name: string;
  category: CategoryKey;
  image: string;
}

const CRAVING_ITEMS: CravingItem[] = [
  {
    id: 'biryani',
    name: 'Biryani & Rice',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'burgers',
    name: 'Burgers & Subs',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'bakery',
    name: 'Patties & Bakes',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'pizza',
    name: 'Artisan Pizza',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'chai',
    name: 'Karak Chai',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'groceries',
    name: 'Daily Pantry',
    category: 'grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'courier',
    name: 'Fast Courier',
    category: 'package',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80',
  },
];

interface CravingsRailProps {
  onSelectCraving: (craving: CravingItem) => void;
}

export function CravingsRail({ onSelectCraving }: CravingsRailProps) {
  const { colors, isDark } = useTheme();
  const [activeCravingId, setActiveCravingId] = useState<string>('biryani');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: isDark ? colors.textPrimary : '#1E293B' }]}>
          Explore by craving
        </Text>
        <Text style={styles.sectionSubtitle}>Tap for quick cravings</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {CRAVING_ITEMS.map((item) => (
          <CravingCircle
            key={item.id}
            item={item}
            isActive={activeCravingId === item.id}
            accentColor={colors.accent}
            isDark={isDark}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setActiveCravingId(item.id);
              onSelectCraving(item);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function CravingCircle({
  item,
  isActive,
  accentColor,
  isDark,
  onPress,
}: {
  item: CravingItem;
  isActive: boolean;
  accentColor: string;
  isDark: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 10, stiffness: 350 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${item.name} craving`}
        style={styles.pressable}
      >
        {/* Circular Avatar Ring */}
        <View
          style={[
            styles.imageRing,
            {
              borderColor: isActive ? accentColor : 'transparent',
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            },
          ]}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Craving Label */}
        <Text
          numberOfLines={1}
          style={[
            styles.nameLabel,
            {
              color: isActive
                ? accentColor
                : isDark
                ? '#E2E8F0'
                : '#475569',
              fontWeight: isActive ? '700' : '600',
            },
          ]}
        >
          {item.name}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  header: {
    paddingHorizontal: Spacing.md,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  scrollList: {
    paddingHorizontal: Spacing.md,
    gap: 14,
  },
  itemContainer: {
    alignItems: 'center',
    width: 68,
  },
  pressable: {
    alignItems: 'center',
  },
  imageRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  nameLabel: {
    fontSize: 10.5,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});
