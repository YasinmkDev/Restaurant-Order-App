import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Radius, Spacing } from '../ui/theme';

interface ProductHeroHeaderProps {
  imageUrl: string;
  rating: number;
  prepTime: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onShare: () => void;
}

export function ProductHeroHeader({
  imageUrl,
  rating,
  prepTime,
  isFavorite,
  onToggleFavorite,
  onBack,
  onShare,
}: ProductHeroHeaderProps) {
  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onToggleFavorite();
  };

  const handleShare = () => {
    Haptics.selectionAsync().catch(() => {});
    onShare();
  };

  const handleBack = () => {
    Haptics.selectionAsync().catch(() => {});
    onBack();
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.heroImage}
        contentFit="cover"
        transition={250}
      />

      {/* ── Top Floating Action Buttons ── */}
      <View style={styles.topBar}>
        {/* Back / Close button */}
        <Pressable
          onPress={handleBack}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={({ pressed }) => [
            styles.circleButton,
            { opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>

        <View style={styles.rightButtonsRow}>
          {/* Share button */}
          <Pressable
            onPress={handleShare}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Share item"
            style={({ pressed }) => [
              styles.circleButton,
              { opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <Ionicons name="share-outline" size={19} color="#FFFFFF" />
          </Pressable>

          {/* Favorite button */}
          <Pressable
            onPress={handleFavorite}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={({ pressed }) => [
              styles.circleButton,
              { opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#EF4444' : '#FFFFFF'}
            />
          </Pressable>
        </View>
      </View>

      {/* ── Bottom Overlay Badges ── */}
      <View style={styles.bottomBadgesRow}>
        <View style={styles.badgePill}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={styles.badgeText}>{rating.toFixed(1)} (350+ reviews)</Text>
        </View>

        <View style={styles.badgePill}>
          <Ionicons name="time-outline" size={13} color="#FFFFFF" />
          <Text style={styles.badgeText}>{prepTime} prep</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 290,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B',
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  rightButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  bottomBadgesRow: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
