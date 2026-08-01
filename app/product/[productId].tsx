import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeRouter } from '../../hooks/useSafeRouter';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../../components/ui/Screen';
import { Divider } from '../../components/ui/Divider';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../../components/ui/theme';
import { useCartStore } from '../../store/cart.store';
import { DEMO_PRODUCTS } from '../../data/products';
import { DEMO_STORES } from '../../data/stores';
import { AddOnOption } from '../../types/product';
import { formatCurrency } from '../../lib/currency';
import { ProductHeroHeader } from '../../components/product/ProductHeroHeader';
import { ProductCustomizationGroup } from '../../components/product/ProductCustomizationGroup';
import { QuickInstructionPills } from '../../components/product/QuickInstructionPills';
import { ProductFloatingBottomBar } from '../../components/product/ProductFloatingBottomBar';

export default function ProductDetailScreen() {
  const router = useSafeRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { colors, isDark } = useTheme();
  const addItem = useCartStore((s) => s.addItem);

  const product = useMemo(() => {
    return DEMO_PRODUCTS.find((p) => p.id === productId);
  }, [productId]);

  const store = useMemo(() => {
    if (!product) return null;
    return DEMO_STORES.find((s) => s.id === product.storeId);
  }, [product]);

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  // Initialize with the first option for all required groups
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>(() => {
    if (!product?.customizationGroups) return [];
    const defaults: AddOnOption[] = [];
    product.customizationGroups.forEach((grp) => {
      if (grp.required && grp.options.length > 0) {
        defaults.push(grp.options[0]);
      }
    });
    return defaults;
  });

  // Safe fallback if product does not exist
  if (!product) {
    return (
      <Screen safeBottom>
        <View style={[styles.navBar, { borderBottomColor: colors.borderSubtle }]}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
            Item unavailable
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.missingContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.textTertiary}
            style={{ marginBottom: Spacing.sm }}
          />
          <Text style={[styles.missingTitle, { color: colors.textPrimary }]}>
            Item not found
          </Text>
          <Text style={styles.missingSubtitle}>
            This item is currently unavailable or may have been updated.
          </Text>
          <Pressable
            onPress={() => router.replace('/(tabs)' as any)}
            style={[styles.returnBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.returnBtnText}>Return to explore</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const toggleOption = (groupId: string, isRequired: boolean, option: AddOnOption) => {
    setShowValidationError(false);

    if (isRequired) {
      const groupOptionIds =
        product.customizationGroups
          ?.find((g) => g.id === groupId)
          ?.options.map((o) => o.id) || [];

      setSelectedAddOns((prev) => [
        ...prev.filter((o) => !groupOptionIds.includes(o.id)),
        option,
      ]);
    } else {
      setSelectedAddOns((prev) => {
        const exists = prev.some((o) => o.id === option.id);
        if (exists) {
          return prev.filter((o) => o.id !== option.id);
        } else {
          return [...prev, option];
        }
      });
    }
  };

  const isFormValid = useMemo(() => {
    if (!product.customizationGroups) return true;
    for (const group of product.customizationGroups) {
      if (group.required) {
        const groupOptionIds = group.options.map((o) => o.id);
        const hasSelection = selectedAddOns.some((o) => groupOptionIds.includes(o.id));
        if (!hasSelection) return false;
      }
    }
    return true;
  }, [product, selectedAddOns]);

  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  }, [selectedAddOns]);

  const lineTotal = (product.basePrice + addOnsTotal) * quantity;

  const handleAppendNote = (tag: string) => {
    if (notes.includes(tag)) {
      // Remove tag
      setNotes((prev) =>
        prev
          .replace(tag, '')
          .replace(/,\s*,/g, ',')
          .trim()
      );
    } else {
      // Append tag
      setNotes((prev) => (prev ? `${prev.trim()}, ${tag}` : tag));
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on Swift Delivery: ${formatCurrency(product.basePrice)}!`,
      });
    } catch {}
  };

  const handleAddToCart = () => {
    if (!isFormValid) {
      setShowValidationError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      Alert.alert(
        'Selection Required',
        'Please make sure you have selected all required options before adding to cart.',
        [{ text: 'OK' }]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    addItem({
      cartItemId: `${product.id}-${Date.now()}`,
      productId: product.id,
      storeId: product.storeId,
      title: product.name,
      quantity,
      basePrice: product.basePrice,
      selectedAddOns,
      notes: notes.trim() || undefined,
      image: product.image,
    });

    router.back();
  };

  return (
    <Screen safeBottom>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Immersive Edge-to-Edge Hero Header ── */}
          <ProductHeroHeader
            imageUrl={product.image}
            rating={product.rating}
            prepTime={product.preparationTime}
            isFavorite={isFavorite}
            onToggleFavorite={() => setIsFavorite(!isFavorite)}
            onBack={() => router.back()}
            onShare={handleShare}
          />

          <View style={styles.bodyContent}>
            {/* ── Merchant Affiliation Link Pill ── */}
            {store && (
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  router.navigate(`/(tabs)` as any);
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Store: ${store.name}`}
                style={[
                  styles.storePill,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                <Ionicons name="storefront-outline" size={14} color={colors.accent} />
                <Text
                  style={[
                    styles.storeNameText,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  {store.name}
                </Text>
                <Text style={styles.storeDeliveryMeta}>
                  • {store.deliveryTime}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={12}
                  color="#94A3B8"
                  style={{ marginLeft: 'auto' }}
                />
              </Pressable>
            )}

            {/* ── Product Title & Price ── */}
            <View style={styles.titlePriceRow}>
              <Text
                style={[
                  styles.productTitle,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                {product.name}
              </Text>
              <Text style={[styles.productPrice, { color: colors.accent }]}>
                {formatCurrency(product.basePrice)}
              </Text>
            </View>

            {/* ── Dietary & Quality Badges ── */}
            <View style={styles.dietaryRow}>
              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: 'rgba(16, 185, 129, 0.12)' },
                ]}
              >
                <MaterialCommunityIcons name="check-decagram" size={13} color="#10B981" />
                <Text style={[styles.tagText, { color: '#10B981' }]}>100% Halal</Text>
              </View>

              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: 'rgba(249, 115, 22, 0.12)' },
                ]}
              >
                <Ionicons name="flame" size={13} color="#F97316" />
                <Text style={[styles.tagText, { color: '#F97316' }]}>Bestseller</Text>
              </View>

              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: 'rgba(59, 130, 246, 0.12)' },
                ]}
              >
                <Ionicons name="sparkles" size={12} color="#3B82F6" />
                <Text style={[styles.tagText, { color: '#3B82F6' }]}>Fresh Made</Text>
              </View>
            </View>

            {/* Description */}
            <Text
              style={[
                styles.descriptionText,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              {product.description}
            </Text>

            <Divider style={styles.divider} />

            {/* ── Customization Groups (Beverages, Extras, Dips) ── */}
            {product.customizationGroups?.map((group) => (
              <ProductCustomizationGroup
                key={group.id}
                group={group}
                selectedOptions={selectedAddOns}
                onToggleOption={toggleOption}
              />
            ))}

            {/* ── Special Instructions with 1-Tap Quick Tags ── */}
            <View
              style={[
                styles.notesCard,
                {
                  backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
                  borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              <View style={styles.notesHeader}>
                <Ionicons name="chatbox-ellipses-outline" size={16} color={colors.accent} />
                <Text
                  style={[
                    styles.notesTitle,
                    { color: isDark ? colors.textPrimary : '#1E293B' },
                  ]}
                >
                  Special Kitchen Instructions
                </Text>
              </View>

              {/* 1-Tap Quick Request Pills */}
              <QuickInstructionPills
                currentNotes={notes}
                onAppendNote={handleAppendNote}
              />

              {/* Custom Text Area */}
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Specific cooking notes, allergies, or packaging instructions..."
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                multiline
                numberOfLines={3}
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                    color: isDark ? colors.textPrimary : '#1E293B',
                  },
                ]}
              />
            </View>

            {showValidationError && (
              <Text style={styles.validationText}>
                ⚠️ Please select all required options above to add this item to cart.
              </Text>
            )}
          </View>
        </ScrollView>

        {/* ── Floating Elevated Commerce Bottom Dock ── */}
        <ProductFloatingBottomBar
          quantity={quantity}
          totalPrice={lineTotal}
          isValid={isFormValid}
          onIncreaseQuantity={() => setQuantity((q) => q + 1)}
          onDecreaseQuantity={() => setQuantity((q) => Math.max(1, q - 1))}
          onAddToCart={handleAddToCart}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  missingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginTop: 80,
  },
  missingTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  missingSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  returnBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  returnBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  bodyContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  storePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginBottom: 12,
  },
  storeNameText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  storeDeliveryMeta: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  titlePriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  productTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  dietaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  descriptionText: {
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 18,
  },
  notesCard: {
    padding: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  notesInput: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    minHeight: 68,
    textAlignVertical: 'top',
  },
  validationText: {
    color: '#EF4444',
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});
