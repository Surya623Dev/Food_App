import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/CartItem';
import { CustomerDetailsForm } from '../components/CustomerDetailsForm';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/format';

export function Cart() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!customerDetails.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!customerDetails.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!customerDetails.address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          items_json: items,
          total_amount: total,
          status: 'pending',
          delivery_address: customerDetails.address,
          customer_name: customerDetails.name,
          customer_phone: customerDetails.phone
        });

      if (error) throw error;

      clearCart();
      toast.success('Order placed successfully! Vendor has been notified.');
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.menuItem.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <CustomerDetailsForm
              details={customerDetails}
              onChange={setCustomerDetails}
            />
            <div className="text-xl font-bold">Total: {formatCurrency(total)}</div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}