import { AddOnOption } from './product';

export type CartItem = {
  cartItemId: string;
  productId: string;
  storeId: string;
  title: string;
  quantity: number;
  basePrice: number;
  selectedAddOns: AddOnOption[];
  notes?: string;
  image: string;
};

export type CartSummary = {
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
};
