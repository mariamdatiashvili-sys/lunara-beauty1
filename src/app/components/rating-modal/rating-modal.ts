import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../pages/services/services';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-rating-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './rating-modal.html',
    styleUrl: './rating-modal.css'
})
export class RatingModalComponent {
    auth = inject(AuthService);

    @Output() close = new EventEmitter<void>();
    @Output() submitRating = new EventEmitter<Review>();

    firstName = this.auth.currentUser()?.firstName || this.auth.currentUser()?.name || '';
    lastName = this.auth.currentUser()?.lastName || '';
    rating = 5; // Default to 5 stars
    reviewText = '';

    hoverRating = 0; // For visual hover effect on stars

    closeModal() {
        this.close.emit();
    }

    setRating(val: number) {
        this.rating = val;
    }

    submit() {
        if (!this.firstName.trim() || !this.lastName.trim()) {
            alert('Please fill out your first and last name.');
            return;
        }

        const review: Review = {
            firstName: this.firstName.trim(),
            lastName: this.lastName.trim(),
            rating: this.rating,
            text: this.reviewText.trim()
        };

        this.submitRating.emit(review);
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
