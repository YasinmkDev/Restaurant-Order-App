import { CartItem } from './cart';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type DeliveryAddress = {
  id: string;
  title: string;
  fullAddress: string;
  coordinates: Coordinates;
};

export type Driver = {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicleModel: string;
  vehiclePlate: string;
  avatar: string;
};

export type Order = {
  id: string;
  customerName: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: 'cash_on_delivery' | 'credit_card' | 'wallet';
  driver: Driver;
  createdAt: string;
  etaMinutes: number;
  currentCoordinates: Coordinates;
  routeProgress: number; // 0.0 to 1.0
};
