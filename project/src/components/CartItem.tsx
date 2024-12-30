import { OrderItem } from '../types';
import { formatCurrency } from '../utils/format';

interface CartItemProps {
  item: OrderItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img src={item.menuItem.image} alt={item.menuItem.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.menuItem.name}</h3>
        <p className="text-gray-600">{formatCurrency(item.menuItem.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.menuItem.id, Math.max(0, item.quantity - 1))}
            className="px-2 py-1 border rounded"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
            className="px-2 py-1 border rounded"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.menuItem.id)}
        className="text-red-600 hover:text-red-800"
      >
        Remove
      </button>
    </div>
  );
}