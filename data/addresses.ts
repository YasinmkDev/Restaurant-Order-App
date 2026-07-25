import { DeliveryAddress } from '../types/order';
import { CUSTOMER_COORDINATES } from './routeCoordinates';

export const DEMO_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-home',
    title: 'Home',
    fullAddress: 'House 42, Street 14, Sector F-10/2, Islamabad',
    coordinates: CUSTOMER_COORDINATES,
  },
  {
    id: 'addr-work',
    title: 'Work',
    fullAddress: 'Floor 4, Evacuee Trust Complex, Blue Area, Islamabad',
    coordinates: {
      latitude: 33.7128,
      longitude: 73.0645,
    },
  },
  {
    id: 'addr-new',
    title: 'Silver Oaks (Custom)',
    fullAddress: 'Apartment 12B, Silver Oaks Residences, F-10 Markaz, Islamabad',
    coordinates: {
      latitude: 33.6955,
      longitude: 73.0135,
    },
  },
];
