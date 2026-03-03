import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Banner } from './components/banner/banner';
import { Footer } from './components/footer/footer';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar';
import { RatingModalComponent } from './components/rating-modal/rating-modal';
import { FavoritesSidebarComponent } from './components/favorites-sidebar/favorites-sidebar';
import { CartService } from './services/cart';
import { RatingService } from './services/rating';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, CartSidebarComponent, Banner, RatingModalComponent, FavoritesSidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('lunara-beauty');
  cartService = inject(CartService);
  ratingService = inject(RatingService);
}
