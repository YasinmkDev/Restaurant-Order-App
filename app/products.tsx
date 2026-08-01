import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../components/ui/Screen';
import { AppText } from '../components/ui/AppText';
import { IconButton } from '../components/ui/IconButton';
import { FloatingCartButton } from '../components/cart/FloatingCartButton';
import { useSafeRouter } from '../hooks/useSafeRouter';
import { useTheme } from '../hooks/useTheme';
import { Radius, Spacing } from '../components/ui/theme';
import { DEMO_PRODUCTS } from '../data/products';
import { DEMO_STORES } from '../data/stores';
import { Product } from '../types/product';
import { formatCurrency } from '../lib/currency';
import { useCartStore } from '../store/cart.store';

type ViewMode = 'grid' | 'list';
type SortOption = 'recommended' | 'rating' | 'fastest' | 'price_low' | 'price_high';
type FilterTag = 'all' | 'veg' | 'spicy' | 'quick' | 'budget';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Items', icon: 'apps-outline' },
  { id: 'biryani', label: 'Biryani & Rice', icon: 'restaurant-outline' },
  { id: 'burgers', label: 'Burgers', icon: 'fast-food-outline' },
  { id: 'pizza', label: 'Pizza', icon: 'pizza-outline' },
  { id: 'bakery', label: 'Bakery', icon: 'cafe-outline' },
  { id: 'chai', label: 'Karak Chai', icon: 'flame-outline' },
  { id: 'groceries', label: 'Groceries', icon: 'cart-outline' },
  { id: 'courier', label: 'Courier', icon: 'bicycle-outline' },
];

const SORT_OPTIONS: { id: SortOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'recommended', label: 'Recommended', icon: 'sparkles-outline' },
  { id: 'rating', label: 'Top Rated', icon: 'star-outline' },
  { id: 'fastest', label: 'Fastest ETA', icon: 'flash-outline' },
  { id: 'price_low', label: 'Price: Low-High', icon: 'arrow-up-outline' },
  { id: 'price_high', label: 'Price: High-Low', icon: 'arrow-down-outline' },
];

