import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeRouter } from '../../hooks/useSafeRouter';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { IconButton } from '../../components/ui/IconButton';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { CategoryKey } from '../../components/explore/CategoryTabs';
import { ExploreSkeleton } from '../../components/explore/ExploreSkeleton';
import { HomeTopHeader } from '../../components/explore/HomeTopHeader';
import { StoreCard } from '../../components/explore/StoreCard';
import { ProductCard } from '../../components/explore/ProductCard';
import { HeroFeaturedCarousel } from '../../components/explore/HeroFeaturedCarousel';
import { LiveOrderBanner } from '../../components/explore/LiveOrderBanner';
import { BentoServicesGrid } from '../../components/explore/BentoServicesGrid';
import { CravingsRail, CravingItem } from '../../components/explore/CravingsRail';
import { FlashDealBanner } from '../../components/explore/FlashDealBanner';
import { ViewAllProductsCard } from '../../components/explore/ViewAllProductsCard';
import { FloatingCartButton } from '../../components/cart/FloatingCartButton';
import { useTheme } from '../../hooks/useTheme';
import { Spacing } from '../../components/ui/theme';
import { useOrderStore } from '../../store/order.store';
import { DEMO_STORES } from '../../data/stores';
import { DEMO_PRODUCTS } from '../../data/products';
import { Store } from '../../types/store';
import { Product } from '../../types/product';

