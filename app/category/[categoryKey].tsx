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
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { IconButton } from '../../components/ui/IconButton';
import { FloatingCartButton } from '../../components/cart/FloatingCartButton';
import { useSafeRouter } from '../../hooks/useSafeRouter';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../components/ui/theme';
import { DEMO_PRODUCTS } from '../../data/products';
import { DEMO_STORES } from '../../data/stores';
import { getCategoryMeta } from '../../data/categories';
import { Product } from '../../types/product';
import { formatCurrency } from '../../lib/currency';
import { useCartStore } from '../../store/cart.store';

type SortOption = 'recommended' | 'rating' | 'fastest' | 'price_low' | 'price_high';
type FilterTag = 'all' | 'veg' | 'spicy' | 'popular' | 'budget';

export default function CategoryScreen() {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams<{ categoryKey: string; title?: string }>();
  const categoryKey = params.categoryKey || 'food';

  const categoryMeta = useMemo(() => getCategoryMeta(categoryKey), [categoryKey]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('recommended');
  const [activeFilter, setActiveFilter] = useState<FilterTag>('all');
  const [minRatingFilter, setMinRatingFilter] = useState(false);

  // Cart actions
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    // 1. Initial match by category or subcategory
    let list = DEMO_PRODUCTS.filter((prod) => {
      const matchCat =
        prod.subCategory === categoryKey ||
        prod.category === categoryKey ||
        (categoryKey === 'food' && prod.category === 'food') ||
        (categoryKey === 'grocery' && prod.category === 'grocery') ||
        (categoryKey === 'package' && prod.category === 'package');
      return matchCat;
    });

    // If specific craving had few items, fallback to category items
    if (list.length === 0) {
      list = DEMO_PRODUCTS.filter((prod) => prod.category === categoryMeta.deliveryType);
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((prod) => {
        const store = DEMO_STORES.find((s) => s.id === prod.storeId);
        const inName = prod.name.toLowerCase().includes(q);
        const inDesc = prod.description.toLowerCase().includes(q);
        const inStore = store ? store.name.toLowerCase().includes(q) : false;
        const inTags = prod.tags ? prod.tags.some((t) => t.toLowerCase().includes(q)) : false;
        return inName || inDesc || inStore || inTags;
      });
    }

    // 3. Dietary / Tag filter
    if (activeFilter === 'veg') {
      list = list.filter((p) => p.isVegetarian);
    } else if (activeFilter === 'spicy') {
      list = list.filter((p) => p.isSpicy);
    } else if (activeFilter === 'popular') {
      list = list.filter((p) => p.isPopular);
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
    } else if (selectedSort === 'price_low') {
      sorted.sort((a, b) => a.basePrice - b.basePrice);
    } else if (selectedSort === 'price_high') {
      sorted.sort((a, b) => b.basePrice - a.basePrice);
    } else if (selectedSort === 'fastest') {
      sorted.sort((a, b) => parseInt(a.preparationTime, 10) - parseInt(b.preparationTime, 10));
    }

    return sorted;
  }, [categoryKey, categoryMeta, searchQuery, activeFilter, minRatingFilter, selectedSort]);

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

  const activeFiltersCount =
    (activeFilter !== 'all' ? 1 : 0) +
    (minRatingFilter ? 1 : 0) +
    (selectedSort !== 'recommended' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSearchQuery('');
    setActiveFilter('all');
    setMinRatingFilter(false);
    setSelectedSort('recommended');
  };

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Fixed Floating Top Bar ── */}
      <View style={[styles.topBar, { borderBottomColor: colors.borderSubtle }]}>
        <IconButton
          icon={<Ionicons name="arrow-back" size={20} color={colors.textPrimary} />}
          onPress={() => router.back()}
          accessibilityLabel="Back to explore"
          size={42}
          variant="raised"
        />

        <View style={styles.topBarCenter}>
          <AppText variant="sectionTitle" numberOfLines={1}>
            {params.title || categoryMeta.name}
          </AppText>
          <AppText variant="micro" color="secondary">
            {filteredProducts.length} items available
          </AppText>
        </View>

        {activeFiltersCount > 0 ? (
          <Pressable
            onPress={resetAllFilters}
            style={[styles.resetPill, { borderColor: colors.accent, backgroundColor: colors.surfaceRaised }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Reset all filters"
          >
            <Ionicons name="refresh-outline" size={13} color={colors.accent} />
            <AppText variant="micro" color="accent" style={{ fontWeight: '700', marginLeft: 4 }}>
              Reset
            </AppText>
          </Pressable>
        ) : (
          <View style={{ width: 42 }} />
        )}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.headerWrapper}>
            {/* ── Hero Category Presentation Card ── */}
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: isDark ? categoryMeta.bgDark : categoryMeta.bgLight,
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              <Image
                source={{ uri: categoryMeta.heroImage }}
                style={styles.heroImage}
                contentFit="cover"
                transition={300}
              />
              <View style={styles.heroOverlay}>
                <View style={styles.badgeRow}>
                  {categoryMeta.badge && (
                    <View style={[styles.categoryBadge, { backgroundColor: categoryMeta.accent }]}>
                      <Text style={styles.categoryBadgeText}>{categoryMeta.badge}</Text>
                    </View>
                  )}
                  <View style={[styles.metaPill, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
                    <Ionicons name="flash-outline" size={12} color="#FBBF24" />
                    <Text style={styles.metaPillText}>Fast Delivery</Text>
                  </View>
                </View>

                <Text style={styles.heroTitle}>{params.title || categoryMeta.name}</Text>
                <Text style={styles.heroSubtitle}>{categoryMeta.subtitle}</Text>
              </View>
            </View>

            {/* ── Realtime Search Input ── */}
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.borderSubtle,
                },
              ]}
            >
              <Ionicons name="search-outline" size={18} color={colors.textTertiary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={`Search in ${params.title || categoryMeta.name}...`}
                placeholderTextColor={colors.textTertiary}
                style={[styles.searchInput, { color: colors.textPrimary }]}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  style={styles.clearBtn}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
                </Pressable>
              )}
            </View>

            {/* ── Quick Filter Chips ── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {/* All Items */}
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveFilter('all');
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === 'all'
                        ? colors.accent
                        : colors.surfaceRaised,
                    borderColor:
                      activeFilter === 'all' ? colors.accent : colors.borderSubtle,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color:
                        activeFilter === 'all'
                          ? '#FFFFFF'
                          : colors.textSecondary,
                      fontWeight: activeFilter === 'all' ? '700' : '500',
                    },
                  ]}
                >
                  All Items
                </Text>
              </Pressable>

              {/* Top Rated 4.8+ */}
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setMinRatingFilter((prev) => !prev);
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: minRatingFilter
                      ? isDark
                        ? '#3B2F04'
                        : '#FEF3C7'
                      : colors.surfaceRaised,
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
                      color: minRatingFilter ? '#F59E0B' : colors.textSecondary,
                      fontWeight: minRatingFilter ? '700' : '500',
                    },
                  ]}
                >
                  4.8+ Top Rated
                </Text>
              </Pressable>

              {/* Vegetarian */}
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveFilter((prev) => (prev === 'veg' ? 'all' : 'veg'));
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === 'veg'
                        ? isDark
                          ? '#064E3B'
                          : '#D1FAE5'
                        : colors.surfaceRaised,
                    borderColor:
                      activeFilter === 'veg' ? '#10B981' : colors.borderSubtle,
                  },
                ]}
              >
                <Text style={{ marginRight: 4 }}>🌱</Text>
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color:
                        activeFilter === 'veg' ? '#10B981' : colors.textSecondary,
                      fontWeight: activeFilter === 'veg' ? '700' : '500',
                    },
                  ]}
                >
                  Vegetarian
                </Text>
              </Pressable>

              {/* Spicy */}
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveFilter((prev) => (prev === 'spicy' ? 'all' : 'spicy'));
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === 'spicy'
                        ? isDark
                          ? '#4C0519'
                          : '#FFE4E6'
                        : colors.surfaceRaised,
                    borderColor:
                      activeFilter === 'spicy' ? '#E11D48' : colors.borderSubtle,
                  },
                ]}
              >
                <Text style={{ marginRight: 4 }}>🌶️</Text>
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color:
                        activeFilter === 'spicy' ? '#E11D48' : colors.textSecondary,
                      fontWeight: activeFilter === 'spicy' ? '700' : '500',
                    },
                  ]}
                >
                  Spicy
                </Text>
              </Pressable>

              {/* Popular */}
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveFilter((prev) => (prev === 'popular' ? 'all' : 'popular'));
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === 'popular'
                        ? isDark
                          ? '#312E81'
                          : '#E0E7FF'
                        : colors.surfaceRaised,
                    borderColor:
                      activeFilter === 'popular' ? '#6366F1' : colors.borderSubtle,
                  },
                ]}
              >
                <Text style={{ marginRight: 4 }}>🔥</Text>
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color:
                        activeFilter === 'popular' ? '#6366F1' : colors.textSecondary,
                      fontWeight: activeFilter === 'popular' ? '700' : '500',
                    },
                  ]}
                >
                  Popular
                </Text>
              </Pressable>

              {/* Budget Under Rs. 600 */}
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setActiveFilter((prev) => (prev === 'budget' ? 'all' : 'budget'));
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === 'budget'
                        ? isDark
                          ? '#374151'
                          : '#E5E7EB'
                        : colors.surfaceRaised,
                    borderColor:
                      activeFilter === 'budget' ? colors.accent : colors.borderSubtle,
                  },
                ]}
              >
                <Text style={{ marginRight: 4 }}>💰</Text>
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color:
                        activeFilter === 'budget' ? colors.accent : colors.textSecondary,
                      fontWeight: activeFilter === 'budget' ? '700' : '500',
                    },
                  ]}
                >
                  Under Rs. 600
                </Text>
              </Pressable>
            </ScrollView>

            {/* ── Sort By Row ── */}
            <View style={styles.sortSection}>
              <View style={styles.sortHeaderRow}>
                <Ionicons name="swap-vertical-outline" size={14} color={colors.textTertiary} />
                <AppText variant="caption" color="secondary" style={{ marginLeft: 4 }}>
                  Sort by:
                </AppText>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sortPillsScroll}
              >
                {(
                  [
                    { key: 'recommended', label: 'Recommended' },
                    { key: 'rating', label: 'Top Rated' },
                    { key: 'fastest', label: 'Fastest ETA' },
                    { key: 'price_low', label: 'Price: Low to High' },
                    { key: 'price_high', label: 'Price: High to Low' },
                  ] as { key: SortOption; label: string }[]
                ).map((sort) => {
                  const isSelected = selectedSort === sort.key;
                  return (
                    <Pressable
                      key={sort.key}
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        setSelectedSort(sort.key);
                      }}
                      style={[
                        styles.sortPill,
                        {
                          backgroundColor: isSelected
                            ? colors.accent
                            : isDark
                            ? 'rgba(255,255,255,0.05)'
                            : '#F1F5F9',
                          borderColor: isSelected ? colors.accent : colors.borderSubtle,
                        },
                      ]}
                    >
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

          return (
            <Pressable
              onPress={() => handleOpenProduct(item)}
              style={({ pressed }) => [
                styles.productCard,
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
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                contentFit="cover"
                transition={200}
              />

              <View style={styles.productContent}>
                {/* Meta header */}
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.ratingPill, { backgroundColor: isDark ? '#3B2F04' : '#FEF3C7' }]}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  </View>

                  <View style={styles.prepTimeRow}>
                    <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                    <AppText variant="micro" color="secondary" style={{ marginLeft: 3 }}>
                      {item.preparationTime}
                    </AppText>
                  </View>
                </View>

                {/* Title & Store */}
                <AppText variant="bodyMedium" numberOfLines={1} style={styles.productTitle}>
                  {item.name}
                </AppText>

                {store && (
                  <AppText variant="micro" color="secondary" numberOfLines={1} style={{ marginBottom: 4 }}>
                    {store.name}
                  </AppText>
                )}

                <AppText variant="caption" color="secondary" numberOfLines={2} style={styles.productDesc}>
                  {item.description}
                </AppText>

                {/* Price & Action Row */}
                <View style={styles.priceRow}>
                  <AppText variant="bodyBold" color="primary">
                    {formatCurrency(item.basePrice)}
                  </AppText>

                  {quantityInCart > 0 && cartItem ? (
                    <View style={[styles.quantityControl, { borderColor: colors.accent, backgroundColor: colors.surface }]}>
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
                      <Text style={[styles.qtyText, { color: colors.textPrimary }]}>
                        {quantityInCart}
                      </Text>
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
                        styles.addBtn,
                        {
                          backgroundColor: pressed ? colors.accentPressed : colors.accent,
                        },
                      ]}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${item.name} to cart`}
                    >
                      <Ionicons name="add" size={16} color="#FFFFFF" />
                      <Text style={styles.addBtnText}>Add</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}>
              <Ionicons name="search-outline" size={36} color={colors.textTertiary} />
            </View>
            <AppText variant="bodyMedium" style={{ fontWeight: '700', marginBottom: Spacing.xs }}>
              No items found
            </AppText>
            <AppText
              variant="caption"
              color="secondary"
              style={{ textAlign: 'center', maxWidth: 280, marginBottom: Spacing.lg }}
            >
              {searchQuery
                ? `No results match "${searchQuery}". Try searching for something else or reset your filters.`
                : 'No items match the selected filters. Try broadening your filter criteria.'}
            </AppText>
            <Pressable
              onPress={resetAllFilters}
              style={[styles.resetEmptyBtn, { backgroundColor: colors.accent }]}
            >
              <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.resetEmptyBtnText}>Clear all filters</Text>
            </Pressable>
          </View>
        }
      />

      {/* Floating cart shortcut */}
      <FloatingCartButton bottomOffset={24} onPress={() => router.navigate('/checkout' as any)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  resetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  listContainer: {
    paddingBottom: 110,
  },
  headerWrapper: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  heroCard: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    position: 'relative',
    height: 160,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.85,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.48)',
    padding: Spacing.md,
    justifyContent: 'flex-end',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  metaPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 14,
  },
  clearBtn: {
    padding: 4,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  sortSection: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  sortHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sortPillsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  sortPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  sortPillText: {
    fontSize: 11,
  },
  productCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  productImage: {
    width: 110,
    height: '100%',
    minHeight: 120,
  },
  productContent: {
    flex: 1,
    padding: Spacing.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    gap: 3,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  prepTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productTitle: {
    fontWeight: '700',
    marginBottom: 2,
  },
  productDesc: {
    marginBottom: Spacing.sm,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    gap: 2,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 6,
  },
  qtyBtn: {
    padding: 2,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  resetEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  resetEmptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
