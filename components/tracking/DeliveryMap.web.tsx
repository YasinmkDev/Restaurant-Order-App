import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CourierMarker } from './CourierMarker';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from '../ui/AppText';
import { Radius, Spacing } from '../ui/theme';
import { Coordinates } from '../../types/order';
import {
  STORE_COORDINATES,
  CUSTOMER_COORDINATES,
} from '../../data/routeCoordinates';

interface DeliveryMapProps {
  courierCoordinates: Coordinates;
  bearing: number;
}

export function DeliveryMap({ courierCoordinates, bearing }: DeliveryMapProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#161614' : '#F4F3EE' },
      ]}
    >
      {/* Decorative Grid / Map Pattern */}
      <View style={styles.gridOverlay}>
        <View
          style={[
            styles.gridLineHorizontal,
            { top: '25%', borderColor: colors.borderSubtle },
          ]}
        />
        <View
          style={[
            styles.gridLineHorizontal,
            { top: '50%', borderColor: colors.borderSubtle },
          ]}
        />
        <View
          style={[
            styles.gridLineHorizontal,
            { top: '75%', borderColor: colors.borderSubtle },
          ]}
        />
        <View
          style={[
            styles.gridLineVertical,
            { left: '33%', borderColor: colors.borderSubtle },
          ]}
        />
        <View
          style={[
            styles.gridLineVertical,
            { left: '66%', borderColor: colors.borderSubtle },
          ]}
        />
      </View>

      {/* Route Path visual representation */}
      <View style={[styles.routePath, { borderColor: colors.accent }]} />

      {/* Merchant Pin */}
      <View
        style={[
          styles.markerWrapper,
          { top: '28%', left: '22%' },
        ]}
      >
        <View
          style={[
            styles.pinCircle,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <Ionicons name="storefront" size={14} color={colors.textPrimary} />
        </View>
        <AppText variant="micro" color="secondary" style={styles.markerLabel}>
          F-10 Markaz
        </AppText>
      </View>

      {/* Destination Pin */}
      <View
        style={[
          styles.markerWrapper,
          { top: '65%', right: '20%' },
        ]}
      >
        <View
          style={[
            styles.pinCircle,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <Ionicons name="home" size={14} color={colors.textPrimary} />
        </View>
        <AppText variant="micro" color="secondary" style={styles.markerLabel}>
          Sector F-10/2
        </AppText>
      </View>

      {/* Courier Marker */}
      <View
        style={[
          styles.markerWrapper,
          { top: '46%', left: '48%' },
        ]}
      >
        <CourierMarker bearing={bearing} />
        <View
          style={[
            styles.courierTag,
            { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle },
          ]}
        >
          <AppText variant="micro" color="accent">
            In Transit
          </AppText>
        </View>
      </View>

      {/* Live Coordinates telemetry badge */}
      <View
        style={[
          styles.telemetryBadge,
          {
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Ionicons name="navigate-outline" size={12} color={colors.accent} />
        <AppText variant="micro" color="secondary" style={{ marginLeft: 4 }}>
          {courierCoordinates.latitude.toFixed(4)}°N, {courierCoordinates.longitude.toFixed(4)}°E
        </AppText>
      </View>

      {/* Recenter Button */}
      <Pressable
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Recenter map"
        style={({ pressed }) => [
          styles.recenterButton,
          {
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.borderSubtle,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <Ionicons name="locate" size={20} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.4,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomWidth: 1,
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRightWidth: 1,
  },
  routePath: {
    position: 'absolute',
    top: '32%',
    left: '28%',
    width: '46%',
    height: '36%',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
  },
  markerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  markerLabel: {
    marginTop: 4,
    fontWeight: '600',
  },
  courierTag: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  telemetryBadge: {
    position: 'absolute',
    top: 72,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  recenterButton: {
    position: 'absolute',
    top: 72,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
});
