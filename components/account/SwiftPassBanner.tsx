import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface SwiftPassBannerProps {
  onLearnMore?: () => void;
}

export function SwiftPassBanner({ onLearnMore }: SwiftPassBannerProps) {
  const { colors, isDark } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onLearnMore) onLearnMore();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Swift Pass VIP membership"
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isDark ? '#1C1917' : '#0F172A',
          borderColor: isDark ? 'rgba(255, 107, 0, 0.4)' : '#334155',
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      {/* ── Top Header ── */}
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={styles.crownCircle}>
            <MaterialCommunityIcons name="crown" size={16} color="#FFB800" />
          </View>
          <Text style={styles.vipHeading}>SWIFT PASS VIP</Text>
        </View>

        <View style={styles.freeTrialPill}>
          <Text style={styles.freeTrialText}>ACTIVE MEMBER</Text>
        </View>
      </View>

      {/* ── Value Proposition ── */}
      <Text style={styles.title}>Unlimited Rs. 0 Delivery</Text>
      <Text style={styles.subtitle}>
        On food & parcel courier orders over Rs. 799 • Plus 5% wallet cashback
      </Text>

      {/* ── Benefit Highlights ── */}
      <View style={styles.benefitsRow}>
        <View style={styles.benefitItem}>
          <Ionicons name="flash" size={13} color="#FF6B00" />
          <Text style={styles.benefitText}>Priority Dispatch</Text>
        </View>
        <View style={styles.benefitDivider} />
        <View style={styles.benefitItem}>
          <Ionicons name="shield-checkmark" size={13} color="#10B981" />
          <Text style={styles.benefitText}>Rain Protection</Text>
        </View>
        <View style={styles.benefitDivider} />
        <View style={styles.benefitItem}>
          <Ionicons name="gift" size={13} color="#EC4899" />
          <Text style={styles.benefitText}>Exclusive Deals</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    marginBottom: Spacing.md,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  crownCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFB800',
    letterSpacing: 0.8,
  },
  freeTrialPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  freeTrialText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 12,
  },
  benefitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  benefitText: {
    fontSize: 10.5,
    color: '#CBD5E1',
    fontWeight: '700',
  },
  benefitDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
