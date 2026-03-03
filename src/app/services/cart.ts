import { Injectable, signal, computed, effect } from '@angular/core';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = signal<CartItem[]>(this.loadCart());
  isOpen = signal(false);

  totalPrice = computed(() => this.cart().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  itemCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));

  constructor() {
    // Automatically save to localStorage whenever cart changes
    effect(() => {
      localStorage.setItem('lunaraCart', JSON.stringify(this.cart()));
    });
  }

  addToCart(name: string, price: number) {
    this.cart.update(items => {
      // Check if item exists
      const existingItem = items.find(item => item.name === name);
      if (existingItem) {
        // Increment quantity
        return items.map(item =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item
        return [...items, { name, price, quantity: 1 }];
      }
    });
  }

  removeFromCart(index: number) {
    this.cart.update(items => items.filter((_, i) => i !== index));
  }

  clearCart() {
    this.cart.set([]);
  }

  private loadCart(): CartItem[] {
    const data = localStorage.getItem('lunaraCart');
    return data ? JSON.parse(data) : [];
  }
}
