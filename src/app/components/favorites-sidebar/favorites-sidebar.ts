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
}
