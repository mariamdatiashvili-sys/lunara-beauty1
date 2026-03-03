import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service, Review } from '../../pages/services/services';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-service-details-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './service-details-modal.html',
    styleUrl: './service-details-modal.css'
})
export class ServiceDetailsModalComponent {
    @Input({ required: true }) service!: Service;
    @Input({ required: true }) imageUrl!: string; // The dynamically mapped image
    @Output() close = new EventEmitter<void>();
    @Output() requestRate = new EventEmitter<void>(); // Tell parent to open Rating Modal

    private cart = inject(CartService);
    public auth = inject(AuthService);

    activeTab = signal<'details' | 'reviews'>('details');

    ngOnInit() {
        console.log("Service Details opened. Current User:", this.auth.currentUser());
    }

    closeModal() {
        this.close.emit();
    }

    addToCart() {
        this.cart.addToCart(this.service.name, this.service.price);

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
            text: this.service.name
        });

        this.closeModal();
    }

    openRatingModal() {
        console.log("Requesting parent to open global Rating Modal...");
        this.requestRate.emit();
    }

    // Prevent clicks inside modal from closing it
    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
