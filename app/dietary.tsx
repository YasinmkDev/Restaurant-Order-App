import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../components/ui/Screen';
import { AppText } from '../components/ui/AppText';
import { IconButton } from '../components/ui/IconButton';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { StylishToggle } from '../components/ui/StylishToggle';
import { useSafeRouter } from '../hooks/useSafeRouter';
import { useTheme } from '../hooks/useTheme';
import { Radius, Spacing } from '../components/ui/theme';

const DIETARY_TAGS = [
  { id: 'halal', label: '100% Certified Halal', icon: 'shield-checkmark', color: '#10B981' },
  { id: 'veg', label: 'Vegetarian Only', icon: 'leaf', color: '#059669' },
  { id: 'vegan', label: 'Strict Vegan', icon: 'nutrition', color: '#16A34A' },
  { id: 'keto', label: 'Keto / Low-Carb', icon: 'flame', color: '#EA580C' },
  { id: 'gluten_free', label: 'Gluten-Free Only', icon: 'fitness', color: '#D97706' },
  { id: 'dairy_free', label: 'Dairy-Free', icon: 'water', color: '#2563EB' },
];

const SPICE_LEVELS = [
  { id: 'mild', label: 'Mild', emoji: '🌶️', desc: 'Little to no heat' },
  { id: 'medium', label: 'Medium', emoji: '🌶️🌶️', desc: 'Balanced Pakistani heat' },
  { id: 'hot', label: 'Hot', emoji: '🌶️🌶️🌶️', desc: 'Authentic fiery spice' },
  { id: 'extreme', label: 'Desi Fire', emoji: '🔥', desc: 'Maximum chilies & pepper' },
];

