import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/format';

export function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
    
    // Subscribe to new orders
    const ordersSubscription = supabase
      .channel('custom-orders-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('New order received:', payload);
          const newOrder = payload.new as Order;
          setOrders(currentOrders => [newOrder, ...currentOrders]);
          toast.success('New order received!');
          
          // Play notification sound
          const audio = new Audio('/notification.mp3');
          audio.play().catch(console.error);
        }
      )
      .subscribe();

    // Subscribe to order updates
    const updatesSubscription = supabase
      .channel('order-updates-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setOrders(currentOrders =>
            currentOrders.map(order =>
              order.id === updatedOrder.id ? updatedOrder : order
            )
          );
        }
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
      updatesSubscription.unsubscribe();
    };
  }, []);

  async function loadOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    }
  }

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Order status updated');
      
      // Update local state
      setOrders(currentOrders =>
        currentOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">
                  Order #{order.id.slice(0, 8)}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Customer Details:</h4>
                  <p>Name: {order.customer_name}</p>
                  <p>Phone: {order.customer_phone}</p>
                  <p>Address: {order.delivery_address}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Order Items:</h4>
                  {order.items_json.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span>{formatCurrency(item.menuItem.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="mt-2 font-bold">
                    Total: {formatCurrency(order.total_amount)}
                  </div>
                </div>
              </div>
              <div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                  className="border rounded-md p-2 bg-white shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-center text-gray-500">No orders yet</p>
        )}
      </div>
    </div>
  );
}