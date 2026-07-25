export type DeliveryCategory = 'food' | 'grocery' | 'package';

export type Store = {
  id: string;
  name: string;
  category: DeliveryCategory;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  address: string;
  featured?: boolean;
};
