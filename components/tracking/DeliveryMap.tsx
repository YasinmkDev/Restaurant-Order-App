import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CourierMarker } from './CourierMarker';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from '../ui/AppText';
import { Radius } from '../ui/theme';
import { Coordinates } from '../../types/order';
import {
  STORE_COORDINATES,
  CUSTOMER_COORDINATES,
} from '../../data/routeCoordinates';

/* ============================================================================
 * NATIVE MAPLIBRE IMPLEMENTATION (REQUIRES EXPO DEVELOPMENT BUILD)
 * Uncomment this block when building a standalone APK or custom dev client
 * (`npx expo run:android` / `npx expo run:ios`).
 *
 * import {
 *   Map,
 *   Camera,
 *   Marker,
 *   GeoJSONSource,
 *   Layer,
 *   type CameraRef,
 * } from '@maplibre/maplibre-react-native';
 *
 * const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
 * ============================================================================ */

interface DeliveryMapProps {
  courierCoordinates: Coordinates;
  bearing: number;
}

/**
 * Pure React Native delivery map simulator for Expo Go.
 * Zero native binary dependencies — works immediately in Expo Go, Android, iOS, and Web.
 */
export function DeliveryMap({ courierCoordinates, bearing }: DeliveryMapProps) {
  const { colors, isDark } = useTheme();

  // Normalize courier coordinates between merchant and customer bounds for animated screen positioning
  const minLat = 33.682;
  const maxLat = 33.698;
  const minLng = 73.018;
  const maxLng = 73.029;

  const latProgress = Math.max(0, Math.min(1, (courierCoordinates.latitude - minLat) / (maxLat - minLat)));
  const lngProgress = Math.max(0, Math.min(1, (courierCoordinates.longitude - minLng) / (maxLng - minLng)));

  // Invert latitude for top offset (higher latitude = north = top of screen)
  const courierTop = `${Math.round((1 - latProgress) * 45 + 24)}%` as const;
  const courierLeft = `${Math.round(lngProgress * 45 + 24)}%` as const;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#141412' : '#F5F4EE' },
      ]}
    >
      {/* City Street Grid lines */}
      <View style={styles.gridOverlay}>
        <View style={[styles.gridLineHorizontal, { top: '22%', borderColor: colors.borderSubtle }]} />
        <View style={[styles.gridLineHorizontal, { top: '44%', borderColor: colors.borderSubtle }]} />
        <View style={[styles.gridLineHorizontal, { top: '66%', borderColor: colors.borderSubtle }]} />
        <View style={[styles.gridLineHorizontal, { top: '88%', borderColor: colors.borderSubtle }]} />
        <View style={[styles.gridLineVertical, { left: '25%', borderColor: colors.borderSubtle }]} />
        <View style={[styles.gridLineVertical, { left: '50%', borderColor: colors.borderSubtle }]} />
        <View style={[styles.gridLineVertical, { left: '75%', borderColor: colors.borderSubtle }]} />
      </View>

      {/* Route Path visual representation */}
      <View style={[styles.routePath, { borderColor: colors.accent }]} />

      {/* Merchant Pin (Al-Haj Chicken & Grills, F-10 Markaz) */}
      <View style={[styles.markerWrapper, { top: '22%', left: '22%' }]}>
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

      {/* Customer Destination Pin */}
      <View style={[styles.markerWrapper, { top: '70%', right: '22%' }]}>
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

      {/* Moving Courier Marker with dynamic position along coordinates */}
      <View
        style={[
          styles.markerWrapper,
          {
            top: courierTop as any,
            left: courierLeft as any,
          },
        ]}
      >
        <CourierMarker bearing={bearing} />
        <View
          style={[
            styles.courierTag,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <AppText variant="micro" color="accent" style={{ fontWeight: '700' }}>
            In Transit
          </AppText>
        </View>
      </View>

      {/* Live GPS Telemetry Badge */}
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

      {/* Expo Go indicator badge */}
      <View
        style={[
          styles.modeBadge,
          {
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Ionicons name="phone-portrait-outline" size={12} color={colors.textSecondary} />
        <AppText variant="micro" color="secondary" style={{ marginLeft: 4 }}>
          Expo Go Mode
        </AppText>
      </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.35,
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
    top: '26%',
    left: '26%',
    width: '48%',
    height: '46%',
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
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  telemetryBadge: {
    position: 'absolute',
    top: 68,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  modeBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
});
