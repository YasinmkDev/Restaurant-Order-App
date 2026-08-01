import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useOrderStore } from '../store/order.store';
import { OrderStatus } from '../types/order';

export function useOrderRealtime(orderId?: string) {
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const updateDriverLocation = useOrderStore((s) => s.updateDriverLocation);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !orderId) {
      return;
    }

    // Subscribe to order status updates in Supabase
    const orderSubscription = supabase
      .channel(`public:orders:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.status) {
            updateOrderStatus(payload.new.status as OrderStatus);
          }
        }
      )
      .subscribe();

    // Subscribe to delivery/courier coordinate updates in Supabase
    const deliverySubscription = supabase
      .channel(`public:deliveries:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'deliveries',
          filter: `order_id=eq.${orderId}`,
        },
        (payload: any) => {
          if (payload.new) {
            const { current_lat, current_lng, eta_seconds } = payload.new;
            if (current_lat && current_lng) {
              const etaMins = eta_seconds ? Math.round(eta_seconds / 60) : 10;
              updateDriverLocation(
                {
                  latitude: parseFloat(current_lat),
                  longitude: parseFloat(current_lng),
                },
                0.5,
                etaMins
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
      supabase.removeChannel(deliverySubscription);
    };
  }, [orderId]);
}
