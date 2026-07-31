import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

interface UserProfileCardProps {
  name: string;
  phone: string;
  email: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  avatarUrl?: string;
  onEditPress: () => void;
}

export function UserProfileCard({
  name,
  phone,
  email,
  tier = 'Gold',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  onEditPress,
}: UserProfileCardProps) {
  const { colors, isDark } = useTheme();

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onEditPress();
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
        {/* Avatar with Verified checkmark */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatarImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          </View>
        </View>

        {/* User Info */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.nameText,
                { color: isDark ? colors.textPrimary : '#1E293B' },
              ]}
            >
              {name}
            </Text>

            {/* Member Tier Pill */}
            <View
              style={[
                styles.tierPill,
                {
                  backgroundColor:
                    tier === 'Platinum'
                      ? 'rgba(139, 92, 246, 0.15)'
                      : tier === 'Gold'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(100, 116, 139, 0.15)',
                },
              ]}
            >
              <Ionicons
                name="star"
                size={11}
                color={
                  tier === 'Platinum'
                    ? '#8B5CF6'
                    : tier === 'Gold'
                    ? '#F59E0B'
                    : '#64748B'
                }
              />
              <Text
                style={[
                  styles.tierText,
                  {
                    color:
                      tier === 'Platinum'
                        ? '#8B5CF6'
                        : tier === 'Gold'
                        ? '#F59E0B'
                        : '#64748B',
                  },
                ]}
              >
                {tier} Tier
              </Text>
            </View>
          </View>

          <Text style={styles.metaText}>{phone}</Text>
          <Text numberOfLines={1} style={styles.metaText}>
            {email}
          </Text>
        </View>

        {/* Edit Button */}
        <Pressable
          onPress={handleEdit}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          style={({ pressed }) => [
            styles.editBtn,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons
            name="pencil"
            size={15}
            color={isDark ? colors.textPrimary : '#334155'}
          />
        </Pressable>
      </View>

      {/* Progress to Next Tier */}
      <View
        style={[
          styles.tierProgressBox,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
          },
        ]}
      >
        <View style={styles.tierProgressTextRow}>
          <Text style={styles.tierProgressLabel}>Progress to Platinum</Text>
          <Text style={styles.tierProgressPercent}>8 / 12 deliveries</Text>
        </View>
        <View
          style={[
            styles.progressBarTrack,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            },
          ]}
        >
          <View
            style={[
              styles.progressBarFill,
              { backgroundColor: colors.accent, width: '66%' },
            ]}
          />
        </View>
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
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '800',
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierProgressBox: {
    marginTop: 14,
    padding: 10,
    borderRadius: Radius.md,
  },
  tierProgressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tierProgressLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tierProgressPercent: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
});
