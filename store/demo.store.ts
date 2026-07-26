import { create } from 'zustand';
import { useOrderStore } from './order.store';
import { getNextStatus } from '../lib/orderStatus';
import { DEMO_ROUTE_COORDINATES } from '../data/routeCoordinates';

interface DemoState {
  isDemoMode: boolean;
  simulationSpeed: number;
  toggleDemoMode: () => void;
  advanceStatus: () => void;
  restartSimulation: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemoMode: true,
  simulationSpeed: 1,

  toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),

  advanceStatus: () => {
    const currentOrder = useOrderStore.getState().currentOrder;
    if (!currentOrder) return;
    const next = getNextStatus(currentOrder.status);
    useOrderStore.getState().updateOrderStatus(next);
  },

  restartSimulation: () => {
    const orderStore = useOrderStore.getState();
    if (orderStore.currentOrder) {
      orderStore.updateOrderStatus('out_for_delivery');
      orderStore.updateDriverLocation(DEMO_ROUTE_COORDINATES[0], 0, 15);
    }
  },
}));
