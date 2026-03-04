import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';

@Component({
    selector: 'app-favorites-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './favorites-sidebar.html',
    styleUrl: './favorites-sidebar.css'
})
export class FavoritesSidebarComponent {
    favoritesService = inject(FavoritesService);
    cartService = inject(CartService);
    router = inject(Router);

    favorites = this.favoritesService.favorites;
    isOpen = this.favoritesService.isOpen;

    close() {
        this.favoritesService.isOpen.set(false);
    }

    remove(id: string) {
        this.favoritesService.removeFavorite(id);
    }

    addToCart(item: any) {
        this.cartService.addToCart(item.name, item.price);
        this.close();
        this.cartService.isOpen.set(true);
    }

    viewServices() {
        this.close();
        this.router.navigate(['/services']);
    }

    getServiceImage(service: any): string {
        if (service.image && service.image.trim() !== '') {
            return service.image;
        }

        const name = (service.name || '').toLowerCase();

        // Map exact categories to the new custom local assets
        if (name.includes('massage')) return 'assets/images/massage_service.png';
        if (name.includes('nail') || name.includes('pedicure') || name.includes('manicure')) return 'assets/images/nails_service.png';
        if (name.includes('hair') || name.includes('highlights') || name.includes('balayage') || name.includes('blow dry')) return 'assets/images/hair_service.png';
        if (name.includes('eyelash') || name.includes('eyebrow') || name.includes('lash') || name.includes('brow')) return 'assets/images/lashes_service.png';
        if (name.includes('waxing')) return 'assets/images/waxing_service.png';
        if (name.includes('skin rejuvenation')) return 'https://dermindy.com/wp-content/uploads/2016/03/ThinkstockPhotos-187923649.jpg';
        if (name.includes('scrub')) return 'https://eminenceorganics.com/on/demandware.static/-/Library-Sites-EminenceSharedLibrary/default/dw98606515/images/blog/Blog%20Images/eminence-organics-professional-body-scrub.jpg';
        if (name.includes('hand spa')) return 'https://images.squarespace-cdn.com/content/v1/5be7cbacf79392e09d2fc730/1707723741053-CVSRLBEC23Z10NWWFSV4/woman-soaking-her-hands-bowl-water-flowers-spa-treatment-product-female-feet-hand-spa-massage-pebble-perfumed-flowers-water-candles-relaxation-flat-lay-top-view.jpg';
        if (name.includes('foot spa')) return 'https://viviannadayspa.com/cdn/shop/files/een_15.png?v=1698788020';
        if (name.includes('lip') || name.includes('li care')) return 'https://assets.curology.com/cdn-cgi/image/width=1920,height=1920,fit=contain,quality=100/https://images.ctfassets.net/zpqtflwhfuaa/6jq1pNPP6EZzefok3DiN0T/7af87209720357681b8669d8d27bb944/SparklingSugarPlum_05.jpg';
        if (name.includes('laser')) return 'https://dermsurgery.net/wp-content/uploads/2024/09/Untitled-design-2024-09-12T105216.382.png';
        if (name.includes('body polishing')) return 'https://envi.in/wp-content/uploads/2023/12/2-2-1.webp';
        if (name.includes('eye contour')) return 'https://hospital.turquiesante.com/uploads/blogs/creme-contour-des-yeux-pourquoi-ce-soin-est-fondamental_62ab5c923340f.jpeg';
        if (name.includes('skin hydration therapy') || name.includes('collagen boost') || name.includes('skin detox')) return 'https://www.406aesthetica.com/storage/2025/05/Laser-Therapy-by-Aesthetica-Medical-Spa-in-Kalispell-MT.webp';
        if (name.includes('glow')) return 'https://www.isdin.com/en-US/blog/wp-content/uploads/2022/03/2024_06_GlowingSkin_IMG03.jpg';

        // Map popular keywords to original local assets
        if (name.includes('acne')) return 'assets/images/acnetreatment.png';
        if (name.includes('peel')) return 'assets/images/chemicalpeel.png';
        if (name.includes('anti-aging') || name.includes('anti aging')) return 'assets/images/antiageng.png';
        if (name.includes('makeup')) return 'assets/images/makeup.png';
        if (name.includes('facial') || name.includes('microdermabrasion')) return 'https://themedermatology.com/wp-content/uploads/2024/08/dfb.png';

        return '';
    }
}
