import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { IconButton } from '../../components/ui/IconButton';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { HonestNoticeModal } from '../../components/ui/HonestNoticeModal';
import { CategoryTabs, CategoryKey } from '../../components/explore/CategoryTabs';
import { ExploreSkeleton } from '../../components/explore/ExploreSkeleton';
import { StoreCard } from '../../components/explore/StoreCard';
import { ProductCard } from '../../components/explore/ProductCard';
import { HeroFeaturedCarousel } from '../../components/explore/HeroFeaturedCarousel';
import { LiveOrderBanner } from '../../components/explore/LiveOrderBanner';
import { BentoServicesGrid } from '../../components/explore/BentoServicesGrid';
import { CravingsRail, CravingItem } from '../../components/explore/CravingsRail';
import { FlashDealBanner } from '../../components/explore/FlashDealBanner';
import { FloatingCartButton } from '../../components/cart/FloatingCartButton';
import { useTheme } from '../../hooks/useTheme';
import { Spacing } from '../../components/ui/theme';
import { useOrderStore } from '../../store/order.store';
import { DEMO_STORES } from '../../data/stores';
import { DEMO_PRODUCTS } from '../../data/products';
import { Store } from '../../types/store';
import { Product } from '../../types/product';

export default function ExploreScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const selectedAddress = useOrderStore((s) => s.selectedAddress);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [locationNoticeVisible, setLocationNoticeVisible] = useState(false);

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
    router.push(`/product/${matchingProd.id}` as any);
  };

  const handleOpenProduct = (product: Product) => {
    router.push(`/product/${product.id}` as any);
  };

  const handleSelectCraving = (craving: CravingItem) => {
    setSelectedCategory(craving.category);
  };

  return (
    <Screen safeBottom>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Bar: Compact Delivery Location & Actions */}
      <View style={[styles.topBar, { borderBottomColor: colors.borderSubtle }]}>
        <Pressable
          onPress={() => setLocationNoticeVisible(true)}
          style={styles.locationAffordance}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Delivering to ${selectedAddress.title}, ${selectedAddress.fullAddress}. Tap for details.`}
        >
          <Ionicons name="location-outline" size={16} color={colors.accent} />
          <AppText variant="caption" color="secondary" style={styles.locationPrefix}>
            Delivering to ·
          </AppText>
          <AppText variant="label" numberOfLines={1} style={styles.locationText}>
            {selectedAddress.title}
          </AppText>
          <Ionicons name="chevron-down" size={12} color={colors.textTertiary} />
        </Pressable>

        <View style={styles.topActions}>
          <IconButton
            icon={<Ionicons name="bicycle-outline" size={18} color={colors.textPrimary} />}
            onPress={() => router.push('/tracking/order-sw-9842' as any)}
            accessibilityLabel="Track active delivery"
            size={40}
          />
          <ThemeToggle />
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <ExploreSkeleton />
      ) : (
        <View style={styles.content}>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => `prod-${item.id}`}
            renderItem={({ item, index }) => (
              <View style={styles.productPadding}>
                <ProductCard
                  product={item}
                  onPress={() => handleOpenProduct(item)}
                  showDivider={index < filteredProducts.length - 1}
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
                {/* Greeting & Headline */}
                <View style={styles.greetingSection}>
                  <AppText variant="caption" color="secondary">
                    Good afternoon, Max
                  </AppText>
                  <AppText variant="title" style={styles.headline}>
                    What are you craving?
                  </AppText>
                </View>

                {/* 1. Live Active Delivery Tracker Banner */}
                <LiveOrderBanner />

                {/* 2. Bento Quick Services Grid */}
                <BentoServicesGrid onSelectCategory={setSelectedCategory} />

                {/* 3. Explore by Craving Mood Rail */}
                <CravingsRail onSelectCraving={handleSelectCraving} />

                {/* 4. Category Tabs */}
                <CategoryTabs
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />

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
                    <SectionHeader title="Recommended for you" />
                  </View>
                )}
              </View>
            }
          />

          {/* Refined Commerce Floating Cart positioned above floating dock */}
          <FloatingCartButton onPress={() => router.push('/checkout' as any)} />
        </View>
      )}

      {/* Honest Location Disclosure Modal */}
      <HonestNoticeModal
        visible={locationNoticeVisible}
        title="Delivery address"
        message={`Currently set to ${selectedAddress.title} (${selectedAddress.fullAddress}). You can change addresses or pick a saved location directly in Checkout.`}
        onClose={() => setLocationNoticeVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    position: 'relative',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
  },
  locationAffordance: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: Spacing.xs,
  },
  locationPrefix: {
    marginLeft: Spacing.xs,
    marginRight: 4,
  },
  locationText: {
    marginRight: 4,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  listContent: {
    paddingBottom: 170, // Ample clearance for floating dock and cart
  },
  greetingSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headline: {
    marginTop: 2,
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
