import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
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
import { formatCurrency } from '../lib/currency';
import { useCartStore } from '../store/cart.store';
import { Product } from '../types/product';
import { Store } from '../types/store';

type TabType = 'dishes' | 'stores';

export default function FavoritesScreen() {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<TabType>('dishes');

  // Initial favorites data
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([
    'prod-savour-pulao',
    'prod-zinger-supreme',
    'prod-fajita-sicilian',
    'prod-chicken-patties',
    'prod-karak-doodh-patti',
  ]);

  const [favoriteStoreIds, setFavoriteStoreIds] = useState<string[]>([
    'store-savour-1',
    'store-howdy-1',
    'store-cheezious-1',
    'store-tfc-1',
  ]);

  const addItem = useCartStore((s) => s.addItem);

  const favoriteProducts = DEMO_PRODUCTS.filter((p) => favoriteProductIds.includes(p.id));
  const favoriteStores = DEMO_STORES.filter((s) => favoriteStoreIds.includes(s.id));

  const handleToggleProductFav = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setFavoriteProductIds((prev) => prev.filter((pId) => pId !== id));
  };

  const handleToggleStoreFav = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setFavoriteStoreIds((prev) => prev.filter((sId) => sId !== id));
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

  const handleOpenProduct = (product: Product) => {
    Haptics.selectionAsync().catch(() => {});
    router.navigate(`/product/${product.id}` as any);
  };

  const handleOpenStore = (store: Store) => {
    Haptics.selectionAsync().catch(() => {});
    const prod = DEMO_PRODUCTS.find((p) => p.storeId === store.id) || DEMO_PRODUCTS[0];
    router.navigate(`/product/${prod.id}` as any);
  };

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.topHeader, { borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerLeft}>
          <IconButton
            icon={<Ionicons name="arrow-back" size={20} color={colors.textPrimary} />}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            size={40}
          />
          <View style={styles.headerTitleCol}>
            <AppText variant="title" style={styles.headerTitle}>
              Saved Favorites
            </AppText>
            <AppText variant="micro" color="secondary">
              Instant reordering for your go-to meals & spots
            </AppText>
          </View>
        </View>
      </View>

      {/* Segmented Tab Switcher */}
      <View style={[styles.tabBar, { borderBottomColor: colors.borderSubtle }]}>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setActiveTab('dishes');
          }}
          style={[
            styles.tabItem,
            activeTab === 'dishes' && [
              styles.tabItemActive,
              { borderBottomColor: colors.accent },
            ],
          ]}
        >
          <Ionicons
            name="fast-food-outline"
            size={16}
            color={activeTab === 'dishes' ? colors.accent : colors.textTertiary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'dishes' ? colors.accent : colors.textSecondary,
                fontWeight: activeTab === 'dishes' ? '800' : '600',
              },
            ]}
          >
            Favorite Dishes ({favoriteProducts.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setActiveTab('stores');
          }}
          style={[
            styles.tabItem,
            activeTab === 'stores' && [
              styles.tabItemActive,
              { borderBottomColor: colors.accent },
            ],
          ]}
        >
          <Ionicons
            name="storefront-outline"
            size={16}
            color={activeTab === 'stores' ? colors.accent : colors.textTertiary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'stores' ? colors.accent : colors.textSecondary,
                fontWeight: activeTab === 'stores' ? '800' : '600',
              },
            ]}
          >
            Restaurants ({favoriteStores.length})
          </Text>
        </Pressable>
      </View>

      {/* Content List */}
      {activeTab === 'dishes' ? (
        <FlatList
          data={favoriteProducts}
          keyExtractor={(item) => `fav-prod-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const store = DEMO_STORES.find((s) => s.id === item.storeId);
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
              >
                <Image source={{ uri: item.image }} style={styles.productImage} contentFit="cover" />

                <View style={styles.productInfo}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    </View>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleProductFav(item.id);
                      }}
                      hitSlop={8}
                    >
                      <Ionicons name="heart" size={19} color="#EF4444" />
                    </Pressable>
                  </View>

                  <Text numberOfLines={1} style={[styles.productTitle, { color: colors.textPrimary }]}>
                    {item.name}
                  </Text>

                  {store && (
                    <Text numberOfLines={1} style={[styles.storeSubtitle, { color: colors.textSecondary }]}>
                      {store.name} · {item.preparationTime}
                    </Text>
                  )}

                  <View style={styles.priceRow}>
                    <Text style={[styles.priceText, { color: colors.textPrimary }]}>
                      {formatCurrency(item.basePrice)}
                    </Text>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(item);
                      }}
                      style={[styles.reorderBtn, { backgroundColor: colors.accent }]}
                    >
                      <Ionicons name="add" size={14} color="#FFFFFF" />
                      <Text style={styles.reorderBtnText}>Reorder</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-dislike-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No favorite dishes yet
              </Text>
              <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                Tap the heart on any menu item across the app to bookmark your top cravings here.
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={favoriteStores}
          keyExtractor={(item) => `fav-store-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleOpenStore(item)}
              style={({ pressed }) => [
                styles.storeCard,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.borderSubtle,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.storeImage} contentFit="cover" />

              <View style={styles.storeContent}>
                <View style={styles.cardHeaderRow}>
                  <Text numberOfLines={1} style={[styles.storeTitle, { color: colors.textPrimary }]}>
                    {item.name}
                  </Text>

                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleToggleStoreFav(item.id);
                    }}
                    hitSlop={8}
                  >
                    <Ionicons name="heart" size={19} color="#EF4444" />
                  </Pressable>
                </View>

                <Text style={[styles.cuisineText, { color: colors.textSecondary }]}>
                  {item.address}
                </Text>

                <View style={styles.storeMetaRow}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  </View>
                  <Text style={[styles.etaText, { color: colors.textSecondary }]}>
                    ⚡ {item.deliveryTime}
                  </Text>
                  <Text style={[styles.deliveryFeeText, { color: '#10B981' }]}>
                    {formatCurrency(item.deliveryFee)} Delivery
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No favorite restaurants yet
              </Text>
              <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                Bookmark your preferred restaurants for quick access and priority table dispatches.
              </Text>
            </View>
          }
        />
      )}

      {/* Floating cart shortcut */}
      <FloatingCartButton bottomOffset={24} onPress={() => router.navigate('/checkout' as any)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitleCol: {
    marginLeft: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 13,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 90,
    gap: Spacing.md,
  },
  productCard: {
    flexDirection: 'row',
    borderRadius: Radius.xl,
    padding: Spacing.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  productImage: {
    width: 95,
    height: 95,
    borderRadius: Radius.lg,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  storeSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    gap: 3,
  },
  reorderBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  storeCard: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
  },
  storeImage: {
    width: '100%',
    height: 120,
  },
  storeContent: {
    padding: Spacing.md,
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  cuisineText: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 6,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deliveryFeeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
});
