import { Injectable, signal } from '@angular/core';
import { Review } from '../pages/services/services';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RatingService {
    isOpen = signal(false);

    // Track which service ID is currently being rated
    currentServiceId = signal<string | null>(null);

    // Observable to let components know when a review is submitted
    private reviewSubmittedSource = new Subject<{ review: Review, serviceId: string }>();
    reviewSubmitted$ = this.reviewSubmittedSource.asObservable();

    open(serviceId: string) {
        this.currentServiceId.set(serviceId);
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.currentServiceId.set(null);
    }

    submitRating(review: Review) {
        const serviceId = this.currentServiceId();
        if (serviceId) {
            this.reviewSubmittedSource.next({ review, serviceId });
        }
        this.close();
    }
}
