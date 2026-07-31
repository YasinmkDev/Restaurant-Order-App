import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';
import { formatCurrency } from '../../lib/currency';

export type DeliverySpeed = 'priority' | 'standard';

interface DeliveryOptionSelectorProps {
  selectedSpeed: DeliverySpeed;
  onSelectSpeed: (speed: DeliverySpeed) => void;
  priorityFee?: number;
}

export function DeliveryOptionSelector({
  selectedSpeed,
  onSelectSpeed,
  priorityFee = 60,
}: DeliveryOptionSelectorProps) {
  const { colors, isDark } = useTheme();

  const handleSelect = (speed: DeliverySpeed) => {
    if (speed === selectedSpeed) return;
    Haptics.selectionAsync().catch(() => {});
    onSelectSpeed(speed);
  };

  return (
    <View style={styles.container}>
      {/* ── Priority Option ── */}
      <Pressable
        onPress={() => handleSelect('priority')}
        accessible={true}
        accessibilityRole="radio"
        accessibilityState={{ selected: selectedSpeed === 'priority' }}
        accessibilityLabel="Priority delivery, arrives in 15 to 20 minutes"
        style={({ pressed }) => [
          styles.optionCard,
          {
            backgroundColor:
              selectedSpeed === 'priority'
                ? isDark
                  ? 'rgba(255, 107, 0, 0.12)'
                  : 'rgba(255, 107, 0, 0.06)'
                : isDark
                ? colors.surfaceRaised
                : '#FFFFFF',
            borderColor:
              selectedSpeed === 'priority'
                ? colors.accent
                : isDark
                ? colors.borderSubtle
                : 'rgba(0,0,0,0.06)',
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.iconTitleRow}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    selectedSpeed === 'priority'
                      ? 'rgba(255, 107, 0, 0.2)'
                      : isDark
                      ? 'rgba(255,255,255,0.06)'
                      : '#F1F5F9',
                },
              ]}
            >
              <Ionicons
                name="flash"
                size={16}
                color={selectedSpeed === 'priority' ? colors.accent : '#94A3B8'}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.optionTitle,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                Priority Dispatch
              </Text>
              <Text style={styles.etaText}>15–20 mins • Direct to you</Text>
            </View>
          </View>

          <Text
            style={[
              styles.feeText,
              { color: selectedSpeed === 'priority' ? colors.accent : '#94A3B8' },
            ]}
          >
            +{formatCurrency(priorityFee)}
          </Text>
        </View>
      </Pressable>

      {/* ── Standard Option ── */}
      <Pressable
        onPress={() => handleSelect('standard')}
        accessible={true}
        accessibilityRole="radio"
        accessibilityState={{ selected: selectedSpeed === 'standard' }}
        accessibilityLabel="Standard delivery, arrives in 25 to 30 minutes"
        style={({ pressed }) => [
          styles.optionCard,
          {
            backgroundColor:
              selectedSpeed === 'standard'
                ? isDark
                  ? 'rgba(255, 107, 0, 0.12)'
                  : 'rgba(255, 107, 0, 0.06)'
                : isDark
                ? colors.surfaceRaised
                : '#FFFFFF',
            borderColor:
              selectedSpeed === 'standard'
                ? colors.accent
                : isDark
                ? colors.borderSubtle
                : 'rgba(0,0,0,0.06)',
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.iconTitleRow}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    selectedSpeed === 'standard'
                      ? 'rgba(255, 107, 0, 0.2)'
                      : isDark
                      ? 'rgba(255,255,255,0.06)'
                      : '#F1F5F9',
                },
              ]}
            >
              <Ionicons
                name="bicycle"
                size={16}
                color={selectedSpeed === 'standard' ? colors.accent : '#94A3B8'}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.optionTitle,
                  { color: isDark ? colors.textPrimary : '#1E293B' },
                ]}
              >
                Standard Delivery
              </Text>
              <Text style={styles.etaText}>25–30 mins</Text>
            </View>
          </View>

          <Text style={[styles.feeText, { color: '#10B981' }]}>Included</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: Spacing.md,
  },
  optionCard: {
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  etaText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  feeText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});
