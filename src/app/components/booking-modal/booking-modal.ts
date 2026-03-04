import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
        Swal.fire({
            title: 'Booking Confirmed!',
            html: `Thank you, <b>${this.clientName}</b>!<br>Your booking for <b>${this.serviceName}</b> is confirmed.<br><br><b>Date:</b> ${this.bookingDate}<br><b>Time:</b> ${this.bookingTime}`,
            icon: 'success',
            confirmButtonColor: '#b75c83'
        });
        this.closeModal();
    }

    closeModal() {
        this.isOpen = false;
        document.body.style.overflow = '';
        this.close.emit();
    }
}
