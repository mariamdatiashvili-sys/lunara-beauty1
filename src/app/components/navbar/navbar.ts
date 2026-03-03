import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FavoritesService } from '../../services/favorites';
import { AuthModalComponent } from '../auth-modal/auth-modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AuthModalComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  auth = inject(AuthService);
  favorites = inject(FavoritesService);
  isMenuOpen = signal(false);
  showAuthModal = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  openAuthModal() {
    this.showAuthModal.set(true);
    this.closeMenu(); // Close mobile menu if open
  }

  closeAuthModal() {
    this.showAuthModal.set(false);
  }

  logout() {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e2aeb3",
      cancelButtonColor: "#333",
      confirmButtonText: "Yes, log out!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout();
        this.closeMenu();
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          confirmButtonColor: "#e2aeb3"
        });
      }
    });
  }
}
