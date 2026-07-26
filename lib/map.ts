import { Coordinates } from '../types/order';

/**
 * Calculates straight-line distance in kilometers between two lat/lng coordinates (Haversine formula).
 */
export function calculateDistanceKm(c1: Coordinates, c2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(c2.latitude - c1.latitude);
  const dLon = toRad(c2.longitude - c1.longitude);
  const lat1 = toRad(c1.latitude);
  const lat2 = toRad(c2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates bearing / compass heading angle (in degrees 0-360) from start to end coordinate.
 */
export function calculateBearing(start: Coordinates, end: Coordinates): number {
  const startLat = toRad(start.latitude);
  const startLng = toRad(start.longitude);
  const endLat = toRad(end.latitude);
  const endLng = toRad(end.longitude);

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const brng = Math.atan2(y, x);
  return (toDeg(brng) + 360) % 360;
}

/**
 * Linear interpolation between two coordinates given a fractional progress t (0.0 to 1.0).
 */
export function interpolateCoordinate(
  c1: Coordinates,
  c2: Coordinates,
  t: number
): Coordinates {
  const clampedT = Math.max(0, Math.min(1, t));
  return {
    latitude: c1.latitude + (c2.latitude - c1.latitude) * clampedT,
    longitude: c1.longitude + (c2.longitude - c1.longitude) * clampedT,
  };
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}
