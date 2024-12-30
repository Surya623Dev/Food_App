import { Observable } from '@nativescript/core';
import { MenuItem } from '../../models/order.model';

export class MenuViewModel extends Observable {
  private _menuItems: MenuItem[] = [];
  private _cart: MenuItem[] = [];

  constructor() {
    super();
    this.loadMenuItems();
  }

  get menuItems(): MenuItem[] {
    return this._menuItems;
  }

  private async loadMenuItems() {
    // In a real app, this would fetch from an API
    this._menuItems = [
      {
        id: '1',
        name: 'Burger',
        description: 'Delicious beef burger with cheese',
        price: 9.99,
        image: 'res://burger'
      },
      {
        id: '2',
        name: 'Pizza',
        description: 'Margherita pizza with fresh basil',
        price: 12.99,
        image: 'res://pizza'
      }
    ];
    this.notifyPropertyChange('menuItems', this._menuItems);
  }

  onAddToCart(args) {
    const item = args.object.bindingContext;
    this._cart.push(item);
    // Show toast or notification
  }

  onViewCart() {
    // Navigate to cart page
  }
}