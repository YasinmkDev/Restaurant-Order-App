import { Coordinates } from '../types/order';

/**
 * Predefined realistic route coordinates for simulated delivery tracking.
 * Path from Store (F-10 Markaz) to Customer Home (Street 14, F-10/2, Islamabad).
 */
export const STORE_COORDINATES: Coordinates = {
  latitude: 33.6932,
  longitude: 73.0118,
};

export const CUSTOMER_COORDINATES: Coordinates = {
  latitude: 33.6825,
  longitude: 73.0298,
};

export const DEMO_ROUTE_COORDINATES: Coordinates[] = [
  { latitude: 33.6932, longitude: 73.0118 }, // Store origin
  { latitude: 33.6925, longitude: 73.0132 },
  { latitude: 33.6914, longitude: 73.0150 },
  { latitude: 33.6902, longitude: 73.0175 },
  { latitude: 33.6890, longitude: 73.0198 },
  { latitude: 33.6881, longitude: 73.0215 },
  { latitude: 33.6872, longitude: 73.0232 },
  { latitude: 33.6860, longitude: 73.0250 },
  { latitude: 33.6848, longitude: 73.0268 },
  { latitude: 33.6836, longitude: 73.0282 },
  { latitude: 33.6825, longitude: 73.0298 }, // Customer destination
];
