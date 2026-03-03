import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart-sidebar',
  imports: [CommonModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.css'
})
export class CartSidebarComponent {
  cartService = inject(CartService);

  cart = this.cartService.cart;
  total = this.cartService.totalPrice;
  isOpen = this.cartService.isOpen;

  close() {
    this.cartService.isOpen.set(false);
  }

  remove(index: number) {
    this.cartService.removeFromCart(index);
  }

  clear() {
    this.cartService.clearCart();
  }

  checkout() {
    if (this.cart().length === 0) {
      alert('Cart is empty!');
      return;
    }
    alert('Proceeding to checkout with total: GEL ' + this.total().toFixed(2));
    // Here we would implement real checkout logic
  }
}
