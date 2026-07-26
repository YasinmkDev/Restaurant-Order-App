import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus, Coordinates, DeliveryAddress } from '../types/order';
import { INITIAL_DEMO_ORDER } from '../data/demoOrder';
import { DEMO_ADDRESSES } from '../data/addresses';

export type PaymentMethod = 'cash_on_delivery' | 'credit_card' | 'wallet';

interface OrderState {
  currentOrder: Order | null;
  selectedAddress: DeliveryAddress;
  selectedPaymentMethod: PaymentMethod;
  setSelectedAddress: (address: DeliveryAddress) => void;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  setCurrentOrder: (order: Order | null) => void;
  updateOrderStatus: (status: OrderStatus) => void;
  updateDriverLocation: (
    coords: Coordinates,
    routeProgress: number,
    etaMinutes: number
  ) => void;
  resetToDemoOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      currentOrder: INITIAL_DEMO_ORDER,
      selectedAddress: DEMO_ADDRESSES[0],
      selectedPaymentMethod: 'cash_on_delivery',

      setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
      setSelectedPaymentMethod: (selectedPaymentMethod) => set({ selectedPaymentMethod }),

      setCurrentOrder: (order) => set({ currentOrder: order }),

      updateOrderStatus: (status) =>
        set((state) => {
          if (!state.currentOrder) return state;
          return {
            currentOrder: {
              ...state.currentOrder,
              status,
            },
          };
        }),

      updateDriverLocation: (currentCoordinates, routeProgress, etaMinutes) =>
        set((state) => {
          if (!state.currentOrder) return state;
          return {
            currentOrder: {
              ...state.currentOrder,
              currentCoordinates,
              routeProgress,
              etaMinutes,
            },
          };
        }),

      resetToDemoOrder: () => set({ currentOrder: INITIAL_DEMO_ORDER }),
    }),
    {
      name: 'swift-courier-order-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedAddress: state.selectedAddress,
        selectedPaymentMethod: state.selectedPaymentMethod,
        currentOrder: state.currentOrder,
      }),
    }
  )
);
