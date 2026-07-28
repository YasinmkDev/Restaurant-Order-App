import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface FlashDealBannerProps {
  onClaimCode?: (code: string) => void;
}

export function FlashDealBanner({ onClaimCode }: FlashDealBannerProps) {
  const { colors, isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  // Countdown timer state (starts at 2 hours, 45 minutes, 18 seconds)
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 45 * 60 + 18);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopy = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
    setCopied(true);
    if (onClaimCode) {
      onClaimCode('SWIFT35');
    }
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#1C160C' : '#FFF9F5',
            borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.3)',
          },
        ]}
      >
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.badgeRow}>
            <View style={styles.lightningIconWrap}>
              <Ionicons name="flash" size={13} color="#FFFFFF" />
            </View>
            <Text style={styles.badgeTitle}>MIDDAY FLASH DEAL</Text>
          </View>

          {/* Real-Time Ticking Countdown */}
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={12} color="#F59E0B" />
            <Text style={styles.timerText}>{formattedTime} left</Text>
          </View>
        </View>

        {/* Headline & Discount */}
        <View style={styles.textBody}>
          <Text
            style={[
              styles.headline,
              { color: isDark ? colors.textPrimary : '#1E293B' },
            ]}
          >
            Get 35% OFF on top food & bakes
          </Text>
          <Text style={styles.subheadline}>
            Valid on orders over Rs. 800 with fast courier dispatch
          </Text>
        </View>

        {/* Bottom Action / Coupon Claim Row */}
        <View style={styles.couponRow}>
          <View style={styles.codeContainer}>
            <Text style={styles.codePrefix}>USE CODE:</Text>
            <Text style={styles.codeText}>SWIFT35</Text>
          </View>

          <Pressable
            onPress={handleCopy}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={copied ? 'Code SWIFT35 applied' : 'Claim code SWIFT35'}
            style={({ pressed }) => [
              styles.claimButton,
              {
                backgroundColor: copied ? '#10B981' : colors.accent,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons
              name={copied ? 'checkmark-circle' : 'copy-outline'}
              size={14}
              color="#FFFFFF"
            />
            <Text style={styles.claimButtonText}>
              {copied ? 'Claimed!' : 'Claim Code'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  card: {
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lightningIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.6,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  timerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    fontVariant: ['tabular-nums'],
  },
  textBody: {
    marginBottom: 14,
  },
  headline: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  subheadline: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 158, 11, 0.15)',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codePrefix: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: Radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
