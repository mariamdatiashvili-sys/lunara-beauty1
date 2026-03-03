import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-booking-modal',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './booking-modal.html',
    styleUrl: './booking-modal.css'
})
export class BookingModalComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() serviceName = '';
    @Output() close = new EventEmitter<void>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen']) {
            if (this.isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    bookingDate = '';
    bookingTime = '';
    clientName = '';
    clientPhone = '';

    onSubmit() {
        // In a real app, this would call an API
        alert(`Booking confirmed for ${this.serviceName}!\nDate: ${this.bookingDate}\nTime: ${this.bookingTime}\nName: ${this.clientName}`);
        this.closeModal();
    }

    closeModal() {
        this.isOpen = false;
        document.body.style.overflow = '';
        this.close.emit();
    }
}
