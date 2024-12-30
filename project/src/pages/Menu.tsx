import { useState, useEffect } from 'react';
import { MenuCard } from '../components/MenuCard';
import { useCart } from '../hooks/useCart';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    loadMenuItems();
  }, []);

  async function loadMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*');

    if (error) {
      toast.error('Failed to load menu items');
      return;
    }

    setMenuItems(data);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={(item) => {
              addToCart(item);
              toast.success('Added to cart!');
            }}
          />
        ))}
      </div>
    </div>
  );
}