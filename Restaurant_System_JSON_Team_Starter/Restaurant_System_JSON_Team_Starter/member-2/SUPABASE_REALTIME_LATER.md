# Real-Time Order Alert Engine — Supabase stage (not yet connected)

This is the user's **selected unique feature**, separate from the current 4-second JSON polling demo.
Only integrate after the group leader switches the project to Supabase PostgreSQL, configures RLS and agrees on actual column names.

The example below assumes `orders` has columns `id`, `restaurant_id`, `order_status`, and the owner's browser already has a secure Supabase client. Adapt these to the final DB schema. Do NOT place it inside the current checker-controlled `member-2/.../functions` folder yet.

```typescript
'use client';
import { useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

type PendingOrder = { id: string; restaurant_id: string; order_status: string };

export function useRealtimeOrderAlert(
  supabase: SupabaseClient,
  restaurantId: string | null,
  onNewOrder: (order: PendingOrder) => void
) {
  const seen = useRef(new Set<string>());

  useEffect(() => {
    seen.current.clear();
    if (!restaurantId) return;

    const channel = supabase.channel(`restaurant-orders-${restaurantId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: `restaurant_id=eq.${restaurantId}`,
      }, (payload) => {
        const order = payload.new as PendingOrder;
        if (order.order_status !== 'pending') return;
        if (order.restaurant_id !== restaurantId || seen.current.has(order.id)) return;
        seen.current.add(order.id);
        onNewOrder(order);
      })
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [supabase, restaurantId, onNewOrder]);
}
```

The owner screen then shows a flashing banner and calls a Web Audio chime after **Enable sound** has been clicked. Keep browser autoplay limitations and `prefers-reduced-motion` in mind.

**Important:** A client-side filter is NOT a security boundary. Supabase Row Level Security must allow an owner to receive only their restaurant's order rows. Also enable Realtime publication for the orders table and verify insert events with real owner accounts. The realtime hook runs only while the dashboard is open.
