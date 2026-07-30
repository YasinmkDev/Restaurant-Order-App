import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

export interface ActivityFeedItem {
  id: string;
  category: 'orders' | 'payments' | 'rewards' | 'security';
  icon: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  timestamp: string;
  isUnread?: boolean;
  amountText?: string;
  amountType?: 'debit' | 'credit' | 'neutral';
  badgeLabel?: string;
  actionLabel?: string;
  actionRoute?: string;
  metadata?: {
    referenceId?: string;
    details?: string[];
  };
}

interface ActivityCardProps {
  item: ActivityFeedItem;
  onPress: (item: ActivityFeedItem) => void;
  onActionPress?: (item: ActivityFeedItem) => void;
}

export function ActivityCard({ item, onPress, onActionPress }: ActivityCardProps) {
  const { colors, isDark } = useTheme();

  const handleCardPress = () => {
    Haptics.selectionAsync().catch(() => {});
    onPress(item);
  };

  const handleAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onActionPress) {
      onActionPress(item);
    } else {
      onPress(item);
    }
  };

  // Color mapping based on category
  const defaultBg =
    item.category === 'orders'
      ? 'rgba(249, 115, 22, 0.12)'
      : item.category === 'payments'
      ? 'rgba(16, 185, 129, 0.12)'
      : item.category === 'rewards'
      ? 'rgba(245, 158, 11, 0.12)'
      : 'rgba(59, 130, 246, 0.12)';

  const defaultColor =
    item.category === 'orders'
      ? colors.accent
      : item.category === 'payments'
      ? '#10B981'
      : item.category === 'rewards'
      ? '#F59E0B'
      : '#3B82F6';

  const iconBg = item.iconBg || defaultBg;
  const iconColor = item.iconColor || defaultColor;

  return (
    <Pressable
      onPress={handleCardPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}: ${item.subtitle}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isDark ? colors.surfaceRaised : '#FFFFFF',
          borderColor: item.isUnread
            ? isDark
              ? 'rgba(255, 107, 0, 0.4)'
              : 'rgba(255, 107, 0, 0.3)'
            : isDark
            ? colors.borderSubtle
            : 'rgba(0,0,0,0.06)',
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.topRow}>
        {/* ── Left Icon with unread badge ── */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
            <Ionicons name={item.icon} size={18} color={iconColor} />
          </View>
          {item.isUnread && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
        </View>

        {/* ── Center Content ── */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.titleText,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            >
              {item.title}
            </Text>

            {/* Optional Amount Pill (e.g. +Rs. 50 or -Rs. 1,950) */}
            {item.amountText && (
              <Text
                style={[
                  styles.amountText,
                  {
                    color:
                      item.amountType === 'credit'
                        ? '#10B981'
                        : isDark
                        ? colors.textPrimary
                        : '#1E293B',
                  },
                ]}
              >
                {item.amountText}
              </Text>
            )}
          </View>

          <Text
            numberOfLines={2}
            style={styles.subtitleText}
          >
            {item.subtitle}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.timestampText}>{item.timestamp}</Text>

            {item.badgeLabel && (
              <View
                style={[
                  styles.badgePill,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.06)'
                      : '#F1F5F9',
                  },
                ]}
              >
                <Text style={styles.badgePillText}>{item.badgeLabel}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ── Optional Bottom Action Button ── */}
      {item.actionLabel && (
        <View style={styles.actionContainer}>
          <Pressable
            onPress={handleAction}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={item.actionLabel}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.06)'
                  : '#F8FAFC',
                borderColor: isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.06)',
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Text style={[styles.actionBtnText, { color: colors.accent }]}>
              {item.actionLabel}
            </Text>
            <Ionicons name="chevron-forward" size={13} color={colors.accent} />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
    marginRight: 6,
  },
  amountText: {
    fontSize: 13.5,
    fontWeight: '900',
  },
  subtitleText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    lineHeight: 17,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestampText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  badgePillText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  actionContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
