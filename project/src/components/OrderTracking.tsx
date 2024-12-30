import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import toast from 'react-hot-toast';

interface Props {
  orderId: string;
}

export function OrderTracking({ orderId }: Props) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrder();
    
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          setOrder(payload.new as Order);
          toast.success('Order status updated!');
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [orderId]);

  async function loadOrder() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      toast.error('Failed to load order');
      return;
    }

    setOrder(data);
  }

  if (!order) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-bold mb-4">Order Status</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            order.status === 'pending' ? 'bg-yellow-500' :
            order.status === 'confirmed' ? 'bg-blue-500' :
            order.status === 'preparing' ? 'bg-orange-500' :
            'bg-green-500'
          }`} />
          <span className="capitalize">{order.status}</span>
        </div>
      </div>
    </div>
  );
}