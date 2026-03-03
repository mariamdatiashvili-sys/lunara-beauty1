import { Injectable, inject, signal, effect, computed } from '@angular/core';
import { AuthService } from './auth';

export interface FavoriteItem {
    id: string;
    name: string;
    price: number;
    image?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private auth = inject(AuthService);
    favorites = signal<FavoriteItem[]>([]);
    isOpen = signal(false);
    itemCount = computed(() => this.favorites().length);

    constructor() {
        // Load favorites when user changes
        effect(() => {
            const user = this.auth.currentUser();
            if (user && user.email) {
                const data = localStorage.getItem(`lunaraFavorites_${user.email}`);
                this.favorites.set(data ? JSON.parse(data) : []);
            } else {
                this.favorites.set([]);
            }
        }, { allowSignalWrites: true });

        // Save favorites when the favorites array changes
        effect(() => {
            const user = this.auth.currentUser();
            const favs = this.favorites(); // track favorites
            if (user && user.email) {
                localStorage.setItem(`lunaraFavorites_${user.email}`, JSON.stringify(favs));
            }
        });
    }

    toggleFavorite(service: any) {
        if (!this.auth.currentUser()) {
            return;
        }

        this.favorites.update(items => {
            const exists = items.find(item => item.id === service.id);
            if (exists) {
                return items.filter(item => item.id !== service.id);
            } else {
                return [...items, {
                    id: service.id,
                    name: service.name,
                    price: service.price,
                    image: service.image
                }];
            }
        });
    }

    isFavorite(serviceId: string): boolean {
        return this.favorites().some(item => item.id === serviceId);
    }

    removeFavorite(serviceId: string) {
        this.favorites.update(items => items.filter(item => item.id !== serviceId));
    }
}
