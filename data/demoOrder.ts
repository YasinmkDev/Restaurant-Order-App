import { Order } from '../types/order';
import { DEMO_ROUTE_COORDINATES, CUSTOMER_COORDINATES } from './routeCoordinates';

export const INITIAL_DEMO_ORDER: Order = {
  id: 'order-sw-9842',
  customerName: 'Ahmad Khan',
  status: 'out_for_delivery',
  items: [
    {
      cartItemId: 'item-1',
      productId: 'prod-savour-pulao',
      storeId: 'store-savour-1',
      title: 'Savour Special Chicken Pulao',
      quantity: 2,
      basePrice: 450,
      selectedAddOns: [
        { id: 'opt-coke', label: 'Coke 345ml chilled can', price: 90 },
        { id: 'opt-extra-shami', label: 'Extra Shami Kabab (1 pc)', price: 110 },
      ],
      notes: 'Please pack mint raita separately.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    },
  ],
  subtotal: 1300,
  deliveryFee: 99,
  total: 1399,
  deliveryAddress: {
    id: 'addr-home',
    title: 'Home',
    fullAddress: 'House 42, Street 14, Sector F-10/2, Islamabad',
    coordinates: CUSTOMER_COORDINATES,
  },
  paymentMethod: 'cash_on_delivery',
  driver: {
    id: 'driver-ali-1',
    name: 'Ali Raza',
    phone: '+92 300 5551234',
    rating: 4.9,
    vehicleModel: 'Honda CD 70 (Red)',
    vehiclePlate: 'ICT-RI-842',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  createdAt: '2026-10-03T12:30:00Z',
  etaMinutes: 8,
  currentCoordinates: DEMO_ROUTE_COORDINATES[5],
  routeProgress: 0.5,
};
