import { create } from 'zustand';
import { MenuItem, OrderItem } from '../types';

interface CartStore {
  items: OrderItem[];
  total: number;
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  total: 0,
  addToCart: (menuItem) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.menuItem.id === menuItem.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.menuItem.id === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + menuItem.price,
        };
      }

      return {
        items: [...state.items, { menuItem, quantity: 1 }],
        total: state.total + menuItem.price,
      };
    }),
  updateQuantity: (itemId, quantity) =>
    set((state) => {
      const item = state.items.find((i) => i.menuItem.id === itemId);
      if (!item) return state;

      const quantityDiff = quantity - item.quantity;
      
      if (quantity === 0) {
        return {
          items: state.items.filter((i) => i.menuItem.id !== itemId),
          total: state.total - item.menuItem.price * item.quantity,
        };
      }

      return {
        items: state.items.map((i) =>
          i.menuItem.id === itemId ? { ...i, quantity } : i
        ),
        total: state.total + item.menuItem.price * quantityDiff,
      };
    }),
  removeItem: (itemId) =>
    set((state) => {
      const item = state.items.find((i) => i.menuItem.id === itemId);
      if (!item) return state;

      return {
        items: state.items.filter((i) => i.menuItem.id !== itemId),
        total: state.total - item.menuItem.price * item.quantity,
      };
    }),
  clearCart: () => set({ items: [], total: 0 }),
}));