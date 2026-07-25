import { Product } from '../types/product';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-savour-pulao',
    storeId: 'store-savour-1',
    name: 'Savour Special Chicken Pulao',
    description: 'Steaming basmati pulao served with a spiced roasted chicken quarter, two tender shami kababs, fresh mint raita, and sliced kachumber salad.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    category: 'food',
    rating: 4.9,
    preparationTime: '15 min',
    customizationGroups: [
      {
        id: 'grp-drink',
        title: 'Choose your beverage',
        required: true,
        options: [
          { id: 'opt-coke', label: 'Coke 345ml chilled can', price: 90 },
          { id: 'opt-sprite', label: 'Sprite 345ml chilled can', price: 90 },
          { id: 'opt-water', label: 'Mineral Water 500ml', price: 50 },
          { id: 'opt-no-drink', label: 'No beverage', price: 0 },
        ],
      },
      {
        id: 'grp-addons',
        title: 'Add-ons & sides',
        required: false,
        options: [
          { id: 'opt-extra-shami', label: 'Extra Shami Kabab (1 pc)', price: 110 },
          { id: 'opt-extra-raita', label: 'Extra Mint Zeera Raita', price: 40 },
          { id: 'opt-extra-salad', label: 'Extra Fresh Onion & Cucumber Salad', price: 40 },
        ],
      },
    ],
  },
  {
    id: 'prod-tehzeeb-patties',
    storeId: 'store-tehzeeb-2',
    name: 'Tehzeeb Chicken Puff Patties (Box of 4)',
    description: 'Freshly baked golden puff pastry stuffed with Tehzeeb’s signature seasoned minced chicken and mild cracked black pepper.',
    basePrice: 560,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    category: 'food',
    rating: 4.8,
    preparationTime: '10 min',
    customizationGroups: [
      {
        id: 'grp-sauce',
        title: 'Dipping sauce',
        required: true,
        options: [
          { id: 'opt-garlic-mayo', label: 'Garlic Mayo Dip', price: 40 },
          { id: 'opt-chili-garlic', label: 'Chili Garlic Dip', price: 30 },
          { id: 'opt-standard-ketchup', label: 'Classic Tomato Ketchup', price: 0 },
        ],
      },
      {
        id: 'grp-sweet',
        title: 'Bakery treat',
        required: false,
        options: [
          { id: 'opt-eclair', label: 'Chocolate Cream Éclair', price: 180 },
          { id: 'opt-fudge-brownie', label: 'Walnut Fudge Brownie', price: 220 },
        ],
      },
    ],
  },
  {
    id: 'prod-chaaye-sandwich',
    storeId: 'store-chaaye-4',
    name: 'Chaaye Khana Classic Club Sandwich',
    description: 'Triple-decker toasted whole-wheat sandwich layered with grilled herb chicken breast, fried egg, cheddar slice, crisp lettuce, and thick-cut fries.',
    basePrice: 680,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    category: 'food',
    rating: 4.8,
    preparationTime: '20 min',
    customizationGroups: [
      {
        id: 'grp-tea',
        title: 'Signature tea',
        required: true,
        options: [
          { id: 'opt-karak-chai', label: 'Special Doodh Patti Karak Chai', price: 160 },
          { id: 'opt-peshawari-qehwa', label: 'Peshawari Cardamom Qehwa', price: 120 },
          { id: 'opt-no-tea', label: 'No hot drink', price: 0 },
        ],
      },
      {
        id: 'grp-fries',
        title: 'Sides',
        required: false,
        options: [
          { id: 'opt-masala-fries', label: 'Upgrade to Peri-Peri Masala Fries', price: 80 },
          { id: 'opt-extra-cheese', label: 'Extra Sharp Cheddar Slice', price: 70 },
        ],
      },
    ],
  },
  {
    id: 'prod-dwatson-essentials',
    storeId: 'store-dwatson-3',
    name: 'Breakfast Essentials Pantry Pack',
    description: 'Everyday morning pack: Olper’s Full Cream Milk 1L, Dawn Large Whole Wheat Bread, and a dozen certified farm fresh white eggs.',
    basePrice: 620,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    category: 'grocery',
    rating: 4.7,
    preparationTime: '15 min',
    customizationGroups: [
      {
        id: 'grp-milk-type',
        title: 'Milk preference',
        required: true,
        options: [
          { id: 'opt-olpers', label: 'Olper’s UHT Milk 1L', price: 0 },
          { id: 'opt-milkpak', label: 'Nestlé MilkPak 1L', price: 0 },
          { id: 'opt-anhar', label: 'Anhaar Fresh Pasteurized Milk 1L', price: 40 },
        ],
      },
      {
        id: 'grp-pantry-add',
        title: 'Pantry additions',
        required: false,
        options: [
          { id: 'opt-butter', label: 'Nurpur Salted Butter 200g', price: 340 },
          { id: 'opt-tea-pack', label: 'Tapal Danedar Tea 450g', price: 680 },
        ],
      },
    ],
  },
  {
    id: 'prod-express-courier',
    storeId: 'store-express-5',
    name: 'Express Same-Day Document Dispatch',
    description: 'Doorstep pickup from your location and express dispatch directly to any office or residence across Islamabad and Rawalpindi with real-time OTP handover.',
    basePrice: 350,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    category: 'package',
    rating: 4.9,
    preparationTime: '10 min',
    customizationGroups: [
      {
        id: 'grp-speed',
        title: 'Delivery priority',
        required: true,
        options: [
          { id: 'opt-standard', label: 'Standard Express (within 90 min)', price: 0 },
          { id: 'opt-urgent', label: 'Urgent Direct Rider (within 45 min)', price: 150 },
        ],
      },
      {
        id: 'grp-handling',
        title: 'Handling options',
        required: false,
        options: [
          { id: 'opt-waterproof', label: 'Waterproof Tamper-Evident Pouch', price: 50 },
          { id: 'opt-fragile', label: 'Fragile / High-Priority Labeling', price: 40 },
        ],
      },
    ],
  },
];