export default function DietaryPreferencesScreen() {
  const router = useSafeRouter();
  const { colors, isDark } = useTheme();

  // Dietary state
  const [selectedDiets, setSelectedDiets] = useState<string[]>(['halal']);
  const [selectedSpice, setSelectedSpice] = useState('medium');

  // Allergy switches
  const [nutAllergy, setNutAllergy] = useState(true);
  const [shellfishAllergy, setShellfishAllergy] = useState(false);
  const [eggAllergy, setEggAllergy] = useState(false);
  const [dairyAllergy, setDairyAllergy] = useState(false);
  const [glutenAllergy, setGlutenAllergy] = useState(false);

  // Instructions
  const [kitchenNotes, setKitchenNotes] = useState('Separate spicy gravies if possible. Extra napkins.');

  const toggleDiet = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedDiets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert(
      'Preferences Saved',
      'Your dietary & allergy guidelines will be highlighted to partner restaurant kitchens on all future orders.',
      [{ text: 'Done', onPress: () => router.back() }]
    );
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
              Dietary & Allergies
            </AppText>
            <AppText variant="micro" color="secondary">
              Kitchen filters & allergy alert protocols
            </AppText>
          </View>
        </View>

        <Pressable onPress={handleSave} style={[styles.saveHeaderBtn, { backgroundColor: colors.accent }]}>
          <Text style={styles.saveHeaderBtnText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Halal Guarantee Banner */}
        <View
          style={[
            styles.guaranteeBanner,
            {
              backgroundColor: isDark ? '#064E3B' : '#DCFCE7',
              borderColor: '#10B981',
            },
          ]}
        >
          <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          <View style={styles.guaranteeTextCol}>
            <Text style={[styles.guaranteeTitle, { color: isDark ? '#A7F3D0' : '#065F46' }]}>
              Islamabad Halal Compliance Guarantee
            </Text>
            <Text style={[styles.guaranteeDesc, { color: isDark ? '#D1FAE5' : '#047857' }]}>
              All kitchens, meats, and preparations dispatched on Swift Delivery are 100% certified Halal compliant.
            </Text>
          </View>
        </View>

        {/* 1. Dietary Regimes */}
        <View style={styles.section}>
          <AppText variant="sectionTitle" style={styles.sectionHeader}>
            Dietary Regimes
          </AppText>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Select all lifestyles that apply to prioritize matching menu items.
          </Text>

          <View style={styles.tagsGrid}>
            {DIETARY_TAGS.map((tag) => {
              const isSelected = selectedDiets.includes(tag.id);
              return (
                <Pressable
                  key={tag.id}
                  onPress={() => toggleDiet(tag.id)}
                  style={[
                    styles.dietTagCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(255, 107, 0, 0.16)'
                          : 'rgba(255, 107, 0, 0.08)'
                        : colors.surfaceRaised,
                      borderColor: isSelected ? colors.accent : colors.borderSubtle,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.tagIconWrapper,
                      { backgroundColor: isSelected ? colors.accent : isDark ? '#1E2330' : '#F1F5F9' },
                    ]}
                  >
                    <Ionicons
                      name={tag.icon as any}
                      size={16}
                      color={isSelected ? '#FFFFFF' : tag.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.tagLabel,
                      {
                        color: isSelected ? colors.textPrimary : colors.textSecondary,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {tag.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 2. Spice Tolerance Selector */}
        <View style={styles.section}>
          <AppText variant="sectionTitle" style={styles.sectionHeader}>
            Default Spice Tolerance
          </AppText>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            We automatically pass your preferred spice benchmark to chefs.
          </Text>

          <View style={styles.spiceRow}>
            {SPICE_LEVELS.map((level) => {
              const isSelected = selectedSpice === level.id;
              return (
                <Pressable
                  key={level.id}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setSelectedSpice(level.id);
                  }}
                  style={[
                    styles.spiceCard,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? '#450A0A'
                          : '#FEE2E2'
                        : colors.surfaceRaised,
                      borderColor: isSelected ? '#EF4444' : colors.borderSubtle,
                    },
                  ]}
                >
                  <Text style={styles.spiceEmoji}>{level.emoji}</Text>
                  <Text
                    style={[
                      styles.spiceLabel,
                      {
                        color: isSelected ? '#DC2626' : colors.textPrimary,
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}
                  >
                    {level.label}
                  </Text>
                  <Text style={[styles.spiceDesc, { color: colors.textTertiary }]}>
                    {level.desc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 3. Allergy Alert Protocols (Using StylishToggle) */}
        <View style={styles.section}>
          <AppText variant="sectionTitle" style={styles.sectionHeader}>
            Allergy Flags & Kitchen Alerts
          </AppText>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Restaurants will receive red-priority packing alerts for enabled allergens.
          </Text>

          <View style={[styles.allergyCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
            {/* Peanut Allergy */}
            <View style={styles.allergyRow}>
              <View style={styles.allergyInfo}>
                <Text style={[styles.allergyName, { color: colors.textPrimary }]}>
                  🥜 Peanuts & Tree Nuts
                </Text>
                <Text style={[styles.allergyNote, { color: colors.textSecondary }]}>
                  Strict nut-free preparation and separate packaging
                </Text>
              </View>
              <StylishToggle
                value={nutAllergy}
                onValueChange={setNutAllergy}
                activeColor="#EF4444"
                icon="alert-circle"
              />
            </View>

            <View style={[styles.rowSeparator, { backgroundColor: colors.borderSubtle }]} />

            {/* Shellfish Allergy */}
            <View style={styles.allergyRow}>
              <View style={styles.allergyInfo}>
                <Text style={[styles.allergyName, { color: colors.textPrimary }]}>
                  🦐 Crustaceans & Shellfish
                </Text>
                <Text style={[styles.allergyNote, { color: colors.textSecondary }]}>
                  Alert for cross-contact with shrimp, prawns & fish sauce
                </Text>
              </View>
              <StylishToggle
                value={shellfishAllergy}
                onValueChange={setShellfishAllergy}
                activeColor="#EF4444"
                icon="alert-circle"
              />
            </View>

            <View style={[styles.rowSeparator, { backgroundColor: colors.borderSubtle }]} />

            {/* Dairy & Lactose */}
            <View style={styles.allergyRow}>
              <View style={styles.allergyInfo}>
                <Text style={[styles.allergyName, { color: colors.textPrimary }]}>
                  🥛 Lactose & Dairy Products
                </Text>
                <Text style={[styles.allergyNote, { color: colors.textSecondary }]}>
                  Flag cheese, cream, butter and milk bases
                </Text>
              </View>
              <StylishToggle
                value={dairyAllergy}
                onValueChange={setDairyAllergy}
                activeColor="#F59E0B"
              />
            </View>

            <View style={[styles.rowSeparator, { backgroundColor: colors.borderSubtle }]} />

            {/* Eggs */}
            <View style={styles.allergyRow}>
              <View style={styles.allergyInfo}>
                <Text style={[styles.allergyName, { color: colors.textPrimary }]}>
                  🥚 Egg Products
                </Text>
                <Text style={[styles.allergyNote, { color: colors.textSecondary }]}>
                  Flag egg dressings, mayonnaise and egg-washed breads
                </Text>
              </View>
              <StylishToggle
                value={eggAllergy}
                onValueChange={setEggAllergy}
                activeColor="#F59E0B"
              />
            </View>

            <View style={[styles.rowSeparator, { backgroundColor: colors.borderSubtle }]} />

            {/* Gluten */}
            <View style={styles.allergyRow}>
              <View style={styles.allergyInfo}>
                <Text style={[styles.allergyName, { color: colors.textPrimary }]}>
                  🌾 Wheat & Celiac Warning
                </Text>
                <Text style={[styles.allergyNote, { color: colors.textSecondary }]}>
                  Alert chef for gluten-free flour and utensils
                </Text>
              </View>
              <StylishToggle
                value={glutenAllergy}
                onValueChange={setGlutenAllergy}
                activeColor="#F59E0B"
              />
            </View>
          </View>
        </View>

        {/* 4. Custom Kitchen Instructions */}
        <View style={styles.section}>
          <AppText variant="sectionTitle" style={styles.sectionHeader}>
            Standing Kitchen Instructions
          </AppText>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            These notes will be attached to every restaurant order automatically.
          </Text>

          <TextInput
            value={kitchenNotes}
            onChangeText={setKitchenNotes}
            multiline
            numberOfLines={3}
            placeholder="e.g. Always request extra raita, no plastic cutlery..."
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.notesInput,
              {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.borderSubtle,
                color: colors.textPrimary,
              },
            ]}
          />
        </View>

        <View style={{ marginTop: Spacing.md }}>
          <PrimaryButton label="Save Dietary Guidelines" onPress={handleSave} />
        </View>
      </ScrollView>
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
  saveHeaderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  saveHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  guaranteeBanner: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    gap: 12,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  guaranteeTextCol: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  guaranteeDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 12,
    marginBottom: Spacing.sm,
    lineHeight: 16,
  },
  tagsGrid: {
    gap: 8,
  },
  dietTagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 10,
  },
  tagIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagLabel: {
    fontSize: 13,
    flex: 1,
  },
  spiceRow: {
    flexDirection: 'row',
    gap: 6,
  },
  spiceCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  spiceEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  spiceLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  spiceDesc: {
    fontSize: 9,
    textAlign: 'center',
  },
  allergyCard: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
  },
  allergyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  allergyInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  allergyName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  allergyNote: {
    fontSize: 11,
    lineHeight: 15,
  },
  rowSeparator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 70,
  },
});
