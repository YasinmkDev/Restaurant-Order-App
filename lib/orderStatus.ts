import { OrderStatus } from '../types/order';

export type StatusMeta = {
  key: OrderStatus;
  label: string;
  description: string;
  iconName: string;
  stepIndex: number;
};

export const ORDER_STATUS_ORDER: OrderStatus[] = [
  'placed',
  'confirmed',
  'preparing',
  'picked_up',
  'out_for_delivery',
  'delivered',
];

export const ORDER_STATUS_METADATA: Record<OrderStatus, StatusMeta> = {
  placed: {
    key: 'placed',
    label: 'We received your order',
    description: 'Your order was submitted and forwarded to the store.',
    iconName: 'receipt-outline',
    stepIndex: 0,
  },
  confirmed: {
    key: 'confirmed',
    label: 'The store confirmed your order',
    description: 'The kitchen accepted your ticket and started assembly.',
    iconName: 'checkmark-circle-outline',
    stepIndex: 1,
  },
  preparing: {
    key: 'preparing',
    label: 'Your order is being prepared',
    description: 'Items are being freshly cooked and packed.',
    iconName: 'flame-outline',
    stepIndex: 2,
  },
  picked_up: {
    key: 'picked_up',
    label: 'Ali picked up your order',
    description: 'Your courier verified the parcel and departed.',
    iconName: 'bag-check-outline',
    stepIndex: 3,
  },
  out_for_delivery: {
    key: 'out_for_delivery',
    label: 'Ali is on the way',
    description: 'Your courier is in transit toward your address.',
    iconName: 'bicycle-outline',
    stepIndex: 4,
  },
  delivered: {
    key: 'delivered',
    label: 'Delivered — enjoy your order',
    description: 'Handed over directly at your doorstep.',
    iconName: 'home-outline',
    stepIndex: 5,
  },
  cancelled: {
    key: 'cancelled',
    label: 'Order cancelled',
    description: 'This delivery was cancelled.',
    iconName: 'close-circle-outline',
    stepIndex: -1,
  },
};

export function getStatusStepIndex(status: OrderStatus): number {
  return ORDER_STATUS_METADATA[status]?.stepIndex ?? 0;
}

export function getNextStatus(currentStatus: OrderStatus): OrderStatus {
  const currentIndex = ORDER_STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= ORDER_STATUS_ORDER.length - 1) {
    return 'delivered';
  }
  return ORDER_STATUS_ORDER[currentIndex + 1];
}