export default function ExploreScreen() {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();
  const selectedAddress = useOrderStore((s) => s.selectedAddress);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredStores = useMemo(() => {
    if (selectedCategory === 'all') return DEMO_STORES;
    return DEMO_STORES.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const featuredStore = filteredStores[0];
  const nearbyStores = filteredStores.slice(1);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return DEMO_PRODUCTS;
    return DEMO_PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const HOME_RECOMMENDED_LIMIT = 4;
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, HOME_RECOMMENDED_LIMIT);
  }, [filteredProducts]);

  const featuredCarouselItems = useMemo(() => {
    const pool =
      selectedCategory === 'all'
        ? DEMO_PRODUCTS
        : DEMO_PRODUCTS.filter((p) => p.category === selectedCategory);

    const tags = ['Chef Special', 'Bestseller', 'Trending Now', 'Top Rated', 'Hot Deal'];

    return pool.slice(0, 5).map((product, idx) => ({
      product,
      store: DEMO_STORES.find((s) => s.id === product.storeId),
      badgeTag: tags[idx % tags.length],
    }));
  }, [selectedCategory]);

  const handleOpenStore = (store: Store) => {
    const matchingProd =
      DEMO_PRODUCTS.find((p) => p.storeId === store.id) || DEMO_PRODUCTS[0];
    router.navigate(`/product/${matchingProd.id}` as any);
  };

  const handleOpenProduct = (product: Product) => {
    router.navigate(`/product/${product.id}` as any);
  };

  const handleOpenAllProducts = useCallback(() => {
    router.navigate('/products' as any);
  }, [router]);

  const handleSelectCraving = (craving: CravingItem) => {
    router.navigate({
      pathname: '/category/[categoryKey]',
      params: { categoryKey: craving.id, title: craving.name },
    } as any);
  };

  const handleSelectBentoCategory = (category: CategoryKey) => {
    const title =
      category === 'food'
        ? 'Food Delivery'
        : category === 'grocery'
        ? 'Daily Groceries'
        : category === 'package'
        ? 'Package Courier'
        : 'Flash Offers';
    router.navigate({
      pathname: '/category/[categoryKey]',
      params: { categoryKey: category, title },
    } as any);
  };

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Content */}
      {isLoading ? (
        <ExploreSkeleton />
      ) : (
        <View style={styles.content}>
          <FlatList
            data={displayedProducts}
            keyExtractor={(item) => `prod-${item.id}`}
            renderItem={({ item, index }) => (
              <View style={styles.productPadding}>
                <ProductCard
                  product={item}
                  onPress={() => handleOpenProduct(item)}
                  showDivider={index < displayedProducts.length - 1}
                />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyCategory}>
                <AppText variant="bodyMedium" style={{ marginBottom: Spacing.xs }}>
                  No items in this category
                </AppText>
                <AppText variant="caption" color="secondary" style={{ marginBottom: Spacing.md }}>
                  Try switching back to all categories to see all available items.
                </AppText>
                <PrimaryButton
                  label="Show all items"
                  onPress={() => setSelectedCategory('all')}
                  size="sm"
                />
              </View>
            }
            ListHeaderComponent={
              <View>
                {/* ── Senior UI/UX Home Top Header (Brand, Mode Switcher, Deals, Bell, Search, Greeting) ── */}
                <HomeTopHeader
                  userName="Max"
                  onOpenSearch={() => router.navigate('/products' as any)}
                  onOpenDietary={() => router.navigate('/dietary' as any)}
                />

                {/* 1. Live Active Delivery Tracker Banner */}
                <LiveOrderBanner />

                {/* 2. Bento Quick Services Grid */}
                <BentoServicesGrid onSelectCategory={handleSelectBentoCategory} />

                {/* 3. Explore by Craving Mood Rail */}
                <CravingsRail onSelectCraving={handleSelectCraving} />

                {/* 5. Hero Featured Specials Carousel */}
                {featuredCarouselItems.length > 0 && (
                  <View style={styles.featuredSection}>
                    <View style={styles.featuredHeaderPadding}>
                      <SectionHeader title="Featured specials" />
                    </View>
                    <HeroFeaturedCarousel
                      items={featuredCarouselItems}
                      onPressItem={handleOpenProduct}
                      autoPlayInterval={4000}
                    />
                  </View>
                )}

                {/* 6. Live Flash Deal Countdown Banner */}
                <FlashDealBanner />

                {/* Horizontal Popular Nearby Section */}
                {nearbyStores.length > 0 && (
                  <View style={styles.nearbySection}>
                    <View style={styles.nearbyHeaderPadding}>
                      <SectionHeader title="Popular nearby" />
                    </View>
                    <FlatList
                      horizontal
                      data={nearbyStores}
                      keyExtractor={(item) => `nearby-${item.id}`}
                      renderItem={({ item }) => (
                        <StoreCard
                          store={item}
                          onPress={() => handleOpenStore(item)}
                          variant="horizontal"
                        />
                      )}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.horizontalListContent}
                    />
                  </View>
                )}

                {/* Recommended Items Section Title */}
                {filteredProducts.length > 0 && (
                  <View style={styles.recommendedTitlePadding}>
                    <SectionHeader
                      title="Recommended for you"
                      actionLabel={filteredProducts.length > HOME_RECOMMENDED_LIMIT ? `View all (${DEMO_PRODUCTS.length}) →` : undefined}
                      onAction={handleOpenAllProducts}
                    />
                  </View>
                )}
              </View>
            }
            ListFooterComponent={
              filteredProducts.length > 0 ? (
                <ViewAllProductsCard
                  totalCount={DEMO_PRODUCTS.length}
                  onExplore={handleOpenAllProducts}
                  onSelectCategory={(catId) => {
                    router.navigate({
                      pathname: '/category/[categoryKey]',
                      params: { categoryKey: catId },
                    } as any);
                  }}
                />
              ) : null
            }
          />

          {/* Refined Commerce Floating Cart positioned above floating dock */}
          <FloatingCartButton onPress={() => router.navigate('/checkout' as any)} />
        </View>
      )}

    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    position: 'relative',
  },
  listContent: {
    paddingBottom: 170, // Ample clearance for floating dock and cart
  },
  featuredSection: {
    marginBottom: Spacing.xl,
  },
  featuredHeaderPadding: {
    paddingHorizontal: Spacing.md,
  },
  nearbySection: {
    marginBottom: Spacing.lg,
  },
  nearbyHeaderPadding: {
    paddingHorizontal: Spacing.md,
  },
  horizontalListContent: {
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
  },
  recommendedTitlePadding: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  productPadding: {
    paddingHorizontal: Spacing.md,
  },
  emptyCategory: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
