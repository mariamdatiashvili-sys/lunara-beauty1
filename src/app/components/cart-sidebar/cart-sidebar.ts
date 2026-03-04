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

  getServiceImage(name: string): string {
    const lowerName = (name || '').toLowerCase();

    // Map exact categories to the new custom local assets
    if (lowerName.includes('massage')) return 'assets/images/massage_service.png';
    if (lowerName.includes('nail') || lowerName.includes('pedicure') || lowerName.includes('manicure')) return 'assets/images/nails_service.png';
    if (lowerName.includes('hair') || lowerName.includes('highlights') || lowerName.includes('balayage') || lowerName.includes('blow dry')) return 'assets/images/hair_service.png';
    if (lowerName.includes('eyelash') || lowerName.includes('eyebrow') || lowerName.includes('lash') || lowerName.includes('brow')) return 'assets/images/lashes_service.png';
    if (lowerName.includes('waxing')) return 'assets/images/waxing_service.png';
    if (lowerName.includes('skin rejuvenation')) return 'https://dermindy.com/wp-content/uploads/2016/03/ThinkstockPhotos-187923649.jpg';
    if (lowerName.includes('scrub')) return 'https://eminenceorganics.com/on/demandware.static/-/Library-Sites-EminenceSharedLibrary/default/dw98606515/images/blog/Blog%20Images/eminence-organics-professional-body-scrub.jpg';
    if (lowerName.includes('hand spa')) return 'https://images.squarespace-cdn.com/content/v1/5be7cbacf79392e09d2fc730/1707723741053-CVSRLBEC23Z10NWWFSV4/woman-soaking-her-hands-bowl-water-flowers-spa-treatment-product-female-feet-hand-spa-massage-pebble-perfumed-flowers-water-candles-relaxation-flat-lay-top-view.jpg';
    if (lowerName.includes('foot spa')) return 'https://viviannadayspa.com/cdn/shop/files/een_15.png?v=1698788020';
    if (lowerName.includes('lip') || lowerName.includes('li care')) return 'https://assets.curology.com/cdn-cgi/image/width=1920,height=1920,fit=contain,quality=100/https://images.ctfassets.net/zpqtflwhfuaa/6jq1pNPP6EZzefok3DiN0T/7af87209720357681b8669d8d27bb944/SparklingSugarPlum_05.jpg';
    if (lowerName.includes('laser')) return 'https://dermsurgery.net/wp-content/uploads/2024/09/Untitled-design-2024-09-12T105216.382.png';
    if (lowerName.includes('body polishing')) return 'https://envi.in/wp-content/uploads/2023/12/2-2-1.webp';
    if (lowerName.includes('eye contour')) return 'https://hospital.turquiesante.com/uploads/blogs/creme-contour-des-yeux-pourquoi-ce-soin-est-fondamental_62ab5c923340f.jpeg';
    if (lowerName.includes('skin hydration therapy') || lowerName.includes('collagen boost') || lowerName.includes('skin detox')) return 'https://www.406aesthetica.com/storage/2025/05/Laser-Therapy-by-Aesthetica-Medical-Spa-in-Kalispell-MT.webp';
    if (lowerName.includes('glow')) return 'https://www.isdin.com/en-US/blog/wp-content/uploads/2022/03/2024_06_GlowingSkin_IMG03.jpg';

    // Map popular keywords to original local assets
    if (lowerName.includes('acne')) return 'assets/images/acnetreatment.png';
    if (lowerName.includes('peel')) return 'assets/images/chemicalpeel.png';
    if (lowerName.includes('anti-aging') || lowerName.includes('anti aging')) return 'assets/images/antiageng.png';
    if (lowerName.includes('makeup')) return 'assets/images/makeup.png';
    if (lowerName.includes('facial') || lowerName.includes('microdermabrasion')) return 'https://themedermatology.com/wp-content/uploads/2024/08/dfb.png';

    // Default fallback if no match
    return 'assets/images/massage_service.png';
  }
}
