import { useEffect, useRef, useState } from 'react';
import { useOrderStore } from '../store/order.store';
import { useDemoStore } from '../store/demo.store';
import { DEMO_ROUTE_COORDINATES } from '../data/routeCoordinates';
import { calculateBearing } from '../lib/map';
import { Coordinates } from '../types/order';

interface CourierSimulationOptions {
  autoAdvance?: boolean;
  stepIntervalMs?: number;
}

export function useCourierSimulation({
  autoAdvance = true,
  stepIntervalMs = 2600,
}: CourierSimulationOptions = {}) {
  const currentOrder = useOrderStore((s) => s.currentOrder);
  const updateDriverLocation = useOrderStore((s) => s.updateDriverLocation);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const isDemoMode = useDemoStore((s) => s.isDemoMode);

  const [waypointIndex, setWaypointIndex] = useState(0);
  const [bearing, setBearing] = useState(45);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentOrder || !isDemoMode || !autoAdvance) return;

    if (currentOrder.status === 'delivered') return;

    intervalRef.current = setInterval(() => {
      setWaypointIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex >= DEMO_ROUTE_COORDINATES.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          updateOrderStatus('delivered');
          updateDriverLocation(
            DEMO_ROUTE_COORDINATES[DEMO_ROUTE_COORDINATES.length - 1],
            1.0,
            0 // ETA is 0 only upon delivery!
          );
          return prevIndex;
        }

        const prevCoord = DEMO_ROUTE_COORDINATES[prevIndex];
        const nextCoord = DEMO_ROUTE_COORDINATES[nextIndex];
        const newBearing = calculateBearing(prevCoord, nextCoord);
        setBearing(newBearing);

        const progress = nextIndex / (DEMO_ROUTE_COORDINATES.length - 1);

        // Guarantee ETA is never 0 before delivered
        const remainingMinutes = Math.max(
          1,
          Math.round((1 - progress) * 14)
        );

        // Status transitions aligned with route progress
        if (progress > 0.08 && currentOrder.status === 'placed') {
          updateOrderStatus('confirmed');
        } else if (progress > 0.22 && currentOrder.status === 'confirmed') {
          updateOrderStatus('preparing');
        } else if (progress > 0.40 && currentOrder.status === 'preparing') {
          updateOrderStatus('picked_up');
        } else if (progress > 0.55 && currentOrder.status === 'picked_up') {
          updateOrderStatus('out_for_delivery');
        }

        updateDriverLocation(nextCoord, progress, remainingMinutes);
        return nextIndex;
      });
    }, stepIntervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentOrder?.status, isDemoMode, autoAdvance, stepIntervalMs]);

  const courierCoordinates: Coordinates =
    currentOrder?.currentCoordinates ||
    DEMO_ROUTE_COORDINATES[waypointIndex] ||
    DEMO_ROUTE_COORDINATES[0];

  return {
    courierCoordinates,
    bearing,
    routeProgress: currentOrder?.routeProgress ?? 0,
    etaMinutes: currentOrder?.etaMinutes ?? 8,
    orderStatus: currentOrder?.status ?? 'out_for_delivery',
  };
}