export default function AllProductsScreen() {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [activeFilter, setActiveFilter] = useState<FilterTag>('all');
  const [minRatingFilter, setMinRatingFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('recommended');

  // Cart Store
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: DEMO_PRODUCTS.length };
    DEMO_PRODUCTS.forEach((p) => {
      const key = p.subCategory || p.category;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...DEMO_PRODUCTS];

    // 1. Category Tab Filter
    if (selectedCategoryTab !== 'all') {
      list = list.filter((p) => {
        return (
          p.subCategory === selectedCategoryTab ||
          p.category === selectedCategoryTab ||
          (selectedCategoryTab === 'groceries' && p.category === 'grocery') ||
          (selectedCategoryTab === 'courier' && p.category === 'package')
        );
      });
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const store = DEMO_STORES.find((s) => s.id === p.storeId);
        const inName = p.name.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inStore = store ? store.name.toLowerCase().includes(q) : false;
        const inTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q)) : false;
        return inName || inDesc || inStore || inTags;
      });
    }

    // 3. Quick Tag Filter
    if (activeFilter === 'veg') {
      list = list.filter((p) => p.isVegetarian || p.tags?.includes('Vegetarian'));
    } else if (activeFilter === 'spicy') {
      list = list.filter((p) => p.isSpicy || p.tags?.includes('Spicy'));
    } else if (activeFilter === 'quick') {
      list = list.filter((p) => {
        const mins = parseInt(p.preparationTime, 10);
        return !isNaN(mins) && mins <= 25;
      });
    } else if (activeFilter === 'budget') {
      list = list.filter((p) => p.basePrice <= 600);
    }

    // 4. Rating filter
    if (minRatingFilter) {
      list = list.filter((p) => p.rating >= 4.8);
    }

    // 5. Sorting
    const sorted = [...list];
    if (selectedSort === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'fastest') {
      sorted.sort((a, b) => {
        const timeA = parseInt(a.preparationTime, 10) || 30;
        const timeB = parseInt(b.preparationTime, 10) || 30;
        return timeA - timeB;
      });
    } else if (selectedSort === 'price_low') {
      sorted.sort((a, b) => a.basePrice - b.basePrice);
    } else if (selectedSort === 'price_high') {
      sorted.sort((a, b) => b.basePrice - a.basePrice);
    }

    return sorted;
  }, [selectedCategoryTab, searchQuery, activeFilter, minRatingFilter, selectedSort]);

  const handleToggleViewMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  const handleOpenProduct = (product: Product) => {
    Haptics.selectionAsync().catch(() => {});
    router.navigate(`/product/${product.id}` as any);
  };

  const handleQuickAdd = (product: Product) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    addItem({
      cartItemId: `${product.id}-${Date.now()}`,
      productId: product.id,
      storeId: product.storeId,
      title: product.name,
      quantity: 1,
      basePrice: product.basePrice,
      selectedAddOns: [],
      image: product.image,
    });
  };

  const resetAllFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSearchQuery('');
    setSelectedCategoryTab('all');
    setActiveFilter('all');
    setMinRatingFilter(false);
    setSelectedSort('recommended');
  };

  const activeFiltersCount =
    (selectedCategoryTab !== 'all' ? 1 : 0) +
    (activeFilter !== 'all' ? 1 : 0) +
    (minRatingFilter ? 1 : 0) +
    (selectedSort !== 'recommended' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Top Header ── */}
      <View style={[styles.topHeader, { borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.topHeaderLeft}>
          <IconButton
            icon={<Ionicons name="arrow-back" size={20} color={colors.textPrimary} />}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            size={40}
          />
          <View style={styles.titleColumn}>
            <View style={styles.titleRow}>
              <AppText variant="title" style={styles.mainTitle}>
                All Products
              </AppText>
              <View style={[styles.countBadge, { backgroundColor: isDark ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255, 107, 0, 0.12)' }]}>
                <Text style={[styles.countBadgeText, { color: colors.accent }]}>
                  {filteredProducts.length}
                </Text>
              </View>
            </View>
            <AppText variant="micro" color="secondary">
              Master catalog across all categories
            </AppText>
          </View>
        </View>

        {/* View mode toggle button */}
        <Pressable
          onPress={handleToggleViewMode}
          style={({ pressed }) => [
            styles.viewModeButton,
            {
              backgroundColor: isDark ? colors.surfaceRaised : '#F3F4F6',
              borderColor: colors.borderSubtle,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
        >
          <Ionicons
            name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
            size={18}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      {/* ── Main List with Header controls ── */}
      <FlatList
        key={viewMode === 'grid' ? 'grid-mode' : 'list-mode'}
        data={filteredProducts}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={(item) => `all-prod-${item.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          viewMode === 'grid' ? styles.gridContent : styles.listContentPadding,
        ]}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridColumnWrapper : undefined}
        ListHeaderComponent={
          <View style={styles.headerControlsWrapper}>
            {/* Search Omnibar */}
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: searchQuery ? colors.accent : colors.borderSubtle,
                },
              ]}
            >
              <Ionicons name="search-outline" size={18} color={colors.textTertiary} style={styles.searchIcon} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search all items, tags, ingredients..."
                placeholderTextColor={colors.textTertiary}
                style={[styles.searchInput, { color: colors.textPrimary }]}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearchBtn}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
                </Pressable>
              )}
            </View>

            {/* Horizontal Category Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryTabsScroll}
            >
              {CATEGORY_TABS.map((tab) => {
                const isSelected = selectedCategoryTab === tab.id;
                const count = categoryCounts[tab.id] ?? 0;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => {});
                      setSelectedCategoryTab(tab.id);
                    }}
                    style={[
                      styles.categoryTabPill,
                      {
                        backgroundColor: isSelected
                          ? colors.accent
                          : isDark
                          ? colors.surfaceRaised
                          : '#FFFFFF',
                        borderColor: isSelected ? colors.accent : colors.borderSubtle,
                      },
                    ]}
                  >
                    <Ionicons
                      name={tab.icon as any}
                      size={14}
                      color={isSelected ? '#FFFFFF' : colors.textSecondary}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={[
                        styles.categoryTabText,
                        {
                          color: isSelected ? '#FFFFFF' : colors.textPrimary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                    <View
                      style={[
                        styles.tabCountPill,
                        {
                          backgroundColor: isSelected
                            ? 'rgba(255,255,255,0.25)'
                            : isDark
                            ? 'rgba(255,255,255,0.08)'
                            : 'rgba(0,0,0,0.05)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabCountText,
                          { color: isSelected ? '#FFFFFF' : colors.textTertiary },
                        ]}
                      >
                        {count}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Quick Filter Attributes */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterPillsScroll}
            >
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveFilter(activeFilter === 'veg' ? 'all' : 'veg');
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === 'veg'
                        ? isDark
                          ? '#064E3B'
                          : '#DCFCE7'
                        : isDark
                        ? colors.surfaceRaised
                        : '#FFFFFF',
                    borderColor: activeFilter === 'veg' ? '#10B981' : colors.borderSubtle,
                  },
                ]}
              >
                <Text style={{ fontSize: 13, marginRight: 4 }}>🌱</Text>
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: activeFilter === 'veg' ? '#059669' : colors.textSecondary,
                      fontWeight: activeFilter === 'veg' ? '700' : '500',
                    },
                  ]}
                >
                  Vegetarian
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveFilter(activeFilter === 'spicy' ? 'all' : 'spicy');
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === 'spicy'
                        ? isDark
                          ? '#450A0A'
                          : '#FEE2E2'
                        : isDark
                        ? colors.surfaceRaised
                        : '#FFFFFF',
                    borderColor: activeFilter === 'spicy' ? '#EF4444' : colors.borderSubtle,
                  },
                ]}
              >
                <Text style={{ fontSize: 13, marginRight: 4 }}>🌶️</Text>
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: activeFilter === 'spicy' ? '#DC2626' : colors.textSecondary,
                      fontWeight: activeFilter === 'spicy' ? '700' : '500',
                    },
                  ]}
                >
                  Spicy
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setMinRatingFilter(!minRatingFilter);
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: minRatingFilter
                      ? isDark
                        ? '#3B2F04'
                        : '#FEF3C7'
                      : isDark
                      ? colors.surfaceRaised
                      : '#FFFFFF',
                    borderColor: minRatingFilter ? '#F59E0B' : colors.borderSubtle,
                  },
                ]}
              >
                <Ionicons
                  name="star"
                  size={13}
                  color={minRatingFilter ? '#F59E0B' : colors.textTertiary}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: minRatingFilter ? '#D97706' : colors.textSecondary,
                      fontWeight: minRatingFilter ? '700' : '500',
                    },
                  ]}
                >
                  4.8+ Rated
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveFilter(activeFilter === 'quick' ? 'all' : 'quick');
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === 'quick'
                        ? isDark
                          ? '#1E1B4B'
                          : '#E0E7FF'
                        : isDark
                        ? colors.surfaceRaised
                        : '#FFFFFF',
                    borderColor: activeFilter === 'quick' ? '#6366F1' : colors.borderSubtle,
                  },
                ]}
              >
                <Ionicons
                  name="flash"
                  size={13}
                  color={activeFilter === 'quick' ? '#6366F1' : colors.textTertiary}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: activeFilter === 'quick' ? '#4F46E5' : colors.textSecondary,
                      fontWeight: activeFilter === 'quick' ? '700' : '500',
                    },
                  ]}
                >
                  Under 25 mins
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveFilter(activeFilter === 'budget' ? 'all' : 'budget');
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === 'budget'
                        ? isDark
                          ? 'rgba(255, 107, 0, 0.16)'
                          : 'rgba(255, 107, 0, 0.10)'
                        : isDark
                        ? colors.surfaceRaised
                        : '#FFFFFF',
                    borderColor: activeFilter === 'budget' ? colors.accent : colors.borderSubtle,
                  },
                ]}
              >
                <Text style={{ fontSize: 13, marginRight: 4 }}>💰</Text>
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: activeFilter === 'budget' ? colors.accent : colors.textSecondary,
                      fontWeight: activeFilter === 'budget' ? '700' : '500',
                    },
                  ]}
                >
                  Under Rs. 600
                </Text>
              </Pressable>
            </ScrollView>

            {/* Sort Selector Bar */}
            <View style={styles.sortBarRow}>
              <View style={styles.sortHeader}>
                <Ionicons name="swap-vertical" size={14} color={colors.textSecondary} />
                <AppText variant="caption" color="secondary" style={{ marginLeft: 4, fontWeight: '600' }}>
                  Sort by:
                </AppText>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
                {SORT_OPTIONS.map((sort) => {
                  const isSelected = selectedSort === sort.id;
                  return (
                    <Pressable
                      key={sort.id}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        setSelectedSort(sort.id);
                      }}
                      style={[
                        styles.sortPill,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? colors.surfaceRaised
                              : '#1F2937'
                            : 'transparent',
                          borderColor: isSelected
                            ? isDark
                              ? colors.borderSubtle
                              : '#1F2937'
                            : colors.borderSubtle,
                        },
                      ]}
                    >
                      <Ionicons
                        name={sort.icon}
                        size={12}
                        color={isSelected ? '#FFFFFF' : colors.textSecondary}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.sortPillText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {sort.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const store = DEMO_STORES.find((s) => s.id === item.storeId);
          const cartItem = cartItems.find((ci) => ci.productId === item.id);
          const quantityInCart = cartItem ? cartItem.quantity : 0;

          // Render Grid Card
          if (viewMode === 'grid') {
            return (
              <Pressable
                onPress={() => handleOpenProduct(item)}
                style={({ pressed }) => [
                  styles.gridCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.borderSubtle,
                    opacity: pressed ? 0.93 : 1,
                  },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${item.name}, ${formatCurrency(item.basePrice)}`}
              >
                <View style={styles.gridImageWrapper}>
                  <Image source={{ uri: item.image }} style={styles.gridImage} contentFit="cover" transition={200} />
                  {/* Rating Badge */}
                  <View style={[styles.gridRatingBadge, { backgroundColor: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.92)' }]}>
                    <Ionicons name="star" size={10} color="#F59E0B" />
                    <Text style={[styles.gridRatingText, { color: colors.textPrimary }]}>
                      {item.rating.toFixed(1)}
                    </Text>
                  </View>

                  {/* Dietary Badge */}
                  {item.isVegetarian && (
                    <View style={styles.vegBadge}>
                      <Text style={styles.vegBadgeText}>🌱</Text>
                    </View>
                  )}
                  {item.isSpicy && !item.isVegetarian && (
                    <View style={styles.spicyBadge}>
                      <Text style={styles.spicyBadgeText}>🌶️</Text>
                    </View>
                  )}
                </View>

                <View style={styles.gridContentWrapper}>
                  <Text numberOfLines={1} style={[styles.gridTitle, { color: colors.textPrimary }]}>
                    {item.name}
                  </Text>

                  <View style={styles.gridMetaRow}>
                    <Ionicons name="time-outline" size={11} color={colors.textTertiary} />
                    <Text style={[styles.gridPrepTime, { color: colors.textSecondary }]}>
                      {item.preparationTime}
                    </Text>
                  </View>

                  <View style={styles.gridPriceActionRow}>
                    <Text style={[styles.gridPriceText, { color: colors.textPrimary }]}>
                      {formatCurrency(item.basePrice)}
                    </Text>

                    {quantityInCart > 0 && cartItem ? (
                      <View style={[styles.gridQtyStepper, { borderColor: colors.accent, backgroundColor: colors.surface }]}>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                            updateQuantity(cartItem.cartItemId, quantityInCart - 1);
                          }}
                          hitSlop={6}
                          style={styles.gridQtyBtn}
                        >
                          <Ionicons name="remove" size={12} color={colors.accent} />
                        </Pressable>
                        <Text style={[styles.gridQtyNumber, { color: colors.textPrimary }]}>
                          {quantityInCart}
                        </Text>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                            updateQuantity(cartItem.cartItemId, quantityInCart + 1);
                          }}
                          hitSlop={6}
                          style={styles.gridQtyBtn}
                        >
                          <Ionicons name="add" size={12} color={colors.accent} />
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(item);
                        }}
                        style={({ pressed }) => [
                          styles.gridAddBtn,
                          {
                            backgroundColor: pressed ? colors.accentPressed : colors.accent,
                          },
                        ]}
                        hitSlop={4}
                      >
                        <Ionicons name="add" size={14} color="#FFFFFF" />
                        <Text style={styles.gridAddText}>Add</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          }

          // Render List Card
          return (
            <Pressable
              onPress={() => handleOpenProduct(item)}
              style={({ pressed }) => [
                styles.listCard,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.borderSubtle,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, ${formatCurrency(item.basePrice)}`}
            >
              <Image source={{ uri: item.image }} style={styles.listImage} contentFit="cover" transition={200} />

              <View style={styles.listCardContent}>
                <View style={styles.listMetaRow}>
                  <View style={[styles.ratingPill, { backgroundColor: isDark ? '#3B2F04' : '#FEF3C7' }]}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  </View>
                  <View style={styles.prepRow}>
                    <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                    <Text style={[styles.prepText, { color: colors.textSecondary }]}>
                      {item.preparationTime}
                    </Text>
                  </View>
                </View>

                <Text numberOfLines={1} style={[styles.listTitle, { color: colors.textPrimary }]}>
                  {item.name}
                </Text>

                {store && (
                  <Text numberOfLines={1} style={[styles.listStoreName, { color: colors.textSecondary }]}>
                    {store.name}
                  </Text>
                )}

                <Text numberOfLines={2} style={[styles.listDesc, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>

                <View style={styles.listBottomRow}>
                  <Text style={[styles.listPrice, { color: colors.textPrimary }]}>
                    {formatCurrency(item.basePrice)}
                  </Text>

                  {quantityInCart > 0 && cartItem ? (
                    <View style={[styles.listQtyStepper, { borderColor: colors.accent, backgroundColor: colors.surface }]}>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          updateQuantity(cartItem.cartItemId, quantityInCart - 1);
                        }}
                        style={styles.qtyBtn}
                        hitSlop={8}
                      >
                        <Ionicons name="remove" size={14} color={colors.accent} />
                      </Pressable>
                      <Text style={[styles.qtyText, { color: colors.textPrimary }]}>{quantityInCart}</Text>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          updateQuantity(cartItem.cartItemId, quantityInCart + 1);
                        }}
                        style={styles.qtyBtn}
                        hitSlop={8}
                      >
                        <Ionicons name="add" size={14} color={colors.accent} />
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(item);
                      }}
                      style={({ pressed }) => [
                        styles.listAddBtn,
                        {
                          backgroundColor: pressed ? colors.accentPressed : colors.accent,
                        },
                      ]}
                      hitSlop={4}
                    >
                      <Ionicons name="add" size={16} color="#FFFFFF" />
                      <Text style={styles.listAddText}>Add</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconCircle,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                },
              ]}
            >
              <Ionicons name="search-outline" size={42} color={colors.textTertiary} />
            </View>
            <AppText variant="title" style={styles.emptyTitle}>
              No items found
            </AppText>
            <AppText variant="caption" color="secondary" style={styles.emptyDesc}>
              We couldn't find any dishes or grocery items matching your current search or filter combination.
            </AppText>

            {activeFiltersCount > 0 && (
              <Pressable
                onPress={resetAllFilters}
                style={[styles.resetBtn, { backgroundColor: colors.accent }]}
              >
                <Ionicons name="refresh-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.resetBtnText}>Reset All Filters</Text>
              </Pressable>
            )}
          </View>
        }
      />

      {/* Floating Cart Button */}
      <FloatingCartButton onPress={() => router.navigate('/checkout' as any)} />
    </Screen>
  );
}

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - Spacing.md * 2 - Spacing.sm) / 2;

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleColumn: {
    marginLeft: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  viewModeButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  listContent: {
    paddingBottom: 90,
  },
  gridContent: {
    paddingHorizontal: Spacing.md,
  },
  listContentPadding: {
    paddingHorizontal: Spacing.md,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  headerControlsWrapper: {
    paddingTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.sm,
    height: 44,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  clearSearchBtn: {
    padding: 4,
  },
  categoryTabsScroll: {
    gap: 8,
    paddingBottom: Spacing.xs,
  },
  categoryTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  categoryTabText: {
    fontSize: 13,
  },
  tabCountPill: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: '700',
  },
  filterPillsScroll: {
    gap: 8,
    paddingVertical: Spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  sortBarRow: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  sortScroll: {
    gap: 6,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  sortPillText: {
    fontSize: 11,
  },

  // ── Grid Card Styles ──
  gridCard: {
    width: GRID_ITEM_WIDTH,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gridImageWrapper: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridRatingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    gap: 3,
  },
  gridRatingText: {
    fontSize: 10,
    fontWeight: '700',
  },
  vegBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  vegBadgeText: {
    fontSize: 10,
  },
  spicyBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  spicyBadgeText: {
    fontSize: 10,
  },
  gridContentWrapper: {
    padding: Spacing.sm,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  gridMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 6,
  },
  gridPrepTime: {
    fontSize: 10,
    fontWeight: '500',
  },
  gridPriceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridPriceText: {
    fontSize: 13,
    fontWeight: '800',
  },
  gridAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: Radius.full,
    gap: 2,
  },
  gridAddText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  gridQtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  gridQtyBtn: {
    padding: 3,
  },
  gridQtyNumber: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 4,
  },

  // ── List Card Styles ──
  listCard: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: Radius.md,
  },
  listCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  prepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  prepText: {
    fontSize: 11,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  listStoreName: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  listDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 4,
  },
  listBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  listPrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  listAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    gap: 2,
  },
  listAddText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listQtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  qtyBtn: {
    padding: 3,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 6,
  },

  // ── Empty State ──
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyDesc: {
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
