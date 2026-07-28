import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Spacing } from '../ui/theme';

export function ExploreSkeleton() {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const placeholderBg = colors.surfaceMuted;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Location row placeholder */}
      <View style={styles.headerPadding}>
        <Animated.View
          style={[styles.locationPlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
        />
        <Animated.View
          style={[styles.greetingPlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
        />
        <Animated.View
          style={[styles.titlePlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
        />
      </View>

      {/* Category rail placeholder */}
      <View style={styles.railPadding}>
        <Animated.View
          style={[styles.railPlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
        />
      </View>

      {/* Featured hero card placeholder */}
      <View style={styles.sectionPadding}>
        <Animated.View
          style={[styles.heroCardPlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
        />
        <Animated.View
          style={[styles.heroTextPlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
        />
      </View>

      {/* Flat product rows placeholder */}
      <View style={styles.sectionPadding}>
        <Animated.View
          style={[styles.sectionTitlePlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
        />
        {[1, 2, 3].map((item) => (
          <View key={`skel-row-${item}`} style={styles.rowWrapper}>
            <View style={styles.rowDetails}>
              <Animated.View
                style={[styles.rowTitlePlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
              />
              <Animated.View
                style={[styles.rowDescPlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
              />
              <Animated.View
                style={[styles.rowPricePlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
              />
            </View>
            <Animated.View
              style={[styles.rowImagePlaceholder, { backgroundColor: placeholderBg }, animatedStyle]}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerPadding: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  locationPlaceholder: {
    width: 140,
    height: 14,
    borderRadius: Radius.xs,
  },
  greetingPlaceholder: {
    width: 110,
    height: 12,
    borderRadius: Radius.xs,
    marginTop: 4,
  },
  titlePlaceholder: {
    width: 200,
    height: 24,
    borderRadius: Radius.sm,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  railPadding: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  railPlaceholder: {
    height: 24,
    borderRadius: Radius.xs,
    width: '90%',
  },
  sectionPadding: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  heroCardPlaceholder: {
    height: 180,
    borderRadius: Radius.lg,
  },
  heroTextPlaceholder: {
    width: '60%',
    height: 18,
    borderRadius: Radius.xs,
    marginTop: Spacing.sm,
  },
  sectionTitlePlaceholder: {
    width: 120,
    height: 20,
    borderRadius: Radius.xs,
    marginBottom: Spacing.md,
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  rowDetails: {
    flex: 1,
    gap: 6,
  },
  rowTitlePlaceholder: {
    width: '70%',
    height: 16,
    borderRadius: Radius.xs,
  },
  rowDescPlaceholder: {
    width: '90%',
    height: 12,
    borderRadius: Radius.xs,
  },
  rowPricePlaceholder: {
    width: '40%',
    height: 14,
    borderRadius: Radius.xs,
  },
  rowImagePlaceholder: {
    width: 84,
    height: 84,
    borderRadius: Radius.md,
  },
});
