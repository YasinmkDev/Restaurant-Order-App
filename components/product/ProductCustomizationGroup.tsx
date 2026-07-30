import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { CustomizationGroup, AddOnOption } from '../../types/product';
import { formatCurrency } from '../../lib/currency';

interface ProductCustomizationGroupProps {
  group: CustomizationGroup;
  selectedOptions: AddOnOption[];
  onToggleOption: (groupId: string, isRequired: boolean, option: AddOnOption) => void;
}

export function ProductCustomizationGroup({
  group,
  selectedOptions,
  onToggleOption,
}: ProductCustomizationGroupProps) {
  const { colors, isDark } = useTheme();

  const groupOptionIds = group.options.map((o) => o.id);
  const selectedCountInGroup = selectedOptions.filter((o) =>
    groupOptionIds.includes(o.id)
  ).length;

  const isSatisfied = group.required ? selectedCountInGroup > 0 : true;

  const handleSelect = (option: AddOnOption) => {
    Haptics.selectionAsync().catch(() => {});
    onToggleOption(group.id, group.required, option);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
          borderColor: isDark ? colors.borderSubtle : 'rgba(0,0,0,0.06)',
        },
      ]}
    >
      {/* ── Group Header Row ── */}
      <View style={styles.groupHeader}>
        <View style={styles.titleWrap}>
          <Text
            style={[
              styles.groupTitle,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            {group.title}
          </Text>
          <Text style={styles.groupSubtitle}>
            {group.required ? 'Select 1 option' : 'Optional additions'}
          </Text>
        </View>

        {/* Status Badge */}
        {group.required ? (
          selectedCountInGroup > 0 ? (
            <View style={styles.satisfiedBadge}>
              <Ionicons name="checkmark-circle" size={13} color="#10B981" />
              <Text style={styles.satisfiedText}>Selected</Text>
            </View>
          ) : (
            <View style={[styles.requiredBadge, { backgroundColor: 'rgba(255, 107, 0, 0.12)' }]}>
              <Text style={[styles.requiredText, { color: colors.accent }]}>
                Required
              </Text>
            </View>
          )
        ) : (
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>Optional</Text>
          </View>
        )}
      </View>

      {/* ── Option Rows ── */}
      <View style={styles.optionsList}>
        {group.options.map((opt, idx) => {
          const isSelected = selectedOptions.some((o) => o.id === opt.id);

          return (
            <Pressable
              key={opt.id}
              onPress={() => handleSelect(opt)}
              accessible={true}
              accessibilityRole={group.required ? 'radio' : 'checkbox'}
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${opt.label}${
                opt.price > 0 ? `, plus ${formatCurrency(opt.price)}` : ', included'
              }`}
              style={({ pressed }) => [
                styles.optionRow,
                {
                  backgroundColor: isSelected
                    ? isDark
                      ? 'rgba(255, 107, 0, 0.12)'
                      : 'rgba(255, 107, 0, 0.06)'
                    : 'transparent',
                  borderColor: isSelected
                    ? colors.accent
                    : isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={styles.optionLeft}>
                {group.required ? (
                  /* Radio */
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? colors.accent : isDark ? '#64748B' : '#CBD5E1',
                        borderWidth: isSelected ? 2 : 1.5,
                      },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioDot,
                          { backgroundColor: colors.accent },
                        ]}
                      />
                    )}
                  </View>
                ) : (
                  /* Checkbox */
                  <View
                    style={[
                      styles.checkboxBox,
                      {
                        borderColor: isSelected ? colors.accent : isDark ? '#64748B' : '#CBD5E1',
                        backgroundColor: isSelected ? colors.accent : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    )}
                  </View>
                )}

                <Text
                  style={[
                    styles.optionLabel,
                    {
                      color: isDark ? colors.textPrimary : '#1E293B',
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </View>

              {/* Price text */}
              <Text
                style={[
                  styles.optionPrice,
                  {
                    color: isSelected
                      ? colors.accent
                      : isDark
                      ? colors.textSecondary
                      : '#64748B',
                    fontWeight: isSelected ? '800' : '600',
                  },
                ]}
              >
                {opt.price > 0 ? `+${formatCurrency(opt.price)}` : 'Included'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWrap: {
    flex: 1,
    marginRight: 10,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  groupSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  requiredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  requiredText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  satisfiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  satisfiedText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#10B981',
  },
  optionalBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  optionalText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  optionsList: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    minHeight: 48,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  optionLabel: {
    fontSize: 13.5,
    flex: 1,
  },
  optionPrice: {
    fontSize: 12.5,
  },
});
