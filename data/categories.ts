export interface CategoryMeta {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  accent: string;
  bgLight: string;
  bgDark: string;
  heroImage: string;
  deliveryType: 'food' | 'grocery' | 'package';
}

export const CATEGORY_CATALOG: Record<string, CategoryMeta> = {
  biryani: {
    id: 'biryani',
    name: 'Biryani & Rice',
    subtitle: 'Steaming Dum Pukht, Savour pulao & spicy Sindhi pots',
    badge: '🔥 Top Craving',
    accent: '#FF6B00',
    bgLight: 'rgba(255, 107, 0, 0.08)',
    bgDark: 'rgba(255, 107, 0, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'food',
  },
  burgers: {
    id: 'burgers',
    name: 'Burgers & Subs',
    subtitle: 'Crispy zinger stacks, smashed beef & gourmet brioche',
    badge: '🍔 Bestsellers',
    accent: '#EF4444',
    bgLight: 'rgba(239, 68, 68, 0.08)',
    bgDark: 'rgba(239, 68, 68, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'food',
  },
  bakery: {
    id: 'bakery',
    name: 'Patties & Bakes',
    subtitle: 'Flaky golden puff pastries, croissants & fresh oven treats',
    badge: '🥐 Fresh Daily',
    accent: '#F59E0B',
    bgLight: 'rgba(245, 158, 11, 0.08)',
    bgDark: 'rgba(245, 158, 11, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'food',
  },
  pizza: {
    id: 'pizza',
    name: 'Artisan Pizza',
    subtitle: '48hr slow-ferment sourdough, spicy fajita & mozzarella',
    badge: '🍕 Woodfired',
    accent: '#E11D48',
    bgLight: 'rgba(225, 29, 72, 0.08)',
    bgDark: 'rgba(225, 29, 72, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'food',
  },
  chai: {
    id: 'chai',
    name: 'Karak Chai & Snacks',
    subtitle: 'Zafrani doodh patti, club sandwiches & samosa chaat',
    badge: '☕ Tea Lounge',
    accent: '#D97706',
    bgLight: 'rgba(217, 119, 6, 0.08)',
    bgDark: 'rgba(217, 119, 6, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'food',
  },
  groceries: {
    id: 'groceries',
    name: 'Daily Pantry',
    subtitle: 'Dairy essentials, fresh eggs, farm produce & staples',
    badge: '⚡ 15 Min Delivery',
    accent: '#10B981',
    bgLight: 'rgba(16, 185, 129, 0.08)',
    bgDark: 'rgba(16, 185, 129, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'grocery',
  },
  grocery: {
    id: 'grocery',
    name: 'Groceries & Mart',
    subtitle: 'Supermarket essentials & quick home supplies',
    badge: '⚡ 15 Min Delivery',
    accent: '#10B981',
    bgLight: 'rgba(16, 185, 129, 0.08)',
    bgDark: 'rgba(16, 185, 129, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'grocery',
  },
  courier: {
    id: 'courier',
    name: 'Fast Courier',
    subtitle: 'Direct doorstep parcel pickup and live-tracked dispatch',
    badge: '📍 Realtime Fleet',
    accent: '#8B5CF6',
    bgLight: 'rgba(139, 92, 246, 0.08)',
    bgDark: 'rgba(139, 92, 246, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'package',
  },
  package: {
    id: 'package',
    name: 'Parcel & Courier',
    subtitle: 'Direct doorstep pickup and express OTP delivery',
    badge: '📍 Realtime Fleet',
    accent: '#8B5CF6',
    bgLight: 'rgba(139, 92, 246, 0.08)',
    bgDark: 'rgba(139, 92, 246, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'package',
  },
  food: {
    id: 'food',
    name: 'Food & Dining',
    subtitle: '80+ curated kitchens, sizzling grills & bakery specialties',
    badge: '🍽️ All Menus',
    accent: '#FF6B00',
    bgLight: 'rgba(255, 107, 0, 0.08)',
    bgDark: 'rgba(255, 107, 0, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'food',
  },
};

export function getCategoryMeta(key: string): CategoryMeta {
  const normalized = key.toLowerCase().trim();
  if (CATEGORY_CATALOG[normalized]) {
    return CATEGORY_CATALOG[normalized];
  }
  return {
    id: normalized,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    subtitle: 'Explore curated culinary choices and essentials',
    accent: '#FF6B00',
    bgLight: 'rgba(255, 107, 0, 0.08)',
    bgDark: 'rgba(255, 107, 0, 0.16)',
    heroImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80',
    deliveryType: 'food',
  };
}
