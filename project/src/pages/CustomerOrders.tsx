import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { OrderTracking } from '../components/OrderTracking';
import { formatCurrency } from '../utils/format';

export function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold">Order #{order.id.slice(0, 8)}</h3>
              <span className="text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <OrderTracking orderId={order.id} />
            <div className="mt-4">
              <h4 className="font-medium mb-2">Items:</h4>
              {order.items_json.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between">
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span>{formatCurrency(item.menuItem.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right font-bold">
              Total: {formatCurrency(order.total_amount)}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-gray-600 text-center">No orders yet</p>
        )}
      </div>
    </div>
  );
}