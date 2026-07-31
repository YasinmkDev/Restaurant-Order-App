import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { formatCurrency } from '../../lib/currency';

const TIP_OPTIONS = [0, 50, 100, 150, 200];

interface CourierTipSelectorProps {
  selectedTip: number;
  onSelectTip: (tip: number) => void;
  riderName?: string;
}

export function CourierTipSelector({
  selectedTip,
  onSelectTip,
  riderName = 'Ali Raza',
}: CourierTipSelectorProps) {
  const { colors, isDark } = useTheme();

  const handleSelect = (tip: number) => {
    Haptics.selectionAsync().catch(() => {});
    onSelectTip(tip);
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
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <Ionicons name="heart" size={15} color="#EF4444" />
          <Text
            style={[
              styles.heading,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            Tip your courier rider
          </Text>
        </View>

        <Text style={styles.riderNote}>100% goes to {riderName}</Text>
      </View>

      <View style={styles.chipsRow}>
        {TIP_OPTIONS.map((tip) => {
          const isSelected = selectedTip === tip;

          return (
            <Pressable
              key={`tip-${tip}`}
              onPress={() => handleSelect(tip)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={tip === 0 ? 'No tip' : `Tip ${formatCurrency(tip)}`}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? colors.accent
                    : isDark
                    ? 'rgba(255,255,255,0.06)'
                    : '#F1F5F9',
                  borderColor: isSelected
                    ? colors.accent
                    : isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : isDark
                      ? colors.textSecondary
                      : '#475569',
                    fontWeight: isSelected ? '800' : '600',
                  },
                ]}
              >
                {tip === 0 ? 'Not now' : formatCurrency(tip)}
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
    padding: 14,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heading: {
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  riderNote: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  chip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
  },
});
