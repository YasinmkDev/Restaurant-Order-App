export type AddOnOption = {
  id: string;
  label: string;
  price: number;
};

export type CustomizationGroup = {
  id: string;
  title: string;
  required: boolean;
  minSelections?: number;
  maxSelections?: number;
  options: AddOnOption[];
};

export type Product = {
  id: string;
  storeId: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  rating: number;
  preparationTime: string;
  category: 'food' | 'grocery' | 'package';
  subCategory?: string;
  tags?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  customizationGroups?: CustomizationGroup[];
};
