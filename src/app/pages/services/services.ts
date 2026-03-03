import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { FavoritesService } from '../../services/favorites';
import Swal from 'sweetalert2';

export interface Review {
  firstName: string;
  lastName: string;
  rating: number;
  text?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  image?: string;
  reviews?: Review[];
}

import { ServiceDetailsModalComponent } from '../../components/service-details-modal/service-details-modal';
import { AdminServiceModalComponent } from '../../components/admin-service-modal/admin-service-modal';
import { RatingService } from '../../services/rating';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceDetailsModalComponent, AdminServiceModalComponent, MatProgressSpinnerModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class ServicesComponent {
  private api = inject(ApiService);
  auth = inject(AuthService);
  private cart = inject(CartService);
  private ratingSvc = inject(RatingService);
  favoritesService = inject(FavoritesService);

  services = signal<Service[]>([]);
  isLoading = signal(true);

  // Selected Service for Details Modal
  detailedService = signal<Service | null>(null);

  // Admin Modal State
  showAdminModal = signal(false);
  editingService = signal<Service | null>(null);

  // Filters
  searchTerm = signal('');
  minPrice = signal<number>(0);
  maxPrice = signal<number>(500);
  minRating = signal<number | null>(null); // New Rating Filter

  // Slider Properties
  maxLimit = 500;
  rosePink = '#c28a8a';
  lightGrey = '#f0f0f0';

  // Auth State
  isAdmin = this.auth.isAdmin;

  handleMinChange(event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (val >= this.maxPrice()) {
      this.minPrice.set(this.maxPrice() - 10);
      (event.target as HTMLInputElement).value = this.minPrice().toString();
    } else {
      this.minPrice.set(val);
    }
  }

  handleMaxChange(event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (val <= this.minPrice()) {
      this.maxPrice.set(this.minPrice() + 10);
      (event.target as HTMLInputElement).value = this.maxPrice().toString();
    } else {
      this.maxPrice.set(val);
    }
  }

  getTrackStyle() {
    const p1 = (this.minPrice() / this.maxLimit) * 100;
    const p2 = (this.maxPrice() / this.maxLimit) * 100;
    return `linear-gradient(to right, ${this.lightGrey} ${p1}%, ${this.rosePink} ${p1}%, ${this.rosePink} ${p2}%, ${this.lightGrey} ${p2}%)`;
  }

  filteredServices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const minP = this.minPrice();
    const maxP = this.maxPrice();
    const minR = this.minRating() || 0; // Default to 0 to show all

    return this.services().filter(s => {
      const name = s.name || '';
      const desc = s.description || '';
      const matchesSearch = name.toLowerCase().includes(term) ||
        desc.toLowerCase().includes(term);

      const price = Number(s.price) || 0;
      const matchesPrice = price >= minP && price <= maxP;

      const rating = Number(s.rating) || 5.0; // Assume 5.0 if not set
      const matchesRating = rating >= minR;

      return matchesSearch && matchesPrice && matchesRating;
    });
  });

  ngOnInit() {
    this.loadServices();

    // Subscribe to global rating submissions
    this.ratingSvc.reviewSubmitted$.subscribe(({ review, serviceId }) => {
      this.handleReview(review, serviceId);
    });
  }

  constructor() {
    // this.loadServices(); // Moved to ngOnInit
  }

  loadServices() {
    this.isLoading.set(true);
    this.api.get<Service[]>('products').subscribe({
      next: (data) => {
        this.services.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load services', err);
        this.isLoading.set(false);
      }
    });
  }

  getServiceImage(service: Service): string {
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

  addToCart(service: Service) {
    this.cart.addToCart(service.name, service.price);

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: service.name
    });
  }

  // Admin Actions
  deleteService(id: string) {
    Swal.fire({
      title: 'Delete Service?',
      text: "Are you sure you want to permanently delete this service?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b75c83',
      cancelButtonColor: '#888',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete(`products/${id}`).subscribe(() => {
          this.loadServices();
          Swal.fire({
            title: 'Deleted!',
            text: 'The service has been removed.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        });
      }
    });
  }

  editService(service: Service) {
    this.editingService.set(service);
    this.showAdminModal.set(true);
  }

  saveService(serviceData: Service) {
    // If it has an ID, we update, otherwise create
    if (serviceData.id) {
      this.api.put(`products/${serviceData.id}`, serviceData).subscribe(() => {
        this.loadServices();
        this.closeAdminModal();
        Swal.fire({ icon: 'success', title: 'Service Updated', timer: 1500, showConfirmButton: false });
      });
    } else {
      // Provide a random temporary ID for MockAPI structure if necessary
      this.api.post('products', serviceData).subscribe(() => {
        this.loadServices();
        this.closeAdminModal();
        Swal.fire({ icon: 'success', title: 'Service Created', timer: 1500, showConfirmButton: false });
      });
    }
  }

  closeAdminModal() {
    this.showAdminModal.set(false);
    this.editingService.set(null);
  }

  // --- New Modal Flow ---
  openServiceDetails(service: Service) {
    this.detailedService.set(service);
  }

  closeServiceDetails() {
    this.detailedService.set(null);
  }

  openRating() {
    if (this.detailedService()) {
      this.ratingSvc.open(this.detailedService()!.id);
    }
  }

  handleReview(review: Review, serviceId: string) {
    // 1. Find the service
    const index = this.services().findIndex(s => s.id === serviceId);
    if (index === -1) return;

    // 2. Clone service & reviews array to trigger change detection
    const service = { ...this.services()[index] };
    const currentReviews = service.reviews ? [...service.reviews] : [];

    // 3. Add new review
    currentReviews.push(review);
    service.reviews = currentReviews;

    // 4. Recalculate average rating
    const totalRating = currentReviews.reduce((sum, rev) => sum + rev.rating, 0);
    service.rating = Number((totalRating / currentReviews.length).toFixed(1));

    // 5. Update local state
    const allServices = [...this.services()];
    allServices[index] = service;
    this.services.set(allServices);

    // If this is the currently expanded service, update detailed view too
    if (this.detailedService()?.id === serviceId) {
      this.detailedService.set(service);
    }

    // In a real app we would PUT/PATCH this to MockAPI,
    // but MockAPI structure doesn't support nested arrays natively without setup.
    // For now we simulate success locally.
    Swal.fire({
      icon: 'success',
      title: 'Review Submitted',
      text: 'Thank you for your feedback!'
    });
  }

  addService() {
    this.editingService.set(null);
    this.showAdminModal.set(true);
  }
}
